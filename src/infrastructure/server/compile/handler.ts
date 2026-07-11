import { randomUUID } from "node:crypto";

import { PROMPT_VERSION } from "../../ai/buildGroundedPrompt.js";
import { applyRateLimit } from "./limiter.js";
import { requestGemini } from "./provider.js";
import type { ApiRequest, ApiResponse } from "./validation.js";
import { firstHeader, sendJson, validateBody } from "./validation.js";

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  const requestId = randomUUID();

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, requestId, { error: "Method not allowed." });
    return;
  }

  const origin = firstHeader(request.headers["origin"]);
  const allowedOrigin = process.env["ALLOWED_ORIGIN"];
  if (
    origin !== undefined &&
    allowedOrigin !== undefined &&
    origin !== allowedOrigin
  ) {
    sendJson(response, 403, requestId, { error: "Origin not allowed." });
    return;
  }

  const rateLimit = applyRateLimit(request, response);
  if (!rateLimit.allowed) {
    response.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
    sendJson(response, 429, requestId, { error: "Rate limit exceeded." });
    return;
  }

  const validation = validateBody(request.body);
  if (!validation.ok) {
    sendJson(response, validation.error.status, requestId, {
      error: validation.error.message,
    });
    return;
  }

  const apiKey = process.env["GEMINI_API_KEY"];
  if (apiKey === undefined || apiKey.length < 20) {
    sendJson(response, 503, requestId, {
      error: "Live generation is not configured. Replay mode is available.",
    });
    return;
  }

  const generated = await requestGemini(validation.incident, apiKey);
  if (!generated.ok) {
    sendJson(response, 502, requestId, {
      error:
        generated.kind === "invalid"
          ? "Invalid generation response."
          : "Generation provider unavailable.",
    });
    return;
  }

  sendJson(response, 200, requestId, {
    candidates: generated.candidates,
    receipt: {
      mode: "live",
      provider: "Google Gemini API",
      model: generated.model,
      promptVersion: PROMPT_VERSION,
      generatedAt: new Date().toISOString(),
      note: "Live structured output; deterministic guardrails still run before approval.",
    },
  });
}
