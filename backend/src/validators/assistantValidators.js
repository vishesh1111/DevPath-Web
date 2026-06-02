const { body } = require("express-validator");

const chatValidationRules = [
  body("conversationId")
    .optional({ nullable: true })
    .isString()
    .withMessage("conversationId must be a string"),
  body("message")
    .exists({ checkFalsy: true })
    .withMessage("message is required")
    .isString()
    .withMessage("message must be a string")
    .isLength({ min: 1, max: 4000 })
    .withMessage("message must be between 1 and 4000 characters"),
  body("history")
    .optional()
    .isArray({ max: 50 })
    .withMessage("history must be an array with max 50 items"),
  body("history.*.role")
    .optional()
    .isIn(["user", "assistant", "system"])
    .withMessage("history role must be user, assistant or system"),
  body("history.*.content")
    .optional()
    .isString()
    .withMessage("history content must be a string"),
];

module.exports = {
  chatValidationRules,
};
