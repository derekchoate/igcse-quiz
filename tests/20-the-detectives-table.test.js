const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// The trace grid is a bespoke mechanic (module.js's makeTraceGrid) — every
// fillable cell carries data-row/data-col, and the shared number-pad
// buttons carry data-value, so tests can drive the real markup directly
// without reimplementing any of the grid's own logic.
function cell(gridId, rowIndex, colKey) {
  return document.querySelector('#' + gridId + ' .tg-cell[data-row="' + rowIndex + '"][data-col="' + colKey + '"]');
}
function padBtn(padId, value) {
  return document.querySelector('#' + padId + ' .tg-pad-btn[data-value="' + value + '"]');
}
function fill(gridId, padId, rowIndex, colKey, value) {
  cell(gridId, rowIndex, colKey).click();
  padBtn(padId, value).click();
}
function pickBtn(containerId, label) {
  return Array.from(document.querySelectorAll("#" + containerId + " .pick-btn")).find(b => b.textContent === label);
}

describe("Module 20: The Detective's Table", () => {
  beforeEach(() => {
    loadModule("20-the-detectives-table.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: a 4-liner, two variables", () => {
    test("a column that doesn't change on a line renders as a static dash, not a button", () => {
      const dashBonus = cell("grid1", 0, "Bonus");
      expect(dashBonus).toBeNull(); // row 0 only has a Score cell; Bonus is a plain dash div
      const dashDiv = document.querySelectorAll("#grid1 .tg-row")[1].querySelectorAll(".tg-dash");
      expect(dashDiv.length).toBeGreaterThan(0);
    });

    test("only the first row's cell is interactive until it's filled correctly", () => {
      expect(cell("grid1", 0, "Score").disabled).toBe(false);
      expect(cell("grid1", 1, "Bonus").disabled).toBe(true);
      fill("grid1", "pad1", 0, "Score", 10);
      expect(cell("grid1", 1, "Bonus").disabled).toBe(false);
    });

    test("a wrong pick leaves the box exactly as quiet as before, with a soft look-again pointer — never an error", () => {
      cell("grid1", 0, "Score").click();
      padBtn("pad1", 0).click(); // wrong value on purpose
      const box = cell("grid1", 0, "Score");
      expect(box.classList.contains("tg-filled")).toBe(false);
      expect(box.textContent).not.toBe("0");
      expect(document.getElementById("status1").textContent).not.toMatch(/wrong|incorrect|error/i);
      // the box is still tappable — no penalty, no lockout
      expect(box.disabled).toBe(false);
    });

    test("filling all four lines in order awards the star", () => {
      fill("grid1", "pad1", 0, "Score", 10);
      fill("grid1", "pad1", 1, "Bonus", 5);
      fill("grid1", "pad1", 2, "Score", 15);
      fill("grid1", "pad1", 3, "OUTPUT", 15);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: a FOR loop's rhythm", () => {
    test("Count and Total both fill in on every single lap", () => {
      fill("grid2", "pad2", 0, "Total", 0);
      fill("grid2", "pad2", 1, "Count", 1);
      fill("grid2", "pad2", 1, "Total", 1);
      fill("grid2", "pad2", 2, "Count", 2);
      fill("grid2", "pad2", 2, "Total", 3);
      fill("grid2", "pad2", 3, "Count", 3);
      fill("grid2", "pad2", 3, "Total", 6);
      fill("grid2", "pad2", 4, "Count", 4);
      fill("grid2", "pad2", 4, "Total", 10);
      fill("grid2", "pad2", 5, "OUTPUT", 10);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: an IF inside the loop", () => {
    test("odd laps leave Total as a dash, but still get their own row", () => {
      // Lap 1 (Num 1, odd): only Num is fillable, Total has no cell at all
      expect(cell("grid3", 1, "Num")).not.toBeNull();
      fill("grid3", "pad3", 0, "Total", 0);
      fill("grid3", "pad3", 1, "Num", 1);
      // Row 1 is complete (its only cell was Num) — row 2 should now unlock
      expect(cell("grid3", 2, "Num").disabled).toBe(false);
    });

    test("tracing all five laps to OUTPUT awards the star", () => {
      fill("grid3", "pad3", 0, "Total", 0);
      fill("grid3", "pad3", 1, "Num", 1);
      fill("grid3", "pad3", 2, "Num", 2);
      fill("grid3", "pad3", 2, "Total", 2);
      fill("grid3", "pad3", 3, "Num", 3);
      fill("grid3", "pad3", 4, "Num", 4);
      fill("grid3", "pad3", 4, "Total", 6);
      fill("grid3", "pad3", 5, "Num", 5);
      fill("grid3", "pad3", 6, "OUTPUT", 6);
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the broken algorithm", () => {
    function completeGrid4() {
      fill("grid4", "pad4", 0, "Total", 0);
      fill("grid4", "pad4", 1, "Num", 1);
      fill("grid4", "pad4", 1, "Total", 1);
      fill("grid4", "pad4", 2, "Num", 2);
      fill("grid4", "pad4", 2, "Total", 3);
      fill("grid4", "pad4", 3, "Num", 3);
      fill("grid4", "pad4", 3, "Total", 6);
      fill("grid4", "pad4", 4, "Num", 4);
      fill("grid4", "pad4", 4, "Total", 10);
      fill("grid4", "pad4", 5, "OUTPUT", 10);
    }

    test("completing the trace reveals the bug picker, not the star directly", () => {
      completeGrid4();
      expect(document.getElementById("pick4").hidden).toBe(false);
      expect(isDiscoveryDone("d4")).toBe(false);
    });

    test("a wrong bug guess gives a warm redirect; naming the real bug awards the star", () => {
      completeGrid4();
      pickBtn("pickOptions4", "Nothing inside the loop updates Total").click();
      expect(isDiscoveryDone("d4")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not quite that one/);
      expect(document.getElementById("toast").innerHTML).not.toMatch(/wrong|incorrect|error/i);

      pickBtn("pickOptions4", "The loop's upper bound stops it one lap too early").click();
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: what is it FOR?", () => {
    function completeGrid5() {
      fill("grid5", "pad5", 0, "Biggest", 0);
      fill("grid5", "pad5", 1, "Guess", 7);
      fill("grid5", "pad5", 1, "Biggest", 7);
      fill("grid5", "pad5", 2, "Guess", 15);
      fill("grid5", "pad5", 2, "Biggest", 15);
      fill("grid5", "pad5", 3, "Guess", 3);
      fill("grid5", "pad5", 4, "OUTPUT", 15);
    }

    test("the third guess leaves Biggest as a dash — the same trick as discovery 3, in a new costume", () => {
      fill("grid5", "pad5", 0, "Biggest", 0);
      fill("grid5", "pad5", 1, "Guess", 7);
      fill("grid5", "pad5", 1, "Biggest", 7);
      fill("grid5", "pad5", 2, "Guess", 15);
      fill("grid5", "pad5", 2, "Biggest", 15);
      expect(cell("grid5", 3, "Biggest")).toBeNull(); // no Biggest cell at all on the losing guess's row
      fill("grid5", "pad5", 3, "Guess", 3);
      expect(cell("grid5", 4, "OUTPUT").disabled).toBe(false);
    });

    test("completing the trace reveals the purpose picker; a wrong guess redirects, the right one awards the star", () => {
      completeGrid5();
      expect(document.getElementById("pick5").hidden).toBe(false);
      expect(isDiscoveryDone("d5")).toBe(false);

      pickBtn("pickOptions5", "Adds all three guesses together").click();
      expect(isDiscoveryDone("d5")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not quite that one/);

      pickBtn("pickOptions5", "Finds the biggest of the three guesses").click();
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      // Rung 0 must be visible without clicking any other nudge first, and it
      // must sit alongside the trace grid's own per-cell "look again" hints,
      // not replace them.
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("the built module never mentions banned school vocabulary", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/mark scheme/i);
    expect(text).not.toMatch(/\b(test|quiz|exam|grade|homework)\b/i);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    fill("grid1", "pad1", 0, "Score", 10);
    fill("grid1", "pad1", 1, "Bonus", 5);
    fill("grid1", "pad1", 2, "Score", 15);
    fill("grid1", "pad1", 3, "OUTPUT", 15);

    // D2
    fill("grid2", "pad2", 0, "Total", 0);
    fill("grid2", "pad2", 1, "Count", 1);
    fill("grid2", "pad2", 1, "Total", 1);
    fill("grid2", "pad2", 2, "Count", 2);
    fill("grid2", "pad2", 2, "Total", 3);
    fill("grid2", "pad2", 3, "Count", 3);
    fill("grid2", "pad2", 3, "Total", 6);
    fill("grid2", "pad2", 4, "Count", 4);
    fill("grid2", "pad2", 4, "Total", 10);
    fill("grid2", "pad2", 5, "OUTPUT", 10);

    // D3
    fill("grid3", "pad3", 0, "Total", 0);
    fill("grid3", "pad3", 1, "Num", 1);
    fill("grid3", "pad3", 2, "Num", 2);
    fill("grid3", "pad3", 2, "Total", 2);
    fill("grid3", "pad3", 3, "Num", 3);
    fill("grid3", "pad3", 4, "Num", 4);
    fill("grid3", "pad3", 4, "Total", 6);
    fill("grid3", "pad3", 5, "Num", 5);
    fill("grid3", "pad3", 6, "OUTPUT", 6);

    // D4
    fill("grid4", "pad4", 0, "Total", 0);
    fill("grid4", "pad4", 1, "Num", 1);
    fill("grid4", "pad4", 1, "Total", 1);
    fill("grid4", "pad4", 2, "Num", 2);
    fill("grid4", "pad4", 2, "Total", 3);
    fill("grid4", "pad4", 3, "Num", 3);
    fill("grid4", "pad4", 3, "Total", 6);
    fill("grid4", "pad4", 4, "Num", 4);
    fill("grid4", "pad4", 4, "Total", 10);
    fill("grid4", "pad4", 5, "OUTPUT", 10);
    pickBtn("pickOptions4", "The loop's upper bound stops it one lap too early").click();

    // D5
    fill("grid5", "pad5", 0, "Biggest", 0);
    fill("grid5", "pad5", 1, "Guess", 7);
    fill("grid5", "pad5", 1, "Biggest", 7);
    fill("grid5", "pad5", 2, "Guess", 15);
    fill("grid5", "pad5", 2, "Biggest", 15);
    fill("grid5", "pad5", 3, "Guess", 3);
    fill("grid5", "pad5", 4, "OUTPUT", 15);
    pickBtn("pickOptions5", "Finds the biggest of the three guesses").click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
