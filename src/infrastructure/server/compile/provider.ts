import type { GeneratedCandidate } from "../../../domain/entities/decision";
import type { IncidentContext } from "../../../domain/entities/incident";
import {
  buildGroundedPrompt,
  SYSTEM_INSTRUCTION,
} from "../../ai/buildGroundedPrompt";
import { providerCandidateEnvelopeSchema } from "../../ai/schemas";
import { geminiResponseSchema, OUTPUT_SCHEMA } from "./schema";

export type ProviderResult =
  | {
      readonly ok: true;
      readonly candidates: readonly GeneratedCandidate[];
      readonly model: string;
    }
  | {
      readonly ok: false;
      readonly kind: "invalid" | "unavailable";
    };

const ALLOWED_MODELS = new Set(["gemini-2.5-flash", "gemini-2.0-flash"]);

function selectedModel(): string {
  const configured = process.env["GEMINI_MODEL"] ?? "gemini-2.5-flash";
  return ALLOWED_MODELS.has(configured) ? configured : "gemini-2.5-flash";
}

function parseCandidateText(
  text: string,
): readonly GeneratedCandidate[] | null {
  let payload: unknown;
  try {
    payload = JSON.parse(text) as unknown;
  } catch {
    return null;
  }
  const candidates = providerCandidateEnvelopeSchema.safeParse(payload);
  return candidates.success ? candidates.data.candidates : null;
}

export async function requestGemini(
  incident: IncidentContext,
  apiKey: string,
): Promise<ProviderResult> {
  const model = selectedModel();
  let response: Response;
  try {
    response = await fetch(
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
              parts: [{ text: buildGroundedPrompt(incident) }],
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
    return { ok: false, kind: "unavailable" };
  }

  if (!response.ok) return { ok: false, kind: "unavailable" };

  const rawPayload: unknown = await response.json();
  const providerPayload = geminiResponseSchema.safeParse(rawPayload);
  const generatedText = providerPayload.success
    ? providerPayload.data.candidates[0]?.content.parts[0]?.text
    : undefined;
  if (generatedText === undefined) return { ok: false, kind: "invalid" };

  const candidates = parseCandidateText(generatedText);
  return candidates === null
    ? { ok: false, kind: "invalid" }
    : { ok: true, candidates, model };
}
