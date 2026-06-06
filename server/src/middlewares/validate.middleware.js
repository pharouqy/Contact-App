// server/src/middlewares/validate.middleware.js

'use strict';

const { body, validationResult } = require('express-validator');

// ─── Règles de validation et sanitization ────────────────────────
// Exporté en tableau : chaque élément est un middleware express-validator
const contactValidationRules = [

  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage("L'adresse email est requise.")
    .isEmail()
    .withMessage("L'adresse email n'est pas valide.")
    .normalizeEmail(),

  body('sujet')
    .trim()
    .notEmpty()
    .withMessage('Le sujet est requis.')
    .isLength({ min: 3, max: 150 })
    .withMessage('Le sujet doit contenir entre 3 et 150 caractères.'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Le message est requis.')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Le message doit contenir entre 10 et 2000 caractères.'),
];

// ─── Middleware de vérification des erreurs ──────────────────────
// Doit être placé APRÈS les règles dans la chaîne de la route
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Retourne le premier tableau d'erreurs structuré par champ
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field:   err.path,    // Nom du champ concerné (ex: "email")
        message: err.msg,     // Message d'erreur lisible
      })),
    });
  }

  // Aucune erreur → passage au middleware suivant (contrôleur)
  next();
};

module.exports = { contactValidationRules, handleValidationErrors };