const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function clickRunButton(id, times) {
  for (let i = 0; i < times; i++) {
    const btn = document.getElementById(id);
    if (!btn) throw new Error("No button #" + id + " found (already removed after " + i + " clicks?)");
    btn.click();
  }
}

function sortItem(poolId, binsId, itemId, binLabel) {
  const pool = document.getElementById(poolId);
  const chip = pool.querySelector('.sort-chip[data-id="' + itemId + '"]');
  if (!chip) throw new Error("No chip with data-id " + itemId + " in #" + poolId);
  chip.click();
  const bins = document.getElementById(binsId);
  const head = Array.from(bins.querySelectorAll(".sort-bin-head")).find(b => b.textContent === binLabel);
  if (!head) throw new Error("No bin head labeled " + binLabel + " in #" + binsId);
  head.click();
}

const ROBOT_LABEL = "Robot — all three: a body, electrical components, and programmable";
const NOT_ROBOT_LABEL = "Not a robot — missing at least one of the three";

function sortAllRobots() {
  sortItem("pool4", "bins4", "arm", ROBOT_LABEL);
  sortItem("pool4", "bins4", "vacuum", ROBOT_LABEL);
  sortItem("pool4", "bins4", "drone", ROBOT_LABEL);
  sortItem("pool4", "bins4", "chatbot", NOT_ROBOT_LABEL);
  sortItem("pool4", "bins4", "rc", NOT_ROBOT_LABEL);
  sortItem("pool4", "bins4", "greenhouse", NOT_ROBOT_LABEL);
  sortItem("pool4", "bins4", "dishwasher", ROBOT_LABEL);
}

const FOR_LABEL = "In favour of automation";
const AGAINST_LABEL = "Against automation";

function sortAllLedger() {
  sortItem("pool5", "bins5", "a1", FOR_LABEL);
  sortItem("pool5", "bins5", "a2", FOR_LABEL);
  sortItem("pool5", "bins5", "a3", FOR_LABEL);
  sortItem("pool5", "bins5", "a4", FOR_LABEL);
  sortItem("pool5", "bins5", "d1", AGAINST_LABEL);
  sortItem("pool5", "bins5", "d2", AGAINST_LABEL);
  sortItem("pool5", "bins5", "d3", AGAINST_LABEL);
  sortItem("pool5", "bins5", "d4", AGAINST_LABEL);
}

