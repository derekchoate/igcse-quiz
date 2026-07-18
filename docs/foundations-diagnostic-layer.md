# The Foundations Layer — Diagnostic & Coached-Review Spec
### Detecting missing foundations and coaching review, across all courses

An engine-level feature for every course (CS, Maths, and future subjects). Its job: notice when a struggle in one module is really a gap in an earlier one, and coach a return to the foundation — the way a good tutor would say "this ratio wobble is actually a fraction wobble; let's pop back for five minutes."

## The design decision stated plainly: coaching, not gates

The request this layer answers is "make sure he doesn't progress when a foundation is missing." The contract (rule 5: never locked) deliberately prevents the literal version — and should, because a hard gate recreates the school experience of being *held back*, visibly and shamefully, which for this learner converts a knowledge gap into an identity wound. The layer therefore does everything a gate does *except* the locking:

- it **detects** foundational gaps earlier and more precisely than a gate would,
- it **offers** the foundation review warmly, framed as a shortcut rather than a demotion,
- it **leans** — the offer recurs (at most twice per module) and the path back is one tap,
- it **informs Derek**, who alone decides whether a human coaching conversation is needed,
- and it **never blocks**. If he declines the offer and pushes on, the module lets him — and the layer quietly tells Derek.

In practice this is *more* effective than gating: gates provoke gate-defeating behaviour; invitations that make the easier path genuinely easier get taken.

## Component 1 — Toolbox warm-ups (diagnosis before frustration)

Every module opens with an optional-but-default 60–90 second **"unpacking the toolbox"** step: 2–4 micro-challenges drawn *from the module's prerequisites*, framed exactly as what they are — "this module uses these tools; let's get them out of the box." (N10 Fair Shares opens with one fraction-equivalence bar and one fraction-placement on the line, because ratios stand on fractions.)

Why this shape:
- It is a **diagnostic probe wearing a warm-up's clothes**: smooth completion = foundations present, proceed; a wobble = the gap is found *before* the new topic has a chance to hurt.
- It doubles as **spaced retrieval** (Phase 2 R1 credit accrues from warm-ups too).
- It normalises revisiting: touching old material happens at the start of *every* module, so a coached return later carries no stigma — it's just more of what he always does.
- Contract compliance: skippable (one tap, no comment), untimed, state-matching, star-neutral (warm-ups can only add a small glint to the module's star, never withhold it).

Wobble definition for a warm-up item: reaching nudge rung 2+ on it, or exiting it unresolved. One wobbly item → the module proceeds but pre-arms its secret passage (Component 2). Two or more → the passage is offered immediately, before the module begins: "Two of this module's tools feel stiff. Five minutes in the fraction lab usually loosens them — want the shortcut? The module will wait."

## Component 2 — Secret passages (the coached return)

Each module declares, per discovery, its **concept-level prerequisites** — not "module N4" but "N4-D3: equivalence by finer cutting." When struggle signals fire (below), a **secret passage** opens: a warmly framed side-door that deep-links to exactly the prerequisite discovery, runs it in a focused 3–5 minute "workshop visit," then returns him to the exact spot he left, with the passage now marked travelled (a small glint — passages *add*, never subtract).

Framing rules (these carry the whole trauma-informed weight):
- The passage is always about the **idea's ancestry**, never his deficit: "Ratios are fractions wearing work clothes — a quick visit to the fraction lab makes this next part click," not "you seem to be struggling with fractions."
- It is presented as **insider knowledge** — the efficient move that people who know the terrain make — because that is literally true.
- Offered at most **twice per module**; after a second decline the module respects his choice completely and the signal goes to Derek's map instead.
- Returning from a passage lands him *exactly* where he left, with a one-line reorientation ("you were lighting the ratio table — the doubling move").

Struggle signals (all in-tool, all invisible as judgement):
- nudge ladder reaching rung 3 (the worked example) twice within one discovery;
- high state-churn without a match (many manipulations, no chip lighting, sustained);
- an "I'm stuck" button — present in every discovery from now on, a first-class honest act that opens the nudge ladder AND consults the passage map;
- warm-up wobbles carried in from Component 1;
- (never used: time-on-task alone — slow is not stuck, and he must never be measured by the clock.)

## Component 3 — The weather map (Derek's dashboard)

All signals flow to an exportable tutor view — an extension of the Phase 2 night-sky map. Per module: warm-up results, passages offered/taken/declined, nudge-depth distribution, "I'm stuck" presses. Framed as weather, not grades: where the terrain is currently boggy, where passages are being walked, where a declined passage suggests a session topic.

Boundary (restating Phase 2 Part H): the software detects and offers; **Derek coaches**. A declined passage plus continued struggle is precisely the case for a human conversation, not a stronger machine intervention. The layer's escalation ceiling is "tell Derek."

## Implementation spec

- **Dependency map:** one JSON file per course (`foundations-map.json`): nodes are discovery-level IDs (e.g. `N4-D3`), edges are typed prerequisites with a one-line "ancestry sentence" used verbatim in passage framing. The course plans' *Needs* fields are the first draft; refine to discovery granularity during builds.
- **Warm-up pools:** each module's file exports 3–6 tagged micro-challenges (same JSON-block pattern as the Revisit pools; items are shared between the two systems).
- **Passage deep-links:** modules accept a URL fragment (`#d3`) to open at a discovery with a return-address parameter; single-file constraint preserved (passages open the prerequisite module file with fragment + return params).
- **Signals storage:** rides the same persistence layer as R1 (session-only until that layer lands — build the layer first; it is now justified twice over).
- **Cross-course passages are allowed and encouraged** (maths A1's passage can lead to CS Module 10) — the dependency map is project-wide.
- **Example ancestry sentences to seed the tone:** ratios→fractions: "Ratios are fractions wearing work clothes." · trig→similarity: "The observatory runs on the same-shape rule." · algebra→arithmetic: "Every algebra move is an arithmetic move with the numbers' names withheld." · percentages→fractions: "Percent is the fraction lab's most popular costume."

## Contract compliance checklist

Never locks (rule 5 intact) · adds glints, never subtracts (rule 3) · passage language warm and ancestry-framed, no deficit vocabulary (rules 1–2) · "I'm stuck" is honoured as a capable adult's efficient move (rule 9) · warm-ups skippable and untimed (rules 5, 10) · everything here is *offer*, and offers cap at two (predictability, rule from learner context) · Derek is the escalation path, always.
