const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function sortBtnByLabel(item, label) {
  return Array.from(item.querySelectorAll(".sort-btn")).find(b => b.textContent === label);
}

describe("Module 7: The Recipe Idea", () => {
  beforeEach(() => {
    loadModule("07-the-recipe-idea.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  test("discovery 1: visiting all four PDLC stages awards the star", () => {
    const items = document.querySelectorAll("#stageList1 .stage-item");
    expect(items.length).toBe(4);

    items[0].querySelector(".stage-btn").click();
    expect(items[0].classList.contains("done")).toBe(true);
    expect(items[0].querySelector(".stage-text").textContent).toMatch(/annoying questions/);
    expect(isDiscoveryDone("d1")).toBe(false);

    items[1].querySelector(".stage-btn").click();
    items[2].querySelector(".stage-btn").click();
    items[3].querySelector(".stage-btn").click();

    expect(isDiscoveryDone("d1")).toBe(true);
    expect(starCount()).toBe("✦ 1");
  });

  test("discovery 2: sorting all four gadget pieces correctly awards the star", () => {
    const items = document.querySelectorAll("#sortList2 .sort-item");
    expect(items.length).toBe(4);
    const answers = ["Input", "Process", "Output", "Storage"];
    items.forEach((item, i) => {
      sortBtnByLabel(item, answers[i]).click();
      expect(item.classList.contains("solved")).toBe(true);
    });
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 2: picking the wrong bucket redirects without locking", () => {
    const items = document.querySelectorAll("#sortList2 .sort-item");
    const wrongBtn = sortBtnByLabel(items[0], "Output"); // moisture reading is Input, not Output
    wrongBtn.click();
    expect(items[0].classList.contains("solved")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/does it come from outside/);
  });

  test("discovery 3: the price-list item accepts either Storage or Input", () => {
    const items = document.querySelectorAll("#sortList3 .sort-item");
    const priceListItem = Array.from(items).find(i => i.querySelector(".sort-text").textContent.includes("price list"));
    expect(priceListItem).toBeTruthy();

    sortBtnByLabel(priceListItem, "Input").click();
    expect(priceListItem.classList.contains("solved")).toBe(true);
    // secondary (non-primary) pick should still get a warm confirmation, with a gentle note
    expect(document.getElementById("toast").innerHTML).toMatch(/Storage would work just as well/);
  });

  test("discovery 3: the price-list item locks cleanly on its primary answer too, no extra note", () => {
    loadModule("07-the-recipe-idea.html"); // fresh instance
    const items = document.querySelectorAll("#sortList3 .sort-item");
    const priceListItem = Array.from(items).find(i => i.querySelector(".sort-text").textContent.includes("price list"));
    sortBtnByLabel(priceListItem, "Storage").click();
    expect(priceListItem.classList.contains("solved")).toBe(true);
    expect(document.getElementById("toast").innerHTML).not.toMatch(/would work just as well/);
  });

  test("discovery 3: sorting all six till pieces awards the star", () => {
    const items = document.querySelectorAll("#sortList3 .sort-item");
    expect(items.length).toBe(6);
    const answers = ["Input", "Storage", "Process", "Output", "Storage", "Process"];
    items.forEach((item, i) => {
      sortBtnByLabel(item, answers[i]).click();
    });
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: each wrong choice gives its own specific redirect, none lock the board", () => {
    const choices = document.querySelectorAll("#decompChoices4 .decomp-choice");
    const byText = t => Array.from(choices).find(b => b.textContent === t);

    byText("A brighter light by the door").click();
    expect(document.getElementById("toast").innerHTML).toMatch(/doesn't fix the actual hole/);
    expect(document.querySelector(".decomp-col.filled")).toBeNull();

    byText("The doorbell button").click();
    expect(document.getElementById("toast").innerHTML).toMatch(/already on the board/);
    expect(isDiscoveryDone("d4")).toBe(false);
  });

  test("discovery 4: the correct choice fills the Output column and awards the star", () => {
    const choices = document.querySelectorAll("#decompChoices4 .decomp-choice");
    const correct = Array.from(choices).find(b => b.textContent === "A notification sent to your phone");
    correct.click();

    const outputCol = document.querySelectorAll("#decompBoard4 .decomp-col")[2]; // Input, Process, Output, Storage
    expect(outputCol.querySelector("h4").textContent).toBe("Output");
    expect(outputCol.querySelector(".decomp-placeholder")).toBeNull();
    expect(outputCol.textContent).toMatch(/A notification sent to your phone/);
    expect(isDiscoveryDone("d4")).toBe(true);

    // board is locked after solving
    Array.from(choices).forEach(b => expect(b.hasAttribute("disabled")).toBe(true));
  });

  test("discovery 5: filling all four boxes awards the star; partial does not", () => {
    const boxes = ["own-input", "own-process", "own-output"];
    boxes.forEach(id => {
      const ta = document.getElementById(id);
      ta.value = "something";
      ta.dispatchEvent(new Event("input"));
    });
    expect(isDiscoveryDone("d5")).toBe(false);

    document.getElementById("own-storage").value = "something else";
    document.getElementById("own-storage").dispatchEvent(new Event("input"));
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    document.querySelectorAll("#stageList1 .stage-item").forEach(item => item.querySelector(".stage-btn").click());

    const d2answers = ["Input", "Process", "Output", "Storage"];
    document.querySelectorAll("#sortList2 .sort-item").forEach((item, i) => sortBtnByLabel(item, d2answers[i]).click());

    const d3answers = ["Input", "Storage", "Process", "Output", "Storage", "Process"];
    document.querySelectorAll("#sortList3 .sort-item").forEach((item, i) => sortBtnByLabel(item, d3answers[i]).click());

    Array.from(document.querySelectorAll("#decompChoices4 .decomp-choice"))
      .find(b => b.textContent === "A notification sent to your phone").click();

    ["own-input", "own-process", "own-output", "own-storage"].forEach(id => {
      const ta = document.getElementById(id);
      ta.value = "x";
      ta.dispatchEvent(new Event("input"));
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
