# The Master Roadmap — IGCSE Tutorial
### Staggered sittings, weekly-hours assumptions, and per-subject go/no-go readiness across all three courses

Sibling to `CLAUDE.md`, `the-rebuilder-maths-course-plan.md`, `secret-language-course-plan.md`, and `the-first-reader-english-course-plan.md`. This is the cross-subject planning instrument: it decides *when* each course points at an exam sitting, *how much time* the plan assumes, and *what "ready" means* for each subject. It sits above the three course plans and the Bridge (Phase 2) architecture; it does not restate them.

**This document is tutor/build-facing only, per `CLAUDE.md`.** Nothing here is ever rendered to the learner. No exam date, deadline, countdown, or readiness checklist is shown to him — the word "exam" still appears nowhere in his experience except the single optional door at the end of each course (contract rule 8, maths A6). Every date below is a *target the tutor plans toward*, never a commitment placed on the learner.

---

## 0 · The standing rule that outranks the calendar

The design contract wins over every scheduling decision in this document. Concretely:

- **Sittings are consent-gated, not calendar-gated.** The learner sits a paper only when he has opened the exam door willingly (contract rule 8; maths A6; "by his consent, years of comfort later"). If a target sitting would arrive before that consent, the sitting slips — the learner's pace never compresses to meet a date.
- **Readiness is demonstrated comfort, not a deadline reached.** The go/no-go criteria in §6 are all read off systems the learner already lives inside (the Constellation Revisit pools, the Bridge rungs, the blueprint library, the footprints habit). None of them is a timed test.
- **Where a syllabus window and the learner's pace collide, the pace wins and the sitting rolls to the next syllabus version** (§3 and the flag in §7). A re-verification build pass is cheaper than pressuring the learner, which the contract forbids outright.

If any future scheduling decision cannot be made without breaching one of these, stop and flag it — do not silently trade the contract for a date.

---

## 1 · Settled inputs

Module counts are now settled across all three subjects (audits adjudicated and applied):

| Course | Code | Modules | Syllabus cycle targeted |
|--------|------|---------|-------------------------|
| Computer Science | 0478 | **36** | 2026–2028 |
| Mathematics (Core) | 0580 | **52** | 2025–2027 |
| English (First Language) | 0500 | **29** | 2027–2029 |

Two flags left open by the maths audit are resolved here so the roadmap builds on firm counts:

- **Maths count — 52 stands; flag closed.** The live map enumerates 52 distinct rows (16 N + 11 A + 17 G + 5 D + 3 W), each with its own Part D plan; no row is a phantom or duplicate. The historical "48 modules" label sat over a map that already held 49 distinct planned modules — a pre-existing miscount, not a hidden duplicate. The three audit additions (N1.5, N2.5, N14) bring the honest total to 52. There is nothing to reconcile out.
- **N1.5 content — anatomy of numbers; flag closed.** N1.5 · The Anatomy of Numbers is factors / multiples / primes / prime factorisation / HCF-LCM, minting THE COUNT LIST, exactly as the adjudicated decision of record specifies. The "place value / digit structure" gloss was a loose task-summary wording, never a decision. Place value is already carried across N1 (the number line, C1.1/C1.3), N6 (decimal place-value collisions), and N9 (standard form / place-value columns) — no syllabus gap remains, so no separate place-value module is warranted. (If a *dedicated* place-value module is ever wanted, that is a new scope decision, not a reconciliation, and would be opened in conversation.)

---

## 2 · Why the order is CS → maths → English (and why English's clock starts first)

The suggested **sitting** order is **CS first, maths second, English last**. The reasoning is not "easiest first" — it is which course is bound by *hours* versus which is bound by *calendar*.

**English is calendar-bound, not hours-bound.** Its readiness rests on reading miles — a sustained reading habit whose value accrues over months of wall-clock time no matter how many hours per week are poured in. You cannot buy a year of reading maturity with a fortnight of intensive work. That single fact places English last, and it also means **English's reading clock must start early** — the reading habit runs quietly in the background from near the start of the whole programme, long before its modules become the focused subject. "English last" is a statement about *when it is sat*, not *when it begins*.

**CS is the confident home and is already the most-built course**, so it leads: sitting it first banks an early, real success under the same star system the learner already trusts, and does so while the CS content is freshest.

