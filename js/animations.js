// ========================================
// Animation Controller for Wedding Website
// ========================================

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.initScrollAnimations();
        this.initHoverAnimations();
        this.initLoadingAnimations();
        
        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.toggleAnimations();
        });
    }
    
    // ========================================
    // Intersection Observer Setup
    // ========================================
    setupIntersectionObservers() {
        // Main content observer
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Header observer (for initial load)
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerHeaderAnimations();
                    headerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        // Store observers
        this.observers.set('content', contentObserver);
        this.observers.set('header', headerObserver);
        
        // Observe elements
        this.observeElements();
    }
    
    observeElements() {
        // Observe header
        const header = document.querySelector('.header');
        if (header) {
            this.observers.get('header').observe(header);
        }
        
        // Observe animated elements
        const animatedElements = document.querySelectorAll(`
            .section-title,
            .profile-card,
            .timeline-item,
            .memory-bubble,
            .meeting-story
        `);
        
        animatedElements.forEach(element => {
            this.observers.get('content').observe(element);
        });
    }
    
    // ========================================
    // Animation Triggers
    // ========================================
    triggerElementAnimation(element) {
        if (this.isReducedMotion) return;
        
        const animationType = this.getAnimationType(element);
        this.playAnimation(element, animationType);
    }
    
    getAnimationType(element) {
        if (element.classList.contains('section-title')) {
            return 'fadeInUp';
        } else if (element.classList.contains('profile-card')) {
            return 'slideInFromSide';
        } else if (element.classList.contains('timeline-item')) {
            return 'timelineSlide';
        } else if (element.classList.contains('memory-bubble')) {
            return 'scaleIn';
        } else if (element.classList.contains('meeting-story')) {
            return 'fadeIn';
        }
        return 'fadeInUp';
    }
    
    playAnimation(element, type) {
        element.classList.add('animate-on-scroll');
        
        // Add delay based on element index
        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element);
        const delay = index * 100;
        
        setTimeout(() => {
            element.classList.add('animated', type);
        }, delay);
    }
    
    // ========================================
    // Header Animations
    // ========================================
    triggerHeaderAnimations() {
        if (this.isReducedMotion) return;
        
        const animations = [
            { selector: '.bride-groom-names', delay: 500, type: 'bounceIn' },
            { selector: '.wedding-date', delay: 1000, type: 'fadeInUp' },
            { selector: '.catchphrase', delay: 1300, type: 'fadeInUp' },
            { selector: '.main-photo', delay: 800, type: 'fadeInRight' },
            { selector: '.scroll-indicator', delay: 2000, type: 'fadeInUp' }
        ];
        
        animations.forEach(anim => {
            const element = document.querySelector(anim.selector);
            if (element) {
                setTimeout(() => {
                    element.classList.add('animated', anim.type);
                }, anim.delay);
            }
        });
    }
    
    // ========================================
    // Scroll-based Animations
    // ========================================
    initScrollAnimations() {
        let ticking = false;
        
        const updateAnimations = () => {
            this.updateParallax();
            this.updateScrollProgress();
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        });
    }
    
    updateParallax() {
        if (this.isReducedMotion) return;
        
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    updateScrollProgress() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        const progressBar = document.querySelector('.scroll-progress');
        
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    }
    
    // ========================================
    // Hover Animations
    // ========================================
    initHoverAnimations() {
        const hoverElements = document.querySelectorAll(`
            .profile-card,
            .timeline-content,
            .gallery-item,
            .nav-link
        `);
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.triggerHoverIn(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.triggerHoverOut(e.target);
            });
        });
    }
    
    triggerHoverIn(element) {
        if (this.isReducedMotion) return;
        
        element.classList.add('hover-active');
        
        // Add ripple effect
        this.createRippleEffect(element);
    }
    
    triggerHoverOut(element) {
        element.classList.remove('hover-active');
    }
    
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // ========================================
    // Loading Animations
    // ========================================
    initLoadingAnimations() {
        // Simulate loading states
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                this.imageLoadComplete(img);
            });
            
            // Add loading shimmer effect
            if (!img.complete) {
                img.classList.add('loading-shimmer');
            }
        });
    }
    
    imageLoadComplete(img) {
        img.classList.remove('loading-shimmer');
        img.classList.add('image-loaded');
        
        if (!this.isReducedMotion) {
            img.style.animation = 'fadeIn 0.5s ease forwards';
        }
    }
    
    // ========================================
    // Stagger Animations
    // ========================================
    staggerAnimation(elements, animationType = 'fadeInUp', delay = 100) {
        if (this.isReducedMotion) {
            elements.forEach(el => el.classList.add('animated', 'instant'));
            return;
        }
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated', animationType);
            }, index * delay);
        });
    }
    
    // ========================================
    // Timeline Specific Animations
    // ========================================
    initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateTimelineItem(entry.target, index);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(item);
        });
    }
    
    animateTimelineItem(item, index) {
        if (this.isReducedMotion) return;
        
        const isEven = index % 2 === 0;
        const animationClass = isEven ? 'slide-in-left' : 'slide-in-right';
        
        setTimeout(() => {
            item.classList.add('animated', animationClass);
        }, index * 200);
    }
    
    // ========================================
    // Gallery Animations
    // ========================================
    initGalleryAnimations() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateGalleryGrid();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });
        
        const gallery = document.querySelector('.gallery-grid');
        if (gallery) {
            observer.observe(gallery);
        }
    }
    
    animateGalleryGrid() {
        const items = document.querySelectorAll('.gallery-item');
        this.staggerAnimation(items, 'scaleIn', 150);
    }
    
    // ========================================
    // Profile Animations
    // ========================================
    initProfileAnimations() {
        const profiles = document.querySelectorAll('.profile-card');
        
        profiles.forEach((profile, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.animateProfile(entry.target);
                        }, index * 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(profile);
        });
    }
    
    animateProfile(profile) {
        if (this.isReducedMotion) return;
        
        const elements = [
            profile.querySelector('.profile-photo'),
            profile.querySelector('.profile-name'),
            profile.querySelector('.profile-info'),
            profile.querySelector('.profile-description'),
            profile.querySelector('.favorites')
        ];
        
        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.classList.add('animated', 'fadeInUp');
                }, index * 200);
            }
        });
    }
    
    // ========================================
    // Utility Methods
    // ========================================
    toggleAnimations() {
        const body = document.body;
        
        if (this.isReducedMotion) {
            body.classList.add('reduce-motion');
        } else {
            body.classList.remove('reduce-motion');
        }
    }
    
    pauseAllAnimations() {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
    
    resumeAllAnimations() {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
    
    // ========================================
    // Custom Animation Creation
    // ========================================
    createCustomAnimation(element, keyframes, options) {
        if (this.isReducedMotion) return;
        
        const animation = element.animate(keyframes, options);
        this.animations.set(element, animation);
        
        return animation;
    }
    
    // ========================================
    // Cleanup
    // ========================================
    destroy() {
        // Cleanup observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Cleanup animations
        this.animations.forEach(animation => animation.cancel());
        this.animations.clear();
    }
}

// ========================================
// Initialize Animation Controller
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
    
    // Add required CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .reduce-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(50px);
        }
        
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.8s ease;
        }
        
        .slide-in-left {
            animation: slideInLeft 0.8s ease forwards;
        }
        
        .slide-in-right {
            animation: slideInRight 0.8s ease forwards;
        }
        
        .scaleIn {
            animation: scaleIn 0.6s ease forwards;
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .hover-active {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .image-loaded {
            opacity: 1;
        }
        
        .instant {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
        }
    `;
    
    document.head.appendChild(style);
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}
