# The Rebuilder — Maths Course Plan
### Cambridge IGCSE Mathematics 0580 (Core tier, examination 2026–2027) as a derive-everything discovery series

Sibling to `secret-language-course-plan.md`. Inherits the full design contract, house style, and Phase 2 (Bridge) architecture from the Computer Science course and `CLAUDE.md`. This document adds what mathematics — and this learner's specific relationship with mathematics — requires on top.

**Verify against the official 0580 syllabus (2025–2027) before building each module**; the topic references below use its Core content codes (C1–C9).

---

## Part A — The maths contract (additions to the standing design contract)

The learner's maths aversion is deeper than his general school aversion, and his rejection of memorisation is a fixed design input, not a preference to negotiate. Every rule below follows from taking that seriously.

### A1 · Nothing is memorised. Everything is rebuilt.
Every formula in the course ships with a **derivation exhibit**: an interactive, animated visual proof of where it comes from. Formulas are treated as *souvenirs of an understanding* — the thing you're left holding after seeing why it must be true. Concretely:
- Each formula-bearing module contains its exhibit as a core discovery, not an appendix.
- Every exhibit is **scrub-controlled, never autoplay**: a slider he drags to move the proof forward and backward at his own speed, any number of times. (Autoplay removes control; control is load-bearing for this learner.)
- Every tool that later *uses* a formula carries a **Rebuild button**: tap it and the exhibit replays in 20 seconds. Forgetting is planned for and costs nothing — the design position is "you never need to remember this; you need to be able to reconstruct it, and reconstruction gets faster every time." Over months, the rebuild time falls until the formula is simply *known* — memorisation as a side effect of understanding, never as a task.
- The syllabus provides some formulas in the exam papers and expects others recalled; check the current appendix per module. Design ignores the distinction: everything is derivable, so the given/recalled line never matters to him emotionally.

### A2 · Three doors to every idea.
Every concept is approached from multiple angles, minimum two, three for cornerstone concepts:
- **SEE it** — geometric/visual: area models, number lines, shape manipulation, animation.
- **COUNT it** — numeric/pattern: tables of cases he generates, spotting the regularity himself.
- **HOLD it** — concrete/story: money, recipes, journeys, tiles he drags — the idea as a thing manipulated.
Doors are presented as genuinely optional routes ("three ways in — pick a door, or try all three"); understanding through any one door earns the star. **Doors open in sequence, not simultaneously**: one representation is made solid first, and the others then appear as invitations — representation-switching imposed too early is a known cost for both cognitive load and autistic learners' comfort, so variety is offered from a stable base, never as an opening barrage. This both respects cognitive variety and quietly teaches that maths ideas are *the same truth wearing different clothes* — itself the deepest anti-memorisation insight.

### A3 · Estimation before calculation, always.
Every computation in every module is preceded by an optional-but-normalised "roughly?" step: he drags a **range bracket** onto a number line — a range, never a point, so an estimate cannot be wrong, only wide. The exact answer then lands inside (or teaches something by landing outside). Purpose: (1) it defuses answer-fear by making him the authority on plausibility before any calculation happens; (2) it directly builds the estimation skill C1 examines; (3) it is the professional's habit, presented as such.

### A4 · Arithmetic is pattern-play, never drill.
The non-calculator Paper 1 means written and mental arithmetic are genuinely examined. The forbidden route: speed drills, times-table tests, anything timed. The route instead:
- Multiplication through the **area model** (a rectangle he builds; the answer is literally its area) — the same model that later becomes expanding brackets, so arithmetic practice is secretly algebra foundation.
- Number facts through **structure**: doubling chains, ×9 as ×10−1, complements to 100 — each a discovered trick with its own mini-exhibit, collected in a personal "toolbox" he assembles.
- Written methods shown as the area model folding itself into columns — the standard algorithm *derived*, so it can be rebuilt when rusty.
- Fluency accrues through the Constellation Revisit (Phase 2 R1) at his pace, untimed forever in practice; pace on paper is addressed only in Bridge stage X3, by his consent, years of comfort later.

### A5 · Footprints from day one.
Cambridge awards method marks for visible working. Rather than retrofitting this in Phase 2, every workspace in the maths course has a **footprints area** where intermediate steps land as a natural by-product of using the tools (dragging a bracket, splitting a rectangle, balancing a scale — each action writes its own line). The norm "the steps ARE the work" is installed invisibly, so "show your working" never arrives as an exam demand — it's just how maths has always looked to him.

### A6 · Anxiety-specific rules.
- Numbers never flash, count down, or accumulate as scores.
- No question ever asks him to "just know" a fact; every fact has a route.
- The word "maths" appears plainly (euphemism would be condescending) but module titles lead with the *wonder*, not the topic label.
- Wherever an answer is entered rather than state-matched, the response to a mismatch is the standing warm-redirect rule — and the estimation bracket from A3 usually means he already knows *roughly* what's expected, so surprises are small.
- Calculator honesty: a calculator is a legitimate professional tool, used freely in calculator-paper contexts, and the non-calculator strand is framed as "maths you can do on the back of your hand" — a capability, not a deprivation.

### A7 · Bridges from the Computer Science course.
He will arrive owning ideas that map straight onto maths — use them explicitly as warm ground:
- CS Module 10 "Boxes with Names" → algebra's letters ARE those boxes (module A1 below opens with this exact callback).
- Coordinates, logic (AND/OR), sequences/loops, MOD as remainder — each maths module notes its CS sibling where one exists.
- The pigeonhole wall, bulb aesthetics, and star system carry over unchanged: maths must *look and feel like the place where he already succeeds*.

### A8 · Example-first is a first-class door.
Research on learners with ADHD and related profiles shows explicit guidance is not a crutch but often the optimal route — unguided pattern-hunting taxes exactly the executive functions under strain. Therefore every challenge carries a **"Show me one first" button**: a fully worked example, available *before* attempting, presented with the same warmth as every other door and never framed as the lesser path. The nudge ladder gains a rung 0. Watching-then-doing is simply how learning often works; the design says so out loud.

### A9 · Conventions are stated, never inferred.
Notation, symbols, diagram meanings, and the rules of any apparatus are explicitly introduced in literal, unambiguous language before any task depends on them. Nothing in the course requires inferring an unstated convention from context. This is both an autism-informed accessibility rule and simply good mathematics teaching.

### A10 · Generalisation moments are designed, not hoped for.
Understanding acquired in one context does not automatically travel — a documented risk for autistic learners, and a risk our own consistent house style amplifies. So concepts deliberately reappear in varied surface clothing ("same idea, new costume" — announced gently, never sprung), within modules and across them. The multiplicative thread (below) is the flagship instance; every strand should contain smaller ones.

