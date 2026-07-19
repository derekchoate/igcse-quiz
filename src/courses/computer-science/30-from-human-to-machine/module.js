
  /* ================= Module 28 — From Human to Machine =================
   Signature interaction (D2): the same five-line demonstration program,
   with one bug planted on line 4 on purpose, handed to a Compiler and then
   to an Interpreter — the log for each shows exactly when it stops relative
   to the bug, which is the whole compiler/interpreter distinction in one
   comparison.

   D1, D3, D4 and D5 all share one hand-rolled tap-or-drag chip → bin sorter,
   makeBinSorter() below — same shape as Module 13's D1, Module 16's D1/D4,
   Module 26's D1 and Module 27's D1/D2 (pool of chips, bins with a clickable
   head, pointer-drag as an alternate path), not the shared `matcher` kit,
   which hardcodes awardStar("d3", ...) for Module 9's pseudocode pairing and
   would award the wrong discovery here regardless. Reusing one local factory
   four times in this file is well past the "rule of two" this course is
   comfortable with (mirrors Module 16's makeCrank, reused three times).

   D1 also uses the shared `cycler` kit (makeCycler) to climb the language
   ladder one rung at a time; D2 uses the shared `chips` kit to track which
   translator(s) have been tried.

   The IDE-features list in D5 is the syllabus's own list verbatim (0478,
   section 4.2's "Including:" bullets under "Explain the role of an IDE") —
   seven items (code editors, run-time environment, translators, error
   diagnostics, auto-completion, auto-correction, prettyprint), not the five
   the original course-plan draft suggested; see the module's build notes
   for why the count changed (same guardrail that caught the OS-functions
   discrepancy in Module 27).

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar, makeChips and makeCycler are all in scope. */

  /* ═══ shared local factory: tap-or-drag chip → bin sorter (D1, D3, D4, D5) ═══ */
  function makeBinSorter(opts) {
    const { pool, binsContainer, status, items, bins, doneStatus, wrongMsg, onDone } = opts;
    const itemEls = {}, binEls = {};
    let selected = null, placed = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap an item to begin.";
        return;
      }
      $$(".fh-chip", pool).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      status.textContent = "Now tap where you think it belongs.";
    }
    function tryPlace(key) {
      if (!selected) return;
      const item = items.find(x => x.id === selected);
      const btn = itemEls[item.id];
      if (item.ans === key) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        const line = document.createElement("div");
        line.className = "fh-bin-line"; line.textContent = item.label;
        binEls[key].body.appendChild(line);
        binEls[key].wrap.classList.add("filled");
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        placed++; selected = null;
        if (placed === items.length) {
          status.textContent = doneStatus;
          onDone();
        } else {
          status.textContent = "That's the one. " + (items.length - placed) + " more to go.";
        }
      } else {
        toast(wrongMsg);
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap an item to try again.";
      }
    }
    function binUnder(e) {
      if (dragGhost) dragGhost.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (dragGhost) dragGhost.style.visibility = "";
      const bin = el && el.closest ? el.closest(".fh-bin") : null;
      if (!bin) return null;
      for (const k in binEls) { if (binEls[k].wrap === bin) return k; }
      return null;
    }
    function markHover(key) {
      Object.keys(binEls).forEach(k => binEls[k].wrap.classList.toggle("drop-ok", k === key));
    }
    let dragId = null, dragging = false, dragGhost = null, dragPtrId = null;
    let dragStartX = 0, dragStartY = 0, dragOffX = 0, dragOffY = 0;
    function dragStart(e, id, btn) {
      if (btn.classList.contains("placed")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragId = id; dragPtrId = e.pointerId; dragging = false;
      dragStartX = e.clientX; dragStartY = e.clientY;
      document.addEventListener("pointermove", dragMove);
      document.addEventListener("pointerup", dragEnd);
      document.addEventListener("pointercancel", dragEnd);
    }
    function dragMove(e) {
      if (dragId === null || e.pointerId !== dragPtrId) return;
      const btn = itemEls[dragId];
      if (!dragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) < 6) return;
        dragging = true;
        const rect = btn.getBoundingClientRect();
        dragOffX = dragStartX - rect.left; dragOffY = dragStartY - rect.top;
        dragGhost = btn.cloneNode(true);
        dragGhost.classList.add("fh-chip-ghost"); dragGhost.classList.remove("sel");
        dragGhost.style.width = rect.width + "px";
        document.body.appendChild(dragGhost);
        btn.classList.add("dragging");
        $$(".fh-chip", pool).forEach(c => c.classList.remove("sel"));
        selected = null;
      }
      e.preventDefault();
      dragGhost.style.left = (e.clientX - dragOffX) + "px";
      dragGhost.style.top = (e.clientY - dragOffY) + "px";
      markHover(binUnder(e));
    }
    function dragEnd(e) {
      if (dragId === null || e.pointerId !== dragPtrId) return;
      const id = dragId, btn = itemEls[id];
      document.removeEventListener("pointermove", dragMove);
      document.removeEventListener("pointerup", dragEnd);
      document.removeEventListener("pointercancel", dragEnd);
      if (dragging) {
        const key = binUnder(e);
        markHover(null);
        if (dragGhost) { dragGhost.remove(); dragGhost = null; }
        btn.classList.remove("dragging");
        if (key) { selected = id; tryPlace(key); }
      } else if (e.type !== "pointercancel") {
        select(id, btn);
      }
      dragId = null; dragging = false; dragPtrId = null;
    }
    function buildChip(item) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "fh-chip"; b.dataset.id = item.id;
      b.textContent = item.label;
      b.addEventListener("click", () => { if (!dragging) select(item.id, b); });
      b.addEventListener("pointerdown", e => dragStart(e, item.id, b));
      itemEls[item.id] = b;
      return b;
    }
    function buildBin(bin) {
      const wrap = document.createElement("div"); wrap.className = "fh-bin";
      const head = document.createElement("button");
      head.type = "button"; head.className = "fh-bin-head"; head.textContent = bin.label;
      head.addEventListener("click", () => tryPlace(bin.key));
      const body = document.createElement("div"); body.className = "fh-bin-body"; body.setAttribute("aria-live", "polite");
      wrap.appendChild(head); wrap.appendChild(body);
      binEls[bin.key] = { wrap, body, head };
      return wrap;
    }
    bins.forEach(bin => binsContainer.appendChild(buildBin(bin)));
    items.forEach(item => pool.appendChild(buildChip(item)));
  }

  /* ═══ D1: the ladder of languages ═══ */
  (function () {
    const LEVELS = ["high", "asm", "machine"];
    const LABELS = { high: "High-level", asm: "Assembly", machine: "Machine code" };
    const PANELS = {
      high: {
        lines: ["DECLARE Total : INTEGER", "Total ← 19", "Total ← Total + 6", "OUTPUT Total"],
        caption: "Written to be read by a person first — clear words, a clear structure, close to English."
      },
      asm: {
        lines: ["LOAD 200", "ADD 201", "STORE 202"],
        caption: "Short mnemonics standing in for the machine's own operations, plus the addresses they act on — still readable, but only just."
      },
      machine: {
        lines: ["0001 11001000", "0010 11001001", "0011 11001010"],
        caption: "The only language the CPU actually runs — every bulb from Module 1, spelling out an operation and an address."
      }
    };
    const panel = $("#ladderPanel1");
    function renderLadder(level) {
      const data = PANELS[level];
      panel.innerHTML = "";
      data.lines.forEach(text => {
        const div = document.createElement("div");
        div.className = "fh-line";
        div.textContent = text;
        panel.appendChild(div);
      });
      const cap = document.createElement("p");
      cap.className = "fh-caption";
      cap.textContent = data.caption;
      panel.appendChild(cap);
    }
    makeCycler($("#ladderBtn1"), LEVELS, v => "Level: " + LABELS[v] + " — tap for the next rung", renderLadder);
    renderLadder(LEVELS[0]);

    makeBinSorter({
      pool: $("#tradePool1"),
      binsContainer: $("#tradeBins1"),
      status: $("#status1"),
      items: [
        { id: "read", label: "Reads close to plain English, so it's easier to write and to fix mistakes in", ans: "High" },
        { id: "indep", label: "The same program can often run on a different make of computer with little or no change", ans: "High" },
        { id: "hardread", label: "Written directly in terms of the machine's own registers and addresses, so it's hard for a person to read", ans: "Low" },
        { id: "control", label: "Gives the programmer direct control over specific hardware, address by address", ans: "Low" }
      ],
      bins: [
        { key: "High", label: "High-level language" },
        { key: "Low", label: "Low-level language" }
      ],
      doneStatus: "All four sorted — the readability gradient you just felt, named properly.",
      wrongMsg: "Not that level — ask whether this is easier for a person, or closer to the hardware itself.",
      onDone: () => awardStar("d1", "Four real trade-offs, sorted onto the language level they actually belong to — and you climbed that ladder with your own eyes first.")
    });
  })();

  /* ═══ D2: the two personalities — same bug, two translators ═══ */
  (function () {
    const LINES = [
      "DECLARE Total : INTEGER",
      "Total ← 0",
      "INPUT Score",
      "Total ← Total + Scoer",
      "OUTPUT Total"
    ];
    const prog = $("#prog2");
    LINES.forEach((text, i) => {
      const row = document.createElement("div");
      row.className = "fh-line";
      row.textContent = (i + 1) + ". " + text;
      if (i === 3) {
        const flag = document.createElement("span");
        flag.className = "fh-bug-flag";
        flag.textContent = "◂ the bug lives here";
        row.appendChild(flag);
      }
      prog.appendChild(row);
    });

    const compileReveal = $("#compileReveal2"), compileLog = $("#compileLog2");
    const interpretReveal = $("#interpretReveal2"), interpretLog = $("#interpretLog2");

    const check2 = makeChips($("#chips2"), ["compiler", "interpreter"],
      () => awardStar("d2", "The exact same bug, handed to two translators — the compiler reported it before running anything at all, while the interpreter ran three real lines first and only stopped once it actually reached the problem. Same bug, two entirely different personalities."),
      k => (k === "compiler" ? "the Compiler" : "the Interpreter"),
      (label, remaining) => "Watched " + label + " handle it — " + remaining + " more to try.");

    function fill(listEl, lines) {
      listEl.innerHTML = "";
      lines.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        listEl.appendChild(li);
      });
    }

    $("#compileBtn2").addEventListener("click", () => {
      fill(compileLog, [
        "The compiler reads and translates all five lines first, before running anything at all.",
        "It reaches line 4 while translating and doesn't recognise the name Scoer anywhere — Total and Score were declared, Scoer never was.",
        "Translation stops there. One error report comes back, naming line 4 — and nothing has run yet, not even line 1."
      ]);
      compileReveal.hidden = false;
      const r = compileReveal.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      check2("compiler");
    });

    $("#interpretBtn2").addEventListener("click", () => {
      fill(interpretLog, [
        "Line 1: DECLARE Total — noted, an empty box is ready.",
        "Line 2: Total ← 0 — runs for real. Total now holds 0.",
        "Line 3: INPUT Score — runs for real, genuinely waiting on a Score.",
        "Line 4: Total ← Total + Scoer — the interpreter doesn't recognise Scoer either. It stops right here, mid-run, at the exact line it reached.",
        "Lines 1 to 3 already happened for real, before the interpreter ever met the bug."
      ]);
      interpretReveal.hidden = false;
      const r = interpretReveal.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      check2("interpreter");
    });
  })();

  /* ═══ D3: who's faster, who's friendlier — six trade-offs ═══ */
  makeBinSorter({
    pool: $("#tradePool3"),
    binsContainer: $("#tradeBins3"),
    status: $("#status3"),
    items: [
      { id: "livecatch", label: "Best suited to spotting problems the moment you reach them, while a program is still being written", ans: "Interpreter" },
      { id: "standalone", label: "Produces a sealed, ready-to-run executable file, so the finished program doesn't need the original translator installed to run afterwards", ans: "Compiler" },
      { id: "runfast", label: "Once translated, the finished program usually runs faster, since none of the translating happens while it's running", ans: "Compiler" },
      { id: "lineatatime", label: "Translates and runs the code one line at a time, so results appear immediately without waiting for the whole program to finish translating", ans: "Interpreter" },
      { id: "wholereport", label: "Reports every error it can find across the whole program in one go, before a single line has run", ans: "Compiler" },
      { id: "everyrun", label: "Has to be present and running every single time the program is used", ans: "Interpreter" }
    ],
    bins: [
      { key: "Compiler", label: "Compiler" },
      { key: "Interpreter", label: "Interpreter" }
    ],
    doneStatus: "All six sorted — the real trade between a fast, independent finished program and instant, live feedback while building it.",
    wrongMsg: "Not that one — ask whether this happens once, up front, or has to keep happening every time the program runs.",
    onDone: () => awardStar("d3", "Six honest trade-offs, sorted correctly — including the one everyone assumes backwards: a compiled program does not need its compiler to run.")
  });

  /* ═══ D4: the assembler's small job — 1:1 substitution ═══ */
  makeBinSorter({
    pool: $("#asmPool4"),
    binsContainer: $("#asmBins4"),
    status: $("#status4"),
    items: [
      { id: "load", label: "LOAD 200", ans: "0001 11001000" },
      { id: "add", label: "ADD 201", ans: "0010 11001001" },
      { id: "store", label: "STORE 202", ans: "0011 11001010" }
    ],
    bins: [
      { key: "0001 11001000", label: "0001 11001000" },
      { key: "0010 11001001", label: "0010 11001001" },
      { key: "0011 11001010", label: "0011 11001010" }
    ],
    doneStatus: "All three matched — one mnemonic in, one machine code instruction out, every time.",
    wrongMsg: "Not that one — check the mnemonic table for the opcode, then match the address's binary to the decimal address.",
    onDone: () => {
      $("#revealNote4").hidden = false;
      awardStar("d4", "Three assembly lines, matched to the machine code they become — pure substitution, one for one, exactly what an assembler does and nothing more.");
    }
  });

  /* ═══ D5: tour the workshop — seven syllabus-verbatim IDE features ═══
     Verbatim against Cambridge 0478 (2026-28) section 4.2's "Including:"
     list under "Explain the role of an IDE" — seven items, not the five the
     original course-plan draft named. */
  makeBinSorter({
    pool: $("#idePool5"),
    binsContainer: $("#ideBins5"),
    status: $("#status5"),
    items: [
      { id: "editor", label: "Line numbers, colour-coding, and a proper canvas to type in — not a plain, colourless text file.", ans: "Code editor" },
      { id: "runtime", label: "The program actually runs right there inside the same window, so you can see it working without leaving to set anything up elsewhere.", ans: "Run-time environment" },
      { id: "translator", label: "A compiler or interpreter is already built in, ready the moment you ask to run or build the code — no separate download first.", ans: "Translator" },
      { id: "diagnostics", label: "It names the exact line a problem is on, and often what's wrong, instead of leaving you to hunt through the whole program by eye.", ans: "Error diagnostics" },
      { id: "completion", label: "It offers to finish a long variable or function name for you halfway through typing it.", ans: "Auto-completion" },
      { id: "correction", label: "It quietly fixes a small slip while you type, like a bracket that doesn't match yet.", ans: "Auto-correction" },
      { id: "prettyprint", label: "It automatically lays the code out with consistent indenting and spacing, so it's tidy to read back later.", ans: "Prettyprint" }
    ],
    bins: [
      { key: "Code editor", label: "Code editor" },
      { key: "Run-time environment", label: "Run-time environment" },
      { key: "Translator", label: "Translator" },
      { key: "Error diagnostics", label: "Error diagnostics" },
      { key: "Auto-completion", label: "Auto-completion" },
      { key: "Auto-correction", label: "Auto-correction" },
      { key: "Prettyprint", label: "Prettyprint" }
    ],
    doneStatus: "All seven matched — the whole workshop, named and placed.",
    wrongMsg: "Not that feature — read the scenario again and think about the one thing it's actually saving you from doing by hand.",
    onDone: () => awardStar("d5", "Seven real IDE features, matched to what each one actually saves you from doing the hard way — the whole workshop, toured.")
  });
