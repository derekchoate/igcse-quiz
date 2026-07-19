
  /* ================= Module 35 — Machines that Act Alone =================
   Signature interaction (D1-D3): a build-a-loop workbench. Set an IF-
   threshold rule on a dial (the `cycler` kit), then step through a day/
   night cycle one reading at a time and watch a sensor reading compared
   against that stored value flip an actuator on and off, entirely
   unattended. D1 wires a single sensor->rule->actuator loop; D2 runs two
   such loops side by side on the same clock so their independent timing
   visibly interleaves; D3 reruns the same shape but the actuator's own
   effect now feeds back into the next reading, so the loop closes on
   itself — the divergence between "what the reading would have been" and
   "what it actually is because the actuator ran" is computed live for
   whichever threshold was picked, never hardcoded to a single value, so
   it stays true whichever of the five preset rules is chosen.

   D4/D5 reuse a local tap-or-drag chip -> bin sorter copied from Module
   18's makeSortBoard (rule of two, not a promoted engine kit — see Module
   18/34's own notes on this pattern) because it already supports a bin
   holding more than one item (listMode) AND a single item accepting more
   than one valid bin (ans as an array) — D4's "dishwasher" card is
   genuinely defensible either way, and needs exactly that.

   Every discovery's nudge-zone carries "Show me one first" as a true
   rung 0 — rendered and clickable immediately alongside the nudge ladder,
   never gated behind another nudge (design contract rule 10).

   Anthropomorphism guardrail: nowhere in this file's copy does the
   microprocessor "decide" anything — it always "compares a reading to a
   stored value." A robot is never defined by its appearance; the three
   characteristics used throughout (Cambridge 0478 syllabus 6.2.2
   verbatim: a mechanical structure or framework; electrical components
   such as sensors, microprocessors and actuators; programmable) are the
   only check applied anywhere in D4.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks,
   toast, awardStar and makeCycler are all in scope. */

  /* ═══ shared local factory: tap-or-drag chip → bin sorter (D4, D5) ═══
     Copied from Module 18's makeSortBoard() — rule of two, not the shared
     `matcher` kit (which hardcodes discovery "d3" — see
     feedback_matcher_kit_hardcoded_d3). Supports listMode (a bin holds
     many items) and items whose `ans` is an array of equally acceptable
     bins, both needed here and not offered by Module 34's simpler
     single-accept copy of the same pattern. */
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
      $$(".sort-chip.sel", cfg.poolEl).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      cfg.statusEl.textContent = cfg.placePrompt;
    }

    function tryPlace(key) {
      if (!selected) return;
      const item = cfg.items.find(x => x.id === selected);
      const btn = itemEls[item.id];
      const bin = binEls[key];

      if (acceptedKeys(item).includes(key)) {
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
      list.className = "sort-bin-list"; list.setAttribute("aria-live", "polite");
      wrap.appendChild(head); wrap.appendChild(list);
      binEls[bin.key] = { wrap, list, head };
      return wrap;
    }
    cfg.bins.forEach(bin => cfg.binsEl.appendChild(buildBin(bin)));
    cfg.items.forEach(item => cfg.poolEl.appendChild(buildChip(item)));
  }

  /* ═══ shared data: the day/night clock used by D1-D3 ═══ */
  const TICKS = ["6:00", "9:00", "12:00", "15:00", "18:00", "21:00", "0:00", "3:00"];

  /* Runs a fixed threshold rule ("greater than") over an ambient reading
     array. When useFeedback is true, an actuator that was ON the previous
     tick pulls this tick's reading down by 3 — the actuator's own effect
     folding back into its next input. */
  function runGreaterThan(ambient, threshold, useFeedback) {
    const states = [], readings = [];
    let prevOn = false;
    for (let i = 0; i < ambient.length; i++) {
      const reading = ambient[i] - (useFeedback && prevOn ? 3 : 0);
      const on = reading > threshold;
      states.push(on); readings.push(reading);
      prevOn = on;
    }
    return { states, readings };
  }

  function runLessThan(ambient, threshold) {
    const states = [], readings = [];
    for (let i = 0; i < ambient.length; i++) {
      readings.push(ambient[i]);
      states.push(ambient[i] < threshold);
    }
    return { states, readings };
  }

  function tickRow(label, readingText, on, actuatorLabel) {
    const row = document.createElement("div");
    row.className = "aw-tick";
    const time = document.createElement("span");
    time.className = "aw-tick-time"; time.textContent = label;
    const read = document.createElement("span");
    read.className = "aw-tick-read"; read.textContent = readingText;
    const state = document.createElement("span");
    state.className = "aw-tick-state " + (on ? "on" : "off");
    state.textContent = actuatorLabel + " " + (on ? "ON" : "off");
    row.appendChild(time); row.appendChild(read); row.appendChild(state);
    return row;
  }

  /* ═══ D1: wire the greenhouse — one sensor, one rule, one actuator ═══ */
  (function () {
    const ruleBtn = $("#ruleBtn1"), runBtn = $("#runBtn1"), timeline = $("#timeline1"), note = $("#note1");
    const AMBIENT_TEMP = [22, 26, 31, 33, 29, 24, 19, 17];
    const THRESHOLDS = [25, 28, 30, 20, 22];
    let threshold;
    const cyc = makeCycler(ruleBtn, THRESHOLDS,
      v => "IF temperature reading > " + v + "°C, turn the fan ON",
      v => { threshold = v; });
    threshold = cyc.value();

    let i = 0, started = false;
    runBtn.addEventListener("click", () => {
      if (!started) { started = true; ruleBtn.disabled = true; }
      const reading = AMBIENT_TEMP[i];
      const on = reading > threshold;
      const row = tickRow(TICKS[i], "Temperature reads " + reading + "°C", on, "Fan");
      timeline.appendChild(row);
      const r = row.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      i++;
      if (i < TICKS.length) {
        runBtn.textContent = "Advance to " + TICKS[i] + " ▶";
      } else {
        runBtn.remove();
        note.hidden = false;
        note.textContent = "A full day and night, and nobody touched the fan once — the reading was compared to your rule, over and over, entirely on its own.";
        awardStar("d1", "You wired a sensor to a rule to an actuator, pressed “Let it live,” and watched it run an entire day unattended. Read, compare, act — that loop is the whole idea.");
      }
    });
  })();

  /* ═══ D2: two rules at once — independent loops, one shared clock ═══ */
  (function () {
    const ruleBtnA = $("#ruleBtn2a"), ruleBtnB = $("#ruleBtn2b"), runBtn = $("#runBtn2"),
      timeline = $("#timeline2"), note = $("#note2");
    const AMBIENT_TEMP = [22, 26, 31, 33, 29, 24, 19, 17];
    const AMBIENT_MOISTURE = [58, 52, 46, 38, 34, 44, 55, 60];
    const THRESHOLDS_TEMP = [25, 28, 30, 20, 22];
    const THRESHOLDS_MOISTURE = [40, 30, 35, 45, 50];
    let tempThreshold, moistureThreshold;
    const cycA = makeCycler(ruleBtnA, THRESHOLDS_TEMP,
      v => "IF temperature reading > " + v + "°C, turn the fan ON",
      v => { tempThreshold = v; });
    const cycB = makeCycler(ruleBtnB, THRESHOLDS_MOISTURE,
      v => "IF moisture reading < " + v + "%, turn the valve ON",
      v => { moistureThreshold = v; });
    tempThreshold = cycA.value(); moistureThreshold = cycB.value();

    let i = 0, started = false;
    runBtn.addEventListener("click", () => {
      if (!started) { started = true; ruleBtnA.disabled = true; ruleBtnB.disabled = true; }
      const tReading = AMBIENT_TEMP[i], tOn = tReading > tempThreshold;
      const mReading = AMBIENT_MOISTURE[i], mOn = mReading < moistureThreshold;

      const row = document.createElement("div");
      row.className = "aw-tick aw-tick-double";
      const time = document.createElement("span");
      time.className = "aw-tick-time"; time.textContent = TICKS[i];
      const pairA = document.createElement("span");
      pairA.className = "aw-tick-pair";
      pairA.innerHTML = "<span class=\"aw-tick-read\">Temp " + tReading + "°C</span><span class=\"aw-tick-state " + (tOn ? "on" : "off") + "\">Fan " + (tOn ? "ON" : "off") + "</span>";
      const pairB = document.createElement("span");
      pairB.className = "aw-tick-pair";
      pairB.innerHTML = "<span class=\"aw-tick-read\">Moisture " + mReading + "%</span><span class=\"aw-tick-state " + (mOn ? "on" : "off") + "\">Valve " + (mOn ? "ON" : "off") + "</span>";
      row.appendChild(time); row.appendChild(pairA); row.appendChild(pairB);
      timeline.appendChild(row);
      const r = row.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);

      i++;
      if (i < TICKS.length) {
        runBtn.textContent = "Advance to " + TICKS[i] + " ▶";
      } else {
        runBtn.remove();
        note.hidden = false;
        note.textContent = "Two independent rules, one shared clock — the fan followed its own schedule and the valve followed its own, and neither one waited for the other.";
        awardStar("d2", "Two loops, running on the same clock, each reacting only to its own sensor. That's what “running at the same time” actually looks like inside an automated system.");
      }
    });
  })();

  /* ═══ D3: the feedback idea — the actuator's own effect closes the loop ═══
     computeRun's divergence check is worked out live for whichever
     threshold was chosen (any of the five presets), never hardcoded to
     one value — see the file banner for why. */
  (function () {
    const ruleBtn = $("#ruleBtn3"), runBtn = $("#runBtn3"), timeline = $("#timeline3"),
      noticeBtn = $("#noticeBtn3"), explainNote = $("#explainNote3");
    const AMBIENT_TEMP = [22, 26, 31, 33, 31, 28, 19, 17];
    const THRESHOLDS = [25, 28, 30, 20, 22];
    let threshold;
    const cyc = makeCycler(ruleBtn, THRESHOLDS,
      v => "IF temperature reading > " + v + "°C, turn the fan ON",
      v => { threshold = v; });
    threshold = cyc.value();

    let i = 0, started = false, lockedThreshold;
    runBtn.addEventListener("click", () => {
      if (!started) { started = true; ruleBtn.disabled = true; lockedThreshold = threshold; }
      const run = runGreaterThan(AMBIENT_TEMP.slice(0, i + 1), lockedThreshold, true);
      const reading = run.readings[i], on = run.states[i];
      const row = tickRow(TICKS[i], "Temperature reads " + reading + "°C", on, "Fan");
      timeline.appendChild(row);
      const r = row.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      i++;
      if (i < TICKS.length) {
        runBtn.textContent = "Advance to " + TICKS[i] + " ▶";
      } else {
        runBtn.remove();
        noticeBtn.hidden = false;
      }
    });

    noticeBtn.addEventListener("click", () => {
      const withFeedback = runGreaterThan(AMBIENT_TEMP, lockedThreshold, true);
      let idx = -1;
      for (let j = 1; j < AMBIENT_TEMP.length; j++) {
        if (!withFeedback.states[j] && AMBIENT_TEMP[j] > lockedThreshold) { idx = j; break; }
      }
      explainNote.hidden = false;
      if (idx !== -1) {
        explainNote.textContent = "At " + TICKS[idx] + ", the outside air alone was still " + AMBIENT_TEMP[idx] + "°C — above your rule of " + lockedThreshold + "°C. But the fan had already been running, so the reading actually taken was " + withFeedback.readings[idx] + "°C — below it. The fan's own draught pulled its next reading down enough to switch itself off. That's the loop closing: the actuator's effect became part of its own next input.";
      } else {
        explainNote.textContent = "For the rule you picked, the night's own cooling would have switched the fan off at some point even without any feedback — but every tick before that, the fan's draught was already quietly stacked on top of the outside air. Set a higher rule above and run it again to watch that stacking actually flip the switch by itself.";
      }
      const r = explainNote.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      awardStar("d3", "The fan's own action changed the very reading it reacts to next — an actuator's effect folding back into its own input. That closed loop is what “feedback” means, in a thermostat, in cruise control, in this greenhouse.");
    });
  })();

  /* ═══ D4: is it a robot? — sort by the three-part check only ═══
     Cambridge 0478 syllabus 6.2.2 verbatim characteristics: a mechanical
     structure or framework; electrical components such as sensors,
     microprocessors and actuators; programmable. The dishwasher card
     genuinely accepts either bin — see the file banner. */
  const ROBOT_ITEMS = [
    { id: "arm", label: "A factory arm — a jointed mechanical body that welds car parts, with sensors, a microprocessor and motors built in, and a different pick-and-place program loaded in for each job.", ans: "Robot" },
    { id: "vacuum", label: "A robot vacuum cleaner — a wheeled body with bump sensors, a microprocessor and drive motors, following a cleaning pattern it can be reprogrammed to change.", ans: "Robot" },
    { id: "drone", label: "A drone — an airframe carrying sensors, a flight-control microprocessor and motors, flying a route it was programmed to follow.", ans: "Robot" },
    { id: "chatbot", label: "A chatbot — lines of code answering messages, with no physical body, no motors, nothing mechanical anywhere.", ans: "NotRobot" },
    { id: "rc", label: "A remote-control car — a body with a motor and a receiver, but every single move is a person's thumb on a control stick, right now, not a stored program.", ans: "NotRobot" },
    { id: "greenhouse", label: "The greenhouse fan system from Discovery 1 — a sensor, a microprocessor and an actuator, genuinely running a program, but scattered through a room rather than built into one self-contained body.", ans: "NotRobot" },
    { id: "dishwasher", label: "A dishwasher — depends on the exact machine. One with a single fixed timer dial is closer to a simple switch than a program; one with sensors checking water clarity and a microprocessor choosing the wash length is much closer to meeting all three.", ans: ["Robot", "NotRobot"] }
  ];
  makeSortBoard({
    poolEl: $("#pool4"), binsEl: $("#bins4"), statusEl: $("#status4"),
    items: ROBOT_ITEMS,
    bins: [
      { key: "Robot", label: "Robot — all three: a body, electrical components, and programmable" },
      { key: "NotRobot", label: "Not a robot — missing at least one of the three" }
    ],
    selectPrompt: "Tap a machine to begin.",
    placePrompt: "Now tap the pile you think it belongs on.",
    retryPrompt: "Tap a machine to try again.",
    wrongMessage: () => "Not that pile — check the three characteristics again: a mechanical body, electrical components, and true programmability. Which one is this machine actually missing?",
    doneMessage: "All seven sorted — three genuine robots, three machines that fall short of being one, and one that honestly depends on the exact model.",
    onAllPlaced: () => awardStar("d4", "You sorted by the only check that counts — a mechanical body, electrical components, and true programmability, all three at once. Looking human, or sounding clever, was never part of it.")
  });

  /* ═══ D5: the honest ledger — advantages/disadvantages, then a free, ungraded line ═══ */
  const LEDGER_ITEMS = [
    { id: "a1", label: "It can keep working through the night, on a public holiday, or during a shift nobody wants — without ever needing a break.", ans: "For" },
    { id: "a2", label: "It does the exact same thing every single time, so tiredness near the end of a long day never creeps into the result.", ans: "For" },
    { id: "a3", label: "It can be sent into heat, cold, height or repetition that would wear a person down or put them at risk.", ans: "For" },
    { id: "a4", label: "Once it's built and running, it usually costs less to keep going than paying wages for the same hours, day after day.", ans: "For" },
    { id: "d1", label: "It's expensive to design, build and install before it does a single useful thing.", ans: "Against" },
    { id: "d2", label: "It struggles badly with a situation nobody wrote a rule for.", ans: "Against" },
    { id: "d3", label: "Somebody still has to be skilled enough to install it, and to fix it the day it breaks.", ans: "Against" },
    { id: "d4", label: "It can remove work people used to be paid to do, or change what that work looks like.", ans: "Against" }
  ];
  makeSortBoard({
    poolEl: $("#pool5"), binsEl: $("#bins5"), statusEl: $("#status5"),
    items: LEDGER_ITEMS,
    bins: [
      { key: "For", label: "In favour of automation" },
      { key: "Against", label: "Against automation" }
    ],
    selectPrompt: "Tap a card to begin.",
    placePrompt: "Now tap the pile you think it belongs on.",
    retryPrompt: "Tap a card to try again.",
    wrongMessage: () => "Not that pile — ask whether this line is a point in favour of automation, or a point against it, then try again.",
    doneMessage: "All eight sorted — four points in favour, four points against, no scenario needed to know which pile they belong on.",
    onAllPlaced: () => awardStar("d5", "You weighed automation honestly, in a setting that's actually yours — no verdict handed down, just the real ledger, sorted straight.")
  });
