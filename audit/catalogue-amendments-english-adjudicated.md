# Catalogue Amendments — Adjudicated (English 0500)
### Review of the English section of `catalogue-amendments.md` (interim), reconciled with audit v1 (`blueprint-coverage-audit-v1.md`) and re-checked against `question-audit.json`

Status: supersedes the interim English proposals (`catalogue-amendments.md`, "English (0500) — proposed amendments"). Everything below remains tutor/build-facing per the architecture's standing rule. Companion to `catalogue-amendments-adjudicated.md` (maths). CS (0478) still pending. **v1 reconciliation now complete** (the v1 doc was added to the project 2026-07-10).

## Headline (verified against the raw rows)

The interim file's numbers reproduce exactly from `question-audit.json`: 973 rows across 85/86 papers — **covered 556 (57.1%) / 8041 marks (67.2%); implicit 111 (11.4%) / 1088 marks (9.1%); gap 306 (31.4%) / 2831 marks (23.7%)**. The architecture's prediction that English would be far better covered than maths held.

But the review changes what that 31.4% *means*. **Only one of the four English "gap clusters" is a genuine catalogue gap. The other three are a verdicting inconsistency — the same short-answer Reading question types are marked `covered` (mapped to the `Q1-question-convention` blueprint) in more rows than they are marked `gap`.** By marks this barely matters (the three account for ~12% of gap marks); by rows it inflates the apparent gap badly. The v1 hand-audit independently confirms this (see reconciliation below). The true English content picture is cleaner than the interim headline implies: **the course itself has essentially no content gap** — one catalogue-listing omission (already taught) plus catalogue hygiene.

`Q1-question-convention` is the English workhorse: **261 covered/implicit rows** map to it. It is the codebook minted in module Q1 (The Dialect of Questions), and three of the four gap clusters are exactly the short-answer conventions it exists to credit.

## Decisions on the four clusters

**E1 · DESCRIPTIVE WRITING — ACCEPTED as the interim proposes (the one real item).**
62 rows, 2480 marks = **87.6% of all gap marks**, every instance a full 40-mark composition. Verified: all 62 gap rows ≥25 marks are 40-mark descriptive comps. This is a catalogue *listing* omission, not a course gap — the plan already has **F4 · Descriptive I: The Camera** and **F5 · Descriptive II: Atmosphere** (both "P2 composition"), but `blueprint-architecture.md`'s Part 5 English catalogue names only F6 (narrative), F8 (containers), F9 (register) as composition blueprint sources, so every descriptive comp came back `gap`. Fix = promote F4/F5 into the architecture's English catalogue alongside F6/F8/F9, adopting the interim's rule sentence ("descriptive writing has no plot to carry it — the camera decides what the reader sees, the atmosphere dial decides how it feels; nothing else needs to happen"). This is the exact "broaden the catalogue entry, the module already exists" move the maths adjudication applied to D2. **No new module, no course-plan gap.** Top priority by mark weight. (Note: this is a Paper 2 item, so it was outside v1's scope — v1 sampled Paper 1 only — which is why it appears here and not in v1. Not a contradiction; a genuinely new finding.)

**E2 · VOCABULARY-IN-CONTEXT — REJECTED AS A NEW GAP; RESOLVED as catalogue hygiene on `Q1-question-convention`.**
The interim flagged E2's mint-moment as "the one place I'd want the owner's read." The raw data answers it. Of ~350 vocabulary-in-context rows: **160 `gap`, but 113 `covered` under `Q1-question-convention`, 31 `covered` under `Q2-carrier-chart`, and 28 `implicit` under `Q1`.** The *identical* type ("give the own-words meaning of one bolded word", "find a word/phrase that means the same as…") is credited to the Q1 codebook in the majority of its instances and left as a gap in the rest — arbitrarily, across 85 papers and multiple subagents. This is not a missing blueprint; it is the same blueprint applied unevenly. v1 corroborates: on the 2027 specimen it marked own-words meaning ✅ (R7/R3) and only the reverse clue→text direction 🟡 ("R1's synonym bridges run the other direction; add the reverse drill"). The text→own-words direction is already a named Q1 codebook convention — proven by 113 covered rows plus v1's ✅. The reverse clue→text direction is the genuinely thinner half, the same thing the 2027 specimen introduces as a cloze/synonym-match (see below); it also appears in older papers (e.g. `0500_w22_qp_13` Q2a), where the auditor's own note called it "a candidate retrieval-type blueprint" while the sibling own-words parts of the *same question* were marked covered. **Fix:** broaden `Q1-question-convention`'s tells to enumerate both vocabulary directions explicitly (v1's own suggestions — name the own-words "rephrase" and add the reverse drill — folded in), and treat the 160 gap rows as false gaps to be reconciled to covered. Course side: this already lives in **R1**'s synonym-bridge watch-for ("the text says *furious*, the question says *angry*") and **R7**'s own-words machine — no new module.

