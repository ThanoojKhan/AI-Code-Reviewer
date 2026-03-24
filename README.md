# AI Code Reviewer (https://ai-code-reviewer-omega-one.vercel.app/)

AI Code Reviewer is a production-oriented full-stack application that accepts pasted source code, sends it to Gemini for analysis, and returns a structured review focused on bugs, performance issues, and security findings.

## Architecture Overview

The project is split into two applications:

- `client/`: React + Vite frontend with TailwindCSS, Monaco Editor, and Axios.
- `server/`: Express API with clean separation between routing, controllers, services, AI integration, validation, middleware, and persistence.

Backend request flow:

1. `POST /api/reviews` receives `language` and `code`.
2. Validation middleware sanitizes input and rejects invalid payloads.
3. `review.service.js` estimates tokens and rejects oversized submissions.
4. The service hashes the normalized code and reuses a cached review when the same language and code were already analyzed.
5. `promptBuilder.js` generates a structured Gemini prompt.
6. `aiClient.js` calls `gemini-1.5-flash` with `maxOutputTokens` capped at 500.
7. `responseParser.js` parses the JSON response and retries the AI call once if parsing fails.
8. The review is stored in MongoDB using the `Review` model together with token usage, estimated AI cost, and cache-hit metadata.
9. The API returns the stored review payload.

## Project Structure

```text
AI Code Reviewer/
  client/
    src/
      components/
      pages/
      services/
  server/
    ai/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    validators/
```

## Setup Steps

### Prerequisites

- Node.js 20+
- MongoDB running locally or a hosted MongoDB URI
- Gemini API key

### Install

From the project root:

```bash
npm run install:all
```

Or install each app separately:

```bash
cd server && npm install
cd ../client && npm install
```

### Environment Variables

Create `server/.env` from `server/.env.example`:

```env
SERVER_PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-code-reviewer
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
MAX_CODE_CHARACTERS=20000
MAX_CODE_TOKENS=6000
MAX_OUTPUT_TOKENS=500
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Run Locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## API Documentation

### `POST /api/reviews`

Create a new AI review.

Request body:

```json
{
  "language": "javascript",
  "code": "function example() { return true; }"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "language": "javascript",
    "code": "function example() { return true; }",
    "analysis": {
      "summary": "...",
      "bugs": [{ "line": 1, "description": "..." }],
      "performance": [{ "suggestion": "..." }],
      "security": [{ "issue": "..." }]
    },
    "model": "gemini-1.5-flash",
    "promptTokens": 120,
    "completionTokens": 90,
    "totalTokens": 210,
    "createdAt": "2026-03-24T00:00:00.000Z"
  }
}
```

### `GET /api/reviews?page=1&limit=10`

Returns paginated review history.

### `GET /api/reviews/:id`

Returns a single stored review including original code and analysis.

### `GET /api/reviews/metrics`

Returns aggregate token and AI cost metrics for monitoring, including total prompt tokens, completion tokens, estimated USD cost, and cache-hit totals.

### `DELETE /api/reviews/:id`

Deletes a stored review.

### `GET /health`

Health check endpoint.

## Security and Safety

- Input validation and sanitization for language and code payloads
- Token estimation before sending data to Gemini
- Hard limits for code size and estimated tokens
- Gemini output capped to 500 tokens
- Gemini response parse retry on malformed JSON
- Request caching using a SHA-256 hash of code plus language to avoid repeated AI calls
- Stored token totals and estimated Gemini cost for monitoring usage over time
- Rate limiting on `POST /api/reviews` to 5 requests per minute
- Environment variables used for secrets and deployment-specific values
- `helmet` and `cors` enabled on the API

## Screenshots

Add screenshots here after running the app locally:

- Home page with Monaco editor
- Generated AI review panel
- Review history page

## Suggested Production Enhancements

- Add authentication and per-user review ownership
- Add Redis-backed rate limiting for distributed deployments
- Add background job processing for long-running reviews
- Add test coverage for validators, services, and React pages
- Add observability with structured logging and tracing
