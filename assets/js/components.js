/**
 * Component Loader
 * Loads header and footer components into pages
 */

// Load component from file
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Determine the correct path based on current location
    const isRootPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const pathPrefix = isRootPage ? '' : '..';
    
    // Load header and footer
    await loadComponent('header-placeholder', `${pathPrefix}/components/header.html`);
    await loadComponent('footer-placeholder', `${pathPrefix}/components/footer.html`);
    
    // Update active nav link after header is loaded
    updateActiveNavLink();
    
    // Note: Mobile menu is handled by main.js
});

// Update active navigation link based on current page
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== '/index.html') {
            link.classList.add('active');
        } else if (currentPath === '/' || currentPath.endsWith('index.html')) {
            if (linkPath === '/index.html') {
                link.classList.add('active');
            }
        }
    });
}
