import { createHash, randomUUID } from "node:crypto";

import { z } from "zod";

import {
  buildGroundedPrompt,
  PROMPT_VERSION,
  SYSTEM_INSTRUCTION,
} from "../src/infrastructure/ai/buildGroundedPrompt";
import {
  compileRequestSchema,
  providerCandidateEnvelopeSchema,
} from "../src/infrastructure/ai/schemas";

interface ApiRequest {
  readonly method?: string;
  readonly headers: Readonly<
    Record<string, string | readonly string[] | undefined>
  >;
  readonly body?: unknown;
  readonly socket?: { readonly remoteAddress?: string };
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string | readonly string[]): void;
  json(body: unknown): void;
}

interface RateBucket {
  count: number;
  resetAt: number;
}

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT = 8;
const RATE_WINDOW_MILLISECONDS = 60_000;
const ALLOWED_MODELS = new Set(["gemini-2.5-flash", "gemini-2.0-flash"]);
const buckets = new Map<string, RateBucket>();

const geminiResponseSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(z.object({ text: z.string() })).min(1),
        }),
      }),
    )
    .min(1),
});

const OUTPUT_SCHEMA = {
  type: "object",
  required: ["candidates"],
  additionalProperties: false,
  properties: {
    candidates: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "title",
          "strategy",
          "confidence",
          "rationale",
          "actions",
          "messages",
          "impact",
          "evidenceIds",
        ],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          strategy: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          rationale: { type: "string" },
          actions: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "id",
                "sequence",
                "owner",
                "location",
                "instruction",
                "dueInSeconds",
                "fallback",
                "evidenceIds",
              ],
              properties: {
                id: { type: "string" },
                sequence: { type: "integer" },
                owner: {
                  type: "string",
                  enum: [
                    "Accessibility lead",
                    "Crowd lead",
                    "Gate supervisor",
                    "Mobility lead",
                    "Transport liaison",
                    "Volunteer captain",
                  ],
                },
                location: { type: "string" },
                instruction: { type: "string" },
                dueInSeconds: { type: "integer" },
                fallback: { type: "string" },
                evidenceIds: { type: "array", items: { type: "string" } },
              },
            },
          },
          messages: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "locale",
                "localeLabel",
                "headline",
                "body",
                "accessibleAlternative",
                "humanReviewRequired",
              ],
              properties: {
                locale: { type: "string", enum: ["en", "es", "fr"] },
                localeLabel: { type: "string" },
                headline: { type: "string" },
                body: { type: "string" },
                accessibleAlternative: { type: "string" },
                humanReviewRequired: { type: "boolean" },
              },
            },
          },
          impact: {
            type: "object",
            additionalProperties: false,
            required: [
              "decisionLatencySeconds",
              "peakPressureRatio",
              "accessibleRoutePercent",
              "transportFitPercent",
              "instructionClarityPercent",
              "operationalCarbonKg",
            ],
            properties: {
              decisionLatencySeconds: { type: "number" },
              peakPressureRatio: { type: "number" },
              accessibleRoutePercent: { type: "number" },
              transportFitPercent: { type: "number" },
              instructionClarityPercent: { type: "number" },
              operationalCarbonKg: { type: "number" },
            },
          },
          evidenceIds: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;

function firstHeader(
  value: string | readonly string[] | undefined,
): string | undefined {
  if (typeof value === "string" || value === undefined) return value;
  return value[0];
}

function send(
  response: ApiResponse,
  status: number,
  requestId: string,
  body: unknown,
): void {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Request-ID", requestId);
  response.status(status).json(body);
}

function requestKey(request: ApiRequest): string {
  const forwarded = firstHeader(request.headers["x-forwarded-for"]);
  const address =
    forwarded?.split(",")[0]?.trim() ??
    request.socket?.remoteAddress ??
    "unknown";
  return createHash("sha256").update(address).digest("hex").slice(0, 20);
}