**Maths is the largest course (52 modules) and its exhibits are the crown jewels** — it needs the most learning time, so it takes the middle, longest focused run. Its one complication is the syllabus window (§3), handled below.

This yields a three-track shape rather than three strictly serial courses:

- **Track A (foreground focus), staggered:** CS → maths → English composition/modules.
- **Track B (background, calendar accrual), continuous from early:** the English reading habit, running under everything else so the reading miles are already banked by the time English becomes the foreground subject.

---

## 3 · The fixed calendar facts (and the maths-window tension)

Cambridge runs two exam series a year — **June** and **November**. Malaysia is **Zone 4**, which sits both. Entry decisions land months ahead of each series (broadly February for June, and around August–September for November), so a sitting must be *decided* — i.e. readiness must be clear — well before the series month.

Syllabus-version windows (the version each course plan is written against) close as follows:

- **CS 0478 (2026–2028):** last sitting under this version is **November 2028**. Comfortable runway.
- **Maths 0580 (2025–2027):** last sitting under this version is **November 2027**. **This is the tight one.**
- **English 0500 (2027–2029):** first sittings 2027, last under this version **November 2029**. Latest window of the three — which happily matches "English last."

The tension: **the largest course has the earliest-closing window.** Maths (52 modules + Bridge) must be sat by **November 2027** to use the syllabus version its plan is written against, yet the suggested order puts maths *after* CS. From a July 2026 start, hitting a Nov 2027 maths sitting while also sitting CS first is aggressive for a learner who works in short bursts. This is a genuine roadmap-vs-reality collision, and it is flagged in §7 rather than resolved by quietly rushing the learner. The default resolution: **let maths roll to the next syllabus version (2028–2030) and sit it in 2028**, accepting a re-verification build pass of the 52 modules against the new appendix. That is contract-aligned (no pressure) and the re-verify pass is anticipated anyway ("verify against the official syllabus before building each module").

---

## 4 · Weekly-hours assumptions (named, and tunable)

Everything downstream depends on these. They are deliberately conservative and stated so they can be re-tuned as real pace data arrives from the Constellation pools.

- **H1 · Engaged study time:** assume **~3–5 hours/week**, in the contract's short bursts (a module is ~20 minutes; a sitting is one or two discoveries, never a marathon). Plan against the low end (~3 h) so the schedule survives slow spells.
- **H2 · Effective new-module throughput:** assume **~1.5–2 new modules/week** *when a course is the foreground focus*, once revisit interleaving is running. New-module intake is deliberately slower than raw module count would suggest, because the Constellation Revisit (mixed retrieval) consumes part of each week — that is a feature, not drag.
- **H3 · Build stays ahead of learning.** Module *building* (batch-build mode) is fast relative to the learner's intake, so build is not the bottleneck — **learning pace is**. The roadmap schedules against learner intake and assumes the build pipeline keeps a comfortable buffer of ready modules ahead of where the learner is.
- **H4 · Reading miles run in wall-clock, not hours.** The English reading habit is assumed to need **12+ months of calendar accrual** regardless of weekly hours — it cannot be compressed. This is the single assumption that anchors the whole stagger.
- **H5 · Bridge (Phase 2) adds a tail per course.** After a course's modules are explored, assume a **further ~2–3 months** of Bridge work (retention, composition, exam craft, graded exposure) before readiness — untimed, by consent, and itself never presented as exam prep.

At the planning low end (H1 ≈ 3–4 h/wk, H2 ≈ 1.5 modules/wk foreground):

| Course | Modules | New-module weeks (foreground) | + Bridge tail | ≈ Time-to-readiness (foreground) |
|--------|---------|-------------------------------|---------------|----------------------------------|
| CS | 36 | ~20–24 wks | ~2–3 mo | **~8–9 months** |
| Maths | 52 | ~28–35 wks | ~2–3 mo | **~10–12 months** |
| English (modules only) | 29 | ~16–20 wks | ~2–3 mo | ~6–7 months **but gated by H4 (reading calendar), not by module weeks** |

The English row is the tell: its modules are the smallest load, but its *readiness* is governed by H4's reading calendar, so it finishes last despite the shortest module runway.

---

