
  /* ================= Module 16 — X-Ray the Machine =================
   Signature interaction: a "glass CPU" schematic — five register boxes (PC,
   MAR, MDR, CIR, ACC) plus two working units (CU, ALU) and one memory node,
   driven one micro-step at a time by a crank button. D2, D3 and D5 all reuse
   one bespoke stepper, makeCrank(), defined below.

   Not lifted from src/engine/interactions/walk.js: walk.js is built entirely
   around branching flowchart shapes — decision nodes, yes/no edges, an SVG
   path a token walks along. This lesson has no branches at all: just a fixed
   set of named boxes and three colour-coded buses carrying values between
   them, dictated by a straight-line micro-step script. Forcing that onto
   walk's node/edge/SVG model would mean inventing fake decision nodes or
   fighting a shape builder that wasn't drawn for this picture. A small
   bespoke stepper — one state object, an array of step diffs, one DOM
   render — is the honest fit here, and it's reused three times inside this
   file (D2, D3, D5), which is exactly the "reuse within one lesson" the
   course's rule of two is comfortable with, short of promoting it to a
   shared kit nothing else in the course needs yet.

   D1 ("meet the crew") and D4 ("the three roads") are hand-rolled dual
   tap+drag sorts (pointer events, document-bound), mirroring Module 13's
   D1/D5, Module 14's D2 and Module 15's D4/D5 — not the shared `matcher`
   kit, which hardcodes awardStar("d3", ...) with Module 9's pseudocode-
   pairing wording. This module's own #d3 is the ADD decode/execute crank,
   not a matching exercise, so reusing `matcher` here would award the wrong
   discovery with the wrong copy regardless of which id "meet the crew" used
   — and "meet the crew" is #d1 here anyway, not #d3.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. */

  /* ═══ D1: meet the crew — register/unit → job, hand-rolled term-bin match ═══ */
  const DEFS1 = [
    { id: "j1", label: "Decodes each instruction and sends out the signals that make every other component do its part, in the right order.", ans: "CU" },
    { id: "j2", label: "Does the actual maths and comparisons, but only for an instant — it doesn't remember anything afterwards.", ans: "ALU" },
    { id: "j3", label: "Holds the memory address of the next instruction to fetch — never the instruction itself, just where to find it.", ans: "PC" },
    { id: "j4", label: "Holds an address — the location in memory the CPU is about to read from or write to. Never the data itself, only the location.", ans: "MAR" },
    { id: "j5", label: "Holds the actual data or instruction that has just travelled in from memory, or is about to travel out. Never an address.", ans: "MDR" },
    { id: "j6", label: "Holds whichever instruction is currently being decoded and carried out.", ans: "CIR" },
    { id: "j7", label: "Holds the running result of whatever the ALU is calculating right now — the CPU's one working notepad for numbers.", ans: "ACC" }
  ];
  const TERMS1 = [
    { key: "CU", label: "CU — Control Unit" },
    { key: "ALU", label: "ALU — Arithmetic Logic Unit" },
    { key: "PC", label: "PC — Program Counter" },
    { key: "MAR", label: "MAR — Memory Address Register" },
    { key: "MDR", label: "MDR — Memory Data Register" },
    { key: "CIR", label: "CIR — Current Instruction Register" },
    { key: "ACC", label: "ACC — Accumulator" }
  ];
  const defEls1 = {}, termEls1 = {};
  let selectedDef1 = null, placed1 = 0;
  const pool1 = $("#defPool1"), status1 = $("#status1");

  function selectDef1(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedDef1 === id) {
      btn.classList.remove("sel"); selectedDef1 = null;
      status1.textContent = "Tap a job to begin.";
      return;
    }
    $$(".def-chip", pool1).forEach(c => c.classList.remove("sel"));
    selectedDef1 = id; btn.classList.add("sel");
    status1.textContent = "Now tap the part you think this job belongs to.";
  }
  function tryPlaceDef1(key) {
    if (!selectedDef1) return;
    const item = DEFS1.find(x => x.id === selectedDef1);
    const btn = defEls1[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      termEls1[key].list.textContent = item.label;
      termEls1[key].wrap.classList.add("filled");
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed1++; selectedDef1 = null;
      if (placed1 === DEFS1.length) {
        status1.textContent = "All seven matched — the whole crew, named and placed.";
        awardStar("d1", "Seven parts, seven jobs, matched without a single one left over — you now know the crew by name.");
      } else {
        status1.textContent = "That's the one. " + (DEFS1.length - placed1) + " more to go.";
      }
    } else {
      toast("Not that part — read the job again and think about which one actually does this.");
      btn.classList.remove("sel"); selectedDef1 = null;
      status1.textContent = "Tap a job to try again.";
    }
  }
  function defUnder1(e) {
    if (dragGhost1) dragGhost1.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost1) dragGhost1.style.visibility = "";
    const bin = el && el.closest ? el.closest(".term-bin") : null;
    if (!bin) return null;
    for (const k in termEls1) { if (termEls1[k].wrap === bin) return k; }
    return null;
  }
  function markHover1(key) {
    Object.keys(termEls1).forEach(k => termEls1[k].wrap.classList.toggle("drop-ok", k === key));
  }
  let dragId1 = null, dragging1 = false, dragGhost1 = null, dragPtrId1 = null;
  let dragStartX1 = 0, dragStartY1 = 0, dragOffX1 = 0, dragOffY1 = 0;
  function dragStart1(e, id, btn) {
    if (btn.classList.contains("placed")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragId1 = id; dragPtrId1 = e.pointerId; dragging1 = false;
    dragStartX1 = e.clientX; dragStartY1 = e.clientY;
    document.addEventListener("pointermove", dragMove1);
    document.addEventListener("pointerup", dragEnd1);
    document.addEventListener("pointercancel", dragEnd1);
  }
  function dragMove1(e) {
    if (dragId1 === null || e.pointerId !== dragPtrId1) return;
    const btn = defEls1[dragId1];
    if (!dragging1) {
      if (Math.hypot(e.clientX - dragStartX1, e.clientY - dragStartY1) < 6) return;
      dragging1 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX1 = dragStartX1 - rect.left; dragOffY1 = dragStartY1 - rect.top;
      dragGhost1 = btn.cloneNode(true);
      dragGhost1.classList.add("def-ghost"); dragGhost1.classList.remove("sel");
      dragGhost1.style.width = rect.width + "px";
      document.body.appendChild(dragGhost1);
      btn.classList.add("dragging");
      $$(".def-chip", pool1).forEach(c => c.classList.remove("sel"));
      selectedDef1 = null;
    }
    e.preventDefault();
    dragGhost1.style.left = (e.clientX - dragOffX1) + "px";
    dragGhost1.style.top = (e.clientY - dragOffY1) + "px";
    markHover1(defUnder1(e));
  }
  function dragEnd1(e) {
    if (dragId1 === null || e.pointerId !== dragPtrId1) return;
    const id = dragId1, btn = defEls1[id];
    document.removeEventListener("pointermove", dragMove1);
    document.removeEventListener("pointerup", dragEnd1);
    document.removeEventListener("pointercancel", dragEnd1);
    if (dragging1) {
      const key = defUnder1(e);
      markHover1(null);
      if (dragGhost1) { dragGhost1.remove(); dragGhost1 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedDef1 = id; tryPlaceDef1(key); }
    } else if (e.type !== "pointercancel") {
      selectDef1(id, btn);
    }
    dragId1 = null; dragging1 = false; dragPtrId1 = null;
  }
  function buildDefChip1(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "def-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging1) selectDef1(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart1(e, item.id, b));
    defEls1[item.id] = b;
    return b;
  }
  function buildTermBin1(term) {
    const wrap = document.createElement("div"); wrap.className = "term-bin";
    const head = document.createElement("button");
    head.type = "button"; head.className = "term-bin-head"; head.textContent = term.label;
    head.addEventListener("click", () => tryPlaceDef1(term.key));
    const list = document.createElement("div"); list.className = "term-bin-body"; list.setAttribute("aria-live", "polite");
    list.textContent = "—";
    wrap.appendChild(head); wrap.appendChild(list);
    termEls1[term.key] = { wrap, list, head };
    return wrap;
  }
  TERMS1.forEach(term => $("#termBins1").appendChild(buildTermBin1(term)));
  DEFS1.forEach(item => pool1.appendChild(buildDefChip1(item)));

  /* ═══ shared crank engine — bespoke to this lesson, reused by D2/D3/D5 ═══
     makeCrank(mountId, steps, initial, opts)
       steps   — [{ set:{...regs}, cu, alu, bus:{type,label}, busNote, log }]
       initial — starting register values (unset ones default to "—"/false)
       opts    — { crankLabel, doneLabel, onFinish(state) }
     Renders five register boxes (pc/mar/mdr/cir/acc), one memory node, two
     unit tags (cu/alu) and a bus strip; each crank press applies the next
     step's diff, flashes the boxes that changed, and shows which bus (if
     any) carried something. Rebuilding a mount (calling makeCrank on the
     same id again) is the intended way to let the learner redo a crank with
     new inputs — same "no penalty, run it again" spirit as every other
     board in the course. */
  function makeCrank(mountId, steps, initial, opts) {
    opts = opts || {};
    const mount = $("#" + mountId);
    mount.innerHTML = "";

    const board = document.createElement("div"); board.className = "cpu-board";
    const row1 = document.createElement("div"); row1.className = "cpu-row cpu-row-fetch";
    const row2 = document.createElement("div"); row2.className = "cpu-row cpu-row-exec";

    const boxes = {};
    function makeBox(parent, key, label, kind) {
      const el = document.createElement("div");
      el.className = "cpu-" + (kind || "box");
      el.dataset.key = key;
      const l = document.createElement("span"); l.className = "cpu-label"; l.textContent = label;
      const v = document.createElement("span"); v.className = "cpu-val"; v.textContent = "—";
      el.appendChild(l); el.appendChild(v);
      parent.appendChild(el);
      boxes[key] = { el: el, val: v };
    }
    makeBox(row1, "pc", "PC");
    makeBox(row1, "mar", "MAR");
    makeBox(row1, "mem", "Memory", "node");
    makeBox(row1, "mdr", "MDR");
    makeBox(row1, "cir", "CIR");
    makeBox(row2, "cu", "CU", "tag");
    makeBox(row2, "alu", "ALU", "tag");
    makeBox(row2, "acc", "ACC");
    board.appendChild(row1);
    board.appendChild(row2);

    const bus = document.createElement("div");
    bus.className = "cpu-bus"; bus.setAttribute("aria-live", "polite");
    bus.textContent = "Ready to crank.";
    board.appendChild(bus);

    const log = document.createElement("ul");
    log.className = "cpu-log"; log.setAttribute("aria-live", "polite");
    board.appendChild(log);

    const crankBtn = document.createElement("button");
    crankBtn.type = "button"; crankBtn.className = "loop-btn primary cpu-crank";
    crankBtn.textContent = opts.crankLabel || "Turn the crank ▶";
    board.appendChild(crankBtn);

    mount.appendChild(board);

    const state = Object.assign(
      { pc: "—", mar: "—", mdr: "—", cir: "—", acc: "—", mem: null, cu: false, alu: false },
      initial || {}
    );

    function paint(changedKeys) {
      boxes.pc.val.textContent = state.pc;
      boxes.mar.val.textContent = state.mar;
      boxes.mdr.val.textContent = state.mdr;
      boxes.cir.val.textContent = state.cir;
      boxes.acc.val.textContent = state.acc;
      boxes.mem.val.textContent = state.mem ? (state.mem.addr + ": " + state.mem.val) : "—";
      boxes.cu.el.classList.toggle("active", !!state.cu);
      boxes.alu.el.classList.toggle("active", !!state.alu);
      Object.keys(boxes).forEach(k => boxes[k].el.classList.toggle("changed", changedKeys.indexOf(k) !== -1));
    }
    paint([]);

    let i = -1, finished = false;
    function step() {
      if (finished) return;
      i++;
      const s = steps[i];
      if (!s) return;
      const set = s.set || {};
      Object.keys(set).forEach(k => { state[k] = set[k]; });
      state.cu = !!s.cu;
      state.alu = !!s.alu;
      paint(Object.keys(set));
      if (s.bus) {
        bus.textContent = s.bus.label;
        bus.className = "cpu-bus bus-" + s.bus.type;
      } else {
        bus.textContent = s.busNote || "No bus needed for this step — it happens inside the CPU.";
        bus.className = "cpu-bus";
      }
      const li = document.createElement("li");
      li.textContent = s.log;
      log.appendChild(li);
      while (log.children.length > 4) log.removeChild(log.firstChild);
      if (i === steps.length - 1) {
        finished = true;
        crankBtn.disabled = true;
        crankBtn.textContent = opts.doneLabel || "Cycle complete";
        if (opts.onFinish) opts.onFinish(state);
      }
    }
    crankBtn.addEventListener("click", step);
    return { step, get state() { return state; } };
  }

  /* ═══ D2: one full fetch — watch PC increment mid-cycle ═══ */
  const FETCH_STEPS_2 = [
    { set: { mar: 100 }, bus: { type: "address", label: "Address bus: 100 (from PC) → MAR" },
      log: "PC's address, 100, travels the address bus into MAR." },
    { set: { pc: 101 }, busNote: "No bus needed here — PC just increments inside the CPU.",
      log: "PC increments to 101 — already pointing at the NEXT instruction, before this one has even reached the CIR." },
    { cu: true, bus: { type: "control", label: "Control bus: READ signal → memory" },
      log: "The control unit sends a READ signal along the control bus, telling memory to hand over what's stored at address 100." },
    { set: { mem: { addr: 100, val: "LOAD 200" }, mdr: "LOAD 200" }, bus: { type: "data", label: "Data bus: “LOAD 200” ← memory" },
      log: "Memory sends back what's stored at address 100 — the instruction “LOAD 200” — along the data bus into MDR." },
    { set: { cir: "LOAD 200" }, cu: true, busNote: "No bus needed here — MDR copies straight into CIR inside the CPU.",
      log: "MDR's contents copy into CIR — the instruction has arrived, ready to be decoded next." }
  ];
  makeCrank("cpuMount2", FETCH_STEPS_2, { pc: 100 }, {
    onFinish: () => awardStar("d2", "A whole fetch, one micro-step at a time — and you caught PC updating two steps before the instruction even reached the CIR.")
  });

  /* ═══ D3: decode and execute an ADD — pick an amount, watch ACC change ═══ */
  function buildAddSteps3(amt) {
    return [
      { cu: true, log: "The control unit decodes CIR: “ADD 201” means — add whatever's stored at address 201 to the accumulator." },
      { set: { mar: 201 }, bus: { type: "address", label: "Address bus: 201 → MAR" }, log: "201 travels the address bus into MAR." },
      { set: { mem: { addr: 201, val: amt }, mdr: amt }, bus: { type: "data", label: "Data bus: " + amt + " ← memory" },
        log: "Memory sends back the value stored there — " + amt + " — along the data bus into MDR." },
      { set: { acc: 19 + amt }, alu: true, busNote: "No bus needed here — the ALU works entirely inside the CPU.",
        log: "The ALU adds MDR's " + amt + " to ACC's 19. ACC updates to " + (19 + amt) + " — right before your eyes." }
    ];
  }
  const addSlider3 = $("#addSlider3"), addVal3 = $("#addVal3");
  addSlider3.addEventListener("input", () => { addVal3.textContent = "Add: " + addSlider3.value; });

  const check3 = makeChips($("#chips3"), ["small", "large"],
    () => awardStar("d3", "A small amount and a large amount, both added to ACC in front of you — same trick, same ALU, whatever number you pick."),
    k => (k === "small" ? "a small amount" : "a large amount"),
    (label, remaining) => "ADDed " + label + ". " + remaining + " more to try.");

  let lastAmt3 = null;
  $("#startAdd3").addEventListener("click", () => {
    lastAmt3 = Number(addSlider3.value);
    makeCrank("cpuMount3", buildAddSteps3(lastAmt3), { cir: "ADD 201", acc: 19, pc: 102 }, {
      onFinish: () => check3(lastAmt3 <= 9 ? "small" : (lastAmt3 >= 15 ? "large" : null))
    });
  });

  /* ═══ D4: the three roads — sort six parcels onto address/data/control ═══
     Hand-rolled dual tap+drag path (pointer events, document-bound), same
     shape as D1 above and Module 15's D4/D5 — a 6-into-3 sort the shared
     `matcher` kit doesn't fit (see file header). */
  const PARCELS4 = [
    { id: "p1", label: "The address 104, on its way from PC into MAR.", ans: "Address" },
    { id: "p2", label: "The value 24, arriving from memory into MDR.", ans: "Data" },
    { id: "p3", label: "A READ signal, telling memory to hand something over.", ans: "Control" },
    { id: "p4", label: "The instruction “ADD 105”, fresh out of memory.", ans: "Data" },
    { id: "p5", label: "The address 27, on its way from MAR to memory.", ans: "Address" },
    { id: "p6", label: "A WRITE signal, telling memory to store something.", ans: "Control" }
  ];
  const parcelEls4 = {}, roadEls4 = {};
  let selectedParcel4 = null, placed4 = 0;
  const pool4 = $("#scenarioPool4"), status4 = $("#status4");

  function selectParcel4(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedParcel4 === id) {
      btn.classList.remove("sel"); selectedParcel4 = null;
      status4.textContent = "Tap a parcel to begin.";
      return;
    }
    $$(".scenario-chip", pool4).forEach(c => c.classList.remove("sel"));
    selectedParcel4 = id; btn.classList.add("sel");
    status4.textContent = "Now tap the road you think it travels on.";
  }
  function tryPlaceParcel4(key) {
    if (!selectedParcel4) return;
    const item = PARCELS4.find(x => x.id === selectedParcel4);
    const btn = parcelEls4[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      const line = document.createElement("div"); line.className = "bench-item"; line.textContent = item.label;
      roadEls4[key].list.appendChild(line);
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed4++; selectedParcel4 = null;
      if (placed4 === PARCELS4.length) {
        status4.textContent = "All six sorted — address, data and control, every parcel on its road.";
        awardStar("d4", "Six parcels, sorted by one question each time: is this a place, a thing being carried, or a bare command?");
      } else {
        status4.textContent = "That's the one. " + (PARCELS4.length - placed4) + " more to go.";
      }
    } else {
      toast("Not that road — think again: is this parcel a place, a thing being carried, or a bare command with nothing else attached?");
      btn.classList.remove("sel"); selectedParcel4 = null;
      status4.textContent = "Tap a parcel to try again.";
    }
  }
  function roadUnder4(e) {
    if (dragGhost4) dragGhost4.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost4) dragGhost4.style.visibility = "";
    const bench = el && el.closest ? el.closest(".bench") : null;
    if (!bench) return null;
    for (const k in roadEls4) { if (roadEls4[k].wrap === bench) return k; }
    return null;
  }
  function markHover4(key) {
    Object.keys(roadEls4).forEach(k => roadEls4[k].wrap.classList.toggle("drop-ok", k === key));
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
    const btn = parcelEls4[dragId4];
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
      selectedParcel4 = null;
    }
    e.preventDefault();
    dragGhost4.style.left = (e.clientX - dragOffX4) + "px";
    dragGhost4.style.top = (e.clientY - dragOffY4) + "px";
    markHover4(roadUnder4(e));
  }
  function dragEnd4(e) {
    if (dragId4 === null || e.pointerId !== dragPtrId4) return;
    const id = dragId4, btn = parcelEls4[id];
    document.removeEventListener("pointermove", dragMove4);
    document.removeEventListener("pointerup", dragEnd4);
    document.removeEventListener("pointercancel", dragEnd4);
    if (dragging4) {
      const key = roadUnder4(e);
      markHover4(null);
      if (dragGhost4) { dragGhost4.remove(); dragGhost4 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedParcel4 = id; tryPlaceParcel4(key); }
    } else if (e.type !== "pointercancel") {
      selectParcel4(id, btn);
    }
    dragId4 = null; dragging4 = false; dragPtrId4 = null;
  }
  function buildParcelChip4(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "scenario-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging4) selectParcel4(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart4(e, item.id, b));
    parcelEls4[item.id] = b;
    return b;
  }
  function buildRoad4(key) {
    const wrap = document.createElement("div"); wrap.className = "bench";
    const head = document.createElement("button");
    head.type = "button"; head.className = "bench-head"; head.textContent = key + " bus";
    head.addEventListener("click", () => tryPlaceParcel4(key));
    const list = document.createElement("div"); list.className = "bench-list"; list.setAttribute("aria-live", "polite");
    wrap.appendChild(head); wrap.appendChild(list);
    roadEls4[key] = { wrap, list, head };
    return wrap;
  }
  ["Address", "Data", "Control"].forEach(key => $("#benches4").appendChild(buildRoad4(key)));
  PARCELS4.forEach(item => pool4.appendChild(buildParcelChip4(item)));

  /* ═══ D5: run a whole three-line program — predict ACC, then crank ═══ */
  const FULL_STEPS_5 = [
    // LOAD 200
    { set: { pc: 101, mar: 100, mdr: "LOAD 200", cir: "LOAD 200" }, bus: { type: "data", label: "Address then data bus: 100 → MAR, instruction ← memory" },
      log: "Fetch: address 100 → MAR; PC increments to 101; the instruction “LOAD 200” arrives in MDR, then CIR." },
    { cu: true, busNote: "No bus needed here — the control unit decodes CIR inside the CPU.",
      log: "Decode: “LOAD 200” means — copy whatever's at address 200 into the accumulator." },
    { set: { mar: 200, mem: { addr: 200, val: 19 }, mdr: 19, acc: 19 }, bus: { type: "data", label: "Address then data bus: 200 → MAR, 19 ← memory" },
      log: "Execute: 19 (your age) copies from memory straight into ACC — no ALU needed, LOAD is just a delivery." },
    // ADD 201
    { set: { pc: 102, mar: 101, mdr: "ADD 201", cir: "ADD 201" }, bus: { type: "data", label: "Address then data bus: 101 → MAR, instruction ← memory" },
      log: "Fetch: address 101 → MAR; PC increments to 102; the instruction “ADD 201” arrives in MDR, then CIR." },
    { cu: true, busNote: "No bus needed here — the control unit decodes CIR inside the CPU.",
      log: "Decode: “ADD 201” means — add whatever's at address 201 to the accumulator." },
    { set: { mar: 201, mem: { addr: 201, val: 6 }, mdr: 6, acc: 25 }, alu: true, bus: { type: "data", label: "Address then data bus: 201 → MAR, 6 ← memory" },
      log: "Execute: the ALU adds 6 to ACC's 19. ACC becomes 25." },
    // STORE 202
    { set: { pc: 103, mar: 102, mdr: "STORE 202", cir: "STORE 202" }, bus: { type: "data", label: "Address then data bus: 102 → MAR, instruction ← memory" },
      log: "Fetch: address 102 → MAR; PC increments to 103; the instruction “STORE 202” arrives in MDR, then CIR." },
    { cu: true, busNote: "No bus needed here — the control unit decodes CIR inside the CPU.",
      log: "Decode: “STORE 202” means — copy the accumulator's value out to address 202." },
    { set: { mar: 202, mem: { addr: 202, val: 25 } }, bus: { type: "data", label: "Address then data bus: 202 → MAR, 25 → memory" },
      log: "Execute: ACC's 25 travels out to address 202 in memory. The program has finished." }
  ];
  const guessDial5 = $("#guessDial5"), guessVal5 = $("#guessVal5"), guessResult5 = $("#guessResult5");
  guessDial5.addEventListener("input", () => { guessVal5.textContent = "Guess: " + guessDial5.value; });

  let locked5 = false;
  $("#lockGuess5").addEventListener("click", () => {
    if (locked5) return;
    locked5 = true;
    const guess = Number(guessDial5.value);
    guessDial5.disabled = true;
    document.getElementById("lockGuess5").disabled = true;
    guessResult5.textContent = "Guess locked in at " + guess + ". Crank through the program to see.";
    makeCrank("cpuMount5", FULL_STEPS_5, { pc: 100 }, {
      onFinish: state => {
        const actual = state.acc;
        if (actual === guess) {
          guessResult5.textContent = "Your guess of " + guess + " — bang on! ACC really did land on " + actual + ".";
        } else {
          guessResult5.textContent = "You guessed " + guess + " — the machine landed on " + actual + ". No bother at all: 19 (LOAD) + 6 (ADD) = 25, then STORE just tucked that 25 away without changing it.";
        }
        awardStar("d5", "A whole three-line program, predicted and then run for real — LOAD, ADD and STORE, start to finish.");
      }
    });
  });
