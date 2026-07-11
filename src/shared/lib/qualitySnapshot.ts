type QualityStatus = "pass" | "warn";

interface QualitySnapshot {
  readonly verifiedAt: string;
  readonly tests: {
    readonly total: number;
    readonly status: QualityStatus;
    readonly detail: string;
  };
  readonly coverage: {
    readonly lines: string;
    readonly functions: string;
    readonly branches: string;
    readonly status: QualityStatus;
  };
  readonly build: { readonly status: QualityStatus; readonly detail: string };
  readonly security: {
    readonly status: QualityStatus;
    readonly detail: string;
  };
  readonly performance: {
    readonly status: QualityStatus;
    readonly detail: string;
    readonly lighthouse: string;
  };
  readonly accessibility: {
    readonly status: QualityStatus;
    readonly detail: string;
  };
  readonly ci: { readonly status: QualityStatus; readonly detail: string };
}

export const QUALITY_SNAPSHOT: QualitySnapshot = {
  verifiedAt: "2026-07-11",
  tests: {
    total: 20,
    status: "pass",
    detail: "5 files · unit + integration",
  },
  coverage: {
    lines: "Pending final audit",
    functions: "Pending final audit",
    branches: "Pending final audit",
    status: "warn",
  },
  build: {
    status: "pass",
    detail: "TypeScript + Vite production build",
  },
  security: {
    status: "pass",
    detail: "0 known high or critical advisories",
  },
  performance: {
    status: "pass",
    detail: "190 KiB gzip JS budget enforced",
    lighthouse: "Pending final audit",
  },
  accessibility: {
    status: "warn",
    detail: "WCAG 2.2 AA audit in progress",
  },
  ci: {
    status: "pass",
    detail: "Quality, E2E, CodeQL, artifacts",
  },
};
