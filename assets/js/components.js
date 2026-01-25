/**
 * Component Loader
 * Loads header and footer components into pages
 */

// Google Analytics - Replace 'GA_MEASUREMENT_ID' with your actual tracking ID
function initializeGoogleAnalytics() {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-62PVJWW6H9';
    document.head.appendChild(script1);

    // Initialize Google Analytics
    const script2 = document.createElement('script');
    script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-62PVJWW6H9');
    `;
    document.head.appendChild(script2);
}

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
    // Initialize Google Analytics
    initializeGoogleAnalytics();
    
    // Determine the correct path based on current location
    const isRootPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const pathPrefix = isRootPage ? '' : '..';
    
    // Load header and footer
    await loadComponent('header-placeholder', `${pathPrefix}/components/header.html`);
    await loadComponent('footer-placeholder', `${pathPrefix}/components/footer.html`);
    
    // Dispatch event to notify that components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
    
    // Update active nav link after header is loaded
    updateActiveNavLink();
    
    // Initialize carousel after components are loaded (only on homepage)
    if (isRootPage) {
        // Small delay to ensure DOM is fully updated
        setTimeout(() => {
            if (typeof initializeCarousel === 'function') {
                initializeCarousel();
            }
        }, 100);
    }
    
    // Note: Mobile menu is handled by main.js
});

// Update active navigation link based on current page
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        link.classList.remove('active'); // Remove active from all links first
        
        // Check if it's the homepage
        if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('index.html')) {
            if (linkPath.includes('index.html')) {
                link.classList.add('active');
            }
        } 
        // Check for other pages - match the exact page name
        else if (linkPath && linkPath !== '/index.html' && currentPath.includes(linkPath)) {
            link.classList.add('active');
        }
    });
}