**E3 · LIST/IDENTIFY N THINGS — REJECTED AS A NEW GAP; same resolution as E2.**
The split is even starker: of the core "list/give N" rows, **37 `gap` vs 37 `covered` under `Q1-question-convention`** — a literal coin-flip on the same question type. "List two required qualities", "give three reasons" is a Q1 short-answer retrieval convention, credited as such in exactly half its appearances. v1 marked the specimen's "list two ways / identify two reasons" ✅ R1. **Fix:** add multi-point retrieval ("give/list/identify N") to `Q1-question-convention`'s tells; reconcile the gap rows. Course home is **R1** (Reading the Room — retrieval), a direct match on the module's stated purpose. No new module.

**E4 · EXPLAIN-WHY / CAUSAL INFERENCE — REJECTED AS A NEW GAP; broaden R2 + Q1.**
Of the explain-why rows: **14 `gap` vs 19 `covered` under `Q1-question-convention`** plus several `implicit` under `R7`/`R6`. Again more covered than gap. v1 marked the specimen's "explain why scientists thought / no longer think X" ✅ R1/R2. The interim itself half-conceded this ("this may already be covered by R2… just needs the tells broadened"). Agreed: causal "why" is R2's deduction board aimed at *why* instead of *what it means*. **Fix:** broaden `R2`'s (and the Q1 codebook's) tells to name causal "explain why / give the reasons" questions explicitly; reconcile the gap rows. Course home is **R2** (The Inference Engine) — already built. No new module.

**Residual (14 rows, 22 marks) — AGREED, left untouched** per the same no-shoehorning rule as the maths residual; revisit alongside the CS audit for any cross-subject one-offs.

## Root cause (a process finding for the CS run)

The three false-gap clusters share one cause: **the skill-blueprint tier was applied unevenly in the English run.** The maths adjudication introduced skill blueprints (command + object → procedure) precisely so that direct-command questions count as covered, and the process note says English/CS runs should use the extended catalogue. Where an English subagent treated a short-answer convention (own-words meaning, list N, explain why) as covered by the Q1 codebook / skill tier, it marked `covered`; where it didn't, `gap`. Under the extended catalogue applied *consistently*, E2/E3/E4 collapse into `Q1-question-convention` + the skill tier — which is exactly where v1's hand-audit put them. **Recommendation for the CS run: pin the skill-tier reconciliation before counting gaps, and add a same-type-different-verdict consistency check** (flag any type_summary that appears both `covered` and `gap`) so the CS numbers don't need this same post-hoc correction.

## Reconciliation with audit v1 (complete — divergences named, per the standing rule)

v1 (`blueprint-coverage-audit-v1.md`) hand-audited the **2027 specimen Paper 1, complete** (its highest-value evidence) and produced English gaps numbered E1–E3. These are a **different set** from the full audit's E1–E4 — the numbering-collision hazard the maths round hit (M1–M9 vs clusters 1–14). Full mapping:

