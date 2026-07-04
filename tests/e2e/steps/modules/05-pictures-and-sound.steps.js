// Module 5 — bespoke steps for its five custom boards (pixel grid, depth
// slider, resolution, wave sampling, word-select). Text readouts use the shared
// generic "the element … reads …" step instead.
const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { When, Then } = createBdd();

// d1 — pixel paint grid + binary mirror
When("I paint pixel {int} in the grid", async ({ page }, index) => {
  await page.locator("#pixelGrid1 .pixel-cell").nth(index).click();
});

Then("{int} pixels are lit in the binary mirror", async ({ page }, n) => {
  await expect(page.locator("#mirror1 .bit-char.on")).toHaveCount(n);
});

// d2 — colour depth
When("I set the depth slider to {int}", async ({ page }, value) => {
  await page.locator("#depthSlider2").fill(String(value));
});

When("I click swatch {int}", async ({ page }, index) => {
  await page.locator("#shadeSwatches2 .shade-swatch").nth(index).click();
});

// d3 — resolution (button label uses the × multiplication sign, U+00D7)
When("I select resolution {string}", async ({ page }, label) => {
  await page.locator("#resButtons3 .action-btn", { hasText: label }).click();
});

Then("{int} resolution cells are shown", async ({ page }, n) => {
  await expect(page.locator("#resCanvas3 .res-cell")).toHaveCount(n);
});

// d4 — wave sampling
When("I tap sample point {int}", async ({ page }, index) => {
  await page.locator(".sample-pt").nth(index).click();
});

Then("the sampled wave has {int} points", async ({ page }, n) => {
  const points = await page.locator("#sampledPoly").getAttribute("points");
  expect(points.trim().split(/\s+/).length).toBe(n);
});

// d5 — trade-off sentence (two single-select word groups)
When("I pick word {int} from group {int}", async ({ page }, word, group) => {
  await page.locator(`#group${group} .word-chip`).nth(word).click();
});

Then("blank {int} reads {string}", async ({ page }, index, expected) => {
  await expect(page.locator(`#blank${index}`)).toHaveText(expected);
});

Then("group {int} has exactly {int} selected words", async ({ page }, group, n) => {
  await expect(page.locator(`#group${group} .word-chip[aria-pressed="true"]`)).toHaveCount(n);
});
