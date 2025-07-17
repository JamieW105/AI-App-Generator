/**
 * OAuth Service for Google and GitHub authentication
 */

// OAuth configuration
const config = {
    google: {
        clientId: '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
        redirectUri: window.location.origin + '/auth-callback.html',
        scope: 'email profile',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
    },
    github: {
        clientId: 'abcdef123456789ghijkl',
        redirectUri: window.location.origin + '/auth-callback.html',
        scope: 'user:email',
        authUrl: 'https://github.com/login/oauth/authorize'
    }
};

class OAuthService {
    /**
     * Initialize OAuth service
     */
    constructor() {
        this.tokenKey = 'oauth_token';
        this.userKey = 'user';
    }

    /**
     * Start Google OAuth flow
     */
    loginWithGoogle() {
        const { clientId, redirectUri, scope, authUrl } = config.google;
        
        // Generate a random state value to prevent CSRF attacks
        const state = this.generateRandomString(16);
        localStorage.setItem('oauth_state', state);
        
        // Build the authorization URL
        const url = new URL(authUrl);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('redirect_uri', redirectUri);
        url.searchParams.append('response_type', 'token');
        url.searchParams.append('scope', scope);
        url.searchParams.append('state', state);
        
        // Redirect to Google's authorization page
        window.location.href = url.toString();
    }

    /**
     * Start GitHub OAuth flow
     */
    loginWithGithub() {
        const { clientId, redirectUri, scope, authUrl } = config.github;
        
        // Generate a random state value to prevent CSRF attacks
        const state = this.generateRandomString(16);
        localStorage.setItem('oauth_state', state);
        
        // Build the authorization URL
        const url = new URL(authUrl);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('redirect_uri', redirectUri);
        url.searchParams.append('scope', scope);
        url.searchParams.append('state', state);
        
        // Redirect to GitHub's authorization page
        window.location.href = url.toString();
    }

    /**
     * Handle the OAuth callback
     * @param {Object} params - URL parameters from the callback
     * @returns {Promise<Object>} - User data
     */
    async handleCallback(params) {
        // Verify state to prevent CSRF attacks
        const storedState = localStorage.getItem('oauth_state');
        if (params.state !== storedState) {
            throw new Error('Invalid state parameter');
        }
        
        // Clear the state from storage
        localStorage.removeItem('oauth_state');
        
        // Store the access token
        if (params.access_token) {
            localStorage.setItem(this.tokenKey, params.access_token);
            
            // Get user info based on the provider
            let userData;
            if (params.provider === 'google') {
                userData = await this.getGoogleUserInfo(params.access_token);
            } else if (params.provider === 'github') {
                userData = await this.getGithubUserInfo(params.access_token);
            }
            
            // Store user data
            if (userData) {
                localStorage.setItem(this.userKey, JSON.stringify(userData));
                return userData;
            }
        }
        
        throw new Error('Authentication failed');
    }

    /**
     * Get user info from Google
     * @param {string} token - Access token
     * @returns {Promise<Object>} - User data
     */
    async getGoogleUserInfo(token) {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to get user info');
            }
            
            const data = await response.json();
            
            return {
                id: data.sub,
                name: data.name,
                email: data.email,
                avatar: data.picture,
                provider: 'google'
            };
        } catch (error) {
            console.error('Error getting Google user info:', error);
            throw error;
        }
    }

    /**
     * Get user info from GitHub
     * @param {string} token - Access token
     * @returns {Promise<Object>} - User data
     */
    async getGithubUserInfo(token) {
        try {
            // Get user profile
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            
            if (!userResponse.ok) {
                throw new Error('Failed to get user info');
            }
            
            const userData = await userResponse.json();
            
            // Get user email (might be private)
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            
            let email = userData.email;
            
            if (emailResponse.ok) {
                const emails = await emailResponse.json();
                // Find primary email
                const primaryEmail = emails.find(e => e.primary);
                if (primaryEmail) {
                    email = primaryEmail.email;
                }
            }
            
            return {
                id: userData.id.toString(),
                name: userData.name || userData.login,
                email: email,
                avatar: userData.avatar_url,
                provider: 'github'
            };
        } catch (error) {
            console.error('Error getting GitHub user info:', error);
            throw error;
        }
    }

    /**
     * Check if user is logged in
     * @returns {boolean} - True if logged in
     */
    isLoggedIn() {
        return !!localStorage.getItem(this.userKey);
    }

    /**
     * Get current user
     * @returns {Object|null} - User data or null if not logged in
     */
    getCurrentUser() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Log out the current user
     */
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    /**
     * Generate a random string for state parameter
     * @param {number} length - Length of the string
     * @returns {string} - Random string
     */
    generateRandomString(length) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    }
}

export default new OAuthService();