import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(resolve(root, path), "utf8");
}

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory()
      ? sourceFiles(path)
      : /\.(ts|tsx)$/.test(path)
        ? [path]
        : [];
  });
}

describe("evaluation-visible production surface", () => {
  it("publishes robots and a sitemap containing every evidence route", () => {
    const robots = read("public/robots.txt");
    const sitemap = read("public/sitemap.xml");
    const routes = [
      "/quality",
      "/architecture",
      "/security",
      "/testing",
      "/accessibility",
      "/challenge-alignment",
    ];

    expect(robots).toContain("Sitemap:");
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    for (const route of routes) expect(sitemap).toContain(route);
  });

  it("uses the exact stadium challenge vocabulary in metadata", () => {
    const metadata = read("index.html");
    const keywords = [
      "FIFA World Cup 2026",
      "stadium operations",
      "tournament experience",
      "crowd management",
      "accessible navigation",
      "transportation",
      "sustainability",
      "multilingual assistance",
      "operational intelligence",
      "real-time decision support",
      "grounded GenAI",
    ];

    for (const keyword of keywords) expect(metadata).toContain(keyword);
  });

  it("configures every required production security header", () => {
    const deployment = read("vercel.json");
    const headers = [
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Cross-Origin-Opener-Policy",
      "Cross-Origin-Resource-Policy",
      "X-DNS-Prefetch-Control",
      "X-Permitted-Cross-Domain-Policies",
    ];

    for (const header of headers) expect(deployment).toContain(header);
  });

  it("uses exact architecture-layer and SOLID vocabulary", () => {
    const architecture = read("src/presentation/pages/ArchitecturePage.tsx");
    for (const label of [
      "Domain Layer",
      "Application Layer",
      "Infrastructure Layer",
      "Presentation Layer",
      "SOLID principles",
    ]) {
      expect(architecture).toContain(label);
    }
  });

  it("keeps evaluator evidence linked directly from the hero", () => {
    const hero = read("src/presentation/components/IncidentBrief.tsx");

    expect(hero).toContain('href="/quality"');
    expect(hero).toContain('href="/architecture"');
    expect(hero).toContain('href="/challenge-alignment"');
    expect(hero).toContain("Testing evidence");
  });

  it("contains no console logging, explicit any, or unresolved markers in source", () => {
    const violations = sourceFiles(resolve(root, "src")).flatMap((file) => {
      const source = readFileSync(file, "utf8");
      const hasViolation =
        /console\.log\s*\(/.test(source) ||
        /(?:\bas\s+any\b|:\s*any\b|<any>)/.test(source) ||
        /\b(?:TODO|FIXME)\b/.test(source);
      return hasViolation ? [file] : [];
    });

    expect(violations).toEqual([]);
  });
});
