export const validateRequest = (validator) => (req, res, next) => {
  const result = validator(req);

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: result.errors,
    });
  }

  req.body = result.value || req.body;
  return next();
};
