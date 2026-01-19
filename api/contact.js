const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const db = require('./database');
require('dotenv').config();

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// POST /api/contact - Submit contact form
router.post('/',
    // Validation middleware
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').optional().trim(),
        body('subject').optional().trim(),
        body('message').trim().notEmpty().withMessage('Message is required')
    ],
    async (req, res) => {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => err.msg)
            });
        }

        try {
            const { name, email, phone, subject, message } = req.body;

            // Save to database
            const insertId = await db.insert(
                `INSERT INTO contact_submissions (name, email, phone, subject, message, submitted_at) 
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [name, email, phone || null, subject || 'General Inquiry', message]
            );

            // Send email notification to church
            const mailOptions = {
                from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
                to: process.env.CONTACT_EMAIL,
                subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
                `
            };

            // Send confirmation email to user
            const confirmationMailOptions = {
                from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
                to: email,
                subject: 'Thank you for contacting us',
                html: `
                    <h2>Thank you for contacting ${process.env.SITE_NAME}!</h2>
                    <p>Dear ${name},</p>
                    <p>We have received your message and will get back to you as soon as possible.</p>
                    <p><strong>Your Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p>Blessings,<br>
                    ${process.env.SITE_NAME} Team</p>
                `
            };

            // Send emails (don't wait for completion)
            transporter.sendMail(mailOptions).catch(err => 
                console.error('Error sending notification email:', err)
            );
            
            transporter.sendMail(confirmationMailOptions).catch(err => 
                console.error('Error sending confirmation email:', err)
            );

            res.json({
                success: true,
                message: 'Thank you for your message. We\'ll get back to you soon!',
                id: insertId
            });

        } catch (error) {
            console.error('Error processing contact form:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred. Please try again later.'
            });
        }
    }
);

// POST /api/contact/newsletter - Newsletter subscription
router.post('/newsletter',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('firstName').optional().trim(),
        body('lastName').optional().trim()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => err.msg)
            });
        }

        try {
            const { email, firstName, lastName } = req.body;

            // Check if already subscribed
            const existing = await db.queryOne(
                'SELECT * FROM newsletter_subscribers WHERE email = ?',
                [email]
            );

            if (existing) {
                if (existing.status === 'subscribed') {
                    return res.status(400).json({
                        success: false,
                        message: 'This email is already subscribed to our newsletter.'
                    });
                } else {
                    // Resubscribe
                    await db.update(
                        'UPDATE newsletter_subscribers SET status = "subscribed", subscribed_at = NOW() WHERE email = ?',
                        [email]
                    );
                }
            } else {
                // New subscription
                await db.insert(
                    'INSERT INTO newsletter_subscribers (email, first_name, last_name, subscribed_at) VALUES (?, ?, ?, NOW())',
                    [email, firstName || null, lastName || null]
                );
            }

            // Send welcome email
            const mailOptions = {
                from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
                to: email,
                subject: `Welcome to ${process.env.SITE_NAME} Newsletter`,
                html: `
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
                    ${process.env.SITE_NAME} Team</p>
                    <hr>
                    <p><small>You can unsubscribe at any time by clicking the unsubscribe link in our emails.</small></p>
                `
            };

            transporter.sendMail(mailOptions).catch(err => 
                console.error('Error sending welcome email:', err)
            );

            res.json({
                success: true,
                message: 'Thank you for subscribing to our newsletter!'
            });

        } catch (error) {
            console.error('Error processing newsletter subscription:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred. Please try again later.'
            });
        }
    }
);

module.exports = router;
