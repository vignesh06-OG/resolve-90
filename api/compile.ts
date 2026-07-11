import type {
  ApiRequest,
  ApiResponse,
} from "../src/infrastructure/server/compile/validation";

interface RuntimeResponse {
  statusCode: number;
  setHeader(name: string, value: string | readonly string[]): void;
  end?(body: string): void;
  json?(body: unknown): void;
}

function adaptResponse(response: RuntimeResponse): ApiResponse {
  const adapted: ApiResponse = {
    status(code) {
      response.statusCode = code;
      return adapted;
    },
    setHeader(name, value) {
      response.setHeader(name, value);
    },
    json(body) {
      if (response.end !== undefined) {
        response.end(JSON.stringify(body));
      } else {
        response.json?.(body);
      }
    },
  };
  return adapted;
}

export default async function compile(
  request: ApiRequest,
  response: RuntimeResponse,
): Promise<void> {
  const adapted = adaptResponse(response);
  try {
    const { default: handler } =
      await import("../src/infrastructure/server/compile/handler");
    await handler(request, adapted);
  } catch (error) {
    const detail =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error";
    adapted.setHeader("Cache-Control", "no-store");
    adapted.setHeader("Content-Type", "application/json; charset=utf-8");
    adapted.setHeader("X-Resolve-Debug", detail.slice(0, 180));
    adapted
      .status(500)
      .json({ error: "Compile gateway initialization failed." });
  }
}
