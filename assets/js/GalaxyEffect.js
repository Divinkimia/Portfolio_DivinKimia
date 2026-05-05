/* ---------------------------
   GALAXY EFFECT - ÉTOILES ET POUSSIÈRES COSMIQUES
   --------------------------- */

class GalaxyEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this._destroyed = false;
    this._started = false;
    this._idleCallbackId = null;
    this._initTimer = null;
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.dustParticles = [];
    this.shootingStars = [];
    this.animationId = null;
    this.shootingIntervalId = null;
    this.mouse = { x: 0, y: 0 };
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isSmallScreen = window.innerWidth < 992;
    this.quality = typeof options.quality === 'number'
      ? options.quality
      : (this.prefersReducedMotion ? 0.35 : (this.isSmallScreen ? 0.6 : 1));
    this.targetFPS = options.targetFPS || (this.isSmallScreen ? 30 : 45);
    this.frameInterval = 1000 / this.targetFPS;
    this.lastFrameTime = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.useConnections = typeof options.useConnections === 'boolean'
      ? options.useConnections
      : (!this.prefersReducedMotion && !this.isSmallScreen);
    this.connectionDistance = options.connectionDistance || 90;
    this.connectionDistanceSq = this.connectionDistance * this.connectionDistance;
    this.maxConnectionsPerParticle = options.maxConnectionsPerParticle || 3;
    this.colors = options.colors || [
      { r: 255, g: 255, b: 255 },
      { r: 200, g: 220, b: 255 },
      { r: 255, g: 220, b: 200 },
      { r: 220, g: 200, b: 255 },
      { r: 255, g: 255, b: 200 }
    ];

    this.handleResize = this.resize.bind(this);
    this.handleMouseMoveBound = this.handleMouseMove.bind(this);
    this.handleLoadForInit = this.onWindowLoadForInit.bind(this);

    if (this.options.eagerInit === true) {
      this._started = true;
      this.init();
    } else if (document.readyState === 'complete') {
      this.scheduleDeferredInit();
    } else {
      window.addEventListener('load', this.handleLoadForInit, { once: true });
    }
  }

  onWindowLoadForInit() {
    if (this._destroyed) {
      return;
    }
    this.scheduleDeferredInit();
  }

  scheduleDeferredInit() {
    if (this._destroyed || this._started) {
      return;
    }
    const run = () => {
      if (this._destroyed || this._started) {
        return;
      }
      this._started = true;
      this._idleCallbackId = null;
      this._initTimer = null;
      this.init();
    };
    const timeout = typeof this.options.initTimeoutMs === 'number' ? this.options.initTimeoutMs : 2000;
    if (typeof requestIdleCallback !== 'undefined') {
      this._idleCallbackId = requestIdleCallback(run, { timeout });
    } else {
      this._initTimer = setTimeout(run, 180);
    }
  }
  
  init() {
    if (this._destroyed) {
      return;
    }
    // Créer le canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'galaxy-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    this.canvas.style.opacity = String(this.options.opacity || 0.8);
    this.ctx = this.canvas.getContext('2d');
    
    // Insérer le canvas dans le container
    this.container.appendChild(this.canvas);
    
    // Initialiser les dimensions
    this.resize();
    
    // Créer les étoiles et particules
    this.createStars();
    this.createDustParticles();
    
    // Écouter les événements
    window.addEventListener('resize', this.handleResize, { passive: true });
    if (!this.prefersReducedMotion) {
      window.addEventListener('mousemove', this.handleMouseMoveBound, { passive: true });
    }
    
    // Démarrer l'animation
    this.animate();
    
    // Créer des étoiles filantes occasionnelles
    this.startShootingStars();
  }
  
  resize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.canvas.width = Math.floor(this.windowWidth * this.dpr);
    this.canvas.height = Math.floor(this.windowHeight * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    
    // Recréer les étoiles si nécessaire
    if (this.stars.length === 0) {
      this.createStars();
    }
  }
  
  createStars() {
    this.stars = [];
    const starCount = Math.max(35, Math.floor((this.windowWidth * this.windowHeight) / 22000 * this.quality));
    
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.windowWidth,
        y: Math.random() * this.windowHeight,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        brightness: Math.random() * 0.5 + 0.5,
        color: this.getStarColor()
      });
    }
  }
  
  getStarColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
  
  createDustParticles() {
    this.dustParticles = [];
    const dustCount = Math.max(10, Math.floor((this.windowWidth * this.windowHeight) / 52000 * this.quality));
    
    for (let i = 0; i < dustCount; i++) {
      this.dustParticles.push({
        x: Math.random() * this.windowWidth,
        y: Math.random() * this.windowHeight,
        radius: Math.random() * 0.7 + 0.2,
        opacity: Math.random() * 0.25 + 0.08,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: this.options.dustColor || { r: 150, g: 150, b: 200 }
      });
    }
  }
  
  createShootingStar() {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y, vx, vy;
    
    switch(side) {
      case 0: // Top
        x = Math.random() * this.windowWidth;
        y = -10;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 3 + 2;
        break;
      case 1: // Right
        x = this.windowWidth + 10;
        y = Math.random() * this.windowHeight;
        vx = -(Math.random() * 3 + 2);
        vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // Bottom
        x = Math.random() * this.windowWidth;
        y = this.windowHeight + 10;
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 3 + 2);
        break;
      case 3: // Left
        x = -10;
        y = Math.random() * this.windowHeight;
        vx = Math.random() * 3 + 2;
        vy = (Math.random() - 0.5) * 2;
        break;
    }
    
    this.shootingStars.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      length: Math.random() * 80 + 40,
      opacity: 1,
      life: 1,
      decay: Math.random() * 0.02 + 0.01
    });
  }
  
  startShootingStars() {
    if (this.prefersReducedMotion) {
      return;
    }
    this.shootingIntervalId = setInterval(() => {
      if (Math.random() > 0.7 && this.shootingStars.length < 3) {
        this.createShootingStar();
      }
    }, 3000);
  }
  
  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    
    // Faire scintiller les étoiles proches de la souris
    this.stars.forEach(star => {
      const dx = star.x - this.mouse.x;
      const dy = star.y - this.mouse.y;
      const distanceSq = dx * dx + dy * dy;
      
      if (distanceSq < 22500) {
        star.brightness = Math.min(1.5, star.brightness + 0.05);
      } else {
        star.brightness = Math.max(0.5, star.brightness - 0.02);
      }
    });
  }
  
  updateStars() {
    this.stars.forEach(star => {
      // Effet de scintillement
      star.twinkleOffset += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinkleOffset) * 0.3 + 0.7;
      star.currentOpacity = star.opacity * twinkle * star.brightness;
    });
  }
  
  updateDustParticles() {
    this.dustParticles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Réapparition de l'autre côté si hors écran
      if (particle.x < 0) particle.x = this.windowWidth;
      if (particle.x > this.windowWidth) particle.x = 0;
      if (particle.y < 0) particle.y = this.windowHeight;
      if (particle.y > this.windowHeight) particle.y = 0;
    });
  }
  
  updateShootingStars() {
    this.shootingStars = this.shootingStars.filter(star => {
      star.x += star.vx;
      star.y += star.vy;
      star.life -= star.decay;
      star.opacity = star.life;
      
      // Supprimer si hors écran ou opacité trop faible
      return star.life > 0 && 
             star.x > -100 && star.x < this.windowWidth + 100 &&
             star.y > -100 && star.y < this.windowHeight + 100;
    });
  }
  
  drawStars() {
    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.currentOpacity})`;
      this.ctx.fill();
      
      // Ajouter un halo pour les grandes étoiles
      if (star.radius > 1) {
        const gradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 3
        );
        gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.currentOpacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    });
  }
  
  drawDustParticles() {
    this.dustParticles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    if (!this.useConnections) {
      return;
    }

    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < this.dustParticles.length; i++) {
      let links = 0;
      for (let j = i + 1; j < this.dustParticles.length; j++) {
        if (links >= this.maxConnectionsPerParticle) {
          break;
        }
        const dx = this.dustParticles[i].x - this.dustParticles[j].x;
        const dy = this.dustParticles[i].y - this.dustParticles[j].y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < this.connectionDistanceSq) {
          const ratio = 1 - (distanceSq / this.connectionDistanceSq);
          const opacity = Math.min(0.12, ratio * 0.12);
          this.ctx.strokeStyle = `rgba(150, 150, 200, ${opacity})`;
          this.ctx.beginPath();
          this.ctx.moveTo(this.dustParticles[i].x, this.dustParticles[i].y);
          this.ctx.lineTo(this.dustParticles[j].x, this.dustParticles[j].y);
          this.ctx.stroke();
          links++;
        }
      }
    }
  }
  
  drawShootingStars() {
    this.shootingStars.forEach(star => {
      const gradient = this.ctx.createLinearGradient(
        star.x, star.y,
        star.x - star.vx * star.length / Math.sqrt(star.vx * star.vx + star.vy * star.vy),
        star.y - star.vy * star.length / Math.sqrt(star.vx * star.vx + star.vy * star.vy)
      );
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
      gradient.addColorStop(0.5, `rgba(200, 220, 255, ${star.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(star.x, star.y);
      this.ctx.lineTo(
        star.x - star.vx * star.length / Math.sqrt(star.vx * star.vx + star.vy * star.vy),
        star.y - star.vy * star.length / Math.sqrt(star.vx * star.vx + star.vy * star.vy)
      );
      this.ctx.stroke();
      
      // Point lumineux à la tête
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.fill();
    });
  }
  
  animate(timestamp = 0) {
    if (document.hidden) {
      this.animationId = requestAnimationFrame((nextTs) => this.animate(nextTs));
      return;
    }
    if (timestamp - this.lastFrameTime < this.frameInterval) {
      this.animationId = requestAnimationFrame((nextTs) => this.animate(nextTs));
      return;
    }
    this.lastFrameTime = timestamp;

    // Effacer le canvas
    this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
    
    // Mettre à jour
    this.updateStars();
    this.updateDustParticles();
    this.updateShootingStars();
    
    // Dessiner
    this.drawDustParticles();
    this.drawStars();
    this.drawShootingStars();
    
    // Continuer l'animation
    this.animationId = requestAnimationFrame((nextTs) => this.animate(nextTs));
  }
  
  destroy() {
    this._destroyed = true;
    window.removeEventListener('load', this.handleLoadForInit);
    if (this._idleCallbackId != null && typeof cancelIdleCallback !== 'undefined') {
      cancelIdleCallback(this._idleCallbackId);
      this._idleCallbackId = null;
    }
    if (this._initTimer != null) {
      clearTimeout(this._initTimer);
      this._initTimer = null;
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.shootingIntervalId) {
      clearInterval(this.shootingIntervalId);
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMoveBound);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

/**
 * Preset léger pour les pages « contenu » du portfolio (moins de CPU, même style général).
 * Utiliser après chargement de ce fichier : new GalaxyEffect(el, getGalaxyLightPortfolioOptions())
 */
function getGalaxyLightPortfolioOptions() {
  return {
    opacity: 0.65,
    targetFPS: 30,
    quality: window.innerWidth < 992 ? 0.45 : 0.65,
    useConnections: false
  };
}

// Export pour utilisation globale
if (typeof window !== 'undefined') {
  window.GalaxyEffect = GalaxyEffect;
  window.getGalaxyLightPortfolioOptions = getGalaxyLightPortfolioOptions;
}

