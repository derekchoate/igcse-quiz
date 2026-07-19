
  /* ================= Module 26 — Talking to the Network =================
   Signature interaction: a device passport office — the device's MAC gets
   engraved in hex (M2 payoff), then it queues for an IP visa stamped by
   whichever network it joins; moving the device to a new network shows
   which page changes and which never does. D1's fragment/label matcher is
   hand-rolled (tap-then-tap plus pointer drag) mirroring Module 13's D1
   exactly, reduced from 3 items to 2, rather than pulled from the shared
   matcher kit, which hardcodes awardStar("d3", ...) for Module 9's
   pseudocode pairing. D5 extends Module 13's packet-card visual with one
   new router node the learner operates for three packets. Runs inside the
   shared engine IIFE, so $, $$, reduceMotion, sparks, toast, awardStar and
   makeChips are all in scope. */

  const DEVICE_MAC = "3C:4D:BE:07:F2:A7"; // same MAC read in Module 2

  /* ═══ D1: the engraving — sort the MAC into manufacturer / serial ═══ */
  (function () {
    const engraveBtn = $("#engraveBtn1"), macPage = $("#macPage1"), macDisplay = $("#macDisplay1");
    const matchZone = $("#macMatch1"), pool = $("#fragPool1"), status = $("#status1");

    const FRAGMENTS = [
      { id: "mfr", body: "3C:4D:BE", ans: "Manufacturer code" },
      { id: "serial", body: "07:F2:A7", ans: "Serial code" }
    ];
    const fragEls = {}, binEls = {};
    let selected = null, placed = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap a half to begin.";
        return;
      }
      $$(".tn-frag-chip", pool).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      status.textContent = "Now tap the label this half belongs to.";
    }
    function tryPlace(key) {
      if (!selected) return;
      const f = FRAGMENTS.find(x => x.id === selected);
      const btn = fragEls[f.id];
      if (f.ans === key) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        binEls[key].body.textContent = f.body;
        binEls[key].wrap.classList.add("filled");
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        placed++; selected = null;
        if (placed === FRAGMENTS.length) {
          status.textContent = "Both halves sorted — a maker's code, and a serial that makes this one NIC unique.";
          awardStar("d1", "Engraved, split and sorted — a manufacturer code naming who built this NIC, and a serial code that makes this one exact unit unlike any other, permanent from the moment of manufacture.");
        } else {
          status.textContent = "That's the one. One more half to go.";
        }
      } else {
        toast("Not that label — have another look: does this half name the maker, or make this one unit unique?");
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap a half to try again.";
      }
    }
    function binUnder(e) {
      if (dragGhost) dragGhost.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (dragGhost) dragGhost.style.visibility = "";
      const bin = el && el.closest ? el.closest(".tn-label-bin") : null;
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
      const btn = fragEls[dragId];
      if (!dragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) < 6) return;
        dragging = true;
        const rect = btn.getBoundingClientRect();
        dragOffX = dragStartX - rect.left; dragOffY = dragStartY - rect.top;
        dragGhost = btn.cloneNode(true);
        dragGhost.classList.add("tn-frag-ghost"); dragGhost.classList.remove("sel");
        dragGhost.style.width = rect.width + "px";
        document.body.appendChild(dragGhost);
        btn.classList.add("dragging");
        $$(".tn-frag-chip", pool).forEach(c => c.classList.remove("sel"));
        selected = null;
      }
      e.preventDefault();
      dragGhost.style.left = (e.clientX - dragOffX) + "px";
      dragGhost.style.top = (e.clientY - dragOffY) + "px";
      markHover(binUnder(e));
    }
    function dragEnd(e) {
      if (dragId === null || e.pointerId !== dragPtrId) return;
      const id = dragId, btn = fragEls[id];
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
    function buildFragChip(f) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "tn-frag-chip"; b.dataset.id = f.id;
      b.textContent = f.body;
      b.addEventListener("click", () => { if (!dragging) select(f.id, b); });
      b.addEventListener("pointerdown", e => dragStart(e, f.id, b));
      fragEls[f.id] = b;
      return b;
    }
    function buildBin(key) {
      const wrap = document.createElement("div"); wrap.className = "tn-label-bin";
      const head = document.createElement("button");
      head.type = "button"; head.className = "tn-label-bin-head"; head.textContent = key;
      head.addEventListener("click", () => tryPlace(key));
      const body = document.createElement("div"); body.className = "tn-label-bin-body"; body.setAttribute("aria-live", "polite");
      body.textContent = "—";
      wrap.appendChild(head); wrap.appendChild(body);
      binEls[key] = { wrap, body, head };
      return wrap;
    }
    ["Manufacturer code", "Serial code"].forEach(key => $("#labelBins1").appendChild(buildBin(key)));
    FRAGMENTS.forEach(f => pool.appendChild(buildFragChip(f)));

    engraveBtn.addEventListener("click", () => {
      macDisplay.textContent = DEVICE_MAC;
      macPage.classList.add("tn-stamped");
      const r = macPage.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      matchZone.hidden = false;
      engraveBtn.disabled = true;
    });
  })();

  /* ═══ D2: the visa — request a dynamic IP and a static IP ═══ */
  (function () {
    const ipPage = $("#ipPage2"), ipDisplay = $("#ipDisplay2"), log = $("#ipLog2");
    const dynBtn = $("#reqDynamicBtn2"), statBtn = $("#reqStaticBtn2");
    const DYNAMIC_POOL = ["192.168.68.104", "192.168.68.117", "192.168.68.183"];
    const STATIC_IP = "192.168.1.10";
    let dynIndex = 0;

    const check2 = makeChips($("#chips2"), ["dynamic", "static"],
      () => awardStar("d2", "You felt the whole difference yourself: a dynamic IP handed back a new number nearly every time you asked, and a static IP never once moved."),
      k => (k === "dynamic" ? "a dynamic IP" : "a static IP"),
      (label, remaining) => "Requested " + label + " — " + remaining + " more to try.");

    function stamp(value) {
      ipDisplay.textContent = value;
      ipPage.classList.add("tn-stamped");
      const r = ipPage.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
    }

    dynBtn.addEventListener("click", () => {
      const value = DYNAMIC_POOL[dynIndex % DYNAMIC_POOL.length];
      dynIndex++;
      stamp(value);
      log.textContent = "The network handed back " + value + " — dynamic, and free to change again next time.";
      check2("dynamic");
    });
    statBtn.addEventListener("click", () => {
      stamp(STATIC_IP);
      log.textContent = "The network handed back " + STATIC_IP + " — static, reserved on purpose, never reissued to anyone else.";
      check2("static");
    });
  })();

  /* ═══ D3: move house — new IP, same MAC, discovered not stated ═══ */
  (function () {
    const macPage = $("#macPage3"), ipPage = $("#ipPage3");
    const macVal = $("#macVal3"), ipVal = $("#ipVal3");
    const connectBtn = $("#connectBtn3"), moveBtn = $("#moveBtn3");
    const netStatus = $("#netStatus3"), whichChanged = $("#whichChanged3"), status = $("#status3");
    const pickMac = $("#pickMac3"), pickIp = $("#pickIp3");
    const HOME_IP = "192.168.1.42", MALL_IP = "10.20.55.13";
    let moved = false, identified = false;

    const check3 = makeChips($("#chips3"), ["connected", "moved", "identified"],
      () => awardStar("d3", "You watched it happen with your own eyes: moving networks stamped a brand new IP page, and the MAC page — engraved once, at manufacture — never so much as flickered."),
      k => (k === "connected" ? "Connected to a network" : k === "moved" ? "Moved to a new one" : "Identified which page changed"),
      (label, remaining) => label + " — " + remaining + " more to go.");

    connectBtn.addEventListener("click", () => {
      macVal.textContent = DEVICE_MAC;
      ipVal.textContent = HOME_IP;
      macPage.classList.add("tn-stamped");
      ipPage.classList.add("tn-stamped");
      netStatus.textContent = "Connected to Home Wi-Fi.";
      connectBtn.disabled = true;
      moveBtn.disabled = false;
      check3("connected");
    });

    moveBtn.addEventListener("click", () => {
      if (moved) return;
      moved = true;
      ipVal.textContent = MALL_IP;
      const r = ipPage.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      netStatus.textContent = "Moved to the mall's Wi-Fi — a different network entirely.";
      moveBtn.disabled = true;
      whichChanged.hidden = false;
      check3("moved");
    });

    pickMac.addEventListener("click", () => {
      if (!moved || identified) return;
      toast("Look at Page 1 again — did the engraving itself actually move?");
      status.textContent = "Compare both pages once more before picking.";
    });
    pickIp.addEventListener("click", () => {
      if (!moved || identified) return;
      identified = true;
      status.textContent = "Right page — only the IP page was stamped fresh by the new network. The MAC page stayed exactly as it was engraved.";
      check3("identified");
    });
  })();

  /* ═══ D4: running out of numbers — reveal both address spaces ═══ */
  (function () {
    const ipv4Reveal = $("#ipv4Reveal4"), ipv6Reveal = $("#ipv6Reveal4");
    const check4 = makeChips($("#chips4"), ["ipv4", "ipv6"],
      () => awardStar("d4", "Two address spaces revealed side by side — IPv4's few billion, which the world quietly outgrew, and IPv6's number so large it needed a name most people have never heard."),
      k => (k === "ipv4" ? "IPv4's address space" : "IPv6's address space"),
      (label, remaining) => "Revealed " + label + " — " + remaining + " more to see.");

    $("#showIpv4Btn4").addEventListener("click", () => {
      ipv4Reveal.hidden = false;
      const r = ipv4Reveal.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      check4("ipv4");
    });
    $("#showIpv6Btn4").addEventListener("click", () => {
      ipv6Reveal.hidden = false;
      const r = ipv6Reveal.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      check4("ipv6");
    });
  })();

  /* ═══ D5: the postmaster — operate the router for three packets ═══ */
  (function () {
    const PACKETS = [
      { num: 1, to: "203.0.113.5", from: "192.168.1.42", payload: "PHOTO" },
      { num: 2, to: "203.0.113.5", from: "192.168.1.42", payload: "CAPTION" },
      { num: 3, to: "198.51.100.9", from: "192.168.1.42", payload: "REPLY" }
    ];
    const queue = $("#queue5"), delivered = $("#delivered5"), router = $("#routerNode5");
    const forwardBtn = $("#forwardBtn5"), note = $("#routerNote5");
    const cardEls = {};
    let nextIndex = 0;

    function buildCard(p) {
      const card = document.createElement("div"); card.className = "tn-packet-card"; card.dataset.num = p.num;
      card.innerHTML =
        '<div class="tn-packet-part tn-packet-header">#' + p.num + ' — To: ' + p.to + '</div>' +
        '<div class="tn-packet-part tn-packet-payload">' + p.payload + '</div>';
      cardEls[p.num] = card;
      return card;
    }
    PACKETS.forEach(p => queue.appendChild(buildCard(p)));

    forwardBtn.addEventListener("click", () => {
      if (nextIndex >= PACKETS.length) return;
      const p = PACKETS[nextIndex];
      const card = cardEls[p.num];
      router.classList.add("tn-router-active");
      setTimeout(() => router.classList.remove("tn-router-active"), reduceMotion ? 0 : 500);
      card.classList.add("tn-delivered");
      delivered.appendChild(card);
      const r = card.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      note.textContent = "The router read packet " + p.num + "'s header — destination " + p.to + " — and forwarded it straight across, untouched.";
      nextIndex++;
      if (nextIndex === PACKETS.length) {
        forwardBtn.disabled = true;
        awardStar("d5", "Three packets, three headers read, three forwards — a router never builds a message or stores it, it just sends each one on toward the address already written in its header.");
      }
    });
  })();
