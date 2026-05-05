// presentation.js - Animations et interactions RadarPF (version améliorée)

document.addEventListener('DOMContentLoaded', () => {
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = String(new Date().getFullYear());

    initSyntaxHighlighting();
    initGSAP();
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initHeroAnimations();
    initBlips();
    initScrollytelling();
    initClimaxSection();
});

function initSyntaxHighlighting() {
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
}

function initGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
}

// Barre de progression du scroll
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', () => requestAnimationFrame(updateProgress));
    updateProgress();
}

// Barre îlot — effet au scroll (Kim Shoes)
function initNavbar() {
    const nav = document.getElementById('kimNavStack');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 50);
    }, { passive: true });
}

// Menu mobile
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    const mobileNav = document.getElementById('mobileNav');

    if (!btn || !mobileNav) return;

    btn.addEventListener('click', () => {
        nav.classList.toggle('menu-open');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('menu-open');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// Smooth scroll pour les ancres (hors liens vides # seuls, pour éviter querySelector invalide)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href === '#!') return;
            let target = null;
            try {
                target = document.querySelector(href);
            } catch {
                return;
            }
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Animations Hero
function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.badge-tech', { y: -30, opacity: 0, duration: 0.8 })
      .from('.reveal-text', { y: 50, opacity: 0, duration: 0.9, stagger: 0.15 }, '-=0.5')
      .from('.reveal-subtext', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.reveal-actions', { y: 25, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.hero-dashboard-wrapper', {
          y: 120,
          opacity: 0,
          rotationX: 25,
          duration: 1.4,
          ease: 'expo.out',
          onComplete: () => startDashboardFloat(),
      }, '-=1');
}

// Flottement du dashboard mockup
function startDashboardFloat() {
    const mockup = document.getElementById('dashboardMockup');
    if (!mockup || typeof gsap === 'undefined') return;

    gsap.to(mockup, {
        y: -12,
        rotationX: '8deg',
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
    });
}

// Blips animés sur la carte abstraite
function initBlips() {
    const abstractMap = document.getElementById('abstractMap');
    if (!abstractMap) return;

    const createBlip = () => {
        const types = ['fixed', 'mobile', 'tunnel', 'etf'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const top = 15 + Math.random() * 70;
        const left = 15 + Math.random() * 70;

        const dot = document.createElement('div');
        dot.className = `blip ${randomType}`;
        dot.style.top = `${top}%`;
        dot.style.left = `${left}%`;
        dot.style.transform = 'translate(-50%, -50%) scale(0)';
        dot.style.opacity = '1';

        abstractMap.appendChild(dot);

        if (typeof gsap !== 'undefined') {
            gsap.to(dot, {
                scale: 1,
                duration: 0.4,
                ease: 'back.out(2)',
                onComplete: () => {
                    gsap.to(dot, {
                        opacity: 0,
                        scale: 2,
                        duration: 1.2,
                        delay: 0.3,
                        ease: 'power2.in',
                        onComplete: () => dot.remove(),
                    });
                },
            });
        }
    };

    setInterval(() => {
        if (Math.random() > 0.6) {
            createBlip();
        }
    }, 900);
}

// Scrollytelling
function initScrollytelling() {
    const isDesktop = window.innerWidth > 900;
    const steps = document.querySelectorAll('.story-step');
    const visuals = document.querySelectorAll('.visual-item');

    if (!isDesktop || steps.length === 0) {
        steps.forEach((s, i) => {
            if (i === 0) s.classList.add('active');
            else s.classList.remove('active');
        });
        visuals.forEach((v, i) => {
            if (i === 0) v.classList.add('active');
            else v.classList.remove('active');
        });
        return;
    }

    const setActiveStep = (index) => {
        steps.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });

        visuals.forEach((v, i) => {
            v.classList.toggle('active', i === index);
            if (i === index) triggerVisualAnimation(i);
        });
    };

    if (typeof ScrollTrigger !== 'undefined') {
        steps.forEach((step, index) => {
            ScrollTrigger.create({
                trigger: step,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => setActiveStep(index),
                onEnterBack: () => setActiveStep(index),
            });
        });
    }

    setActiveStep(0);
}

// Animation spécifique par visual
function triggerVisualAnimation(index) {
    if (typeof gsap === 'undefined') return;

    if (index === 1) {
        gsap.fromTo(
            '.data-row',
            { x: 60, opacity: 0, scale: 0.95 },
            {
                x: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.15,
                duration: 0.7,
                ease: 'back.out(1.4)',
                overwrite: 'auto',
            }
        );
    } else if (index === 0 || index === 2) {
        gsap.fromTo(
            '.code-window',
            { y: 20, opacity: 0.9 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: 'auto',
            }
        );
    }
}

// Section Climax - Compteurs et animations
function initClimaxSection() {
    const climaxSection = document.querySelector('.climax-section');
    if (!climaxSection) return;

    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: climaxSection,
            start: 'top 75%',
            onEnter: () => {
                animateCounters();
                if (typeof gsap !== 'undefined') {
                    gsap.from('.climax-title, .climax-subtitle', {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power3.out',
                    });
                }
            },
            once: true,
        });
    } else {
        animateCounters();
    }
}

// Animation des compteurs
function animateCounters() {
    const counters = document.querySelectorAll('.count-up');
    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(
                counter,
                { innerHTML: 0 },
                {
                    innerHTML: target,
                    duration: 2.2,
                    snap: { innerHTML: 1 },
                    ease: 'power2.out',
                }
            );
        } else {
            counter.textContent = target;
        }
    });
}
