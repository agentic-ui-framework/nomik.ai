// Nomik.ai Website JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupFormHandling();
    setupAnimations();
    setupIntersectionObserver();
    setupKeyboardNavigation();
    setupPerformanceOptimizations();
}

// Mobile Menu Setup
function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');

            // Update aria-expanded
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);

            // Toggle icon
            const icon = mobileMenuButton.querySelector('svg');
            if (isExpanded) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });

        // Close mobile menu when clicking on links
        mobileMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');

                // Reset icon
                const icon = mobileMenuButton.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Handling Setup
function setupFormHandling() {
    const heroForm = document.getElementById('hero-form');
    const footerForm = document.getElementById('footer-form');
    const navCTA = document.getElementById('nav-cta');

    // Handle hero form submission
    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }

    // Handle footer form submission
    if (footerForm) {
        footerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }

    // Handle nav CTA click
    if (navCTA) {
        navCTA.addEventListener('click', function() {
            const heroForm = document.getElementById('hero-form');
            if (heroForm) {
                heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const emailInput = heroForm.querySelector('input[type="email"]');
                if (emailInput) {
                    setTimeout(() => emailInput.focus(), 500);
                }
            }
        });
    }
}

// Handle form submission
async function handleFormSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    // Validate email
    if (!isValidEmail(email)) {
        showFormMessage(form, 'Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');

    try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success
        showFormMessage(form, 'Thanks! You\'re on the waitlist. We\'ll be in touch soon.', 'success');
        emailInput.value = '';

        // Track conversion
        trackConversion('early_access_signup', { email });

    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(form, 'Something went wrong. Please try again.', 'error');
    } finally {
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form message
function showFormMessage(form, message, type) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message mt-3 p-3 rounded-lg text-sm ${type === 'success' ? 'success' : 'error'}`;
    messageDiv.textContent = message;

    // Insert message
    form.appendChild(messageDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Animation Setup
function setupAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.animate-slide-up, .animate-fade-in');

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    });

    // Animate code typing effect
    setupCodeTypingAnimation();

    // Setup floating animations
    setupFloatingAnimations();
}

// Code typing animation
function setupCodeTypingAnimation() {
    const codeBlock = document.querySelector('pre code');
    if (!codeBlock) return;

    const originalHTML = codeBlock.innerHTML;
    const text = codeBlock.textContent;

    // Clear content
    codeBlock.innerHTML = '';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            codeBlock.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        } else {
            // Restore syntax highlighting
            codeBlock.innerHTML = originalHTML;
        }
    };

    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
}

// Floating animations
function setupFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.animate-float');

    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
}

// Intersection Observer Setup
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Trigger animations
                if (element.classList.contains('animate-slide-up') || element.classList.contains('animate-fade-in')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.transition = 'all 0.6s ease-out';
                }

                // Add visible class for other animations
                element.classList.add('in-view');

                // Stop observing this element
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const elementsToObserve = document.querySelectorAll('.animate-slide-up, .animate-fade-in, [data-animate]');
    elementsToObserve.forEach(el => observer.observe(el));
}

// Keyboard Navigation Setup
function setupKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-nomik-600 text-white px-4 py-2 rounded-lg z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main ID to main content
    const mainContent = document.querySelector('section');
    if (mainContent) {
        mainContent.id = 'main';
    }

    // Escape key handling
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                document.getElementById('mobile-menu-button').setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// Performance Optimizations
function setupPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 10);
    }, { passive: true });

    // Preload critical resources
    preloadCriticalResources();
}

// Scroll handler
function handleScroll() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('header');

    if (header) {
        if (scrolled > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload fonts
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'
    ];

    fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Analytics and tracking
function trackConversion(event, data = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', event, {
            event_category: 'conversion',
            event_label: 'early_access',
            value: 1,
            ...data
        });
    }

    // Custom analytics
    if (typeof analytics !== 'undefined') {
        analytics.track(event, data);
    }

    // Console log for development
    console.log('Conversion tracked:', event, data);
}

// Utility functions
const utils = {
    // Throttle function
    throttle: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Debounce function
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        utils,
        trackConversion,
        isValidEmail
    };
}