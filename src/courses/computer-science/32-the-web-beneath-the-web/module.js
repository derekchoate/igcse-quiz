
  /* ================= Module 32 — The Web Beneath the Web =================
   Signature interaction (D2): an address decoder + journey map. The learner
   picks or types a URL, watches it split into protocol / domain name / page
   name, then advances a six-stop relay one tap at a time — browser, DNS
   lookup, IP returned, request sent, packets (a Module 13 cameo), page
   assembles. Advancing is entirely tap-driven (no timers, per the design
   contract's "nothing timed, ever") and every revealed stop stays clickable
   afterwards, so it is genuinely pausable and re-inspectable, not just an
   auto-playing animation.

   D1 and D5's cookie sort share one hand-rolled tap-or-drag bin sorter,
   makeBinSorter() below — same shape as Module 13's D1, Module 15's D4,
   Module 26's D1 and Module 27's D1/D2 (pool of chips, bins with a
   clickable head, pointer-drag as an alternate path) — not the shared
   `matcher` kit, which hardcodes awardStar("d3", ...) for Module 9's
   pseudocode pairing and would award the wrong discovery here regardless.

   D3's phonebook reuses Module 26's IP-address vocabulary directly (one
   lookup even resolves to the exact address Module 26's router forwarded
   packets to) and D4's padlock pair reuses Module 15's lockbox markup and
   sequential lock/snoop/unlock reveal, run twice side by side so a snoop's
   two outcomes — reads everything vs reads nothing readable — sit right
   next to each other.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. */

  /* ═══ shared local factory: tap-or-drag chip → bin sorter (D1, D5) ═══ */
  function makeBinSorter(opts) {
    const { pool, binsContainer, status, items, bins, doneStatus, wrongMsg, onDone } = opts;
    const itemEls = {}, binEls = {};
    let selected = null, placed = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap a statement to begin.";
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
        status.textContent = "Tap a statement to try again.";
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

  /* ═══ D1: roads vs deliveries — internet vs World Wide Web ═══ */
  makeBinSorter({
    pool: $("#pool1"),
    binsContainer: $("#bins1"),
    status: $("#status1"),
    items: [
      { id: "cables", label: "The cables, satellites and routers physically carrying data between devices.", ans: "Internet" },
      { id: "existed", label: "Existed for years, carrying email and other data, before anyone had invented a website.", ans: "Internet" },
      { id: "network", label: "The huge network of networks that email, gaming, video calls and the web all travel across.", ans: "Internet" },
      { id: "pages", label: "The collection of websites and pages you reach by typing an address into a browser.", ans: "World Wide Web" },
      { id: "builtOn", label: "Built on top of the internet — one particular way of using it, not the only one.", ans: "World Wide Web" },
      { id: "htmlHttp", label: "What HTML, HTTP and a URL are all part of.", ans: "World Wide Web" }
    ],
    bins: [
      { key: "Internet", label: "The Internet — the roads" },
      { key: "World Wide Web", label: "The World Wide Web — the deliveries" }
    ],
    doneStatus: "All six sorted — the roads on one pile, one particular delivery riding on them on the other.",
    wrongMsg: "Not that pile — ask yourself: would this still be true even if nobody had ever invented a website?",
    onDone: () => awardStar("d1", "Six statements sorted onto exactly the distinction Cambridge cares about most here — the internet is the infrastructure, and the World Wide Web is the collection of pages travelling over it.")
  });

  /* ═══ D2: explode an address, then run the six-stop relay it sets off ═══
     Signature interaction. Exploding a URL never fails — whatever is typed
     is simply parsed, and unparsable text gets a gentle steer, never an
     error state. The relay is advanced one tap at a time (no timers) and
     every revealed stop stays inspectable afterwards. */
  (function () {
    const CANDIDATES = [
      "https://campus-portal.edu.my/timetable",
      "https://quickbites-delivery.com/menu/today",
      "http://cloudgames.net/scores/leaderboard"
    ];
    const picksHost = $("#urlPicks2"), input = $("#urlInput2"), partsHost = $("#urlParts2");

    function explodeUrl(raw) {
      const trimmed = (raw || "").trim();
      const m = trimmed.match(/^(https?):\/\/([^/\s]+)(\/[^\s]*)?$/i);
      if (!m) return null;
      return { protocol: m[1].toLowerCase(), domain: m[2], path: m[3] || "/" };
    }
    function renderParts(raw) {
      const parts = explodeUrl(raw);
      partsHost.innerHTML = "";
      if (!parts) {
        const p = document.createElement("p");
        p.className = "ww-url-hint";
        p.textContent = "Start with https:// or http://, then the domain name, to see it split into parts.";
        partsHost.appendChild(p);
        return;
      }
      [
        ["Protocol", parts.protocol.toUpperCase()],
        ["Domain name", parts.domain],
        ["Page or file name", parts.path]
      ].forEach(([label, value]) => {
        const card = document.createElement("div");
        card.className = "ww-part";
        card.innerHTML = '<span class="ww-part-label">' + label + '</span><span class="ww-part-value"></span>';
        $(".ww-part-value", card).textContent = value;
        partsHost.appendChild(card);
      });
    }

    CANDIDATES.forEach((url, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "loop-btn" + (i === 0 ? " primary" : "");
      b.textContent = url;
      b.addEventListener("click", () => {
        input.value = url;
        renderParts(url);
      });
      picksHost.appendChild(b);
    });
    input.addEventListener("input", () => renderParts(input.value));
    renderParts(CANDIDATES[0]);

    const RELAY_STAGES = [
      { label: "Browser", detail: "Your browser holds the address you typed — but a domain name means nothing to the network itself. Before anything else can happen, it needs a number, not a name." },
      { label: "DNS lookup", detail: "The browser asks a domain name server (DNS) the one question that matters right now: what's the IP address behind this domain name?" },
      { label: "IP returned", detail: "The DNS server answers with the domain's IP address. Only now does the browser actually know where on the network to send anything." },
      { label: "Request sent", detail: "The browser sends a request — following HTTP or HTTPS's rules — to the web server living at that IP address, asking for the exact page you typed." },
      { label: "Packets", detail: "That request, and the page that comes back, doesn't travel in one piece. Same as Module 13: it's torn into packets, sent across the network, and reassembled the moment they've all arrived." },
      { label: "Page assembles", detail: "The web server's reply arrives, HTML and all, and your browser turns it into the page you actually see." }
    ];
    const relayHost = $("#relay2"), caption = $("#relayCaption2");
    const nextBtn = $("#relayNextBtn2"), resetBtn = $("#relayResetBtn2");
    let revealed = 0, relayComplete = false;

    const nodeEls = RELAY_STAGES.map((stage, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "ww-relay-node"; b.disabled = true;
      b.setAttribute("role", "listitem");
      b.innerHTML = '<span class="ww-relay-num">' + (i + 1) + '.</span><span class="ww-relay-label">' + stage.label + "</span>";
      b.addEventListener("click", () => { if (i < revealed) inspect(i); });
      relayHost.appendChild(b);
      return b;
    });

    function inspect(i) {
      nodeEls.forEach((el, idx) => el.classList.toggle("focused", idx === i));
      caption.textContent = RELAY_STAGES[i].detail;
    }

    nextBtn.addEventListener("click", () => {
      if (revealed >= RELAY_STAGES.length) return;
      const i = revealed;
      nodeEls[i].disabled = false;
      nodeEls[i].classList.add("done");
      inspect(i);
      const r = nodeEls[i].getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      revealed++;
      if (revealed === RELAY_STAGES.length) {
        nextBtn.hidden = true;
        resetBtn.hidden = false;
        if (!relayComplete) {
          relayComplete = true;
          awardStar("d2", "The whole relay, stop by stop — browser, DNS lookup, IP returned, request, packets, page assembled — the entire hidden trip one address bar quietly sets off.");
        }
      } else {
        nextBtn.textContent = "Advance the relay ▶ (" + revealed + " of " + RELAY_STAGES.length + " so far)";
      }
    });
    resetBtn.addEventListener("click", () => {
      revealed = 0;
      nodeEls.forEach(b => { b.disabled = true; b.classList.remove("done", "focused"); });
      caption.textContent = "Press \"Advance the relay\" to begin again — the star you've already earned stays right where it is.";
      nextBtn.hidden = false; resetBtn.hidden = true;
      nextBtn.textContent = "Advance the relay ▶";
    });
  })();

  /* ═══ D3: the phonebook nobody sees — DNS as name→number lookup ═══
     Reuses Module 26's IP-address vocabulary; one lookup resolves to the
     exact address Module 26's router forwarded real packets to. */
  (function () {
    const LOOKUPS = [
      { id: "campus", domain: "campus-portal.edu.my", ip: "203.0.113.5", note: "That's the very address Module 26's router forwarded real packets to — now you've seen exactly where a number like that comes from in the first place." },
      { id: "quickbites", domain: "quickbites-delivery.com", ip: "198.51.100.42", note: "A completely different domain, a completely different IP — the phonebook holds one row per domain, however many are asked for." },
      { id: "cloudgames", domain: "cloudgames.net", ip: "192.0.2.17", note: "Three domains, three lookups, three numbers — the browser never has to remember any of them; it just asks again next time." }
    ];
    const btnRow = $("#lookupBtns3"), body = $("#phoneBody3"), note = $("#phoneNote3");

    const check3 = makeChips($("#chips3"), LOOKUPS.map(l => l.id),
      () => awardStar("d3", "Three domains looked up, three IP addresses returned — the phonebook nobody sees, doing the one job that makes every address bar actually work."),
      id => LOOKUPS.find(l => l.id === id).domain,
      (label, remaining) => "Looked up " + label + " — " + remaining + " more to go.");

    LOOKUPS.forEach(item => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "loop-btn";
      b.textContent = "Look up " + item.domain + " ▶";
      b.addEventListener("click", () => {
        if (b.disabled) return;
        b.disabled = true;
        const tr = document.createElement("tr");
        const tdD = document.createElement("td"); tdD.textContent = item.domain;
        const tdI = document.createElement("td"); tdI.textContent = item.ip;
        tr.appendChild(tdD); tr.appendChild(tdI);
        body.appendChild(tr);
        note.textContent = item.note;
        check3(item.id);
      });
      btnRow.appendChild(b);
    });
  })();

  /* ═══ D4: the padlock — HTTP vs HTTPS, two lockboxes run side by side ═══
     Each side is a sequential lock/snoop reveal, mirroring Module 15 D3's
     single lockbox — run twice so both outcomes sit next to each other. */
  (function () {
    const MSG = "user: mei_19 · pass: bandungraya";

    $("#sendHttpBtn").addEventListener("click", () => {
      $("#httpStatus").textContent = "Sent in the open — HTTP applies no locking at all.";
      $("#sendHttpBtn").hidden = true;
      $("#snoopHttpBtn").hidden = false;
    });
    $("#sendHttpsBtn").addEventListener("click", () => {
      $("#lockboxTextHttps").textContent = "— locked, unreadable without the private key the server alone holds —";
      $("#lockboxBadgeHttps").classList.add("locked");
      $("#httpsStatus").textContent = "Locked before it ever left the device — the same public-padlock trick as Module 15.";
      $("#sendHttpsBtn").hidden = true;
      $("#snoopHttpsBtn").hidden = false;
    });

    // Hand-rolled 2-target auto-detect (not the `chips` kit's makeChips —
    // this discovery has no visible chip row, since the two lockboxes
    // already show progress on their own; a bare hit-tracking closure is
    // all that's needed to notice when both journeys have been run).
    const check4 = (function () {
      const targets = ["http", "https"];
      const hit = {};
      return function (key) {
        if (!targets.includes(key) || hit[key]) return;
        hit[key] = true;
        if (targets.every(t => hit[t])) {
          $("#padlockNote").hidden = false;
          $("#padlockNote").textContent = "Notice what the snoop could still see, even on the HTTPS side: which website you were talking to. The domain name still has to travel in the open, or the network could never route the request there at all — that's how the DNS lookup and Module 26's routers ever get to do their jobs. What HTTPS locks away is everything you exchange with that site — your username, your password, the page itself — not the fact that you visited it.";
          awardStar("d4", "The same login, sent two ways — HTTP handed it over in plain sight, HTTPS locked it before it ever left the device. Same message, two very different outcomes for the snoop.");
        }
      };
    })();

    $("#snoopHttpBtn").addEventListener("click", () => {
      $("#httpStatus").textContent = "The snoop reads it instantly: \"" + MSG + "\" — sent as plain text, so there was nothing to unlock.";
      $("#snoopHttpBtn").hidden = true;
      check4("http");
    });
    $("#snoopHttpsBtn").addEventListener("click", () => {
      $("#httpsStatus").textContent = "The snoop intercepts the exact same bytes and sees only scrambled ciphertext — no private key, no way in.";
      $("#snoopHttpsBtn").hidden = true;
      check4("https");
    });
  })();

  /* ═══ D5: the memory of websites — session vs persistent, then a sort ═══ */
  (function () {
    let tabClosed = false, sortDone = false;
    function maybeFinish() {
      if (tabClosed && sortDone) {
        awardStar("d5", "You watched a session cookie evaporate with its tab while a persistent one carried on regardless, then sorted six real uses onto an honest pile and a watch-it pile — cookies, fully demystified.");
      }
    }

    $("#closeTabBtn5").addEventListener("click", () => {
      $("#wristbandSession").classList.add("gone");
      $("#wristbandSessionState").textContent = "Gone. It only ever existed for as long as that tab was open — nobody deleted it on purpose, there was simply nothing left to evaporate.";
      $("#wristbandPersistentState").textContent = "Still here. It was stamped with its own expiry date, and a closed tab doesn't touch it at all.";
      $("#tabStatus5").textContent = "Tab closed — one wristband vanished, one didn't.";
      const r = $("#wristbandSession").getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      tabClosed = true;
      maybeFinish();
    });

    makeBinSorter({
      pool: $("#pool5"),
      binsContainer: $("#bins5"),
      status: $("#status5"),
      items: [
        { id: "basket", label: "Keeping the items in your basket there while you keep browsing the same store.", ans: "Honest" },
        { id: "login", label: "Remembering you're logged in, so you're not typing your password in on every single page.", ans: "Honest" },
        { id: "settings", label: "Remembering your preferred settings — language, dark mode — for next time you visit.", ans: "Honest" },
        { id: "form", label: "Remembering a form's details on the same site so you don't have to retype them.", ans: "Honest" },
        { id: "adTrack", label: "An advertiser's cookie that follows which other websites you visit afterwards, building up a profile of your interests.", ans: "Watch" },
        { id: "crossSite", label: "A cookie that keeps a record of what you looked at, shared with companies you never directly visited.", ans: "Watch" }
      ],
      bins: [
        { key: "Honest", label: "Everyday, honest uses" },
        { key: "Watch", label: "Worth keeping an eye on" }
      ],
      doneStatus: "All six sorted — most of what a cookie does is quietly helpful; the exceptions are the ones that follow you elsewhere.",
      wrongMsg: "Not that pile — ask yourself: is this the site remembering something about your own visit purely to help you, or is it following you somewhere else?",
      onDone: () => { sortDone = true; maybeFinish(); }
    });
  })();
