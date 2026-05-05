/**
 * Page Veilles — landing NetAcad-like (carousel, stats, filtres, citations)
 */
(function () {
  'use strict';

  let galaxyEffect = null;

  function initGalaxy() {
    const el = document.getElementById('galaxy-container');
    if (!el || typeof GalaxyEffect === 'undefined') return;
    galaxyEffect = new GalaxyEffect(
      el,
      typeof getGalaxyLightPortfolioOptions === 'function' ? getGalaxyLightPortfolioOptions() : {}
    );
  }

  function initNavbarScroll() {
    const nav = document.querySelector('.navbar.parcours-navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initCarousel() {
    const track = document.getElementById('veilleCarousel');
    const prev = document.getElementById('veilleCarPrev');
    const next = document.getElementById('veilleCarNext');
    if (!track || !prev || !next) return;

    const step = () => {
      const card = track.querySelector('.veille-course-card');
      return card ? card.offsetWidth + 20 : 320;
    };

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });
  }

  const quotes = [
    {
      text: 'La veille n’est pas une accumulation de liens : c’est un cadre pour décider et expliquer.',
      name: 'Divin Kimia',
      role: 'développeur web & passionné d’IA'
    },
    {
      text: 'Structurer ses sources, c’est gagner du temps quand la techno accélère.',
      name: 'Portfolio',
      role: 'méthode de veille continue'
    }
  ];
  let quoteIndex = 0;

  function initQuotes() {
    const textEl = document.getElementById('veilleQuoteText');
    const authEl = document.getElementById('veilleQuoteAuth');
    const prev = document.getElementById('veilleQuotePrev');
    const next = document.getElementById('veilleQuoteNext');
    if (!textEl || !authEl || !prev || !next) return;

    function render() {
      const q = quotes[quoteIndex];
      textEl.textContent = q.text;
      authEl.innerHTML = '<strong>' + q.name + '</strong> — ' + q.role;
      if (typeof feather !== 'undefined') feather.replace();
    }

    prev.addEventListener('click', () => {
      quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
      render();
    });
    next.addEventListener('click', () => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      render();
    });
  }

  function animateValue(el, target, isPct, duration) {
    const start = 0;
    const t0 = performance.now();
    function frame(now) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(start + (target - start) * eased);
      el.textContent = isPct ? val + '%' : String(val);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initStats() {
    const nums = document.querySelectorAll('.veille-stat-num[data-target]');
    if (!nums.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const isPct = el.classList.contains('veille-stat-num--pct');
          animateValue(el, target, isPct, 1400);
          obs.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );

    nums.forEach((n) => obs.observe(n));
  }

  /** Thèmes présents sur les cartes « notes » (data-topic), carrousel + grille étendue */
  const NOTES_TOPIC_IDS = new Set(['ia', 'web', 'sec', 'cloud', 'data', 'mobile', 'archi', 'innov']);

  function topicMatchesNotes(cardTopic, theme) {
    if (!theme) return true;
    if (theme === 'veille') return true;
    if (!NOTES_TOPIC_IDS.has(theme)) return false;
    return cardTopic === theme;
  }

  function isCardInPlay(card) {
    const extra = document.getElementById('veilleExtraWrap');
    if (extra && extra.hidden && card.closest('#veilleExtraWrap')) return false;
    return true;
  }

  /** Référence pour rafraîchir le filtre après ouverture de la grille */
  let applyVeilleFilter = null;

  function initFilter() {
    const form = document.getElementById('veilleFilterForm');
    const themeEl = document.getElementById('veilleFilterTheme');
    const qEl = document.getElementById('veilleFilterQ');
    if (!form || !themeEl || !qEl) return;

    function scrollCarouselToStart() {
      const track = document.getElementById('veilleCarousel');
      if (track) track.scrollLeft = 0;
    }

    function applyFilter() {
      const t = themeEl.value;
      const kw = (qEl.value || '').trim().toLowerCase();

      let visibleInPlay = 0;

      document.querySelectorAll('.veille-course-card').forEach((card) => {
        const topic = card.getAttribute('data-topic') || '';
        const text = card.textContent.toLowerCase();
        const matchTopic = topicMatchesNotes(topic, t);
        const matchKw = !kw || text.includes(kw);
        const hide = !(matchTopic && matchKw);
        card.classList.toggle('veille-course-card--hidden', hide);
        card.classList.remove('is-dim');
        if (!hide && isCardInPlay(card)) visibleInPlay++;
      });

      const emptyEl = document.getElementById('veilleNotesEmpty');
      if (emptyEl) emptyEl.hidden = visibleInPlay > 0;

      document.querySelectorAll('.veille-domain-card').forEach((card) => {
        const d = card.getAttribute('data-domain') || '';
        const label = card.textContent.toLowerCase();
        const matchTheme = !t || d === t;
        const matchKw = !kw || label.includes(kw);
        card.classList.toggle('is-dim', !(matchTheme && matchKw));
        const selected = !!t && d === t;
        card.classList.toggle('is-selected', selected);
        card.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });

      if (typeof feather !== 'undefined') feather.replace();
    }

    applyVeilleFilter = applyFilter;

    document.querySelectorAll('.veille-domain-card').forEach((card) => {
      card.addEventListener('click', () => {
        const domain = card.getAttribute('data-domain');
        if (themeEl.value === domain) {
          themeEl.value = '';
        } else {
          themeEl.value = domain;
        }
        applyFilter();
        scrollCarouselToStart();
        document.getElementById('notes')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      card.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        card.click();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilter();
      scrollCarouselToStart();
    });
    themeEl.addEventListener('change', () => {
      applyFilter();
      scrollCarouselToStart();
    });
    qEl.addEventListener('input', applyFilter);

    applyFilter();
  }

  function initShowAllVeilles() {
    const wrap = document.getElementById('veilleExtraWrap');
    const toggles = document.querySelectorAll('[data-veille-toggle-extra]');
    if (!wrap || !toggles.length) return;

    function syncToggleButtons(isOpen) {
      toggles.forEach((b) => {
        b.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        b.textContent = isOpen ? 'Masquer toutes les veilles' : 'Afficher toutes les veilles';
      });
    }

    function onToggle(e) {
      const wasHidden = wrap.hidden;
      wrap.hidden = !wasHidden;
      const isOpen = !wrap.hidden;
      syncToggleButtons(isOpen);
      if (typeof feather !== 'undefined') feather.replace();
      if (applyVeilleFilter) applyVeilleFilter();
      if (wasHidden && isOpen) {
        wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      /* Fermeture depuis le bouton en bas → retour vers « Les veilles récentes » */
      if (!isOpen && e.currentTarget.getAttribute('data-veille-toggle-from') === 'bottom') {
        document.getElementById('notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    toggles.forEach((btn) => btn.addEventListener('click', onToggle));
  }

  /**
   * Cartes cliquables : enveloppe thumb + body dans <a> (le bouton partager reste hors lien).
   */
  function initVeilleCardLinks() {
    document.querySelectorAll('.veille-course-card[data-veille-href]').forEach((card) => {
      if (card.querySelector('.veille-course-card__link')) return;
      const href = card.getAttribute('data-veille-href');
      if (!href) return;
      const thumb = card.querySelector('.veille-course-thumb');
      const body = card.querySelector('.veille-course-body');
      const share = card.querySelector('.veille-share-btn');
      if (!thumb || !body || !share) return;

      const titleText = card.querySelector('.veille-course-title')?.textContent?.trim() || 'Ouvrir la veille';
      share.remove();
      thumb.remove();
      body.remove();

      const a = document.createElement('a');
      a.className = 'veille-course-card__link';
      a.href = href;
      a.setAttribute('aria-label', titleText);
      a.appendChild(thumb);
      a.appendChild(body);
      card.appendChild(a);
      card.appendChild(share);
    });
  }

  function initShareButtons() {
    document.getElementById('notes')?.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-veille-share]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.veille-course-card');
      const title =
        card?.querySelector('.veille-course-title')?.textContent?.trim() || 'Note de veille';
      const link = card?.querySelector('.veille-course-card__link');
      let url = `${window.location.href.split('#')[0]}#notes`;
      if (link && link.href) {
        try {
          url = new URL(link.getAttribute('href'), window.location.href).href;
        } catch (_) {}
      }
      try {
        if (navigator.share) {
          await navigator.share({ title, text: title, url });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
          const prev = btn.getAttribute('title');
          btn.setAttribute('title', 'Lien copié dans le presse-papiers');
          setTimeout(() => btn.setAttribute('title', prev || 'Partager'), 2200);
        }
      } catch (err) {
        if (err && err.name !== 'AbortError' && navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(url);
          } catch (_) {}
        }
      }
    });
  }

  function initMethodeVoirPlus() {
    const more = document.getElementById('veilleMethodeMore');
    const btn = document.getElementById('veilleMethodeToggle');
    if (!more || !btn) return;

    btn.addEventListener('click', () => {
      const open = more.hidden;
      more.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Voir moins' : 'Voir plus';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initVeilleCardLinks();
    if (typeof feather !== 'undefined') feather.replace();
    initGalaxy();
    initNavbarScroll();
    initCarousel();
    initQuotes();
    initStats();
    initFilter();
    initShowAllVeilles();
    initShareButtons();
    initMethodeVoirPlus();
  });
})();
