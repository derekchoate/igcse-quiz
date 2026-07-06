const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function setValue(el, value) {
  el.value = value;
  el.dispatchEvent(new Event("input"));
}

function tileAt(containerId, pos) {
  return document.querySelector('#' + containerId + ' .wtile[data-pos="' + pos + '"]');
}

describe("Module 21: Words Under the Microscope", () => {
  beforeEach(() => {
    loadModule("21-words-under-the-microscope.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: measure it", () => {
    test("an empty box falls back to a friendly placeholder word", () => {
      expect(document.getElementById("msReadout1").textContent).toMatch(/Explorer/);
      expect(document.getElementById("msReadout1").textContent).toMatch(/= 8/);
    });

    test("typing a word renders one tile per character, including a space, and LENGTH counts it", () => {
      setValue(document.getElementById("msWord1"), "Ice Cream");
      expect(document.querySelectorAll("#msTiles1 .wtile").length).toBe(9);
      expect(document.querySelectorAll("#msTiles1 .wtile-space").length).toBe(1);
      expect(document.getElementById("msReadout1").textContent).toMatch(/= 9/);
    });

    test("measuring a word with a space collects both chips and awards the star", () => {
      setValue(document.getElementById("msWord1"), "Ice Cream");
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a single word with no space only ever collects the measure chip", () => {
      setValue(document.getElementById("msWord1"), "Explorer");
      expect(isDiscoveryDone("d1")).toBe(false);
    });
  });

  describe("discovery 2: the sliding bracket", () => {
    test("tapping one tile plants the start; the bracket is incomplete until a second tap stretches it", () => {
      tileAt("sbTiles2", 3).click();
      expect(document.getElementById("sbCode2").textContent).toMatch(/\?/);
      expect(document.getElementById("sbStatus2").textContent).toMatch(/second tile/);
    });

    test("tapping a second tile completes SUBSTRING(word, start, length) regardless of tap order", () => {
      tileAt("sbTiles2", 6).click(); // end tapped first
      tileAt("sbTiles2", 3).click(); // start tapped second
      expect(document.getElementById("sbCode2").textContent).toMatch(/SUBSTRING\("COMPUTER", 3, 4\)/);
      expect(document.getElementById("sbCode2").textContent).toMatch(/"MPUT"/);
    });

    test("clearing the bracket resets it with no penalty", () => {
      tileAt("sbTiles2", 3).click();
      tileAt("sbTiles2", 6).click();
      document.getElementById("sbClear2").click();
      expect(document.getElementById("sbStatus2").textContent).toMatch(/Tap any tile to begin/);
    });

    test("grabbing the first letter, the middle chunk and the whole word awards the star", () => {
      tileAt("sbTiles2", 1).click();
      tileAt("sbTiles2", 1).click();
      expect(isDiscoveryDone("d2")).toBe(false);

      document.getElementById("sbClear2").click();
      tileAt("sbTiles2", 3).click();
      tileAt("sbTiles2", 6).click();
      expect(isDiscoveryDone("d2")).toBe(false);

      document.getElementById("sbClear2").click();
      tileAt("sbTiles2", 1).click();
      tileAt("sbTiles2", 8).click();
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: SHOUTING and whispering", () => {
    test("UCASE and LCASE flip every character together", () => {
      setValue(document.getElementById("ccWord3"), "Quiet");
      document.getElementById("ccUcase3").click();
      expect(document.getElementById("ccDisplay3").textContent).toMatch(/"QUIET"/);
      document.getElementById("ccLcase3").click();
      expect(document.getElementById("ccDisplay3").textContent).toMatch(/"quiet"/);
    });

    test("comparing as typed reads FALSE; UCASEing both sides first reads TRUE", () => {
      document.getElementById("ccCompareRaw3").click();
      expect(document.getElementById("ccCompareStatus3").textContent).toMatch(/FALSE/);
      document.getElementById("ccCompareUcase3").click();
      expect(document.getElementById("ccCompareStatus3").textContent).toMatch(/TRUE/);
    });

    test("shouting, whispering and fixing the case mismatch awards the star", () => {
      document.getElementById("ccUcase3").click();
      document.getElementById("ccLcase3").click();
      expect(isDiscoveryDone("d3")).toBe(false);
      document.getElementById("ccCompareUcase3").click();
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: dice inside the machine", () => {
    test("a roll always shows a raw decimal between 0 and 1, and a tamed whole number between 0 and 6", () => {
      document.getElementById("rdRoll4").click();
      const raw = parseFloat(document.getElementById("rdRaw4").textContent);
      const tamed = parseInt(document.getElementById("rdTamed4").textContent, 10);
      expect(raw).toBeGreaterThanOrEqual(0);
      expect(raw).toBeLessThanOrEqual(1);
      expect(tamed).toBeGreaterThanOrEqual(0);
      expect(tamed).toBeLessThanOrEqual(6);
    });

    test("rolling enough times awards the star", () => {
      const btn = document.getElementById("rdRoll4");
      for (let i = 0; i < 7; i++) btn.click();
      expect(isDiscoveryDone("d4")).toBe(false);
      btn.click(); // 8th roll
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: build a monogram", () => {
    test("the default name is ready to tap, with the second word's initial at the position after its space", () => {
      expect(document.getElementById("mgMonogram5").textContent).toBe("??");
      tileAt("mgTiles5", 1).click();
      tileAt("mgTiles5", 5).click(); // "Ada Lovelace" — L sits at position 5
      expect(document.getElementById("mgMonogram5").textContent).toBe("AL");
      expect(isDiscoveryDone("d5")).toBe(true);
    });

    test("picking any first tile earns the picked chip without awarding the star yet", () => {
      tileAt("mgTiles5", 2).click();
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("typing a name with no second word invites one instead of failing", () => {
      setValue(document.getElementById("mgName5"), "Cher");
      tileAt("mgTiles5", 1).click();
      expect(document.getElementById("mgStatus5").textContent).toMatch(/second name/);
    });

    test("start over clears both picks", () => {
      tileAt("mgTiles5", 1).click();
      tileAt("mgTiles5", 5).click();
      document.getElementById("mgReset5").click();
      expect(document.getElementById("mgMonogram5").textContent).toBe("??");
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
    expect(text).not.toMatch(/mark scheme/i);
    expect(text).not.toMatch(/\b(test|quiz|exam|grade|homework)\b/i);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    setValue(document.getElementById("msWord1"), "Ice Cream");
    // D2
    tileAt("sbTiles2", 1).click();
    tileAt("sbTiles2", 1).click();
    document.getElementById("sbClear2").click();
    tileAt("sbTiles2", 3).click();
    tileAt("sbTiles2", 6).click();
    document.getElementById("sbClear2").click();
    tileAt("sbTiles2", 1).click();
    tileAt("sbTiles2", 8).click();
    // D3
    document.getElementById("ccUcase3").click();
    document.getElementById("ccLcase3").click();
    document.getElementById("ccCompareUcase3").click();
    // D4
    const roll = document.getElementById("rdRoll4");
    for (let i = 0; i < 8; i++) roll.click();
    // D5
    tileAt("mgTiles5", 1).click();
    tileAt("mgTiles5", 5).click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
