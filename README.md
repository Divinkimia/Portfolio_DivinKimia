# Divin Kimia — Portfolio développeur

> Site vitrine statique : parcours, projets, certifications, veille tech et pages « à propos » — pensé pour être lisible, rapide à servir, et aligné avec un hébergement statique type **GitHub Pages**.

Bonjour — je suis **Divin Kimia**, développeur orienté **web** et **applications**. Ce dépôt est mon **portfolio personnel** (français) : accueil, expériences et formations, catalogue de **projets** avec présentations dédiées, **certifications**, **veilles** thématiques, **blog**, **contact**, **mentions légales**, plus des documents (CV, rapports) hors arborescence web classique.

---

## En bref

| | |
|---|---|
| **Type** | Site statique **HTML5 · CSS3 · JavaScript** (pas de framework unique sur tout le site) |
| **Entrées** | `index.html` (écran de chargement, thème sombre forcé, redirection vers l’accueil) · `index-light.html` (entrée **thème clair**) |
| **Objectif** | Présenter le profil, les réalisations et la veille technique |
| **Point fort** | Beaucoup de dépendances en **local** sous `assets/vendor/` (Bootstrap, GSAP, Highlight.js, ml5.js, Three.js, Font Awesome, Feather, etc.) + `fonts-offline.css` pour limiter la dépendance réseau |
| **Thèmes** | **Sombre** (référence) et **clair** : pages jumelles `*-light.html` à côté des pages principales, avec feuilles sous `assets/css/light/` et scripts `theme-init.js` / `light-theme-init.js` |

---

## Stack & bibliothèques (selon les pages)

**Cœur :** HTML, CSS, JavaScript.

**Souvent utilisées (souvent en local) :** Bootstrap 5, GSAP + ScrollTrigger, Highlight.js, **ml5.js** (projet classifieur), **Three.js** (effets type canvas accueil), Font Awesome, Feather Icons, **Tailwind** (fichier vendor pour certaines pages).

**Cartes & géo :** **Leaflet** (ex. suivi ISS, radars — parfois chargé en **CDN** sur une démo, voir la page concernée).

**Qualité & accessibilité :** `alt` sur les médias, ARIA sur les composants interactifs, SVG utilisés en `<img>` avec soin d’encodage UTF-8.

---

## Arborescence

```
Portfolio_DivinKimia/
├── index.html                 → chargement + thème sombre + redirection vers pages/Accueil.html
├── index-light.html           → entrée thème clair (préférences + navigation vers l’accueil clair)
├── pages/
│   ├── Accueil.html | Accueil-light.html
│   ├── Contact.html | Contact-light.html
│   ├── Blog.html | Blog-light.html
│   ├── MeDecouvrir.html | MeDecouvrir-light.html    → page « me découvrir » aboutie
│   ├── EnDeveloppement.html                         → placeholder « en cours » (utilisé par certains liens du menu)
│   ├── MentionsLegales.html | MentionsLegales-light.html
│   ├── ElementEnModification.html                  → page technique / brouillon si besoin
│   ├── Parcours_HTML/
│   │   ├── ExperiencesPro/                         → liste + stages (CA Pau, iConnected, FS Barber, Xceed Maroc, …)
│   │   ├── Formations/                             → hub + fiches (BTS SIO, CS SNO, DAEU, BT Gestion info, …)
│   │   ├── CertificationPage.html | …-light.html   → hub certifications
│   │   └── Certification-*.html                    → CCNA, CEH, SAA, Scrum Master (+ variantes light)
│   ├── Projets/
│   │   ├── index.html | index-light.html           → grille « projets phares » + catalogue
│   │   ├── Presentation FS Barber/ …
│   │   ├── PresentationKim-shoes/ …
│   │   ├── Presentation RadarPF/ …
│   │   ├── Presentation MAUICoach/ …
│   │   ├── PresentationMeteo/ …
│   │   ├── PresentationMachineLearning/ …          → classifieur ml5 + démos
│   │   ├── PresentationGestionPersonnel/ …
│   │   ├── PresentationISS/ …
│   │   ├── PresentationPuissance4/ … (+ demo-puissance4)
│   │   ├── Iconnected-SiteWeb-Beta/ …
│   │   └── iss.js-main/                            → démo / bundle ISS (Leaflet, etc.)
│   └── Veilles/
│       ├── Veilles.html | Veilles-light.html       → hub veille
│       ├── VeillesClaudeCode.html | …-light.html
│       ├── VeillesHeyGen.html | …-light.html
│       └── VeillesOpenClaw.html | …-light.html
├── assets/
│   ├── css/                    → styles globaux (navbar, thème, footer, Accueil, Parcours, Projets, Veilles, Blog…)
│   ├── css/light/              → surcharges thème clair
│   ├── js/                     → Accueil, Contact, veilles, présentations projets, parcours, thème…
│   ├── img/                    → photos, logos, couvertures projets / veilles
│   ├── vendor/                 → bibliothèques tierces en copie locale
│   ├── data/                   → données JSON (ex. récaps démo)
│   └── Apercus MP4 Ameliorees/ → médias intégrés aux cartes projets
├── scripts/                    → ex. generate_all_light_pages.py (génération / maintenance des pages light)
├── tools/                      → scripts utilitaires (ex. correctifs HTML hors ligne)
├── data/                       → exports texte (ex. CV en .txt)
└── Cv + Motivation + Rapports/ → PDF, rapports, pièces jointes (liens depuis le footer / contact)
```

