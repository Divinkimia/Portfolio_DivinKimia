# Index du dossier Bootstrap

> Emplacement : **`assets/vendor/bootstrap/`** — Bootstrap **5.3.2** pour le portfolio.  
> **Tableau page ↔ CSS du projet (à jour) :** [PAGES-ET-CSS.md](./PAGES-ET-CSS.md)  
> **Carte du dossier `bootstrap/` :** [README.md](./README.md)

---

## QUEL FICHIER POUR QUELLE PAGE ?

Toutes les pages chargent `bootstrap.min.css` et `bootstrap.bundle.min.js`. Le **CSS du projet** (`assets/css/…`) personnalise couleurs, navbar, etc.

| Zone | Fichier HTML typique | CSS du projet | Classe navbar / repère |
|------|----------------------|---------------|-------------------------|
| Accueil | `pages/Accueil.html` | `assets/css/Accueil.css` | `.accueil-navbar` |
| Liste projets | `pages/Projets/index.html` | `assets/css/Projets/Projets.css` | `.parcours-navbar` (voir fichier) |
| Veilles | `pages/Veilles/Veilles.html` | `assets/css/Veilles.css` | `.veilles-navbar` |
| Blog | `pages/Blog.html` | souvent `assets/css/Accueil.css` | `.accueil-navbar` |
| Me découvrir | `pages/MeDecouvrir.html` | `assets/css/me-decouvrir.css` | `.parcours-navbar` |
| Parcours | `pages/Parcours_HTML/*.html` | `assets/css/Parcours_CSS/*.css` | `.parcours-navbar` |
| Présentations | `pages/Projets/Presentation*/…` | `assets/css/Projets/css…/` | selon projet (voir [PAGES-ET-CSS.md](./PAGES-ET-CSS.md)) |

**Résumé :** Bootstrap = grille + navbar responsive + dropdown + utilitaires. Chaque page ajoute **son** CSS pour l’identité visuelle.

---

## Emplacement Bootstrap dans le projet

Bootstrap est versionné sous **`assets/vendor/bootstrap/`** (voir `docs/PORTFOLIO-STRUCTURE.md` à la racine du portfolio).

```
assets/vendor/bootstrap/
├── README.md
├── bootstrap.min.css
├── bootstrap.bundle.min.js
├── bootstrap-overrides.css
└── doc/
    ├── README.md
    ├── INDEX.md
    ├── PAGES-ET-CSS.md
    └── MIGRATION_BOOTSTRAP.md
```

---

## QUE FAIT CHAQUE FICHIER BOOTSTRAP ?

### `bootstrap.min.css`

**Rôle :** Feuille de style principale de Bootstrap (version minifiée).

**Contenu (par ordre dans la source Bootstrap) :**

| Section | Rôle |
|--------|------|
| **Variables CSS** | `:root`, `--bs-*` (couleurs, espacements, typographie) |
| **Reboot** | Réinitialisation des styles par défaut des navigateurs |
| **Type** | Styles de base pour titres, paragraphes, listes |
| **Images** | `.img-fluid`, `.img-thumbnail`, figures |
| **Grille** | `.container`, `.row`, `.col-*`, `.g-*`, breakpoints |
| **Tables** | `.table`, `.table-striped`, variants |
| **Forms** | `.form-control`, `.form-select`, `.form-check`, etc. |
| **Boutons** | `.btn`, `.btn-primary`, variants, groupes |
| **Transitions** | Animations (fade, collapse, etc.) |
| **Dropdown** | Menus déroulants |
| **Boutons** (états) | Groupes de boutons, toggle |
| **Nav** | `.nav`, `.nav-tabs`, `.nav-pills` |
| **Navbar** | Barre de navigation responsive, collapse, toggler |
| **Card** | Cartes, `.card-body`, `.card-header` |
| **Accordion** | `.accordion`, panneaux repliables |
| **Breadcrumb** | Fil d'Ariane |
| **Pagination** | Numérotation de pages |
| **Badges** | `.badge`, `.rounded-pill` |
| **Alertes** | `.alert`, variants |
| **Progress** | Barres de progression |
| **Liste** | `.list-group` |
| **Modals** | Fenêtres modales |
| **Carousel** | Diaporamas |
| **Spinners** | Indicateurs de chargement |
| **Offcanvas** | Panneaux latéraux |
| **Placeholders** | Skeletons de contenu |
| **Tooltips** | Infobulles (positionnement) |
| **Popovers** | Bulles d’information |
| **Scrollspy** | Suivi de scroll pour navigation |
| **Utilities** | `d-*`, `flex-*`, `text-*`, `m-*`, `p-*`, etc. |

