const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function dealSweets(n) {
  const btn = document.getElementById("swDeal4");
  for (let i = 0; i < n; i++) btn.click();
}

describe("Module 10: Boxes with Names", () => {
  beforeEach(() => {
    loadModule("10-boxes-with-names.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  test("discovery 1: stepping through all five lines declares, fills and prints the boxes, awarding the star", () => {
    document.getElementById("mkName1").value = "Priya";
    document.getElementById("mkAge1").value = "17";
    const step = document.getElementById("mkStep1");

    step.click(); // DECLARE Player
    expect(document.querySelectorAll("#mkBoxes1 .vbox").length).toBe(1);
    expect(document.querySelector("#mkBoxes1 .vbox").classList.contains("empty")).toBe(true);

    step.click(); // DECLARE Age
    expect(document.querySelectorAll("#mkBoxes1 .vbox").length).toBe(2);

    step.click(); // Player ← "Priya"
    expect(document.querySelectorAll("#mkBoxes1 .vbox.filled").length).toBe(1);
    expect(isDiscoveryDone("d1")).toBe(false);

    step.click(); // Age ← 17
    expect(document.querySelectorAll("#mkBoxes1 .vbox.filled").length).toBe(2);
    expect(isDiscoveryDone("d1")).toBe(false); // OUTPUT hasn't run yet

    step.click(); // OUTPUT Player, Age
    expect(document.getElementById("mkOut1").textContent).toMatch(/Priya/);
    expect(document.getElementById("mkOut1").textContent).toMatch(/17/);
    expect(isDiscoveryDone("d1")).toBe(true);
    expect(starCount()).toBe("✦ 1");
  });

  test("discovery 1: an empty name falls back to a friendly default, and reset clears everything", () => {
    document.getElementById("mkName1").value = "   ";
    const step = document.getElementById("mkStep1");
    for (let i = 0; i < 5; i++) step.click();
    expect(document.getElementById("mkOut1").textContent).toMatch(/Explorer/);

    document.getElementById("mkReset1").click();
    expect(document.querySelectorAll("#mkBoxes1 .vbox").length).toBe(0);
    expect(document.getElementById("mkOut1").textContent).toMatch(/nothing printed yet/);
  });

  test("discovery 2: fitting every box its own shape awards the star", () => {
    const chip = label => Array.from(document.querySelectorAll("#tyTray2 .ty-chip")).find(c => c.textContent === label);
    const box = name => Array.from(document.querySelectorAll("#tyBoxes2 .vbox")).find(b => b.querySelector(".vbox-name").textContent === name);

    chip("7").click(); box("Score").click();
    expect(box("Score").classList.contains("filled")).toBe(true);
    expect(isDiscoveryDone("d2")).toBe(false);

    chip("3.75").click(); box("Price").click();
    chip('"Warriors"').click(); box("Team").click();
    chip("'C'").click(); box("Seat").click();

    expect(isDiscoveryDone("d2")).toBe(true);
    expect(starCount()).toBeTruthy();
  });

  test("discovery 2: a shape mismatch gives a warm, specific redirect and does not fill the box or award a star", () => {
    const chip = label => Array.from(document.querySelectorAll("#tyTray2 .ty-chip")).find(c => c.textContent === label);
    const box = name => Array.from(document.querySelectorAll("#tyBoxes2 .vbox")).find(b => b.querySelector(".vbox-name").textContent === name);

    chip("3.75").click(); // a decimal
    box("Score").click(); // INTEGER box — doesn't fit

    expect(box("Score").classList.contains("filled")).toBe(false);
    expect(isDiscoveryDone("d2")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/INTEGER-shaped/);
  });

  test("discovery 3: attempting to change the constant and changing the ordinary box awards the star", () => {
    expect(document.getElementById("cnPiBox3").querySelector(".vbox-val").textContent).toBe("3.14");

    document.getElementById("cnTryConst3").click();
    expect(document.getElementById("cnPiBox3").querySelector(".vbox-val").textContent).toBe("3.14"); // unmoved
    expect(isDiscoveryDone("d3")).toBe(false);
    expect(document.getElementById("cnCap3").textContent).toMatch(/glued shut/);

    document.getElementById("cnTryVar3").click();
    expect(document.getElementById("cnPriceBox3").querySelector(".vbox-val").textContent).toBe("12");
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: dealing 17 sweets among 5 friends awards the star with DIV(17,5)=3 and MOD(17,5)=2", () => {
    dealSweets(16);
    expect(isDiscoveryDone("d4")).toBe(false);
    dealSweets(1); // the 17th sweet
    expect(document.getElementById("swDealt4").textContent).toBe("17");
    expect(document.getElementById("swDiv4").textContent).toBe("3");
    expect(document.getElementById("swMod4").textContent).toBe("2");
    expect(isDiscoveryDone("d4")).toBe(true);
  });

  test("discovery 4: reset returns the deal to zero without losing the star already earned", () => {
    dealSweets(17);
    expect(isDiscoveryDone("d4")).toBe(true);
    document.getElementById("swReset4").click();
    expect(document.getElementById("swDealt4").textContent).toBe("0");
    expect(isDiscoveryDone("d4")).toBe(true); // stars only ever go up
  });

  test("discovery 5: running all three programs reveals MOD, DIV and REAL division, awarding the star", () => {
    document.getElementById("prRun5a").click();
    expect(document.getElementById("prOut5a").textContent).toMatch(/2/);
    expect(isDiscoveryDone("d5")).toBe(false);

    document.getElementById("prRun5b").click();
    expect(document.getElementById("prOut5b").textContent).toMatch(/3/);
    expect(isDiscoveryDone("d5")).toBe(false);

    document.getElementById("prRun5c").click();
    expect(document.getElementById("prOut5c").textContent).toMatch(/3\.5/);
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    const step = document.getElementById("mkStep1");
    for (let i = 0; i < 5; i++) step.click();
    // D2
    const chip = label => Array.from(document.querySelectorAll("#tyTray2 .ty-chip")).find(c => c.textContent === label);
    const box = name => Array.from(document.querySelectorAll("#tyBoxes2 .vbox")).find(b => b.querySelector(".vbox-name").textContent === name);
    chip("7").click(); box("Score").click();
    chip("3.75").click(); box("Price").click();
    chip('"Warriors"').click(); box("Team").click();
    chip("'C'").click(); box("Seat").click();
    // D3
    document.getElementById("cnTryConst3").click();
    document.getElementById("cnTryVar3").click();
    // D4
    dealSweets(17);
    // D5
    document.getElementById("prRun5a").click();
    document.getElementById("prRun5b").click();
    document.getElementById("prRun5c").click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
