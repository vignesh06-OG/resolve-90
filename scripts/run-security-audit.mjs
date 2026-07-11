import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const executable = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(executable, ["audit", "--json"], {
  cwd: process.cwd(),
  encoding: "utf8",
});

let audit;
try {
  audit = JSON.parse(result.stdout);
} catch {
  console.error("npm audit did not return a valid JSON report.");
  if (result.stderr) console.error(result.stderr);
  process.exit(1);
}

const vulnerabilities = audit.metadata?.vulnerabilities ?? {};
const report = {
  generatedAt: new Date().toISOString(),
  vulnerabilities: {
    info: vulnerabilities.info ?? 0,
    low: vulnerabilities.low ?? 0,
    moderate: vulnerabilities.moderate ?? 0,
    high: vulnerabilities.high ?? 0,
    critical: vulnerabilities.critical ?? 0,
    total: vulnerabilities.total ?? 0,
  },
  dependencies: audit.metadata?.dependencies ?? {},
  advisories: audit.vulnerabilities ?? {},
};

const reportDirectory = new URL("../reports/", import.meta.url);
await mkdir(reportDirectory, { recursive: true });
await writeFile(
  new URL("security-audit.json", reportDirectory),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.table(report.vulnerabilities);
if (report.vulnerabilities.high > 0 || report.vulnerabilities.critical > 0) {
  console.error("Security audit failed at the high-severity gate.");
  process.exit(1);
}

console.log("Security audit passed.");
