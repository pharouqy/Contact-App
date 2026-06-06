// server/src/middlewares/rateLimiter.middleware.js

'use strict';

const rateLimit = require('express-rate-limit');

// ─── Limiteur de requêtes pour la route /api/contact ─────────────
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // Fenêtre de 15 minutes
  max:      5,                  // 5 requêtes maximum par IP par fenêtre
  standardHeaders: true,        // Ajoute les headers RateLimit-* standard (RFC 6585)
  legacyHeaders:   false,       // Désactive les anciens headers X-RateLimit-*

  // ─── Réponse retournée lors du dépassement ────────────────────
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de messages envoyés. Veuillez réessayer dans 15 minutes.',
    });
  },

  // ─── Clé d'identification par IP ─────────────────────────────
  keyGenerator: (req) => req.ip,

  // ─── Optionnel : ne pas comptabiliser les requêtes échouées ──
  skipFailedRequests: true,
});

module.exports = { contactRateLimiter };