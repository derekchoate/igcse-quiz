const fs = require("fs");
const path = require("path");

// The built, self-contained modules (compiled from src/ by tools/build.mjs).
// `pretest` runs the build, so these exist before Jest loads them.
const MODULES_DIR = path.resolve(__dirname, "..", "..", "dist", "computer-science");

/**
 * Loads a module HTML file's real markup into the jsdom document and
 * executes its actual inline <script> unchanged, so tests exercise exactly
 * what ships — not a reimplementation. Call inside beforeEach for a fresh
 * DOM + fresh closure state per test.
 */
function loadModule(filename) {
  const html = fs.readFileSync(path.join(MODULES_DIR, filename), "utf8");

  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);
  if (!bodyMatch) throw new Error("No <body> found in " + filename);

  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) throw new Error("No inline <script> found in " + filename);

  document.body.innerHTML = bodyMatch[1];

  // jsdom doesn't implement matchMedia; every module reads it once at startup.
  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {}
    });
  }

  window.eval(scriptMatch[1]);
}

/** Click a bulb/button whose visible weight label (.bit-val) equals `value`, within `root`. */
function clickBulbByValue(root, value) {
  const labels = Array.from(root.querySelectorAll(".bit-val"));
  const label = labels.find(el => el.textContent === String(value));
  if (!label) throw new Error("No bulb labeled " + value + " found");
  label.closest("button").click();
}

/** Click the Nth bulb button (0 = most significant) in an unlabeled byte row. */
function clickBulbByIndex(root, index) {
  const buttons = root.querySelectorAll("button.bit");
  if (!buttons[index]) throw new Error("No bulb at index " + index);
  buttons[index].click();
}

function starCount() {
  return document.getElementById("starCount").textContent;
}

function hitChips(containerId) {
  return document.querySelectorAll("#" + containerId + " .chip.hit").length;
}

function isDiscoveryDone(id) {
  return document.getElementById(id).classList.contains("done");
}

function reflectVisible() {
  return document.getElementById("reflect").hidden === false;
}

module.exports = {
  loadModule,
  clickBulbByValue,
  clickBulbByIndex,
  starCount,
  hitChips,
  isDiscoveryDone,
  reflectVisible
};
