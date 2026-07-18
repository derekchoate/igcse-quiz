# The Secret Language — Full Course Plan
### Cambridge IGCSE Computer Science 0478 (examination 2026–2028) as a self-study discovery series

A complete module-by-module plan covering Topics 1–10. Each plan contains enough specification to build an interactive single-file HTML module in the style of Module 1 (*The Secret Language*, binary numbers).

---

## Part A — The design contract (applies to every module)

These rules are the course. Break one and the whole thing starts smelling like school.

1. **No school vocabulary.** Never: test, quiz, exam, mark, grade, revision, homework, pass/fail. Always: discovery, puzzle, experiment, challenge, nudge, star.
2. **No failure events on core interactions.** Wherever possible the mechanic is *state-matching* (flip things until the readout matches) — there is no submit button, so a wrong answer cannot exist. Where an explicit choice is unavoidable (e.g. picking a term), a wrong pick produces a warm redirect, never a red X, never a sound, never a counter.
3. **Stars only accumulate.** One star per discovery, displayed in the header with the caption "stars only ever go up". Nothing resets, expires, or is deducted.
4. **Graduated nudges** (Campione & Brown): every challenge carries an optional nudge ladder — general strategy → specific pointer → worked example. Free, unlimited, no penalty, revealed one rung at a time.
5. **Micro-chunks.** Each discovery is 2–4 minutes. Each module is 4–6 discoveries, ~20 minutes total, with a natural stop after every discovery. Sections are collapsible but **never locked** — peeking ahead is allowed and quietly encouraged.
6. **He controls the pace.** Autosave (once hosted), leave-anytime, skip-anything. Every module ends with a short reflection card that names what he just did *as* self-study.
7. **Personal touches.** Where a free number/word can be chosen, invite one of his (age, a name, a favourite number). Module 1 used 19.
8. **Exam skills smuggled in, never announced.** Trace tables, truth tables and Cambridge pseudocode conventions appear as game mechanics. The word "exam" appears nowhere until he asks for it.
9. **Visual language.** Shared identity across all modules: deep night-blue ground (#10182B), amber glow (#FFB84D) for anything "on"/achieved, teal (#7BC4B4) for nudges, Sora display / Atkinson Hyperlegible body. Each module may add ONE signature interactive element.
10. **Reduced motion respected; keyboard operable; nothing timed.** Ever.
11. **Example-first is a first-class door.** Every challenge carries a "Show me one first" button — a fully worked example available *before* attempting, presented with the same warmth as every other route and never framed as the lesser path (the nudge ladder gains a rung 0). Evidence on ADHD and related profiles shows explicit guidance is often the optimal route, not a fallback.
12. **Conventions are stated, never inferred.** Notation, symbols, diagram meanings, and the rules of any apparatus are explicitly introduced in literal, unambiguous language before any task depends on them.
13. **Generalisation moments are designed, not hoped for.** Concepts deliberately reappear in varied surface clothing ("same idea, new costume" — announced gently, never sprung), because understanding acquired in one context does not automatically travel, and a consistent house style amplifies that risk.

### Module anatomy (build template)
- Hero: a hook question or promise, plus the standing "how this works" promise card.
- 4–6 collapsible discoveries, each with: short intro (≤80 words), the interactive board, challenge chips (auto-detected completion), nudge ladder.
- Star per discovery; reflection card unlocks when all stars found (but is also reachable by scrolling — nothing is hidden).
- Footer: "Made for one particular learner."

---

## Part B — Course map and sequencing

Two interleaved strands so theory never stacks up unrelieved:

- **Strand S — "How the machine thinks"** (Topics 1–6, Paper 1)
- **Strand M — "Making it do things"** (Topics 7–10, Paper 2)

Suggested rhythm: alternate S and M modules. Prerequisites are marked per module; everything else is free order — and telling him so is part of the pedagogy.

Milestone celebrations (no certificates, just moments): after M6 ("you can now read any file's raw bytes"), after M22 ("you can now predict what a program does before running it"), after M32 ("you have covered every dot point Cambridge can ask about").

| # | Module | Strand | Syllabus ref |
|---|--------|--------|--------------|
| 1 | The Secret Language (binary) — **built** | S | 1.1 |
| 2 | Sixteen Symbols (hexadecimal) | S | 1.1 |
| 3 | Switch Arithmetic (binary add, overflow, shifts, two's complement) | S | 1.1 |
| 4 | Letters in the Wire (ASCII & Unicode) | S | 1.2 |
| 5 | Pictures & Sound from Numbers | S | 1.2 |
| 6 | How Big Is a Song? (units & compression) | S | 1.3 |
| 7 | The Recipe Idea (algorithms, decomposition, abstraction, PDLC) | M | 7.1–7.2 |
| 8 | Reading the Map (flowcharts) | M | 7.4 |
| 9 | The House Style (Cambridge pseudocode reading) | M | 7.4, 8.1 |
| 10 | Boxes with Names (variables, I/O, arithmetic) | M | 8.1 |
| 11 | The Fork in the Road (selection: IF, CASE) | M | 8.1 |
| 12 | Round and Round (iteration: FOR, WHILE, REPEAT) | M | 8.1 |
| 13 | The Journey of a Message (packets & switching) | S | 2.1 |
| 14 | Did It Arrive Intact? (transmission methods & error detection) | S | 2.1–2.2 |
| 15 | Locked Letters (encryption) | S | 2.3 |
| 16 | X-Ray the Machine (Von Neumann, FDE cycle, registers) | S | 3.1 |
| 17 | Faster, Smaller, Everywhere (CPU performance, instruction sets, embedded) | S | 3.1 |
| 18 | Senses and Voices (input/output devices, sensors) | S | 3.2 |
| 19 | Where Things Live (primary/secondary/virtual storage, cloud) | S | 3.3 |
| 20 | The Detective's Table (trace tables) | M | 7.3 |
| 21 | Words Under the Microscope (string handling & library routines) | M | 8.1 |
| 22 | Many Boxes, One Name (arrays 1D & 2D) | M | 8.2 |
| 23 | The Classics (linear/binary search, bubble sort, totalling, counting, max/min/avg) | M | 7.5 |
| 24 | Gatekeepers (validation, verification, test data) | M | 7.6 |
| 25 | Building Blocks (procedures, functions, scope) | M | 8.1 |
| 26 | Talking to the Network (NIC, MAC, IP, routers) | S | 3.4 |
| 27 | The Software Layers (system vs application, OS, interrupts) | S | 4.1 |
| 28 | From Human to Machine (languages, translators, IDEs) | S | 4.2 |
| 29 | Filing Cabinets that Answer Back (databases & SQL) | M | 9.1 |
| 30 | The Logic Machines (gates & truth tables) | M | 10.1 |
| 31 | Circuits from Sentences (logic circuits & expressions) | M | 10.1 |
| 32 | The Web Beneath the Web (internet vs WWW, URLs, HTTPS, browsers, cookies) | S | 5.1 |
| 33 | Money Made of Maths (digital currency & blockchain) | S | 5.2 |
| 34 | The Defenders (cyber threats & protections) | S | 5.3 |
| 35 | Machines that Act Alone (automated systems & robotics) | S | 6.1–6.2 |
| 36 | Machines that Learn (AI, expert systems, ML) + reading files (8.3) capstone | M/S | 6.3, 8.3 |

---

## Part C — Module plans

Format key — **Ref:** syllabus section · **Needs:** prerequisite modules · **Hook** · **Goal** (what he can do after) · **Signature interaction** · **Discoveries** (the chunks) · **Nudge sample** (one ladder shown; build one per challenge) · **Watch for** (misconceptions).

---

### Module 1 · The Secret Language — BUILT
**Ref:** 1.1 · **Needs:** nothing
Binary via glowing bulb-switches; challenges auto-detected by state-matching; decodes "YOU". The template for everything below.

---

### Module 2 · Sixteen Symbols (hexadecimal)
**Ref:** 1.1 · **Needs:** M1
**Hook:** "Programmers got tired of writing eight bulbs. So they invented a shorthand where one symbol replaces four."
**Goal:** Convert denary↔binary↔hex; explain why hex is used (MAC addresses, colour codes, memory dumps — human readability, not machine need).
**Signature interaction:** A byte of bulbs from M1 with a live hex readout; a draggable "lens" that visually groups the 8 bulbs into two nibbles, each showing its hex symbol.
**Discoveries:** (1) The problem: read 11011010 aloud — painful; (2) Split the byte: nibbles, each 0–15; (3) The new symbols: why A–F exist, counting past 9; (4) Colour is hex: an RGB colour mixer where he sets #RRGGBB by flipping bulbs and watches a swatch change — make "your favourite colour"; (5) Spot hex in the wild: MAC address, memory dump snippets.
**Nudge sample (make #FF0000):** ① "FF means every bulb in that pair of nibbles is lit." ② "Red channel fully on = 255. You made 255 in Module 1." ③ "1111 1111 → FF. Now leave green and blue dark."
**Watch for:** Believing computers "use" hex internally (they don't — it's for humans); mixing up nibble order.

---

### Module 3 · Switch Arithmetic
**Ref:** 1.1 (binary addition, overflow, logical shifts, two's complement) · **Needs:** M1
**Hook:** "You can read the language. Can you make it do maths?"
**Goal:** Add two positive 8-bit numbers; recognise overflow; perform logical left/right shifts and state the ×2/÷2 effect; write negative numbers in two's complement.
**Signature interaction:** A two-row adding machine — he sets both rows of bulbs; carries animate as small amber sparks drifting up-column; the sum row lights itself.
**Discoveries:** (1) 1+1 makes a spark: the four addition facts; (2) Carry chains: add numbers that cascade; (3) The byte overflows: add to push past 255, watch the spark fall off the left edge — name it *overflow*, note real-world consequences; (4) The sliding trick: shift buttons ⟵ ⟶, watch value double/halve, see bits fall off; (5) Below zero: flip-all-bits-add-one machine with a "sign lens" showing the leftmost bulb's new meaning (−128).
**Nudge sample (overflow):** ① "What's the biggest number 8 bulbs can hold?" ② "Try 200 + 100 — where would the ninth bulb go?" ③ "There is no ninth bulb. The carry is lost: that's overflow."
**Watch for:** Thinking shift always exactly ×2 (bits lost off the end); two's complement leftmost bit read as "negative sign" rather than value −128.

---

### Module 4 · Letters in the Wire
**Ref:** 1.2 (character sets: ASCII, Unicode) · **Needs:** M1
**Hook:** "In Module 1 a byte spelled YOU. Here's the real system the whole world agreed on."
**Goal:** Explain what a character set is; use ASCII to encode/decode; state why Unicode exists and its trade-off (more bits per character).
**Signature interaction:** A live keyboard→bulbs wire: he types a character, watches the byte light up; and the reverse — set bulbs, see the character. Include the trick that 'A'=65 and 'a'=97 differ by exactly one bulb.
**Discoveries:** (1) Everyone must agree: the problem of two computers with different codes (garbled-message demo); (2) The ASCII table as a neighbourhood — digits, capitals, lowercase live in blocks; (3) One bulb between A and a: case bit; (4) 128 isn't enough: type 中 or é, watch ASCII shrug — enter Unicode; (5) Encode a word of his choice, decode one left for him (a short encouraging message).
**Nudge sample:** ① "Capitals start at 65. What number would C be?" ② "C is the 3rd letter, so 65 + 2." ③ "67 → 01000011."
**Watch for:** "Unicode replaces binary" (it's still bytes, just more of them); ASCII storing the *glyph* rather than a code number.

---

### Module 5 · Pictures & Sound from Numbers
**Ref:** 1.2 (images: pixels, resolution, colour depth; sound: sample rate, sample resolution) · **Needs:** M1, ideally M2
**Hook:** "Every photo you've ever taken is a spreadsheet of numbers wearing a costume."
**Goal:** Explain pixel/resolution/colour depth and their effect on quality and file size; explain sampling, sample rate and resolution for sound.
**Signature interaction:** A paintable pixel grid with a live "raw numbers" panel — paint on one side, watch binary appear on the other; sliders for resolution (grid density) and colour depth (1-bit → 8-bit) that visibly degrade/improve his own drawing.
**Discoveries:** (1) Paint with 1 bit: pure black/white pixel art; (2) More bulbs per pixel: watch colour depth open up shades; (3) The resolution slider: same picture, four densities, live file-size counter; (4) Sound is a wiggle measured often: an interactive waveform he can "sample" by tapping points — fewer samples = chunkier playback (visual, not audio-dependent); (5) The trade-off dial: quality vs file size stated as one honest sentence he assembles himself.
**Nudge sample (file size):** ① "Size = number of pixels × bulbs per pixel." ② "Double the width AND the height — how many times more pixels?" ③ "4× the pixels, so 4× the bits."
**Watch for:** Resolution confused with physical screen size; sample *rate* vs sample *resolution* blur.

---

### Module 6 · How Big Is a Song?
**Ref:** 1.3 (units bit→PiB; file size calculation; lossy vs lossless, RLE) · **Needs:** M5
**Hook:** "Your phone says 128 GB. You're about to know exactly what that means — and why a song squashes to a tenth of its size."
**Goal:** Order the units; calculate file sizes for images/sound; explain compression purpose; distinguish lossy vs lossless; perform run-length encoding.
**Signature interaction:** An RLE squeezer — his pixel art from M5 (or a fresh grid) with a lever that visibly compresses runs of identical pixels into count+value pairs, byte tally dropping live.
**Discoveries:** (1) The ladder of units: an interactive zoom from one bulb to a pebibyte, each rung ×1024; (2) Work out a real file: image size from dimensions × depth (calculator-free, staged); (3) Sound file sizes: rate × resolution × seconds; (4) The squeeze lever: RLE on stripes vs on noise — discover *why* some pictures compress well; (5) Throwing bits away on purpose: lossy vs lossless sorted by "could you get the original back?"; sort real examples (photo backup, streaming, program file).
**Nudge sample (RLE on noise):** ① "Count the longest run of identical pixels in this noisy picture." ② "If every run is length 1, what does count+value cost per pixel?" ③ "Two values to store one — RLE made it *bigger*. Compression needs patterns."
**Watch for:** 1000 vs 1024 (syllabus uses 1024-based units); "lossless = no compression".

---

### Module 7 · The Recipe Idea
**Ref:** 7.1–7.2 (PDLC: analysis, design, coding, testing; **decomposition and abstraction** — both are 7.1 dot points) · **Needs:** nothing (Strand M entry point)
**Hook:** "Before a single line of code: how do you get a fuzzy wish — 'I want an app that…' — into steps a machine can follow?"
**Goal:** Name the four PDLC stages; decompose a problem into inputs, processes, outputs and storage; **name abstraction as keeping only what the job needs and dropping the rest — the natural companion to decomposition.**
**Signature interaction:** A decomposition sorting board — a real, warm scenario (a tuckshop till, a plant-watering gadget) whose sticky-note pieces he drags into I/P/O/S columns; notes glow amber when they land anywhere *defensible* (several placements accepted, with a gentle note when one column fits best).
**Discoveries:** (1) The four stages as a story: follow one small idea from wish to working thing; (2) Sort a simple gadget into IPOS; (3) Sort a meatier one; (4) **Abstraction: strip a real thing down to only what the job needs — a metro map keeps the stops and the lines and throws away the streets, the distances, the rivers, yet still gets you there. "Remove the detail to see the essential shape." Then mint a NAME IT for it — his own wording stress-tested against the exam phrasing ("would your definition earn the mark as written?").** (5) Spot the missing piece: a decomposition with a hole in it — what can't this system do?; (6) Decompose something from *his* life (free-text boxes, no checking — reflection only).
**Nudge sample:** ① "Ask: does this piece *come from outside*, *get worked on*, *go to a person*, or *get kept for later*?" ② "'Remember today's sales' — kept for later is which column?" ③ "Storage."
**Watch for:** Treating PDLC as strictly linear (mention looping back, lightly); output vs storage confusion; **abstraction confused with decomposition (decomposition breaks a problem into its parts; abstraction removes the parts that don't matter for the job — a map, a model, a summary).**

---

### Module 8 · Reading the Map
**Ref:** 7.4 (standard flowchart symbols; draw/complete/interpret flowcharts) · **Needs:** M7
**Hook:** "An algorithm you can walk through with your finger."
**Goal:** Name the five symbols (terminator, process, decision, input/output, flow lines); follow a flowchart with given data; complete one with missing pieces.
**Signature interaction:** A walkable flowchart — a glowing token he steps through node by node with a "step" button; at decisions, he chooses the branch and sees state update; a symbol-shape sorter where shapes snap into a legend.
**Discoveries:** (1) The five shapes: match shape to job; (2) Walk a flowchart: guess-the-number logic, watch the token loop; (3) The decision diamond: same chart, different input, different path; (4) Repair shop: a flowchart with two blank nodes and a tray of candidate pieces — state-matching, snaps when consistent; (5) Predict before you press: say (privately) where the token ends up, then step and see.
**Nudge sample (repair):** ① "Trace what the chart does BEFORE the gap — what does it have in hand?" ② "It just read a number and hasn't tested it yet. What kind of node must come next?" ③ "A diamond — the chart needs to decide something before the two arrows make sense."
**Watch for:** Diamond used for processing; arrows without direction; assuming one pass through means done (loops).

---

### Module 9 · The House Style
**Ref:** 7.4 + 8.1 pseudocode conventions (DECLARE, ←, INPUT/OUTPUT, IF/THEN/ELSE/ENDIF, CASE, loops, meaningful names, comments) · **Needs:** M7; pairs with M8
**Hook:** "Cambridge has an exact dialect for writing algorithms. It's not real code — it's tidier. Learn to *read* it here; you'll write it soon."
**Goal:** Read Cambridge-style pseudocode aloud in plain English; recognise ← as "gets"; identify declarations, I/O, comments; state why meaningful names matter.
**Signature interaction:** A translation slider — pseudocode on the left, plain-English on the right; drag a highlight bar down the code and the English line-by-line rendering lights in sync. Then reverse: match scrambled English lines to code lines (drag-to-pair, snaps on match).
**Discoveries:** (1) The arrow means "gets": ← unpacked with a box-and-label animation; (2) DECLARE is introducing a box before using it; (3) Read a 6-line snippet aloud (pairing game); (4) Names that help vs names that hide: same algorithm with `x, y, z` vs `Price, Quantity, Total` — feel the difference; (5) Comments: notes to future-you.
**Nudge sample:** ① "Read ← as 'gets' and every line becomes a sentence." ② "`Total ← Total + Price` — 'Total gets its old self plus Price'." ③ "It's adding Price onto a running total."
**Watch for:** Reading ← as equality/algebra ("Total = Total + Price is impossible!"); this is THE central misconception of the whole strand — front-load it.

---

### Module 10 · Boxes with Names
**Ref:** 8.1 (variables & constants, data types, input/output, arithmetic operators incl. MOD, DIV) · **Needs:** M9
**Hook:** "Time to stop reading the language and start commanding it."
**Goal:** Declare variables with sensible types; distinguish variable/constant; use +, −, *, /, MOD, DIV; predict outputs of short snippets.
**Signature interaction:** Live labelled boxes — a small pseudocode stepper where each DECLARE physically creates a labelled box on screen; assignments visibly drop values in; OUTPUT prints to a soft terminal. He runs everything; nothing is compiled or "wrong".
**Discoveries:** (1) Make a box, put something in it; (2) Types are box shapes: try putting "hello" in an INTEGER box — the box politely refuses (shape mismatch animation, no error text); (3) Constants are glued shut; (4) MOD and DIV as sharing sweets: 17 sweets, 5 friends — DIV gives each share, MOD is what's left in your hand (interactive sweet-splitter); (5) Predict-then-run: three tiny programs, he sets his private guess via a dial, then steps through.
**Nudge sample (MOD):** ① "Deal the sweets out one each until you can't." ② "17 dealt to 5 people: how many rounds, what's left over?" ③ "3 rounds each (DIV), 2 left over (MOD)."
**Watch for:** MOD/DIV swapped; REAL vs INTEGER division; "variable = the value" rather than a named container. (Cambridge appendix: MOD/DIV are function-call syntax — `MOD(a,b)`, `DIV(a,b)` — verify against the current appendix.)

---

### Module 11 · The Fork in the Road
**Ref:** 8.1 (IF…THEN…ELSE…ENDIF, nested IF, CASE…OF…OTHERWISE…ENDCASE; comparison & Boolean operators AND/OR/NOT) · **Needs:** M10
**Hook:** "Programs feel intelligent for exactly one reason: they can take a different path."
**Goal:** Trace and construct IF/ELSE and CASE; combine conditions with AND/OR/NOT; know when CASE beats stacked IFs.
**Signature interaction:** A literal branching path — the code renders as a garden path splitting at each condition; he sets input values on dials, presses "walk", and a lantern travels the route taken, dimming the road not taken.
**Discoveries:** (1) One fork: age-gate style example (kept neutral — cinema ticket pricing); (2) The ELSE path exists even when empty; (3) Stacking forks vs CASE: same menu problem both ways, count the reading effort; (4) AND is a narrow gate, OR is a wide one: two-condition gate with physical double-doors visual; (5) NOT flips the sign on the gate; (6) Build-a-fork: assemble an IF from parts to match a plain-English rule (drag-snap, state-matching).
**Nudge sample (AND/OR):** ① "AND needs both doors open; OR needs at least one." ② "Rain AND cold → coat. It's raining but warm — does the rule fire?" ③ "No: AND fails if either part fails."
**Watch for:** OR read as exclusive ("one or the other, not both"); missing ENDIF; nested IF indentation drift.

---

### Module 12 · Round and Round
**Ref:** 8.1 (FOR…TO…NEXT with STEP, WHILE…DO…ENDWHILE, REPEAT…UNTIL; choosing the right loop) · **Needs:** M11
**Hook:** "Everything computers are feared and admired for comes down to this: they repeat without getting bored."
**Goal:** Trace all three loop types; choose the right loop for a job (known count vs condition-checked-first vs at-least-once); spot infinite loops.
**Signature interaction:** A loop engine — a circular track the lantern runs; the loop counter/condition displays on a station board each lap; he can slow, step, or let it run. An "infinite loop" discovery lets him build one safely and hit a friendly big red-herring "pull the plug" lever.
**Discoveries:** (1) FOR: a countdown he parameterises (start, end, STEP dials); (2) WHILE checks *before* boarding: a loop that may run zero times — make it do so; (3) REPEAT checks *after*: guaranteed one lap — the password-retry shape; (4) Pick the loop: six tiny scenarios sorted onto three platforms (state-matching sort); (5) The runaway train: build WHILE x < 10 but forget to change x — watch, laugh, pull the plug; name the bug.
**Nudge sample (choose loop):** ① "Do you know in advance how many laps? FOR. Otherwise: must it run at least once?" ② "'Keep asking until the answer is YES' — could it succeed on the first ask?" ③ "It must ask at least once → REPEAT…UNTIL."
**Watch for:** Off-by-one on FOR bounds; WHILE/REPEAT zero-vs-one execution; forgetting the loop variable update.

---

### Module 13 · The Journey of a Message
**Ref:** 2.1 (packets: structure — header/payload/trailer; packet switching; benefits/drawbacks) · **Needs:** nothing (Strand S resumes)
**Hook:** "When you send a photo, it's torn into pieces, the pieces travel different roads, and they still arrive as your photo. Here's how."
**Goal:** Describe packet structure; explain packet switching; state why packets may arrive out of order and how order is restored.
**Signature interaction:** A message shredder & network map — he types a short message, watches it split into numbered packets (header/payload/trailer visually distinct), then releases them onto a node map where they animate along *different* routes and reassemble by sequence number at the far end.
**Discoveries:** (1) Anatomy of one packet: label the three parts (drag-snap); (2) Release the packets: watch divergent routes; (3) Out of order on purpose: a slider adds "congestion" to one route — packets arrive jumbled, reassembly still works, discover *why* (sequence numbers); (4) A packet goes missing: what the trailer/receiver does about it (foreshadows M14); (5) Why bother?: sort benefits/drawbacks of packet switching (route around damage, no reserved line / hops add delay, reassembly overhead).
**Nudge sample:** ① "Look at what every packet carries besides the message piece." ② "Each header holds a number. What's it for at the far end?" ③ "Sequence numbers let the receiver rebuild the original order — routes stop mattering."
**Watch for:** Believing packets follow one fixed path; header contents (destination + sequence, not "the whole address book").

---

### Module 14 · Did It Arrive Intact?
**Ref:** 2.1–2.2 (serial/parallel, simplex/half/full duplex, USB; parity, checksum, echo check, check digits, ARQ) · **Needs:** M13, M1
**Hook:** "Wires are noisy places. One bulb flips in transit and 'HELLO' becomes 'HALLO'. Computers catch this millions of times a second."
**Goal:** Compare serial vs parallel and the three duplex modes; perform parity checks (odd/even); explain checksums, echo check, check digits (ISBN-style), and ARQ with timeout.
**Signature interaction:** A noisy wire — he sends bytes across a wire with a "gremlin" dial that randomly flips a bulb mid-flight; then he plays receiver, using parity to catch (or famously miss) the damage.
**Discoveries:** (1) One lane or eight: serial vs parallel race with a distance slider (parallel skew at length); (2) Walkie-talkie, corridor, phone call: sort real links into simplex/half/full duplex; (3) The parity trick: set the ninth bulb so lit-count is even; gremlin flips one; catch it; (4) The gremlin flips TWO: parity fooled — discover the limitation himself; (5) Ask again: ARQ as send→check→acknowledge or timeout→resend, played as a card exchange; (6) The last digit isn't part of the number: check digits on a barcode he can corrupt.
**Nudge sample (two flips):** ① "Count the lit bulbs after the gremlin strikes twice." ② "Even count again — what does the receiver conclude?" ③ "It sees nothing wrong. Parity catches odd numbers of errors only — that's why checksums exist too."
**Watch for:** Parity "corrects" errors (it only detects); duplex vs number of wires; ARQ direction of acknowledgement.

---

### Module 15 · Locked Letters
**Ref:** 2.3 (purpose of encryption; symmetric vs asymmetric; plaintext/ciphertext/key) · **Needs:** M4 helpful
**Hook:** "Two strangers who have never met agree a secret in full view of everyone listening. This should be impossible. It happens every time you open a website."
**Goal:** Define plaintext, ciphertext, key; explain symmetric encryption and its key-sharing problem; explain asymmetric public/private keys at syllabus depth.
**Signature interaction:** A two-lockbox bench — symmetric: one key, shared (and a snoop who copies it in transit); asymmetric: a padlock anyone may snap shut (public) that only one key opens (private). He physically drags messages, locks, keys.
**Discoveries:** (1) Scramble with a shared key: a simple substitution he keys himself, friend unscrambles; (2) The courier problem: watch the snoop copy the shared key — feel the flaw; (3) The open padlock trick: post padlocks publicly, keep the key; snoop grabs a padlock and… can lock things, never open them; (4) Which is which: sort scenarios (website padlock icon, two ministry offices with a pre-shared key) onto benches; (5) Vocabulary lock-in: plaintext/ciphertext/key matched by drag-pair.
**Nudge sample:** ① "Ask: how did the unlocking key travel?" ② "If it never travelled at all, which system is it?" ③ "Asymmetric — the private key stays home; only padlocks go out."
**Watch for:** "Public key decrypts" reversal; encryption prevents interception (it doesn't — it makes intercepted data useless).

---

### Module 16 · Meet the Machine
**Ref:** 3.1 partial (CPU components ALU/CU/registers PC, MAR, MDR, ACC, IR) · **Needs:** M1
**Hook:** "Every program you've written since Module 1 runs on one small machine with a name for every part."
**Goal:** Name CPU components and the five registers with their jobs, met in small groups rather than all at once.
**Signature interaction:** The machine map — a single schematic of all seven parts inside a CPU boundary, plus one external memory node outside it, that builds up across the module's discoveries: each one lights up and labels the 2-3 parts it just taught, on the same persistent diagram, with a gentle ambient flow animation along the CPU–memory link (reduced-motion safe, ornamental only — no cycle is actually run yet).
**Discoveries:** (1) The two workers: CU and ALU (drag-pair) — the decider and the calculator; (2) The fetch trio: PC, MAR and MDR — next, where, and what; (3) The instruction and the notepad: CIR and ACC — what's being obeyed vs the running number; (4) Sort the whole crew: a recap match across all seven, now that the map is complete.
**Nudge sample (MAR vs MDR):** ① "Ask whether this job is a place, a thing, or a role." ② "MAR and PC both hold addresses — what's different about *when* each one applies?" ③ "PC always points at what's next; MAR points at what's being looked up right now. MDR is the odd one out — it never holds an address at all."
**Watch for:** MAR/MDR swapped (address vs data); PC vs MAR (next vs now); thinking the ALU stores results long-term.

---

### Module 17 · One Shared Cabinet
**Ref:** 3.1 cont. (Von Neumann; buses) · **Needs:** M16
**Hook:** "Instructions and data live in the exact same cabinet."
**Goal:** State the Von Neumann idea (one shared memory for instructions and data); identify address/data/control buses from a description or from a named register.
**Signature interaction:** The same machine map from Module 16, now fully met — its bus strip lights up address/teal, data/amber or control/grey as parcels are sorted onto the correct road, so the diagram picks up colour rather than being redrawn.
**Discoveries:** (1) One shared filing cabinet: sort five memory cells into instruction/data, then meet the twist — nothing about the storage itself told them apart; (2) The three roads: colour-coded buses, six parcels sorted to the road that carries them (state-match, echoed onto the shared map); (3) Which register, which road?: the same three roads, read a second way, straight off a named register; (4) Fetch, decode, execute — the shape of it: order the three named stages bird's-eye, before watching a single step run.
**Nudge sample (buses):** ① "Ask what the parcel actually IS: a place, a thing, or a bare instruction to memory itself." ② "A place is always the Address bus; a thing being moved is always the Data bus." ③ "A command with nothing else attached, like 'read' or 'write', is always the Control bus, and only the Control bus."
**Watch for:** Believing instructions and data are stored differently (the Von Neumann point is that they aren't); control bus carrying data.

---

### Module 18 · The Loop That Never Stops
**Ref:** 3.1 cont. (fetch–decode–execute) · **Needs:** M17
**Hook:** "Everything you've met since Module 16 runs on one loop that never stops."
**Goal:** Describe the FDE cycle in order, with a crank-driven fetch, an ADD execute, and a full 3-line program.
**Signature interaction:** The same machine map, now crank-driven — values visibly travel the buses between PC → MAR → memory → MDR → CIR; ACC accumulates. Tiny 3-instruction programs (LOAD, ADD, STORE at concept level), using the very memory cells sorted in Module 17.
**Discoveries:** (1) Remember the crew?: a quick three-question warm-up, not the full seven; (2) One full fetch: crank through and watch PC increment — discover *when* it increments; (3) Decode and execute an ADD: ACC changes before his eyes; (4) Run a whole 3-line program on the crank; predict ACC's final value first (private guess dial).
**Nudge sample (PC timing):** ① "Watch the PC across one complete fetch." ② "Did it change before or after the instruction arrived in the CIR?" ③ "During fetch — it's already pointing at the *next* instruction while this one executes."
**Watch for:** Thinking the ALU stores results long-term; assuming a step needs a bus when it's happening entirely inside the CPU.

---

### Module 19 · Faster, Smaller, Everywhere
**Ref:** 3.1 cont. (cores, cache, clock speed & performance; instruction set concept; embedded systems) · **Needs:** M18
**Hook:** "Why does a £1,200 phone feel fast? And why does your washing machine — also a computer — cost less than the phone case?"
**Goal:** Explain how clock speed, cores and cache affect performance (and the honest limits of each); define instruction set; identify embedded systems and their characteristics.
**Signature interaction:** A build-a-chip bench — sliders for clock/cores/cache with an animated workload (many small tasks vs one long task) showing where each upgrade helps and where it doesn't (one long task ignores extra cores — discoverable, not stated).
**Discoveries:** (1) The metronome: clock speed as ticks of the M18 crank, automated; (2) More hands: cores vs a stubbornly serial task; (3) The nearby shelf: cache as keeping busy tools within reach; (4) The dictionary of doables: instruction set in one screen; (5) Computers in disguise: sort household objects into embedded / general-purpose, then match embedded traits (dedicated function, firmware, low power).
**Nudge sample (cores):** ① "Give the long single task four workers. Time it." ② "No faster — why might that be?" ③ "The task can't be split; extra cores help only when work runs in parallel."
**Watch for:** "More GHz always = proportionally faster"; embedded = small (it's about *dedicated function*).

---

### Module 20 · Senses and Voices
**Ref:** 3.2 (input & output devices incl. sensors: acoustic, accelerometer, flow, gas, humidity, infrared, level, light, magnetic field, moisture, pH, pressure, proximity, temperature) · **Needs:** none hard
**Hook:** "A computer in a box is deaf and mute. Devices are its senses and its voice — and your phone has more senses than you do."
**Goal:** Classify devices as input/output; describe uses of the syllabus sensor list; pair sensors to scenarios.
**Signature interaction:** A scenario workshop — real systems (greenhouse, car park barrier, fitness band, aquarium) drawn as scenes with empty sensor sockets; he drags sensors from a labelled tray into sockets; a socket glows when the fit is defensible; some scenes accept multiple correct answers on purpose.
**Discoveries:** (1) In or out: rapid-sort a device pile; (2) Kit the greenhouse (moisture, temperature, light, humidity); (3) Kit the car park (proximity, pressure, infrared); (4) The weird ones: pH, magnetic field, accelerometer — each with one vivid use; (5) Design your own: pick any real place he knows and socket it (open-ended, reflection only).
**Nudge sample:** ① "Ask what the system needs to *know*, then which sensor measures exactly that." ② "The barrier must know a car is present without touching it." ③ "Proximity or infrared both work — the mark scheme would take either."
**Watch for:** Sensor vs the thing it enables (a sensor measures; the actuator acts); touchscreens as both input AND output.

---

### Module 21 · Where Things Live
**Ref:** 3.3 (primary: RAM/ROM; secondary: magnetic, optical, solid-state; virtual memory; cloud storage) · **Needs:** M6 helpful
**Hook:** "Close an unsaved document and it's gone. Save it and it survives a power cut. Two different worlds of memory — plus a third that lives on someone else's computer."
**Goal:** Distinguish RAM/ROM; compare magnetic/optical/solid-state on speed, cost, durability, capacity; explain virtual memory's purpose and cost; evaluate cloud storage.
**Signature interaction:** A memory city map — districts for primary/secondary/cloud; a power-cut switch that visibly wipes RAM while everything else survives; a "RAM is full" scenario that triggers the virtual-memory shuttle bus to disk, with a visible speed penalty.
**Discoveries:** (1) Pull the plug: what survives; (2) ROM, the unforgetting: why boot instructions live there; (3) Three warehouses: spin-drive, disc, chip — trade-off cards he arranges into a comparison table (state-match); (4) The overflow bus: open "too many apps", watch pages shuttle, feel the slowdown; (5) Someone else's computer: cloud pros/cons sort, including the honest ones (needs internet, trust, ongoing cost).
**Nudge sample (virtual memory):** ① "Where do the extra pages go when RAM fills?" ② "Is the disk faster or slower than RAM?" ③ "Much slower — virtual memory keeps things *running*, not running *fast*."
**Watch for:** ROM read as "storage for files"; virtual memory as "extra RAM for free"; SSD called a disk drive with different marks.

---

### Module 22 · The Detective's Table
**Ref:** 7.3 (trace tables: complete a trace table to document a dry run; identify errors) · **Needs:** M10–M12
**Hook:** "You can now predict what any short program does before it runs — like reading a suspect's plan from their notes. This is the single most powerful skill in the whole course."
**Goal:** Complete trace tables for algorithms with variables, loops, selection; use a trace to find a logic error; state an algorithm's purpose from its trace.
**Signature interaction:** A self-checking trace grid — code on the left with a moving highlight; a table on the right that he fills cell by cell (number pads, no typing friction); a filled cell glows amber when consistent with the machine's own trace, or shows a soft "look again at line 4" pointer. Crucially: the *machine* is stepping alongside him, hidden, so checking is instant and private — no accumulation of wrongness, cells simply aren't-lit-yet.
**Discoveries:** (1) Trace a 4-liner: two variables, no loop; (2) Trace a FOR loop: watch the rhythm of columns; (3) Trace with an IF inside a loop: rows where nothing changes are still rows; (4) The broken algorithm: trace it and catch where reality diverges from intention — name the bug in a picker; (5) What is it FOR?: trace a mystery algorithm, then choose its purpose from four warm options.
**Nudge ladder is built into the mechanic here** — the "look again" pointers ARE graduated prompts. Add one strategy nudge: "Only write in a column when its variable actually changes on that line."
**Watch for:** Updating every column every row; tracing what the code *should* do rather than what it says; skipping the final loop check.

---

### Module 23 · Words Under the Microscope
**Ref:** 8.1 (string handling: LENGTH, SUBSTRING, UCASE, LCASE; library routines: ROUND, RANDOM; MOD/DIV revisited) · **Needs:** M10
**Hook:** "Your name is data. Time to slice it, flip it, and measure it."
**Goal:** Use LENGTH, SUBSTRING (with Cambridge's parameter order), UCASE/LCASE; use ROUND and RANDOM; combine them in small expressions.
**Signature interaction:** A string operating table — he types any word (his name, anything); the word appears as physical letter tiles with position numbers; SUBSTRING renders as an adjustable bracket he slides and stretches over the tiles, output updating live.
**Discoveries:** (1) Measure it: LENGTH on words he chooses, including the space-counts-too surprise; (2) The sliding bracket: SUBSTRING(word, start, count) — discover that the second number is *where* and the third is *how many*; (3) SHOUTING and whispering: UCASE/LCASE, plus why comparisons often UCASE both sides first; (4) Dice inside the machine: RANDOM, and ROUND to tame it; (5) Build a monogram: combine SUBSTRING + UCASE to pull initials from a full name (state-matching — bracket positions, no typing code).
**Nudge sample (SUBSTRING):** ① "Slide the bracket so it starts at the 3rd tile." ② "Now stretch it to cover 4 tiles." ③ "SUBSTRING(word, 3, 4) — position first, length second. Cambridge counts from 1."
**Watch for:** Zero-based counting habits from any prior exposure (Cambridge is 1-based); SUBSTRING's third argument read as an end position.

---

### Module 24 · Many Boxes, One Name
**Ref:** 8.2 (1D and 2D arrays: declare with bounds, index, iterate with FOR, nested FOR for 2D) · **Needs:** M12, M22
**Hook:** "Storing 30 scores in 30 separately named boxes would be misery. So: one name, many numbered compartments."
**Goal:** Declare and index 1D/2D arrays; process arrays with (nested) FOR loops; trace array algorithms.
**Signature interaction:** A pigeonhole wall — an array rendered as a physical wall of compartments with the index engraved on each; code steps light compartments as they're read/written; for 2D, the wall becomes a grid and nested loops sweep it visibly row by row (the sweep pattern is the "aha").
**Discoveries:** (1) One name, five compartments: fill Scores[1..5] by hand; (2) The loop meets the wall: FOR i ← 1 TO 5 sweeps it — watch i drive the index; (3) Read out of bounds: reach for compartment 6 of 5 — the wall just… ends (gentle "there's no compartment there" — name the error kindly); (4) The grid: 2D seating plan, address a seat as [row, column]; (5) The sweep: nested FORs paint the grid in reading order; change loop order and watch it paint in *columns* instead — feel what nesting order means; (6) Mini-trace: trace a find-the-largest sweep on the wall (bridges to M25).
**Nudge sample (nesting):** ① "Watch which counter changes fastest as the grid paints." ② "The inner loop finishes a whole row before the outer loop moves down." ③ "Inner = columns, outer = rows — swap them and the sweep turns sideways."
**Watch for:** Index vs contents ("compartment 3" vs "the number 3"); bounds off-by-one; [row, col] order.

---

### Module 25 · The Classics
**Ref:** 7.5 (standard methods: totalling, counting, max/min/average, linear search, bubble sort; 8.1 use in code) — binary search is NOT in 0478; do not include beyond an optional "beyond the syllabus" whisper · **Needs:** M24
**Hook:** "Five little algorithms run the world's paperwork. You already have every piece they're made of."
**Goal:** Trace and construct totalling, counting, max/min/average, linear search, and bubble sort in pseudocode over arrays.
**Signature interaction:** The pigeonhole wall from M24 with algorithm "lenses" — clip on the *linear search* lens and watch the checking finger move compartment to compartment; clip on *bubble sort* and adjacent compartments physically swap with a soft animation; a pass counter and "swaps this pass" tally make the stop-condition discoverable.
**Discoveries:** (1) The running total: watch Total grow along the wall; (2) Counting with a condition: how many scores over 50; (3) King of the wall: max via the challenger metaphor (current champion vs each challenger); (4) The patient finger: linear search, including the not-found case and *why* you must check to the very end; (5) Bubbles rise: run bubble sort on a short array HE scrambles; discover that a pass with zero swaps means done; (6) Assemble one: drag pseudocode lines into order to rebuild max-finder (state-match snap).
**Nudge sample (bubble stop):** ① "Watch the swap tally on the last pass." ② "Zero swaps happened. What must be true of the wall?" ③ "Already in order — that's the signal to stop, and it's how the algorithm knows without 'seeing' the whole array."
**Watch for:** Initialising Max to 0 instead of the first element (breaks on all-negative data — let him discover via a trap array offered as an optional extra); bubble sort "sorted after one pass".

---

### Module 26 · Gatekeepers
**Ref:** 7.6 (validation: range, length, type, presence, format, check digit; verification: double entry, visual check; test data: normal, abnormal, extreme, boundary) · **Needs:** M11
**Hook:** "Every form you've ever filled in had a bouncer. Meet the bouncer."
**Goal:** Name and construct the validation checks; distinguish validation from verification; choose normal/abnormal/extreme/boundary test data for a given rule.
**Signature interaction:** The velvet rope — a nightclub-door scene where data items queue to enter a system; he equips the doorman with checks (range, length, type, presence, format) and releases the queue, watching each item admitted or politely turned away with the reason on a little sign. Then he switches sides and plays *saboteur*: crafting test data designed to probe someone else's door.
**Discoveries:** (1) Equip the door: match five checks to what they catch; (2) Release the queue: predict each item's fate first; (3) Valid ≠ true: an item that passes every check but is still wrong (age 12 typed as 21) — discover the limit of validation, and why verification (double entry / visual check) exists; (4) The saboteur's kit: for rule "1–100 inclusive", craft one normal, one abnormal, one extreme, one boundary value — the door reports which category each probe was (state-matching: craft until all four categories light); (5) Check digit reprise: link back to M14.
**Nudge sample (boundary):** ① "Boundary data lives exactly at the edges of the rule." ② "The rule says 1–100 inclusive. Which numbers sit ON the fence?" ③ "1 and 100 (valid boundaries) — and 0 and 101 are the extreme/abnormal neighbours worth probing too."
**Watch for:** Validation confused with verification (THE classic); "extreme" vs "abnormal" (extreme is valid-but-at-the-limits in Cambridge's usage); believing validation guarantees correctness.

---

### Module 27 · Building Blocks
**Ref:** 8.1 (procedures & functions: define/call, parameters, RETURN, RETURNS type; local vs global scope) · **Needs:** M12, M23
**Hook:** "Real programs aren't one long scroll. They're built from named, reusable blocks — write once, use forever."
**Goal:** Define and call procedures and functions with parameters; distinguish the two (RETURN); explain local vs global variables.
**Signature interaction:** A workshop of machines — each procedure/function is a physical machine with input hoppers (parameters) and, for functions only, an output chute (RETURN); the main program is a conveyor that visits machines; local variables visibly live INSIDE a machine's glass case and vanish when it stops.
**Discoveries:** (1) Build a procedure: a Greet machine with one hopper; call it three times with different names — feel the reuse; (2) The output chute: convert a procedure into a function; watch RETURN send a value back onto the conveyor; (3) Hoppers in order: two parameters, swap the arguments, enjoy the polite chaos; (4) The glass case: a local variable inside vs a global on the factory floor — try to read a local from outside (it's simply not there); (5) Spot the difference: sort code snippets into procedure vs function piles by one tell (RETURNS).
**Nudge sample (scope):** ① "Where was Count born — inside a machine or on the factory floor?" ② "Inside. The machine has stopped. Where is Count now?" ③ "Gone — locals live and die with their block. That's a feature: no accidental interference."
**Watch for:** Calling a function but discarding its return; parameters vs arguments naming; assuming variables are global by default in all languages.

---

### Module 28 · Talking to the Network
**Ref:** 3.4 (NIC, MAC addresses, IP addresses IPv4/IPv6, static vs dynamic IP, routers) · **Needs:** M2, M13
**Hook:** "Your device has two names: one burned in at the factory forever, one borrowed for the afternoon."
**Goal:** State the NIC's role; distinguish MAC (permanent, hex, hardware) from IP (logical, changeable); IPv4 vs IPv6 at recognition level; explain what a router does.
**Signature interaction:** A device passport office — his "device" gets a MAC engraved (in hex — M2 payoff) and then queues for an IP visa stamped by the router; move the device to a new café network and watch which identifier changes and which never does.
**Discoveries:** (1) The engraving: MAC format, read a real-looking one in hex; (2) The visa: join a network, receive an IP; (3) Move house: new network, new IP, same MAC — the core distinction, discovered not stated; (4) Running out of numbers: IPv4's 4 billion vs IPv6's absurd abundance (a zoom-out visual); (5) The postmaster: router forwarding packets between networks — extend the M13 map with a router node he operates for three packets.
**Nudge sample:** ① "After moving networks, compare the passport's two pages." ② "Which page did the new office stamp?" ③ "Only the IP page — MAC is engraved at manufacture and never changes."
**Watch for:** MAC and IP treated as interchangeable "addresses"; router vs NIC roles; thinking IPv6 is "IPv4 but longer" without the why.

---

### Module 29 · The Software Layers
**Ref:** 4.1 (system vs application software; OS functions; interrupts & their handling; firmware, bootloader) · **Needs:** M16
**Hook:** "Between you tapping the screen and the transistors doing physics sits a stack of software layers, each translating for the one below. And a system of polite interruptions keeps it all responsive."
**Goal:** Classify system vs application software; list OS functions (memory management, file management, security, hardware/peripheral management, user interface, multitasking); explain interrupts with examples and why they matter.
**Signature interaction:** A living layer diagram — hardware at the bottom, OS as a bustling middle floor with six labelled offices (the OS functions), apps on top; he triggers real events (print job, key press, low battery) and watches the interrupt bell ring, the CPU bookmark its place, service the interrupt, and resume.
**Discoveries:** (1) Sort the software pile: system vs application (browser, OS, compiler, game, driver, utility); (2) The six offices: match OS functions to mini-scenarios; (3) Ring the bell: fire an interrupt mid-task, watch save-state → service → resume; (4) Why not just wait?: compare polling vs interrupts by watching the CPU waste laps checking a silent printer; (5) The morning routine: firmware/bootloader as the sequence from power-on to OS (order-the-steps snap).
**Nudge sample (interrupts):** ① "Watch what the CPU does the instant the bell rings." ② "It wrote something down before leaving. What and why?" ③ "Its place — so it can resume exactly where it left off. Interrupts pause, never destroy."
**Watch for:** Interrupt = error (it's routine!); OS as "the desktop picture"; firmware vs OS.

---

### Module 30 · From Human to Machine
**Ref:** 4.2 (high-level vs low-level languages; assembly; compilers, interpreters, assemblers; IDE features) · **Needs:** M18, M9
**Hook:** "You've been writing in a language for humans. The CPU from Module 18 only eats bulbs. Somebody has to translate — and the two main translators have very different personalities."
**Goal:** Compare high-level and low-level languages (pros/cons); describe compiler vs interpreter behaviour and trade-offs; state what an assembler does; name IDE features (editor, auto-correct/prettyprint, auto-completion, debugger/run-time environment, translator built in).
**Signature interaction:** The two translators — the same 5-line program handed to Compiler (translates ALL of it, hands over a sealed executable, then goes home) and Interpreter (walks through line by line, alive at runtime, stops AT the error line). A bug is planted on line 4: watch each translator handle it — the whole distinction falls out of one comparison.
**Discoveries:** (1) The ladder of languages: same tiny task in high-level, assembly, machine code — feel the readability gradient (M1/M18 payoff); (2) The two personalities: run the line-4 bug through both; (3) Who's faster, who's friendlier: sort trade-off cards onto each translator; (4) The assembler's small job: assembly mnemonics → machine code, 1:1; (5) Tour the workshop: an IDE mock where he hovers five features and matches them to what they save him from.
**Nudge sample:** ① "Where did each translator stop when it hit line 4?" ② "The compiler reported it before running anything; the interpreter ran lines 1–3 first." ③ "Compilers translate everything up front; interpreters discover problems live, line by line."
**Watch for:** "Compiled programs need the compiler to run" (they don't — that's the point); interpreter = slower *always* framing (nuance: development convenience); assembler translating high-level code.

---

### Module 31 · Filing Cabinets that Answer Back
**Ref:** 9.1 (single-table databases; fields/records; data types; primary keys; SQL: SELECT, FROM, WHERE, ORDER BY, SUM, COUNT, AND/OR) · **Needs:** M11 helpful
**Hook:** "A spreadsheet you can interrogate in something close to English — and it answers instantly, every time, without sighing."
**Goal:** Define field/record/table/primary key; choose sensible data types; write SQL queries with SELECT/FROM/WHERE/ORDER BY and SUM/COUNT.
**Signature interaction:** A live queryable table — a friendly dataset (a fictional bubble-tea shop's orders, or let him theme it) rendered as a real table; he composes SQL by snapping clause-tiles together (SELECT tile + field chips + WHERE tile + condition dials); results filter LIVE as tiles snap, so the query is never "run and judged" — it just continuously shows what it currently means.
**Discoveries:** (1) Anatomy: fields vs records by clicking around the table; why one column must be unique (try to add a duplicate key — the table politely declines); (2) First question: SELECT two fields FROM the table; (3) Narrow it: WHERE with a condition dial; combine with AND/OR (M11 payoff); (4) Line them up: ORDER BY, ASC/DESC toggle; (5) Let it count: COUNT and SUM tiles; (6) Answer three real questions about the data by building queries (state-matching: the target answer card lights when his live result matches).
**Nudge sample:** ① "Which clause chooses *columns* and which chooses *rows*?" ② "You want cheap orders only — rows. Which tile filters rows?" ③ "WHERE Price < 5 — SELECT picks columns, WHERE picks rows."
**Watch for:** SELECT filtering rows (the classic swap with WHERE); primary key as "the first column"; quotes around numbers vs text.

---

### Module 32 · The Logic Machines
**Ref:** 10.1 (NOT, AND, OR, NAND, NOR, XOR: symbols, functions; truth tables up to 3 inputs) · **Needs:** M11 (AND/OR intuition), M1
**Hook:** "Underneath every IF statement, every ADD, every pixel: six tiny machines that each answer one yes/no question. Meet all six."
**Goal:** Recognise the six gate symbols; state each gate's function; complete truth tables from a gate or expression (up to 3 inputs, 8 rows).
**Signature interaction:** A gate test-bench — each gate as a physical component with input switches (M1 bulbs reborn) and an output lamp; he *discovers* each gate's personality by trying all input combinations, filling its truth table himself as he goes (table rows light as their combination is physically tested — the table isn't an exercise, it's a lab notebook).
**Discoveries:** (1) NOT, the contrarian; (2) AND & OR on the bench: confirm M11 intuitions formally; (3) The N-twins: NAND and NOR as gates wearing a NOT hat (bubble = hat); (4) XOR, the difference detector: discover its "exactly one" rule, connect to M3's addition sparks; (5) Three inputs, eight rows: the counting pattern of a 3-input table IS binary counting (M1 full-circle moment — the 000→111 column pattern); (6) Name that gate: mystery gates identified from behaviour alone.
**Nudge sample (XOR):** ① "Try the four combinations and watch when the lamp lights." ② "It lit for 01 and 10 but not 00 or 11." ③ "XOR answers 'are these two DIFFERENT?' — that's the whole gate."
**Watch for:** NAND/NOR read as "not-quite AND/OR" without precision; truth table row order (teach the binary-counting convention explicitly — it's also a marks safeguard).

---

### Module 33 · Circuits from Sentences
**Ref:** 10.1 cont. (create circuits from problem statements / expressions / truth tables; complete truth tables; write logic expressions; max 3 inputs, 1 output) · **Needs:** M32
**Hook:** "Now wire the six machines together. A safety alarm, a vending machine, a greenhouse fan — every rule you can say in a sentence, you can build in gates."
**Goal:** Build a circuit from a problem statement, expression, or truth table; derive a truth table from a circuit; write the expression for a circuit — all three directions of the syllabus triangle.
**Signature interaction:** A wiring board — drag gates from the M32 bench onto a canvas, drag wires between them, flip the input switches and watch signal glow propagate live through the wires to the output lamp; a target truth table sits alongside, its rows lighting as his circuit reproduces them (state-matching at its purest — the circuit is right when all 8 rows glow, and until then it's simply "not finished yet").
**Discoveries:** (1) Wire your first pair: (A AND B) OR C, watch propagation; (2) Sentence to circuit: "the alarm sounds if the door opens while armed, or the smoke sensor fires" — translate clause by clause; (3) Circuit to table: given a mystery circuit, populate its table by testing (M32's lab-notebook mechanic); (4) Table to circuit: the reverse challenge, one row at a time; (5) Circuit to expression: read the wiring backwards into brackets; (6) The commission: one full problem statement → circuit → table → expression, the complete exam triangle disguised as finishing a client's job.
**Nudge sample (sentence→circuit):** ① "Underline the joining words in the sentence: while, or." ② "'While' means both must be true at once. Which gate is that?" ③ "AND for (door open, armed), then OR the smoke input into it."
**Watch for:** Bracket-order in expressions vs circuit layering; simplifying circuits (Cambridge says build as stated, WITHOUT simplification — flag this explicitly, it costs real marks); more than 2 inputs into one gate (limit: 2, except NOT's 1).

---

### Module 34 · The Web Beneath the Web
**Ref:** 5.1 (internet vs WWW; URLs; HTTP/HTTPS; browser functions; DNS; cookies: session vs persistent) · **Needs:** M13, M28
**Hook:** "The internet and the web are not the same thing — one is roads, one is what's delivered on them. And every address you type sets off a scavenger hunt you never see."
**Goal:** Distinguish internet/WWW; dissect a URL; explain the browser's jobs; walk the DNS lookup chain; compare HTTP/HTTPS; explain session vs persistent cookies with honest pros/cons.
**Signature interaction:** The address decoder + journey map — he types (or picks) a URL, it explodes into labelled parts (protocol/domain/path), then a "go" lever runs the full journey as an animated relay: browser → DNS lookup → IP returned → request → packets (M13 cameo) → page assembles. Each relay leg is pausable and inspectable.
**Discoveries:** (1) Roads vs deliveries: sort statements into internet/WWW piles; (2) Explode a URL; (3) The phonebook nobody sees: DNS as name→number lookup (M28 payoff); (4) The padlock: HTTP vs HTTPS with the M15 lockboxes cameo — watch a snoop read one journey and not the other; (5) The memory of websites: session cookie (evaporates with the tab) vs persistent cookie (survives) shown as two kinds of wristband; sort honest uses (staying logged in, baskets) and concerns (tracking).
**Nudge sample (DNS):** ① "The browser has a name but the network needs a number. Who translates?" ② "Watch the first stop of the relay." ③ "The DNS server returns the IP for the domain — only then can the real request begin."
**Watch for:** Internet = WWW (THE distinction the syllabus loves); cookies as programs/viruses; HTTPS "hides the website you visited" overstatement.

---

### Module 35 · Money Made of Maths
**Ref:** 5.2 (digital currency; blockchain: process of tracking transactions, blocks, hashing/chaining at syllabus depth) · **Needs:** M34 helpful
**Hook:** "A currency with no bank, no vault, no country — kept honest by everyone watching everyone, and by mathematics that makes lying spectacularly expensive."
**Goal:** Define digital currency; explain the problem it solves (trust without a central authority); describe blockchain as a chain of time-stamped transaction blocks where tampering breaks the chain.
**Signature interaction:** A tamper-evident ledger — a visible chain of blocks, each carrying transactions and a "fingerprint" of the previous block; he plays villain, sneaks into block 3 and edits a transaction — and watches every subsequent block's fingerprint mismatch cascade down the chain in red-shifted amber, while copies of the ledger held by other nodes calmly disagree with his.
**Discoveries:** (1) The trust problem: a village IOU ledger with one corruptible bookkeeper; (2) Everyone keeps the book: distribute the ledger, retry the fraud; (3) Chained fingerprints: how each block grips the last; (4) Be the villain: tamper and watch the cascade — the module's whole payoff; (5) Sort it out: which claims about digital currency are in-syllabus fact vs hype (kept neutral and factual).
**Nudge sample:** ① "After your edit, compare block 4's stored fingerprint with block 3's new one." ② "They no longer match. What would you have to redo to hide the edit?" ③ "Every block after it, on MOST copies of the ledger, faster than everyone else adds new ones — that's why tampering fails."
**Watch for:** Blockchain = Bitcoin only; "encryption" vs hashing confusion (keep at syllabus depth: fingerprints/digests, no algorithms); investment talk — stay factual, no financial angles.

---

### Module 36 · The Defenders
**Ref:** 5.3 (threats: brute-force, data interception, DDoS, hacking, malware — virus, worm, Trojan, spyware, adware, ransomware — pharming, phishing, social engineering; protections: access levels, anti-malware, authentication incl. 2FA & biometrics, automating software updates, spelling/link checking, firewalls, privacy settings, proxy servers, SSL) · **Needs:** M15, M34
**Hook:** "Every attack on a computer system targets the same weak point — and it's usually not the computer."
**Goal:** Describe each threat and how it works; match protections to the threats they counter; recognise phishing tells.
**Signature interaction:** Threat & shield pairing table — a two-sided card system: threat cards (each with a 15-second animated "how it works" vignette) and shield cards; he pairs them on a board where defensible pairings click in (several threats accept multiple shields — the board says "also works" rather than "wrong"). Plus a phishing line-up: five messages, spot the tells by tapping suspicious elements directly in the message (sender address, urgent tone, mismatched link) — tells glow when found, untapped ones simply wait.
**Discoveries:** (1) The malware family album: six types distinguished by ONE trait each (virus attaches, worm travels alone, Trojan lies about itself…); (2) Attacks on the wire vs attacks on the person: sort threats into technical vs social engineering; (3) The phishing line-up; (4) Pharming vs phishing: the fake-signpost vs the fake-letter distinction, shown as two routes to the same fake bank; (5) Build the defence stack: pair shields to threats; (6) The honest truth: which single "shield" defends against the most? (updates + suspicion — a reflection, not a gotcha).
**Nudge sample (phishing tells):** ① "Read the sender's address character by character." ② "bank-secure-login.com is not yourbank.com. What else is pushing you to hurry?" ③ "Urgency + lookalike domain + generic greeting — three tells, one delete button."
**Watch for:** Virus as umbrella term for all malware; firewall as anti-malware; phishing/pharming swapped; 2FA described as "two passwords".

---

### Module 37 · Machines that Act Alone
**Ref:** 6.1–6.2 (automated systems: sensors, microprocessors, actuators working together; scenarios incl. industry, transport, agriculture, weather, gaming, lighting, science; robotics: characteristics, uses, advantages/disadvantages) · **Needs:** M20
**Hook:** "Sensor, brain, muscle. Every automated system on Earth — greenhouse fans to self-driving cars — is those three words in a loop."
**Goal:** Describe how sensors, microprocessor and actuators combine in given scenarios (the classic 6-mark answer structure, smuggled in); state robot characteristics (mechanical structure, electrical components, programmable); weigh advantages/disadvantages in context.
**Signature interaction:** A build-a-loop workbench — for a chosen scenario he wires sensor → microprocessor (with a visible IF rule he sets on dials: "IF temp > 25") → actuator, then presses "let it live" and watches the system run unattended through a day/night cycle, reacting on its own. The emotional beat: *he built a thing that acts without him.*
**Discoveries:** (1) Wire the greenhouse: temp sensor → threshold rule → fan; run it; (2) Two rules at once: add moisture → valve; watch rules interleave; (3) The feedback idea: the fan's effect changes the sensor's next reading — discover the loop closing; (4) Is it a robot?: sort machines by the three characteristics (a dishwasher? a factory arm? a chatbot?); (5) The honest ledger: advantages/disadvantages of automation in ONE concrete setting he picks — sorted, then one open reflection line (no judgment recorded).
**Nudge sample (feedback):** ① "Watch the temperature after the fan has run a while." ② "It fell below 25. What does the rule say now?" ③ "Fan off — the system's own action changed its own input. That loop IS automation."
**Watch for:** Actuator vs output device blur; microprocessor "decides" anthropomorphism (it compares against stored values — mirror the syllabus phrasing); robot = humanoid.

---

### Module 38 · Machines that Learn — and the Capstone
**Ref:** 6.3 (AI: characteristics — data collection, rules, reasoning, learning/adapting; expert systems: knowledge base, rule base, inference engine, interface; machine learning definition) + 8.3 (file handling: open/close, read/write a line of text — folded in here as the capstone's storage) · **Needs:** M37, M27
**Hook:** "The last module. Two ways to make a machine seem clever: give it every rule, or give it every example. Then: one small ceremony."
**Goal:** State AI's characteristics; name the four expert-system components and their roles; define machine learning as a program adapting its own processes/data; use OPENFILE/READFILE/WRITEFILE/CLOSEFILE in pseudocode.
**Signature interaction:** A working toy expert system — a "what garden bird is that?" identifier (a nod to a shared interest) whose four components are visible glass boxes: he watches a question travel interface → inference engine → rule base → knowledge base and back. Then he ADDS a rule and a fact himself and watches the system get smarter — the difference between rules-given and learning is then shown as a second panel where a tiny pattern-matcher improves from examples he feeds it.
**Discoveries:** (1) Tour the four boxes: each component's one job; (2) Ask it something: trace a full inference; (3) Teach it: add a rule + fact, re-ask, watch the new answer — expert systems grow by *being given* knowledge; (4) The other way: feed the mini pattern-matcher examples and watch its guesses improve — machine learning grows by *adapting itself*; name the distinction; (5) Files, the last piece: the system saves its knowledge base with WRITEFILE and reloads with READFILE — pseudocode file handling as the natural need to *keep what was learned*; (6) **The ceremony:** a final screen assembles every module's star into one constellation, with one line: "36 discoveries. No marks were ever given. You taught yourself a subject." Then — only now, and gently — a single optional door marked "curious what the exam looks like?" that opens the conversation about past papers on his terms.
**Nudge sample (expert system):** ① "The engine gave no answer. Which box was missing something?" ② "The rules were fine — check what facts the knowledge base holds." ③ "No fact matched. Add one and the same rules suddenly work: knowledge base = facts, rule base = how to use them."
**Watch for:** Expert system components' jobs swapped (inference engine vs rule base is the exam favourite); ML described as "programmed to be smart" (the adaptation is the definition); forgetting CLOSEFILE.

---

## Part D — Production notes for building each module

- **Reuse the M1 engine.** The bulb-switch factory, chip auto-detection, star/toast/spark system, nudge ladder and collapsible-discovery scaffold are all in `secret-language.html` — extract into a shared pattern and re-skin per module. Each module stays a single self-contained HTML file (no shared dependencies to break).
- **One signature interaction per module,** everything else quiet — the signature is specified above in each plan.
- **State-matching first, choice-mechanics second.** Where a plan says "sort" or "pair", implement as snap-on-defensible with warm redirects, never tallied errors.
- **Persistence:** once hosted alongside the diagnostic suite, add the same autosave/export/import pattern; stars should sync to a simple per-module key so the constellation in M38 can assemble.
- **Estimated build order for maximum early payoff:** M2 → M9 → M10 → M22 (the trace-table module is the highest-value single build in the course) → then alternate strands per the map.
- **Cambridge-accuracy guardrails baked into plans:** 1-based SUBSTRING; MOD/DIV names; no binary search (not in 0478); logic circuits built *without simplification*, ≤3 inputs; pseudocode-only solutions on Paper 2; 1024-based storage units. Verify any module touching pseudocode against the current syllabus appendix (2026–28, v5 Dec 2025) before building, since operator names were revised in v4.

*36 modules · Topics 1–10 complete · Paper 1 and Paper 2 both fully covered.*
