
  /* ================= Module 19 — Where Things Live =================
   Signature interaction: a "memory city map" — small labelled districts
   (RAM, ROM, secondary storage, cloud) that reappear across discoveries.
   D1 puts a real power-cut switch on it: pressing it dims only the RAM
   district, visibly, while the rest stay lit — then a sort task drives the
   same fact home with six ordinary things. D4 turns it into a four-slot RAM
   bank: fill it, open one more, and watch a page get shuttled out to
   secondary storage at a real, visible tick cost (virtual memory).

   D2, D3 and D5 are the tap+drag "sort board" pattern established in
   Module 18's module.js (makeSortBoard, reused here near-verbatim) rather
   than the shared `matcher` kit — matcher hardcodes awardStar("d3", ...)
   with Module 9's pseudocode-pairing wording, and none of this module's
   sorts are a 1:1 pairing anyway (they're N-into-2/3-bin sorts, same shape
   as D1's own sort). This module needs no drag-pair kit, only the generic
   `chips` kit (meta.uses) for D4's two tries.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. */

  /* ═══ shared local sort-board factory — pool of chips + sockets to sort
     them into (ported from Module 18's module.js; see file header). Every
     discovery here uses listMode: true (a bin accumulates every item placed
     in it, building up a real table row by row) since none of this
     module's sockets are single-slot. cfg:
       poolEl, binsEl     — containers to render into
       items              — [{ id, label, ans }]
       bins               — [{ key, label }]
       statusEl           — live status line
       selectPrompt/placePrompt/retryPrompt — status line copy
       wrongMessage(item, key)  — toast copy for a mismatched pick
       doneMessage        — status line copy once every chip is placed
       onAllPlaced()      — fires once every chip is placed                */
  function makeSortBoard(cfg) {
    const itemEls = {}, binEls = {};
    let selected = null, placedCount = 0;
    let dragId = null, dragging = false, dragGhost = null, dragPtrId = null;
    let dragStartX = 0, dragStartY = 0, dragOffX = 0, dragOffY = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        cfg.statusEl.textContent = cfg.selectPrompt;
        return;
      }
      $$(".sort-chip.sel", cfg.poolEl).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      cfg.statusEl.textContent = cfg.placePrompt;
    }

    function tryPlace(key) {
      if (!selected) return;
      const item = cfg.items.find(x => x.id === selected);
      const btn = itemEls[item.id];
      const bin = binEls[key];

      if (item.ans === key) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        const line = document.createElement("div");
        line.className = "sort-item"; line.textContent = item.label;
        bin.list.appendChild(line);
        bin.wrap.classList.add("filled");
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
        $$(".sort-chip.sel", cfg.poolEl).forEach(c => c.classList.remove("sel"));
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
      b.type = "button"; b.className = "sort-chip"; b.textContent = item.label; b.dataset.id = item.id;
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
      list.className = "sort-bin-list";
      list.setAttribute("aria-live", "polite");
      wrap.appendChild(head); wrap.appendChild(list);
      binEls[bin.key] = { wrap, list, head };
      return wrap;
    }
    cfg.bins.forEach(bin => cfg.binsEl.appendChild(buildBin(bin)));
    cfg.items.forEach(item => cfg.poolEl.appendChild(buildChip(item)));
  }

  /* ═══ D1: pull the plug — power-switch demo, then a 6-into-2 sort ═══ */
  let powerOn1 = true;
  const ramDistrict1 = $("#ramDistrict1"), powerBtn1 = $("#powerSwitch1"), powerReadout1 = $("#powerReadout1");
  powerBtn1.addEventListener("click", () => {
    powerOn1 = !powerOn1;
    ramDistrict1.classList.toggle("dark", !powerOn1);
    ramDistrict1.classList.toggle("lit", powerOn1);
    if (powerOn1) {
      powerBtn1.textContent = "Pull the plug";
      powerReadout1.textContent = "Power's back. RAM lights up again — but whatever was in it before the cut is gone for good, not restored.";
    } else {
      powerBtn1.textContent = "Restore power";
      powerReadout1.textContent = "RAM just went dark. ROM, secondary storage and the cloud didn't even notice.";
    }
  });

  const THINGS1 = [
    { id: "r1", label: "A document you've been typing but haven't saved yet", ans: "Gone" },
    { id: "r2", label: "A photo already saved onto the phone's storage", ans: "Survives" },
    { id: "r3", label: "The instructions that run the instant the computer is switched on, before anything else loads", ans: "Survives" },
    { id: "r4", label: "A web page you have open in a tab but haven't downloaded anything from", ans: "Gone" },
    { id: "r5", label: "A file you uploaded to the cloud earlier", ans: "Survives" },
    { id: "r6", label: "A game you've been playing that you haven't saved your progress in", ans: "Gone" }
  ];
  makeSortBoard({
    poolEl: $("#pool1"), binsEl: $("#bins1"), statusEl: $("#status1"),
    items: THINGS1,
    bins: [
      { key: "Survives", label: "Survives a power cut" },
      { key: "Gone", label: "Gone the instant the power cuts" }
    ],
    selectPrompt: "Tap a thing to begin.",
    placePrompt: "Now tap the socket you think it belongs in.",
    retryPrompt: "Tap a thing to try again.",
    wrongMessage: () => "Not that socket — ask whether this thing has actually been saved anywhere yet, or whether it's only in RAM right now.",
    doneMessage: "All six sorted — RAM forgets, everything else remembers.",
    onAllPlaced: () => awardStar("d1", "You watched RAM go dark on its own, then proved the same point six more ways: only what's sitting in RAM disappears the instant the power cuts.")
  });

  /* ═══ D2: ROM, the unforgetting — 6-into-2 sort, RAM vs ROM traits ═══ */
  const TRAITS2 = [
    { id: "t1", label: "Loses everything the instant power stops", ans: "RAM" },
    { id: "t2", label: "Holds the instructions followed the moment the computer is switched on, before anything else has loaded", ans: "ROM" },
    { id: "t3", label: "Can be changed freely while the computer is running", ans: "RAM" },
    { id: "t4", label: "Its contents normally can't be changed by whoever's using the computer", ans: "ROM" },
    { id: "t5", label: "Holds whatever you're actively working on right now", ans: "RAM" },
    { id: "t6", label: "Without it, a computer would have no idea what to do the moment it's switched on", ans: "ROM" }
  ];
  makeSortBoard({
    poolEl: $("#pool2"), binsEl: $("#bins2"), statusEl: $("#status2"),
    items: TRAITS2,
    bins: [
      { key: "RAM", label: "RAM" },
      { key: "ROM", label: "ROM" }
    ],
    selectPrompt: "Tap a trait to begin.",
    placePrompt: "Now tap the socket you think it belongs in.",
    retryPrompt: "Tap a trait to try again.",
    wrongMessage: () => "Not that socket — think about whether this trait is about something changing and vanishing, or something fixed and permanent.",
    doneMessage: "All six traits sorted — RAM's job and ROM's job, cleanly told apart.",
    onAllPlaced: () => awardStar("d2", "RAM changes constantly and forgets everything; ROM stays fixed and never forgets its one job. A computer genuinely needs both — and neither one is where your files actually live.")
  });

  /* ═══ D3: three warehouses — 9-into-3 sort, a real comparison table ═══ */
  const TRAITS3 = [
    { id: "w1", label: "Stores data on spinning magnetic platters, written and read using electromagnets", ans: "SpinDrive" },
    { id: "w2", label: "Stores data as tiny marks burned into a spinning disc, read by a laser", ans: "Disc" },
    { id: "w3", label: "Stores data purely in transistors — nothing physically spins or moves at all", ans: "Chip" },
    { id: "w4", label: "The fastest of the three at reading and writing data, but the most expensive per gigabyte", ans: "Chip" },
    { id: "w5", label: "The cheapest of the three per gigabyte, and the most common choice for bulk storage in desktop PCs", ans: "SpinDrive" },
    { id: "w6", label: "Cheap to mass-produce identical copies of, which is why software and movies used to be sold on these", ans: "Disc" },
    { id: "w7", label: "Because it has moving parts, a knock or a drop can damage it more easily than the other two", ans: "SpinDrive" },
    { id: "w8", label: "Has no moving parts to be jolted, which is a big part of why phones and laptops use this instead", ans: "Chip" },
    { id: "w9", label: "Typically holds far less data than the other two, and scratches easily", ans: "Disc" }
  ];
  makeSortBoard({
    poolEl: $("#pool3"), binsEl: $("#bins3"), statusEl: $("#status3"),
    items: TRAITS3,
    bins: [
      { key: "SpinDrive", label: "The spin-drive (HDD)" },
      { key: "Disc", label: "The disc (CD, DVD, Blu-ray)" },
      { key: "Chip", label: "The chip (SSD)" }
    ],
    selectPrompt: "Tap a trait card to begin.",
    placePrompt: "Now tap the warehouse you think it fits.",
    retryPrompt: "Tap a trait card to try again.",
    wrongMessage: () => "Not that warehouse — read the card again and think about which one's actual mechanism or trade-off it's describing.",
    doneMessage: "All nine sorted into a real comparison table — speed, cost, durability and capacity, across three genuinely different technologies.",
    onAllPlaced: () => awardStar("d3", "The spin-drive, the disc and the chip each do the same job — remembering data with no power needed — in three completely different ways, with three honestly different trade-offs.")
  });

  /* ═══ D4: the overflow bus — 4-slot RAM bank + virtual memory demo ═══ */
  const RAM_CAPACITY_4 = 4, NORMAL_COST_4 = 1, OVERFLOW_COST_4 = 20;
  let ramSlots4 = new Array(RAM_CAPACITY_4).fill(null);
  let appCounter4 = 0;
  const ramBankEl4 = $("#ramBank4"), pagedListEl4 = $("#pagedList4"), log4 = $("#benchLog4");
  const slotEls4 = [];

  function renderSlot4(i) {
    const slot = slotEls4[i];
    if (ramSlots4[i]) {
      slot.textContent = ramSlots4[i];
      slot.classList.add("filled");
    } else {
      slot.textContent = "—";
      slot.classList.remove("filled");
    }
  }
  for (let i = 0; i < RAM_CAPACITY_4; i++) {
    const slot = document.createElement("div");
    slot.className = "ram-slot"; slot.textContent = "—";
    ramBankEl4.appendChild(slot);
    slotEls4.push(slot);
  }

  function addLogLine4(text) {
    const li = document.createElement("li"); li.textContent = text;
    log4.appendChild(li);
    while (log4.children.length > 4) log4.removeChild(log4.firstChild);
  }

  const check4 = makeChips($("#chips4"), ["filled", "overflow"],
    () => awardStar("d4", "You filled RAM, then forced an overflow, and watched the tick cost jump twenty-fold the instant a page had to shuttle out to disk. That's virtual memory: it keeps things running, not running fast."),
    k => (k === "filled" ? "fill RAM completely" : "trigger an overflow"),
    (label, remaining) => "Tried: " + label + ". " + remaining + " more to try.");

  $("#openApp4").addEventListener("click", () => {
    appCounter4++;
    const label = "App " + appCounter4;
    const emptyIndex = ramSlots4.indexOf(null);
    if (emptyIndex !== -1) {
      ramSlots4[emptyIndex] = label;
      renderSlot4(emptyIndex);
      addLogLine4(label + " opened straight into RAM — " + NORMAL_COST_4 + " tick.");
      if (ramSlots4.every(s => s !== null)) check4("filled");
    } else {
      const paged = ramSlots4.shift();
      ramSlots4.push(label);
      slotEls4.forEach((_, i) => renderSlot4(i));
      const pagedLine = document.createElement("div");
      pagedLine.className = "paged-item";
      pagedLine.textContent = paged + " (paged out)";
      pagedListEl4.appendChild(pagedLine);
      addLogLine4("RAM was full — " + paged + " paged out to disk to make room, then " + label + " loaded — " + OVERFLOW_COST_4 + " ticks. Much slower than the usual " + NORMAL_COST_4 + ".");
      check4("overflow");
    }
  });

  /* ═══ D5: someone else's computer — 8-into-2 sort, cloud pros vs cons ═══ */
  const CLOUD5 = [
    { id: "c1", label: "You can open the same file from your phone, your laptop, or a friend's computer", ans: "Upside" },
    { id: "c2", label: "If your own device breaks or gets lost, your files are still safe, since they were never only stored on it", ans: "Upside" },
    { id: "c3", label: "Sharing a file with someone else is as simple as sending a link, instead of physically copying it across", ans: "Upside" },
    { id: "c4", label: "You never have to buy, fit, or maintain the physical hard drives yourself", ans: "Upside" },
    { id: "c5", label: "Without an internet connection, you often can't reach your own files at all", ans: "Downside" },
    { id: "c6", label: "You're trusting somewhere else with your files, so it's worth reading their terms rather than assuming", ans: "Downside" },
    { id: "c7", label: "Many cloud storage plans quietly become an ongoing subscription cost rather than a one-off payment", ans: "Downside" },
    { id: "c8", label: "Uploading and downloading large files can be slower than reading them straight off a local disk", ans: "Downside" }
  ];
  makeSortBoard({
    poolEl: $("#pool5"), binsEl: $("#bins5"), statusEl: $("#status5"),
    items: CLOUD5,
    bins: [
      { key: "Upside", label: "A genuine upside" },
      { key: "Downside", label: "An honest downside" }
    ],
    selectPrompt: "Tap a statement to begin.",
    placePrompt: "Now tap the column you think it belongs in.",
    retryPrompt: "Tap a statement to try again.",
    wrongMessage: () => "Not that column — ask whether this statement describes something the cloud makes easier, or something it makes you depend on or pay for.",
    doneMessage: "All eight sorted — the real upsides, and the honest downsides, side by side.",
    onAllPlaced: () => awardStar("d5", "Cloud storage is genuinely useful and genuinely has real costs — an internet dependency, a trust question, an ongoing bill. Seeing both columns at once is what a fair comparison actually looks like.")
  });
