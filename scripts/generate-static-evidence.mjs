import { mkdir, readFile, writeFile } from "node:fs/promises";

import { format } from "prettier";

import {
  accessibilityChecks,
  alignmentRows,
  architectureLayers,
  securityControls,
} from "./evidence-pages.mjs";

const root = new URL("../", import.meta.url);
const report = JSON.parse(
  await readFile(new URL("public/quality/latest.json", root), "utf8"),
);
const siteUrl = (
  process.env.PUBLIC_SITE_URL ?? "https://resolve-90.vercel.app"
).replace(/\/$/, "");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cards(items) {
  return `<div class="static-grid">${items
    .map(
      ([label, value, detail]) => `<article class="static-card">
        <p>${escapeHtml(label)}</p><strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(detail)}</span>
      </article>`,
    )
    .join("")}</div>`;
}

function list(items) {
  return `<ul class="static-list">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function table(headings, rows) {
  return `<div class="static-table-wrap"><table><thead><tr>${headings
    .map((heading) => `<th scope="col">${escapeHtml(heading)}</th>`)
    .join("")}</tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${escapeHtml(cell)}</td>`)
          .join("")}</tr>`,
    )
    .join("")}</tbody></table></div>`;
}

const lighthouse = report.performance.lighthouse;
const pages = [
  {
    slug: "quality",
    eyebrow: "Evaluation evidence · Quality",
    title: "Quality, made observable.",
    summary:
      "Machine-generated testing, coverage, build, security, accessibility, performance, and CI evidence.",
    body: cards([
      [
        "Testing evidence",
        `${report.tests.passed}/${report.tests.total} passing`,
        `${report.tests.vitest.files} Vitest files · ${report.tests.playwright.total} Playwright scenarios`,
      ],
      [
        "Coverage",
        `${report.coverage.lines}% lines`,
        `${report.coverage.functions}% functions · ${report.coverage.branches}% branches`,
      ],
      [
        "Build status",
        report.build.status,
        `${report.build.javascriptChunks} JavaScript chunks`,
      ],
      [
        "Security checks",
        `${report.security.vulnerabilities.total} advisories`,
        "Dependency and provider boundary checks",
      ],
      [
        "Accessibility checks",
        `${report.accessibility.lighthouseScore}/100`,
        `${report.accessibility.automatedChecks} automated accessibility checks`,
      ],
      [
        "Performance metrics",
        `${lighthouse?.performance ?? 0}/100`,
        `CLS ${lighthouse?.cls ?? "n/a"} · bundle budget ${report.performance.budgetPassed ? "passed" : "failed"}`,
      ],
      [
        "CI/CD badge",
        report.ci.remoteVerified ? "Remote verified" : report.ci.status,
        `CodeQL ${report.ci.codeql} · Dependabot ${report.ci.dependabot ? "configured" : "missing"}`,
      ],
    ]),
  },
  {
    slug: "architecture",
    eyebrow: "Evaluation evidence · Architecture",
    title: "AI outside. Safety inside.",
    summary:
      "Clean architecture keeps provider uncertainty at the edge and deterministic safety rules in the domain core.",
    body:
      cards(
        architectureLayers.map(([layer, detail]) => [layer, layer, detail]),
      ) +
      `<section><h2>SOLID principles</h2>${list([
        "Single responsibility: components render; domain services decide.",
        "Dependency inversion: application ports own external contracts.",
        "Open/closed adapters: Replay and Gemini implement the same provider port.",
        "Interface segregation: audit, incident, provider, clock, and ID ports remain focused.",
        "Typed validation and strict TypeScript preserve substitution safety.",
      ])}</section>`,
  },
  {
    slug: "challenge-alignment",
    eyebrow: "Evaluation evidence · Problem alignment",
    title: "Nothing in the brief is implicit.",
    summary:
      "Every FIFA World Cup 2026 smart-stadium requirement maps to a feature and measurable outcome.",
    body:
      cards([
        [
          "Challenge coverage",
          "17 / 17 terms mapped",
          "Every direct requirement has visible implementation evidence",
        ],
      ]) +
      table(
        ["Challenge requirement", "Implemented feature", "Expected impact"],
        alignmentRows,
      ),
  },
  {
    slug: "security",
    eyebrow: "Evaluation evidence · Security",
    title: "The model proposes. It never commands.",
    summary:
      "Generated output remains untrusted until schema, evidence, safety, accessibility, and human approval checks pass.",
    body:
      cards([
        [
          "Dependency audit",
          `${report.security.vulnerabilities.total} advisories`,
          "High and critical findings block quality",
        ],
        [
          "Provider boundary",
          "Server-side secret",
          "No Gemini key enters the browser bundle",
        ],
        [
          "Input boundary",
          "32 KiB + Zod",
          "Bounded request and response schemas",
        ],
        ["Human authority", "Approval required", "No autonomous venue control"],
      ]) +
      `<section><h2>Production security headers</h2>${list(securityControls)}</section>`,
  },
  {
    slug: "testing",
    eyebrow: "Evaluation evidence · Testing",
    title: "Test the decision, not the screenshot.",
    summary:
      "Domain invariants, application ports, UI behavior, accessibility, security boundaries, routes, mobile layout, and performance are verified.",
    body: cards([
      [
        "Total tests",
        report.tests.total,
        `${report.tests.passed} passing · ${report.tests.failed} failing`,
      ],
      [
        "Vitest",
        report.tests.vitest.total,
        `${report.tests.vitest.files} files`,
      ],
      [
        "Playwright",
        report.tests.playwright.total,
        "Replay, keyboard, mobile, navigation, API and SEO surfaces",
      ],
      [
        "Branch coverage",
        `${report.coverage.branches}%`,
        "Safety and failure branches included",
      ],
    ]),
  },
  {
    slug: "accessibility",
    eyebrow: "Evaluation evidence · Accessibility",
    title: "Accessibility is a UI standard—and an operational veto.",
    summary:
      "Resolve 90 targets WCAG 2.2 AA while preventing plans that violate protected step-free capacity.",
    body:
      cards([
        [
          "Lighthouse accessibility",
          `${report.accessibility.lighthouseScore}/100`,
          "Production-style local audit",
        ],
        [
          "Automated checks",
          report.accessibility.automatedChecks,
          "axe, contrast, keyboard and semantic checks",
        ],
        ["Operational floor", "≥ 90%", "Accessibility can veto an AI plan"],
      ]) +
      `<section><h2>WCAG evidence</h2>${list(accessibilityChecks)}</section>`,
  },
];

function document(page) {
  const canonical = `${siteUrl}/${page.slug}`;
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="description" content="${escapeHtml(page.summary)}" />
<link rel="canonical" href="${canonical}" />
<link rel="stylesheet" href="/evidence-static.css" />
<title>${escapeHtml(page.title)} — Resolve 90</title></head><body>
<a class="static-skip" href="#main">Skip to main content</a>
<header><a class="static-brand" href="/">Resolve 90</a><nav aria-label="Evidence navigation">
<a href="/quality">Quality</a><a href="/architecture">Architecture</a><a href="/challenge-alignment">Alignment</a>
<a href="/security">Security</a><a href="/testing">Testing</a><a href="/accessibility">Accessibility</a></nav></header>
<main id="main"><p class="static-eyebrow">${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.title)}</h1>
<p class="static-summary">${escapeHtml(page.summary)}</p>${page.body}
<aside><strong>Evidence integrity:</strong> Replay data is synthetic, impact is modeled, and FIFA affiliation is not claimed.</aside></main>
<footer>Resolve 90 · AI Stadium Incident Command · Generated ${escapeHtml(report.generatedAt)}</footer>
</body></html>`;
}

await mkdir(new URL("public/", root), { recursive: true });
await Promise.all(
  pages.map(async (page) => {
    const html = await format(document(page), { parser: "html" });
    await writeFile(new URL(`public/${page.slug}.html`, root), html);
  }),
);
console.log(`Generated ${pages.length} static evaluator evidence pages.`);
