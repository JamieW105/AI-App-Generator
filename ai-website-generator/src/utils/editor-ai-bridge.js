/**
 * Editor-AI Bridge
 * 
 * This module connects the AI chat interface with the website editor,
 * allowing the AI to make changes to the website based on user requests.
 */

import aiService from './ai-service.js';

class EditorAIBridge {
    constructor() {
        this.editor = null;
        this.selectedElement = null;
        this.currentHTML = '';
        this.currentCSS = '';
        this.currentJS = '';
    }
    
    /**
     * Initialize the bridge with the editor
     * @param {Object} editor - The editor instance
     */
    init(editor) {
        this.editor = editor;
    }
    
    /**
     * Process a user message and update the website
     * @param {string} message - The user's message
     * @returns {Promise<string>} - The AI's response
     */
    async processMessage(message) {
        // Get AI response with code blocks
        const responseObj = await aiService.processMessage(message);
        
        // Apply code changes if provided
        if (responseObj.html || responseObj.css || responseObj.js) {
            this.applyCodeChanges(responseObj);
        } else {
            // Check if we need to update the website based on user message
            const updates = this.extractUpdates(message);
            
            if (updates) {
                this.applyUpdates(updates);
            } else {
                // Try to extract instructions from AI response
                // This is useful when the AI suggests specific changes
                this.processAIResponse(responseObj.message);
            }
        }
        
        return responseObj.message;
    }
    
