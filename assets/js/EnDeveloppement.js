/**
 * Page En developpement : entree GSAP + micro-animation sur l'icone.
 * Respecte prefers-reduced-motion ; fonctionne sans GSAP (pas d'erreur).
 */
(function () {
  'use strict';

  if (!document.body.classList.contains('wip-page')) return;

  var reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    document.body.classList.add('wip-reduced-motion');
    return;
  }

  if (typeof gsap === 'undefined') return;

  function boot() {
    var iconSvg = document.querySelector('.wip-card__icon svg');
    var heroKicker = document.querySelector('.wip-hero__kicker');
    var heroTitle = document.querySelector('.wip-hero__title');
    var card = document.querySelector('.wip-card');
    var lead = document.querySelector('.wip-card__lead');
    var note = document.querySelector('.wip-card__note');
    var iconBox = document.querySelector('.wip-card__icon');
    var buttons = document.querySelectorAll('.wip-actions .wip-btn');

    if (!card) return;

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroKicker) {
      tl.from(heroKicker, { y: 20, opacity: 0, duration: 0.48 }, 0);
    }
    if (heroTitle) {
      tl.from(heroTitle, { y: 34, opacity: 0, duration: 0.58 }, 0.08);
    }

    tl.from(
      card,
      { y: 44, opacity: 0, scale: 0.94, duration: 0.72, transformOrigin: '50% 80%' },
      0.12
    );

    if (iconBox) {
      tl.from(
        iconBox,
        { scale: 0.65, rotation: -18, opacity: 0, duration: 0.5, transformOrigin: '50% 50%' },
        0.35
      );
    }

    if (lead) {
      tl.from(lead, { y: 18, opacity: 0, duration: 0.42 }, 0.42);
    }
    if (note) {
      tl.from(note, { y: 14, opacity: 0, duration: 0.38 }, 0.52);
    }
    if (buttons.length) {
      tl.from(buttons, { y: 16, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.58);
    }

    if (iconSvg) {
      tl.add(
        function () {
          gsap.to(iconSvg, {
            rotation: 11,
            transformOrigin: '50% 50%',
            duration: 2.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        },
        0.85
      );
    }

    tl.add(
      function () {
        gsap.to(card, {
          y: -6,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      },
      1.05
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
