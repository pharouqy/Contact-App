// server/src/controllers/contact.controller.js

'use strict';

const { sendContactEmail } = require('../services/mailer.service');

// ─── Contrôleur : POST /api/contact ──────────────────────────────
// À ce stade, req.body est DÉJÀ validé et sanitizé par le middleware
const sendContact = async (req, res, next) => {
  const { nom, email, sujet, message } = req.body;

  try {
    await sendContactEmail({ nom, email, sujet, message });

    return res.status(200).json({
      success: true,
      message: 'Votre message a été envoyé avec succès.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendContact };