
  /* ================= Module 17 — Faster, Smaller, Everywhere =================
   Signature interaction: a "build-a-chip bench" — one shared dial widget
   (mkDial, a thin wrapper over the shared `cycler` kit, mirroring Module
   12's mkDial) reused for three different single-variable experiments:
   D1's clock-speed dial drives an automated metronome (Module 16's crank,
   turned into a real ticking loop); D2's cores dial plus a workload toggle
   shows cores helping a splittable pile and doing nothing for a stubborn
   single task; D3's cache dial shows a repeated fetch getting cheaper once
   the same tool is kept on a nearby shelf. Isolating one variable per
   discovery (holding the other two steady) is deliberate — it's an honest
   "controlled experiment" framing, not a simplification of the syllabus
   point that clock, cores and cache can *all* affect performance.

   D4 ("the dictionary of doables") and D5 ("computers in disguise") are
   hand-rolled dual tap+drag sorts (pointer events, document-bound),
   mirroring Module 16's D1/D4 and Module 13-15's equivalents — not the
   shared `matcher` kit, which hardcodes awardStar("d3", ...) with Module
   9's pseudocode-pairing wording and copy. Neither of this module's own
   uses is a 1:1 slot match anyway: D4 is a 4-into-4 term-bin match (same
   shape as Module 16's D1), and D5 is two boards in one discovery — an
   8-into-2 object sort (same shape as Module 16's D4) followed by a
   3-into-3 trait match (same shape as Module 16's D1 again) — so `matcher`
   would need retrofitting in the same way Module 16's own header explains
   it doesn't fit here either.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. makeCycler comes from the
   `cycler` kit (meta.uses). */

  /* ═══ shared labelled dial — thin wrapper over makeCycler, one per bench,
     reused for D1's clock, D2's cores and D3's cache (rule of two) ═══ */
  function mkDial(container, label, values, formatFn, onChange) {
    const wrap = document.createElement("div"); wrap.className = "bench-dial";
    const lab = document.createElement("span"); lab.className = "bench-dial-label"; lab.textContent = label;
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "bench-cyc";
    btn.setAttribute("aria-label", label + " dial, tap to change");
    wrap.appendChild(lab); wrap.appendChild(btn);
    container.appendChild(wrap);
    const cyc = makeCycler(btn, values, formatFn, onChange);
    return { cyc: cyc, btn: btn };
  }

  function addLogLine(el, text) {
    const li = document.createElement("li"); li.textContent = text;
    el.appendChild(li);
    while (el.children.length > 4) el.removeChild(el.firstChild);
  }

  /* ═══ D1: the metronome — clock speed as an automated, timed crank ═══ */
  const TARGET_TICKS_1 = 8;
  let speed1 = 1, running1 = false, timer1 = null;
  const dial1 = mkDial($("#dials1"), "Speed", [1, 2, 3, 4],
    v => v + " tick" + (v === 1 ? "" : "s") + "/second",
    v => { speed1 = v; });

  const check1 = makeChips($("#chips1"), ["slow", "fast"],
    () => awardStar("d1", "A slow speed and a fast speed, both timed on the very same 8 ticks — that gap between them is clock speed, in miniature."),
    k => (k === "slow" ? "a slow speed" : "a fast speed"),
    (label, remaining) => "Tried " + label + ". " + remaining + " more to try.");

  const startBtn1 = $("#startMetro1"), readout1 = $("#metroReadout1");
  startBtn1.addEventListener("click", () => {
    if (running1) return;
    running1 = true;
    startBtn1.disabled = true;
    dial1.btn.disabled = true;
    const speedAtStart = speed1;
    const startedAt = Date.now();
    let ticks = 0;
    readout1.textContent = "Ticking at " + speedAtStart + " tick" + (speedAtStart === 1 ? "" : "s") + "/second…";

    function finish() {
      running1 = false;
      startBtn1.disabled = false;
      dial1.btn.disabled = false;
      const elapsed = Math.max(0, (Date.now() - startedAt) / 1000);
      readout1.textContent = "Finished " + TARGET_TICKS_1 + " ticks in " + elapsed.toFixed(1) +
        " second" + (elapsed.toFixed(1) === "1.0" ? "" : "s") + ", ticking at " + speedAtStart +
        "/second. Run it again with a different speed whenever you fancy.";
      check1(speedAtStart <= 1 ? "slow" : (speedAtStart >= 3 ? "fast" : null));
    }
    function tick() {
      ticks++;
      if (ticks >= TARGET_TICKS_1) { finish(); return true; }
      readout1.textContent = "Tick " + ticks + " of " + TARGET_TICKS_1 + "…";
      return false;
    }
    if (reduceMotion) {
      // No motion to respect here — jump straight to the finished state rather
      // than animate a wait, same spirit as Module 12's reduced-motion runs.
      while (!tick()) { /* advance synchronously */ }
    } else {
      const delay = 1000 / speedAtStart;
      timer1 = setInterval(() => { if (tick()) clearInterval(timer1); }, delay);
    }
  });

  /* ═══ D2: more hands — cores dial + workload toggle, instant compute ═══ */
  const TOTAL_TICKS_2 = 12;
  let cores2 = 1, workload2 = "long";
  mkDial($("#dials2"), "Cores", [1, 2, 4, 8],
    v => v + " core" + (v === 1 ? "" : "s"),
    v => { cores2 = v; });

  const wkLong2 = $("#wkLong2"), wkMany2 = $("#wkMany2");
  function setWorkload2(key) {
    workload2 = key;
    wkLong2.classList.toggle("on", key === "long");
    wkLong2.setAttribute("aria-pressed", String(key === "long"));
    wkMany2.classList.toggle("on", key === "many");
    wkMany2.setAttribute("aria-pressed", String(key === "many"));
  }
  wkLong2.addEventListener("click", () => setWorkload2("long"));
  wkMany2.addEventListener("click", () => setWorkload2("many"));
  setWorkload2("long");

  const log2 = $("#benchLog2");
  const WORKLOAD_LABELS_2 = { long: "the one long task", many: "the many-small-tasks pile" };
  const check2 = makeChips($("#chips2"), ["long-1", "long-many-cores", "many-cores"],
    () => awardStar("d2", "The long task stayed at 12 ticks no matter how many cores you handed it — but the many-small-tasks pile split evenly and finished in a fraction of the time. Extra cores only help when the work can actually be divided."),
    k => ({ "long-1": "the long task with just one core", "long-many-cores": "the long task with several cores", "many-cores": "many small tasks with several cores" })[k],
    (label, remaining) => "Tried " + label + ". " + remaining + " more to try.");

  $("#runBench2").addEventListener("click", () => {
    const time = workload2 === "long" ? TOTAL_TICKS_2 : TOTAL_TICKS_2 / cores2;
    addLogLine(log2, "Ran " + WORKLOAD_LABELS_2[workload2] + " with " + cores2 + " core" + (cores2 === 1 ? "" : "s") +
      " — finished in " + time + " tick" + (time === 1 ? "" : "s") + ".");
    let key = null;
    if (workload2 === "long" && cores2 === 1) key = "long-1";
    else if (workload2 === "long" && cores2 > 1) key = "long-many-cores";
    else if (workload2 === "many" && cores2 > 1) key = "many-cores";
    if (key) check2(key);
  });

  /* ═══ D3: the nearby shelf — cache dial, instant compute ═══ */
  const FULL_TRIP_3 = 4, SHELF_TRIP_3 = 1, REPEATS_3 = 5;
  let cache3 = "off";
  mkDial($("#dials3"), "Cache", ["off", "on"],
    v => "Cache: " + (v === "on" ? "On" : "Off"),
    v => { cache3 = v; });

  const log3 = $("#benchLog3");
  const check3 = makeChips($("#chips3"), ["off", "on"],
    () => awardStar("d3", "Same five fetches of the same tool — 20 ticks with the shelf empty, just 8 with it in use. The saving only shows up because you kept reaching for the same thing."),
    k => (k === "off" ? "cache off" : "cache on"),
    (label, remaining) => "Tried " + label + ". " + remaining + " more to try.");

  $("#runBench3").addEventListener("click", () => {
    let time;
    if (cache3 === "off") {
      time = FULL_TRIP_3 * REPEATS_3;
      addLogLine(log3, "Cache off, the same tool fetched " + REPEATS_3 + " times: every trip costs " + FULL_TRIP_3 + " ticks — " + time + " ticks total.");
    } else {
      time = FULL_TRIP_3 + (REPEATS_3 - 1) * SHELF_TRIP_3;
      addLogLine(log3, "Cache on, the same tool fetched " + REPEATS_3 + " times: the first trip costs " + FULL_TRIP_3 + " ticks, the rest cost " + SHELF_TRIP_3 + " tick each — " + time + " ticks total.");
    }
    check3(cache3);
  });

  /* ═══ D4: the dictionary of doables — 4-into-4 term-bin match, hand-rolled
     (same shape as Module 16's D1; see file header for why not `matcher`) ═══ */
  const DEFS4 = [
    { id: "j1", label: "Copies a value from memory into the accumulator, replacing whatever was there.", ans: "LOAD" },
    { id: "j2", label: "Copies the accumulator's current value out to memory, leaving the accumulator unchanged.", ans: "STORE" },
    { id: "j3", label: "Adds a value to whatever the accumulator already holds.", ans: "ADD" },
    { id: "j4", label: "Takes a value away from whatever the accumulator already holds.", ans: "SUBTRACT" }
  ];
  const TERMS4 = [
    { key: "LOAD", label: "LOAD" },
    { key: "STORE", label: "STORE" },
    { key: "ADD", label: "ADD" },
    { key: "SUBTRACT", label: "SUBTRACT" }
  ];
  const defEls4 = {}, termEls4 = {};
  let selectedDef4 = null, placed4 = 0;
  const pool4 = $("#defPool4"), status4 = $("#status4");

  function selectDef4(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedDef4 === id) {
      btn.classList.remove("sel"); selectedDef4 = null;
      status4.textContent = "Tap a job to begin.";
      return;
    }
    $$(".def-chip", pool4).forEach(c => c.classList.remove("sel"));
    selectedDef4 = id; btn.classList.add("sel");
    status4.textContent = "Now tap the command you think does this job.";
  }
  function tryPlaceDef4(key) {
    if (!selectedDef4) return;
    const item = DEFS4.find(x => x.id === selectedDef4);
    const btn = defEls4[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      termEls4[key].list.textContent = item.label;
      termEls4[key].wrap.classList.add("filled");
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed4++; selectedDef4 = null;
      if (placed4 === DEFS4.length) {
        status4.textContent = "All four matched — the whole dictionary, at least the part you've met so far.";
        awardStar("d4", "Four commands, four jobs, matched without a single one left over — LOAD, STORE, ADD and SUBTRACT, all in one CPU's instruction set.");
      } else {
        status4.textContent = "That's the one. " + (DEFS4.length - placed4) + " more to go.";
      }
    } else {
      toast("Not that command — read the job again and think about which one actually does this.");
      btn.classList.remove("sel"); selectedDef4 = null;
      status4.textContent = "Tap a job to try again.";
    }
  }
  function defUnder4(e) {
    if (dragGhost4) dragGhost4.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost4) dragGhost4.style.visibility = "";
    const bin = el && el.closest ? el.closest(".term-bin") : null;
    if (!bin) return null;
    for (const k in termEls4) { if (termEls4[k].wrap === bin) return k; }
    return null;
  }
  function markHover4(key) {
    Object.keys(termEls4).forEach(k => termEls4[k].wrap.classList.toggle("drop-ok", k === key));
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
    const btn = defEls4[dragId4];
    if (!dragging4) {
      if (Math.hypot(e.clientX - dragStartX4, e.clientY - dragStartY4) < 6) return;
      dragging4 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX4 = dragStartX4 - rect.left; dragOffY4 = dragStartY4 - rect.top;
      dragGhost4 = btn.cloneNode(true);
      dragGhost4.classList.add("def-ghost"); dragGhost4.classList.remove("sel");
      dragGhost4.style.width = rect.width + "px";
      document.body.appendChild(dragGhost4);
      btn.classList.add("dragging");
      $$(".def-chip", pool4).forEach(c => c.classList.remove("sel"));
      selectedDef4 = null;
    }
    e.preventDefault();
    dragGhost4.style.left = (e.clientX - dragOffX4) + "px";
    dragGhost4.style.top = (e.clientY - dragOffY4) + "px";
    markHover4(defUnder4(e));
  }
  function dragEnd4(e) {
    if (dragId4 === null || e.pointerId !== dragPtrId4) return;
    const id = dragId4, btn = defEls4[id];
    document.removeEventListener("pointermove", dragMove4);
    document.removeEventListener("pointerup", dragEnd4);
    document.removeEventListener("pointercancel", dragEnd4);
    if (dragging4) {
      const key = defUnder4(e);
      markHover4(null);
      if (dragGhost4) { dragGhost4.remove(); dragGhost4 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedDef4 = id; tryPlaceDef4(key); }
    } else if (e.type !== "pointercancel") {
      selectDef4(id, btn);
    }
    dragId4 = null; dragging4 = false; dragPtrId4 = null;
  }
  function buildDefChip4(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "def-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging4) selectDef4(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart4(e, item.id, b));
    defEls4[item.id] = b;
    return b;
  }
  function buildTermBin4(term) {
    const wrap = document.createElement("div"); wrap.className = "term-bin";
    const head = document.createElement("button");
    head.type = "button"; head.className = "term-bin-head"; head.textContent = term.label;
    head.addEventListener("click", () => tryPlaceDef4(term.key));
    const list = document.createElement("div"); list.className = "term-bin-body"; list.setAttribute("aria-live", "polite");
    list.textContent = "—";
    wrap.appendChild(head); wrap.appendChild(list);
    termEls4[term.key] = { wrap, list, head };
    return wrap;
  }
  TERMS4.forEach(term => $("#termBins4").appendChild(buildTermBin4(term)));
  DEFS4.forEach(item => pool4.appendChild(buildDefChip4(item)));

  /* ═══ D5a: computers in disguise, stage one — 8-into-2 object sort,
     hand-rolled (same shape as Module 16's D4) ═══ */
  const SCENARIOS5 = [
    { id: "o1", label: "Washing machine", ans: "Embedded" },
    { id: "o2", label: "Rice cooker", ans: "Embedded" },
    { id: "o3", label: "Microwave oven", ans: "Embedded" },
    { id: "o4", label: "Smart lightbulb", ans: "Embedded" },
    { id: "o5", label: "Laptop", ans: "General" },
    { id: "o6", label: "Smartphone", ans: "General" },
    { id: "o7", label: "Tablet", ans: "General" },
    { id: "o8", label: "Desktop PC", ans: "General" }
  ];
  const scenarioEls5 = {}, benchEls5 = {};
  let selectedScenario5 = null, placed5a = 0, done5a = false;
  const pool5a = $("#scenarioPool5"), status5a = $("#status5a");

  function maybeFinish5() {
    if (done5a && done5b) {
      awardStar("d5", "Eight objects sorted by dedicated function, not size — then all three embedded traits matched to what they actually mean. Rice cookers and washing machines, meet firmware and low power.");
    }
  }
  function selectScenario5(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedScenario5 === id) {
      btn.classList.remove("sel"); selectedScenario5 = null;
      status5a.textContent = "Tap an object to begin.";
      return;
    }
    $$(".scenario-chip", pool5a).forEach(c => c.classList.remove("sel"));
    selectedScenario5 = id; btn.classList.add("sel");
    status5a.textContent = "Now tap the bin you think it belongs in.";
  }
  function tryPlaceScenario5(key) {
    if (!selectedScenario5) return;
    const item = SCENARIOS5.find(x => x.id === selectedScenario5);
    const btn = scenarioEls5[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      const line = document.createElement("div"); line.className = "bench-item"; line.textContent = item.label;
      benchEls5[key].list.appendChild(line);
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed5a++; selectedScenario5 = null;
      if (placed5a === SCENARIOS5.length) {
        status5a.textContent = "All eight sorted — dedicated function on one side, many functions on the other.";
        done5a = true; maybeFinish5();
      } else {
        status5a.textContent = "That's the one. " + (SCENARIOS5.length - placed5a) + " more to go.";
      }
    } else {
      toast("Not that bin — think about whether this object does one job forever, or many different jobs depending on what you choose.");
      btn.classList.remove("sel"); selectedScenario5 = null;
      status5a.textContent = "Tap an object to try again.";
    }
  }
  function benchUnder5(e) {
    if (dragGhost5a) dragGhost5a.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost5a) dragGhost5a.style.visibility = "";
    const bench = el && el.closest ? el.closest(".bench") : null;
    if (!bench) return null;
    for (const k in benchEls5) { if (benchEls5[k].wrap === bench) return k; }
    return null;
  }
  function markHoverBench5(key) {
    Object.keys(benchEls5).forEach(k => benchEls5[k].wrap.classList.toggle("drop-ok", k === key));
  }
  let dragId5a = null, dragging5a = false, dragGhost5a = null, dragPtrId5a = null;
  let dragStartX5a = 0, dragStartY5a = 0, dragOffX5a = 0, dragOffY5a = 0;
  function dragStart5a(e, id, btn) {
    if (btn.classList.contains("placed")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragId5a = id; dragPtrId5a = e.pointerId; dragging5a = false;
    dragStartX5a = e.clientX; dragStartY5a = e.clientY;
    document.addEventListener("pointermove", dragMove5a);
    document.addEventListener("pointerup", dragEnd5a);
    document.addEventListener("pointercancel", dragEnd5a);
  }
  function dragMove5a(e) {
    if (dragId5a === null || e.pointerId !== dragPtrId5a) return;
    const btn = scenarioEls5[dragId5a];
    if (!dragging5a) {
      if (Math.hypot(e.clientX - dragStartX5a, e.clientY - dragStartY5a) < 6) return;
      dragging5a = true;
      const rect = btn.getBoundingClientRect();
      dragOffX5a = dragStartX5a - rect.left; dragOffY5a = dragStartY5a - rect.top;
      dragGhost5a = btn.cloneNode(true);
      dragGhost5a.classList.add("scenario-ghost"); dragGhost5a.classList.remove("sel");
      dragGhost5a.style.width = rect.width + "px";
      document.body.appendChild(dragGhost5a);
      btn.classList.add("dragging");
      $$(".scenario-chip", pool5a).forEach(c => c.classList.remove("sel"));
      selectedScenario5 = null;
    }
    e.preventDefault();
    dragGhost5a.style.left = (e.clientX - dragOffX5a) + "px";
    dragGhost5a.style.top = (e.clientY - dragOffY5a) + "px";
    markHoverBench5(benchUnder5(e));
  }
  function dragEnd5a(e) {
    if (dragId5a === null || e.pointerId !== dragPtrId5a) return;
    const id = dragId5a, btn = scenarioEls5[id];
    document.removeEventListener("pointermove", dragMove5a);
    document.removeEventListener("pointerup", dragEnd5a);
    document.removeEventListener("pointercancel", dragEnd5a);
    if (dragging5a) {
      const key = benchUnder5(e);
      markHoverBench5(null);
      if (dragGhost5a) { dragGhost5a.remove(); dragGhost5a = null; }
      btn.classList.remove("dragging");
      if (key) { selectedScenario5 = id; tryPlaceScenario5(key); }
    } else if (e.type !== "pointercancel") {
      selectScenario5(id, btn);
    }
    dragId5a = null; dragging5a = false; dragPtrId5a = null;
  }
  function buildScenarioChip5(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "scenario-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging5a) selectScenario5(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart5a(e, item.id, b));
    scenarioEls5[item.id] = b;
    return b;
  }
  function buildBench5(key, label) {
    const wrap = document.createElement("div"); wrap.className = "bench";
    const head = document.createElement("button");
    head.type = "button"; head.className = "bench-head"; head.textContent = label;
    head.addEventListener("click", () => tryPlaceScenario5(key));
    const list = document.createElement("div"); list.className = "bench-list"; list.setAttribute("aria-live", "polite");
    wrap.appendChild(head); wrap.appendChild(list);
    benchEls5[key] = { wrap, list, head };
    return wrap;
  }
  $("#benches5").appendChild(buildBench5("Embedded", "Embedded system"));
  $("#benches5").appendChild(buildBench5("General", "General-purpose computer"));
  SCENARIOS5.forEach(item => pool5a.appendChild(buildScenarioChip5(item)));

  /* ═══ D5b: computers in disguise, stage two — 3-into-3 trait match,
     hand-rolled (same shape as Module 16's D1 and this file's own D4) ═══ */
  const DEFS5B = [
    { id: "t1", label: "Built to do one job, and only that job, for its whole working life.", ans: "Dedicated function" },
    { id: "t2", label: "Software built permanently into the device's own hardware, rather than something you install like an app.", ans: "Firmware" },
    { id: "t3", label: "Designed to run for a long time — sometimes years — on very little electricity.", ans: "Low power" }
  ];
  const TERMS5B = [
    { key: "Dedicated function", label: "Dedicated function" },
    { key: "Firmware", label: "Firmware" },
    { key: "Low power", label: "Low power" }
  ];
  const defEls5b = {}, termEls5b = {};
  let selectedDef5b = null, placed5b = 0, done5b = false;
  const pool5b = $("#defPool5"), status5b = $("#status5b");

  function selectDef5b(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedDef5b === id) {
      btn.classList.remove("sel"); selectedDef5b = null;
      status5b.textContent = "Tap a description to begin.";
      return;
    }
    $$(".def-chip", pool5b).forEach(c => c.classList.remove("sel"));
    selectedDef5b = id; btn.classList.add("sel");
    status5b.textContent = "Now tap the trait you think this describes.";
  }
  function tryPlaceDef5b(key) {
    if (!selectedDef5b) return;
    const item = DEFS5B.find(x => x.id === selectedDef5b);
    const btn = defEls5b[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      termEls5b[key].list.textContent = item.label;
      termEls5b[key].wrap.classList.add("filled");
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed5b++; selectedDef5b = null;
      if (placed5b === DEFS5B.length) {
        status5b.textContent = "All three traits matched.";
        done5b = true; maybeFinish5();
      } else {
        status5b.textContent = "That's the one. " + (DEFS5B.length - placed5b) + " more to go.";
      }
    } else {
      toast("Not that trait — read the description again and think about which word it's actually describing.");
      btn.classList.remove("sel"); selectedDef5b = null;
      status5b.textContent = "Tap a description to try again.";
    }
  }
  function defUnder5b(e) {
    if (dragGhost5b) dragGhost5b.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost5b) dragGhost5b.style.visibility = "";
    const bin = el && el.closest ? el.closest(".term-bin") : null;
    if (!bin) return null;
    for (const k in termEls5b) { if (termEls5b[k].wrap === bin) return k; }
    return null;
  }
  function markHoverTerm5b(key) {
    Object.keys(termEls5b).forEach(k => termEls5b[k].wrap.classList.toggle("drop-ok", k === key));
  }
  let dragId5b = null, dragging5b = false, dragGhost5b = null, dragPtrId5b = null;
  let dragStartX5b = 0, dragStartY5b = 0, dragOffX5b = 0, dragOffY5b = 0;
  function dragStart5b(e, id, btn) {
    if (btn.classList.contains("placed")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragId5b = id; dragPtrId5b = e.pointerId; dragging5b = false;
    dragStartX5b = e.clientX; dragStartY5b = e.clientY;
    document.addEventListener("pointermove", dragMove5b);
    document.addEventListener("pointerup", dragEnd5b);
    document.addEventListener("pointercancel", dragEnd5b);
  }
  function dragMove5b(e) {
    if (dragId5b === null || e.pointerId !== dragPtrId5b) return;
    const btn = defEls5b[dragId5b];
    if (!dragging5b) {
      if (Math.hypot(e.clientX - dragStartX5b, e.clientY - dragStartY5b) < 6) return;
      dragging5b = true;
      const rect = btn.getBoundingClientRect();
      dragOffX5b = dragStartX5b - rect.left; dragOffY5b = dragStartY5b - rect.top;
      dragGhost5b = btn.cloneNode(true);
      dragGhost5b.classList.add("def-ghost"); dragGhost5b.classList.remove("sel");
      dragGhost5b.style.width = rect.width + "px";
      document.body.appendChild(dragGhost5b);
      btn.classList.add("dragging");
      $$(".def-chip", pool5b).forEach(c => c.classList.remove("sel"));
      selectedDef5b = null;
    }
    e.preventDefault();
    dragGhost5b.style.left = (e.clientX - dragOffX5b) + "px";
    dragGhost5b.style.top = (e.clientY - dragOffY5b) + "px";
    markHoverTerm5b(defUnder5b(e));
  }
  function dragEnd5b(e) {
    if (dragId5b === null || e.pointerId !== dragPtrId5b) return;
    const id = dragId5b, btn = defEls5b[id];
    document.removeEventListener("pointermove", dragMove5b);
    document.removeEventListener("pointerup", dragEnd5b);
    document.removeEventListener("pointercancel", dragEnd5b);
    if (dragging5b) {
      const key = defUnder5b(e);
      markHoverTerm5b(null);
      if (dragGhost5b) { dragGhost5b.remove(); dragGhost5b = null; }
      btn.classList.remove("dragging");
      if (key) { selectedDef5b = id; tryPlaceDef5b(key); }
    } else if (e.type !== "pointercancel") {
      selectDef5b(id, btn);
    }
    dragId5b = null; dragging5b = false; dragPtrId5b = null;
  }
  function buildDefChip5b(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "def-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging5b) selectDef5b(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart5b(e, item.id, b));
    defEls5b[item.id] = b;
    return b;
  }
  function buildTermBin5b(term) {
    const wrap = document.createElement("div"); wrap.className = "term-bin";
    const head = document.createElement("button");
    head.type = "button"; head.className = "term-bin-head"; head.textContent = term.label;
    head.addEventListener("click", () => tryPlaceDef5b(term.key));
    const list = document.createElement("div"); list.className = "term-bin-body"; list.setAttribute("aria-live", "polite");
    list.textContent = "—";
    wrap.appendChild(head); wrap.appendChild(list);
    termEls5b[term.key] = { wrap, list, head };
    return wrap;
  }
  TERMS5B.forEach(term => $("#termBins5").appendChild(buildTermBin5b(term)));
  DEFS5B.forEach(item => pool5b.appendChild(buildDefChip5b(item)));
