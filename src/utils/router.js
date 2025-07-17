/**
 * Simple Router for AI Website Generator
 * Modified to work with GitHub Pages
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.notFoundHandler = () => console.error('Route not found');
        this.basePath = this.getBasePath();
    }

    /**
     * Get the base path for GitHub Pages
     * @returns {string} - The base path
     */
    getBasePath() {
        // For GitHub Pages, the base path is the repository name
        // For local development, it's an empty string
        const path = window.location.pathname;
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isGitHubPages) {
            // Extract repository name from path
            const pathParts = path.split('/');
            if (pathParts.length > 1) {
                return '/' + pathParts[1]; // e.g., '/ai-website-generator'
            }
        }
        
        return '';
    }

    /**
     * Add a route
     * @param {string} path - The route path
     * @param {Function} handler - The route handler function
     */
    addRoute(path, handler) {
        // Normalize path to work with GitHub Pages
        const normalizedPath = this.normalizePath(path);
        this.routes[normalizedPath] = handler;
    }

    /**
     * Set the handler for 404 not found
     * @param {Function} handler - The not found handler
     */
    setNotFoundHandler(handler) {
        this.notFoundHandler = handler;
    }

    /**
     * Normalize a path to work with GitHub Pages
     * @param {string} path - The path to normalize
     * @returns {string} - The normalized path
     */
    normalizePath(path) {
        // Remove leading slash if present
        if (path.startsWith('/')) {
            path = path.substring(1);
        }
        
        // Handle index.html and empty path
        if (path === '' || path === 'index.html') {
            return this.basePath + '/';
        }
        
        return this.basePath + '/' + path;
    }

    /**
     * Navigate to a route
     * @param {string} path - The route path
     * @param {Object} params - Optional parameters to pass to the handler
     */
    navigate(path, params = {}) {
        // Normalize the path
        const normalizedPath = this.normalizePath(path);
        
        // Update URL if needed
        if (window.location.pathname !== normalizedPath && !normalizedPath.startsWith('#')) {
            window.history.pushState(null, null, normalizedPath);
        }

        // Find and execute the route handler
        const handler = this.routes[normalizedPath];
        if (handler) {
            this.currentRoute = normalizedPath;
            handler(params);
        } else {
            // Try to find a matching route by removing .html extension
            const pathWithoutExtension = normalizedPath.replace('.html', '');
            const handlerWithoutExtension = this.routes[pathWithoutExtension];
            
            if (handlerWithoutExtension) {
                this.currentRoute = pathWithoutExtension;
                handlerWithoutExtension(params);
            } else {
                this.notFoundHandler(normalizedPath);
            }
        }
    }

    /**
     * Initialize the router
     */
    init() {
        // Handle initial route
        const path = window.location.pathname;
        
        // Handle navigation events
        window.addEventListener('popstate', () => {
            const path = window.location.pathname;
            this.navigate(path);
        });

        // Handle link clicks
        document.addEventListener('click', (e) => {
            // Check if the click target is an anchor or a child of an anchor
            let target = e.target;
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }
            
            if (target && target.href) {
                const url = new URL(target.href);
                
                // Only handle links to the same origin
                if (url.origin === window.location.origin) {
                    e.preventDefault();
                    this.navigate(url.pathname);
                }
            }
        });

        // Navigate to initial route
        this.navigate(path);
    }
}

export default new Router();