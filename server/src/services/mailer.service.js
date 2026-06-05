// server/src/services/mailer.service.js

'use strict';

const nodemailer = require('nodemailer');

// ─── Création du transporter SMTP Gmail ──────────────────────────
// Instancié à chaque envoi pour éviter les problèmes de connexion idle
const createTransporter = () => {
  return nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

// ─── Vérification de la connexion SMTP ───────────────────────────
// Appelée au démarrage du serveur pour détecter les erreurs de config tôt
const verifyConnection = async () => {
  const transporter = createTransporter();
  await transporter.verify();
  console.log('✅  Connexion SMTP Gmail vérifiée avec succès');
};

// ─── Template HTML de l'email ────────────────────────────────────
const buildEmailTemplate = ({ nom, email, sujet, message }) => {
  const dateFormatee = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body        { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
        .container  { max-width:600px; margin:30px auto; background:#ffffff;
                      border-radius:8px; overflow:hidden;
                      box-shadow:0 2px 8px rgba(0,0,0,0.1); }
        .header     { background:#2563eb; padding:24px; color:#ffffff; }
        .header h1  { margin:0; font-size:20px; font-weight:600; }
        .body       { padding:24px; color:#333333; }
        .field      { margin-bottom:20px; }
        .label      { font-size:11px; text-transform:uppercase; color:#888888;
                      letter-spacing:0.8px; margin-bottom:4px; }
        .value      { font-size:15px; color:#111111; }
        .value a    { color:#2563eb; text-decoration:none; }
        .msg-box    { background:#f8f9fa; border-left:4px solid #2563eb;
                      padding:14px 16px; border-radius:0 4px 4px 0;
                      white-space:pre-wrap; line-height:1.6; }
        .footer     { padding:14px 24px; background:#f4f4f4;
                      font-size:12px; color:#999999; text-align:center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📩 Nouveau message — Formulaire de contact</h1>
        </div>
        <div class="body">
          <div class="field">
            <div class="label">Expéditeur</div>
            <div class="value">${nom}</div>
          </div>
          <div class="field">
            <div class="label">Adresse email</div>
            <div class="value">
              <a href="mailto:${email}">${email}</a>
            </div>
          </div>
          <div class="field">
            <div class="label">Sujet</div>
            <div class="value">${sujet}</div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="msg-box">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </div>
        </div>
        <div class="footer">
          Message reçu le ${dateFormatee}
        </div>
      </div>
    </body>
    </html>
  `;
};

// ─── Envoi de l'email de contact ─────────────────────────────────
const sendContactEmail = async ({ nom, email, sujet, message }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from:    `"Formulaire Contact" <${process.env.GMAIL_USER}>`,
    to:      process.env.MAIL_RECEIVER,
    replyTo: email,
    subject: `[Contact] ${sujet}`,
    html:    buildEmailTemplate({ nom, email, sujet, message }),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧  Email envoyé — Message ID : ${info.messageId}`);
  return info;
};

module.exports = { sendContactEmail, verifyConnection };