/**
 * Navbar commune + micro-optimisations de navigation et d'affichage.
 */
const prefetchedDocuments = new Set();

document.addEventListener('DOMContentLoaded', () => {
  initMobileParcoursDropdown();
  optimizeImagesLoading();
  initLinkPrefetch();
  scheduleNavPrefetchOnIdle();
});

const PORTFOLIO_THEME_KEY = 'portfolio-theme';

/** Le thème clair a été retiré : on ne crée plus de bouton de bascule. */
function initPortfolioThemeToggle() {
  try {
    localStorage.setItem(PORTFOLIO_THEME_KEY, 'dark');
  } catch (e) {
    /* ignore */
  }
}

function initMobileParcoursDropdown() {
  document.querySelectorAll('.parcours-navbar .dynamic-dropdown > .dropdown-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth < 992) {
        e.preventDefault();
        e.stopPropagation();
        toggle.parentElement.classList.toggle('open');
      }
    });
  });
}



function isFileProtocol() {
  return typeof window !== 'undefined' && window.location.protocol === 'file:';
}

function optimizeImagesLoading() {
  const images = document.querySelectorAll('img');
  if (!images.length) {
    return;
  }

  images.forEach((img) => {
    if (!img.getAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }

    if (!img.getAttribute('fetchpriority')) {
      const isLikelyHero = img.loading === 'eager' || img.closest(
        '.hero, .hero-content, .veille-hero-net, .veille-hero, .stage-fsb-hero, .stage-ca-hero, .stage-ics-hero, .profile-sticker, .parcours-navbar .nav-left'
      );
      if (isLikelyHero) {
        img.setAttribute('fetchpriority', 'high');
      }
    }

    if (!img.getAttribute('loading')) {
      const rect = img.getBoundingClientRect();
      const nearViewport = rect.top < (window.innerHeight * 1.2);
      img.setAttribute('loading', nearViewport ? 'eager' : 'lazy');
    }
  });
}

function reservePrefetchSlot(href) {
  if (prefetchedDocuments.has(href)) {
    return false;
  }
  prefetchedDocuments.add(href);
  return true;
}

function injectPrefetchLink(href) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = 'document';
  document.head.appendChild(link);
}

function appendDocumentPrefetch(href) {
  if (!reservePrefetchSlot(href)) {
    return;
  }
  injectPrefetchLink(href);
}

function initLinkPrefetch() {
  if (isFileProtocol()) {
    return;
  }
  document.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      return;
    }

    const shouldPrefetch = () => {
      appendDocumentPrefetch(url.href);
    };

    anchor.addEventListener('mouseenter', shouldPrefetch, { passive: true, once: true });
    anchor.addEventListener('touchstart', shouldPrefetch, { passive: true, once: true });
  });
}

function scheduleNavPrefetchOnIdle() {
  const run = () => prefetchMainNavLinksStaggered();
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(run, { timeout: 5000 });
  } else {
    setTimeout(run, 500);
  }
}

function prefetchMainNavLinksStaggered() {
  if (isFileProtocol()) {
    return;
  }
  const maxPrefetch = 14;
  const staggerMs = 55;
  const selectors = '.parcours-navbar a[href], .site-footer a[href], footer.site-footer a[href]';
  const anchors = document.querySelectorAll(selectors);
  let scheduled = 0;

  for (let i = 0; i < anchors.length && scheduled < maxPrefetch; i++) {
    const anchor = anchors[i];
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch (e) {
      continue;
    }

    if (url.origin !== window.location.origin) {
      continue;
    }

    const target = url.href;
    if (!reservePrefetchSlot(target)) {
      continue;
    }

    const delay = scheduled * staggerMs;
    scheduled++;
    setTimeout(() => {
      injectPrefetchLink(target);
    }, delay);
  }
}
