const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// This module's D1/D5 sorters and D2/D3/D4 shredder-and-lanes engine are all
// bespoke to this lesson, so tests drive the real markup/ids directly rather
// than needing new shared fixtures.
function fragChip(id) {
  return document.querySelector('.frag-chip[data-id="' + id + '"]');
}
function labelBinHead(name) {
  return Array.from(document.querySelectorAll(".label-bin-head")).find(b => b.textContent === name);
}
function reasonChip(id) {
  return document.querySelector('.reason-chip[data-id="' + id + '"]');
}
function binHead(name) {
  return Array.from(document.querySelectorAll(".bin-head")).find(b => b.textContent === name);
}

describe("Module 13: The Journey of a Message", () => {
  beforeEach(() => {
    loadModule("13-the-journey-of-a-message.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: packet anatomy", () => {
    test("matching all three fragments to their labels awards the star", () => {
      fragChip("f1").click(); labelBinHead("Header").click();
      fragChip("f2").click(); labelBinHead("Payload").click();
      fragChip("f3").click(); labelBinHead("Trailer").click();
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched label gives a warm redirect, never an error, and does not award a star", () => {
      fragChip("f1").click(); // f1 is Header
      labelBinHead("Payload").click(); // wrong bin on purpose
      expect(isDiscoveryDone("d1")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that label/);
      expect(fragChip("f1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 2: release the packets", () => {
    test("shredding the default message shows one packet card per chunk", () => {
      document.getElementById("shredBtn2").click();
      // "PHOTO INCOMING" (14 chars) in chunks of 4 -> 4 packets
      expect(document.querySelectorAll("#tray2 .packet-card").length).toBe(4);
      expect(document.getElementById("releaseBtn2").hidden).toBe(false);
    });

    test("releasing the packets reassembles the message and awards the star", () => {
      jest.useFakeTimers();
      document.getElementById("shredBtn2").click();
      document.getElementById("releaseBtn2").click();
      jest.advanceTimersByTime(2100); // 4 packets, last staggered at 4 * 500ms
      jest.useRealTimers();
      expect(document.getElementById("reassembled2").textContent).toBe("Message so far: PHOTO INCOMING");
      expect(isDiscoveryDone("d2")).toBe(true);
    });

    test("an empty message gives a gentle nudge instead of shredding", () => {
      const input = document.getElementById("msgInput2");
      input.value = "   ";
      document.getElementById("shredBtn2").click();
      expect(document.getElementById("toast").innerHTML).toMatch(/Type a short message first/);
      expect(document.querySelectorAll("#tray2 .packet-card").length).toBe(0);
    });
  });

  describe("discovery 3: out of order on purpose", () => {
    test("sending at low congestion then high congestion awards the star", () => {
      jest.useFakeTimers();
      const slider = document.getElementById("congestionSlider3");
      const sendBtn = document.getElementById("sendBtn3");

      slider.value = "0";
      sendBtn.click();
      jest.advanceTimersByTime(800);

      slider.value = "100";
      sendBtn.click();
      jest.advanceTimersByTime(2800);
      jest.useRealTimers();

      expect(isDiscoveryDone("d3")).toBe(true);
      expect(document.getElementById("reassembled3").textContent).toBe("Message so far: CALL ME SOON");
    });

    test("high congestion scrambles the arrival order but not the reassembled message", () => {
      jest.useFakeTimers();
      const slider = document.getElementById("congestionSlider3");
      slider.value = "100";
      document.getElementById("sendBtn3").click();
      jest.advanceTimersByTime(2800);
      jest.useRealTimers();
      expect(document.getElementById("arrivalLog3").textContent).toBe("Arrival order: #1, #3, #2");
      expect(document.getElementById("reassembled3").textContent).toBe("Message so far: CALL ME SOON");
    });
  });

  describe("discovery 4: a packet goes missing", () => {
    test("sending with nothing dropped does not yet award the star", () => {
      jest.useFakeTimers();
      document.getElementById("sendBtn4").click();
      jest.advanceTimersByTime(1500);
      jest.useRealTimers();
      expect(isDiscoveryDone("d4")).toBe(false);
      expect(document.getElementById("resendBtn4").hidden).toBe(true);
    });

    test("dropping packet 2, noticing the gap, and resending it awards the star", () => {
      jest.useFakeTimers();
      const dropToggle = document.getElementById("dropToggle4");
      dropToggle.click();
      expect(dropToggle.getAttribute("aria-pressed")).toBe("true");

      document.getElementById("sendBtn4").click();
      jest.advanceTimersByTime(1500);
      jest.useRealTimers();

      expect(document.getElementById("gapNote4").textContent).toMatch(/Packet 2 of 3 never showed up/);
      expect(document.getElementById("resendBtn4").hidden).toBe(false);

      document.getElementById("resendBtn4").click();
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(document.getElementById("gapNote4").textContent).toMatch(/message is whole/);
    });
  });

  describe("discovery 5: why bother?", () => {
    test("sorting all four statements into their bins awards the star", () => {
      const answers = { r1: "Benefit", r2: "Benefit", r3: "Drawback", r4: "Drawback" };
      Object.keys(answers).forEach(id => {
        reasonChip(id).click();
        binHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(document.querySelectorAll(".bin-item").length).toBe(4);
    });

    test("a mismatched bin pick gives a warm redirect and does not award a star", () => {
      reasonChip("r1").click(); // r1 is Benefit
      binHead("Drawback").click(); // wrong bin on purpose
      expect(isDiscoveryDone("d5")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that bin/);
      expect(reasonChip("r1").classList.contains("placed")).toBe(false);
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
    fragChip("f1").click(); labelBinHead("Header").click();
    fragChip("f2").click(); labelBinHead("Payload").click();
    fragChip("f3").click(); labelBinHead("Trailer").click();

    // D2
    jest.useFakeTimers();
    document.getElementById("shredBtn2").click();
    document.getElementById("releaseBtn2").click();
    jest.advanceTimersByTime(2100);
    jest.useRealTimers();

    // D3
    jest.useFakeTimers();
    const slider = document.getElementById("congestionSlider3");
    slider.value = "0";
    document.getElementById("sendBtn3").click();
    jest.advanceTimersByTime(800);
    slider.value = "100";
    document.getElementById("sendBtn3").click();
    jest.advanceTimersByTime(2800);
    jest.useRealTimers();

    // D4
    jest.useFakeTimers();
    document.getElementById("dropToggle4").click();
    document.getElementById("sendBtn4").click();
    jest.advanceTimersByTime(1500);
    jest.useRealTimers();
    document.getElementById("resendBtn4").click();

    // D5
    const answers5 = { r1: "Benefit", r2: "Benefit", r3: "Drawback", r4: "Drawback" };
    Object.keys(answers5).forEach(id => {
      reasonChip(id).click();
      binHead(answers5[id]).click();
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
