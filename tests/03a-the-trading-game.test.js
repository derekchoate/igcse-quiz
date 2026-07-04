const {
  loadModule,
  starCount,
  hitChips,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

const click = id => document.getElementById(id).click();
const text = id => document.getElementById(id).textContent;

describe("Module 3a: The Trading Game", () => {
  beforeEach(() => {
    loadModule("03a-the-trading-game.html");
  });

  test("starts at zero stars, and D5's seeded pile of 19 pre-hits nothing", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    // D5 is seeded at 19 under trade-rule 10 on load, which is itself a chip
    // target — the seeding guard must stop it firing before a real press.
    ["chips2", "chips3", "chips4", "chips5"].forEach(id => {
      expect(hitChips(id)).toBe(0);
    });
    expect(text("reads5")).toBe("19");
    expect(text("total5")).toBe("19");
  });

  test("discovery 1: lining the pile up in tens awards the star", () => {
    expect(isDiscoveryDone("d1")).toBe(false);
    click("groupBtn");
    expect(document.getElementById("pileCap1").textContent).toContain("37");
    expect(isDiscoveryDone("d1")).toBe(true);
    // toggling back and forth never un-does anything
    click("groupBtn");
    click("groupBtn");
    expect(isDiscoveryDone("d1")).toBe(true);
    expect(starCount()).toBe("✦ 1");
  });

  test("discovery 2: the tenth bean trades up, and 10 → 23 → 42 lights every chip", () => {
    for (let i = 0; i < 9; i++) click("drop2");
    expect(text("reads2")).toBe("9");
    click("drop2"); // the tenth: bundle and slide left
    expect(text("reads2")).toBe("10");
    expect(hitChips("chips2")).toBe(1);

    // up to 23: two more handfuls and three beans
    click("hand2"); click("hand2");
    for (let i = 0; i < 3; i++) click("drop2");
    expect(text("reads2")).toBe("23");
    expect(text("sums2")).toBe("20 + 3 = 23");
    expect(hitChips("chips2")).toBe(2);

    // up to 42: passing 40 must not disturb anything
    click("hand2"); click("hand2"); click("hand2");
    for (let i = 0; i < 4; i++) click("drop2");
    expect(text("reads2")).toBe("42");
    expect(text("sums2")).toBe("40 + 2 = 42");
    expect(hitChips("chips2")).toBe(3);
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 2: taking a bean back from a fresh bag un-trades it (borrowing)", () => {
    for (let i = 0; i < 10; i++) click("drop2");
    expect(text("reads2")).toBe("10");
    click("take2"); // the bag must open back into ten, minus the one removed
    expect(text("reads2")).toBe("9");
    click("take2");
    expect(text("reads2")).toBe("8");
  });

  test("discovery 3: opening all three benches awards the star", () => {
    click("bagTenBtn");
    expect(document.getElementById("benchTenCap").hidden).toBe(false);
    expect(hitChips("chips3")).toBe(1);

    click("bagHundredBtn"); // stage 1: ten bags of ten
    expect(document.getElementById("bagHundredMore").hidden).toBe(false);
    click("bagHundredMore"); // stage 2: 100 beans
    expect(hitChips("chips3")).toBe(2);

    click("spillBtn"); // 9 bags × 10 = 90
    expect(document.getElementById("benchSpillCap").hidden).toBe(false);
    expect(hitChips("chips3")).toBe(3);
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: the two-trade builds binary readings and reveals cup values", () => {
    for (let i = 0; i < 5; i++) click("drop4");
    expect(text("total4")).toBe("5");
    expect(text("reads4")).toBe("101");
    expect(text("sums4")).toBe("4 + 1 = 5");
    expect(hitChips("chips4")).toBe(1);

    // cups that have received a token show their value; untouched cups stay "?"
    const plaques = Array.from(
      document.querySelectorAll("#machine4 .cup-plaque")
    ).map(p => p.textContent); // rendered left-to-right: 16, 8, 4, 2, 1
    expect(plaques[4]).toBe("beans · worth 1");
    expect(plaques[2]).toBe("bags of 4");
    expect(plaques[0]).toBe("?"); // the 16 cup hasn't been reached yet

    for (let i = 0; i < 14; i++) click("drop4"); // on to 19
    expect(text("total4")).toBe("19");
    expect(text("reads4")).toBe("10011");
    expect(text("sums4")).toBe("16 + 2 + 1 = 19");
    expect(hitChips("chips4")).toBe(2);

    click("fourBagBtn"); // two bags of two
    click("fourBagMore"); // four beans: 2 × 2 = 4
    expect(hitChips("chips4")).toBe(3);
    expect(isDiscoveryDone("d4")).toBe(true);
  });

  test("discovery 5: the same 19 beans read 19, 10011 and 13 under the three rules", () => {
    click("ruleBtn2");
    expect(text("reads5")).toBe("10011");
    expect(text("total5")).toBe("19");
    expect(hitChips("chips5")).toBe(1);

    click("ruleBtn16");
    expect(text("reads5")).toBe("13");
    expect(text("total5")).toBe("19");
    expect(document.getElementById("hexNote5").hidden).toBe(false);
    expect(hitChips("chips5")).toBe(2);

    click("ruleBtn10");
    expect(text("reads5")).toBe("19");
    expect(document.getElementById("hexNote5").hidden).toBe(true);
    expect(hitChips("chips5")).toBe(3);
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("discovery 5: hex digits appear for counts past nine, and the pile caps at 31", () => {
    click("ruleBtn16");
    for (let i = 0; i < 8; i++) click("drop5"); // 19 → 27: reads 1B
    expect(text("reads5")).toBe("1B");
    for (let i = 0; i < 10; i++) click("drop5"); // tries past 31, capped
    expect(text("total5")).toBe("31");
    expect(text("reads5")).toBe("1F");
    click("ruleBtn2"); // 31 must still fit the five cups
    expect(text("reads5")).toBe("11111");
  });

  test("all five discoveries unlock the reflection card", () => {
    click("groupBtn");

    for (let i = 0; i < 8; i++) click("hand2");
    for (let i = 0; i < 2; i++) click("drop2");

    click("bagTenBtn");
    click("bagHundredBtn");
    click("bagHundredMore");
    click("spillBtn");

    for (let i = 0; i < 19; i++) click("drop4");
    click("fourBagBtn");
    click("fourBagMore");

    click("ruleBtn2");
    click("ruleBtn16");
    click("ruleBtn10");

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