- **v1-E1 (writer's attitude) → applied to R6; full audit covered.** v1 flagged "assess the writer's attitude" (specimen 2b) as a 🔴 gap; it was built into **R6** (the "whose feelings are these?" two-sided board). Full audit: attitude rows read **8 of 14 `covered` under `R6-claim-quote-because`** (2 residual gaps are the same inconsistency). Fix took. Convergence.
- **v1-E2 (the persona response, Q4, 20 marks — v1's biggest English finding) → applied as module R10; full audit covered.** v1 flagged specimen Q4 ("You are Annie… write her responses", 🔴 gap) as needing a new module; it became **R10 · Borrowed Voices** in the current plan (v1's proposed "R9.5"). Full audit: the specimen's in-role question reads `covered` under `[R7-summary-filter, F9-register-dial]`. Fix took. Convergence — the single most important v1 English item is closed.
- **v1-E3 (writing marks inside the Reading paper) → applied as contract rule A8.** v1's framing note (5 summary + 10 Q4 writing marks are Paper 1 assets) became **A8 · Paper 1 carries writing marks** in the plan. Not a question-type gap, so it produces no audit rows; nothing to re-verify. Applied.
- **Verdict divergence, named (the one that matters):** on the *same specimen*, v1 marked own-words meaning ✅ (R7/R3), list-N ✅ (R1), and explain-why ✅ (R1/R2) — **covered**. The full run called those same types `gap` (E2/E3/E4). This is a direct v1-vs-full-run verdict divergence, and the careful hand-audit is the more reliable read: it confirms the full run's gaps there are verdicting error, not signal. The reject-as-hygiene decisions stand on both the raw cross-tabs *and* v1.
- **Net:** no v1 English item is silently absorbed, re-opened, or contradicted. All three v1 gaps were applied and the full audit confirms coverage; the full audit's one real new gap (descriptive, E1) sits in Paper 2, outside v1's Paper-1 scope, so there is no conflict. The `CLAUDE.md` reference name (`blueprint-coverage-audit-v1.md`) matches the doc as added — no filename fix needed.

## The 2027 specimen note — ACCEPTED as a small, real plan touch

A subagent flagged a genuinely new convention in `0500_y27_sp_1` (Paper 1, 2027 restructure): a cloze / bold-phrase **synonym-matching** question (rows 3(a)(i–ii), marked `gap`) not present in the older Paper 1 pattern. This is the clue→text (reverse) direction of E2 — and it is exactly v1's 🟡 "add the reverse drill" on specimen 3a. The shape also surfaces in older papers (e.g. `0500_w22_qp_13` Q2a), so it is a standing convention the 2027 cycle formalises, not a pure novelty. Per the course plan's own rule ("the Q1 codebook's convention set must include the 2027 cycle's named types verbatim"), **add the synonym-match convention to Q1's codebook** in the English plan and Production notes. The 2027 specimen outranks older papers where structures differ, so this one is worth doing explicitly rather than folding silently into E2.

## What this commits us to (English, for the next editing pass)

Catalogue (`blueprint-architecture.md`, English section — tutor/build-facing):

1. **Promote F4 + F5** into the composition blueprint list alongside F6/F8/F9, with the descriptive rule sentence. (E1)
2. **Broaden `Q1-question-convention`'s tells** to enumerate: own-words meaning [text→own-words]; find-the-matching-word [clue→text, incl. the 2027 synonym-match — v1's reverse drill]; list/give/identify N; explain-why/give-reasons (causal). (E2/E3/E4)
3. **Broaden `R2`'s tells** to name causal "explain why". (E4)
4. **Reconcile the false gaps:** ~160 (vocab) + ~37 (list-N) + ~14 (explain-why) gap rows are covered under the extended catalogue; the honest English gap is essentially E1's 62 descriptive comps (already taught in F4/F5) + 14 residual.

Course plan (`the-first-reader-english-course-plan.md`) — minimal, unlike maths:

5. **No new modules.** Homes already exist: Q1 (codebook), R1 (retrieval + synonym bridge), R2 (deduction board), R7 (own-words machine), R10 (persona response, from v1-E2), F4/F5 (descriptive). 29 modules stands.
6. **Q1 + Production notes:** add the 2027 synonym-match convention to the codebook's named-type list, verbatim to the specimen.

Net: the English course needs no structural change. This matches the architecture's "English near-clean" expectation — and is in fact cleaner than the interim's 31.4% gap figure suggested, once the false gaps are reconciled. It also confirms v1's three English amendments (attitude → R6, persona → R10, writing-marks → A8) all landed.

## Process notes carried forward to the CS (0478) audit

- Apply the skill-blueprint tier consistently *before* counting gaps.
- Run a same-type-different-verdict consistency check; name any divergence (this round's lesson, generalised).
- Keep cluster numbering distinct from v1's M/E numbering; cross-reference v1 by name.
- v1's CS section is genre-level only (not paper-verified); its one flagged item is "state/define one-markers" 🟡 (definition blueprints, minted in own words, stress-tested against mark-scheme phrasings). Expect the full CS run to be mostly clean (per the architecture's prediction) — the vocabulary/definition one-markers are the likely analogue of English's Q1-convention hygiene.
