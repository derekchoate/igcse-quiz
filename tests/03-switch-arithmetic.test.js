const {
  loadModule,
  clickBulbByValue,
  clickBulbByIndex,
  starCount,
  hitChips,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// Weight-128's label switches to "−128" once the sign lens is on (discovery 5's
// whole point), which breaks label-text lookups — so once the lens is on, address
// that bulb by position instead. W5[i] is the weight at index i.
const W5 = [128, 64, 32, 16, 8, 4, 2, 1];
const idx5 = v => W5.indexOf(v);

describe("Module 3: Switch Arithmetic", () => {
  beforeEach(() => {
    loadModule("03-switch-arithmetic.html");
  });

  test("starts at zero stars", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
  });

  test("discovery 1: all four addition facts are reachable, including the carry", () => {
    const bitA = document.getElementById("bitA1");
    const bitB = document.getElementById("bitB1");

    bitA.click(); // 1 + 0
    expect(document.getElementById("factExpr1").textContent).toBe("1 + 0 = 1");
    bitB.click(); // 1 + 1 -> carries
    expect(document.getElementById("factExpr1").textContent).toBe("1 + 1 = 10");
    expect(document.getElementById("carryDot1").classList.contains("on")).toBe(true);
    expect(document.getElementById("sumDot1").classList.contains("on")).toBe(false);
    bitA.click(); // 0 + 1
    expect(document.getElementById("factExpr1").textContent).toBe("0 + 1 = 1");
    bitB.click(); // 0 + 0
    expect(document.getElementById("factExpr1").textContent).toBe("0 + 0 = 0");

    expect(hitChips("chips1")).toBe(4);
    expect(isDiscoveryDone("d1")).toBe(true);
  });

  test("discovery 2: carry chains reach true sums of 50, 128 and 199 without overflow", () => {
    const rowA = document.getElementById("rowA2");
    const setA = bulbs => bulbs.forEach(v => clickBulbByValue(rowA, v));

    setA([32, 16, 2]); // 50
    expect(document.getElementById("totalSum2").textContent).toBe("50");
    setA([32, 16, 2]);

    setA([128]); // 128
    expect(document.getElementById("totalSum2").textContent).toBe("128");
    setA([128]);

    setA([128, 64, 4, 2, 1]); // 199
    expect(document.getElementById("totalSum2").textContent).toBe("199");

    expect(hitChips("chips2")).toBe(3);
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 3: overflow is detected and the byte wraps, at 256, 300 and 510", () => {
    const rowA = document.getElementById("rowA3");
    const rowB = document.getElementById("rowB3");
    const setRow = (row, bulbs) => bulbs.forEach(v => clickBulbByValue(row, v));

    setRow(rowA, [128]);
    setRow(rowB, [128]); // 128 + 128 = 256
    expect(document.getElementById("overflowNote3").hidden).toBe(false);
    expect(document.getElementById("trueSum3").textContent).toBe("256");
    expect(document.getElementById("totalSum3").textContent).toBe("0"); // wraps to 0
    setRow(rowA, [128]);
    setRow(rowB, [128]);
    expect(document.getElementById("overflowNote3").hidden).toBe(true);

    setRow(rowA, [128, 64, 8]); // 200
    setRow(rowB, [64, 32, 4]); // 100 -> true sum 300
    expect(document.getElementById("trueSum3").textContent).toBe("300");
    expect(document.getElementById("totalSum3").textContent).toBe("44"); // 300 & 255
    setRow(rowA, [128, 64, 8]);
    setRow(rowB, [64, 32, 4]);

    setRow(rowA, [128, 64, 32, 16, 8, 4, 2, 1]); // 255
    setRow(rowB, [128, 64, 32, 16, 8, 4, 2, 1]); // 255 -> true sum 510
    expect(document.getElementById("trueSum3").textContent).toBe("510");
    expect(document.getElementById("totalSum3").textContent).toBe("254"); // 510 & 255

    expect(hitChips("chips3")).toBe(3);
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: shifting left doubles, shifting right halves, and bits fall off both edges", () => {
    expect(document.getElementById("total4").textContent).toBe("3"); // seeded on load

    const shiftLeft = document.getElementById("shiftLeftBtn");
    const shiftRight = document.getElementById("shiftRightBtn");
    const row4 = document.getElementById("row4");

    shiftLeft.click(); // 3 -> 6, clean double
    expect(document.getElementById("total4").textContent).toBe("6");
    shiftRight.click(); // 6 -> 3, clean halve
    expect(document.getElementById("total4").textContent).toBe("3");

    clickBulbByValue(row4, 128); // 3 -> 131 (10000011)
    shiftLeft.click(); // top bit lost -> 6
    expect(document.getElementById("total4").textContent).toBe("6");

    clickBulbByValue(row4, 1); // 6 -> 7 (00000111)
    shiftRight.click(); // bottom bit lost -> 3
    expect(document.getElementById("total4").textContent).toBe("3");

    expect(hitChips("chips4")).toBe(4);
    expect(isDiscoveryDone("d4")).toBe(true);
  });

  test("discovery 5: flip-and-add-one with the sign lens reaches -1, -19 and -128", () => {
    const row5 = document.getElementById("row5");
    const flipBtn = document.getElementById("flipBtn");
    const addOneBtn = document.getElementById("addOneBtn");
    const lensBtn = document.getElementById("lensBtn");

    expect(document.getElementById("total5").textContent).toBe("19"); // seeded on load

    flipBtn.click();
    addOneBtn.click();
    lensBtn.click(); // lens on
    expect(document.getElementById("total5").textContent).toBe("-19");
    expect(document.getElementById("lensNote5").hidden).toBe(false);

    // board now holds unsigned 237 (11101101) = 128+64+32+8+4+1; clear it back to 0, then to 1
    // (the lens is on now, so weight-128's label reads "−128" — address by index)
    [128, 64, 32, 8, 4, 1].map(idx5).forEach(i => clickBulbByIndex(row5, i));
    clickBulbByIndex(row5, idx5(1));
    flipBtn.click();
    addOneBtn.click(); // -1
    expect(document.getElementById("total5").textContent).toBe("-1");

    // board now holds unsigned 255; clear it, then set only the 128 bulb
    [128, 64, 32, 16, 8, 4, 2, 1].map(idx5).forEach(i => clickBulbByIndex(row5, i));
    clickBulbByIndex(row5, idx5(128));
    flipBtn.click();
    addOneBtn.click(); // -128, the special case
    expect(document.getElementById("total5").textContent).toBe("-128");

    expect(hitChips("chips5")).toBe(3);
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    document.getElementById("bitA1").click();
    document.getElementById("bitB1").click();
    document.getElementById("bitA1").click();
    document.getElementById("bitB1").click();

    const rowA2 = document.getElementById("rowA2");
    [32, 16, 2].forEach(v => clickBulbByValue(rowA2, v));
    [32, 16, 2].forEach(v => clickBulbByValue(rowA2, v));
    [128].forEach(v => clickBulbByValue(rowA2, v));
    [128].forEach(v => clickBulbByValue(rowA2, v));
    [128, 64, 4, 2, 1].forEach(v => clickBulbByValue(rowA2, v));

    const rowA3 = document.getElementById("rowA3");
    const rowB3 = document.getElementById("rowB3");
    clickBulbByValue(rowA3, 128);
    clickBulbByValue(rowB3, 128);
    clickBulbByValue(rowA3, 128);
    clickBulbByValue(rowB3, 128);
    [128, 64, 8].forEach(v => clickBulbByValue(rowA3, v));
    [64, 32, 4].forEach(v => clickBulbByValue(rowB3, v));
    [128, 64, 8].forEach(v => clickBulbByValue(rowA3, v));
    [64, 32, 4].forEach(v => clickBulbByValue(rowB3, v));
    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(rowA3, v));
    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(rowB3, v));

    const row4 = document.getElementById("row4");
    document.getElementById("shiftLeftBtn").click();
    document.getElementById("shiftRightBtn").click();
    clickBulbByValue(row4, 128);
    document.getElementById("shiftLeftBtn").click();
    clickBulbByValue(row4, 1);
    document.getElementById("shiftRightBtn").click();

    const row5 = document.getElementById("row5");
    document.getElementById("flipBtn").click();
    document.getElementById("addOneBtn").click();
    document.getElementById("lensBtn").click();
    [128, 64, 32, 8, 4, 1].map(idx5).forEach(i => clickBulbByIndex(row5, i));
    clickBulbByIndex(row5, idx5(1));
    document.getElementById("flipBtn").click();
    document.getElementById("addOneBtn").click();
    [128, 64, 32, 16, 8, 4, 2, 1].map(idx5).forEach(i => clickBulbByIndex(row5, i));
    clickBulbByIndex(row5, idx5(128));
    document.getElementById("flipBtn").click();
    document.getElementById("addOneBtn").click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
