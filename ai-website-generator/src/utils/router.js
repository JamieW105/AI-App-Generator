/**
 * Simple Router for AI Website Generator
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.notFoundHandler = () => console.error('Route not found');
    }

    /**
     * Add a route
     * @param {string} path - The route path
     * @param {Function} handler - The route handler function
     */
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    /**
     * Set the handler for 404 not found
     * @param {Function} handler - The not found handler
     */
    setNotFoundHandler(handler) {
        this.notFoundHandler = handler;
    }

    /**
     * Navigate to a route
     * @param {string} path - The route path
     * @param {Object} params - Optional parameters to pass to the handler
     */
    navigate(path, params = {}) {
        // Update URL if needed
        if (window.location.pathname !== path && !path.startsWith('#')) {
            window.history.pushState(null, null, path);
        }

        // Find and execute the route handler
        const handler = this.routes[path];
        if (handler) {
            this.currentRoute = path;
            handler(params);
        } else {
            this.notFoundHandler(path);
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
            if (e.target.tagName === 'A' && e.target.href) {
                const link = e.target;
                const url = new URL(link.href);
                
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