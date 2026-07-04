// Shared step vocabulary for every module.
//
// Two layers live here:
//   1. Engine steps — the star/discovery/bulb/chip/nudge contract shared by the
//      Module 1/2 engine. Bulb rows come in numeric-id (#rowN) and string-id
//      (#rowA2) variants because a couple of modules name their rows.
//   2. Generic CSS-selector steps — click/type/select and element assertions
//      that take a raw CSS selector, so a module's bespoke widget can usually be
//      driven WITHOUT a module-specific step. Reach for these before writing a
//      new step; add a per-module step file only for genuinely novel mechanics.
//
// DOM contract (stable across all modules):
//   #starCount            → the "✦ N" header, N accumulates and never resets
//   section.disc#dN       → a discovery card; gains class "done" when complete
//   button.bit            → a switch; has a .bit-val weight label + aria-pressed
//   .bulb-row#rowN        → a board of bulbs
//   .total#totalN > b     → the running total for a board; gains class "matched"
//   .chip in #chipsN      → a target; gains class "hit" when reached
//   [data-nudge="nX"]     → a nudge button that reveals .nudge#nX
//   #reflect[hidden]      → the closing reflection card, revealed at the end

const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");

const { Given, When, Then } = createBdd();

// Light exactly the bulbs needed to make `target`, using positional binary
// weights (leftmost = most significant). Toggles only bulbs whose current
// aria-pressed state differs, so it works as an ABSOLUTE set even mid-scenario.
async function setRow(page, rowSelector, target) {
  const bulbs = page.locator(`${rowSelector} button.bit`);
  const count = await bulbs.count();
  for (let i = 0; i < count; i++) {
    const weight = 1 << (count - 1 - i);
    const want = (target & weight) !== 0;
    const pressed = (await bulbs.nth(i).getAttribute("aria-pressed")) === "true";
    if (pressed !== want) await bulbs.nth(i).click();
  }
}

async function flipByWeight(page, rowSelector, weight) {
  const bulb = page
    .locator(`${rowSelector} button.bit`)
    .filter({ has: page.locator(".bit-val", { hasText: new RegExp(`^${weight}$`) }) });
  await bulb.first().click();
}

// ── Navigation & progress ────────────────────────────────────────────────

Given("I open the module {string}", async ({ page }, slug) => {
  const name = String(slug).replace(/\.html$/, "");
  await page.goto(`/computer-science/${name}.html`);
});

Then("the star count is {int}", async ({ page }, n) => {
  await expect(page.locator("#starCount")).toHaveText(`✦ ${n}`);
});

// Discoveries after the first start collapsed — the learner clicks a card's
// header to open it. Real browsers won't interact with hidden content, so any
// scenario touching discovery 2+ must open it first. Idempotent.
When("I open discovery {int}", async ({ page }, n) => {
  const head = page.locator(`.disc-head[data-toggle="d${n}"]`);
  if ((await head.getAttribute("aria-expanded")) !== "true") {
    await head.click();
  }
  await expect(head).toHaveAttribute("aria-expanded", "true");
});

Then("discovery {int} is complete", async ({ page }, n) => {
  await expect(page.locator(`#d${n}`)).toHaveClass(/\bdone\b/);
});

Then("discovery {int} is not complete", async ({ page }, n) => {
  await expect(page.locator(`#d${n}`)).not.toHaveClass(/\bdone\b/);
});

Then("the reflection card is visible", async ({ page }) => {
  await expect(page.locator("#reflect")).toBeVisible();
});

// ── Bulb boards ──────────────────────────────────────────────────────────

When("I flip the bulb with weight {int} in row {int}", async ({ page }, weight, row) => {
  await flipByWeight(page, `#row${row}`, weight);
});

When("I flip the bulb with weight {int} in row {string}", async ({ page }, weight, rowId) => {
  await flipByWeight(page, `#${rowId}`, weight);
});

// Flip the Nth switch in a row (0 = most significant) — for unlabeled byte rows,
// or when a label has changed (e.g. a sign lens relabels the top bit).
When("I flip bulb number {int} in row {int}", async ({ page }, index, row) => {
  await page.locator(`#row${row} button.bit`).nth(index).click();
});

When("I set row {int} to make {int}", async ({ page }, row, target) => {
  await setRow(page, `#row${row}`, target);
});

When("I set row {string} to make {int}", async ({ page }, rowId, target) => {
  await setRow(page, `#${rowId}`, target);
});

Then("the total {string} reads {int}", async ({ page }, id, n) => {
  // Value usually lives in a child <b>; fall back to the element itself.
  const inner = page.locator(`#${id} b`);
  const target = (await inner.count()) ? inner : page.locator(`#${id}`);
  await expect(target).toHaveText(String(n));
});

Then("the total {string} is matched", async ({ page }, id) => {
  await expect(page.locator(`#${id}`)).toHaveClass(/\bmatched\b/);
});

// ── Chips & nudges ───────────────────────────────────────────────────────

Then("{int} chips are lit in {string}", async ({ page }, n, id) => {
  await expect(page.locator(`#${id} .chip.hit`)).toHaveCount(n);
});

When("I ask for nudge {string}", async ({ page }, id) => {
  await page.locator(`[data-nudge="${id}"]`).click();
});

Then("nudge {string} is visible", async ({ page }, id) => {
  await expect(page.locator(`#${id}`)).toBeVisible();
});

// ── Generic CSS-selector steps ───────────────────────────────────────────
// The {string} argument is a raw CSS selector (e.g. "#char2" or
// "#decodeBoard .decode-row:nth-child(1) select"). Prefer these before adding a
// module-specific step.

When("I click {string}", async ({ page }, selector) => {
  await page.locator(selector).click();
});

When("I click {string} {int} times", async ({ page }, selector, n) => {
  const el = page.locator(selector);
  for (let i = 0; i < n; i++) await el.click();
});

When("I type {string} into {string}", async ({ page }, text, selector) => {
  await page.locator(selector).fill(text);
});

// Native <select> — value equals the <option value="…">.
When("I select {string} in {string}", async ({ page }, value, selector) => {
  await page.locator(selector).selectOption(value);
});

Then("the element {string} reads {string}", async ({ page }, selector, expected) => {
  await expect(page.locator(selector)).toHaveText(expected);
});

Then("the element {string} contains {string}", async ({ page }, selector, expected) => {
  await expect(page.locator(selector)).toContainText(expected);
});

Then("the element {string} is visible", async ({ page }, selector) => {
  await expect(page.locator(selector)).toBeVisible();
});

Then("the element {string} is hidden", async ({ page }, selector) => {
  await expect(page.locator(selector)).toBeHidden();
});

Then("the element {string} has the class {string}", async ({ page }, selector, cls) => {
  await expect(page.locator(selector)).toHaveClass(new RegExp(`\\b${cls}\\b`));
});

Then("the element {string} does not have the class {string}", async ({ page }, selector, cls) => {
  await expect(page.locator(selector)).not.toHaveClass(new RegExp(`\\b${cls}\\b`));
});

Then("{int} elements match {string}", async ({ page }, n, selector) => {
  await expect(page.locator(selector)).toHaveCount(n);
});

// ── Visual golden-master ─────────────────────────────────────────────────
// Captured against the current committed files before the build refactor,
// re-run against dist/ after — any style drift lights up.
Then("the module matches its visual baseline", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true });
});
