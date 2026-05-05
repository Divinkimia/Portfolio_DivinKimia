/**
 * Me decouvrir — micro-interactions, parallax léger sur le hero, tilt 3D des
 * cartes passions, frise du parcours scrollable + reveals au scroll via GSAP
 * (ScrollTrigger) si disponible.
 *
 * Tout est scopé sous body.md-discovery et respecte prefers-reduced-motion.
 */
(function () {
  'use strict';

  var root = document.body;
  if (!root.classList.contains('md-discovery')) return;

  var reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add('js-gsap');
  }

  initNavYear();
  initTestimonialsNav();
  initJourneyRail();

  if (reducedMotion) {
    root.classList.add('is-reduced-motion');
    return;
  }

  initParallaxHero();
  initPassionTilt();
  initScrollRevealGsap();

  /* ---------- Hero : parallax + tilt souris ---------- */
  function initParallaxHero() {
    var frame = document.querySelector('[data-md-hero-frame]');
    var blobs = document.querySelectorAll('[data-md-parallax]');
    var depth = document.querySelector('.md-hero-blob');

    var rotX = 0, rotY = 0, tgX = 0, tgY = 0, rafId = null;

    if (typeof gsap !== 'undefined') {
      blobs.forEach(function (el, i) {
        gsap.fromTo(
          el,
          { yPercent: -4 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: '.md-hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.1 + i * 0.12,
            },
          }
        );
      });
    }

    function onMove(e) {
      if (!frame) return;
      var rect = frame.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var px = (e.clientX - cx) / rect.width;
      var py = (e.clientY - cy) / rect.height;
      tgX = Math.max(-10, Math.min(10, py * -8));
      tgY = Math.max(-10, Math.min(10, px * 10));

      var mx = e.clientX / window.innerWidth - 0.5;
      var my = e.clientY / window.innerHeight - 0.5;
      if (depth) {
        depth.style.transform = 'translate(' + mx * 18 + 'px, ' + my * 22 + 'px)';
      }
    }

    function onLeave() {
      tgX = 0; tgY = 0;
      if (depth) depth.style.transform = '';
    }

    function step() {
      if (!frame) { rafId = null; return; }
      rotX += (tgX - rotX) * 0.08;
      rotY += (tgY - rotY) * 0.08;
      frame.style.transform =
        'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
      rafId = window.requestAnimationFrame(step);
    }

    function startTilt() {
      if (!frame) return;
      stopTilt();
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseleave', onLeave);
      rafId = window.requestAnimationFrame(step);
    }

    function stopTilt() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      rotX = tgX = 0; rotY = tgY = 0;
      if (frame) frame.style.transform = '';
      if (depth) depth.style.transform = '';
    }

    var mq = window.matchMedia('(min-width: 992px)');
    if (mq.matches) startTilt();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', function (m) {
        if (m.matches) startTilt(); else stopTilt();
      });
    }
  }

  /* ---------- Tilt 3D des cartes passions ---------- */
  function initPassionTilt() {
    var cards = document.querySelectorAll('[data-md-tilt]');
    if ('ontouchstart' in window) return;

    cards.forEach(function (card) {
      var inner = card.querySelector('.md-passion__inner');
      if (!inner) return;

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        var y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        inner.style.transform =
          'perspective(900px) rotateX(' + (y * -7).toFixed(2) +
          'deg) rotateY(' + (x * 8).toFixed(2) +
          'deg) translateZ(0)';
      });

      card.addEventListener('mouseleave', function () {
        inner.style.transform = '';
      });
    });
  }

  /* ---------- Frise parcours : navigation horizontale + progression ---------- */
  function initJourneyRail() {
    var rail = document.getElementById('md-journey-rail');
    var prev = document.getElementById('md-journey-prev');
    var next = document.getElementById('md-journey-next');
    var progress = document.getElementById('md-journey-progress');
    if (!rail) return;

    function step(dir) {
      var card = rail.querySelector('.md-journey-card');
      var unit = card ? card.getBoundingClientRect().width + 18 : rail.clientWidth * 0.85;
      rail.scrollBy({ left: dir * unit, behavior: 'smooth' });
    }

    function updateProgress() {
      if (!progress) return;
      var max = rail.scrollWidth - rail.clientWidth;
      var ratio = max > 0 ? rail.scrollLeft / max : 1;
      ratio = Math.min(1, Math.max(0.06, ratio || 0.06));
      progress.style.setProperty('--md-journey-progress', ratio.toFixed(3));
    }

    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    rail.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ---------- Témoignages : navigation horizontale ---------- */
  function initTestimonialsNav() {
    var track = document.getElementById('md-testimonial-track');
    var prev = document.getElementById('md-testimonials-prev');
    var next = document.getElementById('md-testimonials-next');
    if (!track || !prev || !next) return;

    function scrollStep(dir) {
      var delta = dir * Math.min(track.clientWidth * 0.85, 380);
      track.scrollBy({ left: delta, behavior: 'smooth' });
    }
    prev.addEventListener('click', function () { scrollStep(-1); });
    next.addEventListener('click', function () { scrollStep(1); });
  }

  function initNavYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ---------- Reveal au scroll via GSAP/ScrollTrigger ---------- */
  function initScrollRevealGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.utils.toArray('.md-section').forEach(function (section) {
      var els = section.querySelectorAll('.md-reveal-base');
      if (!els.length) return;
      gsap.fromTo(
        els,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    gsap.fromTo(
      '.md-hero .md-reveal-base',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.12 }
    );

    ScrollTrigger.refresh();
  }
})();
