# Bethesda Bible Chapel Website

A modern, responsive church website built with HTML, CSS, and JavaScript.

## Local Development Setup

### Prerequisites

- Node.js installed on your computer

### Steps to Run Locally

1. Clone or download this repository

2. Navigate to the project directory:
```bash
cd Bethesda
```

3. Start the development server:
```bash
npm run serve
```

4. Open your browser and visit:
```
http://localhost:8000
```

The server will serve the static files and allow the header/footer components to load properly.

### Stopping the Server

Press `Ctrl+C` in the terminal to stop the server.

## Project Structure

```
Bethesda/
├── index.html              # Homepage
├── pages/                  # All internal pages
├── components/             # Reusable header and footer
├── assets/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Images and icons
├── dev-server.js          # Development server
└── package.json           # NPM dependencies and scripts
```

## Making Changes

1. Edit files in your code editor
2. Save the file
3. Refresh the browser to see changes

To update navigation or footer across all pages, edit:
- `components/header.html` for navigation
- `components/footer.html` for footer

