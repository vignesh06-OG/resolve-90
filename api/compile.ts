import handler from "../src/infrastructure/server/compile/handler.js";
import type {
  ApiRequest,
  ApiResponse,
} from "../src/infrastructure/server/compile/validation.js";

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

export default function compile(
  request: ApiRequest,
  response: RuntimeResponse,
): Promise<void> {
  return handler(request, adaptResponse(response));
}
