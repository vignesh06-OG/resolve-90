import { mkdir, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

import { chromium } from "@playwright/test";
import { preview as startPreview } from "vite";

const host = "127.0.0.1";
const port = 4173;
const url = `http://${host}:${port}/`;
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const reportDirectory = new URL("../reports/", import.meta.url);
const reportPath = new URL("lighthouse.json", reportDirectory);
await mkdir(reportDirectory, { recursive: true });

const preview = await startPreview({
  preview: { host, port, strictPort: true },
});

try {
  const run = await new Promise((resolve, reject) => {
    const child = spawn(
      npx,
      [
        "--yes",
        "lighthouse@12.8.2",
        url,
        "--quiet",
        "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--output=json",
        `--output-path=${reportPath.pathname}`,
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, CHROME_PATH: chromium.executablePath() },
      },
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
  if (run.status !== 0) {
    if (run.stdout) console.error(run.stdout);
    if (run.stderr) console.error(run.stderr);
    process.exitCode = 1;
  } else {
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    const scores = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(
        report.categories["best-practices"].score * 100,
      ),
      seo: Math.round(report.categories.seo.score * 100),
      cls: report.audits["cumulative-layout-shift"].numericValue,
    };
    console.table(scores);
    const passed =
      scores.performance >= 96 &&
      scores.accessibility >= 98 &&
      scores.bestPractices >= 98 &&
      scores.seo >= 95 &&
      scores.cls < 0.1;
    if (!passed) {
      console.error("Lighthouse quality thresholds failed.");
      process.exitCode = 1;
    } else {
      console.log("Lighthouse quality thresholds passed.");
    }
  }
} finally {
  await preview.close();
}
