---
name: course-language-editor
description: >-
  Edit course-module prose so a reader with a short attention span and a scanning
  reading style — who does best with short, literal sentences, one idea at a time,
  generous white space between ideas, and no restated points — can follow it easily,
  at roughly a grade 8 reading level. Builds on the personal-humanizer skill's
  plain-language method (cut abstraction, hedging, filler, overlong sentences) but
  pushes further toward short, predictable, one-idea-per-sentence prose, and adds
  paragraph-level chunking and redundancy removal that personal-humanizer doesn't
  cover. Use whenever writing or editing learner-facing text in course module files —
  content.html prose, module.js status/toast/readout strings, hero copy, promise
  cards, nudges, reflection cards — for this project's learner. Trigger on requests
  like "simplify this discovery text," "make this easier to follow," "tighten the
  language," "check the reading level," "this paragraph is too dense," "break this
  up," "this explains the same thing twice," or "edit this for [the learner] /
  for reading level." Also trigger proactively when drafting brand-new module content
  for this learner, not only when revising existing text — new prose should be
  written to this standard from the start, not fixed after the fact. Applies to every
  course under this project (Computer Science now; Maths and English later), since
  the target reader is the same person across all of them.
---

# Course Language Editor

## What this skill is for

Take course-module prose — a hero paragraph, a discovery's explanation, a nudge, a
reflection card — and edit it so one specific reader can take it in without having to
fight the text for it. That reader has a short attention span and reads by scanning
rather than working through a passage start to finish. Long sentences, dense
paragraphs, and any point made twice all cost him disproportionately: by the time a
sentence resolves its third clause, or a paragraph reaches its second restatement of
the same idea, attention has already moved on.

None of this is about lowering the ceiling on what he can understand. He is capable of
real rigour — the syllabus content, the technical terms, the logical structure all
stay exactly as demanding as they need to be. What changes is how much a sentence asks
him to hold in his head before it pays off, and how much the page asks him to process
before he can rest his eyes on white space. Simplify the delivery, never the content.

## The reader this is written for

One learner, 19, who processes text best when:

- **Sentences are short and carry one idea each.** A sentence with two or three
  clauses stacked on top of each other is harder to hold onto than the same content
  split into two short sentences — even though the split version has more words on
  the page.
- **The page is scanned, not read start to finish.** His eye jumps ahead and lands on
  fragments before committing to reading a block in order. A wall of text gives him
  nowhere natural to land. Short paragraphs with real white space between them give
  his eye places to rest and a natural re-entry point if he looks away and back.
- **A point made once should stay made once.** Restating an idea in slightly different
  words doesn't reinforce it for this reader — it reads as a second, separate thing
  he now has to reconcile with the first, which costs more attention than it saves.
  (This is different from *designed* repetition — a concept deliberately reappearing
  in a later module in a new context is a feature of the course, not a redundancy to
  cut. See "What redundancy means here" below.)
- **Predictability lowers the cost of reading.** The same sentence shapes, the same
  patterns for introducing a new term, the same structure discovery to discovery — all
  of it means less of his attention goes to parsing form and more is left for the
  actual idea.

If this project has a house-style or design-contract file for the course you're
editing (commonly `CLAUDE.md` at the project root, or linked from it) — read it before
editing. It carries rules this skill doesn't duplicate: banned vocabulary, tone,
cultural-neutrality checks, and what a "promise card" or "reflection card" is for.
Where that file and this skill both touch the same sentence, follow both — they're
solving different problems (this skill: can he process this sentence; that file: is
this sentence appropriate content and tone) and rarely actually conflict. If you find
a real conflict, say so rather than picking silently.

## The core method: cut the cost of each sentence, then cut the cost of the page

Three things drive how expensive a passage is to read, and they stack:

1. **Sentence cost** — how many clauses before the sentence resolves.
2. **Vocabulary cost** — how many words the reader has to decode rather than recognize
   on sight.
3. **Page cost** — how much has to be scanned before the eye finds a resting point.

Most editing passes fix only the first two. This one treats the third as equally
real, because for a reader who scans, the visual shape of the page is part of what he
reads before he reads the words.

