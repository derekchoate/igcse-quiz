const {
  loadModule,
  starCount,
  hitChips,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 5: Pictures & Sound from Numbers", () => {
  beforeEach(() => {
    loadModule("05-pictures-and-sound-from-numbers.html");
  });

  test("starts at zero stars, with no chip pre-completed by the seeded resolution board", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    // discovery 3 renders its initial 1x1 view on load without user input.
    ["chips1", "chips2", "chips3", "chips4"].forEach(id => {
      expect(hitChips(id)).toBe(0);
    });
  });

  test("discovery 1: painting a pixel, filling a row and clearing it awards the star, with a live binary mirror", () => {
    const cells = document.querySelectorAll("#pixelGrid1 .pixel-cell");
    cells[0].click(); // light one pixel
    expect(document.querySelectorAll("#mirror1 .bit-char.on").length).toBe(1);
    expect(hitChips("chips1")).toBe(1);

    for (let i = 1; i < 5; i++) cells[i].click(); // finish filling row 0
    expect(hitChips("chips1")).toBe(2);
    const mirrorRow0 = Array.from(document.querySelectorAll("#mirror1 .bit-char")).slice(0, 5);
    expect(mirrorRow0.every(el => el.classList.contains("on"))).toBe(true);

    for (let i = 0; i < 5; i++) cells[i].click(); // clear the row back to black
    expect(hitChips("chips1")).toBe(3);
    expect(isDiscoveryDone("d1")).toBe(true);
  });

  test("discovery 2: exploring 1, 2 and 3-bit depth via the swatches awards the star", () => {
    const slider = document.getElementById("depthSlider2");

    expect(document.getElementById("shadeCount2").textContent).toBe("2"); // 2^1 at load
    let swatches = document.querySelectorAll("#shadeSwatches2 .shade-swatch");
    swatches[1].click(); // click the "on" (white) swatch at 1-bit
    expect(document.getElementById("previewCode2").textContent).toBe("1");
    expect(hitChips("chips2")).toBe(1);

    slider.value = "2";
    slider.dispatchEvent(new Event("input"));
    expect(document.getElementById("shadeCount2").textContent).toBe("4");
    swatches = document.querySelectorAll("#shadeSwatches2 .shade-swatch");
    swatches[3].click();
    expect(document.getElementById("previewCode2").textContent).toBe("11");
    expect(hitChips("chips2")).toBe(2);

    slider.value = "3";
    slider.dispatchEvent(new Event("input"));
    expect(document.getElementById("shadeCount2").textContent).toBe("8");
    swatches = document.querySelectorAll("#shadeSwatches2 .shade-swatch");
    swatches[7].click();
    expect(document.getElementById("previewCode2").textContent).toBe("111");

    expect(hitChips("chips2")).toBe(3);
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 3: stepping through all four densities updates the file-size counter and awards the star", () => {
    expect(document.getElementById("resLabel3").textContent).toBe("1×1"); // seeded, no chip yet
    expect(document.getElementById("resSize3").textContent).toBe("1 bit");

    const buttons = document.querySelectorAll("#resButtons3 .action-btn");
    const byLabel = label => Array.from(buttons).find(b => b.textContent === label);

    byLabel("8×8").click();
    expect(document.getElementById("resSize3").textContent).toBe("64 bits");
    expect(document.querySelectorAll("#resCanvas3 .res-cell").length).toBe(64);

    byLabel("4×4").click();
    expect(document.getElementById("resSize3").textContent).toBe("16 bits");

    byLabel("2×2").click();
    expect(document.getElementById("resSize3").textContent).toBe("4 bits");

    byLabel("1×1").click();
    expect(document.getElementById("resSize3").textContent).toBe("1 bit");

    expect(hitChips("chips3")).toBe(4);
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: tapping a few sample points then most of them awards the star", () => {
    const pts = document.querySelectorAll(".sample-pt");
    expect(pts.length).toBe(12);

    pts[0].click();
    pts[1].click(); // 2 active -> "few"
    expect(document.getElementById("sampleCount4").textContent).toBe("2");
    expect(hitChips("chips4")).toBe(1);

    for (let i = 2; i < 11; i++) pts[i].click(); // 11 active total -> "many"
    expect(document.getElementById("sampleCount4").textContent).toBe("11");
    expect(hitChips("chips4")).toBe(2);
    expect(isDiscoveryDone("d4")).toBe(true);

    // the reconstructed polyline should carry exactly the active points
    const sampledPoints = document.getElementById("sampledPoly").getAttribute("points").trim().split(" ");
    expect(sampledPoints.length).toBe(11);
  });

  test("discovery 5: picking one word from each group fills the sentence and awards the star", () => {
    const group1 = document.querySelectorAll("#group1 .word-chip");
    const group2 = document.querySelectorAll("#group2 .word-chip");

    group1[0].click(); // "higher"
    expect(document.getElementById("blank1").textContent).toBe("higher");
    expect(document.getElementById("blank1").classList.contains("filled")).toBe(true);
    expect(isDiscoveryDone("d5")).toBe(false);

    group2[1].click(); // "larger"
    expect(document.getElementById("blank2").textContent).toBe("larger");
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("discovery 5: only one word per group can be selected at a time", () => {
    const group1 = document.querySelectorAll("#group1 .word-chip");
    group1[0].click();
    group1[2].click();
    const pressed = Array.from(group1).filter(b => b.getAttribute("aria-pressed") === "true");
    expect(pressed.length).toBe(1);
    expect(pressed[0].textContent).toBe("clearer");
    expect(document.getElementById("blank1").textContent).toBe("clearer");
  });

  test("all five discoveries unlock the reflection card", () => {
    const cells = document.querySelectorAll("#pixelGrid1 .pixel-cell");
    for (let i = 0; i < 5; i++) cells[i].click();
    for (let i = 0; i < 5; i++) cells[i].click();

    const slider = document.getElementById("depthSlider2");
    document.querySelectorAll("#shadeSwatches2 .shade-swatch")[0].click();
    slider.value = "2";
    slider.dispatchEvent(new Event("input"));
    document.querySelectorAll("#shadeSwatches2 .shade-swatch")[0].click();
    slider.value = "3";
    slider.dispatchEvent(new Event("input"));
    document.querySelectorAll("#shadeSwatches2 .shade-swatch")[0].click();

    const buttons = document.querySelectorAll("#resButtons3 .action-btn");
    buttons.forEach(b => b.click());

    const pts = document.querySelectorAll(".sample-pt");
    pts[0].click();
    pts[1].click();
    for (let i = 2; i < 11; i++) pts[i].click();

    document.querySelectorAll("#group1 .word-chip")[0].click();
    document.querySelectorAll("#group2 .word-chip")[0].click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
