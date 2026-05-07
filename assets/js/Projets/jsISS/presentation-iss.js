/**
 * Présentation ISS — révélations, nav îlot, accordéon, onglets, API live, tilt hero.
 */
(function () {
  'use strict';

  var API_URL = 'https://api.wheretheiss.at/v1/satellites/25544/';
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

  var reveals = document.querySelectorAll('.iss-reveal');
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

  document.querySelectorAll('.back-to-top').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var href = btn.getAttribute('href');
      if (href === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (href && href.charAt(0) === '#') {
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Accordéon parcours données */
  var flowRoot = document.querySelector('.iss-flow');
  if (flowRoot) {
    flowRoot.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.iss-flow__btn');
      if (!btn || !flowRoot.contains(btn)) return;
      var step = btn.closest('.iss-flow__step');
      if (!step) return;
      var panel = step.querySelector('.iss-flow__panel');
      var wasOpen = step.classList.contains('is-open');
      flowRoot.querySelectorAll('.iss-flow__step').forEach(function (s) {
        s.classList.remove('is-open');
        var b = s.querySelector('.iss-flow__btn');
        var p = s.querySelector('.iss-flow__panel');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (p) p.hidden = true;
      });
      if (!wasOpen && panel) {
        step.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  }

  /* Onglets */
  var tabsRoot = document.querySelector('[data-iss-tabs]');
  if (tabsRoot) {
    tabsRoot.addEventListener('click', function (ev) {
      var tab = ev.target.closest('.iss-tabs__tab');
      if (!tab || !tabsRoot.contains(tab)) return;
      var key = tab.getAttribute('data-tab');
      tabsRoot.querySelectorAll('.iss-tabs__tab').forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tabsRoot.querySelectorAll('.iss-tabs__panel').forEach(function (p) {
        p.classList.remove('is-active');
        p.hidden = true;
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('iss-panel-' + key);
      if (panel) {
        panel.classList.add('is-active');
        panel.hidden = false;
      }
    });
  }

  /* Live ISS — une requête au chargement + bouton actualiser */
  function formatTime(ts) {
    if (ts == null) return '—';
    var d = typeof ts === 'number' ? new Date(ts * 1000) : new Date(ts);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' });
  }

  function setLiveStatus(el, msg, isError) {
    if (!el) return;
    el.textContent = msg;
    if (isError) el.classList.add('is-error');
    else el.classList.remove('is-error');
  }

  function updateLiveFields(data) {
    var lat = document.getElementById('iss-live-lat');
    var lon = document.getElementById('iss-live-lon');
    var alt = document.getElementById('iss-live-alt');
    var spd = document.getElementById('iss-live-speed');
    var tim = document.getElementById('iss-live-time');
    if (lat) lat.textContent = data.latitude != null ? data.latitude.toFixed(5) + '°' : '—';
    if (lon) lon.textContent = data.longitude != null ? data.longitude.toFixed(5) + '°' : '—';
    if (alt && data.altitude != null) alt.textContent = data.altitude.toFixed(2) + ' km';
    if (spd && data.velocity != null)
      spd.textContent =
        data.velocity.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' km/h';
    if (tim) tim.textContent = formatTime(data.timestamp);
  }

  async function fetchISSLive() {
    var statusEl = document.getElementById('iss-live-status');
    var btn = document.getElementById('iss-live-refresh');
    if (btn) btn.disabled = true;
    setLiveStatus(statusEl, 'Connexion à l’API Where The ISS At…', false);
    try {
      var response = await fetch(API_URL);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var data = await response.json();
      if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
        throw new Error('Coordonnées invalides');
      }
      updateLiveFields(data);
      setLiveStatus(statusEl, 'Données reçues — même source que la démo locale.', false);
    } catch (err) {
      console.error(err);
      setLiveStatus(
        statusEl,
        'Impossible de joindre l’API (réseau, CORS ou quota). Ouvrez la démo sur un serveur HTTP local.',
        true
      );
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  var liveRoot = document.querySelector('[data-iss-live]');
  if (liveRoot) {
    fetchISSLive();
    var refreshBtn = document.getElementById('iss-live-refresh');
    if (refreshBtn) refreshBtn.addEventListener('click', fetchISSLive);
  }

  /* Tilt hero */
  var heroVis = document.getElementById('issHeroVisual');
  if (heroVis && !prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    var maxTilt = 6;
    heroVis.addEventListener('mousemove', function (ev) {
      var r = heroVis.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width - 0.5;
      var py = (ev.clientY - r.top) / r.height - 0.5;
      heroVis.style.transform =
        'perspective(880px) rotateY(' +
        px * maxTilt +
        'deg) rotateX(' +
        -py * maxTilt +
        'deg) translateZ(3px)';
    });
    heroVis.addEventListener('mouseleave', function () {
      heroVis.style.transform = '';
    });
  }

  /* Horloge HUD */
  var clockEl = document.getElementById('iss-hud-clock');
  function tickClock() {
    if (!clockEl) return;
    var now = new Date();
    clockEl.textContent = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* Champ d’étoiles canvas */
  function initCosmos() {
    var canvas = document.getElementById('issCosmos');
    if (!canvas || prefersReduced) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var stars = [];
    var n = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.3,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          a: Math.random() * 0.5 + 0.2,
        });
      }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < stars.length; j++) {
        var s = stars[j];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x += canvas.width;
        if (s.x > canvas.width) s.x -= canvas.width;
        if (s.y < 0) s.y += canvas.height;
        if (s.y > canvas.height) s.y -= canvas.height;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226, 232, 240, ' + s.a + ')';
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
  initCosmos();
})();