### A11 · The multiplicative thread — one idea, five costumes.
Fractions, ratios, similarity, trigonometry and gradient are the same underlying idea: multiplicative/proportional reasoning, the research-identified watershed of school maths. The course names this thread explicitly and marks it with a shared visual motif (the same stretching gesture/animation) appearing in N4, N10, G14, G11 and A11 — each appearance saying so: "this is the same idea, wearing its next costume." For a learner who distrusts memorisation, discovering that five feared topics are one understood idea is the single most anxiety-reducing move available.

### A12 · Banned procedures.
Two school staples are prohibited course-wide because the evidence condemns them and they embody memorisation-without-understanding:
- **Cross-multiplication** — proportional reasoning is built first and used always (per the WWC practice guide); the ratio table and double number line do everything cross-multiplication does, visibly.
- **Key-word tricks** for word problems ("altogether means add") — no evidence supports them and they actively fail; problems are read for *structure* (Strand W), never scanned for trigger words.
Also banned, from earlier rules but restated for completeness: rule-chants ("two minuses make a plus", Z-angles, SOHCAHTOA-as-first-encounter) — every such mnemonic may be *offered afterwards* as an optional label for something already understood, never as the route in.

---

## Part B — Tier and papers (decision, flaggable)

**Plan targets Core** (Papers 1 and 3; grades C–G available; Paper 1 is non-calculator, 1h30; Paper 3 calculator). Rationale: right-sized target for a returning learner, and tier entry can be changed up to the final entry deadline, so nothing is foreclosed — if the course lands well, Extended (Papers 2 and 4, grades A*–E) becomes a consent door like any other, with an extension plan written at that point. Extended-only topics are marked **[EXT door]** in the map where a natural extension exists, and are otherwise omitted.

---

## Part C — Course map

Four interleaved strands: **N**umber · **A**lgebra & graphs · **G**eometry, measure & space · **D**ata & chance. Suggested rhythm alternates strands; prerequisites marked per module; otherwise free order, and he's told so.

| # | Module | Strand | Syllabus |
|---|--------|--------|----------|
| N1 | The Number Line Is Home | N | C1.1, C1.3 |
| N2 | Multiplication Is Area | N | C1.4 |
| N3 | Below Zero | N | C1.4 |
| N4 | Fractions Are Pictures | N | C1.4, C1.5 |
| N5 | Fraction Arithmetic, Seen | N | C1.4 |
| N6 | One Number, Three Costumes | N | C1.5 |
| N7 | Percent Is a Picture Too | N | C1.13, C1.15 |
| N8 | Squares Are Square | N | C1.3, C1.7 |
| N9 | The Zoom Universe | N | C1.8 |
| N10 | Fair Shares & Recipes | N | C1.11, C1.12 |
| N11 | The Fog of Measurement | N | C1.9, C1.10 |
| N12 | Money, Time & Speed | N | C1.14–C1.16, C2.9 |
| N13 | Sorting Hoops | N | C1.2 |
| A1 | Letters Are Boxes | A | C2.1, C2.2 |
| A2 | Tidying the Tiles | A | C2.2 |
| A3 | Brackets Are Rectangles | A | C2.2 |
| A4 | Running the Film Backwards | A | C2.2 |
| A5 | The Balance | A | C2.5 |
| A6 | Two Truths at Once | A | C2.5 |
| A7 | Pattern Machines | A | C2.7 |
| A8 | The Shaded Line | A | C2.5 (inequalities) |
| A9 | Indices, Tamed | A | C2.4 |
| A10 | Journeys on Paper (graphs) | A | C2.10, C2.11 |
| A11 | The Straight Line's Recipe | A | C3.1–C3.6 |
| G1 | The Language of Shape | G | C4.1 |
| G2 | Angle Laws, Discovered | G | C4.6 |
| G3 | Triangles Tell the Truth | G | C4.6 |
| G4 | The Polygon Walk | G | C4.6 |
| G5 | Fencing & Filling (perimeter/area) | G | C5.1, C5.2 |
| G6 | Shear Magic (parallelogram, trapezium) | G | C5.2 |
| G7 | The Rolling Circle (π, circumference) | G | C5.3 |
| G8 | Unrolling the Circle (area) | G | C5.3 |
| G9 | Stacking & Unfolding (volume, surface area) | G | C5.4, C5.5 |
| G10 | **The Pythagoras Museum** | G | C6.2 |
| G11 | The Shadow Ratios (trig I) | G | C6.1, C6.3 |
| G12 | Finding Your Bearings (trig II) | G | C6.3, C4.4 |
| G13 | Compass & Straightedge | G | C4.2, C4.3 |
| G14 | Same Shape, Different Size | G | C4.5 |
| G15 | Two Circle Secrets | G | C4.7 |
| G16 | The Shape Movers (transformations) | G | C7.1 |
| G17 | Arrows That Add (vectors) | G | C7.2, C7.3 |
| D1 | Making Data Visible | D | C9.1–C9.3 |
| D2 | The Levelling Machine (averages) | D | C9.4 |
| D3 | Charts That Persuade | D | C9.3, C9.5 |
| D4 | Weighing Chance | D | C8.1–C8.3 |
| D5 | Chance in Combination | D | C8.4 |
| W1 | The Shape of a Story (additive schemas) | W | cross-topic |
| W2 | The Shape of a Story II (multiplicative schemas) | W | cross-topic |
| W3 | Long Stories (multi-step & mixed) | W | cross-topic |

