# Catalogue amendments — proposed new blueprints (DRAFT, interim)

**Status: interim.** The Maths section below (numbered 1–14) has been superseded by the owner's adjudication in `audit/catalogue-amendments-adjudicated.md` — read that file for the current state of the maths catalogue, not this one. The English section (added below, unadjudicated) reflects the English (0500) audit — 85/86 papers, 973 rows, committed. It's ready for owner review the same way the maths interim file was. CS (0478) has not been audited yet.

Per `blueprint-architecture.md` Part 5, canonical catalogues are **tutor/build-facing and Claude-Code-facing only** — never rendered to the learner as a list. These are proposals for the owner's review; nothing here has been added to `blueprint-architecture.md` or any course plan. Each entry follows the architecture document's blueprint shape (name · gaps · rule sentence · tells · mint-moment) plus a frequency/mark-weight justification from the audit data.

**Why so many, and why now:** of 3635 maths rows, ~74% (2681 rows, 4396 of 6448 marks) don't map to any existing catalogue entry. That's not a defect in the audit — `blueprint-architecture.md`'s Maths section was scoped around the two arithmetic flagships (THE SUM/THE PRODUCT) plus geometry/rate formulas and a handful of process blueprints. Core Paper 1/3 draws heavily on topic families — algebra manipulation, sequences, sets, vectors, data handling, constructions, numeric procedures — that the catalogue simply hasn't been extended to cover yet. Below are the fourteen clearest ones, ranked by mark-weight (most exam-marks-worth first), plus notes on a residual slice that resists clean clustering.

---

## 1. THE RECIPE (algebra manipulation: factorise / expand / solve / rearrange / indices)
**Frequency:** 378 rows, 695 marks — 15.8% of all gap marks, the single largest gap cluster.
**Gaps:** starting form · target form · the legal move that gets you there (expand, factorise, collect, rearrange, apply an index law).
**Rule sentence:** "an expression is a recipe — you can change its shape (expand it, factor it, isolate a letter) without changing what it's worth."
**Tells:** "factorise," "expand and simplify," "make ⟨letter⟩ the subject," "simplify," any index-law equation solved for an unknown power.
**Suggested mint-moment:** A1–A3 (Letters Are Boxes / Tidying the Tiles / Brackets Are Rectangles) for expand/factorise/collect; A9 (Indices, Tamed) for the index-law variant; A5 (The Balance) for rearranging/solving. Likely needs to be minted in pieces across A1–A5 and A9 rather than as one blueprint — the gap-cluster analysis can't tell whether the syllabus treats these as one skill or several; flagging for the owner's judgement rather than forcing a single mint-moment.
**Mandatory stress test candidate:** a rearrange where the target letter appears twice (e.g. `A = P(1 + rt)` for `r`) — breaks a "just move it to the other side" shortcut.

## 2. THE COUNT LIST (factors, multiples, HCF/LCM, primes)
**Frequency:** part of the "algebra manipulation"-adjacent residue; isolated separately during a closer pass — roughly 50 rows across the maths corpus (list factors/multiples, HCF, LCM, prime identification).
**Gaps:** the number · the property being tested (factor/multiple/prime/square/cube) · the listing or comparison method.
**Rule sentence:** "break the number into its building blocks (prime factors), then read off whatever the question wants — a factor, a multiple, the biggest shared block (HCF), or the smallest shared multiple (LCM)."
**Tells:** "factors of," "multiples of," "prime factorisation," "HCF," "LCM," "write as a product of prime factors."
**Suggested mint-moment:** N1 (The Number Line Is Home) or a new early N-strand exhibit — this is foundational vocabulary the current module map doesn't obviously name; flagging rather than guessing which module owns it.

## 3. THE CLOCK & THE RULER (unit and time conversion)
**Frequency:** ~30+ rows in the residue (hours/minutes/days, km/m, litres/cm³, 12hr↔24hr, time-zone arithmetic, clock addition).
**Gaps:** the given unit · the target unit · the conversion factor (or, for time, the non-decimal 60/24 structure that trips up naive division).
**Rule sentence:** "convert by the ladder — multiply going to a smaller unit, divide going to a bigger one; time's ladder is 60s/60m/24h, not 100s like everything else."
**Tells:** "convert," "change ... into," "how many minutes/hours," any question mixing a decimal-metric quantity with a time quantity in the same calculation.
**Suggested mint-moment:** N11 (The Fog of Measurement) for metric conversions; N12 (Money, Time & Speed) for time-specific conversions — N12 is also G-adjacent to N12's existing speed-distance-time blueprint, so the mint could piggyback on that module.
**Mandatory stress test candidate:** a mixed-unit problem (e.g. "3.5 hours in minutes, then add 45 minutes, express as hours and minutes") — breaks naive decimal-time confusion (3.5 hours ≠ 3 hours 50 minutes).

