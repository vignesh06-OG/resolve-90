import { mkdir, writeFile } from "node:fs/promises";

const origin = process.argv[2] ?? process.env.DEPLOYMENT_URL;
if (!origin) {
  console.error(
    "Provide a deployed HTTPS origin as an argument or DEPLOYMENT_URL.",
  );
  process.exit(1);
}

const response = await fetch(origin, { redirect: "follow" });
const definitions = {
  contentSecurityPolicy: {
    header: "content-security-policy",
    valid: (value) =>
      value.includes("default-src 'self'") &&
      value.includes("frame-ancestors 'none'"),
  },
  strictTransportSecurity: {
    header: "strict-transport-security",
    valid: (value) => value.includes("max-age="),
  },
  permissionsPolicy: {
    header: "permissions-policy",
    valid: (value) =>
      value.includes("camera=()") && value.includes("microphone=()"),
  },
  frameProtection: {
    header: "x-frame-options",
    valid: (value) => value.toUpperCase() === "DENY",
  },
  contentTypeProtection: {
    header: "x-content-type-options",
    valid: (value) => value.toLowerCase() === "nosniff",
  },
  crossOriginOpenerPolicy: {
    header: "cross-origin-opener-policy",
    valid: (value) => value.toLowerCase() === "same-origin",
  },
  crossOriginResourcePolicy: {
    header: "cross-origin-resource-policy",
    valid: (value) => value.toLowerCase() === "same-origin",
  },
  dnsPrefetchControl: {
    header: "x-dns-prefetch-control",
    valid: (value) => value.toLowerCase() === "off",
  },
  permittedCrossDomainPolicies: {
    header: "x-permitted-cross-domain-policies",
    valid: (value) => value.toLowerCase() === "none",
  },
  referrerPolicy: {
    header: "referrer-policy",
    valid: (value) => value.toLowerCase() === "no-referrer",
  },
};

const checks = Object.fromEntries(
  Object.entries(definitions).map(([name, definition]) => {
    const actual = response.headers.get(definition.header);
    return [
      name,
      {
        header: definition.header,
        actual,
        passed: actual !== null && definition.valid(actual),
      },
    ];
  }),
);
const passed =
  response.ok && Object.values(checks).every((check) => check.passed);
const report = {
  generatedAt: new Date().toISOString(),
  status: passed ? "pass" : "fail",
  origin: response.url,
  httpStatus: response.status,
  checks,
};

const reportDirectory = new URL("../reports/", import.meta.url);
await mkdir(reportDirectory, { recursive: true });
await writeFile(
  new URL("headers.json", reportDirectory),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.table(
  Object.entries(checks).map(([name, check]) => ({
    check: name,
    header: check.header,
    passed: check.passed,
  })),
);
if (!passed) {
  console.error("Deployed response-header verification failed.");
  process.exit(1);
}
console.log(`Deployed response headers verified at ${response.url}.`);
