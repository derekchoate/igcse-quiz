
  /* ================= Module 17 — One Shared Cabinet =================
   D1 and D4 are hand-rolled dual tap+drag term-matches (same local factory
   pattern as Module 16's module.js — not shared across files, since each
   lesson's module.js is concatenated independently by tools/build.mjs and
   the rule of two here is "reuse within one lesson").

   D2 is the old Module 16 D4 ("the three roads") almost unchanged, now
   also echoing each correct placement onto the shared machine map's bus
   strip (cpuBoard.flashBus) so the diagram picks up colour as buses are
   learned, same map as Module 16 left off.

   D3 is a light multiple-choice consolidation (no drag) reusing the same
   three bus buttons repeatedly across a handful of scenarios.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeCpuBoard are all in scope. */

  /* ═══ shared term-match factory (D1, D4) ═══ */
  function makeTermMatch(cfg) {
    const defEls = {}, termEls = {};
    let selected = null, placed = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        cfg.statusEl.textContent = cfg.promptAgain;
        return;
      }
      $$(".def-chip", cfg.poolEl).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      cfg.statusEl.textContent = cfg.promptBin;
    }
    function tryPlace(key) {
      if (!selected) return;
      const item = cfg.defs.find(x => x.id === selected);
      const btn = defEls[item.id];
      if (item.ans === key) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        termEls[key].list.textContent = termEls[key].list.textContent === "—" ? item.label : termEls[key].list.textContent + " · " + item.label;
        termEls[key].wrap.classList.add("filled");
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        placed++; selected = null;
        if (placed === cfg.defs.length) {
          cfg.statusEl.textContent = cfg.doneMsg.status;
          awardStar(cfg.discId, cfg.doneMsg.star);
        } else {
          cfg.statusEl.textContent = "That's the one. " + (cfg.defs.length - placed) + " more to go.";
        }
      } else {
        toast(cfg.mismatchMsg);
        btn.classList.remove("sel"); selected = null;
        cfg.statusEl.textContent = cfg.promptAgain;
      }
    }
    function under(e, ghost) {
      if (ghost) ghost.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (ghost) ghost.style.visibility = "";
      const bin = el && el.closest ? el.closest(".term-bin") : null;
      if (!bin) return null;
      for (const k in termEls) { if (termEls[k].wrap === bin) return k; }
      return null;
    }
    function markHover(key) {
      Object.keys(termEls).forEach(k => termEls[k].wrap.classList.toggle("drop-ok", k === key));
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
      const btn = defEls[dragId];
      if (!dragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) < 6) return;
        dragging = true;
        const rect = btn.getBoundingClientRect();
        dragOffX = dragStartX - rect.left; dragOffY = dragStartY - rect.top;
        dragGhost = btn.cloneNode(true);
        dragGhost.classList.add("def-ghost"); dragGhost.classList.remove("sel");
        dragGhost.style.width = rect.width + "px";
        document.body.appendChild(dragGhost);
        btn.classList.add("dragging");
        $$(".def-chip", cfg.poolEl).forEach(c => c.classList.remove("sel"));
        selected = null;
      }
      e.preventDefault();
      dragGhost.style.left = (e.clientX - dragOffX) + "px";
      dragGhost.style.top = (e.clientY - dragOffY) + "px";
      markHover(under(e, dragGhost));
    }
    function dragEnd(e) {
      if (dragId === null || e.pointerId !== dragPtrId) return;
      const id = dragId, btn = defEls[id];
      document.removeEventListener("pointermove", dragMove);
      document.removeEventListener("pointerup", dragEnd);
      document.removeEventListener("pointercancel", dragEnd);
      if (dragging) {
        const key = under(e, dragGhost);
        markHover(null);
        if (dragGhost) { dragGhost.remove(); dragGhost = null; }
        btn.classList.remove("dragging");
        if (key) { selected = id; tryPlace(key); }
      } else if (e.type !== "pointercancel") {
        select(id, btn);
      }
      dragId = null; dragging = false; dragPtrId = null;
    }
    function buildDefChip(item) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "def-chip"; b.textContent = item.label; b.dataset.id = item.id;
      b.addEventListener("click", () => { if (!dragging) select(item.id, b); });
      b.addEventListener("pointerdown", e => dragStart(e, item.id, b));
      defEls[item.id] = b;
      return b;
    }
    function buildTermBin(term) {
      const wrap = document.createElement("div"); wrap.className = "term-bin";
      const head = document.createElement("button");
      head.type = "button"; head.className = "term-bin-head"; head.textContent = term.label;
      head.addEventListener("click", () => tryPlace(term.key));
      const list = document.createElement("div"); list.className = "term-bin-body"; list.setAttribute("aria-live", "polite");
      list.textContent = "—";
      wrap.appendChild(head); wrap.appendChild(list);
      termEls[term.key] = { wrap, list, head };
      return wrap;
    }
    cfg.terms.forEach(term => cfg.binsEl.appendChild(buildTermBin(term)));
    cfg.defs.forEach(item => cfg.poolEl.appendChild(buildDefChip(item)));
  }

  /* ═══ D1: one shared filing cabinet — instruction vs data ═══ */
  makeTermMatch({
    defs: [
      { id: "c1", label: "Address 100 holds: LOAD 200", ans: "Instruction" },
      { id: "c2", label: "Address 101 holds: ADD 201", ans: "Instruction" },
      { id: "c3", label: "Address 102 holds: STORE 202", ans: "Instruction" },
      { id: "c4", label: "Address 200 holds: 19", ans: "Data" },
      { id: "c5", label: "Address 201 holds: 6", ans: "Data" }
    ],
    terms: [
      { key: "Instruction", label: "Instruction" },
      { key: "Data", label: "Data" }
    ],
    poolEl: $("#defPool1"), binsEl: $("#termBins1"), statusEl: $("#status1"),
    discId: "d1",
    promptAgain: "Tap a cell to try again.", promptBin: "Now tap the bin you think it belongs to.",
    doneMsg: { status: "All five sorted — three instructions, two data values, one shared cabinet.", star: "Five cells sorted — and the twist is the point: nothing about the storage itself told them apart." },
    mismatchMsg: "Not that bin — ask whether this cell tells the CPU to do something, or just gives it a number."
  });

  /* ═══ shared machine map, fully met from Module 16, used by D2 and D3 ═══ */
  const cpuBoard = makeCpuBoard("cpuMountMachine", { mode: "bus" });

  /* ═══ D2: the three roads — hand-rolled dual tap+drag sort, echoing onto the map ═══ */
  const PARCELS2 = [
    { id: "p1", label: "The address 104, on its way from PC into MAR.", ans: "Address" },
    { id: "p2", label: "The value 24, arriving from memory into MDR.", ans: "Data" },
    { id: "p3", label: "A READ signal, telling memory to hand something over.", ans: "Control" },
    { id: "p4", label: "The instruction “ADD 105”, fresh out of memory.", ans: "Data" },
    { id: "p5", label: "The address 27, on its way from MAR to memory.", ans: "Address" },
    { id: "p6", label: "A WRITE signal, telling memory to store something.", ans: "Control" }
  ];
  const parcelEls2 = {}, roadEls2 = {};
  let selectedParcel2 = null, placed2 = 0;
  const pool2 = $("#scenarioPool2"), status2 = $("#status2");

  function selectParcel2(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedParcel2 === id) {
      btn.classList.remove("sel"); selectedParcel2 = null;
      status2.textContent = "Tap a parcel to begin.";
      return;
    }
    $$(".scenario-chip", pool2).forEach(c => c.classList.remove("sel"));
    selectedParcel2 = id; btn.classList.add("sel");
    status2.textContent = "Now tap the road you think it travels on.";
  }
  function tryPlaceParcel2(key) {
    if (!selectedParcel2) return;
    const item = PARCELS2.find(x => x.id === selectedParcel2);
    const btn = parcelEls2[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      const line = document.createElement("div"); line.className = "bench-item"; line.textContent = item.label;
      roadEls2[key].list.appendChild(line);
      cpuBoard.flashBus(key.toLowerCase(), key + " bus: " + item.label);
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed2++; selectedParcel2 = null;
      if (placed2 === PARCELS2.length) {
        status2.textContent = "All six sorted — address, data and control, every parcel on its road.";
        awardStar("d2", "Six parcels, sorted by one question each time: is this a place, a thing being carried, or a bare command?");
      } else {
        status2.textContent = "That's the one. " + (PARCELS2.length - placed2) + " more to go.";
      }
    } else {
      toast("Not that road — think again: is this parcel a place, a thing being carried, or a bare command with nothing else attached?");
      btn.classList.remove("sel"); selectedParcel2 = null;
      status2.textContent = "Tap a parcel to try again.";
    }
  }
  function roadUnder2(e) {
    if (dragGhost2) dragGhost2.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost2) dragGhost2.style.visibility = "";
    const bench = el && el.closest ? el.closest(".bench") : null;
    if (!bench) return null;
    for (const k in roadEls2) { if (roadEls2[k].wrap === bench) return k; }
    return null;
  }
  function markHover2(key) {
    Object.keys(roadEls2).forEach(k => roadEls2[k].wrap.classList.toggle("drop-ok", k === key));
  }
  let dragId2 = null, dragging2 = false, dragGhost2 = null, dragPtrId2 = null;
  let dragStartX2 = 0, dragStartY2 = 0, dragOffX2 = 0, dragOffY2 = 0;
  function dragStart2(e, id, btn) {
    if (btn.classList.contains("placed")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragId2 = id; dragPtrId2 = e.pointerId; dragging2 = false;
    dragStartX2 = e.clientX; dragStartY2 = e.clientY;
    document.addEventListener("pointermove", dragMove2);
    document.addEventListener("pointerup", dragEnd2);
    document.addEventListener("pointercancel", dragEnd2);
  }
  function dragMove2(e) {
    if (dragId2 === null || e.pointerId !== dragPtrId2) return;
    const btn = parcelEls2[dragId2];
    if (!dragging2) {
      if (Math.hypot(e.clientX - dragStartX2, e.clientY - dragStartY2) < 6) return;
      dragging2 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX2 = dragStartX2 - rect.left; dragOffY2 = dragStartY2 - rect.top;
      dragGhost2 = btn.cloneNode(true);
      dragGhost2.classList.add("scenario-ghost"); dragGhost2.classList.remove("sel");
      dragGhost2.style.width = rect.width + "px";
      document.body.appendChild(dragGhost2);
      btn.classList.add("dragging");
      $$(".scenario-chip", pool2).forEach(c => c.classList.remove("sel"));
      selectedParcel2 = null;
    }
    e.preventDefault();
    dragGhost2.style.left = (e.clientX - dragOffX2) + "px";
    dragGhost2.style.top = (e.clientY - dragOffY2) + "px";
    markHover2(roadUnder2(e));
  }
  function dragEnd2(e) {
    if (dragId2 === null || e.pointerId !== dragPtrId2) return;
    const id = dragId2, btn = parcelEls2[id];
    document.removeEventListener("pointermove", dragMove2);
    document.removeEventListener("pointerup", dragEnd2);
    document.removeEventListener("pointercancel", dragEnd2);
    if (dragging2) {
      const key = roadUnder2(e);
      markHover2(null);
      if (dragGhost2) { dragGhost2.remove(); dragGhost2 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedParcel2 = id; tryPlaceParcel2(key); }
    } else if (e.type !== "pointercancel") {
      selectParcel2(id, btn);
    }
    dragId2 = null; dragging2 = false; dragPtrId2 = null;
  }
  function buildParcelChip2(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "scenario-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging2) selectParcel2(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart2(e, item.id, b));
    parcelEls2[item.id] = b;
    return b;
  }
  function buildRoad2(key) {
    const wrap = document.createElement("div"); wrap.className = "bench";
    const head = document.createElement("button");
    head.type = "button"; head.className = "bench-head"; head.textContent = key + " bus";
    head.addEventListener("click", () => tryPlaceParcel2(key));
    const list = document.createElement("div"); list.className = "bench-list"; list.setAttribute("aria-live", "polite");
    wrap.appendChild(head); wrap.appendChild(list);
    roadEls2[key] = { wrap, list, head };
    return wrap;
  }
  ["Address", "Data", "Control"].forEach(key => $("#benches2").appendChild(buildRoad2(key)));
  PARCELS2.forEach(item => pool2.appendChild(buildParcelChip2(item)));

  /* ═══ D3: which register, which road? — quick multiple-choice, no drag ═══ */
  const SCENARIOS3 = [
    { id: "s1", text: "The value arriving in MDR, fresh from memory.", ans: "Data" },
    { id: "s2", text: "PC's address, on its way into MAR.", ans: "Address" },
    { id: "s3", text: "A READ signal, telling memory to hand something over.", ans: "Control" },
    { id: "s4", text: "CIR's instruction, the moment it first arrives from memory.", ans: "Data" }
  ];
  const quiz3 = $("#quiz3");
  let doneCount3 = 0;
  const rowEls3 = {};
  SCENARIOS3.forEach(s => {
    const row = document.createElement("div"); row.className = "quiz-row";
    const p = document.createElement("p"); p.className = "quiz-text"; p.textContent = s.text;
    const btns = document.createElement("div"); btns.className = "quiz-btns";
    ["Address", "Data", "Control"].forEach(choice => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "loop-btn quiz-choice"; b.textContent = choice;
      b.addEventListener("click", () => {
        if (row.classList.contains("solved")) return;
        if (choice === s.ans) {
          row.classList.add("solved");
          btns.querySelectorAll("button").forEach(x => x.disabled = true);
          b.classList.add("chosen-right");
          cpuBoard.flashBus(choice.toLowerCase(), choice + " bus: " + s.text);
          const r = b.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
          doneCount3++;
          if (doneCount3 === SCENARIOS3.length) {
            awardStar("d3", "Read the same three roads a second way — straight off the registers carrying them.");
          }
        } else {
          toast("Not that road — think about whether this register holds a place or a thing.");
        }
      });
      btns.appendChild(b);
    });
    row.appendChild(p); row.appendChild(btns);
    quiz3.appendChild(row);
    rowEls3[s.id] = row;
  });

  /* ═══ D4: fetch, decode, execute — the shape of it ═══ */
  makeTermMatch({
    defs: [
      { id: "f1", label: "Fetch — get the next instruction from memory.", ans: "1st" },
      { id: "f2", label: "Decode — work out what the instruction means.", ans: "2nd" },
      { id: "f3", label: "Execute — actually carry it out.", ans: "3rd" }
    ],
    terms: [
      { key: "1st", label: "1st" },
      { key: "2nd", label: "2nd" },
      { key: "3rd", label: "3rd" }
    ],
    poolEl: $("#defPool4"), binsEl: $("#termBins4"), statusEl: $("#status4"),
    discId: "d4",
    promptAgain: "Tap a stage to try again.", promptBin: "Now tap the position you think it belongs to.",
    doneMsg: { status: "Fetch, decode, execute — in order.", star: "The whole shape, in order, before watching a single step run." },
    mismatchMsg: "Not that position — ask which stage has nothing to work with until an earlier one has finished."
  });
