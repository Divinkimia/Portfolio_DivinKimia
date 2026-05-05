# MachineLearningPF

> Application professionnelle de classification d'images par IA — ML5.js & MobileNet

![ML5.js](https://img.shields.io/badge/ML5.js-Image%20Classification-6366f1?style=flat-square)
![MobileNet](https://img.shields.io/badge/MobileNet-1000%2B%20classes-22c55e?style=flat-square)

## Vue d'ensemble

Application web de **classification d'objets** exploitant le machine learning directement dans le navigateur. Utilise **ML5.js** et le modèle **MobileNet** pré-entraîné pour identifier des objets à partir d'images, sans backend ni serveur.

### Fonctionnalités

- **Multi-sources** : glisser-déposer, fichier, webcam, galerie d'images de test
- **Top 5 prédictions** avec barres de confiance visuelles
- **Temps d'inférence** affiché en millisecondes
- **Interface** moderne, thème sombre, responsive
- **Architecture** modulaire et maintenable

## Technologies

| Technologie   | Rôle                          |
|---------------|-------------------------------|
| **ML5.js**    | Abstraction du ML dans le navigateur |
| **MobileNet** | Modèle CNN pré-entraîné (ImageNet)   |
| **TensorFlow.js** | Moteur d'inférence (sous-jacent) |
| **Vanilla JS** | Logique applicative sans framework |

## Structure du projet

```
MachineLearningPF/
├── demo-ml5-classifieur-images.html   # Application (démo classificateur)
├── presentation-ml5-classifieur.html   # Page de présentation portfolio
├── js/
│   ├── demo-ml5-classifieur.js        # Logique ML & UI
│   └── presentation-ml5-classifieur.js # Scripts page présentation
├── css/
│   ├── demo-ml5-classifieur-app.css   # Styles démo
│   └── presentation-ml5-classifieur.css # Styles présentation
├── Images test ml5/    # Images de démonstration
└── README.md
```

## Lancement

### Option 1 : Ouverture directe

Ouvrez `demo-ml5-classifieur-images.html` dans un navigateur moderne (Chrome, Firefox, Safari, Edge).

### Option 2 : Serveur local (recommandé)

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Puis accédez à `http://localhost:8000`.

## Prérequis

- **Connexion Internet** : le modèle MobileNet est chargé depuis le CDN au premier lancement
- **Navigateur récent** : prise en charge de WebGL et des APIs modernes
- **Webcam** (optionnel) : pour la capture en direct

## Architecture du code

```javascript
// État centralisé
const state = { model, modelReady, imageLoaded, webcamStream };

// Flux : Chargement modèle → Sélection image → Classification → Rendu Top 5
```

- **IIFE** : isolation du scope, pas de pollution globale
- **État unique** : `state` centralise les flags (modèle chargé, image prête)
- **Séparation** : init, événements, rendu découplés

## Cas d'usage

- Démonstration du ML dans le navigateur
- Prototypage rapide de reconnaissance d'objets
- Enseignement (ML, vision par ordinateur)
- Classification hors-ligne après premier chargement

## Licence

Projet à but éducatif et démonstration.
