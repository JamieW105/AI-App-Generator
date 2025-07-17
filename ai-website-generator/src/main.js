/**
 * Main Application Entry Point
 */

import authService from './auth/auth-service.js';
import projectManager from './utils/project-manager.js';
import templateManager from './utils/template-manager.js';
import aiService from './utils/ai-service.js';
import editorAIBridge from './utils/editor-ai-bridge.js';
import editorUpdater from './utils/editor-updater.js';
import dbService from './utils/db-service.js';
import HTMLEditor from './components/html-editor.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize database service
    await dbService.init();
    // Check if user is logged in
    if (!authService.isLoggedIn() && !isAuthPage()) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize the appropriate page
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'index':
            initLandingPage();
            break;
        case 'login':
            initLoginPage();
            break;
        case 'signup':
            initSignupPage();
            break;
        case 'dashboard':
            initDashboardPage();
            break;
    }
});

/**
 * Get the current page name
 * @returns {string} - The page name
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || filename === '' || filename === 'index.html') {
        return 'index';
    }
    
    return filename.replace('.html', '');
}

/**
 * Check if the current page is an authentication page
 * @returns {boolean} - True if auth page, false otherwise
 */
function isAuthPage() {
    const page = getCurrentPage();
    return page === 'login' || page === 'signup';
}

/**
 * Initialize the landing page
 */
function initLandingPage() {
    console.log('Initializing landing page');
    
    // Update navigation if user is logged in
    if (authService.isLoggedIn()) {
        const user = authService.getCurrentUser();
        const navLinks = document.querySelector('.nav-links');
        
        if (navLinks) {
            // Replace login/signup with dashboard link
            navLinks.innerHTML = navLinks.innerHTML.replace(
                `<a href="login.html" class="btn btn-outline">Login</a>
                <a href="signup.html" class="btn btn-primary">Sign Up</a>`,
                `<a href="dashboard.html" class="btn btn-primary">Dashboard</a>`
            );
        }
    }
}

/**
 * Initialize the login page
 */
function initLoginPage() {
    console.log('Initializing login page');
    
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked || false;
            
            try {
                // Show loading state
                const submitButton = loginForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = 'Logging in...';
                
                // Attempt login
                const user = await authService.login(email, password);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } catch (error) {
                // Show error message
                alert(`Login failed: ${error.message}`);
                
                // Reset button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
}

/**
 * Initialize the signup page
 */
function initSignupPage() {
    console.log('Initializing signup page');
    
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms')?.checked || false;
            
            // Validate form
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!terms) {
                alert('You must agree to the terms');
                return;
            }
            
            try {
                // Show loading state
                const submitButton = signupForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = 'Creating account...';
                
                // Attempt registration
                const user = await authService.register({
                    name,
                    email,
                    password
                });
                
                // Initialize user projects
                projectManager.init(user.id);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } catch (error) {
                // Show error message
                alert(`Registration failed: ${error.message}`);
                
                // Reset button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
        
        // Password strength meter
        const passwordInput = document.getElementById('password');
        const strengthMeter = document.querySelector('.strength-meter-fill');
        const strengthText = document.querySelector('.strength-text span');
        
        if (passwordInput && strengthMeter && strengthText) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                const strength = calculatePasswordStrength(password);
                
                strengthMeter.setAttribute('data-strength', strength);
                
                const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
                strengthText.textContent = strengthLabels[Math.min(strength, 4)];
            });
        }
    }
}

/**
 * Test the connection to the AI API
 */
async function testAIConnection() {
    const aiStatus = document.getElementById('ai-status');
    if (!aiStatus) return;
    
    try {
        // Import the AI service
        const aiService = await import('./utils/ai-service.js').then(module => module.default);
        
        // Update status to testing
        aiStatus.className = 'ai-status';
        aiStatus.innerHTML = '<span>Testing AI connection...</span>';
        
        // Send a simple test message
        const response = await aiService.processMessage('test connection');
        
        if (response) {
            // Connection successful
            aiStatus.className = 'ai-status connected';
            aiStatus.innerHTML = '<span>Connected to Deepseek AI</span>';
        } else {
            // Connection failed
            aiStatus.className = 'ai-status error';
            aiStatus.innerHTML = '<span>Error connecting to AI</span>';
        }
    } catch (error) {
        console.error('AI connection test failed:', error);
        
        // Update status to error
        if (aiStatus) {
            aiStatus.className = 'ai-status error';
            aiStatus.innerHTML = '<span>Error connecting to AI: ' + error.message + '</span>';
        }
    }
}