## 5 · The staggered plan

Two tracks (§2), mapped onto the calendar facts (§3) at the planning-low-end pace (§4). All dates are tutor-side targets; the consent/readiness gates in §0 and §6 govern whether each is actually taken.

**Build order vs sitting order are different things.** Build order front-loads maths despite maths sitting second, because maths is the largest course and needs the longest lead — the pipeline keeps maths modules flowing to stay ahead of the learner even while CS is his foreground focus.

### Recommended (steady) schedule — default

| Phase | Window | Foreground focus | Background (continuous) | Target sitting |
|-------|--------|------------------|--------------------------|----------------|
| Now → early 2027 | Jul 2026 – Feb 2027 | **CS** modules + Bridge | English reading habit begins | — |
| Spring 2027 | Mar – Jun 2027 | CS Bridge → readiness | English reading continues | — |
| Mid 2027 | ~Jun/Nov 2027 | (CS readiness gate) | English reading continues | **CS 0478 — Nov 2027** |
| Late 2027 → 2028 | Nov 2027 – mid 2028 | **Maths** modules + Bridge | English reading continues | — |
| 2028 | ~Jun/Nov 2028 | (Maths readiness gate) | English reading continues | **Maths 0580 — Jun or Nov 2028** *(2028–2030 syllabus version; see §3/§7)* |
| Late 2028 → 2029 | late 2028 – mid 2029 | **English** modules + composition | (reading miles now banked) | — |
| Mid 2029 | ~Jun 2029 | (English readiness gate) | — | **English 0500 — Jun 2029** |

This spaces the three sittings roughly a year apart, gives maths its long middle run, lets the English reading clock accrue the full ~2.5+ years before English is sat, and keeps every course inside its syllabus window (CS ≤ Nov 2028; maths on the 2028–2030 version; English ≤ Nov 2029).

### Ambitious schedule — only if pace and comfort clearly allow, never pushed

If real intake runs well above the planning low end **and** the learner opens each exam door early and calmly:

- **CS — June 2027**, **Maths — November 2027** (keeping maths on its current 2025–2027 syllabus, so no re-verify pass), **English — June 2028**.
- This is genuinely tight: it needs CS ready by ~Feb 2027 and maths ready by ~Aug 2027 entry, back-to-back, from a July 2026 start. Treat it as a ceiling to be *discovered*, never a target to be *chased*. If it is not clearly comfortable, fall back to the steady schedule — that is the contract, not a failure.

---

## 6 · Per-subject go/no-go readiness criteria

Each course goes to a sitting only when **all** of its gates read green. Every gate is observed from a system the learner already inhabits — none is a timed or scored test, and none is ever shown to him as a checklist. "No-go" is never a verdict on the learner; it simply means *keep building comfort*, at his pace.

**Shared gates (all three courses):**

- **Coverage** — every module for the paper's content has been *explored* at least once (explored, not "passed"), and the blueprints those modules mint are present and named in his own library.
- **Retention (interleaved)** — the Constellation Revisit shows stable recall across *mixed-module* pulls, not one-time recall of freshly-seen material; where the course rebuilds rather than memorises (all of maths, much of CS), reconstruction time via the Rebuild buttons is visibly falling.
- **Currency** — past-paper exposure has been re-skinned to current format before the learner meets it (see §8), so nothing on the real paper is a surprise of *format*.
- **Consent (the master gate)** — the learner has willingly opened the exam door. Absent this, no sitting, regardless of every other gate. This gate can only be offered, never engineered.

**CS 0478 — go when:**

