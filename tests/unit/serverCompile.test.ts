import { afterEach, describe, expect, it, vi } from "vitest";

import {
  EAST_CONCOURSE_INCIDENT,
  REPLAY_GENERATION,
} from "../../src/infrastructure/repositories/replayScenario";
import handler from "../../src/infrastructure/server/compile/handler";
import { applyRateLimit } from "../../src/infrastructure/server/compile/limiter";
import { requestGemini } from "../../src/infrastructure/server/compile/provider";
import type {
  ApiRequest,
  ApiResponse,
} from "../../src/infrastructure/server/compile/validation";
import {
  firstHeader,
  validateBody,
} from "../../src/infrastructure/server/compile/validation";

class CapturedResponse implements ApiResponse {
  statusCode = 200;
  readonly headers = new Map<string, string | readonly string[]>();
  body: unknown;

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  setHeader(name: string, value: string | readonly string[]): void {
    this.headers.set(name, value);
  }

  json(body: unknown): void {
    this.body = body;
  }
}

function request(method: string, body: unknown, address: string): ApiRequest {
  return {
    method,
    body,
    headers: { "x-forwarded-for": address },
  };
}

function successfulProviderResponse(): Response {
  return new Response(
    JSON.stringify({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  candidates: REPLAY_GENERATION.candidates,
                }),
              },
            ],
          },
        },
      ],
    }),
    { status: 200 },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("server compile handler", () => {
  it("rejects method, origin, oversized, and malformed requests", async () => {
    const method = new CapturedResponse();
    await handler(request("GET", {}, "203.0.113.1"), method);
    expect(method.statusCode).toBe(405);
    expect(method.headers.get("Allow")).toBe("POST");

    vi.stubEnv("ALLOWED_ORIGIN", "https://allowed.example");
    const origin = new CapturedResponse();
    await handler(
      {
        ...request("POST", {}, "203.0.113.2"),
        headers: {
          origin: "https://blocked.example",
          "x-forwarded-for": "203.0.113.2",
        },
      },
      origin,
    );
    expect(origin.statusCode).toBe(403);
    vi.unstubAllEnvs();

    const oversized = new CapturedResponse();
    await handler(
      request("POST", { payload: "x".repeat(33 * 1024) }, "203.0.113.3"),
      oversized,
    );
    expect(oversized.statusCode).toBe(413);

    const malformed = new CapturedResponse();
    await handler(
      request("POST", { incident: "invalid" }, "203.0.113.4"),
      malformed,
    );
    expect(malformed.statusCode).toBe(400);
  });

  it("rate limits repeated requests and fails safely without a key", async () => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 9; attempt += 1) {
      const response = new CapturedResponse();
      await handler(
        request("POST", { incident: "invalid" }, "203.0.113.50"),
        response,
      );
      statuses.push(response.statusCode);
    }
    expect(statuses.at(-1)).toBe(429);

    const missingKey = new CapturedResponse();
    await handler(
      request("POST", { incident: EAST_CONCOURSE_INCIDENT }, "203.0.113.51"),
      missingKey,
    );
    expect(missingKey.statusCode).toBe(503);
  });

  it("returns a validated live packet and rejects invalid provider output", async () => {
    vi.stubEnv("GEMINI_API_KEY", "server-key-that-is-long-enough");
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(successfulProviderResponse()),
    );
    const success = new CapturedResponse();
    await handler(
      request("POST", { incident: EAST_CONCOURSE_INCIDENT }, "203.0.113.52"),
      success,
    );
    expect(success.statusCode).toBe(200);
    expect(success.body).toMatchObject({ receipt: { mode: "live" } });

    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            candidates: [
              { content: { parts: [{ text: "not valid candidate JSON" }] } },
            ],
          }),
          { status: 200 },
        ),
      ),
    );
    const invalid = new CapturedResponse();
    await handler(
      request("POST", { incident: EAST_CONCOURSE_INCIDENT }, "203.0.113.53"),
      invalid,
    );
    expect(invalid.statusCode).toBe(502);
    expect(invalid.body).toEqual({ error: "Invalid generation response." });

    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response("{}", { status: 503 })),
    );
    const unavailable = new CapturedResponse();
    await handler(
      request("POST", { incident: EAST_CONCOURSE_INCIDENT }, "203.0.113.54"),
      unavailable,
    );
    expect(unavailable.statusCode).toBe(502);
    expect(unavailable.body).toEqual({
      error: "Generation provider unavailable.",
    });
  });
});

describe("server provider and boundaries", () => {
  it("accepts a valid structured Gemini candidate envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockImplementation(() =>
          Promise.resolve(successfulProviderResponse()),
        ),
    );

    const result = await requestGemini(
      EAST_CONCOURSE_INCIDENT,
      "server-key-that-is-long-enough",
    );

    expect(result).toMatchObject({ ok: true, model: "gemini-2.5-flash" });

    vi.stubEnv("GEMINI_MODEL", "unsupported-model");
    const fallbackModel = await requestGemini(
      EAST_CONCOURSE_INCIDENT,
      "server-key-that-is-long-enough",
    );
    expect(fallbackModel).toMatchObject({
      ok: true,
      model: "gemini-2.5-flash",
    });
  });

  it("classifies unavailable and invalid provider responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response("{}", { status: 503 })),
    );
    await expect(
      requestGemini(EAST_CONCOURSE_INCIDENT, "server-key-that-is-long-enough"),
    ).resolves.toEqual({ ok: false, kind: "unavailable" });

    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({ candidates: [{ content: { parts: [] } }] }),
          {
            status: 200,
          },
        ),
      ),
    );
    await expect(
      requestGemini(EAST_CONCOURSE_INCIDENT, "server-key-that-is-long-enough"),
    ).resolves.toEqual({ ok: false, kind: "invalid" });

    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            candidates: [
              { content: { parts: [{ text: '{"candidates":[]}' }] } },
            ],
          }),
          { status: 200 },
        ),
      ),
    );
    await expect(
      requestGemini(EAST_CONCOURSE_INCIDENT, "server-key-that-is-long-enough"),
    ).resolves.toEqual({ ok: false, kind: "invalid" });
  });

  it("handles transport exceptions and circular request bodies", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(new Error("offline")),
    );
    await expect(
      requestGemini(EAST_CONCOURSE_INCIDENT, "server-key-that-is-long-enough"),
    ).resolves.toEqual({ ok: false, kind: "unavailable" });

    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(validateBody(circular)).toMatchObject({
      ok: false,
      error: { status: 413 },
    });
  });

  it("resets limiter buckets after the configured window", () => {
    const first = new CapturedResponse();
    const later = new CapturedResponse();
    const sample = request("POST", {}, "203.0.113.88");

    expect(applyRateLimit(sample, first, 0).allowed).toBe(true);
    expect(applyRateLimit(sample, later, 60_001).allowed).toBe(true);
    expect(later.headers.get("X-RateLimit-Remaining")).toBe("7");
    expect(firstHeader(["first", "second"])).toBe("first");

    const socketResponse = new CapturedResponse();
    expect(
      applyRateLimit(
        {
          method: "POST",
          body: {},
          headers: {},
          socket: { remoteAddress: "::1" },
        },
        socketResponse,
      ).allowed,
    ).toBe(true);
    expect(
      applyRateLimit(
        { method: "POST", body: {}, headers: {} },
        new CapturedResponse(),
      ).allowed,
    ).toBe(true);
  });
});
