// Cloudflare Function: /api/contact
// Handles contact form submissions and newsletter subscriptions
import { insert, queryOne, update, jsonResponse, handleOptions, validateFields, isValidEmail } from '../utils/database.js';

// Send email using Mailchannels (free with Cloudflare Workers)
async function sendEmail(to, subject, html, env) {
    try {
        const emailPayload = {
            personalizations: [{
                to: [{ email: to }],
            }],
            from: {
                email: env.FROM_EMAIL || 'noreply@bethesdachurch.org',
                name: env.FROM_NAME || 'Bethesda Church'
            },
            subject: subject,
            content: [{
                type: 'text/html',
                value: html
            }]
        };

        const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailPayload)
        });

        if (!response.ok) {
            console.error('Email sending failed:', await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        return handleOptions();
    }

    try {
        const db = env.DB;

        // POST /api/contact/newsletter - Newsletter subscription
        if (pathname.includes('/newsletter')) {
            if (method !== 'POST') {
                return jsonResponse({ 
                    success: false, 
                    message: 'Method not allowed' 
                }, 405);
            }

            const body = await request.json();
            const { email, firstName, lastName } = body;

            // Validate email
            if (!email || !isValidEmail(email)) {
                return jsonResponse({
                    success: false,
                    errors: ['Valid email is required']
                }, 400);
            }

            // Check if already subscribed
            const existing = await queryOne(
                db,
                'SELECT * FROM newsletter_subscribers WHERE email = ?',
                [email]
            );

            if (existing) {
                if (existing.status === 'subscribed') {
                    return jsonResponse({
                        success: false,
                        message: 'This email is already subscribed to our newsletter.'
                    }, 400);
                } else {
                    // Resubscribe
                    await update(
                        db,
                        'UPDATE newsletter_subscribers SET status = "subscribed", subscribed_at = datetime("now") WHERE email = ?',
                        [email]
                    );
                }
            } else {
                // New subscription
                await insert(
                    db,
                    'INSERT INTO newsletter_subscribers (email, first_name, last_name, subscribed_at) VALUES (?, ?, ?, datetime("now"))',
                    [email, firstName || null, lastName || null]
                );
            }

            // Send welcome email
            const siteName = env.SITE_NAME || 'Bethesda Bible Chapel';
            const mailHtml = `
                <h2>Welcome to Our Newsletter!</h2>
                <p>Dear ${firstName || 'Friend'},</p>
                <p>Thank you for subscribing to our newsletter. You'll now receive updates about:</p>
                <ul>
                    <li>Upcoming events and services</li>
                    <li>New sermon series</li>
                    <li>Community news and announcements</li>
                    <li>Ways to get involved</li>
                </ul>
                <p>Blessings,<br>
                ${siteName} Team</p>
                <hr>
                <p><small>You can unsubscribe at any time by clicking the unsubscribe link in our emails.</small></p>
            `;

            // Send welcome email (with error logging)
            sendEmail(email, `Welcome to ${siteName} Newsletter`, mailHtml, env)
                .then(success => {
                    if (!success) {
                        console.warn('Failed to send welcome email to:', email);
                    }
                })
                .catch(err => {
                    console.error('Error sending welcome email:', err);
                });

            return jsonResponse({
                success: true,
                message: 'Thank you for subscribing to our newsletter!'
            });
        }

        // POST /api/contact - Submit contact form
        if (method !== 'POST') {
            return jsonResponse({ 
                success: false, 
                message: 'Method not allowed' 
            }, 405);
        }

        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // Validate required fields
        const validationErrors = validateFields(body, ['name', 'email', 'message']);
        
        if (!isValidEmail(email)) {
            validationErrors.push('Valid email is required');
        }

        if (validationErrors.length > 0) {
            return jsonResponse({
                success: false,
                errors: validationErrors
            }, 400);
        }

        // Save to database
        const insertId = await insert(
            db,
            `INSERT INTO contact_submissions (name, email, phone, subject, message, submitted_at) 
             VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [name, email, phone || null, subject || 'General Inquiry', message]
        );

        const siteName = env.SITE_NAME || 'Bethesda Bible Chapel';
        const contactEmail = env.CONTACT_EMAIL || 'bethesdabiblechapel@gmail.com';

        // Send email notification to church
        const notificationHtml = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
        `;

        // Send confirmation email to user
        const confirmationHtml = `
            <h2>Thank you for contacting ${siteName}!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p>Blessings,<br>
            ${siteName} Team</p>
        `;

        // Send emails asynchronously (with error handling for monitoring)
        Promise.allSettled([
            sendEmail(contactEmail, `New Contact Form Submission: ${subject || 'General Inquiry'}`, notificationHtml, env),
            sendEmail(email, 'Thank you for contacting us', confirmationHtml, env)
        ]).then(results => {
            results.forEach((result, index) => {
                const emailType = index === 0 ? 'notification' : 'confirmation';
                if (result.status === 'rejected') {
                    console.error(`Error sending ${emailType} email:`, result.reason);
                } else if (!result.value) {
                    console.warn(`Failed to send ${emailType} email (no error thrown)`);
                }
            });
        });

        return jsonResponse({
            success: true,
            message: 'Thank you for your message. We\'ll get back to you soon!',
            id: insertId
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        return jsonResponse({
            success: false,
            message: 'An error occurred. Please try again later.'
        }, 500);
    }
}
