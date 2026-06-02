const logger = require("../utils/logger");

const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";

  logger.error({
    message: err.message,
    code,
    statusCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message || "Unexpected server error",
    },
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
