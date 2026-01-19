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
    
    // Initialize mobile menu after header is loaded
    initializeMobileMenu();
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

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = event.target.closest('.navbar');
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}
