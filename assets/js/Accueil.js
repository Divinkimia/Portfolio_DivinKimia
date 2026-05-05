/* ---------------------------
   SCRIPT GLOBAL AMÉLIORÉ
   --------------------------- */

// Initialisation au chargement du DOM
let matrixAnimationFrame = null;
let matrixResizeHandler = null;

document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
  initScrollAnimations();
  initFooterYear();
  initBackToTop();
  initMatrixRainBackground();
  initNavbarScroll();
  initSkillsAnimation();
});

/* ---------------------------
   EFFET DE FRAPPE (TYPEWRITER)
   --------------------------- */
function initTypewriter() {
  const texts = [
    "Développeur Web Full-Stack",
    "Passionné d'Intelligence Artificielle",
    "Créateur d'Expériences Digitales"
  ];
  
  const target = document.querySelector('.title-sub');
  if (!target) return;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      // Effacer le texte
      target.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      // Écrire le texte
      target.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    // Vérifier si on a fini d'écrire ou d'effacer
    if (!isDeleting && charIndex === currentText.length) {
      // Pause avant de commencer à effacer
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      // Passer au texte suivant
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500;
    }
    
    setTimeout(type, typingSpeed);
  }
  
  // Démarrer l'animation après un délai
  setTimeout(type, 1000);
}

/* Dropdown Parcours mobile : ../JS/site-navbar.js (parcours-navbar) */

/* ---------------------------
   ANIMATION DES BARRES DE COMPÉTENCES
   --------------------------- */
function initSkillsAnimation() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.style.width;
        progressBar.style.width = '0';
        
        setTimeout(() => {
          progressBar.style.width = width;
        }, 300);
        
        observer.unobserve(progressBar);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => observer.observe(bar));
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
  
  // Éléments à observer (sélecteurs alignés avec le HTML)
  const elementsToAnimate = document.querySelectorAll(
    '.intro-row, .skills-grid, .projects-showcase-grid, .journey-timeline, .watch-grid, .contact-content, .animate-scroll-target'
  );
  
  elementsToAnimate.forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });
  
  // Ajouter les classes CSS pour les animations
  const style = document.createElement('style');
  style.textContent = `
    .fade-up {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-up.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .intro-row.animate-in,
    .skills-grid.animate-in,
    .projects-showcase-grid.animate-in,
    .watch-grid.animate-in {
      transition-delay: 0.1s;
    }
    
    .journey-timeline.animate-in .journey-item {
      opacity: 0;
      transform: translateX(-20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .journey-timeline.animate-in .journey-item:nth-child(1) { transition-delay: 0.1s; }
    .journey-timeline.animate-in .journey-item:nth-child(2) { transition-delay: 0.2s; }
    .journey-timeline.animate-in .journey-item:nth-child(3) { transition-delay: 0.3s; }
    
    .journey-timeline.animate-in .journey-item {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  document.head.appendChild(style);
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

/* Sous-menu Parcours : navigation normale (les liens <a href> ne doivent pas être bloqués).
   L’ancien initDynamicMenu() faisait e.preventDefault() sur .swap-menu, ce qui empêchait toute redirection. */


/* ---------------------------
   MATRIX RAIN BACKGROUND (identique MeDecouvrir)
   --------------------------- */
function initMatrixRainBackground() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = 'rgba(3, 10, 22, 0.92)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const ctx = canvas.getContext('2d');
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/%$#@{}[]<>~';
  const fontSize = window.innerWidth <= 768 ? 12 : 14;
  let columns = 0;
  let drops = [];
  let lastTime = 0;
  const frameInterval = 45;

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.random() * -100);
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 8, 18, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      const isHead = Math.random() > 0.75;
      ctx.fillStyle = isHead ? 'rgba(170, 225, 255, 0.95)' : 'rgba(0, 168, 255, 0.72)';
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = Math.random() * -25;
      }
      drops[i] += 0.85;
    }
  }

  function animate(timestamp) {
    if (!lastTime || timestamp - lastTime >= frameInterval) {
      drawMatrix();
      lastTime = timestamp;
    }
    matrixAnimationFrame = requestAnimationFrame(animate);
  }

  setup();
  matrixResizeHandler = setup;
  window.addEventListener('resize', matrixResizeHandler);
  matrixAnimationFrame = requestAnimationFrame(animate);
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
   BOUTON RETOUR EN HAUT
   --------------------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
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
    
    // Désactiver l'effet de frappe
    const titleSub = document.querySelector('.title-sub');
    if (titleSub) {
      titleSub.textContent = "Développeur Web Full-Stack";
    }
  }
})();

/* ---------------------------
   SMOOTH SCROLL POUR LES ANCRES
   --------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const navbar = document.querySelector('.navbar');
      const offset = navbar ? navbar.offsetHeight : 0;
      const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (matrixAnimationFrame) {
    cancelAnimationFrame(matrixAnimationFrame);
  }
  if (matrixResizeHandler) {
    window.removeEventListener('resize', matrixResizeHandler);
  }
});