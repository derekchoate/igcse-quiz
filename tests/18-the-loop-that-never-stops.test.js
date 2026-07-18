const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function quizRowByText(text) {
  return Array.from(document.querySelectorAll(".quiz-row")).find(r => r.querySelector(".quiz-text").textContent === text);
}
function quizChoice(row, label) {
  return Array.from(row.querySelectorAll(".quiz-choice")).find(b => b.textContent === label);
}
function crankButton(mountId) {
  return document.querySelector("#" + mountId + " .cpu-crank");
}
function crankThrough(mountId, times) {
  for (let i = 0; i < times; i++) crankButton(mountId).click();
}

describe("Module 18: The Loop That Never Stops", () => {
  beforeEach(() => {
    loadModule("18-the-loop-that-never-stops.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: remember the crew?", () => {
    test("answering all three warm-up questions awards the star", () => {
      quizChoice(quizRowByText("Decides what each instruction means and sends out the signals to match."), "CU").click();
      quizChoice(quizRowByText("Holds the address of the NEXT instruction to fetch."), "PC").click();
      quizChoice(quizRowByText("Keeps the running number after the ALU finishes adding."), "ACC").click();
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a wrong choice gives a warm redirect, never an error, and stays answerable", () => {
      const row = quizRowByText("Holds the address of the NEXT instruction to fetch.");
      quizChoice(row, "MAR").click(); // wrong on purpose
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that part/);
      expect(row.classList.contains("solved")).toBe(false);
      quizChoice(row, "PC").click();
      expect(row.classList.contains("solved")).toBe(true);
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
      // The star needs one small AND one large amount — a single run doesn't complete it yet.
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
    });
  });

  describe("discovery 4: run a whole three-line program", () => {
    test("locking in a guess and cranking through the whole program awards the star", () => {
      document.getElementById("guessDial4").value = "25";
      document.getElementById("lockGuess4").click();
      crankThrough("cpuMount4", 9);
      const accVal = document.querySelector('#cpuMount4 .cpu-box[data-key="acc"] .cpu-val').textContent;
      expect(accVal).toBe("25");
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(document.getElementById("guessResult4").textContent).toMatch(/bang on/);
    });

    test("a mismatched guess is compared warmly, never framed as wrong, and still awards the star", () => {
      document.getElementById("guessDial4").value = "10";
      document.getElementById("lockGuess4").click();
      crankThrough("cpuMount4", 9);
      const resultText = document.getElementById("guessResult4").textContent;
      expect(resultText).toMatch(/No bother/);
      expect(resultText).not.toMatch(/wrong|incorrect|error/i);
      expect(isDiscoveryDone("d4")).toBe(true);
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
    // D1
    quizChoice(quizRowByText("Decides what each instruction means and sends out the signals to match."), "CU").click();
    quizChoice(quizRowByText("Holds the address of the NEXT instruction to fetch."), "PC").click();
    quizChoice(quizRowByText("Keeps the running number after the ALU finishes adding."), "ACC").click();

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
    document.getElementById("guessDial4").value = "25";
    document.getElementById("lockGuess4").click();
    crankThrough("cpuMount4", 9);

    expect(starCount()).toBe("✦ 4");
    expect(reflectVisible()).toBe(true);
  });
});
