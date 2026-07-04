const { defineConfig } = require("@playwright/test");
const { defineBddConfig } = require("playwright-bdd");

const PORT = Number(process.env.PORT || 4321);

// Compile the Gherkin .feature files into @playwright/test specs.
const testDir = defineBddConfig({
  features: "tests/e2e/features/**/*.feature",
  steps: "tests/e2e/steps/**/*.js"
});

module.exports = defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  // Baselines live in a committed, build-independent location. {platform} keeps
  // mac-captured and CI-linux-captured screenshots from colliding — screenshot
  // goldens are rendering-sensitive, so each platform owns its own set.
  snapshotPathTemplate:
    "tests/e2e/__screenshots__/{testFileName}/{arg}-{projectName}-{platform}{ext}",

  use: {
    baseURL: `http://localhost:${PORT}`,
    // Mobile-first: the learner's likely device. House style targets ~380px.
    viewport: { width: 390, height: 844 }
  },

  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" }
  },

  projects: [
    { name: "behavioural", grepInvert: /@visual/ },
    { name: "visual", grep: /@visual/ }
  ],

  webServer: {
    command: "node tools/serve.mjs",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // SITE_DIR=. serves the current committed files (baseline capture);
    // SITE_DIR=dist will serve the built output after the refactor lands.
    env: { SITE_DIR: process.env.SITE_DIR || ".", PORT: String(PORT) }
  }
});
