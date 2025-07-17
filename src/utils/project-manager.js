/**
 * Project Manager - Handles user projects
 */

class ProjectManager {
    constructor() {
        // In a real app, this would connect to a database
        this.projects = {};
    }

    /**
     * Initialize the project manager with user data
     * @param {string} userId - The user ID
     */
    init(userId) {
        if (!this.projects[userId]) {
            this.projects[userId] = [];
            
            // Add a sample project for new users
            this.createProject(userId, {
                name: 'My First Website',
                description: 'A sample website to get started',
                template: 'business',
                createdAt: new Date().toISOString()
            });
        }
        
        return this.projects[userId];
    }

    /**
     * Get all projects for a user
     * @param {string} userId - The user ID
     * @returns {Array} - Array of projects
     */
    getProjects(userId) {
        return this.projects[userId] || [];
    }

    /**
     * Get a specific project
     * @param {string} userId - The user ID
     * @param {string} projectId - The project ID
     * @returns {Object|null} - The project or null if not found
     */
    getProject(userId, projectId) {
        const projects = this.getProjects(userId);
        return projects.find(project => project.id === projectId) || null;
    }

    /**
     * Create a new project
     * @param {string} userId - The user ID
     * @param {Object} projectData - The project data
     * @returns {Object} - The created project
     */
    createProject(userId, projectData) {
        if (!this.projects[userId]) {
            this.projects[userId] = [];
        }
        
        const project = {
            id: this.generateId(),
            ...projectData,
            updatedAt: new Date().toISOString()
        };
        
        this.projects[userId].push(project);
        
        // Save to localStorage for persistence in this demo
        this.saveToStorage(userId);
        
        return project;
    }

    /**
     * Update a project
     * @param {string} userId - The user ID
     * @param {string} projectId - The project ID
     * @param {Object} projectData - The updated project data
     * @returns {Object|null} - The updated project or null if not found
     */
    updateProject(userId, projectId, projectData) {
        const projects = this.getProjects(userId);
        const index = projects.findIndex(project => project.id === projectId);
        
        if (index === -1) {
            return null;
        }
        
        const updatedProject = {
            ...projects[index],
            ...projectData,
            updatedAt: new Date().toISOString()
        };
        
        projects[index] = updatedProject;
        
        // Save to localStorage for persistence in this demo
        this.saveToStorage(userId);
        
        return updatedProject;
    }

    /**
     * Delete a project
     * @param {string} userId - The user ID
     * @param {string} projectId - The project ID
     * @returns {boolean} - True if deleted, false if not found
     */
    deleteProject(userId, projectId) {
        const projects = this.getProjects(userId);
        const index = projects.findIndex(project => project.id === projectId);
        
        if (index === -1) {
            return false;
        }
        
        projects.splice(index, 1);
        
        // Save to localStorage for persistence in this demo
        this.saveToStorage(userId);
        
        return true;
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
     * Save projects to localStorage
     * @param {string} userId - The user ID
     */
    saveToStorage(userId) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`projects_${userId}`, JSON.stringify(this.projects[userId]));
        }
    }

    /**
     * Load projects from localStorage
     * @param {string} userId - The user ID
     */
    loadFromStorage(userId) {
        if (typeof localStorage !== 'undefined') {
            const projects = localStorage.getItem(`projects_${userId}`);
            if (projects) {
                this.projects[userId] = JSON.parse(projects);
            }
        }
    }
}

// Export the manager
export default new ProjectManager();