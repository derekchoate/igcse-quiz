const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 11: The Fork in the Road", () => {
  beforeEach(() => {
    loadModule("11-the-fork-in-the-road.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  test("discovery 1: walking the fork with an adult age reaches Stop and awards the star", () => {
    const svgBtn = document.querySelector("#walk1 .fc-svg-wrap");
    svgBtn.click(); // start -> ask
    // feed the fork age 19 (his own age is on the dial)
    const ageBtn = Array.from(document.querySelectorAll("#walk1 .fc-in-btn")).find(b => b.textContent === "19");
    expect(ageBtn).toBeTruthy();
    ageBtn.click(); // ask -> dec (reads age, evaluates immediately on next steps)
    svgBtn.click(); // dec -> yesProc (19 >= 18)
    svgBtn.click(); // yesProc -> yesOut
    svgBtn.click(); // yesOut -> stop
    expect(isDiscoveryDone("d1")).toBe(true);
    expect(starCount()).toBe("✦ 1");
  });

  test("discovery 1: a child age takes the other road to Stop and still awards the star", () => {
    const svgBtn = document.querySelector("#walk1 .fc-svg-wrap");
    svgBtn.click();
    const ageBtn = Array.from(document.querySelectorAll("#walk1 .fc-in-btn")).find(b => b.textContent === "12");
    ageBtn.click();
    svgBtn.click(); // dec -> noProc
    svgBtn.click(); // noProc -> noOut
    svgBtn.click(); // noOut -> stop
    expect(isDiscoveryDone("d1")).toBe(true);
  });

  test("discovery 2: walking the loyalty-stamp fork with a Child ticket reaches Stop via the unwritten ELSE road", () => {
    const svgBtn = document.querySelector("#walk2 .fc-svg-wrap");
    svgBtn.click();
    const ticketBtn = Array.from(document.querySelectorAll("#walk2 .fc-in-btn")).find(b => b.textContent === "Child");
    expect(ticketBtn).toBeTruthy();
    ticketBtn.click();
    svgBtn.click(); // dec -> noProc (the quiet road)
    svgBtn.click(); // noProc -> noOut
    svgBtn.click(); // noOut -> stop
    expect(isDiscoveryDone("d2")).toBe(true);
    expect(starCount()).toBeTruthy();
  });

  test("discovery 3: trying every canteen item awards the star, and reading counts reflect stacking depth", () => {
    const items = ["Roti", "Noodles", "Rice", "Drink"];
    items.forEach(label => {
      const btn = Array.from(document.querySelectorAll("#menuRow3 .menu-btn")).find(b => b.textContent === label);
      btn.click();
    });
    expect(isDiscoveryDone("d3")).toBe(true);
    // Drink is the 4th (last) item — deepest in the stacked panel, still 1 in CASE
    const drinkBtn = Array.from(document.querySelectorAll("#menuRow3 .menu-btn")).find(b => b.textContent === "Drink");
    drinkBtn.click();
    expect(document.getElementById("stackCount3").textContent).toMatch(/Lines read: 4/);
    expect(document.getElementById("caseCount3").textContent).toMatch(/Lines read: 1/);
  });

  test("discovery 4: trying AND-both, AND-one, OR-any and OR-none awards the star", () => {
    const rain = document.getElementById("swRain4");
    const cold = document.getElementById("swCold4");
    const opOr = document.getElementById("opOr4");
    const opAnd = document.getElementById("opAnd4");

    // AND, both on -> fires
    rain.click(); cold.click();
    expect(document.getElementById("gateResult4").textContent).toMatch(/Wear a coat/);
    // AND, only one on -> fails
    cold.click(); // rain still on, cold off
    expect(document.getElementById("gateResult4").textContent).toMatch(/stays shut/);
    // OR, one on -> fires
    opOr.click();
    expect(document.getElementById("gateResult4").textContent).toMatch(/Wear a coat/);
    // OR, none on -> fails
    rain.click(); // now both off
    expect(document.getElementById("gateResult4").textContent).toMatch(/stays shut/);
    opAnd.click(); // back to AND for tidiness, not required

    expect(isDiscoveryDone("d4")).toBe(true);
  });

  test("discovery 5: trying all four Raining/NOT combinations awards the star", () => {
    const rain = document.getElementById("swRain5");
    const not = document.getElementById("swNot5");

    // Raining on, NOT off -> fires (umbrella)
    rain.click();
    expect(document.getElementById("gateResult5").textContent).toMatch(/Condition fires/);
    // Raining on, NOT on -> flips to false (t-shirt)
    not.click();
    expect(document.getElementById("gateResult5").textContent).toMatch(/doesn't fire/);
    // Raining off, NOT on -> flips to true (fires)
    rain.click();
    expect(document.getElementById("gateResult5").textContent).toMatch(/Condition fires/);
    // Raining off, NOT off -> false
    not.click();
    expect(document.getElementById("gateResult5").textContent).toMatch(/doesn't fire/);

    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("discovery 6: an incomplete or mismatched pick gives a warm redirect, never an error, and does not award a star", () => {
    const selects = document.querySelectorAll("#buildSlots6 select");
    selects[0].value = "c2"; // wrong condition
    selects[0].dispatchEvent(new Event("change"));
    expect(isDiscoveryDone("d6")).toBe(false);
    expect(document.getElementById("buildStatus6").textContent).toMatch(/asks something else/);
  });

  test("discovery 6: picking all three correct parts snaps the fork together and awards the star", () => {
    const selects = document.querySelectorAll("#buildSlots6 select");
    selects[0].value = "c1"; selects[0].dispatchEvent(new Event("change"));
    selects[1].value = "t1"; selects[1].dispatchEvent(new Event("change"));
    selects[2].value = "e1"; selects[2].dispatchEvent(new Event("change"));
    expect(isDiscoveryDone("d6")).toBe(true);
    expect(document.getElementById("buildCode6").textContent).toMatch(/QueueLimit/);
  });

  test("all six discoveries unlock the reflection card", () => {
    // D1
    let svgBtn = document.querySelector("#walk1 .fc-svg-wrap");
    svgBtn.click();
    Array.from(document.querySelectorAll("#walk1 .fc-in-btn")).find(b => b.textContent === "19").click();
    svgBtn.click(); svgBtn.click(); svgBtn.click();
    // D2
    svgBtn = document.querySelector("#walk2 .fc-svg-wrap");
    svgBtn.click();
    Array.from(document.querySelectorAll("#walk2 .fc-in-btn")).find(b => b.textContent === "Adult").click();
    svgBtn.click(); svgBtn.click(); svgBtn.click();
    // D3
    ["Roti", "Noodles", "Rice", "Drink"].forEach(label => {
      Array.from(document.querySelectorAll("#menuRow3 .menu-btn")).find(b => b.textContent === label).click();
    });
    // D4
    const rain4 = document.getElementById("swRain4");
    const cold4 = document.getElementById("swCold4");
    const opOr4 = document.getElementById("opOr4");
    rain4.click(); cold4.click();
    cold4.click();
    opOr4.click();
    rain4.click();
    // D5
    const rain5 = document.getElementById("swRain5");
    const not5 = document.getElementById("swNot5");
    rain5.click();
    not5.click();
    rain5.click();
    not5.click();
    // D6
    const selects = document.querySelectorAll("#buildSlots6 select");
    selects[0].value = "c1"; selects[0].dispatchEvent(new Event("change"));
    selects[1].value = "t1"; selects[1].dispatchEvent(new Event("change"));
    selects[2].value = "e1"; selects[2].dispatchEvent(new Event("change"));

    expect(starCount()).toBe("✦ 6");
    expect(reflectVisible()).toBe(true);
  });
});
