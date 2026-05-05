let galaxyEffect = null;

document.addEventListener("DOMContentLoaded", () => {
  try {
    initGalaxyEffect();
    initNavToggle();
    initScrollAnimations();
    initFooterYear();
    initNavbarScroll();
  } catch (err) {
    console.error("FormationPage init:", err);
  }
});

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

function initNavToggle() {
  /* Navbar : Bootstrap collapse + ../../JS/site-navbar.js */
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.formation-item').forEach(el => {
    observer.observe(el);
  });
}

function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

window.addEventListener('beforeunload', () => {
  if (galaxyEffect && galaxyEffect.destroy) {
    galaxyEffect.destroy();
  }
});

