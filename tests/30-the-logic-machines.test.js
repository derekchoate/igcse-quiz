const {
  loadModule,
  clickBulbByValue,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 30: The Logic Machines", () => {
  beforeEach(() => {
    loadModule("30-the-logic-machines.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: NOT, the contrarian", () => {
    test("the readout and notebook update live, and flipping A once fills both rows and awards the star", () => {
      const bench = document.getElementById("benchNOT1");
      expect(document.querySelector("#benchNOT1 .gate-readout").textContent).toMatch(/A = 0.*output = 1/);
      clickBulbByValue(bench, "A");
      expect(document.querySelector("#benchNOT1 .gate-readout").textContent).toMatch(/A = 1.*output = 0/);
      const rows = document.querySelectorAll("#tableNOT1 tbody tr");
      expect(rows.length).toBe(2);
      expect(Array.from(rows).every(r => r.classList.contains("tested"))).toBe(true);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: AND & OR on the bench", () => {
    test("AND only lights for 1,1 and OR lights for anything but 0,0; completing both notebooks awards the star", () => {
      const andBench = document.getElementById("benchAND2");
      const orBench = document.getElementById("benchOR2");

      clickBulbByValue(andBench, "A");
      expect(document.querySelector("#benchAND2 .gate-readout").textContent).toMatch(/output = 0/);
      clickBulbByValue(andBench, "B");
      expect(document.querySelector("#benchAND2 .gate-readout").textContent).toMatch(/output = 1/);

      clickBulbByValue(orBench, "A");
      expect(document.querySelector("#benchOR2 .gate-readout").textContent).toMatch(/output = 1/);

      // Neither notebook is full yet (AND still missing 0,1; OR still missing 1,1 and 1,0).
      expect(isDiscoveryDone("d2")).toBe(false);

      clickBulbByValue(andBench, "A"); // AND: 0,1
      clickBulbByValue(orBench, "B");  // OR: 1,1
      clickBulbByValue(orBench, "A"); // OR: 0,1 -- already had 1,0 and 0,0 and 1,1; need 0,1 too
      // Ensure every AND combination has been tried: 00 (default), 10, 11, 01
      const andRows = document.querySelectorAll("#tableAND2 tbody tr");
      expect(Array.from(andRows).every(r => r.classList.contains("tested"))).toBe(true);

      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: The N-twins — NAND and NOR", () => {
    test("NAND and NOR invert AND and OR's answers, and completing both notebooks awards the star", () => {
      const nandBench = document.getElementById("benchNAND3");
      const norBench = document.getElementById("benchNOR3");

      // Both off: NAND(0,0)=1, NOR(0,0)=1
      expect(document.querySelector("#benchNAND3 .gate-readout").textContent).toMatch(/output = 1/);
      expect(document.querySelector("#benchNOR3 .gate-readout").textContent).toMatch(/output = 1/);

      clickBulbByValue(nandBench, "A");
      clickBulbByValue(nandBench, "B"); // NAND(1,1) = 0
      expect(document.querySelector("#benchNAND3 .gate-readout").textContent).toMatch(/output = 0/);
      clickBulbByValue(nandBench, "A"); // NAND(0,1) = 1

      clickBulbByValue(norBench, "A"); // NOR(1,0) = 0
      expect(document.querySelector("#benchNOR3 .gate-readout").textContent).toMatch(/output = 0/);
      clickBulbByValue(norBench, "B"); // NOR(1,1) = 0
      clickBulbByValue(norBench, "A"); // NOR(0,1) = 0

      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: XOR, the difference detector", () => {
    test("XOR lights only when the two inputs disagree, and trying all four combinations awards the star", () => {
      const bench = document.getElementById("benchXOR4");
      expect(document.querySelector("#benchXOR4 .gate-readout").textContent).toMatch(/output = 0/); // 0,0

      clickBulbByValue(bench, "A"); // 1,0 -> disagree
      expect(document.querySelector("#benchXOR4 .gate-readout").textContent).toMatch(/output = 1/);

      clickBulbByValue(bench, "B"); // 1,1 -> agree
      expect(document.querySelector("#benchXOR4 .gate-readout").textContent).toMatch(/output = 0/);

      clickBulbByValue(bench, "A"); // 0,1 -> disagree
      expect(document.querySelector("#benchXOR4 .gate-readout").textContent).toMatch(/output = 1/);

      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: three inputs, eight rows", () => {
    test("the chained AND-AND assembly only lights on 1,1,1, and working through all eight rows in binary-counting order awards the star", () => {
      const host = document.getElementById("chainHost5");
      // Gray-code walk touching every one of the 8 combinations, starting from 0,0,0.
      clickBulbByValue(host, "C"); // 001
      clickBulbByValue(host, "B"); // 011
      clickBulbByValue(host, "C"); // 010
      clickBulbByValue(host, "A"); // 110
      clickBulbByValue(host, "C"); // 111
      expect(document.querySelector("#chainHost5 .gate-readout").textContent).toMatch(/output = 1/);
      clickBulbByValue(host, "B"); // 101
      clickBulbByValue(host, "C"); // 100

      const rows = document.querySelectorAll("#table3input5 tbody tr");
      expect(rows.length).toBe(8);
      expect(Array.from(rows).every(r => r.classList.contains("tested"))).toBe(true);
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 6: name that gate", () => {
    function optionButton(col, name) {
      return Array.from(col.querySelectorAll(".gm-option-btn")).find(b => b.textContent === name);
    }

    test("an incomplete or mismatched pick gives a warm, specific redirect and does not award a star", () => {
      const col = document.getElementById("mysteryA6"); // secretly NAND
      optionButton(col, "AND").click();
      const status = col.querySelector(".gm-status");
      expect(status.textContent).toMatch(/Not quite/);
      expect(status.textContent).not.toMatch(/wrong|incorrect|fail/i);
      expect(isDiscoveryDone("d6")).toBe(false);
    });

    test("naming all three mystery machines correctly reveals their symbols and awards the star", () => {
      const colA = document.getElementById("mysteryA6"); // NAND
      const colB = document.getElementById("mysteryB6"); // XOR
      const colC = document.getElementById("mysteryC6"); // NOR

      optionButton(colA, "NAND").click();
      expect(colA.querySelector(".gm-status").textContent).toMatch(/Machine A is NAND/);
      expect(colA.querySelector(".gate-svg").getAttribute("aria-label")).toMatch(/NAND/);

      optionButton(colB, "XOR").click();
      optionButton(colC, "NOR").click();

      expect(isDiscoveryDone("d6")).toBe(true);
      expect(starCount()).toBe("✦ 1");
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

  test("completing every discovery unlocks the reflection card with all six stars", () => {
    clickBulbByValue(document.getElementById("benchNOT1"), "A");

    const andBench = document.getElementById("benchAND2");
    const orBench = document.getElementById("benchOR2");
    clickBulbByValue(andBench, "A");
    clickBulbByValue(andBench, "B");
    clickBulbByValue(andBench, "A");
    clickBulbByValue(orBench, "A");
    clickBulbByValue(orBench, "B");
    clickBulbByValue(orBench, "A");

    const nandBench = document.getElementById("benchNAND3");
    const norBench = document.getElementById("benchNOR3");
    clickBulbByValue(nandBench, "A");
    clickBulbByValue(nandBench, "B");
    clickBulbByValue(nandBench, "A");
    clickBulbByValue(norBench, "A");
    clickBulbByValue(norBench, "B");
    clickBulbByValue(norBench, "A");

    const xorBench = document.getElementById("benchXOR4");
    clickBulbByValue(xorBench, "A");
    clickBulbByValue(xorBench, "B");
    clickBulbByValue(xorBench, "A");

    const chainHost = document.getElementById("chainHost5");
    clickBulbByValue(chainHost, "C");
    clickBulbByValue(chainHost, "B");
    clickBulbByValue(chainHost, "C");
    clickBulbByValue(chainHost, "A");
    clickBulbByValue(chainHost, "C");
    clickBulbByValue(chainHost, "B");
    clickBulbByValue(chainHost, "C");

    function optionButton(col, name) {
      return Array.from(col.querySelectorAll(".gm-option-btn")).find(b => b.textContent === name);
    }
    optionButton(document.getElementById("mysteryA6"), "NAND").click();
    optionButton(document.getElementById("mysteryB6"), "XOR").click();
    optionButton(document.getElementById("mysteryC6"), "NOR").click();

    expect(starCount()).toBe("✦ 6");
    expect(reflectVisible()).toBe(true);
  });

  test("the built module never mentions banned school vocabulary", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });

  test("gate input counts respect the syllabus limit: NOT has one input, every other gate has exactly two", () => {
    expect(document.querySelectorAll("#benchNOT1 .gate-switches .bit").length).toBe(1);
    ["benchAND2", "benchOR2", "benchNAND3", "benchNOR3", "benchXOR4"].forEach(id => {
      expect(document.querySelectorAll("#" + id + " .gate-switches .bit").length).toBe(2);
    });
  });
});
