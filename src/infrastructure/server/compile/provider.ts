import type { GeneratedCandidate } from "../../../domain/entities/decision.js";
import type { IncidentContext } from "../../../domain/entities/incident.js";
import {
  buildGroundedPrompt,
  SYSTEM_INSTRUCTION,
} from "../../ai/buildGroundedPrompt.js";
import { providerCandidateEnvelopeSchema } from "../../ai/schemas.js";
import { geminiResponseSchema, OUTPUT_SCHEMA } from "./schema.js";

export type ProviderResult =
  | {
      readonly ok: true;
      readonly candidates: readonly GeneratedCandidate[];
      readonly model: string;
    }
  | { readonly ok: false; readonly kind: "invalid" | "unavailable" };

const DEFAULT_MODEL = "gemini-2.5-flash";
const PROVIDER_TIMEOUT_MS = 10_000;
const MAX_OUTPUT_TOKENS = 8192;
const GENERATION_TEMPERATURE = 0.2;
const ALLOWED_MODELS = new Set([DEFAULT_MODEL, "gemini-2.0-flash"]);

function selectedModel(): string {
  const configured = process.env["GEMINI_MODEL"] ?? DEFAULT_MODEL;
  return ALLOWED_MODELS.has(configured) ? configured : DEFAULT_MODEL;
}

function requestBody(incident: IncidentContext): string {
  return JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [
      { role: "user", parts: [{ text: buildGroundedPrompt(incident) }] },
    ],
    generationConfig: {
      temperature: GENERATION_TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      responseMimeType: "application/json",
      responseJsonSchema: OUTPUT_SCHEMA,
    },
  });
}

async function callProvider(
  incident: IncidentContext,
  apiKey: string,
  model: string,
): Promise<Response | null> {
  try {
    return await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: requestBody(incident),
        signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      },
    );
  } catch {
    return null;
  }
}

function parseCandidateText(
  text: string,
): readonly GeneratedCandidate[] | null {
  try {
    const candidates = providerCandidateEnvelopeSchema.safeParse(
      JSON.parse(text) as unknown,
    );
    return candidates.success ? candidates.data.candidates : null;
  } catch {
    return null;
  }
}

async function candidatesFrom(
  response: Response,
): Promise<readonly GeneratedCandidate[] | null> {
  const payload: unknown = await response.json();
  const parsed = geminiResponseSchema.safeParse(payload);
  if (!parsed.success) return null;
  const candidate = parsed.data.candidates[0];
  if (candidate === undefined) return null;
  const part = candidate.content.parts[0];
  return part === undefined ? null : parseCandidateText(part.text);
}

export async function requestGemini(
  incident: IncidentContext,
  apiKey: string,
): Promise<ProviderResult> {
  const model = selectedModel();
  const response = await callProvider(incident, apiKey, model);
  if (response === null || !response.ok)
    return { ok: false, kind: "unavailable" };
  const candidates = await candidatesFrom(response);
  return candidates === null
    ? { ok: false, kind: "invalid" }
    : { ok: true, candidates, model };
}
