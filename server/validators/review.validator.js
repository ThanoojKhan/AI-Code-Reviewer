import mongoose from 'mongoose';

const sanitizeString = (value) => String(value).replace(/\u0000/g, '').trim();

export const reviewRequestValidator = (req) => {
  const errors = [];
  const language = sanitizeString(req.body?.language || '');
  const code = String(req.body?.code || '').replace(/\u0000/g, '');

  if (!language) {
    errors.push({ field: 'language', message: 'Language is required.' });
  }

  if (language.length > 50) {
    errors.push({ field: 'language', message: 'Language must be 50 characters or fewer.' });
  }

  if (!code.trim()) {
    errors.push({ field: 'code', message: 'Code is required.' });
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      language,
      code,
    },
  };
};

export const reviewIdValidator = (req) => {
  const id = String(req.params?.id || '').trim();
  const errors = [];

  if (!mongoose.isValidObjectId(id)) {
    errors.push({ field: 'id', message: 'Invalid review id.' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
