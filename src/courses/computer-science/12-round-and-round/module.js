/* ================= Module 12 — Round and Round =================
   The signature interaction is split by what each loop shape actually
   needs to show. D1 (FOR) is a loop engine — a circular track the
   lantern runs round, with a station board reporting the loop's
   counter each lap, and Step / Run / Go slow / Reset controls (ring
   scaffold: appendRing; tick engine: buildLoopEngine) — a lap count is
   genuinely a number of stations, so a ring fits; it's the only
   discovery still built this way. D2 (WHILE), D3 (REPEAT) and D5 (the
   runaway train) are all flowcharts instead (the kit `walk`, same shape
   M11 used for IF) — "checks before"/"checks after" are about *where
   the loop-back arrow points*, not a lap count, so a ring never fit
   them as well as it fit D1. D2 puts the decision first with "no"
   bypassing straight to Stop; D3 puts the body first with "no" routing
   back into it instead of merging at Stop; D5 reuses D2's exact shape
   (decision-first, loop-back from the body) but drives it with a
   bespoke, continuously-ticking timer instead of `makeWalk`'s
   click-to-step engine — a genuine runaway spectacle (lap climbing into
   the thousands, an unstoppable ping-pong between check and body)
   doesn't fit a one-tap-per-node model, and its "no" road to Stop is
   drawn but never reached, since nothing inside ever changes Count. D4
   is a tap/drag sort onto three platforms, mirroring the kit `matcher`'s
   dual tap+drag path without pulling in the kit itself (six-into-three
   doesn't fit its 1:1 slot model). Runs inside the shared engine IIFE,
   so $, $$, reduceMotion, sparks, toast, awardStar, makeChips, makeWalk,
   ARROW_DEFS, syncCodeHighlight are all in scope. */

  /* ═══ shared ring scaffold (station count/labels optional) — used by
     D1 only now: one labelled station per real Lap value the dials
     could reach, so the ring itself shows what "how many laps" means,
     and the lantern hops straight between the values actually visited
     instead of the ring just decorating ═══ */
  const RING_STATIONS = 10;
  function mkBtn(cls, label) {
    const b = document.createElement("button");
    b.type = "button"; b.className = cls; b.textContent = label;
    return b;
  }
  function appendRing(mount, labels) {
    const ringWrap = document.createElement("div"); ringWrap.className = "loop-ring";
    const track = document.createElement("div"); track.className = "loop-track";
    const lantern = document.createElement("div");
    lantern.className = "loop-lantern"; lantern.setAttribute("aria-hidden", "true");
    let count = RING_STATIONS;

    function layoutDots(labelValues) {
      Array.from(track.querySelectorAll(".loop-station")).forEach(el => el.remove());
      ringWrap.classList.toggle("labeled", !!labelValues);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        const dot = document.createElement("span"); dot.className = "loop-station";
        dot.style.left = (50 + 42 * Math.cos(angle)) + "%";
        dot.style.top = (50 + 42 * Math.sin(angle)) + "%";
        if (labelValues) {
          const lab = document.createElement("span"); lab.className = "loop-station-label";
          lab.textContent = String(labelValues[i]);
          dot.appendChild(lab);
        }
        track.insertBefore(dot, lantern);
      }
    }
    track.appendChild(lantern);
    if (labels) { count = Math.max(1, labels.length); }
    layoutDots(labels);
    ringWrap.appendChild(track);
    mount.appendChild(ringWrap);
    function placeAt(i) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      lantern.style.left = (50 + 42 * Math.cos(angle)) + "%";
      lantern.style.top = (50 + 42 * Math.sin(angle)) + "%";
    }
    placeAt(0);
    function rebuild(labelValues) {
      count = labelValues ? Math.max(1, labelValues.length) : RING_STATIONS;
      layoutDots(labelValues);
      placeAt(0);
    }
    return { ringWrap, lantern, placeAt, rebuild, get count() { return count; } };
  }

  /* ═══ shared turn-based loop engine (used by D1/D2/D3) ═══
     opts: { initState, buildCode, step, initialBoardText, onFinish, showRun }
     step(state) → { state, boardText, finished, advanceLantern } */
  function buildLoopEngine(mountId, codeId, opts) {
    const mount = $("#" + mountId); mount.innerHTML = "";
    const codeEl = $("#" + codeId);
    const showRun = opts.showRun !== false;

    const bar = document.createElement("div"); bar.className = "loop-bar";
    const stepBtn = mkBtn("loop-btn", "Step ▸");
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

    const ring = appendRing(mount, opts.ringValues ? opts.ringValues() : null);
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
      if (r.advanceLantern !== false) {
        pos = r.lanternPos !== undefined ? r.lanternPos : (pos + 1) % ring.count;
        ring.placeAt(pos);
      }
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
      stopRun(); finished = false; pos = 0;
      if (opts.ringValues) { ring.rebuild(opts.ringValues()); } else { ring.placeAt(0); }
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
  // FOR bundles three distinct actions — check the bound, run the body,
  // move the counter on — into what reads as a single line of pseudocode.
  // So it doesn't quietly skip the execution order the way one bundled tap
  // used to, each Step now advances exactly one of those three phases, and
  // only the increment phase moves the lantern — check and body both leave
  // it exactly where it was, since the counter itself hasn't changed yet.
  // FOR Lap ← Start TO End STEP Step reads as one line but is really three
  // separate statements glued together — set the counter, name the bound
  // it's checked against, name the amount it moves by — so each gets its
  // own highlight instead of lighting the whole line as one block.
  function for1BuildCode(s) {
    const initCur = s.phase === null ? " cur" : "";
    const condCur = !s.done && s.phase === "check" ? " cur" : "";
    const bodyCur = !s.done && s.phase === "body" ? " cur" : "";
    const stepCur = !s.done && s.phase === "increment" ? " cur" : "";
    return '<div class="pcline">' +
      '<span class="pc-seg' + initCur + '" id="w1-init"><span class="kw">FOR</span> Lap <span class="arrow">←</span> ' + f1Start + '</span> ' +
      '<span class="pc-seg' + condCur + '" id="w1-cond"><span class="kw">TO</span> ' + f1End + '</span> ' +
      '<span class="pc-seg' + stepCur + '" id="w1-step"><span class="kw">STEP</span> ' + f1Step + '</span>' +
      '</div>' +
      '<div class="pcline' + bodyCur + '">  <span class="kw">OUTPUT</span> <span class="str">"Lap"</span>, Lap</div>' +
      '<div class="pcline' + stepCur + '"><span class="kw">NEXT</span> Lap</div>';
  }
  function for1Tick(s) {
    // Not yet started, or the counter just moved on — time to check the
    // bound again before anything else can happen.
    if (s.phase === null || s.phase === "increment") {
      const cmp = f1Step > 0 ? "≤" : "≥";
      const passes = f1Step > 0 ? s.lap <= f1End : s.lap >= f1End;
      if (!passes) {
        return {
          state: Object.assign({}, s, { phase: "check", done: true }),
          boardText: "Checking Lap " + cmp + " " + f1End + ": is " + s.lap + " " + cmp + " " + f1End +
            "? No — the loop finishes after " + s.laps + " lap" + (s.laps === 1 ? "" : "s") + ".",
          finished: true, advanceLantern: false
        };
      }
      return {
        state: Object.assign({}, s, { phase: "check" }),
        boardText: "Checking Lap " + cmp + " " + f1End + ": is " + s.lap + " " + cmp + " " + f1End + "? Yes — the body runs next.",
        finished: false, advanceLantern: false
      };
    }
    // The check just passed — run the body.
    if (s.phase === "check") {
      const laps = s.laps + 1;
      return {
        state: Object.assign({}, s, { phase: "body", laps: laps }),
        boardText: "Lap " + s.lap + " — OUTPUT \"Lap\", " + s.lap + " (lap " + laps + " so far).",
        finished: false, advanceLantern: false
      };
    }
    // The body just ran — move the counter on, and only now the lantern.
    const nextLap = s.lap + f1Step;
    const lo = Math.min(f1Start, f1End), hi = Math.max(f1Start, f1End);
    const hasNextDot = nextLap >= lo && nextLap <= hi;
    return {
      state: { lap: nextLap, laps: s.laps, phase: "increment", done: false },
      boardText: "NEXT Lap: Lap ← Lap + Step = " + s.lap + " + (" + f1Step + ") = " + nextLap + ".",
      finished: false,
      advanceLantern: hasNextDot,
      lanternPos: hasNextDot ? Math.abs(nextLap - f1Start) : undefined
    };
  }
  // Every whole-number station between Start and End, so the ring always
  // shows the full range — the lantern then hops straight from used station
  // to used station (see for1Tick's lanternPos), skipping the ones Step
  // passes over instead of hiding them.
  function for1FullRange() {
    const dir = f1End >= f1Start ? 1 : -1;
    const values = [];
    for (let v = f1Start; dir > 0 ? v <= f1End : v >= f1End; v += dir) values.push(v);
    return values;
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
    initState: () => ({ lap: f1Start, laps: 0, done: false, phase: null }),
    buildCode: for1BuildCode,
    step: for1Tick,
    ringValues: for1FullRange,
    onFinish: s => check1(s.laps)
  });

  // makeWalk (kit `walk`) expects each module to supply its own hint text —
  // it's chrome around the click-to-step mechanic, not part of the kit.
  // Shared by D2 and D3, the two flowchart-based discoveries in this module.
  const HINT_STEP = "Tap the chart to move the lantern ▸";
  const HINT_ASK = "↑ pick a value to try";
  const HINT_DONE = "Stop reached ✦ — tap ↺ to try it again";
  // syncCodeHighlight (kit `walk`) keeps D2/D3's separate pseudocode panels
  // lit in step with their charts — see opts.onEnter on each makeWalk call.

  /* ═══ D2: WHILE — checks before boarding, drawn as a flowchart (the kit
     `walk`, same family as D3) with the check guarding the door: the
     decision comes first, "no" bypasses the body entirely and goes
     straight to Stop, and only "yes" enters the body — which then loops
     back up to the decision, never straight to Stop, so the check always
     runs again before another passenger can board. ═══ */
  let q2 = 3, walk2;
  const WHILE_SVG2 =
    '<svg viewBox="0 0 320 400" role="img" aria-label="Queue WHILE DO flowchart">' + ARROW_DEFS +
    '<line class="arw" x1="160" y1="48" x2="160" y2="90"/>' +
    '<g data-edge="yes"><line class="arw" x1="160" y1="178" x2="160" y2="224"/><text class="elbl" x="176" y="204">yes</text></g>' +
    '<path class="arw" d="M100,244 L30,244 L30,134 L102,134"/>' +
    '<g data-edge="no"><path class="arw" d="M218,134 L280,134 L280,348 L210,348"/><text class="elbl" x="252" y="124">no</text></g>' +
    '<g class="fcn" data-id="start"><rect class="shp" x="110" y="12" width="100" height="36" rx="18"/><text class="lbl" x="160" y="31">Start</text></g>' +
    '<g class="fcn" data-id="dec"><polygon class="shp" points="160,90 218,134 160,178 102,134"/>' + fcLbl3(["Queue >", "0?"], 160, 138) + '</g>' +
    '<g class="fcn" data-id="proc"><rect class="shp" x="100" y="224" width="120" height="40" rx="9"/>' + fcLbl3(["Board one", "passenger"], 160, 248) + '</g>' +
    '<g class="fcn" data-id="stop"><rect class="shp" x="110" y="330" width="100" height="36" rx="18"/><text class="lbl" x="160" y="349">Stop</text></g>' +
    '</svg>';
  const WHILE_FLOW2 = {
    "start>dec": "M160,48 L160,90",
    "dec>proc": "M160,178 L160,224",
    "proc>dec": "M100,244 L30,244 L30,134 L102,134",
    "dec>stop": "M218,134 L280,134 L280,348 L210,348"
  };
  const WHILE_ANCHORS2 = { start: null, dec: { x: 250, y: 134 }, proc: { x: 236, y: 244 }, stop: { x: 250, y: 348 } };
  const WHILE_LINES2 = {
    start: ["w2-cond-kw"], dec: ["w2-cond"], proc: ["w2-body1", "w2-body2"],
    stop: ["w2-endwhile"]
  };
  const D2_NODES = {
    start: { kind: "term", next: "dec" },
    dec: { kind: "dec", cond: s => s.queue > 0, yes: "proc", no: "stop" },
    proc: {
      kind: "proc",
      set: s => { s.prevQueue = s.queue; s.ran = (s.ran || 0) + 1; s.queue = s.queue - 1; },
      say: s => "Queue was " + s.prevQueue + " — condition true, so board one passenger. Queue now " + s.queue + ".",
      next: "dec"
    },
    stop: {
      kind: "term",
      say: s => s.ran === 0
        ? "Queue is " + s.queue + " — WHILE tests the condition first and it's already false, so the body never runs."
        : "Queue is 0 — WHILE tests the condition first, and now it's false, so the loop finishes after " + s.ran + " lap" + (s.ran === 1 ? "" : "s") + "."
    }
  };
  mkDial($("#dials2"), "Queue", [3, 0, 1, 5], v => String(v), v => { q2 = v; if (walk2) walk2.reset(); });
  const check2 = makeChips($("#chips2"), [0, 1, 3, 5],
    () => awardStar("d2", "Every queue length tried, including zero — WHILE checks first, so a false start means the body never runs at all, not even once."),
    v => (v === 0 ? "ran zero times" : "ran " + v + " time" + (v > 1 ? "s" : "")),
    (label, remaining) => "Noticed — a queue that " + label + ". " + remaining + " more to try.");
  walk2 = makeWalk("walk2", {
    nodes: D2_NODES,
    svg: WHILE_SVG2,
    start: "start", badge: { key: "queue", label: "Queue" }, anchors: WHILE_ANCHORS2, flow: WHILE_FLOW2,
    init: () => ({ queue: q2, ran: 0 })
  }, {
    onEnter: id => syncCodeHighlight("whileCode2", WHILE_LINES2, id),
    onFinish: s => check2(s.ran)
  });

  /* ═══ D3: REPEAT — checks after, drawn as a flowchart with a loop-back
     arrow (the kit `walk`, same shape M11 used for IF) instead of the
     ring: "checks after" isn't a lap count, it's a "no" edge that routes
     back into the body instead of merging at Stop, so a flowchart says it
     more directly than any number of dots could. ═══ */
  function fcLbl3(text, x, y) {
    if (Array.isArray(text)) {
      return '<text class="lbl" x="' + x + '" y="' + (y - 7) + '">' + text[0] + '</text>' +
        '<text class="lbl" x="' + x + '" y="' + (y + 9) + '">' + text[1] + '</text>';
    }
    return '<text class="lbl" x="' + x + '" y="' + y + '">' + text + '</text>';
  }
  const REPEAT_SVG3 =
    '<svg viewBox="0 0 300 380" role="img" aria-label="Door-code REPEAT UNTIL flowchart">' + ARROW_DEFS +
    '<line class="arw" x1="150" y1="48" x2="150" y2="90"/>' +
    '<line class="arw" x1="150" y1="130" x2="150" y2="176"/>' +
    '<g data-edge="yes"><line class="arw" x1="150" y1="264" x2="150" y2="320"/><text class="elbl" x="166" y="294">yes</text></g>' +
    '<g data-edge="no"><path class="arw" d="M92,220 L20,220 L20,110 L88,110"/><text class="elbl" x="54" y="202">no</text></g>' +
    '<g class="fcn" data-id="start"><rect class="shp" x="100" y="12" width="100" height="36" rx="18"/><text class="lbl" x="150" y="31">Start</text></g>' +
    '<g class="fcn" data-id="ask"><polygon class="shp" points="100,90 220,90 208,130 88,130"/>' + fcLbl3("INPUT Code", 150, 114) + '</g>' +
    '<g class="fcn" data-id="dec"><polygon class="shp" points="150,176 208,220 150,264 92,220"/>' + fcLbl3(["Code =", '"19"?'], 150, 224) + '</g>' +
    '<g class="fcn" data-id="stop"><rect class="shp" x="100" y="320" width="100" height="36" rx="18"/><text class="lbl" x="150" y="339">Stop</text></g>' +
    '</svg>';
  const REPEAT_FLOW3 = {
    "start>ask": "M150,48 L150,90",
    "ask>dec": "M150,130 L150,176",
    "dec>stop": "M150,264 L150,320",
    "dec>ask": "M92,220 L20,220 L20,110 L88,110"
  };
  const REPEAT_ANCHORS3 = { start: null, ask: { x: 252, y: 112 }, dec: { x: 240, y: 220 }, stop: { x: 252, y: 338 } };
  const REPEAT_LINES3 = { start: ["w3-repeat-kw"], ask: ["w3-body1", "w3-body2"], dec: ["w3-until"] };
  const D3_NODES = {
    start: { kind: "term", next: "ask" },
    ask: {
      kind: "io", read: "ask", var: "guess",
      ask: "Pick a code to try:", options: ["07", "42", "63", "19"],
      set: s => { s.tries = (s.tries || 0) + 1; },
      say: s => "Attempt " + s.tries + " — INPUT Code",
      readSay: v => "Tried " + v,
      next: "dec"
    },
    dec: {
      kind: "dec",
      cond: s => s.guess === "19",
      yes: "stop", no: "ask",
      say: s => "Code = \"19\"? " + (s.guess === "19" ? "true — carry on to Stop." : "false — REPEAT sends the lantern back to INPUT Code.")
    },
    stop: { kind: "term", say: s => "Door opens after " + s.tries + " attempt" + (s.tries === 1 ? "" : "s") + "." }
  };
  makeWalk("walk3", {
    nodes: D3_NODES,
    svg: REPEAT_SVG3,
    start: "start", badge: { key: "guess", label: "Code" }, anchors: REPEAT_ANCHORS3, flow: REPEAT_FLOW3,
    init: () => ({ guess: null, tries: 0 })
  }, {
    onEnter: id => syncCodeHighlight("repeatCode3", REPEAT_LINES3, id),
    onFinish: s => awardStar("d3", "The door opened after " + s.tries + " attempt" + (s.tries === 1 ? "" : "s") +
      " — however many guesses it took, the body ran at least once before the check could even happen. That's what REPEAT…UNTIL always guarantees.")
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

  /* ═══ D5: the runaway train — the same WHILE flowchart shape as D2, but
     a bespoke, continuously-ticking variant instead of `makeWalk`'s
     click-to-step: a genuine runaway spectacle (lap climbing into the
     thousands, an unstoppable ping-pong between check and body) doesn't
     fit a one-tap-per-node engine, so this hand-rolls the same diamond +
     process + loop-back visual and drives its highlight/edge classes on
     a timer instead. The "no" road to Stop is still drawn — it's simply
     never reached, because nothing inside the loop ever changes Count. */
  (function () {
    const codeEl = $("#code5");
    codeEl.innerHTML =
      '<div class="pcline">Count <span class="arrow">←</span> 0</div>' +
      '<div class="pcline" id="whileLine5"><span class="kw" id="whileKw5">WHILE</span> Count &lt; 10 <span class="kw">DO</span></div>' +
      '<div class="pcline" id="outLine5">  <span class="kw">OUTPUT</span> <span class="str">"Still going..."</span></div>' +
      '<div class="pcline"><span class="kw">ENDWHILE</span></div>';

    const mount = $("#engine5");
    const bar = document.createElement("div"); bar.className = "loop-bar";
    const runBtn = mkBtn("loop-btn primary", "Run it ▶");
    const plugBtn = mkBtn("loop-btn lever", "🔌 Pull the plug");
    bar.appendChild(runBtn); bar.appendChild(plugBtn);
    mount.appendChild(bar);

    const svgWrap = document.createElement("div");
    svgWrap.className = "fc-svg-wrap done";
    svgWrap.innerHTML =
      '<svg viewBox="0 0 320 400" role="img" aria-label="Runaway WHILE Count less than 10 flowchart">' + ARROW_DEFS +
      '<line class="arw" x1="160" y1="48" x2="160" y2="90"/>' +
      '<g data-edge="yes"><line class="arw" x1="160" y1="178" x2="160" y2="224"/><text class="elbl" x="176" y="204">yes</text></g>' +
      '<g data-edge="loop"><path class="arw" d="M100,244 L30,244 L30,134 L102,134"/></g>' +
      '<g data-edge="no"><path class="arw" d="M218,134 L280,134 L280,348 L210,348"/><text class="elbl" x="252" y="124">no</text></g>' +
      '<g class="fcn" data-id="start"><rect class="shp" x="110" y="12" width="100" height="36" rx="18"/><text class="lbl" x="160" y="31">Start</text></g>' +
      '<g class="fcn" data-id="dec"><polygon class="shp" points="160,90 218,134 160,178 102,134"/>' + fcLbl3(["Count <", "10?"], 160, 138) + '</g>' +
      '<g class="fcn" data-id="proc"><rect class="shp" x="100" y="224" width="120" height="40" rx="9"/>' + fcLbl3(["OUTPUT", '"Still going…"'], 160, 248) + '</g>' +
      '<g class="fcn" data-id="stop"><rect class="shp" x="110" y="330" width="100" height="36" rx="18"/><text class="lbl" x="160" y="349">Stop</text></g>' +
      '</svg>';
    mount.appendChild(svgWrap);
    const decEl = svgWrap.querySelector('[data-id="dec"]');
    const procEl = svgWrap.querySelector('[data-id="proc"]');
    const yesEdge = svgWrap.querySelector('[data-edge="yes"]');
    const loopEdge = svgWrap.querySelector('[data-edge="loop"]');

    const board = document.createElement("p");
    board.className = "station-board"; board.setAttribute("aria-live", "polite");
    board.textContent = "Count is 0. Press Run it to watch the loop take off.";
    mount.appendChild(board);

    let lap = 0, onProc = false, timer = null, spinning = false, pulled = false;
    function boardText() {
      return "Lap " + lap.toLocaleString() + " and climbing — Count is still 0. WHILE Count < 10 DO keeps testing true, because nothing inside ever changes Count.";
    }
    runBtn.addEventListener("click", () => {
      if (pulled || spinning) return;
      spinning = true; runBtn.disabled = true;
      decEl.classList.add("cur");
      if (reduceMotion) {
        // Settled straight into "it's been checking forever" — the whole
        // condition line lights up, same as an ordinary recheck would.
        lap = 12482;
        $("#whileLine5").classList.add("cur");
        board.textContent = boardText();
        return;
      }
      // WHILE checks before it runs the body, so the very first moment
      // (nothing evaluated yet) only lights the WHILE keyword — once
      // ticking begins, every recheck highlights the whole condition line.
      $("#whileKw5").classList.add("cur");
      let ticks = 0;
      timer = setInterval(() => {
        ticks++;
        onProc = !onProc;
        $("#whileKw5").classList.remove("cur");
        decEl.classList.toggle("cur", !onProc);
        procEl.classList.toggle("cur", onProc);
        $("#whileLine5").classList.toggle("cur", !onProc);
        $("#outLine5").classList.toggle("cur", onProc);
        yesEdge.classList.toggle("taken", onProc);
        loopEdge.classList.toggle("taken", !onProc);
        lap += Math.ceil(lap / 6) + 1;
        board.textContent = boardText();
        if (ticks >= 60 && timer) { clearInterval(timer); timer = null; }
      }, 70);
    });
    plugBtn.addEventListener("click", () => {
      if (pulled) return;
      pulled = true; spinning = false;
      if (timer) { clearInterval(timer); timer = null; }
      $("#whileKw5").classList.remove("cur");
      $("#whileLine5").classList.remove("cur");
      $("#outLine5").classList.remove("cur");
      runBtn.disabled = true;
      decEl.classList.remove("cur"); procEl.classList.remove("cur");
      yesEdge.classList.remove("taken"); loopEdge.classList.remove("taken");
      board.textContent = "Phew — pulled the plug at lap " + lap.toLocaleString() +
        ". Count is still 0: the loop kept testing 0 < 10, which never turns false, because nothing inside the loop ever changes Count. The \"no\" road to Stop is right there in the diagram — it just can never be reached.";
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
