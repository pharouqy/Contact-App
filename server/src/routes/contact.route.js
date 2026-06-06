// server/src/routes/contact.route.js

'use strict';

const express = require('express');
const router = express.Router();

const { sendContact } = require('../controllers/contact.controller');
const { contactValidationRules, handleValidationErrors } = require('../middlewares/validate.middleware');
const { contactRateLimiter } = require('../middlewares/rateLimiter.middleware');

// ─── POST /api/contact ───────────────────────────────────────────
// Ordre d'exécution des middlewares :
//  1. Rate limiter  → bloque les IPs en excès
//  2. Règles        → valide chaque champ du body
//  3. Error handler → interrompt si erreurs, retourne 400
//  4. Contrôleur    → exécuté uniquement si tout est valide
router.post(
    '/',
    contactRateLimiter,           // 1 — Anti-spam / flood
    contactValidationRules,        // 2 — Règles de validation (tableau)
    handleValidationErrors,        // 3 — Vérification et réponse 400 si erreur
    sendContact                    // 4 — Logique métier
);

module.exports = router;