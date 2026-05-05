/**
 * Année dynamique + bouton retour en haut (footer commun toutes pages).
 */
(function () {
  function init() {
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
    var btn = document.querySelector('.site-footer .back-to-top');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
