document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
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
            strengthText.textContent = strengthLabels[strength];
        });
    }

    // Form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Simulate login - in a real app, this would be an API call
            console.log('Login attempt:', { email, password, remember });
            
            // For demo purposes, redirect to dashboard
            localStorage.setItem('user', JSON.stringify({ email }));
            window.location.href = 'dashboard.html';
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Basic validation
            if (password !== confirmPassword) {
                showError('confirm-password', 'Passwords do not match');
                return;
            }
            
            if (!terms) {
                showError('terms', 'You must agree to the terms');
                return;
            }
            
            // Simulate signup - in a real app, this would be an API call
            console.log('Signup attempt:', { name, email, password, terms });
            
            // For demo purposes, redirect to dashboard
            localStorage.setItem('user', JSON.stringify({ name, email }));
            window.location.href = 'dashboard.html';
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', async function() {
            try {
                // Disable the button to prevent multiple clicks
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
                
                // Import the OAuth service
                const oauthModule = await import('../src/auth/oauth-service.js').catch(e => {
                    // Try alternative path for GitHub Pages
                    return import('./src/auth/oauth-service.js');
                });
                const oauthService = oauthModule.default;
                
                // Determine which provider to use
                if (this.classList.contains('btn-google')) {
                    oauthService.loginWithGoogle();
                } else if (this.classList.contains('btn-github')) {
                    oauthService.loginWithGithub();
                }
            } catch (error) {
                console.error('OAuth error:', error);
                alert('Authentication failed. Please try again.');
                
                // Reset the button
                this.disabled = false;
                if (this.classList.contains('btn-google')) {
                    this.innerHTML = '<i class="fab fa-google"></i> Google';
                } else {
                    this.innerHTML = '<i class="fab fa-github"></i> GitHub';
                }
            }
        });
    });
});

// Helper functions
function calculatePasswordStrength(password) {
    // This is a simple password strength calculator
    // In a real app, you would use a more sophisticated algorithm
    
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

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add the error message after the input
    input.parentNode.appendChild(errorDiv);
    
    // Highlight the input
    input.style.borderColor = 'var(--error-color)';
    
    // Remove the error after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
        input.style.borderColor = '';
    }, 3000);
}