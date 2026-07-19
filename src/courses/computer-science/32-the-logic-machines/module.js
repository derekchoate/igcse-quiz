
  /* ========== Module 30 — The Logic Machines ==========
   Signature interaction: a gate bench — one or two input switches (the
   exact .bit/.bulb markup from Module 1's board kit, reused rather than
   copied) feeding an inline-SVG gate symbol, which lights a single output
   lamp (also .bit/.bulb, non-interactive). A notebook (truth table) below
   each bench fills in a row the moment that exact input combination has
   actually been tried — never a submit-and-check flow, just a live record
   of what's been tested. makeGateBench()/renderNotebook() are the shared
   factories, reused six times across D1-D4 (one bench per gate), once more
   for D5's chained three-input assembly, and a mystery variant for D6.

   Gate symbols follow the standard shapes Cambridge's own diagrams use
   (confirmed against the 2026-28 syllabus's Boolean logic section and
   cross-checked against Cambridge past-paper conventions): AND is a flat-
   backed, rounded-fronted "D" shape; OR curves inward at the back and
   comes to a point at the front; NOT is a triangle with a small bubble on
   its tip; NAND/NOR are AND/OR with that same bubble added to the output;
   XOR is OR's shape with one extra curved line just behind the back edge.
   Truth tables: NOT (0→1, 1→0); AND (only 1,1→1); OR (only 0,0→0); NAND
   (NOT of AND — only 1,1→0); NOR (NOT of OR — only 0,0→1); XOR (1 only
   when inputs differ). NOT takes one input; every other gate takes exactly
   two — the syllabus's own limit, respected by every bench on this page,
   including D5's three-input notebook, which is built from two chained
   2-input AND gates rather than a single 3-input gate (Cambridge draws no
   such thing).

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks,
   toast, awardStar and makeChips are all in scope. */

  const GATE_INPUTS = { NOT: 1, AND: 2, OR: 2, NAND: 2, NOR: 2, XOR: 2 };
  const GATE_FN = {
    NOT: a => (a ? 0 : 1),
    AND: (a, b) => (a && b ? 1 : 0),
    OR: (a, b) => (a || b ? 1 : 0),
    NAND: (a, b) => (a && b ? 0 : 1),
    NOR: (a, b) => (a || b ? 0 : 1),
    XOR: (a, b) => (a !== b ? 1 : 0)
  };
  function evalGate(type, vals) {
    return GATE_INPUTS[type] === 1 ? GATE_FN[type](vals[0]) : GATE_FN[type](vals[0], vals[1]);
  }

  /* ═══ gate symbol shapes, viewBox 0 0 170 90 throughout ═══ */
  function gateBodyMarkup(type) {
    switch (type) {
      case "AND":
        return '<path class="gbody" data-gbody="1" d="M40,10 H70 A35,35 0 0 1 70,80 H40 Z"/>';
      case "OR":
        return '<path class="gbody" data-gbody="1" d="M40,10 C70,10 95,25 115,45 C95,65 70,80 40,80 C58,65 58,25 40,10 Z"/>';
      case "NOT":
        return '<path class="gbody" data-gbody="1" d="M40,10 L40,80 L100,45 Z"/>' +
               '<circle class="gbubble" cx="108" cy="45" r="7"/>';
      case "NAND":
        return '<path class="gbody" data-gbody="1" d="M40,10 H70 A35,35 0 0 1 70,80 H40 Z"/>' +
               '<circle class="gbubble" cx="113" cy="45" r="7"/>';
      case "NOR":
        return '<path class="gbody" data-gbody="1" d="M40,10 C70,10 95,25 115,45 C95,65 70,80 40,80 C58,65 58,25 40,10 Z"/>' +
               '<circle class="gbubble" cx="123" cy="45" r="7"/>';
      case "XOR":
        return '<path class="gwire-extra" d="M30,10 C48,25 48,65 30,80"/>' +
               '<path class="gbody" data-gbody="1" d="M40,10 C70,10 95,25 115,45 C95,65 70,80 40,80 C58,65 58,25 40,10 Z"/>';
      default:
        return "";
    }
  }
  const GATE_OUT_X = { AND: 105, OR: 115, NOT: 115, NAND: 120, NOR: 130, XOR: 115 };
  function gateWiresMarkup(type) {
    const n = GATE_INPUTS[type];
    let s = "";
    if (n === 1) {
      s += '<line class="gwire" data-wire="a" x1="0" y1="45" x2="40" y2="45"/>';
    } else {
      s += '<line class="gwire" data-wire="a" x1="0" y1="25" x2="40" y2="25"/>';
      s += '<line class="gwire" data-wire="b" x1="0" y1="65" x2="40" y2="65"/>';
    }
    s += '<line class="gwire" data-wire="out" x1="' + GATE_OUT_X[type] + '" y1="45" x2="170" y2="45"/>';
    return s;
  }
  function buildGateSVG(type, ariaLabel) {
    return '<svg class="gate-svg" viewBox="0 0 170 90" role="img" aria-label="' + ariaLabel + '">' +
      gateWiresMarkup(type) + gateBodyMarkup(type) + "</svg>";
  }
  function buildMysterySVG(nInputs) {
    const yA = nInputs === 1 ? 45 : 25;
    let s = '<svg class="gate-svg" viewBox="0 0 170 90" role="img" aria-label="mystery machine, symbol hidden">';
    s += '<line class="gwire" data-wire="a" x1="0" y1="' + yA + '" x2="40" y2="' + yA + '"/>';
    if (nInputs === 2) s += '<line class="gwire" data-wire="b" x1="0" y1="65" x2="40" y2="65"/>';
    s += '<line class="gwire" data-wire="out" x1="130" y1="45" x2="170" y2="45"/>';
    s += '<rect class="gbody-mystery" x="40" y="10" width="90" height="70" rx="10"/>';
    s += '<text class="gmystery-q" x="85" y="53" text-anchor="middle">?</text>';
    s += "</svg>";
    return s;
  }

  /* ═══ shared: input switches (Module 1's .bit/.bulb, reused not copied) ═══ */
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
  function makeOutputLamp() {
    const d = document.createElement("div");
    d.className = "bit lamp-out";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML = '<span class="bulb"></span><span class="bit-val">Q</span><span class="bit-digit">0</span>';
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

  /* ═══ shared: one gate bench — switches, symbol (or mystery box), lamp ═══
     Reused for every gate in D1-D4 and, in mystery mode, for D6. `onTry`
     fires on every switch flip with (valsArray, output). */
  function makeGateBench(host, type, opts) {
    opts = opts || {};
    const nInputs = GATE_INPUTS[type];
    const labels = nInputs === 1 ? ["A"] : ["A", "B"];
    const wrap = document.createElement("div");
    wrap.className = "gate-bench";

    if (opts.label) {
      const lab = document.createElement("p");
      lab.className = "gate-bench-label";
      lab.textContent = opts.label;
      wrap.appendChild(lab);
    }

    const switchRow = document.createElement("div");
    switchRow.className = "gate-switches";
    const switches = labels.map(lab => makeInputSwitch(lab, update));
    switches.forEach(b => switchRow.appendChild(b));

    const diagramWrap = document.createElement("div");
    diagramWrap.className = "gate-diagram";
    diagramWrap.innerHTML = opts.mystery ? buildMysterySVG(nInputs) : buildGateSVG(type, type + " gate symbol");
    const svgEl = $(".gate-svg", diagramWrap);

    const lampWrap = document.createElement("div");
    lampWrap.className = "gate-lamp-wrap";
    const lamp = makeOutputLamp();
    lampWrap.appendChild(lamp);

    const readout = document.createElement("p");
    readout.className = "gate-readout";
    readout.setAttribute("aria-live", "polite");

    wrap.append(switchRow, diagramWrap, lampWrap, readout);
    host.appendChild(wrap);

    function values() {
      return switches.map(b => (b.getAttribute("aria-pressed") === "true" ? 1 : 0));
    }
    function update() {
      const vals = values();
      const out = evalGate(type, vals);
      setLamp(lamp, out);
      setWire(svgEl, "a", vals[0]);
      if (nInputs === 2) setWire(svgEl, "b", vals[1]);
      setWire(svgEl, "out", out);
      svgEl.classList.toggle("fired", !!out);
      readout.textContent = nInputs === 1
        ? "A = " + vals[0] + " → output = " + out
        : "A = " + vals[0] + ", B = " + vals[1] + " → output = " + out;
      if (opts.onTry) opts.onTry(vals, out);
    }
    update();

    return {
      reveal(realType) {
        diagramWrap.innerHTML = buildGateSVG(realType, realType + " gate symbol");
        const newSvg = $(".gate-svg", diagramWrap);
        const vals = values();
        setWire(newSvg, "a", vals[0]);
        if (nInputs === 2) setWire(newSvg, "b", vals[1]);
        setWire(newSvg, "out", evalGate(type, vals));
        newSvg.classList.toggle("fired", !!evalGate(type, vals));
      }
    };
  }

  /* ═══ shared: the notebook (truth table), filling in only tested rows ═══ */
  function comboRows(nInputs) {
    return nInputs === 1 ? ["0", "1"] : ["00", "01", "10", "11"];
  }
  function renderNotebook(container, type, tested) {
    const nInputs = GATE_INPUTS[type];
    const rows = comboRows(nInputs);
    const table = document.createElement("table");
    table.className = "gm-table";
    const thead = document.createElement("thead");
    const htr = document.createElement("tr");
    (nInputs === 1 ? ["A", "Q"] : ["A", "B", "Q"]).forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    rows.forEach(key => {
      const digits = key.split("");
      const tr = document.createElement("tr");
      const done = tested.has(key);
      digits.forEach(d => {
        const td = document.createElement("td");
        td.textContent = d;
        tr.appendChild(td);
      });
      const outTd = document.createElement("td");
      outTd.textContent = done ? String(evalGate(type, digits.map(Number))) : "—";
      tr.appendChild(outTd);
      if (done) tr.classList.add("tested");
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = "";
    container.appendChild(table);
  }

  /* ═══ shared: wire one bench to its notebook, tracking tested combos ═══
     onCombo receives (key, tested) — the tested Set is handed straight to
     the callback rather than relying on the caller's own reference to it,
     since makeGateBench fires onTry synchronously during construction
     (its very first render), before a `const tested = wireGateWithNotebook(…)`
     assignment at the call site would have completed. */
  function wireGateWithNotebook(benchHost, tableHost, type, onCombo) {
    const tested = new Set();
    renderNotebook(tableHost, type, tested);
    makeGateBench(benchHost, type, {
      label: type,
      onTry(vals) {
        const key = vals.join("");
        tested.add(key);
        renderNotebook(tableHost, type, tested);
        if (onCombo) onCombo(key, tested);
      }
    });
    return tested;
  }

  /* ═══ D1: NOT, the contrarian ═══ */
  (function () {
    const check1 = makeChips($("#chips1"), ["0", "1"],
      () => awardStar("d1", "Both rows of NOT's notebook are filled in — the smallest possible gate, fully explored."),
      k => "Tried A = " + k,
      (label, remaining) => label + " — " + remaining + " more to go.");
    wireGateWithNotebook($("#benchNOT1"), $("#tableNOT1"), "NOT", check1);
  })();

  /* ═══ D2: AND & OR on the bench ═══ */
  (function () {
    const done = { AND: false, OR: false };
    const check2 = makeChips($("#chips2"), ["and", "or"],
      () => awardStar("d2", "Both notebooks complete — AND lit for exactly one combination, OR lit for three of the four, the same narrow gate and wide gate from Module 11, now with real symbols."),
      k => (k === "and" ? "Completed AND's notebook" : "Completed OR's notebook"),
      (label, remaining) => label + " — " + remaining + " more to go.");
    function watch(type, tested) {
      if (!done[type] && tested.size === 4) {
        done[type] = true;
        check2(type.toLowerCase());
      }
    }
    wireGateWithNotebook($("#benchAND2"), $("#tableAND2"), "AND", (key, tested) => watch("AND", tested));
    wireGateWithNotebook($("#benchOR2"), $("#tableOR2"), "OR", (key, tested) => watch("OR", tested));
  })();

  /* ═══ D3: The N-twins — NAND and NOR ═══ */
  (function () {
    const done = { NAND: false, NOR: false };
    const check3 = makeChips($("#chips3"), ["nand", "nor"],
      () => awardStar("d3", "Both bubbled notebooks complete — NAND flips AND's one lit row into everything else, and NOR flips OR's one dark row into the only one left lit."),
      k => (k === "nand" ? "Completed NAND's notebook" : "Completed NOR's notebook"),
      (label, remaining) => label + " — " + remaining + " more to go.");
    function watch(type, tested) {
      if (!done[type] && tested.size === 4) {
        done[type] = true;
        check3(type.toLowerCase());
      }
    }
    wireGateWithNotebook($("#benchNAND3"), $("#tableNAND3"), "NAND", (key, tested) => watch("NAND", tested));
    wireGateWithNotebook($("#benchNOR3"), $("#tableNOR3"), "NOR", (key, tested) => watch("NOR", tested));
  })();

  /* ═══ D4: XOR, the difference detector ═══ */
  (function () {
    const check4 = makeChips($("#chips4"), ["00", "01", "10", "11"],
      () => awardStar("d4", "All four combinations tried — XOR lit exactly when the two switches disagreed, which is precisely the sum bulb you watched back in Module 3."),
      k => "Tried A,B = " + k,
      (label, remaining) => label + " — " + remaining + " more to go.");
    wireGateWithNotebook($("#benchXOR4"), $("#tableXOR4"), "XOR", check4);
  })();

  /* ═══ D5: three inputs, eight rows — two chained AND gates ═══
     Cambridge draws no single gate with three inputs, so this assembly is
     built honestly from two real 2-input AND gates, wired A AND B first,
     then that result AND C. The notebook's row order is the whole point:
     000 through 111, the same binary-counting pattern as Module 1's byte. */
  (function () {
    const chainHost = $("#chainHost5");
    const tableHost = $("#table3input5");
    const tested = new Set();

    const wrap = document.createElement("div");
    const switchRow = document.createElement("div");
    switchRow.className = "gate-switches";
    const switches = ["A", "B", "C"].map(lab => makeInputSwitch(lab, update));
    switches.forEach(b => switchRow.appendChild(b));

    const diagramWrap = document.createElement("div");
    diagramWrap.className = "gate-diagram";
    diagramWrap.innerHTML =
      '<svg class="gate-svg chain-svg" viewBox="0 0 260 110" role="img" aria-label="two AND gates chained: A AND B, then that result AND C">' +
      '<line class="gwire" data-wire="a" x1="0" y1="12" x2="40" y2="12"/>' +
      '<line class="gwire" data-wire="b" x1="0" y1="38" x2="40" y2="38"/>' +
      '<line class="gwire" data-wire="c" x1="0" y1="75" x2="130" y2="75"/>' +
      '<path class="gwire" data-wire="mid" d="M75,25 H100 V55 H130"/>' +
      '<line class="gwire" data-wire="out" x1="165" y1="65" x2="260" y2="65"/>' +
      '<path class="gbody" data-gate="1" d="M40,5 H55 A20,20 0 0 1 55,45 H40 Z"/>' +
      '<path class="gbody" data-gate="2" d="M130,45 H145 A20,20 0 0 1 145,85 H130 Z"/>' +
      "</svg>";
    const svgEl = $(".gate-svg", diagramWrap);

    const lampWrap = document.createElement("div");
    lampWrap.className = "gate-lamp-wrap";
    const lamp = makeOutputLamp();
    lampWrap.appendChild(lamp);

    const readout = document.createElement("p");
    readout.className = "gate-readout";
    readout.setAttribute("aria-live", "polite");

    const note = document.createElement("p");
    note.className = "chain-note";
    note.textContent = "Gate 1: A AND B. Gate 2: (that result) AND C.";

    wrap.append(switchRow, diagramWrap, lampWrap, readout, note);
    chainHost.appendChild(wrap);

    const check5 = makeChips($("#chips5"), ["000", "001", "010", "011", "100", "101", "110", "111"],
      () => awardStar("d5", "All eight rows filled, in the same binary-counting order as Module 1's very first byte — the pattern behind every truth table Cambridge will ever show you."),
      k => "Tried " + k,
      (label, remaining) => label + " — " + remaining + " more to go.");

    function renderChainTable() {
      const table = document.createElement("table");
      table.className = "gm-table";
      const thead = document.createElement("thead");
      const htr = document.createElement("tr");
      ["A", "B", "C", "Q"].forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      ["000", "001", "010", "011", "100", "101", "110", "111"].forEach(key => {
        const digits = key.split("").map(Number);
        const tr = document.createElement("tr");
        const done = tested.has(key);
        digits.forEach(d => {
          const td = document.createElement("td");
          td.textContent = d;
          tr.appendChild(td);
        });
        const outTd = document.createElement("td");
        outTd.textContent = done ? String(digits[0] && digits[1] && digits[2] ? 1 : 0) : "—";
        tr.appendChild(outTd);
        if (done) tr.classList.add("tested");
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      tableHost.innerHTML = "";
      tableHost.appendChild(table);
    }
    renderChainTable();

    function update() {
      const vals = switches.map(b => (b.getAttribute("aria-pressed") === "true" ? 1 : 0));
      const mid = vals[0] && vals[1] ? 1 : 0;
      const out = mid && vals[2] ? 1 : 0;
      setLamp(lamp, out);
      setWire(svgEl, "a", vals[0]);
      setWire(svgEl, "b", vals[1]);
      setWire(svgEl, "c", vals[2]);
      setWire(svgEl, "mid", mid);
      setWire(svgEl, "out", out);
      $('[data-gate="1"]', svgEl).classList.toggle("fired", !!mid);
      $('[data-gate="2"]', svgEl).classList.toggle("fired", !!out);
      readout.textContent = "A = " + vals[0] + ", B = " + vals[1] + ", C = " + vals[2] + " → output = " + out;
      const key = vals.join("");
      tested.add(key);
      renderChainTable();
      check5(key);
    }
    update();
  })();

  /* ═══ D6: name that gate — three mystery machines ═══ */
  (function () {
    const MYSTERIES = [
      { id: "mysteryA6", key: "mysteryA", type: "NAND", label: "Machine A" },
      { id: "mysteryB6", key: "mysteryB", type: "XOR", label: "Machine B" },
      { id: "mysteryC6", key: "mysteryC", type: "NOR", label: "Machine C" }
    ];
    const CANDIDATES = ["AND", "OR", "NAND", "NOR", "XOR"];
    const GATE_HINT = {
      AND: "It only ever lit for one single combination — both inputs true. Everything else left it dark.",
      OR: "It lit for three of the four combinations — only both-off left it dark.",
      NAND: "It lit for three of the four combinations — only both-on left it dark.",
      NOR: "It only ever lit for one single combination — both inputs off. Everything else left it dark.",
      XOR: "It lit only when the two inputs disagreed — matching inputs, on or off, always left it dark."
    };

    const check6 = makeChips($("#chips6"), MYSTERIES.map(m => m.key),
      () => awardStar("d6", "All three machines named from nothing but their behaviour — that's the whole syllabus's worth of gates, recognised on sight now."),
      key => "Named " + MYSTERIES.find(m => m.key === key).label,
      (label, remaining) => label + " — " + remaining + " more to go.");

    MYSTERIES.forEach(m => {
      const col = $("#" + m.id);
      let solved = false;
      const bench = makeGateBench(col, m.type, { mystery: true, label: m.label });

      const optionRow = document.createElement("div");
      optionRow.className = "gm-option-row";
      optionRow.setAttribute("role", "group");
      optionRow.setAttribute("aria-label", "Name " + m.label);
      const status = document.createElement("p");
      status.className = "gm-status";
      status.setAttribute("aria-live", "polite");
      status.textContent = "Flip both switches through every combination, then take your pick.";

      CANDIDATES.forEach(name => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "gm-option-btn";
        b.textContent = name;
        b.addEventListener("click", () => {
          if (solved) return;
          if (name === m.type) {
            solved = true;
            b.classList.add("locked");
            $$(".gm-option-btn", optionRow).forEach(other => {
              if (other !== b) other.disabled = true;
            });
            bench.reveal(m.type);
            status.classList.add("solved");
            status.textContent = m.label + " is " + m.type + " — " + GATE_HINT[m.type];
            check6(m.key);
          } else {
            status.classList.remove("solved");
            status.textContent = "Not quite that one — " + GATE_HINT[m.type] + " Try every combination again with that in mind.";
          }
        });
        optionRow.appendChild(b);
      });

      col.append(optionRow, status);
    });
  })();
