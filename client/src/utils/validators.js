// client/src/utils/validators.js

// ─── Regex email simple et efficace ──────────────────────────────
// Couvre les cas courants sans être trop restrictive
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Validation d'un champ unique ────────────────────────────────
// Retourne le message d'erreur (string) ou '' si valide
export const validateField = (name, value) => {
  const trimmed = (value || '').trim();

  switch (name) {

    case 'nom':
      if (!trimmed)             return 'Le nom est requis.';
      if (trimmed.length < 2)   return 'Le nom doit contenir au moins 2 caractères.';
      if (trimmed.length > 100) return 'Le nom ne peut pas dépasser 100 caractères.';
      return '';

    case 'email':
      if (!trimmed)                    return "L'adresse email est requise.";
      if (!EMAIL_REGEX.test(trimmed))  return "L'adresse email n'est pas valide.";
      return '';

    case 'sujet':
      if (!trimmed)             return 'Le sujet est requis.';
      if (trimmed.length < 3)   return 'Le sujet doit contenir au moins 3 caractères.';
      if (trimmed.length > 150) return 'Le sujet ne peut pas dépasser 150 caractères.';
      return '';

    case 'message':
      if (!trimmed)               return 'Le message est requis.';
      if (trimmed.length < 10)    return 'Le message doit contenir au moins 10 caractères.';
      if (trimmed.length > 2000)  return 'Le message ne peut pas dépasser 2000 caractères.';
      return '';

    default:
      return '';
  }
};

// ─── Validation de tous les champs d'un coup ─────────────────────
// Retourne { errors: { nom, email, sujet, message }, isValid: boolean }
export const validateAll = (formData) => {
  const errors = {};
  let hasError  = false;

  Object.keys(formData).forEach((field) => {
    const error    = validateField(field, formData[field]);
    errors[field]  = error;
    if (error) hasError = true;
  });

  return { errors, isValid: !hasError };
};