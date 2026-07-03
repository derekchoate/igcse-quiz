// Usage: node tools/screenshot.mjs <file.html> [outfile.png] [width] [height]
// Renders a local HTML file with a real Chromium viewport (via Playwright, not
// flaky CLI flags) and saves a full-page screenshot. Defaults to a 390px-wide
// mobile viewport per the house style's "test at ~380px" rule.
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const [, , inputPath, outPathArg, widthArg, heightArg] = process.argv;
if (!inputPath) {
  console.error("Usage: node tools/screenshot.mjs <file.html> [outfile.png] [width] [height]");
  process.exit(1);
}

const absInput = path.resolve(inputPath);
if (!fs.existsSync(absInput)) {
  console.error("File not found:", absInput);
  process.exit(1);
}

const width = Number(widthArg) || 390;
const height = Number(heightArg) || 800;
const outPath = path.resolve(outPathArg || "/tmp/screenshot.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto("file://" + absInput);
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log("Saved", outPath, `(viewport ${width}x${height})`);
