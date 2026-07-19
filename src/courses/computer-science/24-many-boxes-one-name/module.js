
  /* ================= Module 22 — Many Boxes, One Name =================
   Signature interaction: a pigeonhole wall — an array rendered as a row of
   physical compartments, each carrying its own 1-based index. D1 fills it
   by hand; D2 hands the reaching over to a FOR loop; D3 pushes the index
   past where the wall ends and shows, calmly, that nothing crashes — there
   simply isn't a compartment there (ghost cells, dashed and muted, never
   red, never an error state). D4/D5 grow the wall into a [row, column]
   grid — a small cinema seating plan — and D6 traces a find-the-largest
   sweep across a filled wall, deliberately mirroring Module 20's trace-grid
   mechanic and class names, since that's the exact skill Module 23 builds
   on next. No existing kit covers a wall of compartments, a [row,column]
   grid, or a numeric trace grid, so all three are hand-rolled here (rule of
   two — Module 20 made the identical call for its own trace grid). Runs
   inside the shared engine IIFE, so $, $$, awardStar, toast, sparks,
   makeChips, makeCycler and reduceMotion are all in scope. */

  /* ═══ D1: one name, five compartments — fill Scores[1..5] by hand ═══ */
  const WALL1_LOWER = 1, WALL1_UPPER = 5;
  let scores1 = {};
  const wall1El = $("#wall1"), valInput1 = $("#valInput1"), code1El = $("#code1"), status1El = $("#status1");
  const chips1 = makeChips($("#chips1"), ["fillAll", "overwrite"],
    () => awardStar("d1", "One name, five compartments — every one of them reachable by number, and every one of them free to be reassigned whenever you like."),
    k => ({ fillAll: "Filled every compartment", overwrite: "Changed a compartment that already held a value" }[k]),
    (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");

  function renderWall1() {
    wall1El.innerHTML = "";
    for (let i = WALL1_LOWER; i <= WALL1_UPPER; i++) {
      const has = Object.prototype.hasOwnProperty.call(scores1, i);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pgh-cell" + (has ? " pgh-cell-filled" : "");
      b.setAttribute("aria-label", "compartment " + i + (has ? ", holds " + scores1[i] : ", empty"));
      b.innerHTML = '<span class="pgh-val">' + (has ? scores1[i] : "—") + '</span><span class="pgh-idx">' + i + "</span>";
      b.addEventListener("click", () => place1(i));
      wall1El.appendChild(b);
    }
  }
  function place1(i) {
    const raw = valInput1.value.trim();
    const v = raw === "" ? 0 : Math.round(Number(raw));
    const wasFilled = Object.prototype.hasOwnProperty.call(scores1, i);
    scores1[i] = v;
    renderWall1();
    code1El.innerHTML = "Scores[" + i + '] <span class="arrow">←</span> ' + v;
    status1El.textContent = "Compartment " + i + " now holds " + v + ".";
    if (Object.keys(scores1).length >= (WALL1_UPPER - WALL1_LOWER + 1)) chips1("fillAll");
    if (wasFilled) chips1("overwrite");
  }
  renderWall1();

  /* ═══ D2: the loop meets the wall — FOR Index ← 1 TO 5 ═══ */
  (function () {
    const codeEl = $("#code2"), wallEl = $("#wall2"), statusEl = $("#status2"), barEl = $("#bar2");
    const values = {};
    let index = 1, finished = false, running = false, timer = null;

    function mkBtn(cls, label) {
      const b = document.createElement("button");
      b.type = "button"; b.className = cls; b.textContent = label;
      return b;
    }
    const stepBtn = mkBtn("loop-btn", "Step one lap ▸");
    const runBtn = mkBtn("loop-btn primary", "Run the loop ▶");
    const resetBtn = mkBtn("loop-btn ghost", "↺ Reset");
    barEl.appendChild(stepBtn); barEl.appendChild(runBtn); barEl.appendChild(resetBtn);

    function renderCode() {
      const active = !finished;
      codeEl.innerHTML =
        '<div class="pcline">DECLARE Scores : ARRAY[1:5] OF INTEGER</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">FOR</span> Index <span class="arrow">←</span> 1 <span class="kw">TO</span> 5</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  Scores[Index] <span class="arrow">←</span> Index * 10</div>' +
        '<div class="pcline"><span class="kw">NEXT</span> Index</div>';
    }
    function renderWall() {
      wallEl.innerHTML = "";
      for (let i = WALL1_LOWER; i <= WALL1_UPPER; i++) {
        const has = Object.prototype.hasOwnProperty.call(values, i);
        const el = document.createElement("div");
        el.className = "pgh-cell" + (has ? " pgh-cell-filled" : "") + (!finished && i === index ? " pgh-cell-cur" : "");
        el.innerHTML = '<span class="pgh-val">' + (has ? values[i] : "—") + '</span><span class="pgh-idx">' + i + "</span>";
        wallEl.appendChild(el);
      }
    }
    function stopRun() {
      running = false; runBtn.textContent = "Run the loop ▶";
      if (timer) { clearInterval(timer); timer = null; }
    }
    function tick() {
      if (finished) return;
      if (index > WALL1_UPPER) {
        finished = true; stopRun();
        stepBtn.disabled = true; runBtn.disabled = true;
        renderCode(); renderWall();
        statusEl.textContent = "Index is now 6 — 6 TO 5 is false, so the loop finishes. All five compartments got a value, one lap at a time, Index driving every single address.";
        awardStar("d2", "Index wasn't a hint about which compartment to use — it was the address itself. Every lap, Scores[Index] reached into whichever compartment Index currently held.");
        return;
      }
      values[index] = index * 10;
      statusEl.textContent = "Index is " + index + " — Scores[" + index + "] ← " + (index * 10) + ".";
      index++;
      renderWall();
    }
    stepBtn.addEventListener("click", () => { if (!running) tick(); });
    runBtn.addEventListener("click", () => {
      if (finished) return;
      if (running) { stopRun(); return; }
      running = true; runBtn.textContent = "Pause ❚❚";
      const delay = reduceMotion ? 0 : 480;
      if (delay === 0) {
        while (!finished) tick();
      } else {
        timer = setInterval(() => { tick(); if (finished) stopRun(); }, delay);
      }
    });
    resetBtn.addEventListener("click", () => reset());
    function reset() {
      stopRun(); finished = false; index = 1;
      Object.keys(values).forEach(k => delete values[k]);
      stepBtn.disabled = false; runBtn.disabled = false;
      renderCode(); renderWall();
      statusEl.textContent = "Tap Step for one lap at a time, or Run to send the loop round the whole wall.";
    }
    reset();
  })();

  /* ═══ D3: reach past the wall — Scores[6] and beyond ═══ */
  (function () {
    const SCORES3 = { 1: 12, 2: 7, 3: 30, 4: 4, 5: 19 };
    const IDX_MIN = 1, IDX_MAX = 7, IDX_UPPER = 5;
    let idx = 1, reachedBeyond = false;
    const wallEl = $("#wall3"), labelEl = $("#idxLabel3"), readoutEl = $("#readout3"), statusEl = $("#status3");
    const chips3 = makeChips($("#chips3"), ["edge", "beyond", "back"],
      () => awardStar("d3", "Reaching past where an array ends doesn't crash anything — it's simply asking for a compartment that was never declared, and the wall just tells you so."),
      k => ({ edge: "Checked a valid edge compartment", beyond: "Reached past where the wall ends", back: "Came back to a real compartment afterwards" }[k]),
      (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");

    function renderWall() {
      wallEl.innerHTML = "";
      for (let i = 1; i <= IDX_UPPER; i++) {
        const el = document.createElement("div");
        el.className = "pgh-cell pgh-cell-filled" + (i === idx ? " pgh-cell-cur" : "");
        el.innerHTML = '<span class="pgh-val">' + SCORES3[i] + '</span><span class="pgh-idx">' + i + "</span>";
        wallEl.appendChild(el);
      }
      for (let i = IDX_UPPER + 1; i <= IDX_MAX; i++) {
        const el = document.createElement("div");
        el.className = "pgh-cell pgh-cell-ghost" + (i === idx ? " pgh-cell-cur" : "");
        el.innerHTML = '<span class="pgh-val">·</span><span class="pgh-idx">' + i + "</span>";
        wallEl.appendChild(el);
      }
    }
    function render() {
      renderWall();
      labelEl.textContent = "Index: " + idx;
      if (idx <= IDX_UPPER) {
        readoutEl.innerHTML = '<span class="kw">OUTPUT</span> Scores[' + idx + "] = <b>" + SCORES3[idx] + "</b>";
        statusEl.textContent = "Scores[" + idx + "] is a real compartment, holding " + SCORES3[idx] + ".";
        if (idx === 1 || idx === IDX_UPPER) chips3("edge");
        if (reachedBeyond) chips3("back");
      } else {
        readoutEl.innerHTML = '<span class="kw">OUTPUT</span> Scores[' + idx + '] = <span class="muted">there’s no compartment there</span>';
        statusEl.textContent = "Scores only has 5 compartments, numbered 1 to 5 — Scores[" + idx + "] simply isn't part of the wall. Nothing crashes; there's just nothing there to read.";
        reachedBeyond = true;
        chips3("beyond");
      }
    }
    $("#idxBack3").addEventListener("click", () => { idx = Math.max(IDX_MIN, idx - 1); render(); });
    $("#idxFwd3").addEventListener("click", () => { idx = Math.min(IDX_MAX, idx + 1); render(); });
    render();
  })();

  /* ═══ D4: the grid — a small cinema seating plan, addressed [row, column] ═══ */
  (function () {
    const ROWS = 3, COLS = 3;
    const seats = {}; // "r,c" -> name
    const gridEl = $("#grid4"), codeEl = $("#code4"), statusEl = $("#status4"), nameInput = $("#nameInput4");
    const chips4 = makeChips($("#chips4"), ["front", "back", "middle"],
      () => awardStar("d4", "Every seat needed two numbers to find it — row first, column second — and you addressed the front, the back and the middle of the grid using exactly that order."),
      k => ({ front: "Addressed the front-left seat", back: "Addressed the back-right seat", middle: "Addressed the middle seat" }[k]),
      (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");

    function renderGrid() {
      gridEl.innerHTML = "";
      gridEl.style.setProperty("--pg-cols", String(COLS));
      for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) {
          const key = r + "," + c;
          const name = seats[key];
          const b = document.createElement("button");
          b.type = "button";
          b.className = "pgh-seat" + (name ? " pgh-seat-filled" : "");
          b.setAttribute("aria-label", "seat row " + r + ", column " + c + (name ? ", holds " + name : ", empty"));
          b.innerHTML = '<span class="pgh-seat-addr">[' + r + "," + c + ']</span><span class="pgh-seat-name">' + (name ? escapeHtml22(name) : "—") + "</span>";
          b.addEventListener("click", () => placeSeat(r, c));
          gridEl.appendChild(b);
        }
      }
    }
    function placeSeat(r, c) {
      const raw = nameInput.value.trim();
      const key = r + "," + c;
      if (raw === "") { delete seats[key]; } else { seats[key] = raw; }
      renderGrid();
      codeEl.innerHTML = "Seats[" + r + ", " + c + '] <span class="arrow">←</span> ' + (raw === "" ? '""' : '"' + escapeHtml22(raw) + '"');
      statusEl.textContent = raw === ""
        ? "Seat [" + r + ", " + c + "] cleared — row " + r + ", column " + c + "."
        : raw + " is now seated at [" + r + ", " + c + "] — row " + r + " first, column " + c + " second.";
      if (raw !== "") {
        if (r === 1 && c === 1) chips4("front");
        if (r === ROWS && c === COLS) chips4("back");
        if (r === 2 && c === 2) chips4("middle");
      }
    }
    function escapeHtml22(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    renderGrid();
  })();

  /* ═══ D5: the sweep — nested FORs paint the grid, order swappable ═══ */
  (function () {
    const ROWS = 3, COLS = 3;
    let order = "rows"; // "rows" = outer Row, inner Col (reading order); "cols" = outer Col, inner Row
    let painted = {}, pos = 0, finished = false, running = false, timer = null;
    const codeEl = $("#code5"), gridEl = $("#grid5"), statusEl = $("#status5"), barEl = $("#bar5"), orderBarEl = $("#orderBar5");

    const chips5 = makeChips($("#chips5"), ["rows", "cols"],
      () => awardStar("d5", "Same nested loops, same grid, two different sweeps — swapping which loop sits inside turned the whole painting sideways, seat for seat."),
      k => ({ rows: "Painted it in reading order — rows first", cols: "Painted it in columns instead" }[k]),
      (label, remaining) => "Noticed ✦ — " + label + ". " + remaining + " more to go.");

    function sequence() {
      const cells = [];
      if (order === "rows") {
        for (let r = 1; r <= ROWS; r++) for (let c = 1; c <= COLS; c++) cells.push([r, c]);
      } else {
        for (let c = 1; c <= COLS; c++) for (let r = 1; r <= ROWS; r++) cells.push([r, c]);
      }
      return cells;
    }
    function renderCode() {
      if (order === "rows") {
        codeEl.innerHTML =
          '<div class="pcline"><span class="kw">FOR</span> Row <span class="arrow">←</span> 1 <span class="kw">TO</span> 3</div>' +
          '<div class="pcline">  <span class="kw">FOR</span> Col <span class="arrow">←</span> 1 <span class="kw">TO</span> 3</div>' +
          '<div class="pcline">    paint Seats[Row, Col]</div>' +
          '<div class="pcline">  <span class="kw">NEXT</span> Col</div>' +
          '<div class="pcline"><span class="kw">NEXT</span> Row</div>';
      } else {
        codeEl.innerHTML =
          '<div class="pcline"><span class="kw">FOR</span> Col <span class="arrow">←</span> 1 <span class="kw">TO</span> 3</div>' +
          '<div class="pcline">  <span class="kw">FOR</span> Row <span class="arrow">←</span> 1 <span class="kw">TO</span> 3</div>' +
          '<div class="pcline">    paint Seats[Row, Col]</div>' +
          '<div class="pcline">  <span class="kw">NEXT</span> Row</div>' +
          '<div class="pcline"><span class="kw">NEXT</span> Col</div>';
      }
    }
    function renderGrid() {
      gridEl.innerHTML = "";
      gridEl.style.setProperty("--pg-cols", String(COLS));
      for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) {
          const key = r + "," + c;
          const seq = painted[key];
          const el = document.createElement("div");
          el.className = "pgh-seat" + (seq ? " pgh-seat-painted" : "");
          el.innerHTML = '<span class="pgh-seat-addr">[' + r + "," + c + "]</span>" + (seq ? '<span class="pgh-seat-seq">' + seq + "</span>" : "");
          gridEl.appendChild(el);
        }
      }
    }
    function mkBtn(cls, label) {
      const b = document.createElement("button");
      b.type = "button"; b.className = cls; b.textContent = label;
      return b;
    }
    const stepBtn = mkBtn("loop-btn", "Step one seat ▸");
    const runBtn = mkBtn("loop-btn primary", "Run the sweep ▶");
    const resetBtn = mkBtn("loop-btn ghost", "↺ Reset");
    barEl.appendChild(stepBtn); barEl.appendChild(runBtn); barEl.appendChild(resetBtn);

    function stopRun() {
      running = false; runBtn.textContent = "Run the sweep ▶";
      if (timer) { clearInterval(timer); timer = null; }
    }
    function tick() {
      if (finished) return;
      const seq = sequence();
      if (pos >= seq.length) {
        finished = true; stopRun();
        stepBtn.disabled = true; runBtn.disabled = true;
        statusEl.textContent = "All nine seats painted, " + (order === "rows" ? "row by row" : "column by column") + " — that's the whole sweep, in exactly the order the two loops actually visited it.";
        chips5(order);
        return;
      }
      const rc = seq[pos];
      pos++;
      painted[rc[0] + "," + rc[1]] = pos;
      renderGrid();
      statusEl.textContent = "Seat [" + rc[0] + "," + rc[1] + "] — number " + pos + " of 9 painted.";
    }
    stepBtn.addEventListener("click", () => { if (!running) tick(); });
    runBtn.addEventListener("click", () => {
      if (finished) return;
      if (running) { stopRun(); return; }
      running = true; runBtn.textContent = "Pause ❚❚";
      const delay = reduceMotion ? 0 : 320;
      if (delay === 0) {
        while (!finished) tick();
      } else {
        timer = setInterval(() => { tick(); if (finished) stopRun(); }, delay);
      }
    });
    resetBtn.addEventListener("click", () => resetSweep());
    function resetSweep() {
      stopRun(); finished = false; pos = 0; painted = {};
      stepBtn.disabled = false; runBtn.disabled = false;
      renderCode(); renderGrid();
      statusEl.textContent = "Tap Step to paint the first seat, or Run to watch the whole sweep.";
    }

    const orderBtn = document.createElement("button");
    orderBtn.type = "button"; orderBtn.className = "btn ghost";
    orderBarEl.appendChild(orderBtn);
    makeCycler(orderBtn, ["rows", "cols"],
      v => v === "rows" ? "Sweep order: Rows first (outer Row, inner Col)" : "Sweep order: Columns first (outer Col, inner Row)",
      v => { order = v; resetSweep(); });

    resetSweep();
  })();

  /* ═══ D6: mini-trace — find the largest, bridges to Module 23 ═══ */
  (function () {
    const SCORES6 = { 1: 7, 2: 3, 3: 15, 4: 9, 5: 20 };
    const wallEl = $("#wall6");
    wallEl.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const el = document.createElement("div");
      el.className = "pgh-cell pgh-cell-filled";
      el.innerHTML = '<span class="pgh-val">' + SCORES6[i] + '</span><span class="pgh-idx">' + i + "</span>";
      wallEl.appendChild(el);
    }

    function renderCode(mountEl, lines) {
      mountEl.innerHTML = lines
        .map((html, i) => '<div class="pcline" data-line="' + (i + 1) + '">' + html + "</div>")
        .join("");
    }
    function highlightLine(mountEl, n) {
      $$(".pcline", mountEl).forEach(el => {
        el.classList.toggle("cur", Number(el.dataset.line) === n);
      });
    }

    /* Compact trace grid — same shape as Module 20's makeTraceGrid: rows
       unlock top to bottom, tapping an unlocked box opens a small pad of
       candidate values, a correct pick glows amber, a wrong one leaves the
       box exactly as quiet as before with a soft "look again" pointer. */
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

    renderCode($("#code6"), [
      'Largest <span class="arrow">←</span> Scores[1]',
      '<span class="kw">FOR</span> Index <span class="arrow">←</span> 2 <span class="kw">TO</span> 5',
      '  <span class="kw">IF</span> Scores[Index] &gt; Largest',
      '    <span class="kw">THEN</span>',
      '      Largest <span class="arrow">←</span> Scores[Index]',
      '  <span class="kw">ENDIF</span>',
      '<span class="kw">NEXT</span> Index',
      '<span class="kw">OUTPUT</span> Largest'
    ]);
    makeTraceGrid({
      codeEl: $("#code6"), gridEl: $("#grid6"), statusEl: $("#status6"), padEl: $("#pad6"),
      columns: [{ key: "Index", label: "Index" }, { key: "Largest", label: "Largest" }, { key: "OUTPUT", label: "OUTPUT" }],
      rows: [
        { label: "Line 1", line: 1, cells: { Largest: { value: 7, options: [7, 0, 3, 20] } } },
        {
          label: "Lap Index 2", line: 3, cells: { Index: { value: 2, options: [2, 1, 3, 5] } },
          hint: "Look again at Lap 2 — Scores[2] is 3, and 3 > 7 is false, so THEN never fires and Largest has nothing new to show."
        },
        { label: "Lap Index 3", line: 5, cells: { Index: { value: 3, options: [3, 2, 4, 5] }, Largest: { value: 15, options: [15, 7, 3, 20] } } },
        {
          label: "Lap Index 4", line: 3, cells: { Index: { value: 4, options: [4, 3, 5, 2] } },
          hint: "Look again at Lap 4 — Scores[4] is 9, and 9 > 15 is false, so Largest stays exactly where it was after Lap 3."
        },
        { label: "Lap Index 5", line: 5, cells: { Index: { value: 5, options: [5, 4, 3, 2] }, Largest: { value: 20, options: [20, 15, 9, 7] } } },
        { label: "Line 8 · OUTPUT", line: 8, cells: { OUTPUT: { value: 20, options: [20, 15, 9, 7] } } }
      ],
      introStatus: "Tap Line 1's box to begin.",
      doneMessage: "All five laps traced — OUTPUT prints 20, the biggest value that was ever sitting on the wall.",
      onComplete: () => awardStar("d6", "The exact shape of Module 23's whole toolkit: sweep the wall once, keep the best answer seen so far, and only replace it when something actually beats it.")
    });
  })();
