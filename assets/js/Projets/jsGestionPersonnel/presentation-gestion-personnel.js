/**
 * Présentation Gestion du personnel — scroll, nav îlot, métriques, accordéon, onglets, tilt hero.
 */
(function () {
  'use strict';

  var prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var navStack = document.getElementById('kimNavStack');
  function onScrollNav() {
    if (!navStack) return;
    if (window.scrollY > 24) navStack.classList.add('scrolled');
    else navStack.classList.remove('scrolled');
  }

  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  var reveals = document.querySelectorAll('.gp-reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  var y = document.getElementById('footer-year');
  if (y) y.textContent = String(new Date().getFullYear());

  var topBtns = document.querySelectorAll('.back-to-top');
  topBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var id = btn.getAttribute('href');
      if (id === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (id && id.charAt(0) === '#') {
        var el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Compteurs métriques */
  function animateValue(el, target, duration) {
    var start = 0;
    var t0 = null;
    function frame(now) {
      if (!t0) t0 = now;
      var p = Math.min((now - t0) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(start + (target - start) * eased));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var statNums = document.querySelectorAll('.gp-stat__num[data-target]');
  if (statNums.length && !prefersReduced && 'IntersectionObserver' in window) {
    var statsIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var tgt = parseInt(el.getAttribute('data-target'), 10);
          if (!isNaN(tgt)) animateValue(el, tgt, 1100);
          statsIo.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    statNums.forEach(function (el) {
      statsIo.observe(el);
    });
  } else if (statNums.length) {
    statNums.forEach(function (el) {
      var tgt = el.getAttribute('data-target');
      if (tgt) el.textContent = tgt;
    });
  }

  /* Accordéon parcours */
  var flowRoot = document.querySelector('.gp-flow');
  if (flowRoot) {
    flowRoot.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.gp-flow__btn');
      if (!btn || !flowRoot.contains(btn)) return;
      var step = btn.closest('.gp-flow__step');
      if (!step) return;
      var panel = step.querySelector('.gp-flow__panel');
      var open = step.classList.contains('is-open');
      flowRoot.querySelectorAll('.gp-flow__step').forEach(function (s) {
        s.classList.remove('is-open');
        var b = s.querySelector('.gp-flow__btn');
        var p = s.querySelector('.gp-flow__panel');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (p) p.hidden = true;
      });
      if (!open && panel) {
        step.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  }

  /* Onglets couches */
  var tabsRoot = document.querySelector('[data-gp-tabs]');
  if (tabsRoot) {
    tabsRoot.addEventListener('click', function (ev) {
      var tab = ev.target.closest('.gp-tabs__tab');
      if (!tab || !tabsRoot.contains(tab)) return;
      var id = tab.getAttribute('data-tab');
      tabsRoot.querySelectorAll('.gp-tabs__tab').forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tabsRoot.querySelectorAll('.gp-tabs__panel').forEach(function (p) {
        p.classList.remove('is-active');
        p.hidden = true;
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      var panelId =
        id === 'm'
          ? 'gp-panel-m'
          : id === 'v'
            ? 'gp-panel-v'
            : 'gp-panel-c';
      var panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('is-active');
        panel.hidden = false;
      }
    });
  }

  /* Tilt léger sur le hero */
  var heroVis = document.getElementById('gpHeroVisual');
  if (heroVis && !prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    var maxTilt = 7;
    heroVis.addEventListener('mousemove', function (ev) {
      var r = heroVis.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width - 0.5;
      var py = (ev.clientY - r.top) / r.height - 0.5;
      heroVis.style.transform =
        'perspective(900px) rotateY(' +
        px * maxTilt +
        'deg) rotateX(' +
        -py * maxTilt +
        'deg) translateZ(4px)';
    });
    heroVis.addEventListener('mouseleave', function () {
      heroVis.style.transform = '';
    });
  }
})();
