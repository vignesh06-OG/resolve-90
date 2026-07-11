import { randomUUID } from "node:crypto";

import { PROMPT_VERSION } from "../../ai/buildGroundedPrompt.js";
import type { IncidentContext } from "../../../domain/entities/incident.js";
import { applyRateLimit } from "./limiter.js";
import { requestGemini } from "./provider.js";
import type { ApiRequest, ApiResponse } from "./validation.js";
import { firstHeader, sendJson, validateBody } from "./validation.js";

interface RequestContext {
  readonly request: ApiRequest;
  readonly response: ApiResponse;
  readonly requestId: string;
}

function methodAllowed(context: RequestContext): boolean {
  if (context.request.method === "POST") return true;
  context.response.setHeader("Allow", "POST");
  sendJson(context.response, 405, context.requestId, {
    error: "Method not allowed.",
  });
  return false;
}

function originAllowed(context: RequestContext): boolean {
  const origin = firstHeader(context.request.headers["origin"]);
  const allowed = process.env["ALLOWED_ORIGIN"];
  if (origin === undefined || allowed === undefined || origin === allowed)
    return true;
  sendJson(context.response, 403, context.requestId, {
    error: "Origin not allowed.",
  });
  return false;
}

function rateAllowed(context: RequestContext): boolean {
  const result = applyRateLimit(context.request, context.response);
  if (result.allowed) return true;
  context.response.setHeader("Retry-After", String(result.retryAfterSeconds));
  sendJson(context.response, 429, context.requestId, {
    error: "Rate limit exceeded.",
  });
  return false;
}

function validatedIncident(context: RequestContext): IncidentContext | null {
  const result = validateBody(context.request.body);
  if (result.ok) return result.incident;
  sendJson(context.response, result.error.status, context.requestId, {
    error: result.error.message,
  });
  return null;
}

function configuredKey(context: RequestContext): string | null {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (apiKey !== undefined && apiKey.length >= 20) return apiKey;
  sendJson(context.response, 503, context.requestId, {
    error: "Live generation is not configured. Replay mode is available.",
  });
  return null;
}

async function generate(
  context: RequestContext,
  incident: IncidentContext,
  apiKey: string,
): Promise<void> {
  const result = await requestGemini(incident, apiKey);
  if (!result.ok) {
    const errors = {
      invalid: "Invalid generation response.",
      unavailable: "Generation provider unavailable.",
    } as const;
    sendJson(context.response, 502, context.requestId, {
      error: errors[result.kind],
    });
    return;
  }
  sendJson(context.response, 200, context.requestId, {
    candidates: result.candidates,
    receipt: {
      mode: "live",
      provider: "Google Gemini API",
      model: result.model,
      promptVersion: PROMPT_VERSION,
      generatedAt: new Date().toISOString(),
      note: "Live structured output; deterministic guardrails still run before approval.",
    },
  });
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  const context = { request, response, requestId: randomUUID() };
  const guards = [methodAllowed, originAllowed, rateAllowed];
  if (!guards.every((guard) => guard(context))) return;
  const incident = validatedIncident(context);
  if (incident === null) return;
  const apiKey = configuredKey(context);
  if (apiKey === null) return;
  await generate(context, incident, apiKey);
}
