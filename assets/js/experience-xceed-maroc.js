/**
 * Expérience Xceed Maroc — révélation au scroll, compteurs animés, progression timeline
 */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    if (reduce) {
      document.querySelectorAll('.xc-reveal, .xc-timeline-item').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }
    const els = document.querySelectorAll('.xc-reveal');
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));

    const timelineItems = document.querySelectorAll('.xc-timeline-item');
    const tio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    timelineItems.forEach((el) => tio.observe(el));
  }

  function animateValue(el, end, duration, suffix) {
    const start = 0;
    const startTime = performance.now();
    function frame(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(start + (end - start) * eased);
      el.textContent = val + (suffix || '');
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-xc-counter]');
    if (!counters.length) return;

    const run = (el) => {
      const target = parseInt(el.getAttribute('data-xc-counter'), 10);
      const suffix = el.getAttribute('data-xc-suffix') || '';
      if (reduce) {
        el.textContent = target + suffix;
        return;
      }
      animateValue(el, target, 1600, suffix);
    };

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach((el) => io.observe(el));
  }

  function initTimelineProgress() {
    const line = document.querySelector('.xc-timeline-line');
    const wrap = document.querySelector('.xc-timeline-wrap');
    if (!line || !wrap || reduce) {
      if (line) line.style.setProperty('--xc-line-progress', '1');
      return;
    }

    function update() {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.min(Math.max(vh * 0.55 - rect.top, 0), total);
      const p = total > 0 ? Math.min(scrolled / total + 0.12, 1) : 1;
      line.style.setProperty('--xc-line-progress', String(p));
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  function smoothScrollCta() {
    const btn = document.querySelector('[data-xc-scroll="#parcours"]');
    const target = document.querySelector('#parcours');
    if (!btn || !target) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  }

  function boot() {
    initReveal();
    initCounters();
    initTimelineProgress();
    smoothScrollCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
