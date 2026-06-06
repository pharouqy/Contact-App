# Cualde_Code

Projet fullstack de formulaire de contact avec front-end React/Vite et back-end Express/Node.js.

## Vue d'ensemble

Ce projet est composé de deux parties :

- `client/` : application React construite avec Vite.
- `server/` : API REST Express qui reçoit les demandes de contact et envoie des emails via SMTP Gmail.

L'application permet à un utilisateur de remplir un formulaire de contact, de valider les champs côté client et côté serveur, puis d'envoyer le message à une adresse email définie.

## Fonctionnalités principales

### Front-end

- Formulaire React simple avec champs : `nom`, `email`, `sujet`, `message`
- Validation client en temps réel
- Gestion des erreurs d'API et des erreurs de validation renvoyées par le serveur
- Indicateur de chargement durant l'envoi
- Affichage d'un message de succès après envoi
- Comptage de caractères pour le champ `message`

### Back-end

- Serveur Express avec CORS restreint à l'origine définie dans `.env`
- Route `POST /api/contact` pour envoyer les messages
- Validation serveur avec `express-validator`
- Limiteur de requêtes `express-rate-limit` sur la route de contact
- Envoi d'email via SMTP Gmail avec `nodemailer`
- Point de santé `GET /api/health`
- Gestion 404 et gestionnaire global d'erreurs

## Architecture du projet

### `client/`

- `src/App.jsx` : rendu principal, affiche `ContactForm`
- `src/components/ContactForm.jsx` : composant de formulaire et affichage des états
- `src/hooks/useContactForm.js` : logique de formulaire, validation et requêtes API
- `src/utils/validators.js` : fonctions de validation de champ et validation globale
- `vite.config.js` : configuration Vite standard pour React

### `server/`

- `src/index.js` : configuration Express, CORS, routes, middlewares et démarrage du serveur
- `src/routes/contact.route.js` : route `POST /api/contact`
- `src/controllers/contact.controller.js` : logique métier d'envoi de message
- `src/services/mailer.service.js` : transporteur SMTP, vérification de connexion, template HTML d'email
- `src/middlewares/validate.middleware.js` : règles de validation et gestion des erreurs
- `src/middlewares/rateLimiter.middleware.js` : anti-flood pour le formulaire

## Installation

### Prérequis

- Node.js 18+ recommandé
- npm
- Compte Gmail configuré avec un mot de passe d'application (Gmail App Password)

### 1. Installer les dépendances du serveur

```bash
cd server
npm install
```

### 2. Installer les dépendances du client

```bash
cd ../client
npm install
```

## Configuration

### Fichier serveur `.env`

Créez ou mettez à jour `server/.env` avec les variables suivantes :

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GMAIL_USER=votre.email@gmail.com
GMAIL_APP_PASSWORD=votre_mot_de_passe_d_application
MAIL_RECEIVER=destinataire@exemple.com
```

- `CLIENT_ORIGIN` : origine autorisée pour les requêtes CORS
- `GMAIL_USER` : adresse Gmail utilisée pour l'envoi
- `GMAIL_APP_PASSWORD` : mot de passe d'application Gmail
- `MAIL_RECEIVER` : adresse qui recevra les messages

> Ne laissez jamais des identifiants réels dans un dépôt public.

### Fichier client `.env`

Créez `client/.env` avec l'URL de l'API :

```env
VITE_API_URL=http://localhost:5000
```

## Exécution

### Démarrer le serveur

```bash
cd server
npm run start
```

Ou en développement avec redémarrage automatique :

```bash
npm run dev
```

### Démarrer le client

```bash
cd client
npm run dev
```

Le front-end s'exécutera généralement sur `http://localhost:5173`.

## Endpoints

### `GET /api/health`

- Retourne l'état du serveur
- Réponse 200 JSON :

```json
{
  "success": true,
  "message": "Serveur opérationnel",
  "timestamp": "..."
}
```

### `POST /api/contact`

- Reçoit un objet JSON avec : `nom`, `email`, `sujet`, `message`
- Validation des champs côté serveur
- Limitation à 5 requêtes par IP toutes les 15 minutes
- Envoie un email au destinataire configuré

#### Exemple de payload

```json
{
  "nom": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "sujet": "Demande de renseignements",
  "message": "Bonjour, j'aimerais en savoir plus sur votre service."
}
```

#### Erreurs possibles

- `400` : validation échouée, retourne un tableau d'erreurs par champ
- `429` : trop de requêtes sur la route de contact
- `500` : erreur serveur interne

## Comportement de validation

### Validation côté client

- `nom` : 2 à 100 caractères
- `email` : format email valide
- `sujet` : 3 à 150 caractères
- `message` : 10 à 2000 caractères

### Validation côté serveur

Même règles que le client, mais appliquées côté serveur avec `express-validator`.

## Sécurité et robustesse

- CORS restreint à l'origine `CLIENT_ORIGIN`
- Limitation anti-flood `express-rate-limit`
- Sanitization des champs via `express-validator`
- Gestion des erreurs 404 et erreurs globales
- Vérification SMTP au démarrage du serveur

## Notes utiles

- Si la vérification SMTP échoue au démarrage, vérifiez :
  - `GMAIL_USER`
  - `GMAIL_APP_PASSWORD`
  - configuration du compte Gmail pour les mots de passe d'application
- Le client utilise `axios` pour appeler l'API.
- Le serveur se base sur `nodemailer` pour l'envoi d'emails via SMTP Gmail.

## Structure des dossiers

- `client/`
  - `src/components/ContactForm.jsx`
  - `src/hooks/useContactForm.js`
  - `src/utils/validators.js`
  - `src/App.jsx`
  - `src/main.jsx`

- `server/`
  - `src/index.js`
  - `src/routes/contact.route.js`
  - `src/controllers/contact.controller.js`
  - `src/services/mailer.service.js`
  - `src/middlewares/validate.middleware.js`
  - `src/middlewares/rateLimiter.middleware.js`

## Scripts disponibles

### Client

- `npm run dev` : lance Vite en mode développement
- `npm run build` : crée le build de production
- `npm run preview` : prévisualise le build
- `npm run lint` : analyse le code avec ESLint

### Serveur

- `npm run start` : lance le serveur Express
- `npm run dev` : lance le serveur avec `nodemon`

## Améliorations possibles

- ajout d'un toast de confirmation côté client
- déploiement sur un hébergement dédié
- ajout d'une page de succès distincte
- internationalisation du message d'interface
- tests unitaires et d'intégration

---

Ce README couvre l'installation, la configuration, l'architecture et les usages essentiels de ce projet de formulaire de contact fullstack.