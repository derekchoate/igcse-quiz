/* ================= Module 14 — Did It Arrive Intact? =================
   Signature interaction: a noisy wire — a byte races down a serial and a
   parallel cable while a distance slider introduces skew (D1); a nine-bulb
   board (eight fixed data bulbs + one learner-controlled parity bulb) sends
   down a wire where a "gremlin" flips exactly one bulb (D3) or exactly two
   (D4), and the receiver's recount either catches the damage or is fooled by
   it. D2's duplex sort and D5's ARQ exchange are hand-rolled (mirroring
   Module 13's D1/D5 dual tap+drag pattern): the shared `matcher` kit hardcodes
   awardStar("d3", ...) with Module 9's pseudocode-pairing wording, so it isn't
   safely reusable here — this module even has its OWN #d3 (the parity trick),
   which would make that mismatch actively wrong rather than just unhelpful.
   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar, makeBoard and makeChips are all in scope. */

  const VALUES8 = [128, 64, 32, 16, 8, 4, 2, 1];
  function toBits(n) { return VALUES8.map(v => (n & v) ? 1 : 0); }
  function bitsToValue(bits) { return bits.reduce((s, b, i) => s + (b ? VALUES8[i] : 0), 0); }

  /* ═══ D1: one lane or eight — serial vs parallel race ═══ */
  const BYTE1 = toBits(19); // [0,0,0,1,0,0,1,1]
  const distanceSlider1 = $("#distanceSlider1"), distanceVal1 = $("#distanceVal1");
  const sendBtn1 = $("#sendBtn1"), serialLane1 = $("#serialLane1"), parallelLane1 = $("#parallelLane1");
  const serialResult1 = $("#serialResult1"), parallelResult1 = $("#parallelResult1");
  let sending1 = false;

  function distanceLabel1(v) {
    if (v <= 20) return "a short desk cable";
    if (v >= 80) return "across a whole building";
    return "across a room or two";
  }
  distanceSlider1.addEventListener("input", () => { distanceVal1.textContent = distanceLabel1(Number(distanceSlider1.value)); });

  function buildLane1(el, n) {
    el.innerHTML = "";
    const bulbs = [];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "tx-bulb";
      s.setAttribute("aria-hidden", "true");
      el.appendChild(s);
      bulbs.push(s);
    }
    return bulbs;
  }

  const check1 = makeChips($("#chips1"), ["short", "long"],
    () => awardStar("d1", "Short and long cables both sent — and only one of the two carriers minded the distance."),
    k => (k === "short" ? "a short cable" : "a long cable"),
    (label, remaining) => "Sent over " + label + ". " + remaining + " more to try.");

  sendBtn1.addEventListener("click", () => {
    if (sending1) return;
    sending1 = true;
    const distance = Number(distanceSlider1.value);
    const corrupt = distance >= 80;
    check1(distance <= 20 ? "short" : (corrupt ? "long" : null));

    const serialBulbs = buildLane1(serialLane1, BYTE1.length);
    const parallelBulbs = buildLane1(parallelLane1, BYTE1.length);
    serialResult1.textContent = "Received: —";
    parallelResult1.textContent = "Received: —";

    BYTE1.forEach((b, i) => {
      const delay = reduceMotion ? 0 : (i + 1) * 180;
      setTimeout(() => {
        if (b) serialBulbs[i].classList.add("on");
        if (i === BYTE1.length - 1) {
          serialResult1.textContent = "Received: " + BYTE1.join("") + " = 19 — correct, as always.";
        }
      }, delay);
    });

    const parallelBits = BYTE1.slice();
    if (corrupt) parallelBits[2] = 1; // the "32" wire disagrees over distance
    const pDelay = reduceMotion ? 0 : 300;
    setTimeout(() => {
      parallelBits.forEach((b, i) => { if (b) parallelBulbs[i].classList.add("on"); });
      const value = bitsToValue(parallelBits);
      parallelResult1.textContent = corrupt
        ? "Received: " + parallelBits.join("") + " = " + value + " — not 19 any more. The wires didn't quite agree over that distance."
        : "Received: " + parallelBits.join("") + " = 19 — also correct. Over this short a distance, the wires had no trouble agreeing.";
      sending1 = false;
    }, pDelay);
  });

  /* ═══ D2: walkie-talkie, corridor, phone call — sort into duplex modes ═══
     Hand-rolled dual tap+drag path (pointer events, document-bound), mirroring
     Module 13's D1/D5 — a 6-into-3 shape the `matcher` kit doesn't fit. */
  const LINKS2 = [
    { id: "l1", label: "A radio station broadcasting to your car radio", ans: "Simplex" },
    { id: "l2", label: "A CCTV camera sending video to a security office, with nothing sent back to the camera", ans: "Simplex" },
    { id: "l3", label: "Two hikers talking on walkie-talkies", ans: "Half-duplex" },
    { id: "l4", label: "A corridor too narrow for two people to pass, so people go one direction, then the other", ans: "Half-duplex" },
    { id: "l5", label: "A phone call, where both people can talk and listen at the same time", ans: "Full-duplex" },
    { id: "l6", label: "Home Wi-Fi uploading a photo while still downloading a video, at the same time", ans: "Full-duplex" }
  ];
  const linkEls2 = {}, binEls2 = {};
  let selectedLink2 = null, placed2 = 0;
  const pool2 = $("#linkPool2"), status2 = $("#status2");

  function selectLink2(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedLink2 === id) {
      btn.classList.remove("sel"); selectedLink2 = null;
      status2.textContent = "Tap a scenario to begin.";
      return;
    }
    $$(".link-chip", pool2).forEach(c => c.classList.remove("sel"));
    selectedLink2 = id; btn.classList.add("sel");
    status2.textContent = "Now tap the bin you think this belongs in.";
  }
  function tryPlaceLink2(key) {
    if (!selectedLink2) return;
    const item = LINKS2.find(x => x.id === selectedLink2);
    const btn = linkEls2[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      const line = document.createElement("div"); line.className = "dupe-bin-item"; line.textContent = item.label;
      binEls2[key].list.appendChild(line);
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed2++; selectedLink2 = null;
      if (placed2 === LINKS2.length) {
        status2.textContent = "All six sorted — simplex, half-duplex, full-duplex, every one in its place.";
        awardStar("d2", "Six real links, sorted by which directions they let data flow — never by how many wires were involved.");
      } else {
        status2.textContent = "That's the one. " + (LINKS2.length - placed2) + " more to go.";
      }
    } else {
      toast("Not that bin — ask again: can this go both ways, and if so, at the same moment or by taking turns?");
      btn.classList.remove("sel"); selectedLink2 = null;
      status2.textContent = "Tap a scenario to try again.";
    }
  }
  function binUnder2(e) {
    if (dragGhost2) dragGhost2.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost2) dragGhost2.style.visibility = "";
    const bin = el && el.closest ? el.closest(".dupe-bin") : null;
    if (!bin) return null;
    for (const k in binEls2) { if (binEls2[k].wrap === bin) return k; }
    return null;
  }
  function markHover2(key) {
    Object.keys(binEls2).forEach(k => binEls2[k].wrap.classList.toggle("drop-ok", k === key));
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
    const btn = linkEls2[dragId2];
    if (!dragging2) {
      if (Math.hypot(e.clientX - dragStartX2, e.clientY - dragStartY2) < 6) return;
      dragging2 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX2 = dragStartX2 - rect.left; dragOffY2 = dragStartY2 - rect.top;
      dragGhost2 = btn.cloneNode(true);
      dragGhost2.classList.add("link-ghost"); dragGhost2.classList.remove("sel");
      dragGhost2.style.width = rect.width + "px";
      document.body.appendChild(dragGhost2);
      btn.classList.add("dragging");
      $$(".link-chip", pool2).forEach(c => c.classList.remove("sel"));
      selectedLink2 = null;
    }
    e.preventDefault();
    dragGhost2.style.left = (e.clientX - dragOffX2) + "px";
    dragGhost2.style.top = (e.clientY - dragOffY2) + "px";
    markHover2(binUnder2(e));
  }
  function dragEnd2(e) {
    if (dragId2 === null || e.pointerId !== dragPtrId2) return;
    const id = dragId2, btn = linkEls2[id];
    document.removeEventListener("pointermove", dragMove2);
    document.removeEventListener("pointerup", dragEnd2);
    document.removeEventListener("pointercancel", dragEnd2);
    if (dragging2) {
      const key = binUnder2(e);
      markHover2(null);
      if (dragGhost2) { dragGhost2.remove(); dragGhost2 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedLink2 = id; tryPlaceLink2(key); }
    } else if (e.type !== "pointercancel") {
      selectLink2(id, btn);
    }
    dragId2 = null; dragging2 = false; dragPtrId2 = null;
  }
  function buildLinkChip2(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "link-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging2) selectLink2(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart2(e, item.id, b));
    linkEls2[item.id] = b;
    return b;
  }
  function buildDupeBin2(key) {
    const wrap = document.createElement("div"); wrap.className = "dupe-bin";
    const head = document.createElement("button");
    head.type = "button"; head.className = "dupe-bin-head"; head.textContent = key;
    head.addEventListener("click", () => tryPlaceLink2(key));
    const list = document.createElement("div"); list.className = "dupe-bin-list"; list.setAttribute("aria-live", "polite");
    wrap.appendChild(head); wrap.appendChild(list);
    binEls2[key] = { wrap, list, head };
    return wrap;
  }
  ["Simplex", "Half-duplex", "Full-duplex"].forEach(key => $("#dupeBins2").appendChild(buildDupeBin2(key)));
  LINKS2.forEach(item => pool2.appendChild(buildLinkChip2(item)));

  /* ═══ D3/D4: the parity trick, and the gremlin flips two ═══
     Eight fixed (non-interactive) data bulbs carry 19; the ninth is a real
     switch built with the shared board kit. Both discoveries share this
     shape — only the number of bulbs the gremlin flips differs (1 vs 2). */
  function buildDataRow(el, bits) {
    el.innerHTML = "";
    bits.forEach(b => {
      const s = document.createElement("span");
      s.className = "data-bulb" + (b ? " on" : "");
      s.setAttribute("aria-hidden", "true");
      el.appendChild(s);
    });
  }
  function setUpParity(n) {
    const dataBits = toBits(19);
    buildDataRow($("#dataRow" + n), dataBits);
    const statusEl = $("#parityStatus" + n), sendBtn = $("#sendBtn" + n);
    let parityOn = false;
    function refresh() {
      const total = dataBits.filter(Boolean).length + (parityOn ? 1 : 0);
      const even = total % 2 === 0;
      statusEl.textContent = total + " of 9 lit — " + (even ? "even." : "odd. Toggle the parity bulb.");
      sendBtn.hidden = !even;
    }
    const parityBoard = makeBoard($("#parityRow" + n), [1], t => { parityOn = t > 0; refresh(); });
    const parityBtn = $(".bit", $("#parityRow" + n));
    if (parityBtn) parityBtn.setAttribute("aria-label", "parity bulb");
    refresh();
    return { dataBits, get parityOn() { return parityOn; } };
  }

  const d3state = setUpParity(3);
  $("#sendBtn3").addEventListener("click", () => {
    const totalBefore = d3state.dataBits.filter(Boolean).length + 1; // always 4 — button only shows once even
    const received = totalBefore - 1; // the gremlin flips exactly one bulb: the parity bulb itself, off
    $("#result3").textContent = "The receiver counts " + received + " bulbs lit — odd. Sender and receiver agreed the count should always be even, so that mismatch is the catch: something changed in transit.";
    awardStar("d3", "One flipped bulb, caught cleanly — the receiver noticed the instant the count stopped being even.");
  });

  const d4state = setUpParity(4);
  $("#sendBtn4").addEventListener("click", () => {
    const totalBefore = d4state.dataBits.filter(Boolean).length + 1; // always 4
    const received = totalBefore; // one data bulb flips on, the parity bulb flips off — no net change
    $("#result4").textContent = "The receiver counts " + received + " bulbs lit — still even, exactly what was expected. Nothing looks wrong, even though two bulbs genuinely changed along the way. Parity only ever catches an odd number of flips — that's exactly why real systems also use checksums, a second and different kind of total, to catch some of what a single parity bulb misses.";
    awardStar("d4", "You found parity's real limit yourself: two flips cancel each other out, and the receiver has no way to tell.");
  });

  /* ═══ D5: ask again — ARQ played out three ways ═══ */
  const arqLog5 = $("#arqLog5");
  const ARQ_SEQ = {
    "clean": [
      { text: "Sender: sending the message.", cls: "sender" },
      { text: "Receiver: checking it… all correct.", cls: "receiver" },
      { text: "Receiver: sending back a positive acknowledgement (ACK).", cls: "receiver" },
      { text: "Sender: acknowledgement received. Done in one round trip.", cls: "sender" }
    ],
    "damaged": [
      { text: "Sender: sending the message.", cls: "sender" },
      { text: "Receiver: checking it… an error's there.", cls: "receiver" },
      { text: "Receiver: sending back a negative acknowledgement (NAK).", cls: "receiver" },
      { text: "Sender: NAK received — resending.", cls: "sender" },
      { text: "Receiver: checking it again… all correct this time.", cls: "receiver" },
      { text: "Receiver: sending back a positive acknowledgement (ACK).", cls: "receiver" },
      { text: "Sender: acknowledgement received. Done.", cls: "sender" }
    ],
    "lost-ack": [
      { text: "Sender: sending the message.", cls: "sender" },
      { text: "Receiver: checking it… all correct.", cls: "receiver" },
      { text: "Receiver: sending back a positive acknowledgement (ACK)…", cls: "receiver" },
      { text: "…the acknowledgement never arrives.", cls: "receiver" },
      { text: "Sender: no reply within the time limit — a timeout. Resending, just in case.", cls: "sender" },
      { text: "Receiver: checking it again… still correct.", cls: "receiver" },
      { text: "Receiver: sending back a positive acknowledgement (ACK).", cls: "receiver" },
      { text: "Sender: acknowledgement received. Done.", cls: "sender" }
    ]
  };
  const check5 = makeChips($("#chips5"), ["clean", "damaged", "lost-ack"],
    () => awardStar("d5", "All three ways an exchange can go, played end to end — including the one where the message was fine all along and only the reply went missing."),
    k => (k === "clean" ? "delivered cleanly" : (k === "damaged" ? "damaged in transit" : "the lost acknowledgement")),
    (label, remaining) => "Played out " + label + ". " + remaining + " more to try.");

  function playArq5(key) {
    const seq = ARQ_SEQ[key];
    arqLog5.innerHTML = "";
    seq.forEach((step, i) => {
      const delay = reduceMotion ? 0 : i * 450;
      setTimeout(() => {
        const line = document.createElement("div");
        line.className = "arq-line " + step.cls;
        line.textContent = step.text;
        arqLog5.appendChild(line);
        if (i === seq.length - 1) check5(key);
      }, delay);
    });
  }
  $("#cleanBtn5").addEventListener("click", () => playArq5("clean"));
  $("#damagedBtn5").addEventListener("click", () => playArq5("damaged"));
  $("#lostAckBtn5").addEventListener("click", () => playArq5("lost-ack"));

  /* ═══ D6: the last digit isn't part of the number — corruptible barcode ═══ */
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
  const CHECK_DIGIT = computeCheckDigit(BASE12); // 5
  let current6 = BASE12.slice();
  const digitButtons6 = [];
  const barcodeMount6 = $("#barcodeDigits6"), checkStatus6 = $("#checkStatus6");
  const check6 = makeChips($("#chips6"), ["early", "late"],
    () => awardStar("d6", "Both ends of the number tested, and the check digit caught every single change — that's the trick behind every barcode and ISBN you'll ever scan."),
    k => (k === "early" ? "an early digit" : "a later digit"),
    (label, remaining) => "Tried corrupting " + label + ". " + remaining + " more to try.");

  function updateStatus6() {
    const computed = computeCheckDigit(current6);
    const match = computed === CHECK_DIGIT;
    checkStatus6.textContent = "Computed from the 12 digits: " + computed + " — " + (match
      ? "matches the printed check digit (" + CHECK_DIGIT + "). No error would be caught here."
      : "does NOT match the printed check digit (" + CHECK_DIGIT + "). A scanner would catch this instantly.");
    return { computed, match };
  }
  function buildBarcode6() {
    barcodeMount6.innerHTML = "";
    digitButtons6.length = 0;
    for (let i = 0; i < 12; i++) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "barcode-digit"; b.textContent = String(current6[i]);
      b.setAttribute("aria-label", "digit " + (i + 1) + " of 12, currently " + current6[i] + ", tap to change");
      b.addEventListener("click", () => {
        current6[i] = (current6[i] + 1) % 10;
        b.textContent = String(current6[i]);
        b.classList.toggle("changed", current6[i] !== BASE12[i]);
        b.setAttribute("aria-label", "digit " + (i + 1) + " of 12, currently " + current6[i] + ", tap to change");
        const { match } = updateStatus6();
        if (!match) check6(i < 6 ? "early" : "late");
      });
      barcodeMount6.appendChild(b);
      digitButtons6.push(b);
    }
    const checkEl = document.createElement("span");
    checkEl.className = "barcode-digit check"; checkEl.textContent = String(CHECK_DIGIT);
    checkEl.setAttribute("aria-label", "check digit, currently " + CHECK_DIGIT + ", not editable");
    barcodeMount6.appendChild(checkEl);
  }
  buildBarcode6();
  updateStatus6();
  $("#resetBtn6").addEventListener("click", () => {
    current6 = BASE12.slice();
    digitButtons6.forEach((b, i) => {
      b.textContent = String(current6[i]);
      b.classList.remove("changed");
      b.setAttribute("aria-label", "digit " + (i + 1) + " of 12, currently " + current6[i] + ", tap to change");
    });
    updateStatus6();
  });
