const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// This module's D2 sorter, D3/D4 parity board and D5 ARQ log are bespoke to
// this lesson, so tests drive the real markup/ids directly rather than
// needing new shared fixtures.
function linkChip(id) {
  return document.querySelector('.link-chip[data-id="' + id + '"]');
}
function dupeBinHead(name) {
  return Array.from(document.querySelectorAll(".dupe-bin-head")).find(b => b.textContent === name);
}
function barcodeDigit(i) {
  return document.querySelectorAll(".barcode-digit")[i];
}

describe("Module 14: Did It Arrive Intact?", () => {
  beforeEach(() => {
    loadModule("14-did-it-arrive-intact.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: one lane or eight", () => {
    test("sending at a short and a long cable length awards the star", () => {
      jest.useFakeTimers();
      const slider = document.getElementById("distanceSlider1");
      const sendBtn = document.getElementById("sendBtn1");

      slider.value = "0";
      sendBtn.click();
      jest.advanceTimersByTime(1600);

      slider.value = "100";
      sendBtn.click();
      jest.advanceTimersByTime(1600);
      jest.useRealTimers();

      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a long cable corrupts the parallel result but not the serial one", () => {
      jest.useFakeTimers();
      document.getElementById("distanceSlider1").value = "100";
      document.getElementById("sendBtn1").click();
      jest.advanceTimersByTime(1600);
      jest.useRealTimers();

      expect(document.getElementById("serialResult1").textContent).toMatch(/= 19 — correct, as always/);
      expect(document.getElementById("parallelResult1").textContent).toMatch(/not 19 any more/);
    });

    test("a short cable leaves both lanes correct", () => {
      jest.useFakeTimers();
      document.getElementById("distanceSlider1").value = "0";
      document.getElementById("sendBtn1").click();
      jest.advanceTimersByTime(1600);
      jest.useRealTimers();

      expect(document.getElementById("serialResult1").textContent).toMatch(/= 19 — correct, as always/);
      expect(document.getElementById("parallelResult1").textContent).toMatch(/= 19 — also correct/);
    });
  });

  describe("discovery 2: walkie-talkie, corridor, phone call", () => {
    test("sorting all six links into their duplex bins awards the star", () => {
      const answers = { l1: "Simplex", l2: "Simplex", l3: "Half-duplex", l4: "Half-duplex", l5: "Full-duplex", l6: "Full-duplex" };
      Object.keys(answers).forEach(id => {
        linkChip(id).click();
        dupeBinHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(document.querySelectorAll(".dupe-bin-item").length).toBe(6);
    });

    test("a mismatched bin pick gives a warm redirect, never an error, and does not award a star", () => {
      linkChip("l1").click(); // l1 is Simplex
      dupeBinHead("Full-duplex").click(); // wrong bin on purpose
      expect(isDiscoveryDone("d2")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that bin/);
      expect(linkChip("l1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 3: the parity trick", () => {
    test("the send button is hidden until the parity bulb makes the count even", () => {
      const sendBtn = document.getElementById("sendBtn3");
      expect(sendBtn.hidden).toBe(true);
      expect(document.getElementById("parityStatus3").textContent).toMatch(/^3 of 9 lit — odd/);

      const parityBtn = document.querySelector("#parityRow3 .bit");
      parityBtn.click();
      expect(document.getElementById("parityStatus3").textContent).toMatch(/^4 of 9 lit — even/);
      expect(sendBtn.hidden).toBe(false);
    });

    test("sending catches the gremlin's single flip and awards the star", () => {
      document.querySelector("#parityRow3 .bit").click();
      document.getElementById("sendBtn3").click();
      expect(document.getElementById("result3").textContent).toMatch(/receiver counts 3 bulbs lit — odd/);
      expect(isDiscoveryDone("d3")).toBe(true);
    });
  });

  describe("discovery 4: the gremlin flips two", () => {
    test("sending is fooled by two flips — count stays even — and this is framed as a discovery, not a failure", () => {
      document.querySelector("#parityRow4 .bit").click();
      document.getElementById("sendBtn4").click();
      const text = document.getElementById("result4").textContent;
      expect(text).toMatch(/receiver counts 4 bulbs lit — still even/);
      expect(text).not.toMatch(/wrong answer|error count|incorrect/i);
      expect(isDiscoveryDone("d4")).toBe(true);
    });
  });

  describe("discovery 5: ask again", () => {
    test("playing out all three ARQ scenarios awards the star", () => {
      jest.useFakeTimers();
      document.getElementById("cleanBtn5").click();
      jest.advanceTimersByTime(2000);
      document.getElementById("damagedBtn5").click();
      jest.advanceTimersByTime(3500);
      document.getElementById("lostAckBtn5").click();
      jest.advanceTimersByTime(4000);
      jest.useRealTimers();

      expect(isDiscoveryDone("d5")).toBe(true);
    });

    test("the receiver always sends the acknowledgement, never the sender", () => {
      jest.useFakeTimers();
      document.getElementById("cleanBtn5").click();
      jest.advanceTimersByTime(2000);
      jest.useRealTimers();
      const lines = Array.from(document.querySelectorAll("#arqLog5 .arq-line"));
      const ackLine = lines.find(l => l.textContent.includes("positive acknowledgement"));
      expect(ackLine.classList.contains("receiver")).toBe(true);
    });
  });

  describe("discovery 6: the last digit isn't part of the number", () => {
    test("as printed, the check digit matches", () => {
      expect(document.getElementById("checkStatus6").textContent).toMatch(/matches the printed check digit/);
    });

    test("corrupting an early digit breaks the match and progresses toward the star", () => {
      barcodeDigit(0).click();
      expect(document.getElementById("checkStatus6").textContent).toMatch(/does NOT match/);
      expect(isDiscoveryDone("d6")).toBe(false);
    });

    test("corrupting an early digit then a later digit awards the star", () => {
      barcodeDigit(0).click(); // early
      barcodeDigit(9).click(); // late
      expect(isDiscoveryDone("d6")).toBe(true);
    });

    test("resetting restores the original barcode", () => {
      barcodeDigit(0).click();
      document.getElementById("resetBtn6").click();
      expect(document.getElementById("checkStatus6").textContent).toMatch(/matches the printed check digit/);
      expect(barcodeDigit(0).classList.contains("changed")).toBe(false);
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      // Rung 0 must be visible without clicking any other nudge first.
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("all six discoveries unlock the reflection card", () => {
    // D1
    jest.useFakeTimers();
    document.getElementById("distanceSlider1").value = "0";
    document.getElementById("sendBtn1").click();
    jest.advanceTimersByTime(1600);
    document.getElementById("distanceSlider1").value = "100";
    document.getElementById("sendBtn1").click();
    jest.advanceTimersByTime(1600);
    jest.useRealTimers();

    // D2
    const answers2 = { l1: "Simplex", l2: "Simplex", l3: "Half-duplex", l4: "Half-duplex", l5: "Full-duplex", l6: "Full-duplex" };
    Object.keys(answers2).forEach(id => {
      linkChip(id).click();
      dupeBinHead(answers2[id]).click();
    });

    // D3
    document.querySelector("#parityRow3 .bit").click();
    document.getElementById("sendBtn3").click();

    // D4
    document.querySelector("#parityRow4 .bit").click();
    document.getElementById("sendBtn4").click();

    // D5
    jest.useFakeTimers();
    document.getElementById("cleanBtn5").click();
    jest.advanceTimersByTime(2000);
    document.getElementById("damagedBtn5").click();
    jest.advanceTimersByTime(3500);
    document.getElementById("lostAckBtn5").click();
    jest.advanceTimersByTime(4000);
    jest.useRealTimers();

    // D6
    barcodeDigit(0).click();
    barcodeDigit(9).click();

    expect(starCount()).toBe("✦ 6");
    expect(reflectVisible()).toBe(true);
  });
});
