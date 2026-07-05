/* ================= Module 12 — Round and Round =================
   The signature interaction: a loop engine — a circular track the lantern
   runs round, with a station board reporting the loop's counter/condition
   each lap, and Step / Run / Go slow / Reset controls. The same ring
   scaffold (appendRing) and tick engine (buildLoopEngine) are reused by
   D1 (FOR), D2 (WHILE) and D3 (REPEAT) with different step() logic; D5's
   runaway train is a bespoke, continuously-ticking variant of the same
   ring because its shape (no discrete "attempt", a genuine race condition
   with a kill switch) doesn't fit the turn-based engine. D4 is a tap/drag
   sort onto three platforms, mirroring the kit `matcher`'s dual tap+drag
   path without pulling in the kit itself (six-into-three doesn't fit its
   1:1 slot model). Runs inside the shared engine IIFE, so $, $$,
   reduceMotion, sparks, toast, awardStar and makeChips are all in scope. */

  /* ═══ shared ring scaffold (decorative track; the real state lives on
     the station board text) ═══ */
  const RING_STATIONS = 10;
  function mkBtn(cls, label) {
    const b = document.createElement("button");
    b.type = "button"; b.className = cls; b.textContent = label;
    return b;
  }
  function appendRing(mount) {
    const ringWrap = document.createElement("div"); ringWrap.className = "loop-ring";
    const track = document.createElement("div"); track.className = "loop-track";
    for (let i = 0; i < RING_STATIONS; i++) {
      const angle = (i / RING_STATIONS) * 2 * Math.PI - Math.PI / 2;
      const dot = document.createElement("span"); dot.className = "loop-station";
      dot.style.left = (50 + 42 * Math.cos(angle)) + "%";
      dot.style.top = (50 + 42 * Math.sin(angle)) + "%";
      track.appendChild(dot);
    }
    const lantern = document.createElement("div");
    lantern.className = "loop-lantern"; lantern.setAttribute("aria-hidden", "true");
    track.appendChild(lantern);
    ringWrap.appendChild(track);
    mount.appendChild(ringWrap);
    function placeAt(i) {
      const angle = (i / RING_STATIONS) * 2 * Math.PI - Math.PI / 2;
      lantern.style.left = (50 + 42 * Math.cos(angle)) + "%";
      lantern.style.top = (50 + 42 * Math.sin(angle)) + "%";
    }
    placeAt(0);
    return { ringWrap, lantern, placeAt };
  }

  /* ═══ shared turn-based loop engine (used by D1/D2/D3) ═══
     opts: { initState, buildCode, step, initialBoardText, onFinish, showRun }
     step(state) → { state, boardText, finished, advanceLantern } */
  function buildLoopEngine(mountId, codeId, opts) {
    const mount = $("#" + mountId); mount.innerHTML = "";
    const codeEl = $("#" + codeId);
    const showRun = opts.showRun !== false;

    const bar = document.createElement("div"); bar.className = "loop-bar";
    const stepBtn = mkBtn("loop-btn", "Step one lap ▸");
    bar.appendChild(stepBtn);
    let runBtn = null, slowBtn = null;
    if (showRun) {
      runBtn = mkBtn("loop-btn primary", "Run the loop ▶");
      slowBtn = mkBtn("loop-btn ghost", "Go slow"); slowBtn.setAttribute("aria-pressed", "false");
      bar.appendChild(runBtn); bar.appendChild(slowBtn);
    }
    const resetBtn = mkBtn("loop-btn ghost", "↺ Reset");
    bar.appendChild(resetBtn);
    mount.appendChild(bar);

    const ring = appendRing(mount);
    const board = document.createElement("p");
    board.className = "station-board"; board.setAttribute("aria-live", "polite");
    mount.appendChild(board);

    let pos = 0, st, running = false, runTimer = null, slow = false, finished = false;

    function renderCode() { codeEl.innerHTML = opts.buildCode(st); }
    function stopRun() {
      running = false;
      if (runBtn) runBtn.textContent = "Run the loop ▶";
      if (runTimer) { clearInterval(runTimer); runTimer = null; }
    }
    function doTick() {
      if (finished) return;
      const r = opts.step(st);
      st = r.state;
      renderCode();
      board.textContent = r.boardText;
      if (r.advanceLantern !== false) { pos = (pos + 1) % RING_STATIONS; ring.placeAt(pos); }
      if (r.finished) {
        finished = true; stopRun();
        stepBtn.disabled = true; if (runBtn) runBtn.disabled = true;
        ring.ringWrap.classList.add("done");
        if (opts.onFinish) opts.onFinish(st, r);
      }
    }
    function startRun() {
      running = true; runBtn.textContent = "Pause ❚❚";
      const delay = reduceMotion ? 0 : (slow ? 1100 : 420);
      if (delay === 0) {
        while (!finished) doTick();
      } else {
        runTimer = setInterval(() => { doTick(); if (finished) stopRun(); }, delay);
      }
    }
    stepBtn.addEventListener("click", () => { if (!running) doTick(); });
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        if (finished) return;
        if (running) { stopRun(); return; }
        startRun();
      });
      slowBtn.addEventListener("click", () => {
        slow = !slow;
        slowBtn.classList.toggle("on", slow);
        slowBtn.setAttribute("aria-pressed", String(slow));
        if (running) { stopRun(); startRun(); }
      });
    }
    resetBtn.addEventListener("click", () => reset());
    function reset() {
      stopRun(); finished = false; pos = 0; ring.placeAt(0);
      stepBtn.disabled = false; if (runBtn) runBtn.disabled = false;
      ring.ringWrap.classList.remove("done");
      st = opts.initState();
      renderCode();
      board.textContent = opts.initialBoardText || "Tap Step to begin.";
    }
    reset();
    return { reset, get state() { return st; } };
  }

  /* ═══ D1: FOR — a countdown he parameterises ═══ */
  let engine1;
  let f1Start = 5, f1End = 1, f1Step = -1;
  function for1BuildCode(s) {
    const cur = !s.done ? " cur" : "";
    return '<div class="pcline"><span class="kw">FOR</span> Lap <span class="arrow">←</span> ' + f1Start +
      ' <span class="kw">TO</span> ' + f1End + ' <span class="kw">STEP</span> ' + f1Step + '</div>' +
      '<div class="pcline' + cur + '">  <span class="kw">OUTPUT</span> <span class="str">"Lap"</span>, Lap</div>' +
      '<div class="pcline"><span class="kw">NEXT</span> Lap</div>';
  }
  function for1Tick(s) {
    const passes = f1Step > 0 ? s.lap <= f1End : s.lap >= f1End;
    if (!passes) {
      return {
        state: Object.assign({}, s, { done: true }),
        boardText: "Condition Lap " + (f1Step > 0 ? "≤" : "≥") + " " + f1End + " is now false — loop finished after " +
          s.laps + " lap" + (s.laps === 1 ? "" : "s") + ".",
        finished: true, advanceLantern: false
      };
    }
    const lapVal = s.lap, laps = s.laps + 1, nextLap = lapVal + f1Step;
    return {
      state: { lap: nextLap, laps: laps, done: false },
      boardText: "Lap " + lapVal + " — OUTPUT \"Lap\", " + lapVal + " (lap " + laps + " so far)",
      finished: false
    };
  }
  function mkDial(container, label, values, formatFn, onChange) {
    const wrap = document.createElement("div"); wrap.className = "loop-dial";
    const lab = document.createElement("span"); lab.className = "loop-dial-label"; lab.textContent = label;
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "loop-cyc";
    btn.setAttribute("aria-label", label + " dial, tap to change");
    wrap.appendChild(lab); wrap.appendChild(btn);
    container.appendChild(wrap);
    return makeCycler(btn, values, formatFn, onChange);
  }
  mkDial($("#dials1"), "Start", [5, 8, 10], v => String(v), v => { f1Start = v; if (engine1) engine1.reset(); });
  mkDial($("#dials1"), "End", [1, 0], v => String(v), v => { f1End = v; if (engine1) engine1.reset(); });
  mkDial($("#dials1"), "Step", [-1, -2], v => String(v), v => { f1Step = v; if (engine1) engine1.reset(); });
  const check1 = makeChips($("#chips1"), [3, 5, 6, 10],
    () => awardStar("d1", "Every lap count found — FOR always includes both ends, and Step decides which laps in between get skipped."),
    v => v + " laps",
    (label, remaining) => "Made it happen — " + label + ". " + remaining + " more to find.");
  engine1 = buildLoopEngine("engine1", "code1", {
    initState: () => ({ lap: f1Start, laps: 0, done: false }),
    buildCode: for1BuildCode,
    step: for1Tick,
    onFinish: s => check1(s.laps)
  });

  /* ═══ D2: WHILE — checks before boarding ═══ */
  let engine2;
  let q2 = 3;
  function while2BuildCode(s) {
    const cur = !s.done ? " cur" : "";
    return '<div class="pcline' + cur + '"><span class="kw">WHILE</span> Queue &gt; 0 <span class="kw">DO</span></div>' +
      '<div class="pcline">  <span class="kw">OUTPUT</span> <span class="str">"Boarding — queue now "</span>, Queue - 1</div>' +
      '<div class="pcline">  Queue <span class="arrow">←</span> Queue - 1</div>' +
      '<div class="pcline"><span class="kw">ENDWHILE</span></div>';
  }
  function while2Tick(s) {
    if (!(s.queue > 0)) {
      const msg = s.ran === 0
        ? "Queue is " + s.queue + " — WHILE tests the condition first and it's already false, so the body never runs."
        : "Queue is 0 — WHILE tests the condition first, and now it's false, so the loop finishes after " + s.ran + " lap" + (s.ran === 1 ? "" : "s") + ".";
      return { state: Object.assign({}, s, { done: true }), boardText: msg, finished: true, advanceLantern: false };
    }
    const newQueue = s.queue - 1, ran = s.ran + 1;
    return {
      state: { queue: newQueue, ran: ran, done: false },
      boardText: "Queue was " + s.queue + " — condition true, so board one passenger. Queue now " + newQueue + ".",
      finished: false
    };
  }
  mkDial($("#dials2"), "Queue", [3, 0, 1, 5], v => String(v), v => { q2 = v; if (engine2) engine2.reset(); });
  const check2 = makeChips($("#chips2"), [0, 1, 3, 5],
    () => awardStar("d2", "Every queue length tried, including zero — WHILE checks first, so a false start means the body never runs at all, not even once."),
    v => (v === 0 ? "ran zero times" : "ran " + v + " time" + (v > 1 ? "s" : "")),
    (label, remaining) => "Noticed — a queue that " + label + ". " + remaining + " more to try.");
  engine2 = buildLoopEngine("engine2", "code2", {
    initState: () => ({ queue: q2, ran: 0, done: false }),
    buildCode: while2BuildCode,
    step: while2Tick,
    onFinish: s => check2(s.ran)
  });

  /* ═══ D3: REPEAT — checks after, the door-code retry ═══ */
  let engine3;
  let code3Guess = "07";
  function repeat3BuildCode(s) {
    const cur = !s.done ? " cur" : "";
    return '<div class="pcline"><span class="kw">REPEAT</span></div>' +
      '<div class="pcline' + cur + '">  <span class="kw">OUTPUT</span> <span class="str">"Try the door code"</span></div>' +
      '<div class="pcline' + cur + '">  <span class="kw">INPUT</span> Code</div>' +
      '<div class="pcline"><span class="kw">UNTIL</span> Code = <span class="str">"19"</span></div>';
  }
  function repeat3Tick(s) {
    const guess = code3Guess, tries = s.tries + 1, matched = guess === "19";
    if (matched) {
      return {
        state: { tries: tries, done: true },
        boardText: "Tried " + guess + " — it matches! UNTIL Code = 19 is now true, so the loop stops. That's " + tries +
          " lap" + (tries === 1 ? "" : "s") + " in total" + (tries === 1 ? " — even a first-guess match still had to run the body once." : "."),
        finished: true, advanceLantern: false
      };
    }
    return {
      state: { tries: tries, done: false },
      boardText: "Tried " + guess + " — UNTIL Code = 19 is false, so REPEAT loops again.",
      finished: false
    };
  }
  mkDial($("#dials3"), "Code", ["07", "42", "63", "19"], v => v, v => { code3Guess = v; if (engine3) engine3.reset(); });
  engine3 = buildLoopEngine("engine3", "code3", {
    initState: () => ({ tries: 0, done: false }),
    buildCode: repeat3BuildCode,
    step: repeat3Tick,
    showRun: false,
    onFinish: s => awardStar("d3", "The door code opened — however many guesses it took, the body ran at least once before the check could even happen. That's what REPEAT…UNTIL always guarantees.")
  });

  /* ═══ D4: pick the loop — six scenarios, three platforms ═══ */
  const SCENARIOS4 = [
    { id: "s1", label: "Print the numbers 1 to 20.", ans: "FOR" },
    { id: "s2", label: "Keep re-entering a top-up amount until the machine accepts it.", ans: "REPEAT" },
    { id: "s3", label: "While there's still credit on the card, keep dispensing snacks.", ans: "WHILE" },
    { id: "s4", label: "Read exactly 30 names from the register, one at a time.", ans: "FOR" },
    { id: "s5", label: "Keep pinging the server until it replies.", ans: "REPEAT" },
    { id: "s6", label: "While the queue isn't empty, serve the next customer.", ans: "WHILE" }
  ];
  const scenarioEls4 = {}, platformEls4 = {};
  let selectedScenario4 = null, placed4 = 0;
  const pool4 = $("#scenarioPool4"), status4 = $("#status4");

  function selectScenario4(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedScenario4 === id) {
      btn.classList.remove("sel"); selectedScenario4 = null;
      status4.textContent = "Tap a scenario to begin.";
      return;
    }
    $$(".scenario-chip", pool4).forEach(c => c.classList.remove("sel"));
    selectedScenario4 = id; btn.classList.add("sel");
    const s = SCENARIOS4.find(x => x.id === id);
    status4.textContent = "Now tap the platform you think “" + s.label + "” belongs on.";
  }
  function tryPlace4(key) {
    if (!selectedScenario4) return;
    const s = SCENARIOS4.find(x => x.id === selectedScenario4);
    const btn = scenarioEls4[s.id];
    if (s.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      const line = document.createElement("div"); line.className = "platform-item"; line.textContent = s.label;
      platformEls4[key].list.appendChild(line);
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed4++; selectedScenario4 = null;
      if (placed4 === SCENARIOS4.length) {
        status4.textContent = "All six sorted — every job found its platform.";
        awardStar("d4", "All six sorted onto the loop that actually fits — known lap count, checked first, or checked after. Same three questions, every time.");
      } else {
        status4.textContent = "That's the one. " + (SCENARIOS4.length - placed4) + " more to go.";
      }
    } else {
      toast("Not that platform — think again about whether this job knows its lap count in advance, or has to try before it can check anything.");
      btn.classList.remove("sel"); selectedScenario4 = null;
      status4.textContent = "Tap a scenario to try again.";
    }
  }
  function platformUnder4(e) {
    if (dragGhost4) dragGhost4.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost4) dragGhost4.style.visibility = "";
    const plat = el && el.closest ? el.closest(".platform") : null;
    if (!plat) return null;
    for (const k in platformEls4) { if (platformEls4[k].wrap === plat) return k; }
    return null;
  }
  function markHover4(key) {
    Object.keys(platformEls4).forEach(k => platformEls4[k].wrap.classList.toggle("drop-ok", k === key));
  }
  let dragId4 = null, dragging4 = false, dragGhost4 = null, dragPtrId4 = null;
  let dragStartX4 = 0, dragStartY4 = 0, dragOffX4 = 0, dragOffY4 = 0;
  function dragStart4(e, id, btn) {
    if (btn.classList.contains("placed")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragId4 = id; dragPtrId4 = e.pointerId; dragging4 = false;
    dragStartX4 = e.clientX; dragStartY4 = e.clientY;
    document.addEventListener("pointermove", dragMove4);
    document.addEventListener("pointerup", dragEnd4);
    document.addEventListener("pointercancel", dragEnd4);
  }
  function dragMove4(e) {
    if (dragId4 === null || e.pointerId !== dragPtrId4) return;
    const btn = scenarioEls4[dragId4];
    if (!dragging4) {
      if (Math.hypot(e.clientX - dragStartX4, e.clientY - dragStartY4) < 6) return;
      dragging4 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX4 = dragStartX4 - rect.left; dragOffY4 = dragStartY4 - rect.top;
      dragGhost4 = btn.cloneNode(true);
      dragGhost4.classList.add("scenario-ghost"); dragGhost4.classList.remove("sel");
      dragGhost4.style.width = rect.width + "px";
      document.body.appendChild(dragGhost4);
      btn.classList.add("dragging");
      $$(".scenario-chip", pool4).forEach(c => c.classList.remove("sel"));
      selectedScenario4 = null;
    }
    e.preventDefault();
    dragGhost4.style.left = (e.clientX - dragOffX4) + "px";
    dragGhost4.style.top = (e.clientY - dragOffY4) + "px";
    markHover4(platformUnder4(e));
  }
  function dragEnd4(e) {
    if (dragId4 === null || e.pointerId !== dragPtrId4) return;
    const id = dragId4, btn = scenarioEls4[id];
    document.removeEventListener("pointermove", dragMove4);
    document.removeEventListener("pointerup", dragEnd4);
    document.removeEventListener("pointercancel", dragEnd4);
    if (dragging4) {
      const key = platformUnder4(e);
      markHover4(null);
      if (dragGhost4) { dragGhost4.remove(); dragGhost4 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedScenario4 = id; tryPlace4(key); }
    } else if (e.type !== "pointercancel") {
      selectScenario4(id, btn);
    }
    dragId4 = null; dragging4 = false; dragPtrId4 = null;
  }
  function buildScenarioChip4(s) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "scenario-chip"; b.textContent = s.label; b.dataset.id = s.id;
    b.addEventListener("click", () => { if (!dragging4) selectScenario4(s.id, b); });
    b.addEventListener("pointerdown", e => dragStart4(e, s.id, b));
    scenarioEls4[s.id] = b;
    return b;
  }
  function buildPlatform4(key) {
    const wrap = document.createElement("div"); wrap.className = "platform";
    const head = document.createElement("button");
    head.type = "button"; head.className = "platform-head"; head.textContent = key;
    head.addEventListener("click", () => tryPlace4(key));
    const list = document.createElement("div"); list.className = "platform-list"; list.setAttribute("aria-live", "polite");
    wrap.appendChild(head); wrap.appendChild(list);
    platformEls4[key] = { wrap, list, head };
    return wrap;
  }
  ["FOR", "WHILE", "REPEAT"].forEach(key => $("#platforms4").appendChild(buildPlatform4(key)));
  SCENARIOS4.forEach(s => pool4.appendChild(buildScenarioChip4(s)));

  /* ═══ D5: the runaway train — build one, watch it, pull the plug ═══ */
  (function () {
    const codeEl = $("#code5");
    codeEl.innerHTML =
      '<div class="pcline">Count <span class="arrow">←</span> 0</div>' +
      '<div class="pcline" id="whileLine5"><span class="kw">WHILE</span> Count &lt; 10 <span class="kw">DO</span></div>' +
      '<div class="pcline">  <span class="kw">OUTPUT</span> <span class="str">"Still going..."</span></div>' +
      '<div class="pcline"><span class="kw">ENDWHILE</span></div>';

    const mount = $("#engine5");
    const bar = document.createElement("div"); bar.className = "loop-bar";
    const runBtn = mkBtn("loop-btn primary", "Run it ▶");
    const plugBtn = mkBtn("loop-btn lever", "🔌 Pull the plug");
    bar.appendChild(runBtn); bar.appendChild(plugBtn);
    mount.appendChild(bar);

    const ring = appendRing(mount);
    const board = document.createElement("p");
    board.className = "station-board"; board.setAttribute("aria-live", "polite");
    board.textContent = "Count is 0. Press Run it to watch the loop take off.";
    mount.appendChild(board);

    let lap = 0, pos = 0, timer = null, spinning = false, pulled = false;
    function boardText() {
      return "Lap " + lap.toLocaleString() + " and climbing — Count is still 0. WHILE Count < 10 DO keeps testing true, because nothing inside ever changes Count.";
    }
    runBtn.addEventListener("click", () => {
      if (pulled || spinning) return;
      spinning = true; runBtn.disabled = true;
      $("#whileLine5").classList.add("cur");
      if (reduceMotion) {
        lap = 12482;
        board.textContent = boardText();
        return;
      }
      let ticks = 0;
      timer = setInterval(() => {
        ticks++;
        lap += Math.ceil(lap / 6) + 1;
        pos = (pos + 1) % RING_STATIONS; ring.placeAt(pos);
        board.textContent = boardText();
        if (ticks >= 60 && timer) { clearInterval(timer); timer = null; }
      }, 70);
    });
    plugBtn.addEventListener("click", () => {
      if (pulled) return;
      pulled = true; spinning = false;
      if (timer) { clearInterval(timer); timer = null; }
      $("#whileLine5").classList.remove("cur");
      runBtn.disabled = true;
      ring.ringWrap.classList.add("done");
      board.textContent = "Phew — pulled the plug at lap " + lap.toLocaleString() +
        ". Count is still 0: the loop kept testing 0 < 10, which never turns false, because nothing inside the loop ever changes Count.";
      showBugPicker5();
    });
  })();

  const BUGS5 = [
    { id: "b1", label: "Off-by-one bound", correct: false },
    { id: "b2", label: "Nothing updates Count", correct: true },
    { id: "b3", label: "Wrong comparison operator", correct: false }
  ];
  function showBugPicker5() {
    const wrap = $("#bugPick5"); wrap.hidden = false;
    const opts = $("#bugOptions5"); opts.innerHTML = "";
    const statusEl = $("#bugStatus5");
    BUGS5.forEach(b => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "bug-btn"; btn.textContent = b.label;
      btn.addEventListener("click", () => {
        if (b.correct) {
          $$(".bug-btn", opts).forEach(x => x.disabled = true);
          btn.classList.add("chosen");
          statusEl.textContent = "Exactly — nothing inside the loop ever changes Count, so WHILE Count < 10 never has a chance to turn false.";
          awardStar("d5", "You watched a real infinite loop run away, pulled the plug without anything breaking, and named the bug: a missing loop-variable update.");
        } else {
          toast("Not quite that one — look again at what would actually need to change for the condition to eventually turn false.");
        }
      });
      opts.appendChild(btn);
    });
  }
