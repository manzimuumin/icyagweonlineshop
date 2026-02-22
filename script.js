(function() {
    // ==================== BACK TO TOP ====================
    const btt = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btt.classList.toggle('show', window.scrollY > 300);
    });

    // ==================== DROPDOWNS ====================
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(drop => {
        const trigger = drop.querySelector('.dropdown-trigger');
        const menu = drop.querySelector('.dropdown-menu');
        if (!trigger || !menu) return;

        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdowns.forEach(other => {
                if (other !== drop) other.querySelector('.dropdown-menu')?.classList.remove('show');
            });
            menu.classList.toggle('show');
        });

        document.addEventListener('click', e => {
            if (!drop.contains(e.target)) menu.classList.remove('show');
        });
    });

    // ==================== DARK MODE ====================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            icon.className = 'fas fa-sun';
        }
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ==================== LOGOUT ====================
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Do you want to log out?')) alert('You have logged out.');
        });
    }

    // ==================== CART ====================
    const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
    const saveCart = cart => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };
    const updateCartCount = () => {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const count = document.getElementById('cartCount');
        if (count) count.textContent = total;
    };
    const showAddedMessage = (el) => {
        const msg = document.createElement('span');
        msg.textContent = '✓ Added';
        Object.assign(msg.style, {
            position: 'absolute',
            background: 'var(--secondary)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            top: '-10px',
            right: '30px',
            zIndex: '10',
            opacity: '0',
            transition: 'opacity 0.2s'
        });
        el.style.position = 'relative';
        el.appendChild(msg);
        setTimeout(() => msg.style.opacity = '1', 10);
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 200);
        }, 1500);
    };

    window.addToCartFromCard = function(plusElement) {
        const card = plusElement.closest('.product-card-new');
        if (!card) return;
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        const desc = card.dataset.description || '';
        const imgContainer = card.querySelector('.product-img-new');
        let imageType = 'icon', imageSrc = 'box', imageHtml = '';
        if (imgContainer) {
            const img = imgContainer.querySelector('img');
            if (img) {
                imageType = 'image';
                imageSrc = img.src;
                imageHtml = img.outerHTML;
            } else {
                const icon = imgContainer.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    const match = iconClass.match(/fa-([a-z-]+)/);
                    imageSrc = match ? match[1] : 'box';
                    imageType = 'icon';
                    imageHtml = icon.outerHTML;
                }
            }
        }
        const cart = getCart();
        const existing = cart.find(item => item.id == id);
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else cart.push({ id, name, price, description: desc, imageType, imageSrc, imageHtml, quantity: 1 });
        saveCart(cart);
        showAddedMessage(plusElement);
    };

    // ==================== MODAL ====================
    const modal = document.getElementById('productModal');
    const closeModal = document.getElementById('closeModal');
    const modalImage = document.getElementById('modalImageContainer');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDescription');
    const modalAddBtn = document.getElementById('modalAddToCart');
    let currentProductCard = null;

    document.querySelectorAll('.product-img-new, .product-title-new').forEach(el => {
        el.addEventListener('click', function(e) {
            const card = this.closest('.product-card-new');
            if (!card) return;
            currentProductCard = card;
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = card.dataset.price;
            const desc = card.dataset.description || '';
            const imageContent = card.querySelector('.product-img-new').innerHTML;
            modalTitle.textContent = name;
            modalPrice.textContent = `$${parseFloat(price).toFixed(2)}`;
            modalDesc.textContent = desc;
            modalImage.innerHTML = imageContent;
            modal.dataset.id = id;
            modal.dataset.name = name;
            modal.dataset.price = price;
            modal.classList.add('show');
        });
    });

    closeModal.addEventListener('click', () => modal.classList.remove('show'));
    window.addEventListener('click', (e) => e.target === modal && modal.classList.remove('show'));

    modalAddBtn.addEventListener('click', () => {
        if (!currentProductCard) return;
        const id = currentProductCard.dataset.id;
        const name = currentProductCard.dataset.name;
        const price = currentProductCard.dataset.price;
        const desc = currentProductCard.dataset.description || '';
        const imgContainer = currentProductCard.querySelector('.product-img-new');
        let imageType = 'icon', imageSrc = 'box', imageHtml = '';
        if (imgContainer) {
            const img = imgContainer.querySelector('img');
            if (img) {
                imageType = 'image';
                imageSrc = img.src;
                imageHtml = img.outerHTML;
            } else {
                const icon = imgContainer.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    const match = iconClass.match(/fa-([a-z-]+)/);
                    imageSrc = match ? match[1] : 'box';
                    imageType = 'icon';
                    imageHtml = icon.outerHTML;
                }
            }
        }
        const cart = getCart();
        const existing = cart.find(item => item.id == id);
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else cart.push({ id, name, price: parseFloat(price), description: desc, imageType, imageSrc, imageHtml, quantity: 1 });
        saveCart(cart);
        modal.classList.remove('show');
        showAddedMessage(modalAddBtn);
    });

    // ==================== HERO SLIDESHOW (UPDATED FOR MOBILE & NONSTOP) ====================
    (function() {
        const container = document.getElementById('heroSlideshow');
        if (!container) {
            console.error('Slideshow container not found!');
            return;
        }

        // ========== YOUR MEDIA PATHS ==========
        const mediaList = [
            { type: 'video', src: 'video/vd1.hd.mp4.mp4' },
            { type: 'video', src: 'video/vd2.hd.mp4.mp4' },
            { type: 'video', src: 'video/vd3.hd.mp4.mp4' },
            { type: 'video', src: 'video/vd6.hd.mp4.mp4' }
        ];

        console.log('Building slides with mediaList:', mediaList);

        mediaList.forEach((media, index) => {
            let element;
            if (media.type === 'image') {
                element = document.createElement('img');
                element.src = media.src;
                element.alt = `Slide ${index+1}`;
                element.onerror = () => console.error(`Failed to load image: ${media.src}`);
            } else {
                element = document.createElement('video');
                element.src = media.src;
                element.loop = false;               // we want to advance after video ends, not loop
                element.muted = true;                // required for autoplay on most devices
                element.playsInline = true;           // important for iOS
                element.preload = 'auto';              // helps with playback
                element.autoplay = false;              // will be started when slide becomes active
                element.onerror = (e) => {
                    console.error(`Video error (${media.src}):`, e);
                };
                element.onloadeddata = () => console.log(`Video loaded: ${media.src}`);
            }
            element.classList.add('slide');
            if (index === 0) element.classList.add('active');
            container.appendChild(element);
        });

        const slides = document.querySelectorAll('#heroSlideshow .slide');
        console.log(`Total slides created: ${slides.length}`);
        if (slides.length === 0) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        let timeoutId = null;

        function goToSlide(index) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }

            // Pause current slide if it's a video
            if (slides[currentSlide].tagName === 'VIDEO') {
                slides[currentSlide].pause();
            }

            // Update active class
            slides[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');

            const current = slides[currentSlide];

            if (current.tagName === 'VIDEO') {
                // Reset video to start (in case it was partially played)
                current.currentTime = 0;
                const playPromise = current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Video autoplay failed, moving to next slide:', error);
                        // If play fails, move to next slide after a short delay
                        timeoutId = setTimeout(() => {
                            goToSlide((currentSlide + 1) % totalSlides);
                        }, 2000);
                    });
                }
                // When video ends, go to next slide
                const onEnded = function() {
                    console.log('Video ended, moving to next slide');
                    goToSlide((currentSlide + 1) % totalSlides);
                    current.removeEventListener('ended', onEnded);
                };
                current.addEventListener('ended', onEnded);
            } else {
                // Image: set timer to advance
                timeoutId = setTimeout(() => {
                    goToSlide((currentSlide + 1) % totalSlides);
                }, 6000);
            }
        }

        // Start the slideshow
        goToSlide(0);
    })();

    // ==================== TICKER CLICK ====================
    document.querySelectorAll('.ticker-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.innerText.replace(/[^a-zA-Z ]/g, '').trim();
            alert(`You clicked on ${category}. (Filter would apply here.)`);
        });
    });

    // ==================== SUBSCRIPTION FORM ====================
    document.querySelector('.subscription-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your 15% discount code has been sent.');
        e.target.reset();
    });

    // ==================== TESTIMONIALS SLIDER ====================
    let testimonialIndex = 0;
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    if (testimonialSlides.length) {
        const showTestimonial = (n) => {
            testimonialIndex = (n + testimonialSlides.length) % testimonialSlides.length;
            testimonialSlides.forEach(s => s.classList.remove('active'));
            testimonialSlides[testimonialIndex].classList.add('active');
        };
        window.moveTestimonial = (delta) => showTestimonial(testimonialIndex + delta);
        showTestimonial(0);
        setInterval(() => { testimonialIndex++; showTestimonial(testimonialIndex); }, 6000);
    }

    // ==================== INIT ====================
    updateCartCount();

    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
})();