**Chemins relatifs :** depuis `pages/…`, les assets passent par `../assets/`. Depuis `pages/Projets/…`, souvent `../../assets/`. À servir à la racine du dépôt pour garder les liens valides.

---

## Démarrage rapide

Beaucoup de pages fonctionnent en ouvrant le fichier directement ; pour des chemins uniformes, modules ou démos sensibles au **file://** :

```bash
cd Portfolio_DivinKimia
python3 -m http.server 8080
```

Puis ouvrir **http://localhost:8080/** (racine → `index.html`) ou **http://localhost:8080/pages/Accueil.html**.

Les pages de **présentation projet** indiquent en général si une stack annexe (PHP, Node, build) est nécessaire pour reproduire une démo à l’identique.

---

## Projets (aligné avec `pages/Projets/index.html`)

Présentations et démos principales :

| Thème | Exemples dans le repo |
|--------|------------------------|
| **Web / UI** | FS Barber (barber shop + dashboard), Kim Shoes (e-commerce), site beta **Iconnected**, appli météo (SQLite / stack décrite sur la page) |
| **Carto & APIs** | **Radar PF** (carte radars), **ISS** (API + Leaflet + dossier `iss.js-main`) |
| **Mobile** | **MAUI Coach** (.NET MAUI) |
| **ML / navigateur** | Classifieur **ml5.js** (+ pages démo / images) |
| **Jeux / outils** | **Puissance 4** (présentation + démo jouable) |
| **RH / gestion** | **Gestion du personnel** (MVC PHP — lien GitHub depuis le catalogue) |

D’autres entrées du catalogue peuvent renvoyer vers **EnDeveloppement.html** (placeholder) le temps d’intégrer le contenu ; les pages **MeDecouvrir** et **Blog** existent déjà en parallèle (`MeDecouvrir.html`, `Blog.html`).

---

## Parcours & certifications

- **Parcours :** `ExperiencesProfessionnels.html` + fiches de stage / expérience ; `FormationsPage.html` + fiches par diplôme ou parcours.
- **Certifications (fiches dédiées) :** CCNA, CEH, **SAA** (AWS), Scrum Master — toutes listées depuis `CertificationPage.html`.

---

## Veille technologique

Hub : `pages/Veilles/Veilles.html`. Fiches actuelles : **Claude Code**, **HeyGen**, **OpenClaw** (chacune avec variante `*-light.html` si présente).

---

## Thème clair

Les paires `page.html` / `page-light.html` et les styles `assets/css/light/` visent la **parité** avec le thème sombre. Pour une **démo courte**, l’accueil sombre reste la référence visuelle la plus aboutie ; le thème clair est utilisable via `index-light.html` ou les URLs `-light.html`.

---

## Maintenance du dépôt

- **UTF-8** partout ; attention aux SVG et aux noms de dossiers avec espaces (`Presentation FS Barber`, `Presentation MAUICoach`).
- **`.gitignore`** : macOS, caches, venv, IDE, etc.
- Mise à jour du **README** lors de l’ajout d’une section majeure (nouvelle veille, nouveau projet, nouveau hub).

---

## Pistes d’évolution

- Raccorder tous les liens du menu vers **MeDecouvrir** et **Blog** lorsque le contenu final remplace le placeholder **EnDeveloppement**.
- Poursuivre l’homogénéisation **light** / sombre et la navigation.
- Nouveaux projets : même schéma (carte sur `Projets/index.html`, présentation, visuels, lien démo ou GitHub).

---

## Contact

Formulaire et infos : **`pages/Contact.html`**. Le footer du site peut proposer **email**, **CV PDF** (`Cv + Motivation + Rapports/`) et liens réseaux selon les pages.

---

*Merci d’avoir parcouru le dépôt — retours et suggestions sont les bienvenus.*

**Divin Kimia**
