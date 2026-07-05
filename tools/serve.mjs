// Minimal dependency-free static file server for the e2e harness.
//
// Serves the directory named by SITE_DIR (relative to repo root) on PORT.
// The whole point of the SITE_DIR indirection is the build migration:
//   - pre-refactor  SITE_DIR=.     → serves computer-science/NN-*.html in place
//   - post-refactor SITE_DIR=dist  → serves dist/computer-science/NN-*.html
// Either way the URL path (/computer-science/NN-*.html) is identical, so the
// committed visual-baseline snapshots stay valid across the refactor.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = path.resolve(repoRoot, process.env.SITE_DIR || ".");
const port = Number(process.env.PORT || 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2"
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let filePath = path.join(siteDir, urlPath);
    if (urlPath.endsWith("/")) filePath = path.join(filePath, "index.html");

    // Refuse to serve anything outside the site root.
    if (!filePath.startsWith(siteDir)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "content-type": "text/plain" }).end("Not found: " + urlPath);
        return;
      }
      res.writeHead(200, { "content-type": TYPES[path.extname(filePath)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, () => {
    console.log(`serving ${siteDir} at http://localhost:${port}`);
  });
