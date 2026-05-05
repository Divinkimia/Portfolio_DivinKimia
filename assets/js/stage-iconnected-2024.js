/**
 * Stage Iconnected 2024 — révélation au scroll, décalage des blocs, démos interactives,
 * parallaxe hero, pulsation du flux QR, compteurs tableau de bord.
 */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function collectStaggerTargets(section) {
    if (section.classList.contains('stage-ics-strip')) {
      return Array.from(section.querySelectorAll(':scope > p, :scope > .stage-ics-actions'));
    }
    const all = Array.from(
      section.querySelectorAll(
        [
          ':scope .stage-ics-badge',
          ':scope .stage-ics-section__title',
          ':scope > .stage-ics-lead',
          ':scope .ics-stage-illus-heading',
          ':scope .ics-stage-illus-lead',
          ':scope .ics-panel',
          ':scope .stage-ics-card',
          ':scope .stage-ics-week',
          ':scope .stage-ics-planning-banner',
          ':scope .stage-ics-quote',
        ].join(',')
      )
    );
    const cardRoots = new Set(all.filter((el) => el.classList.contains('stage-ics-card')));
    const out = [];
    all.forEach((el) => {
      if (el.classList.contains('stage-ics-card')) {
        out.push(el);
        return;
      }
      const parentCard = el.closest('.stage-ics-card');
      if (
        parentCard &&
        cardRoots.has(parentCard) &&
        el.matches('.stage-ics-week, .stage-ics-planning-banner')
      ) {
        return;
      }
      out.push(el);
    });
    return out;
  }

  function prepareStaggerItems() {
    document.querySelectorAll('[data-ics-stagger]').forEach((section) => {
      collectStaggerTargets(section).forEach((el) => {
        el.classList.add('ics-stagger-item');
      });
    });
  }

  function staggerChildren(section) {
    if (reduce) {
      section.querySelectorAll('.ics-stagger-item').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const items = section.querySelectorAll('.ics-stagger-item');
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), 52 * i);
    });
  }

  function initReveal() {
    if (reduce) {
      document.querySelectorAll('.ics-reveal').forEach((el) => {
        el.classList.add('is-visible');
        if (el.hasAttribute('data-ics-stagger')) {
          staggerChildren(el);
        }
      });
      return;
    }
    const els = document.querySelectorAll('.ics-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('is-visible');
          if (el.classList.contains('stage-ics-strip')) {
            el.classList.add('stage-ics-strip--alive');
          }
          if (el.hasAttribute('data-ics-stagger')) {
            setTimeout(() => staggerChildren(el), 90);
          }
          obs.unobserve(el);
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.06 }
    );
    els.forEach((el) => io.observe(el));
  }

  function initWireframeTips() {
    const tip = document.getElementById('ics-wire-tip');
    const blocks = document.querySelectorAll('.ics-wireframe__block[data-ics-tip]');
    if (!tip || !blocks.length) return;
    blocks.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        tip.textContent = el.getAttribute('data-ics-tip') || '';
      });
      el.addEventListener('focus', () => {
        tip.textContent = el.getAttribute('data-ics-tip') || '';
      });
    });
    const wf = document.querySelector('.ics-wireframe');
    if (wf) {
      wf.addEventListener('mouseleave', () => {
        tip.textContent = 'Survolez un bloc';
      });
      wf.addEventListener('focusout', (e) => {
        if (wf.contains(e.relatedTarget)) return;
        tip.textContent = 'Survolez un bloc';
      });
    }
  }

  function initCompareSlider() {
    const range = document.getElementById('ics-compare-range');
    const layer = document.getElementById('ics-compare-after-layer');
    if (!range || !layer) return;

    function apply(v) {
      const n = Math.max(0, Math.min(100, Number(v)));
      layer.style.clipPath = `polygon(0 0, ${n}% 0, ${n}% 100%, 0 100%)`;
      range.setAttribute('aria-valuenow', String(n));
    }

    range.addEventListener('input', () => apply(range.value));
    apply(range.value);
  }

  function initHeroParallax() {
    if (reduce) return;
    const hero = document.getElementById('stage-ics-hero');
    const inner = document.querySelector('[data-ics-hero-tilt]');
    if (!hero || !inner) return;

    let raf = 0;
    let mx = 0;
    let my = 0;

    function apply() {
      raf = 0;
      const tx = mx * -14;
      const ty = my * -11;
      inner.style.transform =
        `perspective(900px) rotateX(${ty * -0.55}deg) rotateY(${tx * 0.45}deg) translate3d(${tx}px, ${ty}px, 0)`;
    }

    hero.addEventListener(
      'pointermove',
      (e) => {
        const rect = hero.getBoundingClientRect();
        mx = (e.clientX - rect.left) / rect.width - 0.5;
        my = (e.clientY - rect.top) / rect.height - 0.5;
        if (raf) return;
        raf = requestAnimationFrame(apply);
      },
      { passive: true }
    );

    hero.addEventListener('pointerleave', () => {
      inner.style.transform = '';
      mx = 0;
      my = 0;
    });
  }

  function initMagneticButtons() {
    if (reduce) return;
    const hero = document.getElementById('stage-ics-hero');
    if (!hero) return;
    hero.querySelectorAll('.btn-ics-primary, .btn-ics-ghost').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        btn.style.transform = `translate(${dx * 7}px, ${dy * 5}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  function initFlowPulse() {
    if (reduce) return;
    const flow = document.getElementById('ics-flow-diagram');
    if (!flow) return;
    const steps = flow.querySelectorAll('.ics-flow__step');
    if (!steps.length) return;
    const section = flow.closest('[data-ics-stagger]');
    if (!section) return;

    let timer = null;
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(section);
          let i = 0;
          steps.forEach((s) => s.classList.remove('ics-flow__step--active'));
          steps[0].classList.add('ics-flow__step--active');
          timer = window.setInterval(() => {
            steps.forEach((s) => s.classList.remove('ics-flow__step--active'));
            steps[i].classList.add('ics-flow__step--active');
            i = (i + 1) % steps.length;
          }, 1300);
        });
      },
      { threshold: 0.22, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(section);

    window.addEventListener(
      'pagehide',
      () => {
        if (timer) window.clearInterval(timer);
      },
      { once: true }
    );
  }

  function initDashCounters() {
    const root = document.querySelector('.ics-dash-mock');
    if (!root) return;

    function finalizeStatic() {
      root.querySelectorAll('[data-ics-count]').forEach((el) => {
        const end = parseInt(el.getAttribute('data-ics-count'), 10);
        const suffix = el.getAttribute('data-ics-suffix') || '';
        if (!Number.isNaN(end)) el.textContent = String(end) + suffix;
      });
      root.querySelectorAll('[data-ics-text]').forEach((el) => {
        el.textContent = el.getAttribute('data-ics-text') || '';
        el.style.opacity = '';
      });
    }

    if (reduce) {
      finalizeStatic();
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(root);

          root.querySelectorAll('[data-ics-count]').forEach((el) => {
            const end = parseInt(el.getAttribute('data-ics-count'), 10);
            const suffix = el.getAttribute('data-ics-suffix') || '';
            if (Number.isNaN(end)) return;
            const duration = 1000;
            const t0 = performance.now();
            function frame(now) {
              const t = Math.min(1, (now - t0) / duration);
              const ease = 1 - Math.pow(1 - t, 3);
              const val = Math.round(end * ease);
              el.textContent = String(val) + suffix;
              if (t < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
          });

          const syncEl = root.querySelector('[data-ics-text]');
          if (syncEl) {
            syncEl.style.opacity = '0';
            window.setTimeout(() => {
              syncEl.textContent = syncEl.getAttribute('data-ics-text') || '';
              syncEl.style.transition = 'opacity 0.55s ease';
              syncEl.style.opacity = '1';
            }, 850);
          }
        });
      },
      { threshold: 0.32 }
    );
    io.observe(root);
  }

  function boot() {
    prepareStaggerItems();
    initReveal();
    initWireframeTips();
    initCompareSlider();
    initHeroParallax();
    initMagneticButtons();
    initFlowPulse();
    initDashCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
