# Plain-language toolkit

This adapts `personal-humanizer`'s plain-language method (its steps 4 and 5, and its
`ai-tells.md` catalog) for a shorter target than general business or professional
prose. The underlying moves are the same — the calibration is different. Where
`personal-humanizer` aims for a 15–20 word sentence average as *the* target, this
reader's target is 8–14 words, because the cost of an overlong sentence is much higher
for him than for a busy professional skimming an email.

## Word choice: plain, and syllabus-precise where it counts

**Prefer the shorter, more common word**, same list `personal-humanizer` uses:

use (not utilize) · start (not commence) · about (not regarding) · help (not
facilitate) · enough (not sufficient) · show (not demonstrate) · before (not prior
to) · because (not due to the fact that) · end (not terminate) · get (not obtain) ·
so (not accordingly) · most (not the majority of)

The test: if it's a word you'd say out loud, keep it. If you'd only ever type it,
there's a spoken version — use that instead.

**Never simplify a Cambridge syllabus term.** `SUBSTRING`, `two's complement`,
`asynchronous`, `algorithm` — these stay exactly as written, however many syllables
they carry. The plain-language pass applies to the sentence *around* the term, never
to the term. If a sentence built around a necessary term still reads a little long or
a little high on the grade-level check, that's expected — shrink what's around it, not
the term.

**Verbs, not noun-forms.** "We made a decision to conduct a review" → "We decided to
review it." The noun version is longer and hides who or what is doing the thing —
which matters here, because a sentence with a clear actor is easier to hold onto than
one built around an abstract noun standing in for an action.

**Active voice, always — no "usually" about it.** "The value is stored by the
variable" → "The variable stores the value." Passive constructions bury the actor and
cost an extra clause to parse: the reader has to hold the action in mind before
learning who or what did it. `personal-humanizer` treats passive as fine when the
actor genuinely doesn't matter; for this reader, rewrite it active anyway — naming the
actor is one less thing standing between the sentence and its point, even when the
actor seems obvious from context. The one exception is a Cambridge syllabus
definition that is itself worded passively in the official appendix — there, accuracy
(step 7 in `SKILL.md`) wins, and the fix is to keep the definition intact and let the
surrounding sentences carry the active voice instead.

**Cut hedging, filler, and hype** — the same habits `personal-humanizer`'s
`ai-tells.md` catalogs (stacked qualifiers, "it's important to note," "seamless,"
"leverage," "moreover"). These don't just sound artificial — every one is an extra
clause or an extra word the reader has to process for zero information. Cutting them
serves both goals of that skill and this one at once.

## Sentence structure: one idea, one sentence

**Target 8–14 words per sentence on average.** Treat 18–20 words as the point past
which a sentence needs a real reason to stay whole, and split it if it doesn't have
one.

**Find the join and cut there.** Almost every overlong sentence is two or three ideas
fused with "and," "which," or a trailing comma clause. Find the seam and make it a
sentence break instead.

Before: "Although the initial rollout was delayed by two weeks due to a dependency on
the platform team, the migration finished ahead of the revised schedule, which meant
the cost savings landed in Q3 rather than Q4."

After: "The rollout was delayed by two weeks. The platform team's dependency caused
that. Even so, the migration finished ahead of schedule. The savings landed in Q3, not
Q4."

(Four short sentences, not one compressed one — because for this reader, the count of
sentences on the page costs less than the count of clauses inside any one of them.)

**Use light connectives to join exactly two clauses that belong together — never
three or more.** "So," "because," "then," and "but" change the meaning of what
follows and are worth keeping when two short ideas genuinely form one thought. What to
avoid is the subordinate-clause-then-main-clause-then-trailing-clause shape, where a
reader has to hold two unresolved ideas in mind before the sentence pays off.

**Don't flatten into a stutter.** A run of sentences that are all the same short
length, with every connective removed, forces the reader to do the joining work
himself — which defeats the purpose. "The rollout was late. It was two weeks late. The
platform team caused it." is worse than the four-sentence example above, because
nothing signals how the sentences relate. Keep the ones that make a real connection
("so," "because," "even so") and cut only the ones that were decoration.

## Flow: still applies, still matters

`personal-humanizer`'s flow guidance carries over unchanged, because it's about
reducing ambiguity, not adding words:

- **Name the actual noun instead of "this," "that," or "it"** whenever there's any
  chance of doubt about what's being referred to. A short repeated noun is cheaper to
  reread than a pronoun is to resolve.
- **Old information first, new information last** — end a sentence on the new idea,
  then open the next sentence with it, so the reader doesn't need a transition word to
  feel the link.
- **One point per paragraph.** For this reader, aim toward the short end — often just
  2–3 sentences, sometimes one, rather than the 3–5 general plain-language guidance
  suggests. A paragraph making two points is always two paragraphs here.

## Self-check questions

Before calling a passage done, reread it and ask:

- Does any sentence make the reader hold two unresolved ideas before it resolves? If
  so, split it.
- Is there a sentence over ~18 words that isn't built around one unavoidable syllabus
  term? If so, it probably still has a seam to cut.
- Did I cut connectives down to a stutter, or keep the ones doing real work?
- Is every syllabus term, number, and technical claim from the source still exactly
  as precise as it was?
- Would this reader be able to take in this paragraph in one scan, or does it need a
  second pass to resolve?
