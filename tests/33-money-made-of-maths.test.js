const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

/** Tap-then-tap a bin-sorter item (by data-id) onto a bin (by its head's
 * visible label), within a given pool/bins container id pair. */
function sortItem(poolId, binsId, itemId, binLabel) {
  const pool = document.getElementById(poolId);
  const chip = pool.querySelector('.sl-chip[data-id="' + itemId + '"]');
  if (!chip) throw new Error("No chip with data-id " + itemId + " in #" + poolId);
  chip.click();
  const bins = document.getElementById(binsId);
  const head = Array.from(bins.querySelectorAll(".sl-bin-head")).find(b => b.textContent === binLabel);
  if (!head) throw new Error("No bin head labeled " + binLabel + " in #" + binsId);
  head.click();
}

function sortAllClaims() {
  sortItem("pool5", "bins5", "onlyCurrency", "Hype — doesn't survive contact with it");
  sortItem("pool5", "bins5", "onlyElectronic", "Fact — matches what you built");
  sortItem("pool5", "bins5", "rewriteUnnoticed", "Hype — doesn't survive contact with it");
  sortItem("pool5", "bins5", "fingerprintVsLock", "Fact — matches what you built");
  sortItem("pool5", "bins5", "manyCopies", "Fact — matches what you built");
  sortItem("pool5", "bins5", "noOrgAtAll", "Hype — doesn't survive contact with it");
}

function inspectAllBlocks() {
  Array.from(document.querySelectorAll("#chain3 .loop-btn")).forEach(b => b.click());
}

describe("Module 33: Money Made of Maths", () => {
  beforeEach(() => {
    loadModule("33-money-made-of-maths.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: the one book", () => {
    test("quietly changing an entry updates it instantly, with no wrong/error state, and awards the star", () => {
      const row = document.querySelector("#ledger1 .mc-ledger-row");
      const text = row.querySelector(".mc-ledger-text");
      const before = text.textContent;
      row.querySelector(".loop-btn").click();

      expect(text.textContent).not.toBe(before);
      expect(document.getElementById("ledgerNote1").textContent).toMatch(/trust problem/);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("only one star is ever awarded even if multiple entries are changed", () => {
      Array.from(document.querySelectorAll("#ledger1 .loop-btn")).forEach(b => b.click());
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: everyone keeps the book", () => {
    test("tampering Arun's copy leaves the other two copies untouched, and comparing reveals the disagreement", () => {
      document.getElementById("tamperBtn2").click();
      const copies = document.querySelectorAll("#copies2 .mc-copy");
      expect(copies[0].textContent).toMatch(/80 credits/);
      expect(copies[1].textContent).toMatch(/20 credits/);
      expect(copies[2].textContent).toMatch(/20 credits/);
      expect(isDiscoveryDone("d2")).toBe(false);

      document.getElementById("compareBtn2").click();
      expect(document.getElementById("compareNote2").textContent).toMatch(/agree with each other/);
      expect(copies[0].classList.contains("flagged")).toBe(true);
      expect(copies[1].classList.contains("matched")).toBe(true);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: chained fingerprints", () => {
    test("block 1 is shown with its fingerprint visible and no previous block to grip", () => {
      const block1 = document.querySelectorAll("#chain3 .mc-block")[0];
      expect(block1.textContent).toMatch(/3F2A-9B1C/);
      expect(block1.textContent).toMatch(/nothing before it to grip/);
    });

    test("inspecting all four remaining blocks reveals their fingerprints and awards the star", () => {
      const buttons = Array.from(document.querySelectorAll("#chain3 .loop-btn"));
      expect(buttons.length).toBe(4);

      buttons[0].click();
      expect(document.getElementById("chain3").textContent).toMatch(/8D4E-11A0/);
      expect(isDiscoveryDone("d3")).toBe(false);

      buttons.slice(1).forEach(b => b.click());
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: be the villain", () => {
    test("tampering block 3 recalculates its fingerprint live, without touching block 4 or 5 yet", () => {
      document.getElementById("tamperBtn4").click();
      const chain = document.getElementById("chain4");
      expect(chain.textContent).toMatch(/90 credits/);
      expect(chain.textContent).toMatch(/9E30-77FA/);
      const blocks = document.querySelectorAll("#chain4 .mc-block");
      expect(blocks[2].classList.contains("edited")).toBe(true);
      expect(blocks[3].classList.contains("flagged")).toBe(false);
      expect(isDiscoveryDone("d4")).toBe(false);
    });

    test("comparing after the tamper flags block 4 and cascades to block 5, shows other copies disagreeing, and awards the star", () => {
      document.getElementById("tamperBtn4").click();
      document.getElementById("revealBtn4").click();

      const blocks = document.querySelectorAll("#chain4 .mc-block");
      expect(blocks[3].classList.contains("flagged")).toBe(true); // block 4
      expect(blocks[4].classList.contains("flagged")).toBe(true); // block 5
      expect(blocks[3].textContent).toMatch(/no longer match/);
      expect(blocks[4].textContent).toMatch(/Nothing about block 5 was touched/);

      const others = document.getElementById("othersPanel4");
      expect(others.hidden).toBe(false);
      expect(others.textContent).toMatch(/90 credits/);
      expect(others.textContent).toMatch(/10 credits/);

      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("the tamper cascade never uses red or wrong/error language", () => {
      document.getElementById("tamperBtn4").click();
      document.getElementById("revealBtn4").click();
      const chain = document.getElementById("chain4");
      const styleText = document.querySelector("style") ? document.querySelector("style").textContent : "";
      expect(styleText.toLowerCase()).not.toMatch(/#f00|red\b|ff0000|crimson/);
      expect(chain.textContent.toLowerCase()).not.toMatch(/\bwrong\b|\berror\b|\bfail(ed|s)?\b incorrect/);
    });
  });

  describe("discovery 5: sort it out", () => {
    test("sorting a claim onto the wrong pile gives a warm redirect, never a wrong/incorrect label, and no star", () => {
      sortItem("pool5", "bins5", "onlyElectronic", "Hype — doesn't survive contact with it");
      expect(document.getElementById("status5").textContent).toMatch(/try again/i);
      expect(document.getElementById("status5").textContent).not.toMatch(/wrong|incorrect|fail/i);
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("sorting all six claims onto their correct pile awards the star", () => {
      sortAllClaims();
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
    document.querySelector("#ledger1 .mc-ledger-row .loop-btn").click();

    document.getElementById("tamperBtn2").click();
    document.getElementById("compareBtn2").click();

    inspectAllBlocks();

    document.getElementById("tamperBtn4").click();
    document.getElementById("revealBtn4").click();

    sortAllClaims();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });

  test("the built module never mentions banned school vocabulary, and 'exam' appears nowhere", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });

  test("stays factual: no investment/financial-advice framing, and no specific hashing algorithm is named", () => {
    const text = document.querySelector(".wrap").textContent.toLowerCase();
    ["invest", "get rich", "\\bprice\\b", "\\bworth\\b", "profit", "sha-256", "sha256", "md5"].forEach(term => {
      expect(text).not.toMatch(new RegExp(term));
    });
  });

  test("blockchain is described as a general mechanism, not just for cryptocurrency", () => {
    const text = document.body.textContent;
    expect(text).toMatch(/nothing else can ever use it/); // the hype claim being sorted, not endorsed
    expect(document.getElementById("d5").textContent).toMatch(/A digital currency is one thing that mechanism can track/);
  });
});
