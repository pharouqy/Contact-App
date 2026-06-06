// client/src/components/ContactForm.jsx

import useContactForm from '../hooks/useContactForm';
import './ContactForm.css';

const ContactForm = () => {
  const {
    formData,
    status,
    globalError,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    isFieldValid,
    resetForm,
  } = useContactForm();

  const isLoading = status === 'loading';

  const getFieldClass = (fieldName) => {
    const classes = ['field-group'];

    if (getFieldError(fieldName)) {
      classes.push('has-error');
    }

    if (isFieldValid(fieldName)) {
      classes.push('is-valid');
    }

    return classes.join(' ');
  };

  const heroFeatures = [
    'Réponse rapide et personnalisée',
    'Accompagnement clair et humain',
    'Suivi sécurisé de votre demande',
  ];

  const renderHeroCopy = () => (
    <div className="hero-copy">
      <span className="hero-eyebrow">Contactez-moi</span>

      <h1 className="hero-title">Faites avancer votre projet avec une vraie écoute.</h1>

      <p className="hero-text">
        Que ce soit pour une collaboration, un devis ou une simple question,
        envoyez votre message et recevez une réponse rapide et personnalisée.
      </p>

      <ul className="hero-list" aria-label="Avantages du contact">
        {heroFeatures.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );

  const renderSuccessCard = () => (
    <div className="hero-card">
      <div className="contact-success">
        <div className="success-icon" aria-hidden="true">
          ✅
        </div>

        <h2>Message envoyé avec succès !</h2>

        <p>
          Merci pour votre message. Nous vous répondrons dans les plus
          brefs délais.
        </p>

        <button
          type="button"
          onClick={resetForm}
          className="btn btn-secondary"
        >
          Envoyer un autre message
        </button>
      </div>
    </div>
  );

  const renderFormCard = () => (
    <div className="hero-card">
      <div className="contact-card">
        <span className="hero-card-badge">Prêt à discuter ?</span>

        <h1 className="contact-title">Envoyez votre message</h1>

        <p className="contact-subtitle">
          Remplissez le formulaire ci-dessous. Tous les champs sont
          obligatoires.
        </p>

        {globalError && (
          <div
            className="alert alert-error"
            role="alert"
            aria-live="polite"
          >
            ⚠️ {globalError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulaire de contact"
        >
          <div className={getFieldClass('nom')}>
            <label htmlFor="nom">Nom complet</label>

            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Jean Dupont"
              disabled={isLoading}
              autoComplete="name"
              aria-invalid={!!getFieldError('nom')}
              aria-describedby={
                getFieldError('nom') ? 'error-nom' : undefined
              }
            />

            <span
              id="error-nom"
              className="field-error"
              role="alert"
            >
              {getFieldError('nom') || ''}
            </span>
          </div>

          <div className={getFieldClass('email')}>
            <label htmlFor="email">Adresse email</label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="jean.dupont@exemple.com"
              disabled={isLoading}
              autoComplete="email"
              aria-invalid={!!getFieldError('email')}
              aria-describedby={
                getFieldError('email') ? 'error-email' : undefined
              }
            />

            <span
              id="error-email"
              className="field-error"
              role="alert"
            >
              {getFieldError('email') || ''}
            </span>
          </div>

          <div className={getFieldClass('sujet')}>
            <label htmlFor="sujet">Sujet</label>

            <input
              type="text"
              id="sujet"
              name="sujet"
              value={formData.sujet}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Objet de votre message"
              disabled={isLoading}
              aria-invalid={!!getFieldError('sujet')}
              aria-describedby={
                getFieldError('sujet') ? 'error-sujet' : undefined
              }
            />

            <span
              id="error-sujet"
              className="field-error"
              role="alert"
            >
              {getFieldError('sujet') || ''}
            </span>
          </div>

          <div className={getFieldClass('message')}>
            <label htmlFor="message">Message</label>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Écrivez votre message ici... (minimum 10 caractères)"
              rows={6}
              maxLength={2000}
              disabled={isLoading}
              aria-invalid={!!getFieldError('message')}
              aria-describedby="message-counter"
            />

            <span
              id="error-message"
              className="field-error"
              role="alert"
            >
              {getFieldError('message') || ''}
            </span>

            <span
              id="message-counter"
              className={`char-count ${
                formData.message.length > 1900
                  ? 'char-count--warn'
                  : ''
              }`}
            >
              {formData.message.length} / 2000
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner"
                  aria-hidden="true"
                />
                Envoi en cours...
              </>
            ) : (
              'Envoyer le message'
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="contact-wrapper">
      <div className="landing-hero">
        {renderHeroCopy()}
        {status === 'success' ? renderSuccessCard() : renderFormCard()}
      </div>
    </div>
  );
};

export default ContactForm;