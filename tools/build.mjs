// Inline build: compile each lesson from shared partials into a self-contained
// single-file HTML under dist/, mirroring the source tree. No external runtime
// dependencies in the output — the shipped artifact still opens on a double-click.
//
//   src/engine/            shared shell + styles + core.js + interaction kits
//   src/courses/<course>/<module>/  meta.json + content.html + module.js [+ module.css]
//   dist/<course>/<slug>.html        built output (gitignored)
//
// Each output inlines: <style> = tokens + base + used kits' css + module.css;
// <script> = (IIFE){ core.js + used kits' js + module.js }. "Used kits" comes
// from meta.uses (falls back to all kits). Run: node tools/build.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const engineDir = path.join(repoRoot, "src", "engine");
const interactionsDir = path.join(engineDir, "interactions");
const coursesDir = path.join(repoRoot, "src", "courses");
const distDir = path.join(repoRoot, "dist");

const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

const shell = read(path.join(engineDir, "shell.html"));
const tokensCss = read(path.join(engineDir, "styles", "tokens.css"));
const baseCss = read(path.join(engineDir, "styles", "base.css"));
const coreJs = read(path.join(engineDir, "core.js"));

const allKits = fs
  .readdirSync(interactionsDir)
  .filter((f) => f.endsWith(".js"))
  .map((f) => f.replace(/\.js$/, ""));

const kitCss = (name) => {
  const p = path.join(interactionsDir, `${name}.css`);
  return exists(p) ? read(p) : "";
};
const kitJs = (name) => read(path.join(interactionsDir, `${name}.js`));

// Replacement via a function so a "$" in content/script is never treated as a
// String.replace special ($$, $&, …) — core.js is full of `$`.
const fill = (tpl, token, value) => tpl.split(token).join(value);

function buildModule(courseSlug, moduleName) {
  const dir = path.join(coursesDir, courseSlug, moduleName);
  const meta = JSON.parse(read(path.join(dir, "meta.json")));
  const content = read(path.join(dir, "content.html"));
  const moduleJs = read(path.join(dir, "module.js"));
  const moduleCssPath = path.join(dir, "module.css");
  const moduleCss = exists(moduleCssPath) ? read(moduleCssPath) : "";

  const uses = Array.isArray(meta.uses) ? meta.uses : allKits;
  const unknown = uses.filter((k) => !allKits.includes(k));
  if (unknown.length) {
    throw new Error(`${courseSlug}/${moduleName}: unknown kit(s) ${unknown.join(", ")}`);
  }

  const styles = [tokensCss, baseCss, ...uses.map(kitCss), moduleCss]
    .filter(Boolean)
    .join("\n");
  const script = [coreJs, ...uses.map(kitJs), moduleJs].join("\n");

  let html = fill(shell, "{{TITLE}}", meta.title);
  html = fill(html, "{{STYLES}}", styles);
  html = fill(html, "{{CONTENT}}", content);
  html = fill(html, "{{SCRIPT}}", script);

  const outDir = path.join(distDir, courseSlug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${meta.slug}.html`), html);
  return meta.slug;
}

const isDir = (p) => fs.statSync(p).isDirectory();

let count = 0;
for (const courseSlug of fs.readdirSync(coursesDir)) {
  const cdir = path.join(coursesDir, courseSlug);
  if (!isDir(cdir)) continue;
  for (const moduleName of fs.readdirSync(cdir)) {
    if (!isDir(path.join(cdir, moduleName))) continue;
    const slug = buildModule(courseSlug, moduleName);
    console.log(`built ${courseSlug}/${slug}.html`);
    count++;
  }
}
// Copy hand-authored static pages into the deploy tree so dist/ is a complete
// site. The index pages are not generated from src yet (deferred in the plan).
for (const rel of ["index.html", "computer-science/index.html"]) {
  const srcPath = path.join(repoRoot, rel);
  if (exists(srcPath)) {
    const outPath = path.join(distDir, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.copyFileSync(srcPath, outPath);
    console.log(`copied ${rel}`);
  }
}

console.log(`built ${count} module(s) → dist/`);
