// Module 2 — bespoke steps. Only the RGB colour mixer is novel; everything
// else uses the shared bulb / generic steps.
const { createBdd } = require("playwright-bdd");
const { When } = createBdd();

const CHANNEL_ROW = { red: "rowR", green: "rowG", blue: "rowB" };

// Set one label-less RGB byte board to an absolute 0–255 value by toggling only
// the bits that differ (positional weights 128…1, most significant first).
When("I set the {string} channel to {int}", async ({ page }, channel, value) => {
  const rowId = CHANNEL_ROW[channel];
  const bulbs = page.locator(`#${rowId} button.bit`);
  const count = await bulbs.count();
  for (let i = 0; i < count; i++) {
    const weight = 1 << (count - 1 - i);
    const want = (value & weight) !== 0;
    const pressed = (await bulbs.nth(i).getAttribute("aria-pressed")) === "true";
    if (pressed !== want) await bulbs.nth(i).click();
  }
});
