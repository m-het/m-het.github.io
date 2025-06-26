// JavaScript for interactive functionality
class ParthAgrotechWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupHeroSlider(); 
        this.setupFormValidation();
        this.setupProductFilters();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
    }

      // Hero slider
  setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    let current = 0;
    slides[current].classList.add('active');

    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 3000);  // change every 3s
  }

    // Event listeners setup
    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });

        // Navigation for awards and products pages
        this.setupNavigation();
    }

    // Setup navigation between pages
    setupNavigation() {
        // The event listener previously here was conflicting with the smooth scroll functionality.
        // It has been removed to allow the smooth scroll handler to manage the #home link correctly.
    }

    // Show different pages
    showPage(page) {
        const mainContent = document.querySelector('main') || document.body;
        const awardsPage = document.getElementById('awardsPage');
        const productsPage = document.getElementById('productsPage');
        const homeElements = document.querySelectorAll('.hero, .about, .section:not(#awardsPage section):not(#productsPage section)');

        // Hide all pages first
        homeElements.forEach(el => el.style.display = 'none');
        if (awardsPage) awardsPage.style.display = 'none';
        if (productsPage) productsPage.style.display = 'none';

        // Show selected page
        switch(page) {
            case 'awards':
                if (awardsPage) {
                    awardsPage.style.display = 'block';
                    window.scrollTo(0, 0);
                }
                break;
            case 'products':
                if (productsPage) {
                    productsPage.style.display = 'block';
                    window.scrollTo(0, 0);
                }
                break;
            case 'home':
            default:
                homeElements.forEach(el => el.style.display = 'block');
                window.scrollTo(0, 0);
                break;
        }
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.length > 1) { // Not just "#"
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        let targetPosition = target.offsetTop - headerHeight;
                        
                        if (href === '#home') {
                            targetPosition = 0;
                        }

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('.nav');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (nav && menuToggle && nav.classList.contains('active')) {
                if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                    nav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }

    // Scroll animations for fade-in effects
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => observer.observe(el));
    }

    // Form validation for contact form
    setupFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            let isValid = true;

            // Validate name
            if (!this.validateField(name, 'Please enter your name')) {
                isValid = false;
            }

            // Validate email
            if (!this.validateEmail(email)) {
                isValid = false;
            }

            // Validate message
            if (!this.validateField(message, 'Please enter your message')) {
                isValid = false;
            }

            if (isValid) {
                this.submitForm(form);
            }
        });

        // Real-time validation
        const fields = ['name', 'email', 'message'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    if (fieldId === 'email') {
                        this.validateEmail(field);
                    } else {
                        this.validateField(field, `Please enter your ${fieldId}`);
                    }
                });

                field.addEventListener('input', () => {
                    this.clearError(field);
                });
            }
        });
    }

    // Validate individual field
    validateField(field, message) {
        const value = field.value.trim();
        if (!value) {
            this.showError(field, message);
            return false;
        }
        this.clearError(field);
        return true;
    }

    // Validate email field
    validateEmail(field) {
        const value = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!value) {
            this.showError(field, 'Please enter your email address');
            return false;
        } else if (!emailRegex.test(value)) {
            this.showError(field, 'Please enter a valid email address');
            return false;
        }
        
        this.clearError(field);
        return true;
    }

    // Show error message
    showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Clear error message
    clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Submit form (simulation)
    submitForm(form) {
        const successElement = document.getElementById('formSuccess');
        if (successElement) {
            successElement.textContent = 'Thank you for your message! We will get back to you soon.';
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successElement.textContent = '';
            }, 5000);
        }
    }

    // Product filter functionality
    setupProductFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');
                
                // Filter products
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        // Add animation
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addScrollToTopButton();
    setupLazyLoading();
    new ParthAgrotechWebsite();
});

// Additional utility functions for enhanced user experience

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
});

// Lazy loading for images (when actual images are added)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-green);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow);
    `;

    button.addEventListener('click', scrollToTop);
    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    }, 100));
}

// Loader logic removed
        