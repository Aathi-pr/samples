/**
 * Enhanced Wedding RSVP Website with GSAP ScrollSynced Carousel
 */

// GSAP ScrollSmoother Setup
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
    autoRefreshEvents: "DOMContentLoaded,load"
});

class WeddingWebsite {
    constructor() {
        this.isTouch = this.detectTouch();
        this.swipers = [];
        this.init();
    }

    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    init() {
        // Initialize ScrollSmoother for desktop
        if (!this.isTouch) {
            this.initScrollSmoother();
        } else {
            document.body.classList.add('normalize-scroll', 'is-touch');
        }

        // Initialize all components
        this.setupLoader();
        this.setupNavigation();
        this.setupHeroParallax();
        this.initializeGalleryData();
        this.initializeCarousels();
        this.initializeForm();
        this.setupLightbox();
        this.hideAppBlocker();
    }

    initScrollSmoother() {
        if (typeof ScrollSmoother !== 'undefined') {
            this.smoother = ScrollSmoother.create({
                wrapper: ".viewport-wrapper",
                content: ".content-scroll",
                smooth: 1.2,
                effects: true,
                smoothTouch: 0.1,
                normalizeScroll: false,
                ignoreMobileResize: true,
                onUpdate: (self) => {
                    // Optional: Add custom scroll update logic
                }
            });
        }
    }

