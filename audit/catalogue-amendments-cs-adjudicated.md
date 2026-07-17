# Catalogue Amendments — Adjudicated (Computer Science 0478)
### Paper-level audit of the CS section of `question-audit.json`, adjudicated against the extended catalogue and reconciled with audit v1's genre-level CS read

Status: this is the first **paper-level** CS audit (v1's CS section was genre-level only, explicitly awaiting this). Companion to `catalogue-amendments-adjudicated.md` (maths) and `claude/catalogue-amendments-english-adjudicated.md` (English). Everything below is tutor/build-facing per the architecture's standing rule; no learner-facing lists, no diagnostic or personal-learner detail. Cluster labels are **CS1–CS4** to stay clear of maths' M1–M9 and English's E1–E4; v1 is cross-referenced **by name**, not number.

## Headline (verified against the raw rows)

CS is **2033 rows across 88 papers, 6070 marks**. Verdicts reproduce exactly from `question-audit.json`:

| verdict | rows | rows % | marks | marks % |
|---|---|---|---|---|
| covered | 635 | 31.2% | 2564 | 42.2% |
| implicit | 388 | 19.1% | 1189 | 19.6% |
| gap | 1010 | **49.7%** | 2317 | **38.2%** |

At first glance this looks worse than English (31.4% gap rows) and near maths. It is not. **The CS gap is not a course-content gap and not a verdicting-inconsistency artifact — it is a single, clean, catalogue-tier omission: CS never had its skill-blueprint tier applied.** Once that is understood, the course itself is essentially clean (the architecture's "CS mostly clean" prediction holds at the *course* level), and the fix is minting blueprints, not building modules.

## What the numbers actually mean

The CS catalogue in `blueprint-architecture.md` lists exactly **seven** blueprints — and the audit used exactly those seven (`explain-the-mechanism` 291, `construct-the-algorithm` 216, `compare-the-pair` 147, `convert-it` 122, `trace-it` 120, `build-the-circuit` 93, `kit-the-scenario` 41). Every one is a **higher-order** pattern (trace, convert, explain a mechanism, compare a pair, kit a scenario, build a circuit, construct an algorithm). There is **no blueprint for the direct-recall command family** — `State / Define / Name / Give / Identify / Tick / Circle` one- and two-markers — nor for the **structured-recall formats** (tick-box, classify-into-columns, complete-a-table, match-terms, gap-fill-from-a-word-bank).

This is **the maths finding replayed, not the English finding.** In maths, the catalogue held word-problem/formula/process blueprints but nothing for direct-command questions carrying ~two-thirds of Core marks; the fix was a third **skill-blueprint tier** (command + object → procedure). CS is in exactly that pre-fix state — the skill tier was designed for maths and English but **never minted for CS.** So the CS gaps are *real* catalogue-tier gaps (unlike English's false gaps), yet they demand *no new modules* (unlike maths) — because every gap topic maps to a module that already teaches the content.

Command-word evidence (share of each command that came back `gap`): `Give` 67%, `Identify` 84%, `State` 79%, `Tick` 76%, `Circle` 100%, `Define` 100% — versus `Explain` 10%, `Describe` 26%, `Trace`/`Convert`/circuit-work near-zero. The gap tracks the **command**, not the **topic**: the higher-order commands the seven blueprints cover are covered; the recall/structured-recall commands they don't cover are gaps, uniformly.

### The gap decomposes cleanly (1010 rows / 2317 marks)

| cluster | rows | gap-mark share | resolution |
|---|---|---|---|
| **CS1 · State/Define/Name recall** | 668 | 56.7% | mint a **NAME-IT / DEFINE-IT** skill blueprint |
| **CS2 · Structured-recall formats** (tick/classify/complete-table/match/gap-fill) | 245 | 30.7% | mint a **SORT-IT / PLACE-IT** skill blueprint |
| **CS4 · QBE / query-by-example** | 22 | 3.4% | **currency artifact — exclude** (see below) |
| **CS3 · Abstraction** | 2 | 0.1% | **the one genuine content touch** — name it in M7 |
| residual boundary cases (describe-the-process/-structure/-characteristics) | ~86 | ~8% | broaden `explain-the-mechanism` / `compare-the-pair` tells |

CS1 + CS2 alone are **913 rows and 87% of gap marks.** Both are catalogue-tier; both map to modules that already teach the material. The high-mark instances make this concrete — every one lands on an existing module: test-data classification (M24), fetch-decode-execute terms (M16), expert-system components (M36), cookie terminology (M32), URL/IP/MAC features (M26/M32), threat→mitigation tables (M34), classify devices input/output/storage (M18), validation checks (M24), data types (M10/M29), packet structure (M13). The auditor's own notes say the quiet part out loud — "skill-blueprint candidate" appears on dozens of these gap rows.

## Decisions on the clusters

**CS1 · STATE / DEFINE / NAME RECALL — ACCEPTED as a real catalogue gap; resolved by MINTING, not by reconciliation (this is where CS diverges from English).**
668 rows, 1313 marks = 56.7% of gap marks. Every "define encryption / define cloud storage / define an embedded system / state characteristics of a robot / name the data type / give the purpose of a primary key" one-marker. This is **exactly v1's single genre-level flag — "state/define one-markers"** — and the paper-level run confirms it is the dominant gap by mark weight. The content is taught (each term lives in its module); what is missing is the *library entry*. **Fix = mint a CS skill blueprint, "NAME IT / DEFINE IT"** (command + object → the canonical definition in his own words), placed per module at the moment each term is first understood — **never as a glossary**, identical anti-memorisation handling to maths' NAME IT. Its stress test is v1's precise recommendation: **stress-test the learner's own wording against mark-scheme phrasings** ("does your definition earn the mark as written?") — the one place convergence-to-canonical-wording genuinely matters, handled as translation, not memorisation. No new module.

**CS2 · STRUCTURED-RECALL FORMATS — ACCEPTED as a real catalogue gap; MINT a second skill blueprint. (Named divergence from v1, which called this "trivial".)**
245 rows, 712 marks = 30.7% of gap marks: tick-box classification ("tick CPU / not CPU"; "classify devices as input/output/storage"), complete-the-table, match-terms-to-descriptions, and gap-fill-from-a-word-bank (FDE terms, expert-system components, cookie terminology). v1 dismissed this as "tick-box/matching ✅ trivial." **The paper-level data contradicts that read directly** (divergence named per the standing rule): it is the *second-largest* gap cluster by marks and is not credited anywhere, because no blueprint exists for the format. It is not hard content — but "trivial" and "covered" are different claims, and the audit marks it `gap`. **Fix = mint a CS skill blueprint, "SORT IT / PLACE IT"** — rule sentence "recognise the fact, then drop it in the shape the question gives you (a box to tick, a column, a table cell, a blank in a passage)." Every module's sort/match/drag-pair mechanic already *performs* this mint; it simply needs a catalogue entry so those rows count. No new module.

**CS3 · ABSTRACTION — ACCEPTED as the one genuine (tiny) course-content touch.**
2 rows, 3 marks ("identify the definition of abstraction" MCQ, `0478_s25_qp_22`; "explain the meaning of abstraction", `0478_w23_qp_21`). Abstraction is a **current-syllabus 7.1 dot point** (7.1 = decomposition *and* abstraction). **M7 · The Recipe Idea** teaches decomposition into component parts but **does not name abstraction anywhere** — a real listing/content omission, the CS analogue of English's E1 (a genuine but small find, resolved inside an existing module). **Fix = add an abstraction discovery to M7's plan** (removing detail to see the essential shape — the natural companion to decomposition). No new module. This is the only item on the whole CS run that touches course content rather than the catalogue.

**CS4 · QBE / QUERY-BY-EXAMPLE — REJECTED as a course gap; flagged as a syllabus-CURRENCY artifact and EXCLUDED from the honest gap count.**
22 rows, 78 marks of "build/complete/interpret a query-by-example grid." Distribution is decisive: **every QBE row is from the 2020–2022 series (s20–w22); zero appear in any 2023+ paper or specimen.** The current 0478 (9.1, exam 2023–2028) tests **SQL**, not QBE grids — the representation was changed. **M29 · Filing Cabinets that Answer Back** correctly teaches SQL (SELECT/FROM/WHERE/ORDER BY/SUM/COUNT). Per the audit's own "new-cycle specimens outrank old papers wherever structures changed" rule, QBE is out-of-current-scope legacy. **Exclude these 22 rows from the gap count** and record a Bridge note (the CS twin of the maths pre-2025-calculator / £-vs-$ currency notes): **when old DB past papers become Bridge material, re-skin QBE-grid questions as SQL** before use.

**Residual boundary cases (~86 rows) — RESOLVED by broadening tells, no new content.**
The `Describe`/`Explain`-led remainder is almost entirely thin instances of patterns the seven blueprints nearly own: describe-the-process (how serial transmission sends data, how text encodes to binary, a logical shift, the steps of a phishing attack), describe-the-structure (a packet's sections, an array's name/type/sample/use), and describe-the-characteristics (of a MAC address, a high-level language, an embedded system). The auditor repeatedly noted these felt "thinner than a typical explain-the-mechanism instance," so left them `gap`. **Fix = broaden `explain-the-mechanism`'s tells to name describe-the-process and describe-the-structure explicitly, and let the new NAME-IT/DEFINE-IT blueprint absorb the characteristics-recall variants** — the same "broaden the tells, don't mint a near-duplicate" move used for English E2/E3/E4 and the maths boundary cases. One small recurring sub-pattern worth a tell rather than a blueprint: **evaluate advantages/disadvantages of a technology in a scenario** (robotic surgery, automation, cloud, robot delivery) — the CS cousin of maths' THE REFEREE and English's attitude questions; the point-and-justify shape is already exercised by every module's "honest ledger" sort, so name it in the NAME-IT/DEFINE-IT blueprint's tells (or as a thin discussion tell on `compare-the-pair`), not as a new entry.

## The same-type-different-verdict consistency check (the process fix from the English round)

Ran as instructed. Result, and it does real diagnostic work: **only 6 gap rows sit in a `type_summary` that is elsewhere marked covered/implicit** (out of 1010 gap rows). Contrast English, where the equivalent check would have surfaced 160+ vocab rows plus list-N and explain-why rows all sitting in types *also* marked covered — the signature of **verdicting inconsistency**. CS shows the opposite: the auditor was *consistent* — it uniformly marked recall/define/tick as `gap` because there was uniformly **no blueprint to map them to.** That consistency is exactly why the CS fix is "mint the missing tier" (maths-style) and **not** "reconcile false gaps" (English-style). Caveat recorded for honesty: CS `type_summary` is near-unique free text (977 distinct strings across 1010 gap rows), so the exact-string check is inherently weak here; the meaningful clustering axis for CS is the **command word**, which is what the CS1–CS4 decomposition above uses.

## Reconciliation with audit v1 (divergences named, per the standing rule)

v1's CS section was **genre-level only** (never paper-verified) and made three claims. The paper-level run resolves each:

- **v1: "state/define one-markers 🟡" → CONFIRMED and PROMOTED.** v1 correctly identified this as the one thing to watch and recommended definition blueprints minted in his own words, stress-tested against mark-scheme phrasings. The full run confirms it and shows it is not a minor 🟡 but **the single largest gap cluster (CS1, 57% of gap marks).** v1's recommended fix is adopted verbatim as the NAME-IT/DEFINE-IT blueprint and its stress test. Convergence on the *fix*; **divergence on the weight** — named here.
- **v1: "tick-box/matching ✅ trivial" → DIVERGENCE, named.** v1 marked structured-recall as covered/trivial. The paper-level data shows it is the **second-largest gap cluster (CS2, 31% of gap marks)** and is credited by no blueprint. "Trivial to answer" was true; "covered by the catalogue" was not. This is the clearest v1-vs-full-run divergence and the reason the genre-level read under-called the CS gap.
- **v1's overall framing: "the likely analogue of English's Q1-convention hygiene" → DIVERGENCE, named.** v1 (and the architecture note) predicted CS would resolve *like English* — light tells-hygiene on an existing blueprint. It resolves **like maths** instead: a genuinely absent skill-blueprint tier that must be *minted*, because — unlike English's `Q1-question-convention` — no CS blueprint for recall/define/structured-recall exists to be reconciled to. Same destination (no new modules, catalogue-tier fix), different mechanism (mint vs reconcile). Naming this keeps the three audits' methods honest: English = reconcile false gaps; maths = mint a missing tier + add real modules; **CS = mint a missing tier, no new modules.**
- **New finds beyond v1's genre list:** abstraction (CS3, a real 7.1 content omission in M7) and the QBE currency artifact (CS4) — neither is in v1's CS read; both are products of paper-level sight. No v1 CS item is silently absorbed, re-opened, or contradicted beyond the two weightings named above.

## What this commits us to (for the next editing pass)

**Catalogue (`blueprint-architecture.md`, Computer Science section — tutor/build-facing):**

1. **Add the CS skill-blueprint tier** (parallel to the maths third tier), stating explicitly that it was designed for all subjects and is now applied to CS. Two members:
   - **NAME IT / DEFINE IT** — command + object → the canonical definition/fact in his own words. Minted per module at the moment each term is understood (never a glossary). Mandatory stress test: **his wording vs mark-scheme phrasing** — "does it earn the mark as written?" (v1's recommendation). Resolves CS1 (57% of gap marks) and the characteristics-recall residuals. Its tells also name the *evaluate-advantages/disadvantages* point-and-justify variant.
   - **SORT IT / PLACE IT** — recognise the fact, then place it in the given structure (tick-box, classify-into-columns, complete-the-table, match-terms, gap-fill-from-a-word-bank). Every module's sort/match/drag-pair mechanic already mints it. Resolves CS2 (31% of gap marks).
2. **Broaden `explain-the-mechanism`'s tells** to name **describe-the-process** and **describe-the-structure** as covered instances (resolves the ~86 residual boundary rows). No near-duplicate blueprint.
3. **Record the honest CS gap:** after applying the skill tier and excluding the QBE currency artifact, the CS course has **essentially no content gap** — one dot-point (abstraction) to name in M7, and the rest is catalogue completeness.

**Course plan (`secret-language-course-plan.md`) — minimal, like English:**

4. **No new modules — 36 stands.** Homes already exist for every gap topic (the CS1/CS2 mapping above is exhaustive against the 36-module map).
5. **M7 · The Recipe Idea:** add an **abstraction** discovery alongside decomposition (7.1), with its own NAME-IT mint. This is the only course-content change (CS3).
6. **Production notes:** the NAME-IT/DEFINE-IT stress test (own-wording vs mark-scheme) is placed per module wherever a term is first understood; SORT-IT/PLACE-IT is the catalogue name for the existing sort/match mechanics so their outputs file into the unified library.

**Bridge note (currency, not yet actioned):** when pre-2023 DB past papers become Bridge material, **re-skin QBE-grid questions as SQL** (CS4) — the CS twin of the maths pre-2025-calculator and $/£ currency notes already logged.

## Process notes (all three audits now complete)

- The skill-blueprint tier is now applied across **all three** subjects: minted+modules for maths, reconciled-as-existing for English, minted-no-modules for CS. The tier was the correct architectural call — every subject needed it, and each needed it applied differently.
- The same-type-different-verdict check earns its keep by **distinguishing failure modes**: a full check (English) means verdicting inconsistency → reconcile; a near-empty check (CS) means consistent-but-uncatalogued → mint. Keep running it, and read the *emptiness* as signal, not just the conflicts.
- For CS specifically, cluster on **command words**, not `type_summary` strings (which are near-unique free text). This is the CS-specific lesson for any re-run.
- `question-audit.json` stays raw evidence (not re-verdicted), matching the maths and English rounds; this doc is the interpretation layer.

## Follow-on edits still pending after this adjudication (not done here)
Applying the above to the live docs (`blueprint-architecture.md` CS section, `secret-language-course-plan.md` M7, and the `CLAUDE.md` planning index / any CS count) is the next editing pass — the parallel of how the English decisions were then written into the live docs. This document is the decision layer; it does not itself edit the catalogue or plan.
