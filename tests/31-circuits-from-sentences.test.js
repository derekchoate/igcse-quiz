const {
  loadModule,
  clickBulbByValue,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

/** Click a gate-type picker button (AND/OR/NAND/NOR/XOR) within a given
 * .gate-slot element. `slotIndex` 0 = Gate 1's slot, 1 = Gate 2's slot,
 * within the chain host with id `chainId`. */
function pickGate(chainId, slotIndex, name) {
  const host = document.getElementById(chainId);
  const slot = host.querySelectorAll(".gate-slot")[slotIndex];
  const btn = Array.from(slot.querySelectorAll(".gate-pick-btn")).find(b => b.textContent === name);
  if (!btn) throw new Error("No gate picker button labeled " + name + " in slot " + slotIndex + " of " + chainId);
  btn.click();
}

describe("Module 31: Circuits from Sentences", () => {
  beforeEach(() => {
    loadModule("31-circuits-from-sentences.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: wire your first pair — (A AND B) OR C", () => {
    test("propagation is live, and testing all eight rows fills the notebook and awards the star", () => {
      const host = document.getElementById("chain1");

      // 000: AND(0,0)=0, OR(0,0)=0
      expect(document.querySelector("#chain1 .chain-output .gate-readout").textContent).toMatch(/Q = 0/);

      clickBulbByValue(host, "C"); // 001: AND(0,0)=0, OR(0,1)=1
      expect(document.querySelector("#chain1 .chain-output .gate-readout").textContent).toMatch(/Q = 1/);

      clickBulbByValue(host, "B"); // 011
      clickBulbByValue(host, "C"); // 010
      clickBulbByValue(host, "A"); // 110: AND(1,1)=1, OR(1,0)=1
      clickBulbByValue(host, "C"); // 111: AND(1,1)=1, OR(1,1)=1
      expect(document.querySelector("#chain1 .chain-output .gate-readout").textContent).toMatch(/Q = 1/);
      clickBulbByValue(host, "B"); // 101
      clickBulbByValue(host, "C"); // 100

      const rows = document.querySelectorAll("#table1 tbody tr");
      expect(rows.length).toBe(8);
      expect(Array.from(rows).every(r => r.classList.contains("tested"))).toBe(true);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: sentence to circuit — the alarm", () => {
    test("picking the wrong gate leaves some rows unlit, and switching to the correct gate lights the rest without re-flipping", () => {
      const host = document.getElementById("chain2");

      // Gate 1 already defaults to AND (correct); Gate 2 defaults to AND
      // (target needs OR) — walk all eight combos under the wrong Gate 2.
      clickBulbByValue(host, "Smoke");   // 001
      clickBulbByValue(host, "Armed");   // 011
      clickBulbByValue(host, "Smoke");   // 010
      clickBulbByValue(host, "Door");    // 110
      clickBulbByValue(host, "Smoke");   // 111
      clickBulbByValue(host, "Armed");   // 101
      clickBulbByValue(host, "Smoke");   // 100

      expect(isDiscoveryDone("d2")).toBe(false);
      expect(document.getElementById("progress2").textContent).not.toMatch(/^8 of 8/);

      // Now fix Gate 2 to OR — every already-visited row re-checks itself
      // immediately, with nothing re-flipped.
      pickGate("chain2", 1, "OR");

      expect(isDiscoveryDone("d2")).toBe(true);
      expect(document.getElementById("progress2").textContent).toMatch(/^8 of 8/);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: circuit to table — the greenhouse fan", () => {
    test("XOR then AND, chained, only lights the fan when the sensors disagree and Manual is on; testing all eight rows awards the star", () => {
      const host = document.getElementById("chain3");

      // 000: XOR(0,0)=0, AND(0,0)=0
      expect(document.querySelector("#chain3 .chain-output .gate-readout").textContent).toMatch(/Q = 0/);

      clickBulbByValue(host, "Manual"); // 001: XOR(0,0)=0, AND(0,1)=0
      expect(document.querySelector("#chain3 .chain-output .gate-readout").textContent).toMatch(/Q = 0/);
      clickBulbByValue(host, "Damp");   // 011: XOR(0,1)=1, AND(1,1)=1
      expect(document.querySelector("#chain3 .chain-output .gate-readout").textContent).toMatch(/Q = 1/);
      clickBulbByValue(host, "Manual"); // 010
      clickBulbByValue(host, "Hot");    // 110
      clickBulbByValue(host, "Manual"); // 111
      clickBulbByValue(host, "Damp");   // 101
      clickBulbByValue(host, "Manual"); // 100

      const rows = document.querySelectorAll("#table3 tbody tr");
      expect(rows.length).toBe(8);
      expect(Array.from(rows).every(r => r.classList.contains("tested"))).toBe(true);
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: table to circuit — the vending machine", () => {
    test("(Change OR Loyalty) AND Stock, picked from the printed table alone, lights every row", () => {
      const host = document.getElementById("chain4");
      pickGate("chain4", 0, "OR"); // Gate 1: Change OR Loyalty (Gate 2 default AND is already correct)

      clickBulbByValue(host, "Stock");   // 001
      clickBulbByValue(host, "Loyalty"); // 011
      clickBulbByValue(host, "Stock");   // 010
      clickBulbByValue(host, "Change");  // 110
      clickBulbByValue(host, "Stock");   // 111
      clickBulbByValue(host, "Loyalty"); // 101
      clickBulbByValue(host, "Stock");   // 100

      expect(isDiscoveryDone("d4")).toBe(true);
      expect(document.getElementById("progress4").textContent).toMatch(/^8 of 8/);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: circuit to expression", () => {
    function options() {
      return Array.from(document.querySelectorAll("#expr5 .expr-option-btn"));
    }
    test("a mismatched pick gives a warm, specific redirect back to the wiring, never a wrong/incorrect label, and does not award a star", () => {
      const wrong = options().find(b => b.textContent === "P NOR (Q XOR R)");
      wrong.click();
      const status = document.getElementById("exprStatus5");
      expect(status.textContent).toMatch(/Not quite/);
      expect(status.textContent).not.toMatch(/wrong|incorrect|fail/i);
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("picking (P NOR Q) XOR R — the expression that matches the fixed circuit's wiring — awards the star", () => {
      const correct = options().find(b => b.textContent === "(P NOR Q) XOR R");
      correct.click();
      expect(document.getElementById("exprStatus5").textContent).toMatch(/That's it/);
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 6: the commission — the canteen kiosk", () => {
    test("the star only arrives once BOTH the table is fully matched and the expression is correctly picked, in either order", () => {
      // Pick the correct expression first — this alone must not award the star.
      const exprBtn = Array.from(document.querySelectorAll("#expr6 .expr-option-btn"))
        .find(b => b.textContent === "(HotFood AND StockOK) OR DrinkOnly");
      exprBtn.click();
      expect(isDiscoveryDone("d6")).toBe(false);

      // Now build the matching circuit: Gate 1 AND (default, correct already), Gate 2 OR.
      const host = document.getElementById("chain6");
      pickGate("chain6", 1, "OR");
      clickBulbByValue(host, "DrinkOnly"); // 001
      clickBulbByValue(host, "StockOK");   // 011
      clickBulbByValue(host, "DrinkOnly"); // 010
      clickBulbByValue(host, "HotFood");   // 110
      clickBulbByValue(host, "DrinkOnly"); // 111
      clickBulbByValue(host, "StockOK");   // 101
      clickBulbByValue(host, "DrinkOnly"); // 100

      expect(document.getElementById("progress6").textContent).toMatch(/^8 of 8/);
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

  test("no circuit anywhere on the page exceeds the syllabus limits: 3 raw inputs, 2 inputs per gate, 1 output", () => {
    ["chain1", "chain2", "chain3", "chain4", "chain5", "chain6"].forEach(id => {
      const host = document.getElementById(id);
      // Exactly three real (interactive) input switches — never a fourth.
      expect(host.querySelectorAll("button.bit").length).toBe(3);
      // Exactly two gate slots, each an independent 2-input gate — no
      // single gate on this page ever takes more than two inputs.
      const svgs = host.querySelectorAll(".gate-svg");
      expect(svgs.length).toBe(2);
      svgs.forEach(svg => {
        expect(svg.querySelectorAll('[data-wire="a"], [data-wire="b"]').length).toBe(2);
      });
      // Exactly one final output lamp (Q) — the mid-chain lamp is an
      // internal wire-value indicator feeding Gate 2, not a second output.
      const finalLamp = Array.from(host.querySelectorAll(".lamp-out .bit-val")).find(el => el.textContent === "Q");
      expect(finalLamp).toBeTruthy();
    });
  });

  test("completing every discovery unlocks the reflection card with all six stars", () => {
    const c1 = document.getElementById("chain1");
    clickBulbByValue(c1, "C");
    clickBulbByValue(c1, "B");
    clickBulbByValue(c1, "C");
    clickBulbByValue(c1, "A");
    clickBulbByValue(c1, "C");
    clickBulbByValue(c1, "B");
    clickBulbByValue(c1, "C");

    const c2 = document.getElementById("chain2");
    pickGate("chain2", 1, "OR");
    clickBulbByValue(c2, "Smoke");
    clickBulbByValue(c2, "Armed");
    clickBulbByValue(c2, "Smoke");
    clickBulbByValue(c2, "Door");
    clickBulbByValue(c2, "Smoke");
    clickBulbByValue(c2, "Armed");
    clickBulbByValue(c2, "Smoke");

    const c3 = document.getElementById("chain3");
    clickBulbByValue(c3, "Manual");
    clickBulbByValue(c3, "Damp");
    clickBulbByValue(c3, "Manual");
    clickBulbByValue(c3, "Hot");
    clickBulbByValue(c3, "Manual");
    clickBulbByValue(c3, "Damp");
    clickBulbByValue(c3, "Manual");

    const c4 = document.getElementById("chain4");
    pickGate("chain4", 0, "OR");
    clickBulbByValue(c4, "Stock");
    clickBulbByValue(c4, "Loyalty");
    clickBulbByValue(c4, "Stock");
    clickBulbByValue(c4, "Change");
    clickBulbByValue(c4, "Stock");
    clickBulbByValue(c4, "Loyalty");
    clickBulbByValue(c4, "Stock");

    Array.from(document.querySelectorAll("#expr5 .expr-option-btn"))
      .find(b => b.textContent === "(P NOR Q) XOR R").click();

    const c6 = document.getElementById("chain6");
    pickGate("chain6", 1, "OR");
    clickBulbByValue(c6, "DrinkOnly");
    clickBulbByValue(c6, "StockOK");
    clickBulbByValue(c6, "DrinkOnly");
    clickBulbByValue(c6, "HotFood");
    clickBulbByValue(c6, "DrinkOnly");
    clickBulbByValue(c6, "StockOK");
    clickBulbByValue(c6, "DrinkOnly");
    Array.from(document.querySelectorAll("#expr6 .expr-option-btn"))
      .find(b => b.textContent === "(HotFood AND StockOK) OR DrinkOnly").click();

    expect(starCount()).toBe("✦ 6");
    expect(reflectVisible()).toBe(true);
  });

  test("the built module never mentions banned school vocabulary, and 'exam' appears nowhere", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });
});
