# The Bridge — Phase 2 Plan
### From understanding to examinable output · Cambridge IGCSE Computer Science 0478 (2026–2028)

Companion to `secret-language-course-plan.md`. The 36 discovery modules build genuine understanding; this plan converts it into marks. Same learner, same design contract at its core — extended, with his consent, into territory the contract was originally built to avoid. That extension is done by **graded exposure with explicit consent gates**, never by surprise.

---

## Part A — How the contract evolves (and what never changes)

**Never changes, in any Phase 2 tool:**
- Stars/progress only accumulate. Nothing is deducted, reset, or expires.
- Graduated nudges everywhere, free and unlimited.
- No red X's, no error sounds, no error counts.
- He controls pace and can exit anything cleanly.
- Warm adult tone; he is treated as a capable adult throughout.

**Evolves, each behind an explicit consent gate (a "door" he opens, continuing Module 36's metaphor):**
- **The word "exam" becomes sayable** — after the Module 36 door, exam-shaped work is named honestly. Euphemism past that point would be infantilising and would undermine trust.
- **Marks appear — reframed as intelligence, not judgement.** A mark scheme is "the examiner's phrasebook": a decoding target, information about what earns credit. His own attempts are never scored with a red number; instead he *harvests* marks he can evidence ("I can claim these 4 of 6 — here's why"), which keeps marking an active skill he performs rather than a verdict he receives.
- **Time appears — as pace awareness first, pressure last.** Clocks arrive in three stages (see X3). No countdown ever turns red or beeps. The final stage — a real timed paper — is his choice, scheduled by him.
- **Blank pages appear — with warm-up ramps.** Free composition is reached by fading scaffolds, never by cliff.

**Consent gate mechanics:** each new exposure level is introduced in conversation with Derek first, then appears in-tool as a clearly labelled door ("This next room contains real past-paper wording. It can wait as long as you like."). Opening a door is never required to keep using everything before it. A door once opened can be closed again without losing anything.

---

## Part B — The four strands and when they start

| Strand | Name | Starts | Runs until |
|--------|------|--------|------------|
| R | Remembering (spaced retrieval) | Now — alongside Module 3 onwards | Exam day |
| C | Composing (the blank-page bridge) | After Module 12 (all three loop types known) | Exam day |
| X | Exam craft (command words, timing, stamina) | After the Module 36 door, or earlier if he opens it | Exam day |
| P | Past papers (graded exposure) | After X1–X2 | Exam day |

Indicative timeline for a June sitting: R from the first winter; C from roughly the course midpoint; X and P across the final 5–6 months; full timed papers only in the last 6–8 weeks, and only if the earlier P stages are comfortable. All dates flex to him — the timeline serves the learner, never the reverse.

---

## Part C — Strand R · Remembering

### R1 · The Constellation Revisit (build: one HTML tool + a data file per module)
**Purpose:** spaced retrieval without it ever feeling like being tested on the past.
**Mechanic:** the constellation from Module 36's ceremony becomes a living object available from the start. Each completed module is a star; stars gently dim over time (visual only — *the star is never lost*, it softens, described in-tool as "resting"). Tapping a resting star offers "a two-minute visit": 2–3 challenges drawn from that module's pool, in the module's own mechanics. Completing the visit re-brightens the star. Intervals expand on success (2 days → 1 week → 3 weeks → 6 weeks…) and quietly contract when a visit was effortful — never announced as such.
**Contract notes:** dimming must be framed and rendered as *resting*, warm not accusatory (no grey/red; a softer amber). Visits are capped at ~3 minutes. Skipping a visit has no consequence beyond the star continuing to rest.
**Build spec:** each module exports a challenge pool (JSON block at file foot: id, prompt, mechanic type, answer state). The Revisit tool loads pools and schedules by a simple expanding-interval table. Persistence required — this is the tool that justifies adding the autosave/export layer across the whole course.
**What Derek gets:** an export view showing per-topic brightness over time — his retention map, invisible to the learner as "data", visible to him as the night sky.

### R2 · Why-chains (a habit, not a tool)
At the end of each Revisit visit, one optional "why" prompt ("why does parity miss two flips?") with a free-text box that saves privately. Not checked, not marked — its purpose is retrieval *with explanation*, the strongest consolidation there is. Derek reviews these in sessions; they're his best diagnostic of depth vs recognition.

---

## Part D — Strand C · Composing (the blank-page bridge)

Two parallel tracks, one method: **fading scaffolds across four rungs**. Nothing on rung N+1 appears until rung N feels easy — "easy" judged by him, with Derek's read alongside.

### The four rungs (both tracks)
1. **Assemble** — drag complete lines/sentences into order (already a course mechanic; zero blank page).
2. **Complete** — the answer with surgical gaps: a condition, a loop bound, a command word's object. Gaps are state-matched or picker-filled.
3. **Skeleton** — structure given as labelled hollows ("declare here / loop here / decide here" or "point → because → consequence"), he types the flesh. First real typing.
4. **Blank, warm** — an empty editor with three comforts permanently available: a "remind me of the shape" button (redraws the skeleton, no penalty), the nudge ladder, and a private drafts area nothing evaluates.

### C-A · The Pseudocode Forge (build: one substantial HTML tool)
**Purpose:** the Paper 2 scenario question (15 marks) — composing whole solutions in Cambridge pseudocode.
**Mechanic:** a two-pane forge: task briefing left, editor right. The editor is *structure-aware for kindness, not judgement*: it auto-indents, offers ENDIF/NEXT/ENDWHILE closers as accept-or-ignore ghosts, and colours keywords — the same comforts an IDE gives professionals (links to Module 28's IDE tour: "you're using the real tools now"). A **Run-on-the-wall** button executes his pseudocode against the Module 22 pigeonhole-wall visualisation, so testing is *watching his machine run* — intrinsically motivating, and it reframes bugs as "the machine did what I said, not what I meant" (Module 20's detective stance) rather than personal failure.
**Rung progression content:** rung 1–2 use course-familiar problems; rung 3 introduces exam-shaped briefs (input → process → validate → output); rung 4 problems are structured exactly like the real scenario question, including the "you must use: meaningful names, comments…" rubric decoded in advance by X1.
**Self-comparison, not marking:** after an attempt, a model solution unfolds *beside* his (never replacing it) with a "harvest" mechanic — he claims the mark-scheme points his version evidences, tapping each; unclaimed points become tomorrow's nudge material. Claims are his own judgement first, reviewed with Derek.
**Watch for:** perfectionist stall at rung 4 (the drafts area and "shape" button exist for this); pseudocode drifting toward Python-isms if he explores real coding on the side — the forge's ghosts quietly re-anchor Cambridge syntax.

### C-B · The Six-Mark Workshop (build: one HTML tool)
**Purpose:** Paper 1 extended prose — describe/explain answers in mark-scheme register.
**Mechanic:** the same four rungs applied to sentences. Rung 1 assembles model answers from sentence tiles and — crucially — includes *distractor tiles that are true but earn nothing* (vague, repeated, off-question), teaching the difference between knowing and crediting. Rung 2 gap-fills the load-bearing words ("the microprocessor ______ the sensor value ______ the stored value"). Rung 3 gives the point-count and a skeleton ("cause → mechanism → consequence, three times for six marks"). Rung 4: the question alone.
**Register training:** a side panel, "the examiner's dialect", collects the high-credit verb patterns (compares, converts, transmits, stores…) as he encounters them — a phrasebook he assembles himself across weeks.
**Watch for:** answers that explain beautifully at human level but skip the mechanism step examiners credit; the tile distractors exist precisely to make this visible early.

---

## Part E — Strand X · Exam craft

### X1 · The Examiner's Phrasebook (build: one HTML tool)
**Purpose:** command words as a decoding puzzle. *State* wants a fact; *describe* wants features in sentences; *explain* wants mechanism or reason; *compare* wants both sides linked; *suggest* invites application to the unfamiliar.
**Mechanic:** pairs of near-identical questions differing only in command word, each with two candidate answers — he predicts which answer each question wants, discovering the system by contrast. Then reversal: given an answer, infer the question's command word. Include the mark-allocation rule of thumb (marks ≈ distinct creditable points) as a discovery, not a lecture.

### X2 · Reading the Question (build: folds into X1 or standalone)
**Mechanic:** real questions (re-skinned at first) shown as annotatable objects — he highlights the command word, the content target, the constraints, the mark count, in four colours. State-matched: the annotation lights when the four elements are found. This is the two-minute ritual he'll perform in the hall; it's built here as a game until it's automatic.

### X3 · The Clock, Introduced Gently (build: a setting layer across C and P tools, not a module)
Three consent-gated stages, weeks apart:
1. **The clock that only records:** attempts quietly log duration; afterwards, if he chooses, he sees "that took 9 minutes" against "the exam offers about 12 for this many marks". Information, afterwards, opt-in.
2. **The ambient clock:** a small, calm elapsed-time display he can toggle on while working. Never counts down. Never changes colour.
3. **The chosen hour:** he schedules a timed section himself, knowing exactly what it contains structurally. Ending overtime produces data ("the search question is where the time went"), never verdict.
**Hard rule:** no Phase 2 tool ever imposes a timer he didn't switch on.

### X4 · The Hand (offline plan, no software)
Seven years without sustained handwriting; both papers are 1h45 of it. From ~4 months out: why-chains (R2) and rung 3–4 prose migrate to paper by his choice; short daily writing that isn't exam work at all (copying favourite passages, letters, anything) builds stamina invisibly. Pen choice, grip comfort, and a wrist-friendly desk setup are legitimate tutoring business here. If handwriting proves a genuine barrier rather than a rusty skill, that's evidence relevant to access arrangements (Part G) — flag it early, not in May.

---

## Part F — Strand P · Past papers by graded exposure

Four stages, each a consent door, each fully comfortable before the next is offered:

1. **P1 · Borrowed questions, home clothes:** real past-paper tasks re-skinned into module visual language and mechanics, appearing inside C-tools as ordinary content. He is told they're adapted from past papers only *after* several go well — then that fact is itself therapeutic: "you've already been doing exam questions; they just weren't wearing the costume."
2. **P2 · Real wording, safe frame:** authentic question text and layout, rendered inside the familiar dark-warm interface, nudges still present. The costume arrives; the room is still his.
3. **P3 · Paper on paper:** printed questions, handwritten answers, at his own table, untimed, mark scheme afterwards as a harvest (C-track mechanic, now on real material). Derek's review sessions live here.
4. **P4 · The dress rehearsals:** timed sections → a half paper → one full paper, then if wanted a second in a less familiar room (graded environmental exposure toward the real hall). Debriefs harvest marks and — equally — evidence about comfort: what helped, what to request, what to bring.

Throughout: mark schemes are always *his tool for reading examiners*, never an instrument used on him. The phrase "let's see what this answer can claim" does a lot of load-bearing work.

---

## Part G — Logistics (start ~12 months out; verify everything with the centre)

He'll sit as a **private candidate**, which means finding an exam centre — a school or independent centre that accepts external entries for Cambridge IGCSE. Not all do, and computer science is usually straightforward (no coursework in 0478 — two written papers only, which is precisely why this syllabus suits him). Steps, earliest first:

1. **Find and visit the centre early.** Cambridge's and the centre's own listings identify candidates near East Herts. Visiting the actual room months in advance is, for this learner, an anxiety intervention as much as admin.
2. **Access arrangements need lead time.** If his attention profile warrants extra time, rest breaks, or a smaller/separate room, arrangements are applied for *by the centre* and typically require evidence (e.g. an assessment and/or history of need). Private candidates can face extra friction here — raise it in the *first* conversation with any prospective centre and ask exactly what evidence they need and by when. Do not assume; deadlines and evidence requirements must be confirmed with the centre and current JCQ/Cambridge guidance, and formal assessment routes can have waiting lists measured in months.
3. **Entry deadlines** for a June series typically fall in the preceding winter, with late fees after. Confirm dates with the centre the autumn before.
4. **Know the physical script:** what ID he brings, where he waits, what's on the desk, what the invigilator says. P4's second rehearsal can mirror all of it. A written "day plan" he owns removes every knowable unknown.

---

## Part H — What only humans do (the honest boundary)

The tools above cover retention, composition, craft, and exposure. Three things they cannot do, and shouldn't pretend to:

- **Dialogue.** Explaining ideas back to Derek, being asked "why", following a wrong turn together — this is where depth is verified and where the why-chain notes get their real use. Nothing here replaces the sessions; everything here feeds them.
- **Reading the person.** The consent doors are only as good as the judgement about when to offer them. That's Derek's craft, not the software's.
- **The relationship with the exam itself.** The goal by exam week is that the paper feels like "a long module with a costume on, in a room I've already seen, using moves I've made hundreds of times." Every tool aims at that sentence — but whether it lands is decided in the human work around the tools.

**Build order recommendation:** R1 (with the persistence layer) → C-A rungs 1–2 → X1 → C-B → remaining rungs → X2 → P-stage content. R1 first, because retention decay is already quietly happening for Modules 1–2.
