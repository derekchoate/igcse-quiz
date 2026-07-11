// Module 7 — bespoke steps for stage-walking, sorting steps into I/P/O/S, the
// metro-map keep/drop sort with its free-text "name it" box, the
// decomposition board, and the free-text own-decomposition boxes.
const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { When, Then } = createBdd();

// d1 — click through all four PDLC stage buttons
When("I visit every stage in discovery {int}", async ({ page }, n) => {
  const btns = page.locator(`#d${n} .stage-btn`);
  const count = await btns.count();
  for (let i = 0; i < count; i++) await btns.nth(i).click();
});

// d2 / d3 — sort a labelled step into a category. Matches the .sort-item by a
// text fragment (robust to smart quotes) then clicks its exact-labelled button.
function sortItem(page, discovery, fragment) {
  return page.locator(`#sortList${discovery} .sort-item`).filter({ hasText: fragment });
}

When(
  "I sort the step {string} as {string} in discovery {int}",
  async ({ page }, fragment, category, discovery) => {
    await sortItem(page, discovery, fragment)
      .getByRole("button", { name: category, exact: true })
      .click();
  }
);

Then("the step {string} in discovery {int} is solved", async ({ page }, fragment, discovery) => {
  await expect(sortItem(page, discovery, fragment)).toHaveClass(/\bsolved\b/);
});

Then("the step {string} in discovery {int} is not solved", async ({ page }, fragment, discovery) => {
  await expect(sortItem(page, discovery, fragment)).not.toHaveClass(/\bsolved\b/);
});

// d4 — the metro map trick: the existing "I sort the step ... in discovery 4"
// step (below) already covers the keep/drop sort, since sortItem() builds its
// selector from the discovery number. Only the free-text "name it" moment
// that appears once the sort is finished needs its own steps.
Then("the name-it box in discovery {int} is visible", async ({ page }, discovery) => {
  await expect(page.locator("#nameIt4")).toBeVisible();
});

When("I write {string} in the name-it box for discovery {int}", async ({ page }, text, discovery) => {
  await page.locator("#ownDefinition4").fill(text);
});

// d5 — decomposition: pick a missing piece, then read the Output column
When("I choose {string} in the decomposition", async ({ page }, label) => {
  await page.locator("#decompChoices5 .decomp-choice", { hasText: label }).click();
});

Then("the Output column shows {string}", async ({ page }, text) => {
  await expect(page.locator("#decompBoard5 .decomp-col").nth(2)).toContainText(text);
});

// d6 — free-text decomposition boxes (input / process / output / storage)
When("I fill the decomposition box {string} with {string}", async ({ page }, key, text) => {
  await page.locator(`#own-${key}`).fill(text);
});
