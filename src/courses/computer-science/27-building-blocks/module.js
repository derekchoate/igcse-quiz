
  /* ================= Module 25 — Building Blocks =================
   Signature interaction: a workshop of machines — each procedure/function is
   a physical machine with input hoppers (parameters) and, for functions
   only, an output chute (RETURN); the main program is a conveyor that visits
   machines; local variables visibly live inside a machine's glass case and
   vanish when it stops. No shared kit covers a hopper/conveyor board, a
   chute-and-discard board, a two-hopper swap board, a glass-case/factory-
   floor board, or a two-pile sort, so all five are hand-rolled here, same
   choice Modules 12/23/24 made for their own bespoke boards (rule of two).
   D5 reuses the tap-or-drag sort pattern from Module 12's D4 (six items,
   this time onto two piles instead of three). Runs inside the shared engine
   IIFE, so $, $$, awardStar, toast, sparks, makeChips and reduceMotion are
   all in scope. */

  function mkBtn(cls, label) {
    const b = document.createElement("button");
    b.type = "button"; b.className = cls; b.textContent = label;
    return b;
  }

  /* ═══ D1: build a machine — call with three different names ═══ */
  (function () {
    const codeEl = $("#code1"), input = $("#nameInput1"), callBtn = $("#callBtn1"), conveyor = $("#conveyor1");
    codeEl.innerHTML =
      '<div class="pcline"><span class="kw">PROCEDURE</span> Greet(Name : STRING)</div>' +
      '<div class="pcline">  <span class="kw">OUTPUT</span> <span class="str">"Hello, "</span>, Name, <span class="str">"!"</span></div>' +
      '<div class="pcline"><span class="kw">ENDPROCEDURE</span></div>';

    const seen = new Set();
    const check1 = makeChips($("#chips1"), [1, 2, 3],
      () => awardStar("d1", "Three different names, one unchanged machine — that's the entire point of a procedure: write the steps once, reuse them for every argument that comes along."),
      n => (n === 1 ? "Called it once" : n === 2 ? "Called it with a second name" : "Called it with a third name"),
      (label, remaining) => label + " — " + remaining + " more name" + (remaining === 1 ? "" : "s") + " to try.");

    callBtn.addEventListener("click", () => {
      const name = input.value.trim();
      if (name === "") { toast("Type a name into the hopper first — any name at all."); return; }
      const line = document.createElement("div");
      line.className = "bb-conveyor-line";
      line.innerHTML = '<span class="bb-call">CALL Greet(&quot;' + name.replace(/</g, "&lt;") + '&quot;)</span> <span class="bb-arrow">→</span> Hello, ' + name.replace(/</g, "&lt;") + '!';
      conveyor.appendChild(line);
      conveyor.scrollTop = conveyor.scrollHeight;
      const r = conveyor.getBoundingClientRect();
      sparks(r.left + r.width / 2, r.top);
      seen.add(name.toLowerCase());
      check1(Math.min(seen.size, 3));
    });
  })();

  /* ═══ D2: the output chute — procedure vs function, use vs discard ═══ */
  (function () {
    const codeProc = $("#code2proc"), codeFunc = $("#code2func"), input = $("#nameInput2");
    const callProc = $("#callProc2"), callFunc = $("#callFunc2");
    const status2a = $("#status2a"), status2b = $("#status2b");
    const chuteRow = $("#chuteRow2"), chuteVal = $("#chuteVal2");
    const useBtn = $("#useReturn2"), discardBtn = $("#discardReturn2");

    codeProc.innerHTML =
      '<div class="pcline"><span class="kw">PROCEDURE</span> Greet(Name : STRING)</div>' +
      '<div class="pcline">  <span class="kw">OUTPUT</span> <span class="str">"Hello, "</span>, Name, <span class="str">"!"</span></div>' +
      '<div class="pcline"><span class="kw">ENDPROCEDURE</span></div>';
    codeFunc.innerHTML =
      '<div class="pcline"><span class="kw">FUNCTION</span> Initial(Name : STRING) <span class="kw">RETURNS</span> CHAR</div>' +
      '<div class="pcline">  <span class="kw">RETURN</span> UCASE(SUBSTRING(Name, 1, 1))</div>' +
      '<div class="pcline"><span class="kw">ENDFUNCTION</span></div>';

    const check2 = makeChips($("#chips2"), ["used", "discarded"],
      () => awardStar("d2", "You watched the same kind of value take two different paths after RETURN — used, and printed; discarded, and gone — and either one is completely legal pseudocode."),
      k => (k === "used" ? "Used the returned value" : "Watched a discarded value quietly disappear"),
      (label, remaining) => label + " — " + remaining + " more to try.");

    function currentName() {
      const n = input.value.trim();
      return n === "" ? "Mei Ling" : n;
    }

    callProc.addEventListener("click", () => {
      const name = currentName();
      status2a.textContent = 'CALL Greet("' + name + '") runs — OUTPUT "Hello, ' + name + '!" happens right there, inside the machine. Nothing comes back to you; it already did the whole job itself.';
      chuteRow.style.display = "none";
      status2b.textContent = "";
    });

    callFunc.addEventListener("click", () => {
      const name = currentName();
      const initial = name.charAt(0).toUpperCase();
      status2a.textContent = 'Initial("' + name + '") runs and reaches RETURN UCASE(SUBSTRING(Name, 1, 1)) — a value is sent back onto the conveyor. Nothing has been output yet. It’s simply sitting there, waiting for whoever called it to decide what happens next.';
      chuteVal.textContent = 'On the conveyor: "' + initial + '" — not shown anywhere yet.';
      chuteRow.style.display = "";
      status2b.textContent = "";
      useBtn.disabled = false; discardBtn.disabled = false;
      useBtn.dataset.val = initial;
    });

    useBtn.addEventListener("click", () => {
      const v = useBtn.dataset.val || "?";
      status2b.textContent = 'OUTPUT Initial(Name) → "' + v + '" printed. The returned value only appeared because something used it.';
      check2("used");
    });
    discardBtn.addEventListener("click", () => {
      const v = useBtn.dataset.val || "?";
      status2b.textContent = 'The chute delivered "' + v + '" onto the conveyor, and then... nothing picked it up. It’s simply gone now — a function’s whole promise is that it delivers a value, never that anything happens with it. Discarding a function’s return value is completely legal pseudocode; it’s just rarely useful.';
      check2("discarded");
    });
  })();

  /* ═══ D3: hoppers in order — swap the arguments, meet the polite chaos ═══ */
  (function () {
    const codeEl = $("#code3"), hop1 = $("#hop1_3"), hop2 = $("#hop2_3");
    const callBtn = $("#callBtn3"), swapBtn = $("#swapBtn3"), status = $("#status3");
    let swapped = false;

    codeEl.innerHTML =
      '<div class="pcline"><span class="kw">PROCEDURE</span> Introduce(Name : STRING, Job : STRING)</div>' +
      '<div class="pcline">  <span class="kw">OUTPUT</span> Name, <span class="str">" works as "</span>, Job</div>' +
      '<div class="pcline"><span class="kw">ENDPROCEDURE</span></div>';

    const check3 = makeChips($("#chips3"), ["ordered", "swapped"],
      () => awardStar("d3", "Same machine, same two steps, both times — only the order the arguments arrived in changed, and that alone was enough to turn a sensible sentence into polite chaos."),
      k => (k === "ordered" ? "Called it with the hoppers as they start" : "Called it after swapping the hoppers"),
      (label, remaining) => label + " — " + remaining + " more to try.");

    callBtn.addEventListener("click", () => {
      const v1 = hop1.value.trim() || "—", v2 = hop2.value.trim() || "—";
      status.textContent = 'CALL Introduce("' + v1 + '", "' + v2 + '") → OUTPUT: "' + v1 + ' works as ' + v2 + '."';
      check3(swapped ? "swapped" : "ordered");
    });

    swapBtn.addEventListener("click", () => {
      const v1 = hop1.value, v2 = hop2.value;
      hop1.value = v2; hop2.value = v1;
      swapped = !swapped;
      status.textContent = "Hoppers swapped — whatever's poured in now lands in the other hopper. Call the machine again to see what that does.";
    });
  })();

  /* ═══ D4: the glass case — local vs global ═══ */
  (function () {
    const codeEl = $("#code4"), factoryVal = $("#factoryVal4"), caseVal = $("#caseVal4"), caseEl = $("#case4");
    const startBtn = $("#startBtn4"), stopBtn = $("#stopBtn4"), readBtn = $("#readBtn4");
    const status4a = $("#status4a"), status4b = $("#status4b");
    let factoryCount = 0, running = false;

    codeEl.innerHTML =
      '<div class="pcline"><span class="kw">DECLARE</span> FactoryCount : INTEGER  <span class="cmt">// the factory floor</span></div>' +
      '<div class="pcline"><span class="kw">PROCEDURE</span> RunMachine</div>' +
      '<div class="pcline">  <span class="kw">DECLARE</span> Local : INTEGER  <span class="cmt">// the glass case</span></div>' +
      '<div class="pcline">  Local <span class="arrow">←</span> 1</div>' +
      '<div class="pcline">  FactoryCount <span class="arrow">←</span> FactoryCount + 1</div>' +
      '<div class="pcline"><span class="kw">ENDPROCEDURE</span></div>';

    const check4 = makeChips($("#chips4"), ["started", "stopped", "triedRead"],
      () => awardStar("d4", "You watched Local get born and vanish with a single run of its machine, watched FactoryCount keep its value on the floor between runs, and found out — twice, two different ways — that a local variable is never reachable from outside its own machine."),
      k => (k === "started" ? "Started the machine" : k === "stopped" ? "Stopped it, and watched the case empty" : "Tried reading Local from the floor"),
      (label, remaining) => label + " — " + remaining + " more to try.");

    startBtn.addEventListener("click", () => {
      if (running) return;
      running = true;
      caseVal.textContent = "Local ← 1";
      caseEl.classList.add("bb-case-live");
      status4a.textContent = "The machine started — Local was just born inside the glass case, value 1. FactoryCount on the floor hasn't moved yet, because the machine hasn't finished running.";
      startBtn.disabled = true; stopBtn.disabled = false;
      check4("started");
    });

    stopBtn.addEventListener("click", () => {
      if (!running) return;
      running = false;
      factoryCount++;
      factoryVal.textContent = String(factoryCount);
      caseVal.textContent = "— empty —";
      caseEl.classList.remove("bb-case-live");
      status4a.textContent = "The machine finished — FactoryCount ticked up to " + factoryCount + " on the factory floor, and Local vanished the instant the machine stopped. It only ever belonged to that one run.";
      startBtn.disabled = false; stopBtn.disabled = true;
      check4("stopped");
    });

    readBtn.addEventListener("click", () => {
      if (running) {
        status4b.textContent = "You're standing on the factory floor, outside the machine entirely. Local is alive in there right now — but the floor was never given a way to see inside the glass case. It's simply not something you can reach from out here.";
      } else {
        status4b.textContent = "There's no Local out here to read. It only ever exists while its machine is running, inside that machine's own glass case — and right now there isn't one running.";
      }
      check4("triedRead");
    });
  })();

  /* ═══ D5: spot the difference — sort six blueprints, tap or drag ═══ */
  (function () {
    const BLUEPRINTS = [
      { id: "b1", pile: "Procedure",
        lines: ['<span class="kw">PROCEDURE</span> ShowMenu', '  <span class="kw">OUTPUT</span> <span class="str">"1. Start  2. Options  3. Quit"</span>', '<span class="kw">ENDPROCEDURE</span>'] },
      { id: "b2", pile: "Function",
        lines: ['<span class="kw">FUNCTION</span> Double(N : INTEGER) <span class="kw">RETURNS</span> INTEGER', '  <span class="kw">RETURN</span> N * 2', '<span class="kw">ENDFUNCTION</span>'] },
      { id: "b3", pile: "Procedure",
        lines: ['<span class="kw">PROCEDURE</span> LogEvent(Message : STRING)', '  <span class="kw">OUTPUT</span> Message', '<span class="kw">ENDPROCEDURE</span>'] },
      { id: "b4", pile: "Function",
        lines: ['<span class="kw">FUNCTION</span> IsEven(N : INTEGER) <span class="kw">RETURNS</span> BOOLEAN', '  <span class="kw">RETURN</span> N <span class="kw">MOD</span> 2 = 0', '<span class="kw">ENDFUNCTION</span>'] },
      { id: "b5", pile: "Procedure",
        lines: ['<span class="kw">PROCEDURE</span> ClearScreen', '  <span class="kw">OUTPUT</span> <span class="str">""</span>', '<span class="kw">ENDPROCEDURE</span>'] },
      { id: "b6", pile: "Function",
        lines: ['<span class="kw">FUNCTION</span> Average(A : INTEGER, B : INTEGER) <span class="kw">RETURNS</span> REAL', '  <span class="kw">RETURN</span> (A + B) / 2', '<span class="kw">ENDFUNCTION</span>'] }
    ];
    const pool = $("#pool5"), status = $("#status5");
    const blueprintEls = {}, pileEls = {};
    let selected = null, placed = 0;

    function buildCard(bp) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "bb-blueprint"; b.dataset.id = bp.id;
      b.innerHTML = bp.lines.map(l => '<div class="pcline">' + l + '</div>').join("");
      b.addEventListener("click", () => { if (!dragging) select(bp.id, b); });
      b.addEventListener("pointerdown", e => dragStart(e, bp.id, b));
      blueprintEls[bp.id] = b;
      return b;
    }
    function buildPile(name) {
      const wrap = document.createElement("div"); wrap.className = "bb-pile";
      const head = document.createElement("button");
      head.type = "button"; head.className = "bb-pile-head"; head.textContent = name + " pile";
      head.addEventListener("click", () => tryPlace(name));
      const list = document.createElement("div"); list.className = "bb-pile-list"; list.setAttribute("aria-live", "polite");
      wrap.appendChild(head); wrap.appendChild(list);
      pileEls[name] = { wrap, list };
      return wrap;
    }
    ["Procedure", "Function"].forEach(name => $("#piles5").appendChild(buildPile(name)));
    BLUEPRINTS.forEach(bp => pool.appendChild(buildCard(bp)));

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) { btn.classList.remove("sel"); selected = null; status.textContent = "Tap a blueprint to begin."; return; }
      $$(".bb-blueprint", pool).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      status.textContent = "Now tap the pile you think that blueprint belongs on.";
    }
    function tryPlace(pileName) {
      if (!selected) return;
      const bp = BLUEPRINTS.find(x => x.id === selected);
      const btn = blueprintEls[bp.id];
      if (bp.pile === pileName) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        const line = document.createElement("div");
        line.className = "bb-pile-item";
        line.innerHTML = btn.innerHTML;
        pileEls[pileName].list.appendChild(line);
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        placed++; selected = null;
        if (placed === BLUEPRINTS.length) {
          status.textContent = "All six sorted — every blueprint found its pile.";
          awardStar("d5", "All six sorted using nothing but one word on the header line — RETURNS present means Function, RETURNS absent means Procedure, every single time.");
        } else {
          status.textContent = "That's the one. " + (BLUEPRINTS.length - placed) + " more to go.";
        }
      } else {
        toast("Not that pile — have another look at the header line. Does it say RETURNS anywhere?");
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap a blueprint to try again.";
      }
    }

    /* drag-and-drop via pointer events (one path for mouse, touch and pen) */
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
    function pileUnder(e) {
      if (dragGhost) dragGhost.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (dragGhost) dragGhost.style.visibility = "";
      const wrap = el && el.closest ? el.closest(".bb-pile") : null;
      if (!wrap) return null;
      for (const k in pileEls) { if (pileEls[k].wrap === wrap) return k; }
      return null;
    }
    function markHover(key) {
      Object.keys(pileEls).forEach(k => pileEls[k].wrap.classList.toggle("drop-ok", k === key));
    }
    function dragMove(e) {
      if (dragId === null || e.pointerId !== dragPtrId) return;
      const btn = blueprintEls[dragId];
      if (!dragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) < 6) return;
        dragging = true;
        const rect = btn.getBoundingClientRect();
        dragOffX = dragStartX - rect.left; dragOffY = dragStartY - rect.top;
        dragGhost = btn.cloneNode(true);
        dragGhost.classList.add("bb-ghost"); dragGhost.classList.remove("sel");
        dragGhost.style.width = rect.width + "px";
        document.body.appendChild(dragGhost);
        btn.classList.add("dragging");
        $$(".bb-blueprint", pool).forEach(c => c.classList.remove("sel"));
        selected = null;
      }
      e.preventDefault();
      dragGhost.style.left = (e.clientX - dragOffX) + "px";
      dragGhost.style.top = (e.clientY - dragOffY) + "px";
      markHover(pileUnder(e));
    }
    function dragEnd(e) {
      if (dragId === null || e.pointerId !== dragPtrId) return;
      const id = dragId, btn = blueprintEls[id];
      document.removeEventListener("pointermove", dragMove);
      document.removeEventListener("pointerup", dragEnd);
      document.removeEventListener("pointercancel", dragEnd);
      if (dragging) {
        const key = pileUnder(e);
        markHover(null);
        if (dragGhost) { dragGhost.remove(); dragGhost = null; }
        btn.classList.remove("dragging");
        if (key) { selected = id; tryPlace(key); }
      } else if (e.type !== "pointercancel") {
        select(id, btn);
      }
      dragId = null; dragging = false; dragPtrId = null;
    }
  })();
