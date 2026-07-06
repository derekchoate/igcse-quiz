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

function seatAt(containerId, r, c) {
  const seats = Array.from(document.querySelectorAll("#" + containerId + " .pgh-seat"));
  return seats.find(el => el.querySelector(".pgh-seat-addr").textContent === "[" + r + "," + c + "]");
}

describe("Module 22: Many Boxes, One Name", () => {
  beforeEach(() => {
    loadModule("22-many-boxes-one-name.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: one name, five compartments", () => {
    test("starts with five empty compartments", () => {
      expect(document.querySelectorAll("#wall1 .pgh-cell").length).toBe(5);
      expect(document.querySelectorAll("#wall1 .pgh-cell-filled").length).toBe(0);
    });

    test("typing a value and tapping a compartment fills it and updates the readout", () => {
      document.getElementById("valInput1").value = "19";
      cellAt("wall1", 3).click();
      expect(document.getElementById("code1").textContent).toMatch(/Scores\[3\]/);
      expect(document.getElementById("code1").textContent).toMatch(/19/);
      expect(document.getElementById("status1").textContent).toMatch(/compartment 3 now holds 19/i);
    });

    test("filling all five compartments awards the star, without needing an overwrite", () => {
      const input = document.getElementById("valInput1");
      [1, 2, 3, 4, 5].forEach(i => {
        input.value = String(i * 10);
        cellAt("wall1", i).click();
      });
      expect(isDiscoveryDone("d1")).toBe(false); // fillAll hit, overwrite not yet
      input.value = "99";
      cellAt("wall1", 1).click();
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("tapping an already-filled compartment simply replaces its value — no failure state", () => {
      const input = document.getElementById("valInput1");
      input.value = "5";
      cellAt("wall1", 1).click();
      input.value = "8";
      cellAt("wall1", 1).click();
      expect(document.getElementById("code1").textContent).toMatch(/8/);
      expect(document.querySelectorAll("#wall1 .pgh-cell-filled").length).toBe(1);
    });
  });

  describe("discovery 2: the loop meets the wall", () => {
    test("stepping once lights compartment 1 with Index * 10", () => {
      const stepBtn = Array.from(document.querySelectorAll("#bar2 .loop-btn")).find(b => b.textContent.match(/Step/));
      stepBtn.click();
      expect(document.getElementById("status2").textContent).toMatch(/Index is 1/);
      expect(document.querySelectorAll("#wall2 .pgh-cell-filled").length).toBe(1);
    });

    test("stepping through every lap fills all five compartments and awards the star", () => {
      const stepBtn = Array.from(document.querySelectorAll("#bar2 .loop-btn")).find(b => b.textContent.match(/Step/));
      for (let i = 0; i < 6; i++) stepBtn.click(); // 5 real laps + 1 finishing check
      expect(document.querySelectorAll("#wall2 .pgh-cell-filled").length).toBe(5);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: reach past the wall", () => {
    test("a valid index reads back a real value", () => {
      expect(document.getElementById("readout3").textContent).toMatch(/12/);
    });

    test("pushing the index to 6 reads a gentle 'no compartment there' message, never an error state", () => {
      const fwd = document.getElementById("idxFwd3");
      for (let i = 0; i < 5; i++) fwd.click(); // 1 -> 6
      expect(document.getElementById("idxLabel3").textContent).toBe("Index: 6");
      expect(document.getElementById("readout3").textContent).toMatch(/no compartment there/i);
      expect(document.getElementById("status3").textContent).toMatch(/simply isn't part of the wall/i);
      // The ghost compartment is styled as an absence, never as an error/failure state.
      const ghostCell = cellAt("wall3", 6);
      expect(ghostCell.className).toMatch(/pgh-cell-ghost/);
      expect(ghostCell.className).not.toMatch(/error|wrong|invalid/i);
    });

    test("checking an edge, reaching beyond, and returning to a real compartment awards the star", () => {
      const back = document.getElementById("idxBack3"), fwd = document.getElementById("idxFwd3");
      fwd.click(); fwd.click(); fwd.click(); fwd.click(); fwd.click(); // 1 -> 6, hits "beyond"
      expect(isDiscoveryDone("d3")).toBe(false);
      back.click(); // 6 -> 5, real compartment again + edge (5) + back
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the grid", () => {
    test("starts with nine empty seats", () => {
      expect(document.querySelectorAll("#grid4 .pgh-seat").length).toBe(9);
    });

    test("typing a name and tapping a seat addresses it as Seats[row, column], row first", () => {
      document.getElementById("nameInput4").value = "Priya";
      seatAt("grid4", 1, 1).click();
      expect(document.getElementById("code4").textContent).toMatch(/Seats\[1, 1\]/);
      expect(document.getElementById("code4").textContent).toMatch(/Priya/);
    });

    test("addressing the front-left, back-right and middle seats awards the star", () => {
      const input = document.getElementById("nameInput4");
      input.value = "A"; seatAt("grid4", 1, 1).click();
      expect(isDiscoveryDone("d4")).toBe(false);
      input.value = "B"; seatAt("grid4", 3, 3).click();
      input.value = "C"; seatAt("grid4", 2, 2).click();
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: the sweep", () => {
    function stepButton5() {
      return Array.from(document.querySelectorAll("#bar5 .loop-btn")).find(b => b.textContent.match(/Step/));
    }

    test("stepping the default rows-first sweep paints seat [1,1] before [2,1]", () => {
      const step = stepButton5();
      step.click(); // paints [1,1]
      step.click(); step.click(); // [1,2] [1,3]
      step.click(); // [2,1]
      const seq11 = seatAt("grid5", 1, 1).querySelector(".pgh-seat-seq").textContent;
      const seq21 = seatAt("grid5", 2, 1).querySelector(".pgh-seat-seq").textContent;
      expect(Number(seq11)).toBeLessThan(Number(seq21));
    });

    test("painting both rows-first and columns-first sweeps awards the star", () => {
      const step = stepButton5();
      for (let i = 0; i < 10; i++) step.click(); // 9 seats + 1 finishing check
      expect(isDiscoveryDone("d5")).toBe(false);
      const orderBtn = document.querySelector("#orderBar5 button");
      orderBtn.click(); // switches to columns-first and resets
      const step2 = stepButton5();
      for (let i = 0; i < 10; i++) step2.click();
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 6: mini-trace — find the largest", () => {
    function fillCell(row, colKey, value) {
      const btn = document.querySelector('#grid6 .tg-fillable[data-row="' + row + '"][data-col="' + colKey + '"]');
      btn.click();
      const opt = Array.from(document.querySelectorAll("#pad6 .tg-pad-btn")).find(o => o.dataset.value === String(value));
      opt.click();
    }

    test("shows the wall's five values as a static reference", () => {
      expect(document.querySelectorAll("#wall6 .pgh-cell").length).toBe(5);
    });

    test("tracing all six rows correctly awards the star", () => {
      fillCell(0, "Largest", 7);
      fillCell(1, "Index", 2);
      fillCell(2, "Index", 3);
      fillCell(2, "Largest", 15);
      fillCell(3, "Index", 4);
      fillCell(4, "Index", 5);
      fillCell(4, "Largest", 20);
      fillCell(5, "OUTPUT", 20);
      expect(isDiscoveryDone("d6")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a wrong pick leaves the box quiet instead of marking it wrong", () => {
      const btn = document.querySelector('#grid6 .tg-fillable[data-row="0"][data-col="Largest"]');
      btn.click();
      const wrongOpt = Array.from(document.querySelectorAll("#pad6 .tg-pad-btn")).find(o => o.dataset.value !== "7");
      wrongOpt.click();
      expect(btn.classList.contains("tg-filled")).toBe(false);
      expect(document.getElementById("status6").textContent.length).toBeGreaterThan(0);
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

  test("all six discoveries unlock the reflection card", () => {
    // D1
    const input1 = document.getElementById("valInput1");
    [1, 2, 3, 4, 5].forEach(i => { input1.value = String(i * 10); cellAt("wall1", i).click(); });
    input1.value = "99"; cellAt("wall1", 1).click();
    // D2
    const step2 = Array.from(document.querySelectorAll("#bar2 .loop-btn")).find(b => b.textContent.match(/Step/));
    for (let i = 0; i < 6; i++) step2.click();
    // D3
    const back3 = document.getElementById("idxBack3"), fwd3 = document.getElementById("idxFwd3");
    fwd3.click(); fwd3.click(); fwd3.click(); fwd3.click(); fwd3.click();
    back3.click();
    // D4
    const input4 = document.getElementById("nameInput4");
    input4.value = "A"; seatAt("grid4", 1, 1).click();
    input4.value = "B"; seatAt("grid4", 3, 3).click();
    input4.value = "C"; seatAt("grid4", 2, 2).click();
    // D5
    const step5a = Array.from(document.querySelectorAll("#bar5 .loop-btn")).find(b => b.textContent.match(/Step/));
    for (let i = 0; i < 10; i++) step5a.click();
    document.querySelector("#orderBar5 button").click();
    const step5b = Array.from(document.querySelectorAll("#bar5 .loop-btn")).find(b => b.textContent.match(/Step/));
    for (let i = 0; i < 10; i++) step5b.click();
    // D6
    function fillCell(row, colKey, value) {
      const btn = document.querySelector('#grid6 .tg-fillable[data-row="' + row + '"][data-col="' + colKey + '"]');
      btn.click();
      const opt = Array.from(document.querySelectorAll("#pad6 .tg-pad-btn")).find(o => o.dataset.value === String(value));
      opt.click();
    }
    fillCell(0, "Largest", 7);
    fillCell(1, "Index", 2);
    fillCell(2, "Index", 3);
    fillCell(2, "Largest", 15);
    fillCell(3, "Index", 4);
    fillCell(4, "Index", 5);
    fillCell(4, "Largest", 20);
    fillCell(5, "OUTPUT", 20);

    expect(starCount()).toBe("✦ 6");
    expect(reflectVisible()).toBe(true);
  });
});
