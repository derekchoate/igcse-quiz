# Persistence Layer — Implementation Spec (for a Claude Code session)

_Status: **design settled, not yet built.** Written 2026-07-11 in a Cowork session after reading the real repo (`github.com/derekchoate/igcse-quiz`, and the owner's local working copy). The owner will execute this in **Claude Code** against the real repo. This doc is self-contained: a fresh Claude Code session can build straight from it after reading `CLAUDE.md`._

The session-only progress store, built **once** as a single cross-module engine pass (not a per-module retrofit), serving three dependents: the **Constellation Revisit** (Bridge R1), the **Foundations Layer** (warm-up pools / prerequisite-weather signals), and the **blueprint library** (minted blueprints + the learner's sovereign names). localStorage is fine here — these ship as self-contained HTML files, not claude.ai artifacts.

---

## Decisions settled with the owner (do not re-litigate)

1. **Schema / versioning shape → "stable key + internal version + migrate."** One stable localStorage key `igcse_progress` holding a single JSON blob with an internal `schemaVersion` field and namespaced sections. On load, older versions migrate forward in place. This deliberately **differs** from the diagnostic suite (`index.html`), which bakes the version into the key name (`igcse_diagnostic_v2`) so a bump orphans old data — acceptable for a re-answerable quiz, **not** for stars that must never read as lost. Here a future schema change can never orphan earned progress.
2. **Export/import door → one calm door on the course hub page + silent autosave everywhere else.** Every module autosaves silently with no visible control. Export/import (the "calm optional door") lives only on `computer-science/index.html`. Rationale: autosave means progress is never lost within a browser, so export/import is only for the rare deliberate act of moving devices / making a backup — that belongs in one findable place, not repeated across 52 module pages. **Bonus:** module files gain zero new visible UI, so the Playwright visual golden-masters stay pixel-identical *by construction* on fresh load.
3. **Scope → one store now, consumers' API reserved.** Build the shared store in `src/engine/`, wire it into the star/discovery system across all built modules now, and expose documented reserved namespaces + API for the three consumers to wire in when they're built (they are currently plan-stage — only CS modules 01–10 exist as code). Branch `feature/persistence-layer`. **NB base branch:** origin `main` is behind the owner's local working copy (local branch `feature/full-blueprint-audit` has uncommitted maths-plan edits + an untracked `english/` folder). The persistence work is independent of those docs, but confirm the base with the owner before branching — likely branch off the current local tip so the branch isn't missing recent work.

## Contract-driven points — decided, not open questions (flag if you disagree)

- **Import MERGES / unions, never replaces.** The diagnostic suite's import *replaces* state. Here that would let importing an older file read as lost stars. Import must union: for every `moduleId`, union the earned-discovery sets; for reserved sections, accumulate (never delete, never lower a count). Importing an old file can only *add* stars the current store lacks.
- **No reset of stars anywhere.** The diagnostic suite has a two-tap reset (and a `confirm()` reset). **Do not mirror them.** The store exposes no clear/reset/deduct of stars. (An import that *replaces* is banned for the same reason — see above.)
- **A corrupt/absent store degrades to a clean fresh start** — never throws, never surfaces "you lost your stars." Every read is wrapped; on any failure return a fresh empty store. This matches the diagnostic suite's `loadState()` try/catch behaviour, which is the one bit of it worth copying verbatim.
- **No diagnostic or personal-learner data** is written to storage or to any repo file. Persist only progress: earned stars (as discovery ids), minted blueprints + sovereign names, revisit/warm-up pool state. No profiling, no names, no diagnostic labels.
- Autosave is **silent and invisible**; restore is silent (no toast, no sparks). Export/import is a calm optional door, never a nag. No streaks, no "come back tomorrow."

---

## The codebase as it actually is (grounding)

- **Build pipeline** (`tools/build.mjs`): each module is compiled from `src/courses/<course>/<module>/` (`meta.json` + `content.html` + `module.js` [+ `module.css`]) composed with `src/engine/` partials into a self-contained file in `dist/` (gitignored). The script section is `script = [coreJs, ...uses.map(kitJs), moduleJs].join("\n")`, inlined into `src/engine/shell.html`'s `{{SCRIPT}}`, which wraps it all in `(function(){ "use strict"; ... })();`. `meta.json` = `{ number, slug, title, uses:[...] }`. `uses` selects interaction kits; falls back to all kits.
- **Engine core** (`src/engine/core.js`, ~70 lines): `const state = { stars:0, doneDiscoveries:{} };` (session only). `awardStar(discId, message)` is the **single mutation point** — guards `if(state.doneDiscoveries[discId]) return;`, increments, updates `#starCount` text to `"✦ "+state.stars`, adds `.done` to the discovery, fires `sparks()` + `toast()`, and reveals `#reflect` when `state.stars >= $$(".disc").length`. `reduceMotion` already gates sparks.
- **Shell** (`src/engine/shell.html`): header shows `#starCount` (`✦ 0`) with caption "stars only ever go up".
- **Diagnostic suite** (`index.html`, repo root — the pattern to mirror): `LS_KEY = 'igcse_diagnostic_v2'`; `loadState()`/`saveState()` both try/catch, load defaults to a fresh object on any failure; `exportAnswers()` = `JSON.stringify(state,null,2)` → `Blob([...],{type:'application/json'})` → `<a download>` named `igcse-answers-YYYY-MM-DD_HHMM.json` → revoke; `importAnswers(file)` = `FileReader` → `JSON.parse` → shape validation → (currently replaces) → save. Copy the load/save/export/import *shape*; change import to merge and drop reset.
- **Course hub** (`computer-science/index.html`, 179 lines, hand-authored static — `build.mjs` copies it verbatim into `dist/`, it is NOT compiled from `src/`): a `modules` array rendered into `#moduleList`; a card's amber `.module-star.done` currently means "built / ready now", not progress. **Do not overload that star with progress** (predictability). The hub door and total go in additively.
- **Tests**: `jest.config.js` → `testEnvironment: "jsdom"`, `fakeTimers.enableGlobally: true`, no `setupFilesAfterEnv`. `tests/helpers/loadModule.js` does `window.eval(inlineScript)` per `beforeEach` for "fresh closure state" — but jsdom localStorage **persists across tests in a file**, so persistence would leak between tests unless cleared. Playwright: visual baselines are captured per-`{platform}` (only `-darwin` baselines are committed); `projects` split `behavioural` (grepInvert `@visual`) vs `visual`. `.tools/e2e.sh` is a gitignored dev wrapper (`--site dist` verifies the build against baselines; `--update` recaptures).

---

## Implementation plan (concrete)

### 1. `src/engine/persist.js` (new — the store)
A self-contained `const Persist = (function(){ ... })();`. Portable, subject-agnostic, no external deps. Public API:

- `Persist.doneDiscoveries(moduleId)` → `{ [discId]: true }` for hydrating a module on load.
- `Persist.recordStar(moduleId, discId)` → adds discId to that module's accumulating set and writes. Idempotent.
- Reserved consumer API (documented, namespaced): `Persist.get(section, id)` / `Persist.put(section, id, value)` where `section ∈ {revisit, warmups, blueprints}`, with accumulate-merge semantics (never delete/lower). These back the three consumers when built.
- `Persist.exportText()` → pretty JSON of the whole blob (for the hub door).
- `Persist.importText(text)` → parse + **merge/union** into the store, write; returns success boolean (never throws to the caller).

Internals: `KEY = "igcse_progress"` (never version-bumped); `SCHEMA_VERSION = 1`; `freshStore()` returns `{ schemaVersion, modules:{}, revisit:{}, warmups:{}, blueprints:{} }`; `migrate(store)` runs an append-only `MIGRATIONS[]` ladder (`v→v+1`) then backfills any missing top-level namespace from `freshStore()` (a partial/old blob never reads as loss); `read()` = try/catch → `freshStore()` on any failure; `write(store)` = try/catch swallow. Module set stored as an **array of discIds** per `moduleId` (JSON-friendly; union on merge).

### 2. `tools/build.mjs` (edit — inject the store + a module id)
- Read `persist.js` alongside `coreJs`.
- Compute `const moduleId = ` `${courseSlug}/${meta.slug}` and inject a preamble so `persist.js`/`core.js` can see it: `const preamble = 'const MODULE_ID = ' + JSON.stringify(moduleId) + ';';`.
- New script order (persist defined before core hydrates): `script = [preamble, persistJs, coreJs, ...uses.map(kitJs), moduleJs].join("\n")`. Keep everything inside the existing IIFE. No CSS change.

### 3. `src/engine/core.js` (edit — hydrate, restore, record; all silent)
- Replace the session-only init with a hydrate: `const state = { stars:0, doneDiscoveries: Persist.doneDiscoveries(MODULE_ID) }; state.stars = Object.keys(state.doneDiscoveries).length;`.
- In `awardStar`, after `state.stars++`, call `Persist.recordStar(MODULE_ID, discId)`.
- Add a **silent `restore()`** run once at startup (after handlers are wired, DOM present): set `#starCount` to `"✦ "+state.stars`; add `.done` to every already-earned `.disc`; reveal `#reflect` if `state.stars >= $$(".disc").length`. **No toast, no sparks** — invisible. Because `doneDiscoveries` is pre-populated, re-triggering a completed discovery's interaction won't re-award or re-toast (the existing guard handles it).

### 4. `computer-science/index.html` (edit — the one calm door)
Hand-authored/static, so inline a **minimal** reader/exporter/importer that speaks the same `KEY = "igcse_progress"` and JSON shape (add a comment cross-referencing `src/engine/persist.js` as the source of truth for the format; keep the hub's copy tiny — read blob, export as-is, import = union stars). UI near the footer, calm and optional, matching palette/house style (Sora headings, ink-soft body, ghost buttons, `:focus-visible` teal outline, reduced-motion safe):
- A quiet line, shown **only when total > 0**: `✦ N stars gathered so far` (warm, additive; never a 0-score/scoreboard).
- "Save a copy" (export, timestamped filename like the diagnostic) and "Bring a copy back" (file input import, `accept=".json"`, shape-validated, merge). Framing: progress saves itself on this device; take a copy only to move it or keep a backup. No nag.
- Keep the built/not-built card star exactly as-is. Per-card progress rings are **out of scope** (they belong to the Constellation Revisit consumer).

### 5. Tests (edit + add)
- New `tests/helpers/jest.setup.js`: `beforeEach(() => { try { window.localStorage.clear(); } catch(e){} });`. Wire via `jest.config.js` `setupFilesAfterEnv: ["<rootDir>/tests/helpers/jest.setup.js"]`. This keeps the existing "starts at zero stars" assertions valid now that modules hydrate from storage.
- New `tests/persistence.test.js` (the verification step): fresh load = zero; earning a star writes and a reload of the **same** moduleId restores `.done` + count + reflect silently (no toast/spark side-effects); a **corrupt** blob degrades to fresh (no throw, zero stars); **import unions** and never lowers an existing count; export → import round-trips; the persisted blob contains **no** personal/diagnostic keys (assert the shape allowlist).

### 6. Verification
- `npm run build` then `npm test` (Jest, incl. new persistence tests) — must pass in the container/local.
- e2e **behavioural** project must pass: `.tools/e2e.sh --site dist --project=behavioural` (or `SITE_DIR=dist npm run test:e2e -- --project=behavioural`).
- **Visual golden-master (pixel-identical):** this is the load-bearing check for an engine change and must be run **on the owner's Mac** (baselines are `-darwin`-only; a Linux run has no committed baseline and font rendering differs). Expectation: **zero visual diff on fresh load**, because modules gain no visible UI. As an in-container cross-check you can build `dist` before and after the change and diff each module's inlined `<style>` and `<body>` — they should be byte-identical (only the `<script>` differs) — which is a strong, honest proxy for visual invariance without darwin baselines. Owner runs `.tools/e2e.sh --site dist` locally to confirm green; do **not** `--update` baselines for this change (there should be nothing to update).
- Re-check the contract: no code path resets/expires/deducts/lowers; corrupt/absent → fresh; no personal/diagnostic data in the blob or any file; autosave + restore silent.

### 7. Workflow / housekeeping
- Per `CLAUDE.md`: create `feature/persistence-layer` before editing; if a multistep Bash process is needed, write it as a `.tools/` script and **ask** before adding permission scope.
- On completion, update `claude/session-handoff.md`: mark Persistence built, record what it settled (this doc's decisions), and **promote the next task → Exam-currency alignment** (outstanding task 2).

## Open handoff notes for the executing session
- Confirm the **base branch** with the owner (origin `main` is behind local; see Decision 3).
- The three consumers are **plan-stage**; this pass ships their reserved API + namespaces, not the consumer modules. When each is built (Constellation Revisit in `the-bridge-phase-2-plan.md`, Foundations in `foundations-diagnostic-layer.md`, blueprints in `blueprint-architecture.md`), it wires into `Persist.get/put(section, …)`.
- The store is designed **cross-subject** (keyed by `course/slug`), so maths/English modules and a future cross-subject hub reuse it unchanged. The hub door currently lives on the CS hub; duplicate the same door onto other hubs / a top-level hub when they exist.
