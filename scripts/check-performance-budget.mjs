import { readFile, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const budget = JSON.parse(
  await readFile(new URL("./performance-budget.json", import.meta.url), "utf8"),
);
const assetDirectory = new URL("../dist/assets/", import.meta.url);

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
const failures = [];

if (total(jsAssets) > budget.maximumTotalJavaScriptGzipBytes)
  failures.push("total JavaScript");
if (
  jsAssets.some(
    (asset) => asset.gzipBytes > budget.maximumSingleJavaScriptGzipBytes,
  )
)
  failures.push("single JavaScript chunk");
if (total(cssAssets) > budget.maximumTotalCssGzipBytes)
  failures.push("total CSS");
if (jsAssets.length > budget.maximumJavaScriptChunks)
  failures.push("JavaScript chunk count");

console.table(
  assets.map(({ name, gzipBytes }) => ({
    asset: name,
    "gzip KiB": (gzipBytes / 1024).toFixed(1),
  })),
);
console.log(
  `Total JS: ${(total(jsAssets) / 1024).toFixed(1)} KiB gzip; CSS: ${(total(cssAssets) / 1024).toFixed(1)} KiB gzip; JS chunks: ${jsAssets.length}.`,
);

if (failures.length > 0) {
  console.error(`Performance budget failed: ${failures.join(", ")}.`);
  process.exit(1);
}

console.log("Performance budget passed.");
