import type { Clock, IdGenerator } from "../../application/ports/SystemPorts";

export class BrowserClock implements Clock {
  now(): string {
    return new Date().toISOString();
  }
}

export class RandomIdGenerator implements IdGenerator {
  next(prefix: "audit" | "decision"): string {
    return `${prefix}-${crypto.randomUUID()}`;
  }
}
