# The Build Pipeline — modularising the course engine

## Goal

Stop copying the ~450-line shared engine (CSS + JS) into every lesson file. Author
each lesson from **shared partials + a small unique part**, and **compile** to the
exact same self-contained single-file HTML that ships today. Source becomes DRY;
the shipped artifact is unchanged in spirit — no external runtime dependencies,
opens on a double-click, works offline.

This is course-agnostic infrastructure: Computer Science is the first consumer,
Maths (and later English) lift the **same** engine rather than re-copying it.

## The contract this preserves (and the one line it amends)

The house-style rule *"one self-contained HTML file per module, no build step, no
external JS"* is about the **shipped artifact**, not the authoring source. The
amendment: author from partials, and an **inline build** produces the self-contained
file. "No build step" becomes "no build step *to run it*" — still true. Every other
design-contract rule is untouched.

## Decisions taken

- **Engine location:** top-level `src/engine/` (course-agnostic), with
  `src/courses/{computer-science,…}/` for content. Portability is realised now.
- **First cut scope:** lesson pages only. The two `index.html` files stay
  hand-authored for now (the 2,200-line root index isn't covered by the e2e net;
  templatising it is a later, separate step).
- **Build output:** gitignored `dist/`, mirroring the current tree
  (`dist/computer-science/NN-slug.html`). CI builds and deploys `dist/`.
- **Runner interfaces:** npm scripts (`test:e2e`, committed, CI-facing) +
  `.tools/e2e.sh` (local convenience). `SITE_DIR=dist` verifies the build.

## Architecture

### The seam (from Module 1's real script)

The lesson `<script>` is one IIFE that splits cleanly:

- **Shared engine (~125 lines):** `state`, `$`/`$$`, `toast`, `sparks`,
  `awardStar`, discovery-collapse wiring, nudge wiring, `makeBoard`, `makeChips`.
- **Per-lesson (~30–120 lines):** the specific `makeBoard(...)` / `makeChips(...)`
  calls and any signature interaction.

The CSS block splits the same way: palette + layout + components are shared; only a
few lessons carry bespoke rules.

### Composition: one IIFE, no engine API

The build concatenates `engine.js` + `module.js` inside a single IIFE:

```js
(function(){ "use strict";
  /* …engine.js…  */   // $, toast, awardStar, makeBoard, makeChips as locals
  /* …module.js…  */   // calls them as in-scope locals — exactly as today
})();
```

So there is **no namespace and no API redesign** — `module.js` uses the shared
factories as locals, precisely as the current inline script does. The extraction is
mechanical; the golden-master net proves behavioural + pixel equivalence.

### The one deliberate generalisation

`awardStar` currently hardcodes `if (state.stars >= 5)` to reveal the reflection
card. In the engine this becomes `>= $$('.disc').length` — derived from the real
discovery count. For any lesson that isn't exactly 5 discoveries this is a
*correctness fix*; the behavioural tests flag immediately if a lesson's hardcoded
value had drifted from its actual count.

### Interaction-kit library (not a monolith)

The engine is **not one blob** — it is the core scaffold plus a small library of
reusable **interaction kits**, exactly as `makeBoard` / `makeChips` are already
shared factories. The e2e sweep gives evidence for which kits are real: whole
interaction engines are currently re-copied per file — Module 8 has one `makeWalk`
reused 3×, Module 3a one `makeTrader` reused 3×, and Modules 6 & 7 literally share
the same `.sort-item` / `.sort-btn` markup by copy.

