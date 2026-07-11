export type CheckStatus = "pass" | "fail";

export interface LighthouseMetrics {
  readonly performance: number;
  readonly accessibility: number;
  readonly bestPractices: number;
  readonly seo: number;
  readonly cls: number;
  readonly fcpMilliseconds: number;
  readonly lcpMilliseconds: number;
  readonly totalBlockingTimeMilliseconds: number;
}

export interface QualityReport {
  readonly generatedAt: string;
  readonly commit: string;
  readonly tests: {
    readonly status: CheckStatus;
    readonly total: number;
    readonly passed: number;
    readonly failed: number;
    readonly vitest: {
      readonly files: number;
      readonly total: number;
      readonly passed: number;
    };
    readonly playwright: {
      readonly total: number;
      readonly passed: number;
      readonly failed: number;
    };
  };
  readonly coverage: {
    readonly status: CheckStatus;
    readonly lines: number;
    readonly statements: number;
    readonly functions: number;
    readonly branches: number;
  };
  readonly build: {
    readonly status: CheckStatus;
    readonly javascriptGzipBytes: number;
    readonly cssGzipBytes: number;
    readonly javascriptChunks: number;
    readonly largestJavaScriptGzipBytes: number;
  };
  readonly security: {
    readonly status: CheckStatus;
    readonly vulnerabilities: {
      readonly info: number;
      readonly low: number;
      readonly moderate: number;
      readonly high: number;
      readonly critical: number;
      readonly total: number;
    };
  };
  readonly performance: {
    readonly status: CheckStatus;
    readonly budgetPassed: boolean;
    readonly lighthouse: LighthouseMetrics | null;
  };
  readonly accessibility: {
    readonly status: CheckStatus;
    readonly automatedChecks: number;
    readonly lighthouseScore: number | null;
  };
  readonly ci: {
    readonly status: "configured" | "missing";
    readonly workflows: readonly string[];
    readonly remoteVerified: boolean;
  };
  readonly headers: {
    readonly status: "pass" | "fail" | "unverified";
    readonly origin: string | null;
    readonly checks: Readonly<
      Record<
        string,
        {
          readonly header: string;
          readonly actual: string | null;
          readonly passed: boolean;
        }
      >
    >;
  };
}
