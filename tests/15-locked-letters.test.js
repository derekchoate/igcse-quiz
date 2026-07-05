const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// This module's D2 courier log, D3 lockbox reveal, D4 bench sorter and D5
// term-bin matcher are all bespoke to this lesson (see module.js header: the
// shared `matcher` kit hardcodes awardStar("d3", ...) with Module 9's wording,
// and this module's own #d3 is the padlock trick, not a matching exercise —
// so tests drive the real markup/ids directly rather than needing new shared
// fixtures).
function scenarioChip(id) {
  return document.querySelector('.scenario-chip[data-id="' + id + '"]');
}
function benchHead(name) {
  return Array.from(document.querySelectorAll(".bench-head")).find(b => b.textContent === name + " bench");
}
function defChip(id) {
  return document.querySelector('.def-chip[data-id="' + id + '"]');
}
function termBinHead(name) {
  return Array.from(document.querySelectorAll(".term-bin-head")).find(b => b.textContent === name);
}

describe("Module 15: Locked Letters", () => {
  beforeEach(() => {
    loadModule("15-locked-letters.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: scramble with a shared key", () => {
    test("scrambling with key 5 produces the expected ciphertext", () => {
      document.getElementById("keySlider1").value = "5";
      document.getElementById("scrambleBtn1").click();
      expect(document.getElementById("cipherOut1").textContent).toBe("Ciphertext: RJJY FY YMJ HFSYJJS");
    });

    test("unscrambling with the same key recovers the original plaintext", () => {
      document.getElementById("keySlider1").value = "5";
      document.getElementById("scrambleBtn1").click();
      document.getElementById("unscrambleBtn1").click();
      expect(document.getElementById("plainOut1").textContent).toMatch(/^Unscrambled: MEET AT THE CANTEEN — matches the original/);
    });

    test("the unscramble button is hidden until a key has been scrambled", () => {
      expect(document.getElementById("unscrambleBtn1").hidden).toBe(true);
      document.getElementById("scrambleBtn1").click();
      expect(document.getElementById("unscrambleBtn1").hidden).toBe(false);
    });

    test("scrambling with a small key and a large key awards the star", () => {
      document.getElementById("keySlider1").value = "5";
      document.getElementById("scrambleBtn1").click();
      document.getElementById("unscrambleBtn1").click();

      document.getElementById("keySlider1").value = "20";
      document.getElementById("scrambleBtn1").click();
      document.getElementById("unscrambleBtn1").click();

      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: the courier problem", () => {
    test("playing the courier log awards the star", () => {
      jest.useFakeTimers();
      document.getElementById("sendKeyBtn2").click();
      jest.advanceTimersByTime(3000);
      jest.useRealTimers();

      expect(isDiscoveryDone("d2")).toBe(true);
    });

    test("the snoop is the one who copies the key and later unlocks the message, not the sender or friend", () => {
      jest.useFakeTimers();
      document.getElementById("sendKeyBtn2").click();
      jest.advanceTimersByTime(3000);
      jest.useRealTimers();

      const lines = Array.from(document.querySelectorAll("#courierLog2 .courier-line"));
      const copyLine = lines.find(l => l.textContent.includes("copies the key"));
      const unlockLine = lines.find(l => l.textContent.includes("unlocks their own copy"));
      expect(copyLine.classList.contains("snoop")).toBe(true);
      expect(unlockLine.classList.contains("snoop")).toBe(true);
    });
  });

  describe("discovery 3: the open padlock trick", () => {
    test("locking, letting the snoop try, then unlocking with the private key awards the star", () => {
      const lockBtn = document.getElementById("lockBtn3");
      const snoopBtn = document.getElementById("snoopBtn3");
      const unlockBtn = document.getElementById("unlockBtn3");

      expect(snoopBtn.hidden).toBe(true);
      expect(unlockBtn.hidden).toBe(true);

      lockBtn.click();
      expect(lockBtn.hidden).toBe(true);
      expect(snoopBtn.hidden).toBe(false);
      expect(document.getElementById("lockboxText3").textContent).not.toMatch(/MEET AT THE CANTEEN/);

      snoopBtn.click();
      expect(snoopBtn.hidden).toBe(true);
      expect(unlockBtn.hidden).toBe(false);

      unlockBtn.click();
      expect(document.getElementById("lockboxText3").textContent).toBe("MEET AT THE CANTEEN");
      expect(isDiscoveryDone("d3")).toBe(true);
    });

    test("the snoop's failed attempt is framed as a discovery, never as a learner failure", () => {
      document.getElementById("lockBtn3").click();
      document.getElementById("snoopBtn3").click();
      const text = document.getElementById("lockStatus3").textContent;
      expect(text).toMatch(/nothing happens/);
      expect(text).not.toMatch(/wrong answer|error count|incorrect|you failed/i);
    });
  });

  describe("discovery 4: which is which", () => {
    test("sorting all six scenarios onto their benches awards the star", () => {
      const answers = { s1: "Symmetric", s2: "Symmetric", s3: "Symmetric", s4: "Asymmetric", s5: "Asymmetric", s6: "Asymmetric" };
      Object.keys(answers).forEach(id => {
        scenarioChip(id).click();
        benchHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(document.querySelectorAll(".bench-item").length).toBe(6);
    });

    test("a mismatched bench pick gives a warm redirect, never an error, and does not award a star", () => {
      scenarioChip("s1").click(); // s1 is Symmetric
      benchHead("Asymmetric").click(); // wrong bench on purpose
      expect(isDiscoveryDone("d4")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that bench/);
      expect(scenarioChip("s1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 5: vocabulary lock-in", () => {
    test("matching all three definitions to their terms awards the star", () => {
      defChip("p1").click(); termBinHead("Plaintext").click();
      defChip("p2").click(); termBinHead("Ciphertext").click();
      defChip("p3").click(); termBinHead("Key").click();
      expect(isDiscoveryDone("d5")).toBe(true);
    });

    test("a mismatched term pick gives a warm redirect, never an error, and does not award a star", () => {
      defChip("p1").click(); // p1 is Plaintext
      termBinHead("Key").click(); // wrong term on purpose
      expect(isDiscoveryDone("d5")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that term/);
      expect(defChip("p1").classList.contains("placed")).toBe(false);
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
    document.getElementById("keySlider1").value = "5";
    document.getElementById("scrambleBtn1").click();
    document.getElementById("unscrambleBtn1").click();
    document.getElementById("keySlider1").value = "20";
    document.getElementById("scrambleBtn1").click();
    document.getElementById("unscrambleBtn1").click();

    // D2
    jest.useFakeTimers();
    document.getElementById("sendKeyBtn2").click();
    jest.advanceTimersByTime(3000);
    jest.useRealTimers();

    // D3
    document.getElementById("lockBtn3").click();
    document.getElementById("snoopBtn3").click();
    document.getElementById("unlockBtn3").click();

    // D4
    const answers4 = { s1: "Symmetric", s2: "Symmetric", s3: "Symmetric", s4: "Asymmetric", s5: "Asymmetric", s6: "Asymmetric" };
    Object.keys(answers4).forEach(id => {
      scenarioChip(id).click();
      benchHead(answers4[id]).click();
    });

    // D5
    defChip("p1").click(); termBinHead("Plaintext").click();
    defChip("p2").click(); termBinHead("Ciphertext").click();
    defChip("p3").click(); termBinHead("Key").click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
