/* ---------------------------
   SCRIPT POUR LA PAGE FORMATIONS
   --------------------------- */

// Initialisation au chargement du DOM
let galaxyEffect = null;

document.addEventListener("DOMContentLoaded", () => {
  try {
    initGalaxyEffect();
    initNavToggle();
    initScrollAnimations();
    initFooterYear();
    initNavbarScroll();
    handleLogoImages();
    initSkillsAnimations();
    initTimelineProgressIndicator();
    initParcoursAtypiqueModal();
    initFormationsVisibilityFallback();
  } catch (err) {
    console.error("ParcoursPage init:", err);
    document
      .querySelectorAll(
        ".formation-card-modern, .skill-pillar, .orbit-item, .timeline-item:not(.future), .skill-orbit, .skill-category"
      )
      .forEach((el) => el.classList.add("animate-in"));
  }
});

/* ---------------------------
   GALAXY EFFECT INITIALIZATION
   --------------------------- */
function initGalaxyEffect() {
  const galaxyContainer = document.getElementById('galaxy-container');
  if (!galaxyContainer) return;
  
  if (typeof GalaxyEffect !== 'undefined') {
    galaxyEffect = new GalaxyEffect(
      galaxyContainer,
      typeof getGalaxyLightPortfolioOptions === 'function' ? getGalaxyLightPortfolioOptions() : {}
    );
  } else {
    createSimpleStarFieldAccueil(galaxyContainer);
  }
}

