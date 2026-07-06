const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function chipFor(n) {
  return document.querySelector('#gtBank1 .gt-chip[data-eng="' + n + '"]');
}
function slotFor(n) {
  return document.querySelector('#gtSlots1 .gt-slot[data-line="' + n + '"]');
}
function predictBtn(label) {
  return Array.from(document.querySelectorAll("#predictRow2 .predict-btn")).find(b => b.textContent === label);
}
function nextBtn() {
  return document.querySelector("#nextRow2 .loop-btn");
}

describe("Module 24: Gatekeepers", () => {
  beforeEach(() => {
    loadModule("24-gatekeepers.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: equip the gate", () => {
    test("shows five slots and five shuffled description chips", () => {
      expect(document.querySelectorAll("#gtSlots1 .gt-slot").length).toBe(5);
      expect(document.querySelectorAll("#gtBank1 .gt-chip").length).toBe(5);
    });

    test("matching a description to the wrong check leaves it quiet, with a warm redirect, not a failure state", () => {
      const wrongSlot = slotFor(4); // "Format check" slot
      chipFor(0).click(); // "Presence check" description
      wrongSlot.click();
      expect(wrongSlot.classList.contains("filled")).toBe(false);
      expect(document.getElementById("status1").textContent).toMatch(/belongs to a different check/i);
    });

    test("matching all five checks to their descriptions awards the star", () => {
      for (let i = 0; i < 5; i++) {
        chipFor(i).click();
        slotFor(i).click();
      }
      expect(document.querySelectorAll("#gtSlots1 .gt-slot.filled").length).toBe(5);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: release the queue", () => {
    test("starts on entry 1 of 6, showing the blank entry", () => {
      expect(document.getElementById("queuePos2").textContent).toBe("1");
      expect(document.getElementById("queueVal2").textContent).toMatch(/left blank/);
    });

    test("predicting an entry reveals the gate's actual verdict without judging the guess", () => {
      predictBtn("My call: Admit").click();
      const status = document.getElementById("status2").textContent;
      expect(status).toMatch(/Presence check holds it/);
      expect(status).not.toMatch(/correct|incorrect|wrong guess/i);
    });

    test("stepping through all six entries awards the star", () => {
      for (let i = 0; i < 6; i++) {
        const admit = predictBtn("My call: Admit");
        admit.click();
        nextBtn().click();
      }
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: valid ≠ true", () => {
    test("running the gate's checks on Age 21 shows every check passing", () => {
      document.getElementById("validateBtn3").click();
      expect(document.getElementById("status3a").textContent).toMatch(/Admitted/);
      expect(document.getElementById("meetBtn3").style.display).not.toBe("none");
    });

    test("meeting the applicant reveals the gap validation can't close, then seeing both verification methods awards the star", () => {
      document.getElementById("validateBtn3").click();
      document.getElementById("meetBtn3").click();
      expect(document.getElementById("status3b").textContent).toMatch(/12, not 21/);
      const doubleBtn = Array.from(document.querySelectorAll("#verifyRow3 .loop-btn")).find(b => b.textContent.match(/double entry/));
      const visualBtn = Array.from(document.querySelectorAll("#verifyRow3 .loop-btn")).find(b => b.textContent.match(/visual check/));
      doubleBtn.click();
      expect(isDiscoveryDone("d3")).toBe(false);
      visualBtn.click();
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the saboteur's kit", () => {
    function probe(value) {
      document.getElementById("probeInput4").value = value;
      document.getElementById("probeBtn4").click();
    }

    test("classifies 45 as normal, 100 as extreme, 101 as boundary, and text as abnormal", () => {
      probe("45");
      expect(document.getElementById("status4").textContent).toMatch(/normal data/);
      probe("100");
      expect(document.getElementById("status4").textContent).toMatch(/extreme data/);
      probe("101");
      expect(document.getElementById("status4").textContent).toMatch(/boundary data/);
      probe("twenty");
      expect(document.getElementById("status4").textContent).toMatch(/abnormal data/);
    });

    test("crafting all four categories awards the star", () => {
      probe("45"); probe("1"); probe("0"); probe("twenty");
      expect(document.querySelectorAll("#chips4 .chip.hit").length).toBe(4);
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: the sixth check, revisited", () => {
    test("shows thirteen digits, printed check digit matching to start", () => {
      expect(document.querySelectorAll("#barcodeDigits5 .barcode-digit").length).toBe(13);
      expect(document.getElementById("checkStatus5").textContent).toMatch(/matches the printed check digit/);
    });

    test("corrupting an early and a late digit awards the star", () => {
      const digits = document.querySelectorAll("#barcodeDigits5 .barcode-digit:not(.check)");
      digits[0].click();
      expect(document.getElementById("checkStatus5").textContent).toMatch(/does NOT match/);
      document.getElementById("resetBtn5").click();
      digits[11].click();
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

  test("the built module never mentions banned school vocabulary, aside from the deliberate 'test data' carve-out", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/mark scheme/i);
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bcorrect\b|\bincorrect\b/i);
    // "test" and its relatives appear only as Cambridge's technical term
    // ("test data") or as an ordinary English verb ("tested") — never in a
    // school-assessment sense like "pass the test" or "you failed".
    expect(text).not.toMatch(/pass(ed|ing)? the test|failed the test|you (failed|passed)|your score/i);
    expect(text).toMatch(/test data/i);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    for (let i = 0; i < 5; i++) { chipFor(i).click(); slotFor(i).click(); }
    // D2
    for (let i = 0; i < 6; i++) { predictBtn("My call: Admit").click(); nextBtn().click(); }
    // D3
    document.getElementById("validateBtn3").click();
    document.getElementById("meetBtn3").click();
    Array.from(document.querySelectorAll("#verifyRow3 .loop-btn")).forEach(b => b.click());
    // D4
    document.getElementById("probeInput4").value = "45";
    document.getElementById("probeBtn4").click();
    document.getElementById("probeInput4").value = "1";
    document.getElementById("probeBtn4").click();
    document.getElementById("probeInput4").value = "0";
    document.getElementById("probeBtn4").click();
    document.getElementById("probeInput4").value = "twenty";
    document.getElementById("probeBtn4").click();
    // D5
    const digits = document.querySelectorAll("#barcodeDigits5 .barcode-digit:not(.check)");
    digits[0].click();
    document.getElementById("resetBtn5").click();
    digits[11].click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
