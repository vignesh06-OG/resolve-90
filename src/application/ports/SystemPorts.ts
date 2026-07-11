export interface Clock {
  now(): string;
}

export interface IdGenerator {
  next(prefix: "audit" | "decision"): string;
}
