const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function cellAt(containerId, pos) {
  const cells = Array.from(document.querySelectorAll("#" + containerId + " .pgh-cell"));
  return cells[pos - 1];
}

function stepBtnOf(barId) {
  return Array.from(document.querySelectorAll("#" + barId + " .loop-btn")).find(b => b.textContent.match(/Step/));
}

function chipForLine(n) {
  return document.querySelector('#asmBank6 .asm-chip[data-eng="' + n + '"]');
}
function slotForLine(n) {
  return document.querySelector('#asmSlots6 .asm-slot[data-line="' + n + '"]');
}

describe("Module 23: The Classics", () => {
  beforeEach(() => {
    loadModule("23-the-classics.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: the running total", () => {
    test("starts with six filled compartments and Total at 0", () => {
      expect(document.querySelectorAll("#wall1 .pgh-cell").length).toBe(6);
      expect(document.getElementById("readout1").textContent).toMatch(/Total so far = 0/);
    });

    test("stepping once adds the first compartment onto Total", () => {
      stepBtnOf("bar1").click();
      expect(document.getElementById("status1").textContent).toMatch(/Total ← 0 \+ 62 = 62/);
    });

    test("running the whole loop reaches Total 359 and Average, awarding the star", () => {
      const step = stepBtnOf("bar1");
      for (let i = 0; i < 7; i++) step.click(); // 6 real laps + 1 finishing check
      expect(document.getElementById("readout1").textContent).toMatch(/Total = 359/);
      expect(document.getElementById("readout1").textContent).toMatch(/Average = 59\.83/);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: counting with a condition", () => {
    test("running the whole loop counts exactly the four scores over 50", () => {
      const step = stepBtnOf("bar2");
      for (let i = 0; i < 7; i++) step.click();
      expect(document.getElementById("readout2").textContent).toMatch(/Count = 4/);
      expect(document.querySelectorAll("#wall2 .pgh-cell-match").length).toBe(4);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: king of the wall", () => {
    test("champion starts as the first compartment with no contest", () => {
      expect(document.getElementById("readout3").textContent).toMatch(/Champion = 62/);
    });

    test("running every challenger crowns 90 as the final champion, awarding the star", () => {
      const step = stepBtnOf("bar3");
      for (let i = 0; i < 6; i++) step.click(); // challengers 2-6 + 1 finishing check
      expect(document.getElementById("readout3").textContent).toMatch(/Champion = 90/);
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("the optional trap-array toggle is exploratory only, never required for the star", () => {
      const toggle = document.querySelector("#trapBar3 button");
      expect(document.getElementById("trapReadout3").textContent).toMatch(/happens to still work here/i);
      toggle.click();
      expect(document.getElementById("trapReadout3").textContent).toMatch(/it would report.*0/i);
      expect(isDiscoveryDone("d3")).toBe(false);
    });
  });

  describe("discovery 4: the patient finger", () => {
    test("searching for a value on the wall stops the instant it matches", () => {
      document.getElementById("targetInput4").value = "78";
      const step = stepBtnOf("bar4");
      step.click(); step.click(); step.click(); // compartments 1, 2, 3 (match)
      expect(document.getElementById("status4").textContent).toMatch(/matched — Found is TRUE/);
      const chip = document.querySelectorAll("#chips4 .chip.hit");
      expect(chip.length).toBe(1);
    });

    test("searching for a value not on the wall checks every compartment and reports a clean not-found result", () => {
      document.getElementById("targetInput4").value = "19";
      const step = stepBtnOf("bar4");
      for (let i = 0; i < 6; i++) step.click();
      const status = document.getElementById("status4").textContent;
      expect(status).toMatch(/checked every compartment/i);
      expect(status).toMatch(/Found stays FALSE/);
      expect(status).not.toMatch(/error|invalid|wrong/i);
    });

    test("trying both a found and a not-found target awards the star", () => {
      document.getElementById("targetInput4").value = "78";
      let step = stepBtnOf("bar4");
      step.click(); step.click(); step.click();
      expect(isDiscoveryDone("d4")).toBe(false);
      const resetBtn = Array.from(document.querySelectorAll("#bar4 .loop-btn")).find(b => b.textContent.match(/Reset/));
      resetBtn.click();
      document.getElementById("targetInput4").value = "19";
      step = stepBtnOf("bar4");
      for (let i = 0; i < 6; i++) step.click();
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: bubbles rise", () => {
    test("stepping the first comparison of 4,1,5,2,3 swaps the first two compartments", () => {
      stepBtnOf("bar5").click();
      expect(cellAt("wall5", 1).querySelector(".pgh-val").textContent).toBe("1");
      expect(cellAt("wall5", 2).querySelector(".pgh-val").textContent).toBe("4");
    });

    test("running the whole sort finishes with a zero-swap pass, in order, and awards the star", () => {
      const step = stepBtnOf("bar5");
      for (let i = 0; i < 12; i++) step.click(); // 3 passes of 4 comparisons each
      const values = [1, 2, 3, 4, 5].map(pos => cellAt("wall5", pos).querySelector(".pgh-val").textContent);
      expect(values).toEqual(["1", "2", "3", "4", "5"]);
      expect(document.getElementById("status5").textContent).toMatch(/0 swaps/);
      expect(document.getElementById("status5").textContent).toMatch(/sorted/i);
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("shuffle produces a fresh permutation of the same five values without erroring", () => {
      const shuffleBtn = Array.from(document.querySelectorAll("#bar5 .loop-btn")).find(b => b.textContent.match(/Shuffle/));
      shuffleBtn.click();
      const values = [1, 2, 3, 4, 5].map(pos => Number(cellAt("wall5", pos).querySelector(".pgh-val").textContent));
      expect(values.slice().sort()).toEqual([1, 2, 3, 4, 5]);
      expect(document.getElementById("stats5").textContent).toMatch(/Pass 1/);
    });
  });

  describe("discovery 6: assemble one", () => {
    test("shows eight slots and eight shuffled chips", () => {
      expect(document.querySelectorAll("#asmSlots6 .asm-slot").length).toBe(8);
      expect(document.querySelectorAll("#asmBank6 .asm-chip").length).toBe(8);
    });

    test("placing a line in the wrong slot leaves it quiet, with a warm redirect, not a failure state", () => {
      const wrongSlot = slotForLine(7); // "OUTPUT Largest" slot
      chipForLine(0).click(); // "Largest ← Scores[1]" chip
      wrongSlot.click();
      expect(wrongSlot.classList.contains("filled")).toBe(false);
      expect(document.getElementById("status6").textContent).toMatch(/belongs somewhere else/i);
    });

    test("placing all eight lines in their correct slots awards the star", () => {
      for (let i = 0; i < 8; i++) {
        chipForLine(i).click();
        slotForLine(i).click();
      }
      expect(document.querySelectorAll("#asmSlots6 .asm-slot.filled").length).toBe(8);
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

  test("the built module never mentions banned school vocabulary", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/mark scheme/i);
    expect(text).not.toMatch(/\b(test|quiz|exam|grade|homework)\b/i);
  });

  test("the built module never mentions or explains binary search", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/binary search/i);
  });

  test("all six discoveries unlock the reflection card", () => {
    // D1
    let step = stepBtnOf("bar1");
    for (let i = 0; i < 7; i++) step.click();
    // D2
    step = stepBtnOf("bar2");
    for (let i = 0; i < 7; i++) step.click();
    // D3
    step = stepBtnOf("bar3");
    for (let i = 0; i < 6; i++) step.click();
    // D4 — found, then not-found
    document.getElementById("targetInput4").value = "78";
    step = stepBtnOf("bar4");
    step.click(); step.click(); step.click();
    const resetBtn4 = Array.from(document.querySelectorAll("#bar4 .loop-btn")).find(b => b.textContent.match(/Reset/));
    resetBtn4.click();
    document.getElementById("targetInput4").value = "19";
    step = stepBtnOf("bar4");
    for (let i = 0; i < 6; i++) step.click();
    // D5
    step = stepBtnOf("bar5");
    for (let i = 0; i < 12; i++) step.click();
    // D6
    for (let i = 0; i < 8; i++) {
      chipForLine(i).click();
      slotForLine(i).click();
    }

    expect(starCount()).toBe("✦ 6");
    expect(reflectVisible()).toBe(true);
  });
});
