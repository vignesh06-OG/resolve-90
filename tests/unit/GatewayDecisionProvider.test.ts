import { describe, expect, it, vi } from "vitest";

import { GatewayDecisionProvider } from "../../src/infrastructure/ai/GatewayDecisionProvider";
import {
  EAST_CONCOURSE_INCIDENT,
  REPLAY_GENERATION,
} from "../../src/infrastructure/repositories/replayScenario";

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("GatewayDecisionProvider", () => {
  it("accepts a schema-valid gateway packet", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response(REPLAY_GENERATION));
    const provider = new GatewayDecisionProvider("/api/compile", fetcher);

    const result = await provider.generate(EAST_CONCOURSE_INCIDENT);

    expect(result.ok).toBe(true);
    expect(fetcher).toHaveBeenCalledWith(
      "/api/compile",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("rejects a non-success gateway response", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response({}, 503));
    const provider = new GatewayDecisionProvider("/api/compile", fetcher);

    await expect(
      provider.generate(EAST_CONCOURSE_INCIDENT),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "PROVIDER_UNAVAILABLE" },
    });
  });

  it("rejects provider output that misses the strict schema", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ candidates: [] }));
    const provider = new GatewayDecisionProvider("/api/compile", fetcher);

    await expect(
      provider.generate(EAST_CONCOURSE_INCIDENT),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "INVALID_PROVIDER_OUTPUT" },
    });
  });

  it("returns a typed unavailable state for a network failure", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("offline"));
    const provider = new GatewayDecisionProvider("/api/compile", fetcher);

    await expect(
      provider.generate(EAST_CONCOURSE_INCIDENT),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "PROVIDER_UNAVAILABLE" },
    });
  });

  it("distinguishes a timeout from a generic network failure", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation((_input, init) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new Error("aborted")),
        );
      });
    });
    const provider = new GatewayDecisionProvider("/api/compile", fetcher, 1);

    await expect(
      provider.generate(EAST_CONCOURSE_INCIDENT),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "PROVIDER_TIMEOUT" },
    });
  });
});
