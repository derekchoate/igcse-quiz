// Module 9 — bespoke steps. Most interactions are plain clicks/reads (shared
// generic steps); only the translation-slider rows and the meaning↔code pairing
// need dedicated steps.
const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { When, Then } = createBdd();

// d3 part A — the revealed translation rows (0-based)
Then("row {int} of discovery 3 has been read", async ({ page }, index) => {
  await expect(page.locator("#tsList3 .ts-row").nth(index)).toHaveClass(/\bread\b/);
});

Then("row {int} of discovery 3 has not been read", async ({ page }, index) => {
  await expect(page.locator("#tsList3 .ts-row").nth(index)).not.toHaveClass(/\bread\b/);
});

// d3 part B — pair a meaning chip to a code slot (two clicks, chip then slot)
When(
  "I pair meaning {int} with code line {int} in discovery 3",
  async ({ page }, meaning, line) => {
    await page.locator(`#pairBank3 .pair-chip[data-eng="${meaning}"]`).click();
    await page.locator(`#pairCode3 .pair-slot[data-line="${line}"]`).click();
  }
);
