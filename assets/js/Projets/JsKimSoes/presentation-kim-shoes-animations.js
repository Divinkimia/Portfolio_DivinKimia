/**
 * Animations & effets 3D - KimShoes Presentation
 * Utilise Intersection Observer, requestAnimationFrame et prefers-reduced-motion
 */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.documentElement.classList.add('reduce-motion');
    }

    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = String(new Date().getFullYear());
    }

    // --- Smooth scroll (toujours actif) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // --- Scroll progress bar (toujours actif) ---
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        const updateProgress = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress.style.width = height > 0 ? (winScroll / height) * 100 + '%' : '0%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // --- Nav îlot : léger renforcement au scroll ---
    const kimNavStack = document.querySelector('.kim-nav-stack');
    if (kimNavStack) {
        const updateNav = () => kimNavStack.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', updateNav, { passive: true });
        updateNav();
    }

    if (prefersReducedMotion) return;

    // --- Intersection Observer : animations au scroll ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const animateIn = (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            el.classList.add('is-visible');

            observer.unobserve(el);
        });
    };

    const observer = new IntersectionObserver(animateIn, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('[data-animate-stagger] .feature-card, [data-animate-stagger] .arch-point, [data-animate-stagger] .code-window, [data-animate-stagger] .diagram-box, [data-animate-stagger] .stack-row, [data-animate-stagger] .parcours-card').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.section-divider, .statuts-badge').forEach(el => observer.observe(el));

    // --- Animation d'entrée Hero (au chargement) ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const children = heroContent.querySelectorAll('.badge, h1 .title-line, h1 .title-gradient, .hero-desc, .hero-buttons');
        children.forEach((child, i) => {
            child.style.animationDelay = `${i * 0.12}s`;
            child.classList.add('hero-reveal');
        });
    }

    const heroIllustration = document.querySelector('.browser-mockup');
    if (heroIllustration) {
        heroIllustration.classList.add('hero-reveal');
        heroIllustration.style.animationDelay = '0.4s';
    }

    const stackIcons = document.querySelectorAll('.stack-icon');
    stackIcons.forEach((icon, i) => {
        icon.style.animationDelay = `${0.6 + i * 0.08}s`;
        icon.classList.add('stack-pop');
    });

    // --- Effet 3D tilt au survol (throttlé avec rAF) ---
    let ticking = false;
    let lastMouse = { x: 0, y: 0 };

    const applyTilt = (el, rect, x, y) => {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (y - centerY) / 40;
        const rotateY = (centerX - x) / 40;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    };

    const resetTilt = (el) => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    const handleMouseMove = (e) => {
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;

        if (!ticking) {
            requestAnimationFrame(() => {
                document.querySelectorAll('.feature-card, .browser-mockup, .code-window').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const inView = lastMouse.x >= rect.left && lastMouse.x <= rect.right &&
                        lastMouse.y >= rect.top && lastMouse.y <= rect.bottom;

                    if (inView) {
                        applyTilt(el, rect, lastMouse.x, lastMouse.y);
                        el.classList.add('has-tilt');
                    } else {
                        resetTilt(el);
                        el.classList.remove('has-tilt');
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    };

    const handleMouseLeave = () => {
        document.querySelectorAll('.feature-card, .browser-mockup, .code-window').forEach(el => {
            resetTilt(el);
            el.classList.remove('has-tilt');
        });
    };

    const prefersHover = window.matchMedia('(hover: hover)').matches;
    if (prefersHover) {
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.body.addEventListener('mouseleave', handleMouseLeave);
    }

    // --- Parallax léger sur le hero (au scroll) ---
    let lastScrollY = 0;
    let scrollTicking = false;

    const onScroll = () => {
        lastScrollY = window.scrollY;

        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const hero = document.getElementById('hero');
                const illustration = document.querySelector('.hero-illustration');
                if (hero && illustration) {
                    const rect = hero.getBoundingClientRect();
                    const maxY = hero.offsetHeight * 0.5;
                    if (rect.bottom > 0) {
                        const y = Math.min(lastScrollY * 0.12, maxY);
                        illustration.style.transform = `translate3d(0, ${y}px, 0)`;
                    } else {
                        illustration.style.transform = 'translate3d(0, 0, 0)';
                    }
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

})();
