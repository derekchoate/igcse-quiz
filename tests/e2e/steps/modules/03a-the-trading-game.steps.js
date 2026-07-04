// Module 3a — bespoke steps. The trading machines are button-driven (shared
// generic click / element steps handle them); only the cup plaques need a step.
const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { Then } = createBdd();

// Assert the left-to-right cup plaque at `index` (0 = most significant).
Then("plaque {int} in {string} reads {string}", async ({ page }, index, container, expected) => {
  await expect(page.locator(`#${container} .cup-plaque`).nth(index)).toHaveText(expected);
});
