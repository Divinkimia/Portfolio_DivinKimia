# Bootstrap 5.3.2 — `assets/vendor/bootstrap/`

Bibliothèque **Bootstrap 5.3.2** partagée par tout le portfolio (grilles, barres de navigation responsive, composants, utilitaires).

## Arborescence

```
assets/vendor/bootstrap/
├── README.md                 ← Ce fichier
├── bootstrap.min.css         ← CSS officiel minifié (ne pas modifier pour du style perso)
├── bootstrap.bundle.min.js   ← JS officiel (menu mobile, dropdowns, modales…)
├── bootstrap-overrides.css   ← Référence + exemples de surcharges (optionnel à charger)
└── doc/
    ├── README.md             ← Carte de la documentation
    ├── INDEX.md              ← Contenu logique de Bootstrap (grille, navbar, etc.)
    ├── PAGES-ET-CSS.md       ← Quelle page HTML → quel CSS projet
    └── MIGRATION_BOOTSTRAP.md
```

Chaque fichier **vendor** (`*.min.css` / `*.min.js`) commence par un **court commentaire** qui renvoie vers `doc/` — le détail lisible est dans la documentation, pas dans le code minifié.

## Intégration rapide

| Emplacement du fichier HTML | Lien vers le CSS | Lien vers le JS |
|------------------------------|------------------|-----------------|
| `pages/Accueil.html` | `../assets/vendor/bootstrap/bootstrap.min.css` | `../assets/vendor/bootstrap/bootstrap.bundle.min.js` |
| `pages/Parcours_HTML/*.html` | `../../assets/vendor/bootstrap/bootstrap.min.css` | idem |
| `pages/Parcours_HTML/Formations/*.html` | `../../../assets/vendor/bootstrap/bootstrap.min.css` | idem |
| `pages/Projets/index.html` | `../../assets/vendor/bootstrap/bootstrap.min.css` | idem |
| `pages/Projets/<présentation>/*.html` | `../../../assets/vendor/bootstrap/bootstrap.min.css` | idem |

Chargez **ensuite** la feuille du projet (`assets/css/…`) pour les couleurs et la mise en forme propre à chaque page.

## Documentation détaillée

- **[doc/README.md](doc/README.md)** — rôle de chaque fichier.
- **[doc/PAGES-ET-CSS.md](doc/PAGES-ET-CSS.md)** — correspondance pages ↔ CSS du portfolio.
- **[doc/INDEX.md](doc/INDEX.md)** — ce que contient Bootstrap (sections logiques).

## Breakpoints (rappel)

| Préfixe | Largeur min |
|---------|-------------|
| `sm` | ≥ 576px |
| `md` | ≥ 768px |
| `lg` | ≥ 992px |
| `xl` | ≥ 1200px |
| `xxl` | ≥ 1400px |
