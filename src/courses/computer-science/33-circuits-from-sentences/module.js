
  /* ========== Module 31 — Circuits from Sentences ==========
   Signature interaction: a two-gate wiring board. A true freeform canvas
   (drag any gate anywhere, draw any wire) was considered and rejected for
   this module — under the syllabus's own limits (max 2 inputs per gate,
   NOT excepted at 1; max 3 circuit inputs; max 1 output) the entire space
   of valid circuits is small and fully enumerable: with three inputs and
   2-input gates, the ONLY legal topology is "two of the three raw inputs
   meet Gate 1; Gate 1's answer and the third input meet Gate 2; Gate 2's
   answer lights the one output lamp." A canvas that let the wires go
   anywhere would just be a slower way to reach that same one shape, while
   adding real engineering risk (drag-and-drop on a 380px screen) for zero
   extra pedagogy. So the board is built as a fixed two-slot chain —
   buildChain() below — and the learner's real job is choosing what each
   slot's gate IS (a live, always-changeable picker, never a locked guess).
   The raw inputs always sit in a fixed, stated order — the first two
   switches always feed Gate 1, the third always joins at Gate 2 — so the
   one remaining unknown, gate identity, is the one thing being taught.
   This still delivers "flip switches, watch the glow propagate, watch a
   target table light up row by row" exactly as planned — it just spends
   the engineering budget on that, rather than on freehand wiring.

   The two gate slots and their SVG shapes deliberately mirror Module 30's
   gate bench (same wire/body/bubble markup, same .bit/.bulb switches) so
   the visual language matches — but the code is not literally imported
   from Module 30. There is no shared "gates" kit yet: only these two
   modules use gate rendering, and building a shared kit would mean editing
   Module 30's files to consume it, which this branch is not allowed to do
   beyond its one permitted nav-link edit. Recreating the same shapes here,
   independently, keeps Module 30 untouched while keeping the two modules
   feeling identical to use.

   Every circuit built or shown on this page respects the syllabus limits
   throughout: exactly three raw input switches at most, each gate slot
   takes exactly two inputs, exactly one final output lamp, and no circuit
   is ever algebraically simplified from its literal sentence/expression —
   (A AND B) OR C is wired as two chained gates even though it could be
   rearranged on paper, because Cambridge wants it built exactly as stated.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks,
   toast, awardStar and makeChips are all in scope. */

  /* ═══ two-input gate logic + Cambridge's own symbol shapes ═══
     (NOT doesn't appear on this page — every slot here always takes two
     inputs, which is the whole point of the chain; Module 30 owns NOT.) */
  const GATE2_LIST = ["AND", "OR", "NAND", "NOR", "XOR"];
  const GATE2_FN = {
    AND: (a, b) => (a && b ? 1 : 0),
    OR: (a, b) => (a || b ? 1 : 0),
    NAND: (a, b) => (a && b ? 0 : 1),
    NOR: (a, b) => (a || b ? 0 : 1),
    XOR: (a, b) => (a !== b ? 1 : 0)
  };
  function evalGate2(type, a, b) {
    return GATE2_FN[type](a, b);
  }
  function chainOutput(g1, g2, a, b, c) {
    return evalGate2(g2, evalGate2(g1, a, b), c);
  }

  function gateBodyMarkup(type) {
    switch (type) {
      case "AND":
        return '<path class="gbody" d="M40,10 H70 A35,35 0 0 1 70,80 H40 Z"/>';
      case "OR":
        return '<path class="gbody" d="M40,10 C70,10 95,25 115,45 C95,65 70,80 40,80 C58,65 58,25 40,10 Z"/>';
      case "NAND":
        return '<path class="gbody" d="M40,10 H70 A35,35 0 0 1 70,80 H40 Z"/>' +
               '<circle class="gbubble" cx="113" cy="45" r="7"/>';
      case "NOR":
        return '<path class="gbody" d="M40,10 C70,10 95,25 115,45 C95,65 70,80 40,80 C58,65 58,25 40,10 Z"/>' +
               '<circle class="gbubble" cx="123" cy="45" r="7"/>';
      case "XOR":
        return '<path class="gwire-extra" d="M30,10 C48,25 48,65 30,80"/>' +
               '<path class="gbody" d="M40,10 C70,10 95,25 115,45 C95,65 70,80 40,80 C58,65 58,25 40,10 Z"/>';
      default:
        return "";
    }
  }
  const GATE_OUT_X = { AND: 105, OR: 115, NAND: 120, NOR: 130, XOR: 115 };
  function gateWiresMarkup(type) {
    return '<line class="gwire" data-wire="a" x1="0" y1="25" x2="40" y2="25"/>' +
      '<line class="gwire" data-wire="b" x1="0" y1="65" x2="40" y2="65"/>' +
      '<line class="gwire" data-wire="out" x1="' + GATE_OUT_X[type] + '" y1="45" x2="170" y2="45"/>';
  }
  function buildGateSVG(type, ariaLabel) {
    return '<svg class="gate-svg" viewBox="0 0 170 90" role="img" aria-label="' + ariaLabel + '">' +
      gateWiresMarkup(type) + gateBodyMarkup(type) + "</svg>";
  }

  /* ═══ shared: switches + indicator lamps (Module 1's .bit/.bulb) ═══ */
  function makeInputSwitch(label, onChange) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "bit";
    b.setAttribute("aria-pressed", "false");
    b.setAttribute("aria-label", label + " input switch");
    b.innerHTML = '<span class="bulb"></span><span class="bit-val">' + label + '</span><span class="bit-digit">0</span>';
    b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      $(".bit-digit", b).textContent = on ? "1" : "0";
      onChange();
    });
    return b;
  }
  function makeIndicatorLamp(label) {
    const d = document.createElement("div");
    d.className = "bit lamp-out";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML = '<span class="bulb"></span><span class="bit-val">' + label + '</span><span class="bit-digit">0</span>';
    return d;
  }
  function setLamp(lampEl, value) {
    lampEl.setAttribute("aria-pressed", value ? "true" : "false");
    $(".bit-digit", lampEl).textContent = value ? "1" : "0";
  }
  function setWire(svgEl, wire, on) {
    const el = $('[data-wire="' + wire + '"]', svgEl);
    if (el) el.classList.toggle("on", !!on);
  }

  /* ═══ the wiring board: two chained 2-input gate slots ═══
     opts.labels = [labelA, labelB, labelC] — the convention (stated
     up front in Discovery 1) is that the first two labels always meet
     Gate 1, and the third always joins Gate 1's answer at Gate 2. That
     ordering never changes anywhere on this page.
     opts.gate1 / opts.gate2 = { fixed: "AND" } for a given circuit, or
     { pick: true, init: "AND" } for a slot the learner sets themselves —
     picking is a live setting, never a graded guess, so any candidate can
     be chosen at any time with no locked-in "wrong" state.
     opts.onUpdate(vals, g1type, g2type, mid, out) fires after every
     switch flip or gate pick. */
  function buildChain(host, opts) {
    const wrap = document.createElement("div");
    wrap.className = "circuit-chain";

    const switchRow = document.createElement("div");
    switchRow.className = "gate-switches chain-switches";
    const switches = opts.labels.map(lab => makeInputSwitch(lab, () => update()));
    switches.forEach(b => switchRow.appendChild(b));

    const slot1 = document.createElement("div");
    slot1.className = "gate-slot";
    const slot1Title = document.createElement("p");
    slot1Title.className = "gate-bench-label";
    slot1Title.textContent = "Gate 1 — " + opts.labels[0] + " & " + opts.labels[1];
    const slot1Diagram = document.createElement("div");
    slot1Diagram.className = "gate-diagram";
    const slot1Picker = document.createElement("div");
    slot1Picker.className = "gate-picker";
    const slot1Readout = document.createElement("p");
    slot1Readout.className = "gate-readout";
    slot1Readout.setAttribute("aria-live", "polite");
    slot1.append(slot1Title, slot1Diagram);
    if (opts.gate1.pick) slot1.appendChild(slot1Picker);
    slot1.appendChild(slot1Readout);

    const midLink = document.createElement("div");
    midLink.className = "chain-link";
    const midLamp = makeIndicatorLamp("Gate 1");
    const midCaption = document.createElement("p");
    midCaption.className = "chain-link-label";
    midCaption.textContent = "carries into Gate 2, alongside " + opts.labels[2];
    midLink.append(midLamp, midCaption);

    const slot2 = document.createElement("div");
    slot2.className = "gate-slot";
    const slot2Title = document.createElement("p");
    slot2Title.className = "gate-bench-label";
    slot2Title.textContent = "Gate 2 — Gate 1's result & " + opts.labels[2];
    const slot2Diagram = document.createElement("div");
    slot2Diagram.className = "gate-diagram";
    const slot2Picker = document.createElement("div");
    slot2Picker.className = "gate-picker";
    const slot2Readout = document.createElement("p");
    slot2Readout.className = "gate-readout";
    slot2Readout.setAttribute("aria-live", "polite");
    slot2.append(slot2Title, slot2Diagram);
    if (opts.gate2.pick) slot2.appendChild(slot2Picker);
    slot2.appendChild(slot2Readout);

    const outputRow = document.createElement("div");
    outputRow.className = "chain-output";
    const lamp = makeIndicatorLamp("Q");
    const outReadout = document.createElement("p");
    outReadout.className = "gate-readout";
    outReadout.setAttribute("aria-live", "polite");
    outputRow.append(lamp, outReadout);

    wrap.append(switchRow, slot1, midLink, slot2, outputRow);
    host.appendChild(wrap);

    let g1type = opts.gate1.fixed || opts.gate1.init || "AND";
    let g2type = opts.gate2.fixed || opts.gate2.init || "AND";
    let slot1Svg = null, slot2Svg = null;

    function renderDiagram(container, type) {
      container.innerHTML = buildGateSVG(type, type + " gate symbol");
      return $(".gate-svg", container);
    }
    function setupPicker(container, getType, setType) {
      function paint() {
        container.innerHTML = "";
        GATE2_LIST.forEach(name => {
          const b = document.createElement("button");
          b.type = "button";
          const active = name === getType();
          b.className = "gate-pick-btn" + (active ? " active" : "");
          b.setAttribute("aria-pressed", active ? "true" : "false");
          b.textContent = name;
          b.addEventListener("click", () => {
            setType(name);
            paint();
            update();
          });
          container.appendChild(b);
        });
      }
      paint();
    }

    function values() {
      return switches.map(b => (b.getAttribute("aria-pressed") === "true" ? 1 : 0));
    }

    function update() {
      const vals = values();
      const mid = evalGate2(g1type, vals[0], vals[1]);
      const out = evalGate2(g2type, mid, vals[2]);

      setWire(slot1Svg, "a", vals[0]);
      setWire(slot1Svg, "b", vals[1]);
      setWire(slot1Svg, "out", mid);
      slot1Svg.classList.toggle("fired", !!mid);
      slot1Readout.textContent = opts.labels[0] + " = " + vals[0] + ", " + opts.labels[1] + " = " + vals[1] + " → " + g1type + " gives " + mid;

      setLamp(midLamp, mid);

      setWire(slot2Svg, "a", mid);
      setWire(slot2Svg, "b", vals[2]);
      setWire(slot2Svg, "out", out);
      slot2Svg.classList.toggle("fired", !!out);
      slot2Readout.textContent = "Gate 1's result = " + mid + ", " + opts.labels[2] + " = " + vals[2] + " → " + g2type + " gives " + out;

      setLamp(lamp, out);
      outReadout.textContent = "Final output Q = " + out;

      if (opts.onUpdate) opts.onUpdate(vals, g1type, g2type, mid, out);
    }

    slot1Svg = renderDiagram(slot1Diagram, g1type);
    slot2Svg = renderDiagram(slot2Diagram, g2type);
    if (opts.gate1.pick) {
      setupPicker(slot1Picker, () => g1type, (name) => {
        g1type = name;
        slot1Svg = renderDiagram(slot1Diagram, g1type);
      });
    }
    if (opts.gate2.pick) {
      setupPicker(slot2Picker, () => g2type, (name) => {
        g2type = name;
        slot2Svg = renderDiagram(slot2Diagram, g2type);
      });
    }
    update();

    return {
      values,
      gate1: () => g1type,
      gate2: () => g2type
    };
  }

  /* ═══ the eight rows, always in binary-counting order (Module 30's D5
     convention, reused identically here — it's also how Cambridge lists
     truth-table rows) ═══ */
  function comboRows3() {
    return ["000", "001", "010", "011", "100", "101", "110", "111"];
  }

  /* ═══ self-computed notebook: fills a row's Q the moment that exact
     switch combination has actually been tried (Module 30's lab-notebook
     mechanic, reused for the two "read this circuit" discoveries) ═══ */
  function renderNotebook3(container, labels, computeFn, tested) {
    const table = document.createElement("table");
    table.className = "gm-table";
    const thead = document.createElement("thead");
    const htr = document.createElement("tr");
    labels.concat(["Q"]).forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    comboRows3().forEach(key => {
      const d = key.split("").map(Number);
      const tr = document.createElement("tr");
      const done = tested.has(key);
      d.forEach(digit => {
        const td = document.createElement("td");
        td.textContent = digit;
        tr.appendChild(td);
      });
      const outTd = document.createElement("td");
      outTd.textContent = done ? String(computeFn(d[0], d[1], d[2])) : "—";
      tr.appendChild(outTd);
      if (done) tr.classList.add("tested");
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = "";
    container.appendChild(table);
  }

  /* ═══ target table: the goal is printed from the start (nothing hidden —
     rule: conventions and targets are stated, never inferred); a row gets
     the warm "matched" glow once it has actually been visited AND the
     learner's current, live circuit agrees with it. Change the gates and
     already-visited rows re-evaluate immediately — no need to re-flip
     anything once the circuit is right. This is state-matching at its
     purest: an unmatched row is simply "not finished yet", never wrong. ═══ */
  function renderTargetTable3(container, labels, targetFn, currentFn, visited) {
    const table = document.createElement("table");
    table.className = "gm-table";
    const thead = document.createElement("thead");
    const htr = document.createElement("tr");
    labels.concat(["Target Q"]).forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    let matchedCount = 0;
    comboRows3().forEach(key => {
      const d = key.split("").map(Number);
      const tr = document.createElement("tr");
      tr.dataset.key = key;
      d.forEach(digit => {
        const td = document.createElement("td");
        td.textContent = digit;
        tr.appendChild(td);
      });
      const target = targetFn(d[0], d[1], d[2]);
      const outTd = document.createElement("td");
      outTd.textContent = String(target);
      tr.appendChild(outTd);
      const lit = visited.has(key) && currentFn(d[0], d[1], d[2]) === target;
      if (lit) {
        tr.classList.add("matched");
        matchedCount++;
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = "";
    container.appendChild(table);
    return matchedCount;
  }

  /* ═══ wires a chain to a target table + a soft "N of 8" progress line,
     sparking each row the first time it lights and calling onComplete
     once every row is lit at the same time (mirrors Module 29's D6
     target-card pattern rather than a chip ladder — a full 8-row table
     already IS the progress display, so a second ladder would be
     redundant clutter here). ═══ */
  function wireTargetChain(tableEl, progressEl, labels, targetFn, onComplete) {
    const visited = new Set();
    const sparked = new Set();
    function redraw(vals, g1, g2) {
      visited.add(vals.join(""));
      const currentFn = (a, b, c) => chainOutput(g1, g2, a, b, c);
      const matchedCount = renderTargetTable3(tableEl, labels, targetFn, currentFn, visited);
      comboRows3().forEach(key => {
        const row = $('tr[data-key="' + key + '"]', tableEl);
        if (row && row.classList.contains("matched") && !sparked.has(key)) {
          sparked.add(key);
          const r = row.getBoundingClientRect();
          sparks(r.left + r.width / 2, r.top);
        }
      });
      if (progressEl) {
        progressEl.textContent = matchedCount + " of 8 rows lit so far.";
      }
      if (matchedCount === 8) onComplete();
    }
    return redraw;
  }

  /* ═══ expression multiple-choice: reading a fixed circuit's wiring back
     into brackets. A wrong pick is never a red X — it's a warm, specific
     redirect pointing back at the wiring, exactly like Module 30's
     "name that gate". ═══ */
  function wireExpressionPicker(container, statusEl, candidates, correctIndex, onCorrect) {
    let solved = false;
    candidates.forEach((cand, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "expr-option-btn";
      b.textContent = cand.text;
      b.addEventListener("click", () => {
        if (solved) return;
        if (i === correctIndex) {
          solved = true;
          b.classList.add("locked");
          $$(".expr-option-btn", container).forEach(other => {
            if (other !== b) other.disabled = true;
          });
          statusEl.classList.add("solved");
          statusEl.textContent = "That's it — " + cand.text + ". " + cand.why;
          onCorrect();
        } else {
          statusEl.classList.remove("solved");
          statusEl.textContent = "Not quite that one — " + cand.why + " Have another look at the wiring.";
        }
      });
      container.appendChild(b);
    });
  }

  /* ═══ D1: wire your first pair — (A AND B) OR C, watch propagation ═══
     The circuit is fixed here on purpose: this discovery is the one place
     the wiring board's own rules get stated (rule: conventions are stated
     before any task depends on them), so nothing about the circuit itself
     is negotiable yet — only exploring it is. */
  (function () {
    const tested = new Set();
    const tableEl = $("#table1");
    const compute = (a, b, c) => chainOutput("AND", "OR", a, b, c);
    renderNotebook3(tableEl, ["A", "B", "C"], compute, tested);

    const check1 = makeChips($("#chips1"), comboRows3(),
      () => awardStar("d1", "All eight rows lit — Gate 1's AND and Gate 2's OR, chained, answered every question a three-switch circuit can be asked."),
      k => "Tried " + k,
      (label, remaining) => label + " — " + remaining + " more to go.");

    buildChain($("#chain1"), {
      labels: ["A", "B", "C"],
      gate1: { fixed: "AND" },
      gate2: { fixed: "OR" },
      onUpdate(vals) {
        const key = vals.join("");
        tested.add(key);
        renderNotebook3(tableEl, ["A", "B", "C"], compute, tested);
        check1(key);
      }
    });
  })();

  /* ═══ D2: sentence to circuit — the alarm, translated clause by clause ═══ */
  (function () {
    const LABELS = ["Door", "Armed", "Smoke"];
    const target = (a, b, c) => chainOutput("AND", "OR", a, b, c);
    const tableEl = $("#table2");
    const progressEl = $("#progress2");
    const redraw = wireTargetChain(tableEl, progressEl, LABELS, target,
      () => awardStar("d2", "Every row lines up — Door AND Armed meet first because 'while' joins them, and Smoke joins in afterwards with OR, exactly as the sentence said it."));

    buildChain($("#chain2"), {
      labels: LABELS,
      gate1: { pick: true, init: "AND" },
      gate2: { pick: true, init: "AND" },
      onUpdate(vals, g1, g2) {
        redraw(vals, g1, g2);
      }
    });
  })();

  /* ═══ D3: circuit to table — a fan controller with no notes attached ═══
     The gates are shown honestly (this discovery is about reading a given
     circuit, not guessing its identity), but every row still has to be
     tested to earn its place in the notebook. */
  (function () {
    const LABELS = ["Hot", "Damp", "Manual"];
    const tested = new Set();
    const tableEl = $("#table3");
    const compute = (a, b, c) => chainOutput("XOR", "AND", a, b, c);
    renderNotebook3(tableEl, LABELS, compute, tested);

    const check3 = makeChips($("#chips3"), comboRows3(),
      () => awardStar("d3", "Notebook complete — the fan only runs when Manual is on AND the two sensors disagree with each other, read straight off the wiring by testing, not guessing."),
      k => "Tried " + k,
      (label, remaining) => label + " — " + remaining + " more to go.");

    buildChain($("#chain3"), {
      labels: LABELS,
      gate1: { fixed: "XOR" },
      gate2: { fixed: "AND" },
      onUpdate(vals) {
        const key = vals.join("");
        tested.add(key);
        renderNotebook3(tableEl, LABELS, compute, tested);
        check3(key);
      }
    });
  })();

  /* ═══ D4: table to circuit — a vending machine's finished results table,
     no sentence attached, work the gates out from the numbers alone ═══ */
  (function () {
    const LABELS = ["Change", "Loyalty", "Stock"];
    const target = (a, b, c) => chainOutput("OR", "AND", a, b, c);
    const tableEl = $("#table4");
    const progressEl = $("#progress4");
    const redraw = wireTargetChain(tableEl, progressEl, LABELS, target,
      () => awardStar("d4", "Every row matches — Change OR Loyalty meets first, and only then does Stock get ANDed in, exactly what the numbers were quietly implying all along."));

    buildChain($("#chain4"), {
      labels: LABELS,
      gate1: { pick: true, init: "AND" },
      gate2: { pick: true, init: "AND" },
      onUpdate(vals, g1, g2) {
        redraw(vals, g1, g2);
      }
    });
  })();

  /* ═══ D5: circuit to expression — read the wiring backwards into brackets ═══ */
  (function () {
    const LABELS = ["P", "Q", "R"];
    const tested = new Set();
    const tableEl = $("#table5");
    const compute = (a, b, c) => chainOutput("NOR", "XOR", a, b, c);
    renderNotebook3(tableEl, LABELS, compute, tested);

    buildChain($("#chain5"), {
      labels: LABELS,
      gate1: { fixed: "NOR" },
      gate2: { fixed: "XOR" },
      onUpdate(vals) {
        tested.add(vals.join(""));
        renderNotebook3(tableEl, LABELS, compute, tested);
      }
    });

    const CANDIDATES = [
      { text: "(P NOR Q) XOR R", why: "P and Q meet at Gate 1 (a bubbled OR shape — NOR), and that whole result meets R at Gate 2 (XOR)." },
      { text: "P NOR (Q XOR R)", why: "That groups Q and R together first — but the wiring shows P and Q meeting at Gate 1, with R only joining afterwards. Follow the wires in order, left to right." },
      { text: "(P XOR Q) NOR R", why: "That's the right bracket shape, but the two gates have swapped roles — check which symbol actually sits at Gate 1 (closest to P and Q) and which sits at Gate 2." },
      { text: "(P OR Q) XOR R", why: "Close — but look again at Gate 1's symbol for a small bubble. A bubble on OR's shape makes it NOR, not OR, and it changes several rows of the table." }
    ];
    // Shuffle order is fixed (not randomised) so nudges and tests can refer
    // to option positions reliably — predictability over novelty here.
    const container = $("#expr5");
    const status = $("#exprStatus5");
    status.setAttribute("aria-live", "polite");
    status.textContent = "Read Gate 1's symbol, then Gate 2's, then pick the expression that matches both.";
    wireExpressionPicker(container, status, CANDIDATES, 0,
      () => awardStar("d5", "(P NOR Q) XOR R — read straight off the wiring, brackets around whatever meets at Gate 1 first, nothing more."));
  })();

  /* ═══ D6: the commission — one problem statement, all the way through
     to a finished circuit, a fully matched table, and its expression: the
     complete syllabus triangle, solved for one client's kiosk in one
     sitting. ═══ */
  (function () {
    const LABELS = ["HotFood", "StockOK", "DrinkOnly"];
    const target = (a, b, c) => chainOutput("AND", "OR", a, b, c);
    const tableEl = $("#table6");
    const progressEl = $("#progress6");

    let circuitDone = false;
    let exprDone = false;
    function maybeFinish() {
      if (circuitDone && exprDone) {
        awardStar("d6", "Circuit, table and expression all agree — (HotFood AND StockOK) OR DrinkOnly, wired exactly as the kiosk's brief described it, start to finish.");
      }
    }

    const redraw = wireTargetChain(tableEl, progressEl, LABELS, target, () => {
      circuitDone = true;
      maybeFinish();
    });

    buildChain($("#chain6"), {
      labels: LABELS,
      gate1: { pick: true, init: "AND" },
      gate2: { pick: true, init: "AND" },
      onUpdate(vals, g1, g2) {
        redraw(vals, g1, g2);
      }
    });

    const CANDIDATES = [
      { text: "(HotFood AND StockOK) OR DrinkOnly", why: "HotFood and StockOK meet first at Gate 1 ('a hot item and stock available'), and DrinkOnly joins in afterwards at Gate 2 with 'or'." },
      { text: "HotFood AND (StockOK OR DrinkOnly)", why: "That groups StockOK and DrinkOnly together — but the sentence joins HotFood and StockOK first, with DrinkOnly only joining afterwards." },
      { text: "(HotFood OR StockOK) AND DrinkOnly", why: "That's the right two gates, but their order is reversed — check which pair meets at Gate 1, and which single input meets Gate 2." },
      { text: "(HotFood AND StockOK) AND DrinkOnly", why: "Close, but 'or' is doing real work in this sentence — Gate 2 needs to be OR, not AND." }
    ];
    const container = $("#expr6");
    const status = $("#exprStatus6");
    status.setAttribute("aria-live", "polite");
    status.textContent = "Once the table's lighting up, read the finished wiring back into its expression.";
    wireExpressionPicker(container, status, CANDIDATES, 0, () => {
      exprDone = true;
      maybeFinish();
    });
  })();
