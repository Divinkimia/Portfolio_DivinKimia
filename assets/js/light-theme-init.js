/**
 * Initialisation thème clair (pages *-light.html uniquement).
 * Ne modifie pas les pages du thème sombre.
 */
(function () {
  try {
    localStorage.setItem("portfolio-theme", "light");
  } catch (e) {
    /* stockage indisponible */
  }
})();
