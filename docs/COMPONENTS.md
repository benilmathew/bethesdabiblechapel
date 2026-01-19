# Component System Documentation

## Overview

The Bethesda Bible Chapel website uses a component-based architecture for the header and footer. This allows you to maintain a single source of truth for navigation and footer content across all pages.

## Component Structure

```
Bethesda/
├── components/
│   ├── header.html     # Navigation bar
│   └── footer.html     # Footer with links and contact info
├── assets/js/
│   ├── components.js   # Component loader script
│   ├── main.js         # Main site functionality
│   └── utils.js        # Utility functions
└── pages/              # All site pages use components
```

## How It Works

### 1. Component Files

**components/header.html**
- Contains the full navigation structure
- Logo, menu items, dropdowns, and CTA button
- Uses absolute paths from root (e.g., `/pages/about.html`)

**components/footer.html**
- Contains footer columns with links
- Contact information
- Social media links
- Copyright notice

### 2. Component Loading

Each HTML page includes two placeholder divs:

```html
<body>
    <!-- Header Component -->
    <div id="header-placeholder"></div>
    
    <!-- Page content here -->
    
    <!-- Footer Component -->
    <div id="footer-placeholder"></div>
    
    <script src="../assets/js/components.js"></script>
    <script src="../assets/js/main.js"></script>
</body>
```

The `components.js` script automatically:
1. Loads `header.html` and `footer.html` via fetch API
2. Injects the content into the placeholder divs
3. Updates active navigation links based on current page
4. Initializes mobile menu functionality

### 3. Automatic Features

**Active Link Highlighting**
- The current page's navigation link is automatically highlighted
- Uses the `.active` CSS class

**Mobile Menu**
- Mobile menu toggle functionality is automatically initialized
- Click outside to close feature included

**Path Detection**
- Automatically adjusts component paths based on page location
- Works for both root (`index.html`) and subdirectory pages (`pages/*.html`)

## How to Edit Components

### Updating Navigation

Edit `components/header.html`:

```html
<ul class="nav-menu">
    <li><a href="/index.html">Home</a></li>
    <li><a href="/pages/about.html">About</a></li>
    <!-- Add/edit menu items here -->
</ul>
```

Changes will instantly apply to all 12 pages!

### Updating Footer

Edit `components/footer.html`:

```html
<div class="footer-col">
    <h4>Bethesda Bible Chapel</h4>
    <p>123 Faith Avenue<br>Your City, ST 12345</p>
    <div class="footer-contact">
        <p>Phone: (555) 123-4567</p>
        <p>Email: bethesdabiblechapel@gmail.com</p>
    </div>
</div>
```

Update contact info, links, or social media in one place!

## Benefits

✅ **Single Source of Truth**
- Edit header/footer once, changes apply everywhere

✅ **Maintainability**
- Easier to update navigation structure
- Reduced code duplication
- Cleaner HTML files

✅ **Consistency**
- Ensures all pages have identical navigation
- Prevents broken links from manual edits

✅ **Flexibility**
- Easy to add new pages or menu items
- Quick to update contact information

## Adding New Pages

When creating a new page:

1. **Include the placeholders:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- head content -->
</head>
<body>
    <div id="header-placeholder"></div>
    
    <!-- Your page content -->
    
    <div id="footer-placeholder"></div>
    
    <script src="../assets/js/components.js"></script>
    <script src="../assets/js/main.js"></script>
</body>
</html>
```

2. **Add the page to navigation** in `components/header.html`

3. **That's it!** The component system handles the rest.

## Browser Compatibility

The component system uses:
- Fetch API (modern browsers)
- ES6 JavaScript features
- DOM manipulation

**Supported Browsers:**
- Chrome 42+
- Firefox 39+
- Safari 10.1+
- Edge 14+

## Testing Components

To test after making changes:

1. Open any page in the browser
2. Check that header and footer load correctly
3. Verify navigation links work
4. Test mobile menu (resize browser)
5. Confirm active link highlighting

## Troubleshooting

**Components not loading:**
- Check browser console for errors
- Verify file paths are correct
- Ensure `components.js` is included before `main.js`

**Navigation links broken:**
- Use absolute paths in `header.html` (starting with `/`)
- Check that all referenced pages exist

**Mobile menu not working:**
- Verify `main.js` is loaded after `components.js`
- Check browser console for JavaScript errors

## Future Enhancements

Possible improvements:
- Add more components (sidebar, breadcrumbs, etc.)
- Implement template engine for more complex logic
- Add loading states/transitions
- Cache components in localStorage for performance

---

**Note:** This is a static site solution. For server-side rendering or build-time component injection, consider frameworks like Next.js, Gatsby, or 11ty.
