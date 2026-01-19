# 🚀 Quick Start Guide - Bethesda Church Website

## Overview
Your church website is now built with:
- ✅ **Frontend**: HTML, CSS, JavaScript (static files)
- ✅ **Backend**: Node.js + Express (API server)
- ✅ **Database**: MySQL (data storage)

## 🎯 Two Ways to Use This Project

### Option 1: Static Site Only (No Backend Needed)
Just open `index.html` in your browser - everything works!

### Option 2: Full Stack with Node.js Backend
Get dynamic features like sermon management, contact forms, and more.

---

## 🏃 Getting Started with Node.js Backend

### Step 1: Install Node.js
Download and install from: https://nodejs.org/ (LTS version recommended)

Verify installation:
```powershell
node --version
npm --version
```

### Step 2: Install Project Dependencies
Open PowerShell in the Bethesda folder:
```powershell
cd c:\Users\benil\OneDrive\Documents\Code\Bethesda
npm install
```

This installs:
- Express (web server)
- MySQL2 (database driver)
- Nodemailer (email sending)
- And more...

### Step 3: Setup MySQL Database

**If you don't have MySQL:**
1. Download from: https://dev.mysql.com/downloads/mysql/
2. Or use XAMPP: https://www.apachefriends.org/

**Create the database:**
```powershell
# Open MySQL command line or phpMyAdmin
mysql -u root -p

# Then run:
source c:\Users\benil\OneDrive\Documents\Code\Bethesda\api\database.sql

# Or in phpMyAdmin: Import the database.sql file
```

### Step 4: Configure Environment Variables
```powershell
# Copy the example file
copy .env.example .env

# Edit .env with Notepad or VS Code
notepad .env
```

Update these values:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bethesda_church

SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
CONTACT_EMAIL=bethesdabiblechapel@gmail.com
```

### Step 5: Start the Server!
```powershell
# Development mode (auto-reload on changes)
npm run dev

# Or production mode
npm start
```

You'll see:
```
🚀 Bethesda Church website running on http://localhost:3000
📝 Environment: development
✅ Database connected successfully
```

### Step 6: Open in Browser
Visit: **http://localhost:3000**

---

## 📡 API Endpoints Ready to Use

Once the server is running, you can access:

### Sermons
```javascript
// Get all sermons
fetch('http://localhost:3000/api/sermons')
  .then(res => res.json())
  .then(data => console.log(data));

// Get latest sermon
fetch('http://localhost:3000/api/sermons/featured/latest')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Events
```javascript
// Get upcoming events
fetch('http://localhost:3000/api/events?type=upcoming')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Contact Form
```javascript
// Submit contact form
fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📁 Project Structure

```
Bethesda/
├── 🌐 index.html           # Homepage (open this for static site)
├── 📦 package.json         # Node.js dependencies
├── ⚙️ server.js            # Express server
├── 🔐 .env.example         # Environment template
│
├── 📁 api/                 # Backend API
│   ├── database.js        # Database connection
│   ├── database.sql       # Database schema
│   ├── sermons.js         # Sermons API
│   ├── events.js          # Events API
│   ├── contact.js         # Contact form handler
│   └── ministries.js      # Ministries API
│
├── 📁 assets/             # Static files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript
│   └── images/           # Images & icons
│
├── 📁 pages/              # Internal pages
│   └── about.html        # Example page
│
└── 📁 docs/               # Documentation
    ├── setup.md
    ├── deployment.md
    └── nodejs-setup.md   # 👈 Detailed Node.js guide
```

---

## ✅ What's Already Working

### Frontend (Static)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Navigation with dropdowns
- ✅ Hero section with CTAs
- ✅ Section layouts (sermons, events, ministries)
- ✅ Contact information & social links
- ✅ Smooth animations

### Backend (Node.js + MySQL)
- ✅ Express server configured
- ✅ MySQL database schema ready
- ✅ API routes for sermons, events, contact
- ✅ Email notifications (Nodemailer)
- ✅ Input validation
- ✅ Security headers (Helmet)
- ✅ CORS enabled
- ✅ Sample data included

---

## 🔧 Common Tasks

### View Without Node.js
```powershell
# Just double-click index.html
# Or right-click → Open with → Chrome/Firefox
explorer index.html
```

### Start Development Server
```powershell
npm run dev
```

### Stop the Server
Press `Ctrl + C` in the terminal

### Check Server Status
Visit: http://localhost:3000/api/health

### View Database
```powershell
mysql -u root -p
USE bethesda_church;
SHOW TABLES;
SELECT * FROM sermons;
```

---

## 🎨 Customization

### Change Colors
Edit `assets/css/main.css`:
```css
:root {
    --primary-color: #2c5f8d;
    --secondary-color: #1a3a52;
    --accent-color: #e67e22;
}
```

### Update Content
- Church name: Search and replace "Bethesda" in all files
- Logo: Replace `assets/images/logo.svg`
- Images: Add to `assets/images/`

### Add Pages
1. Copy `pages/about.html`
2. Rename and edit content
3. Update navigation links

---

## 🚀 Deployment Options

### Static Site (No Backend)
- **Netlify**: Drag & drop the folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Push to repo, enable Pages

### Full Stack (With Backend)
- **Heroku**: Node.js + MySQL
- **DigitalOcean**: VPS with Node.js
- **AWS**: EC2 + RDS
- **Railway**: Modern deployment platform

See `docs/deployment.md` for detailed instructions.

---

## 🆘 Troubleshooting

### "npm: command not found"
→ Install Node.js from https://nodejs.org/

### "Cannot find module..."
→ Run `npm install`

### "Port 3000 already in use"
→ Change PORT in .env: `PORT=3001`

### "Database connection failed"
→ Check MySQL is running
→ Verify credentials in .env

### "Email not sending"
→ Use Gmail App Password (not regular password)
→ Enable 2FA on Google Account
→ Generate App Password in Security settings

---

## 📚 Documentation

- **Quick Start**: You're reading it! 👋
- **Detailed Node.js Setup**: `docs/nodejs-setup.md`
- **Deployment Guide**: `docs/deployment.md`
- **General Info**: `README.md`

---

## 🎯 Next Steps

### For Static Site Only:
1. ✅ Customize content (church name, contact info)
2. ✅ Add your images
3. ✅ Update colors in CSS
4. ✅ Deploy to Netlify/Vercel

### For Full Stack:
1. ✅ Install dependencies: `npm install`
2. ✅ Setup MySQL database
3. ✅ Configure .env file
4. ✅ Start server: `npm run dev`
5. ✅ Test API endpoints
6. ✅ Integrate frontend with API
7. ✅ Deploy to hosting platform

---

## 💡 Pro Tips

1. **Development**: Use `npm run dev` for auto-reload
2. **Testing**: Use Postman or browser DevTools to test APIs
3. **Version Control**: Initialize git repo: `git init`
4. **Security**: Never commit `.env` file (already in .gitignore)
5. **Performance**: Images should be compressed (use TinyPNG)

---

## 🤝 Need Help?

1. Check the docs in `docs/` folder
2. Review code comments
3. Test API with: http://localhost:3000/api/health
4. Check server logs in terminal

---

**You're all set! 🎉**

Choose your path:
- **Just browsing?** Open `index.html`
- **Ready for backend?** Run `npm install` then `npm run dev`
- **Deploy now?** Check `docs/deployment.md`

Happy building! 🏗️✨