describe("Module 35: Machines that Act Alone", () => {
  beforeEach(() => {
    loadModule("37-machines-that-act-alone.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: wire the greenhouse", () => {
    test("shows the initial rule and locks the dial once the run starts", () => {
      const ruleBtn = document.getElementById("ruleBtn1");
      expect(ruleBtn.textContent).toMatch(/IF temperature reading > 25°C, turn the fan ON/);
      expect(ruleBtn.disabled).toBe(false);
      document.getElementById("runBtn1").click();
      expect(ruleBtn.disabled).toBe(true);
    });

    test("stepping through all eight ticks logs each reading and awards the star", () => {
      clickRunButton("runBtn1", 8);
      const ticks = document.querySelectorAll("#timeline1 .aw-tick");
      expect(ticks.length).toBe(8);
      expect(ticks[0].textContent).toMatch(/6:00/);
      expect(ticks[0].textContent).toMatch(/Fan off/);
      expect(ticks[1].textContent).toMatch(/9:00/);
      expect(ticks[1].textContent).toMatch(/Fan ON/);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
      expect(document.getElementById("note1").hidden).toBe(false);
    });
  });

  describe("discovery 2: two rules at once", () => {
    test("both dials show their starting rule", () => {
      expect(document.getElementById("ruleBtn2a").textContent).toMatch(/temperature reading > 25°C/);
      expect(document.getElementById("ruleBtn2b").textContent).toMatch(/moisture reading < 40%/);
    });

    test("stepping through all eight ticks shows both tracks interleaved and awards the star", () => {
      clickRunButton("runBtn2", 8);
      const ticks = document.querySelectorAll("#timeline2 .aw-tick-double");
      expect(ticks.length).toBe(8);
      // Fan switches on well before the valve does, at these default rules.
      expect(ticks[1].textContent).toMatch(/Fan ON/);
      expect(ticks[1].textContent).toMatch(/Valve off/);
      expect(ticks[3].textContent).toMatch(/Valve ON/);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: the feedback idea", () => {
    test("the notice button is hidden until the full run completes", () => {
      const noticeBtn = document.getElementById("noticeBtn3");
      expect(noticeBtn.hidden).toBe(true);
      clickRunButton("runBtn3", 7);
      expect(noticeBtn.hidden).toBe(true);
      document.getElementById("runBtn3").click();
      expect(noticeBtn.hidden).toBe(false);
    });

    test("at the default rule, the fan turns itself off from its own feedback, and the star only awards after 'Notice what happened'", () => {
      clickRunButton("runBtn3", 8);
      expect(isDiscoveryDone("d3")).toBe(false);
      document.getElementById("noticeBtn3").click();
      const explainNote = document.getElementById("explainNote3");
      expect(explainNote.hidden).toBe(false);
      expect(explainNote.textContent).toMatch(/21:00/);
      expect(explainNote.textContent).toMatch(/loop closing/);
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: is it a robot?", () => {
    test("sorting a machine onto the wrong pile gives a warm redirect, never wrong/incorrect", () => {
      sortItem("pool4", "bins4", "chatbot", ROBOT_LABEL);
      const status = document.getElementById("status4");
      expect(status.textContent).toMatch(/try again/i);
      expect(status.textContent).not.toMatch(/wrong|incorrect|fail/i);
      expect(isDiscoveryDone("d4")).toBe(false);
    });

    test("the dishwasher card is accepted in either pile", () => {
      sortItem("pool4", "bins4", "arm", ROBOT_LABEL);
      sortItem("pool4", "bins4", "vacuum", ROBOT_LABEL);
      sortItem("pool4", "bins4", "drone", ROBOT_LABEL);
      sortItem("pool4", "bins4", "chatbot", NOT_ROBOT_LABEL);
      sortItem("pool4", "bins4", "rc", NOT_ROBOT_LABEL);
      sortItem("pool4", "bins4", "greenhouse", NOT_ROBOT_LABEL);
      sortItem("pool4", "bins4", "dishwasher", NOT_ROBOT_LABEL);
      expect(isDiscoveryDone("d4")).toBe(true);
    });

    test("sorting all seven machines awards the star", () => {
      sortAllRobots();
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: the honest ledger", () => {
    test("the setting field and reflection line are present and never checked", () => {
      expect(document.getElementById("setting5")).toBeTruthy();
      expect(document.getElementById("reflection5")).toBeTruthy();
    });

    test("sorting a card onto the wrong pile gives a warm redirect, never wrong/incorrect", () => {
      sortItem("pool5", "bins5", "a1", AGAINST_LABEL);
      const status = document.getElementById("status5");
      expect(status.textContent).toMatch(/try again/i);
      expect(status.textContent).not.toMatch(/wrong|incorrect|fail/i);
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("sorting all eight cards awards the star", () => {
      sortAllLedger();
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("completing every discovery unlocks the reflection card with all five stars", () => {
    clickRunButton("runBtn1", 8);
    clickRunButton("runBtn2", 8);
    clickRunButton("runBtn3", 8);
    document.getElementById("noticeBtn3").click();
    sortAllRobots();
    sortAllLedger();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });

  test("the built module never mentions banned school vocabulary (house-style 'no marks were given' framing aside)", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme|6-mark|answer structure)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });

  test("never anthropomorphises the microprocessor, and never frames a robot as humanoid", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/microprocessor (decides|thinks|knows|wants)/i);
    expect(text).toMatch(/compares?.{0,40}(reading|stored value)/i);
    expect(text).not.toMatch(/human-like|humanoid|looks human/i);
  });

  test("the three robot characteristics appear verbatim (Cambridge 0478 syllabus 6.2.2)", () => {
    const text = document.body.textContent;
    expect(text).toMatch(/mechanical structure/i);
    expect(text).toMatch(/electrical components/i);
    expect(text).toMatch(/programmable/i);
  });
});
