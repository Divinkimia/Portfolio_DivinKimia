# Migration Bootstrap 5 - Portfolio Divin Kimia

## État de la migration

### ✅ Phase 1 - Bootstrap local (Terminé)
- Dossier `/bootstrap` créé avec Bootstrap 5.3.2
- Fichiers : `bootstrap.min.css`, `bootstrap.bundle.min.js`
- Toutes les pages utilisaient `../bootstrap/` ou `../../bootstrap/` (voir Phase 7 ci-dessous pour la structure actuelle).

### ✅ Phase 2 - Pages mises à jour
- Accueil, Projets, Veilles, Blog, MeDecouvrir : Bootstrap local
- Toutes les pages Parcours_HTML : Bootstrap local
- ExperiencesProfessionnels et CertificationPage : Bootstrap ajouté

### ✅ Phase 3 - Accueil.html refactorisé
- Navbar convertie en composant Bootstrap (navbar-expand-lg, collapse, navbar-toggler)
- Footer : classes Bootstrap (flex-column, justify-content-*)
- Hero actions : flex-column flex-md-row
- Grille déjà en place (container, row, col-*)

### ✅ Phase 4 - CSS Accueil.css nettoyé
- Media queries min-width (1920px, 2560px) supprimées
- Override container supprimé
- Media query footer supprimée
- Navbar mobile : 1 bloc @media (991.98px) conservé pour le style du menu (position fixed)

### Phase 5 - Toutes les pages migrées (Terminé)
- **Projets** : navbar Bootstrap (main-nav), footer row/col, grille projets
- **Veilles** : navbar veilles-navbar, hero-stats/actions, intro, shelves, analyses, resources, footer
- **Blog** : navbar accueil-navbar (Accueil.css), footer
- **MeDecouvrir** : navbar medecouvrir-navbar, about, passions, gallery, personality, footer
- **Parcours** (7 pages) : navbar parcours-navbar sur FormationsPage, ExperiencesProfessionnels, CertificationPage, FormationBTS_SIO, FormationDAEU, FormationCS_SNO, FormationBT_GestionInformatique

### Phase 6 - Pages de présentation des projets (Terminé)
- **FS Barber** (Presentation FS Barber) : Bootstrap, grille features
- **Application Météo** (presentation.html) : navbar Bootstrap, hero row/col
- **MachineLearning** (presentation.html) : header Bootstrap, hero + about-points grille
- **Kim Shoes** (KmshoesVF/Presentation) : navbar Bootstrap, features-grid
- **MAUICoach** (index.html) : Bootstrap, hero-ad-layout row/col
- **Projetradar** (presentation.html) : Bootstrap navbar (Tailwind conservé pour le reste)

### Phase 7 — Arborescence `pages/` + `assets/` (2026)
- Dossier **`HTML/`** renommé en **`pages/`** (toutes les pages du site).
- **`CSS/`**, **`JS/`**, **`IMG/`** déplacés sous **`assets/css/`**, **`assets/js/`**, **`assets/img/`**.
- **`bootstrap/`** déplacé sous **`assets/vendor/bootstrap/`**.
- Chemins mis à jour dans les HTML (script `tools/fix-asset-paths.py`).
- **`index.html`** à la racine redirige vers **`pages/Accueil.html`**.
- Documentation : **`docs/PORTFOLIO-STRUCTURE.md`** à la racine du projet.