function consumeRateLimit(key: string, now: number): RateBucket {
  const existing = buckets.get(key);
  if (existing === undefined || existing.resetAt <= now) {
    const next = { count: 1, resetAt: now + RATE_WINDOW_MILLISECONDS };
    buckets.set(key, next);
    return next;
  }

  existing.count += 1;
  return existing;
}

function serializedSize(body: unknown): number {
  try {
    return Buffer.byteLength(JSON.stringify(body), "utf8");
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

function selectedModel(): string {
  const configured = process.env["GEMINI_MODEL"] ?? "gemini-2.5-flash";
  return ALLOWED_MODELS.has(configured) ? configured : "gemini-2.5-flash";
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  const requestId = randomUUID();

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    send(response, 405, requestId, { error: "Method not allowed." });
    return;
  }

  const origin = firstHeader(request.headers["origin"]);
  const allowedOrigin = process.env["ALLOWED_ORIGIN"];
  if (
    origin !== undefined &&
    allowedOrigin !== undefined &&
    origin !== allowedOrigin
  ) {
    send(response, 403, requestId, { error: "Origin not allowed." });
    return;
  }

  const bucket = consumeRateLimit(requestKey(request), Date.now());
  response.setHeader("X-RateLimit-Limit", String(RATE_LIMIT));
  response.setHeader(
    "X-RateLimit-Remaining",
    String(Math.max(0, RATE_LIMIT - bucket.count)),
  );
  if (bucket.count > RATE_LIMIT) {
    response.setHeader(
      "Retry-After",
      String(Math.ceil((bucket.resetAt - Date.now()) / 1000)),
    );
    send(response, 429, requestId, { error: "Rate limit exceeded." });
    return;
  }

  if (serializedSize(request.body) > MAX_BODY_BYTES) {
    send(response, 413, requestId, { error: "Request body is too large." });
    return;
  }

  const parsedRequest = compileRequestSchema.safeParse(request.body);
  if (!parsedRequest.success) {
    send(response, 400, requestId, { error: "Invalid request payload." });
    return;
  }

  const apiKey = process.env["GEMINI_API_KEY"];
  if (apiKey === undefined || apiKey.length < 20) {
    send(response, 503, requestId, {
      error: "Live generation is not configured. Replay mode is available.",
    });
    return;
  }

  const model = selectedModel();
  let providerResponse: Response;
  try {
    providerResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [
            {
              role: "user",
              parts: [
                { text: buildGroundedPrompt(parsedRequest.data.incident) },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseJsonSchema: OUTPUT_SCHEMA,
          },
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    send(response, 502, requestId, {
      error: "Generation provider unavailable.",
    });
    return;
  }

  if (!providerResponse.ok) {
    send(response, 502, requestId, {
      error: "Generation provider unavailable.",
    });
    return;
  }

  const rawProviderPayload: unknown = await providerResponse.json();
  const providerPayload = geminiResponseSchema.safeParse(rawProviderPayload);
  const generatedText = providerPayload.success
    ? providerPayload.data.candidates[0]?.content.parts[0]?.text
    : undefined;

  if (generatedText === undefined) {
    send(response, 502, requestId, { error: "Invalid generation response." });
    return;
  }

  let candidatePayload: unknown;
  try {
    candidatePayload = JSON.parse(generatedText) as unknown;
  } catch {
    send(response, 502, requestId, { error: "Invalid generation response." });
    return;
  }

  const candidates =
    providerCandidateEnvelopeSchema.safeParse(candidatePayload);
  if (!candidates.success) {
    send(response, 502, requestId, { error: "Invalid generation response." });
    return;
  }

  send(response, 200, requestId, {
    candidates: candidates.data.candidates,
    receipt: {
      mode: "live",
      provider: "Google Gemini API",
      model,
      promptVersion: PROMPT_VERSION,
      generatedAt: new Date().toISOString(),
      note: "Live structured output; deterministic guardrails still run before approval.",
    },
  });
}
