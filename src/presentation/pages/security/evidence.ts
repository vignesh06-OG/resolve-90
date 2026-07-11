import type { IconName } from "../../../shared/components/Icon";

export interface Threat {
  readonly title: string;
  readonly icon: IconName;
  readonly threat: string;
  readonly control: string;
  readonly residual: string;
}

export const THREATS: readonly Threat[] = [
  {
    title: "Decision integrity",
    icon: "shield",
    threat: "Prompt injection or hallucinated venue facts",
    control:
      "Instruction/data separation, evidence-ID allowlist, output schema, deterministic guardrails",
    residual: "Source telemetry may itself be stale or incorrect",
  },
  {
    title: "Provider secret",
    icon: "lock",
    threat: "Credential extraction from the browser bundle",
    control:
      "Same-origin server gateway; GEMINI_API_KEY never uses a VITE_ variable",
    residual: "Authorized hosting administrators can access runtime secrets",
  },
  {
    title: "Accessibility",
    icon: "access",
    threat: "Throughput optimization disadvantages disabled fans",
    control:
      "90% hard floor, 95% target, deterministic veto, explicit human acknowledgement",
    residual: "Real venue configuration must include every physical barrier",
  },
  {
    title: "API abuse",
    icon: "warning",
    threat: "Generation spam, oversized payloads, and cost exhaustion",
    control:
      "32 KiB limit, bounded schemas, origin check, token bucket, timeout, model allowlist",
    residual:
      "Multi-region production needs a distributed authenticated limiter",
  },
  {
    title: "Browser content",
    icon: "code",
    threat: "Model or signal text executes as HTML or script",
    control:
      "React text escaping, no dangerous HTML, strict CSP, same-origin resources",
    residual: "Untrusted browser extensions are outside application control",
  },
  {
    title: "Fan privacy",
    icon: "users",
    threat: "Operational tooling becomes person-level surveillance",
    control:
      "Aggregate counts only; no biometrics, profiles, device IDs, or personal storage",
    residual:
      "Connected upstream systems must uphold the same minimization policy",
  },
];

export const GATEWAY_STEPS = [
  "POST + allowed origin",
  "Hashed rate-limit key",
  "32 KiB request ceiling",
  "Strict incident schema",
  "Server-only credential",
  "10 second provider timeout",
  "Strict response schema",
] as const;
