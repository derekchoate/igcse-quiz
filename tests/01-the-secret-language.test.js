const {
  loadModule,
  clickBulbByValue,
  starCount,
  hitChips,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 1: The Secret Language", () => {
  beforeEach(() => {
    loadModule("01-the-secret-language.html");
  });

  test("starts at zero stars with the reflection card hidden, and no chip pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    expect(isDiscoveryDone("d1")).toBe(false);
    ["chips2", "chips3", "chips4"].forEach(id => {
      expect(hitChips(id)).toBe(0);
    });
  });

  test("discovery 1: three flips of the single switch awards a star", () => {
    const bulb = document.querySelector("#row1 button");
    bulb.click();
    bulb.click();
    expect(starCount()).toBe("✦ 0");
    bulb.click();
    expect(starCount()).toBe("✦ 1");
    expect(isDiscoveryDone("d1")).toBe(true);
    expect(document.getElementById("d1msg").innerHTML).toMatch(/entire alphabet/);
  });

  test("discovery 2: two switches (2,1) reach totals 0-3 and award a star", () => {
    clickBulbByValue(document.getElementById("row2"), 2); // total 2
    clickBulbByValue(document.getElementById("row2"), 1); // total 3
    expect(document.querySelector("#total2 b").textContent).toBe("3");
    expect(document.getElementById("total2").classList.contains("matched")).toBe(true);
    clickBulbByValue(document.getElementById("row2"), 2); // total 1
    clickBulbByValue(document.getElementById("row2"), 1); // total 0
    expect(document.querySelector("#total2 b").textContent).toBe("0");
    expect(hitChips("chips2")).toBe(4);
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 3: the doubling trick reaches 5, 10, 13, 15", () => {
    const row3 = document.getElementById("row3");
    const setTo = bulbs => bulbs.forEach(v => clickBulbByValue(row3, v));

    setTo([4, 1]); // 5
    expect(document.querySelector("#total3 b").textContent).toBe("5");
    setTo([4, 1]); // back to 0

    setTo([8, 2]); // 10
    expect(document.querySelector("#total3 b").textContent).toBe("10");
    setTo([8, 2]); // back to 0

    setTo([8, 4, 1]); // 13
    expect(document.querySelector("#total3 b").textContent).toBe("13");
    setTo([8, 4, 1]); // back to 0

    setTo([8, 4, 2, 1]); // 15
    expect(document.querySelector("#total3 b").textContent).toBe("15");

    expect(hitChips("chips3")).toBe(4);
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: a full byte reaches 19, 42, 100, 255", () => {
    const row4 = document.getElementById("row4");
    // 19 = 16 + 2 + 1
    [16, 2, 1].forEach(v => clickBulbByValue(row4, v));
    expect(document.querySelector("#total4 b").textContent).toBe("19");
    [16, 2, 1].forEach(v => clickBulbByValue(row4, v)); // back off
    // 42 = 32 + 8 + 2
    [32, 8, 2].forEach(v => clickBulbByValue(row4, v));
    expect(document.querySelector("#total4 b").textContent).toBe("42");
    [32, 8, 2].forEach(v => clickBulbByValue(row4, v));
    // 100 = 64 + 32 + 4
    [64, 32, 4].forEach(v => clickBulbByValue(row4, v));
    expect(document.querySelector("#total4 b").textContent).toBe("100");
    [64, 32, 4].forEach(v => clickBulbByValue(row4, v));
    // 255 = everything
    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(row4, v));
    expect(document.querySelector("#total4 b").textContent).toBe("255");
    expect(hitChips("chips4")).toBe(4);
    expect(isDiscoveryDone("d4")).toBe(true);
  });

  test("discovery 5: picking the wrong letter redirects without locking, and never fails", () => {
    const firstSelect = document.querySelectorAll("#decodeBoard select")[0];
    firstSelect.value = "A"; // Y is the correct answer for row 1 (value 25)
    firstSelect.dispatchEvent(new Event("change"));
    expect(firstSelect.classList.contains("locked")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/A is number 1/);
    expect(document.getElementById("decodedWord").textContent).toBe("· · ·");
  });

  test("discovery 5: decoding YOU correctly locks each row and awards the final star", () => {
    const selects = document.querySelectorAll("#decodeBoard select");
    const answers = ["Y", "O", "U"];
    selects.forEach((sel, i) => {
      sel.value = answers[i];
      sel.dispatchEvent(new Event("change"));
    });
    expect(document.getElementById("decodedWord").textContent).toBe("Y O U");
    expect(document.getElementById("decodeNote").classList.contains("shown")).toBe(true);
    expect(isDiscoveryDone("d5")).toBe(true);
    selects.forEach(sel => expect(sel.classList.contains("locked")).toBe(true));
  });

  test("all five discoveries together unlock the reflection card", () => {
    document.querySelector("#row1 button").click();
    document.querySelector("#row1 button").click();
    document.querySelector("#row1 button").click();

    [2, 1].forEach(v => clickBulbByValue(document.getElementById("row2"), v)); // 3
    [2, 1].forEach(v => clickBulbByValue(document.getElementById("row2"), v)); // 0

    const row3 = document.getElementById("row3");
    [4, 1].forEach(v => clickBulbByValue(row3, v)); // 5
    [4, 1].forEach(v => clickBulbByValue(row3, v)); // back to 0
    [8, 2].forEach(v => clickBulbByValue(row3, v)); // 10
    [8, 2].forEach(v => clickBulbByValue(row3, v)); // back to 0
    [8, 4, 1].forEach(v => clickBulbByValue(row3, v)); // 13
    clickBulbByValue(row3, 2); // 15

    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(document.getElementById("row4"), v)); // 255
    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(document.getElementById("row4"), v)); // 0
    [16, 2, 1].forEach(v => clickBulbByValue(document.getElementById("row4"), v)); // 19
    [16, 2, 1].forEach(v => clickBulbByValue(document.getElementById("row4"), v));
    [32, 8, 2].forEach(v => clickBulbByValue(document.getElementById("row4"), v)); // 42
    [32, 8, 2].forEach(v => clickBulbByValue(document.getElementById("row4"), v));
    [64, 32, 4].forEach(v => clickBulbByValue(document.getElementById("row4"), v)); // 100
    [64, 32, 4].forEach(v => clickBulbByValue(document.getElementById("row4"), v));
    [128, 64, 32, 16, 8, 4, 2, 1].forEach(v => clickBulbByValue(document.getElementById("row4"), v)); // 255

    const selects = document.querySelectorAll("#decodeBoard select");
    const answers = ["Y", "O", "U"];
    selects.forEach((sel, i) => {
      sel.value = answers[i];
      sel.dispatchEvent(new Event("change"));
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
