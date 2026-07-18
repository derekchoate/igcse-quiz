/* ================= Module 13 — The Journey of a Message =================
   Signature interaction: a message shredder & network map — type a message,
   watch it split into numbered packets (header/payload/trailer visually
   distinct), release them onto a map where they travel different lanes and
   reassemble by packet number at the receiver. D1's fragment/label matching
   is hand-rolled (tap-then-tap plus pointer drag, mirroring the dual-path
   pattern Module 12's D4 used for its scenario/platform sort) rather than
   pulled from the shared `matcher` kit: that kit's commit() hardcodes
   awardStar("d3", ...) with a message written for Module 9's pseudocode
   pairing, so reusing it here would award the wrong discovery (or throw,
   since this module has no #d3 matching that content). Rule of two also
   doesn't clear a new kit for a 3-into-3-bins shape that already has a
   working hand-rolled precedent. Runs inside the shared engine IIFE, so $,
   $$, reduceMotion, sparks, toast, awardStar and makeChips are all in scope. */

  /* ═══ shared: split a message into numbered packets ═══ */
  function shred(message, chunkSize) {
    const packets = [];
    for (let i = 0; i < message.length; i += chunkSize) {
      packets.push({ num: packets.length + 1, payload: message.slice(i, i + chunkSize) });
    }
    return packets;
  }

  /* ═══ D1: anatomy of one packet — tap/drag fragments onto their label ═══
     Hand-rolled dual tap+drag path (pointer events, document-bound), mirrored
     from Module 12's D4 scenario/platform sort — a 3-into-3 shape neither the
     chips kit (readout/label targets, not two-sided matching) nor the matcher
     kit (hardcoded to award "d3") actually fits. */
  const FRAGMENTS1 = [
    { id: "f1", cls: "frag-header", body: "To: receiver’s phone · Packet 2 of 3 · From: sender’s phone", ans: "Header" },
    { id: "f2", cls: "frag-payload", body: "“ELLO”", ans: "Payload" },
    { id: "f3", cls: "frag-trailer", body: "End of packet · damage check", ans: "Trailer" }
  ];
  const fragEls1 = {}, binEls1 = {};
  let selectedFrag1 = null, placed1 = 0;
  const pool1 = $("#fragPool1"), status1 = $("#status1");

  function selectFrag1(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedFrag1 === id) {
      btn.classList.remove("sel"); selectedFrag1 = null;
      status1.textContent = "Tap a fragment to begin.";
      return;
    }
    $$(".frag-chip", pool1).forEach(c => c.classList.remove("sel"));
    selectedFrag1 = id; btn.classList.add("sel");
    status1.textContent = "Now tap the label you think this fragment belongs to.";
  }
  function tryPlaceFrag1(key) {
    if (!selectedFrag1) return;
    const f = FRAGMENTS1.find(x => x.id === selectedFrag1);
    const btn = fragEls1[f.id];
    if (f.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      binEls1[key].list.textContent = f.body;
      binEls1[key].wrap.classList.add("filled");
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed1++; selectedFrag1 = null;
      if (placed1 === FRAGMENTS1.length) {
        status1.textContent = "All three matched — header, payload, trailer, every packet, every time.";
        awardStar("d1", "Every part matched to its job — a packet is never more than a header, a payload and a trailer.");
      } else {
        status1.textContent = "That's the one. " + (FRAGMENTS1.length - placed1) + " more to go.";
      }
    } else {
      toast("Not that label — read the fragment again: does it mention an address, is it a bare slice of text, or does it mark an ending?");
      btn.classList.remove("sel"); selectedFrag1 = null;
      status1.textContent = "Tap a fragment to try again.";
    }
  }
  function binUnder1(e) {
    if (dragGhost1) dragGhost1.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost1) dragGhost1.style.visibility = "";
    const bin = el && el.closest ? el.closest(".label-bin") : null;
    if (!bin) return null;
    for (const k in binEls1) { if (binEls1[k].wrap === bin) return k; }
    return null;
  }
  function markHover1(key) {
    Object.keys(binEls1).forEach(k => binEls1[k].wrap.classList.toggle("drop-ok", k === key));
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
    const btn = fragEls1[dragId1];
    if (!dragging1) {
      if (Math.hypot(e.clientX - dragStartX1, e.clientY - dragStartY1) < 6) return;
      dragging1 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX1 = dragStartX1 - rect.left; dragOffY1 = dragStartY1 - rect.top;
      dragGhost1 = btn.cloneNode(true);
      dragGhost1.classList.add("frag-ghost"); dragGhost1.classList.remove("sel");
      dragGhost1.style.width = rect.width + "px";
      document.body.appendChild(dragGhost1);
      btn.classList.add("dragging");
      $$(".frag-chip", pool1).forEach(c => c.classList.remove("sel"));
      selectedFrag1 = null;
    }
    e.preventDefault();
    dragGhost1.style.left = (e.clientX - dragOffX1) + "px";
    dragGhost1.style.top = (e.clientY - dragOffY1) + "px";
    markHover1(binUnder1(e));
  }
  function dragEnd1(e) {
    if (dragId1 === null || e.pointerId !== dragPtrId1) return;
    const id = dragId1, btn = fragEls1[id];
    document.removeEventListener("pointermove", dragMove1);
    document.removeEventListener("pointerup", dragEnd1);
    document.removeEventListener("pointercancel", dragEnd1);
    if (dragging1) {
      const key = binUnder1(e);
      markHover1(null);
      if (dragGhost1) { dragGhost1.remove(); dragGhost1 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedFrag1 = id; tryPlaceFrag1(key); }
    } else if (e.type !== "pointercancel") {
      selectFrag1(id, btn);
    }
    dragId1 = null; dragging1 = false; dragPtrId1 = null;
  }
  function buildFragChip1(f) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "frag-chip " + f.cls; b.dataset.id = f.id;
    b.textContent = f.body;
    b.addEventListener("click", () => { if (!dragging1) selectFrag1(f.id, b); });
    b.addEventListener("pointerdown", e => dragStart1(e, f.id, b));
    fragEls1[f.id] = b;
    return b;
  }
  function buildLabelBin1(key) {
    const wrap = document.createElement("div"); wrap.className = "label-bin";
    const head = document.createElement("button");
    head.type = "button"; head.className = "label-bin-head"; head.textContent = key;
    head.addEventListener("click", () => tryPlaceFrag1(key));
    const list = document.createElement("div"); list.className = "label-bin-body"; list.setAttribute("aria-live", "polite");
    list.textContent = "—";
    wrap.appendChild(head); wrap.appendChild(list);
    binEls1[key] = { wrap, list, head };
    return wrap;
  }
  ["Header", "Payload", "Trailer"].forEach(key => $("#labelBins1").appendChild(buildLabelBin1(key)));
  FRAGMENTS1.forEach(f => pool1.appendChild(buildFragChip1(f)));

  /* ═══ shared: SVG route-map tokens + path-follow animation (D2, D3, D4) ═══
     Every route map is three SVG paths sharing the same start point (the
     sender node) and the same end point (the receiver node) — packets
     genuinely originate together and land together, they just take
     different roads in between (see the <svg> markup for #routeMap2/3/4 in
     content.html). Each packet gets its own small SVG token that glides
     along its assigned path via getPointAtLength + requestAnimationFrame
     (the same technique the `walk` kit's flowDot uses), wrapped in a
     try/catch since JSDOM doesn't implement SVG geometry methods under
     test — the fallback there is an instant, synchronous onDone, matching
     what reduceMotion does for real users. Logical arrival order/timing for
     D2/D3/D4 is still driven by each discovery's own setTimeout stagger
     (unchanged from before), so this animation is a cosmetic layer on top,
     not a replacement for that timing. */
  const ROUTE_SVG_NS = "http://www.w3.org/2000/svg";
  const ROUTE_SENDER = { x: 30, y: 90 }, ROUTE_RECEIVER = { x: 310, y: 90 };
  const ROUTE_GLIDE_MS = 1800;
  function buildRouteToken(mount, num) {
    const g = document.createElementNS(ROUTE_SVG_NS, "g");
    g.setAttribute("class", "route-token");
    g.setAttribute("transform", "translate(" + ROUTE_SENDER.x + "," + ROUTE_SENDER.y + ")");
    const dot = document.createElementNS(ROUTE_SVG_NS, "circle");
    dot.setAttribute("r", "9");
    const label = document.createElementNS(ROUTE_SVG_NS, "text");
    label.setAttribute("y", "3");
    label.textContent = "#" + num;
    g.appendChild(dot); g.appendChild(label);
    mount.appendChild(g);
    return g;
  }
  function travelToken(token, routePath, dur, targetFrac, onDone) {
    let len = 0;
    try { len = routePath.getTotalLength(); }
    catch (e) { /* SVG geometry unsupported (e.g. jsdom under test) */ }
    if (reduceMotion || !len || typeof routePath.getPointAtLength !== "function") {
      onDone();
      return;
    }
    const t0 = performance.now();
    (function frame(now) {
      let t = (now - t0) / dur; if (t > 1) t = 1;
      const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
      const pt = routePath.getPointAtLength(e * targetFrac * len);
      token.setAttribute("transform", "translate(" + pt.x + "," + pt.y + ")");
      if (t < 1) requestAnimationFrame(frame); else onDone();
    })(t0);
  }
  function flowToken(token, routePath, dur, onDone) {
    travelToken(token, routePath, dur, 1, () => {
      token.setAttribute("transform", "translate(" + ROUTE_RECEIVER.x + "," + ROUTE_RECEIVER.y + ")");
      onDone();
    });
  }
  // A small burst of fragments scattering from (x, y) and fading — the same
  // technique as the engine's own sparks() (core.js), but drawn as SVG
  // circles in the route map's own coordinate space, and deliberately not
  // amber: that colour means "achieved" everywhere else in the house style,
  // and a lost packet isn't an achievement or a marked-wrong failure either
  // — just its own colour scattering apart.
  function routeBurst(mount, x, y) {
    if (reduceMotion) return;
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + (Math.random() * .5 - .25);
      const dist = 20 + Math.random() * 16;
      const frag = document.createElementNS(ROUTE_SVG_NS, "circle");
      frag.setAttribute("class", "route-burst");
      frag.setAttribute("cx", x); frag.setAttribute("cy", y); frag.setAttribute("r", "4");
      frag.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(1) + "px");
      frag.style.setProperty("--dy", (Math.sin(angle) * dist).toFixed(1) + "px");
      frag.style.animationDelay = (Math.random() * .08).toFixed(2) + "s";
      mount.appendChild(frag);
      setTimeout(() => frag.remove(), 900);
    }
  }
  // Travels partway (55% of the route, at the same pace flowToken would use
  // for the full trip), then bursts apart instead of just fading — used
  // where a packet is meant to go missing "somewhere on its route" rather
  // than simply never leave.
  const ROUTE_VANISH_FRAC = .55;
  function vanishToken(token, routePath, dur, mount, onDone) {
    travelToken(token, routePath, dur * ROUTE_VANISH_FRAC, ROUTE_VANISH_FRAC, () => {
      let vanishPt = null;
      try {
        const len = routePath.getTotalLength();
        vanishPt = routePath.getPointAtLength(ROUTE_VANISH_FRAC * len);
      } catch (e) { /* SVG geometry unsupported (e.g. jsdom under test) */ }
      if (vanishPt) {
        token.setAttribute("transform", "translate(" + vanishPt.x + "," + vanishPt.y + ")");
        routeBurst(mount, vanishPt.x, vanishPt.y);
      }
      token.classList.add("vanished");
      onDone();
    });
  }

  /* ═══ D2: release the packets — shredder + SVG route map + receiver ═══ */
  const CHUNK2 = 4, ROUTE_COUNT2 = 3;
  let packets2 = [], slotEls2 = [];
  const msgInput2 = $("#msgInput2"), tray2 = $("#tray2");
  const releaseBtn2 = $("#releaseBtn2"), routeMap2 = $("#routeMap2"), routeTokens2 = $("#routeTokens2");
  const routePaths2 = [$("#routePath2-1"), $("#routePath2-2"), $("#routePath2-3")];
  const receiver2 = $("#receiver2"), slotsMount2 = $("#slots2"), reassembled2 = $("#reassembled2");
  let released2 = false;

  function buildTray2(packets) {
    tray2.innerHTML = "";
    packets.forEach(p => {
      const card = document.createElement("div"); card.className = "packet-card";
      card.innerHTML =
        '<div class="packet-part packet-header">#' + p.num + ' of ' + packets.length + '</div>' +
        '<div class="packet-part packet-payload">' + escapeHtml(p.payload) + '</div>' +
        '<div class="packet-part packet-trailer">end</div>';
      tray2.appendChild(card);
    });
  }
  function escapeHtml(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function buildRouteTokens2(packets) {
    routeTokens2.innerHTML = "";
    packets.forEach(p => {
      p.routePath = routePaths2[(p.num - 1) % ROUTE_COUNT2];
      p.token = buildRouteToken(routeTokens2, p.num);
    });
  }
  function buildReceiver2(packets) {
    slotsMount2.innerHTML = ""; slotEls2 = [];
    packets.forEach(p => {
      const slot = document.createElement("div"); slot.className = "receiver-slot"; slot.dataset.num = p.num;
      slot.innerHTML = '<span class="slot-num">#' + p.num + '</span><span class="slot-val">?</span>';
      slotsMount2.appendChild(slot);
      slotEls2.push(slot);
    });
    renderReassembled2(packets);
  }
  function renderReassembled2(packets) {
    const line = packets.map(p => p.arrived ? p.payload : "·".repeat(p.payload.length)).join("");
    reassembled2.textContent = "Message so far: " + line;
  }

  msgInput2.addEventListener("input", resetShred2);
  function resetShred2() {
    packets2 = []; released2 = false;
    tray2.innerHTML = ""; routeMap2.hidden = true; routeTokens2.innerHTML = "";
    receiver2.hidden = true; slotsMount2.innerHTML = ""; reassembled2.textContent = "";
    releaseBtn2.hidden = true;
  }
  $("#shredBtn2").addEventListener("click", () => {
    const msg = msgInput2.value.trim();
    if (!msg) {
      toast("Type a short message first — even a few letters will do.");
      return;
    }
    packets2 = shred(msg, CHUNK2);
    buildTray2(packets2);
    releaseBtn2.hidden = false;
    routeMap2.hidden = true; routeTokens2.innerHTML = "";
    receiver2.hidden = true; slotsMount2.innerHTML = ""; reassembled2.textContent = "";
    released2 = false;
  });
  releaseBtn2.addEventListener("click", () => {
    if (released2 || !packets2.length) return;
    released2 = true;
    routeMap2.hidden = false; buildRouteTokens2(packets2);
    receiver2.hidden = false; buildReceiver2(packets2);
    packets2.forEach((p, i) => {
      const delay = reduceMotion ? 0 : (i + 1) * 500;
      setTimeout(() => arrivePacket2(p), delay);
    });
  });
  function arrivePacket2(p) {
    flowToken(p.token, p.routePath, ROUTE_GLIDE_MS, () => {
      p.arrived = true;
      if (p.token) p.token.classList.add("arrived");
      const slot = slotEls2[p.num - 1];
      if (slot) {
        slot.classList.add("filled");
        $(".slot-val", slot).textContent = p.payload;
      }
      renderReassembled2(packets2);
      if (packets2.every(x => x.arrived)) {
        awardStar("d2", "A message you typed yourself, torn into numbered pieces, sent down different routes, and rebuilt whole. That's every message you've ever sent.");
      }
    });
  }

  /* ═══ D3: out of order on purpose — congestion slider ═══ */
  const MSG3 = "CALL ME SOON", CHUNK3 = 4;
  const packetsBase3 = shred(MSG3, CHUNK3);
  const slider3 = $("#congestionSlider3"), sliderVal3 = $("#congestionVal3");
  const arrivalLog3 = $("#arrivalLog3"), reassembled3 = $("#reassembled3");
  const routeMap3 = $("#routeMap3"), routeTokens3 = $("#routeTokens3");
  const routePaths3 = [$("#routePath3-1"), $("#routePath3-2"), $("#routePath3-3")];
  let sending3 = false;
  slider3.addEventListener("input", () => { sliderVal3.textContent = slider3.value + "%"; });
  const check3 = makeChips($("#chips3"), ["low", "high"],
    () => awardStar("d3", "Low congestion and high congestion both sent — arrival order scrambled, but the message never once came out wrong."),
    k => (k === "low" ? "low congestion" : "high congestion"),
    (label, remaining) => "Tried it at " + label + ". " + remaining + " more to try.");
  $("#sendBtn3").addEventListener("click", () => {
    if (sending3) return;
    sending3 = true;
    const congestion = Number(slider3.value);
    const packets = packetsBase3.map(p => Object.assign({}, p, { arrived: false }));
    arrivalLog3.textContent = "Arrival order: —";
    reassembled3.textContent = "Message so far: " + packets.map(p => "·".repeat(p.payload.length)).join("");
    routeMap3.hidden = false; routeTokens3.innerHTML = "";
    packets.forEach(p => {
      p.routePath = routePaths3[(p.num - 1) % 3];
      p.token = buildRouteToken(routeTokens3, p.num);
    });
    const arrivalOrder = [];
    // Fixed base delay per lane (600/650/700ms) so, at zero congestion, arrival
    // order always matches send order (1, 2, 3). Only route 2 — packet 2's lane
    // — grows with the slider, so raising it is what scrambles the order. This
    // delay models queueing before departure; once a packet leaves, it glides
    // its route at the same calm pace as the other two (see flowToken above).
    const LANE_BASE3 = [600, 650, 700];
    packets.forEach(p => {
      const laneIndex = (p.num - 1) % 3;
      const isBusyRoute = laneIndex === 1; // route 2, matching the route-2 label
      const delay = reduceMotion ? 0 : LANE_BASE3[laneIndex] + (isBusyRoute ? congestion * 20 : 0);
      setTimeout(() => {
        flowToken(p.token, p.routePath, ROUTE_GLIDE_MS, () => {
          p.arrived = true;
          arrivalOrder.push(p.num);
          arrivalLog3.textContent = "Arrival order: " + arrivalOrder.map(n => "#" + n).join(", ");
          reassembled3.textContent = "Message so far: " + packets.map(x => x.arrived ? x.payload : "·".repeat(x.payload.length)).join("");
          if (packets.every(x => x.arrived)) {
            sending3 = false;
            check3(congestion <= 20 ? "low" : (congestion >= 80 ? "high" : null));
          }
        });
      }, delay);
    });
  });

  /* ═══ D4: a packet goes missing ═══ */
  const MSG4 = "BRING SNACKS", CHUNK4 = 4;
  const packetsBase4 = shred(MSG4, CHUNK4);
  const dropToggle4 = $("#dropToggle4"), sendBtn4 = $("#sendBtn4");
  const routeMap4 = $("#routeMap4"), routeTokens4 = $("#routeTokens4");
  const routePaths4 = [$("#routePath4-1"), $("#routePath4-2"), $("#routePath4-3")];
  const slotsMount4 = $("#slots4"), gapNote4 = $("#gapNote4"), resendBtn4 = $("#resendBtn4");
  let drop4 = false, packets4 = [], slotEls4 = [];
  dropToggle4.addEventListener("click", () => {
    drop4 = !drop4;
    dropToggle4.setAttribute("aria-pressed", String(drop4));
    dropToggle4.classList.toggle("on", drop4);
    dropToggle4.textContent = drop4 ? "Packet 2 will go missing — tap to cancel" : "Make packet 2 go missing";
  });
  function buildSlots4() {
    slotsMount4.innerHTML = ""; slotEls4 = [];
    packets4.forEach(p => {
      const slot = document.createElement("div"); slot.className = "receiver-slot"; slot.dataset.num = p.num;
      slot.innerHTML = '<span class="slot-num">#' + p.num + '</span><span class="slot-val">?</span>';
      slotsMount4.appendChild(slot);
      slotEls4.push(slot);
    });
  }
  sendBtn4.addEventListener("click", () => {
    packets4 = packetsBase4.map(p => Object.assign({}, p, { arrived: false, dropped: drop4 && p.num === 2 }));
    buildSlots4();
    gapNote4.textContent = "";
    resendBtn4.hidden = true;
    routeMap4.hidden = false; routeTokens4.innerHTML = "";
    packets4.forEach(p => {
      p.routePath = routePaths4[(p.num - 1) % 3];
      p.token = buildRouteToken(routeTokens4, p.num);
    });
    packets4.forEach((p, i) => {
      const delay = reduceMotion ? 0 : (i + 1) * 400;
      setTimeout(() => {
        if (p.dropped) {
          // Goes missing "somewhere on its route" (matches the discovery's
          // own wording) rather than never leaving — the token glides partway
          // then bursts apart, instead of just never appearing.
          vanishToken(p.token, p.routePath, ROUTE_GLIDE_MS, routeTokens4, () => {});
          return;
        }
        flowToken(p.token, p.routePath, ROUTE_GLIDE_MS, () => {
          p.arrived = true;
          const slot = slotEls4[p.num - 1];
          slot.classList.add("filled");
          $(".slot-val", slot).textContent = p.payload;
          checkGap4();
          if (!drop4 && packets4.every(x => x.arrived)) {
            gapNote4.textContent = "Every packet arrived, nothing missing this time. Switch the toggle on and send again to see what happens when one doesn't turn up.";
          }
        });
      }, delay);
    });
  });
  function checkGap4() {
    const missing = packets4.find(p => p.dropped && !p.arrived);
    const allOthersArrived = packets4.filter(p => !p.dropped).every(p => p.arrived);
    if (missing && allOthersArrived) {
      gapNote4.textContent = "Packet " + missing.num + " of " + packets4.length + " never showed up — the receiving end can see the gap in the packet numbers, and asks for it to be sent again.";
      resendBtn4.hidden = false;
    }
  }
  resendBtn4.addEventListener("click", () => {
    const missing = packets4.find(p => p.dropped && !p.arrived);
    if (!missing) return;
    resendBtn4.hidden = true;
    if (missing.token) {
      missing.token.classList.remove("vanished");
      missing.token.setAttribute("transform", "translate(" + ROUTE_SENDER.x + "," + ROUTE_SENDER.y + ")");
    }
    flowToken(missing.token, missing.routePath, ROUTE_GLIDE_MS, () => {
      missing.arrived = true; missing.dropped = false;
      const slot = slotEls4[missing.num - 1];
      slot.classList.add("filled");
      $(".slot-val", slot).textContent = missing.payload;
      gapNote4.textContent = "Packet " + missing.num + " arrived on the second try — the message is whole.";
      if (packets4.every(x => x.arrived)) {
        awardStar("d4", "A gap noticed by its packet number, a resend, and a complete message — that's the very first look at how networks recover from loss.");
      }
    });
  });

  /* ═══ D5: why bother? — sort statements into Benefit / Drawback ═══ */
  const REASONS5 = [
    { id: "r1", label: "If one route is blocked or busy, packets can simply go a different way.", ans: "Benefit" },
    { id: "r2", label: "No single line has to be reserved for one message the whole time it's sending — the network can be shared.", ans: "Benefit" },
    { id: "r3", label: "Extra hops between routers can add delay before a packet arrives.", ans: "Drawback" },
    { id: "r4", label: "The receiving end has to do extra work, waiting for and reordering packets that took different routes.", ans: "Drawback" }
  ];
  const reasonEls5 = {}, binEls5 = {};
  let selectedReason5 = null, placed5 = 0;
  const pool5 = $("#reasonPool5"), status5 = $("#status5");

  function selectReason5(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedReason5 === id) {
      btn.classList.remove("sel"); selectedReason5 = null;
      status5.textContent = "Tap a statement to begin.";
      return;
    }
    $$(".reason-chip", pool5).forEach(c => c.classList.remove("sel"));
    selectedReason5 = id; btn.classList.add("sel");
    const r = REASONS5.find(x => x.id === id);
    status5.textContent = "Now tap the bin you think “" + r.label + "” belongs in.";
  }
  function tryPlaceReason5(key) {
    if (!selectedReason5) return;
    const r = REASONS5.find(x => x.id === selectedReason5);
    const btn = reasonEls5[r.id];
    if (r.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      const line = document.createElement("div"); line.className = "bin-item"; line.textContent = r.label;
      binEls5[key].list.appendChild(line);
      const rect = btn.getBoundingClientRect(); sparks(rect.left + rect.width / 2, rect.top);
      placed5++; selectedReason5 = null;
      if (placed5 === REASONS5.length) {
        status5.textContent = "All four sorted — packet switching, costs and all.";
        awardStar("d5", "Every statement in its bin — packet switching copes with a damaged or busy network, and pays for that with extra delay and reassembly work at the far end.");
      } else {
        status5.textContent = "That's the one. " + (REASONS5.length - placed5) + " more to go.";
      }
    } else {
      toast("Not that bin — think again about whether this is the network coping well, or a genuine cost it pays.");
      btn.classList.remove("sel"); selectedReason5 = null;
      status5.textContent = "Tap a statement to try again.";
    }
  }
  function binUnder5(e) {
    if (dragGhost5) dragGhost5.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost5) dragGhost5.style.visibility = "";
    const bin = el && el.closest ? el.closest(".bin") : null;
    if (!bin) return null;
    for (const k in binEls5) { if (binEls5[k].wrap === bin) return k; }
    return null;
  }
  function markHover5(key) {
    Object.keys(binEls5).forEach(k => binEls5[k].wrap.classList.toggle("drop-ok", k === key));
  }
  let dragId5 = null, dragging5 = false, dragGhost5 = null, dragPtrId5 = null;
  let dragStartX5 = 0, dragStartY5 = 0, dragOffX5 = 0, dragOffY5 = 0;
  function dragStart5(e, id, btn) {
    if (btn.classList.contains("placed")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragId5 = id; dragPtrId5 = e.pointerId; dragging5 = false;
    dragStartX5 = e.clientX; dragStartY5 = e.clientY;
    document.addEventListener("pointermove", dragMove5);
    document.addEventListener("pointerup", dragEnd5);
    document.addEventListener("pointercancel", dragEnd5);
  }
  function dragMove5(e) {
    if (dragId5 === null || e.pointerId !== dragPtrId5) return;
    const btn = reasonEls5[dragId5];
    if (!dragging5) {
      if (Math.hypot(e.clientX - dragStartX5, e.clientY - dragStartY5) < 6) return;
      dragging5 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX5 = dragStartX5 - rect.left; dragOffY5 = dragStartY5 - rect.top;
      dragGhost5 = btn.cloneNode(true);
      dragGhost5.classList.add("reason-ghost"); dragGhost5.classList.remove("sel");
      dragGhost5.style.width = rect.width + "px";
      document.body.appendChild(dragGhost5);
      btn.classList.add("dragging");
      $$(".reason-chip", pool5).forEach(c => c.classList.remove("sel"));
      selectedReason5 = null;
    }
    e.preventDefault();
    dragGhost5.style.left = (e.clientX - dragOffX5) + "px";
    dragGhost5.style.top = (e.clientY - dragOffY5) + "px";
    markHover5(binUnder5(e));
  }
  function dragEnd5(e) {
    if (dragId5 === null || e.pointerId !== dragPtrId5) return;
    const id = dragId5, btn = reasonEls5[id];
    document.removeEventListener("pointermove", dragMove5);
    document.removeEventListener("pointerup", dragEnd5);
    document.removeEventListener("pointercancel", dragEnd5);
    if (dragging5) {
      const key = binUnder5(e);
      markHover5(null);
      if (dragGhost5) { dragGhost5.remove(); dragGhost5 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedReason5 = id; tryPlaceReason5(key); }
    } else if (e.type !== "pointercancel") {
      selectReason5(id, btn);
    }
    dragId5 = null; dragging5 = false; dragPtrId5 = null;
  }
  function buildReasonChip5(r) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "reason-chip"; b.textContent = r.label; b.dataset.id = r.id;
    b.addEventListener("click", () => { if (!dragging5) selectReason5(r.id, b); });
    b.addEventListener("pointerdown", e => dragStart5(e, r.id, b));
    reasonEls5[r.id] = b;
    return b;
  }
  function buildBin5(key) {
    const wrap = document.createElement("div"); wrap.className = "bin";
    const head = document.createElement("button");
    head.type = "button"; head.className = "bin-head"; head.textContent = key;
    head.addEventListener("click", () => tryPlaceReason5(key));
    const list = document.createElement("div"); list.className = "bin-list"; list.setAttribute("aria-live", "polite");
    wrap.appendChild(head); wrap.appendChild(list);
    binEls5[key] = { wrap, list, head };
    return wrap;
  }
  ["Benefit", "Drawback"].forEach(key => $("#bins5").appendChild(buildBin5(key)));
  REASONS5.forEach(r => pool5.appendChild(buildReasonChip5(r)));
