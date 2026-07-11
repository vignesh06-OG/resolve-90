import { afterEach, describe, expect, it, vi } from "vitest";

import { createApplicationServices } from "../../src/infrastructure/createApplicationServices";
import { EAST_CONCOURSE_INCIDENT } from "../../src/infrastructure/repositories/replayScenario";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("application service composition", () => {
  it("loads the live gateway only when live mode is selected", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response("{}", {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    const services = createApplicationServices({
      mode: "live",
      apiUrl: "/api/compile",
    });

    const result = await services.compileIncident.execute(
      EAST_CONCOURSE_INCIDENT.id,
    );

    expect(result).toMatchObject({
      ok: false,
      error: { code: "PROVIDER_FAILURE" },
    });
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
