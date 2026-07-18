
  /* ================= Module 24 — Gatekeepers =================
   Signature interaction: a checkpoint gate that data queues up to enter —
   equip it with checks (D1), watch it work a real queue (D2), find the one
   thing it can never catch (D3), then switch sides and craft test data to
   probe someone else's gate (D4). D5 revisits Module 14's own barcode and
   names the check digit as the sixth item on the same validation list.
   No shared kit covers a meaning-matching board, a predict-then-reveal
   queue, or a probe-and-classify board, so all three are hand-rolled here,
   same choice Module 23 made for its wall/loop engine and reassembly board
   (rule of two). D5 reuses the exact barcode and check-digit arithmetic
   from Module 14 so the "reprise" is genuinely the same object, not a
   look-alike. Runs inside the shared engine IIFE, so $, $$, awardStar,
   toast, sparks, makeChips and reduceMotion are all in scope. */

  function mkBtn(cls, label) {
    const b = document.createElement("button");
    b.type = "button"; b.className = cls; b.textContent = label;
    return b;
  }

  /* ═══ D1: equip the gate — meaning-matching board ═══ */
  (function () {
    const CHECKS = [
      { check: "Presence check", catches: "A required box was left completely empty — like a name field with nothing typed into it." },
      { check: "Type check", catches: "The value is the wrong kind of data — like the word “twelve” typed where a whole number is expected." },
      { check: "Range check", catches: "The value is outside the allowed range — like an age of 150 when the rule says 0 to 120." },
      { check: "Length check", catches: "The value has the wrong number of characters — like a 3-digit PIN when the rule says exactly 4." },
      { check: "Format check", catches: "The value doesn't follow a required pattern — like an email address with no @ symbol." }
    ];
    const slotsEl = $("#gtSlots1"), bankEl = $("#gtBank1"), statusEl = $("#status1");
    let selChip = null, selSlot = null, pairsDone = 0;

    CHECKS.forEach((row, i) => {
      const slot = document.createElement("button");
      slot.type = "button"; slot.className = "gt-slot"; slot.dataset.line = String(i);
      slot.innerHTML = '<div class="gt-slot-num">' + row.check + '</div><div class="gt-hint">tap or drop the description that goes here</div>';
      slot.addEventListener("click", () => selectSlot(slot));
      slotsEl.appendChild(slot);
    });

    const order = CHECKS.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1));
      const t = order[i]; order[i] = order[k]; order[k] = t;
    }
    order.forEach(idx => {
      const c = document.createElement("button");
      c.type = "button"; c.className = "gt-chip"; c.dataset.eng = String(idx);
      c.textContent = CHECKS[idx].catches;
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
        const hint = $(".gt-hint", slot);
        hint.className = "gt-hint gt-hint-filled";
        hint.textContent = "✓ " + CHECKS[eng].catches;
        slot.classList.add("filled");
        chip.classList.add("used");
        const r = slot.getBoundingClientRect();
        sparks(r.left + r.width / 2, r.top);
        clearSel();
        pairsDone++;
        if (pairsDone === CHECKS.length) {
          statusEl.textContent = "All five checks matched to what they catch — that's the gate's full basic checklist.";
          awardStar("d1", "Five checks, five completely different questions — presence, type, range, length and format never overlap in what they catch.");
        } else {
          statusEl.textContent = "That one's matched. " + (CHECKS.length - pairsDone) + " to go.";
        }
      } else {
        statusEl.textContent = "Not that one yet — that description belongs to a different check. Have another look at exactly what it's describing.";
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
        ghost.classList.add("gt-ghost"); ghost.classList.remove("sel");
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
      const slot = el && el.closest ? el.closest(".gt-slot") : null;
      return slot && !slot.classList.contains("filled") ? slot : null;
    }
    function markDrop(slot) {
      $$(".gt-slot.drop-ok", slotsEl).forEach(s => { if (s !== slot) s.classList.remove("drop-ok"); });
      if (slot) slot.classList.add("drop-ok");
    }
  })();

  /* ═══ D2: release the queue — predict, then look ═══ */
  (function () {
    const QUEUE = [
      { display: "(left blank)", raw: "", admit: false, reason: "Presence check holds it — the Age field was left blank." },
      { display: "twelve", raw: "twelve", admit: false, reason: "Type check holds it — “twelve” is text, not a whole number." },
      { display: "−5", raw: "-5", admit: false, reason: "Range check holds it — Age must be 0 to 120, and −5 is below the minimum." },
      { display: "45", raw: "45", admit: true, reason: "Presence, Type and Range all pass — admitted." },
      { display: "150", raw: "150", admit: false, reason: "Range check holds it — Age must be 0 to 120, and 150 is above the maximum." },
      { display: "0", raw: "0", admit: true, reason: "Presence, Type and Range all pass — 0 sits inside “0 to 120 inclusive”, so it's admitted." }
    ];
    const codeEl = $("#code2"), queueEl = $("#queue2"), valEl = $("#queueVal2"), posEl = $("#queuePos2");
    const predictRow = $("#predictRow2"), nextRow = $("#nextRow2"), statusEl = $("#status2");
    let idx = 0;
    const badges = [];

    codeEl.innerHTML =
      '<div class="pcline">DECLARE Age : INTEGER</div>' +
      '<div class="pcline">DECLARE Valid : BOOLEAN</div>' +
      '<div class="pcline"><span class="kw">INPUT</span> Age</div>' +
      '<div class="pcline"><span class="kw">IF</span> Age &gt;= 0 <span class="kw">AND</span> Age &lt;= 120</div>' +
      '<div class="pcline">  <span class="kw">THEN</span></div>' +
      '<div class="pcline">    Valid <span class="arrow">←</span> <span class="kw">TRUE</span></div>' +
      '<div class="pcline">  <span class="kw">ELSE</span></div>' +
      '<div class="pcline">    Valid <span class="arrow">←</span> <span class="kw">FALSE</span></div>' +
      '<div class="pcline"><span class="kw">ENDIF</span></div>';

    QUEUE.forEach((_, i) => {
      const b = document.createElement("span");
      b.className = "gt-badge";
      b.textContent = String(i + 1);
      queueEl.appendChild(b);
      badges.push(b);
    });

    function renderBadges() {
      badges.forEach((b, i) => {
        b.classList.toggle("gt-badge-cur", i === idx);
      });
    }

    function renderItem() {
      const item = QUEUE[idx];
      posEl.textContent = String(idx + 1);
      valEl.textContent = item.display;
      renderBadges();
      predictRow.innerHTML = "";
      nextRow.innerHTML = "";
      statusEl.textContent = "";
      const admitBtn = mkBtn("predict-btn", "My call: Admit");
      const holdBtn = mkBtn("predict-btn", "My call: Hold");
      predictRow.appendChild(admitBtn);
      predictRow.appendChild(holdBtn);
      function choose(btn, otherBtn) {
        btn.classList.add("sel");
        admitBtn.disabled = true; holdBtn.disabled = true;
        statusEl.textContent = item.admit
          ? "The gate opens — " + item.reason
          : "The gate holds this one — " + item.reason;
        badges[idx].classList.add(item.admit ? "gt-badge-admit" : "gt-badge-hold");
        const nextBtn = mkBtn("loop-btn primary", idx === QUEUE.length - 1 ? "Finish the queue" : "Next entry ▸");
        nextRow.appendChild(nextBtn);
        nextBtn.addEventListener("click", () => {
          if (idx === QUEUE.length - 1) {
            renderBadges();
            statusEl.textContent = "All six entries through the gate — three held, three admitted, every one for a reason you could name.";
            awardStar("d2", "You called each entry before looking, then watched Presence, Type and Range fire in order — exactly the sequence in the pseudocode above.");
            predictRow.innerHTML = ""; nextRow.innerHTML = "";
          } else {
            idx++;
            renderItem();
          }
        });
      }
      admitBtn.addEventListener("click", () => choose(admitBtn, holdBtn));
      holdBtn.addEventListener("click", () => choose(holdBtn, admitBtn));
    }
    renderItem();
  })();

  /* ═══ D3: valid ≠ true — passes every check, still wrong ═══ */
  (function () {
    const validateBtn = $("#validateBtn3"), meetBtn = $("#meetBtn3");
    const status3a = $("#status3a"), status3b = $("#status3b");
    const verifyIntro = $("#verifyIntro3"), verifyRow = $("#verifyRow3"), chipsLabel = $("#chipsLabel3");

    const chips3 = makeChips($("#chips3"), ["doubleEntry", "visualCheck"],
      () => awardStar("d3", "Validation checked the shape of the data against a rule, and every check passed — but nothing on the gate's checklist could ever compare that data to reality. Verification is the job that closes that gap."),
      k => (k === "doubleEntry" ? "Saw how double entry helps" : "Saw how a visual check helps"),
      (label, remaining) => label + " — " + remaining + " more to see.");

    validateBtn.addEventListener("click", () => {
      status3a.textContent = "Presence check: something was typed — passes. Type check: 21 is a whole number — passes. Range check: 21 sits inside 0 to 120 — passes. Every check on the gate's list passes. Admitted.";
      meetBtn.style.display = "";
      validateBtn.disabled = true;
    });

    meetBtn.addEventListener("click", () => {
      status3b.textContent = "Meet the person who typed it: she's 12, not 21. Nothing about the number 21 is invalid — it's simply untrue, and the gate had no way to know, because validation only ever checks a value's shape against a rule, never a value's truth against reality.";
      meetBtn.disabled = true;
      verifyIntro.style.display = "";
      verifyRow.style.display = "";
      chipsLabel.style.display = "";
      const doubleBtn = mkBtn("loop-btn ghost", "See how double entry would have caught it");
      const visualBtn = mkBtn("loop-btn ghost", "See how a visual check would have caught it");
      verifyRow.appendChild(doubleBtn);
      verifyRow.appendChild(visualBtn);
      const note = document.createElement("p");
      note.className = "op-status";
      note.style.textAlign = "left";
      note.style.minHeight = "0";
      verifyRow.parentNode.insertBefore(note, verifyRow.nextSibling);
      doubleBtn.addEventListener("click", () => {
        note.textContent = (note.textContent ? note.textContent + " " : "") + "Double entry: the same field gets typed twice, by two different people, or the same person twice. “21” typed once and “12” typed the second time wouldn't match — the mismatch itself is the flag, with no need for either entry to be independently proven true.";
        chips3("doubleEntry");
        doubleBtn.disabled = true;
      });
      visualBtn.addEventListener("click", () => {
        note.textContent = (note.textContent ? note.textContent + " " : "") + "Visual check: a human simply looks at the entered value next to its real source — the actual birth certificate, in this case — and 21 sitting beside a document that clearly says 12 is something a person would catch on sight.";
        chips3("visualCheck");
        visualBtn.disabled = true;
      });
    });
  })();

  /* ═══ D4: the saboteur's kit — craft normal/extreme/boundary/abnormal ═══ */
  (function () {
    const input = $("#probeInput4"), probeBtn = $("#probeBtn4"), statusEl = $("#status4");

    const chips4 = makeChips($("#chips4"), ["normal", "extreme", "boundary", "abnormal"],
      () => awardStar("d4", "All four lit — normal, extreme, boundary and abnormal are four genuinely different jobs a piece of test data can do, not four names for the same thing."),
      k => ({ normal: "Normal", extreme: "Extreme", boundary: "Boundary", abnormal: "Abnormal" }[k]),
      (label, remaining) => label + " data, crafted — " + remaining + " more category to find.");

    function classify(raw) {
      const t = raw.trim();
      const isInt = /^-?\d+$/.test(t);
      if (!isInt) return "abnormal";
      const n = Number(t);
      if (n === 1 || n === 100) return "extreme";
      if (n === 0 || n === 101) return "boundary";
      if (n >= 2 && n <= 99) return "normal";
      return "abnormal";
    }
    const MESSAGE = {
      normal: v => "“" + v + "” is valid, and comfortably inside 1–100, nowhere near either edge — that's normal data.",
      extreme: v => "“" + v + "” is valid, sitting exactly on the edge of 1–100 — that's extreme data.",
      boundary: v => "“" + v + "” is invalid, exactly one step past an edge — that's boundary data, the first value the gate has to reject.",
      abnormal: v => "“" + v + "” is invalid, and not because of where it sits near an edge — that's abnormal data."
    };
    probeBtn.addEventListener("click", () => {
      const raw = input.value;
      if (raw.trim() === "") { statusEl.textContent = "Type a probe value first — a number, or anything else you fancy trying."; return; }
      const cat = classify(raw);
      statusEl.textContent = MESSAGE[cat](raw.trim());
      chips4(cat);
    });
  })();

  /* ═══ D5: the sixth check, revisited — Module 14's barcode, reused exactly ═══ */
  (function () {
    const BASE12 = [4, 0, 0, 6, 3, 8, 1, 0, 1, 2, 1, 9];
    function computeCheckDigit(digits) {
      let sumOdd = 0, sumEven = 0;
      digits.forEach((d, i) => {
        const pos = i + 1;
        if (pos % 2 === 1) sumOdd += d; else sumEven += d;
      });
      const total = sumOdd + sumEven * 3;
      return (10 - (total % 10)) % 10;
    }
    const CHECK_DIGIT = computeCheckDigit(BASE12);
    let current = BASE12.slice();
    const barcodeMount = $("#barcodeDigits5"), checkStatus = $("#checkStatus5");

    const chips5 = makeChips($("#chips5"), ["early", "late"],
      () => awardStar("d5", "Both ends of the number tested, and the check digit caught every single change — the one check on the gate's list that never once looks at what a number means."),
      k => (k === "early" ? "an early digit" : "a later digit"),
      (label, remaining) => "Tried corrupting " + label + ". " + remaining + " more to try.");

    function updateStatus() {
      const computed = computeCheckDigit(current);
      const match = computed === CHECK_DIGIT;
      checkStatus.textContent = "Computed from the 12 digits: " + computed + " — " + (match
        ? "matches the printed check digit (" + CHECK_DIGIT + "). The gate has nothing to say here."
        : "does NOT match the printed check digit (" + CHECK_DIGIT + "). The gate reports this instantly.");
      return { computed, match };
    }
    function buildBarcode() {
      barcodeMount.innerHTML = "";
      for (let i = 0; i < 12; i++) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "barcode-digit"; b.textContent = String(current[i]);
        b.setAttribute("aria-label", "digit " + (i + 1) + " of 12, currently " + current[i] + ", tap to change");
        b.addEventListener("click", () => {
          current[i] = (current[i] + 1) % 10;
          b.textContent = String(current[i]);
          b.classList.toggle("changed", current[i] !== BASE12[i]);
          b.setAttribute("aria-label", "digit " + (i + 1) + " of 12, currently " + current[i] + ", tap to change");
          const { match } = updateStatus();
          if (!match) chips5(i < 6 ? "early" : "late");
        });
        barcodeMount.appendChild(b);
      }
      const checkEl = document.createElement("span");
      checkEl.className = "barcode-digit check"; checkEl.textContent = String(CHECK_DIGIT);
      checkEl.setAttribute("aria-label", "check digit, currently " + CHECK_DIGIT + ", not editable");
      barcodeMount.appendChild(checkEl);
    }
    buildBarcode();
    updateStatus();
    $("#resetBtn5").addEventListener("click", () => {
      current = BASE12.slice();
      buildBarcode();
      updateStatus();
    });
  })();
