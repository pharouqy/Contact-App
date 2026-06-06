// client/src/hooks/useContactForm.js

import { useState } from 'react';
import axios from 'axios';
import { validateField, validateAll } from '../utils/validators'; // ✅ NOUVEAU

const INITIAL_FORM = {
  nom:     '',
  email:   '',
  sujet:   '',
  message: '',
};

// ✅ NOUVEAU — État initial des erreurs client
const INITIAL_ERRORS = {
  nom:     '',
  email:   '',
  sujet:   '',
  message: '',
};

const useContactForm = () => {
  const [formData,     setFormData]     = useState(INITIAL_FORM);
  const [status,       setStatus]       = useState('idle');
  const [clientErrors, setClientErrors] = useState(INITIAL_ERRORS); // ✅ NOUVEAU
  const [serverErrors, setServerErrors] = useState([]);
  const [globalError,  setGlobalError]  = useState('');

  // ─── Mise à jour d'un champ ────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // ✅ NOUVEAU — Effacer l'erreur CLIENT dès la retape
    setClientErrors((prev) => ({ ...prev, [name]: '' }));

    // Effacer l'erreur SERVEUR du champ
    if (serverErrors.length > 0) {
      setServerErrors((prev) => prev.filter((err) => err.field !== name));
    }
  };

  // ✅ NOUVEAU — Validation au blur (sortie du champ)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setClientErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ─── Erreur d'un champ : priorité erreur client → erreur serveur
  const getFieldError = (fieldName) => {
    // ✅ NOUVEAU — Priorité 1 : erreur locale (validation client)
    if (clientErrors[fieldName]) return clientErrors[fieldName];

    // Priorité 2 : erreur distante (réponse API 400)
    const serverError = serverErrors.find((err) => err.field === fieldName);
    return serverError ? serverError.message : '';
  };

  // ✅ NOUVEAU — Champ valide : contenu non vide + aucune erreur
  const isFieldValid = (fieldName) => {
    return (
      formData[fieldName].trim().length > 0 &&
      !getFieldError(fieldName)
    );
  };

  // ─── Soumission du formulaire ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ NOUVEAU — Étape 1 : Validation client complète AVANT l'API
    const { errors, isValid } = validateAll(formData);
    setClientErrors(errors);

    if (!isValid) return; // Arrêt immédiat — aucun appel réseau

    setStatus('loading');
    setServerErrors([]);
    setGlobalError('');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setStatus('success');
      setFormData(INITIAL_FORM);
      setClientErrors(INITIAL_ERRORS); // ✅ NOUVEAU — Nettoyer après succès

    } catch (err) {
      if (err.response) {
        const { status: httpStatus, data } = err.response;

        if (httpStatus === 400 && Array.isArray(data.errors)) {
          setServerErrors(data.errors);
          setStatus('error');
        } else if (httpStatus === 429) {
          setGlobalError(
            data.message || 'Trop de messages envoyés. Réessayez dans 15 minutes.'
          );
          setStatus('error');
        } else {
          setGlobalError(
            data.message || 'Une erreur est survenue. Veuillez réessayer.'
          );
          setStatus('error');
        }
      } else {
        setGlobalError('Impossible de contacter le serveur. Vérifiez votre connexion.');
        setStatus('error');
      }
    }
  };

  // ─── Réinitialisation complète ─────────────────────────────────
  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setClientErrors(INITIAL_ERRORS); // ✅ NOUVEAU
    setStatus('idle');
    setServerErrors([]);
    setGlobalError('');
  };

  return {
    formData,
    status,
    globalError,
    handleChange,
    handleBlur,      // ✅ NOUVEAU — exposé pour les champs
    handleSubmit,
    getFieldError,
    isFieldValid,    // ✅ NOUVEAU — exposé pour la classe CSS is-valid
    resetForm,
  };
};

export default useContactForm;