A lesson's `module.js` becomes **"compose two or three kits + a little glue."** Each
kit ships a factory + its own CSS partial; the build inlines only the kits a lesson
uses (inline-all initially — it's small — tree-shake later).

| Kit | Recurs in | Course-agnostic? |
|---|---|---|
| `makeBoard` (bulb switches) | 1, 2, 3, 3a, 4 | yes |
| `makeChips` (target chips) | all | yes |
| `makeSorter` (items → buckets/columns) | 6, 7, 8 | yes |
| `makeMatcher` (two-column pairing, drag + tap) | 9, + planned | yes |
| `makeWalk` (flowchart token walk) | 8 | yes |
| `makeTrader` (place-value trading) | 3a | CS-leaning |

`makeMatcher` must implement the house matching pattern: two parallel columns,
touch-capable drag-and-drop (pointer events, document-bound), with a tap/keyboard
fallback. A shared kit enforces this identically everywhere.

**Discipline:** promote a pattern to a kit only when it **recurs (rule of two)**, not
on speculation. Kept bespoke for now (seen once): pixel grid (05), sliders (05/06),
RGB mixer (02), rename-selects (09), decomposition board (07).

### Forward kit candidates (from the 36-module map)

Reviewing the signature interactions the course plan already specifies for Modules
10–36 (which itself designs explicit reuse — "pigeonhole wall from M22" in M23, "M1
bulbs reborn" in M30/31, "M13 packets cameo" in M32) surfaces the primitives worth
designing *for*, even before their first build:

| Kit | Modules | Notes |
|---|---|---|
| `makeStepper` (step a code/cycle highlight, render state) | 10, 16, 20, 22, 23, 25, 27, 36 | **dominant** mechanic of the programming/architecture half |
| `makeWalk` (token through nodes: linear/branch/loop/relay) | 8, 11, 12, 13, 16, 32 | spatial sibling of `makeStepper` — build both on one **sequencer core** |
| `makeSorter` | 6, 7, 8, 18, 24, 34 | categorise / defensible placement |
| `makeBoard` | 1–4, 14, 30, 31 | course bookends on it (switches → logic gates) |
| `makeDials` (sliders/dials + live readout) | 5, 6, 11, 12, 17, 35 | set-a-parameter family |
| `makeMap` (node/network/layer diagram + animated flow) | 13, 19, 26, 27, 32 | |
| `makeTruthTable` (fill-as-you-go, state-matched) | 30, 31 | |
| `makeMatcher` (two-column pairing) | 9, 34 | |
| `makeWall` / tiles (index-addressed grid) | 21, 22, 23, 29 | |

**Design implication:** treat `makeStepper` + `makeWalk` as two faces of one
**sequencer core** (advance / step / run + a state-render callback); this one
decision de-risks ~12 modules. `makeSorter`, `makeMatcher`, `makeDials` plus the
sequencer cover the majority of all 36 signature interactions.

**Genuinely bespoke (do not generalise):** M15 lockboxes, M24 velvet-rope validator,
M28 compiler-vs-interpreter, M29 SQL composer, M31 wiring canvas, M33 ledger, M35 IoT
workbench, M36 expert system — one-off signatures that lean on primitives but whose
headline interaction stays unique.

### Phase 3 outcome (kits extracted)

Six kits now live in `src/engine/interactions/` and are golden-master-verified:

- **chips** — unified across all 10 modules (readout + label modes, per-call `toastFn`).
- **byte** — unified across Modules 2/3/4 (superset API).
- **walk**, **matcher**, **trader**, **cycler** — relocated from their single current user
  (M8/M9/M3a/M6) into the library, ready for Modules 10–36.

**Sorter: deliberately NOT unified.** M6 and M7's sort boards look alike but diverge
in JS (accept logic, success side-effects, exact toast wording) *and* CSS (`.sort-item`
background, `.sort-btn` sizing, M7-only `.sort-tag`); M8's shape-sorter is a different
mechanic (renders shapes, own classes, chip-integrated). A shared factory would be a
config-heavy god-object plus per-module overrides — net-negative for a 2-module dedup.
Left as-is; revisit if a genuinely clean third user appears (rule of two, done right).

**Contract note:** shared kits do not conflict with "one signature interaction per
module." *Predictability is load-bearing* and rule 12 (*"same idea, new costume"*)
**require** identical mechanics across lessons; a shared kit is the mechanism that
guarantees it. Hand-copied variants are what quietly drift (see the 6/7 sort copy).

## Source module map

**Shared — `src/engine/` (write once):**

```
src/engine/
  core.js                 state, $/$$, toast, sparks, awardStar,
                          auto-wiring of discovery collapse + nudges, reflection gate
  interactions/
    board.js  board.css   makeBoard (bulb switches)
    chips.js  chips.css    makeChips (target chips)
    sorter.js sorter.css   makeSorter (items → buckets/columns)
    matcher.js matcher.css makeMatcher (two-column pairing, drag + tap/keyboard)
    walk.js   walk.css     makeWalk (flowchart token walk)
    trader.js trader.css   makeTrader (place-value trading)
  styles/
    tokens.css            palette, radius, fonts as CSS custom properties
    base.css              header / wrap / hero / promise / nav / footer, focus, reduced-motion
  shell.html              <head> + header + .wrap scaffold with {{slots}}
```

Each interaction kit is a factory + its own CSS partial, added to the library only
when a pattern recurs. The build inlines `core.js` + the referenced kits' JS/CSS
(inline-all initially).

**Per lesson — `src/courses/computer-science/NN-slug/`:**

| File | Responsibility |
|---|---|
| `content.html` | hero, promise, discoveries markup, reflection (the bespoke body) |
| `module.js` | the discovery wiring (bottom half of today's script) |
| `module.css` | *only if* the lesson has bespoke styling (usually absent) |
| `meta.json` | title, number, prev/next nav |

## Runtime lifecycle of a built page

1. Self-contained HTML loads from `dist/` — no external deps.
2. Inlined engine runs: wires every `.disc-head` toggle and `[data-nudge]`, sets up
   the star header + reflection gate, exposes the factories.
3. Inlined `module.js` runs: instantiates this lesson's boards / chips / targets and
   its signature interaction.
4. State-matching fires stars — no submit, no failure. Unchanged.

## Build tool — `tools/build.mjs`

Dependency-free Node. Per lesson:

1. Read `src/engine/shell.html`.
2. Inline `<style>` = `tokens.css` + `base.css` + each used kit's CSS (+ `module.css` if present).
3. Inline `<script>` = `(function(){ "use strict"; <core.js> <used kits' JS> <module.js> })();`.
4. Substitute slots from `meta.json` + `content.html`.
5. Write `dist/computer-science/NN-slug.html`.

"Used kits" can start as inline-all (the whole library is small); per-lesson
kit selection (from a `meta.json` `uses: [...]` list or static analysis) is an
optional later optimisation.

Optional later `build:min` pass (esbuild for JS, Lightning CSS for CSS) for
publishing — kept separate so dev output stays readable.

## Migration plan (golden-master gated)

1. **Extract the canon.** Pull `engine.js` + `tokens/base/components.css` +
   `shell.html` from the Module 1/2 house-style canon.
2. **Prove on one.** Regenerate Module 1 from partials → `SITE_DIR=dist .tools/e2e.sh`
   must stay green: behavioural pass **and** pixel-identical to the committed baseline.
3. **Roll module-by-module.** Split each lesson into `content.html` / `module.js`
   (/`module.css`) + `meta.json`, rebuild, run that module's tests. A diff here is
   drift to reconcile, not to paper over.
4. **Wire the pipeline.** `pretest` builds `dist/`; add the Pages-from-Actions CI
   that builds and deploys `dist/`.
5. **Amend `.claude/CLAUDE.md`** house-style: shipped artifact is self-contained,
   authored from shared partials via an inline build.

Index-page generation and the `build:min` pass are explicit follow-ups, out of this
first cut.

## Open sequencing item

The build refactor needs the e2e golden-master net as its oracle, but that net lives
on `feature/e2e-baseline-harness` and isn't merged yet. Either merge that first and
branch `feature/build-pipeline` off updated `main`, or stack the build branch on the
e2e branch. Owner's call at kickoff.
