import { createHash } from "node:crypto";

import type { ApiRequest, ApiResponse } from "./validation";
import { firstHeader } from "./validation";

interface RateBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly retryAfterSeconds: number;
}

const RATE_LIMIT = 8;
const RATE_WINDOW_MILLISECONDS = 60_000;
const buckets = new Map<string, RateBucket>();

function requestKey(request: ApiRequest): string {
  const forwarded = firstHeader(request.headers["x-forwarded-for"]);
  const address =
    forwarded?.split(",")[0]?.trim() ??
    request.socket?.remoteAddress ??
    "unknown";
  return createHash("sha256").update(address).digest("hex").slice(0, 20);
}

function consume(key: string, now: number): RateBucket {
  const existing = buckets.get(key);
  if (existing === undefined || existing.resetAt <= now) {
    const next = { count: 1, resetAt: now + RATE_WINDOW_MILLISECONDS };
    buckets.set(key, next);
    return next;
  }

  existing.count += 1;
  return existing;
}

export function applyRateLimit(
  request: ApiRequest,
  response: ApiResponse,
  now = Date.now(),
): RateLimitResult {
  const bucket = consume(requestKey(request), now);
  response.setHeader("X-RateLimit-Limit", String(RATE_LIMIT));
  response.setHeader(
    "X-RateLimit-Remaining",
    String(Math.max(0, RATE_LIMIT - bucket.count)),
  );

  return {
    allowed: bucket.count <= RATE_LIMIT,
    retryAfterSeconds: Math.max(0, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}
