
class WeddingWebsite {
    constructor() {
        this.isTouch = this.detectTouch();
        this.isSubmitting = false;
        this.currentLightboxIndex = 0;
        // this.customCursor = null;
        this.init();
    }

    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    init() {
        this.setupLoader();
        this.setupComplexParallax();
        this.setupScrollAnimations();
        this.initializeGallery();
        this.initializeForm();
        this.setupLightbox();
        this.setupScrollIndicator();
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

    setupComplexParallax() {
        if (this.isTouch) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Hero video parallax with zoom effect
            const heroVideo = document.querySelector('.hero-video');
            if (heroVideo) {
                const scale = 1 + (scrolled * 0.0003);
                heroVideo.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }

            // Complex background parallax
            document.querySelectorAll('.parallax-bg').forEach((bg, index) => {
                const rect = bg.closest('.parallax-section').getBoundingClientRect();
                const elementTop = rect.top;
                const elementHeight = rect.height;
                const windowCenter = windowHeight / 2;
                
                const elementCenter = elementTop + (elementHeight / 2);
                const distanceFromCenter = (windowCenter - elementCenter) / windowHeight;
                
                const speed = 0.3 + (index * 0.15);
                const yOffset = distanceFromCenter * speed * 100;
                const scale = 1.1 + Math.abs(distanceFromCenter) * 0.05;
                
                bg.style.transform = `translateY(${yOffset}px) scale(${scale})`;
            });

            // Image parallax
            document.querySelectorAll('.parallax-image').forEach((img, index) => {
                const rect = img.getBoundingClientRect();
                const speed = index % 2 === 0 ? 0.3 : -0.3;
                const yOffset = (windowHeight - rect.top) * speed;
                
                img.style.transform = `translateY(${yOffset}px)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });

        // Mouse parallax for depth
        document.addEventListener('mousemove', (e) => {
            const mouseXPercent = (e.clientX / window.innerWidth) - 0.5;
            const mouseYPercent = (e.clientY / window.innerHeight) - 0.5;

            // Subtle parallax on UI elements
            document.querySelectorAll('.boxy-ui').forEach((element, index) => {
                const speed = 3 + (index % 3);
                const x = mouseXPercent * speed;
                const y = mouseYPercent * speed;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
            });

            // Hero content mouse tracking
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const x = mouseXPercent * 8;
                const y = mouseYPercent * 8;
                heroContent.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }

    setupScrollAnimations() {
        // Basic scroll animations without GSAP dependency
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0px) scale(1)';
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
    }

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const storySection = document.getElementById('story');
                if (storySection) {
                    storySection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    initializeGallery() {
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
        if (galleryGrid) {
            this.galleryImages.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <img src="${image.src}" alt="${image.caption}" loading="lazy">
                `;
                
                item.addEventListener('click', () => this.openLightbox(index));
                galleryGrid.appendChild(item);
            });
        }
    }

    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const closeBtn = lightbox?.querySelector('.lightbox-close');
        const prevBtn = lightbox?.querySelector('.lightbox-prev');
        const nextBtn = lightbox?.querySelector('.lightbox-next');

        closeBtn?.addEventListener('click', () => this.closeLightbox());
        prevBtn?.addEventListener('click', () => this.navigateLightbox(-1));
        nextBtn?.addEventListener('click', () => this.navigateLightbox(1));

        document.addEventListener('keydown', (e) => {
            if (lightbox?.classList.contains('active')) {
                switch(e.key) {
                    case 'ArrowLeft': this.navigateLightbox(-1); break;
                    case 'ArrowRight': this.navigateLightbox(1); break;
                    case 'Escape': this.closeLightbox(); break;
                }
            }
        });

        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });
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
        const attendingRadios = document.querySelectorAll('input[name="attending"]');
        const guestCountGroup = document.querySelector('.guest-count-group');
        
        attendingRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
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

        const inputs = form?.querySelectorAll('input, textarea');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        this.clearFieldError(fieldName);

        switch(fieldName) {
            case 'fullName':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please enter your full name';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please enter your email address';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'guestCount':
                if (field.required) {
                    const count = parseInt(value, 10);
                    if (isNaN(count)) {
                        isValid = false;
                        errorMessage = 'Please enter number of guests';
                    } else if (count < 1 || count > 4) {
                        isValid = false;
                        errorMessage = 'Guest count must be between 1 and 4';
                    }
                }
                break;
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
            return;
        }

        this.submitForm(form);
    }

    submitForm(form) {
        this.isSubmitting = true;
        const submitBtn = form.querySelector('.submit-button');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
        }

        setTimeout(() => {
            form.style.display = 'none';
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            this.isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }, 1500);
    }
}

// CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
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

// Handle window resize
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        if (window.weddingSite && !window.weddingSite.isTouch) {
            window.dispatchEvent(new Event('scroll'));
        }
    }, 250);
});