- All **36** modules explored; the minted skill-blueprint tier (NAME IT / DEFINE IT, SORT IT / PLACE IT) is applied reliably, and describe-the-process / describe-the-structure prompts are handled comfortably (the audit's ≈87%-of-gap-marks tier).
- The QBE→SQL database currency re-skin has been met (Strand P), so DB questions arrive in SQL, not legacy QBE grids.
- Bridge composition + exam-craft rungs completed to the learner's consent; a couple of full current-format papers have been met **calmly** (calm is the signal, not the score).

**Maths 0580 — go when:**

- All **52** modules explored, with the four crown-jewel exhibits (G10 museum, G8 unrolling, D2 levelling, A5 balance) internalised to the point that the Rebuild replays are quick, not laborious.
- The core blueprints — THE COUNT LIST (N1.5), THE READING ORDER (N2.5), THE SUM / THE PRODUCT and the W3 process blueprints — are in the library and applied through the seven-verb W routine on mixed worded questions.
- The **footprints / method-marks habit is automatic** — working writes itself as a by-product of the tools (this is the maths "go" signal above all others; it has been trained since N2 and must be second nature, never a bolt-on).
- Paper-specific readiness on **both** instruments: the non-calculator Paper 1 "back-of-the-hand" strand met by consent, **and** Calculator Craft (N14) fluent for Paper 3; currency re-skin done (£→$, and the legacy calculator-Paper-1 note).
- **Syllabus-version check** confirmed for the actual sitting (2028–2030 by default under the steady schedule — the re-verify pass must be complete before entry; see §7).

**English 0500 — go when:**

- All **29** modules explored, with descriptive writing (E1 — the one real catalogue gap from the audit) covered.
- **Reading miles genuinely banked** — a sustained reading habit has accrued over **12+ months of calendar** (H4). This is the gate that cannot be shortcut and the reason English sits last; it is read from the reading companion's history, not from any test.
- The writing-feedback tool's composition rungs (through rung-4 feedback) met to consent, so extended writing arrives as a practised act.
- Targeted at the **2027–2029** cycle — sitting in Jun 2029 (steady) maximises the reading calendar while staying inside the window.

---

## 7 · Flags raised (per `CLAUDE.md` — surfaced, not silently resolved)

1. **Exam-window pressure vs the "no urgency / untimed forever" contract (the important one).** The maths 0580 syllabus window closes **Nov 2027**, which is earlier than a CS-first order comfortably allows from a mid-2026 start. Any attempt to hit Nov 2027 maths would import calendar pressure that the contract forbids reaching the learner (A6; rule 6; "consent, years of comfort later"). **Resolution taken:** keep all window logic tutor-side and let maths roll to the **2028–2030 syllabus version** (sit 2028), at the cost of a re-verification build pass of the 52 modules against the new appendix. The pace wins; the sitting moves. Flagged here rather than absorbed because it changes which syllabus version maths is built against — a build decision the owner should be able to see and override (the ambitious schedule in §5 is the override path, if consent and pace make Nov 2027 real).
2. **Sitting order vs build order diverge for maths.** Because maths is the largest course with the earliest window, its *build* is front-loaded even though its *sitting* is second. Not a contract conflict — noted so the build pipeline is not mistakenly sequenced to match the sitting order.
3. **"English last" requires "English reading first."** The stagger is not strictly serial: the English reading habit must run in the background from near the start (H4), which sits slightly against a naive "one subject at a time" reading of the plan. Called out so the reading clock is actually started early rather than deferred until English becomes the foreground subject — deferring it would push the only calendar-bound course past its window.

---

## 8 · Dependencies and what this roadmap waits on

- **Persistence layer (next build task).** Every readiness gate in §6 that reads "stable across the Constellation Revisit" or "reading miles accrued over 12+ months" presumes progress actually persists across sessions. Today it does not (`CLAUDE.md` House style: "No localStorage yet"). The persistence pass — the session-only store built once to serve the Constellation Revisit (Bridge R1), the Foundations warm-up pools/signals, and the blueprint library — is therefore a **hard prerequisite for measuring readiness at all**. It is the promoted next task.
- **Exam-currency re-skin (Bridge-stage).** Before any course's past-paper exposure, apply the recorded currency notes: maths pre-2025 Paper 1s were *calculator* papers (current Core P1 is non-calculator); 0580 papers use **$ not £**; CS pre-2023 database papers use QBE grids, replaced by **SQL**. The §6 "Currency" gate depends on this being done per course.
- **Bridge (Phase 2) architecture** supplies the composition, retention, and exam-craft rungs the §6 gates reference; this roadmap sequences them but does not redefine them (see `the-bridge-phase-2-plan.md`).

---

*Roadmap v1 — 2026-07-11. Built on settled counts (CS 36, maths 52, English 29) with both maths-audit flags closed. Revisit the weekly-hours assumptions (§4) once real intake data exists in the Constellation pools; the whole schedule re-derives from them.*
