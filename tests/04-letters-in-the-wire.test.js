const {
  loadModule,
  clickBulbByValue,
  starCount,
  hitChips,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 4: Letters in the Wire", () => {
  beforeEach(() => {
    loadModule("04-letters-in-the-wire.html");
  });

  test("starts at zero stars, with no chip pre-completed by any seeded board", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    // discoveries 1 and 3 seed their boards to 72 ('H') and 65 ('A') on load,
    // both inside the 65-90 range their chip logic watches — must not auto-fire.
    ["chips1", "chips2", "chips3", "chips4"].forEach(id => {
      expect(hitChips(id)).toBe(0);
    });
    expect(isDiscoveryDone("d1")).toBe(false);
  });

  test("discovery 1: card A and card B always disagree on a capital letter's identity", () => {
    // seeded to 72 = 'H' on load
    expect(document.getElementById("cardA1").textContent).toBe("H");
    expect(document.getElementById("cardB1").textContent).toBe("S");
  });

  test("discovery 1: comparing three distinct capitals awards the star", () => {
    const row1 = document.getElementById("row1");
    // 72 is already showing; touch it once to register as "compared"
    clickBulbByValue(row1, 8); // 72 -> 64 (toggle 8 off): 64 is out of 65-90 range
    clickBulbByValue(row1, 8); // back to 72, now genuinely re-entering the range
    clickBulbByValue(row1, 1); // 72 -> 73 = 'I'
    clickBulbByValue(row1, 4); // 73 -> 69 = 'E'
    expect(hitChips("chips1")).toBe(3);
    expect(isDiscoveryDone("d1")).toBe(true);
  });

  test("discovery 2: landing in the digits, capitals and lowercase streets finds all three", () => {
    const row2 = document.getElementById("row2");
    clickBulbByValue(row2, 32);
    clickBulbByValue(row2, 16); // 48 = '0', digits
    expect(document.getElementById("char2").textContent).toBe("0");
    expect(document.querySelector("#hood2 b").textContent).toBe("digits");
    clickBulbByValue(row2, 32);
    clickBulbByValue(row2, 16);

    clickBulbByValue(row2, 64); // 65 = 'A', capitals
    clickBulbByValue(row2, 1);
    expect(document.getElementById("char2").textContent).toBe("A");
    clickBulbByValue(row2, 64);
    clickBulbByValue(row2, 1);

    clickBulbByValue(row2, 64);
    clickBulbByValue(row2, 32);
    clickBulbByValue(row2, 1); // 97 = 'a', lowercase
    expect(document.getElementById("char2").textContent).toBe("a");

    expect(hitChips("chips2")).toBe(3);
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 3: the weight-32 bulb is the case bit, and flipping two different letters awards the star", () => {
    const row3 = document.getElementById("row3");
    expect(document.getElementById("char3").textContent).toBe("A"); // seeded to 65

    clickBulbByValue(row3, 32); // 65 -> 97 = 'a'
    expect(document.getElementById("char3").textContent).toBe("a");
    expect(hitChips("chips3")).toBe(1); // "down" only so far

    clickBulbByValue(row3, 32); // back to 'A'
    // now flip a different letter: 65 (64+1) -> 66 = 'B' (64+2), then flip its case bit
    clickBulbByValue(row3, 1); // 65 -> 64 (bit1 was already set in 65, so this clears it)
    clickBulbByValue(row3, 2); // 64 -> 66 = 'B'
    clickBulbByValue(row3, 32); // 66 -> 98 = 'b'
    expect(document.getElementById("char3").textContent).toBe("b");
    clickBulbByValue(row3, 32); // 98 -> 66 = 'B', the "up" direction

    expect(hitChips("chips3")).toBe(3);
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: an ordinary letter fits in ASCII, and é overflows it", () => {
    const input = document.getElementById("d4input");
    input.value = "Q";
    input.dispatchEvent(new Event("input"));
    expect(document.getElementById("d4code").textContent).toBe("81");
    expect(document.getElementById("d4verdict").textContent).toMatch(/Fits/);
    expect(hitChips("chips4")).toBe(1);

    document.getElementById("fillAccent").click(); // é
    expect(document.getElementById("d4code").textContent).toBe("233");
    expect(document.getElementById("d4verdict").textContent).toMatch(/Too big/);

    expect(hitChips("chips4")).toBe(2);
    expect(isDiscoveryDone("d4")).toBe(true);
  });

  test("discovery 4: 中 also overflows a single ASCII byte", () => {
    document.getElementById("fillHan").click();
    expect(document.getElementById("d4code").textContent).toBe("20013");
    expect(document.getElementById("d4verdict").textContent).toMatch(/Too big/);
  });

  test("discovery 5: encoding a word renders one byte column per character", () => {
    const input = document.getElementById("encodeInput");
    input.value = "Hi";
    input.dispatchEvent(new Event("input"));
    const cols = document.querySelectorAll("#encodeRow .encode-col");
    expect(cols.length).toBe(2);
    expect(cols[0].querySelector(".encode-char").textContent).toBe("H");
    expect(cols[0].querySelector(".encode-code").textContent).toBe("72");
    expect(cols[1].querySelector(".encode-char").textContent).toBe("i");
    expect(cols[1].querySelector(".encode-code").textContent).toBe("105");
  });

  test("discovery 5: picking a wrong letter redirects without locking, and decoding SHARP awards the final star", () => {
    const selects = document.querySelectorAll("#decodeBoard select");
    selects[0].value = "A"; // wrong: row 1 is S (83)
    selects[0].dispatchEvent(new Event("change"));
    expect(selects[0].classList.contains("locked")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/A is number 65/);

    const answers = ["S", "H", "A", "R", "P"];
    selects.forEach((sel, i) => {
      sel.value = answers[i];
      sel.dispatchEvent(new Event("change"));
    });
    expect(document.getElementById("decodedWord").textContent).toBe("S H A R P");
    expect(document.getElementById("decodeNote").classList.contains("shown")).toBe(true);
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    const row1 = document.getElementById("row1");
    clickBulbByValue(row1, 8);
    clickBulbByValue(row1, 8);
    clickBulbByValue(row1, 1);
    clickBulbByValue(row1, 4);

    const row2 = document.getElementById("row2");
    clickBulbByValue(row2, 32);
    clickBulbByValue(row2, 16);
    clickBulbByValue(row2, 32);
    clickBulbByValue(row2, 16);
    clickBulbByValue(row2, 64);
    clickBulbByValue(row2, 1);
    clickBulbByValue(row2, 64);
    clickBulbByValue(row2, 1);
    clickBulbByValue(row2, 64);
    clickBulbByValue(row2, 32);
    clickBulbByValue(row2, 1);

    const row3 = document.getElementById("row3");
    clickBulbByValue(row3, 32); // 65 -> 97 'a' ("down")
    clickBulbByValue(row3, 32); // back to 'A'
    clickBulbByValue(row3, 1); // 65 -> 64
    clickBulbByValue(row3, 2); // 64 -> 66 'B'
    clickBulbByValue(row3, 32); // 66 -> 98 'b'
    clickBulbByValue(row3, 32); // 98 -> 66 'B' ("up", on a second letter -> "again")

    const input4 = document.getElementById("d4input");
    input4.value = "Q";
    input4.dispatchEvent(new Event("input"));
    document.getElementById("fillAccent").click();

    const selects = document.querySelectorAll("#decodeBoard select");
    const answers = ["S", "H", "A", "R", "P"];
    selects.forEach((sel, i) => {
      sel.value = answers[i];
      sel.dispatchEvent(new Event("change"));
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
