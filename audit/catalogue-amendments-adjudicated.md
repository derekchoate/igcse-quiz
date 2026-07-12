# Catalogue Amendments — Adjudicated (maths)
### Owner+Claude decisions on `catalogue-amendments.md` (interim), reconciled with audit v1's M1–M9

Status: supersedes the interim proposals for maths. English/CS audits pending; their runs should use the catalogue as extended here. Everything below remains tutor/build-facing per the architecture's standing rule.

## Architecture decision first: the skill-blueprint tier

The audit's 74%-gap finding was definitional and correct: the catalogue held word-problem, formula, and process blueprints but nothing for direct-command questions (*solve, simplify, draw, describe, round…*) — roughly two-thirds of Core marks. The fix, now written into `blueprint-architecture.md`: a third tier, **skill blueprints** — command + object → procedure, minted like everything else at the moment of understanding, each carrying its rule sentence on its face. Every module mints 1–3. The clusters below enumerate the maths set.

## Decisions on the fourteen clusters

**1 · Algebra manipulation — ACCEPTED AS A FAMILY, RENAMED, SPLIT.** The proposal's own instinct ("likely needs minting in pieces") is right: one blueprint is too coarse for minting-at-the-moment-of-understanding. It becomes **THE RESHAPE family** — family motto = the cluster's excellent rule sentence ("you can change an expression's shape without changing what it's worth") — with members minted separately: COLLECT (A2), EXPAND (A3), FACTORISE (A4), SOLVE (A5), REARRANGE (A5, new discovery — see plan amendments), INDEX LAWS (A9). Rename reason: "THE RECIPE" collides with CS Module 7 ("The Recipe Idea") and A1's "formulas as recipes with boxes" — same word, three meanings, and the learner's library must never have ambiguous names it didn't choose itself. Stress test note: the proposed subject-appears-twice rearrangement is Extended-tier; the Core-appropriate stress test is a two-step rearrangement where the tempting single move is wrong (e.g. subject inside a bracket).
**2 · THE COUNT LIST — ACCEPTED**, and it confirms v1's M2: no module owns factors/primes/HCF/LCM. Plan amendment: new module **N1.5 · The Anatomy of Numbers** (see below). Mint there.
**3 · THE CLOCK & THE RULER — ACCEPTED** (= v1's M4), mint-moments as proposed (N11 metric, N12 time); its decimal-time stress test (3.5 h ≠ 3 h 50 min) is exactly right and already echoes the plan's N12 watch-for.
**4 · Numeric procedures — ACCEPTED, SPLIT IN TWO.** Representation procedures (standard form, s.f./d.p. rounding, reciprocal) mint at N6/N9/N11 as proposed. **Order of operations comes OUT of this cluster**: it is not a representation change and it confirms v1's M1 — it gets its own module (N2.5, below) and its own blueprint.
**5 · THE MOVING SHAPE — ACCEPTED**, mint G16; its "describe fully" stress test adopted as mandatory. This also resolves v1's describe-the-transformation promotion.
**5b · Data handling — ACCEPTED WITH A CORRECTION**: D2 already teaches mode/median/range (the queue, the tally, the span) — the *catalogue entry* was scoped too narrowly, not the module. Fix is to the catalogue text (broaden D2's entry to all four questions data answers, adopting 5b's lovely rule sentence) plus new construction/reading blueprints minted at D1 and D3. One genuine plan gap inside this cluster: **stem-and-leaf** isn't named anywhere in D1 — added to D1's plan entry.
**6 · ANGLE CHASING — ACCEPTED**, mint G2/G4; subsumes v1's M7 (give-a-reason): the blueprint's rule sentence requires *naming the rule*, which is the reason-giving habit.
**7 · (constructions/bearings cluster) — ACCEPTED** as proposed, mint G13/G12; subsumes v1's P1 performance-blueprint gap for constructions.
**8 · GRAPHS AS PICTURES OF EQUATIONS — ACCEPTED**, mint A10/A11; its rule sentence ("reading the graph IS solving the equation") is strong enough to become A10's reflection-card line.
**9 · THE GROWING PATTERN — ACCEPTED**, mint A7. Term-to-term vs position rule as two gaps in one blueprint, matching A7's existing watch-for.
**10 · THE TWO-SET SORT — ACCEPTED**, mint N13.
**11 · Vectors — ACCEPTED**, mint G17.
**12 · Similar/congruent — ACCEPTED**, mint G14.
**13 · Circle angle facts — ACCEPTED**, mint G15.
**14 · THE LINE'S ADDRESS — ACCEPTED, MERGED into cluster 8's A11 mint** (same moment, two entries: gradient-and-intercept reading; equation-from-graph).

## What the clustering missed (carried forward from v1 + the gap data)

- **SYMMETRY (v1's M3):** ~26 rows in the gap data (rotational order, drawing lines of symmetry) but absent from all fourteen clusters — a clustering hole. New skill blueprint (shape · symmetry type · the fold/turn test), minted at G1; tracing-paper convention taught as insider knowledge. Plan amendment below.
- **NAME IT (v1's M5):** vocabulary one-markers ("write down the mathematical name…"). Skill blueprint minted per geometry module; names as gaps at the moment the object is understood.
- **CALCULATOR CRAFT (v1's M6):** invisible to a question-paper audit by nature; stands as a Paper 3 module amendment.
- **THE REFEREE (v1's M8):** "Tina says… is she correct?" — present in the residual one-offs. Minted in W3; flagged as a likely cross-subject shape (CS's compare-the-pair cousin; English's attitude questions) — revisit when the other audits land, as the interim file itself suggests.
- **Residual handling — AGREED** with the interim file's own rule: no shoehorning; the "question removed, marks awarded" rows are excluded as non-content; revisit the ~150–200 singletons after English/CS.
- **Boundary-cases note — AGREED**: broaden existing entries' gaps/tells (probability complement into D4's entry; pie-to-frequency into ratio-sharing's tells) rather than minting near-duplicates.

## Plan amendments this commits us to (maths plan, for the next editing pass)

1. **N1.5 · The Anatomy of Numbers** — factors, multiples, primes as building blocks, prime factorisation, HCF/LCM via shared blocks. Mints THE COUNT LIST. (M2)
2. **N2.5 · The Reading Order** — order of operations as an agreed convention, stated not derived (it is a convention, and A9/convention-honesty applies); the owner's existing bilingual BODMAS-bridge design is prior art. Mints the ORDER blueprint. (M1)
3. **A5 gains a REARRANGE discovery** — changing the subject as the balance's moves aimed at a different letter. (M9)
4. **G1 gains symmetry discoveries** — line + rotational, with the tracing-paper move. (M3)
5. **D1 adds stem-and-leaf** to its chart set. (from 5b)
6. **Late N-strand: calculator craft module** for Paper 3. (M6)
7. Module count moves 48 → 51; map rows and Foundations prerequisite edges updated accordingly.

## Process notes for the pending audits

- English/CS runs use the extended catalogue (skill tier included) so their numbers are meaningful.
- The sanity-check rule from the audit prompt still applies — and this round's lesson is added to it: **where the run's verdict diverges from the v1 hand-audit, the divergence must be named in notes**, not absorbed into category labels.
