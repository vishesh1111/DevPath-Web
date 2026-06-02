const rateLimit = require("express-rate-limit");

const assistantRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.ASSISTANT_RATE_LIMIT_PER_MINUTE || 30),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many assistant requests. Please try again shortly.",
    },
  },
});

module.exports = {
  assistantRateLimiter,
};
