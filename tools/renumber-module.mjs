// Part 2 of the Module 16 split: mechanically renumber one old module (17-36)
// up by 2, on a branch that has already merged its already-renumbered
// predecessor. Run from the repo root: node tools/renumber-module.mjs <oldNum>
//
// Handles, for the module being renumbered:
//   - directory rename {old}-{slug} -> {new}-{slug}
//   - meta.json: number field, slug field
//   - content.html: every in-prose "Module N" reference shifted by +2 if N
//     was in 17-36 (leaves references to Module 1-16 alone); footer "of 36"
//     -> "of 38"; reflection heading ordinal word recomputed for the new
//     number (also fixes a few pre-existing wrong-ordinal typos in the
//     original content); own "prev" nav link's href renumbered to match
//     the predecessor's new slug (predecessor must already be renamed and
//     present in the working tree)
//   - test file renamed, and its loadModule("...") argument updated
//   - the PREDECESSOR's own content.html "next" nav link replaced with a
//     real link to this module (it was a placeholder until now)
//   - computer-science/index.html: adds file:"{new-slug}.html" to the
//     existing modules[] entry for the new number (title/desc already
//     correct from Part 1)
//
// Does NOT touch: the successor's link (successor isn't merged in yet —
// stays a placeholder, exactly like every module was originally built).
// Module 36 (-> 38, the capstone) is NOT handled by this script — it has
// unique prose ("36 discoveries", "all thirty-six") that needs a manual
// pass, not a mechanical one.

import { readFileSync, writeFileSync, readdirSync, renameSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const oldNum = Number(process.argv[2]);
if (!oldNum || oldNum < 17 || oldNum > 35) {
  console.error("Usage: node tools/renumber-module.mjs <oldNum 17-35>");
  process.exit(1);
}
const newNum = oldNum + 2;

const ROOT = process.cwd();
const COURSES = path.join(ROOT, "src/courses/computer-science");
const TESTS = path.join(ROOT, "tests");

function shiftNum(n) {
  const num = Number(n);
  if (num >= 17 && num <= 36) return num + 2;
  return num;
}

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty"];
const ONES_ORD = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
const TEENS_ORD = ["tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
const TENS_ORD = ["", "", "twentieth", "thirtieth", "fortieth"];
const TENS_WORD = ["", "", "twenty", "thirty", "forty"];

function ordinalWords(n) {
  if (n < 10) return ONES_ORD[n];
  if (n < 20) return TEENS_ORD[n - 10];
  const tens = Math.floor(n / 10), ones = n % 10;
  if (ones === 0) return TENS_ORD[tens];
  return TENS_WORD[tens] + "-" + ONES_ORD[ones];
}
function article(n) {
  const w = ordinalWords(n);
  return /^[aeiou]/.test(w) ? "an" : "a";
}

function findDir(num) {
  const entries = readdirSync(COURSES);
  const match = entries.find(e => e.startsWith(num + "-"));
  if (!match) throw new Error("No directory found for module " + num);
  return match;
}

const oldDirName = findDir(oldNum);
const slug = oldDirName.slice(String(oldNum).length + 1); // strip "NN-"
const newDirName = newNum + "-" + slug;
const oldDir = path.join(COURSES, oldDirName);
const newDir = path.join(COURSES, newDirName);

console.log("Renumbering module " + oldNum + " -> " + newNum + " (" + slug + ")");

// 1. git mv the directory
execSync("git mv " + JSON.stringify(oldDir) + " " + JSON.stringify(newDir), { cwd: ROOT });

// 2. meta.json
const metaPath = path.join(newDir, "meta.json");
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
meta.number = newNum;
if (typeof meta.slug === "string") meta.slug = newNum + "-" + slug;
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");

// 3. content.html
const contentPath = path.join(newDir, "content.html");
let html = readFileSync(contentPath, "utf8");

// 3a. shift every in-prose "Module N" reference
html = html.replace(/\bModule (\d{1,2})\b/g, (m, n) => "Module " + shiftNum(n));

// 3b. footer "of 36" -> "of 38" (scoped to the footer line specifically)
html = html.replace(/Module (\d+) of 36/, "Module $1 of 38");

// 3c. reflection heading ordinal
html = html.replace(
  /Notice what just happened — (?:a|an) [\w-]+ time<\/h2>/,
  "Notice what just happened — " + article(newNum) + " " + ordinalWords(newNum) + " time</h2>"
);

// 3d. own "prev" nav link href: renumber the leading number if the
// predecessor was itself in the 17-35 shift range (predecessor dir must
// already be renamed on disk if so — this only rewrites the href string).
html = html.replace(/href="(\d{1,2})(-[a-z0-9-]+\.html)"/g, (m, n, rest) => {
  const shifted = shiftNum(n);
  return 'href="' + shifted + rest + '"';
});

writeFileSync(contentPath, html);

// 4. test file rename + fix its loadModule(...) argument
const oldTestPath = path.join(TESTS, oldDirName + ".test.js");
const newTestPath = path.join(TESTS, newDirName + ".test.js");
if (existsSync(oldTestPath)) {
  execSync("git mv " + JSON.stringify(oldTestPath) + " " + JSON.stringify(newTestPath), { cwd: ROOT });
  let testSrc = readFileSync(newTestPath, "utf8");
  testSrc = testSrc.split(oldDirName + ".html").join(newDirName + ".html");
  writeFileSync(newTestPath, testSrc);
}

// 5. predecessor's "next" nav link -> real link to this module
const predDirName = findDir(newNum - 1); // predecessor must already carry its FINAL number
const predContentPath = path.join(COURSES, predDirName, "content.html");
let predHtml = readFileSync(predContentPath, "utf8");
const title = meta.title;
const nextLinkHtml = '<a class="nav-link next" href="' + newDirName + '.html">Module ' + newNum + ' · ' + title + ' →</a>';
const placeholderRe = /<span class="nav-soft">More discoveries are still being written\.<\/span>/;
if (placeholderRe.test(predHtml)) {
  predHtml = predHtml.replace(placeholderRe, nextLinkHtml);
  writeFileSync(predContentPath, predHtml);
  console.log("Updated predecessor's next-link: " + predDirName);
} else {
  console.warn("WARNING: predecessor placeholder not found in " + predDirName + " — check its next-link manually.");
}

// 6. index.html: add file: to the existing modules[] entry
const indexPath = path.join(ROOT, "computer-science/index.html");
let indexHtml = readFileSync(indexPath, "utf8");
const entryRe = new RegExp('(\\{ n:' + newNum + ',[^}]*desc:"[^"]*")\\s*\\}');
if (entryRe.test(indexHtml)) {
  indexHtml = indexHtml.replace(entryRe, '$1, file:"' + newDirName + '.html" }');
  writeFileSync(indexPath, indexHtml);
} else {
  console.warn("WARNING: could not find/patch index.html entry for n:" + newNum);
}

console.log("Done: " + newDirName);
