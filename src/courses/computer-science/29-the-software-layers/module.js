
  /* ================= Module 27 — The Software Layers =================
   Signature interaction: a living software tower — D1 sorts real software
   onto the floor it belongs to (application vs system), D2 matches the
   operating system's own jobs to mini-scenarios on "the busy floor", and D3
   fires real interrupts into a running task and watches the CPU bookmark,
   service and resume, calmly, every time.

   D1 and D2 share one hand-rolled tap-or-drag sorter, makeBinSorter() below
   — same shape as Module 13's D1, Module 16's D1/D4 and Module 26's D1
   (pool of chips, bins with a clickable head, pointer-drag as an alternate
   path), not the shared `matcher` kit, which hardcodes awardStar("d3", ...)
   for Module 9's pseudocode pairing and would award the wrong discovery
   here regardless. Reusing one local factory across D1 and D2 in this file
   is exactly the "rule of two" this course is comfortable with (mirrors
   Module 16's makeCrank, reused three times in one file).

   D5's "morning routine" is a simpler single-tap sequencer, makeSequencer()
   — there's only ever one valid "next" slot at a time, so no bin-matching
   or drag is needed, just tap-in-order with a warm redirect on an early tap.

   The OS-functions list in D2 is the syllabus's own list verbatim (0478,
   section 4.1.2's "Including:" bullets) — nine items, not the six the
   original course-plan draft suggested; see the module's build notes for
   why the count changed.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. */

  /* ═══ shared local factory: tap-or-drag chip → bin sorter (D1, D2) ═══ */
  function makeBinSorter(opts) {
    const { pool, binsContainer, status, items, bins, doneStatus, wrongMsg, onDone } = opts;
    const itemEls = {}, binEls = {};
    let selected = null, placed = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap an item to begin.";
        return;
      }
      $$(".sl-chip", pool).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      status.textContent = "Now tap where you think it belongs.";
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
        status.textContent = "Tap an item to try again.";
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

  /* ═══ D1: sort the software pile — system vs application ═══ */
  makeBinSorter({
    pool: $("#softPool1"),
    binsContainer: $("#tierBins1"),
    status: $("#status1"),
    items: [
      { id: "browser", label: "Web browser", ans: "App" },
      { id: "os", label: "Operating system", ans: "Sys" },
      { id: "compiler", label: "Compiler", ans: "Sys" },
      { id: "game", label: "Game", ans: "App" },
      { id: "driver", label: "Device driver", ans: "Sys" },
      { id: "utility", label: "Utility software (e.g. antivirus)", ans: "Sys" }
    ],
    bins: [
      { key: "App", label: "Application software — top floor, what the user wanted" },
      { key: "Sys", label: "System software — working underneath, what the computer needs" }
    ],
    doneStatus: "All six sorted — two floors, nothing left over.",
    wrongMsg: "Not that floor — ask yourself: did you, the user, ask for this directly, or does the computer need it just to keep running at all?",
    onDone: () => awardStar("d1", "Six pieces of real software, sorted onto the floor they actually belong on — application software you asked for, system software working underneath so the machine can run at all.")
  });

  /* ═══ D2: the busy floor — nine OS jobs matched to scenarios ═══
     Verbatim against Cambridge 0478 (2026-28) section 4.1.2's "Including:"
     list — nine items, not the six the early course-plan draft named. */
  makeBinSorter({
    pool: $("#officePool2"),
    binsContainer: $("#officeBins2"),
    status: $("#status2"),
    items: [
      { id: "files", label: "You save a photo as holiday.jpg. Weeks later you find it again in the same folder, exactly as you left it.", ans: "Managing files" },
      { id: "interrupts", label: "You're mid-sentence when a low-battery warning pops up — then your cursor carries on exactly where it was.", ans: "Handling interrupts" },
      { id: "interface", label: "You tap a folder icon instead of typing a string of commands to open it.", ans: "Providing an interface" },
      { id: "peripherals", label: "You plug in a mouse you've never used before, and the pointer just starts moving — no setup needed.", ans: "Managing peripherals and drivers" },
      { id: "memory", label: "You have ten browser tabs open, each kept in its own separate space so one crashing doesn't take the others with it.", ans: "Managing memory" },
      { id: "multitasking", label: "Music keeps playing while you type a message — both get a share of the same CPU, switched between so fast it feels instant.", ans: "Managing multitasking" },
      { id: "platform", label: "You install a calculator app once, and it just runs — you never had to write your own operating system underneath it first.", ans: "Providing a platform for running applications" },
      { id: "security", label: "Your phone asks for a password or a fingerprint before it will unlock at all.", ans: "Providing system security" },
      { id: "accounts", label: "Your sibling logs into the same laptop and sees their own desktop and their own files, not yours.", ans: "Managing user accounts" }
    ],
    bins: [
      { key: "Managing files", label: "Managing files" },
      { key: "Handling interrupts", label: "Handling interrupts" },
      { key: "Providing an interface", label: "Providing an interface" },
      { key: "Managing peripherals and drivers", label: "Managing peripherals and drivers" },
      { key: "Managing memory", label: "Managing memory" },
      { key: "Managing multitasking", label: "Managing multitasking" },
      { key: "Providing a platform for running applications", label: "Providing a platform for running applications" },
      { key: "Providing system security", label: "Providing system security" },
      { key: "Managing user accounts", label: "Managing user accounts" }
    ],
    doneStatus: "All nine matched — every job on the busy floor, named and placed.",
    wrongMsg: "Not that job — read the scenario again and think about the one thing it's actually showing you.",
    onDone: () => awardStar("d2", "Nine real operating-system jobs, matched to scenarios that could have come straight off your own device — including the one you're about to see in full slow motion.")
  });

  /* ═══ D3: ring the bell — fire interrupts into a running task ═══ */
  (function () {
    const STEPS = ["Copy photo 1", "Copy photo 2", "Copy photo 3", "Copy photo 4", "Copy photo 5", "Copy photo 6"];
    const track = $("#taskTrack3"), continueBtn = $("#continueBtn3"), log = $("#log3");
    const stepEls = STEPS.map((label, i) => {
      const el = document.createElement("div");
      el.className = "sl-task-step"; el.textContent = label;
      track.appendChild(el);
      return el;
    });
    let current = 1; // 1-indexed step the task is currently on

    function paintTask() {
      stepEls.forEach((el, i) => {
        const n = i + 1;
        el.classList.toggle("done", n < current);
        el.classList.toggle("current", n === current);
      });
      if (current >= STEPS.length) continueBtn.disabled = true;
    }
    paintTask();

    function addLog(lines) {
      lines.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        log.appendChild(li);
      });
      while (log.children.length > 8) log.removeChild(log.firstChild);
    }

    continueBtn.addEventListener("click", () => {
      if (current >= STEPS.length) return;
      current++;
      paintTask();
      addLog(["Continuing: now on step " + current + " — " + STEPS[current - 1] + "."]);
    });

    const check3 = makeChips($("#chips3"), ["key", "print", "battery"],
      () => awardStar("d3", "Three different interrupts, fired into a task that was genuinely under way — and every single time the CPU bookmarked its place, dealt with the interrupt, and resumed exactly where it had been. Routine, start to finish."),
      k => (k === "key" ? "a key press" : k === "print" ? "a print job" : "a low-battery warning"),
      (label, remaining) => "Fired " + label + " — " + remaining + " more kind" + (remaining === 1 ? "" : "s") + " to try.");

    function fireInterrupt(key, eventLabel, isrLabel) {
      const at = current;
      addLog([
        "An interrupt: " + eventLabel + ".",
        "The CPU bookmarks its place — step " + at + " — before doing anything else.",
        "Interrupt service routine: " + isrLabel + ".",
        "Resuming exactly at step " + at + ". Nothing was lost."
      ]);
      const r = track.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      check3(key);
    }

    $("#keyBtn3").addEventListener("click", () =>
      fireInterrupt("key", "a key is pressed", "the character is stored and shown on the screen"));
    $("#printBtn3").addEventListener("click", () =>
      fireInterrupt("print", "a print job arrives", "the page is queued and sent on to the printer"));
    $("#batteryBtn3").addEventListener("click", () =>
      fireInterrupt("battery", "the battery gets low", "a warning is shown so you get the chance to save your work"));
  })();

  /* ═══ D4: why not just wait? — polling vs interrupts ═══ */
  (function () {
    const pollReveal = $("#pollReveal4"), pollLog = $("#pollLog4");
    const interruptReveal = $("#interruptReveal4"), interruptLog = $("#interruptLog4");

    const check4 = makeChips($("#chips4"), ["polling", "interrupt"],
      () => awardStar("d4", "Same wait, same printer, watched two ways — polling spent the CPU's whole afternoon asking a question that kept coming back \"not yet\", while the interrupt-driven version left the CPU free until the printer itself had something to say."),
      k => (k === "polling" ? "polling" : "an interrupt"),
      (label, remaining) => "Tried " + label + " — " + remaining + " more to try.");

    function fill(listEl, lines) {
      listEl.innerHTML = "";
      lines.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        listEl.appendChild(li);
      });
    }

    $("#pollBtn4").addEventListener("click", () => {
      const lines = [];
      for (let i = 1; i <= 5; i++) lines.push("Tick " + i + ": checked the printer — not ready yet, so the CPU checks again next tick.");
      lines.push("Tick 6: checked the printer — ready! Printing now.");
      fill(pollLog, lines);
      pollReveal.hidden = false;
      const r = pollReveal.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      check4("polling");
    });

    $("#interruptBtn4").addEventListener("click", () => {
      const lines = [];
      for (let i = 1; i <= 5; i++) lines.push("Tick " + i + ": CPU gets on with other useful work — the printer hasn't signalled anything yet.");
      lines.push("Tick 6: the printer itself raises an interrupt — ready! The CPU pauses just long enough to print, then goes straight back to its other work.");
      fill(interruptLog, lines);
      interruptReveal.hidden = false;
      const r = interruptReveal.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      check4("interrupt");
    });
  })();

  /* ═══ shared local factory: single-tap sequence-into-order (D5) ═══ */
  function makeSequencer(opts) {
    const { pool, track, status, items, poolOrder, doneStatus, wrongMsg, onDone } = opts;
    let placedCount = 0;
    const slotEls = items.map((item, i) => {
      const slot = document.createElement("div"); slot.className = "sl-slot";
      const num = document.createElement("span"); num.className = "sl-slot-num"; num.textContent = (i + 1) + ".";
      const body = document.createElement("span"); body.className = "sl-slot-body"; body.textContent = "—";
      slot.appendChild(num); slot.appendChild(body);
      track.appendChild(slot);
      return { slot, body };
    });

    function attemptPlace(id, btn) {
      if (btn.classList.contains("placed")) return;
      const idx = items.findIndex(x => x.id === id);
      if (idx === placedCount) {
        btn.classList.add("placed"); btn.disabled = true;
        slotEls[placedCount].body.textContent = items[idx].label;
        slotEls[placedCount].slot.classList.add("filled");
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        placedCount++;
        if (placedCount === items.length) {
          status.textContent = doneStatus;
          onDone();
        } else {
          status.textContent = "That's next. " + (items.length - placedCount) + " more to go.";
        }
      } else {
        toast(wrongMsg(placedCount + 1));
        status.textContent = "Not next yet — have another look at step " + (placedCount + 1) + ".";
      }
    }

    poolOrder.forEach(id => {
      const item = items.find(x => x.id === id);
      const b = document.createElement("button");
      b.type = "button"; b.className = "sl-chip"; b.dataset.id = id;
      b.textContent = item.label;
      b.addEventListener("click", () => attemptPlace(id, b));
      pool.appendChild(b);
    });
  }

  /* ═══ D5: the morning routine — order the power-on sequence ═══ */
  makeSequencer({
    pool: $("#stepPool5"),
    track: $("#stepTrack5"),
    status: $("#status5"),
    items: [
      { id: "power", label: "Power reaches the hardware — switches flip, but nothing has “started” yet." },
      { id: "firmware", label: "Firmware (the bootloader) runs directly on the hardware and looks for the operating system." },
      { id: "load", label: "The bootloader loads the operating system into memory and hands over control." },
      { id: "ready", label: "The operating system finishes starting up — ready to run applications." }
    ],
    poolOrder: ["load", "power", "ready", "firmware"],
    doneStatus: "All four in order — hardware, firmware, operating system, ready for apps.",
    wrongMsg: (nextSlot) => "Not next yet — think about what has to already be running before that step is even possible.",
    onDone: () => awardStar("d5", "The whole power-on sequence, snapped into order — bare hardware, firmware waking it up, the operating system taking over, and only then, applications.")
  });