This skill leans on `personal-humanizer`'s plain-language technique for the first two
— cut abstraction, hedging, filler transitions, hype, noun-forms of verbs, and
overlong sentences. `references/plain-language-toolkit.md` restates the parts of that
method most relevant here, recalibrated for a shorter target than general business
prose. Read it before an edit that involves more than a sentence or two.

Where this skill goes further than `personal-humanizer`:

- **The sentence-length target is shorter**, because the reader here isn't a busy
  professional skimming for efficiency — he's someone for whom an overlong sentence
  is a genuine barrier, not an inconvenience.
- **There's no author's voice to match.** `personal-humanizer` steers a rewrite toward
  a specific person's writing style once it's plain and human. This skill has one
  fixed target instead: is this reader going to follow it easily? That's the only
  question, every time.
- **Paragraph and page structure are in scope**, not just the sentence.
  `personal-humanizer` doesn't touch layout. This skill treats "break this into two
  paragraphs with room between them" as the same kind of move as "break this into two
  sentences."
- **Redundancy is treated as a cost, not a rhetorical tool.** Repeating a noun instead
  of "it" (personal-humanizer's flow guidance) still applies — that's disambiguation,
  not redundancy. But restating a claim for emphasis, or recapping what a paragraph
  just said, is cut here, where a general audience might tolerate or even want it.

## Workflow

### 1. Find the actual prose

Course modules keep learner-facing text in specific places: the `.hero` intro
paragraph, each `.disc-body`'s explanatory `<p>` tags, `.promise` and `.chips-label`
text, nudge and "Show me one first" content, and any status/readout strings written
in `module.js` (toast messages, live readouts, `aria-live` status text). Edit these.

Do **not** restructure the surrounding markup — IDs, classes, input elements, and
container `div`s are wired up by `module.js` and the shared engine in `src/engine/`.
Splitting a paragraph into two `<p>` tags inside a `.disc-body` is safe and often the
whole point of this skill; renaming an ID, removing a wrapper `div`, or changing a
class the JS selects on will break the module. If you're not sure whether an element
is structural or just prose, leave the structure alone and edit only the text inside
it.

### 2. Read it as a first pass — count the clauses, not the words

Before editing, mark every sentence that makes the reader do more than one thing:
resolve a subordinate clause before the main point, hold a "which" clause in
suspension, or reconcile two ideas joined by "and" that aren't actually one thought.
These are the sentences that cost the most and are worth fixing first — a single
30-word sentence with three ideas fused together does more damage to this reader than
three separate 10-word sentences ever would, even though the word count is the same.

The Module 23 hero paragraph is a real example of the pattern to catch: one ~70-word
sentence introducing four technical terms (`LENGTH`, `SUBSTRING`, `UCASE`/`LCASE`,
`RANDOM`/`ROUND`) back to back, each with its own clause. Every term deserves its own
short sentence, or at minimum its own short paragraph, not a shared clause in a list.

### 3. Rewrite for sentence length and vocabulary

Apply `references/plain-language-toolkit.md`. In short: one idea per sentence, plain
common words except for syllabus terms that must stay exact, verbs instead of
noun-forms, and light connectives ("so," "because," "then," "but") only where they
genuinely join two short clauses that belong together — never three or more.

**Active voice, always.** Passive sentences hide the actor and cost the reader an
extra clause before the sentence pays off ("the value is stored by the variable" →
"the variable stores the value"). Unlike general plain-language guidance, this isn't
"active by default with passive allowed where the actor doesn't matter" — for this
reader, rewrite every passive construction, full stop. The only exception is a
Cambridge syllabus definition that's worded passively in the official appendix itself;
there, keep the definition exact (step 7) and put the active voice in the sentences
around it instead.

**Target: average sentence length of 8–14 words**, noticeably shorter than general
plain-English guidance (which sits closer to 15–20). Treat anything past 18–20 words
as a sentence that almost certainly wants splitting, and don't be shy about splitting
a 12-word sentence too if it's doing two things.

**Don't over-correct into a stutter.** A row of identically short, clipped sentences
with every connective stripped out is its own kind of hard to follow — the reader has
to do the work of reassembling the relationship between them that a light "so" or
"because" would have given for free. The target isn't "as short as possible," it's
"as short as it can be while still reading as one thought talking to the reader," per
the profile above: *just enough* joining words to keep it following, not zero.

**Grade level: aim for a Flesch-Kincaid grade level at or under 8** across a full
passage (`scripts/readability_check.py` computes this — see step 6). A sentence
carrying a necessary Cambridge syllabus term (`SUBSTRING`, `asynchronous`,
`two's complement`) will read a little higher on its own; that's fine, and the fix is
never to simplify the term — it's to keep everything else around that term as short
and plain as possible so the sentence's average still comes out low. Never trade
syllabus accuracy for a lower grade-level number.

### 4. Chunk for scanning — treat white space as part of the writing

A scanning reader benefits from having somewhere to land every few seconds, not just
from short sentences within a wall of text. For every block of prose:

- **One idea per paragraph.** If a `<p>` makes two distinct points, split it into two
  `<p>` tags. The engine's existing CSS already gives each `<p>` breathing room —
  splitting the markup is enough to get the extra space; there's no CSS to touch.
- **A new technical term usually earns its own short paragraph** (or at least its own
  sentence), rather than being introduced mid-clause alongside two others. Compare the
  Module 23 example above, where four terms share one sentence — each would land
  better on its own line the reader can pause on.
- **Don't manufacture paragraph breaks that split one idea in half.** Chunking helps
  only when each chunk is a genuinely complete thought; a paragraph break mid-idea
  just adds a second problem (now the idea is scattered) on top of the first.
- **Number items when the text states an exact count; use bullets when it doesn't.**
  If a sentence promises the reader "three roads," "four tools," "five stages" — any
  explicit count — number each one as it's introduced ("1.", "2.", "3.") rather than
  just giving it its own paragraph. A stated count is something the reader can check
  off one item at a time; numbering makes that literal instead of leaving him to count
  paragraphs to confirm the promise was kept. But if the list has no stated count — a
  set of examples, a set of nudges, anything open-ended — use a bullet instead of a
  number. A number implies a specific total the reader should track; using one where
  the text made no such promise invites him to treat the count as meaningful when it
  isn't. Match the list marker to what the sentence actually claims. (The engine's
  markup doesn't currently define list styling, so render this as a plain "1." /
  bullet-character prefix inside the existing paragraph structure rather than a new
  `<ol>`/`<ul>` element, unless you've confirmed `core.css` supports one — that's a
  structural decision outside this skill's scope; flag it rather than guessing.)
- **Highlight a term every time it appears, not only the first time.** When a
  discovery introduces a new term, mark it the way the module already marks terms —
  `<strong>` for a plain-English concept (address bus, Von Neumann), the module's
  `<span class="kw">` style for an exact pseudocode or function name (LENGTH,
  SUBSTRING). Keep marking it every later time it appears anywhere in the module —
  in a later paragraph, a nudge, a "Show me one first" example, the reflection card —
  not just at its first mention. A scanning reader relies on that visual marker to
  find the important noun in a sentence without reading the whole sentence first, and
  the marker matters most on the fifth or tenth encounter, not the first — dropping it
  after one mention (a common convention in general writing) removes the shortcut
  exactly when repetition would otherwise make the reader re-parse the whole sentence
  to relocate the term. This applies across the whole module, not just within one
  passage being edited — check nudges and later discoveries for mentions of terms this
  edit introduces or that an earlier discovery already introduced.

  This targets named technical terms — a syllabus word (array, SUBSTRING), a
  pseudocode construct, a specific concept the module coined (address bus, Von
  Neumann). It's not meant to catch a module's sustained working metaphor — a plain
  word like "compartment" or "wall" that stands in for the technical term and gets
  reused dozens of times throughout a whole module. Bolding every occurrence of a word
  that common would bold a large fraction of the page and the highlight would stop
  meaning "this is a defined term" — it would just be noise, working against the very
  scanning benefit this rule exists for. Highlight the term the metaphor stands for
  (array) every time it's named directly; leave the metaphor word itself (compartment)
  in plain text throughout, the same as any other ordinary word in the sentence.

### 5. Cut redundancy — but know which repetition is deliberate

Reread the passage and flag any place the same claim is made twice in different
words — a sentence that explains something, followed by another sentence or clause
that explains it again for emphasis, or a closing line that recaps what the paragraph
already said. Cut the second instance; keep the version that landed best.

**What to leave alone**, because it isn't the kind of redundancy this step targets:

- **Repeating the actual noun instead of "it" or "this"** across sentences.
  Disambiguation, not redundancy — it's cheaper for a scanning reader to reread a
  short familiar noun than to resolve a pronoun.
- **A fixed phrase the house style repeats on purpose** across every module — the
  promise card's "no marks, no timer, no wrong answers" framing, for instance. That
  repetition *is* the predictability the reader relies on; don't vary it for the sake
  of variety.
- **A concept designed to reappear in a later module** in a new context (what the
  course plan calls "same idea, new costume"). That's spaced repetition across the
  course, working at a completely different scale from a redundant sentence — leave
  it to the module content, not this editing pass.

If you're unsure whether something is redundant or deliberate, it's very likely
deliberate — this project's house style repeats specific framing on purpose far more
often than a general audience piece would. Cut only what's genuinely saying the same
thing twice within the same short passage.

### 6. Self-check with the script

Run `scripts/readability_check.py` against the edited passage before calling it done:

```
python3 scripts/readability_check.py <file-or-'-'-for-stdin> [--html]
```

It reports, per paragraph and overall: word count, average and longest sentence
length, Flesch-Kincaid grade level, paragraphs over ~40 words (candidates for
splitting), sentences over ~20 words (candidates for splitting), and pairs of
sentences that are near-duplicates of each other (candidates for cutting one). Use
`--html` when checking a `content.html` excerpt so tags get stripped before counting.

Treat its flags as a first pass to react to, not a pass/fail gate — a flagged long
sentence built around one syllabus term that can't shrink further is fine to leave; a
flagged near-duplicate pair that turns out to be a deliberate house-style repeat
(step 5) is fine to leave too. Use judgment; the script catches the mechanical part
so your judgment can go to the part that actually needs it.

### 7. Preserve substance — same rule as personal-humanizer, non-negotiable

Shortening must never lose information or introduce an error. Every Cambridge syllabus
term, number, and technical detail stays exactly as precise as it was. Simplifying is
something that happens to the sentence *around* a term, never to the term itself.
Never invent a simpler-sounding explanation that's actually less accurate — if a
concept can't be made shorter without losing precision, keep the precision and shorten
what surrounds it instead.

## Calibration: this reader's profile gets more specific over time

`references/calibration.md` holds durable, specific facts learned from feedback on
past edits — the same role `personal-humanizer`'s voice-profile file plays, but for
reading comfort instead of writing voice. Read it before an edit; it may already
contain a correction that applies (e.g., a word he's said trips him up despite reading
"simple," or a paragraph pattern that turned out to still be too dense even inside the
targets above).

When you get feedback on an edit — a correction ("this sentence still reads as one
long thing," "you cut a repeat I actually wanted") or a confirmation the approach
worked — that's worth keeping. Offer, in one line, to add it to
`references/calibration.md`. Over time this should mean less of the judgment in steps
2–5 has to be worked out fresh each time, and more of it is already written down.

## Output

Edit the file in place using the project's normal editing tools, the same as any other
code or content change — this is a course-content edit, not a text-transform to hand
back as a message. By default, don't narrate every sentence-level change; a short
summary of the main moves (e.g., "split the hero paragraph into four, one per
function; cut the restated definition in discovery 2; readability script now reads
grade 7.4") is enough unless the user asks for more detail or the change is extensive
enough that they'd want to sanity-check it clause by clause.

## Reference files

- `references/plain-language-toolkit.md` — the sentence- and word-level technique,
  adapted from `personal-humanizer`'s method and recalibrated for this reader's
  shorter target. Read this for any edit beyond a sentence or two.
- `references/calibration.md` — durable, growing notes on this specific reader learned
  from feedback on past edits. Read before editing; update after feedback.
- `scripts/readability_check.py` — measures grade level, sentence length, paragraph
  length, and near-duplicate sentences. Run it as a self-check before calling an edit
  done.
