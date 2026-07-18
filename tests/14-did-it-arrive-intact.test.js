const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// This module's D2 sorter and D3/D4 parity board are bespoke to this lesson,
// so tests drive the real markup/ids directly rather than needing new shared
// fixtures. D5's ARQ log runs on the shared `thread` kit (also used by
// Module 15's D2), but is still exercised through its own #arqLog5 markup.
function linkChip(id) {
  return document.querySelector('.link-chip[data-id="' + id + '"]');
}
function dupeBinHead(name) {
  return Array.from(document.querySelectorAll(".dupe-bin-head")).find(b => b.textContent === name);
}
function barcodeDigit(i) {
  return document.querySelectorAll(".barcode-digit")[i];
}
function byteRowBulbs(rowId) {
  return Array.from(document.querySelectorAll("#" + rowId + " .data-bulb"));
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
      jest.advanceTimersByTime(6000);

      slider.value = "100";
      sendBtn.click();
      jest.advanceTimersByTime(6000);
      jest.useRealTimers();

      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a long cable corrupts the parallel result but not the serial one", () => {
      jest.useFakeTimers();
      document.getElementById("distanceSlider1").value = "100";
      document.getElementById("sendBtn1").click();
      jest.advanceTimersByTime(6000);
      jest.useRealTimers();

      expect(document.getElementById("serialResult1").textContent).toMatch(/19 — correct, as always/);
      expect(document.getElementById("parallelResult1").textContent).toMatch(/not 19 any more/);
    });

    test("a short cable leaves both lanes correct", () => {
      jest.useFakeTimers();
      document.getElementById("distanceSlider1").value = "0";
      document.getElementById("sendBtn1").click();
      jest.advanceTimersByTime(6000);
      jest.useRealTimers();

      expect(document.getElementById("serialResult1").textContent).toMatch(/19 — correct, as always/);
      expect(document.getElementById("parallelResult1").textContent).toMatch(/19 — also correct/);
    });

    test("bulbs start greyed out as pending and clear only once received", () => {
      jest.useFakeTimers();
      document.getElementById("distanceSlider1").value = "0";
      document.getElementById("sendBtn1").click();

      const serialBulbs = Array.from(document.querySelectorAll("#serialLane1 .tx-bulb"));
      const parallelBulbs = Array.from(document.querySelectorAll("#parallelLane1 .tx-bulb"));
      expect(serialBulbs.every(b => b.classList.contains("pending"))).toBe(true);
      expect(parallelBulbs.every(b => b.classList.contains("pending"))).toBe(true);

      jest.advanceTimersByTime(6000);
      jest.useRealTimers();

      expect(serialBulbs.some(b => b.classList.contains("pending"))).toBe(false);
      expect(parallelBulbs.some(b => b.classList.contains("pending"))).toBe(false);
    });

    test("dots are labelled by bit position counted from the right (LSB = 1)", () => {
      jest.useFakeTimers();
      document.getElementById("distanceSlider1").value = "0";
      document.getElementById("sendBtn1").click();
      jest.advanceTimersByTime(6000);
      jest.useRealTimers();

      const expected = ["8", "7", "6", "5", "4", "3", "2", "1"];
      const serialLabels = Array.from(document.querySelectorAll("#serialTokens1 .wire-token text")).map(t => t.textContent);
      const parallelLabels = Array.from(document.querySelectorAll("#parallelTokens1 .wire-token text")).map(t => t.textContent);
      expect(serialLabels).toEqual(expected);
      expect(parallelLabels).toEqual(expected);
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
    test("the send button only appears once the parity bulb has been calculated", () => {
      const sendBtn = document.getElementById("sendBtn3");
      const calcBtn = document.getElementById("calcBtn3");
      const parityBulb = document.getElementById("parityBulb3");
      expect(sendBtn.hidden).toBe(true);
      expect(parityBulb.classList.contains("pending")).toBe(true);
      expect(document.getElementById("parityStatus3").textContent).toMatch(/^3 of 8 data bulbs lit — odd\. Work out the parity bulb, then send\./);

      // Before the first send, the receiver's side of the board shouldn't
      // show anything at all — including the parity bulb sitting there
      // alone with no octet beside it.
      expect(document.getElementById("byteParityBulb3").hidden).toBe(true);

      calcBtn.click();
      expect(document.getElementById("parityStatus3").textContent)
        .toMatch(/^3 of 8 data bulbs lit — odd\. To reach an even total the parity bulb has to light too — 3 \+ 1 = 4, even\. Ready to send\./);
      expect(parityBulb.classList.contains("pending")).toBe(false);
      expect(parityBulb.classList.contains("on")).toBe(true);
      expect(calcBtn.hidden).toBe(true);
      expect(sendBtn.hidden).toBe(false);
    });

    test("sending catches the gremlin's single flip and awards the star", () => {
      jest.useFakeTimers();
      document.getElementById("calcBtn3").click();
      document.getElementById("sendBtn3").click();

      expect(byteRowBulbs("byteRow3").every(b => b.classList.contains("pending"))).toBe(true);
      expect(document.getElementById("byteParityBulb3").hidden).toBe(false); // revealed the moment sending starts
      expect(document.getElementById("byteParityBulb3").classList.contains("pending")).toBe(true);

      jest.advanceTimersByTime(7500);
      jest.useRealTimers();

      const byteBulbs3 = byteRowBulbs("byteRow3");
      expect(byteBulbs3.some(b => b.classList.contains("pending"))).toBe(false);
      [2, 3, 6, 7].forEach(i => expect(byteBulbs3[i].classList.contains("on")).toBe(true));
      [0, 1, 4, 5].forEach(i => expect(byteBulbs3[i].classList.contains("on")).toBe(false));

      // The parity bulb greys out on send, same as the eight data bulbs, and
      // only returns to its real (unchanged) state once its own dot lands.
      const byteParityBulb3 = document.getElementById("byteParityBulb3");
      expect(byteParityBulb3.classList.contains("pending")).toBe(false);
      expect(byteParityBulb3.classList.contains("on")).toBe(true);

      expect(document.getElementById("byteResult3").textContent).toMatch(/Received: 4 of 8 data bulbs lit — even\. The parity bulb arrived on, making the total odd/);
      expect(document.getElementById("result3").textContent).toMatch(/you sent an even total; the receiver recounts an odd total instead — 4 of 8 data bulbs lit now, not 3, even though the parity bulb itself arrived exactly as sent/);
      expect(isDiscoveryDone("d3")).toBe(true);

      const labels = Array.from(document.querySelectorAll("#parityTokens3 .wire-token text")).map(t => t.textContent);
      expect(labels).toEqual(["8", "7", "6", "5", "4", "3", "2", "1", "9"]);

      // The parity bulb itself always arrives unchanged (on, same as sent) —
      // it's the data bulb at index 2 flipping on that tips the total from
      // even to odd, so the byte is genuinely wrong now (51, not 19) and
      // the ring withholds its green check accordingly.
      expect(document.getElementById("byteCheckRing3").classList.contains("drawing")).toBe(true);
      expect(document.getElementById("byteCheckmark3").classList.contains("show")).toBe(false);

      // The data lit-count (4, even) plus the received parity bit (1, on,
      // unchanged) doesn't come out even, so the checkbox settles on a
      // plain dash, not a tick — that dash is itself the catch.
      const checkbox3 = document.getElementById("byteParityCheck3");
      expect(checkbox3.classList.contains("shown")).toBe(true);
      expect(checkbox3.classList.contains("agree")).toBe(false);
      expect(checkbox3.classList.contains("disagree")).toBe(true);

      // The total disagrees, so the amber flag lights up — parity's own
      // (never red, never framed as a failure) way of flagging the catch —
      // and the ring itself turns the same amber, so the two read as one signal.
      expect(document.getElementById("byteFlag3").classList.contains("show")).toBe(true);
      expect(document.getElementById("byteCheckRing3").classList.contains("disagree")).toBe(true);

      // Caught, not fooled — the question mark is a different case entirely.
      expect(document.getElementById("byteQuestion3").classList.contains("show")).toBe(false);
    });

    test("the ring is drawn in amber for the whole draw, not just once the badges reveal themselves", () => {
      jest.useFakeTimers();
      document.getElementById("calcBtn3").click();
      document.getElementById("sendBtn3").click();

      // The parity bulb (bulb 9, the last to depart) lands at 9 * 700ms; the
      // ring starts drawing the instant it does, well before the badge
      // reveal delay below has elapsed.
      jest.advanceTimersByTime(6300);
      const ring3 = document.getElementById("byteCheckRing3");
      expect(ring3.classList.contains("drawing")).toBe(true);
      expect(ring3.classList.contains("disagree")).toBe(true);
      expect(document.getElementById("byteParityCheck3").classList.contains("shown")).toBe(false);
      expect(document.getElementById("byteFlag3").classList.contains("show")).toBe(false);

      jest.advanceTimersByTime(1200);
      jest.useRealTimers();
      expect(document.getElementById("byteParityCheck3").classList.contains("shown")).toBe(true);
      expect(document.getElementById("byteFlag3").classList.contains("show")).toBe(true);
    });
  });

  describe("discovery 4: the gremlin flips two", () => {
    test("sending is fooled by two flips — count stays even — and this is framed as a discovery, not a failure", () => {
      expect(document.getElementById("byteParityBulb4").hidden).toBe(true); // nothing shows on the receiver's side before the first send

      jest.useFakeTimers();
      document.getElementById("calcBtn4").click();
      document.getElementById("sendBtn4").click();
      jest.advanceTimersByTime(7500);
      jest.useRealTimers();

      const byteBulbs4 = byteRowBulbs("byteRow4");
      [2, 6, 7].forEach(i => expect(byteBulbs4[i].classList.contains("on")).toBe(true));
      [0, 1, 3, 4, 5].forEach(i => expect(byteBulbs4[i].classList.contains("on")).toBe(false));

      const byteParityBulb4 = document.getElementById("byteParityBulb4");
      expect(byteParityBulb4.classList.contains("pending")).toBe(false);
      expect(byteParityBulb4.classList.contains("on")).toBe(true);

      expect(document.getElementById("byteResult4").textContent).toMatch(/Received: 3 of 8 data bulbs lit — odd\. The parity bulb arrived on, making the total even/);

      const text = document.getElementById("result4").textContent;
      expect(text).toMatch(/you sent an even total; the receiver still recounts an even total — 3 of 8 data bulbs lit, same as you sent, and the parity bulb arrived exactly as sent too/);
      expect(text).not.toMatch(/wrong answer|error count|incorrect/i);
      expect(isDiscoveryDone("d4")).toBe(true);

      // The pen still circles the row — the receiver still checks it — but
      // no green check appears, because the byte it circled is genuinely wrong.
      expect(document.getElementById("byteCheckRing4").classList.contains("drawing")).toBe(true);
      expect(document.getElementById("byteCheckmark4").classList.contains("show")).toBe(false);

      // The data lit-count (4, even) plus the received parity bit (0) does
      // come out even, so the checkbox ticks — even though the byte itself
      // is wrong. The checkbox and the ring's own check disagree on purpose:
      // they're answering two different questions.
      const checkbox4 = document.getElementById("byteParityCheck4");
      expect(checkbox4.classList.contains("shown")).toBe(true);
      expect(checkbox4.classList.contains("agree")).toBe(true);
      expect(checkbox4.classList.contains("disagree")).toBe(false);

      // The total agrees — parity is genuinely fooled here — so the amber
      // flag stays dark and the ring stays its normal teal, same as the
      // ring's green check staying dark too.
      expect(document.getElementById("byteFlag4").classList.contains("show")).toBe(false);
      expect(document.getElementById("byteCheckRing4").classList.contains("disagree")).toBe(false);

      // Agrees, but the byte is genuinely wrong (35, not 19) — the fooled
      // case — so the amber question mark takes the flag's corner instead.
      expect(document.getElementById("byteQuestion4").classList.contains("show")).toBe(true);
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
      const lines = Array.from(document.querySelectorAll("#arqLog5 .thread-line"));
      const ackLine = lines.find(l => l.textContent.includes("positive acknowledgement"));
      expect(ackLine.classList.contains("right")).toBe(true);
    });

    test("consecutive messages from the same side share one role label, like a real chat thread", () => {
      jest.useFakeTimers();
      document.getElementById("cleanBtn5").click();
      jest.advanceTimersByTime(2000);
      jest.useRealTimers();

      // sender, receiver, receiver, sender — the receiver's two consecutive
      // turns share a single label instead of repeating it.
      const roles = Array.from(document.querySelectorAll("#arqLog5 .thread-role")).map(r => r.textContent);
      expect(roles).toEqual(["Sender", "Receiver", "Sender"]);
    });

    test("the lost acknowledgement renders as a centred system note, not a message from either side", () => {
      jest.useFakeTimers();
      document.getElementById("lostAckBtn5").click();
      jest.advanceTimersByTime(4000);
      jest.useRealTimers();

      const note = Array.from(document.querySelectorAll("#arqLog5 .thread-system")).find(n => n.textContent.includes("never arrives"));
      expect(note).toBeTruthy();
      expect(note.classList.contains("left")).toBe(false);
      expect(note.classList.contains("right")).toBe(false);

      // 8 scripted steps, one of which is the system note above rather than a bubble.
      expect(document.querySelectorAll("#arqLog5 .thread-line").length).toBe(7);
    });
  });

  describe("discovery 6: the last digit isn't part of the number", () => {
    function computedDigit6() {
      const digits = document.querySelectorAll(".barcode-digit");
      return digits[digits.length - 1];
    }
    function barcodeFlag6() {
      return document.querySelector(".barcode-flag");
    }

    test("as printed, the check digit matches", () => {
      expect(document.getElementById("checkStatus6").textContent).toMatch(/^Matches the printed check digit/);
    });

    test("the printed barcode's thirteen real digits sit inside their own boxed group, separate from the computed tile", () => {
      const realGroup = document.querySelector(".barcode-real");
      expect(realGroup).toBeTruthy();
      expect(realGroup.querySelectorAll(".barcode-digit").length).toBe(13); // 12 product digits + the printed check digit
      expect(realGroup.contains(computedDigit6())).toBe(false); // the computed tile lives outside the box
    });

    test("the computed check digit is shown as its own tile, not just buried in the text below", () => {
      const computed = computedDigit6();
      expect(computed.classList.contains("computed")).toBe(true);
      // As printed, the computed and printed check digits are the same value (5).
      expect(computed.textContent).toBe("5");
      expect(computed.classList.contains("match")).toBe(true);
      expect(computed.classList.contains("mismatch")).toBe(false);

      barcodeDigit(0).click();
      expect(computed.classList.contains("match")).toBe(false);
      expect(computed.classList.contains("mismatch")).toBe(true);
    });

    test("a disagreeing check digit lights up an amber flag, same badge language as D3/D4", () => {
      const flag = barcodeFlag6();
      expect(flag.classList.contains("show")).toBe(false);

      barcodeDigit(0).click();
      expect(flag.classList.contains("show")).toBe(true);

      document.getElementById("resetBtn6").click();
      expect(flag.classList.contains("show")).toBe(false);
    });

    test("corrupting an early digit breaks the match and progresses toward the star", () => {
      barcodeDigit(0).click();
      expect(document.getElementById("checkStatus6").textContent).toMatch(/^Does NOT match/);
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
      expect(document.getElementById("checkStatus6").textContent).toMatch(/^Matches the printed check digit/);
      expect(barcodeDigit(0).classList.contains("changed")).toBe(false);
      expect(computedDigit6().classList.contains("match")).toBe(true);
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
    jest.advanceTimersByTime(6000);
    document.getElementById("distanceSlider1").value = "100";
    document.getElementById("sendBtn1").click();
    jest.advanceTimersByTime(6000);
    jest.useRealTimers();

    // D2
    const answers2 = { l1: "Simplex", l2: "Simplex", l3: "Half-duplex", l4: "Half-duplex", l5: "Full-duplex", l6: "Full-duplex" };
    Object.keys(answers2).forEach(id => {
      linkChip(id).click();
      dupeBinHead(answers2[id]).click();
    });

    // D3
    jest.useFakeTimers();
    document.getElementById("calcBtn3").click();
    document.getElementById("sendBtn3").click();
    jest.advanceTimersByTime(7500);
    jest.useRealTimers();

    // D4
    jest.useFakeTimers();
    document.getElementById("calcBtn4").click();
    document.getElementById("sendBtn4").click();
    jest.advanceTimersByTime(7500);
    jest.useRealTimers();

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
