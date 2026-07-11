import type { IncidentContext } from "../../../domain/entities/incident.js";
import { compileRequestSchema } from "../../ai/schemas.js";

export interface ApiRequest {
  readonly method?: string;
  readonly headers: Readonly<
    Record<string, string | readonly string[] | undefined>
  >;
  readonly body?: unknown;
  readonly socket?: { readonly remoteAddress?: string };
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string | readonly string[]): void;
  json(body: unknown): void;
}

export interface ValidationFailure {
  readonly status: 400 | 413;
  readonly message: string;
}

export type ValidationResult =
  | { readonly ok: true; readonly incident: IncidentContext }
  | { readonly ok: false; readonly error: ValidationFailure };

const MAX_BODY_BYTES = 32 * 1024;

export function firstHeader(
  value: string | readonly string[] | undefined,
): string | undefined {
  if (typeof value === "string" || value === undefined) return value;
  return value[0];
}

export function sendJson(
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

function serializedSize(body: unknown): number {
  try {
    return Buffer.byteLength(JSON.stringify(body), "utf8");
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

export function validateBody(body: unknown): ValidationResult {
  if (serializedSize(body) > MAX_BODY_BYTES) {
    return {
      ok: false,
      error: { status: 413, message: "Request body is too large." },
    };
  }

  const parsed = compileRequestSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      error: { status: 400, message: "Invalid request payload." },
    };
  }

  return { ok: true, incident: parsed.data.incident };
}