**Utilisation :** Charger en premier avant vos feuilles CSS personnalisées.

---

### `bootstrap.bundle.min.js`

**Rôle :** JavaScript Bootstrap (inclut Popper.js pour dropdowns, tooltips, popovers).

**Composants inclus :**

| Composant | Rôle | Attributs / déclencheurs |
|-----------|------|---------------------------|
| **Alert** | Fermeture d'alertes | `data-bs-dismiss="alert"` |
| **Button** | Toggle de boutons | `data-bs-toggle="button"` |
| **Carousel** | Diaporamas | `data-bs-ride`, `data-bs-slide` |
| **Collapse** | Affichage/masquage | `data-bs-toggle="collapse"`, `data-bs-target` |
| **Dropdown** | Menus déroulants | `data-bs-toggle="dropdown"` |
| **Modal** | Fenêtres modales | `data-bs-toggle="modal"` |
| **Offcanvas** | Panneaux latéraux | `data-bs-toggle="offcanvas"` |
| **Popover** | Bulles d’information | `data-bs-toggle="popover"` |
| **ScrollSpy** | Navigation par scroll | `data-bs-spy="scroll"` |
| **Tab** | Onglets | `data-bs-toggle="tab"` |
| **Toast** | Notifications | API JavaScript |
| **Tooltip** | Infobulles | `data-bs-toggle="tooltip"` |

**Utilisation :** Charger avec `defer` en fin de `<body>`.

---

### `bootstrap-overrides.css`

**Rôle :** Surcharges et personnalisations Bootstrap pour le projet.

**Contenu :** Exemples d’overrides fréquents (navbar-toggler, couleurs, espacements, etc.) avec des commentaires expliquant chaque bloc.

**Utilisation :** Charger après `bootstrap.min.css` si vous l’intégrez au projet.

---

## Composants utilisés dans le projet

| Page / zone | Bootstrap utilisé |
|-------------|-------------------|
| **Navbar** (toutes pages) | `navbar`, `navbar-expand-lg`, `navbar-toggler`, `collapse`, `navbar-nav` |
| **Footer** | `row`, `col-*`, `flex-column`, `justify-content-*` |
| **Grille** | `container`, `row`, `col-*`, `g-*` |
| **Hero** | `flex-column`, `flex-md-row`, `gap-*` |
| **Projets** | Grille `col-*` pour cartes de projets |
| **Veilles** | `row`, `col-*` pour sections (shelves, analyses, etc.) |
| **Blog** | Structure identique aux autres pages |
| **MeDecouvrir** | Grille + sections |
| **Parcours** | 7 pages avec navbar et grille Bootstrap |
| **Présentations** (FS Barber, Météo, etc.) | Navbar + grilles + hero |

---

## Chemins d’intégration

| Emplacement des pages | Chemin typique vers Bootstrap |
|------------------------|-------------------------------|
| `pages/*.html` | `../assets/vendor/bootstrap/bootstrap.min.css` |
| `pages/Parcours_HTML/*.html` | `../../assets/vendor/bootstrap/bootstrap.min.css` |
| `pages/Parcours_HTML/Formations/*.html` | `../../../assets/vendor/bootstrap/bootstrap.min.css` |
| `pages/Projets/index.html` | `../../assets/vendor/bootstrap/bootstrap.min.css` |
| `pages/Projets/<présentation>/*.html` | `../../../assets/vendor/bootstrap/bootstrap.min.css` |

Même logique pour `assets/css/`, `assets/js/`, `assets/img/`. Adapter le nombre de `../` si vous déplacez un fichier HTML.

---

## Breakpoints Bootstrap 5

| Classe | Largeur |
|--------|---------|
| `sm` | ≥ 576px |
| `md` | ≥ 768px |
| `lg` | ≥ 992px |
| `xl` | ≥ 1200px |
| `xxl` | ≥ 1400px |

---

## Références

- [Bootstrap 5.3 docs](https://getbootstrap.com/docs/5.3/)
- [Composants](https://getbootstrap.com/docs/5.3/components/)
- [Utilities](https://getbootstrap.com/docs/5.3/utilities/api/)
