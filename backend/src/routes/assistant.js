const express = require("express");

const { assistantRateLimiter } = require("../middlewares/rateLimitMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { chatValidationRules } = require("../validators/assistantValidators");
const {
  chatCompletion,
  chatCompletionStreamConfig,
} = require("../controllers/assistantController");

const router = express.Router();

router.post("/chat", assistantRateLimiter, chatValidationRules, validateRequest, chatCompletion);

router.post(
  "/chat/stream-config",
  assistantRateLimiter,
  chatValidationRules,
  validateRequest,
  chatCompletionStreamConfig
);

module.exports = router;
