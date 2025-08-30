// Enhanced Wedding Website Class with Integrated Hero Parallax
class WeddingWebsite {
    constructor() {
        this.isTouch = this.detectTouch();
        this.isSubmitting = false;
        this.currentLightboxIndex = 0;
        this.eventListeners = [];
        this.observers = [];
        this.animationFrames = [];
        this.loadingStates = {
            images: false,
            form: false,
            gallery: false
        };
        this.init();
    }

    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
    }

    init() {
        this.setupLoader();
        this.setupHeroParallax();
        this.setupComplexParallax();
        this.setupScrollAnimations();
        this.initializeGallery();
        this.initializeForm();
        this.setupLightbox();
        this.setupScrollIndicator();
        this.setupVideoObserver();
        this.registerServiceWorker();
        this.measurePerformance();
    }

    setupLoader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 1000);
                }
            }, 2500);
        });
    }

    setupHeroParallax() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Check if device supports parallax well
        if (this.isMobileDevice()) {
            return;
        }

        const videoContainer = document.querySelector('.hero-video-container');
        const heroContent = document.querySelector('.hero-content');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        if (!videoContainer || !heroContent || !scrollIndicator) return;

        let ticking = false;

        const updateHeroParallax = () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero');
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
            
            // Only apply parallax when hero section is visible
            if (scrolled <= heroHeight) {
                // Video background - moves slower (0.5x speed)
                const videoTransform = scrolled * 0.5;
                videoContainer.style.transform = `translate3d(0, ${videoTransform}px, 0)`;

                // Hero content - moves at medium speed (0.3x) with fade effect
                const contentTransform = scrolled * 0.3;
                const opacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.8)));
                heroContent.style.transform = `translate3d(0, ${contentTransform}px, 0)`;
                heroContent.style.opacity = opacity;

                // Scroll indicator - moves faster (0.8x) and fades quickly
                const indicatorTransform = scrolled * 0.8;
                const indicatorOpacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.3)));
                scrollIndicator.style.transform = `translate3d(-50%, ${indicatorTransform}px, 0)`;
                scrollIndicator.style.opacity = indicatorOpacity;
            }

            ticking = false;
        };

        const requestHeroTick = () => {
            if (!ticking) {
                const frameId = requestAnimationFrame(updateHeroParallax);
                this.animationFrames.push(frameId);
                ticking = true;
            }
        };

        // Use passive listener for better performance
        this.addEventListenerTracked(window, 'scroll', requestHeroTick, { passive: true });

        // Initial call
        updateHeroParallax();
    }

    setupVideoObserver() {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(e => console.warn('Video autoplay failed:', e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            videoObserver.observe(heroVideo);
            this.observers.push(videoObserver);
        }
    }

    setupComplexParallax() {
        if (this.isTouch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Use Intersection Observer to only animate visible elements
        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('parallax-active');
                } else {
                    entry.target.classList.remove('parallax-active');
                }
            });
        }, {
            threshold: 0,
            rootMargin: '20% 0px 20% 0px'
        });

        // Observe parallax elements
        document.querySelectorAll('.parallax-bg, .parallax-image').forEach(el => {
            parallaxObserver.observe(el);
        });

        this.observers.push(parallaxObserver);

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Hero video parallax with zoom effect
            const heroVideo = document.querySelector('.hero-video');
            if (heroVideo && heroVideo.closest('.hero')) {
                const heroRect = heroVideo.closest('.hero').getBoundingClientRect();
                if (heroRect.top < windowHeight && heroRect.bottom > 0) {
                    const scale = 1 + (scrolled * 0.0003);
                    heroVideo.style.transform = `translate(-50%, -50%) scale(${Math.min(scale, 1.2)})`;
                }
            }

            // Complex background parallax - only for active elements
            document.querySelectorAll('.parallax-bg.parallax-active').forEach((bg, index) => {
                const rect = bg.closest('.parallax-section')?.getBoundingClientRect();
                if (!rect) return;
                
                const elementTop = rect.top;
                const elementHeight = rect.height;
                const windowCenter = windowHeight / 2;
                
                const elementCenter = elementTop + (elementHeight / 2);
                const distanceFromCenter = (windowCenter - elementCenter) / windowHeight;
                
                const speed = 0.3 + (index * 0.15);
                const yOffset = distanceFromCenter * speed * 100;
                const scale = 1.1 + Math.abs(distanceFromCenter) * 0.05;
                
                bg.style.transform = `translateY(${yOffset}px) scale(${Math.min(scale, 1.3)})`;
            });

            // Image parallax - only for active elements
            document.querySelectorAll('.parallax-image.parallax-active').forEach((img, index) => {
                const rect = img.getBoundingClientRect();
                const speed = index % 2 === 0 ? 0.3 : -0.3;
                const yOffset = (windowHeight - rect.top) * speed;
                
                img.style.transform = `translateY(${yOffset}px)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                const frameId = requestAnimationFrame(updateParallax);
                this.animationFrames.push(frameId);
                ticking = true;
            }
        };

        this.addEventListenerTracked(window, 'scroll', requestTick, { passive: true });

        // Mouse parallax for depth
        this.addEventListenerTracked(document, 'mousemove', (e) => {
            const mouseXPercent = (e.clientX / window.innerWidth) - 0.5;
            const mouseYPercent = (e.clientY / window.innerHeight) - 0.5;

            // Subtle parallax on UI elements
            document.querySelectorAll('.boxy-ui').forEach((element, index) => {
                const speed = 3 + (index % 3);
                const x = mouseXPercent * speed;
                const y = mouseYPercent * speed;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
            });

            // Hero content mouse tracking (only if not on mobile)
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && !this.isTouch) {
                const x = mouseXPercent * 8;
                const y = mouseYPercent * 8;
                heroContent.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0px) scale(1)';
                    
                    // Track animation for analytics
                    this.trackEvent('element_animated', {
                        element_class: entry.target.className,
                        element_id: entry.target.id || 'unnamed'
                    });
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.boxy-ui, .gallery-item, .stat-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px) scale(0.95)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            this.addEventListenerTracked(scrollIndicator, 'click', () => {
                const storySection = document.getElementById('story');
                if (storySection) {
                    storySection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    this.trackEvent('scroll_indicator_clicked');
                }
            });
        }
    }

    async setLoadingState(component, isLoading) {
        this.loadingStates[component] = isLoading;
        
        // Show/hide global loading indicator based on any active loading states
        const hasActiveLoading = Object.values(this.loadingStates).some(state => state);
        const globalLoader = document.querySelector('.global-loader');
        
        if (globalLoader) {
            globalLoader.style.display = hasActiveLoading ? 'block' : 'none';
        }
    }

    async initializeGallery() {
        try {
            await this.setLoadingState('gallery', true);
            
            this.galleryImages = [
                { src: 'assets/gallery-1.jpg', caption: 'Our engagement in the Irish countryside' },
                { src: 'assets/gallery-2.jpg', caption: 'Weekend at the Cliffs of Moher' },
                { src: 'assets/gallery-3.jpg', caption: 'Sunset walk along the Wild Atlantic Way' },
                { src: 'assets/gallery-4.jpg', caption: 'Cozy evening in our favorite pub' },
                { src: 'assets/gallery-5.jpg', caption: 'Exploring the Ring of Kerry together' },
                { src: 'assets/gallery-6.jpg', caption: 'Traditional Irish music session' },
                { src: 'assets/gallery-7.jpg', caption: 'Dancing at the local céilí' },
                { src: 'assets/gallery-8.jpg', caption: 'Picnic in Phoenix Park, Dublin' },
                { src: 'assets/gallery-9.jpg', caption: 'Our first Christmas together' },
                { src: 'assets/gallery-10.jpg', caption: 'Hiking in the Wicklow Mountains' },
                { src: 'assets/gallery-11.jpg', caption: 'Visiting the ancient sites of Newgrange' },
                { src: 'assets/gallery-12.jpg', caption: 'Planning our future together' }
            ];

            const galleryGrid = document.getElementById('galleryGrid');
            if (!galleryGrid) {
                console.warn('Gallery grid element not found');
                return;
            }

            // Preload images for better performance
            const imagePromises = this.galleryImages.map((image, index) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = image.src;
                });
            });

            await Promise.allSettled(imagePromises);

            this.galleryImages.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <img src="${image.src}" alt="${image.caption}" loading="lazy">
                `;
                
                this.addEventListenerTracked(item, 'click', () => this.openLightbox(index));
                galleryGrid.appendChild(item);
            });

            await this.setLoadingState('gallery', false);
        } catch (error) {
            console.error('Gallery initialization failed:', error);
            await this.setLoadingState('gallery', false);
        }
    }

    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const closeBtn = lightbox?.querySelector('.lightbox-close');
        const prevBtn = lightbox?.querySelector('.lightbox-prev');
        const nextBtn = lightbox?.querySelector('.lightbox-next');

        if (closeBtn) this.addEventListenerTracked(closeBtn, 'click', () => this.closeLightbox());
        if (prevBtn) this.addEventListenerTracked(prevBtn, 'click', () => this.navigateLightbox(-1));
        if (nextBtn) this.addEventListenerTracked(nextBtn, 'click', () => this.navigateLightbox(1));

        this.addEventListenerTracked(document, 'keydown', (e) => {
            if (lightbox?.classList.contains('active')) {
                switch(e.key) {
                    case 'ArrowLeft': 
                        this.navigateLightbox(-1); 
                        break;
                    case 'ArrowRight': 
                        this.navigateLightbox(1); 
                        break;
                    case 'Escape': 
                        this.closeLightbox(); 
                        break;
                }
            }
        });

        if (lightbox) {
            this.addEventListenerTracked(lightbox, 'click', (e) => {
                if (e.target === lightbox) this.closeLightbox();
            });
        }
    }

    openLightbox(index) {
        this.currentLightboxIndex = index;
        const lightbox = document.getElementById('lightbox');
        const image = lightbox?.querySelector('.lightbox-image');
        const caption = lightbox?.querySelector('.lightbox-caption');

        if (lightbox && image && caption && this.galleryImages[index]) {
            const currentImage = this.galleryImages[index];
            
            image.src = currentImage.src;
            image.alt = currentImage.caption;
            caption.textContent = currentImage.caption;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            this.trackEvent('gallery_image_viewed', {
                image_index: index,
                image_caption: currentImage.caption
            });
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    navigateLightbox(direction) {
        if (!this.galleryImages) return;

        this.currentLightboxIndex += direction;
        
        if (this.currentLightboxIndex < 0) {
            this.currentLightboxIndex = this.galleryImages.length - 1;
        } else if (this.currentLightboxIndex >= this.galleryImages.length) {
            this.currentLightboxIndex = 0;
        }

        const image = document.querySelector('.lightbox-image');
        const caption = document.querySelector('.lightbox-caption');
        const currentImage = this.galleryImages[this.currentLightboxIndex];

        if (image && caption && currentImage) {
            image.style.opacity = '0';
            setTimeout(() => {
                image.src = currentImage.src;
                image.alt = currentImage.caption;
                caption.textContent = currentImage.caption;
                image.style.opacity = '1';
            }, 100);
        }
    }

    initializeForm() {
        const form = document.getElementById('rsvpForm');
        if (!form) {
            console.warn('RSVP form not found');
            return;
        }

        const attendingRadios = document.querySelectorAll('input[name="attending"]');
        const guestCountGroup = document.querySelector('.guest-count-group');
        
        attendingRadios.forEach(radio => {
            this.addEventListenerTracked(radio, 'change', (e) => {
                if (e.target.value === 'yes') {
                    guestCountGroup?.classList.add('show');
                    if (guestCountGroup) guestCountGroup.style.display = 'block';
                    const guestCountInput = document.getElementById('guestCount');
                    if (guestCountInput) guestCountInput.required = true;
                } else {
                    guestCountGroup?.classList.remove('show');
                    setTimeout(() => {
                        if (guestCountGroup) guestCountGroup.style.display = 'none';
                    }, 300);
                    const guestCountInput = document.getElementById('guestCount');
                    if (guestCountInput) {
                        guestCountInput.required = false;
                        guestCountInput.value = '';
                    }
                }
                this.clearFieldError('attending');
            });
        });

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            this.addEventListenerTracked(input, 'blur', () => this.validateField(input));
            this.addEventListenerTracked(input, 'input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        this.addEventListenerTracked(form, 'submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }

    validateField(field) {
        if (!field) {
            console.warn('Field not found for validation');
            return false;
        }

        const fieldName = field.name;
        const value = field.value?.trim() || '';
        let isValid = true;
        let errorMessage = '';

        this.clearFieldError(fieldName);

        // Enhanced validation rules
        const validationRules = {
            fullName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s\-'\.]+$/,
                errorMessages: {
                    required: 'Please enter your full name',
                    minLength: 'Name must be at least 2 characters long',
                    pattern: 'Please enter a valid name (letters, spaces, hyphens, apostrophes only)'
                }
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                errorMessages: {
                    required: 'Please enter your email address',
                    pattern: 'Please enter a valid email address'
                }
            },
            phone: {
                pattern: /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/,
                errorMessages: {
                    pattern: 'Please enter a valid phone number'
                }
            },
            guestCount: {
                required: field.required,
                pattern: /^[1-4]$/,
                errorMessages: {
                    required: 'Please enter number of guests',
                    pattern: 'Guest count must be between 1 and 4'
                }
            }
        };

        const rules = validationRules[fieldName];
        if (!rules) return true;

        // Check required
        if (rules.required && !value) {
            isValid = false;
            errorMessage = rules.errorMessages.required;
        }
        // Check minimum length
        else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.errorMessages.minLength;
        }
        // Check pattern
        else if (rules.pattern && value && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.errorMessages.pattern;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Simple shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);

        const errorEl = document.getElementById(`${field.name}-error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.remove('error');
        }

        const errorEl = document.getElementById(`${fieldName}-error`);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
    }

    handleFormSubmission(form) {
        if (this.isSubmitting) return;

        let formIsValid = true;
        const fields = form.querySelectorAll('input, textarea');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                formIsValid = false;
            }
        });

        const attendingChecked = document.querySelector('input[name="attending"]:checked');
        if (!attendingChecked) {
            this.showFieldError(
                document.querySelector('input[name="attending"]'), 
                'Please select your attendance status'
            );
            formIsValid = false;
        } else {
            this.clearFieldError('attending');
        }

        if (!formIsValid) {
            this.trackEvent('form_validation_failed');
            return;
        }

        this.submitForm(form);
    }

    async submitForm(form) {
        this.isSubmitting = true;
        await this.setLoadingState('form', true);
        
        const submitBtn = form.querySelector('.submit-button');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
        }

        try {
            // In a real implementation, you would submit to your backend
            // const formData = new FormData(form);
            // const response = await fetch('/api/rsvp', {
            //     method: 'POST',
            //     body: formData
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            form.style.display = 'none';
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'block';
            }

            this.trackEvent('rsvp_submitted', {
                attending: document.querySelector('input[name="attending"]:checked')?.value,
                guest_count: document.getElementById('guestCount')?.value || '1'
            });

        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Failed to submit RSVP. Please try again.');
            this.trackEvent('rsvp_submission_failed', {
                error: error.message
            });
        } finally {
            this.isSubmitting = false;
            await this.setLoadingState('form', false);
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }
    }

    showErrorMessage(message) {
        // Create or show error message
        let errorDiv = document.getElementById('formErrorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'formErrorMessage';
            errorDiv.className = 'error-message global-error show';
            document.querySelector('.rsvp-form').appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }

    trackEvent(eventName, properties = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Segment or other analytics
        if (typeof analytics !== 'undefined') {
            analytics.track(eventName, properties);
        }

        console.log('Event tracked:', eventName, properties);
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    measurePerformance() {
        if ('performance' in window) {
            this.addEventListenerTracked(window, 'load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
                    
                    console.log('Page Load Time:', loadTime);
                    
                    // Track to analytics
                    this.trackEvent('performance_metrics', {
                        load_time: loadTime,
                        dom_content_loaded: domContentLoaded,
                        connection_type: navigator.connection?.effectiveType || 'unknown'
                    });
                }, 100);
            });
        }
    }

    // Helper method to track event listeners for cleanup
    addEventListenerTracked(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        this.eventListeners.push({ element, event, handler, options });
    }

    // Cleanup method for memory management
    destroy() {
        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        
        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        
        // Cancel animation frames
        this.animationFrames.forEach(frame => cancelAnimationFrame(frame));
        
        // Clear references
        this.eventListeners = [];
        this.observers = [];
        this.animationFrames = [];
        this.galleryImages = null;
    }
}

// CSS for shake animation and additional styles
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }

    .global-error {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    }

    .global-error.show {
        opacity: 1;
        transform: translateX(0);
    }

    .global-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
    }

    /* Performance optimizations */
    .parallax-active {
        will-change: transform;
    }

    /* Reduce motion support */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Restore normal cursor for users who prefer reduced motion
        document.documentElement.style.cursor = 'auto';
        document.body.style.cursor = 'auto';
        
        // Add style to show normal cursors
        const normalCursorStyle = document.createElement('style');
        normalCursorStyle.textContent = `
            *, *:hover, *:focus, *:active {
                cursor: auto !important;
            }
        `;
        document.head.appendChild(normalCursorStyle);
    }
    
    // Initialize the website
    window.weddingSite = new WeddingWebsite();
});

// Handle window resize with throttling
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.weddingSite && !window.weddingSite.isTouch) {
            // Trigger scroll event to recalculate parallax
            window.dispatchEvent(new Event('scroll'));
        }
    }, 250);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        if (document.hidden) {
            heroVideo.pause();
        } else {
            heroVideo.play().catch(e => console.warn('Video play failed:', e));
        }
    }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeddingWebsite;
}
