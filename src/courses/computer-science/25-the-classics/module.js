
  /* ================= Module 23 — The Classics =================
   Signature interaction: the pigeonhole wall from Module 22, with different
   algorithm "lenses" clipped onto the same six-compartment wall — a running
   total, a conditional count, a challenger-vs-champion max-finder and a
   patient search finger (D1-D4), plus a five-compartment bubble-sort row
   (D5) and a shuffled-pseudocode reassembly of Module 22's own max-finder
   (D6). No shared kit covers a wall of compartments, a step/run loop engine,
   or a shuffle-into-slots reordering board, so all three are hand-rolled
   here, same choice Module 22 made for its wall/grid and Module 9 made for
   its line-pairing engine (rule of two). Runs inside the shared engine IIFE,
   so $, $$, awardStar, toast, sparks, makeChips, makeCycler and reduceMotion
   are all in scope. */

  /* ═══ shared wall data for D1-D4: one wall, four lenses ═══ */
  const SCORES = { 1: 62, 2: 45, 3: 78, 4: 51, 5: 90, 6: 33 };
  const WALL_N = 6;

  function mkBtn(cls, label) {
    const b = document.createElement("button");
    b.type = "button"; b.className = cls; b.textContent = label;
    return b;
  }

  /* ═══ D1: the running total ═══ */
  (function () {
    const codeEl = $("#code1"), wallEl = $("#wall1"), readoutEl = $("#readout1"), statusEl = $("#status1"), barEl = $("#bar1");
    let index = 1, total = 0, finished = false, running = false, timer = null;

    const stepBtn = mkBtn("loop-btn", "Step one lap ▸");
    const runBtn = mkBtn("loop-btn primary", "Run the loop ▶");
    const resetBtn = mkBtn("loop-btn ghost", "↺ Reset");
    barEl.appendChild(stepBtn); barEl.appendChild(runBtn); barEl.appendChild(resetBtn);

    function renderCode() {
      const active = !finished;
      codeEl.innerHTML =
        '<div class="pcline">DECLARE Scores : ARRAY[1:6] OF INTEGER</div>' +
        '<div class="pcline">DECLARE Total, Index : INTEGER</div>' +
        '<div class="pcline">DECLARE Average : REAL</div>' +
        '<div class="pcline">Total <span class="arrow">←</span> 0</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">FOR</span> Index <span class="arrow">←</span> 1 <span class="kw">TO</span> 6</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  Total <span class="arrow">←</span> Total + Scores[Index]</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">NEXT</span> Index</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">OUTPUT</span> Total</div>' +
        '<div class="pcline' + (finished ? " cur" : "") + '">Average <span class="arrow">←</span> Total / 6</div>' +
        '<div class="pcline' + (finished ? " cur" : "") + '"><span class="kw">OUTPUT</span> Average</div>';
    }
    function renderWall() {
      wallEl.innerHTML = "";
      for (let i = 1; i <= WALL_N; i++) {
        const el = document.createElement("div");
        el.className = "pgh-cell pgh-cell-filled" + (!finished && i === index ? " pgh-cell-cur" : "");
        el.innerHTML = '<span class="pgh-val">' + SCORES[i] + '</span><span class="pgh-idx">' + i + "</span>";
        wallEl.appendChild(el);
      }
    }
    function fmtAvg(n) {
      const r = Math.round(n * 100) / 100;
      return String(r);
    }
    function stopRun() {
      running = false; runBtn.textContent = "Run the loop ▶";
      if (timer) { clearInterval(timer); timer = null; }
    }
    function tick() {
      if (finished) return;
      if (index > WALL_N) {
        finished = true; stopRun();
        stepBtn.disabled = true; runBtn.disabled = true;
        renderCode(); renderWall();
        const avg = fmtAvg(total / WALL_N);
        readoutEl.innerHTML = "Total = <b>" + total + "</b><br>Average = <b>" + avg + "</b>";
        statusEl.textContent = "Index is now 7 — the loop finishes. Total = " + total + ", every compartment added exactly once. Average = Total ÷ 6 = " + avg + ".";
        awardStar("d1", "Total never got reset partway through — it just kept absorbing one more compartment every lap until all six were in.");
        return;
      }
      const before = total;
      total += SCORES[index];
      statusEl.textContent = "Index is " + index + " — Total ← " + before + " + " + SCORES[index] + " = " + total + ".";
      readoutEl.innerHTML = "Total so far = <b>" + total + "</b>";
      index++;
      renderWall();
    }
    stepBtn.addEventListener("click", () => { if (!running) tick(); });
    runBtn.addEventListener("click", () => {
      if (finished) return;
      if (running) { stopRun(); return; }
      running = true; runBtn.textContent = "Pause ❚❚";
      const delay = reduceMotion ? 0 : 480;
      if (delay === 0) { while (!finished) tick(); } else {
        timer = setInterval(() => { tick(); if (finished) stopRun(); }, delay);
      }
    });
    resetBtn.addEventListener("click", () => reset());
    function reset() {
      stopRun(); finished = false; index = 1; total = 0;
      stepBtn.disabled = false; runBtn.disabled = false;
      renderCode(); renderWall();
      readoutEl.innerHTML = "Total so far = <b>0</b>";
      statusEl.textContent = "Tap Step for one lap at a time, or Run to send the loop round the whole wall.";
    }
    reset();
  })();

  /* ═══ D2: counting with a condition ═══ */
  (function () {
    const codeEl = $("#code2"), wallEl = $("#wall2"), readoutEl = $("#readout2"), statusEl = $("#status2"), barEl = $("#bar2");
    let index = 1, count = 0, finished = false, running = false, timer = null;
    const countedSet = new Set();

    const stepBtn = mkBtn("loop-btn", "Step one lap ▸");
    const runBtn = mkBtn("loop-btn primary", "Run the loop ▶");
    const resetBtn = mkBtn("loop-btn ghost", "↺ Reset");
    barEl.appendChild(stepBtn); barEl.appendChild(runBtn); barEl.appendChild(resetBtn);

    function renderCode() {
      const active = !finished;
      codeEl.innerHTML =
        '<div class="pcline">DECLARE Scores : ARRAY[1:6] OF INTEGER</div>' +
        '<div class="pcline">DECLARE Count, Index : INTEGER</div>' +
        '<div class="pcline">Count <span class="arrow">←</span> 0</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">FOR</span> Index <span class="arrow">←</span> 1 <span class="kw">TO</span> 6</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  <span class="kw">IF</span> Scores[Index] &gt; 50</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">    <span class="kw">THEN</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">      Count <span class="arrow">←</span> Count + 1</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  <span class="kw">ENDIF</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">NEXT</span> Index</div>' +
        '<div class="pcline' + (finished ? " cur" : "") + '"><span class="kw">OUTPUT</span> Count</div>';
    }
    function renderWall() {
      wallEl.innerHTML = "";
      for (let i = 1; i <= WALL_N; i++) {
        const el = document.createElement("div");
        let cls = "pgh-cell pgh-cell-filled";
        if (countedSet.has(i)) cls += " pgh-cell-match";
        if (!finished && i === index) cls += " pgh-cell-cur";
        el.className = cls;
        el.innerHTML = '<span class="pgh-val">' + SCORES[i] + '</span><span class="pgh-idx">' + i + "</span>";
        wallEl.appendChild(el);
      }
    }
    function stopRun() {
      running = false; runBtn.textContent = "Run the loop ▶";
      if (timer) { clearInterval(timer); timer = null; }
    }
    function tick() {
      if (finished) return;
      if (index > WALL_N) {
        finished = true; stopRun();
        stepBtn.disabled = true; runBtn.disabled = true;
        renderCode(); renderWall();
        readoutEl.innerHTML = "Count = <b>" + count + "</b>";
        statusEl.textContent = "Index is now 7 — the loop finishes. Every compartment was visited, but Count only climbed on the ones over 50. Final Count = " + count + ".";
        awardStar("d2", "Every compartment got checked — the loop never skips one — but Count only ever moved on the compartments that actually met the condition.");
        return;
      }
      const val = SCORES[index];
      const passes = val > 50;
      if (passes) { count++; countedSet.add(index); }
      statusEl.textContent = "Index is " + index + " — Scores[" + index + "] is " + val + ", and " + val + " > 50 is " + (passes ? "true." : "false.") + " Count is " + count + ".";
      readoutEl.innerHTML = "Count so far = <b>" + count + "</b>";
      index++;
      renderWall();
    }
    stepBtn.addEventListener("click", () => { if (!running) tick(); });
    runBtn.addEventListener("click", () => {
      if (finished) return;
      if (running) { stopRun(); return; }
      running = true; runBtn.textContent = "Pause ❚❚";
      const delay = reduceMotion ? 0 : 480;
      if (delay === 0) { while (!finished) tick(); } else {
        timer = setInterval(() => { tick(); if (finished) stopRun(); }, delay);
      }
    });
    resetBtn.addEventListener("click", () => reset());
    function reset() {
      stopRun(); finished = false; index = 1; count = 0; countedSet.clear();
      stepBtn.disabled = false; runBtn.disabled = false;
      renderCode(); renderWall();
      readoutEl.innerHTML = "Count so far = <b>0</b>";
      statusEl.textContent = "Tap Step for one lap at a time, or Run to send the loop round the whole wall.";
    }
    reset();
  })();

  /* ═══ D3: king of the wall — champion vs challenger ═══ */
  (function () {
    const codeEl = $("#code3"), wallEl = $("#wall3"), readoutEl = $("#readout3"), statusEl = $("#status3"), barEl = $("#bar3");
    let challenger = 2, champion = SCORES[1], champIdx = 1, finished = false, running = false, timer = null;

    const stepBtn = mkBtn("loop-btn", "Step one challenger ▸");
    const runBtn = mkBtn("loop-btn primary", "Run them all ▶");
    const resetBtn = mkBtn("loop-btn ghost", "↺ Reset");
    barEl.appendChild(stepBtn); barEl.appendChild(runBtn); barEl.appendChild(resetBtn);

    function renderCode() {
      const active = !finished;
      codeEl.innerHTML =
        '<div class="pcline">DECLARE Scores : ARRAY[1:6] OF INTEGER</div>' +
        '<div class="pcline">DECLARE Champion, Challenger : INTEGER</div>' +
        '<div class="pcline">Champion <span class="arrow">←</span> Scores[1]</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">FOR</span> Challenger <span class="arrow">←</span> 2 <span class="kw">TO</span> 6</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  <span class="kw">IF</span> Scores[Challenger] &gt; Champion</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">    <span class="kw">THEN</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">      Champion <span class="arrow">←</span> Scores[Challenger]</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  <span class="kw">ENDIF</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">NEXT</span> Challenger</div>' +
        '<div class="pcline' + (finished ? " cur" : "") + '"><span class="kw">OUTPUT</span> Champion</div>';
    }
    function renderWall() {
      wallEl.innerHTML = "";
      for (let i = 1; i <= WALL_N; i++) {
        const el = document.createElement("div");
        let cls = "pgh-cell pgh-cell-filled";
        if (i === champIdx) cls += " pgh-cell-match";
        if (!finished && i === challenger) cls += " pgh-cell-cur";
        el.className = cls;
        el.innerHTML = '<span class="pgh-val">' + SCORES[i] + '</span><span class="pgh-idx">' + i + "</span>";
        wallEl.appendChild(el);
      }
    }
    function stopRun() {
      running = false; runBtn.textContent = "Run them all ▶";
      if (timer) { clearInterval(timer); timer = null; }
    }
    function tick() {
      if (finished) return;
      if (challenger > WALL_N) {
        finished = true; stopRun();
        stepBtn.disabled = true; runBtn.disabled = true;
        renderCode(); renderWall();
        readoutEl.innerHTML = "Champion = <b>" + champion + "</b>";
        statusEl.textContent = "Challenger is now 7 — every compartment has had its shot. Champion stays " + champion + " — nobody managed to beat it after it was crowned.";
        awardStar("d3", "Champion only ever changed hands when a challenger genuinely beat whoever currently held the title — never on a whim, never by resetting.");
        return;
      }
      const val = SCORES[challenger];
      const beats = val > champion;
      statusEl.textContent = "Challenger " + challenger + " is " + val + ". " + val + " > " + champion + " is " + (beats ? "true — new Champion!" : "false — Champion keeps the title.");
      if (beats) { champion = val; champIdx = challenger; }
      readoutEl.innerHTML = "Champion = <b>" + champion + "</b>";
      challenger++;
      renderWall();
    }
    stepBtn.addEventListener("click", () => { if (!running) tick(); });
    runBtn.addEventListener("click", () => {
      if (finished) return;
      if (running) { stopRun(); return; }
      running = true; runBtn.textContent = "Pause ❚❚";
      const delay = reduceMotion ? 0 : 480;
      if (delay === 0) { while (!finished) tick(); } else {
        timer = setInterval(() => { tick(); if (finished) stopRun(); }, delay);
      }
    });
    resetBtn.addEventListener("click", () => reset());
    function reset() {
      stopRun(); finished = false; challenger = 2; champion = SCORES[1]; champIdx = 1;
      stepBtn.disabled = false; runBtn.disabled = false;
      renderCode(); renderWall();
      readoutEl.innerHTML = "Champion = <b>" + champion + "</b> (crowned with no contest)";
      statusEl.textContent = "Tap Step to send in the next challenger, or Run to send them all in.";
    }
    reset();

    /* -- optional extra: the trap-array toggle -- */
    const NEG3 = { 1: -42, 2: -15, 3: -63, 4: -8, 5: -71, 6: -29 };
    const trapReadout = $("#trapReadout3");
    const trapBtn = document.createElement("button");
    trapBtn.type = "button"; trapBtn.className = "btn ghost";
    $("#trapBar3").appendChild(trapBtn);
    trapReadout.innerHTML = "This wall's smallest score is still above 0, so starting Champion at 0 happens to still work here too — nothing to catch yet. Flip to the all-negative wall to find the trap.";
    makeCycler(trapBtn, ["normal", "negative"],
      v => v === "normal" ? "This wall (everyday numbers)" : "All-negative wall (optional)",
      v => {
        if (v === "normal") {
          trapReadout.innerHTML = "This wall's smallest score is still above 0, so starting Champion at 0 happens to still work here too — nothing to catch yet. Flip to the all-negative wall to find the trap.";
        } else {
          const correct = Math.max.apply(null, Object.keys(NEG3).map(k => NEG3[k]));
          trapReadout.innerHTML = "Correct champion (starting at Scores[1]): <b>" + correct + "</b>. If Champion had started at 0 instead: it would report <b>0</b> — but 0 isn't even one of the six numbers on this wall.";
        }
      });
  })();

  /* ═══ D4: the patient finger — linear search, including not-found ═══ */
  (function () {
    const codeEl = $("#code4"), wallEl = $("#wall4"), statusEl = $("#status4"), barEl = $("#bar4"), targetInput = $("#targetInput4");
    let idx = 1, target = null, found = false, finished = false, started = false, foundIdx = null, running = false, timer = null;

    const chips4 = makeChips($("#chips4"), ["found", "notfound"],
      () => awardStar("d4", "The finger stopping the instant it matched, and checking every compartment when it didn't — both of those are the algorithm working exactly as intended."),
      k => ({ found: "Found a Target that's on the wall", notfound: "Searched for a Target that isn't on the wall" }[k]),
      (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");

    const stepBtn = mkBtn("loop-btn", "Step one compartment ▸");
    const runBtn = mkBtn("loop-btn primary", "Run the search ▶");
    const resetBtn = mkBtn("loop-btn ghost", "↺ Reset");
    barEl.appendChild(stepBtn); barEl.appendChild(runBtn); barEl.appendChild(resetBtn);

    function renderCode() {
      const active = !finished;
      const targetDisplay = started ? String(target) : "?";
      codeEl.innerHTML =
        '<div class="pcline">DECLARE Scores : ARRAY[1:6] OF INTEGER</div>' +
        '<div class="pcline">DECLARE Target, Index : INTEGER</div>' +
        '<div class="pcline">DECLARE Found : BOOLEAN</div>' +
        '<div class="pcline"><span class="kw">INPUT</span> Target  <span class="muted">→ ' + targetDisplay + '</span></div>' +
        '<div class="pcline">Index <span class="arrow">←</span> 1</div>' +
        '<div class="pcline">Found <span class="arrow">←</span> <span class="kw">FALSE</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">REPEAT</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  <span class="kw">IF</span> Scores[Index] = Target</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">    <span class="kw">THEN</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">      Found <span class="arrow">←</span> <span class="kw">TRUE</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  <span class="kw">ENDIF</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  Index <span class="arrow">←</span> Index + 1</div>' +
        '<div class="pcline' + (finished ? " cur" : "") + '"><span class="kw">UNTIL</span> (Found = <span class="kw">TRUE</span>) <span class="kw">OR</span> (Index &gt; 6)</div>';
    }
    function renderWall() {
      wallEl.innerHTML = "";
      for (let i = 1; i <= WALL_N; i++) {
        const el = document.createElement("div");
        let cls = "pgh-cell pgh-cell-filled";
        if (foundIdx === i) cls += " pgh-cell-match";
        else if (i < idx) cls += " pgh-cell-checked";
        else if (!finished && i === idx) cls += " pgh-cell-cur";
        el.className = cls;
        el.innerHTML = '<span class="pgh-val">' + SCORES[i] + '</span><span class="pgh-idx">' + i + "</span>";
        wallEl.appendChild(el);
      }
    }
    function stopRun() {
      running = false; runBtn.textContent = "Run the search ▶";
      if (timer) { clearInterval(timer); timer = null; }
    }
    function tick() {
      if (finished) return;
      if (!started) {
        const raw = targetInput.value.trim();
        target = raw === "" ? 0 : Math.round(Number(raw));
        started = true;
        targetInput.disabled = true;
      }
      const thisIdx = idx;
      const val = SCORES[thisIdx];
      const match = val === target;
      statusEl.textContent = "Index is " + thisIdx + " — Scores[" + thisIdx + "] is " + val + ". " + val + " = " + target + " is " + (match ? "true — Found becomes TRUE." : "false.");
      if (match) { found = true; foundIdx = thisIdx; }
      idx++;
      renderWall();
      if (found || idx > WALL_N) {
        finished = true; stopRun();
        stepBtn.disabled = true; runBtn.disabled = true;
        renderCode();
        if (found) {
          statusEl.textContent = "Compartment " + thisIdx + " matched — Found is TRUE, and the finger stops right there. No need to check what's left.";
        } else {
          statusEl.textContent = "The finger checked every compartment — 1 through 6 — and " + target + " never matched. Found stays FALSE. That's not a mistake — the value genuinely isn't sitting in this wall, and now that's certain, because every single compartment got checked.";
        }
        chips4(found ? "found" : "notfound");
      }
    }
    stepBtn.addEventListener("click", () => { if (!running) tick(); });
    runBtn.addEventListener("click", () => {
      if (finished) return;
      if (running) { stopRun(); return; }
      running = true; runBtn.textContent = "Pause ❚❚";
      const delay = reduceMotion ? 0 : 480;
      if (delay === 0) { while (!finished) tick(); } else {
        timer = setInterval(() => { tick(); if (finished) stopRun(); }, delay);
      }
    });
    resetBtn.addEventListener("click", () => reset());
    function reset() {
      stopRun(); finished = false; started = false; idx = 1; found = false; foundIdx = null; target = null;
      targetInput.disabled = false;
      stepBtn.disabled = false; runBtn.disabled = false;
      renderCode(); renderWall();
      statusEl.textContent = "Type a Target, then press Step or Run to send the finger along the wall.";
    }
    reset();
  })();

  /* ═══ D5: bubbles rise — bubble sort, zero-swaps-means-done ═══ */
  (function () {
    const codeEl = $("#code5"), wallEl = $("#wall5"), statsEl = $("#stats5"), statusEl = $("#status5"), barEl = $("#bar5");
    const ARR5_INITIAL = [4, 1, 5, 2, 3];
    let arr = ARR5_INITIAL.slice();
    let passNum = 1, j = 1, swapsThisPass = 0, swappedThisPass = false, finished = false;
    let lastCompare = null, lastSwap = false, running = false, timer = null;

    const stepBtn = mkBtn("loop-btn", "Step one comparison ▸");
    const runBtn = mkBtn("loop-btn primary", "Run the sort ▶");
    const shuffleBtn = mkBtn("loop-btn ghost", "🔀 Shuffle");
    const resetBtn = mkBtn("loop-btn ghost", "↺ Reset");
    barEl.appendChild(stepBtn); barEl.appendChild(runBtn); barEl.appendChild(shuffleBtn); barEl.appendChild(resetBtn);

    function renderCode() {
      const active = !finished;
      codeEl.innerHTML =
        '<div class="pcline">DECLARE Numbers : ARRAY[1:5] OF INTEGER</div>' +
        '<div class="pcline">DECLARE J, Temp : INTEGER</div>' +
        '<div class="pcline">DECLARE Swapped : BOOLEAN</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '"><span class="kw">REPEAT</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  Swapped <span class="arrow">←</span> <span class="kw">FALSE</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  <span class="kw">FOR</span> J <span class="arrow">←</span> 1 <span class="kw">TO</span> 4</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">    <span class="kw">IF</span> Numbers[J] &gt; Numbers[J + 1]</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">      <span class="kw">THEN</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">        Temp <span class="arrow">←</span> Numbers[J]</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">        Numbers[J] <span class="arrow">←</span> Numbers[J + 1]</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">        Numbers[J + 1] <span class="arrow">←</span> Temp</div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">        Swapped <span class="arrow">←</span> <span class="kw">TRUE</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">    <span class="kw">ENDIF</span></div>' +
        '<div class="pcline' + (active ? " cur" : "") + '">  <span class="kw">NEXT</span> J</div>' +
        '<div class="pcline' + (finished ? " cur" : "") + '"><span class="kw">UNTIL</span> Swapped = <span class="kw">FALSE</span></div>';
    }
    function renderWall() {
      wallEl.innerHTML = "";
      for (let i = 1; i <= 5; i++) {
        const el = document.createElement("div");
        let cls = "pgh-cell pgh-cell-filled";
        if (lastCompare && lastCompare.indexOf(i) !== -1) {
          cls += lastSwap ? " pgh-cell-swapped" : " pgh-cell-cur";
        }
        el.className = cls;
        el.innerHTML = '<span class="pgh-val">' + arr[i - 1] + '</span><span class="pgh-idx">' + i + "</span>";
        wallEl.appendChild(el);
      }
    }
    function renderStats() {
      statsEl.textContent = "Pass " + passNum + " · Swaps this pass: " + swapsThisPass;
    }
    function stopRun() {
      running = false; runBtn.textContent = "Run the sort ▶";
      if (timer) { clearInterval(timer); timer = null; }
    }
    function tick() {
      if (finished) return;
      const a = arr[j - 1], b = arr[j];
      let swappedNow = false;
      if (a > b) {
        arr[j - 1] = b; arr[j] = a;
        swappedNow = true; swapsThisPass++; swappedThisPass = true;
      }
      statusEl.textContent = "Comparing compartments " + j + " and " + (j + 1) + ": " + a + " and " + b + ". " +
        (swappedNow ? (a + " > " + b + " is true, so they swap.") : (a + " > " + b + " is false — no swap."));
      lastCompare = [j, j + 1]; lastSwap = swappedNow;
      renderWall(); renderStats();
      j++;
      if (j > 4) {
        if (!swappedThisPass) {
          finished = true; stopRun();
          stepBtn.disabled = true; runBtn.disabled = true;
          lastCompare = null; lastSwap = false;
          renderCode(); renderWall(); renderStats();
          statusEl.textContent = "Pass " + passNum + " finished with 0 swaps — every neighbouring pair is already in the right order. That's the signal: the row is sorted, so the algorithm stops right here.";
          awardStar("d5", "Zero swaps on a whole pass means nothing was out of place — that's how the algorithm knows it's done without ever needing to look at the whole row at once.");
          return;
        }
        passNum++; j = 1; swapsThisPass = 0; swappedThisPass = false;
        renderStats();
      }
    }
    stepBtn.addEventListener("click", () => { if (!running) tick(); });
    runBtn.addEventListener("click", () => {
      if (finished) return;
      if (running) { stopRun(); return; }
      running = true; runBtn.textContent = "Pause ❚❚";
      const delay = reduceMotion ? 0 : 420;
      if (delay === 0) { while (!finished) tick(); } else {
        timer = setInterval(() => { tick(); if (finished) stopRun(); }, delay);
      }
    });
    function resetTo(newArr) {
      stopRun();
      finished = false; passNum = 1; j = 1; swapsThisPass = 0; swappedThisPass = false;
      lastCompare = null; lastSwap = false;
      arr = newArr.slice();
      stepBtn.disabled = false; runBtn.disabled = false;
      renderCode(); renderWall(); renderStats();
      statusEl.textContent = "Tap Step to compare the first two compartments, or Run to sweep the whole row.";
    }
    shuffleBtn.addEventListener("click", () => {
      const a = [1, 2, 3, 4, 5];
      for (let i = a.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[k]; a[k] = t;
      }
      resetTo(a);
      statusEl.textContent = "Freshly scrambled — tap Step or Run whenever you're ready to sort your own mess.";
    });
    resetBtn.addEventListener("click", () => resetTo(ARR5_INITIAL));
    resetTo(ARR5_INITIAL);
  })();

  /* ═══ D6: assemble one — reorder the shuffled max-finder from M22 ═══ */
  (function () {
    const ASM_LINES = [
      'Largest <span class="arrow">←</span> Scores[1]',
      '<span class="kw">FOR</span> Index <span class="arrow">←</span> 2 <span class="kw">TO</span> 5',
      '<span class="kw">IF</span> Scores[Index] &gt; Largest',
      '<span class="kw">THEN</span>',
      'Largest <span class="arrow">←</span> Scores[Index]',
      '<span class="kw">ENDIF</span>',
      '<span class="kw">NEXT</span> Index',
      '<span class="kw">OUTPUT</span> Largest'
    ];
    const slotsEl = $("#asmSlots6"), bankEl = $("#asmBank6"), statusEl = $("#status6");
    let selChip = null, selSlot = null, pairsDone = 0;

    ASM_LINES.forEach((line, i) => {
      const slot = document.createElement("button");
      slot.type = "button"; slot.className = "asm-slot"; slot.dataset.line = String(i);
      slot.innerHTML = '<div class="asm-slot-num">Line ' + (i + 1) + '</div><div class="asm-hint">tap or drop the line that goes here</div>';
      slot.addEventListener("click", () => selectSlot(slot));
      slotsEl.appendChild(slot);
    });

    const order = ASM_LINES.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1));
      const t = order[i]; order[i] = order[k]; order[k] = t;
    }
    order.forEach(idx => {
      const c = document.createElement("button");
      c.type = "button"; c.className = "asm-chip"; c.dataset.eng = String(idx);
      c.innerHTML = ASM_LINES[idx];
      c.addEventListener("click", e => { if (e.detail === 0) selectChip(c); });
      c.addEventListener("pointerdown", e => dragStart(e, c));
      bankEl.appendChild(c);
    });

    function selectChip(c) {
      if (c.classList.contains("used")) return;
      if (selChip === c) { c.classList.remove("sel"); selChip = null; return; }
      if (selChip) selChip.classList.remove("sel");
      selChip = c; c.classList.add("sel");
      if (selSlot) commit(selSlot, selChip);
    }
    function selectSlot(slot) {
      if (slot.classList.contains("filled")) return;
      if (selSlot === slot) { slot.classList.remove("sel"); selSlot = null; return; }
      if (selSlot) selSlot.classList.remove("sel");
      selSlot = slot; slot.classList.add("sel");
      if (selChip) commit(selSlot, selChip);
    }
    function clearSel() {
      if (selChip) { selChip.classList.remove("sel"); selChip = null; }
      if (selSlot) { selSlot.classList.remove("sel"); selSlot = null; }
    }
    function commit(slot, chip) {
      if (slot.classList.contains("filled") || chip.classList.contains("used")) { clearSel(); return; }
      const line = +slot.dataset.line, eng = +chip.dataset.eng;
      if (line === eng) {
        const hint = $(".asm-hint", slot);
        hint.className = "asm-hint asm-hint-filled";
        hint.innerHTML = "✓ " + ASM_LINES[eng];
        slot.classList.add("filled");
        chip.classList.add("used");
        const r = slot.getBoundingClientRect();
        sparks(r.left + r.width / 2, r.top);
        clearSel();
        pairsDone++;
        if (pairsDone === ASM_LINES.length) {
          statusEl.textContent = "All eight lines back in order — that's the exact program from Module 22, rebuilt from a shuffled pile.";
          awardStar("d6", "You didn't just recognise this program — you reconstructed it, line by line, from nothing but a shuffled pile and the logic that had to connect them.");
        } else {
          statusEl.textContent = "That line's in place. " + (ASM_LINES.length - pairsDone) + " to go.";
        }
      } else {
        statusEl.textContent = "Not that line yet — that one belongs somewhere else. Have another look at what has to happen at this point in the program.";
        clearSel();
      }
    }

    /* drag-and-drop via pointer events (one path for mouse, touch and pen) */
    let dragChip = null, ghost = null, dragging = false, ptrId = null, offX = 0, offY = 0, startX = 0, startY = 0;
    function dragStart(e, chip) {
      if (chip.classList.contains("used")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragChip = chip; ptrId = e.pointerId; dragging = false;
      startX = e.clientX; startY = e.clientY;
      document.addEventListener("pointermove", dragMove);
      document.addEventListener("pointerup", dragEnd);
      document.addEventListener("pointercancel", dragEnd);
    }
    function dragMove(e) {
      if (dragChip === null || e.pointerId !== ptrId) return;
      if (!dragging) {
        if (Math.hypot(e.clientX - startX, e.clientY - startY) < 6) return;
        dragging = true;
        const rect = dragChip.getBoundingClientRect();
        offX = startX - rect.left; offY = startY - rect.top;
        ghost = dragChip.cloneNode(true);
        ghost.classList.add("asm-ghost"); ghost.classList.remove("sel");
        ghost.style.width = rect.width + "px";
        document.body.appendChild(ghost);
        dragChip.classList.add("dragging");
        clearSel();
      }
      e.preventDefault();
      ghost.style.left = (e.clientX - offX) + "px";
      ghost.style.top = (e.clientY - offY) + "px";
      markDrop(slotUnder(e));
    }
    function dragEnd(e) {
      if (dragChip === null || e.pointerId !== ptrId) return;
      const chip = dragChip;
      document.removeEventListener("pointermove", dragMove);
      document.removeEventListener("pointerup", dragEnd);
      document.removeEventListener("pointercancel", dragEnd);
      if (dragging) {
        const slot = slotUnder(e);
        markDrop(null);
        if (ghost) { ghost.remove(); ghost = null; }
        chip.classList.remove("dragging");
        if (slot) commit(slot, chip);
      } else if (e.type !== "pointercancel") {
        selectChip(chip);
      }
      dragChip = null; dragging = false; ptrId = null;
    }
    function slotUnder(e) {
      if (ghost) ghost.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (ghost) ghost.style.visibility = "";
      const slot = el && el.closest ? el.closest(".asm-slot") : null;
      return slot && !slot.classList.contains("filled") ? slot : null;
    }
    function markDrop(slot) {
      $$(".asm-slot.drop-ok", slotsEl).forEach(s => { if (s !== slot) s.classList.remove("drop-ok"); });
      if (slot) slot.classList.add("drop-ok");
    }
  })();