## 4. STANDALONE NUMERIC PROCEDURES (standard form / rounding / bounds / sig figs / reciprocals)
**Frequency:** 315 rows, 464 marks (10.6% of gap marks) via keyword cluster, plus further residue overlap (roots, order of operations, bracket-insertion puzzles) — likely 400+ rows total once merged with cluster 2's overlap.
**Gaps:** the raw value · the required form or precision (standard form, N significant figures, N decimal places, bounds of accuracy) · the procedure.
**Rule sentence:** "every number has many correct-looking dresses (standard form, rounded, bounded) — the question tells you which dress it wants, and accuracy questions want the dress that's honest about how sure you are."
**Tells:** "correct to," "standard form," "significant figures," "upper/lower bound," "reciprocal," a bracket-insertion or order-of-operations puzzle.
**Suggested mint-moment:** N6 (One Number, Three Costumes) is the natural home for representation-conversion (standard form, fraction/decimal/percentage); bounds specifically may want its own moment inside N11 (Fog of Measurement), which already deals with the honesty-of-precision idea.

## 5. THE MOVING SHAPE (transformations: rotate / reflect / translate / enlarge)
**Frequency:** 150 rows, 332 marks (7.6% of gap marks).
**Gaps:** the shape · the transformation type · its defining data (centre + angle for rotation, line for reflection, vector for translation, centre + scale factor for enlargement).
**Rule sentence:** "every transformation is the shape plus one piece of data that tells you exactly how it moved — name the type, then find that one piece."
**Tells:** "describe fully the single transformation," "rotate," "reflect in the line," "translate by the vector," "enlarge by scale factor."
**Suggested mint-moment:** G16 (The Shape Movers) — direct match, no ambiguity.
**Mandatory stress test candidate:** "describe fully" a transformation that could be misdescribed as two steps (e.g. a rotation that looks like a reflection+translation) — tests whether the tells correctly discriminate single transformations.

## 5b. DATA HANDLING BEYOND THE LEVELLING MACHINE (mode/median/range/charts/scatter)
**Frequency:** 218 rows, 325 marks (7.4% of gap marks).
**Gaps:** the raw data (list, table, stem-and-leaf, chart) · the statistic or reading required (mode, median, range, correlation type, best-fit estimate).
**Rule sentence:** "the Levelling Machine (mean) is only one of four questions data can answer — what's most common (mode), what's in the middle (median), how spread out (range), and how two things move together (correlation)."
**Tells:** "mode," "median," "range," stem-and-leaf construction/reading, scatter diagram + "correlation," "line of best fit."
**Suggested mint-moment:** D1 (Making Data Visible) for construction/reading (stem-and-leaf, tables, charts); D3 (Charts That Persuade) for scatter/correlation specifically — D2 (currently just mean) is the natural sibling but scoped narrowly per the existing catalogue entry.

## 6. ANGLE CHASING (parallel lines, polygons, interior/exterior angles)
**Frequency:** 182 rows, 315 marks (7.2% of gap marks).
**Gaps:** the diagram's given angles · the angle rule that connects them (angles on a line, at a point, in a triangle, co-interior/alternate/corresponding on parallels, polygon interior-angle sum) · the target angle.
**Rule sentence:** "every unlabelled angle is one rule-application away from a labelled one — name which rule (straight line = 180°, point = 360°, triangle = 180°, parallels = equal or supplementary pairs, polygon = (n−2)×180°) connects them."
**Tells:** "find the value of x" on a diagram with parallel-line hatching or a polygon, "give a reason," "interior angle of a regular polygon."
**Suggested mint-moment:** G2 (Angle Laws, Discovered) for the core rules; G4 (The Polygon Walk) for the interior/exterior-angle-sum extension.

