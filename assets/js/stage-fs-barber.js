/**
 * Stage FS Barber — révélation au scroll
 */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    if (reduce) {
      document.querySelectorAll('.fsb-reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const els = document.querySelectorAll('.fsb-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
  }

  function boot() {
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
