/**
 * Template Manager - Handles website templates and generation
 */

class TemplateManager {
    constructor() {
        this.templates = {
            'business': {
                name: 'Business',
                description: 'Professional template for businesses',
                thumbnail: 'public/images/templates/business.jpg',
                html: this.getBusinessTemplate()
            },
            'portfolio': {
                name: 'Portfolio',
                description: 'Showcase your work with this elegant portfolio',
                thumbnail: 'public/images/templates/portfolio.jpg',
                html: this.getPortfolioTemplate()
            },
            'blog': {
                name: 'Blog',
                description: 'Clean and modern blog layout',
                thumbnail: 'public/images/templates/blog.jpg',
                html: this.getBlogTemplate()
            },
            'ecommerce': {
                name: 'E-Commerce',
                description: 'Online store template with product listings',
                thumbnail: 'public/images/templates/ecommerce.jpg',
                html: this.getEcommerceTemplate()
            },
            'landing': {
                name: 'Landing Page',
                description: 'High-conversion landing page for products',
                thumbnail: 'public/images/templates/landing.jpg',
                html: this.getLandingTemplate()
            }
        };
    }

    /**
     * Get all available templates
     * @returns {Object} - All templates
     */
    getAllTemplates() {
        return this.templates;
    }

    /**
     * Get a specific template by ID
     * @param {string} templateId - The template ID
     * @returns {Object|null} - The template or null if not found
     */
    getTemplate(templateId) {
        return this.templates[templateId] || null;
    }

    /**
     * Generate HTML for a business website template
     * @returns {string} - HTML content
     */
    getBusinessTemplate() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Template</title>
    <style>
        /* Basic Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        /* Header */
        header {
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            z-index: 100;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 5%;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #2563eb;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: #2563eb;
        }
        
        /* Hero Section */
        .hero {
            padding: 8rem 5% 5rem;
            background-color: #f8fafc;
        }
        
