/**
 * HTML Editor Component
 * 
 * This component provides a simple interface for editing HTML content.
 * In a real application, you would use a more robust code editor like CodeMirror or Monaco Editor.
 */

class HTMLEditor {
    /**
     * Initialize the HTML editor
     * @param {string} containerId - The ID of the container element
     * @param {Object} options - Editor options
     */
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with ID "${containerId}" not found`);
        }
        
        this.options = {
            language: 'html',
            theme: 'dark',
            lineNumbers: true,
            ...options
        };
        
        this.content = '';
        this.onChange = options.onChange || (() => {});
        
        this.init();
    }
    
    /**
     * Initialize the editor
     */
    init() {
        // Create textarea for editing
        this.textarea = document.createElement('textarea');
        this.textarea.className = 'html-editor-textarea';
        this.textarea.spellcheck = false;
        
        // Create pre and code elements for syntax highlighting
        this.pre = document.createElement('pre');
        this.pre.className = 'html-editor-highlight';
        this.code = document.createElement('code');
        this.code.className = `language-${this.options.language}`;
        this.pre.appendChild(this.code);
        
        // Create editor container
        this.editorContainer = document.createElement('div');
        this.editorContainer.className = `html-editor ${this.options.theme}`;
        this.editorContainer.appendChild(this.textarea);
        this.editorContainer.appendChild(this.pre);
        
        // Add to container
        this.container.appendChild(this.editorContainer);
        
        // Add event listeners
        this.textarea.addEventListener('input', this.handleInput.bind(this));
        this.textarea.addEventListener('scroll', this.handleScroll.bind(this));
        this.textarea.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Add styles
        this.addStyles();
    }
    
    /**
     * Handle input events
     * @param {Event} e - The input event
     */
    handleInput(e) {
        const value = this.textarea.value;
        this.content = value;
        this.code.textContent = value;
        
        // Apply syntax highlighting if available
        if (window.hljs) {
            window.hljs.highlightElement(this.code);
        }
        
        // Call onChange callback
        this.onChange(value);
    }
    
    /**
     * Handle scroll events to sync highlighting
     */
    handleScroll() {
        this.pre.scrollTop = this.textarea.scrollTop;
        this.pre.scrollLeft = this.textarea.scrollLeft;
    }
    
    /**
     * Handle keydown events for tab support
     * @param {KeyboardEvent} e - The keydown event
     */
    handleKeydown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;
            
            // Insert tab at cursor position
            this.textarea.value = this.textarea.value.substring(0, start) + '  ' + 
                                 this.textarea.value.substring(end);
            
            // Move cursor after the inserted tab
            this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
            
            // Trigger input event to update highlighting
            this.handleInput();
        }
    }
    
    /**
     * Add required styles for the editor
     */
    addStyles() {
        const styleId = 'html-editor-styles';
        
        // Check if styles already exist
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .html-editor {
                    position: relative;
                    height: 100%;
                    font-family: 'Fira Code', monospace;
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .html-editor-textarea,
                .html-editor-highlight {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    padding: 1rem;
                    margin: 0;
                    border: none;
                    overflow: auto;
                    white-space: pre;
                    box-sizing: border-box;
                }
                
                .html-editor-textarea {
                    color: transparent;
                    background: transparent;
                    caret-color: white;
                    resize: none;
                    z-index: 1;
                }
                
                .html-editor-highlight {
                    z-index: 0;
                    pointer-events: none;
                }
                
                .html-editor.dark {
                    background-color: #282c34;
                    color: #abb2bf;
                }
                
                .html-editor.light {
                    background-color: #ffffff;
                    color: #333333;
                }
            `;
            
            document.head.appendChild(style);
        }
    }
    
    /**
     * Set the editor content
     * @param {string} content - The HTML content
     */
    setContent(content) {
        this.content = content;
        this.textarea.value = content;
        this.code.textContent = content;
        
        // Apply syntax highlighting if available
        if (window.hljs) {
            window.hljs.highlightElement(this.code);
        }
    }
    
    /**
     * Get the editor content
     * @returns {string} - The HTML content
     */
    getContent() {
        return this.content;
    }
    
    /**
     * Set focus to the editor
     */
    focus() {
        this.textarea.focus();
    }
    
    /**
     * Destroy the editor
     */
    destroy() {
        this.textarea.removeEventListener('input', this.handleInput);
        this.textarea.removeEventListener('scroll', this.handleScroll);
        this.textarea.removeEventListener('keydown', this.handleKeydown);
        this.container.removeChild(this.editorContainer);
    }
}

// Export the component
export default HTMLEditor;