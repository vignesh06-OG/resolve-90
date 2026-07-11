import { expect, test } from "@playwright/test";

import compileHandler from "../../api/compile";
import { GatewayDecisionProvider } from "../../src/infrastructure/ai/GatewayDecisionProvider";
import { EAST_CONCOURSE_INCIDENT } from "../../src/infrastructure/repositories/replayScenario";

class CapturedResponse {
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

function request(
  method: string,
  body: unknown,
  address: string,
): {
  readonly method: string;
  readonly body: unknown;
  readonly headers: Readonly<Record<string, string>>;
} {
  return {
    method,
    body,
    headers: { "x-forwarded-for": address },
  };
}

test("Gemini gateway failure remains a typed unavailable state", async () => {
  const fetcher = (): Promise<Response> =>
    Promise.resolve(new Response("{}", { status: 503 }));
  const provider = new GatewayDecisionProvider("/api/compile", fetcher);

  const result = await provider.generate(EAST_CONCOURSE_INCIDENT);

  expect(result).toMatchObject({
    ok: false,
    error: { code: "PROVIDER_UNAVAILABLE" },
  });
});

test("compile endpoint rejects unsupported methods and malformed input", async () => {
  const methodResponse = new CapturedResponse();
  await compileHandler(request("GET", {}, "198.51.100.10"), methodResponse);
  expect(methodResponse.statusCode).toBe(405);
  expect(methodResponse.headers.get("Allow")).toBe("POST");

  const malformedResponse = new CapturedResponse();
  await compileHandler(
    request("POST", { incident: "not-an-incident" }, "198.51.100.11"),
    malformedResponse,
  );
  expect(malformedResponse.statusCode).toBe(400);
});

test("compile endpoint enforces its request-size ceiling", async () => {
  const response = new CapturedResponse();
  await compileHandler(
    request("POST", { payload: "x".repeat(33 * 1024) }, "198.51.100.12"),
    response,
  );

  expect(response.statusCode).toBe(413);
});

test("compile endpoint rate limits repeated generation attempts", async () => {
  const statuses: number[] = [];
  for (let attempt = 0; attempt < 9; attempt += 1) {
    const response = new CapturedResponse();
    await compileHandler(
      request("POST", { incident: "invalid" }, "198.51.100.99"),
      response,
    );
    statuses.push(response.statusCode);
  }

  expect(statuses.slice(0, 8)).toEqual(Array.from({ length: 8 }, () => 400));
  expect(statuses[8]).toBe(429);
});

test("valid live request fails safely when no server credential exists", async () => {
  const original = process.env["GEMINI_API_KEY"];
  delete process.env["GEMINI_API_KEY"];
  const response = new CapturedResponse();

  try {
    await compileHandler(
      request("POST", { incident: EAST_CONCOURSE_INCIDENT }, "198.51.100.13"),
      response,
    );
  } finally {
    if (original !== undefined) process.env["GEMINI_API_KEY"] = original;
  }

  expect(response.statusCode).toBe(503);
  expect(response.body).toEqual({
    error: "Live generation is not configured. Replay mode is available.",
  });
});
