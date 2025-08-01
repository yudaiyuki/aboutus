// ========================================
// Main JavaScript for Wedding Website
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initParallaxEffects();
    initTypingEffect();
    initFloatingHearts();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// ========================================
// Navigation Functionality
// ========================================
function initNavigation() {
    const navigation = document.getElementById('navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');
    
    // Show/hide navigation on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navigation.classList.add('visible');
        } else {
            navigation.classList.remove('visible');
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.id;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.profile-card, .timeline-item, .gallery-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.section-title, .profiles-container, .timeline-container, .gallery-grid, .profile-card, .timeline-item, .gallery-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// Parallax Effects
// ========================================
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    });
}

// ========================================
// Typing Effect for Header
// ========================================
function initTypingEffect() {
    const catchphrase = document.querySelector('.catchphrase');
    if (!catchphrase) return;
    
    const text = catchphrase.textContent;
    catchphrase.textContent = '';
    catchphrase.classList.add('typewriter');
    
    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            catchphrase.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is done
            setTimeout(() => {
                catchphrase.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing effect after other animations
    setTimeout(typeWriter, 2000);
}

// ========================================
// Floating Hearts Animation
// ========================================
function initFloatingHearts() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '100%';
        heart.style.opacity = '0.7';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1';
        heart.style.animation = `floatUp ${Math.random() * 3 + 3}s linear infinite`;
        
        header.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 6000);
    }
    
    // Create floating hearts periodically
    setInterval(createHeart, 3000);
}

// ========================================
// Image Loading and Error Handling
// ========================================
function initImageHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading placeholder
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Handle broken images
        img.addEventListener('error', function() {
            this.style.background = 'linear-gradient(45deg, #F8E8E8, #E0E0E0)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = '#999999';
            this.style.fontSize = '0.9rem';
            this.textContent = '画像を配置してください';
        });
    });
}

// ========================================
// Form Handling (if contact form is added)
// ========================================
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add form validation and submission logic here
            const formData = new FormData(this);
            
            // Show success message
            showNotification('メッセージが送信されました！', 'success');
        });
    });
}

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 3000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========================================
// Scroll Progress Indicator
// ========================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(to right, #F8E8E8, #D4AF37);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ========================================
// Lazy Loading for Images
// ========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// Easter Egg - Konami Code
// ========================================
function initEasterEgg() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let userInput = [];
    
    document.addEventListener('keydown', function(e) {
        userInput.push(e.keyCode);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (JSON.stringify(userInput) === JSON.stringify(konamiCode)) {
            activateEasterEgg();
            userInput = [];
        }
    });
    
    function activateEasterEgg() {
        // Add special hearts rain effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createSpecialHeart();
            }, i * 100);
        }
        
        showNotification('💕 Congratulations! You found the secret! 💕', 'success');
    }
    
    function createSpecialHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.fontSize = Math.random() * 30 + 20 + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '-50px';
        heart.style.zIndex = '9999';
        heart.style.pointerEvents = 'none';
        heart.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 5000);
    }
}

// ========================================
// CSS Animations (added dynamically)
// ========================================
function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            from {
                transform: translateY(0) rotate(0deg);
                opacity: 0.7;
            }
            to {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes fall {
            from {
                transform: translateY(-50px) rotate(0deg);
                opacity: 1;
            }
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .loaded {
            opacity: 1;
        }
        
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// Utility Functions
// ========================================
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Initialize everything
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    addCustomAnimations();
    initImageHandling();
    initScrollProgress();
    initLazyLoading();
    initEasterEgg();
    
    // Optimize scroll events
    window.addEventListener('scroll', throttle(function() {
        // Scroll-based functions are already optimized in their respective init functions
    }, 16));
});

// ========================================
// Error Handling
// ========================================
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // Could send error to analytics or show user-friendly message
});

// ========================================
// Performance Monitoring
// ========================================
window.addEventListener('load', function() {
    // Simple performance logging
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});