48 modules. Strand **W** (Worded problems, schema-based) interleaves rather than sitting at the end: W1 lands after N3, W2 after N10, W3 in the final third — and every module after W1 includes at least one worded challenge sorted by shape before solving. Milestones: after N7 ("every everyday number — handled"), after G10 ("you own a 2,500-year-old theorem"), after A11 + G12 (the course's two summits), after D5 ("the whole syllabus, understood — never memorised").

---

## Part D — Module plans

Compact format — **Ref | Needs** · Hook · **Doors** (the A2 routes) · **Signature** (the build) · **Exhibit** (derivation animation, if formula-bearing) · **Watch for**.

---

**N1 · The Number Line Is Home** — C1.1, C1.3 | nothing
Hook: "One picture holds every number that exists. It's a line, and you can walk it." Doors: SEE an infinite zoomable line; HOLD position-and-distance games; COUNT patterns of odds/evens/multiples/primes lighting along it. Signature: a beautiful pannable, zoomable number line — the course's recurring home object — with "tribes" of numbers (even, odd, square, prime) as togglable constellations; prime discovered via a sieve he operates. Watch for: primes "have no pattern" frustration — frame the sieve as the pattern; zero and one's special statuses.

**N2 · Multiplication Is Area** — C1.4 | N1
Hook: "You were probably told to memorise tables. Nobody mentioned that every multiplication is secretly a rectangle." Doors: SEE the area grid; COUNT skip-pattern trails on the number line; HOLD arranging tile arrays. Signature: a rectangle builder — drag width and height, area fills with countable tiles; splitting the rectangle (e.g. 14×6 into 10×6 + 4×6) *is* the written method, and the split animates into column form. Personal toolbox begins: doubling, ×10−1, halving tricks each earned as mini-exhibits. Exhibit: long multiplication derived from rectangle splitting, scrub-controlled. **From this module onward, "=" is rendered relationally**: early modules draw every equals sign with a tiny balanced-scale icon, and the course never says "makes" — the two sides are *the same amount*, stated from the first arithmetic. (Decades of research show the operational reading of "=" — "and the answer is…" — silently wrecks algebra years later; A5's balance then arrives as an old friend, not a correction.) Watch for: tables-trauma — never present a grid to "fill in"; commutativity discovered by rotating the rectangle; "=" read as "here comes the answer".

**N3 · Below Zero** — C1.4 | N1
Hook: "The number line keeps going left. Everything you know still works there — with one famous surprise." Doors: SEE walks along the line; HOLD a thermometer/lift with floors below ground; COUNT continued patterns (5−7 just keeps the pattern going). Signature: pattern-continuation machine — sequences like 3−1, 3−2, 3−3, 3−4… where HE extends past zero and *derives* negative arithmetic; subtracting-a-negative discovered by pattern, then confirmed by the "removing cold" story. Exhibit: why minus-times-minus is plus, via pattern continuation (the honest proof at this level). Watch for: rule-recitation ("two minuses make a plus") — ban the phrase; patterns only. Models never mix within a single challenge: a problem lives wholly on the line, or wholly in temperature — the research warns that mid-problem model-switching is where negative-number confusion breeds.

**N4 · Fractions Are Pictures** — C1.4, C1.5 | N2
Hook: "Fractions are where school maths loses most people. Two reasons: nobody shows the pictures, and nobody says the most important sentence — *a fraction is one number, and it lives on the line like any other*." Doors: SEE the home number line as **co-primary** with bars — every fraction met is also *placed* on the line, per the strongest research recommendation in all of maths education (fractions as numbers with magnitude, number line central); HOLD a chocolate-slab cutter and bar models; COUNT unit-fraction atoms. Signature: the fraction lab, built on **unit-fraction atoms** — 1/4 is introduced as a *thing* (one atom), and 3/4 is simply three of them, counted like anything else; equivalence seen by finer cutting (2/3 = 4/6, animated) on bars AND as the same point on the line wearing two names. Watch for: numerator/denominator as two unrelated whole numbers (the "one number, one home on the line" framing exists to kill this); "bigger denominator = bigger fraction" — settled by placing both on the line.

**N5 · Fraction Arithmetic, Seen** — C1.4 | N4
Hook: "Adding fractions has a rule everyone memorises and no one understands. You'll never need the rule — you'll see it." Doors: SEE bar overlays; HOLD cutting-to-match; COUNT with the area model (multiplication of fractions as area of a fractional rectangle — the N2 model scales down beautifully). Signature: the common-cut machine — two bars re-cut until pieces match, then combined; division by a fraction as "how many of these fit?" (a fitting animation). Exhibit: why you need common denominators (piece-size mismatch, animated) and why dividing by ½ doubles. Watch for: adding tops-and-bottoms; "division makes smaller".

**N6 · One Number, Three Costumes** — C1.5 | N4
Hook: "½, 0.5 and 50% are the same number in three outfits. Change the outfit whenever one suits the job better." Doors: SEE all three as the same bar/line position simultaneously; COUNT the ÷ that turns a fraction decimal; HOLD money (the natural decimal). Signature: a costume switcher — one quantity displayed in all three forms at once, linked live: adjust any one, all three follow. Ordering mixed forms by dragging onto the home line. Plus the **benchmark game**: "is 7/12 closer to 0, ½ or 1?" — pure magnitude intuition, played with the A3 range brackets, no computation permitted or needed. Includes a **designed collision** for the best-documented decimal misconception: a 0.35-vs-0.4 duel he predicts *before* the zoomable line settles it — "longer is larger" and "shorter is larger" both confronted head-on rather than left to chance. Watch for: exactly those two ("longer is larger" from whole-number habits, "shorter is larger" from fraction over-correction); 0.5 vs 0.05 place-value slips; percentages capped at 100 (they aren't).

**N7 · Percent Is a Picture Too** — C1.13, C1.15 | N6
Hook: "Sales, interest, tips, tax — the adult world runs on percent. It's one picture: a bar cut into 100." Doors: SEE the 100-bar; HOLD real receipts and price tags; COUNT the ×1.2-style multiplier discovered from repeated cases. Signature: percentage-change machine — a price bar that grows/shrinks with the multiplier visible; compound interest as *repeated* growth, animated year by year so the curve emerges (and simple vs compound race each other). Exhibit: why +20% then −20% doesn't return home (bars animate the asymmetry). Watch for: percentage OF vs percentage CHANGE; the +20/−20 trap is the module's centrepiece, not a gotcha.

**N8 · Squares Are Square** — C1.3, C1.7 | N2
Hook: "Square numbers are called that because they ARE squares. Cubes are cubes. The names are literal, and that makes them rebuildable." Doors: SEE literal squares/cubes of tiles; COUNT the 1,4,9,16 pattern and its odd-number gaps (a lovely discovery); HOLD building them. Signature: square/cube builder on the tile grid; square roots as "what side makes this area?" — root as un-squaring, physically. Prepares G10 directly. Watch for: square = ×2 confusion; roots only from perfect squares (estimation bracket handles the rest).

**N9 · The Zoom Universe** — C1.8 | N8
Hook: "Distance to the sun, width of an atom: numbers too big and small for comfortable writing. There's a compact notation, and it's just the ×10 story." Doors: SEE a powers-of-ten zoom journey (cell → human → planet → galaxy); COUNT the zeros pattern; HOLD sliding a single digit along place-value columns. Signature: the zoom scrubber — one continuous zoom where the standard-form readout ticks with each power; he places real objects at their scale. Watch for: negative indices read as negative numbers; 34×10⁵ style non-standard forms.

**N10 · Fair Shares & Recipes** — C1.11, C1.12 | N4
Hook: "Sharing unfairly on purpose — that's all ratio is. And scaling a recipe without ruining it is proportion." Doors: HOLD a recipe scaler (his choice of dish) and a sharing machine (counters dealt in 3:2 rhythm); SEE double number lines and tape diagrams (the fraction bars of N4, re-costumed — say so); COUNT via the ratio table. Signature: the **ratio table as a playable instrument** (the Dutch RME tradition): a table where HE performs the moves — double a column, halve it, add two columns together — composing his own route to any value, every move leaving a footprint. It is forgiving, always rebuildable, and genuinely how strong mathematicians handle proportion; it also permanently replaces cross-multiplication (banned, A12). Language throughout is **"for every"** — "3 red *for every* 2 blue" — which research shows anchors the multiplicative relationship where colon notation alone doesn't. Best-buy comparisons (unit pricing) as a shopping mini-game with no wrong picks — just visible cost-per-unit. Watch for: ratio vs fraction (3:2 is not 3/2 of anything without care); additive instead of multiplicative scaling — the ratio table's doubling/halving moves make the multiplicative nature physical.

**N11 · The Fog of Measurement** — C1.9, C1.10 | N1
Hook: "Every measurement ever made is slightly wrong, and mathematicians are honest about it. Rounding is controlled fog." Doors: SEE the home line with a fog band around a rounded value; HOLD a ruler measuring real on-screen objects at different zoom; COUNT boundary cases. Signature: the fog machine — round any number to any precision and watch the fog band (bounds) it implies; estimation as deliberate fogging for speed, tied to the A3 bracket habit he already has. Watch for: 5-rounds-up boundary; significant figures vs decimal places; bounds "0.5 below and above" stated without the fog picture.

**N12 · Money, Time & Speed** — C1.14–C1.16, C2.9 | N7, N10
Hook: "The maths you'll use every week of your life, gathered in one room." Doors: HOLD everything — currency converter, timetable reader, journey planner; SEE speed as the slope of a live distance-time graph (seeds A10); COUNT rate tables. Signature: a journey simulator — plan a trip with fares in two currencies, timetable arithmetic (the 60-not-100 trap handled visually on a clock), and speed = distance÷time *discovered* by driving an on-screen vehicle and reading its graph. Exhibit: the speed triangle derived, not given — cover-up method as rearranging a picture. Watch for: time as decimal (1.5h = 1h30, not 1h50); exchange-rate direction.

**N13 · Sorting Hoops** — C1.2 | nothing
Hook: "Two overlapping hoops on the floor can settle arguments. Logicians use them; so will you." Doors: HOLD dragging items into hoops (Venn); SEE region shading; COUNT set sizes. Signature: a Venn playground — sort numbers/objects into two- and three-hoop diagrams; notation (∈, ∪, ∩, ξ, complement) attached to regions he taps, so symbols name places he already knows. CS callback: AND/OR from logic gates ARE intersection/union — say so. Watch for: "or" as exclusive again; empty regions read as errors.

**A1 · Letters Are Boxes** — C2.1, C2.2 | N2; CS M10 if taken
Hook: "You've met this. In the computing course a variable was a labelled box. Algebra is the same box — maths just writes the label smaller." Doors: HOLD literal boxes with unknown contents; SEE expressions as box-and-tile pictures; COUNT substitution tables. Signature: the box bench — build expressions like 3n+2 as three n-boxes and two unit tiles; substitution = dropping a number into every box at once, animated; formulas as "recipes with boxes" (perimeter of his own rectangle designs). Watch for: letter-as-object ("a = apple") — the box frame prevents it; 3n meaning 3 *of* n.

**A2 · Tidying the Tiles** — C2.2 | A1
Hook: "Algebra's first real skill is just tidying a messy table: like tiles with like." Doors: HOLD drag-tidying (n-tiles with n-tiles, units with units, n²-squares with n²-squares); SEE colour-coded tile species; COUNT before/after tile tallies (proof the tidy changed nothing). Signature: the tidying bench — untidy expressions arrive as scattered tiles; he sweeps species together; the written expression tidies itself in sync (footprints!). Watch for: 3n + 2n² "combining" (different tile shapes literally won't stack); losing signs while sweeping (negative tiles are visually distinct, red-shifted amber).

**A3 · Brackets Are Rectangles** — C2.2 | A2, N2
Hook: "Remember: multiplication is a rectangle. That was a long game. Here's the payoff: 3(n+2) is a rectangle too." Doors: SEE the area model with algebraic sides; HOLD tile-filling the rectangle; COUNT numeric checks (substitute and compare). Signature: the same rectangle builder from N2, sides now carrying letters — expanding IS reading the rectangle's regions. Single brackets at Core; the double-bracket grid is an **[EXT door]** left visibly ajar. Exhibit: expansion derived from area, scrubbed. Watch for: multiplying only the first term (the rectangle makes the omission a visible hole).

**A4 · Running the Film Backwards** — C2.2 | A3
Hook: "Factorising is expanding played in reverse — you're given the rectangle's area and asked for its sides." Doors: SEE the rectangle un-filling; HOLD arranging given tiles INTO a rectangle (common factor = the side both columns share); COUNT divisor checks. Signature: the reverse bench — tiles for 6n+9 arrive loose; he arranges them into a 3-wide rectangle and reads the factorisation off the sides. Watch for: partial factorising (a wider rectangle exists — the bench hints one is possible); factorising as a memorised procedure rather than rectangle-finding.

**A5 · The Balance** — C2.5 | A2
Hook: "An equation is a set of scales in balance. Solving is removing clutter from both pans without tipping it. That's the whole subject." Doors: SEE/HOLD an animated balance scale with boxes and tiles in the pans; COUNT verification by substitution (his solved value, dropped back in, balances — a satisfying click). Signature: the balance — every legal move (remove 3 from both pans, halve both pans) is a physical action he performs, and each action writes its own footprint line, so formal setting-out is a *transcript of things he did*, never a ritual. Negative and box-on-both-sides cases staged gently. Exhibit: why "do the same to both sides" is the only rule — the balance IS the proof. Watch for: moving terms "across the equals with a sign flip" recited as magic — the balance shows what's actually happening; solutions that aren't whole numbers causing alarm (fraction answers normalised early).

**A6 · Two Truths at Once** — C2.5 | A5, A10 helpful
Hook: "Two unknowns, two clues. Detective work with a guaranteed solution." Doors: HOLD concrete puzzles first (two coffees and a bun cost…, classic and warm); SEE the two lines crossing on a graph — the answer is a *place*; COUNT elimination as stacking the two balance scales. Signature: the double balance — two equations as two scales; adding/subtracting them is physically pouring one scale's contents onto another until a box species vanishes. Graphical door links to A10/A11. Watch for: subtracting equations with sign slips (the pour animation makes signs visible); solving for one unknown and stopping.

**A7 · Pattern Machines** — C2.7 | A1; CS loops if taken
Hook: "A sequence is a machine that makes terms. Find the machine, and you own every term it will ever make — including the millionth." Doors: SEE growing tile patterns (the nth pattern drawn, not just numbered); COUNT difference tables; HOLD building the next terms physically. Signature: pattern machines — matchstick/tile patterns where the nth-term rule is *read off the picture's structure* (each new term adds 3 sticks → 3n, plus the starting stick → +1), so nth term is never reverse-engineered from numbers alone. CS callback: this is a FOR loop's body. Watch for: term-to-term vs position-to-term confusion; n as "the number in the sequence" rather than the position.

**A8 · The Shaded Line** — C2.5 | A5, N1
Hook: "Sometimes the answer isn't a number — it's a neighbourhood." Doors: SEE home-line shading with open/closed circles; HOLD a slider proving membership (drag a test value, watch the inequality light or not); COUNT boundary tests. Signature: the neighbourhood shader — solve inequalities on the balance (identical moves), answer expressed by shading; the test-value slider makes "which side?" empirically checkable forever. Watch for: flipping the sign when multiplying by negatives (discovered via the test slider breaking, then explained — Core rarely needs it, but the discovery inoculates); open vs closed endpoints.

**A9 · Indices, Tamed** — C2.4 | N8
Hook: "Powers have three famous laws. You will not learn them. You'll notice them — and then they're yours." Doors: COUNT expanding aᵐ×aⁿ into full multiplication strings and counting (the laws fall out); SEE tile-tower stacking; HOLD a power-machine with visible internal ×a gears. Signature: the noticing bench — he expands enough cases that each law is HIS conjecture, then the bench confirms in general (string animation). Zero index discovered by pattern descent (÷a each step: a³, a², a¹, …). Exhibit: each law derived by string-counting, scrubbed. Watch for: aᵐ×aⁿ = a^(mn); treating laws as arbitrary — the entire module exists to prevent exactly this.

**A10 · Journeys on Paper** — C2.10, C2.11 | N12, A1
Hook: "A graph is a story with the words removed. You're going to read them, then write one." Doors: SEE animated journeys drawing their own distance-time graphs live; HOLD driving the vehicle himself (his throttle draws the graph — the module's joy); COUNT tables of values plotted point by point. Signature: the journey recorder — he drives, it draws; then the reverse: given a graph, he *re-enacts* the journey (state-matching: his drive must reproduce the curve's shape). Plotting y = mx+c style tables seeds A11. Watch for: graph-as-picture-of-the-road (the classic; the re-enactment mechanic confronts it head-on); speed read from height rather than slope.

**A11 · The Straight Line's Recipe** — C3.1–C3.6 | A10
Hook: "Every straight line ever drawn obeys one recipe with two ingredients: where it starts and how it climbs." Doors: SEE m and c as live sliders morphing a line; HOLD gradient as a staircase he builds under the line (rise over run, physically); COUNT tables confirming the recipe. Signature: the line lab — sliders for m and c; gradient staircases; midpoint and length of a segment via a right-angled triangle drawn under it (length waits for G10 and returns after — the map says so). Parallel lines discovered as same-m. Exhibit: why gradient = rise/run is the same everywhere on a straight line (similar staircases). Watch for: m and c swapped; negative gradient direction; reading gradient from unequal axis scales.

**G1 · The Language of Shape** — C4.1 | nothing
Hook: "Before the discoveries: the words. Geometry has a small vocabulary and every word is a picture." Doors: HOLD a shape cabinet (drag, rotate, sort by properties he toggles); SEE property highlighting (equal sides flash… gently); COUNT sides/vertices/angle tallies. Signature: the cabinet — triangles by side and angle type, quadrilateral family tree built by HIM dragging shapes into a hierarchy (a square IS a rectangle — the tree makes it visceral). Watch for: shape identity fixed by orientation (a rotated square "is a diamond"); the family tree exists to dissolve this.

**G2 · Angle Laws, Discovered** — C4.6 | G1
Hook: "Angles obey laws nobody legislated. You'll catch each law red-handed." Doors: SEE dynamic figures he drags (a line pivoting on a point — the two angles trade, sum pinned at 180°, live); HOLD tearing/folding (vertically opposite angles superimposed by rotation animation); COUNT measured cases accumulating into his own conjecture table. Signature: the law-catcher — each rule (straight line, around a point, vertically opposite, parallel-line families) is a draggable apparatus where the invariant stays lit while everything else changes; HE states the law (assembled from phrase tiles) before the tool confirms it. Alternate/corresponding angles found by sliding a transparent copy along the transversal — the *reason*, not a Z/F letter mnemonic (mnemonics are exactly the memorisation he hates; the sliding-copy IS the understanding). Watch for: mnemonic dependence; equating angle size with arm length (drag arms longer, angle unmoved — an early apparatus moment).

**G3 · Triangles Tell the Truth** — C4.6 | G2
Hook: "Every triangle that has ever existed hides the same number. Find it — then see why it can't hide anything else." Doors: HOLD corner-tearing (tear the three corners off any triangle he draws, drag them together: a straight line, every time); SEE the parallel-line proof animated (the G2 sliding-copy returns to *prove* what the tearing showed); COUNT measured triangles accumulating to 180 within measurement fog (N11 callback). Signature: the tearing table plus the proof exhibit — demonstration and proof presented as different levels of certainty, a quiet epistemology lesson. Exterior angle and isosceles facts caught with the same apparatus style. Exhibit: angle sum proved via the parallel line through the apex, scrubbed. Watch for: demonstration mistaken for proof (the module's explicit theme); isosceles angle-pairing errors.

**G4 · The Polygon Walk** — C4.6 | G3; CS loops a bonus
Hook: "Walk the fence of any field and you turn exactly one full circle by the time you're home. From that stroll, every polygon fact follows." Doors: HOLD walking a turtle around polygons (he drives; exterior angles are his turns); SEE the turns collected into a full 360° pie; COUNT interior sums built from triangle fans (any polygon sliced from one vertex into triangles — (n−2)×180 *read off the fan*). Signature: the turtle walk — programmable strolls (CS callback: this is a FOR loop with turns). Exhibit: both formulas derived — exterior from the walk, interior from the fan — scrubbed; the Rebuild button here is the archetype for the whole course. Watch for: interior/exterior mix-ups; regular-only assumptions (walk irregular fields too).

**G5 · Fencing & Filling** — C5.1, C5.2 | N2, G1
Hook: "Perimeter is fence; area is paint. Confusing them costs marks and garden budgets. After this, you can't." Doors: HOLD fencing (drag a rope around shapes) vs filling (paint tiles) as physically different acts; SEE rectangle area as the N2 model full-grown; COUNT unit tiles. Signature: the fence-and-paint yard — same shape, two tools, two numbers, felt difference. Triangle area via the module's exhibit. Exhibit: triangle = half its bounding rectangle — the rectangle draws itself around any triangle he makes, then shears/folds to show the halving; works for wonky triangles too (the important case). Watch for: perimeter/area conflation (the yard's whole purpose); triangle height ≠ slant side (drag the apex sideways: area unchanged, the exhibit shows why).

**G6 · Shear Magic** — C5.2 | G5
Hook: "A parallelogram is a rectangle that leaned over — and leaning steals no area. Watch the theft not happen." Doors: SEE the shear (slice the overhanging triangle, carry it to the other side — area conserved before his eyes); HOLD performing the slice-and-carry himself; COUNT tile counts surviving the lean. Signature: the shear table — parallelogram → rectangle by his own cut; trapezium area by the twin trick (two copies, one rotated, snap into a parallelogram — the ½(a+b)h formula *read off the picture*). Exhibit: both derivations, scrub-controlled; the trapezium twin-rotation is one of the course's most beautiful twenty seconds. Watch for: using slant sides as heights again; the ½ in the trapezium formula as arbitrary (the twin picture makes it inevitable).

**G7 · The Rolling Circle** — C5.3 | G5
Hook: "Roll any circle one full turn and measure the track. Divide by how wide the circle is. Every circle in the universe gives the same answer — a number with its own name." Doors: HOLD rolling circles of every size along a ruler (π discovered empirically as the ratio, fog-bracketed per N11); SEE the diameter laid along the circumference just-over-three times; COUNT his measured ratios converging in a table. Signature: the rolling road — C = πd as a *definition wearing a formula's clothes*, which is why it needs no memorising. Watch for: π as "3.14, a fact" rather than a ratio he has personally measured; radius/diameter doubling slips.

**G8 · Unrolling the Circle** — C5.3 | G7
Hook: "A circle's area formula looks like it fell from the sky. It didn't. A circle is secretly a triangle wearing a disguise — unroll it and see." Doors: SEE the unrolling (circle as nested rings, cut and straightened into a triangle: base = circumference, height = radius → ½ × 2πr × r = πr²); SEE alternative: sectors rearranged into a near-parallelogram (two proofs — the multiple-routes promise honoured on the course's most famous formula); COUNT tile-estimates of a circle's area converging on πr². Signature: both exhibits, scrub-controlled, plus a "which proof do you prefer?" reflection (ownership through preference). Exhibit: as above — this module IS its exhibits. Watch for: r² read as r×2; formula recalled without either picture (the Rebuild button's showcase).

**G9 · Stacking & Unfolding** — C5.4, C5.5 | G5, G8
Hook: "Volume is stacking; surface area is unwrapping. Two acts, two numbers, both watchable." Doors: HOLD filling boxes with unit cubes and unfolding solids into flat nets (drag the faces down like petals); SEE prisms as a face extruded through a length (volume = area of face × length, derived by literal stacking of slices); COUNT cube tallies and net-face areas. Signature: the stack-and-unwrap bench — cuboids, prisms, cylinders (a cylinder is a circle stacked — G8 pays off immediately); nets fold back up to prove they're the same object. Exhibit: prism volume from slice-stacking; cylinder surface as two lids plus a rolled label (the label unrolls into a rectangle of width 2πr — a small gasp, reliably). Watch for: volume/surface conflation; missing faces in nets; units (cm² vs cm³) — the tools always show the unit as part of the picture.

**G10 · The Pythagoras Museum** — C6.2 | N8, G5 — **the flagship**
Hook: "Twenty-five centuries ago someone noticed something about right-angled triangles that is still true, will always be true, and can be *seen* to be true in more than one way. Welcome to the museum. Take your time."
This module is structured as literal museum rooms, each a scrub-controlled exhibit — the multiple-angles principle at maximum:
- **Room 1 · The Claim** — a draggable right triangle with actual squares built on its three sides, areas live. He drags vertices freely; a² + b² and c² update; the equality holds through every deformation. The theorem as *observed invariant* before any proof.
- **Room 2 · The Water Proof** — the two smaller squares fill with liquid; the arrangement rotates; the liquid pours exactly into the large square. Brim-full, every time, any triangle. (Demonstration, and labelled as such — G3's epistemology returns.)
- **Room 3 · The Rearrangement Proof** — the classic: four copies of the triangle inside a big square, arranged two ways; the leftover space is a²+b² one way and c² the other; same square, same triangles, so same leftovers. HE drags the triangles between arrangements — the proof happens *in his hands*. This is the room the whole course was built to reach.
- **Room 4 · The Numbers Room** — 3-4-5 and friends; COUNT door: integer triples verified on the tile grid; his own triangles measured and checked within fog.
- **Room 5 · The Workshop** — using it: find the long side, find a short side (the subtraction case discovered by rebalancing Room 1's areas, not by a second formula), A11's segment-length promise redeemed, one honest real problem of his choosing (ladder, screen diagonal, shortcut across a park).
Every later use of Pythagoras, anywhere in the course, carries a Rebuild button that reopens Room 3 for twenty seconds.
Watch for: adding areas when the hypotenuse is known (Room 5's rebalancing move exists for this); applying it to non-right triangles (Room 1's squares visibly break the equality when the right angle is dragged away — include this as a discovery); c as "the longest side" memorised vs "the side facing the right angle" understood.

**G11 · The Shadow Ratios** — C6.1, C6.3 | G10, G14 helpful, N10
Hook: "Same-shaped triangles keep their ratios no matter their size — which means a pocket-sized triangle can measure a mountain. That trick has three names: sin, cos, tan." Doors: SEE a right triangle with fixed angle scaling up and down, its side-ratios pinned and live (the ratio IS the invariant — trig derived from similarity, not from SOHCAHTOA chanting); HOLD a shadow-measurer (set a sun angle, measure sticks and shadows, discover tan by hand); COUNT ratio tables he builds for 30°, 45°, 60° before ever touching a calculator button. Signature: the ratio observatory — angle dial on one side, the three ratios as live bar-readouts — opening with the **hypotenuse-1 move**: any right triangle is scaled (a lovely shrink animation he controls) until its hypotenuse is exactly 1, whereupon sin and cos stop being ratios at all and are simply *the lengths of the two sides*, readable off the picture. Division vanishes from the first encounter entirely; ratios return later as the general case. **Tan is introduced as gradient** — literally the slope of the angle's ray, so A11's staircases walk straight into trigonometry and tan arrives as an old friend. The observatory's dial quietly IS a circle, and one optional overlay lets sin visibly be "the height of the dial's tip" — a unit-circle seed planted years early, for free, behind a door. The calculator's sin button then introduced as "the observatory, pre-computed" — demystifying the black box. SOHCAHTOA offered afterwards as a *label for what he already owns*, take it or leave it (per A12: mnemonics only ever after understanding). Exhibit: why the ratios can't depend on size (similar-triangle scaling, scrubbed). Watch for: mnemonic-first teaching (deliberately inverted here); adjacent/opposite identified relative to the wrong angle (the observatory highlights them relative to the dialled angle, always).

**G12 · Finding Your Bearings** — C6.3, C4.4 | G11
Hook: "Pilots, sailors and hikers describe every direction with one number. Combine that with the shadow ratios and you can navigate." Doors: HOLD a compass-rose navigator (drag a heading; the three-figure bearing reads live; north-clockwise-three-digits absorbed by use, not rules); SEE journeys plotted as bearing-and-distance legs; COUNT right-triangle decompositions of journeys (trig and Pythagoras in the wild). Signature: the navigation table — plan multi-leg journeys on a map (Tanzania makes a warm cameo); scale drawings as the measurement door, trig as the calculation door — same journey, two doors, matching answers (the course's methods confirming each other, a trust-building moment). Watch for: bearings measured anticlockwise or from south; two-digit bearings (065° not 65°); mixing map-scale units.

**G13 · Compass & Straightedge** — C4.2, C4.3 | G1
Hook: "Two thousand years before rulers were trustworthy, geometers drew perfection with a pin, a pencil and a straightedge. The moves still work, and they're oddly satisfying." Doors: HOLD virtual compass-and-straightedge (the module is almost entirely this door, honestly); SEE why each construction works (the hidden rhombus behind the perpendicular bisector, revealed as an overlay after he builds it); COUNT — n/a, and that's fine; two strong doors beat three forced ones. Signature: the drafting table — bisectors and triangle constructions with a compass that behaves beautifully; arcs are footprints (method marks in embryo: constructions without visible arcs earn nothing, and here the arcs are simply how the tool works). Watch for: arc-less "constructions" done by eye; compass radius drifting mid-construction (the tool locks it, then explains why real compasses must too).

**G14 · Same Shape, Different Size** — C4.5 | N10, G1
Hook: "Photographs enlarge without lying: every length scales by the same factor. Shapes that do this are called similar, and the idea quietly powers half of geometry." Doors: SEE linked shape-pairs with a scale-factor slider (all lengths obeying together); HOLD matching corresponding sides (drag-pair them); COUNT ratio tables across figures. Signature: the enlargement studio — similar figures with live corresponding-side highlighting; missing lengths found by the N10 recipe-scaling move (proportion, already owned, re-costumed — say so explicitly). Congruence as scale-factor-one. Watch for: corresponding sides mismatched on rotated figures (the highlighter rotates with them); adding instead of multiplying (N10's ghost, re-banished).

**G15 · Two Circle Secrets** — C4.7 | G3, G7
Hook: "Circles keep two secrets at Core level. Both can be caught with the apparatus you already own." Doors: SEE dynamic apparatus (a triangle in a semicircle whose apex he drags around the arc — the angle pinned at 90°, always; a tangent line kissing the circle with the radius meeting it, pinned at 90°, always); HOLD the dragging; COUNT measured confirmations within fog. Signature: two law-catcher stations in the G2 style; each secret then *used* (a Pythagoras cameo through the tangent-radius right angle — the museum's Rebuild button making a guest appearance). Exhibit: angle-in-semicircle proved via two isosceles triangles from the centre (Core-appropriate, genuinely lovely, scrubbed). Watch for: applying the semicircle fact to non-diameter chords; tangent identified as any touching line regardless of the radius meeting.

**G16 · The Shape Movers** — C7.1 | G1, A11 helpful
Hook: "Four ways to move a shape without lying about it — and one of them changes its size but still tells the truth." Doors: HOLD direct manipulation (drag a mirror line and watch the reflection obey live; grab a rotation pin and turn; ride a translation arrow; pull an enlargement ray); SEE before/after ghosting; COUNT coordinate effects in tables (seeds the algebra of it). Signature: the transformation stage — he performs each move, then the reverse game: shown before-and-after, he reconstructs the move (state-matching: his mirror/pin/arrow must reproduce the image — fully describable, never markable-wrong). Enlargement from a centre with fractional scale factors as the size-changer. Watch for: rotation centre assumed at origin; reflection in y = x done by eye (the live mirror educates the eye first, then the reverse game checks it); describing a transformation with fewer details than it needs (the reconstruction game *is* the full-description habit).

**G17 · Arrows That Add** — C7.2, C7.3 | G16, N3
Hook: "A vector is a journey that hasn't decided where to start. Journeys chain — and the chaining is addition." Doors: HOLD arrow-dragging on a grid (place, chain, reverse); SEE column notation as (across, up) read directly off the arrow; COUNT component arithmetic confirmed by the picture. Signature: the journey chainer — vectors as draggable arrows; a + b performed by nose-to-tail chaining he does himself; scalar multiples as stretched journeys; the treasure-hunt finale (navigate by vector sums to a spot on the map). Negative components as leftward/downward legs (N3's line, now two-dimensional). Watch for: column vector vs coordinate confusion (journey vs place — the whole module's framing exists for this); nose-to-tail chained tail-to-tail.

**D1 · Making Data Visible** — C9.1–C9.3 | N1
Hook: "A list of numbers hides its story. Pictures make data confess." Doors: HOLD building charts by dragging data points into them (bar charts and pictograms assembled, not just read); SEE the same dataset in three chart types simultaneously; COUNT frequency tallying with a satisfying counter. Signature: the data studio — a small real dataset (his choice: garden birds logged over a fortnight has a certain charm) tallied, charted, and re-charted; two-way tables as sorting into a grid. Watch for: bar chart vs histogram distinctions beyond Core (stay in lane); pictogram half-symbols; reading a chart's story vs its individual bars.

**D2 · The Levelling Machine** — C9.4 | D1, N4
Hook: "The 'average' is three different ideas wearing one word. Each one answers a different question — and one of them is a machine that levels towers." Doors: SEE the mean as literal levelling (bars of different heights; the machine shaves the tall and fills the short until all equal — the mean is the level, animated, unforgettable); HOLD the median as a queue he lines up and walks to the middle of; COUNT the mode as the tallest tally. Signature: the levelling machine — the course's best answer to "why is mean sum-divided-by-count?": because that IS what levelling computes, derived not decreed. Range as the queue's span. When-to-use-which via three warm scenarios where each average tells the truer story (an outlier salary breaking the mean — discovered, of course). Exhibit: mean-as-levelling, scrubbed; the Rebuild button on every future mean. Watch for: mean recited as procedure without the level; median without sorting first (the queue enforces it); averages of averages.

**D3 · Charts That Persuade** — C9.3, C9.5 | D1, N7, G7
Hook: "Some charts inform; some persuade. Learn to build both — and to catch the second kind in the wild." Doors: HOLD pie-building (proportions of a whole as sector angles — N7's percent bar bent into G7's circle, both callbacks explicit); SEE scatter diagrams grown point by point, correlation as the cloud's lean; COUNT angle calculations per category (share × 360, derived from the full-turn). Signature: the persuasion lab — build honest charts, then a rogue's gallery of misleading ones (truncated axes, area tricks) he learns to X-ray; a line of best fit drawn by eye with a "balance the cloud" aid. His Instagram-fact-checking instincts, weaponised. Watch for: correlation as causation (one gorgeous spurious example, handled with wit); best-fit forced through the origin; pie charts compared across different totals.

**D4 · Weighing Chance** — C8.1–C8.3 | N4, N6
Hook: "Chance can be weighed. The scale runs from impossible to certain, and everything in life sits somewhere on it." Doors: SEE the 0–1 probability line (the home line's final costume) with everyday events pegged onto it; HOLD virtual spinners/dice/bags he runs hundreds of times in seconds (relative frequency converging on theory before his eyes — the module's centrepiece animation); COUNT equally-likely outcomes as fractions of ways. Signature: the chance bench — and crucially, **the first spinner he meets is unequal** (one fat sector, two thin), directly confronting the equiprobability bias ("you either win or you don't — 50/50") before uniform dice ever appear, so equal likelihood arrives as a *special case*, never a law. Then: design a spinner, predict with fractions (estimation brackets welcome), spin 10, 100, 10,000 times; watch the wobble settle toward prediction — probability as *long-run honesty*, discovered. Expected frequency as "what the settling points at". Watch for: 50/50 applied to everything with two outcomes; the gambler's-fallacy moment (after five heads, the coin has no memory — demonstrable on the bench, and demonstrated); probabilities that don't sum to 1.

**D5 · Chance in Combination** — C8.4 | D4, N5
Hook: "Two events at once seems like it should be hard. It's a grid — or a tree. Both are pictures, and you already own the arithmetic." Doors: SEE sample-space grids (two dice as a 6×6 grid where outcomes are cells he colours); HOLD literal probability trees that grow branch by branch as he chooses, fractions riding the branches; COUNT branch-multiplication confirmed against the grid (two doors, one answer — the course's closing trust-moment). Signature: the tree grower — combined events built as living trees; multiplying along branches derived from the grid's rows-of-columns (N5's fraction-of-a-fraction area model, one last callback). With/without replacement as the tree remembering. Watch for: adding when multiplying (the grid arbitrates); branches off one node not summing to 1 (the tree politely won't grow until they do); replacement forgotten.

**W1 · The Shape of a Story** — cross-topic (worded problems, additive structures) | N3
Hook: "Word problems feel like riddles because school teaches you to hunt for trigger words. That trick doesn't work — and there's a method that does: stories have *shapes*." Doors: SEE the three additive schema diagrams (part-part-whole bar, change ladder, comparison bars — N4's bars re-costumed); HOLD sorting story cards **by shape, numbers hidden** (the module's central act: structure before arithmetic, always); COUNT filling a matched diagram and watching the calculation fall out. Signature: the story sorter — worded problems arrive as cards with their numbers veiled; he sorts them onto the three shapes (state-matching snap), *then* the numbers unveil into the diagram's slots, and the arithmetic is just reading the picture. Includes a myth-busting exhibit: a problem containing "more" that needs subtraction, watched failing the key-word method — the banned trick shown breaking, once, memorably (per A12). CS callback: this is decomposition (CS Module 7) wearing story clothes. Watch for: residual key-word habits from year 8; grabbing numbers before structure (the veiling mechanic exists precisely for this).

**W2 · The Shape of a Story II** — cross-topic (multiplicative structures) | W1, N10
Hook: "Three more shapes and you can read almost any story the exam will ever tell: equal groups, rates, and scaling." Doors: SEE the multiplicative schema diagrams (equal-groups array — N2's rectangle again; rate as a double number line; scaling as the N10 stretch); HOLD the same veiled-card sorting, now across all six shapes (interleaved with W1's — deliberately mixed, per the interleaving evidence); COUNT solutions via the ratio table where the shape calls for it. Signature: the six-shape sorting floor, with the multiplicative thread motif appearing on the three new shapes — the thread made visible in the wild. Watch for: additive schemas misapplied to multiplicative stories (the classic error the sort surfaces safely); rate confused with ratio.

**W3 · Long Stories** — cross-topic (multi-step and mixed) | W1–W2, most strands
Hook: "Exam questions aren't harder maths — they're several small stories stapled together. You already read every one of them." Doors: SEE long problems decomposed into a chain of shape-diagrams (a visible pipeline, each schema's answer feeding the next); HOLD building the chain himself from a shape tray; COUNT each link solved with tools he owns. Signature: the story pipeline — multi-step worded problems as chains he assembles, each link a familiar shape, footprints flowing between links (this IS method-marks writing, still never named as such pre-Bridge). Contexts deliberately varied per A10 — the same chain-shapes in money, gardens, journeys, recipes — making W3 the course's generalisation engine and the natural on-ramp to Bridge stage P1. Watch for: chain built correctly but links solved in the wrong order (the pipeline shows the dependency); intermediate answers rounded early (N11 callback — fog travels down pipelines and grows).

---

## Part E — Production notes

- **Engine:** everything from `CLAUDE.md` and the CS course carries over — collapsible discoveries, chips, stars, nudge ladders, toasts, reduced-motion, single-file HTML. New shared components to build once and reuse: the **scrub-controlled exhibit player**, the **tile/area-model bench**, the **balance scale**, the **home number line**, the **range-bracket estimator**, the **footprints panel**, and the **Rebuild button** standard.
- **Exhibits are the crown jewels.** Budget build time accordingly: G10's museum, G8's unrolling, D2's levelling machine, and A5's balance are the four to get perfect first; they are also the four best demonstrations of the whole philosophy for the learner's earliest encounters with each strand.
- **Every formula in the course, with its exhibit, joins a single index** (a "Museum Guide" page, eventually): formula ← picture ← Rebuild. This is his revision resource — a gallery he curated by understanding things, not a sheet he must absorb.
- **Phase 2 applies unchanged**: the Constellation Revisit ingests these modules' challenge pools; the Bridge's composition rungs and mark-harvesting adapt naturally (maths' equivalent of the Six-Mark Workshop is a "footprints studio" — writing working that earns method marks, which A5 has been quietly training since day one). Paper 1's non-calculator nature enters only at Bridge stage, by consent, as "back-of-the-hand maths" — by which point N2's toolbox and years of pattern-play will have done the real work.
- **Build order for early wins:** N1 → N2 → A1 (the CS callback lands best while CS is fresh) → G5 → G10 can come *early* if motivation needs a monument — the museum only needs N8 and G5, and owning Pythagoras in month two reframes what "doing maths" means better than any pep talk.
- **Van Hiele pacing (G-strand):** geometric reasoning develops through levels — visual recognition → property analysis → informal deduction — and instruction pitched above a learner's current level does not land, regardless of intelligence. After seven years away he starts at level one; G1–G2 must not be compressed as "too easy", and no module may demand deduction before the property-level apparatus of G2–G3 is comfortable.
- **Revisit interleaving:** once ~6 modules exist in the Constellation, R1 visits should draw challenges from *mixed* modules rather than one at a time — interleaved retrieval outperforms blocked, and mixing is also a steady quiet generalisation engine (A10).
- **CLAUDE.md:** copy per the template rule, swapping the 0478 guardrails for: 0580 Core content codes; 3-significant-figure convention; the given-vs-recalled formula list from the current syllabus appendix; "no Extended content without the [EXT door] being opened in conversation first"; units always displayed; method-marks culture via footprints; **banned procedures per A12** (cross-multiplication, key-word tricks, mnemonic-first teaching); **example-first buttons (A8), explicit conventions (A9), and designed generalisation moments (A10) are course-wide requirements**.
