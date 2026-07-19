
  /* ================= Module 16 — Meet the Machine =================
   Signature interaction: the shared "machine map" from the cpu kit
   (src/engine/interactions/cpu.js), mounted once in "reveal" mode before
   any discovery, and built up part by part as each of D1-D3 is matched.
   D4 is a recap match across all seven parts, once the map is complete.

   Each discovery is a small hand-rolled term-match (tap a job, then tap the
   part it belongs to; drag works too) — the same dual tap+drag pattern used
   throughout this course (Modules 13-15's D1/D4/D5, old Module 16's D1/D4),
   not the shared `matcher` kit, which hardcodes awardStar("d3", ...) with
   Module 9's wording and would award the wrong discovery under the wrong
   copy here. One local factory, makeTermMatch(), is reused four times
   within this file (D1: 2 items, D2: 3 items, D3: 2 items, D4: 7 items) —
   the same "reuse within one lesson, not yet a shared kit" rule of two this
   course applies elsewhere (e.g. old Module 16's crank engine, reused
   three times in one file).

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeCpuBoard are all in scope. */

  const cpuBoard = makeCpuBoard("cpuMountMachine", { mode: "reveal", revealed: [] });

  /* ═══ shared term-match factory, used by D1-D4 ═══ */
  function makeTermMatch(cfg) {
    // cfg: { defs:[{id,label,ans}], terms:[{key,label}], poolEl, binsEl,
    //        statusEl, discId, doneMsg, mismatchMsg, revealOnPlace }
    const defEls = {}, termEls = {};
    let selected = null, placed = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        cfg.statusEl.textContent = "Tap a job to begin.";
        return;
      }
      $$(".def-chip", cfg.poolEl).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      cfg.statusEl.textContent = "Now tap the part you think this job belongs to.";
    }
    function tryPlace(key) {
      if (!selected) return;
      const item = cfg.defs.find(x => x.id === selected);
      const btn = defEls[item.id];
      if (item.ans === key) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        termEls[key].list.textContent = item.label;
        termEls[key].wrap.classList.add("filled");
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        if (cfg.revealOnPlace) cpuBoard.reveal([key.toLowerCase()]);
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
        cfg.statusEl.textContent = "Tap a job to try again.";
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

  /* ═══ D1: the two workers — CU, ALU ═══ */
  makeTermMatch({
    defs: [
      { id: "j1", label: "Decodes each instruction and sends out the signals that make every other component do its part, in the right order.", ans: "CU" },
      { id: "j2", label: "Does the actual maths and comparisons, but only for an instant — it doesn't remember anything afterwards.", ans: "ALU" }
    ],
    terms: [
      { key: "CU", label: "CU — Control Unit" },
      { key: "ALU", label: "ALU — Arithmetic Logic Unit" }
    ],
    poolEl: $("#defPool1"), binsEl: $("#termBins1"), statusEl: $("#status1"),
    discId: "d1", revealOnPlace: true,
    doneMsg: { status: "Both workers matched — the decider and the calculator.", star: "CU decides, ALU calculates — the CPU's two workers, met by name." },
    mismatchMsg: "Not that part — read the job again and think about which one actually does this."
  });

  /* ═══ D2: the fetch trio — PC, MAR, MDR ═══ */
  makeTermMatch({
    defs: [
      { id: "j3", label: "Holds the memory address of the next instruction to fetch — never the instruction itself, just where to find it.", ans: "PC" },
      { id: "j4", label: "Holds an address — the location in memory the CPU is about to read from or write to. Never the data itself, only the location.", ans: "MAR" },
      { id: "j5", label: "Holds the actual data or instruction that has just travelled in from memory, or is about to travel out. Never an address.", ans: "MDR" }
    ],
    terms: [
      { key: "PC", label: "PC — Program Counter" },
      { key: "MAR", label: "MAR — Memory Address Register" },
      { key: "MDR", label: "MDR — Memory Data Register" }
    ],
    poolEl: $("#defPool2"), binsEl: $("#termBins2"), statusEl: $("#status2"),
    discId: "d2", revealOnPlace: true,
    doneMsg: { status: "All three matched — next, where, and what.", star: "PC, MAR and MDR, sorted by exactly what each one holds — next, where, and what." },
    mismatchMsg: "Not that part — think about whether this job is a place (an address) or a thing being carried."
  });

  /* ═══ D3: the instruction and the notepad — CIR, ACC ═══ */
  makeTermMatch({
    defs: [
      { id: "j6", label: "Holds whichever instruction is currently being decoded and carried out.", ans: "CIR" },
      { id: "j7", label: "Holds the running result of whatever the ALU is calculating right now — the CPU's one working notepad for numbers.", ans: "ACC" }
    ],
    terms: [
      { key: "CIR", label: "CIR — Current Instruction Register" },
      { key: "ACC", label: "ACC — Accumulator" }
    ],
    poolEl: $("#defPool3"), binsEl: $("#termBins3"), statusEl: $("#status3"),
    discId: "d3", revealOnPlace: true,
    doneMsg: { status: "Both matched — the instruction, and the notepad.", star: "CIR holds what's being obeyed; ACC keeps the running number. The last two parts, met." },
    mismatchMsg: "Not that part — one of these holds an instruction, the other holds a number."
  });

  /* ═══ D4: sort the whole crew — recap, all seven ═══ */
  makeTermMatch({
    defs: [
      { id: "k1", label: "Decodes each instruction and sends out the signals that make every other component do its part, in the right order.", ans: "CU" },
      { id: "k2", label: "Does the actual maths and comparisons, but only for an instant — it doesn't remember anything afterwards.", ans: "ALU" },
      { id: "k3", label: "Holds the memory address of the next instruction to fetch — never the instruction itself, just where to find it.", ans: "PC" },
      { id: "k4", label: "Holds an address — the location in memory the CPU is about to read from or write to. Never the data itself, only the location.", ans: "MAR" },
      { id: "k5", label: "Holds the actual data or instruction that has just travelled in from memory, or is about to travel out. Never an address.", ans: "MDR" },
      { id: "k6", label: "Holds whichever instruction is currently being decoded and carried out.", ans: "CIR" },
      { id: "k7", label: "Holds the running result of whatever the ALU is calculating right now — the CPU's one working notepad for numbers.", ans: "ACC" }
    ],
    terms: [
      { key: "CU", label: "CU — Control Unit" },
      { key: "ALU", label: "ALU — Arithmetic Logic Unit" },
      { key: "PC", label: "PC — Program Counter" },
      { key: "MAR", label: "MAR — Memory Address Register" },
      { key: "MDR", label: "MDR — Memory Data Register" },
      { key: "CIR", label: "CIR — Current Instruction Register" },
      { key: "ACC", label: "ACC — Accumulator" }
    ],
    poolEl: $("#defPool4"), binsEl: $("#termBins4"), statusEl: $("#status4"),
    discId: "d4", revealOnPlace: false,
    doneMsg: { status: "All seven matched — the whole crew, named and placed.", star: "Seven parts, seven jobs, all recapped without a single one left over." },
    mismatchMsg: "Not that part — read the job again and think about which one actually does this."
  });