        .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 2rem;
        }
        
        .hero-text {
            flex: 1;
        }
        
        .hero-text h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #1e293b;
        }
        
        .hero-text p {
            font-size: 1.2rem;
            color: #64748b;
            margin-bottom: 2rem;
        }
        
        .hero-image {
            flex: 1;
        }
        
        .hero-image img {
            width: 100%;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 0.25rem;
            font-weight: 500;
            transition: background-color 0.3s;
        }
        
        .btn:hover {
            background-color: #1d4ed8;
        }
        
        /* Services Section */
        .services {
            padding: 5rem 5%;
            background-color: #fff;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .section-header h2 {
            font-size: 2.5rem;
            color: #1e293b;
            margin-bottom: 1rem;
        }
        
        .section-header p {
            color: #64748b;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .service-card {
            background-color: #f8fafc;
            border-radius: 0.5rem;
            padding: 2rem;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .service-card h3 {
            font-size: 1.5rem;
            margin: 1rem 0;
            color: #1e293b;
        }
        
        /* About Section */
        .about {
            padding: 5rem 5%;
            background-color: #f8fafc;
        }
        
        .about-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 3rem;
        }
        
        .about-image {
            flex: 1;
        }
        
        .about-image img {
            width: 100%;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .about-text {
            flex: 1;
        }
        
        .about-text h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #1e293b;
        }
        
        .about-text p {
            margin-bottom: 1rem;
            color: #64748b;
        }
        
        /* Contact Section */
        .contact {
            padding: 5rem 5%;
            background-color: #fff;
        }
        
        .contact-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            gap: 3rem;
        }
        
        .contact-info {
            flex: 1;
        }
        
        .contact-info h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #1e293b;
        }
        
        .contact-info p {
            margin-bottom: 2rem;
            color: #64748b;
        }
        
        .contact-details {
            margin-bottom: 2rem;
        }
        
        .contact-details div {
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .contact-form {
            flex: 1;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.25rem;
            font-family: inherit;
        }
        
        .form-group textarea {
            height: 150px;
            resize: vertical;
        }
        
        /* Footer */
        footer {
            background-color: #1e293b;
            color: white;
            padding: 3rem 5% 1rem;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-column {
            flex: 1;
            min-width: 200px;
        }
        
        .footer-column h3 {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
        }
        
        .footer-column ul {
            list-style: none;
        }
        
        .footer-column ul li {
            margin-bottom: 0.75rem;
        }
        
        .footer-column ul li a {
            color: #cbd5e1;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .footer-column ul li a:hover {
            color: white;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero-content,
            .about-content,
            .contact-content {
                flex-direction: column;
            }
            
            .hero-text {
                order: 1;
            }
            
            .hero-image {
                order: 0;
                margin-bottom: 2rem;
            }
            
            .about-image {
                margin-bottom: 2rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">Business Name</div>
            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#services">Services</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </div>
        </nav>
    </header>

    <section id="home" class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <h1>We Help Businesses Grow</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <a href="#contact" class="btn">Get Started</a>
            </div>
            <div class="hero-image">
                <img src="https://via.placeholder.com/600x400" alt="Business Growth">
            </div>
        </div>
    </section>

    <section id="services" class="services">
        <div class="section-header">
            <h2>Our Services</h2>
            <p>We offer a wide range of services to help your business succeed</p>
        </div>
        <div class="services-grid">
            <div class="service-card">
                <h3>Service 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div class="service-card">
                <h3>Service 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div class="service-card">
                <h3>Service 3</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="about-content">
            <div class="about-image">
                <img src="https://via.placeholder.com/600x400" alt="About Us">
            </div>
            <div class="about-text">
                <h2>About Our Company</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="section-header">
            <h2>Contact Us</h2>
            <p>Get in touch with our team</p>
        </div>
        <div class="contact-content">
            <div class="contact-info">
                <p>We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.</p>
                <div class="contact-details">
                    <div>
                        <strong>Address:</strong>
                        <span>123 Business St, City, Country</span>
                    </div>
                    <div>
                        <strong>Email:</strong>
                        <span>info@business.com</span>
                    </div>
                    <div>
                        <strong>Phone:</strong>
                        <span>+1 234 567 890</span>
                    </div>
                </div>
            </div>
            <div class="contact-form">
                <form>
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
                    <button type="submit" class="btn">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-content">
            <div class="footer-column">
                <h3>Business Name</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div class="footer-column">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Services</h3>
                <ul>
                    <li><a href="#">Service 1</a></li>
                    <li><a href="#">Service 2</a></li>
                    <li><a href="#">Service 3</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Connect With Us</h3>
                <ul>
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">Twitter</a></li>
                    <li><a href="#">LinkedIn</a></li>
                    <li><a href="#">Instagram</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2023 Business Name. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
        `;
    }

    /**
     * Generate HTML for a portfolio template
     * @returns {string} - HTML content
     */
    getPortfolioTemplate() {
        // For brevity, returning a simplified template
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Template</title>
    <style>
        /* Basic styles for portfolio template */
        body {
            font-family: 'Montserrat', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        header {
            background-color: #000;
            color: #fff;
            padding: 2rem 5%;
        }
        
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            padding: 2rem 5%;
        }
        
        .portfolio-item {
            overflow: hidden;
            border-radius: 4px;
        }
        
        .portfolio-item img {
            width: 100%;
            transition: transform 0.3s;
        }
        
        .portfolio-item:hover img {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <header>
        <h1>My Portfolio</h1>
        <p>Showcasing my creative work</p>
    </header>
    
    <div class="portfolio-grid">
        <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400" alt="Project 1">
        </div>
        <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400" alt="Project 2">
        </div>
        <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400" alt="Project 3">
        </div>
        <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400" alt="Project 4">
        </div>
        <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400" alt="Project 5">
        </div>
        <div class="portfolio-item">
            <img src="https://via.placeholder.com/600x400" alt="Project 6">
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generate HTML for a blog template
     * @returns {string} - HTML content
     */
    getBlogTemplate() {
        // For brevity, returning a simplified template
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Template</title>
    <style>
        /* Basic styles for blog template */
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .blog-header {
            text-align: center;
            padding: 3rem 5%;
            background-color: #f8f9fa;
        }
        
        .blog-posts {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 5%;
        }
        
        .blog-post {
            margin-bottom: 3rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 2rem;
        }
        
        .blog-post h2 {
            margin-bottom: 0.5rem;
        }
        
        .post-meta {
            color: #6c757d;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <header class="blog-header">
        <h1>My Blog</h1>
        <p>Thoughts, stories and ideas</p>
    </header>
    
    <div class="blog-posts">
        <article class="blog-post">
            <h2>Blog Post Title</h2>
            <div class="post-meta">Posted on January 1, 2023 by Author</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <a href="#">Read More</a>
        </article>
        
        <article class="blog-post">
            <h2>Another Blog Post</h2>
            <div class="post-meta">Posted on January 5, 2023 by Author</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <a href="#">Read More</a>
        </article>
        
        <article class="blog-post">
            <h2>Yet Another Blog Post</h2>
            <div class="post-meta">Posted on January 10, 2023 by Author</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <a href="#">Read More</a>
        </article>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generate HTML for an e-commerce template
     * @returns {string} - HTML content
     */
    getEcommerceTemplate() {
        // For brevity, returning a simplified template
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce Template</title>
    <style>
        /* Basic styles for e-commerce template */
        body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
            padding: 2rem 5%;
        }
        
        .product-card {
            border: 1px solid #eee;
            border-radius: 4px;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .product-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        
        .product-info {
            padding: 1rem;
        }
        
        .product-price {
            font-weight: bold;
            color: #e53e3e;
        }
        
        .btn-add-to-cart {
            display: block;
            width: 100%;
            padding: 0.75rem;
            background-color: #3182ce;
            color: white;
            text-align: center;
            text-decoration: none;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .btn-add-to-cart:hover {
            background-color: #2c5282;
        }
    </style>
</head>
<body>
    <header>
        <h1>Online Store</h1>
    </header>
    
    <div class="product-grid">
        <div class="product-card">
            <img src="https://via.placeholder.com/300x200" alt="Product 1">
            <div class="product-info">
                <h3>Product Name</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p class="product-price">$19.99</p>
                <button class="btn-add-to-cart">Add to Cart</button>
            </div>
        </div>
        
        <div class="product-card">
            <img src="https://via.placeholder.com/300x200" alt="Product 2">
            <div class="product-info">
                <h3>Product Name</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p class="product-price">$24.99</p>
                <button class="btn-add-to-cart">Add to Cart</button>
            </div>
        </div>
        
        <div class="product-card">
            <img src="https://via.placeholder.com/300x200" alt="Product 3">
            <div class="product-info">
                <h3>Product Name</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p class="product-price">$29.99</p>
                <button class="btn-add-to-cart">Add to Cart</button>
            </div>
        </div>
        
        <div class="product-card">
            <img src="https://via.placeholder.com/300x200" alt="Product 4">
            <div class="product-info">
                <h3>Product Name</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p class="product-price">$34.99</p>
                <button class="btn-add-to-cart">Add to Cart</button>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generate HTML for a landing page template
     * @returns {string} - HTML content
     */
    getLandingTemplate() {
        // For brevity, returning a simplified template
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page Template</title>
    <style>
        /* Basic styles for landing page template */
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .hero {
            background-color: #4f46e5;
            color: white;
            padding: 5rem 5%;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        
        .cta-button {
            display: inline-block;
            padding: 1rem 2rem;
            background-color: white;
            color: #4f46e5;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .features {
            padding: 5rem 5%;
            text-align: center;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 3rem auto 0;
        }
        
        .feature-card {
            padding: 2rem;
            border-radius: 8px;
            background-color: #f9fafb;
        }
        
        .testimonials {
            background-color: #f3f4f6;
            padding: 5rem 5%;
            text-align: center;
        }
        
        .testimonial-card {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .testimonial-text {
            font-style: italic;
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
        
        .testimonial-author {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <section class="hero">
        <h1>Your Amazing Product</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <a href="#" class="cta-button">Get Started</a>
    </section>
    
    <section class="features">
        <h2>Key Features</h2>
        <div class="features-grid">
            <div class="feature-card">
                <h3>Feature 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div class="feature-card">
                <h3>Feature 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div class="feature-card">
                <h3>Feature 3</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </div>
    </section>
    
    <section class="testimonials">
        <h2>What Our Customers Say</h2>
        <div class="testimonial-card">
            <p class="testimonial-text">"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
            <p class="testimonial-author">- John Doe, CEO</p>
        </div>
    </section>
</body>
</html>
        `;
    }
}

// Export the manager
export default new TemplateManager();