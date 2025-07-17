/**
 * Application Configuration
 */

const config = {
    // API Configuration
    api: {
        deepseek: {
            apiKey: 'sk-20f80c3034694891a56c24aab877da18',
            apiUrl: 'https://api.deepseek.com/v1/chat/completions',
            model: 'deepseek-chat',
            maxTokens: 10000
        },
        supabase: {
            url: 'https://wdvgmkilruvpvqxkxnmq.supabase.co',
            key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkdmdta2lscnV2cHZxeGt4bm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDU0OTIsImV4cCI6MjA2ODI4MTQ5Mn0.Lbv83Bx2RK6hoI_UETpXSwUEdlgbEzAA-omyqo2Mz6I', // Replace with actual key in production
            tables: {
                users: 'users',
                projects: 'projects',
                templates: 'templates'
            }
        }
    },
    
    // Application Settings
    app: {
        name: 'AI Website Generator',
        version: '1.0.0'
    },
    
    // Default Templates
    templates: {
        defaultTemplate: 'business'
    }
};

export default config;