    hideAppBlocker() {
        setTimeout(() => {
            const blocker = document.getElementById('app_blocker');
            if (blocker) {
                blocker.classList.add('hide');
            }
        }, 1000);
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
            }, 2000);
        });
    }

    setupNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        
        // Mobile navigation toggle
        navToggle?.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks?.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile nav
                    navToggle?.classList.remove('active');
                    navLinks?.classList.remove('active');
                    
                    // Smooth scroll
                    if (this.smoother) {
                        this.smoother.scrollTo(targetElement, true, "top 100px");
                    } else {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Scroll spy
        this.initScrollSpy();

        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        scrollIndicator?.addEventListener('click', () => {
            const detailsSection = document.getElementById('details');
            if (this.smoother) {
                this.smoother.scrollTo(detailsSection, true, "top 100px");
            } else {
                detailsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // CTA button
        const ctaButton = document.querySelector('.cta-button[data-scroll-to]');
        ctaButton?.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.dataset.scrollTo;
            const targetElement = document.querySelector(target);
            if (targetElement) {
                if (this.smoother) {
                    this.smoother.scrollTo(targetElement, true, "top 100px");
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('section[id], .swiper-slide[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    });
                    
                    const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        activeLink.setAttribute('aria-current', 'page');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupHeroParallax() {
        if (!this.isTouch) {
            // Enhanced parallax effects with GSAP
            gsap.to(".hero-video", {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.to(".ornament-1", {
                x: 100,
                y: -50,
                rotation: 45,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.to(".ornament-2", {
                x: -80,
                y: 30,
                rotation: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }

    initializeGalleryData() {
        // Gallery data
        this.galleryImages = [
            { src: 'assets/gallery-1.jpg', caption: 'Our first date at the coffee shop' },
            { src: 'assets/gallery-2.jpg', caption: 'Weekend getaway in the mountains' },
            { src: 'assets/gallery-3.jpg', caption: 'The proposal at sunset beach' },
            { src: 'assets/gallery-4.jpg', caption: 'Celebrating with family and friends' },
            { src: 'assets/gallery-5.jpg', caption: 'Our engagement photoshoot' },
            { src: 'assets/gallery-6.jpg', caption: 'Choosing the perfect venue' },
            { src: 'assets/gallery-7.jpg', caption: 'Cake tasting adventures' },
            { src: 'assets/gallery-8.jpg', caption: 'Dancing lessons preparation' },
            { src: 'assets/gallery-9.jpg', caption: 'Wedding dress shopping day' },
            { src: 'assets/gallery-10.jpg', caption: 'Rehearsal dinner memories' },
            { src: 'assets/gallery-11.jpg', caption: 'Bachelor and bachelorette parties' },
            { src: 'assets/gallery-12.jpg', caption: 'Final preparations before the big day' }
        ];

        // Generate gallery HTML
        const galleryWrapper = document.getElementById('galleryWrapper');
        if (galleryWrapper) {
            this.galleryImages.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide no-interaction';
                slide.innerHTML = `
                    <div class="card gallery-card" data-index="${index}">
                        <div class="media-container">
                            <picture>
                                <img class="fit-cover middle-center" src="${image.src}" 
                                     width="800" height="600" alt="${image.caption}" 
                                     loading="lazy" decoding="async">
                            </picture>
                        </div>
                        <div class="card-text">
                            <h3 class="title">Memory ${index + 1}</h3>
                            <p>${image.caption}</p>
                        </div>
                    </div>
                `;
                
                // Add click event for lightbox
                slide.addEventListener('click', () => this.openLightbox(index));
                
                galleryWrapper.appendChild(slide);
            });
        }
    }

    initializeCarousels() {
        const carousels = document.querySelectorAll('.carousel');
        
        carousels.forEach((carousel, carouselIndex) => {
            const swiperContainer = carousel.querySelector('.swiper-container');
            if (!swiperContainer) return;

            // Create Swiper instance
            const swiper = new Swiper(swiperContainer, {
                slidesPerView: 'auto',
                spaceBetween: 24,
                speed: 800,
                grabCursor: !this.isTouch,
                allowTouchMove: this.isTouch,
                pagination: {
                    el: carousel.querySelector('.swiper-pagination'),
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                },
                navigation: {
                    nextEl: carousel.querySelector('.swiper-next'),
                    prevEl: carousel.querySelector('.swiper-prev'),
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1.05,
                        spaceBetween: 12,
                    },
                    768: {
                        slidesPerView: 2.25,
                        spaceBetween: 24,
                    }
                }
            });

            this.swipers.push(swiper);

            // GSAP ScrollTrigger for scroll-synced animation
            if (!this.isTouch && carousel.hasAttribute('data-scrub')) {
                this.setupScrollSyncedCarousel(carousel, swiper, carouselIndex);
            }
        });
    }

    setupScrollSyncedCarousel(carousel, swiper, index) {
        const wrapper = carousel.querySelector('.swiper-wrapper');
        const slides = carousel.querySelectorAll('.swiper-slide');
        
        if (!wrapper || slides.length === 0) return;

        // Calculate total scroll distance
        const slideWidth = slides[0].offsetWidth + 24; // width + gap
        const totalScrollDistance = slideWidth * (slides.length - 1);

        // Create scroll-triggered animation
        const scrollTrigger = ScrollTrigger.create({
            trigger: carousel,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const translateX = -progress * totalScrollDistance;
                
                // Update swiper position
                if (wrapper) {
                    wrapper.style.transform = `translate3d(${translateX}px, 0, 0)`;
                }

                // Update pagination
                const activeIndex = Math.round(progress * (slides.length - 1));
                const bullets = carousel.querySelectorAll('.swiper-pagination-bullet');
                bullets.forEach((bullet, i) => {
                    bullet.classList.toggle('swiper-pagination-bullet-active', i === activeIndex);
                });
            }
        });

        // Store reference for cleanup
        carousel.scrollTrigger = scrollTrigger;

        // Animate individual elements within slides
        slides.forEach((slide, slideIndex) => {
            const card = slide.querySelector('.card');
            const image = slide.querySelector('img');
            const text = slide.querySelector('.card-text');

            if (card) {
                gsap.fromTo(card,
                    {
                        y: 100,
                        opacity: 0,
                        scale: 0.9
                    },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: slide,
                            start: "left right",
                            end: "right left",
                            scrub: 1,
                            horizontal: true
                        }
                    }
                );
            }

            if (image) {
                gsap.fromTo(image,
                    {
                        scale: 1.2
                    },
                    {
                        scale: 1,
                        duration: 1.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: slide,
                            start: "left right",
                            end: "right left",
                            scrub: 1,
                            horizontal: true
                        }
                    }
                );
            }
        });
    }

    // Lightbox functionality
    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const closeBtn = lightbox?.querySelector('.lightbox-close');
        const prevBtn = lightbox?.querySelector('.lightbox-prev');
        const nextBtn = lightbox?.querySelector('.lightbox-next');

        closeBtn?.addEventListener('click', () => this.closeLightbox());
        prevBtn?.addEventListener('click', () => this.navigateLightbox(-1));
        nextBtn?.addEventListener('click', () => this.navigateLightbox(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
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

        // Close on background click
        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
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
            lightbox.setAttribute('aria-hidden', 'false');
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
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
            }, 150);
        }
    }

    // Form functionality
    initializeForm() {
        const form = document.getElementById('rsvpForm');
        const attendingRadios = document.querySelectorAll('input[name="attending"]');
        const guestCountGroup = document.querySelector('.guest-count-group');
        
        // Show/hide guest count based on attendance selection
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

        // Real-time validation
        const inputs = form?.querySelectorAll('input, textarea');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        // Form submission
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

            case 'phone':
                if (value) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
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
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 500);

        const errorEl = document.getElementById(`${field.name}-error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }

        field.setAttribute('aria-invalid', 'true');
    }

    clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
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

        // Validate attendance radio group
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
            const firstError = form.querySelector('.error');
            if (firstError) {
                if (this.smoother) {
                    this.smoother.scrollTo(firstError, true, "center center");
                } else {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
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
                
                if (this.smoother) {
                    this.smoother.scrollTo(successMessage, true, "center center");
                } else {
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            
            this.isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }, 1500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weddingSite = new WeddingWebsite();
});
