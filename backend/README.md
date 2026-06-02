# DevPath Assistant Backend

Express backend for the floating assistant UI.

## Architecture

- `src/routes`: API route definitions
- `src/controllers`: request/response orchestration
- `src/services`: external/provider + persistence logic
- `src/middlewares`: validation, rate limit, and error handlers
- `src/config`: platform integrations (Firebase Admin)
- `src/utils`: logger, async wrappers, common error class

The chat endpoint contract is:

`POST /api/assistant/chat`

Request:

```json
{
  "conversationId": "optional",
  "message": "Hello",
  "history": []
}
```

Response:

```json
{
  "success": true,
  "conversationId": "id",
  "reply": "Hello! How can I help you?"
}
```

## Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Fill required values in `.env`:
   - `OPENROUTER_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT_PATH`

3. Install dependencies:

```bash
pnpm install
```

4. Run dev server:

```bash
pnpm dev
```

## Notes

- Uses a primary free OpenRouter model by default: `openai/gpt-oss-120b:free`.
- Falls back automatically through the remaining free models in weighted order: `nvidia/nemotron-3-super:free`, `deepseek/deepseek-v4-flash:free`, `qwen/qwen3-next-80b-a3b-instruct:free`, `meta-llama/llama-3.3-70b-instruct:free`, and `google/gemma-4-31b:free` when the primary model is rate-limited or unavailable.
- You can override the order with `OPENROUTER_MODEL_WEIGHTS` using `model=weight` pairs separated by commas.
- Includes streaming-ready service config (`/api/assistant/chat/stream-config`) for future SSE/WebSocket proxy work.
- Includes rate-limit middleware and centralized operational error responses for production readiness.