## 7. THE MEASURING KIT (constructions & measurement: protractor/ruler/compass/nets/bearings/scale drawing)
**Frequency:** 178 rows, 313 marks (7.1% of gap marks).
**Gaps:** the real-world or diagram quantity · the apparatus (protractor, ruler, compasses) or convention (bearings are 3-digit, clockwise from North; scale drawings have a stated ratio) · the reading or construction.
**Rule sentence:** "apparatus questions are conventions, not maths — know what the tool measures and what the convention means, and the arithmetic underneath is usually simple."
**Tells:** "measure," "construct," "using ruler and compasses," a bearing (stated or requested as a 3-digit angle from North), a stated map/drawing scale.
**Suggested mint-moment:** G13 (Compass & Straightedge) for constructions; G12 (Finding Your Bearings) — already named for exactly this — for bearings and scale drawing.

## 8. GRAPHS AS PICTURES OF EQUATIONS (table of values / curve sketching / graphical solving)
**Frequency:** 144 rows, 278 marks (6.3% of gap marks).
**Gaps:** the equation (linear or quadratic) · the table of values or plotted curve · what's being read off it (a root, an intersection, a gradient, an equation of the line).
**Rule sentence:** "a graph is an equation's picture — every point on it is a coordinate pair that makes the equation true, so reading the graph IS solving the equation, just by eye instead of algebra."
**Tells:** "complete the table," "draw the graph of," "use your graph to solve," "write down the equation of the line."
**Suggested mint-moment:** A10 (Journeys on Paper) for reading/interpreting; A11 (The Straight Line's Recipe) for the linear-equation-from-graph direction specifically.

## 9. THE GROWING PATTERN (sequences: term-to-term and nth term)
**Frequency:** 132 rows, 216 marks (4.9% of gap marks).
**Gaps:** the pattern (numeric or pictorial) · the step rule (term-to-term) or the direct formula (nth term) · the requested term or position.
**Rule sentence:** "every repeating pattern has two descriptions — a step rule (what to do to get the next one) and a position rule (a formula that jumps straight to term number n) — and the position rule is built from the step size."
**Tells:** "next two terms," "term-to-term rule," "find the nth term," a growing-dot/tile pictorial pattern.
**Suggested mint-moment:** A7 (Pattern Machines) — direct match.

## 10. THE TWO-SET SORT (sets & Venn diagrams)
**Frequency:** 127 rows, 179 marks (4.1% of gap marks).
**Gaps:** the universal set and its members · the two (or more) defining properties · the regions of the Venn diagram they carve out.
**Rule sentence:** "a Venn diagram is a sorting hoop for two questions at once — every element lands in exactly one region depending on which questions it answers yes to."
**Tells:** Venn diagram notation (∩, ∪, ξ, ∅), "shade the region," "complete the Venn diagram," "n(A∩B)."
**Suggested mint-moment:** N13 (Sorting Hoops) — the module's own name is already the rule sentence's metaphor; direct match.

## 11. ARROWS THAT MOVE THINGS (vectors)
**Frequency:** 58 rows, 77 marks (1.8% of gap marks) — low frequency but structurally distinct, zero catalogue presence.
**Gaps:** the start and end points (or given vectors) · the operation (add, subtract, scale) · the resultant vector or its geometric meaning.
**Rule sentence:** "a vector is a journey, not a place — add journeys by doing one after the other, and scaling a journey just makes it longer or shorter without changing its direction."
**Tells:** column-vector notation, "the vector from A to B," arrow diagrams between labelled points.
**Suggested mint-moment:** G17 (Arrows That Add) — direct match, module name already states the rule.

## 12. SAME SHAPE, SCALED OR TWINNED (similar shapes & congruence)
**Frequency:** 36 rows, 61 marks — low frequency, but a recognisable recurring pattern distinct from the formula blueprints.
**Gaps:** the two shapes · whether they're congruent (identical) or similar (scaled) · the scale factor or the matching-side/angle correspondence.
**Rule sentence:** "congruent shapes are the same shape AND size; similar shapes are the same shape at a different size — find the scale factor by comparing one matching pair of sides."
**Tells:** "similar triangles," "congruent," "corresponding sides/angles."
**Suggested mint-moment:** G14 (Same Shape, Different Size) — direct match.

## 13. THE OTHER CIRCLE SECRETS (circle theorems / angle facts, distinct from the circumference-area pair)
**Frequency:** 28 rows, 36 marks — low frequency but conceptually distinct from the already-catalogued G7-G8 circle pair (which is about circumference/area formulas, not angle theorems).
**Gaps:** the circle diagram (centre, chord, tangent, or inscribed angle) · the theorem that applies (angle in a semicircle, tangent-radius perpendicularity, etc.) · the target angle.
**Rule sentence:** "circles hide angle facts inside their symmetry — spot the special ingredient (a diameter, a tangent, an isosceles pair from two radii) and the matching theorem falls out."
**Tells:** "angle in a semicircle," "tangent," a diagram with a marked centre and chord.
**Suggested mint-moment:** G15 (Two Circle Secrets) — direct match, module name already implies two theorems being taught.

## 14. THE LINE'S ADDRESS (coordinate geometry: gradient / equation of a line)
**Frequency:** 24 rows, 27 marks — low frequency, but appears as a discrete skill both standalone and folded into cluster 8 (graphs).
**Gaps:** two points (or a graph) · the gradient between them · the line's equation (y = mx + c).
**Rule sentence:** "a straight line's whole identity is two numbers — how steep it is (gradient) and where it crosses the y-axis (intercept) — and you can read both off any two points on it."
**Tells:** "find the gradient," "write down the equation of the line," "y-intercept."
**Suggested mint-moment:** A11 (The Straight Line's Recipe) — direct match, likely overlaps/merges with cluster 8's mint-moment at the same module.

---

## Residual: genuine one-offs and small oddities (not proposed as blueprints yet)

A closer pass over the ~653 gap rows that didn't cluster into any of the above found real sub-patterns that got folded into the clusters above (HCF/LCM, unit conversion, standard-form-adjacent procedures), but also left roughly 150–200 rows that are either singleton question-types (e.g. "guard scheduling capacity calc," "max loaves and leftover flour," "divisibility test justification") or administrative non-questions (2 rows marked "question removed, marks awarded" — these aren't real content and should be excluded from any blueprint, not treated as a gap). These don't repeat often enough within the maths corpus alone to justify minting a blueprint — per the audit's own rule, forcing a fit here would be shoehorning. Recommend revisiting this residual list after English and CS are audited, in case a pattern that's rare in maths turns out to be a recognisable cross-subject shape (the "construct the algorithm" or "kit the scenario" style already in the CS catalogue), or after a larger maths sample makes a rare-but-real pattern visible.

## Note on verdict boundary cases

Several rows were tagged `implicit` rather than `covered` or `gap` where a listed blueprint's *logic* was present but not as a clean named instance — e.g. probability's complement rule, pie-chart-to-frequency conversions treated as a `PB-ratio-sharing` cousin, and multi-step questions where `THE SUM`/`THE PRODUCT` are folded into a longer chain. These are flagged with a `notes` field explaining the uncertainty in `question-audit.json` and are worth a second look once the owner has a chance to react to this document — some may indicate the *existing* catalogue entries need their gaps/tells broadened rather than new blueprints minted.

---

# English (0500) — proposed amendments (DRAFT, interim, unadjudicated)

85/86 papers audited (86 total minus `0500_s21_qp_11`/`ms_11`, confirmed unsourceable across 5 mirrors — see the missing-papers list in `coverage-report.md`), 973 rows. `blueprint-architecture.md`'s prediction held: English is far better covered than maths — **57.1% of rows / 67.2% of marks `covered`, 11.4%/9.1% `implicit`, only 31.4% of rows / 23.7% of marks `gap`** (2831 of 11960 marks). Four clean clusters account for 95.4% of the 306 gap rows; the residual is genuinely small this time, not a sign of under-clustering.

## E1. DESCRIPTIVE WRITING (Paper 2 Section B composition, non-narrative)
**Frequency:** 62 rows, 2480 marks — only 20.3% of gap *rows* but **87.6% of all gap marks**, by far the single biggest mark-weighted gap in the entire audit so far (bigger than any maths cluster). Each instance is a full 40-mark composition option.
**What's actually going on:** this is a catalogue omission, not a course gap. The English course plan (`english/the-first-reader-english-course-plan.md`) already has dedicated modules for exactly this — **F4 · Descriptive I: The Camera** and **F5 · Descriptive II: Atmosphere**, both explicitly "P2 composition" — but `blueprint-architecture.md`'s Part 5 English section only names F6 (story-shapes/narrative), F8 (form containers), and F9 (register dial) as blueprint sources. F4/F5 were built but never promoted into the canonical catalogue list, so every descriptive-writing question in the audit came back `gap` even though the learner has (or will have) a module that teaches exactly this. Several subagents independently flagged this same F4/F5 mismatch unprompted.
**Gaps:** the title/scenario prompt · the sensory/imagery toolkit (F4's "camera" — what's seen, framed, focused) · the mood/atmosphere control (F5 — charging the same scene two ways).
**Rule sentence:** "descriptive writing has no plot to carry it — the camera decides what the reader sees, and the atmosphere dial decides how it feels; nothing else needs to happen."
**Tells:** "describe..." (not "write a story about..."), a title or scenario with no implied event sequence, mark scheme criteria that separate "content and structure" from "style" without any narrative-arc language.
**Suggested action:** this doesn't need a *new* blueprint minted from scratch — it needs F4/F5 added to `blueprint-architecture.md`'s English catalogue entry alongside F6/F8/F9, the same kind of "broaden the existing scope" fix the maths adjudication applied to D2 (mean/median/range). Flagging as the top-priority item for owner review given the mark weight.

## E2. VOCABULARY-IN-CONTEXT BRIDGE (own-words paraphrase, both directions)
**Frequency:** 163 rows combined (81 "define/paraphrase a word or phrase in own words" + 82 "given a paraphrase, find the matching word/phrase in the text") — 53.3% of all gap rows, the most frequent pattern by far, though only 7.0% of gap marks (1–2 marks each; this is Q1's short-answer vocabulary sub-question).
**Gaps:** the text word/phrase · its meaning-in-context · the direction of travel (text→own-words, or clue→text).
**Rule sentence:** "the same bridge crossed both ways — go from the text's word to your own words, or from a paraphrase back to the text's original word; it's one skill wearing two directions."
**Tells:** "what does the word/phrase ... mean," "find a word/phrase that means the same as," any underlined or highlighted single word/short phrase in a Q1/Q2-style short-answer block.
**Suggested mint-moment:** unclear from the course plan — this doesn't map cleanly to R1 (Reading the Room, general retrieval), R2 (Inference Engine, deduction chains), or R4/R5 (Writer's Toolbox, rhetorical figures). It may be an implicit sub-skill inside R1 that was never named separately, or a genuine course-plan gap alongside the catalogue gap. Flagging the uncertainty rather than guessing — this is the one place in the English audit where I'd want the owner's read on whether the *course* already covers it under a different name.

## E3. EXPLICIT MULTI-POINT RETRIEVAL (list/identify/give N things from text)
**Frequency:** 50 rows, 81 marks (16.3% of gap rows, 2.9% of gap marks).
**Gaps:** the section of text to search · the number of points required (N) · whether own-words rephrasing is required or direct lifting is acceptable.
**Rule sentence:** "when a question asks for N things, the text has at least N separate places holding them — find each one, don't reuse a single detail twice."
**Tells:** "give/identify/list N things," "state two/three reasons," explicit N in the question stem, mark scheme awarding one mark per distinct point up to N.
**Suggested mint-moment:** R1 (Reading the Room — P1 retrieval) — strong match on the module's own stated purpose.

## E4. IMPLICIT REASONING / EXPLAIN-WHY (own-words causal explanation)
**Frequency:** 17 rows, 51 marks (5.6% of gap rows, 1.8% of gap marks).
**Gaps:** the stated effect/outcome · the cause the text implies but doesn't state outright · the inference chain connecting them.
**Rule sentence:** "when the text shows an effect but not its cause, the cause is inferred the same way R2 builds any inference: quoted clue → carrier-chart rule → conclusion — just aimed at 'why' instead of 'what it means'."
**Tells:** "explain why," "explain the reasons," any question requiring inference (not direct retrieval) about motivation or cause, phrased as reasoning rather than as a definition/paraphrase.
**Suggested mint-moment:** R2 (The Inference Engine) — the deduction-board mechanic already described in the course plan is a near-exact fit; this may already be covered by R2's blueprint and just needs the catalogue entry's tells broadened to explicitly include causal "why" questions, not only meaning-inference.

## Residual (14 rows, 4.6% of gaps, 22 marks)
Genuine one-offs: a comparison-of-two-groups question, a single-fact retrieval with no repeatable pattern, etc. Small enough this time that forcing a cluster would be shoehorning — left untouched per the same rule as the maths residual.

## Note: 2027 specimen structural change
One subagent flagged a genuinely new convention in `0500_y27_sp_1` (Paper 1, restructured for 2027): a "cloze/bold-phrase synonym-matching" question format not seen in the older Paper 1 pattern, tagged as a candidate new question-convention entry rather than folded into E2's vocabulary-bridge cluster (worth the owner's eyes specifically since the task instructions say the 2027 specimen outranks older papers wherever structures differ).
