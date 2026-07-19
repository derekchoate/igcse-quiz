const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 29: Filing Cabinets that Answer Back", () => {
  beforeEach(() => {
    loadModule("31-filing-cabinets-that-answer-back.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: meet the order book", () => {
    test("picking a field highlights it and explains it as a field", () => {
      const picker = document.getElementById("fieldPicker1");
      picker.value = "Drink";
      picker.dispatchEvent(new Event("change"));
      expect(document.getElementById("fieldCaption1").textContent).toMatch(/Drink is a field/);
    });

    test("picking a record explains it as one whole row", () => {
      const picker = document.getElementById("recordPicker1");
      picker.value = "1001";
      picker.dispatchEvent(new Event("change"));
      expect(document.getElementById("recordCaption1").textContent).toMatch(/one record/);
      expect(document.getElementById("recordCaption1").textContent).toMatch(/Aisyah/);
    });

    test("attempting a duplicate OrderID gets a calm, informative decline, never an error", () => {
      document.getElementById("dupBtn1").click();
      const text = document.getElementById("keyCaption1").textContent;
      expect(text).toMatch(/already belongs/i);
      expect(text).not.toMatch(/error|invalid|failed/i);
    });

    test("adding a fresh, unused OrderID is accepted without fuss", () => {
      document.getElementById("newBtn1").click();
      expect(document.getElementById("keyCaption1").textContent).toMatch(/accepted/i);
    });

    test("exploring a field, a record and the duplicate key awards the star", () => {
      const fieldPicker = document.getElementById("fieldPicker1");
      fieldPicker.value = "Drink";
      fieldPicker.dispatchEvent(new Event("change"));
      const recordPicker = document.getElementById("recordPicker1");
      recordPicker.value = "1001";
      recordPicker.dispatchEvent(new Event("change"));
      document.getElementById("dupBtn1").click();
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: your first question", () => {
    function fieldChip(label) {
      return Array.from(document.querySelectorAll("#board2 .qb-chip-toggle")).find(b => b.textContent === label);
    }
    test("the live SQL line and table are empty until fields are chosen", () => {
      const sql = document.querySelector("#board2 .qb-sql").textContent;
      expect(sql).toMatch(/SELECT/);
      expect(document.querySelector("#board2 .qb-empty")).toBeTruthy();
    });

    test("choosing two fields narrows the live table and the SQL line, and awards the star", () => {
      fieldChip("Customer").click();
      fieldChip("Price (RM)").click();
      const sql = document.querySelector("#board2 .qb-sql").textContent;
      expect(sql).toMatch(/SELECT Customer, Price/);
      expect(sql).toMatch(/FROM Orders/);
      const headers = Array.from(document.querySelectorAll("#board2 .qb-table thead th")).map(th => th.textContent);
      expect(headers).toEqual(["Customer", "Price (RM)"]);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: narrow it down", () => {
    test("a single WHERE condition filters rows live, with text values quoted and numbers not", () => {
      // The condition row's default field (OrderID) is numeric, so its value
      // control starts as a number <input>; switching the field to Size (text)
      // rebuilds it as a <select> of Size's real values — re-query each time.
      let cond = document.querySelector("#board3 .qb-cond");
      const fieldSel = cond.querySelectorAll("select")[0];
      fieldSel.value = "Size";
      fieldSel.dispatchEvent(new Event("change"));
      cond = document.querySelector("#board3 .qb-cond");
      const opSel = cond.querySelectorAll("select")[1];
      opSel.value = "=";
      opSel.dispatchEvent(new Event("change"));
      const valSel = cond.querySelector(".qb-cond-value");
      valSel.value = "Large";
      valSel.dispatchEvent(new Event("change"));
      const sql = document.querySelector("#board3 .qb-sql").textContent;
      expect(sql).toMatch(/WHERE Size = 'Large'/);
      const rows = document.querySelectorAll("#board3 .qb-table tbody tr");
      expect(rows.length).toBe(4);
    });

    test("a numeric WHERE condition allows a threshold that isn't one of the table's own values, with no quotes in the SQL", () => {
      const cond = document.querySelector("#board3 .qb-cond");
      const opSel = cond.querySelectorAll("select")[1];
      opSel.value = ">";
      opSel.dispatchEvent(new Event("change"));
      const valInput = cond.querySelector(".qb-cond-value");
      expect(valInput.tagName).toBe("INPUT");
      valInput.value = "1005";
      valInput.dispatchEvent(new Event("input"));
      const sql = document.querySelector("#board3 .qb-sql").textContent;
      expect(sql).toMatch(/WHERE OrderID > 1005/);
      expect(sql).not.toMatch(/'1005'/);
    });

    test("adding a second condition reveals the AND/OR joiner and combines conditions", () => {
      const addBtn = Array.from(document.querySelectorAll("#board3 .loop-btn")).find(b => b.textContent.match(/Add another condition/));
      addBtn.click();
      const joiner = document.querySelector("#board3 .qb-joiner");
      expect(joiner.hidden).toBe(false);
      const conds = document.querySelectorAll("#board3 .qb-cond");
      expect(conds.length).toBe(2);
    });

    test("building one condition then combining two awards the star", () => {
      const addBtn = Array.from(document.querySelectorAll("#board3 .loop-btn")).find(b => b.textContent.match(/Add another condition/));
      addBtn.click();
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: line them up", () => {
    test("ORDER BY spells out ASCENDING and DESCENDING in full, never abbreviated", () => {
      const sql = document.querySelector("#board4 .qb-sql").textContent;
      expect(sql).toMatch(/ORDER BY Price ASCENDING/);
      expect(sql).not.toMatch(/\bASC\b/);
      expect(sql).not.toMatch(/\bDESC\b/);
    });

    test("toggling ASCENDING then DESCENDING reorders the table and awards the star", () => {
      const rowsBefore = Array.from(document.querySelectorAll("#board4 .qb-table tbody tr")).map(tr => tr.children[0].textContent);
      const descBtn = Array.from(document.querySelectorAll("#board4 .toggle-btn")).find(b => b.textContent === "DESCENDING");
      descBtn.click();
      const sql = document.querySelector("#board4 .qb-sql").textContent;
      expect(sql).toMatch(/DESCENDING/);
      const rowsAfter = Array.from(document.querySelectorAll("#board4 .qb-table tbody tr")).map(tr => tr.children[0].textContent);
      expect(rowsAfter).not.toEqual(rowsBefore);
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: let it count", () => {
    test("COUNT(OrderID) counts every record without listing rows", () => {
      const countBtn = Array.from(document.querySelectorAll("#board5 .loop-btn")).find(b => b.textContent === "COUNT");
      countBtn.click();
      expect(document.querySelector("#board5 .qb-sql").textContent).toMatch(/SELECT COUNT\(OrderID\)/);
      expect(document.querySelector("#board5 .qb-result-value").textContent).toMatch(/= 8|COUNT\(OrderID\) = 8/);
    });

    test("SUM(Price) totals the column, and trying both tiles awards the star", () => {
      const countBtn = Array.from(document.querySelectorAll("#board5 .loop-btn")).find(b => b.textContent === "COUNT");
      const sumBtn = Array.from(document.querySelectorAll("#board5 .loop-btn")).find(b => b.textContent === "SUM");
      countBtn.click();
      sumBtn.click();
      expect(document.querySelector("#board5 .qb-sql").textContent).toMatch(/SELECT SUM\(Price\)/);
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 6: three real questions", () => {
    function addCondition(container) {
      const addBtn = Array.from(container.querySelectorAll(".loop-btn")).find(b => b.textContent.match(/Add (a|another) condition/));
      addBtn.click();
    }
    // A condition row always has two <select> elements (field, comparison)
    // plus one value control that is a <select> for text fields or a real
    // number <input> for numeric fields — read it by class, not by tag.
    function condControls(cond) {
      const selects = cond.querySelectorAll("select");
      return { field: selects[0], op: selects[1], value: cond.querySelector(".qb-cond-value") };
    }
    function setControl(el, value) {
      el.value = value;
      el.dispatchEvent(new Event(el.tagName === "INPUT" ? "input" : "change"));
    }

    test("answer cards start unlit and never frame progress as failure", () => {
      const targets = document.querySelectorAll(".qb-target");
      expect(targets.length).toBe(3);
      targets.forEach(t => expect(t.classList.contains("lit")).toBe(false));
      expect(document.getElementById("d6").textContent).not.toMatch(/wrong|incorrect|fail/i);
    });

    test("building COUNT WHERE Size = 'Large' lights the first target card", () => {
      const board = document.getElementById("board6");
      addCondition(board);
      let cond = board.querySelector(".qb-cond");
      setControl(condControls(cond).field, "Size");
      cond = board.querySelector(".qb-cond");
      setControl(condControls(cond).op, "=");
      setControl(condControls(cond).value, "Large");
      setControl(board.querySelector(".qb-agg-row select"), "count");
      expect(document.getElementById("target1").classList.contains("lit")).toBe(true);
    });

    test("answering all three real questions awards the star and unlocks the reflection card with all six stars", () => {
      // Complete D1-D5 first
      const fieldPicker = document.getElementById("fieldPicker1");
      fieldPicker.value = "Drink"; fieldPicker.dispatchEvent(new Event("change"));
      const recordPicker = document.getElementById("recordPicker1");
      recordPicker.value = "1001"; recordPicker.dispatchEvent(new Event("change"));
      document.getElementById("dupBtn1").click();

      const chip = label => Array.from(document.querySelectorAll("#board2 .qb-chip-toggle")).find(b => b.textContent === label);
      chip("Customer").click();
      chip("Price (RM)").click();

      const addBtn3 = Array.from(document.querySelectorAll("#board3 .loop-btn")).find(b => b.textContent.match(/Add another condition/));
      addBtn3.click();

      const descBtn = Array.from(document.querySelectorAll("#board4 .toggle-btn")).find(b => b.textContent === "DESCENDING");
      descBtn.click();

      Array.from(document.querySelectorAll("#board5 .loop-btn")).find(b => b.textContent === "COUNT").click();
      Array.from(document.querySelectorAll("#board5 .loop-btn")).find(b => b.textContent === "SUM").click();

      // D6: answer all three real questions by reconfiguring one growing query
      const board6 = document.getElementById("board6");
      const aggSel = () => board6.querySelector(".qb-agg-row select");
      const cond1 = () => board6.querySelectorAll(".qb-cond")[0];

      // Question 1: COUNT(OrderID) WHERE Size = 'Large' → 4
      addCondition(board6);
      setControl(condControls(cond1()).field, "Size");
      setControl(condControls(cond1()).op, "=");
      setControl(condControls(cond1()).value, "Large");
      setControl(aggSel(), "count");
      expect(document.getElementById("target1").classList.contains("lit")).toBe(true);

      // Question 2: SUM(Price) WHERE Drink = 'Brown Sugar Boba Milk' → 22.80
      setControl(condControls(cond1()).field, "Drink");
      setControl(condControls(cond1()).value, "Brown Sugar Boba Milk");
      setControl(aggSel(), "sumPrice");
      expect(document.getElementById("target2").classList.contains("lit")).toBe(true);

      // Question 3: COUNT(OrderID) WHERE Size = 'Large' AND Price > 10 → 3
      setControl(condControls(cond1()).field, "Size");
      setControl(condControls(cond1()).value, "Large");
      addCondition(board6);
      const cond2 = () => board6.querySelectorAll(".qb-cond")[1];
      setControl(condControls(cond2()).field, "Price");
      setControl(condControls(cond2()).op, ">");
      setControl(condControls(cond2()).value, "10");
      setControl(aggSel(), "count");
      expect(document.getElementById("target3").classList.contains("lit")).toBe(true);

      expect(isDiscoveryDone("d6")).toBe(true);
      expect(starCount()).toBe("✦ 6");
      expect(reflectVisible()).toBe(true);
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("the built module never mentions banned school vocabulary", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });
});
