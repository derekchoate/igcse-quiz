const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// Small local helpers — this module's dials are plain cycler buttons and its
// loop engine advances one lap per "Step" click, so tests drive both directly
// rather than needing new shared fixtures.
function dialButtons(containerId) {
  return Array.from(document.querySelectorAll("#" + containerId + " .loop-cyc"));
}
function stepButton(engineId) {
  return Array.from(document.querySelectorAll("#" + engineId + " .loop-btn"))
    .find(b => b.textContent === "Step one lap ▸");
}
function clickTimes(el, n) {
  for (let i = 0; i < n; i++) el.click();
}

describe("Module 12: Round and Round", () => {
  beforeEach(() => {
    loadModule("12-round-and-round.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  test("discovery 1 (FOR): default dials (5 TO 1 STEP -1) run five laps and light the '5 laps' chip", () => {
    const step = stepButton("engine1");
    clickTimes(step, 6); // 5 laps executed + 1 tick to notice the condition is now false
    const chip = document.querySelector('#chips1 .chip[data-target="5"]');
    expect(chip.classList.contains("hit")).toBe(true);
    expect(isDiscoveryDone("d1")).toBe(false); // only one of four lap-count chips found so far
  });

  test("discovery 1 (FOR): finding all four lap counts (3, 5, 6, 10) awards the star", () => {
    const [startCyc, endCyc, stepCyc] = dialButtons("dials1");
    const step = () => stepButton("engine1");

    clickTimes(step(), 6); // (5,1,-1) -> 5 laps
    stepCyc.click(); // Step -> -2, (5,1,-2) -> 5,3,1 = 3 laps
    clickTimes(step(), 4);
    clickTimes(startCyc, 2); // Start -> 8 -> 10, (10,1,-2), not run
    endCyc.click(); // End -> 0, (10,0,-2) -> 10,8,6,4,2,0 = 6 laps
    clickTimes(step(), 7);
    stepCyc.click(); // Step -> -1, (10,0,-1), not run
    endCyc.click(); // End -> 1, (10,1,-1) -> 10..1 = 10 laps
    clickTimes(step(), 11);

    ["3", "5", "6", "10"].forEach(target => {
      expect(document.querySelector('#chips1 .chip[data-target="' + target + '"]').classList.contains("hit")).toBe(true);
    });
    expect(isDiscoveryDone("d1")).toBe(true);
  });

  test("discovery 2 (WHILE): a queue of zero runs the body zero times", () => {
    const [queueCyc] = dialButtons("dials2");
    const step = stepButton("engine2");
    queueCyc.click(); // 3 -> 0
    step.click();
    expect(document.querySelector('#chips2 .chip[data-target="0"]').classList.contains("hit")).toBe(true);
    expect(isDiscoveryDone("d2")).toBe(false);
  });

  test("discovery 2 (WHILE): trying queues of 3, 0, 1 and 5 awards the star", () => {
    const [queueCyc] = dialButtons("dials2");
    const step = () => stepButton("engine2");

    clickTimes(step(), 4); // default queue 3 -> ran 3
    queueCyc.click(); // 3 -> 0
    step().click(); // ran 0
    queueCyc.click(); // 0 -> 1
    clickTimes(step(), 2); // ran 1
    queueCyc.click(); // 1 -> 5
    clickTimes(step(), 6); // ran 5

    ["0", "1", "3", "5"].forEach(target => {
      expect(document.querySelector('#chips2 .chip[data-target="' + target + '"]').classList.contains("hit")).toBe(true);
    });
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 3 (REPEAT): the body runs at least once even before the door code matches", () => {
    const step = stepButton("engine3");
    step.click(); // guess 07, no match — the body still ran once
    expect(isDiscoveryDone("d3")).toBe(false);
    expect(document.getElementById("code3").textContent).toMatch(/UNTIL/);
  });

  test("discovery 3 (REPEAT): guessing 07, 42, 63 then 19 opens the door and awards the star", () => {
    const [codeCyc] = dialButtons("dials3");
    const step = stepButton("engine3");
    step.click(); // 07 — no match
    codeCyc.click(); // -> 42
    step.click(); // no match
    codeCyc.click(); // -> 63
    step.click(); // no match
    codeCyc.click(); // -> 19
    step.click(); // matches
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: sorting all six scenarios onto their platforms awards the star", () => {
    const platform = name => Array.from(document.querySelectorAll(".platform-head")).find(b => b.textContent === name);
    const scenarios = Array.from(document.querySelectorAll(".scenario-chip"));
    const answers = { s1: "FOR", s2: "REPEAT", s3: "WHILE", s4: "FOR", s5: "REPEAT", s6: "WHILE" };
    scenarios.forEach(chip => {
      const id = chip.dataset.id;
      chip.click();
      platform(answers[id]).click();
    });
    expect(isDiscoveryDone("d4")).toBe(true);
    expect(document.querySelectorAll(".platform-item").length).toBe(6);
  });

  test("discovery 4: a mismatched platform pick gives a warm redirect, never an error, and does not award a star", () => {
    const platform = name => Array.from(document.querySelectorAll(".platform-head")).find(b => b.textContent === name);
    const s1 = document.querySelector('.scenario-chip[data-id="s1"]'); // s1 is FOR
    s1.click();
    platform("WHILE").click(); // wrong platform on purpose
    expect(isDiscoveryDone("d4")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/Not that platform/);
    expect(s1.classList.contains("placed")).toBe(false);
  });

  test("discovery 5: running the loop away and then pulling the plug reveals the bug picker", () => {
    jest.useFakeTimers();
    const runBtn = Array.from(document.querySelectorAll("#engine5 .loop-btn")).find(b => b.textContent === "Run it ▶");
    const plugBtn = Array.from(document.querySelectorAll("#engine5 .loop-btn")).find(b => b.textContent === "🔌 Pull the plug");
    runBtn.click();
    jest.advanceTimersByTime(4500); // well past the 60-tick safety cap
    plugBtn.click();
    expect(document.getElementById("bugPick5").hidden).toBe(false);
    jest.useRealTimers();
  });

  test("discovery 5: naming the missing update as the bug awards the star; other picks give a warm redirect first", () => {
    jest.useFakeTimers();
    const runBtn = Array.from(document.querySelectorAll("#engine5 .loop-btn")).find(b => b.textContent === "Run it ▶");
    const plugBtn = Array.from(document.querySelectorAll("#engine5 .loop-btn")).find(b => b.textContent === "🔌 Pull the plug");
    runBtn.click();
    jest.advanceTimersByTime(1000);
    plugBtn.click();
    jest.useRealTimers();

    const wrongBtn = Array.from(document.querySelectorAll(".bug-btn")).find(b => b.textContent === "Off-by-one bound");
    wrongBtn.click();
    expect(isDiscoveryDone("d5")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/Not quite that one/);

    const rightBtn = Array.from(document.querySelectorAll(".bug-btn")).find(b => b.textContent === "Nothing updates Count");
    rightBtn.click();
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    const [startCyc, endCyc, stepCyc] = dialButtons("dials1");
    const step1 = () => stepButton("engine1");
    clickTimes(step1(), 6);
    stepCyc.click(); clickTimes(step1(), 4);
    clickTimes(startCyc, 2); endCyc.click(); clickTimes(step1(), 7);
    stepCyc.click(); endCyc.click(); clickTimes(step1(), 11);

    // D2
    const [queueCyc] = dialButtons("dials2");
    const step2 = () => stepButton("engine2");
    clickTimes(step2(), 4);
    queueCyc.click(); step2().click();
    queueCyc.click(); clickTimes(step2(), 2);
    queueCyc.click(); clickTimes(step2(), 6);

    // D3
    const [codeCyc] = dialButtons("dials3");
    const step3 = stepButton("engine3");
    step3.click();
    codeCyc.click(); step3.click();
    codeCyc.click(); step3.click();
    codeCyc.click(); step3.click();

    // D4
    const platform = name => Array.from(document.querySelectorAll(".platform-head")).find(b => b.textContent === name);
    const answers = { s1: "FOR", s2: "REPEAT", s3: "WHILE", s4: "FOR", s5: "REPEAT", s6: "WHILE" };
    Array.from(document.querySelectorAll(".scenario-chip")).forEach(chip => {
      chip.click();
      platform(answers[chip.dataset.id]).click();
    });

    // D5
    jest.useFakeTimers();
    const runBtn = Array.from(document.querySelectorAll("#engine5 .loop-btn")).find(b => b.textContent === "Run it ▶");
    const plugBtn = Array.from(document.querySelectorAll("#engine5 .loop-btn")).find(b => b.textContent === "🔌 Pull the plug");
    runBtn.click();
    jest.advanceTimersByTime(1000);
    plugBtn.click();
    jest.useRealTimers();
    Array.from(document.querySelectorAll(".bug-btn")).find(b => b.textContent === "Nothing updates Count").click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
