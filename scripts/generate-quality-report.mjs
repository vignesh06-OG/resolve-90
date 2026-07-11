import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

import { format } from "prettier";

const root = new URL("../", import.meta.url);

async function readJson(path, required = true) {
  try {
    return JSON.parse(await readFile(new URL(path, root), "utf8"));
  } catch (error) {
    if (required) {
      console.error(`Required quality report is missing or invalid: ${path}`);
      throw error;
    }
    return null;
  }
}

function percent(metric) {
  return Number(metric?.pct ?? 0);
}

const [
  vitest,
  playwright,
  coverage,
  performance,
  security,
  lighthouse,
  headers,
  github,
] = await Promise.all([
  readJson("reports/vitest.json"),
  readJson("reports/playwright.json"),
  readJson("coverage/coverage-summary.json"),
  readJson("reports/performance.json"),
  readJson("reports/security-audit.json"),
  readJson("reports/lighthouse.json", false),
  readJson("reports/headers.json", false),
  readJson("reports/github.json", false),
]);

const vitestFiles = vitest.testResults.length;
const accessibilityResults = vitest.testResults.filter(({ name }) =>
  name.includes("/tests/accessibility/"),
);
const accessibilityChecks = accessibilityResults.reduce(
  (total, result) => total + result.assertionResults.length,
  0,
);
const playwrightPassed = playwright.stats.expected;
const playwrightFailed = playwright.stats.unexpected;
const lighthouseScores = lighthouse
  ? {
      performance: Math.round(lighthouse.categories.performance.score * 100),
      accessibility: Math.round(
        lighthouse.categories.accessibility.score * 100,
      ),
      bestPractices: Math.round(
        lighthouse.categories["best-practices"].score * 100,
      ),
      seo: Math.round(lighthouse.categories.seo.score * 100),
      cls: lighthouse.audits["cumulative-layout-shift"].numericValue,
      fcpMilliseconds: lighthouse.audits["first-contentful-paint"].numericValue,
      lcpMilliseconds:
        lighthouse.audits["largest-contentful-paint"].numericValue,
      totalBlockingTimeMilliseconds:
        lighthouse.audits["total-blocking-time"].numericValue,
    }
  : null;
const workflowNames = (
  await readdir(new URL(".github/workflows/", root))
).filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"));
const git = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
  cwd: new URL(".", root),
  encoding: "utf8",
});
const coverageMetrics = {
  lines: percent(coverage.total.lines),
  statements: percent(coverage.total.statements),
  functions: percent(coverage.total.functions),
  branches: percent(coverage.total.branches),
};
const securityPassed =
  security.vulnerabilities.high === 0 &&
  security.vulnerabilities.critical === 0;
const lighthousePassed =
  lighthouseScores !== null &&
  lighthouseScores.performance >= 96 &&
  lighthouseScores.accessibility >= 98 &&
  lighthouseScores.bestPractices >= 98 &&
  lighthouseScores.seo >= 95 &&
  lighthouseScores.cls < 0.1;

const report = {
  generatedAt: new Date().toISOString(),
  commit: git.status === 0 ? git.stdout.trim() : "unknown",
  tests: {
    status:
      vitest.success && playwrightFailed === 0 && playwright.errors.length === 0
        ? "pass"
        : "fail",
    total: vitest.numTotalTests + playwrightPassed + playwrightFailed,
    passed: vitest.numPassedTests + playwrightPassed,
    failed: vitest.numFailedTests + playwrightFailed,
    vitest: {
      files: vitestFiles,
      total: vitest.numTotalTests,
      passed: vitest.numPassedTests,
    },
    playwright: {
      total: playwrightPassed + playwrightFailed,
      passed: playwrightPassed,
      failed: playwrightFailed,
    },
  },
  coverage: {
    status:
      coverageMetrics.lines >= 80 &&
      coverageMetrics.functions >= 80 &&
      coverageMetrics.branches >= 75 &&
      coverageMetrics.statements >= 80
        ? "pass"
        : "fail",
    ...coverageMetrics,
  },
  build: {
    status: performance.passed ? "pass" : "fail",
    javascriptGzipBytes: performance.totals.javascriptGzipBytes,
    cssGzipBytes: performance.totals.cssGzipBytes,
    javascriptChunks: performance.totals.javascriptChunks,
    largestJavaScriptGzipBytes: performance.totals.largestJavaScriptGzipBytes,
  },
  security: {
    status: securityPassed ? "pass" : "fail",
    vulnerabilities: security.vulnerabilities,
  },
  performance: {
    status: performance.passed && lighthousePassed ? "pass" : "fail",
    budgetPassed: performance.passed,
    lighthouse: lighthouseScores,
  },
  accessibility: {
    status:
      accessibilityChecks > 0 &&
      accessibilityResults.every(({ status }) => status === "passed") &&
      (lighthouseScores?.accessibility ?? 0) >= 98
        ? "pass"
        : "fail",
    automatedChecks: accessibilityChecks,
    lighthouseScore: lighthouseScores?.accessibility ?? null,
  },
  ci: {
    status: workflowNames.length >= 2 ? "configured" : "missing",
    workflows: workflowNames,
    remoteVerified: github?.status === "pass",
    repositoryUrl: github?.repositoryUrl ?? null,
    verifiedCommit: github?.commit ?? null,
    codeql: github?.codeql?.conclusion ?? "unverified",
    dependabot: github?.dependabot?.configured ?? false,
  },
  headers: headers
    ? {
        status: headers.status,
        origin: headers.origin,
        checks: headers.checks,
      }
    : {
        status: "unverified",
        origin: null,
        checks: {},
      },
};

const generatedDirectory = new URL("src/generated/", root);
const publicDirectory = new URL("public/quality/", root);
await Promise.all([
  mkdir(generatedDirectory, { recursive: true }),
  mkdir(publicDirectory, { recursive: true }),
]);
const [sourceReport, publicReport] = await Promise.all([
  format(
    `// Generated by scripts/generate-quality-report.mjs. Do not edit.\nimport type { QualityReport } from "./qualityReportTypes";\n\nexport const QUALITY_REPORT: QualityReport = ${JSON.stringify(report, null, 2)};\n`,
    { parser: "typescript" },
  ),
  format(`${JSON.stringify(report, null, 2)}\n`, { parser: "json" }),
]);
await Promise.all([
  writeFile(new URL("qualityReport.ts", generatedDirectory), sourceReport),
  writeFile(new URL("latest.json", publicDirectory), publicReport),
]);

console.log(
  `Generated quality report: ${report.tests.passed}/${report.tests.total} tests, ${report.coverage.branches}% branch coverage.`,
);
