import handler from "../src/infrastructure/server/compile/handler";
import type {
  ApiRequest,
  ApiResponse,
} from "../src/infrastructure/server/compile/validation";

export default function compile(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  return handler(request, response);
}
