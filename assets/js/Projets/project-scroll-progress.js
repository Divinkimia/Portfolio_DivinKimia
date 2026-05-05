/**
 * Barre de progression de lecture pour les pages Projets.
 * Cree la barre automatiquement si absente et met a jour sa largeur au scroll.
 */
(function () {
  'use strict';

  function getOrCreateProgressBar() {
    const existingBar =
      document.getElementById('scrollProgress') ||
      document.querySelector('.scroll-progress') ||
      document.querySelector('[data-scroll-progress]');

    if (existingBar) {
      existingBar.classList.add('project-scroll-progress');
      return existingBar;
    }

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress project-scroll-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Progression de lecture');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    document.body.appendChild(progressBar);
    return progressBar;
  }

  function ensureProgressBarStyles() {
    if (document.getElementById('project-scroll-progress-style')) return;

    const style = document.createElement('style');
    style.id = 'project-scroll-progress-style';
    style.textContent = `
      .project-scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 4px;
        z-index: 2000;
        background: linear-gradient(90deg, #00b4ff 0%, #7cc7ff 100%);
        box-shadow: 0 0 12px rgba(0, 180, 255, 0.45);
        transition: width 0.12s linear;
      }
    `;
    document.head.appendChild(style);
  }

  function initProjectScrollProgress() {
    ensureProgressBarStyles();
    const progressBar = getOrCreateProgressBar();
    let ticking = false;

    const updateProgress = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;

      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));
      ticking = false;
    };

    const onScroll = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectScrollProgress);
  } else {
    initProjectScrollProgress();
  }
})();
