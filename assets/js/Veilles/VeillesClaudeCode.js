/**
 * Veille Claude Code - meme parcours que OpenClaw/HeyGen
 * Donnees : window.VEILLE_DATA (VeillesClaudeCode-data.js)
 */
(function () {
  'use strict';

  let galaxyEffect = null;

  function initGalaxyEffect() {
    const galaxyContainer = document.getElementById('galaxy-container');
    if (!galaxyContainer) return;
    if (typeof GalaxyEffect !== 'undefined') {
      galaxyEffect = new GalaxyEffect(
        galaxyContainer,
        typeof getGalaxyLightPortfolioOptions === 'function' ? getGalaxyLightPortfolioOptions() : {}
      );
    }
  }

  function initNavbarScroll() {
    const nav = document.querySelector('.navbar.parcours-navbar');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', (window.scrollY || document.documentElement.scrollTop) > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function isFullscreenActive() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }

  function syncVeilleFullscreenNav() {
    document.body.classList.toggle('veille-fs-reading', isFullscreenActive());
  }

  function initVeilleFullscreenNav() {
    syncVeilleFullscreenNav();
    document.addEventListener('fullscreenchange', syncVeilleFullscreenNav);
    document.addEventListener('webkitfullscreenchange', syncVeilleFullscreenNav);
    document.addEventListener('MSFullscreenChange', syncVeilleFullscreenNav);
  }

  const data = window.VEILLE_DATA;
  let flatLessons = [];
  let currentIndex = 0;

  function flatten() {
    flatLessons = [];
    if (!data || !data.modules) return;
    data.modules.forEach((mod) => {
      mod.lessons.forEach((lesson) => {
        flatLessons.push({
          ...lesson,
          moduleTitle: mod.title,
          moduleId: mod.id
        });
      });
    });
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function openModuleForCurrentLesson() {
    const cur = flatLessons[currentIndex];
    if (!cur) return;
    document.querySelectorAll('.veille-mod').forEach((modEl) => {
      const isHere = modEl.dataset.moduleId === cur.moduleId;
      modEl.classList.toggle('is-open', isHere);
      const toggle = modEl.querySelector('.veille-mod-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', isHere ? 'true' : 'false');
    });
  }

  function buildAccordion(filterText) {
    const host = document.getElementById('veilleAccordion');
    if (!host || !data || !data.modules) return;
    const q = (filterText || '').trim().toLowerCase();
    host.innerHTML = '';

    data.modules.forEach((mod) => {
      const matchMod = !q || mod.title.toLowerCase().includes(q) ||
        mod.lessons.some((l) => l.title.toLowerCase().includes(q));
      if (!matchMod) return;

      const modEl = document.createElement('div');
      modEl.className = 'veille-mod';
      modEl.dataset.moduleId = mod.id;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'veille-mod-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<span>' + escapeHtml(mod.title) + '</span><i data-feather="chevron-down" class="chev" width="18"></i>';

      const body = document.createElement('div');
      body.className = 'veille-mod-body';
      mod.lessons.forEach((lesson) => {
        if (q && !lesson.title.toLowerCase().includes(q) && !mod.title.toLowerCase().includes(q)) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'veille-lesson';
        btn.dataset.lessonId = lesson.id;
        btn.textContent = lesson.title;
        btn.addEventListener('click', () => {
          const idx = flatLessons.findIndex((l) => l.id === lesson.id);
          if (idx >= 0) selectLesson(idx);
          closeSidebarMobile();
        });
        body.appendChild(btn);
      });

      if (!body.children.length) return;

      toggle.addEventListener('click', () => {
        const open = modEl.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      modEl.appendChild(toggle);
      modEl.appendChild(body);
      host.appendChild(modEl);
    });

    if (typeof feather !== 'undefined') feather.replace();
    openModuleForCurrentLesson();
    syncLessonButtons();
  }

  function syncLessonButtons() {
    const cur = flatLessons[currentIndex];
    if (!cur) return;
    document.querySelectorAll('.veille-lesson').forEach((btn) => {
      btn.classList.toggle('is-current', btn.dataset.lessonId === cur.id);
    });
  }

  function updateNavButtons() {
    const prev = document.getElementById('veillePrevLesson');
    const next = document.getElementById('veilleNextLesson');
    if (prev) prev.disabled = currentIndex <= 0;
    if (next) next.disabled = currentIndex >= flatLessons.length - 1;
  }

  function selectLesson(index) {
    if (index < 0 || index >= flatLessons.length) return;
    currentIndex = index;
    const L = flatLessons[currentIndex];

    const heroImg = document.getElementById('veilleHeroImg');
    const heroHeading = document.getElementById('veilleHeroHeading');
    const courseTitle = document.getElementById('veilleCourseTitle');
    const lead = document.getElementById('veilleLead');
    const bodyEl = document.getElementById('veilleBody');
    const meta = document.getElementById('veilleMeta');

    if (heroImg) {
      heroImg.src = L.hero;
      heroImg.alt = L.title;
    }
    if (heroHeading) heroHeading.textContent = L.title;
    if (courseTitle) courseTitle.textContent = L.title;
    document.title = 'Divin Kimia | ' + L.title + ' - Claude Code';
    if (lead) lead.textContent = L.lead;

    const objTitle = document.getElementById('veilleObjectifsTitle');
    if (objTitle) objTitle.textContent = L.bullets && L.bullets.length ? 'Points cles' : 'Synthese';

    if (bodyEl) {
      bodyEl.innerHTML = '';
      (L.body || []).forEach((para) => {
        const p = document.createElement('p');
        p.textContent = para;
        bodyEl.appendChild(p);
      });
      if (L.bullets && L.bullets.length) {
        const ul = document.createElement('ul');
        ul.className = 'veille-objectives-list';
        L.bullets.forEach((b) => {
          const li = document.createElement('li');
          li.textContent = b;
          ul.appendChild(li);
        });
        bodyEl.appendChild(ul);
      }
      if (L.appendHtml) {
        const wrap = document.createElement('div');
        wrap.className = 'veille-lesson-rich';
        wrap.innerHTML = L.appendHtml;
        bodyEl.appendChild(wrap);
      }
    }

    if (meta) {
      meta.innerHTML =
        '<span><i data-feather="folder" style="width:14px;vertical-align:middle"></i> ' + escapeHtml(L.moduleTitle) + '</span>' +
        '<span><i data-feather="clock" style="width:14px;vertical-align:middle"></i> Veille ' + new Date().getFullYear() + '</span>';
    }

    const pct = flatLessons.length ? Math.round(((currentIndex + 1) / flatLessons.length) * 100) : 0;
    const fill = document.getElementById('veilleProgressFill');
    const pctEl = document.getElementById('veilleProgressPct');
    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';

    openModuleForCurrentLesson();
    syncLessonButtons();
    updateNavButtons();
    if (typeof feather !== 'undefined') feather.replace();

    const hero = document.querySelector('.veille-hero');
    if (hero && typeof hero.scrollIntoView === 'function') {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function closeSidebarMobile() {
    document.getElementById('veilleSidebar')?.classList.remove('is-open');
    document.getElementById('veilleSidebarBackdrop')?.classList.remove('is-visible');
  }

  function openSidebarMobile() {
    document.getElementById('veilleSidebar')?.classList.add('is-open');
    document.getElementById('veilleSidebarBackdrop')?.classList.add('is-visible');
  }

  function initVeilleParcours() {
    if (!data || !data.modules) return;
    flatten();
    buildAccordion(document.getElementById('veilleSearchInput')?.value || '');
    if (flatLessons.length) selectLesson(0);

    document.getElementById('veillePrevLesson')?.addEventListener('click', () => selectLesson(currentIndex - 1));
    document.getElementById('veilleNextLesson')?.addEventListener('click', () => selectLesson(currentIndex + 1));
    document.getElementById('veilleOpenSidebar')?.addEventListener('click', openSidebarMobile);
    document.getElementById('veilleSidebarBackdrop')?.addEventListener('click', closeSidebarMobile);

    document.querySelectorAll('.veille-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const name = tab.dataset.tab;
        document.querySelectorAll('.veille-tab').forEach((t) => {
          t.classList.toggle('is-active', t.dataset.tab === name);
          t.setAttribute('aria-selected', t.dataset.tab === name ? 'true' : 'false');
        });
        const overview = document.getElementById('panelOverview');
        const resources = document.getElementById('panelResources');
        if (name === 'overview') {
          overview?.classList.add('is-visible');
          overview?.removeAttribute('hidden');
          resources?.classList.remove('is-visible');
          resources?.setAttribute('hidden', '');
        } else {
          resources?.classList.add('is-visible');
          resources?.removeAttribute('hidden');
          overview?.classList.remove('is-visible');
          overview?.setAttribute('hidden', '');
        }
        if (typeof feather !== 'undefined') feather.replace();
      });
    });

    document.getElementById('veilleBtnGlossary')?.addEventListener('click', () => {
      document.querySelector('.veille-tab[data-tab="resources"]')?.click();
      if (window.matchMedia('(max-width: 991.98px)').matches) {
        openSidebarMobile();
      }
    });

    const searchInput = document.getElementById('veilleSearchInput');
    searchInput?.addEventListener('input', (e) => buildAccordion(e.target.value));

    document.getElementById('veilleBtnFs')?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof feather !== 'undefined') feather.replace();
    initGalaxyEffect();
    initNavbarScroll();
    initVeilleFullscreenNav();
    initVeilleParcours();
  });
})();
