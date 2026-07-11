import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const budget = JSON.parse(
  await readFile(new URL("./performance-budget.json", import.meta.url), "utf8"),
);
const assetDirectory = new URL("../dist/assets/", import.meta.url);
const reportDirectory = new URL("../reports/", import.meta.url);

let names;
try {
  names = await readdir(assetDirectory);
} catch {
  console.error("Performance budget requires dist/. Run npm run build first.");
  process.exit(1);
}

const assets = await Promise.all(
  names
    .filter((name) => name.endsWith(".js") || name.endsWith(".css"))
    .map(async (name) => {
      const content = await readFile(new URL(name, assetDirectory));
      return {
        name,
        type: name.endsWith(".js") ? "js" : "css",
        gzipBytes: gzipSync(content).byteLength,
      };
    }),
);

const jsAssets = assets.filter(({ type }) => type === "js");
const cssAssets = assets.filter(({ type }) => type === "css");
const total = (items) => items.reduce((sum, item) => sum + item.gzipBytes, 0);
const totalJavaScriptGzipBytes = total(jsAssets);
const totalCssGzipBytes = total(cssAssets);
const failures = [];

if (totalJavaScriptGzipBytes > budget.maximumTotalJavaScriptGzipBytes)
  failures.push("total JavaScript");
if (
  jsAssets.some(
    (asset) => asset.gzipBytes > budget.maximumSingleJavaScriptGzipBytes,
  )
)
  failures.push("single JavaScript chunk");
if (totalCssGzipBytes > budget.maximumTotalCssGzipBytes)
  failures.push("total CSS");
if (jsAssets.length > budget.maximumJavaScriptChunks)
  failures.push("JavaScript chunk count");

const report = {
  generatedAt: new Date().toISOString(),
  passed: failures.length === 0,
  failures,
  totals: {
    javascriptGzipBytes: totalJavaScriptGzipBytes,
    cssGzipBytes: totalCssGzipBytes,
    javascriptChunks: jsAssets.length,
    largestJavaScriptGzipBytes: Math.max(
      0,
      ...jsAssets.map(({ gzipBytes }) => gzipBytes),
    ),
  },
  budget,
  assets,
};
await mkdir(reportDirectory, { recursive: true });
await writeFile(
  new URL("performance.json", reportDirectory),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.table(
  assets.map(({ name, gzipBytes }) => ({
    asset: name,
    "gzip KiB": (gzipBytes / 1024).toFixed(1),
  })),
);
console.log(
  `Total JS: ${(totalJavaScriptGzipBytes / 1024).toFixed(1)} KiB gzip; CSS: ${(totalCssGzipBytes / 1024).toFixed(1)} KiB gzip; JS chunks: ${jsAssets.length}.`,
);

if (failures.length > 0) {
  console.error(`Performance budget failed: ${failures.join(", ")}.`);
  process.exit(1);
}

console.log("Performance budget passed.");
