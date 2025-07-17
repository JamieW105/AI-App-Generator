/**
 * AI Suggestions
 * 
 * This script adds "Try it" buttons to AI suggestions in the chat interface.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set up a mutation observer to watch for new AI messages
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Check for new AI messages
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('ai-message') && !node.classList.contains('typing')) {
                        processAIMessage(node);
                    }
                });
            }
        });
    });
    
    // Start observing the chat messages
    observer.observe(chatMessages, { childList: true });
    
    // Process existing AI messages
    document.querySelectorAll('.ai-message').forEach(function(message) {
        if (!message.classList.contains('typing')) {
            processAIMessage(message);
        }
    });
    
    /**
     * Process an AI message to add "Try it" buttons
     * @param {Element} messageElement - The AI message element
     */
    function processAIMessage(messageElement) {
        const content = messageElement.querySelector('.message-content');
        if (!content) return;
        
        // Look for code blocks in the rendered message
        const htmlCodeBlocks = content.querySelectorAll('.code-block.html pre code');
        const cssCodeBlocks = content.querySelectorAll('.code-block.css pre code');
        const jsCodeBlocks = content.querySelectorAll('.code-block.js pre code');
        
        // Add buttons for code blocks if found
        htmlCodeBlocks.forEach(codeBlock => {
            const codeBlockContainer = codeBlock.closest('.code-block');
            const codeHeader = codeBlockContainer.querySelector('.code-header');
            
            // Add button to the code header
            const applyButton = document.createElement('button');
            applyButton.className = 'apply-code-btn';
            applyButton.textContent = 'Apply';
            applyButton.addEventListener('click', function() {
                applyCodeChanges('html', codeBlock.textContent);
            });
            
            codeHeader.appendChild(applyButton);
        });
        
        cssCodeBlocks.forEach(codeBlock => {
            const codeBlockContainer = codeBlock.closest('.code-block');
            const codeHeader = codeBlockContainer.querySelector('.code-header');
            
            // Add button to the code header
            const applyButton = document.createElement('button');
            applyButton.className = 'apply-code-btn';
            applyButton.textContent = 'Apply';
            applyButton.addEventListener('click', function() {
                applyCodeChanges('css', codeBlock.textContent);
            });
            
            codeHeader.appendChild(applyButton);
        });
        
        jsCodeBlocks.forEach(codeBlock => {
            const codeBlockContainer = codeBlock.closest('.code-block');
            const codeHeader = codeBlockContainer.querySelector('.code-header');
            
            // Add button to the code header
            const applyButton = document.createElement('button');
            applyButton.className = 'apply-code-btn';
            applyButton.textContent = 'Apply';
            applyButton.addEventListener('click', function() {
                applyCodeChanges('js', codeBlock.textContent);
            });
            
            codeHeader.appendChild(applyButton);
        });
        
        // If no code blocks, check for other suggestions in the text content
        if (htmlCodeBlocks.length === 0 && cssCodeBlocks.length === 0 && jsCodeBlocks.length === 0) {
            const text = content.textContent;
            
            // Check for color suggestions
            const colorSuggestions = findColorSuggestions(text);
            if (colorSuggestions.length > 0) {
                addTryItButton(messageElement, 'Try this color change', function() {
                    applyColorSuggestion(colorSuggestions[0]);
                });
            }
            
            // Check for text change suggestions
            const textSuggestions = findTextSuggestions(text);
            if (textSuggestions.length > 0) {
                addTryItButton(messageElement, 'Try this text change', function() {
                    applyTextSuggestion(textSuggestions[0]);
                });
            }
            
            // Check for element addition suggestions
            const elementSuggestions = findElementSuggestions(text);
            if (elementSuggestions.length > 0) {
                addTryItButton(messageElement, 'Add this element', function() {
                    applyElementSuggestion(elementSuggestions[0]);
                });
            }
        }
    }
    
    /**
     * Add a "Try it" button to an AI message
     * @param {Element} messageElement - The AI message element
     * @param {string} buttonText - The button text
     * @param {Function} clickHandler - The click handler
     */
    function addTryItButton(messageElement, buttonText, clickHandler) {
        // Check if the message already has actions
        let actionsContainer = messageElement.querySelector('.message-actions');
        
        if (!actionsContainer) {
            // Create actions container
            actionsContainer = document.createElement('div');
            actionsContainer.className = 'message-actions';
            
            // Add to message content
            const messageContent = messageElement.querySelector('.message-content');
            messageContent.appendChild(actionsContainer);
        }
        
        // Create button
        const button = document.createElement('button');
        button.className = 'apply-btn';
        button.textContent = buttonText;
        button.addEventListener('click', clickHandler);
        
        // Add to actions container
        actionsContainer.appendChild(button);
    }
    
    /**
     * Find color suggestions in a message
     * @param {string} text - The message text
     * @returns {Array} - Array of color suggestions
     */
    function findColorSuggestions(text) {
        const suggestions = [];
        const lowerText = text.toLowerCase();
        
        // Look for color suggestions
        const patterns = [
            /(?:change|set|make) the (.*?) (?:color|background) to ([a-z]+|#[0-9a-f]{3,6})/i,
            /(?:the|a) ([a-z]+|#[0-9a-f]{3,6}) (header|button|background|footer|navigation)/i,
            /(header|button|background|footer|navigation) (?:should be|could be|would look better in) ([a-z]+|#[0-9a-f]{3,6})/i
        ];
        
        patterns.forEach(pattern => {
            const match = lowerText.match(pattern);
            if (match) {
                if (pattern.toString().includes('should be|could be|would look better in')) {
                    suggestions.push({
                        element: match[1],
                        color: match[2]
                    });
                } else if (pattern.toString().includes('the|a')) {
                    suggestions.push({
                        element: match[2],
                        color: match[1]
                    });
                } else {
                    suggestions.push({
                        element: match[1],
                        color: match[2]
                    });
                }
            }
        });
        
        return suggestions;
    }
    
    /**
     * Find text change suggestions in a message
     * @param {string} text - The message text
     * @returns {Array} - Array of text change suggestions
     */
    function findTextSuggestions(text) {
        const suggestions = [];
        const lowerText = text.toLowerCase();
        
        // Look for text change suggestions
        const patterns = [
            /(?:change|update|set) the (.*?) (?:text|content) to ['"](.*?)['"]]/i,
            /(?:the|a) (heading|title|paragraph|button) (?:should say|could say|text should be) ['"](.*?)['"]/i
        ];
        
        patterns.forEach(pattern => {
            const match = lowerText.match(pattern);
            if (match) {
                if (pattern.toString().includes('should say|could say|text should be')) {
                    suggestions.push({
                        element: match[1],
                        text: match[2]
                    });
                } else {
                    suggestions.push({
                        element: match[1],
                        text: match[2]
                    });
                }
            }
        });
        
        return suggestions;
    }
    
    /**
     * Find element addition suggestions in a message
     * @param {string} text - The message text
     * @returns {Array} - Array of element addition suggestions
     */
    function findElementSuggestions(text) {
        const suggestions = [];
        const lowerText = text.toLowerCase();
        
        // Look for element addition suggestions
        const patterns = [
            /(?:add|insert|include) (?:a|an) (button|image|paragraph|heading|section|form|contact form)/i
        ];
        
        patterns.forEach(pattern => {
            const match = lowerText.match(pattern);
            if (match) {
                suggestions.push({
                    element: match[1]
                });
            }
        });
        
        return suggestions;
    }
    
    /**
     * Apply a color suggestion
     * @param {Object} suggestion - The color suggestion
     */
    function applyColorSuggestion(suggestion) {
        // Import the editor-AI bridge
        import('../../src/utils/editor-ai-bridge.js').then(module => {
            const editorAIBridge = module.default;
            editorAIBridge.updateColor(suggestion.element, suggestion.color);
        });
    }
    
    /**
     * Apply a text suggestion
     * @param {Object} suggestion - The text suggestion
     */
    function applyTextSuggestion(suggestion) {
        // Import the editor-AI bridge
        import('../../src/utils/editor-ai-bridge.js').then(module => {
            const editorAIBridge = module.default;
            editorAIBridge.updateText(suggestion.element, suggestion.text);
        });
    }
    
    /**
     * Apply an element suggestion
     * @param {Object} suggestion - The element suggestion
     */
    function applyElementSuggestion(suggestion) {
        // Import the editor-AI bridge
        import('../../src/utils/editor-ai-bridge.js').then(module => {
            const editorAIBridge = module.default;
            editorAIBridge.addElement(suggestion.element);
        });
    }
    
    /**
     * Apply code changes from code blocks
     * @param {string} type - The type of code (html, css, js)
     * @param {string} code - The code to apply
     */
    function applyCodeChanges(type, code) {
        // Import the editor-AI bridge
        import('../../src/utils/editor-ai-bridge.js').then(module => {
            const editorAIBridge = module.default;
            const responseObj = {
                html: type === 'html' ? code : null,
                css: type === 'css' ? code : null,
                js: type === 'js' ? code : null,
                message: ''
            };
            editorAIBridge.applyCodeChanges(responseObj);
        });
    }
});