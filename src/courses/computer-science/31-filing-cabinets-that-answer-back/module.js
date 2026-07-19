
  /* ========== Module 29 — Filing Cabinets that Answer Back ==========
   Signature interaction: a single live table (Kedai Boba's order book,
   8 orders) that every discovery from D2 onward queries by snapping
   real controls together — field toggles for SELECT, a condition-row
   factory for WHERE (with an AND/OR joiner for two conditions), a
   field+direction toggle for ORDER BY, and COUNT/SUM tiles. Every one of
   those controls re-renders the table (and the live SQL line above it)
   immediately on change — there is no "run query" step anywhere, so a
   wrong combination cannot exist; it just continuously shows what the
   query currently means, exactly as the plan specifies.

   D1 is a separate, simpler pair of <select> pickers over a static
   rendering of the same table (explore a field, explore a record), plus
   two demonstration buttons for the primary-key rule.

   D2-D6 share three small local factories — renderDynamicTable(),
   makeConditionRow() and the WHERE/AND-OR wiring pattern — reused four
   times across this file (D3 and D6 both build a full condition setup;
   D2, D4 and D5 lean on renderDynamicTable alone). Same "reuse well past
   the rule of two" shape as Module 28's makeBinSorter.

   SQL conventions follow the Cambridge 0478 (2026-28) syllabus section
   9.1 keyword list exactly: SELECT, FROM, WHERE, ORDER BY ASCENDING,
   ORDER BY DESCENDING, SUM, COUNT, AND, OR — all uppercase, direction
   spelled out in full (never ASC/DESC). The syllabus text itself does not
   show a worked example with quoting or semicolons, so this module
   applies the well-established convention from Cambridge's own past
   papers: single quotes around text values, no quotes around numbers,
   no trailing semicolon. SELECT always names its fields explicitly
   (never "*", and COUNT always counts the named primary key OrderID
   rather than COUNT(*)) since the wildcard isn't in the syllabus's own
   keyword list and this keeps every line unambiguously inside it.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks,
   toast, awardStar and makeChips are all in scope. */

  const FIELDS = [
    { key: "OrderID",  label: "OrderID",    type: "number", kind: "integer" },
    { key: "Customer", label: "Customer",   type: "text",   kind: "text/alphanumeric" },
    { key: "Drink",    label: "Drink",      type: "text",   kind: "text/alphanumeric" },
    { key: "Size",     label: "Size",       type: "text",   kind: "text/alphanumeric" },
    { key: "Price",    label: "Price (RM)", type: "number", kind: "real" },
    { key: "Quantity", label: "Quantity",   type: "number", kind: "integer" }
  ];
  const FIELD_KEYS = FIELDS.map(f => f.key);
  const fieldMeta = key => FIELDS.find(f => f.key === key);

  const ORDERS = [
    { OrderID: 1001, Customer: "Aisyah",   Drink: "Brown Sugar Boba Milk", Size: "Large",   Price: 12.90, Quantity: 1 },
    { OrderID: 1002, Customer: "Wei Jian", Drink: "Thai Milk Tea",         Size: "Regular", Price: 8.50,  Quantity: 2 },
    { OrderID: 1003, Customer: "Priya",    Drink: "Wintermelon Lemonade",  Size: "Regular", Price: 7.90,  Quantity: 1 },
    { OrderID: 1004, Customer: "Haziq",    Drink: "Taro Milk Tea",         Size: "Large",   Price: 11.50, Quantity: 1 },
    { OrderID: 1005, Customer: "Mei Ling", Drink: "Brown Sugar Boba Milk", Size: "Regular", Price: 9.90,  Quantity: 1 },
    { OrderID: 1006, Customer: "Kumar",    Drink: "Matcha Latte",          Size: "Large",   Price: 13.50, Quantity: 2 },
    { OrderID: 1007, Customer: "Nurul",    Drink: "Thai Milk Tea",         Size: "Large",   Price: 9.50,  Quantity: 1 },
    { OrderID: 1008, Customer: "Farah",    Drink: "Lychee Oolong",         Size: "Regular", Price: 8.90,  Quantity: 1 }
  ];

  function distinctValues(key) {
    const seen = [];
    ORDERS.forEach(r => { if (!seen.includes(r[key])) seen.push(r[key]); });
    return seen;
  }
  function fmtVal(field, v) {
    if (field.type === "text") return "'" + v + "'";
    if (field.key === "Price") return Number(v).toFixed(2);
    return String(v);
  }
  function fmtCell(field, v) {
    return field.key === "Price" ? "RM" + Number(v).toFixed(2) : String(v);
  }
  function round2(n) { return Math.round(n * 100) / 100; }

  /* ═══ shared: render a table (or a placeholder) into a container ═══ */
  function renderDynamicTable(container, cols, rows) {
    container.innerHTML = "";
    if (!cols || !cols.length) {
      const p = document.createElement("p");
      p.className = "qb-empty";
      p.textContent = "Choose at least one field above to see it here.";
      container.appendChild(p);
      return;
    }
    const data = rows || ORDERS;
    if (!data.length) {
      const p = document.createElement("p");
      p.className = "qb-empty";
      p.textContent = "No records match this condition yet — try a different value.";
      container.appendChild(p);
      return;
    }
    const table = document.createElement("table");
    table.className = "qb-table";
    const thead = document.createElement("thead");
    const htr = document.createElement("tr");
    cols.forEach(f => {
      const th = document.createElement("th");
      th.textContent = f.label;
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    data.forEach(r => {
      const tr = document.createElement("tr");
      cols.forEach(f => {
        const td = document.createElement("td");
        td.textContent = fmtCell(f, r[f.key]);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  /* ═══ shared: WHERE matching ═══ */
  function matchCond(row, cond) {
    const a = row[cond.field.key], b = cond.value;
    switch (cond.op) {
      case "=": return a === b;
      case "<": return a < b;
      case ">": return a > b;
      case "<=": return a <= b;
      case ">=": return a >= b;
      default: return false;
    }
  }
  function applyWhere(rows, conds, joiner) {
    if (!conds.length) return rows;
    return rows.filter(r => {
      if (conds.length === 1) return matchCond(r, conds[0]);
      const a = matchCond(r, conds[0]), b = matchCond(r, conds[1]);
      return joiner === "OR" ? (a || b) : (a && b);
    });
  }
  function condText(cond) {
    return cond.field.key + " " + cond.op + " " + fmtVal(cond.field, cond.value);
  }

  /* ═══ shared: one condition row (field + comparison + value selects) ═══
     Reused by D3 and D6 — two conditions each, four instances in all. */
  function populateOpSelect(sel, field) {
    sel.innerHTML = "";
    const ops = field.type === "text" ? ["="] : ["=", "<", ">", "<=", ">="];
    ops.forEach(op => {
      const o = document.createElement("option");
      o.value = op; o.textContent = op;
      sel.appendChild(o);
    });
  }
  function populateValueSelect(sel, field) {
    sel.innerHTML = "";
    distinctValues(field.key).forEach(v => {
      const o = document.createElement("option");
      o.value = String(v);
      o.textContent = fmtCell(field, v);
      sel.appendChild(o);
    });
  }
  /* Text conditions pick from a dropdown of the field's real values — always
     a genuine match, never a typo or a case-sensitivity trap. Number
     conditions use a free number input instead: a dropdown limited to
     values already in the table would make an ordinary threshold like
     "Price > 10" impossible to build, since no single order costs exactly
     RM10. Either widget always yields a valid comparison — there's nothing
     to get wrong with a number, and nothing case-sensitive to mistype in
     the dropdown. */
  function makeConditionRow(container, label, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "qb-cond";
    const lab = document.createElement("span");
    lab.className = "qb-cond-label"; lab.textContent = label + ":";
    const fieldSel = document.createElement("select");
    fieldSel.className = "qb-select"; fieldSel.setAttribute("aria-label", label + " field");
    FIELDS.forEach(f => {
      const o = document.createElement("option");
      o.value = f.key; o.textContent = f.label;
      fieldSel.appendChild(o);
    });
    const opSel = document.createElement("select");
    opSel.className = "qb-select"; opSel.setAttribute("aria-label", label + " comparison");
    let valueEl = null;

    function buildValueEl(field) {
      if (valueEl) valueEl.remove();
      if (field.type === "number") {
        valueEl = document.createElement("input");
        valueEl.type = "number";
        valueEl.step = field.key === "Price" ? "0.1" : "1";
        valueEl.value = String(Math.min.apply(null, distinctValues(field.key)));
        valueEl.addEventListener("input", onChange);
      } else {
        valueEl = document.createElement("select");
        populateValueSelect(valueEl, field);
        valueEl.addEventListener("change", onChange);
      }
      valueEl.className = "qb-select qb-cond-value";
      valueEl.setAttribute("aria-label", label + " value");
      wrap.appendChild(valueEl);
    }
    function refresh() {
      const f = fieldMeta(fieldSel.value);
      populateOpSelect(opSel, f);
      buildValueEl(f);
      onChange();
    }
    fieldSel.addEventListener("change", refresh);
    opSel.addEventListener("change", onChange);
    wrap.append(lab, fieldSel, opSel);
    container.appendChild(wrap);
    refresh();

    return {
      get() {
        const f = fieldMeta(fieldSel.value);
        const raw = valueEl.value;
        return { field: f, op: opSel.value, value: f.type === "number" ? Number(raw) : raw };
      }
    };
  }

  /* ═══ D1: meet the order book — fields, records, the primary key rule ═══ */
  (function () {
    const tableWrap = $("#qbTable1");
    const fieldPicker = $("#fieldPicker1");
    const recordPicker = $("#recordPicker1");
    const fieldCaption = $("#fieldCaption1");
    const recordCaption = $("#recordCaption1");
    const keyCaption = $("#keyCaption1");

    let highlightField = null, highlightOrderId = null;

    function redraw() {
      tableWrap.innerHTML = "";
      const table = document.createElement("table");
      table.className = "qb-table";
      const thead = document.createElement("thead");
      const htr = document.createElement("tr");
      FIELDS.forEach(f => {
        const th = document.createElement("th");
        if (highlightField === f.key) th.classList.add("qb-col-active");
        th.innerHTML = f.label + '<span class="qb-type">' + f.kind + "</span>";
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      ORDERS.forEach(r => {
        const tr = document.createElement("tr");
        if (highlightOrderId === r.OrderID) tr.classList.add("qb-row-active");
        FIELDS.forEach(f => {
          const td = document.createElement("td");
          if (highlightField === f.key) td.classList.add("qb-col-active");
          td.textContent = fmtCell(f, r[f.key]);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);
    }
    redraw();

    FIELDS.forEach(f => {
      const o = document.createElement("option");
      o.value = f.key; o.textContent = f.label;
      fieldPicker.appendChild(o);
    });
    ORDERS.forEach(r => {
      const o = document.createElement("option");
      o.value = r.OrderID; o.textContent = r.Customer + "'s order (OrderID " + r.OrderID + ")";
      recordPicker.appendChild(o);
    });

    const FIELD_DESC = {
      OrderID: "the order number Kedai Boba assigns to every order — and, as the buttons below show, this table's primary key.",
      Customer: "a text field — who placed the order.",
      Drink: "a text field — which drink was ordered.",
      Size: "a text field with only two values in this table, Regular or Large.",
      Price: "a real (decimal) field — the price of that order, in Ringgit.",
      Quantity: "an integer field — how many cups were in that order."
    };

    const check1 = makeChips($("#chips1"), ["field", "record", "duplicate"],
      () => awardStar("d1", "You toured a field, toured a record, and watched the table calmly protect its one rule: every OrderID stays unique. That's the whole anatomy of a table, from the inside."),
      k => k === "field" ? "Explored a field" : k === "record" ? "Explored a record" : "Tried the duplicate key",
      (label, remaining) => label + " — " + remaining + " more to go.");

    fieldPicker.addEventListener("change", () => {
      highlightField = fieldPicker.value || null;
      redraw();
      if (highlightField) {
        fieldCaption.textContent = fieldMeta(highlightField).label + " is a field: " + FIELD_DESC[highlightField] + " Every record in this table has exactly one value in this column.";
        check1("field");
      }
    });
    recordPicker.addEventListener("change", () => {
      highlightOrderId = recordPicker.value ? Number(recordPicker.value) : null;
      redraw();
      if (highlightOrderId) {
        const r = ORDERS.find(o => o.OrderID === highlightOrderId);
        recordCaption.textContent = "This whole row is one record: " + r.Customer + "'s order — OrderID " + r.OrderID + ", " + r.Quantity + " × " + r.Drink + " (" + r.Size + "), RM" + r.Price.toFixed(2) + ". Every property listed together, side by side, is what makes it one record.";
        check1("record");
      }
    });
    $("#dupBtn1").addEventListener("click", () => {
      keyCaption.textContent = "OrderID 1004 already belongs to Haziq's order — the table politely declines. Every record needs its own OrderID that no other record shares; that's what makes it a primary key. Nothing broke, nothing was lost — it simply won't let two records claim the same one.";
      check1("duplicate");
    });
    $("#newBtn1").addEventListener("click", () => {
      keyCaption.textContent = "OrderID 1009 isn't used by anyone yet, so this one is accepted without any fuss — that's the difference. A primary key only ever objects to a repeat, never to a fresh, unused value.";
    });
  })();

  /* ═══ D2: your first question — SELECT field chips + FROM ═══ */
  (function () {
    const board = $("#board2");
    const sqlEl = document.createElement("div");
    sqlEl.className = "qb-sql";
    const chipRow = document.createElement("div");
    chipRow.className = "qb-field-toggles";
    const tableWrap = document.createElement("div");
    tableWrap.className = "qb-table-wrap";
    board.append(sqlEl, chipRow, tableWrap);

    let selected = [];
    let awarded = false;

    function render() {
      sqlEl.textContent = selected.length
        ? "SELECT " + selected.join(", ") + "\nFROM Orders"
        : "SELECT ⟨choose fields below⟩\nFROM Orders";
      renderDynamicTable(tableWrap, FIELDS.filter(f => selected.includes(f.key)));
      if (selected.length === 2 && !awarded) {
        awarded = true;
        awardStar("d2", "SELECT Customer, Price FROM Orders — two fields, one FROM, and the table narrows to exactly the columns you asked for. That's a complete, real query.");
      }
    }
    FIELDS.forEach(f => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "qb-chip-toggle"; b.textContent = f.label;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => {
        const on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) selected.push(f.key); else selected = selected.filter(k => k !== f.key);
        render();
      });
      chipRow.appendChild(b);
    });
    render();
  })();

  /* ═══ D3: narrow it down — WHERE + AND/OR ═══ */
  (function () {
    const board = $("#board3");
    const sqlEl = document.createElement("div");
    sqlEl.className = "qb-sql";
    const condsWrap = document.createElement("div");
    condsWrap.className = "qb-conds";
    const addBtn = document.createElement("button");
    addBtn.type = "button"; addBtn.className = "loop-btn"; addBtn.textContent = "+ Add another condition (AND/OR)";
    const joinerWrap = document.createElement("div");
    joinerWrap.className = "qb-joiner"; joinerWrap.hidden = true;
    const joinerLabel = document.createElement("span");
    joinerLabel.textContent = "Combine with: ";
    const andBtn = document.createElement("button");
    andBtn.type = "button"; andBtn.className = "toggle-btn active"; andBtn.textContent = "AND";
    andBtn.setAttribute("aria-pressed", "true");
    const orBtn = document.createElement("button");
    orBtn.type = "button"; orBtn.className = "toggle-btn"; orBtn.textContent = "OR";
    orBtn.setAttribute("aria-pressed", "false");
    joinerWrap.append(joinerLabel, andBtn, orBtn);
    const tableWrap = document.createElement("div");
    tableWrap.className = "qb-table-wrap";
    // board3 already holds the chips-label paragraph and chips div from
    // content.html — insert the new controls before that existing anchor,
    // in reading order, so the chip checklist stays last.
    const anchor3 = board.firstChild;
    [sqlEl, condsWrap, addBtn, joinerWrap, tableWrap].forEach(el => board.insertBefore(el, anchor3));

    let cond1 = null, cond2 = null, joiner = "AND";

    const check3 = makeChips($("#chips3"), ["single", "combined"],
      () => awardStar("d3", "WHERE narrowed the table to just the rows you asked for, and AND/OR let you narrow it by two conditions at once — the exact same narrow gate/wide gate you met back in Module 11, doing precisely the same job on rows of data."),
      k => k === "single" ? "Built one condition" : "Combined two with AND/OR",
      (label, remaining) => label + " — " + remaining + " more to go.");

    function render() {
      // cond1 fires its own build-time refresh() — and therefore this
      // render() — before makeConditionRow has returned and been assigned
      // to cond1 below, so the very first call arrives with cond1 still null.
      if (!cond1) return;
      const conds = [cond1.get()];
      if (cond2) conds.push(cond2.get());
      const filtered = applyWhere(ORDERS, conds, joiner);
      let sql = "SELECT " + FIELD_KEYS.join(", ") + "\nFROM Orders\nWHERE " + condText(conds[0]);
      if (conds[1]) sql += " " + joiner + " " + condText(conds[1]);
      sqlEl.textContent = sql;
      renderDynamicTable(tableWrap, FIELDS, filtered);
      check3("single");
      if (cond2) check3("combined");
    }

    cond1 = makeConditionRow(condsWrap, "Condition 1", render);
    addBtn.addEventListener("click", () => {
      if (cond2) return;
      cond2 = makeConditionRow(condsWrap, "Condition 2", render);
      joinerWrap.hidden = false;
      addBtn.hidden = true;
      render();
    });
    andBtn.addEventListener("click", () => {
      joiner = "AND";
      andBtn.classList.add("active"); andBtn.setAttribute("aria-pressed", "true");
      orBtn.classList.remove("active"); orBtn.setAttribute("aria-pressed", "false");
      render();
    });
    orBtn.addEventListener("click", () => {
      joiner = "OR";
      orBtn.classList.add("active"); orBtn.setAttribute("aria-pressed", "true");
      andBtn.classList.remove("active"); andBtn.setAttribute("aria-pressed", "false");
      render();
    });
    render();
  })();

  /* ═══ D4: line them up — ORDER BY + ASCENDING/DESCENDING ═══ */
  (function () {
    const board = $("#board4");
    const sqlEl = document.createElement("div");
    sqlEl.className = "qb-sql";
    const pickerRow = document.createElement("div");
    pickerRow.className = "qb-picker-row";
    const label = document.createElement("label");
    label.className = "qb-label"; label.setAttribute("for", "orderField4"); label.textContent = "ORDER BY";
    const fieldSel = document.createElement("select");
    fieldSel.id = "orderField4"; fieldSel.className = "qb-select";
    FIELDS.forEach(f => {
      const o = document.createElement("option");
      o.value = f.key; o.textContent = f.label;
      fieldSel.appendChild(o);
    });
    fieldSel.value = "Price";
    const ascBtn = document.createElement("button");
    ascBtn.type = "button"; ascBtn.className = "toggle-btn active"; ascBtn.textContent = "ASCENDING";
    ascBtn.setAttribute("aria-pressed", "true");
    const descBtn = document.createElement("button");
    descBtn.type = "button"; descBtn.className = "toggle-btn"; descBtn.textContent = "DESCENDING";
    descBtn.setAttribute("aria-pressed", "false");
    pickerRow.append(label, fieldSel, ascBtn, descBtn);
    const tableWrap = document.createElement("div");
    tableWrap.className = "qb-table-wrap";
    // board4 already holds the chips-label paragraph and chips div — same
    // insert-before-anchor approach as D3, keeping the checklist last.
    const anchor4 = board.firstChild;
    [sqlEl, pickerRow, tableWrap].forEach(el => board.insertBefore(el, anchor4));

    let direction = "ASCENDING";
    const check4 = makeChips($("#chips4"), ["ascending", "descending"],
      () => awardStar("d4", "You lined the whole table up both ways — ASCENDING and DESCENDING — and watched every row reorder itself, live, around whichever field you chose."),
      k => k === "ascending" ? "Sorted ascending" : "Sorted descending",
      (label, remaining) => label + " — " + remaining + " more to go.");

    function render() {
      const key = fieldSel.value;
      const rows = ORDERS.slice().sort((a, b) => {
        if (a[key] < b[key]) return direction === "ASCENDING" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ASCENDING" ? 1 : -1;
        return 0;
      });
      sqlEl.textContent = "SELECT " + FIELD_KEYS.join(", ") + "\nFROM Orders\nORDER BY " + key + " " + direction;
      renderDynamicTable(tableWrap, FIELDS, rows);
      check4(direction === "ASCENDING" ? "ascending" : "descending");
    }
    fieldSel.addEventListener("change", render);
    ascBtn.addEventListener("click", () => {
      direction = "ASCENDING";
      ascBtn.classList.add("active"); ascBtn.setAttribute("aria-pressed", "true");
      descBtn.classList.remove("active"); descBtn.setAttribute("aria-pressed", "false");
      render();
    });
    descBtn.addEventListener("click", () => {
      direction = "DESCENDING";
      descBtn.classList.add("active"); descBtn.setAttribute("aria-pressed", "true");
      ascBtn.classList.remove("active"); ascBtn.setAttribute("aria-pressed", "false");
      render();
    });
    render();
  })();

  /* ═══ D5: let it count — COUNT and SUM tiles ═══ */
  (function () {
    const board = $("#board5");
    const sqlEl = document.createElement("div");
    sqlEl.className = "qb-sql";
    sqlEl.textContent = "SELECT ⟨tap COUNT or SUM below⟩\nFROM Orders";
    const tileRow = document.createElement("div");
    tileRow.className = "qb-agg-row";
    const countBtn = document.createElement("button");
    countBtn.type = "button"; countBtn.className = "loop-btn"; countBtn.textContent = "COUNT";
    const sumBtn = document.createElement("button");
    sumBtn.type = "button"; sumBtn.className = "loop-btn"; sumBtn.textContent = "SUM";
    const sumFieldSel = document.createElement("select");
    sumFieldSel.className = "qb-select"; sumFieldSel.hidden = true;
    ["Price", "Quantity"].forEach(k => {
      const f = fieldMeta(k);
      const o = document.createElement("option");
      o.value = k; o.textContent = f.label;
      sumFieldSel.appendChild(o);
    });
    tileRow.append(countBtn, sumBtn, sumFieldSel);
    const resultEl = document.createElement("div");
    resultEl.className = "qb-result-value";
    // board5 already holds the chips-label paragraph and chips div — same
    // insert-before-anchor approach as D3/D4, keeping the checklist last.
    const anchor5 = board.firstChild;
    [sqlEl, tileRow, resultEl].forEach(el => board.insertBefore(el, anchor5));

    const check5 = makeChips($("#chips5"), ["count", "sum"],
      () => awardStar("d5", "COUNT(OrderID) told you how many records exist without listing a single one; SUM added up a whole column in one line. Two tiny words, doing arithmetic across every row at once."),
      k => k === "count" ? "Tried COUNT" : "Tried SUM",
      (label, remaining) => label + " — " + remaining + " more to go.");

    function showCount() {
      sumFieldSel.hidden = true;
      sqlEl.textContent = "SELECT COUNT(OrderID)\nFROM Orders";
      resultEl.textContent = "COUNT(OrderID) = " + ORDERS.length;
      check5("count");
    }
    function showSum() {
      sumFieldSel.hidden = false;
      const key = sumFieldSel.value || "Price";
      const total = round2(ORDERS.reduce((s, r) => s + r[key], 0));
      sqlEl.textContent = "SELECT SUM(" + key + ")\nFROM Orders";
      resultEl.textContent = "SUM(" + key + ") = " + (key === "Price" ? "RM" + total.toFixed(2) : total);
      check5("sum");
    }
    countBtn.addEventListener("click", showCount);
    sumBtn.addEventListener("click", showSum);
    sumFieldSel.addEventListener("change", showSum);
  })();

  /* ═══ D6: three real questions — the full builder + target-matching ═══ */
  (function () {
    const board = $("#board6");
    const sqlEl = document.createElement("div");
    sqlEl.className = "qb-sql";
    const condsWrap = document.createElement("div");
    condsWrap.className = "qb-conds";
    const addBtn = document.createElement("button");
    addBtn.type = "button"; addBtn.className = "loop-btn"; addBtn.textContent = "+ Add a condition";
    const joinerWrap = document.createElement("div");
    joinerWrap.className = "qb-joiner"; joinerWrap.hidden = true;
    const joinerLabel = document.createElement("span");
    joinerLabel.textContent = "Combine with: ";
    const andBtn = document.createElement("button");
    andBtn.type = "button"; andBtn.className = "toggle-btn active"; andBtn.textContent = "AND";
    andBtn.setAttribute("aria-pressed", "true");
    const orBtn = document.createElement("button");
    orBtn.type = "button"; orBtn.className = "toggle-btn"; orBtn.textContent = "OR";
    orBtn.setAttribute("aria-pressed", "false");
    joinerWrap.append(joinerLabel, andBtn, orBtn);
    const aggRow = document.createElement("div");
    aggRow.className = "qb-agg-row";
    const aggLabel = document.createElement("span");
    aggLabel.textContent = "Result: ";
    const aggSel = document.createElement("select");
    aggSel.className = "qb-select";
    [
      { v: "rows", l: "Show matching rows" },
      { v: "count", l: "COUNT(OrderID)" },
      { v: "sumPrice", l: "SUM(Price)" },
      { v: "sumQuantity", l: "SUM(Quantity)" }
    ].forEach(o => {
      const opt = document.createElement("option");
      opt.value = o.v; opt.textContent = o.l;
      aggSel.appendChild(opt);
    });
    aggRow.append(aggLabel, aggSel);
    const resultEl = document.createElement("div");
    resultEl.className = "qb-result-value";
    const tableWrap = document.createElement("div");
    tableWrap.className = "qb-table-wrap";
    board.append(sqlEl, condsWrap, addBtn, joinerWrap, aggRow, resultEl, tableWrap);

    let cond1 = null, cond2 = null, joiner = "AND";

    const targets = [
      { id: "t1", kind: "count", expected: 4 },
      { id: "t2", kind: "sumPrice", expected: 22.80 },
      { id: "t3", kind: "count", expected: 3, needsTwoConds: true }
    ];

    function currentConds() {
      const c = [];
      if (cond1) c.push(cond1.get());
      if (cond2) c.push(cond2.get());
      return c;
    }
    function checkTargets(kind, val, condCount) {
      targets.forEach(t => {
        if (t.matched) return;
        if (t.kind !== kind) return;
        if (t.needsTwoConds && condCount < 2) return;
        if (Math.abs(val - t.expected) > 0.001) return;
        t.matched = true;
        const card = $("#" + t.id.replace("t", "target"));
        card.classList.add("lit");
        const ans = $(".qb-target-a", card);
        ans.textContent = "Matched — your live query currently reads " + (kind === "sumPrice" ? "RM" + val.toFixed(2) : val) + ". That's the answer.";
        const r = card.getBoundingClientRect();
        sparks(r.left + r.width / 2, r.top);
        if (targets.every(x => x.matched)) {
          awardStar("d6", "Three real questions about Kedai Boba's orders, each answered by building a query and watching the number arrive — WHERE, AND, COUNT and SUM, all doing real work together.");
        }
      });
    }
    function render() {
      const conds = currentConds();
      const filtered = applyWhere(ORDERS, conds, joiner);
      const kind = aggSel.value;
      const selectClause = kind === "rows" ? FIELD_KEYS.join(", ")
        : kind === "count" ? "COUNT(OrderID)"
        : kind === "sumPrice" ? "SUM(Price)" : "SUM(Quantity)";
      let sql = "SELECT " + selectClause + "\nFROM Orders";
      if (conds.length) {
        sql += "\nWHERE " + condText(conds[0]);
        if (conds[1]) sql += " " + joiner + " " + condText(conds[1]);
      }
      sqlEl.textContent = sql;
      if (kind === "rows") {
        resultEl.textContent = "";
        renderDynamicTable(tableWrap, FIELDS, filtered);
      } else {
        tableWrap.innerHTML = "";
        const val = kind === "count" ? filtered.length
          : kind === "sumPrice" ? round2(filtered.reduce((s, r) => s + r.Price, 0))
          : filtered.reduce((s, r) => s + r.Quantity, 0);
        resultEl.textContent = "= " + (kind === "sumPrice" ? "RM" + val.toFixed(2) : val);
        checkTargets(kind, val, conds.length);
      }
    }

    addBtn.addEventListener("click", () => {
      if (!cond1) {
        cond1 = makeConditionRow(condsWrap, "Condition 1", render);
        addBtn.textContent = "+ Add another condition (AND/OR)";
      } else if (!cond2) {
        cond2 = makeConditionRow(condsWrap, "Condition 2", render);
        joinerWrap.hidden = false;
        addBtn.hidden = true;
      }
      render();
    });
    andBtn.addEventListener("click", () => {
      joiner = "AND";
      andBtn.classList.add("active"); andBtn.setAttribute("aria-pressed", "true");
      orBtn.classList.remove("active"); orBtn.setAttribute("aria-pressed", "false");
      render();
    });
    orBtn.addEventListener("click", () => {
      joiner = "OR";
      orBtn.classList.add("active"); orBtn.setAttribute("aria-pressed", "true");
      andBtn.classList.remove("active"); andBtn.setAttribute("aria-pressed", "false");
      render();
    });
    aggSel.addEventListener("change", render);
    render();
  })();
