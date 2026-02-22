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

    // ==================== HERO SLIDESHOW (6 slides, non‑stop) ====================
    (function() {
        const container = document.getElementById('heroSlideshow');
        if (!container) return;

        // ----- DEFINE YOUR 6 SLIDES (adjust paths as needed) -----
        const mediaList = [
            { type: 'video', src: 'video/vd1.hd.mp4.mp4' },
            { type: 'video', src: 'video/vd2.hd.mp4.mp4' },
            { type: 'video', src: 'video/vd3.hd.mp4.mp4' },
            { type: 'video', src: 'video/vd6.hd.mp4.mp4' },
            // Add two more slides – replace with your own files
            { type: 'video', src: 'video/vd7.mp4' },       // new video
            { type: 'image', src: 'img/placeholder.jpg' }  // or an image
        ];

        container.innerHTML = ''; // clear existing

        mediaList.forEach((media, index) => {
            let element;
            if (media.type === 'image') {
                element = document.createElement('img');
                element.src = media.src;
                element.alt = `Slide ${index+1}`;
                element.onerror = () => console.warn(`Image failed: ${media.src}`);
            } else {
                element = document.createElement('video');
                element.src = media.src;
                element.muted = true;          // MUST be muted for autoplay
                element.playsInline = true;     // crucial for iOS
                element.preload = 'auto';
                element.loop = false;           // we advance manually
                element.onerror = (e) => {
                    console.warn(`Video error (${media.src}):`, e);
                    element.classList.add('failed');
                };
            }
            element.classList.add('slide');
            if (index === 0) element.classList.add('active');
            container.appendChild(element);
        });

        const slides = document.querySelectorAll('#heroSlideshow .slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        let timeoutId = null;

        function goToSlide(index) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }

            if (slides[currentSlide].tagName === 'VIDEO') {
                slides[currentSlide].pause();
            }

            slides[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');

            const current = slides[currentSlide];

            if (current.classList.contains('failed')) {
                timeoutId = setTimeout(() => {
                    goToSlide((currentSlide + 1) % totalSlides);
                }, 2000);
                return;
            }

            if (current.tagName === 'VIDEO') {
                current.currentTime = 0;
                const playPromise = current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Autoplay prevented, moving to next slide:', error);
                        timeoutId = setTimeout(() => {
                            goToSlide((currentSlide + 1) % totalSlides);
                        }, 2000);
                    });
                }
                const onEnded = function() {
                    goToSlide((currentSlide + 1) % totalSlides);
                    current.removeEventListener('ended', onEnded);
                };
                current.addEventListener('ended', onEnded);
            } else {
                timeoutId = setTimeout(() => {
                    goToSlide((currentSlide + 1) % totalSlides);
                }, 6000);
            }
        }

        goToSlide(0);
    })();

    // ==================== CATEGORY PANEL CLICKABLE ON MOBILE ====================
    const catBtn = document.querySelector('.categories-btn');
    const catPanel = document.querySelector('.category-panel');
    if (catBtn && catPanel) {
        catBtn.addEventListener('click', (e) => {
            e.preventDefault();
            catPanel.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!catBtn.contains(e.target) && !catPanel.contains(e.target)) {
                catPanel.classList.remove('show');
            }
        });
    }

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