/**
 * Initialize the dashboard page
 */
function initDashboardPage() {
    console.log('Initializing dashboard page');
    
    // Get current user
    const user = authService.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set user info in UI
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    
    if (userNameElement && user.name) {
        userNameElement.textContent = user.name;
    }
    
    if (userEmailElement && user.email) {
        userEmailElement.textContent = user.email;
    }
    
    // Initialize projects
    const projects = projectManager.init(user.id);
    
    // Initialize editors
    initEditors();
    
    // Initialize editor updater
    editorUpdater.init();
    
    // Initialize AI chat
    initAIChat();
    
    // Test AI connection
    testAIConnection();
    
    // Initialize sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Initialize tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Deactivate all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate selected tab
            this.classList.add('active');
            document.getElementById(`${tabName}-editor`).classList.add('active');
        });
    });
    
    // Initialize preview modal
    const previewToggle = document.getElementById('preview-toggle');
    const previewModal = document.getElementById('preview-modal');
    const previewCloseBtn = document.querySelector('.preview-close-btn');
    const previewFrame = document.getElementById('preview-frame');
    
    if (previewToggle && previewModal && previewCloseBtn && previewFrame) {
        previewToggle.addEventListener('click', function() {
            // Generate preview content
            const htmlContent = generatePreviewContent();
            
            // Set the iframe content
            const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            frameDoc.open();
            frameDoc.write(htmlContent);
            frameDoc.close();
            
            // Show the modal
            previewModal.classList.add('active');
        });
        
        previewCloseBtn.addEventListener('click', function() {
            previewModal.classList.remove('active');
        });
        
        // Device switching in preview
        const deviceButtons = document.querySelectorAll('.preview-device-btn');
        const frameContainer = document.querySelector('.preview-frame-container');
        
        deviceButtons.forEach(button => {
            button.addEventListener('click', function() {
                const device = this.getAttribute('data-device');
                
                // Deactivate all buttons
                deviceButtons.forEach(btn => btn.classList.remove('active'));
                
                // Activate selected button
                this.classList.add('active');
                
                // Update frame container class
                frameContainer.className = 'preview-frame-container ' + device;
            });
        });
    }
    
    // Initialize logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            await authService.logout();
            window.location.href = 'login.html';
        });
    }
}

/**
 * Initialize code editors
 */
function initEditors() {
    // In a real app, you would use a more robust code editor
    // For this prototype, we'll just use our simple HTML editor
    
    // Check if hljs is available for syntax highlighting
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}

/**
 * Initialize AI chat
 */
