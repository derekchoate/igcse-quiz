const {
  loadModule,
  clickBulbByValue,
  clickBulbByIndex,
  starCount,
  hitChips,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 2: Sixteen Symbols", () => {
  beforeEach(() => {
    loadModule("02-sixteen-symbols.html");
  });

  test("starts at zero stars, with no chip pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["chips2", "chips3", "chips4", "chips5"].forEach(id => {
      expect(hitChips(id)).toBe(0);
    });
  });

  test("discovery 1: shuffling three times awards a star and shows an 8-bit binary readout", () => {
    const shuffleBtn = document.getElementById("shuffleBtn");
    shuffleBtn.click();
    shuffleBtn.click();
    expect(starCount()).toBe("✦ 0");
    shuffleBtn.click();
    expect(starCount()).toBe("✦ 1");
    expect(document.getElementById("bin1").textContent).toMatch(/^[01]{8}$/);
  });

  test("discovery 2: splitting the byte into nibbles reaches left=12, right=5, and left=3/right=14", () => {
    const row2 = document.getElementById("row2");
    // left nibble = 12 (128+64), right nibble = 5 (4+1) simultaneously
    [128, 64, 4, 1].forEach(v => clickBulbByValue(row2, v));
    expect(document.querySelector("#left2 b").textContent).toBe("12");
    expect(document.querySelector("#right2 b").textContent).toBe("5");
    [128, 64, 4, 1].forEach(v => clickBulbByValue(row2, v)); // reset to 0

    // left nibble = 3 (32+16), right nibble = 14 (8+4+2)
    [32, 16, 8, 4, 2].forEach(v => clickBulbByValue(row2, v));
    expect(document.querySelector("#left2 b").textContent).toBe("3");
    expect(document.querySelector("#right2 b").textContent).toBe("14");

    expect(hitChips("chips2")).toBe(3);
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 3: the byte reads as 2A, FF and C3 in hex", () => {
    const row3 = document.getElementById("row3");
    clickBulbByValue(row3, 32);
    clickBulbByValue(row3, 8);
    clickBulbByValue(row3, 2); // 42 = 0x2A
    expect(document.querySelector("#hex3 b").textContent).toBe("2A");
    [32, 8, 2].forEach(v => clickBulbByValue(row3, v)); // reset

    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(row3, v)); // 255 = 0xFF
    expect(document.querySelector("#hex3 b").textContent).toBe("FF");
    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(row3, v)); // reset

    [128, 64, 2, 1].forEach(v => clickBulbByValue(row3, v)); // 195 = 0xC3
    expect(document.querySelector("#hex3 b").textContent).toBe("C3");

    expect(hitChips("chips3")).toBe(3);
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: mixing R, G and B reaches red, yellow, green and white", () => {
    const rowR = document.getElementById("rowR");
    const rowG = document.getElementById("rowG");
    const rowB = document.getElementById("rowB");
    const allOn = row => Array.from({ length: 8 }, (_, i) => i).forEach(i => clickBulbByIndex(row, i));

    allOn(rowR); // R=FF G=00 B=00 -> #FF0000
    expect(document.getElementById("swatchHex").textContent).toBe("#FF0000");

    allOn(rowG); // R=FF G=FF B=00 -> #FFFF00
    expect(document.getElementById("swatchHex").textContent).toBe("#FFFF00");

    allOn(rowR); // toggles R off -> R=00 G=FF B=00 -> #00FF00
    expect(document.getElementById("swatchHex").textContent).toBe("#00FF00");

    allOn(rowR);
    allOn(rowB); // R=FF G=FF B=FF -> #FFFFFF
    expect(document.getElementById("swatchHex").textContent).toBe("#FFFFFF");

    expect(hitChips("chips4")).toBe(4);
    expect(isDiscoveryDone("d4")).toBe(true);
  });

  test("discovery 5: reading two symbols from a real MAC address, 4D and A7", () => {
    const row5 = document.getElementById("row5");
    [64, 8, 4, 1].forEach(v => clickBulbByValue(row5, v)); // 77 = 0x4D
    expect(document.querySelector("#hex5 b").textContent).toBe("4D");
    [64, 8, 4, 1].forEach(v => clickBulbByValue(row5, v)); // reset

    [128, 32, 4, 2, 1].forEach(v => clickBulbByValue(row5, v)); // 167 = 0xA7
    expect(document.querySelector("#hex5 b").textContent).toBe("A7");

    expect(hitChips("chips5")).toBe(2);
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    document.getElementById("shuffleBtn").click();
    document.getElementById("shuffleBtn").click();
    document.getElementById("shuffleBtn").click();

    const row2 = document.getElementById("row2");
    [128, 64, 4, 1].forEach(v => clickBulbByValue(row2, v));
    [128, 64, 4, 1].forEach(v => clickBulbByValue(row2, v));
    [32, 16, 8, 4, 2].forEach(v => clickBulbByValue(row2, v));

    const row3 = document.getElementById("row3");
    [32, 8, 2].forEach(v => clickBulbByValue(row3, v));
    [32, 8, 2].forEach(v => clickBulbByValue(row3, v));
    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(row3, v));
    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(row3, v));
    [128, 64, 2, 1].forEach(v => clickBulbByValue(row3, v));

    const rowR = document.getElementById("rowR");
    const rowG = document.getElementById("rowG");
    const rowB = document.getElementById("rowB");
    const allOn = row => Array.from({ length: 8 }, (_, i) => i).forEach(i => clickBulbByIndex(row, i));
    allOn(rowR);
    allOn(rowG);
    allOn(rowR);
    allOn(rowR);
    allOn(rowB);

    const row5 = document.getElementById("row5");
    [64, 8, 4, 1].forEach(v => clickBulbByValue(row5, v));
    [64, 8, 4, 1].forEach(v => clickBulbByValue(row5, v));
    [128, 32, 4, 2, 1].forEach(v => clickBulbByValue(row5, v));

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
