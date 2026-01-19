# Setup Guide

## Initial Setup

### 1. Download and Extract
- Download the project files
- Extract to your desired location

### 2. Customize Basic Information

#### Update Site Title and Meta Tags
Edit each HTML file's `<head>` section:
```html
<title>Your Church Name - Page Title</title>
<meta name="description" content="Your church description">
```

#### Update Contact Information
Edit footer in all HTML files:
```html
<p>Your Address<br>City, State ZIP</p>
<p>Phone: Your Phone</p>
<p>Email: Your Email</p>
```

### 3. Add Your Logo
- Create or obtain your church logo
- Recommended format: SVG (scalable) or PNG (high resolution)
- Replace `assets/images/logo.svg`
- Update dimensions in CSS if needed

### 4. Customize Colors
Edit `assets/css/main.css`:
```css
:root {
    --primary-color: #YourColor;
    --secondary-color: #YourColor;
    --accent-color: #YourColor;
}
```

### 5. Add Images

#### Hero Background
- Add your hero image to `assets/images/`
- Recommended size: 1920x1080px
- Update path in `index.html` hero section

#### Sermon Images
- Add sermon thumbnails to `assets/images/sermons/`
- Recommended size: 800x600px
- Update image sources in HTML

#### Other Images
- Team photos
- Event images
- Ministry photos

### 6. Update Navigation
Customize menu items in the navigation section of each page.

## Development Setup

### Option 1: VS Code Live Server
1. Install VS Code
2. Install Live Server extension
3. Right-click `index.html` > "Open with Live Server"

### Option 2: Python Server
```bash
cd Bethesda
python -m http.server 8000
```
Visit: http://localhost:8000

### Option 3: Node.js Server
```bash
npm install -g http-server
cd Bethesda
http-server
```

## Testing

### Browser Testing
Test on:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers

### Responsive Testing
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px, 414px)

### Performance Testing
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## Optimization

### Image Optimization
Use tools like:
- TinyPNG
- ImageOptim
- Squoosh

### Code Minification
For production:
- Minify CSS
- Minify JavaScript
- Compress HTML

## Going Live

See [deployment.md](deployment.md) for hosting options and deployment steps.
