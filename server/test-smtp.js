// server/test-smtp.js
// Usage : node test-smtp.js

require('dotenv').config();
const { verifyConnection } = require('./src/services/mailer.service');

(async () => {
  console.log('🔍  Test de la connexion SMTP Gmail...');
  console.log(`    Compte : ${process.env.GMAIL_USER}`);
  try {
    await verifyConnection();
    console.log('✅  Connexion SMTP opérationnelle !');
    process.exit(0);
  } catch (err) {
    console.error('❌  Échec de la connexion SMTP :', err.message);
    process.exit(1);
  }
})();