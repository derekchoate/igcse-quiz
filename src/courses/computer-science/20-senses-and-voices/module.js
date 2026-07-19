
  /* ================= Module 18 — Senses and Voices =================
   Signature interaction: a scenario workshop — real systems (a device pile,
   a greenhouse, a car park, three "weird" sensors) rendered as a labelled
   tray of chips plus a set of sockets; he taps a chip then a socket (or
   drags it straight across), and a socket glows once a defensible fit
   lands in it. D3's car park deliberately gives two of its three sockets
   more than one defensible sensor — "some scenes accept multiple correct
   answers on purpose" per the course plan — so a chip's `ans` may be a
   single bin key or an array of equally acceptable ones.

   This module needs no shared interaction kit (meta.uses is empty): every
   discovery is either the tap+drag sort described above, or D5's free-text
   reflection (mirroring Module 7's own-grid pattern). Rather than hand-copy
   the tap+drag pattern four times the way Modules 13-17 each copy it once
   or twice, it's factored into one local `makeSortBoard` helper below and
   instantiated once per discovery — a lesson-local simplification, not a
   promotion to a shared engine kit (that's a larger cross-module call for
   another day, per the-build-pipeline-plan.md's "rule of two").

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast
   and awardStar are all in scope. */

  /* ═══ shared local sort-board factory — pool of chips + sockets to sort
     them into (see file header for why this isn't a promoted engine kit).

     cfg:
       poolEl, binsEl     — containers to render into
       items              — [{ id, label, ans }], ans is a bin key or array of keys
       bins               — [{ key, label }]
       listMode           — true: a bin accumulates every placed item (D1's
                             input/output sort); false: a bin holds exactly
                             one placed item, matcher-style (D2/D3/D4)
       statusEl           — live status line
       selectPrompt/placePrompt/retryPrompt — status line copy
       wrongMessage(item, key)  — toast copy for a genuinely indefensible pick
       alreadyMessage(bin)      — toast copy for a single-slot bin that's
                                  already filled (not wrong, just occupied —
                                  only relevant when a chip's `ans` can match
                                  more than one bin, as in D3)
       doneMessage        — status line copy once every chip is placed
       onAllPlaced()      — fires once every chip is placed                     */
  function makeSortBoard(cfg) {
    const itemEls = {}, binEls = {};
    let selected = null, placedCount = 0;
    let dragId = null, dragging = false, dragGhost = null, dragPtrId = null;
    let dragStartX = 0, dragStartY = 0, dragOffX = 0, dragOffY = 0;

    function acceptedKeys(item) { return Array.isArray(item.ans) ? item.ans : [item.ans]; }

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        cfg.statusEl.textContent = cfg.selectPrompt;
        return;
      }
      $$(".sort-chip.sel, .def-chip.sel", cfg.poolEl).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      cfg.statusEl.textContent = cfg.placePrompt;
    }

    function tryPlace(key) {
      if (!selected) return;
      const item = cfg.items.find(x => x.id === selected);
      const btn = itemEls[item.id];
      const bin = binEls[key];

      if (!cfg.listMode && bin.wrap.classList.contains("filled")) {
        toast(cfg.alreadyMessage(bin));
        btn.classList.remove("sel"); selected = null;
        cfg.statusEl.textContent = cfg.retryPrompt;
        return;
      }

      if (acceptedKeys(item).includes(key)) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        if (cfg.listMode) {
          const line = document.createElement("div");
          line.className = "sort-item"; line.textContent = item.label;
          bin.list.appendChild(line);
        } else {
          bin.list.textContent = item.label;
          bin.wrap.classList.add("filled");
        }
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        placedCount++; selected = null;
        if (placedCount === cfg.items.length) {
          cfg.statusEl.textContent = cfg.doneMessage;
          cfg.onAllPlaced();
        } else {
          cfg.statusEl.textContent = "That's the one. " + (cfg.items.length - placedCount) + " more to go.";
        }
      } else {
        toast(cfg.wrongMessage(item, key));
        btn.classList.remove("sel"); selected = null;
        cfg.statusEl.textContent = cfg.retryPrompt;
      }
    }

    function binUnder(e) {
      if (dragGhost) dragGhost.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (dragGhost) dragGhost.style.visibility = "";
      const wrap = el && el.closest ? el.closest(".sort-bin") : null;
      if (!wrap) return null;
      for (const k in binEls) { if (binEls[k].wrap === wrap) return k; }
      return null;
    }
    function markHover(key) {
      Object.keys(binEls).forEach(k => binEls[k].wrap.classList.toggle("drop-ok", k === key));
    }
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
        dragGhost.classList.add("sort-ghost"); dragGhost.classList.remove("sel");
        dragGhost.style.width = rect.width + "px";
        document.body.appendChild(dragGhost);
        btn.classList.add("dragging");
        $$(".sort-chip.sel, .def-chip.sel", cfg.poolEl).forEach(c => c.classList.remove("sel"));
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
      b.type = "button"; b.className = cfg.chipClass; b.textContent = item.label; b.dataset.id = item.id;
      b.addEventListener("click", () => { if (!dragging) select(item.id, b); });
      b.addEventListener("pointerdown", e => dragStart(e, item.id, b));
      itemEls[item.id] = b;
      return b;
    }
    function buildBin(bin) {
      const wrap = document.createElement("div"); wrap.className = "sort-bin";
      const head = document.createElement("button");
      head.type = "button"; head.className = "sort-bin-head"; head.textContent = bin.label;
      head.addEventListener("click", () => tryPlace(bin.key));
      const list = document.createElement("div");
      list.className = cfg.listMode ? "sort-bin-list" : "sort-bin-body";
      list.setAttribute("aria-live", "polite");
      if (!cfg.listMode) list.textContent = "—";
      wrap.appendChild(head); wrap.appendChild(list);
      binEls[bin.key] = { wrap, list, head };
      return wrap;
    }
    cfg.bins.forEach(bin => cfg.binsEl.appendChild(buildBin(bin)));
    cfg.items.forEach(item => cfg.poolEl.appendChild(buildChip(item)));
  }

  /* ═══ D1: in or out — 8-into-2 device sort, list-mode bins ═══ */
  const DEVICES1 = [
    { id: "dev1", label: "Keyboard", ans: "Input" },
    { id: "dev2", label: "Microphone", ans: "Input" },
    { id: "dev3", label: "Mouse", ans: "Input" },
    { id: "dev4", label: "Barcode scanner", ans: "Input" },
    { id: "dev5", label: "Speaker", ans: "Output" },
    { id: "dev6", label: "Printer", ans: "Output" },
    { id: "dev7", label: "Projector", ans: "Output" },
    { id: "dev8", label: "Screen", ans: "Output" }
  ];
  makeSortBoard({
    poolEl: $("#pool1"), binsEl: $("#bins1"), statusEl: $("#status1"),
    items: DEVICES1,
    bins: [{ key: "Input", label: "Input device" }, { key: "Output", label: "Output device" }],
    listMode: true, chipClass: "sort-chip",
    selectPrompt: "Tap a device to begin.",
    placePrompt: "Now tap the socket you think it belongs in.",
    retryPrompt: "Tap a device to try again.",
    wrongMessage: () => "Not that socket — think about which direction the information is travelling for this one.",
    doneMessage: "All eight sorted — information arriving on one side, information leaving on the other.",
    onAllPlaced: () => awardStar("d1", "Eight devices, two directions, no doubt about any of them. (And one device — the touch screen — sat this one out on purpose, because it's honestly both at once.)")
  });

  /* ═══ D2: kit the greenhouse — 4-into-4 single-slot sort ═══ */
  const GREENHOUSE2 = [
    { id: "g1", label: "Moisture sensor", ans: "Moisture" },
    { id: "g2", label: "Temperature sensor", ans: "Temperature" },
    { id: "g3", label: "Light sensor", ans: "Light" },
    { id: "g4", label: "Humidity sensor", ans: "Humidity" }
  ];
  makeSortBoard({
    poolEl: $("#pool2"), binsEl: $("#bins2"), statusEl: $("#status2"),
    items: GREENHOUSE2,
    bins: [
      { key: "Moisture", label: "How wet is the soil?" },
      { key: "Temperature", label: "How warm is the air?" },
      { key: "Light", label: "How bright is it in here?" },
      { key: "Humidity", label: "How much water vapour is in the air?" }
    ],
    listMode: false, chipClass: "sort-chip",
    selectPrompt: "Tap a sensor to begin.",
    placePrompt: "Now tap the socket you think it fits.",
    retryPrompt: "Tap a sensor to try again.",
    wrongMessage: () => "Not that socket — read the question again and think about exactly what this sensor measures.",
    alreadyMessage: () => "That socket already has a sensor fitted — try one of the others.",
    doneMessage: "All four sensors kitted — the greenhouse now knows everything it needs to.",
    onAllPlaced: () => awardStar("d2", "Moisture, temperature, light, humidity — four different questions, four sensors that answer exactly one each.")
  });

  /* ═══ D3: kit the car park — 3-into-3 sort, two sockets multi-accept ═══ */
  const CARPARK3 = [
    { id: "c1", label: "Proximity sensor", ans: ["Entrance", "Exit"] },
    { id: "c2", label: "Infrared sensor", ans: ["Entrance", "Exit"] },
    { id: "c3", label: "Pressure sensor", ans: ["Weighbridge"] }
  ];
  makeSortBoard({
    poolEl: $("#pool3"), binsEl: $("#bins3"), statusEl: $("#status3"),
    items: CARPARK3,
    bins: [
      { key: "Entrance", label: "Knows a car has arrived, without touching it" },
      { key: "Exit", label: "Knows a car has left, without touching it" },
      { key: "Weighbridge", label: "Knows exactly how heavy an oversized vehicle is" }
    ],
    listMode: false, chipClass: "sort-chip",
    selectPrompt: "Tap a sensor to begin.",
    placePrompt: "Now tap the socket you think it fits.",
    retryPrompt: "Tap a sensor to try again.",
    wrongMessage: (item) => item.id === "c3"
      ? "Not that socket — a pressure sensor needs contact, and this socket is asking for something sensed without touching the vehicle."
      : "Not that socket — this sensor can't measure weight. Which socket is actually asking about touch-free detection?",
    alreadyMessage: () => "That socket already has a sensor fitted — try one of the others.",
    doneMessage: "All three sockets filled — and two of them would have happily taken either sensor you gave them.",
    onAllPlaced: () => awardStar("d3", "The entrance and exit barriers were both happy with proximity or infrared — real systems often have more than one honest answer. The weighbridge needed something else entirely, and only pressure did that job.")
  });

  /* ═══ D4: the weird ones — 3-into-3 vivid-use match ═══ */
  const WEIRD4 = [
    { id: "w1", label: "An aquarium's automatic doser keeps testing the water and tops up chemicals whenever it drifts from what's safe for the fish.", ans: "pH sensor" },
    { id: "w2", label: "A laptop notices the moment its lid swings shut — by sensing a small magnet moving out of range — and puts itself straight to sleep.", ans: "Magnetic field sensor" },
    { id: "w3", label: "A fitness band feels the tiny back-and-forth motion of your wrist with every step and turns it into a step count.", ans: "Accelerometer" }
  ];
  makeSortBoard({
    poolEl: $("#defPool4"), binsEl: $("#bins4"), statusEl: $("#status4"),
    items: WEIRD4,
    bins: [
      { key: "pH sensor", label: "pH sensor" },
      { key: "Magnetic field sensor", label: "Magnetic field sensor" },
      { key: "Accelerometer", label: "Accelerometer" }
    ],
    listMode: false, chipClass: "def-chip",
    selectPrompt: "Tap a description to begin.",
    placePrompt: "Now tap the sensor you think this describes.",
    retryPrompt: "Tap a description to try again.",
    wrongMessage: () => "Not that sensor — read the description again and think about which physical quantity is actually being measured.",
    alreadyMessage: () => "That sensor's already matched to a description — try one of the others.",
    doneMessage: "All three matched — three vivid, real jobs, three sensors that actually do them.",
    onAllPlaced: () => awardStar("d4", "pH, magnetic field, accelerometer — three sensors that sound abstract until you meet the one thing each of them is quietly doing, right now, in things you probably own.")
  });

  /* ═══ D5: design your own — free text, reflection only (Module 7's own-grid pattern) ═══ */
  const OWN_FIELDS5 = [
    { key: "place", label: "A real place you know" },
    { key: "sensor", label: "One sensor it could use, and why" },
    { key: "output", label: "One output device it could use, and why" }
  ];
  const ownGrid5 = $("#ownGrid5");
  const ownState5 = { place: "", sensor: "", output: "" };
  let awarded5 = false;
  OWN_FIELDS5.forEach(field => {
    const box = document.createElement("div"); box.className = "own-box";
    const label = document.createElement("label");
    label.textContent = field.label; label.setAttribute("for", "own-" + field.key);
    const ta = document.createElement("textarea");
    ta.id = "own-" + field.key; ta.setAttribute("aria-label", field.label);
    ta.addEventListener("input", () => {
      ownState5[field.key] = ta.value.trim();
      if (!awarded5 && Object.values(ownState5).every(v => v.length > 0)) {
        awarded5 = true;
        awardStar("d5", "You just socketed a real place that's genuinely yours. No one checked it — it was never that kind of exercise.");
      }
    });
    box.appendChild(label); box.appendChild(ta);
    ownGrid5.appendChild(box);
  });
