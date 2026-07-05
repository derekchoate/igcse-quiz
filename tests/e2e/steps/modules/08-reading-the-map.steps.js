// Module 8 — bespoke steps for the shape matcher, the click-to-step flowchart
// walk, and the dropdown repair shop.
const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { When, Then } = createBdd();

// d1 — name a shape by clicking its correct job label (1-based shape number)
When("I give shape {int} the job {string}", async ({ page }, index, job) => {
  await page
    .locator("#shapeList1 .shape-item")
    .nth(index - 1)
    .getByRole("button", { name: job, exact: true })
    .click();
});

// d2 / d3 / d5 — step the glowing token by clicking the diagram; extra clicks
// after Stop are safe (handler early-returns when finished).
When("I step the token {int} times in {string}", async ({ page }, times, mount) => {
  const btn = page.locator(`#${mount} .fc-svg-wrap`);
  for (let i = 0; i < times; i++) await btn.click();
});

Then("the walk {string} has reached Stop", async ({ page }, mount) => {
  await expect(page.locator(`#${mount} .fc-svg-wrap`)).toHaveClass(/\bdone\b/);
  await expect(page.locator(`#${mount} .fc-hint`)).toContainText("Reached Stop");
});

Then("the input row in {string} is showing", async ({ page }, mount) => {
  await expect(page.locator(`#${mount} .fc-inputs`)).toBeVisible();
});

When("I feed {int} into {string}", async ({ page }, value, mount) => {
  await page
    .locator(`#${mount} .fc-in-btn`)
    .filter({ hasText: new RegExp(`^${value}$`) })
    .click();
});

// d4 — the repair shop's two <select> pickers (1-based slot number)
When("I fit piece {string} into repair slot {int}", async ({ page }, value, slot) => {
  await page.locator("#repair4 .repair-slot select").nth(slot - 1).selectOption(value);
});

Then("{int} repair slots in {string} are snapped", async ({ page }, n, id) => {
  await expect(page.locator(`#${id} .repair-slot.snapped`)).toHaveCount(n);
});
