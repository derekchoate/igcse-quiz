const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// Small local helpers — D1's dials are plain cycler buttons and its ring
// engine advances one *phase* (check bound / run body / move counter on)
// per "Step" click, three phases per lap, so completing N laps takes
// 3*N + 1 clicks (the extra click is the final check that fails and stops
// the loop). D2/D3 are the kit `walk` flowchart, where tapping the diagram
// itself steps the lantern.
function dialButtons(containerId) {
  return Array.from(document.querySelectorAll("#" + containerId + " .loop-cyc"));
}
function stepButton(engineId) {
  return Array.from(document.querySelectorAll("#" + engineId + " .loop-btn"))
    .find(b => b.textContent === "Step ▸");
}
function clickTimes(el, n) {
  for (let i = 0; i < n; i++) el.click();
}
function walkSvg(mountId) {
  return document.querySelector("#" + mountId + " .fc-svg-wrap");
}
// D3's flowchart also has an "ask" node: picking a code from the buttons
// that appear feeds the loop's INPUT.
function pickCode(mountId, code) {
  const btn = Array.from(document.querySelectorAll("#" + mountId + " .fc-in-btn"))
    .find(b => b.textContent === code);
  btn.click();
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
    clickTimes(step, 16); // 5 laps x 3 phases (check/body/increment) + 1 final failing check
    const chip = document.querySelector('#chips1 .chip[data-target="5"]');
    expect(chip.classList.contains("hit")).toBe(true);
    expect(isDiscoveryDone("d1")).toBe(false); // only one of four lap-count chips found so far
  });

  test("discovery 1 (FOR): finding all four lap counts (3, 5, 6, 10) awards the star", () => {
    const [startCyc, endCyc, stepCyc] = dialButtons("dials1");
    const step = () => stepButton("engine1");

    clickTimes(step(), 16); // (5,1,-1) -> 5 laps: 3*5+1
    stepCyc.click(); // Step -> -2, (5,1,-2) -> 5,3,1 = 3 laps
    clickTimes(step(), 10); // 3*3+1
    clickTimes(startCyc, 2); // Start -> 8 -> 10, (10,1,-2), not run
    endCyc.click(); // End -> 0, (10,0,-2) -> 10,8,6,4,2,0 = 6 laps
    clickTimes(step(), 19); // 3*6+1
    stepCyc.click(); // Step -> -1, (10,0,-1), not run
    endCyc.click(); // End -> 1, (10,1,-1) -> 10..1 = 10 laps
    clickTimes(step(), 31); // 3*10+1

    ["3", "5", "6", "10"].forEach(target => {
      expect(document.querySelector('#chips1 .chip[data-target="' + target + '"]').classList.contains("hit")).toBe(true);
    });
    expect(isDiscoveryDone("d1")).toBe(true);
  });

  test("discovery 2 (WHILE): a queue of zero runs the body zero times", () => {
    const [queueCyc] = dialButtons("dials2");
    queueCyc.click(); // 3 -> 0
    clickTimes(walkSvg("walk2"), 2); // Start -> the diamond; diamond (false) -> Stop, without ever reaching Board one passenger
    expect(document.querySelector('#chips2 .chip[data-target="0"]').classList.contains("hit")).toBe(true);
    expect(isDiscoveryDone("d2")).toBe(false);
  });

  test("discovery 2 (WHILE): trying queues of 3, 0, 1 and 5 awards the star", () => {
    const [queueCyc] = dialButtons("dials2");
    const svg2 = walkSvg("walk2");

    clickTimes(svg2, 8); // default queue 3 -> ran 3 (1 start tap + 3 x [check+board] + 1 final check)
    queueCyc.click(); // 3 -> 0
    clickTimes(svg2, 2); // ran 0
    queueCyc.click(); // 0 -> 1
    clickTimes(svg2, 4); // ran 1
    queueCyc.click(); // 1 -> 5
    clickTimes(svg2, 12); // ran 5

    ["0", "1", "3", "5"].forEach(target => {
      expect(document.querySelector('#chips2 .chip[data-target="' + target + '"]').classList.contains("hit")).toBe(true);
    });
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 3 (REPEAT): even picking the matching code first still needs the check to run before Stop lights up", () => {
    const svg3 = walkSvg("walk3");
    svg3.click(); // Start -> INPUT Code
    pickCode("walk3", "19"); // guess = 19, but the decision hasn't been evaluated yet
    expect(isDiscoveryDone("d3")).toBe(false);
    svg3.click(); // evaluate Code = "19"? -> true -> Stop
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 3 (REPEAT): guessing 07, 42, 63 then 19 loops back each time before opening the door", () => {
    const svg3 = walkSvg("walk3");
    svg3.click(); pickCode("walk3", "07"); // no match -> loops back to INPUT Code
    expect(isDiscoveryDone("d3")).toBe(false);
    svg3.click(); pickCode("walk3", "42"); // no match -> loops back again
    svg3.click(); pickCode("walk3", "63"); // no match -> loops back again
    svg3.click(); pickCode("walk3", "19"); // matches
    svg3.click(); // evaluate -> true -> Stop
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
    clickTimes(step1(), 16);
    stepCyc.click(); clickTimes(step1(), 10);
    clickTimes(startCyc, 2); endCyc.click(); clickTimes(step1(), 19);
    stepCyc.click(); endCyc.click(); clickTimes(step1(), 31);

    // D2
    const [queueCyc] = dialButtons("dials2");
    const svg2 = walkSvg("walk2");
    clickTimes(svg2, 8); // queue 3
    queueCyc.click(); clickTimes(svg2, 2); // queue 0
    queueCyc.click(); clickTimes(svg2, 4); // queue 1
    queueCyc.click(); clickTimes(svg2, 12); // queue 5

    // D3
    const svg3 = walkSvg("walk3");
    svg3.click(); pickCode("walk3", "07");
    svg3.click(); pickCode("walk3", "42");
    svg3.click(); pickCode("walk3", "63");
    svg3.click(); pickCode("walk3", "19");
    svg3.click();

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
