// ====================================
// API Integration Examples
// ====================================

// Base API URL (change in production)
const API_URL = window.location.origin + '/api';

// ====================================
// Sermons API
// ====================================

// Fetch all sermons
async function fetchSermons(page = 1, limit = 10) {
    try {
        const response = await fetch(`${API_URL}/sermons?page=${page}&limit=${limit}`);
        const data = await response.json();
        
        if (data.success) {
            return data;
        } else {
            throw new Error('Failed to fetch sermons');
        }
    } catch (error) {
        console.error('Error fetching sermons:', error);
        return null;
    }
}

// Fetch latest sermon
async function fetchLatestSermon() {
    try {
        const response = await fetch(`${API_URL}/sermons/featured/latest`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
    } catch (error) {
        console.error('Error fetching latest sermon:', error);
        return null;
    }
}

// Display sermons on page
async function displaySermons() {
    const sermonsData = await fetchSermons(1, 6);
    
    if (!sermonsData || !sermonsData.data) {
        console.log('No sermons available');
        return;
    }

    const container = document.querySelector('.sermons-container');
    if (!container) return;

    container.innerHTML = sermonsData.data.map(sermon => `
        <div class="sermon-card">
            <img src="${sermon.image_url || 'assets/images/sermons/default.jpg'}" alt="${sermon.title}">
            <div class="sermon-info">
                <h3>${sermon.title}</h3>
                <p class="sermon-meta">${formatDate(sermon.date)} | ${sermon.speaker}</p>
                <p>${sermon.description || ''}</p>
                <div class="sermon-actions">
                    ${sermon.audio_url ? `<a href="${sermon.audio_url}" class="btn btn-primary">Listen</a>` : ''}
                    ${sermon.video_url ? `<a href="${sermon.video_url}" class="btn btn-outline">Watch</a>` : ''}
                    ${sermon.notes_url ? `<a href="${sermon.notes_url}" class="btn btn-outline">Notes</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// ====================================
// Events API
// ====================================

// Fetch upcoming events
async function fetchUpcomingEvents(limit = 3) {
    try {
        const response = await fetch(`${API_URL}/events?type=upcoming`);
        const data = await response.json();
        
        if (data.success) {
            return data.data.slice(0, limit);
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

// Display events on page
async function displayEvents() {
    const events = await fetchUpcomingEvents(3);
    
    if (!events || events.length === 0) {
        console.log('No upcoming events');
        return;
    }

    const container = document.querySelector('.events-container');
    if (!container) return;

    container.innerHTML = events.map(event => {
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();

        return `
            <div class="event-card">
                <div class="event-date">
                    <span class="date-day">${day}</span>
                    <span class="date-month">${month}</span>
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <p class="event-time">${formatTime(event.start_time)} - ${formatTime(event.end_time)}</p>
                    <p>${event.description || ''}</p>
                    ${event.location ? `<p class="event-location">📍 ${event.location}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ====================================
// Contact Form
// ====================================

// Submit contact form
async function submitContactForm(formData) {
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return {
            success: false,
            message: 'An error occurred. Please try again.'
        };
    }
}

// Handle contact form submission
function setupContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            phone: form.querySelector('[name="phone"]')?.value || '',
            subject: form.querySelector('[name="subject"]')?.value || '',
            message: form.querySelector('[name="message"]').value
        };

        // Show loading state
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const result = await submitContactForm(formData);

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        if (result.success) {
            // Show success message
            showNotification(result.message, 'success');
            form.reset();
        } else {
            // Show error message
            const errors = result.errors ? result.errors.join(', ') : result.message;
            showNotification(errors, 'error');
        }
    });
}

// ====================================
// Newsletter Subscription
// ====================================

// Subscribe to newsletter
async function subscribeNewsletter(email, firstName = '', lastName = '') {
    try {
        const response = await fetch(`${API_URL}/contact/newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, firstName, lastName })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        return {
            success: false,
            message: 'An error occurred. Please try again.'
        };
    }
}

// Handle newsletter form
function setupNewsletterForm() {
    const form = document.querySelector('#newsletter-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.querySelector('[name="email"]').value;
        const firstName = form.querySelector('[name="firstName"]')?.value || '';
        const lastName = form.querySelector('[name="lastName"]')?.value || '';

        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        const result = await subscribeNewsletter(email, firstName, lastName);

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        if (result.success) {
            showNotification(result.message, 'success');
            form.reset();
        } else {
            const errors = result.errors ? result.errors.join(', ') : result.message;
            showNotification(errors, 'error');
        }
    });
}

// ====================================
// Ministries API
// ====================================

// Fetch ministries
async function fetchMinistries() {
    try {
        const response = await fetch(`${API_URL}/ministries`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
    } catch (error) {
        console.error('Error fetching ministries:', error);
        return [];
    }
}

// ====================================
// Utility Functions
// ====================================

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Show notification (reusing from utils.js)
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ====================================
// Initialize on Page Load
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if API is available
    fetch(`${API_URL}/health`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'OK') {
                console.log('✅ API is connected');
                
                // Initialize dynamic content
                if (document.querySelector('.sermons-container')) {
                    displaySermons();
                }
                
                if (document.querySelector('.events-container')) {
                    displayEvents();
                }
                
                // Setup forms
                setupContactForm();
                setupNewsletterForm();
            }
        })
        .catch(err => {
            console.log('ℹ️ Running in static mode (no API connection)');
            // Site still works with static content
        });
});

// ====================================
// Example Usage in HTML
// ====================================

/*
<!-- Add containers in your HTML -->

<!-- Sermons Section -->
<section class="sermons-section">
    <div class="container">
        <h2>Latest Sermons</h2>
        <div class="sermons-container">
            <!-- Sermons will be loaded here dynamically -->
        </div>
    </div>
</section>

<!-- Events Section -->
<section class="events-section">
    <div class="container">
        <h2>Upcoming Events</h2>
        <div class="events-container">
            <!-- Events will be loaded here dynamically -->
        </div>
    </div>
</section>

<!-- Contact Form -->
<form id="contact-form">
    <input type="text" name="name" required placeholder="Your Name">
    <input type="email" name="email" required placeholder="Your Email">
    <input type="tel" name="phone" placeholder="Phone (optional)">
    <input type="text" name="subject" placeholder="Subject">
    <textarea name="message" required placeholder="Your Message"></textarea>
    <button type="submit" class="btn btn-primary">Send Message</button>
</form>

<!-- Newsletter Form -->
<form id="newsletter-form">
    <input type="email" name="email" required placeholder="Your Email">
    <input type="text" name="firstName" placeholder="First Name (optional)">
    <button type="submit" class="btn btn-primary">Subscribe</button>
</form>

<!-- Include this script -->
<script src="assets/js/api-integration.js"></script>
*/
