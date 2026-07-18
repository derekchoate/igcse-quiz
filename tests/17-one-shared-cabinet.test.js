const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function jobChip(id) {
  return document.querySelector('.def-chip[data-id="' + id + '"]');
}
function termBinHead(discId, label) {
  const disc = document.getElementById(discId);
  return Array.from(disc.querySelectorAll(".term-bin-head")).find(b => b.textContent === label);
}
function parcelChip(id) {
  return document.querySelector('.scenario-chip[data-id="' + id + '"]');
}
function busHead(name) {
  return Array.from(document.querySelectorAll(".bench-head")).find(b => b.textContent === name + " bus");
}
function quizRowByText(text) {
  return Array.from(document.querySelectorAll(".quiz-row")).find(r => r.querySelector(".quiz-text").textContent === text);
}
function quizChoice(row, label) {
  return Array.from(row.querySelectorAll(".quiz-choice")).find(b => b.textContent === label);
}
function busStripText() {
  return document.querySelector("#cpuMountMachine .cpu-bus").textContent;
}

describe("Module 17: One Shared Cabinet", () => {
  beforeEach(() => {
    loadModule("17-one-shared-cabinet.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  test("the shared machine map starts with every part already revealed (Module 16 payoff)", () => {
    const dimmed = document.querySelectorAll("#cpuMountMachine .cpu-box.dim, #cpuMountMachine .cpu-tag.dim");
    expect(dimmed.length).toBe(0);
  });

  describe("discovery 1: one shared filing cabinet", () => {
    test("sorting all five cells into instruction/data awards the star", () => {
      const answers = { c1: "Instruction", c2: "Instruction", c3: "Instruction", c4: "Data", c5: "Data" };
      Object.keys(answers).forEach(id => {
        jobChip(id).click();
        termBinHead("d1", answers[id]).click();
      });
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched bin pick gives a warm redirect, never an error, and does not award a star", () => {
      jobChip("c1").click(); // c1 is Instruction
      termBinHead("d1", "Data").click(); // wrong bin on purpose
      expect(isDiscoveryDone("d1")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that bin/);
    });
  });

  describe("discovery 2: the three roads", () => {
    test("sorting all six parcels onto their buses awards the star and lights the shared strip", () => {
      const answers = { p1: "Address", p2: "Data", p3: "Control", p4: "Data", p5: "Address", p6: "Control" };
      Object.keys(answers).forEach(id => {
        parcelChip(id).click();
        busHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(document.querySelectorAll(".bench-item").length).toBe(6);
      expect(document.querySelector("#cpuMountMachine .cpu-bus").classList.contains("bus-control")).toBe(true);
    });

    test("a mismatched bus pick gives a warm redirect, never an error, and does not award a star", () => {
      parcelChip("p1").click(); // p1 is Address
      busHead("Control").click(); // wrong bus on purpose
      expect(isDiscoveryDone("d2")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that road/);
    });
  });

  describe("discovery 3: which register, which road?", () => {
    test("answering all four scenarios awards the star", () => {
      quizChoice(quizRowByText("The value arriving in MDR, fresh from memory."), "Data").click();
      quizChoice(quizRowByText("PC's address, on its way into MAR."), "Address").click();
      quizChoice(quizRowByText("A READ signal, telling memory to hand something over."), "Control").click();
      quizChoice(quizRowByText("CIR's instruction, the moment it first arrives from memory."), "Data").click();
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
      expect(busStripText()).toMatch(/Data bus/);
    });

    test("a wrong choice gives a warm redirect and stays answerable", () => {
      const row = quizRowByText("PC's address, on its way into MAR.");
      quizChoice(row, "Data").click(); // wrong, PC/MAR is Address
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that road/);
      expect(row.classList.contains("solved")).toBe(false);
      quizChoice(row, "Address").click();
      expect(row.classList.contains("solved")).toBe(true);
    });
  });

  describe("discovery 4: fetch, decode, execute — the shape of it", () => {
    test("ordering all three stages awards the star", () => {
      jobChip("f1").click(); termBinHead("d4", "1st").click();
      jobChip("f2").click(); termBinHead("d4", "2nd").click();
      jobChip("f3").click(); termBinHead("d4", "3rd").click();
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched position pick gives a warm redirect, never an error, and does not award a star", () => {
      jobChip("f3").click(); // f3 is Execute, 3rd
      termBinHead("d4", "1st").click(); // wrong position on purpose
      expect(isDiscoveryDone("d4")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that position/);
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("all four discoveries unlock the reflection card", () => {
    const answers1 = { c1: "Instruction", c2: "Instruction", c3: "Instruction", c4: "Data", c5: "Data" };
    Object.keys(answers1).forEach(id => { jobChip(id).click(); termBinHead("d1", answers1[id]).click(); });

    const answers2 = { p1: "Address", p2: "Data", p3: "Control", p4: "Data", p5: "Address", p6: "Control" };
    Object.keys(answers2).forEach(id => { parcelChip(id).click(); busHead(answers2[id]).click(); });

    quizChoice(quizRowByText("The value arriving in MDR, fresh from memory."), "Data").click();
    quizChoice(quizRowByText("PC's address, on its way into MAR."), "Address").click();
    quizChoice(quizRowByText("A READ signal, telling memory to hand something over."), "Control").click();
    quizChoice(quizRowByText("CIR's instruction, the moment it first arrives from memory."), "Data").click();

    jobChip("f1").click(); termBinHead("d4", "1st").click();
    jobChip("f2").click(); termBinHead("d4", "2nd").click();
    jobChip("f3").click(); termBinHead("d4", "3rd").click();

    expect(starCount()).toBe("✦ 4");
    expect(reflectVisible()).toBe(true);
  });
});
