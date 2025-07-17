/**
 * Authentication Service
 * 
 * This service handles user authentication.
 * In a real application, this would connect to a backend authentication service.
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.storageKey = 'auth_user';
        
        // Initialize from localStorage if available
        this.loadFromStorage();
    }
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - The registered user
     */
    async register(userData) {
        // Simulate API call
        await this.delay(1000);
        
        // Check if email already exists
        const existingUsers = this.getStoredUsers();
        if (existingUsers.find(user => user.email === userData.email)) {
            throw new Error('Email already in use');
        }
        
        // Create new user
        const newUser = {
            id: this.generateId(),
            name: userData.name,
            email: userData.email,
            createdAt: new Date().toISOString()
        };
        
        // Store password (in a real app, this would be hashed)
        this.storeUserPassword(newUser.id, userData.password);
        
        // Add to stored users
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Set as current user
        this.setCurrentUser(newUser);
        
        return newUser;
    }
    
    /**
     * Log in a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} - The logged in user
     */
    async login(email, password) {
        // Simulate API call
        await this.delay(1000);
        
        // Find user by email
        const existingUsers = this.getStoredUsers();
        const user = existingUsers.find(user => user.email === email);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Check password (in a real app, this would compare hashed passwords)
        const storedPassword = this.getUserPassword(user.id);
        if (storedPassword !== password) {
            throw new Error('Invalid password');
        }
        
        // Set as current user
        this.setCurrentUser(user);
        
        return user;
    }
    
    /**
     * Log out the current user
     * @returns {Promise<void>}
     */
    async logout() {
        // Simulate API call
        await this.delay(500);
        
        // Clear current user
        this.currentUser = null;
        localStorage.removeItem(this.storageKey);
    }
    
    /**
     * Get the current user
     * @returns {Object|null} - The current user or null if not logged in
     */
    getCurrentUser() {
        return this.currentUser;
    }
    
    /**
     * Check if a user is logged in
     * @returns {boolean} - True if logged in, false otherwise
     */
    isLoggedIn() {
        return !!this.currentUser;
    }
    
    /**
     * Set the current user and save to storage
     * @param {Object} user - The user to set as current
     */
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem(this.storageKey, JSON.stringify(user));
    }
    
    /**
     * Load the current user from storage
     */
    loadFromStorage() {
        const storedUser = localStorage.getItem(this.storageKey);
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                this.currentUser = null;
            }
        }
    }
    
    /**
     * Get all stored users
     * @returns {Array} - Array of users
     */
    getStoredUsers() {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            try {
                return JSON.parse(storedUsers);
            } catch (error) {
                console.error('Error parsing stored users:', error);
                return [];
            }
        }
        return [];
    }
    
    /**
     * Store a user's password
     * @param {string} userId - The user ID
     * @param {string} password - The password to store
     */
    storeUserPassword(userId, password) {
        // In a real app, passwords would be hashed and stored securely
        const passwords = this.getStoredPasswords();
        passwords[userId] = password;
        localStorage.setItem('user_passwords', JSON.stringify(passwords));
    }
    
    /**
     * Get a user's password
     * @param {string} userId - The user ID
     * @returns {string|null} - The password or null if not found
     */
    getUserPassword(userId) {
        const passwords = this.getStoredPasswords();
        return passwords[userId] || null;
    }
    
    /**
     * Get all stored passwords
     * @returns {Object} - Object mapping user IDs to passwords
     */
    getStoredPasswords() {
        const storedPasswords = localStorage.getItem('user_passwords');
        if (storedPasswords) {
            try {
                return JSON.parse(storedPasswords);
            } catch (error) {
                console.error('Error parsing stored passwords:', error);
                return {};
            }
        }
        return {};
    }
    
    /**
     * Generate a unique ID
     * @returns {string} - A unique ID
     */
    generateId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    /**
     * Create a delay using a promise
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Promise that resolves after the delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export the service
export default new AuthService();