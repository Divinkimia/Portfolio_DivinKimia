/**
 * FS Barber — Présentation projet
 * Interactif type Apple : scroll reveal, parallax, smooth scroll, copie des blocs de code
 */

(function () {
    'use strict';

    const sections = document.querySelectorAll('[data-scroll]');
    const hero = document.querySelector('.premium-hero');
    const heroContent = document.querySelector('.premium-hero-content');

    function initHighlightJs() {
        if (typeof hljs === 'undefined') return;
        hljs.highlightAll();
    }

    function initCodeCopy() {
        document.querySelectorAll('.code-block-copy').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const block = btn.closest('.code-block');
                const codeEl = block && block.querySelector('pre code');
                if (!codeEl) return;

                const text = codeEl.textContent || '';
                const copyLabel = btn.getAttribute('data-copy-label') || 'Copier';
                const copiedLabel = btn.getAttribute('data-copied-label') || 'Copié !';
                const labelEl = btn.querySelector('.code-block-copy-text');
                const prevTitle = btn.getAttribute('title');
                const prevAria = btn.getAttribute('aria-label');

                try {
                    await navigator.clipboard.writeText(text);
                    btn.classList.add('is-copied');
                    if (labelEl) {
                        labelEl.textContent = copiedLabel;
                    } else {
                        btn.setAttribute('aria-label', copiedLabel);
                        if (prevTitle !== null) btn.setAttribute('title', copiedLabel);
                    }
                    clearTimeout(btn._copyReset);
                    btn._copyReset = setTimeout(() => {
                        btn.classList.remove('is-copied');
                        if (labelEl) {
                            labelEl.textContent = copyLabel;
                        } else {
                            if (prevAria !== null) btn.setAttribute('aria-label', prevAria);
                            else btn.removeAttribute('aria-label');
                            if (prevTitle !== null) btn.setAttribute('title', prevTitle);
                            else btn.removeAttribute('title');
                        }
                    }, 2200);
                } catch (err) {
                    if (labelEl) {
                        labelEl.textContent = 'Erreur';
                        setTimeout(() => {
                            labelEl.textContent = copyLabel;
                        }, 2000);
                    } else {
                        btn.setAttribute('aria-label', 'Erreur de copie');
                        setTimeout(() => {
                            if (prevAria !== null) btn.setAttribute('aria-label', prevAria);
                            else btn.removeAttribute('aria-label');
                        }, 2000);
                    }
                }
            });
        });
    }

    function initScrollReveal() {
        if (!sections.length) return;

        const options = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.06
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, options);

        sections.forEach((section) => observer.observe(section));
    }

    function initParallax() {
        if (!hero || !heroContent) return;

        function onScroll() {
            const rect = hero.getBoundingClientRect();
            const h = window.innerHeight;
            if (rect.top < h) {
                const rate = Math.max(0, 1 - rect.top / h);
                const move = rate * 24;
                if (heroContent) heroContent.style.transform = 'translateY(' + move + 'px)';
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || !href) return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function initScrollytelling() {
        const scrollyItems = document.querySelectorAll('.scrolly-item');
        const screens = document.querySelectorAll('.screen-content');

        if (!scrollyItems.length || !screens.length) return;

        const scrollyOptions = {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0
        };

        const scrollyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const step = entry.target.getAttribute('data-step');

                    scrollyItems.forEach((item) => item.classList.remove('is-active'));
                    entry.target.classList.add('is-active');

                    screens.forEach((screen) => {
                        if (screen.getAttribute('data-screen') === step) {
                            screen.classList.add('is-active');
                        } else {
                            screen.classList.remove('is-active');
                        }
                    });
                }
            });
        }, scrollyOptions);

        scrollyItems.forEach((item) => scrollyObserver.observe(item));

        if (scrollyItems[0]) {
            scrollyItems[0].classList.add('is-active');
            if (screens[0]) screens[0].classList.add('is-active');
        }
    }

    function initFooterYear() {
        const yearEl = document.getElementById('footer-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    function initBackToTop() {
        document.querySelectorAll('.back-to-top').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    function init() {
        initHighlightJs();
        initCodeCopy();
        initScrollReveal();
        initParallax();
        initSmoothScroll();
        initScrollytelling();
        initFooterYear();
        initBackToTop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
