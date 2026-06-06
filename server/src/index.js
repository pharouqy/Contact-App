// server/src/index.js

'use strict';

// ─── Chargement des variables d'environnement ───────────────────
// Doit être la PREMIÈRE instruction du fichier
require('dotenv').config();

const { verifyConnection } = require('./services/mailer.service');

const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── 1. Middleware CORS ──────────────────────────────────────────
// Autorise uniquement l'origine définie dans .env
app.use(
  cors({
    origin:         process.env.CLIENT_ORIGIN,
    methods:        ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// ─── 2. Middleware de parsing du body ────────────────────────────
app.use(express.json());                      // body JSON → req.body
app.use(express.urlencoded({ extended: true }));

// ─── 3. Route de santé (Health Check) ───────────────────────────
// Permet de vérifier que le serveur répond correctement
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serveur opérationnel',
    timestamp: new Date().toISOString(),
  });
});

// ─── 4. Route Contact ────────────────────────────────────────────
// Décommentée et branchée en Phase 4
// const contactRouter = require('./routes/contact.route');
// app.use('/api/contact', contactRouter);
// ─── APRÈS (Phase 4 — actif) ─────────────────────────────────────
const contactRouter = require('./routes/contact.route');
app.use('/api/contact', contactRouter);

// ─── 5. Middleware 404 ───────────────────────────────────────────
// Intercepte toute route non définie ci-dessus
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  });
});

// ─── 6. Middleware de gestion globale des erreurs ────────────────
// Signature OBLIGATOIRE à 4 paramètres pour qu'Express
// reconnaisse ce middleware comme gestionnaire d'erreurs
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[SERVER ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur.',
  });
});

// ─── 7. Démarrage du serveur ─────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`✅  Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🌍  Origine autorisée : ${process.env.CLIENT_ORIGIN}`);
  console.log(`📋  Health check : http://localhost:${PORT}/api/health`);

  // Vérification SMTP au démarrage
  try {
    await verifyConnection();
  } catch (err) {
    console.error('❌  Connexion SMTP échouée :', err.message);
    console.error('    → Vérifiez GMAIL_USER et GMAIL_APP_PASSWORD dans .env');
  }
});