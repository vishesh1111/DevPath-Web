const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const firstError = errors.array()[0];
  return next(new AppError(firstError.msg, 400, "VALIDATION_ERROR"));
};

module.exports = validateRequest;
