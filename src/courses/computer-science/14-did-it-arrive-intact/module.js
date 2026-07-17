/* ================= Module 14 — Did It Arrive Intact? =================
   Signature interaction: a noisy wire — a byte races down a serial and a
   parallel cable while a distance slider introduces skew (D1); a nine-bulb
   board (eight fixed data bulbs + a parity bulb the learner calculates,
   never toggles by hand) sends down a wire where a "gremlin" flips exactly
   one data bulb (D3) or exactly two (D4), and the receiver's recount either
   catches the damage or is fooled by it. D2's duplex sort and D5's ARQ
   exchange are hand-rolled (mirroring Module 13's D1/D5 dual tap+drag
   pattern): the shared `matcher` kit hardcodes awardStar("d3", ...) with
   Module 9's pseudocode-pairing wording, so it isn't safely reusable here —
   this module even has its OWN #d3 (the parity trick), which would make
   that mismatch actively wrong rather than just unhelpful.
   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. */

  const VALUES8 = [128, 64, 32, 16, 8, 4, 2, 1];
  function toBits(n) { return VALUES8.map(v => (n & v) ? 1 : 0); }
  function bitsToValue(bits) { return bits.reduce((s, b, i) => s + (b ? VALUES8[i] : 0), 0); }
  // Bit position, counted from the right (the LSB is position 1) — not send
  // order. dataBits[i] here always runs MSB-first (index 0 = 128s), so the
  // rightmost/least-significant bit (index 7 of 8) is position 1.
  function bitPosition(i, dataLength) { return dataLength - i; }

  /* ═══ shared: SVG wire-map tokens — a labelled dot gliding along a
     straight path from sender to receiver (D1, D3, D4). Same
     getTotalLength/getPointAtLength + requestAnimationFrame technique as
     Module 13's route-map tokens (a <g> of circle+text moved via
     "transform", not a bare circle — carrying its bit-position number the
     whole glide, same as Module 13's "#N" packet tokens), wrapped in the
     same try/catch (JSDOM doesn't implement SVG geometry under test, so
     travelWireToken bails straight to its resting position there — the
     fallback also doubles as what reduceMotion users get: no glide, the dot
     just appears where it would have landed). This is a cosmetic layer only
     — the actual bulb-lighting / result-text logic below runs from
     travelWireToken's onDone, i.e. genuinely on arrival, not on departure. */
  const WIRE_SVG_NS = "http://www.w3.org/2000/svg";
  const WIRE_RECEIVER_X = 312;
  const WIRE_STAGGER_MS = 700, WIRE_GLIDE_MS = 600; // one wire, one bit at a time (D1 serial, D3/D4 parity)
  const PARALLEL_GLIDE_MS1 = 2200, PARALLEL_SKEW_MS1 = 3600; // all eight wires at once (D1 parallel)
  function buildWireToken(mount, x, y, lit, label) {
    const g = document.createElementNS(WIRE_SVG_NS, "g");
    g.setAttribute("class", "wire-token" + (lit ? " on" : ""));
    g.setAttribute("transform", "translate(" + x + "," + y + ")");
    const dot = document.createElementNS(WIRE_SVG_NS, "circle");
    dot.setAttribute("r", "8");
    const text = document.createElementNS(WIRE_SVG_NS, "text");
    text.setAttribute("y", "3");
    text.textContent = label;
    g.appendChild(dot); g.appendChild(text);
    mount.appendChild(g);
    return g;
  }
  function travelWireToken(token, wirePath, y, dur, onDone) {
    let len = 0;
    try { len = wirePath.getTotalLength(); }
    catch (e) { /* SVG geometry unsupported (e.g. jsdom under test) */ }
    if (reduceMotion || !len || typeof wirePath.getPointAtLength !== "function") {
      token.setAttribute("transform", "translate(" + WIRE_RECEIVER_X + "," + y + ")");
      onDone();
      return;
    }
    const t0 = performance.now();
    (function frame(now) {
      let t = (now - t0) / dur; if (t > 1) t = 1;
      const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
      const pt = wirePath.getPointAtLength(e * len);
      token.setAttribute("transform", "translate(" + pt.x + "," + pt.y + ")");
      if (t < 1) requestAnimationFrame(frame); else onDone();
    })(t0);
  }

  /* ═══ D1: one lane or eight — serial vs parallel race ═══ */
  const BYTE1 = toBits(19); // [0,0,0,1,0,0,1,1]
  const PARALLEL_ROW_Y1 = [14, 33, 52, 71, 90, 109, 128, 147];
  const distanceSlider1 = $("#distanceSlider1"), distanceVal1 = $("#distanceVal1");
  const sendBtn1 = $("#sendBtn1"), serialLane1 = $("#serialLane1"), parallelLane1 = $("#parallelLane1");
  const serialResult1 = $("#serialResult1"), parallelResult1 = $("#parallelResult1");
  const serialWire1 = $("#serialWire1"), serialTokens1 = $("#serialTokens1");
  const parallelWires1 = VALUES8.map((v, i) => $("#parallelWire1-" + i));
  const parallelTokens1 = $("#parallelTokens1"), parallelSampleLine1 = $("#parallelSampleLine1");
  let sending1 = false;

  function distanceLabel1(v) {
    if (v <= 20) return "a short desk cable";
    if (v >= 80) return "across a whole building";
    return "across a room or two";
  }
  distanceSlider1.addEventListener("input", () => { distanceVal1.textContent = distanceLabel1(Number(distanceSlider1.value)); });

  // Shared with D3/D4's receiver-side byte row below — same plain,
  // non-interactive bulb-building shape, just a different bulb class so
  // each board keeps the look already established for it (tx-bulb here,
  // data-bulb there). Every bulb starts "pending" (greyed out — not yet
  // received, deliberately distinct from a confirmed-off bulb) until the
  // caller clears it on arrival.
  function buildBulbRow(el, n, cls) {
    el.innerHTML = "";
    const bulbs = [];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = cls + " pending";
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

    const serialBulbs = buildBulbRow(serialLane1, BYTE1.length, "tx-bulb");
    const parallelBulbs = buildBulbRow(parallelLane1, BYTE1.length, "tx-bulb");
    serialResult1.textContent = "Received: —";
    parallelResult1.textContent = "Received: —";
    serialTokens1.innerHTML = "";
    parallelTokens1.innerHTML = "";
    parallelSampleLine1.classList.remove("active");

    // Each bulb compiles into the received byte the moment its own dot
    // actually arrives (travelWireToken's onDone), not the moment it
    // departs — the bulb row itself is the byte, so the result text only
    // ever states the decimal value, never spells the bits back out.
    let serialArrivals = 0;
    BYTE1.forEach((b, i) => {
      const delay = reduceMotion ? 0 : (i + 1) * WIRE_STAGGER_MS;
      setTimeout(() => {
        const token = buildWireToken(serialTokens1, 28, 28, !!b, String(bitPosition(i, BYTE1.length)));
        travelWireToken(token, serialWire1, 28, WIRE_GLIDE_MS, () => {
          token.classList.add("arrived");
          serialBulbs[i].classList.remove("pending");
          if (b) serialBulbs[i].classList.add("on");
          serialArrivals++;
          serialResult1.textContent = serialArrivals === BYTE1.length
            ? "Received: 19 — correct, as always."
            : "Receiving… (" + serialArrivals + " of " + BYTE1.length + " bulbs arrived)";
        });
      }, delay);
    });

    // All eight bits depart together, but the "16" wire — a lit bit — is
    // given a longer glide when corrupt, so at the sampling instant below
    // its dot is visibly still short of the receiver while the other seven
    // have landed. The receiver samples it anyway and reads it as off,
    // pulling the total down rather than up.
    BYTE1.forEach((b, i) => {
      const token = buildWireToken(parallelTokens1, 28, PARALLEL_ROW_Y1[i], !!b, String(bitPosition(i, BYTE1.length)));
      const dur = (corrupt && i === 3) ? PARALLEL_SKEW_MS1 : PARALLEL_GLIDE_MS1;
      travelWireToken(token, parallelWires1[i], PARALLEL_ROW_Y1[i], dur, () => { token.classList.add("arrived"); });
    });

    const parallelBits = BYTE1.slice();
    if (corrupt) parallelBits[3] = 0; // the "16" wire arrives late and reads back off
    const pDelay = reduceMotion ? 0 : PARALLEL_GLIDE_MS1;
    setTimeout(() => {
      parallelSampleLine1.classList.add("active");
      parallelBits.forEach((b, i) => {
        parallelBulbs[i].classList.remove("pending");
        if (b) parallelBulbs[i].classList.add("on");
      });
      const value = bitsToValue(parallelBits);
      parallelResult1.textContent = corrupt
        ? "Received: " + value + " — not 19 any more. The wires didn't quite agree over that distance."
        : "Received: 19 — also correct. Over this short a distance, the wires had no trouble agreeing.";
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
     Eight fixed (non-interactive) data bulbs carry 19, sitting in the same
     row as a ninth (parity) bulb held apart by extra gap and carrying no
     number of its own — on narrow screens the eight collapse into two
     stacked rows of four (a CSS grid, always exactly 4+4), with the parity
     bulb centred on that stack's vertical midpoint, a plain flex row's
     cross-axis default rather than a media-query rule of its own. The
     learner never sets the parity bulb by hand: a "Calculate the parity
     bulb" button reads the eight data bulbs, states the sum out loud, and
     lights the ninth bulb only if that sum needs it. Both discoveries share
     this shape — only the number of data bulbs the gremlin flips differs (1
     vs 2). The gremlin never touches the parity bulb itself in either
     discovery — bulb 9 always arrives exactly as it was sent — so the
     "parity bulb" half of every readout is identical whether it's
     describing what was sent or what was received; only the data bulbs (and
     the total that depends on them) can ever move. Sending plays out on the
     same kind of sender→wire→receiver diagram as D1: all nine bulbs glide
     down a single wire one after another (the buildWireToken/
     travelWireToken helpers declared above, under D1), and whichever data
     bulb(s) the gremlin is set to flip change colour partway across their
     own glide — visibly "somewhere in transit", not at either end. Bulbs
     1-8 land first, and a receiver-side row of the same data-bulb bulbs
     used for the sender's fixed row above relights live as each one
     arrives — the byte is represented the same way everywhere in this
     board, never spelled out as a string of digits. The receiver's own
     parity bulb sits in that same row, greyed out (pending) until its own
     dot lands, then settles into its real on/off state exactly like the
     eight data bulbs beside it. Each bulb's lit state comes from the actual
     (post-flip) value, computed directly from the flips list rather than
     read back off the DOM, so it's correct even under jsdom's synchronous
     bail path in tests. Bulb 9 (the parity bulb) lands last, confirming its
     own state is unchanged, and only then is the total confirmed —
     deliberately after the byte, so D3 can show a single flipped data bulb
     tipping the total from even to odd (*caught*), and D4 can show two
     flipped data bulbs — one on, one off — leaving the data count and the
     total exactly as sent (*uncaught*), even though the byte itself is now
     a genuinely different number. */
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
    const statusEl = $("#parityStatus" + n);
    const calcBtn = $("#calcBtn" + n), sendBtn = $("#sendBtn" + n);
    const parityBulbEl = $("#parityBulb" + n);
    const wireEl = $("#parityWire" + n), tokensEl = $("#parityTokens" + n);
    // The "N of 8" figure is the data bulbs only — the parity bulb never
    // joins that count, in this line or anywhere else in the board. Its own
    // on/off state is named separately, and only the resulting total is
    // described as "even"/"odd" — a plain word, never a merged N of 9. The
    // data bulbs are fixed, so this sum only ever needs working out once.
    const dataLit = dataBits.filter(Boolean).length;
    const dataEven = dataLit % 2 === 0;
    let parityOn = null; // not yet worked out
    statusEl.textContent = dataLit + " of 8 data bulbs lit — " + (dataEven ? "even" : "odd") +
      ". Work out the parity bulb, then send.";
    calcBtn.addEventListener("click", () => {
      parityOn = !dataEven; // an odd data count needs the parity bulb lit to reach even; an even one leaves it off
      const total = dataLit + (parityOn ? 1 : 0);
      parityBulbEl.classList.remove("pending");
      parityBulbEl.classList.toggle("on", parityOn);
      statusEl.textContent = dataLit + " of 8 data bulbs lit — " + (dataEven ? "even" : "odd") + ". " +
        (dataEven
          ? "Already even, so the parity bulb stays off — " + dataLit + " + 0 = " + total + ", even. Ready to send."
          : "To reach an even total the parity bulb has to light too — " + dataLit + " + 1 = " + total + ", even. Ready to send.");
      calcBtn.hidden = true;
      sendBtn.hidden = false;
    });
    const checkRing = $("#byteCheckRing" + n), checkmark = $("#byteCheckmark" + n);
    const parityCheckbox = $("#byteParityCheck" + n), disagreeFlag = $("#byteFlag" + n);
    const questionFlag = $("#byteQuestion" + n);
    return { dataBits, wireEl, tokensEl, checkRing, checkmark, parityCheckbox, disagreeFlag, questionFlag, get parityOn() { return parityOn; } };
  }
  const CHECK_CIRCLE_MS = 500; // gives the .byte-check-ring.drawing fade/scale (.4s) time to mostly land first
  // flips: [{index, to}] — bulb 8 is the parity bulb, 0-7 are the data bulbs.
  function sendParityBits(state, flips, byteRowEl, byteParityBulbEl, byteTextEl, onArrived) {
    state.tokensEl.innerHTML = "";
    byteTextEl.textContent = "";
    state.checkRing.classList.remove("drawing", "disagree");
    state.checkmark.classList.remove("show");
    state.parityCheckbox.classList.remove("shown", "agree", "disagree");
    state.disagreeFlag.classList.remove("show");
    state.questionFlag.classList.remove("show");
    const byteBulbs = buildBulbRow(byteRowEl, state.dataBits.length, "data-bulb");
    byteParityBulbEl.className = "parity-bulb pending"; // greyed out again until its own dot lands, same as the eight data bulbs
    byteParityBulbEl.hidden = false; // stays hidden entirely before the first send, rather than sitting there alone with no octet beside it
    const bits = state.dataBits.concat([state.parityOn ? 1 : 0]);
    const receivedData = new Array(state.dataBits.length).fill(null);
    let lastLanding = 0, totalArrived = 0;
    bits.forEach((b, i) => {
      const delay = reduceMotion ? 0 : (i + 1) * WIRE_STAGGER_MS;
      const flip = flips.find(f => f.index === i);
      setTimeout(() => {
        // Data bits are labelled by position from the right (LSB = 1); the
        // parity bulb isn't part of that count, so it keeps its own "9".
        const posLabel = i < state.dataBits.length ? bitPosition(i, state.dataBits.length) : i + 1;
        const token = buildWireToken(state.tokensEl, 28, 28, !!b, String(posLabel));
        travelWireToken(token, state.wireEl, 28, WIRE_GLIDE_MS, () => {
          token.classList.add("arrived");
          totalArrived++;
          if (i < receivedData.length) {
            const finalBit = flip ? flip.to : b; // the byte actually received, not what was sent
            receivedData[i] = finalBit;
            byteBulbs[i].classList.remove("pending");
            if (finalBit) byteBulbs[i].classList.add("on");
            // Counts arrivals out of the eight data bulbs only — the parity
            // bulb (arriving last) never joins this count, matching the "N
            // of 8" line above the wire, so a difference here only ever
            // means a data bulb genuinely arrived different from how it was
            // sent, never an artefact of how the parity bulb was tallied.
            byteTextEl.textContent = "Receiving… (" + totalArrived + " of 8 data bulbs arrived)";
          } else {
            // The parity bulb has landed — circle the byte row like a pen
            // checking it over, then reveal a green check only if that byte
            // is genuinely correct, independent of what the parity count
            // below concludes (D3: wrong byte, and the total catches it;
            // D4: wrong byte, but the total doesn't — never claim either
            // byte is right when it isn't).
            // The count line finishes the same way parityStatus's line does
            // before sending: the data bulbs get their own "N of 8" figure,
            // the parity bulb gets its own on/off word, and only the
            // resulting total is called "even"/"odd" — never a merged N of 9.
            // The little checkbox next to it is just that same even/odd
            // test rendered as a tick or a dash. A small amber flag also
            // lights up in the corner whenever that total disagrees — never
            // red, and never framed as a failure: it's parity's own signal
            // that it caught something — and when it does, the ring itself
            // is drawn in that same amber from the very first frame (decided
            // before "drawing" is even added, not layered on partway through
            // the draw) so the two never show as two different colours mid-
            // animation. When the total agrees but the byte is still wrong —
            // parity fooled, not caught — the ring stays its ordinary teal,
            // and an amber question mark takes the flag's corner instead: a
            // nudge to wonder why a tick doesn't necessarily mean "correct".
            // All three badges (checkmark, flag, question mark) are mutually
            // exclusive by construction (an unchanged byte always keeps the
            // total even, so it can only ever trigger the checkmark; a
            // disagreeing total can only trigger the flag; everything left
            // over is the fooled case), so all three are free to share that
            // one corner.
            const finalParityBit = flip ? flip.to : b;
            byteParityBulbEl.classList.remove("pending");
            if (finalParityBit) byteParityBulbEl.classList.add("on");
            const litCount = receivedData.filter(Boolean).length;
            const dataEven = litCount % 2 === 0;
            const agrees = (litCount + finalParityBit) % 2 === 0;
            const isCorrect = bitsToValue(receivedData) === 19;
            byteTextEl.textContent = "Received: " + litCount + " of 8 data bulbs lit — " + (dataEven ? "even" : "odd") +
              ". The parity bulb arrived " + (finalParityBit ? "on" : "off") + ", making the total " + (agrees ? "even." : "odd.");
            state.checkRing.classList.add("drawing");
            if (!agrees) state.checkRing.classList.add("disagree");
            setTimeout(() => {
              if (isCorrect) state.checkmark.classList.add("show");
              state.parityCheckbox.classList.add("shown", agrees ? "agree" : "disagree");
              if (!agrees) {
                state.disagreeFlag.classList.add("show");
              } else if (!isCorrect) {
                state.questionFlag.classList.add("show");
              }
            }, reduceMotion ? 0 : CHECK_CIRCLE_MS);
          }
        });
        if (flip) {
          setTimeout(() => { token.classList.toggle("on", !!flip.to); }, reduceMotion ? 0 : WIRE_GLIDE_MS / 2);
        }
      }, delay);
      lastLanding = delay + (reduceMotion ? 0 : WIRE_GLIDE_MS);
    });
    setTimeout(onArrived, lastLanding + 60);
  }

  // Both discoveries below leave the parity bulb itself untouched — it
  // always arrives exactly as it was sent. Whatever the gremlin flips is
  // one of the eight data bulbs instead, so the "parity bulb" line the
  // learner reads is word-for-word identical whether it's describing what
  // was sent or what arrived; only the data bulbs (and, downstream of them,
  // the total) can ever differ between the two.
  const d3state = setUpParity(3);
  $("#sendBtn3").addEventListener("click", () => {
    sendParityBits(d3state, [{ index: 2, to: 1 }], $("#byteRow3"), $("#byteParityBulb3"), $("#byteResult3"), () => { // one data bulb flips on; the parity bulb arrives unchanged
      $("#result3").textContent = "Parity check: you sent an even total; the receiver recounts an odd total instead — 4 of 8 data bulbs lit now, not 3, even though the parity bulb itself arrived exactly as sent. Sender and receiver agreed the total should always be even, so that flip from even to odd is the catch: something changed in transit.";
      awardStar("d3", "One flipped bulb, caught cleanly — the receiver noticed the instant the total stopped being even.");
    });
  });

  const d4state = setUpParity(4);
  $("#sendBtn4").addEventListener("click", () => {
    sendParityBits(d4state, [{ index: 2, to: 1 }, { index: 3, to: 0 }], $("#byteRow4"), $("#byteParityBulb4"), $("#byteResult4"), () => { // two data bulbs swap — one on, one off — so the data count, and the parity bulb, both arrive reading exactly as sent
      $("#result4").textContent = "Parity check: you sent an even total; the receiver still recounts an even total — 3 of 8 data bulbs lit, same as you sent, and the parity bulb arrived exactly as sent too. Nothing looks wrong by the numbers, even though it's not the same three bulbs lit any more — and the byte reconstructed above proves it's genuinely changed. Parity only ever catches an odd number of flips — that's exactly why real systems also use checksums, a second and different kind of total, to catch some of what a single parity bulb misses.";
      awardStar("d4", "You found parity's real limit yourself: two flips cancel each other out, and the receiver has no way to tell.");
    });
  });

  /* ═══ D5: ask again — ARQ played out as a text-message thread ═══
     Same left/right convention as the wire diagrams above (sender on the
     left, receiver on the right), just rendered as chat bubbles instead of
     travelling dots. A small role label appears above a bubble only when
     the speaker changes from the line before — consecutive messages from
     the same side share one label, the same grouping real messaging apps
     use — and the one line that isn't really anyone's message (the ACK
     that never turns up) renders as a centred system note with no bubble
     and no side, exactly like a "message not delivered" notice. */
  const arqLog5 = $("#arqLog5");
  const ARQ_SEQ = {
    "clean": [
      { text: "Sending the message.", cls: "sender" },
      { text: "Checking it… all correct.", cls: "receiver" },
      { text: "Sending back a positive acknowledgement (ACK).", cls: "receiver" },
      { text: "Acknowledgement received. Done in one round trip.", cls: "sender" }
    ],
    "damaged": [
      { text: "Sending the message.", cls: "sender" },
      { text: "Checking it… an error's there.", cls: "receiver" },
      { text: "Sending back a negative acknowledgement (NAK).", cls: "receiver" },
      { text: "NAK received — resending.", cls: "sender" },
      { text: "Checking it again… all correct this time.", cls: "receiver" },
      { text: "Sending back a positive acknowledgement (ACK).", cls: "receiver" },
      { text: "Acknowledgement received. Done.", cls: "sender" }
    ],
    "lost-ack": [
      { text: "Sending the message.", cls: "sender" },
      { text: "Checking it… all correct.", cls: "receiver" },
      { text: "Sending back a positive acknowledgement (ACK)…", cls: "receiver" },
      { text: "The acknowledgement never arrives.", cls: "system" },
      { text: "No reply within the time limit — a timeout. Resending, just in case.", cls: "sender" },
      { text: "Checking it again… still correct.", cls: "receiver" },
      { text: "Sending back a positive acknowledgement (ACK).", cls: "receiver" },
      { text: "Acknowledgement received. Done.", cls: "sender" }
    ]
  };
  const check5 = makeChips($("#chips5"), ["clean", "damaged", "lost-ack"],
    () => awardStar("d5", "All three ways an exchange can go, played end to end — including the one where the message was fine all along and only the reply went missing."),
    k => (k === "clean" ? "delivered cleanly" : (k === "damaged" ? "damaged in transit" : "the lost acknowledgement")),
    (label, remaining) => "Played out " + label + ". " + remaining + " more to try.");

  function playArq5(key) {
    const seq = ARQ_SEQ[key];
    arqLog5.innerHTML = "";
    let lastSide = null;
    seq.forEach((step, i) => {
      const delay = reduceMotion ? 0 : i * 450;
      setTimeout(() => {
        if (step.cls === "system") {
          const note = document.createElement("div");
          note.className = "arq-system";
          note.textContent = step.text;
          arqLog5.appendChild(note);
          lastSide = null; // the next real message always gets its own label back
        } else {
          if (step.cls !== lastSide) {
            const label = document.createElement("div");
            label.className = "arq-role " + step.cls;
            label.textContent = step.cls === "sender" ? "Sender" : "Receiver";
            arqLog5.appendChild(label);
          }
          const line = document.createElement("div");
          line.className = "arq-line " + step.cls;
          line.textContent = step.text;
          arqLog5.appendChild(line);
          lastSide = step.cls;
        }
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
  let computedEl6 = null; // the live "computed" tile, built once in buildBarcode6 and updated in place from then on
  let flagEl6 = null; // the amber "!" that lights up next to it, same badge language as D3/D4's parity flag
  const barcodeMount6 = $("#barcodeDigits6"), checkStatus6 = $("#checkStatus6");
  const check6 = makeChips($("#chips6"), ["early", "late"],
    () => awardStar("d6", "Both ends of the number tested, and the check digit caught every single change — that's the trick behind every barcode and ISBN you'll ever scan."),
    k => (k === "early" ? "an early digit" : "a later digit"),
    (label, remaining) => "Tried corrupting " + label + ". " + remaining + " more to try.");

  function updateStatus6() {
    const computed = computeCheckDigit(current6);
    const match = computed === CHECK_DIGIT;
    computedEl6.textContent = String(computed);
    computedEl6.classList.toggle("match", match);
    computedEl6.classList.toggle("mismatch", !match);
    computedEl6.setAttribute("aria-label", "check digit computed live from the twelve digits, currently " + computed +
      ", " + (match ? "matches the printed check digit" : "does not match the printed check digit"));
    flagEl6.classList.toggle("show", !match);
    checkStatus6.textContent = match
      ? "Matches the printed check digit — no error would be caught here."
      : "Does NOT match the printed check digit — a scanner would catch this instantly.";
    return { computed, match };
  }
  function buildBarcode6() {
    barcodeMount6.innerHTML = "";
    digitButtons6.length = 0;
    // The printed barcode (all thirteen of its real digits) sits inside its
    // own rounded box, a boundary the eye can see rather than just extra
    // gap — so the computed tile below is unmistakably outside the barcode
    // itself, something worked out about it rather than part of it.
    const realGroup = document.createElement("div");
    realGroup.className = "barcode-real";
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
      realGroup.appendChild(b);
      digitButtons6.push(b);
    }
    const checkEl = document.createElement("span");
    checkEl.className = "barcode-digit check"; checkEl.textContent = String(CHECK_DIGIT);
    checkEl.setAttribute("aria-label", "printed check digit, currently " + CHECK_DIGIT + ", not editable");
    realGroup.appendChild(checkEl);
    barcodeMount6.appendChild(realGroup);
    // Held apart from the boxed barcode by extra gap too, same "extra
    // space, no confusion about which is which" language as the parity
    // bulb in D3/D4 — shows the same rule worked out live from whichever
    // twelve digits are currently on screen, as a digit rather than a
    // number buried in a sentence, so the comparison against the printed
    // digit reads at a glance: teal border while it matches, amber the
    // moment it doesn't (never red — this project never marks anything a
    // failure).
    computedEl6 = document.createElement("span");
    computedEl6.className = "barcode-digit computed";
    barcodeMount6.appendChild(computedEl6);
    // Amber, never red, and hidden entirely rather than dimmed while it
    // matches — the same "!" badge D3/D4 use to flag a genuine disagreement,
    // so a mismatch here reads as the same kind of catch, not a new idea.
    flagEl6 = document.createElement("span");
    flagEl6.className = "barcode-flag";
    flagEl6.setAttribute("aria-hidden", "true");
    flagEl6.textContent = "!";
    barcodeMount6.appendChild(flagEl6);
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
