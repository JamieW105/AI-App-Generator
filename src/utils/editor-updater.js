/**
 * Editor Updater
 * 
 * This module provides functions to update the code editors in the UI
 * when changes are made through the AI or visual editor.
 */

class EditorUpdater {
    constructor() {
        this.htmlEditor = null;
        this.cssEditor = null;
        this.jsEditor = null;
    }
    
    /**
     * Initialize the editor updater
     */
    init() {
        // Get editor elements
        this.htmlEditor = document.querySelector('#html-code-editor code');
        this.cssEditor = document.querySelector('#css-code-editor code');
        this.jsEditor = document.querySelector('#js-code-editor code');
        
        // Initialize bridge methods
        this.setupBridgeMethods();
    }
    
    /**
     * Set up bridge methods for the editor-AI bridge
     */
    setupBridgeMethods() {
        // Import the editor-AI bridge
        import('./editor-ai-bridge.js').then(module => {
            const editorAIBridge = module.default;
            
            // Add methods to update the editors
            editorAIBridge.editor = {
                updateHTML: (html) => this.updateHTML(html),
                updateCSS: (css) => this.updateCSS(css),
                updateJS: (js) => this.updateJS(js),
                appendHTML: (html) => this.appendHTML(html)
            };
        });
    }
    
    /**
     * Update the HTML editor
     * @param {string} html - The new HTML content
     */
    updateHTML(html) {
        if (this.htmlEditor) {
            this.htmlEditor.textContent = html;
            this.highlightCode(this.htmlEditor);
            
            // Update the visual editor if active
            this.updateVisualEditor();
        }
    }
    
    /**
     * Update the CSS editor
     * @param {string} css - The new CSS content
     */
    updateCSS(css) {
        if (this.cssEditor) {
            this.cssEditor.textContent = css;
            this.highlightCode(this.cssEditor);
            
            // Update the visual editor if active
            this.updateVisualEditor();
        }
    }
    
    /**
     * Update the JavaScript editor
     * @param {string} js - The new JavaScript content
     */
    updateJS(js) {
        if (this.jsEditor) {
            this.jsEditor.textContent = js;
            this.highlightCode(this.jsEditor);
        }
    }
    
    /**
     * Append HTML to the editor
     * @param {string} html - The HTML to append
     */
    appendHTML(html) {
        if (this.htmlEditor) {
            // Find the closing body tag
            const content = this.htmlEditor.textContent;
            const bodyCloseIndex = content.lastIndexOf('</body>');
            
            if (bodyCloseIndex !== -1) {
                // Insert the new HTML before the closing body tag
                const newContent = content.substring(0, bodyCloseIndex) + 
                                  html + 
                                  content.substring(bodyCloseIndex);
                
                this.updateHTML(newContent);
            } else {
                // Just append to the end if no closing body tag is found
                this.updateHTML(content + html);
            }
        }
    }
    
    /**
     * Update the visual editor with the current HTML and CSS
     */
    updateVisualEditor() {
        const visualEditor = document.querySelector('.visual-editor-canvas');
        if (visualEditor) {
            // Create a temporary iframe to render the HTML and CSS
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Write the HTML and CSS to the iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>${this.cssEditor ? this.cssEditor.textContent : ''}</style>
                </head>
                <body>
                    ${this.htmlEditor ? this.htmlEditor.textContent.replace(/<!DOCTYPE html>[\\s\\S]*?<body>\\s*/i, '').replace(/<\\/body>[\\s\\S]*?<\\/html>/i, '') : ''}
                </body>
                </html>
            `);
            iframeDoc.close();
            
            // Wait for the iframe to load
            setTimeout(() => {
                // Replace the visual editor content with the iframe content
                const placeholderContent = visualEditor.querySelector('.placeholder-content');
                if (placeholderContent) {
                    // Clone the iframe body content
                    const newContent = iframeDoc.body.cloneNode(true);
                    newContent.classList.add('placeholder-content');
                    
                    // Replace the placeholder content
                    visualEditor.replaceChild(newContent, placeholderContent);
                    
                    // Clean up
                    document.body.removeChild(iframe);
                }
            }, 100);
        }
    }
    
    /**
     * Apply syntax highlighting to a code element
     * @param {Element} codeElement - The code element to highlight
     */
    highlightCode(codeElement) {
        if (window.hljs && codeElement) {
            window.hljs.highlightElement(codeElement);
        }
    }
}

// Export the updater
export default new EditorUpdater();