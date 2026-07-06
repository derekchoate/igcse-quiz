const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// Every sort discovery here (D1, D2, D3, D5) is driven by the same local
// tap+drag "sort board" helper (module.js's makeSortBoard, ported from
// Module 18) rather than a shared engine kit — see module.js's header.
// Tests drive the real markup/ids directly, mirroring Module 18's test
// conventions.
function chip(id) {
  return document.querySelector('.sort-chip[data-id="' + id + '"]');
}
function binHead(label) {
  return Array.from(document.querySelectorAll(".sort-bin-head")).find(b => b.textContent === label);
}

describe("Module 19: Where Things Live", () => {
  beforeEach(() => {
    loadModule("19-where-things-live.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: pull the plug", () => {
    test("the power switch dims only the RAM district, and can be flipped back", () => {
      const ramDistrict = document.getElementById("ramDistrict1");
      expect(ramDistrict.classList.contains("lit")).toBe(true);
      expect(ramDistrict.classList.contains("dark")).toBe(false);

      document.getElementById("powerSwitch1").click();
      expect(ramDistrict.classList.contains("dark")).toBe(true);
      expect(document.getElementById("powerReadout1").textContent).toMatch(/RAM just went dark/);

      document.getElementById("powerSwitch1").click();
      expect(ramDistrict.classList.contains("dark")).toBe(false);
      expect(ramDistrict.classList.contains("lit")).toBe(true);
    });

    test("flipping the power never touches any other district in the markup", () => {
      const otherDistricts = Array.from(document.querySelectorAll("#cityMap1 .district"))
        .filter(d => d.id !== "ramDistrict1");
      expect(otherDistricts.length).toBe(3);
      document.getElementById("powerSwitch1").click();
      otherDistricts.forEach(d => {
        expect(d.classList.contains("dark")).toBe(false);
        expect(d.classList.contains("lit")).toBe(true);
      });
    });

    test("sorting all six things by what survives a power cut awards the star", () => {
      const answers = {
        r1: "Gone the instant the power cuts",
        r2: "Survives a power cut",
        r3: "Survives a power cut",
        r4: "Gone the instant the power cuts",
        r5: "Survives a power cut",
        r6: "Gone the instant the power cuts"
      };
      Object.keys(answers).forEach(id => {
        chip(id).click();
        binHead(answers[id]).click();
      });
      expect(document.querySelectorAll("#bins1 .sort-item").length).toBe(6);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched pick gives a warm redirect, never an error, and does not award a star", () => {
      chip("r1").click(); // r1 is Gone
      binHead("Survives a power cut").click(); // wrong socket on purpose
      expect(isDiscoveryDone("d1")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that socket/);
      expect(document.getElementById("toast").innerHTML).not.toMatch(/wrong|incorrect|error/i);
      expect(chip("r1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 2: ROM, the unforgetting", () => {
    const answers = { t1: "RAM", t2: "ROM", t3: "RAM", t4: "ROM", t5: "RAM", t6: "ROM" };

    test("sorting all six traits into RAM or ROM awards the star", () => {
      Object.keys(answers).forEach(id => {
        chip(id).click();
        binHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched trait pick gives a warm redirect, not an error", () => {
      chip("t1").click(); // t1 is RAM
      binHead("ROM").click(); // wrong on purpose
      expect(isDiscoveryDone("d2")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that socket/);
      expect(chip("t1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 3: three warehouses", () => {
    const answers = {
      w1: "The spin-drive (HDD)", w2: "The disc (CD, DVD, Blu-ray)", w3: "The chip (SSD)",
      w4: "The chip (SSD)", w5: "The spin-drive (HDD)", w6: "The disc (CD, DVD, Blu-ray)",
      w7: "The spin-drive (HDD)", w8: "The chip (SSD)", w9: "The disc (CD, DVD, Blu-ray)"
    };

    test("sorting all nine trait cards into the three warehouses awards the star", () => {
      Object.keys(answers).forEach(id => {
        chip(id).click();
        binHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched card gives a warm redirect, not an error", () => {
      chip("w1").click(); // w1 is the spin-drive
      binHead("The chip (SSD)").click(); // wrong on purpose
      expect(isDiscoveryDone("d3")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that warehouse/);
      expect(chip("w1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 4: the overflow bus", () => {
    test("four opens fill RAM (1 tick each); a fifth forces an overflow at 20 ticks", () => {
      const openBtn = document.getElementById("openApp4");
      openBtn.click();
      openBtn.click();
      openBtn.click();
      openBtn.click();
      let log = document.getElementById("benchLog4").textContent;
      expect(log).toMatch(/App 4 opened straight into RAM — 1 tick\./);
      expect(isDiscoveryDone("d4")).toBe(false); // only "filled" tried so far

      const slotsBefore = Array.from(document.querySelectorAll("#ramBank4 .ram-slot")).map(s => s.textContent);
      expect(slotsBefore).toEqual(["App 1", "App 2", "App 3", "App 4"]);

      openBtn.click(); // fifth app: RAM is full
      log = document.getElementById("benchLog4").textContent;
      expect(log).toMatch(/RAM was full — App 1 paged out to disk to make room, then App 5 loaded — 20 ticks\./);
      expect(document.querySelectorAll("#pagedList4 .paged-item").length).toBe(1);

      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("the overflow log never frames the slowdown as an error or a failure", () => {
      const openBtn = document.getElementById("openApp4");
      for (let i = 0; i < 5; i++) openBtn.click();
      const log = document.getElementById("benchLog4").textContent;
      expect(log).toMatch(/20 ticks/);
      expect(log).not.toMatch(/wrong|incorrect|error|fail/i);
    });
  });

  describe("discovery 5: someone else's computer", () => {
    const answers = {
      c1: "A genuine upside", c2: "A genuine upside", c3: "A genuine upside", c4: "A genuine upside",
      c5: "An honest downside", c6: "An honest downside", c7: "An honest downside", c8: "An honest downside"
    };

    test("sorting all eight statements into upsides and downsides awards the star", () => {
      Object.keys(answers).forEach(id => {
        chip(id).click();
        binHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("cloud storage's honest downsides are represented, not just the flattering upsides", () => {
      const text = document.body.textContent;
      expect(text).toMatch(/internet connection/i);
      expect(text).toMatch(/subscription cost/i);
      expect(text).toMatch(/trusting somewhere else/i);
    });

    test("a mismatched statement gives a warm redirect, not an error", () => {
      chip("c5").click(); // c5 is a downside
      binHead("A genuine upside").click(); // wrong on purpose
      expect(isDiscoveryDone("d5")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that column/);
      expect(chip("c5").classList.contains("placed")).toBe(false);
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      // Rung 0 must be visible without clicking any other nudge first.
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("the built module never mentions banned school vocabulary", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/mark scheme/i);
    expect(text).not.toMatch(/\b(test|quiz|exam|grade|homework)\b/i);
  });

  test("virtual memory is described as a speed trade-off, never as free extra RAM", () => {
    const text = document.body.textContent;
    expect(text).toMatch(/not.{0,40}extra RAM/i);
    expect(text).toMatch(/keeps everything running, not making everything run fast|keeping everything running, not making everything run fast/i);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    const d1Answers = {
      r1: "Gone the instant the power cuts", r2: "Survives a power cut", r3: "Survives a power cut",
      r4: "Gone the instant the power cuts", r5: "Survives a power cut", r6: "Gone the instant the power cuts"
    };
    Object.keys(d1Answers).forEach(id => {
      chip(id).click();
      binHead(d1Answers[id]).click();
    });

    // D2
    const d2Answers = { t1: "RAM", t2: "ROM", t3: "RAM", t4: "ROM", t5: "RAM", t6: "ROM" };
    Object.keys(d2Answers).forEach(id => {
      chip(id).click();
      binHead(d2Answers[id]).click();
    });

    // D3
    const d3Answers = {
      w1: "The spin-drive (HDD)", w2: "The disc (CD, DVD, Blu-ray)", w3: "The chip (SSD)",
      w4: "The chip (SSD)", w5: "The spin-drive (HDD)", w6: "The disc (CD, DVD, Blu-ray)",
      w7: "The spin-drive (HDD)", w8: "The chip (SSD)", w9: "The disc (CD, DVD, Blu-ray)"
    };
    Object.keys(d3Answers).forEach(id => {
      chip(id).click();
      binHead(d3Answers[id]).click();
    });

    // D4
    const openBtn = document.getElementById("openApp4");
    for (let i = 0; i < 5; i++) openBtn.click();

    // D5
    const d5Answers = {
      c1: "A genuine upside", c2: "A genuine upside", c3: "A genuine upside", c4: "A genuine upside",
      c5: "An honest downside", c6: "An honest downside", c7: "An honest downside", c8: "An honest downside"
    };
    Object.keys(d5Answers).forEach(id => {
      chip(id).click();
      binHead(d5Answers[id]).click();
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