function createSimpleStarFieldAccueil(container) {
  const canvas = document.createElement('canvas');
  canvas.id = 'stars-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  canvas.style.opacity = '0.6';
  
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const stars = [];
  const colors = [
    { r: 255, g: 255, b: 255 },
    { r: 0, g: 180, b: 255 },
    { r: 124, g: 199, b: 255 }
  ];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
  }
  
  function createStars() {
    stars.length = 0;
    const count = Math.floor((canvas.width * canvas.height) / 15000);
    
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        color: color
      });
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.twinkle += 0.02;
      const opacity = star.opacity * (Math.sin(star.twinkle) * 0.3 + 0.7);
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${opacity})`;
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  resize();
  window.addEventListener('resize', resize);
  animate();
}

window.addEventListener('beforeunload', () => {
  if (galaxyEffect && galaxyEffect.destroy) {
    galaxyEffect.destroy();
  }
});

/* ---------------------------
   NAVIGATION MOBILE
   --------------------------- */
function initNavToggle() {
  /* Navbar : Bootstrap collapse + ../../JS/site-navbar.js */
}

/* ---------------------------
   ANIMATIONS AU SCROLL
   --------------------------- */
function initScrollAnimations() {
  // Observer pour les animations d'apparition
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Éléments à observer
  const timelineItems = document.querySelectorAll('.timeline-item:not(.future)');
  const formationDetailCards = document.querySelectorAll('.formation-card-modern');
  const skillCategories = document.querySelectorAll('.skill-category');
  
  // Les éléments de timeline sont déjà visibles, on les anime juste au scroll
  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });
  
  // S'assurer que tous les éléments sont visibles même sans animation
  document.querySelectorAll('.timeline-item').forEach(item => {
    if (!item.classList.contains('future')) {
      item.classList.add('animate-in');
    }
  });
  
  formationDetailCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(card);
  });
  
  skillCategories.forEach((category, index) => {
    category.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(category);
  });

  /* Affichage garanti (cartes & compétences : même logique que la timeline ci-dessus) */
  formationDetailCards.forEach((el) => el.classList.add('animate-in'));
  document.querySelectorAll('.skill-pillar').forEach((el) => el.classList.add('animate-in'));
  document.querySelectorAll('.orbit-item').forEach((el) => el.classList.add('animate-in'));
  const skillOrbit = document.querySelector('.skill-orbit');
  if (skillOrbit) skillOrbit.classList.add('animate-in');
}

/* ---------------------------
   NAVBAR SCROLL EFFECT
   --------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;
  const update = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

/* ---------------------------
   FOOTER YEAR
   --------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------------------------
   GESTION DES IMAGES DE LOGOS
   --------------------------- */
function handleLogoImages() {
  const logoImages = document.querySelectorAll('.logo-image');

  logoImages.forEach((img) => {
    img.addEventListener('error', function () {
      const parent = this.parentElement;
      if (!parent) return;
      const altText = this.alt || 'Logo';
      const shortText = altText.split(' ')[0];

      parent.innerHTML = '';
      parent.textContent = shortText;
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';
      parent.style.justifyContent = 'center';
      parent.style.fontWeight = '600';
      parent.style.fontSize = '0.7rem';
      parent.style.color = '#1a1a1a';
      parent.style.textAlign = 'center';
    });
    /* Ne pas écouter le load : les espaces/retours entre <div> et <img> donnent un
       textContent non vide → vider le parent supprimait l'image après chargement. */
  });
}


/* ---------------------------
   ANIMATIONS DES COMPÉTENCES
   --------------------------- */
function initSkillsAnimations() {
  // Animation des cercles de progression
  const progressCircles = document.querySelectorAll('.progress-circle');
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target;
        const progress = circle.dataset.progress;
        const circleFill = circle.querySelector('.progress-circle-fill');
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (progress / 100) * circumference;
        
        circleFill.style.strokeDashoffset = offset;
        circle.classList.add('animated');
      }
    });
  }, { threshold: 0.5 });
  
  progressCircles.forEach(circle => progressObserver.observe(circle));
  
  // Animation de l'orbit
  const skillOrbit = document.querySelector('.skill-orbit');
  const orbitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.3 });
  
  if (skillOrbit) orbitObserver.observe(skillOrbit);
  
  // Animation des piliers
  const skillPillars = document.querySelectorAll('.skill-pillar');
  const pillarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.2 });
  
  skillPillars.forEach((pillar, index) => {
    pillar.style.transitionDelay = `${index * 0.1}s`;
    pillarsObserver.observe(pillar);
  });
  
  // Animation de la timeline
  const skillsTimeline = document.querySelector('.skills-timeline');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.3 });
  
  if (skillsTimeline) timelineObserver.observe(skillsTimeline);
}

/* ---------------------------
   SMOOTH SCROLL POUR LES ANCRES
   --------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ---------------------------
   INDICATEUR DE PROGRESSION TIMELINE
   --------------------------- */
function initTimelineProgressIndicator() {
  const timeline = document.querySelector('.timeline');
  const progressIndicator = document.getElementById('timeline-progress');
  const formationsSection = document.querySelector('.formations-section');
  const timelineItems = document.querySelectorAll('.timeline-item:not(.future)');
  
  if (!timeline || !progressIndicator || !formationsSection || timelineItems.length === 0) return;
  
  function updateProgressIndicator() {
    const formationsRect = formationsSection.getBoundingClientRect();
    const timelineRect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportCenterY = windowHeight / 2;
    
    // Vérifier si la section formations est visible
    if (formationsRect.bottom < 0 || formationsRect.top > windowHeight) {
      progressIndicator.classList.remove('active');
      timelineItems.forEach(item => item.classList.remove('active'));
      return;
    }
    
    // Activer l'indicateur
    progressIndicator.classList.add('active');
    
    // Retirer la classe active de tous les items
    timelineItems.forEach(item => item.classList.remove('active'));
    
    // Trouver la formation la plus proche du centre de la fenêtre
    let activeItem = null;
    let minDistance = Infinity;
    let targetPosition = 0;
    
    // Parcourir toutes les formations
    timelineItems.forEach((item) => {
      const marker = item.querySelector('.timeline-marker');
      if (!marker) return;
      
      const markerRect = marker.getBoundingClientRect();
      const markerTop = markerRect.top;
      const markerCenter = markerTop + markerRect.height / 2;
      const distance = Math.abs(viewportCenterY - markerCenter);
      
      // Calculer la position relative du marker dans la timeline
      const itemRect = item.getBoundingClientRect();
      const markerTopInItem = markerRect.top - itemRect.top;
      const itemTopInTimeline = itemRect.top - timelineRect.top;
      const markerTopY = itemTopInTimeline + markerTopInItem;
      
      // Si le centre de la fenêtre est proche de ce marker
      if (markerRect.top <= viewportCenterY && markerRect.bottom >= viewportCenterY) {
        targetPosition = markerTopY;
        if (distance < minDistance) {
          minDistance = distance;
          activeItem = item;
        }
      }
      // Si on est au-dessus de ce marker, utiliser sa position
      else if (viewportCenterY < markerTop && !activeItem) {
        targetPosition = markerTopY;
        activeItem = item;
      }
    });
    
    // Si aucune formation n'est trouvée, utiliser la première
    if (!activeItem && timelineItems.length > 0) {
      const firstItem = timelineItems[0];
      const firstMarker = firstItem.querySelector('.timeline-marker');
      if (firstMarker) {
        const firstMarkerRect = firstMarker.getBoundingClientRect();
        const firstItemRect = firstItem.getBoundingClientRect();
        const firstMarkerTopInItem = firstMarkerRect.top - firstItemRect.top;
        const firstItemTopInTimeline = firstItemRect.top - timelineRect.top;
        targetPosition = firstItemTopInTimeline + firstMarkerTopInItem;
        activeItem = firstItem;
      }
    }
    
    // Activer l'item et positionner l'indicateur
    if (activeItem) {
      activeItem.classList.add('active');
    }
    
    // Positionner la ligne jusqu'à la position du marker (suivi fluide du scroll)
    progressIndicator.style.height = `${Math.max(0, targetPosition)}px`;
    progressIndicator.style.top = '0';
  }
  
  // Mettre à jour au scroll
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgressIndicator();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Mettre à jour au chargement et au redimensionnement
  updateProgressIndicator();
  window.addEventListener('resize', () => {
    setTimeout(updateProgressIndicator, 100);
  });
}

/* ---------------------------
   MODAL PARCOURS ATYPIQUE
   --------------------------- */
function initParcoursAtypiqueModal() {
  const btn = document.getElementById('parcours-atypique-btn');
  const modal = document.getElementById('parcours-atypique-modal');
  const closeBtn = document.getElementById('parcours-atypique-close');
  const overlay = modal?.querySelector('.parcours-atypique-overlay');

  if (!btn || !modal) return;

  function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    btn?.focus();
  }

  btn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ---------------------------
   FALLBACK VISIBILITÉ (cartes, compétences)
   --------------------------- */
function initFormationsVisibilityFallback() {
  window.setTimeout(() => {
    document.querySelectorAll('.formation-card-modern:not(.animate-in)').forEach((el) => {
      el.classList.add('animate-in');
    });
    document.querySelectorAll('.skill-pillar:not(.animate-in)').forEach((el) => {
      el.classList.add('animate-in');
    });
    document.querySelectorAll('.orbit-item:not(.animate-in)').forEach((el) => {
      el.classList.add('animate-in');
    });
    const orbit = document.querySelector('.skill-orbit:not(.animate-in)');
    if (orbit) orbit.classList.add('animate-in');
  }, 2200);
}

/* ---------------------------
   ACCESSIBILITÉ - RÉDUCTION DES MOUVEMENTS
   --------------------------- */
(function reduceMotion() {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReduce) {
    // Désactiver les animations CSS
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
})();