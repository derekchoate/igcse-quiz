const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// D1's term-bin match and D4's bus sorter are bespoke to this lesson (see
// module.js header: the shared `matcher` kit hardcodes awardStar("d3", ...)
// with Module 9's wording, and this module's own #d3 is the ADD decode/
// execute crank, not a matching exercise) — tests drive the real markup/ids
// directly. D2/D3/D5 share one bespoke crank engine, driven purely by
// repeated clicks on the single ".cpu-crank" button each mount produces.
function jobChip(id) {
  return document.querySelector('.def-chip[data-id="' + id + '"]');
}
function termBinHead(label) {
  return Array.from(document.querySelectorAll(".term-bin-head")).find(b => b.textContent === label);
}
function parcelChip(id) {
  return document.querySelector('.scenario-chip[data-id="' + id + '"]');
}
function busHead(name) {
  return Array.from(document.querySelectorAll(".bench-head")).find(b => b.textContent === name + " bus");
}
function crankButton(mountId) {
  return document.querySelector("#" + mountId + " .cpu-crank");
}
function crankThrough(mountId, times) {
  for (let i = 0; i < times; i++) crankButton(mountId).click();
}

describe("Module 16: X-Ray the Machine", () => {
  beforeEach(() => {
    loadModule("16-x-ray-the-machine.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: meet the crew", () => {
    test("matching all seven jobs to their parts awards the star", () => {
      const answers = { j1: "CU — Control Unit", j2: "ALU — Arithmetic Logic Unit", j3: "PC — Program Counter",
        j4: "MAR — Memory Address Register", j5: "MDR — Memory Data Register", j6: "CIR — Current Instruction Register",
        j7: "ACC — Accumulator" };
      Object.keys(answers).forEach(id => {
        jobChip(id).click();
        termBinHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched part pick gives a warm redirect, never an error, and does not award a star", () => {
      jobChip("j4").click(); // j4 is MAR
      termBinHead("MDR — Memory Data Register").click(); // wrong part on purpose
      expect(isDiscoveryDone("d1")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that part/);
      expect(jobChip("j4").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 2: one full fetch", () => {
    test("cranking through all five fetch steps awards the star", () => {
      crankThrough("cpuMount2", 5);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("PC increments on the second crank — before the instruction reaches the CIR", () => {
      const pcVal = () => document.querySelector('#cpuMount2 .cpu-box[data-key="pc"] .cpu-val').textContent;
      const cirVal = () => document.querySelector('#cpuMount2 .cpu-box[data-key="cir"] .cpu-val').textContent;

      expect(pcVal()).toBe("100");
      crankThrough("cpuMount2", 1); // MAR loaded, PC still 100
      expect(pcVal()).toBe("100");
      crankThrough("cpuMount2", 1); // PC increments here
      expect(pcVal()).toBe("101");
      expect(cirVal()).toBe("—"); // instruction has NOT arrived in CIR yet
      crankThrough("cpuMount2", 3); // finish the fetch
      expect(cirVal()).toBe("LOAD 200");
    });
  });

  describe("discovery 3: decode and execute an ADD", () => {
    test("starting the ADD and cranking through updates ACC", () => {
      document.getElementById("addSlider3").value = "5";
      document.getElementById("startAdd3").click();
      crankThrough("cpuMount3", 4);
      const accVal = document.querySelector('#cpuMount3 .cpu-box[data-key="acc"] .cpu-val').textContent;
      expect(accVal).toBe("24");
      // The star needs one small AND one large amount (mirrors Module 15's
      // D1 small/large key pair) — a single run doesn't complete it yet.
      expect(isDiscoveryDone("d3")).toBe(false);
    });

    test("a small amount and a large amount both award the chip star", () => {
      document.getElementById("addSlider3").value = "5";
      document.getElementById("startAdd3").click();
      crankThrough("cpuMount3", 4);

      document.getElementById("addSlider3").value = "18";
      document.getElementById("startAdd3").click();
      crankThrough("cpuMount3", 4);

      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the three roads", () => {
    test("sorting all six parcels onto their buses awards the star", () => {
      const answers = { p1: "Address", p2: "Data", p3: "Control", p4: "Data", p5: "Address", p6: "Control" };
      Object.keys(answers).forEach(id => {
        parcelChip(id).click();
        busHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(document.querySelectorAll(".bench-item").length).toBe(6);
    });

    test("a mismatched bus pick gives a warm redirect, never an error, and does not award a star", () => {
      parcelChip("p1").click(); // p1 is Address
      busHead("Control").click(); // wrong bus on purpose
      expect(isDiscoveryDone("d4")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that road/);
      expect(parcelChip("p1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 5: run a whole three-line program", () => {
    test("locking in a guess and cranking through the whole program awards the star", () => {
      document.getElementById("guessDial5").value = "25";
      document.getElementById("lockGuess5").click();
      crankThrough("cpuMount5", 9);
      const accVal = document.querySelector('#cpuMount5 .cpu-box[data-key="acc"] .cpu-val').textContent;
      expect(accVal).toBe("25");
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(document.getElementById("guessResult5").textContent).toMatch(/bang on/);
    });

    test("a mismatched guess is compared warmly, never framed as wrong, and still awards the star", () => {
      document.getElementById("guessDial5").value = "10";
      document.getElementById("lockGuess5").click();
      crankThrough("cpuMount5", 9);
      const resultText = document.getElementById("guessResult5").textContent;
      expect(resultText).toMatch(/No bother/);
      expect(resultText).not.toMatch(/wrong|incorrect|error/i);
      expect(isDiscoveryDone("d5")).toBe(true);
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      // Rung 0 must be visible without clicking any other nudge first.
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    const answers1 = { j1: "CU — Control Unit", j2: "ALU — Arithmetic Logic Unit", j3: "PC — Program Counter",
      j4: "MAR — Memory Address Register", j5: "MDR — Memory Data Register", j6: "CIR — Current Instruction Register",
      j7: "ACC — Accumulator" };
    Object.keys(answers1).forEach(id => {
      jobChip(id).click();
      termBinHead(answers1[id]).click();
    });

    // D2
    crankThrough("cpuMount2", 5);

    // D3
    document.getElementById("addSlider3").value = "5";
    document.getElementById("startAdd3").click();
    crankThrough("cpuMount3", 4);
    document.getElementById("addSlider3").value = "18";
    document.getElementById("startAdd3").click();
    crankThrough("cpuMount3", 4);

    // D4
    const answers4 = { p1: "Address", p2: "Data", p3: "Control", p4: "Data", p5: "Address", p6: "Control" };
    Object.keys(answers4).forEach(id => {
      parcelChip(id).click();
      busHead(answers4[id]).click();
    });

    // D5
    document.getElementById("guessDial5").value = "25";
    document.getElementById("lockGuess5").click();
    crankThrough("cpuMount5", 9);

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
