const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function shapeBtn(item, label) {
  return Array.from(item.querySelectorAll(".shape-btn")).find(b => b.textContent === label);
}
function stepWalk(mountId, times) {
  const diagram = document.querySelector("#" + mountId + " .fc-svg-wrap");
  for (let i = 0; i < times; i++) diagram.click();
}
function inputBtn(mountId, value) {
  return Array.from(document.querySelectorAll("#" + mountId + " .fc-in-btn"))
    .find(b => b.textContent === String(value));
}

describe("Module 8: Reading the Map", () => {
  beforeEach(() => {
    loadModule("08-reading-the-map.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  test("discovery 1: matching all five shapes to their jobs awards the star", () => {
    const items = document.querySelectorAll("#shapeList1 .shape-item");
    expect(items.length).toBe(5);
    const answers = ["Start / stop", "Data in or out", "A step", "A yes/no question", "The order to follow"];
    items.forEach((item, i) => {
      shapeBtn(item, answers[i]).click();
      expect(item.classList.contains("solved")).toBe(true);
    });
    expect(isDiscoveryDone("d1")).toBe(true);
    expect(starCount()).toBe("✦ 1");
  });

  test("discovery 1: a wrong job pick redirects without locking the row", () => {
    const items = document.querySelectorAll("#shapeList1 .shape-item");
    // first shape is the terminator; picking "A step" is wrong
    shapeBtn(items[0], "A step").click();
    expect(items[0].classList.contains("solved")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/look at the shape itself/);
  });

  test("discovery 2: stepping the token through the loop reaches Stop and awards the star", () => {
    expect(isDiscoveryDone("d2")).toBe(false);
    stepWalk("walk2", 20); // plenty of taps; extra taps are safe once halted
    expect(isDiscoveryDone("d2")).toBe(true);
    expect(document.querySelector("#walk2 .fc-svg-wrap").classList.contains("done")).toBe(true);
    expect(document.querySelector("#walk2 .fc-hint").textContent).toMatch(/Reached Stop/);
  });

  test("discovery 3: feeding the chart 7 drives it to Stop and awards the star", () => {
    stepWalk("walk3", 2); // Start -> prompt -> lands on Read (asks for input)
    expect(document.querySelector("#walk3 .fc-inputs").style.display).toBe("flex");
    inputBtn("walk3", 7).click();
    stepWalk("walk3", 3); // decision(yes) -> win -> stop
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 3: feeding a wrong number loops back for another guess", () => {
    stepWalk("walk3", 2);
    inputBtn("walk3", 5).click();
    stepWalk("walk3", 3); // decision(no) -> try again -> back to prompt -> Read (asks again)
    expect(isDiscoveryDone("d3")).toBe(false);
    expect(document.querySelector("#walk3 .fc-inputs").style.display).toBe("flex");
    // now finish it off
    inputBtn("walk3", 7).click();
    stepWalk("walk3", 3);
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: choosing the two consistent pieces snaps the chart and awards the star", () => {
    const selects = document.querySelectorAll("#repair4 .repair-slot select");
    expect(selects.length).toBe(2);
    const [a, b] = selects;

    a.value = "dec_pos";
    a.dispatchEvent(new Event("change"));
    expect(isDiscoveryDone("d4")).toBe(false);
    expect(document.getElementById("repairStatus4").textContent).toMatch(/if n is not above zero/);

    b.value = "out_notpos";
    b.dispatchEvent(new Event("change"));
    expect(isDiscoveryDone("d4")).toBe(true);
    expect(document.querySelectorAll("#repair4 .repair-slot.snapped").length).toBe(2);
  });

  test("discovery 4: an inconsistent first piece gives a specific redirect, no star", () => {
    const [a] = document.querySelectorAll("#repair4 .repair-slot select");
    a.value = "proc_inc";
    a.dispatchEvent(new Event("change"));
    expect(isDiscoveryDone("d4")).toBe(false);
    expect(document.getElementById("repairStatus4").textContent).toMatch(/send the path two ways/);
  });

  test("discovery 5: walking the doubling loop to Stop awards the star", () => {
    stepWalk("walk5", 20);
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    const items = document.querySelectorAll("#shapeList1 .shape-item");
    const d1answers = ["Start / stop", "Data in or out", "A step", "A yes/no question", "The order to follow"];
    items.forEach((item, i) => shapeBtn(item, d1answers[i]).click());
    // D2
    stepWalk("walk2", 20);
    // D3
    stepWalk("walk3", 2);
    inputBtn("walk3", 7).click();
    stepWalk("walk3", 3);
    // D4
    const [a, b] = document.querySelectorAll("#repair4 .repair-slot select");
    a.value = "dec_pos"; a.dispatchEvent(new Event("change"));
    b.value = "out_notpos"; b.dispatchEvent(new Event("change"));
    // D5
    stepWalk("walk5", 20);

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});

describe("Module 8: token highlight is exclusive", () => {
  beforeEach(() => loadModule("08-reading-the-map.html"));
  test("only the current node carries .cur after stepping", () => {
    const diagram = document.querySelector("#walk2 .fc-svg-wrap");
    diagram.click(); diagram.click(); diagram.click(); // start->ask->read->dec
    const cur = document.querySelectorAll("#walk2 .fcn.cur");
    expect(cur.length).toBe(1);
    expect(cur[0].getAttribute("data-id")).toBe("dec");
  });
});
