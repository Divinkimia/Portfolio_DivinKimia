# Documentation — `assets/vendor/bootstrap/`

Ce dossier contient **Bootstrap 5.3.2** (fichiers minifiés officiels) et la **documentation du portfolio** pour savoir quoi charger où. Vue d’ensemble du site : **`docs/PORTFOLIO-STRUCTURE.md`** à la racine du projet.

## Arborescence

```
assets/vendor/bootstrap/
├── README.md                    ← Vue globale + chemins HTML
├── bootstrap.min.css            ← CSS vendor (ne pas modifier — voir en-tête dans le fichier)
├── bootstrap.bundle.min.js      ← JS vendor (collapse, dropdown, modal…)
├── bootstrap-overrides.css      ← Exemples de surcharges + tableau pages ↔ CSS projet
└── doc/
    ├── README.md                ← Ce fichier
    ├── INDEX.md                 ← Détail du contenu logique de Bootstrap (grille, navbar…)
    ├── PAGES-ET-CSS.md          ← Quelle page HTML utilise quel CSS du portfolio
    └── MIGRATION_BOOTSTRAP.md   ← Historique / migration
```

## Fichiers à ne pas confondre

| Fichier | Rôle |
|--------|------|
| `bootstrap.min.css` | **Bibliothèque complète** (une seule ligne minifiée après l’en-tête). Toute la logique Bootstrap y est ; on ne la lit pas à la main : utiliser `doc/INDEX.md` pour la cartographie. |
| `bootstrap.bundle.min.js` | **Comportements** : menu mobile (`collapse`), menus déroulants (`dropdown`), modales, etc. |
| `bootstrap-overrides.css` | **Référence projet** : exemples et tableau des pages — chargement **optionnel** après `bootstrap.min.css`. |
| Vos pages | Chaque page charge Bootstrap **puis** son propre fichier dans `assets/css/…` (voir `PAGES-ET-CSS.md`). |

## Liens utiles

- [INDEX.md](./INDEX.md) — sections logiques du CSS Bootstrap (variables, grille, navbar…).
- [PAGES-ET-CSS.md](./PAGES-ET-CSS.md) — correspondance **pages HTML** ↔ **fichiers CSS du portfolio** ↔ **classes Bootstrap typiques**.
