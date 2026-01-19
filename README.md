# Bethesda Church Website

A modern, responsive church website built with HTML, CSS, and JavaScript following web design best practices.

## 🌟 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design inspired by contemporary church websites
- **Fast Loading**: Optimized images and code for quick page loads
- **SEO Friendly**: Semantic HTML and proper meta tags
- **Accessible**: WCAG compliant with proper ARIA labels
- **Easy to Customize**: Well-organized code structure

## 📁 Project Structure

```
Bethesda/
├── index.html                 # Homepage
├── pages/                     # Internal pages
│   ├── about.html            # About page
│   ├── team.html             # Team/Staff page
│   ├── beliefs.html          # Beliefs/Doctrine page
│   ├── sermons.html          # Sermons library
│   ├── live.html             # Live stream page
│   ├── media.html            # Media library
│   ├── events.html           # Events calendar
│   ├── ministries.html       # Ministries overview
│   ├── volunteer.html        # Volunteer opportunities
│   ├── visit.html            # Plan your visit
│   └── contact.html          # Contact page
├── assets/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   └── responsive.css    # Responsive styles
│   ├── js/
│   │   ├── main.js           # Main JavaScript
│   │   └── utils.js          # Utility functions
│   ├── images/
│   │   ├── logo.svg          # Site logo
│   │   ├── hero-bg.jpg       # Hero background
│   │   ├── phone-mockup.png  # App mockup
│   │   ├── app-store.svg     # App Store badge
│   │   ├── google-play.svg   # Google Play badge
│   │   ├── icons/            # Icon files
│   │   └── sermons/          # Sermon images
│   ├── fonts/                # Custom fonts (if any)
│   └── videos/               # Video files
├── api/                      # API endpoints (for future dynamic features)
│   ├── config.php            # Database configuration
│   ├── sermons.php           # Sermons API
│   ├── events.php            # Events API
│   └── contact.php           # Contact form handler
├── includes/                 # Reusable components (for PHP/dynamic version)
│   ├── header.php
│   ├── footer.php
│   └── navigation.php
├── admin/                    # Admin panel (for future CMS)
│   └── index.html
├── docs/                     # Documentation
│   ├── setup.md
│   └── deployment.md
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- A local web server (optional for development)
  - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension
  - Python: `python -m http.server 8000`
  - PHP: `php -S localhost:8000`

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. For development, use a local server

### Using Live Server (VS Code)

1. Install the Live Server extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎨 Customization

### Colors

Edit the CSS variables in `assets/css/main.css`:

```css
:root {
    --primary-color: #2c5f8d;
    --secondary-color: #1a3a52;
    --accent-color: #e67e22;
    /* ... */
}
```

### Logo

Replace `assets/images/logo.svg` with your church logo (recommended: SVG format for scalability)

### Images

Add your images to the appropriate folders in `assets/images/`:
- Hero background: Replace `hero-bg.jpg`
- Sermon images: Add to `sermons/` folder
- Icons: Add custom icons to `icons/` folder

### Content

- Homepage: Edit `index.html`
- Internal pages: Edit files in `pages/` folder
- Navigation: Update nav menu in each HTML file

## 🌐 Deployment

### Static Hosting

This site can be deployed to any static hosting service:

- **Netlify**: Drag and drop the folder or connect to Git
- **Vercel**: Import from Git repository
- **GitHub Pages**: Push to GitHub and enable Pages
- **AWS S3**: Upload to S3 bucket with static hosting enabled
- **Traditional Hosting**: Upload via FTP to your web host

### Steps for Netlify (Recommended)

1. Sign up at [netlify.com](https://www.netlify.com)
2. Drag and drop the Bethesda folder
3. Your site will be live in seconds!

## 🔄 Using the Node.js Backend

The project includes a complete Node.js backend with API endpoints!

### Quick Start

1. **Install Node.js dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
copy .env.example .env
# Edit .env with your database credentials
```

3. **Setup MySQL database**:
```bash
mysql -u root -p < api/database.sql
```

4. **Start the server**:
```bash
npm run dev
```

Visit: http://localhost:3000

### Available API Endpoints

- **Sermons**: `/api/sermons` - Get all sermons with pagination
- **Events**: `/api/events` - Get upcoming/past events
- **Contact**: `/api/contact` - Handle contact form submissions
- **Ministries**: `/api/ministries` - Get church ministries

See `docs/nodejs-setup.md` for complete backend documentation.

### Dynamic Features Included

- ✅ Sermon management API
- ✅ Event calendar API
- ✅ Contact form with email notifications
- ✅ Newsletter subscription
- ✅ MySQL database integration
- ✅ Email sending (Nodemailer)
- ✅ Request validation
- ✅ Security headers (Helmet)

## 📱 Features to Implement

- [ ] Sermon audio/video player
- [ ] Event registration system
- [ ] Contact form with email
- [ ] Newsletter signup
- [ ] Online giving integration
- [ ] Member login portal
- [ ] Blog/news section
- [ ] Photo gallery
- [ ] Prayer request form
- [ ] Small groups directory

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Interactive features (ES6+)
- **Google Fonts**: Typography (Montserrat, Open Sans)

### Backend (Optional)
- **Node.js**: Server runtime
- **Express**: Web framework
- **MySQL**: Database
- **Nodemailer**: Email functionality

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available for use by churches and religious organizations.

## 🤝 Contributing

Feel free to fork this project and customize it for your church!

## 📞 Support

For questions or support, please open an issue in the repository.

## 🙏 Acknowledgments

Design inspired by modern church websites and best practices in web development.

---

**Built with ❤️ for the Church**
