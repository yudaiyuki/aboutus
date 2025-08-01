// ========================================
// Gallery Controller for Wedding Website
// ========================================

class GalleryController {
    constructor() {
        this.lightbox = null;
        this.lightboxImage = null;
        this.lightboxClose = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupLightbox();
        this.bindEvents();
        this.setupGalleryGrid();
        this.initMasonry();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
    }
    
    // ========================================
    // Lightbox Setup
    // ========================================
    setupLightbox() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = this.lightbox.querySelector('.lightbox-image');
        this.lightboxClose = this.lightbox.querySelector('.lightbox-close');
        
        // Create navigation buttons
        this.createNavigationButtons();
        
        // Create image counter
        this.createImageCounter();
    }
    
    createNavigationButtons() {
        const prevButton = document.createElement('button');
        prevButton.className = 'lightbox-prev';
        prevButton.innerHTML = '‹';
        prevButton.setAttribute('aria-label', '前の画像');
        
        const nextButton = document.createElement('button');
        nextButton.className = 'lightbox-next';
        nextButton.innerHTML = '›';
        nextButton.setAttribute('aria-label', '次の画像');
        
        const lightboxContent = this.lightbox.querySelector('.lightbox-content');
        lightboxContent.appendChild(prevButton);
        lightboxContent.appendChild(nextButton);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                font-size: 2rem;
                padding: 1rem;
                cursor: pointer;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 1001;
            }
            
            .lightbox-prev {
                left: -80px;
            }
            
            .lightbox-next {
                right: -80px;
            }
            
            .lightbox-prev:hover,
            .lightbox-next:hover {
                background: rgba(212, 175, 55, 0.8);
                transform: translateY(-50%) scale(1.1);
            }
            
            .lightbox-counter {
                position: absolute;
                bottom: -50px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                background: rgba(0, 0, 0, 0.5);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                .lightbox-prev,
                .lightbox-next {
                    width: 40px;
                    height: 40px;
                    font-size: 1.5rem;
                }
                
                .lightbox-prev {
                    left: 10px;
                }
                
                .lightbox-next {
                    right: 10px;
                }
                
                .lightbox-counter {
                    bottom: 20px;
                }
            }
        `;
        document.head.appendChild(style);
        
        this.prevButton = prevButton;
        this.nextButton = nextButton;
    }
    
    createImageCounter() {
        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        
        const lightboxContent = this.lightbox.querySelector('.lightbox-content');
        lightboxContent.appendChild(counter);
        
        this.imageCounter = counter;
    }
    
    // ========================================
    // Event Binding
    // ========================================
    bindEvents() {
        // Gallery item clicks
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(index);
            });
            
            // Add keyboard support
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLightbox(index);
                }
            });
        });
        
        // Lightbox close events
        this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Navigation button events
        this.prevButton.addEventListener('click', () => this.showPreviousImage());
        this.nextButton.addEventListener('click', () => this.showNextImage());
        
        // Prevent image drag
        this.lightboxImage.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    // ========================================
    // Gallery Grid Setup
    // ========================================
    setupGalleryGrid() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        this.images = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            return {
                src: img.src,
                alt: img.alt,
                caption: item.dataset.caption || ''
            };
        });
        
        // Add lazy loading
        this.setupLazyLoading();
        
        // Add hover effects
        this.setupHoverEffects();
    }
    
    setupLazyLoading() {
        const galleryImages = document.querySelectorAll('.gallery-item img');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        galleryImages.forEach(img => {
            if (img.dataset.src) {
                img.classList.add('lazy');
                imageObserver.observe(img);
            }
        });
    }
    
    setupHoverEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addHoverEffect(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeHoverEffect(item);
            });
        });
    }
    
    addHoverEffect(item) {
        const img = item.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.1)';
            img.style.filter = 'brightness(1.1)';
        }
    }
    
    removeHoverEffect(item) {
        const img = item.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1)';
            img.style.filter = 'brightness(1)';
        }
    }
    
    // ========================================
    // Masonry Layout (Optional)
    // ========================================
    initMasonry() {
        const gallery = document.querySelector('.gallery-grid');
        if (!gallery) return;
        
        // Simple masonry-like layout adjustment
        const resizeObserver = new ResizeObserver(() => {
            this.adjustGalleryLayout();
        });
        
        resizeObserver.observe(gallery);
        
        // Initial layout
        setTimeout(() => this.adjustGalleryLayout(), 100);
    }
    
    adjustGalleryLayout() {
        const gallery = document.querySelector('.gallery-grid');
        const items = gallery.querySelectorAll('.gallery-item');
        
        // Reset any existing transforms
        items.forEach(item => {
            item.style.transform = '';
        });
        
        // Apply responsive grid
        const containerWidth = gallery.offsetWidth;
        const itemWidth = 300; // Base width
        const gap = 20;
        const columns = Math.floor(containerWidth / (itemWidth + gap));
        
        if (columns > 1) {
            gallery.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }
    }
    
    // ========================================
    // Lightbox Operations
    // ========================================
    openLightbox(index) {
        this.currentImageIndex = index;
        this.isOpen = true;
        
        // Set image
        this.updateLightboxImage();
        
        // Show lightbox
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update counter
        this.updateImageCounter();
        
        // Focus management
        this.lightboxClose.focus();
        
        // Preload adjacent images
        this.preloadAdjacentImages();
        
        // Analytics (if needed)
        this.trackGalleryView(index);
    }
    
    closeLightbox() {
        this.isOpen = false;
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to the gallery item
        const currentItem = document.querySelectorAll('.gallery-item')[this.currentImageIndex];
        if (currentItem) {
            currentItem.focus();
        }
    }
    
    showNextImage() {
        if (this.currentImageIndex < this.images.length - 1) {
            this.currentImageIndex++;
        } else {
            this.currentImageIndex = 0; // Loop to first image
        }
        
        this.updateLightboxImage();
        this.updateImageCounter();
        this.preloadAdjacentImages();
    }
    
    showPreviousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
        } else {
            this.currentImageIndex = this.images.length - 1; // Loop to last image
        }
        
        this.updateLightboxImage();
        this.updateImageCounter();
        this.preloadAdjacentImages();
    }
    
    updateLightboxImage() {
        const currentImage = this.images[this.currentImageIndex];
        if (currentImage) {
            // Add loading state
            this.lightboxImage.style.opacity = '0.5';
            
            // Create new image to ensure it loads
            const newImg = new Image();
            newImg.onload = () => {
                this.lightboxImage.src = currentImage.src;
                this.lightboxImage.alt = currentImage.alt;
                this.lightboxImage.style.opacity = '1';
            };
            newImg.src = currentImage.src;
        }
    }
    
    updateImageCounter() {
        if (this.imageCounter) {
            this.imageCounter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
        }
    }
    
    preloadAdjacentImages() {
        const preloadIndexes = [
            this.currentImageIndex - 1,
            this.currentImageIndex + 1
        ];
        
        preloadIndexes.forEach(index => {
            if (index >= 0 && index < this.images.length) {
                const img = new Image();
                img.src = this.images[index].src;
            }
        });
    }
    
    // ========================================
    // Keyboard Navigation
    // ========================================
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.showNextImage();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.showPreviousImage();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.currentImageIndex = 0;
                    this.updateLightboxImage();
                    this.updateImageCounter();
                    break;
                case 'End':
                    e.preventDefault();
                    this.currentImageIndex = this.images.length - 1;
                    this.updateLightboxImage();
                    this.updateImageCounter();
                    break;
            }
        });
    }
    
    // ========================================
    // Touch Navigation
    // ========================================
    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.lightboxImage.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.lightboxImage.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            this.handleSwipeGesture(startX, startY, endX, endY);
        });
        
        // Prevent default touch behavior
        this.lightboxImage.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
    }
    
    handleSwipeGesture(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.showPreviousImage(); // Swipe right = previous
            } else {
                this.showNextImage(); // Swipe left = next
            }
        }
        
        // Vertical swipe down to close
        if (deltaY > minSwipeDistance && Math.abs(deltaX) < minSwipeDistance) {
            this.closeLightbox();
        }
    }
    
    // ========================================
    // Gallery Filtering (Optional)
    // ========================================
    setupFiltering() {
        const filterButtons = document.querySelectorAll('.gallery-filter');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.dataset.filter;
                this.filterGallery(filterValue);
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
    
    filterGallery(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const category = item.dataset.category;
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Update images array for filtered view
        this.updateImagesArray();
    }
    
    updateImagesArray() {
        const visibleItems = document.querySelectorAll('.gallery-item[style*="block"], .gallery-item:not([style*="none"])');
        this.images = Array.from(visibleItems).map(item => {
            const img = item.querySelector('img');
            return {
                src: img.src,
                alt: img.alt,
                caption: item.dataset.caption || ''
            };
        });
    }
    
    // ========================================
    // Utility Methods
    // ========================================
    trackGalleryView(index) {
        // Add analytics tracking here if needed
        console.log(`Gallery image ${index + 1} viewed`);
    }
    
    addImage(src, alt, caption) {
        this.images.push({ src, alt, caption });
        // Re-render gallery if needed
    }
    
    removeImage(index) {
        this.images.splice(index, 1);
        // Re-render gallery if needed
    }
    
    // ========================================
    // Cleanup
    // ========================================
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Clear any timeouts/intervals
        // Clean up observers
    }
}

// ========================================
// Initialize Gallery
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    window.galleryController = new GalleryController();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryController;
}
