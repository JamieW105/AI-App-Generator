/**
 * AI Service - Handles communication with the Deepseek API
 */

import config from '../config.js';

class AIService {
    constructor() {
        this.apiKey = config.api.deepseek.apiKey;
        this.apiUrl = config.api.deepseek.apiUrl;
        this.model = config.api.deepseek.model;
        this.maxTokens = config.api.deepseek.maxTokens;
        this.context = {
            selectedElement: null,
            currentPage: {},
            history: []
        };
        
        // Initialize with system message
        this.context.history.push({
            role: 'system',
            content: `You are an AI website design assistant. Help users build and modify their websites by providing clear, helpful responses AND actual code. 
            
            Important guidelines:
            1. Always provide specific, actionable suggestions with actual HTML, CSS, and JavaScript code
            2. When users ask to change elements, provide the exact code needed to implement those changes
            3. Keep responses concise and focused on the website editing task
            4. Avoid saying "I understand you want to make changes" - instead, directly provide code changes
            5. When a user selects an element, provide 2-3 specific code improvements for that element
            6. Use web design best practices in your suggestions
            7. Always include code blocks in your responses using the following format:
            
            HTML:
            ```html
            <your HTML code here>
            ```
            
            CSS:
            ```css
            /* Your CSS code here */
            ```
            
            JavaScript (when needed):
            ```javascript
            // Your JavaScript code here
            ```
            
            Example good response: "I'll make the header blue and add more padding. Here's the code:
            
            CSS:
            ```css
            header {
              background-color: #0066cc;
              padding: 2rem 1.5rem;
            }
            ```
            
            For the hero section, let's use a larger font size for the heading and add a gradient background:
            
            CSS:
            ```css
            .hero {
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            
            .hero h1 {
              font-size: 3.5rem;
              font-weight: 700;
            }
            ```"
            
            Example bad response: "I understand you want to make changes to your website. Could you please provide more details about what you'd like to modify?"
            `
        });
    }

    /**
     * Process a user message and generate an AI response using Deepseek API
     * @param {string} message - The user's message
     * @returns {Promise<Object>} - The AI's response with code blocks extracted
     */
    async processMessage(message) {
        try {
            // Add context about selected element if available
            let fullMessage = message;
            if (this.context.selectedElement) {
                fullMessage = `[Selected element: ${this.context.selectedElement.type}] ${message}`;
            }
            
            // Store message in history
            this.context.history.push({ role: 'user', content: fullMessage });
            
            // Prepare messages for API
            const messages = this.context.history.slice(-10); // Keep context window manageable
            
            // Add retry mechanism
            let retries = 0;
            const maxRetries = 3;
            let aiResponse;
            
            while (retries < maxRetries) {
                try {
                    // Call Deepseek API
                    const response = await fetch(this.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKey}`
                        },
                        body: JSON.stringify({
                            model: this.model,
                            messages: messages,
                            max_tokens: this.maxTokens
                        })
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Deepseek API error:', errorData);
                        
                        // Check for rate limiting
                        if (response.status === 429) {
                            retries++;
                            const delay = Math.pow(2, retries) * 1000; // Exponential backoff
                            console.log(`Rate limited. Retrying in ${delay}ms...`);
                            await this.delay(delay);
                            continue;
                        }
                        
                        throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
                    }
                    
                    const data = await response.json();
                    aiResponse = data.choices[0].message.content;
                    break; // Success, exit the retry loop
                    
                } catch (apiError) {
                    if (retries >= maxRetries - 1) {
                        throw apiError; // Re-throw if we've exhausted retries
                    }
                    retries++;
                    await this.delay(1000 * retries); // Wait before retrying
                }
            }
            
            // Store response in history
            this.context.history.push({ role: 'assistant', content: aiResponse });
            
            // Extract code blocks from the response
            const processedResponse = this.extractCodeBlocks(aiResponse);
            return processedResponse;
        } catch (error) {
            console.error('Error calling Deepseek API:', error);
            
            // Fallback response if API fails
            const fallbackResponse = "I'm having trouble connecting to my backend. Let me provide a simple response: " + 
                                     this.generateFallbackResponse(message);
            
            // Store fallback in history
            this.context.history.push({ role: 'assistant', content: fallbackResponse });
            
            // Extract code blocks from the fallback response
            const processedFallback = this.extractCodeBlocks(fallbackResponse);
            return processedFallback;
        }
    }
    
    /**
     * Create a delay using a promise
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Promise that resolves after the delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Set the currently selected element
     * @param {string} elementType - Type of the selected element
     * @param {Object} elementData - Data about the selected element
     */
    setSelectedElement(elementType, elementData) {
        this.context.selectedElement = {
            type: elementType,
            data: elementData
        };
    }

    /**
     * Generate a fallback response if API fails
     * @param {string} message - The user's message
     * @returns {string} - A fallback response
     */
    generateFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // More specific and helpful fallback responses with code
        if (this.containsAny(lowerMessage, ['hello', 'hi', 'hey'])) {
            return "Hello! I'm your AI website assistant. I can help you design your site by changing colors, layouts, adding new sections, or modifying text. What would you like to work on first?";
        }
        
        if (this.containsAny(lowerMessage, ['color', 'background'])) {
            return `Let's improve the color scheme of your website. I suggest using a blue for the header, light gray for the background, and a contrasting accent color like orange for buttons and call-to-action elements.

CSS:
```css
header {
  background-color: #3b82f6;
  color: white;
}

body {
  background-color: #f9fafb;
}

button, .btn, .cta {
  background-color: #f97316;
  color: white;
}
````;
        }
        
        if (this.containsAny(lowerMessage, ['text', 'font', 'heading'])) {
            return `I'll help improve your text elements. For headings, let's use a clean sans-serif font like Montserrat at 2.5rem size with a weight of 700. For body text, Roboto at 1rem with 400 weight provides excellent readability.

CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@400;700&display=swap');

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}

h1 {
  font-size: 2.5rem;
}

body, p, li, a {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
}
````;
        }
        
        if (this.containsAny(lowerMessage, ['add', 'insert', 'create'])) {
            return `I'll add a new feature section to your website with three cards highlighting your main services or products. Each card will have an icon, heading, and short description, arranged in a responsive grid layout.

HTML:
```html
<section class="features">
  <div class="container">
    <h2 class="section-title">Our Services</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <h3>Service One</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque velit vitae est placerat, ut aliquet nisi faucibus.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-cog"></i>
        </div>
        <h3>Service Two</h3>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-users"></i>
        </div>
        <h3>Service Three</h3>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      </div>
    </div>
  </div>
</section>
```

CSS:
```css
.features {
  padding: 4rem 0;
  background-color: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 1rem;
}
````;
        }
        
        if (this.containsAny(lowerMessage, ['layout', 'design', 'structure'])) {
            return `Let's improve your website layout. I recommend a clean navigation bar at the top, followed by a hero section with a clear value proposition, then feature sections, testimonials, and a contact form. This structure guides visitors through your content in a logical flow.

HTML:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Website</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
  <header>
    <nav class="navbar">
      <div class="logo">Your Brand</div>
      <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div class="mobile-menu-btn">
        <i class="fas fa-bars"></i>
      </div>
    </nav>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1>Your Compelling Headline</h1>
        <p>A clear and concise value proposition that explains what you offer and why it matters.</p>
        <div class="cta-buttons">
          <a href="#" class="btn btn-primary">Get Started</a>
          <a href="#" class="btn btn-secondary">Learn More</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="hero-image.jpg" alt="Hero Image">
      </div>
    </div>
  </section>

  <!-- Additional sections would go here -->
</body>
</html>
```

CSS:
```css
/* Basic reset and container */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Navigation */
header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #3b82f6;
}

.mobile-menu-btn {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Hero section */
.hero {
  padding: 8rem 0 4rem;
  background-color: #f9fafb;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #4b5563;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-secondary:hover {
  background-color: #f0f9ff;
}

.hero-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr;
  }
  
  .hero-image {
    order: -1;
  }
  
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
}
````;
        }
        
        return `I'll help improve your website with a modern design approach. Let's start by updating the color scheme to a professional blue and white palette, improving the typography with cleaner fonts, and adding more whitespace between elements for better readability.

CSS:
```css
/* Modern color scheme */
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary: #f97316;
  --light: #f9fafb;
  --dark: #1f2937;
  --gray: #6b7280;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.7;
  color: var(--dark);
  background-color: var(--light);
}

/* Improved typography */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 3rem;
}

h2 {
  font-size: 2.5rem;
}

p {
  margin-bottom: 1.5rem;
}

/* Add more whitespace */
section {
  padding: 5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Modern button styles */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
````;
    }

    /**
     * Check if a string contains any of the given keywords
     * @param {string} str - The string to check
     * @param {Array<string>} keywords - Keywords to look for
     * @returns {boolean} - True if any keyword is found
     */
    containsAny(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    }
    
    /**
     * Extract code blocks from the AI response
     * @param {string} response - The AI's response
     * @returns {Object} - The response with extracted code blocks
     */
    extractCodeBlocks(response) {
        const result = {
            message: response,
            html: null,
            css: null,
            js: null
        };
        
        // Extract HTML code blocks
        const htmlMatch = response.match(/```html([\s\S]*?)```/);
        if (htmlMatch && htmlMatch[1]) {
            result.html = htmlMatch[1].trim();
        }
        
        // Extract CSS code blocks
        const cssMatch = response.match(/```css([\s\S]*?)```/);
        if (cssMatch && cssMatch[1]) {
            result.css = cssMatch[1].trim();
        }
        
        // Extract JavaScript code blocks
        const jsMatch = response.match(/```javascript([\s\S]*?)```/);
        if (jsMatch && jsMatch[1]) {
            result.js = jsMatch[1].trim();
        }
        
        return result;
    }
}

// Export the service
export default new AIService();