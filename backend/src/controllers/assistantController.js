const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const {
  createChatCompletion,
  createStreamingChatCompletionConfig,
} = require("../services/openRouterService");
const {
  appendMessages,
  getConversationHistory,
} = require("../services/conversationService");

const chatCompletion = asyncHandler(async (req, res) => {
  const { conversationId, message, history = [] } = req.body;

  // Prefer frontend-provided history for immediate UX, then fall back to persisted conversation.
  const storedHistory = await getConversationHistory(conversationId, 30);
  const resolvedHistory = history.length ? history : storedHistory;

  const completion = await createChatCompletion({
    message,
    history: resolvedHistory,
  });

  const storedConversation = await appendMessages({
    conversationId,
    userMessage: message,
    assistantReply: completion.reply,
  });

  return res.status(200).json({
    success: true,
    conversationId: storedConversation.conversationId,
    reply: completion.reply,
  });
});

const chatCompletionStreamConfig = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    throw new AppError("message is required", 400, "VALIDATION_ERROR");
  }

  const streamConfig = createStreamingChatCompletionConfig({ message, history });

  return res.status(200).json({
    success: true,
    stream: {
      url: streamConfig.url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: streamConfig.body,
      note: "Use server-side proxy/stream endpoint in production to avoid exposing API key.",
    },
  });
});

module.exports = {
  chatCompletion,
  chatCompletionStreamConfig,
};
