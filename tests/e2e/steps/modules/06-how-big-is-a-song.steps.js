// Module 6 — bespoke steps. Steppers, levers and readouts use the shared
// generic click / element steps; only these index/label-based bits are novel.
const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { When, Then } = createBdd();

// d1 — climb the unit ladder by exact button label (bit, byte, KiB, MiB, …)
When("I climb the ladder to {string}", async ({ page }, unit) => {
  await page
    .locator("#ladderRow1 .ladder-btn")
    .filter({ hasText: new RegExp(`^${unit}$`) })
    .click();
});

// d4 — the squeeze lever's 16-cell pixel row (1-based: pixel 1 = first cell)
When("I paint pixel {int} in the pixel row", async ({ page }, index) => {
  await page.locator("#pixelRow4 .pixel-cell").nth(index - 1).click();
});

// d5 — lossless / lossy sort (1-based file number)
When("I sort file {int} as {string}", async ({ page }, index, label) => {
  await page
    .locator("#sortList5 .sort-item")
    .nth(index - 1)
    .getByRole("button", { name: label, exact: true })
    .click();
});

Then("file {int} is solved", async ({ page }, index) => {
  await expect(page.locator("#sortList5 .sort-item").nth(index - 1)).toHaveClass(/\bsolved\b/);
});

Then("file {int} is not solved", async ({ page }, index) => {
  await expect(page.locator("#sortList5 .sort-item").nth(index - 1)).not.toHaveClass(/\bsolved\b/);
});
