/**
 * Main JavaScript file for AI Website Generator
 */

import router from '../../src/utils/router.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the router
    initRouter();
    
    // Add event listeners for navigation
    setupNavigation();
    
    // Add event listeners for interactive elements
    setupInteractiveElements();
});

/**
 * Initialize the router with routes
 */
function initRouter() {
    // Define routes
    router.addRoute('/', loadHomePage);
    router.addRoute('/index.html', loadHomePage);
    router.addRoute('/about.html', loadAboutPage);
    router.addRoute('/blog.html', loadBlogPage);
    router.addRoute('/careers.html', loadCareersPage);
    router.addRoute('/documentation.html', loadDocumentationPage);
    router.addRoute('/tutorials.html', loadTutorialsPage);
    router.addRoute('/support.html', loadSupportPage);
    router.addRoute('/terms.html', loadTermsPage);
    router.addRoute('/privacy.html', loadPrivacyPage);
    router.addRoute('/login.html', loadLoginPage);
    router.addRoute('/signup.html', loadSignupPage);
    router.addRoute('/dashboard.html', loadDashboardPage);
    
    // Set 404 handler
    router.setNotFoundHandler(loadNotFoundPage);
    
    // Initialize the router
    router.init();
}

/**
 * Set up navigation event listeners
 */
function setupNavigation() {
    // Handle navigation links
    document.querySelectorAll('a').forEach(link => {
        if (link.href.startsWith(window.location.origin)) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const url = new URL(this.href);
                router.navigate(url.pathname);
            });
        }
    });
}

/**
 * Set up interactive elements
 */
function setupInteractiveElements() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Route handlers
 */
function loadHomePage() {
    console.log('Home page loaded');
    document.title = 'AI Website Generator';
}

function loadAboutPage() {
    console.log('About page loaded');
    document.title = 'About Us - AI Website Generator';
}

function loadBlogPage() {
    console.log('Blog page loaded');
    document.title = 'Blog - AI Website Generator';
}

function loadCareersPage() {
    console.log('Careers page loaded');
    document.title = 'Careers - AI Website Generator';
}

function loadDocumentationPage() {
    console.log('Documentation page loaded');
    document.title = 'Documentation - AI Website Generator';
    
    // Set up documentation navigation
    const docLinks = document.querySelectorAll('.docs-nav a');
    const docSections = document.querySelectorAll('.docs-section');
    
    if (docLinks && docSections) {
        docLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                docLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Scroll to the section
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 120,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

function loadTutorialsPage() {
    console.log('Tutorials page loaded');
    document.title = 'Tutorials - AI Website Generator';
}

function loadSupportPage() {
    console.log('Support page loaded');
    document.title = 'Support - AI Website Generator';
    
    // Set up FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    // Toggle the active class
                    item.classList.toggle('active');
                    
                    // Toggle the display of the answer
                    if (item.classList.contains('active')) {
                        answer.style.display = 'block';
                        const icon = question.querySelector('i');
                        if (icon) {
                            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                        }
                    } else {
                        answer.style.display = 'none';
                        const icon = question.querySelector('i');
                        if (icon) {
                            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                        }
                    }
                });
            }
        });
    }
    
    // Set up contact form submission
    const supportForm = document.querySelector('.support-form');
    
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real app, you would send this data to a server
            console.log('Support form submitted:', { name, email, subject, message });
            
            // Show success message
            alert('Your message has been sent. We will get back to you soon!');
            
            // Reset form
            this.reset();
        });
    }
}

function loadTermsPage() {
    console.log('Terms page loaded');
    document.title = 'Terms of Service - AI Website Generator';
}

function loadPrivacyPage() {
    console.log('Privacy page loaded');
    document.title = 'Privacy Policy - AI Website Generator';
}

function loadLoginPage() {
    console.log('Login page loaded');
    document.title = 'Login - AI Website Generator';
    
    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
        // Redirect to dashboard
        router.navigate('/dashboard.html');
        return;
    }
    
    // Set up login form submission
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked || false;
            
            // In a real app, you would validate credentials with a server
            // For demo purposes, we'll just simulate a successful login
            const user = {
                name: 'Demo User',
                email: email,
                plan: 'free'
            };
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to dashboard
            router.navigate('/dashboard.html');
        });
    }
}

function loadSignupPage() {
    console.log('Signup page loaded');
    document.title = 'Sign Up - AI Website Generator';
    
    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
        // Redirect to dashboard
        router.navigate('/dashboard.html');
        return;
    }
    
    // Set up signup form submission
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
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
            
            // In a real app, you would create an account on the server
            // For demo purposes, we'll just simulate a successful signup
            const user = {
                name: name,
                email: email,
                plan: 'free'
            };
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to dashboard
            router.navigate('/dashboard.html');
        });
    }
}

function loadDashboardPage() {
    console.log('Dashboard page loaded');
    document.title = 'Dashboard - AI Website Generator';
    
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) {
        // Redirect to login
        router.navigate('/login.html');
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
    
    // Set up logout button
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear user data
            localStorage.removeItem('user');
            
            // Redirect to login
            router.navigate('/login.html');
        });
    }
}

function loadNotFoundPage() {
    console.log('Page not found');
    document.title = '404 - Page Not Found';
    
    // In a real app, you would display a 404 page
    alert('Page not found. Redirecting to home page.');
    router.navigate('/');
}