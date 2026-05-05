# Projet RadarPF — Carte interactive des radars

Documentation du projet **RadarPF** : une application web qui affiche sur une carte interactive (Leaflet) les radars fixes et mobiles en France, avec filtrage par type et géolocalisation.

---

## Sommaire

1. [Présentation du projet](#1-présentation-du-projet)
2. [Technologies utilisées](#2-technologies-utilisées)
3. [Prérequis](#3-prérequis)
4. [Installation — étape par étape](#4-installation--étape-par-étape)
5. [Lancer l’application — étape par étape](#5-lancer-lapplication--étape-par-étape)
6. [Structure du projet](#6-structure-du-projet)
7. [API du serveur](#7-api-du-serveur)
8. [Fonctionnalités](#8-fonctionnalités)
9. [Dépannage](#9-dépannage)

---

## 1. Présentation du projet

**RadarPF** permet de visualiser sur une carte de France les radars (fixes, mobiles, tunnels, etc.) issus d’une base de données. L’utilisateur peut :

- Voir tous les radars sous forme de marqueurs colorés selon le type.
- Filtrer les radars par type (ETF, ETD, FIXE, MOBILE, TUNNEL, etc.) via un menu déroulant.
- Cliquer sur un marqueur pour afficher les détails (ID, type, date de mise en service, vitesse max autorisée).
- Se localiser sur la carte (géolocalisation du navigateur).

Les données sont servies par un serveur **Node.js (Express)** qui lit une base **SQLite** ; la carte est rendue côté navigateur avec **Leaflet** et **OpenStreetMap**.

---

## 2. Technologies utilisées

| Composant        | Technologie |
|------------------|------------|
| Backend          | **Node.js** + **Express** |
| Base de données  | **SQLite 3** (fichier `radars.db`) |
| Carte            | **Leaflet** + tuiles **OpenStreetMap** |
| Interface        | **HTML5**, **CSS** (Bootstrap 5), **JavaScript** |
| Données sources  | Fichier **radar.sql** (export des radars) |

---

## 3. Prérequis

Avant de commencer, assurez-vous d’avoir :

1. **Node.js** installé (version 14 ou supérieure recommandée).  
   - Vérification : ouvrez un terminal et tapez `node --version`.  
   - Si ce n’est pas installé : [https://nodejs.org](https://nodejs.org).

2. **npm** (fourni avec Node.js).  
   - Vérification : `npm --version`.

3. Le dossier du projet **ProjetRadarPF** (avec au minimum les fichiers décrits dans la [structure du projet](#6-structure-du-projet)), et le fichier **radar.sql** présent à la racine du projet.

---

## 4. Installation — étape par étape

Suivez ces étapes **une seule fois** (ou après un nouveau clonage / téléchargement du projet).

### Étape 4.1 — Ouvrir le dossier du projet dans un terminal

- Ouvrez un terminal (invite de commandes).
- Placez-vous dans le dossier **ProjetRadarPF** :

  ```bash
  cd chemin/vers/ProjetRadarPF
  ```

  Exemple sous macOS/Linux si le projet est sur le Bureau :

  ```bash
  cd ~/Desktop/VersionPrincipal/ProjetRadarPF
  ```

  Sous Windows (PowerShell) :

  ```powershell
  cd C:\Users\VotreNom\Desktop\VersionPrincipal\ProjetRadarPF
  ```

Vérifiez que vous voyez bien les fichiers `package.json`, `index.js`, `import-db.js` et `radar.sql` dans ce dossier (par exemple avec `dir` sous Windows ou `ls` sous macOS/Linux).

---

### Étape 4.2 — Installer les dépendances Node.js

Dans le même terminal, exécutez :

```bash
npm install
```

- Cela installe **Express** et **sqlite3** (et leurs dépendances) dans le dossier `node_modules`.
- Attendez la fin du téléchargement. En cas d’erreur, vérifiez votre connexion internet et la version de Node.js.

---

### Étape 4.3 — Créer la base de données et importer les radars

La carte s’appuie sur un fichier **radars.db** (base SQLite) qui doit être généré à partir de **radar.sql**.

Exécutez :

```bash
npm run import-db
```

ou directement :

```bash
node import-db.js
```

- Le script supprime l’ancien `radars.db` s’il existe, recrée la base, exécute le contenu de `radar.sql` et affiche le nombre de radars importés (plus de 3000).
- Vous devez voir un message du type :  
  `Nombre de radars importés: 3268`  
  et `Import terminé.`

Si vous voyez une erreur du type « fichier radar.sql introuvable », vérifiez que le fichier **radar.sql** est bien à la racine de **ProjetRadarPF**.

L’installation est terminée lorsque `npm install` et `npm run import-db` ont réussi.

---

## 5. Lancer l’application — étape par étape

À chaque fois que vous voulez utiliser la carte, suivez ces étapes.

### Étape 5.1 — Démarrer le serveur

Dans un terminal, placez-vous dans le dossier du projet (comme en 4.1) puis lancez :

```bash
npm start
```

ou :

```bash
node index.js
```

- Vous devez voir des messages du type :  
  `Connexion à la base de données SQLite réussie.`  
  `Serveur Express démarré sur http://localhost:3000`
- Le serveur tourne tant que vous ne fermez pas le terminal (ou que vous ne l’arrêtez pas avec Ctrl+C).

---

### Étape 5.2 — Ouvrir la carte dans le navigateur

1. Ouvrez votre navigateur (Chrome, Firefox, Edge, Safari, etc.).
2. Dans la barre d’adresse, saisissez exactement :

   ```
   http://localhost:3000
   ```

   puis validez (Entrée).

3. La page **« Carte Interactive des Radars »** doit s’afficher :
   - une carte de France (OpenStreetMap),
   - un filtre « Filtrer par type de radar » avec l’option « Tous les radars »,
   - des marqueurs colorés sur la carte (les radars),
   - éventuellement un marqueur « Votre position » si vous avez autorisé la géolocalisation.

**Important :** il faut toujours accéder à l’application via **http://localhost:3000** lorsque le serveur est lancé. Ne pas ouvrir directement le fichier `public/index.html` (double-clic sur le fichier) : dans ce cas, les appels à l’API échouent et les radars ne s’affichent pas.

---

### Étape 5.3 — Utiliser la carte

- **Zoom** : boutons + / − sur la carte ou molette de la souris.
- **Déplacer la carte** : clic maintenu + glisser.
- **Détails d’un radar** : clic sur un marqueur pour ouvrir la bulle d’information.
- **Filtrer par type** : choisir un type dans le menu « Filtrer par type de radar » (ex. ETF, ETD, MOBILE). « Tous les radars » affiche tous les types.

Pour arrêter le serveur : dans le terminal où il tourne, appuyez sur **Ctrl+C**.

---

## 6. Structure du projet

```
ProjetRadarPF/
├── index.js          # Serveur Express : routes API et connexion SQLite
├── import-db.js      # Script pour créer radars.db à partir de radar.sql
├── radar.sql         # Données sources des radars (à ne pas supprimer)
├── radars.db         # Base SQLite (générée par import-db.js, peut être recréée)
├── package.json      # Dépendances et scripts npm
├── package-lock.json # Versions figées des dépendances
├── node_modules/     # Dépendances installées par npm (ne pas modifier)
├── public/           # Fichiers servis par le serveur
│   └── index.html    # Page unique : carte Leaflet + filtre + appels API
└── README.md         # Cette documentation
```

- **radar.sql** : nécessaire pour recréer la base avec `npm run import-db`.
- **radars.db** : créé par `import-db.js` ; sans ce fichier (ou avec une base vide), aucun radar n’apparaît sur la carte.

---

## 7. API du serveur

Le serveur expose deux routes HTTP.

### GET `/api/radars`

Retourne la liste des radars en JSON.

- **Sans paramètre** : tous les radars.  
  Exemple : `http://localhost:3000/api/radars`
- **Avec paramètre `type`** : radars filtrés par type.  
  Exemple : `http://localhost:3000/api/radars?type=ETF`

Chaque élément du tableau JSON contient notamment : `idRadar`, `type`, `latitude`, `longitude`, `datemiseenservice`, `vma`.

---

### GET `/api/types`

Retourne la liste des types de radars distincts (tableau de chaînes), par exemple : `["ETF", "ETD", "FIXE", "MOBILE", "TUNNEL", ...]`.

Exemple : `http://localhost:3000/api/types`

---

## 8. Fonctionnalités

- Affichage d’une carte de France (Leaflet + OpenStreetMap).
- Géolocalisation de l’utilisateur (marqueur « Votre position ») si autorisée par le navigateur.
- Chargement des radars depuis la base SQLite via l’API.
- Marqueurs colorés selon le type de radar (rouge, orange, bleu, violet, etc.).
- Pop-up au clic sur un marqueur : ID, type, date de mise en service, VMA.
- Filtrage par type de radar via le menu déroulant.
- Message d’alerte affiché sur la page si l’API est inaccessible (serveur non démarré ou mauvaise URL).
- Mise en page responsive (Bootstrap 5).

---

## 9. Dépannage

### Les radars ne s’affichent pas sur la carte

1. **Vérifier que le serveur est bien lancé**  
   Dans un terminal : `npm start` ou `node index.js`, et garder ce terminal ouvert.

2. **Ouvrir l’application via l’URL du serveur**  
   Utilisez **http://localhost:3000** dans le navigateur, et non le fichier `index.html` ouvert en local (file://).

3. **Vérifier que la base de données existe et est remplie**  
   - Le fichier **radars.db** doit exister à la racine de **ProjetRadarPF**.
   - Si absent ou doute : relancer `npm run import-db` puis redémarrer le serveur.

4. **Ouvrir la console du navigateur** (F12 ou clic droit > Inspecter > Console).  
   En cas d’erreur réseau (fetch failed) ou 404, l’URL d’accès est incorrecte ou le serveur n’est pas démarré.

### Le message « Impossible de charger les radars » s’affiche

Cela indique que le navigateur n’a pas pu joindre l’API (serveur non lancé ou page ouverte en file://).  
→ Démarrer le serveur avec `npm start` et ouvrir **http://localhost:3000**.

### Erreur « Cannot find module 'express' » (ou 'sqlite3')

Les dépendances ne sont pas installées.  
→ Exécuter dans le dossier du projet : `npm install`.

### Erreur lors de `npm run import-db` (fichier radar.sql introuvable)

Le fichier **radar.sql** doit être à la racine de **ProjetRadarPF**, au même niveau que **import-db.js**.  
→ Vérifier l’emplacement du fichier et le chemin utilisé pour lancer la commande.

### Le port 3000 est déjà utilisé

Un autre programme utilise déjà le port 3000. Vous pouvez :
- Fermer l’autre application qui utilise le port 3000, ou
- Modifier la variable `PORT` dans **index.js** (par exemple `const PORT = 3001`) et redémarrer le serveur, puis ouvrir **http://localhost:3001**.

---

## Récapitulatif des commandes

| Action              | Commande            |
|---------------------|--------------------|
| Installer les deps   | `npm install`      |
| Créer / réimporter la BDD | `npm run import-db` |
| Démarrer le serveur | `npm start`        |
| Accéder à la carte  | Ouvrir http://localhost:3000 |

---

*Documentation du projet RadarPF — Carte interactive des radars.*
