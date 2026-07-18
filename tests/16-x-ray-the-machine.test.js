const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// Every discovery is a small hand-rolled term-match built by the same local
// factory (module.js: makeTermMatch, reused four times) — the shared
// `matcher` kit hardcodes awardStar("d3", ...) with Module 9's wording, so
// tests drive the real markup/ids directly, same as the old file.
function jobChip(id) {
  return document.querySelector('.def-chip[data-id="' + id + '"]');
}
// D1-D3 and D4's recap reuse the same seven labels, so lookups must be
// scoped to the discovery that's actually being driven, not the whole page.
function termBinHead(discId, label) {
  const disc = document.getElementById(discId);
  return Array.from(disc.querySelectorAll(".term-bin-head")).find(b => b.textContent === label);
}
function revealedKeys() {
  return Array.from(document.querySelectorAll("#cpuMountMachine .cpu-box, #cpuMountMachine .cpu-tag"))
    .filter(el => !el.classList.contains("dim"))
    .map(el => el.dataset.key);
}

describe("Module 16: Meet the Machine", () => {
  beforeEach(() => {
    loadModule("16-x-ray-the-machine.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  test("every part except memory starts dimmed on the shared machine map", () => {
    const dimmed = Array.from(document.querySelectorAll("#cpuMountMachine .cpu-box.dim, #cpuMountMachine .cpu-tag.dim"))
      .map(el => el.dataset.key);
    expect(dimmed.sort()).toEqual(["acc", "alu", "cir", "cu", "mar", "mdr", "pc"].sort());
    expect(document.querySelector('#cpuMountMachine .cpu-node[data-key="mem"]').classList.contains("dim")).toBe(false);
  });

  describe("discovery 1: the two workers", () => {
    test("matching CU and ALU awards the star and reveals them on the map", () => {
      jobChip("j1").click();
      termBinHead("d1", "CU — Control Unit").click();
      jobChip("j2").click();
      termBinHead("d1", "ALU — Arithmetic Logic Unit").click();
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
      expect(revealedKeys()).toEqual(expect.arrayContaining(["cu", "alu"]));
    });

    test("a mismatched part pick gives a warm redirect, never an error, and does not award a star", () => {
      jobChip("j1").click(); // j1 is CU
      termBinHead("d1", "ALU — Arithmetic Logic Unit").click(); // wrong part on purpose
      expect(isDiscoveryDone("d1")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that part/);
      expect(jobChip("j1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 2: the fetch trio", () => {
    test("matching PC, MAR and MDR awards the star and reveals them on the map", () => {
      const answers = { j3: "PC — Program Counter", j4: "MAR — Memory Address Register", j5: "MDR — Memory Data Register" };
      Object.keys(answers).forEach(id => {
        jobChip(id).click();
        termBinHead("d2", answers[id]).click();
      });
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
      expect(revealedKeys()).toEqual(expect.arrayContaining(["pc", "mar", "mdr"]));
    });
  });

  describe("discovery 3: the instruction and the notepad", () => {
    test("matching CIR and ACC awards the star and reveals them on the map", () => {
      jobChip("j6").click();
      termBinHead("d3", "CIR — Current Instruction Register").click();
      jobChip("j7").click();
      termBinHead("d3", "ACC — Accumulator").click();
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(revealedKeys()).toEqual(expect.arrayContaining(["cir", "acc"]));
    });
  });

  describe("discovery 4: sort the whole crew", () => {
    test("matching all seven recap jobs awards the star", () => {
      const answers = { k1: "CU — Control Unit", k2: "ALU — Arithmetic Logic Unit", k3: "PC — Program Counter",
        k4: "MAR — Memory Address Register", k5: "MDR — Memory Data Register", k6: "CIR — Current Instruction Register",
        k7: "ACC — Accumulator" };
      Object.keys(answers).forEach(id => {
        jobChip(id).click();
        termBinHead("d4", answers[id]).click();
      });
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched part pick gives a warm redirect, never an error, and does not award a star", () => {
      jobChip("k4").click(); // k4 is MAR
      termBinHead("d4", "MDR — Memory Data Register").click(); // wrong part on purpose
      expect(isDiscoveryDone("d4")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that part/);
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

  test("all four discoveries unlock the reflection card, and the map is fully revealed", () => {
    jobChip("j1").click(); termBinHead("d1", "CU — Control Unit").click();
    jobChip("j2").click(); termBinHead("d1", "ALU — Arithmetic Logic Unit").click();

    jobChip("j3").click(); termBinHead("d2", "PC — Program Counter").click();
    jobChip("j4").click(); termBinHead("d2", "MAR — Memory Address Register").click();
    jobChip("j5").click(); termBinHead("d2", "MDR — Memory Data Register").click();

    jobChip("j6").click(); termBinHead("d3", "CIR — Current Instruction Register").click();
    jobChip("j7").click(); termBinHead("d3", "ACC — Accumulator").click();

    const answers4 = { k1: "CU — Control Unit", k2: "ALU — Arithmetic Logic Unit", k3: "PC — Program Counter",
      k4: "MAR — Memory Address Register", k5: "MDR — Memory Data Register", k6: "CIR — Current Instruction Register",
      k7: "ACC — Accumulator" };
    Object.keys(answers4).forEach(id => {
      jobChip(id).click();
      termBinHead("d4", answers4[id]).click();
    });

    expect(starCount()).toBe("✦ 4");
    expect(reflectVisible()).toBe(true);
    expect(revealedKeys().sort()).toEqual(["acc", "alu", "cir", "cu", "mar", "mdr", "pc"].sort());
  });
});
