/**
 * Force le portfolio en thème sombre.
 * Nettoie toute ancienne préférence "light" stockée localement.
 */
(function () {
  document.documentElement.removeAttribute('data-theme');
  try {
    localStorage.setItem('portfolio-theme', 'dark');
  } catch (e) {
    /* ignore private mode / désactivation stockage */
  }
})();
