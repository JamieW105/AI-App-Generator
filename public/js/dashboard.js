document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Set user info
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    if (userNameElement && user.name) {
        userNameElement.textContent = user.name;
    }
    if (userEmailElement && user.email) {
        userEmailElement.textContent = user.email;
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Tab switching
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

    // Preview toggle
    const previewToggle = document.getElementById('preview-toggle');
    const previewModal = document.getElementById('preview-modal');
    const previewCloseBtn = document.querySelector('.preview-close-btn');
    const previewFrame = document.getElementById('preview-frame');
    
    if (previewToggle && previewModal && previewCloseBtn && previewFrame) {
        previewToggle.addEventListener('click', function() {
            // Generate preview content from the current editor state
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

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    // Initialize code editors with syntax highlighting
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }

    // AI Chat functionality
    const chatInput = document.querySelector('.chat-input textarea');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatInput && sendBtn && chatMessages) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

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
                
                // Show a message in the AI chat about the selected element
                addAIMessage(`You've selected a ${getElementType(target)} element. What would you like to change about it?`);
            }
        });
    }

    // Publish button
    const publishBtn = document.getElementById('publish-btn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            // Show a confirmation dialog
            if (confirm('Are you sure you want to publish your website?')) {
                // Simulate publishing process
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Publishing...</span>';
                
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> <span>Publish</span>';
                    
                    // Show success message
                    alert('Your website has been published successfully!');
                    
                    // In a real app, this would redirect to the published site
                    // window.open('https://your-published-site.com', '_blank');
                }, 2000);
            }
        });
    }

    // Helper functions
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addUserMessage(message);
        
        // Clear input
        chatInput.value = '';
        
        // Process the message and generate AI response
        processUserMessage(message);
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
    
    async function processUserMessage(message) {
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai-message typing';
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p><i class="fas fa-circle-notch fa-spin"></i> Thinking...</p>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
        
        try {
            // Import the editor-AI bridge
            const editorAIBridgeModule = await import('../../src/utils/editor-ai-bridge.js');
            const editorAIBridge = editorAIBridgeModule.default;
            
            // Initialize the editor if not already done
            if (!editorAIBridge.editor) {
                editorAIBridge.init({
                    updateHTML: function(html) {
                        // Update the HTML editor
                        const htmlEditor = document.querySelector('#html-code-editor pre code');
                        if (htmlEditor) {
                            htmlEditor.textContent = html;
                            if (typeof hljs !== 'undefined') {
                                hljs.highlightElement(htmlEditor);
                            }
                        }
                        
                        // Update the visual editor
                        updateVisualEditor(html);
                    },
                    updateCSS: function(css) {
                        // Update the CSS editor
                        const cssEditor = document.querySelector('#css-code-editor pre code');
                        if (cssEditor) {
                            cssEditor.textContent = css;
                            if (typeof hljs !== 'undefined') {
                                hljs.highlightElement(cssEditor);
                            }
                        }
                    },
                    updateJS: function(js) {
                        // Update the JS editor
                        const jsEditor = document.querySelector('#js-code-editor pre code');
                        if (jsEditor) {
                            jsEditor.textContent = js;
                            if (typeof hljs !== 'undefined') {
                                hljs.highlightElement(jsEditor);
                            }
                        }
                    },
                    appendHTML: function(html) {
                        // Append to the HTML editor
                        const htmlEditor = document.querySelector('#html-code-editor pre code');
                        if (htmlEditor) {
                            const currentHTML = htmlEditor.textContent;
                            const bodyEndPos = currentHTML.lastIndexOf('</body>');
                            
                            if (bodyEndPos !== -1) {
                                const newHTML = currentHTML.substring(0, bodyEndPos) + 
                                               html + 
                                               currentHTML.substring(bodyEndPos);
                                
                                htmlEditor.textContent = newHTML;
                                if (typeof hljs !== 'undefined') {
                                    hljs.highlightElement(htmlEditor);
                                }
                                
                                // Update the visual editor
                                updateVisualEditor(newHTML);
                            }
                        }
                    }
                });
                
                // Set initial content
                const htmlEditor = document.querySelector('#html-code-editor pre code');
                const cssEditor = document.querySelector('#css-code-editor pre code');
                const jsEditor = document.querySelector('#js-code-editor pre code');
                
                if (htmlEditor) editorAIBridge.setHTML(htmlEditor.textContent);
                if (cssEditor) editorAIBridge.setCSS(cssEditor.textContent);
                if (jsEditor) editorAIBridge.setJS(jsEditor.textContent);
            }
            
            // Process the message with the AI
            const response = await editorAIBridge.processMessage(message);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add AI response
            addAIMessage(response);
            
        } catch (error) {
            console.error('Error processing message:', error);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add error message
            addAIMessage("I'm sorry, I encountered an error while processing your request. Please try again.");
        }
    }
    
    function updateVisualEditor(html) {
        // Update the visual editor with the new HTML
        const visualEditorCanvas = document.querySelector('.visual-editor-canvas');
        if (visualEditorCanvas) {
            // In a real implementation, this would render the HTML properly
            // For now, we'll just update the placeholder content
            visualEditorCanvas.innerHTML = `
                <div class="placeholder-content">
                    <div class="placeholder-header">
                        <div class="placeholder-logo"></div>
                        <div class="placeholder-nav"></div>
                    </div>
                    <div class="placeholder-hero">
                        <div class="placeholder-text"></div>
                        <div class="placeholder-image"></div>
                    </div>
                    <div class="placeholder-features">
                        <div class="placeholder-feature"></div>
                        <div class="placeholder-feature"></div>
                        <div class="placeholder-feature"></div>
                    </div>
                </div>
            `;
        }
    }
    
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
    
    function generatePreviewContent() {
        // In a real app, this would generate HTML from the current editor state
        // For now, we'll use a simple template
        
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My Website</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                
                header {
                    background-color: #333;
                    color: white;
                    padding: 1rem;
                }
                
                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo {
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                
                .nav-links {
                    display: flex;
                    list-style: none;
                }
                
                .nav-links li {
                    margin-left: 1rem;
                }
                
                .nav-links a {
                    color: white;
                    text-decoration: none;
                }
                
                .hero {
                    height: 80vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 2rem;
                    background-color: #f4f4f4;
                }
                
                .hero h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                
                .hero p {
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                }
                
                button {
                    padding: 0.75rem 1.5rem;
                    background-color: #333;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .features {
                    display: flex;
                    justify-content: space-between;
                    padding: 4rem 2rem;
                }
                
                .feature {
                    flex: 1;
                    text-align: center;
                    padding: 1rem;
                }
                
                .feature i {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                
                footer {
                    background-color: #333;
                    color: white;
                    text-align: center;
                    padding: 1rem;
                }
            </style>
        </head>
        <body>
            <header>
                <nav>
                    <div class="logo">My Website</div>
                    <ul class="nav-links">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>
            </header>
            
            <section class="hero">
                <h1>Welcome to My Website</h1>
                <p>This is a sample website created with AI Website Generator</p>
                <button>Learn More</button>
            </section>
            
            <section class="features">
                <div class="feature">
                    <i class="fas fa-rocket"></i>
                    <h2>Fast</h2>
                    <p>Our service is lightning fast</p>
                </div>
                <div class="feature">
                    <i class="fas fa-shield-alt"></i>
                    <h2>Secure</h2>
                    <p>Your data is always protected</p>
                </div>
                <div class="feature">
                    <i class="fas fa-cog"></i>
                    <h2>Customizable</h2>
                    <p>Tailor it to your needs</p>
                </div>
            </section>
            
            <footer>
                <p>&copy; 2023 My Website. All rights reserved.</p>
            </footer>
            
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
        </body>
        </html>
        `;
        
        return htmlContent;
    }
});