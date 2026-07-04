const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function getsLine(line) {
  return document.querySelector('#getsLines1 .gets-line[data-line="' + line + '"]');
}
function engChip(idx) {
  return document.querySelector('#pairBank3 .pair-chip[data-eng="' + idx + '"]');
}
function codeSlot(idx) {
  return document.querySelector('#pairCode3 .pair-slot[data-line="' + idx + '"]');
}

describe("Module 9: The House Style", () => {
  beforeEach(() => {
    loadModule("09-the-house-style.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  test("discovery 1: running all three assignment lines awards the star", () => {
    getsLine("set").click();
    expect(document.getElementById("getsVal1").textContent).toBe("10");
    expect(isDiscoveryDone("d1")).toBe(false);

    getsLine("add").click();
    expect(document.getElementById("getsVal1").textContent).toBe("15"); // 10 + 5
    getsLine("mul").click();
    expect(document.getElementById("getsVal1").textContent).toBe("30"); // 15 * 2

    expect(isDiscoveryDone("d1")).toBe(true);
    expect(starCount()).toBe("✦ 1");
  });

  test("discovery 1: the arrow assigns — a box may appear on both sides", () => {
    getsLine("set").click();   // Score ← 10
    getsLine("add").click();   // Score ← Score + 5  → 15
    expect(document.getElementById("getsVal1").textContent).toBe("15");
    // reset returns the box to zero, nothing deducted from stars
    document.getElementById("getsReset1").click();
    expect(document.getElementById("getsVal1").textContent).toBe("0");
  });

  test("discovery 2: stepping through every line declares then fills the boxes and awards the star", () => {
    const step = document.getElementById("declStep2");
    step.click(); // DECLARE Name
    expect(document.querySelectorAll("#declBoxes2 .vbox").length).toBe(1);
    expect(document.querySelector("#declBoxes2 .vbox").classList.contains("empty")).toBe(true);

    step.click(); // DECLARE Age
    expect(document.querySelectorAll("#declBoxes2 .vbox").length).toBe(2);

    step.click(); // Name ← "Sara"
    expect(document.querySelectorAll("#declBoxes2 .vbox.filled").length).toBe(1);
    expect(isDiscoveryDone("d2")).toBe(false);

    step.click(); // Age ← 19
    expect(document.querySelectorAll("#declBoxes2 .vbox.filled").length).toBe(2);
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 2: reset clears the boxes and lets you step again", () => {
    const step = document.getElementById("declStep2");
    step.click(); step.click();
    document.getElementById("declReset2").click();
    expect(document.querySelectorAll("#declBoxes2 .vbox").length).toBe(0);
    step.click();
    expect(document.querySelectorAll("#declBoxes2 .vbox").length).toBe(1);
  });

  test("discovery 3: the slider reveals each line's meaning one at a time", () => {
    const next = document.getElementById("tsNext3");
    const rows = document.querySelectorAll("#tsList3 .ts-row");
    expect(rows.length).toBe(6);
    next.click();
    expect(rows[0].classList.contains("read")).toBe(true);
    expect(rows[1].classList.contains("read")).toBe(false);
  });

  test("discovery 3: pairing every meaning to its code line awards the star", () => {
    expect(document.querySelectorAll("#pairCode3 .pair-slot").length).toBe(6);
    for (let i = 0; i < 6; i++) {
      engChip(i).click();
      codeSlot(i).click();
      expect(codeSlot(i).classList.contains("filled")).toBe(true);
    }
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 3: a mismatched pairing does not fill the slot or award a star", () => {
    engChip(0).click();      // "Make an integer box called Price."
    codeSlot(5).click();     // OUTPUT Total — wrong line
    expect(codeSlot(5).classList.contains("filled")).toBe(false);
    expect(isDiscoveryDone("d3")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/Not that line/);
  });

  test("discovery 4: renaming the three boxes correctly snaps and awards the star", () => {
    const sels = document.querySelectorAll("#rnRows4 select");
    expect(sels.length).toBe(3);
    const [a, b, c] = sels;
    a.value = "Price"; a.dispatchEvent(new Event("change"));
    b.value = "Quantity"; b.dispatchEvent(new Event("change"));
    expect(isDiscoveryDone("d4")).toBe(false);
    c.value = "Total"; c.dispatchEvent(new Event("change"));
    expect(isDiscoveryDone("d4")).toBe(true);
    expect(document.getElementById("rnReadable4").classList.contains("show")).toBe(true);
  });

  test("discovery 4: a name that hides gives a warm redirect, no star", () => {
    const [a] = document.querySelectorAll("#rnRows4 select");
    a.value = "Thing"; a.dispatchEvent(new Event("change"));
    expect(isDiscoveryDone("d4")).toBe(false);
    expect(document.getElementById("rnStatus4").textContent).toMatch(/name that hides/);
  });

  test("discovery 4: a type-mismatched name is redirected, not accepted", () => {
    const [a, b] = document.querySelectorAll("#rnRows4 select");
    a.value = "Quantity"; a.dispatchEvent(new Event("change")); // a is REAL, a count isn't
    expect(isDiscoveryDone("d4")).toBe(false);
    expect(document.getElementById("rnStatus4").textContent).toMatch(/REAL box/);
  });

  test("discovery 5: revealing the note and running it collects both ideas and awards the star", () => {
    document.getElementById("cmReveal5").click();
    expect(document.getElementById("cmComment5").style.display).toBe("");
    expect(isDiscoveryDone("d5")).toBe(false);

    document.getElementById("cmRun5").click();
    expect(document.getElementById("cmOut5").textContent).toMatch(/15/);
    expect(document.getElementById("cmComment5").classList.contains("off")).toBe(true);
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    getsLine("set").click(); getsLine("add").click(); getsLine("mul").click();
    // D2
    const step = document.getElementById("declStep2");
    for (let i = 0; i < 4; i++) step.click();
    // D3
    for (let i = 0; i < 6; i++) { engChip(i).click(); codeSlot(i).click(); }
    // D4
    const [a, b, c] = document.querySelectorAll("#rnRows4 select");
    a.value = "Price"; a.dispatchEvent(new Event("change"));
    b.value = "Quantity"; b.dispatchEvent(new Event("change"));
    c.value = "Total"; c.dispatchEvent(new Event("change"));
    // D5
    document.getElementById("cmReveal5").click();
    document.getElementById("cmRun5").click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
