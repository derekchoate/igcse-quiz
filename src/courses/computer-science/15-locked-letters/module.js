/* ================= Module 15 — Locked Letters =================
   Signature interaction: a two-lockbox bench. D1 is the symmetric side — a
   shift-key scramble/unscramble the learner drives with a slider. D2 is an
   automated courier-log demonstration of the shared-key flaw (mirroring the
   ARQ log pattern in Module 14's D5). D3 is the asymmetric side — a
   sequential lock / snoop-attempt / unlock reveal on a single lockbox (no
   drag needed: only one padlock and one key ever act on one box). D4 and D5
   are hand-rolled dual tap+drag sorts (pointer events, document-bound),
   mirroring Module 13's D1/D5 and Module 14's D2 — the shared `matcher` kit
   hardcodes awardStar("d3", ...) with Module 9's pseudocode-pairing wording,
   and this module's own #d3 is the padlock trick (not a matching exercise),
   so reusing the kit here would award the wrong discovery with the wrong
   copy. D5 — the actual plaintext/ciphertext/key drag-pair — is therefore
   hand-rolled too, not pulled from `matcher`.
   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. */

  /* ═══ D1: scramble with a shared key — Caesar-style shift cipher ═══ */
  const PLAIN1 = "MEET AT THE CANTEEN";
  function shiftChar(c, k) {
    if (c < "A" || c > "Z") return c;
    const code = c.charCodeAt(0) - 65;
    return String.fromCharCode((((code + k) % 26) + 26) % 26 + 65);
  }
  function shiftMsg(msg, k) { return msg.split("").map(c => shiftChar(c, k)).join(""); }

  const keySlider1 = $("#keySlider1"), keyVal1 = $("#keyVal1");
  const scrambleBtn1 = $("#scrambleBtn1"), unscrambleBtn1 = $("#unscrambleBtn1");
  const cipherOut1 = $("#cipherOut1"), plainOut1 = $("#plainOut1");
  let lastKey1 = null, lastCipher1 = null;

  keySlider1.addEventListener("input", () => { keyVal1.textContent = "Key: " + keySlider1.value; });

  const check1 = makeChips($("#chips1"), ["small", "large"],
    () => awardStar("d1", "A small key and a large key, both scrambled and unscrambled cleanly — same trick, same result, whatever number you pick."),
    k => (k === "small" ? "a small key" : "a large key"),
    (label, remaining) => "Scrambled and unscrambled with " + label + ". " + remaining + " more to try.");

  scrambleBtn1.addEventListener("click", () => {
    lastKey1 = Number(keySlider1.value);
    lastCipher1 = shiftMsg(PLAIN1, lastKey1);
    cipherOut1.textContent = "Ciphertext: " + lastCipher1;
    plainOut1.textContent = "";
    unscrambleBtn1.hidden = false;
  });
  unscrambleBtn1.addEventListener("click", () => {
    if (lastKey1 === null) return;
    const recovered = shiftMsg(lastCipher1, -lastKey1);
    plainOut1.textContent = "Unscrambled: " + recovered + " — matches the original, letter for letter.";
    check1(lastKey1 <= 9 ? "small" : (lastKey1 >= 17 ? "large" : null));
  });

  /* ═══ D2: the courier problem — automated log, mirrors Module 14 D5's ARQ log ═══ */
  const COURIER_LOG = [
    { text: "You: writing the shared key on a slip of paper for the courier to carry.", cls: "you" },
    { text: "Courier: setting off across town toward your friend.", cls: "courier" },
    { text: "Snoop: quietly copies the key while the courier passes their desk — the courier notices nothing.", cls: "snoop" },
    { text: "Friend: receives the slip. It looks completely untouched — the key travelled to them exactly as sent.", cls: "friend" },
    { text: "You: later, sending a locked message to your friend, using this shared key.", cls: "you" },
    { text: "Snoop: unlocks their own copy of that very message, using the copy of the key taken earlier.", cls: "snoop" }
  ];
  const courierLog2 = $("#courierLog2");
  let sending2 = false;
  $("#sendKeyBtn2").addEventListener("click", () => {
    if (sending2) return;
    sending2 = true;
    courierLog2.innerHTML = "";
    COURIER_LOG.forEach((step, i) => {
      const delay = reduceMotion ? 0 : i * 550;
      setTimeout(() => {
        const line = document.createElement("div");
        line.className = "courier-line " + step.cls;
        line.textContent = step.text;
        courierLog2.appendChild(line);
        if (i === COURIER_LOG.length - 1) {
          sending2 = false;
          awardStar("d2", "Nothing was sent wrong and nobody made a mistake — the key was copied without either of you knowing, simply because a shared key has to travel to be shared. That's the one problem symmetric encryption can never fully solve on its own.");
        }
      }, delay);
    });
  });

  /* ═══ D3: the open padlock trick — sequential lock / snoop / unlock reveal ═══
     Only one padlock and one key ever act on one box, so this is a plain
     three-button reveal (like Module 14 D3/D4's hidden-until-ready send
     button) rather than a drag interaction. */
  const PLAIN3 = "MEET AT THE CANTEEN";
  const lockboxText3 = $("#lockboxText3"), lockboxBadge3 = $("#lockboxBadge3"), lockStatus3 = $("#lockStatus3");
  const lockBtn3 = $("#lockBtn3"), snoopBtn3 = $("#snoopBtn3"), unlockBtn3 = $("#unlockBtn3");

  lockBtn3.addEventListener("click", () => {
    lockboxText3.textContent = "— locked, unreadable without the private key —";
    lockboxBadge3.classList.add("locked");
    lockStatus3.textContent = "Locked with a public padlock — anyone could have picked one up and done exactly this.";
    lockBtn3.hidden = true;
    snoopBtn3.hidden = false;
  });
  snoopBtn3.addEventListener("click", () => {
    lockStatus3.textContent = "The snoop tries an identical public padlock against the lock… nothing happens. A padlock only ever closes something — it was never built to open anything, not even a perfect copy of itself.";
    snoopBtn3.hidden = true;
    unlockBtn3.hidden = false;
  });
  unlockBtn3.addEventListener("click", () => {
    lockboxText3.textContent = PLAIN3;
    lockboxBadge3.classList.remove("locked");
    lockStatus3.textContent = "Unlocked with the one private key — the only key that was ever made, and it was never handed to anyone.";
    unlockBtn3.hidden = true;
    awardStar("d3", "A padlock anyone could use, a snoop who genuinely couldn't open what it locked, and a private key that never left home — that's asymmetric encryption, start to finish.");
  });

  /* ═══ D4: which is which — sort six scenarios onto Symmetric / Asymmetric ═══
     Hand-rolled dual tap+drag path (pointer events, document-bound), mirroring
     Module 13's D1/D5 and Module 14's D2 — a 6-into-2 shape the shared
     `matcher` kit doesn't fit (see file header). */
  const SCENARIOS4 = [
    { id: "s1", label: "Two friends who agreed on a secret number before they ever went online, and use that exact same number every time they message each other.", ans: "Symmetric" },
    { id: "s2", label: "Two branches of the same bank, sharing one passcode set up in advance, used to encrypt transfers between them.", ans: "Symmetric" },
    { id: "s3", label: "A pair of walkie-talkies programmed with the same secret code at the factory, before they were ever sold.", ans: "Symmetric" },
    { id: "s4", label: "The padlock icon that appears the instant you visit a shopping website you've never used before — no prior meeting needed.", ans: "Asymmetric" },
    { id: "s5", label: "A messaging app that generates a brand-new lock-and-key pair for you the moment you install it, before you've told anyone anything.", ans: "Asymmetric" },
    { id: "s6", label: "Posting your padlock (but never your key) publicly, so that literally any stranger can lock a message that only you can open.", ans: "Asymmetric" }
  ];
  const scenarioEls4 = {}, benchEls4 = {};
  let selectedScenario4 = null, placed4 = 0;
  const pool4 = $("#scenarioPool4"), status4 = $("#status4");

  function selectScenario4(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedScenario4 === id) {
      btn.classList.remove("sel"); selectedScenario4 = null;
      status4.textContent = "Tap a scenario to begin.";
      return;
    }
    $$(".scenario-chip", pool4).forEach(c => c.classList.remove("sel"));
    selectedScenario4 = id; btn.classList.add("sel");
    status4.textContent = "Now tap the bench you think this belongs on.";
  }
  function tryPlaceScenario4(key) {
    if (!selectedScenario4) return;
    const item = SCENARIOS4.find(x => x.id === selectedScenario4);
    const btn = scenarioEls4[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      const line = document.createElement("div"); line.className = "bench-item"; line.textContent = item.label;
      benchEls4[key].list.appendChild(line);
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed4++; selectedScenario4 = null;
      if (placed4 === SCENARIOS4.length) {
        status4.textContent = "All six sorted — symmetric and asymmetric, every one on its bench.";
        awardStar("d4", "Six real situations, sorted by one question: did the two sides agree a secret in advance, or did one side just publish something anyone could use?");
      } else {
        status4.textContent = "That's the one. " + (SCENARIOS4.length - placed4) + " more to go.";
      }
    } else {
      toast("Not that bench — think again: did the two sides have to agree on something together beforehand, or could a total stranger use it straight away?");
      btn.classList.remove("sel"); selectedScenario4 = null;
      status4.textContent = "Tap a scenario to try again.";
    }
  }
  function benchUnder4(e) {
    if (dragGhost4) dragGhost4.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost4) dragGhost4.style.visibility = "";
    const bench = el && el.closest ? el.closest(".bench") : null;
    if (!bench) return null;
    for (const k in benchEls4) { if (benchEls4[k].wrap === bench) return k; }
    return null;
  }
  function markHover4(key) {
    Object.keys(benchEls4).forEach(k => benchEls4[k].wrap.classList.toggle("drop-ok", k === key));
  }
  let dragId4 = null, dragging4 = false, dragGhost4 = null, dragPtrId4 = null;
  let dragStartX4 = 0, dragStartY4 = 0, dragOffX4 = 0, dragOffY4 = 0;
  function dragStart4(e, id, btn) {
    if (btn.classList.contains("placed")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragId4 = id; dragPtrId4 = e.pointerId; dragging4 = false;
    dragStartX4 = e.clientX; dragStartY4 = e.clientY;
    document.addEventListener("pointermove", dragMove4);
    document.addEventListener("pointerup", dragEnd4);
    document.addEventListener("pointercancel", dragEnd4);
  }
  function dragMove4(e) {
    if (dragId4 === null || e.pointerId !== dragPtrId4) return;
    const btn = scenarioEls4[dragId4];
    if (!dragging4) {
      if (Math.hypot(e.clientX - dragStartX4, e.clientY - dragStartY4) < 6) return;
      dragging4 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX4 = dragStartX4 - rect.left; dragOffY4 = dragStartY4 - rect.top;
      dragGhost4 = btn.cloneNode(true);
      dragGhost4.classList.add("scenario-ghost"); dragGhost4.classList.remove("sel");
      dragGhost4.style.width = rect.width + "px";
      document.body.appendChild(dragGhost4);
      btn.classList.add("dragging");
      $$(".scenario-chip", pool4).forEach(c => c.classList.remove("sel"));
      selectedScenario4 = null;
    }
    e.preventDefault();
    dragGhost4.style.left = (e.clientX - dragOffX4) + "px";
    dragGhost4.style.top = (e.clientY - dragOffY4) + "px";
    markHover4(benchUnder4(e));
  }
  function dragEnd4(e) {
    if (dragId4 === null || e.pointerId !== dragPtrId4) return;
    const id = dragId4, btn = scenarioEls4[id];
    document.removeEventListener("pointermove", dragMove4);
    document.removeEventListener("pointerup", dragEnd4);
    document.removeEventListener("pointercancel", dragEnd4);
    if (dragging4) {
      const key = benchUnder4(e);
      markHover4(null);
      if (dragGhost4) { dragGhost4.remove(); dragGhost4 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedScenario4 = id; tryPlaceScenario4(key); }
    } else if (e.type !== "pointercancel") {
      selectScenario4(id, btn);
    }
    dragId4 = null; dragging4 = false; dragPtrId4 = null;
  }
  function buildScenarioChip4(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "scenario-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging4) selectScenario4(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart4(e, item.id, b));
    scenarioEls4[item.id] = b;
    return b;
  }
  function buildBench4(key) {
    const wrap = document.createElement("div"); wrap.className = "bench";
    const head = document.createElement("button");
    head.type = "button"; head.className = "bench-head"; head.textContent = key + " bench";
    head.addEventListener("click", () => tryPlaceScenario4(key));
    const list = document.createElement("div"); list.className = "bench-list"; list.setAttribute("aria-live", "polite");
    wrap.appendChild(head); wrap.appendChild(list);
    benchEls4[key] = { wrap, list, head };
    return wrap;
  }
  ["Symmetric", "Asymmetric"].forEach(key => $("#benches4").appendChild(buildBench4(key)));
  SCENARIOS4.forEach(item => pool4.appendChild(buildScenarioChip4(item)));

  /* ═══ D5: vocabulary lock-in — plaintext / ciphertext / key drag-pair ═══
     Hand-rolled dual tap+drag path, same shape as D4 above — deliberately not
     the `matcher` kit (see file header: this module's real #d3 is the padlock
     trick, so matcher's hardcoded awardStar("d3", ...) would be wrong here). */
  const DEFS5 = [
    { id: "p1", label: "The original, readable message, before anything has been done to it.", ans: "Plaintext" },
    { id: "p2", label: "What a message looks like after it's been scrambled — unreadable without the right key.", ans: "Ciphertext" },
    { id: "p3", label: "The piece of information — a number, or a padlock-and-private-key pair — that controls how the scrambling and unscrambling happens.", ans: "Key" }
  ];
  const defEls5 = {}, termEls5 = {};
  let selectedDef5 = null, placed5 = 0;
  const pool5 = $("#defPool5"), status5 = $("#status5");

  function selectDef5(id, btn) {
    if (btn.classList.contains("placed")) return;
    if (selectedDef5 === id) {
      btn.classList.remove("sel"); selectedDef5 = null;
      status5.textContent = "Tap a definition to begin.";
      return;
    }
    $$(".def-chip", pool5).forEach(c => c.classList.remove("sel"));
    selectedDef5 = id; btn.classList.add("sel");
    status5.textContent = "Now tap the term you think this definition belongs to.";
  }
  function tryPlaceDef5(key) {
    if (!selectedDef5) return;
    const item = DEFS5.find(x => x.id === selectedDef5);
    const btn = defEls5[item.id];
    if (item.ans === key) {
      btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
      termEls5[key].list.textContent = item.label;
      termEls5[key].wrap.classList.add("filled");
      const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      placed5++; selectedDef5 = null;
      if (placed5 === DEFS5.length) {
        status5.textContent = "All three matched — plaintext, ciphertext, key, locked in for good.";
        awardStar("d5", "Three words, three exact meanings, matched without a single one left over — plaintext, ciphertext and key are yours now.");
      } else {
        status5.textContent = "That's the one. " + (DEFS5.length - placed5) + " more to go.";
      }
    } else {
      toast("Not that term — read the definition again and think about which of the three it's really describing.");
      btn.classList.remove("sel"); selectedDef5 = null;
      status5.textContent = "Tap a definition to try again.";
    }
  }
  function termUnder5(e) {
    if (dragGhost5) dragGhost5.style.visibility = "hidden";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (dragGhost5) dragGhost5.style.visibility = "";
    const bin = el && el.closest ? el.closest(".term-bin") : null;
    if (!bin) return null;
    for (const k in termEls5) { if (termEls5[k].wrap === bin) return k; }
    return null;
  }
  function markHover5(key) {
    Object.keys(termEls5).forEach(k => termEls5[k].wrap.classList.toggle("drop-ok", k === key));
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
    const btn = defEls5[dragId5];
    if (!dragging5) {
      if (Math.hypot(e.clientX - dragStartX5, e.clientY - dragStartY5) < 6) return;
      dragging5 = true;
      const rect = btn.getBoundingClientRect();
      dragOffX5 = dragStartX5 - rect.left; dragOffY5 = dragStartY5 - rect.top;
      dragGhost5 = btn.cloneNode(true);
      dragGhost5.classList.add("def-ghost"); dragGhost5.classList.remove("sel");
      dragGhost5.style.width = rect.width + "px";
      document.body.appendChild(dragGhost5);
      btn.classList.add("dragging");
      $$(".def-chip", pool5).forEach(c => c.classList.remove("sel"));
      selectedDef5 = null;
    }
    e.preventDefault();
    dragGhost5.style.left = (e.clientX - dragOffX5) + "px";
    dragGhost5.style.top = (e.clientY - dragOffY5) + "px";
    markHover5(termUnder5(e));
  }
  function dragEnd5(e) {
    if (dragId5 === null || e.pointerId !== dragPtrId5) return;
    const id = dragId5, btn = defEls5[id];
    document.removeEventListener("pointermove", dragMove5);
    document.removeEventListener("pointerup", dragEnd5);
    document.removeEventListener("pointercancel", dragEnd5);
    if (dragging5) {
      const key = termUnder5(e);
      markHover5(null);
      if (dragGhost5) { dragGhost5.remove(); dragGhost5 = null; }
      btn.classList.remove("dragging");
      if (key) { selectedDef5 = id; tryPlaceDef5(key); }
    } else if (e.type !== "pointercancel") {
      selectDef5(id, btn);
    }
    dragId5 = null; dragging5 = false; dragPtrId5 = null;
  }
  function buildDefChip5(item) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "def-chip"; b.textContent = item.label; b.dataset.id = item.id;
    b.addEventListener("click", () => { if (!dragging5) selectDef5(item.id, b); });
    b.addEventListener("pointerdown", e => dragStart5(e, item.id, b));
    defEls5[item.id] = b;
    return b;
  }
  function buildTermBin5(key) {
    const wrap = document.createElement("div"); wrap.className = "term-bin";
    const head = document.createElement("button");
    head.type = "button"; head.className = "term-bin-head"; head.textContent = key;
    head.addEventListener("click", () => tryPlaceDef5(key));
    const list = document.createElement("div"); list.className = "term-bin-body"; list.setAttribute("aria-live", "polite");
    list.textContent = "—";
    wrap.appendChild(head); wrap.appendChild(list);
    termEls5[key] = { wrap, list, head };
    return wrap;
  }
  ["Plaintext", "Ciphertext", "Key"].forEach(key => $("#termBins5").appendChild(buildTermBin5(key)));
  DEFS5.forEach(item => pool5.appendChild(buildDefChip5(item)));
