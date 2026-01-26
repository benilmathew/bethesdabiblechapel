/**
 * Cache Busting Utility
 * Adds version parameters to asset URLs to force browser cache refresh
 */

// Get the current asset version (from config.js or fallback)
function getAssetVersion() {
    return (window.APP_CONFIG && window.APP_CONFIG.ASSET_VERSION) ||
           window.ASSET_VERSION ||
           '1.0.0';
}

/**
 * Add cache busting parameter to a URL
 * @param {string} url - The original asset URL
 * @param {string} version - Optional version override
 * @returns {string} URL with cache busting parameter
 */
function addCacheBusting(url, version = null) {
    const ver = version || getAssetVersion();
    const separator = url.includes('?') ? '&' : '?';
    return url + separator + 'v=' + ver;
}

/**
 * Apply cache busting to all elements matching a selector
 * @param {string} selector - CSS selector for elements to update
 * @param {string} attribute - Attribute to update (default: 'src' or 'href')
 */
function applyCacheBusting(selector, attribute = null) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {
        const attr = attribute || (element.tagName === 'LINK' ? 'href' : 'src');
        const originalUrl = element.getAttribute(attr);

        if (originalUrl && !originalUrl.includes('?v=')) {
            element.setAttribute(attr, addCacheBusting(originalUrl));
        }
    });
}

/**
 * Initialize cache busting for common asset types
 * Call this after DOM is ready if you need dynamic cache busting
 */
function initCacheBusting() {
    // Apply to any dynamically loaded images
    applyCacheBusting('img[data-cache-bust]', 'src');

    // Apply to any dynamically loaded stylesheets
    applyCacheBusting('link[data-cache-bust]', 'href');

    // Apply to any dynamically loaded scripts
    applyCacheBusting('script[data-cache-bust]', 'src');
}

// Auto-initialize if this script is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCacheBusting);
} else {
    initCacheBusting();
}

// Export functions for module use (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAssetVersion,
        addCacheBusting,
        applyCacheBusting,
        initCacheBusting
    };
}