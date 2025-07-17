/**
 * Database Service
 * 
 * This service handles database operations using Supabase.
 */

import config from '../config.js';
import { getClient } from './supabase-client.js';

class DBService {
    constructor() {
        this.tables = config.api.supabase.tables;
        this.supabase = null;
    }

    /**
     * Initialize the database service
     */
    async init() {
        try {
            this.supabase = await getClient();
            console.log('Database service initialized with tables:', this.tables);
            return true;
        } catch (error) {
            console.error('Failed to initialize database service:', error);
            return false;
        }
    }

    /**
     * Get a user by email
     * @param {string} email - The user's email
     * @returns {Promise<Object|null>} - The user or null if not found
     */
    async getUserByEmail(email) {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.users)
                .select('*')
                .eq('email', email)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting user by email:', error);
            return null;
        }
    }

    /**
     * Create a new user
     * @param {Object} userData - The user data
     * @returns {Promise<Object|null>} - The created user or null if failed
     */
    async createUser(userData) {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.users)
                .insert([{
                    name: userData.name,
                    email: userData.email,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    /**
     * Get projects for a user
     * @param {string} userId - The user ID
     * @returns {Promise<Array|null>} - Array of projects or null if failed
     */
    async getProjects(userId) {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.projects)
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting projects:', error);
            return null;
        }
    }

    /**
     * Get a specific project
     * @param {string} projectId - The project ID
     * @returns {Promise<Object|null>} - The project or null if not found
     */
    async getProject(projectId) {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.projects)
                .select('*')
                .eq('id', projectId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting project:', error);
            return null;
        }
    }

    /**
     * Create a new project
     * @param {Object} projectData - The project data
     * @returns {Promise<Object|null>} - The created project or null if failed
     */
    async createProject(projectData) {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.projects)
                .insert([{
                    name: projectData.name,
                    description: projectData.description,
                    template: projectData.template,
                    user_id: projectData.userId,
                    html_content: projectData.htmlContent || '',
                    css_content: projectData.cssContent || '',
                    js_content: projectData.jsContent || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating project:', error);
            return null;
        }
    }

    /**
     * Update a project
     * @param {string} projectId - The project ID
     * @param {Object} projectData - The updated project data
     * @returns {Promise<Object|null>} - The updated project or null if failed
     */
    async updateProject(projectId, projectData) {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.projects)
                .update({
                    ...projectData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating project:', error);
            return null;
        }
    }

    /**
     * Delete a project
     * @param {string} projectId - The project ID
     * @returns {Promise<boolean>} - True if deleted, false if failed
     */
    async deleteProject(projectId) {
        try {
            const { error } = await this.supabase
                .from(this.tables.projects)
                .delete()
                .eq('id', projectId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting project:', error);
            return false;
        }
    }

    /**
     * Get available templates
     * @returns {Promise<Array|null>} - Array of templates or null if failed
     */
    async getTemplates() {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.templates)
                .select('*');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting templates:', error);
            return null;
        }
    }
}

// Export the service
export default new DBService();