function initAIChat() {
    const chatInput = document.querySelector('.chat-input textarea');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatInput && sendBtn && chatMessages) {
        // Initialize the editor-AI bridge
        editorAIBridge.setHTML(document.querySelector('#html-code-editor code').textContent);
        editorAIBridge.setCSS(document.querySelector('#css-code-editor code').textContent);
        editorAIBridge.setJS(document.querySelector('#js-code-editor code').textContent);
        
        // Set up event listeners
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Visual editor element selection
        const visualEditorCanvas = document.querySelector('.visual-editor-canvas');
        if (visualEditorCanvas) {
            visualEditorCanvas.addEventListener('click', function(e) {
                // Find the closest element that can be selected
                const target = findSelectableElement(e.target);
                
                // Remove selection from all elements
                document.querySelectorAll('.selected-element').forEach(el => {
                    el.classList.remove('selected-element');
                });
                
                // Add selection to the clicked element
                if (target && !target.classList.contains('visual-editor-canvas')) {
                    target.classList.add('selected-element');
                    
                    // Update the selected element in the bridge
                    editorAIBridge.setSelectedElement(target);
                    
                    // Show a message in the AI chat about the selected element
                    addAIMessage(`You've selected a ${getElementType(target)} element. What would you like to change about it?`);
                }
            });
        }
    }
    
    // Helper functions
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addUserMessage(message);
        
        // Clear input
        chatInput.value = '';
        
        // Process the message and generate AI response
        try {
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message ai-message typing';
            typingIndicator.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingIndicator);
            scrollToBottom();
            
            // Process message through the bridge
            const response = await editorAIBridge.processMessage(message);
            
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            // Add AI response
            addAIMessage(response);
        } catch (error) {
            console.error('Error processing message:', error);
            addAIMessage('Sorry, I encountered an error while processing your request.');
        }
    }
    
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    function addAIMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai-message';
        
        // Check if the message contains code blocks
        let formattedMessage = message;
        
        // Format code blocks with syntax highlighting
        formattedMessage = formattedMessage.replace(/```html([\s\S]*?)```/g, (match, code) => {
            return `<div class="code-block html"><div class="code-header">HTML</div><pre><code class="language-html">${escapeHtml(code.trim())}</code></pre></div>`;
        });
        
        formattedMessage = formattedMessage.replace(/```css([\s\S]*?)```/g, (match, code) => {
            return `<div class="code-block css"><div class="code-header">CSS</div><pre><code class="language-css">${escapeHtml(code.trim())}</code></pre></div>`;
        });
        
        formattedMessage = formattedMessage.replace(/```javascript([\s\S]*?)```/g, (match, code) => {
            return `<div class="code-block js"><div class="code-header">JavaScript</div><pre><code class="language-javascript">${escapeHtml(code.trim())}</code></pre></div>`;
        });
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${formattedMessage}
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
        
        // Apply syntax highlighting to code blocks
        if (typeof hljs !== 'undefined') {
            messageElement.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }
    
    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

/**
 * Find a selectable element from a target
 * @param {Element} element - The target element
 * @returns {Element} - The selectable element
 */
function findSelectableElement(element) {
    // List of elements that can be selected
    const selectableElements = ['div', 'section', 'header', 'footer', 'nav', 'h1', 'h2', 'h3', 'p', 'img', 'button', 'a'];
    
    // Check if the element is directly selectable
    if (selectableElements.includes(element.tagName.toLowerCase())) {
        return element;
    }
    
    // Check parent elements
    let parent = element.parentElement;
    while (parent && !parent.classList.contains('visual-editor-canvas')) {
        if (selectableElements.includes(parent.tagName.toLowerCase())) {
            return parent;
        }
        parent = parent.parentElement;
    }
    
    // Default to the first child of the canvas if nothing else is found
    return document.querySelector('.placeholder-content');
}

/**
 * Get the type of an element
 * @param {Element} element - The element
 * @returns {string} - The element type
 */
function getElementType(element) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
        case 'div':
            if (element.classList.contains('placeholder-header')) return 'header';
            if (element.classList.contains('placeholder-hero')) return 'hero';
            if (element.classList.contains('placeholder-features')) return 'features';
            if (element.classList.contains('placeholder-feature')) return 'feature card';
            return 'container';
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return 'heading';
        case 'p':
            return 'paragraph';
        case 'img':
            return 'image';
        case 'button':
            return 'button';
        case 'a':
            return 'link';
        case 'section':
            return 'section';
        case 'header':
            return 'header';
        case 'footer':
            return 'footer';
        case 'nav':
            return 'navigation';
        default:
            return tagName;
    }
}

/**
 * Generate preview content
 * @returns {string} - HTML content for preview
 */
function generatePreviewContent() {
    // Get the current HTML, CSS, and JS content from the editors
    const htmlContent = document.querySelector('#html-code-editor code').textContent;
    const cssContent = document.querySelector('#css-code-editor code').textContent;
    const jsContent = document.querySelector('#js-code-editor code').textContent;
    
    // Combine them into a complete HTML document
    const previewContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Website Preview</title>
        <style>
            ${cssContent}
        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body>
        ${htmlContent.replace(/<!DOCTYPE html>[\s\S]*?<body>\s*/i, '').replace(/<\/body>[\s\S]*?<\/html>/i, '')}
        <script>
            ${jsContent}
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
    </body>
    </html>
    `;
    
    return previewContent;
}

/**
 * Calculate password strength
 * @param {string} password - The password
 * @returns {number} - Strength score (0-4)
 */
function calculatePasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(4, strength);
}