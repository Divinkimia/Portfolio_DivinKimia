# Pages HTML ↔ CSS du portfolio ↔ Bootstrap

Ce tableau indique **quelle page** charge **quel fichier de styles** (hors Bootstrap) et **quels usages Bootstrap** sont les plus fréquents.

> Toutes les pages listées chargent aussi :  
> `assets/vendor/bootstrap/bootstrap.min.css` + `bootstrap.bundle.min.js` (chemins relatifs selon la profondeur du fichier HTML).

---

## Pages principales (`pages/`)

| Page HTML | Fichier CSS du projet | Navbar / classe repère | Bootstrap souvent utilisé |
|-----------|------------------------|-------------------------|-----------------------------|
| `Accueil.html` | `assets/css/Accueil.css` | `.accueil-navbar` | `navbar`, `collapse`, `container`, `row`, `col-*`, `btn` |
| `Projets/index.html` | `assets/css/Projets/Projets.css` | `.parcours-navbar` / grille projets | `navbar`, `collapse`, `container`, `row`, `col-*`, cartes |
| `Veilles/Veilles.html` | `assets/css/Veilles.css` | `.veilles-navbar` | idem |
| `Blog.html` | `assets/css/Accueil.css` (ou partagé) | `.accueil-navbar` | idem |
| `MeDecouvrir.html` | `assets/css/me-decouvrir.css` | `.parcours-navbar` | idem |

---

## Parcours (`pages/Parcours_HTML/`)

| Pages | Fichier CSS du projet | Classe repère | Bootstrap |
|-------|------------------------|---------------|-----------|
| `ExperiencesProfessionnels.html`, `FormationsPage.html`, `CertificationPage.html`, formations diverses, etc. | `assets/css/Parcours_CSS/*.css` (un ou plusieurs par page) | `.parcours-navbar` | `navbar`, `dropdown` (menu Parcours), `collapse`, `container`, `row`, `col-*` |

---

## Présentations projets (`pages/Projets/`)

| Dossier / page | Fichier CSS du projet | Notes |
|----------------|------------------------|-------|
| `Presentation RadarPF/presentation.html` | `assets/css/Projets/cssRadar/presentation.css` | Grille + footer type portfolio |
| `PresentationMachineLearning/presentation-ml5-classifieur.html` | `assets/css/Projets/cssMachineLearning/*.css` | Nav îlot + sections |
| `PresentationMétéo/presentation.html` | `assets/css/Projets/cssMétéo/presentation.css` + chrome ML partagé | idem |
| `Presentation FS Barber/presentation-fs-barber.html` | `assets/css/Projets/cssFS Barber/presentation-fs-barber.css` | |
| `PresentationKim-shoes/presentation-kim-shoes.html` | `assets/css/Projets/CSSKimShoes/presentation-kim-shoes.css` | |
| `Presentation MAUICoach/presentation-maui-coach.html` | `assets/css/Projets/cssMAUICoach/presentation-maui-coach.css` | |

Les **chemins relatifs** vers Bootstrap depuis ces pages sont en général :  
`../../../assets/vendor/bootstrap/bootstrap.min.css` (trois niveaux depuis `pages/Projets/<projet>/`).

---

## Règle simple

1. **Bootstrap** = comportement commun (grille, responsive, navbar collapse, utilitaires `d-flex`, `mb-3`, etc.).
2. **Votre CSS** (`assets/css/…`) = couleurs, typo, décorations, surcharges du `navbar-toggler`, etc.
3. **Ne pas éditer** `bootstrap.min.css` pour personnaliser : préférer votre feuille de page ou `bootstrap-overrides.css` si vous l’activez.
