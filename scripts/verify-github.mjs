import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

function git(...args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0)
    throw new Error(result.stderr || "Git command failed.");
  return result.stdout.trim();
}

const remote = git("remote", "get-url", "origin");
const match = /github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?$/.exec(remote);
if (!match?.[1] || !match[2])
  throw new Error("Origin is not a GitHub repository.");
const owner = match[1];
const repository = match[2];
const commit = git("rev-parse", "HEAD");
const defaultBranch = "main";
const repositoryUrl = `https://github.com/${owner}/${repository}`;
const response = await fetch(
  `https://api.github.com/repos/${owner}/${repository}/actions/runs?event=push&branch=${defaultBranch}&per_page=30`,
  { headers: { Accept: "application/vnd.github+json" } },
);
if (!response.ok)
  throw new Error(`GitHub Actions API returned ${response.status}.`);
const payload = await response.json();
const runs = payload.workflow_runs.filter((run) => run.head_sha === commit);
const workflow = (name) => runs.find((run) => run.name === name);
const ci = workflow("CI");
const codeql = workflow("CodeQL");
const clean = git("status", "--porcelain").length === 0;
const dependabot = (await readFile(".github/dependabot.yml", "utf8")).includes(
  "package-ecosystem: npm",
);
const passed =
  clean &&
  ci?.status === "completed" &&
  ci.conclusion === "success" &&
  codeql?.status === "completed" &&
  codeql.conclusion === "success" &&
  dependabot;
const report = {
  generatedAt: new Date().toISOString(),
  status: passed ? "pass" : "fail",
  repositoryUrl,
  commit,
  defaultBranch,
  clean,
  ci: ci
    ? { status: ci.status, conclusion: ci.conclusion, url: ci.html_url }
    : null,
  codeql: codeql
    ? {
        status: codeql.status,
        conclusion: codeql.conclusion,
        url: codeql.html_url,
      }
    : null,
  dependabot: { configured: dependabot },
};

const reportDirectory = new URL("../reports/", import.meta.url);
await mkdir(reportDirectory, { recursive: true });
await writeFile(
  new URL("github.json", reportDirectory),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.table({
  clean,
  ci: ci?.conclusion ?? "missing",
  codeql: codeql?.conclusion ?? "missing",
  dependabot,
});
if (!passed) {
  console.error("GitHub remote verification failed for the current commit.");
  process.exit(1);
}
console.log(`GitHub verification passed for ${commit}.`);
