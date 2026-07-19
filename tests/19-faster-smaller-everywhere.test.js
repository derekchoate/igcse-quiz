const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// D4's term-bin match and D5's object sort + trait match are bespoke to this
// lesson (see module.js header: the shared `matcher` kit hardcodes
// awardStar("d3", ...) with Module 9's wording, and none of this module's
// uses are a 1:1 slot match anyway) — tests drive the real markup/ids
// directly, mirroring Module 16's test conventions.
function dial(mountId) {
  return document.querySelector("#" + mountId + " .bench-cyc");
}
function cycleDialTo(mountId, times) {
  const btn = dial(mountId);
  for (let i = 0; i < times; i++) btn.click();
}
function defChip(id) {
  return document.querySelector('.def-chip[data-id="' + id + '"]');
}
function termBinHead(label) {
  return Array.from(document.querySelectorAll(".term-bin-head")).find(b => b.textContent === label);
}
function scenarioChip(id) {
  return document.querySelector('.scenario-chip[data-id="' + id + '"]');
}
function benchHead(label) {
  return Array.from(document.querySelectorAll(".bench-head")).find(b => b.textContent === label);
}

describe("Module 17: Faster, Smaller, Everywhere", () => {
  beforeEach(() => {
    loadModule("19-faster-smaller-everywhere.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: the metronome", () => {
    test("running a slow speed and a fast speed both awards the star", () => {
      jest.useFakeTimers();
      // Dial starts at 1 tick/second (slowest) — run it as-is first.
      document.getElementById("startMetro1").click();
      jest.advanceTimersByTime(8000);
      expect(isDiscoveryDone("d1")).toBe(false); // only "slow" tried so far

      // Cycle the dial to 4 ticks/second (fastest: 1 -> 2 -> 3 -> 4) and run again.
      cycleDialTo("dials1", 3);
      document.getElementById("startMetro1").click();
      jest.advanceTimersByTime(2000);

      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
      jest.useRealTimers();
    });

    test("the readout reports completion without any school-style wrong/error language", () => {
      jest.useFakeTimers();
      document.getElementById("startMetro1").click();
      jest.advanceTimersByTime(8000);
      const text = document.getElementById("metroReadout1").textContent;
      expect(text).toMatch(/Finished 8 ticks/);
      expect(text).not.toMatch(/wrong|incorrect|error/i);
      jest.useRealTimers();
    });
  });

  describe("discovery 2: more hands", () => {
    test("the long task stays at 12 ticks regardless of cores; many-small-tasks splits", () => {
      // Default: "one long task", 1 core.
      document.getElementById("runBench2").click();
      let log = document.getElementById("benchLog2").textContent;
      expect(log).toMatch(/finished in 12 ticks/);

      // Same long task, cycle cores to 4 (1 -> 2 -> 4).
      cycleDialTo("dials2", 2);
      document.getElementById("runBench2").click();
      log = document.getElementById("benchLog2").textContent;
      expect(log).toMatch(/finished in 12 ticks/); // still 12 — no faster

      // Switch to many-small-tasks with 4 cores: splits evenly.
      document.getElementById("wkMany2").click();
      document.getElementById("runBench2").click();
      log = document.getElementById("benchLog2").textContent;
      expect(log).toMatch(/finished in 3 ticks/);

      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("the workload toggle is a real state-matching choice, not a pass/fail pick", () => {
      const wkLong2 = document.getElementById("wkLong2");
      const wkMany2 = document.getElementById("wkMany2");
      expect(wkLong2.getAttribute("aria-pressed")).toBe("true");
      wkMany2.click();
      expect(wkMany2.getAttribute("aria-pressed")).toBe("true");
      expect(wkLong2.getAttribute("aria-pressed")).toBe("false");
    });
  });

  describe("discovery 3: the nearby shelf", () => {
    test("cache off costs 20 ticks, cache on costs 8 ticks for the same repeated fetch", () => {
      document.getElementById("runBench3").click();
      let log = document.getElementById("benchLog3").textContent;
      expect(log).toMatch(/20 ticks total/);
      expect(isDiscoveryDone("d3")).toBe(false); // only "off" tried so far

      cycleDialTo("dials3", 1); // off -> on
      document.getElementById("runBench3").click();
      log = document.getElementById("benchLog3").textContent;
      expect(log).toMatch(/8 ticks total/);

      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the dictionary of doables", () => {
    test("matching all four commands to their jobs awards the star", () => {
      const answers = { j1: "LOAD", j2: "STORE", j3: "ADD", j4: "SUBTRACT" };
      Object.keys(answers).forEach(id => {
        defChip(id).click();
        termBinHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched command pick gives a warm redirect, never an error, and does not award a star", () => {
      defChip("j1").click(); // j1 is LOAD
      termBinHead("STORE").click(); // wrong command on purpose
      expect(isDiscoveryDone("d4")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that command/);
      expect(defChip("j1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 5: computers in disguise", () => {
    const objectAnswers = {
      o1: "Embedded system", o2: "Embedded system", o3: "Embedded system", o4: "Embedded system",
      o5: "General-purpose computer", o6: "General-purpose computer", o7: "General-purpose computer", o8: "General-purpose computer"
    };
    const traitAnswers = { t1: "Dedicated function", t2: "Firmware", t3: "Low power" };

    test("sorting all eight objects alone does not yet award the star (both boards required)", () => {
      Object.keys(objectAnswers).forEach(id => {
        scenarioChip(id).click();
        benchHead(objectAnswers[id]).click();
      });
      expect(document.querySelectorAll("#benches5 .bench-item").length).toBe(8);
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("matching all three traits alone does not yet award the star (both boards required)", () => {
      Object.keys(traitAnswers).forEach(id => {
        defChip(id).click();
        termBinHead(traitAnswers[id]).click();
      });
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("completing both the object sort and the trait match awards the star", () => {
      Object.keys(objectAnswers).forEach(id => {
        scenarioChip(id).click();
        benchHead(objectAnswers[id]).click();
      });
      Object.keys(traitAnswers).forEach(id => {
        defChip(id).click();
        termBinHead(traitAnswers[id]).click();
      });
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched object pick gives a warm redirect, never an error, and does not award a star", () => {
      scenarioChip("o1").click(); // o1 is Embedded system
      benchHead("General-purpose computer").click(); // wrong bin on purpose
      expect(isDiscoveryDone("d5")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that bin/);
      expect(scenarioChip("o1").classList.contains("placed")).toBe(false);
    });

    test("a mismatched trait pick gives a warm redirect, never an error, and does not award a star", () => {
      defChip("t1").click(); // t1 is Dedicated function
      termBinHead("Firmware").click(); // wrong trait on purpose
      expect(isDiscoveryDone("d5")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that trait/);
      expect(defChip("t1").classList.contains("placed")).toBe(false);
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
    jest.useFakeTimers();
    // D1
    document.getElementById("startMetro1").click();
    jest.advanceTimersByTime(8000);
    cycleDialTo("dials1", 3);
    document.getElementById("startMetro1").click();
    jest.advanceTimersByTime(2000);
    jest.useRealTimers();

    // D2
    document.getElementById("runBench2").click();
    cycleDialTo("dials2", 2);
    document.getElementById("runBench2").click();
    document.getElementById("wkMany2").click();
    document.getElementById("runBench2").click();

    // D3
    document.getElementById("runBench3").click();
    cycleDialTo("dials3", 1);
    document.getElementById("runBench3").click();

    // D4
    const answers4 = { j1: "LOAD", j2: "STORE", j3: "ADD", j4: "SUBTRACT" };
    Object.keys(answers4).forEach(id => {
      defChip(id).click();
      termBinHead(answers4[id]).click();
    });

    // D5
    const objectAnswers = {
      o1: "Embedded system", o2: "Embedded system", o3: "Embedded system", o4: "Embedded system",
      o5: "General-purpose computer", o6: "General-purpose computer", o7: "General-purpose computer", o8: "General-purpose computer"
    };
    Object.keys(objectAnswers).forEach(id => {
      scenarioChip(id).click();
      benchHead(objectAnswers[id]).click();
    });
    const traitAnswers = { t1: "Dedicated function", t2: "Firmware", t3: "Low power" };
    Object.keys(traitAnswers).forEach(id => {
      defChip(id).click();
      termBinHead(traitAnswers[id]).click();
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
