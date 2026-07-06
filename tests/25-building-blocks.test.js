const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function callD1(name) {
  document.getElementById("nameInput1").value = name;
  document.getElementById("callBtn1").click();
}

describe("Module 25: Building Blocks", () => {
  beforeEach(() => {
    loadModule("25-building-blocks.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: build a machine", () => {
    test("shows the Greet procedure definition with one hopper", () => {
      expect(document.getElementById("code1").textContent).toMatch(/PROCEDURE/);
      expect(document.getElementById("code1").textContent).toMatch(/Greet/);
      expect(document.querySelectorAll(".bb-hopper").length).toBe(1);
    });

    test("calling with an empty name is a gentle nudge, not a failure state", () => {
      document.getElementById("nameInput1").value = "";
      document.getElementById("callBtn1").click();
      expect(document.querySelectorAll("#conveyor1 .bb-conveyor-line").length).toBe(0);
    });

    test("calling with one name appends a conveyor line but doesn't award the star yet", () => {
      callD1("Amir");
      expect(document.querySelectorAll("#conveyor1 .bb-conveyor-line").length).toBe(1);
      expect(document.getElementById("conveyor1").textContent).toMatch(/CALL Greet/);
      expect(document.getElementById("conveyor1").textContent).toMatch(/Hello, Amir!/);
      expect(isDiscoveryDone("d1")).toBe(false);
    });

    test("calling with three different names awards the star", () => {
      callD1("Amir");
      callD1("Priya");
      callD1("Mei Ling");
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("repeating the same name twice does not count as a second distinct call", () => {
      callD1("Amir");
      callD1("Amir");
      callD1("Priya");
      expect(isDiscoveryDone("d1")).toBe(false);
      callD1("Mei Ling");
      expect(isDiscoveryDone("d1")).toBe(true);
    });
  });

  describe("discovery 2: the output chute", () => {
    test("calling the procedure outputs directly and hides the chute", () => {
      document.getElementById("callProc2").click();
      expect(document.getElementById("status2a").textContent).toMatch(/Hello,/);
      expect(document.getElementById("chuteRow2").style.display).toBe("none");
    });

    test("calling the function reveals a returned value sitting on the conveyor, unused", () => {
      document.getElementById("nameInput2").value = "Farah";
      document.getElementById("callFunc2").click();
      expect(document.getElementById("status2a").textContent).toMatch(/RETURN/);
      expect(document.getElementById("chuteRow2").style.display).not.toBe("none");
      expect(document.getElementById("chuteVal2").textContent).toMatch(/"F"/);
    });

    test("using the returned value, then discarding it, awards the star with calm (not error) framing", () => {
      document.getElementById("nameInput2").value = "Farah";
      document.getElementById("callFunc2").click();
      document.getElementById("useReturn2").click();
      expect(document.getElementById("status2b").textContent).toMatch(/printed/);
      expect(isDiscoveryDone("d2")).toBe(false);
      document.getElementById("callFunc2").click();
      document.getElementById("discardReturn2").click();
      const msg = document.getElementById("status2b").textContent;
      expect(msg).not.toMatch(/error|wrong|mistake/i);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: hoppers in order", () => {
    test("calling with hoppers as they start produces a sensible sentence", () => {
      document.getElementById("callBtn3").click();
      expect(document.getElementById("status3").textContent).toMatch(/Priya works as a chef/);
    });

    test("swapping the hoppers then calling again produces the polite chaos, with warm (not error) framing", () => {
      document.getElementById("callBtn3").click();
      document.getElementById("swapBtn3").click();
      document.getElementById("callBtn3").click();
      const msg = document.getElementById("status3").textContent;
      expect(msg).toMatch(/a chef works as Priya/);
      expect(msg).not.toMatch(/error|wrong|mistake|incorrect/i);
    });

    test("calling both in original order and after a swap awards the star", () => {
      document.getElementById("callBtn3").click();
      document.getElementById("swapBtn3").click();
      document.getElementById("callBtn3").click();
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the glass case", () => {
    test("starting the machine shows Local born inside the glass case", () => {
      document.getElementById("startBtn4").click();
      expect(document.getElementById("caseVal4").textContent).toMatch(/Local/);
      expect(document.getElementById("case4").classList.contains("bb-case-live")).toBe(true);
    });

    test("stopping the machine empties the glass case and bumps the global factory count", () => {
      document.getElementById("startBtn4").click();
      document.getElementById("stopBtn4").click();
      expect(document.getElementById("caseVal4").textContent).toMatch(/empty/);
      expect(document.getElementById("factoryVal4").textContent).toBe("1");
    });

    test("trying to read Local from the factory floor is a calm reveal, never an error", () => {
      document.getElementById("readBtn4").click();
      const msg = document.getElementById("status4b").textContent;
      expect(msg).toMatch(/no Local out here/);
      expect(msg).not.toMatch(/error|undefined|null|NaN/i);
    });

    test("starting, stopping, and trying to read Local awards the star", () => {
      document.getElementById("startBtn4").click();
      document.getElementById("stopBtn4").click();
      document.getElementById("readBtn4").click();
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: spot the difference", () => {
    test("shows six blueprints and two piles", () => {
      expect(document.querySelectorAll("#pool5 .bb-blueprint").length).toBe(6);
      expect(document.querySelectorAll("#piles5 .bb-pile").length).toBe(2);
    });

    test("sorting a blueprint onto the wrong pile bounces back with a warm redirect, not a failure state", () => {
      const firstCard = document.querySelector("#pool5 .bb-blueprint[data-id='b1']"); // Procedure
      firstCard.click();
      const functionPileHead = Array.from(document.querySelectorAll(".bb-pile-head")).find(h => h.textContent.match(/Function/));
      functionPileHead.click();
      expect(firstCard.classList.contains("placed")).toBe(false);
      expect(document.getElementById("toast").textContent).toMatch(/Not that pile/i);
      expect(document.getElementById("status5").textContent).toMatch(/try again/i);
    });

    test("sorting all six blueprints onto their correct piles awards the star", () => {
      const pileHead = name => Array.from(document.querySelectorAll(".bb-pile-head")).find(h => h.textContent.match(name));
      const answers = { b1: /Procedure/, b2: /Function/, b3: /Procedure/, b4: /Function/, b5: /Procedure/, b6: /Function/ };
      Object.keys(answers).forEach(id => {
        document.querySelector("#pool5 .bb-blueprint[data-id='" + id + "']").click();
        pileHead(answers[id]).click();
      });
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

  test("the built module never mentions banned school vocabulary", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bcorrect\b|\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    callD1("Amir"); callD1("Priya"); callD1("Mei Ling");
    // D2
    document.getElementById("nameInput2").value = "Farah";
    document.getElementById("callFunc2").click();
    document.getElementById("useReturn2").click();
    document.getElementById("callFunc2").click();
    document.getElementById("discardReturn2").click();
    // D3
    document.getElementById("callBtn3").click();
    document.getElementById("swapBtn3").click();
    document.getElementById("callBtn3").click();
    // D4
    document.getElementById("startBtn4").click();
    document.getElementById("stopBtn4").click();
    document.getElementById("readBtn4").click();
    // D5
    const pileHead = name => Array.from(document.querySelectorAll(".bb-pile-head")).find(h => h.textContent.match(name));
    const answers = { b1: /Procedure/, b2: /Function/, b3: /Procedure/, b4: /Function/, b5: /Procedure/, b6: /Function/ };
    Object.keys(answers).forEach(id => {
      document.querySelector("#pool5 .bb-blueprint[data-id='" + id + "']").click();
      pileHead(answers[id]).click();
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