    /**
     * Process the AI response for potential website updates
     * @param {string} response - The AI's response
     */
    processAIResponse(response) {
        // Look for specific patterns in AI responses that suggest changes
        const lowerResponse = response.toLowerCase();
        
        // Check for direct color changes ("I'll make the header blue")
        const directColorChange = lowerResponse.match(/(?:i'll|i will|let's) (?:make|change|set) the (.*?) (?:to |)([a-z]+|#[0-9a-f]{3,6})/i);
        if (directColorChange) {
            this.updateColor(directColorChange[1].trim(), directColorChange[2].trim());
            return;
        }
        
        // Check for color suggestions with more variations
        const colorSuggestion = lowerResponse.match(/(?:could|should|might|try|recommend|suggest|would|will) (?:changing|setting|making|updating) the (.*?) (?:color|background) (?:to|as) ([a-z]+|#[0-9a-f]{3,6})/i);
        if (colorSuggestion) {
            this.updateColor(colorSuggestion[1].trim(), colorSuggestion[2].trim());
            return;
        }
        
        // Check for direct text changes ("I'll update the heading to...")
        const directTextChange = lowerResponse.match(/(?:i'll|i will|let's) (?:change|update|set) the (.*?) (?:text |)to ['"]([^'"]+)['"]/);
        if (directTextChange) {
            this.updateText(directTextChange[1].trim(), directTextChange[2].trim());
            return;
        }
        
        // Check for text change suggestions with more variations
        const textSuggestion = lowerResponse.match(/(?:could|should|might|try|recommend|suggest|would|will) (?:changing|updating|setting) the (.*?) (?:text|content|copy) to ['"]([^'"]+)['"]/);
        if (textSuggestion) {
            this.updateText(textSuggestion[1].trim(), textSuggestion[2].trim());
            return;
        }
        
        // Check for direct element additions ("I'll add a contact form")
        const directAddition = lowerResponse.match(/(?:i'll|i will|let's) add (?:a |an |)(button|image|paragraph|heading|section|form|contact form)/i);
        if (directAddition) {
            this.addElement(directAddition[1].trim());
            return;
        }
        
        // Check for element addition suggestions with more variations
        const addSuggestion = lowerResponse.match(/(?:could|should|might|try|recommend|suggest|would|will) (?:add|insert|include|create) (?:a |an |)(button|image|paragraph|heading|section|form|contact form)/i);
        if (addSuggestion) {
            this.addElement(addSuggestion[1].trim());
            return;
        }
        
        // Check for color mentions ("The header would look better in blue")
        const colorMention = lowerResponse.match(/(header|button|background|footer|navigation) (?:would look better|should be|could be) (?:in |)([a-z]+|#[0-9a-f]{3,6})/i);
        if (colorMention) {
            this.updateColor(colorMention[1].trim(), colorMention[2].trim());
            return;
        }
    }
    
    /**
     * Extract update instructions from a user message
     * @param {string} message - The user's message
     * @returns {Object|null} - Update instructions or null if none
     */
    extractUpdates(message) {
        const lowerMessage = message.toLowerCase();
        
        // This is a simplified version - in a real app, this would use more sophisticated NLP
        // or structured output from the AI API
        
        // Check for color changes
        const colorMatch = lowerMessage.match(/change (?:the )?(?:color|background|text color) (?:of )?(?:the )?(.*?) to (.*?)(?:$|\.|\,|\;)/i);
        if (colorMatch) {
            return {
                type: 'color',
                element: colorMatch[1].trim(),
                value: colorMatch[2].trim()
            };
        }
        
        // Check for text changes
        const textMatch = lowerMessage.match(/change (?:the )?text (?:of )?(?:the )?(.*?) to ['"](.*?)['"](?:$|\.|\,|\;)/i);
        if (textMatch) {
            return {
                type: 'text',
                element: textMatch[1].trim(),
                value: textMatch[2].trim()
            };
        }
        
        // Check for adding elements
        const addMatch = lowerMessage.match(/add (?:a |an )?(.*?)(?:$|\.|\,|\;| with| that)/i);
        if (addMatch) {
            return {
                type: 'add',
                element: addMatch[1].trim()
            };
        }
        
        // Additional patterns for more natural language processing
        if (lowerMessage.includes('make') && lowerMessage.includes('blue')) {
            // Extract what to make blue
            const blueMatch = lowerMessage.match(/make (?:the )?(.*?) blue/i);
            if (blueMatch) {
                return {
                    type: 'color',
                    element: blueMatch[1].trim(),
                    value: 'blue'
                };
            }
        }
        
        // Handle "set" commands
        if (lowerMessage.includes('set')) {
            // Set background color
            const bgColorMatch = lowerMessage.match(/set (?:the )?background (?:color )?(?:to |as )?(.*?)(?:$|\.|\,|\;)/i);
            if (bgColorMatch) {
                return {
                    type: 'color',
                    element: 'background',
                    value: bgColorMatch[1].trim()
                };
            }
            
            // Set text
            const setTextMatch = lowerMessage.match(/set (?:the )?text (?:to |as )?['"]?(.*?)['"]?(?:$|\.|\,|\;)/i);
            if (setTextMatch) {
                return {
                    type: 'text',
                    element: this.selectedElement ? this.getElementType(this.selectedElement) : 'heading',
                    value: setTextMatch[1].trim()
                };
            }
        }
        
        return null;
    }
    
    /**
     * Apply updates to the website
     * @param {Object} updates - The updates to apply
     */
    applyUpdates(updates) {
        if (!this.editor) {
            console.error('Editor not initialized');
            return;
        }
        
        switch (updates.type) {
            case 'color':
                this.updateColor(updates.element, updates.value);
                break;
            case 'text':
                this.updateText(updates.element, updates.value);
                break;
            case 'add':
                this.addElement(updates.element);
                break;
        }
    }
    
    /**
     * Update the color of an element
     * @param {string} elementDesc - Description of the element
     * @param {string} color - The color to apply
     */
    updateColor(elementDesc, color) {
        // In a real app, this would use a more sophisticated approach
        // to identify and update elements
        
        // For now, we'll just modify the CSS
        let cssUpdated = false;
        
        if (elementDesc === 'header' || elementDesc === 'navigation') {
            this.currentCSS = this.currentCSS.replace(
                /header\s*\{\s*background-color:[^;]+;/,
                `header { background-color: ${color};`
            );
            cssUpdated = true;
        } else if (elementDesc === 'button' || elementDesc === 'buttons') {
            this.currentCSS = this.currentCSS.replace(
                /button\s*\{\s*background-color:[^;]+;/,
                `button { background-color: ${color};`
            );
            cssUpdated = true;
        } else if (elementDesc === 'background' || elementDesc === 'page background') {
            this.currentCSS = this.currentCSS.replace(
                /body\s*\{\s*background-color:[^;]+;/,
                `body { background-color: ${color};`
            );
            cssUpdated = true;
        }
        
        if (cssUpdated && this.editor.updateCSS) {
            this.editor.updateCSS(this.currentCSS);
        }
    }
    
    /**
     * Update the text of an element
     * @param {string} elementDesc - Description of the element
     * @param {string} text - The new text
     */
    updateText(elementDesc, text) {
        // In a real app, this would use a more sophisticated approach
        // to identify and update elements
        
        // For now, we'll just modify the HTML
        let htmlUpdated = false;
        
        if (elementDesc === 'heading' || elementDesc === 'title') {
            this.currentHTML = this.currentHTML.replace(
                /<h1[^>]*>(.*?)<\/h1>/,
                `<h1>${text}</h1>`
            );
            htmlUpdated = true;
        } else if (elementDesc === 'paragraph' || elementDesc === 'description') {
            this.currentHTML = this.currentHTML.replace(
                /<p[^>]*>(.*?)<\/p>/,
                `<p>${text}</p>`
            );
            htmlUpdated = true;
        } else if (elementDesc === 'button') {
            this.currentHTML = this.currentHTML.replace(
                /<button[^>]*>(.*?)<\/button>/,
                `<button>${text}</button>`
            );
            htmlUpdated = true;
        }
        
        if (htmlUpdated && this.editor.updateHTML) {
            this.editor.updateHTML(this.currentHTML);
        }
    }
    
    /**
     * Add a new element to the website
     * @param {string} elementType - The type of element to add
     */
    addElement(elementType) {
        // In a real app, this would use a more sophisticated approach
        // to add elements in appropriate locations
        
        // For now, we'll just append to the HTML
        let newElement = '';
        
        switch (elementType) {
            case 'button':
                newElement = '<button>New Button</button>';
                break;
            case 'paragraph':
            case 'text':
                newElement = '<p>New paragraph text</p>';
                break;
            case 'image':
            case 'picture':
                newElement = '<img src="https://via.placeholder.com/300x200" alt="New Image">';
                break;
            case 'heading':
            case 'title':
                newElement = '<h2>New Heading</h2>';
                break;
            case 'section':
                newElement = `
                    <section class="new-section">
                        <h2>New Section</h2>
                        <p>This is a new section added by the AI.</p>
                    </section>
                `;
                break;
            case 'contact form':
            case 'form':
                newElement = `
                    <form class="contact-form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" required></textarea>
                        </div>
                        <button type="submit">Send Message</button>
                    </form>
                `;
                break;
        }
        
        if (newElement && this.editor.appendHTML) {
            this.editor.appendHTML(newElement);
        }
    }
    
    /**
     * Set the currently selected element
     * @param {Element} element - The selected element
     */
    setSelectedElement(element) {
        this.selectedElement = element;
        
        if (element) {
            aiService.setSelectedElement(
                this.getElementType(element),
                {
                    tagName: element.tagName,
                    className: element.className,
                    id: element.id,
                    textContent: element.textContent
                }
            );
        } else {
            aiService.setSelectedElement(null, null);
        }
    }
    
    /**
     * Get the type of an element
     * @param {Element} element - The element
     * @returns {string} - The element type
     */
    getElementType(element) {
        const tagName = element.tagName.toLowerCase();
        
        switch (tagName) {
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
            case 'form':
                return 'form';
            default:
                return tagName;
        }
    }
    
    /**
     * Update the current HTML
     * @param {string} html - The new HTML
     */
    setHTML(html) {
        this.currentHTML = html;
    }
    
    /**
     * Update the current CSS
     * @param {string} css - The new CSS
     */
    setCSS(css) {
        this.currentCSS = css;
    }
    
    /**
     * Update the current JavaScript
     * @param {string} js - The new JavaScript
     */
    setJS(js) {
        this.currentJS = js;
    }
    
    /**
     * Apply code changes from AI response
     * @param {Object} responseObj - The AI response object with code blocks
     */
    applyCodeChanges(responseObj) {
        if (!this.editor) {
            console.error('Editor not initialized');
            return;
        }
        
        // Apply HTML changes if provided
        if (responseObj.html) {
            // Check if it's a complete HTML document or just a fragment
            if (responseObj.html.includes('<!DOCTYPE html>') || responseObj.html.includes('<html')) {
                // Complete HTML document
                this.currentHTML = responseObj.html;
                if (this.editor.updateHTML) {
                    this.editor.updateHTML(this.currentHTML);
                }
            } else {
                // HTML fragment - append or replace based on context
                // For simplicity, we'll append it to the body
                if (this.editor.appendHTML) {
                    this.editor.appendHTML(responseObj.html);
                }
            }
        }
        
        // Apply CSS changes if provided
        if (responseObj.css) {
            // Check if it's a complete CSS file or just rules
            if (this.currentCSS.trim() === '') {
                // No existing CSS, use the new CSS as is
                this.currentCSS = responseObj.css;
            } else {
                // Append the new CSS rules to existing CSS
                // In a real app, we would be more sophisticated about merging CSS
                this.currentCSS += '\n\n/* AI-generated CSS */\n' + responseObj.css;
            }
            
            if (this.editor.updateCSS) {
                this.editor.updateCSS(this.currentCSS);
            }
        }
        
        // Apply JavaScript changes if provided
        if (responseObj.js) {
            // Check if it's a complete JS file or just functions
            if (this.currentJS.trim() === '') {
                // No existing JS, use the new JS as is
                this.currentJS = responseObj.js;
            } else {
                // Append the new JS to existing JS
                // In a real app, we would be more sophisticated about merging JS
                this.currentJS += '\n\n// AI-generated JavaScript\n' + responseObj.js;
            }
            
            if (this.editor.updateJS) {
                this.editor.updateJS(this.currentJS);
            }
        }
    }
}

// Export the bridge
export default new EditorAIBridge();