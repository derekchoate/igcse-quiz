
  /* ================= Module 33 — Money Made of Maths =================
   Signature interaction (D4): a tamper-evident block chain. D3 first builds
   the same chain read-only so the fingerprint/grip vocabulary is stated in
   full before anything depends on it (design contract rule 11); D4 reuses
   the identical five blocks, but block 3 carries a "sneak in and change it"
   control. Tampering it recalculates block 3's own fingerprint live, while
   block 4's stored copy of the *old* fingerprint never moves — so the two
   stop matching, and that mismatch is what actually gets flagged, not block
   3 itself. Block 5 is marked as failing too, purely because it grips block
   4 the same way block 4 grips block 3 — nothing about block 5 was touched,
   which is the whole cascade point the plan asks for.

   No red anywhere, per the design contract (rule 2, no failure events) and
   an explicit house-palette note for this module: a block whose grip is
   intact reads with the same solid teal used elsewhere for "done" states
   (.sl-bin.filled, .ww-relay-node.done in Module 32); the villain's own
   edit reads with the amber "primary action" treatment (agency, not
   error); a block whose grip has failed reads with a desaturated, dashed
   soft-ink outline (.mc-block.flagged below) — dimmed rather than alarmed,
   never red, never the wrong-answer toast used elsewhere for a mis-sorted
   chip. See module.css for the exact rule.

   D1 and D5 share one hand-rolled tap-or-drag chip → bin sorter, copied
   from Module 32's makeBinSorter() (same shape as Modules 13/26/27's own
   copies — rule of two, not the shared `matcher` kit, which hardcodes
   awardStar("d3", ...) for Module 9's pairing and would award the wrong
   discovery here regardless).

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. */

  /* ═══ shared local factory: tap-or-drag chip → bin sorter (D5) ═══ */
  function makeBinSorter(opts) {
    const { pool, binsContainer, status, items, bins, doneStatus, wrongMsg, onDone } = opts;
    const itemEls = {}, binEls = {};
    let selected = null, placed = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap a claim to begin.";
        return;
      }
      $$(".sl-chip", pool).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      status.textContent = "Now tap the pile you think it belongs on.";
    }
    function tryPlace(key) {
      if (!selected) return;
      const item = items.find(x => x.id === selected);
      const btn = itemEls[item.id];
      if (item.ans === key) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        const line = document.createElement("div");
        line.className = "sl-bin-line"; line.textContent = item.label;
        binEls[key].body.appendChild(line);
        binEls[key].wrap.classList.add("filled");
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        placed++; selected = null;
        if (placed === items.length) {
          status.textContent = doneStatus;
          onDone();
        } else {
          status.textContent = "That's the one. " + (items.length - placed) + " more to go.";
        }
      } else {
        toast(wrongMsg);
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap a claim to try again.";
      }
    }
    function binUnder(e) {
      if (dragGhost) dragGhost.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (dragGhost) dragGhost.style.visibility = "";
      const bin = el && el.closest ? el.closest(".sl-bin") : null;
      if (!bin) return null;
      for (const k in binEls) { if (binEls[k].wrap === bin) return k; }
      return null;
    }
    function markHover(key) {
      Object.keys(binEls).forEach(k => binEls[k].wrap.classList.toggle("drop-ok", k === key));
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
      const btn = itemEls[dragId];
      if (!dragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) < 6) return;
        dragging = true;
        const rect = btn.getBoundingClientRect();
        dragOffX = dragStartX - rect.left; dragOffY = dragStartY - rect.top;
        dragGhost = btn.cloneNode(true);
        dragGhost.classList.add("sl-chip-ghost"); dragGhost.classList.remove("sel");
        dragGhost.style.width = rect.width + "px";
        document.body.appendChild(dragGhost);
        btn.classList.add("dragging");
        $$(".sl-chip", pool).forEach(c => c.classList.remove("sel"));
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
      b.type = "button"; b.className = "sl-chip"; b.dataset.id = item.id;
      b.textContent = item.label;
      b.addEventListener("click", () => { if (!dragging) select(item.id, b); });
      b.addEventListener("pointerdown", e => dragStart(e, item.id, b));
      itemEls[item.id] = b;
      return b;
    }
    function buildBin(bin) {
      const wrap = document.createElement("div"); wrap.className = "sl-bin";
      const head = document.createElement("button");
      head.type = "button"; head.className = "sl-bin-head"; head.textContent = bin.label;
      head.addEventListener("click", () => tryPlace(bin.key));
      const body = document.createElement("div"); body.className = "sl-bin-body"; body.setAttribute("aria-live", "polite");
      wrap.appendChild(head); wrap.appendChild(body);
      binEls[bin.key] = { wrap, body, head };
      return wrap;
    }
    bins.forEach(bin => binsContainer.appendChild(buildBin(bin)));
    items.forEach(item => pool.appendChild(buildChip(item)));
  }

  /* ═══ shared data: the village fund's four IOU entries (D1, D2) ═══ */
  const LEDGER_ENTRIES = [
    { id: "e1", text: "Priya lent Farah 20 credits.", tampered: "Priya lent Farah 80 credits." },
    { id: "e2", text: "Wei Ling lent Priya 10 credits.", tampered: "Wei Ling lent Priya 60 credits." },
    { id: "e3", text: "Farah lent Arun 5 credits.", tampered: "Farah lent Arun 45 credits." },
    { id: "e4", text: "Arun lent Wei Ling 15 credits.", tampered: "Arun lent Wei Ling 70 credits." }
  ];

  /* ═══ shared data: the same fund, redrawn as a five-block chain (D3, D4) ═══ */
  const CHAIN_BLOCKS = [
    { id: "block1", label: "Block 1", tx: "The fund opens with a 100-credit contribution.", fp: "3F2A-9B1C", prevFp: null },
    { id: "block2", label: "Block 2", tx: "Priya sends Farah 20 credits.", fp: "8D4E-11A0", prevFp: "3F2A-9B1C" },
    { id: "block3", label: "Block 3", tx: "Wei Ling sends Priya 10 credits.", fp: "C71B-5602", prevFp: "8D4E-11A0", tamperedTx: "Wei Ling sends Priya 90 credits.", tamperedFp: "9E30-77FA" },
    { id: "block4", label: "Block 4", tx: "Farah sends Arun 5 credits.", fp: "2AC9-408D", prevFp: "C71B-5602" },
    { id: "block5", label: "Block 5", tx: "Arun sends Wei Ling 15 credits.", fp: "61FE-93B7", prevFp: "2AC9-408D" }
  ];

  /* ═══ D1: the one book — quietly change an entry, nothing catches it ═══ */
  (function () {
    const host = $("#ledger1"), note = $("#ledgerNote1");
    let awarded = false;

    LEDGER_ENTRIES.forEach(entry => {
      const row = document.createElement("div");
      row.className = "mc-ledger-row";
      const text = document.createElement("span");
      text.className = "mc-ledger-text"; text.id = "text1-" + entry.id;
      text.textContent = entry.text;
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "loop-btn";
      btn.textContent = "Quietly change this entry ▶";
      btn.addEventListener("click", () => {
        text.textContent = entry.tampered;
        btn.textContent = "Changed ✓"; btn.disabled = true;
        row.classList.add("edited");
        const r = row.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        note.textContent = "Notice what just happened: nothing stopped you, nothing flagged it, and there's no second copy anywhere to check it against. That's the trust problem every currency has to solve — and it's worse for a digital one, because there's no physical note changing hands to prove anything either.";
        if (!awarded) {
          awarded = true;
          awardStar("d1", "One quiet edit to the fund's only book, and nothing in the world could have caught it — the exact trust problem every currency, digital or not, has to solve somehow.");
        }
      });
      row.appendChild(text); row.appendChild(btn);
      host.appendChild(row);
    });
  })();

  /* ═══ D2: everyone keeps the book — distribute it, retry the fraud ═══ */
  (function () {
    const host = $("#copies2");
    const HOLDERS = ["Arun's copy", "Priya's copy", "Wei Ling's copy"];
    const textEls = { 0: [], 1: [], 2: [] };
    const panelEls = [];

    HOLDERS.forEach((holder, hi) => {
      const panel = document.createElement("div");
      panel.className = "mc-copy";
      const title = document.createElement("p");
      title.className = "mc-copy-title"; title.textContent = holder;
      panel.appendChild(title);
      LEDGER_ENTRIES.forEach((entry, ei) => {
        const line = document.createElement("p");
        line.className = "mc-copy-line"; line.textContent = entry.text;
        panel.appendChild(line);
        textEls[hi][ei] = line;
      });
      panelEls.push(panel);
      host.appendChild(panel);
    });

    $("#tamperBtn2").addEventListener("click", () => {
      textEls[0][0].textContent = LEDGER_ENTRIES[0].tampered;
      panelEls[0].classList.add("edited");
      $("#tamperBtn2").hidden = true;
      $("#compareBtn2").hidden = false;
      $("#compareNote2").textContent = "Arun's copy has been changed. Nobody else's has.";
    });

    $("#compareBtn2").addEventListener("click", () => {
      panelEls[0].classList.add("flagged");
      panelEls[1].classList.add("matched");
      panelEls[2].classList.add("matched");
      $("#compareNote2").textContent = "Compared: Priya's copy and Wei Ling's copy both still say \"Priya lent Farah 20 credits.\" — they agree with each other. Arun's copy says 80. Two independent copies against one is all it takes to spot which one moved.";
      awardStar("d2", "Three independent copies of the same ledger, one quietly tampered — and the tampered one didn't quietly become the new truth. It just became the copy that disagreed with everyone else.");
    });
  })();

  /* ═══ D3: chained fingerprints — inspect the grip, block by block ═══
     Signature vocabulary discovery: block 1 has nothing before it to grip
     and is shown open by default; blocks 2-5 reveal their fingerprint and
     grip note on inspection, tracked with the shared chips kit. */
  (function () {
    const host = $("#chain3");
    const INSPECTABLE = CHAIN_BLOCKS.slice(1).map(b => b.id);

    const check3 = makeChips($("#chips3"), INSPECTABLE,
      () => awardStar("d3", "Every block inspected, every grip confirmed — each one storing a fingerprint of the block before it, and every stored copy still matching. That's a chain nothing has tampered with yet."),
      id => CHAIN_BLOCKS.find(b => b.id === id).label,
      (label, remaining) => "Inspected " + label + " — " + remaining + " more to go.");

    CHAIN_BLOCKS.forEach(block => {
      const card = document.createElement("div");
      card.className = "mc-block";
      const head = document.createElement("div");
      head.className = "mc-block-head";
      head.innerHTML = '<span class="mc-block-label">' + block.label + '</span><span class="mc-block-fp" hidden></span>';
      const tx = document.createElement("p");
      tx.className = "mc-block-tx"; tx.textContent = block.tx;
      const grip = document.createElement("p");
      grip.className = "mc-block-grip"; grip.hidden = true;
      card.appendChild(head); card.appendChild(tx); card.appendChild(grip);

      if (block.prevFp === null) {
        $(".mc-block-fp", head).hidden = false;
        $(".mc-block-fp", head).textContent = block.fp;
        grip.hidden = false;
        grip.textContent = "The very first block — nothing before it to grip. This is simply where the chain starts.";
        card.classList.add("matched");
      } else {
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "loop-btn";
        btn.textContent = "Inspect " + block.label + " ▶";
        btn.addEventListener("click", () => {
          $(".mc-block-fp", head).hidden = false;
          $(".mc-block-fp", head).textContent = block.fp;
          grip.hidden = false;
          grip.textContent = "Stores a copy of the previous block's fingerprint: " + block.prevFp + ". That matches the fingerprint actually printed on " + CHAIN_BLOCKS[CHAIN_BLOCKS.findIndex(b => b.id === block.id) - 1].label + " — the grip holds.";
          card.classList.add("matched");
          btn.remove();
          check3(block.id);
        });
        card.appendChild(btn);
      }
      host.appendChild(card);
    });
  })();

  /* ═══ D4: be the villain — tamper block 3, watch the grip fail ═══
     Signature interaction. Block 3's own fingerprint recalculates live on
     edit; block 4's *stored* copy of the old fingerprint never moves, so
     the comparison is what actually gets flagged. Block 5 is flagged too,
     purely because it grips block 4 the same way — nothing about block 5
     is touched, which is the cascade the plan asks for. */
  (function () {
    const host = $("#chain4");
    const cardEls = {}, fpEls = {}, txEls = {}, gripEls = {};

    CHAIN_BLOCKS.forEach((block, i) => {
      const card = document.createElement("div");
      card.className = "mc-block matched";
      const head = document.createElement("div");
      head.className = "mc-block-head";
      head.innerHTML = '<span class="mc-block-label">' + block.label + '</span><span class="mc-block-fp">' + block.fp + "</span>";
      const tx = document.createElement("p");
      tx.className = "mc-block-tx"; tx.textContent = block.tx;
      const grip = document.createElement("p");
      grip.className = "mc-block-grip";
      grip.textContent = block.prevFp === null
        ? "The very first block — nothing before it to grip."
        : "Stores a copy of the previous block's fingerprint: " + block.prevFp + ". Matches — the grip holds.";
      card.appendChild(head); card.appendChild(tx); card.appendChild(grip);
      host.appendChild(card);
      cardEls[block.id] = card;
      fpEls[block.id] = $(".mc-block-fp", head);
      txEls[block.id] = tx;
      gripEls[block.id] = grip;
    });

    const block3 = CHAIN_BLOCKS.find(b => b.id === "block3");

    $("#tamperBtn4").addEventListener("click", () => {
      txEls.block3.textContent = block3.tamperedTx;
      fpEls.block3.textContent = block3.tamperedFp;
      cardEls.block3.classList.remove("matched");
      cardEls.block3.classList.add("edited");
      gripEls.block3.textContent = "Edited. Its fingerprint just recalculated from 8D4E-11A0's grip plus its own new contents — old fingerprint C71B-5602, new fingerprint " + block3.tamperedFp + ".";
      const r = cardEls.block3.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      $("#tamperBtn4").hidden = true;
      $("#revealBtn4").hidden = false;
    });

    $("#revealBtn4").addEventListener("click", () => {
      cardEls.block4.classList.remove("matched");
      cardEls.block4.classList.add("flagged");
      gripEls.block4.textContent = "Stores a copy of block 3's old fingerprint, C71B-5602 — but block 3's fingerprint is now " + block3.tamperedFp + ". They no longer match. Block 4's grip on block 3 has failed.";

      cardEls.block5.classList.remove("matched");
      cardEls.block5.classList.add("flagged");
      gripEls.block5.textContent = "Nothing about block 5 was touched — but it grips block 4 the exact same way block 4 grips block 3. Once block 4 stops verifying, everything gripped onto it stops verifying too.";

      $("#cascadeNote4").textContent = "One edit, two blocks flagged, without a single change made to either of them directly. This is the cascade — each block's trustworthiness depends on the trustworthiness of everything gripped before it.";

      const others = $("#othersPanel4");
      others.hidden = false;
      others.innerHTML = "";
      const mine = document.createElement("div");
      mine.className = "mc-copy edited";
      mine.innerHTML = '<p class="mc-copy-title">Your copy — block 3</p><p class="mc-copy-line">' + block3.tamperedTx + "</p>";
      const theirs = document.createElement("div");
      theirs.className = "mc-copy matched";
      theirs.innerHTML = '<p class="mc-copy-title">Everyone else\'s copy — block 3</p><p class="mc-copy-line">' + block3.tx + "</p>";
      others.appendChild(mine); others.appendChild(theirs);

      $("#revealBtn4").hidden = true;
      awardStar("d4", "You tampered with block 3, and its grip on the rest of the chain failed immediately — no red cross, no alarm, just a stored fingerprint that stopped matching, cascading to every block gripped after it, while every other copy out there calmly kept disagreeing with yours.");
    });
  })();

  /* ═══ D5: sort it out — fact vs hype about digital currency ═══ */
  makeBinSorter({
    pool: $("#pool5"),
    binsContainer: $("#bins5"),
    status: $("#status5"),
    items: [
      { id: "onlyCurrency", label: "Blockchain was invented only for digital currency, and nothing else can ever use it.", ans: "Hype" },
      { id: "onlyElectronic", label: "A digital currency only ever exists electronically — there's no coin or note behind it.", ans: "Fact" },
      { id: "rewriteUnnoticed", label: "Once a block's been added, quietly editing an old transaction rewrites history with nobody able to tell.", ans: "Hype" },
      { id: "fingerprintVsLock", label: "A block's fingerprint checks whether its contents have changed — it isn't the same thing as locking a message so only one person can read it.", ans: "Fact" },
      { id: "manyCopies", label: "Because so many independent copies of the chain exist, one tampered copy stands out instead of quietly becoming the new truth.", ans: "Fact" },
      { id: "noOrgAtAll", label: "Every digital currency runs with absolutely no organisation of any kind ever involved.", ans: "Hype" }
    ],
    bins: [
      { key: "Fact", label: "Fact — matches what you built" },
      { key: "Hype", label: "Hype — doesn't survive contact with it" }
    ],
    doneStatus: "All six sorted — fact from hype, exactly the distinction that matters most once the talk starts.",
    wrongMsg: "Not that pile — ask yourself: does this match something you actually watched happen, or does it contradict it?",
    onDone: () => awardStar("d5", "Six claims sorted, fact from hype — you now know the difference between what a blockchain actually does and what people say it does.")
  });
