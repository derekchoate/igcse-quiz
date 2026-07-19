
  /* ================= Module 20 — The Detective's Table =================
   Signature interaction: a self-checking trace grid. Code renders on the
   left with a moving highlight (a .pcline.cur, same convention as Modules
   10-12); a table on the right is filled cell by cell — tap an unlocked
   box, pick from a small "number pad" of candidate values, and a correct
   pick glows amber while a wrong one leaves the box exactly as quiet as it
   was, plus a soft "look again" pointer. There is no error state and
   nothing is ever counted: a box either glows or it hasn't glowed yet.

   makeTraceGrid (below) is the one bespoke mechanic every discovery
   composes, mirroring how Module 12's buildLoopEngine is shared across its
   FOR/WHILE/REPEAT discoveries with different data. Rows unlock top to
   bottom — only the current row's boxes are tappable — because a trace is
   read in execution order; this is the mechanic's own internal sequencing
   (comparable to the loop-engine's step-by-step reveal in Module 12), not a
   locked section, and every discovery is still fully open and collapsible
   from the start per the design contract.

   D4 and D5 layer a second reveal on top of a finished grid: a "name the
   bug" / "what's it for" picker, styled and behaved exactly like Module
   12's D5 bug-picker (wrong pick → warm toast redirect, correct pick →
   disables the options and awards the star). Runs inside the shared engine
   IIFE, so $, $$, reduceMotion, sparks, toast and awardStar are all in
   scope. meta.uses is empty — no existing kit fits a numeric trace grid,
   and this is the only module (so far) that needs one. */

  /* ═══ render a static block of pseudocode with one data-line per line,
     so a row can point the moving highlight at the line it corresponds
     to (mirrors Module 10-12's .pcline / .kw / .arrow / .str look) ═══ */
  function renderCode(mountEl, lines) {
    mountEl.innerHTML = lines
      .map((html, i) => '<div class="pcline" data-line="' + (i + 1) + '">' + html + '</div>')
      .join("");
  }
  function highlightLine(mountEl, n) {
    $$(".pcline", mountEl).forEach(el => {
      el.classList.toggle("cur", Number(el.dataset.line) === n);
    });
  }

  /* ═══ the trace grid itself ═══
     cfg: { codeEl, gridEl, statusEl, padEl, columns:[{key,label}],
            rows:[{ label, line, hint?, cells:{ key:{value,options,hint?} } }],
            introStatus, doneMessage, onComplete() }
     A row's `cells` only lists columns that actually change that row —
     every other column renders as a static dash, never a repeated number,
     which is the house rule this whole module teaches. */
  function makeTraceGrid(cfg) {
    const columns = cfg.columns;
    let activeRow = 0;

    cfg.gridEl.innerHTML = "";
    cfg.gridEl.style.setProperty("--tg-cols", String(columns.length));

    const head = document.createElement("div");
    head.className = "tg-row tg-head";
    const headLabel = document.createElement("div");
    headLabel.className = "tg-rowlabel";
    head.appendChild(headLabel);
    columns.forEach(col => {
      const h = document.createElement("div");
      h.className = "tg-cell tg-colhead";
      h.textContent = col.label;
      head.appendChild(h);
    });
    cfg.gridEl.appendChild(head);

    const rowEls = [];
    cfg.rows.forEach((row, ri) => {
      const rowWrap = document.createElement("div");
      rowWrap.className = "tg-row";
      const rl = document.createElement("div");
      rl.className = "tg-rowlabel";
      rl.textContent = row.label;
      rowWrap.appendChild(rl);
      const cellEls = {};
      columns.forEach(col => {
        const cellDef = row.cells[col.key];
        if (!cellDef) {
          const d = document.createElement("div");
          d.className = "tg-cell tg-dash";
          d.textContent = "–";
          rowWrap.appendChild(d);
        } else {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "tg-cell tg-fillable tg-locked";
          b.disabled = true;
          b.dataset.row = String(ri);
          b.dataset.col = col.key;
          b.setAttribute("aria-label", col.label + " at " + row.label + ", not filled in yet");
          b.addEventListener("click", () => openPad(row, col, b));
          rowWrap.appendChild(b);
          cellEls[col.key] = b;
        }
      });
      cfg.gridEl.appendChild(rowWrap);
      rowEls.push({ row, cellEls });
    });

    function unlockRow(ri) {
      const entry = rowEls[ri];
      Object.keys(entry.cellEls).forEach(key => {
        const b = entry.cellEls[key];
        b.disabled = false;
        b.classList.remove("tg-locked");
        b.classList.add("tg-unlocked");
        b.textContent = "?";
      });
      highlightLine(cfg.codeEl, entry.row.line);
    }

    function rowComplete(ri) {
      const entry = rowEls[ri];
      return Object.keys(entry.cellEls).every(key => entry.cellEls[key].classList.contains("tg-filled"));
    }

    function closePad() {
      cfg.padEl.hidden = true;
      cfg.padEl.innerHTML = "";
    }

    function openPad(row, col, btn) {
      if (btn.classList.contains("tg-filled") || btn.disabled) return;
      const cellDef = row.cells[col.key];
      cfg.padEl.hidden = false;
      cfg.padEl.innerHTML = "";
      const label = document.createElement("p");
      label.className = "tg-pad-label";
      label.textContent = "Pick the value for " + col.label + " — " + row.label + ".";
      cfg.padEl.appendChild(label);
      const btnRow = document.createElement("div");
      btnRow.className = "tg-pad-btns";
      cellDef.options.forEach(opt => {
        const optBtn = document.createElement("button");
        optBtn.type = "button";
        optBtn.className = "tg-pad-btn";
        optBtn.dataset.value = String(opt);
        optBtn.textContent = String(opt);
        optBtn.addEventListener("click", () => pickValue(row, col, opt, btn));
        btnRow.appendChild(optBtn);
      });
      cfg.padEl.appendChild(btnRow);
      cfg.statusEl.textContent = "Pick the value for " + col.label + " — " + row.label + ".";
    }

    function pickValue(row, col, val, btn) {
      const ri = cfg.rows.indexOf(row);
      const cellDef = row.cells[col.key];
      if (val === cellDef.value) {
        btn.textContent = String(val);
        btn.classList.remove("tg-unlocked");
        btn.classList.add("tg-filled");
        btn.disabled = true;
        btn.setAttribute("aria-label", col.label + " at " + row.label + " — " + val + ", consistent with the trace");
        const r = btn.getBoundingClientRect();
        sparks(r.left + r.width / 2, r.top);
        closePad();
        if (rowComplete(ri)) {
          if (ri === cfg.rows.length - 1) {
            cfg.statusEl.textContent = cfg.doneMessage;
            cfg.onComplete();
          } else {
            activeRow = ri + 1;
            unlockRow(activeRow);
            cfg.statusEl.textContent = "That row's consistent. Tap " + cfg.rows[activeRow].label + "'s box to keep going.";
          }
        } else {
          cfg.statusEl.textContent = "Tap the next box in " + row.label + ".";
        }
      } else {
        cfg.statusEl.textContent = cellDef.hint || row.hint || ("Look again at " + row.label + " — that's not quite what this line does.");
      }
    }

    unlockRow(0);
    cfg.statusEl.textContent = cfg.introStatus;
  }

  /* ═══ D1: a 4-liner, two variables ═══ */
  renderCode($("#code1"), [
    'Score <span class="arrow">←</span> 10',
    'Bonus <span class="arrow">←</span> 5',
    'Score <span class="arrow">←</span> Score + Bonus',
    '<span class="kw">OUTPUT</span> Score'
  ]);
  makeTraceGrid({
    codeEl: $("#code1"), gridEl: $("#grid1"), statusEl: $("#status1"), padEl: $("#pad1"),
    columns: [{ key: "Score", label: "Score" }, { key: "Bonus", label: "Bonus" }, { key: "OUTPUT", label: "OUTPUT" }],
    rows: [
      { label: "Line 1", line: 1, cells: { Score: { value: 10, options: [10, 0, 5, 15] } } },
      { label: "Line 2", line: 2, cells: { Bonus: { value: 5, options: [5, 10, 0, 15] } } },
      {
        label: "Line 3", line: 3,
        cells: { Score: { value: 15, options: [15, 10, 5, 20], hint: "Look again at Line 3 — Score is being reassigned to Score + Bonus, not left at its old 10." } }
      },
      { label: "Line 4 · OUTPUT", line: 4, cells: { OUTPUT: { value: 15, options: [15, 10, 5, 25] } } }
    ],
    introStatus: "Tap Line 1's box to begin.",
    doneMessage: "All four lines traced — every column only ever earned a number on the line that actually changed it.",
    onComplete: () => awardStar("d1", "Every column only got a new number on the line that actually changed it — that's a real trace table, not a guess.")
  });

  /* ═══ D2: a FOR loop's rhythm ═══ */
  renderCode($("#code2"), [
    'Total <span class="arrow">←</span> 0',
    '<span class="kw">FOR</span> Count <span class="arrow">←</span> 1 <span class="kw">TO</span> 4',
    '  Total <span class="arrow">←</span> Total + Count',
    '<span class="kw">NEXT</span> Count',
    '<span class="kw">OUTPUT</span> Total'
  ]);
  makeTraceGrid({
    codeEl: $("#code2"), gridEl: $("#grid2"), statusEl: $("#status2"), padEl: $("#pad2"),
    columns: [{ key: "Count", label: "Count" }, { key: "Total", label: "Total" }, { key: "OUTPUT", label: "OUTPUT" }],
    rows: [
      { label: "Line 1", line: 1, cells: { Total: { value: 0, options: [0, 1, 4, 10] } } },
      { label: "Lap 1", line: 3, cells: { Count: { value: 1, options: [1, 0, 2, 4] }, Total: { value: 1, options: [1, 0, 4, 10] } } },
      { label: "Lap 2", line: 3, cells: { Count: { value: 2, options: [2, 1, 3, 4] }, Total: { value: 3, options: [3, 1, 2, 10] } } },
      { label: "Lap 3", line: 3, cells: { Count: { value: 3, options: [3, 2, 4, 1] }, Total: { value: 6, options: [6, 3, 9, 10] } } },
      { label: "Lap 4", line: 3, cells: { Count: { value: 4, options: [4, 3, 5, 1] }, Total: { value: 10, options: [10, 6, 14, 4] } } },
      { label: "Line 5 · OUTPUT", line: 5, cells: { OUTPUT: { value: 10, options: [10, 4, 6, 14] } } }
    ],
    introStatus: "Tap Line 1's box to begin.",
    doneMessage: "All four laps traced — Count and Total moved in lockstep, right through to OUTPUT.",
    onComplete: () => awardStar("d2", "Count and Total marched in the same rhythm, lap after lap — every column filling in together is exactly what a FOR loop's own trace looks like.")
  });

  /* ═══ D3: an IF inside the loop ═══ */
  renderCode($("#code3"), [
    'Total <span class="arrow">←</span> 0',
    '<span class="kw">FOR</span> Num <span class="arrow">←</span> 1 <span class="kw">TO</span> 5',
    '  <span class="kw">IF</span> <span class="kw">MOD</span>(Num, 2) = 0',
    '    <span class="kw">THEN</span>',
    '      Total <span class="arrow">←</span> Total + Num',
    '  <span class="kw">ENDIF</span>',
    '<span class="kw">NEXT</span> Num',
    '<span class="kw">OUTPUT</span> Total'
  ]);
  makeTraceGrid({
    codeEl: $("#code3"), gridEl: $("#grid3"), statusEl: $("#status3"), padEl: $("#pad3"),
    columns: [{ key: "Num", label: "Num" }, { key: "Total", label: "Total" }, { key: "OUTPUT", label: "OUTPUT" }],
    rows: [
      { label: "Line 1", line: 1, cells: { Total: { value: 0, options: [0, 1, 5, 15] } } },
      {
        label: "Lap 1 (Num 1)", line: 3, cells: { Num: { value: 1, options: [1, 0, 2, 5] } },
        hint: "Look again at Lap 1 — MOD(1, 2) is 1, not 0, so THEN never fires and Total has nothing new to show."
      },
      { label: "Lap 2 (Num 2)", line: 5, cells: { Num: { value: 2, options: [2, 1, 3, 5] }, Total: { value: 2, options: [2, 0, 3, 6] } } },
      {
        label: "Lap 3 (Num 3)", line: 3, cells: { Num: { value: 3, options: [3, 2, 4, 5] } },
        hint: "Look again at Lap 3 — MOD(3, 2) is 1, not 0, so this lap leaves Total's box dark too."
      },
      { label: "Lap 4 (Num 4)", line: 5, cells: { Num: { value: 4, options: [4, 3, 5, 2] }, Total: { value: 6, options: [6, 2, 10, 4] } } },
      {
        label: "Lap 5 (Num 5)", line: 3, cells: { Num: { value: 5, options: [5, 4, 3, 1] } },
        hint: "Look again at Lap 5 — MOD(5, 2) is 1, not 0, so Total stays exactly where it was after Lap 4."
      },
      { label: "Line 8 · OUTPUT", line: 8, cells: { OUTPUT: { value: 6, options: [6, 2, 15, 10] } } }
    ],
    introStatus: "Tap Line 1's box to begin.",
    doneMessage: "All five laps traced — three of them left Total dark, and every one of those rows still belonged there.",
    onComplete: () => awardStar("d3", "Three of those laps left Total's column dark — and the row still belonged there. A trace table records every lap, whether or not that lap's variable moved.")
  });

  /* ═══ D4: the broken algorithm — trace, then name the bug ═══ */
  renderCode($("#code4"), [
    'Total <span class="arrow">←</span> 0',
    '<span class="kw">FOR</span> Num <span class="arrow">←</span> 1 <span class="kw">TO</span> 4',
    '  Total <span class="arrow">←</span> Total + Num',
    '<span class="kw">NEXT</span> Num',
    '<span class="kw">OUTPUT</span> Total'
  ]);
  makeTraceGrid({
    codeEl: $("#code4"), gridEl: $("#grid4"), statusEl: $("#status4"), padEl: $("#pad4"),
    columns: [{ key: "Num", label: "Num" }, { key: "Total", label: "Total" }, { key: "OUTPUT", label: "OUTPUT" }],
    rows: [
      { label: "Line 1", line: 1, cells: { Total: { value: 0, options: [0, 1, 4, 15] } } },
      { label: "Lap 1", line: 3, cells: { Num: { value: 1, options: [1, 0, 2, 4] }, Total: { value: 1, options: [1, 0, 4, 15] } } },
      { label: "Lap 2", line: 3, cells: { Num: { value: 2, options: [2, 1, 3, 4] }, Total: { value: 3, options: [3, 1, 2, 15] } } },
      { label: "Lap 3", line: 3, cells: { Num: { value: 3, options: [3, 2, 4, 1] }, Total: { value: 6, options: [6, 3, 9, 15] } } },
      { label: "Lap 4", line: 3, cells: { Num: { value: 4, options: [4, 3, 5, 1] }, Total: { value: 10, options: [10, 6, 14, 15] } } },
      { label: "Line 5 · OUTPUT", line: 5, cells: { OUTPUT: { value: 10, options: [10, 15, 6, 14] } } }
    ],
    introStatus: "Tap Line 1's box to begin.",
    doneMessage: "Traced exactly as written — OUTPUT prints 10, not the 15 the intention promised. Time to name the bug below.",
    onComplete: () => { $("#pick4").hidden = false; }
  });
  const BUGS4 = [
    { id: "b1", label: "The loop's upper bound stops it one lap too early", correct: true },
    { id: "b2", label: "Nothing inside the loop updates Total", correct: false },
    { id: "b3", label: "Total was never reset to zero at the start", correct: false },
    { id: "b4", label: "Num is counting in the wrong direction", correct: false }
  ];
  (function () {
    const opts = $("#pickOptions4"), statusEl = $("#pickStatus4");
    BUGS4.forEach(b => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "pick-btn"; btn.textContent = b.label;
      btn.addEventListener("click", () => {
        if (b.correct) {
          $$(".pick-btn", opts).forEach(x => x.disabled = true);
          btn.classList.add("chosen");
          statusEl.textContent = "Exactly — FOR Num ← 1 TO 4 stops one lap before Num ever reaches 5, so that missing 5 never gets added.";
          awardStar("d4", "You traced exactly what the code does — not what it was supposed to do — and caught it: the loop stops one lap short of the whole intention.");
        } else {
          toast("Not quite that one — trace it again and check whether that particular claim actually matches what you just watched happen.");
        }
      });
      opts.appendChild(btn);
    });
  })();

  /* ═══ D5: what is it FOR? — a cold trace, then name its purpose ═══ */
  renderCode($("#code5"), [
    'Biggest <span class="arrow">←</span> 0',
    'Guess <span class="arrow">←</span> 7',
    '<span class="kw">IF</span> Guess &gt; Biggest',
    '  <span class="kw">THEN</span>',
    '    Biggest <span class="arrow">←</span> Guess',
    '<span class="kw">ENDIF</span>',
    'Guess <span class="arrow">←</span> 15',
    '<span class="kw">IF</span> Guess &gt; Biggest',
    '  <span class="kw">THEN</span>',
    '    Biggest <span class="arrow">←</span> Guess',
    '<span class="kw">ENDIF</span>',
    'Guess <span class="arrow">←</span> 3',
    '<span class="kw">IF</span> Guess &gt; Biggest',
    '  <span class="kw">THEN</span>',
    '    Biggest <span class="arrow">←</span> Guess',
    '<span class="kw">ENDIF</span>',
    '<span class="kw">OUTPUT</span> Biggest'
  ]);
  makeTraceGrid({
    codeEl: $("#code5"), gridEl: $("#grid5"), statusEl: $("#status5"), padEl: $("#pad5"),
    columns: [{ key: "Guess", label: "Guess" }, { key: "Biggest", label: "Biggest" }, { key: "OUTPUT", label: "OUTPUT" }],
    rows: [
      { label: "Line 1", line: 1, cells: { Biggest: { value: 0, options: [0, 7, 15, 3] } } },
      { label: "Guess 1", line: 5, cells: { Guess: { value: 7, options: [7, 0, 15, 3] }, Biggest: { value: 7, options: [7, 0, 15, 3] } } },
      { label: "Guess 2", line: 10, cells: { Guess: { value: 15, options: [15, 7, 3, 0] }, Biggest: { value: 15, options: [15, 7, 3, 0] } } },
      {
        label: "Guess 3", line: 13, cells: { Guess: { value: 3, options: [3, 15, 7, 0] } },
        hint: "Look again at Guess 3 — 3 > 15 is false, so THEN never fires and Biggest has nothing new to show."
      },
      { label: "Line 17 · OUTPUT", line: 17, cells: { OUTPUT: { value: 15, options: [15, 7, 3, 22] } } }
    ],
    introStatus: "Tap Line 1's box to begin.",
    doneMessage: "Traced cold, start to finish — OUTPUT prints 15. Time to say what this program's actually for.",
    onComplete: () => { $("#pick5").hidden = false; }
  });
  const PURPOSES5 = [
    { id: "p1", label: "Finds the biggest of the three guesses", correct: true },
    { id: "p2", label: "Counts how many guesses were made", correct: false },
    { id: "p3", label: "Adds all three guesses together", correct: false },
    { id: "p4", label: "Finds the smallest of the three guesses", correct: false }
  ];
  (function () {
    const opts = $("#pickOptions5"), statusEl = $("#pickStatus5");
    PURPOSES5.forEach(p => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "pick-btn"; btn.textContent = p.label;
      btn.addEventListener("click", () => {
        if (p.correct) {
          $$(".pick-btn", opts).forEach(x => x.disabled = true);
          btn.classList.add("chosen");
          statusEl.textContent = "Exactly — every IF here only ever asks one question: is this new guess bigger than the best one seen so far?";
          awardStar("d5", "You traced a program you'd never seen before and figured out its whole job just from watching Biggest hold its ground three times running.");
        } else {
          toast("Not quite that one — look back at what Biggest actually ended up holding, and what each IF was really comparing.");
        }
      });
      opts.appendChild(btn);
    });
  })();
