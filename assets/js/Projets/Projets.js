/**
 * Adaptation Projets Phares - Script
 * Gère le scroll horizontal, le filtrage des projets et l'interactivité.
 */
document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initProjectFilter();
    initFooter();
    initCursorEffects();
    initFeaturedVideosHoverPlayback();
    initPrefetchProjectPresentations();
});

/* ========================================
   PROJETS PHARES - Scroll horizontal
   ======================================== */
function initHorizontalScroll() {
    const section = document.querySelector('.horizontal-scroll-section');
    const track = document.querySelector('.horizontal-track');

    if (!section || !track) return;

    // Vérification de la taille d'écran
    const isLargeScreen = () => window.innerWidth > 768;

    const handleScroll = () => {
        if (!isLargeScreen()) {
            track.style.transform = 'none';
            return;
        }

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;

        // Calcul de la progression (0 à 1)
        const scrollDistance = -sectionTop;
        const maxScroll = sectionHeight - viewportHeight;

        let progress = 0;
        if (scrollDistance > 0 && scrollDistance <= maxScroll) {
            progress = scrollDistance / maxScroll;
        } else if (scrollDistance > maxScroll) {
            progress = 1;
        } else {
            progress = 0;
        }

        // Calcul de la translation maximale (largeur totale - largeur vue)
        const trackWidth = track.scrollWidth;
        const containerWidth = window.innerWidth;
        const maxTranslate = trackWidth - containerWidth;

        const translateX = -progress * maxTranslate;
        track.style.transform = `translateX(${translateX}px)`;
    };

    // Optimisation de la performance
    let ticking = false;
    const requestScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', () => {
        handleScroll();
    });

    // Initialisation au chargement
    handleScroll();
}

/* ========================================
   FILTRAGE DES PROJETS - Grille filtrable
   ======================================== */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const loadMoreBtn = document.querySelector('.projects-load-more-btn');
    const initialVisibleLimit = 6;
    let currentFilter = 'all';
    let showAllProjects = false;
    
    if (!filterBtns.length || !projectCards.length) return;

    projectCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    const updateProjectsDisplay = () => {
        const matchingCards = Array.from(projectCards).filter((card) => {
            const category = card.dataset.category;
            return currentFilter === 'all' || category === currentFilter;
        });

        const visibleLimit = showAllProjects ? matchingCards.length : initialVisibleLimit;

        const visibleCards = matchingCards.slice(0, visibleLimit);

        projectCards.forEach((card) => {
            if (visibleCards.includes(card)) return;
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (!visibleCards.includes(card)) {
                    card.style.display = 'none';
                }
            }, 300);
        });

        visibleCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 80);
        });

        if (loadMoreBtn) {
            const hasHiddenProjects = matchingCards.length > initialVisibleLimit && !showAllProjects;
            loadMoreBtn.hidden = !hasHiddenProjects;
        }
    };
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');
            
            // Récupérer la catégorie à filtrer
            currentFilter = btn.dataset.filter;
            showAllProjects = false;
            updateProjectsDisplay();
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            showAllProjects = true;
            updateProjectsDisplay();
        });
    }
    
    // Initialisation : afficher seulement les 6 premiers projets.
    updateProjectsDisplay();
}

/* ========================================
   FOOTER - Année dynamique
   ======================================== */
function initFooter() {
    const yearElement = document.getElementById('year');
    
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ========================================
   CURSOR EFFECTS - Curseur personnalisé sur projets phares uniquement
   ======================================== */
function initCursorEffects() {
    // Ne pas activer sur mobile
    if (window.innerWidth <= 768 || 'ontouchstart' in window) {
        return;
    }
    
    // Créer un curseur personnalisé qui suit la souris
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(0, 180, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
        mix-blend-mode: difference;
        left: -10px;
        top: -10px;
        opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: rgba(0, 180, 255, 0.9);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.05s ease, opacity 0.2s ease;
        left: -3px;
        top: -3px;
        opacity: 0;
    `;
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    let isHoveringFeatured = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Afficher le curseur uniquement si on survole un projet phare
        if (isHoveringFeatured) {
            cursor.style.opacity = '1';
            cursorDot.style.opacity = '1';
        }
    });
    
    function animateCursor() {
        if (isHoveringFeatured) {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            
            cursor.style.left = cursorX - 10 + 'px';
            cursor.style.top = cursorY - 10 + 'px';
            cursorDot.style.left = dotX - 3 + 'px';
            cursorDot.style.top = dotY - 3 + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Gérer l'affichage du curseur sur les projets phares uniquement
    const featuredCards = document.querySelectorAll('.featured-card');
    
    featuredCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            isHoveringFeatured = true;
            // Masquer le curseur par défaut
            document.body.style.cursor = 'none';
            cursor.style.opacity = '1';
            cursorDot.style.opacity = '1';
            
            // Agrandir le curseur sur les projets phares
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.left = mouseX - 15 + 'px';
            cursor.style.top = mouseY - 15 + 'px';
            cursor.style.borderColor = 'rgba(0, 180, 255, 0.9)';
        });
        
        card.addEventListener('mouseleave', () => {
            isHoveringFeatured = false;
            // Réafficher le curseur par défaut
            document.body.style.cursor = 'auto';
            cursor.style.opacity = '0';
            cursorDot.style.opacity = '0';
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'rgba(0, 180, 255, 0.6)';
        });
    });
}

/* ========================================
   PROJETS PHARES - Lecture vidéo au survol
   ======================================== */
function initFeaturedVideosHoverPlayback() {
    const featuredCards = document.querySelectorAll('.featured-card');
    if (!featuredCards.length) return;
    const hoverPlaybackRate = 0.65;

    featuredCards.forEach((card) => {
        const video = card.querySelector('.featured-card-media-video');
        if (!video) return;
        video.playbackRate = hoverPlaybackRate;

        // S'assurer que la vidéo est arrêtée au chargement.
        video.pause();
        try {
            video.currentTime = 0;
        } catch (e) {
            /* ignore */
        }

        card.addEventListener('mouseenter', () => {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    /* ignore autoplay policy edge cases */
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
            try {
                video.currentTime = 0;
            } catch (e) {
                /* ignore seek errors */
            }
        });
    });
}

/**
 * Précharge les pages de présentation (.html sous Projets) quand le navigateur est au repos,
 * pour réduire la latence au clic depuis l’index des projets.
 */
function initPrefetchProjectPresentations() {
    const prefetched = new Set();

    function prefetchDoc(href) {
        if (prefetched.has(href)) return;
        prefetched.add(href);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'document';
        link.href = href;
        document.head.appendChild(link);
    }

    function run() {
        document.querySelectorAll('a[href$=".html"]').forEach((anchor) => {
            const href = anchor.getAttribute('href');
            if (!href || href.indexOf('Presentation') === -1) return;
            try {
                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) return;
                prefetchDoc(url.href);
            } catch (e) {
                /* ignore */
            }
        });
    }

    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(run, { timeout: 3500 });
    } else {
        setTimeout(run, 1200);
    }
}
