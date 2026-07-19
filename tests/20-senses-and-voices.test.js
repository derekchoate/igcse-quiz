const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

// Every discovery in this lesson (D1-D4) is driven by the same local
// tap+drag "sort board" helper (module.js's makeSortBoard) rather than a
// shared engine kit — see module.js's header. Tests drive the real
// markup/ids directly, mirroring Module 17's test conventions.
function chip(id) {
  return document.querySelector('.sort-chip[data-id="' + id + '"], .def-chip[data-id="' + id + '"]');
}
function binHead(label) {
  return Array.from(document.querySelectorAll(".sort-bin-head")).find(b => b.textContent === label);
}

describe("Module 18: Senses and Voices", () => {
  beforeEach(() => {
    loadModule("20-senses-and-voices.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: in or out", () => {
    const answers = {
      dev1: "Input device", dev2: "Input device", dev3: "Input device", dev4: "Input device",
      dev5: "Output device", dev6: "Output device", dev7: "Output device", dev8: "Output device"
    };

    test("sorting all eight devices awards the star", () => {
      Object.keys(answers).forEach(id => {
        chip(id).click();
        binHead(answers[id]).click();
      });
      expect(document.querySelectorAll("#bins1 .sort-item").length).toBe(8);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched device pick gives a warm redirect, never an error, and does not award a star", () => {
      chip("dev1").click(); // dev1 is Input device
      binHead("Output device").click(); // wrong socket on purpose
      expect(isDiscoveryDone("d1")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that socket/);
      expect(document.getElementById("toast").innerHTML).not.toMatch(/wrong|incorrect|error/i);
      expect(chip("dev1").classList.contains("placed")).toBe(false);
    });

    test("a touch screen is not in the device pile at all (it's genuinely both)", () => {
      expect(document.querySelectorAll("#pool1 .sort-chip").length).toBe(8);
      expect(document.body.textContent).toMatch(/touch screen/i);
    });
  });

  describe("discovery 2: kit the greenhouse", () => {
    const answers = { g1: "How wet is the soil?", g2: "How warm is the air?", g3: "How bright is it in here?", g4: "How much water vapour is in the air?" };

    test("fitting all four sensors awards the star", () => {
      Object.keys(answers).forEach(id => {
        chip(id).click();
        binHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("moisture in the humidity socket gives a warm redirect, not an error", () => {
      chip("g1").click(); // moisture
      binHead("How much water vapour is in the air?").click(); // humidity socket, wrong on purpose
      expect(isDiscoveryDone("d2")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that socket/);
      expect(chip("g1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 3: kit the car park", () => {
    test("proximity or infrared both fit the entrance socket — either order completes it", () => {
      chip("c1").click(); // proximity
      binHead("Knows a car has arrived, without touching it").click(); // entrance
      chip("c2").click(); // infrared
      binHead("Knows a car has left, without touching it").click(); // exit
      chip("c3").click(); // pressure
      binHead("Knows exactly how heavy an oversized vehicle is").click(); // weighbridge
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("infrared fits the entrance socket just as well as proximity does (multiple correct answers)", () => {
      chip("c2").click(); // infrared
      binHead("Knows a car has arrived, without touching it").click(); // entrance
      expect(chip("c2").classList.contains("placed")).toBe(true);
      expect(document.getElementById("toast").innerHTML).not.toMatch(/not that socket/i);
    });

    test("pressure at the entrance gives a warm redirect explaining why, never an error", () => {
      chip("c3").click(); // pressure
      binHead("Knows a car has arrived, without touching it").click(); // entrance, wrong on purpose
      expect(isDiscoveryDone("d3")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/without touching/);
      expect(document.getElementById("toast").innerHTML).not.toMatch(/wrong|incorrect|error/i);
      expect(chip("c3").classList.contains("placed")).toBe(false);
    });

    test("a socket that's already filled declines a second sensor without framing it as wrong", () => {
      chip("c1").click(); // proximity -> entrance
      binHead("Knows a car has arrived, without touching it").click();
      chip("c2").click(); // infrared -> entrance again (already filled)
      binHead("Knows a car has arrived, without touching it").click();
      expect(document.getElementById("toast").innerHTML).toMatch(/already has a sensor fitted/);
      expect(chip("c2").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 4: the weird ones", () => {
    const answers = { w1: "pH sensor", w2: "Magnetic field sensor", w3: "Accelerometer" };

    test("matching all three vivid uses awards the star", () => {
      Object.keys(answers).forEach(id => {
        chip(id).click();
        binHead(answers[id]).click();
      });
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a mismatched vivid-use pick gives a warm redirect, never an error", () => {
      chip("w1").click(); // pH
      binHead("Accelerometer").click(); // wrong on purpose
      expect(isDiscoveryDone("d4")).toBe(false);
      expect(document.getElementById("toast").innerHTML).toMatch(/Not that sensor/);
      expect(chip("w1").classList.contains("placed")).toBe(false);
    });
  });

  describe("discovery 5: design your own", () => {
    test("filling in all three free-text fields awards the star", () => {
      document.getElementById("own-place").value = "A bus";
      document.getElementById("own-place").dispatchEvent(new Event("input"));
      expect(isDiscoveryDone("d5")).toBe(false);

      document.getElementById("own-sensor").value = "A proximity sensor on the doors, to know when someone's still boarding.";
      document.getElementById("own-sensor").dispatchEvent(new Event("input"));
      expect(isDiscoveryDone("d5")).toBe(false);

      document.getElementById("own-output").value = "A speaker announcing the next stop.";
      document.getElementById("own-output").dispatchEvent(new Event("input"));
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
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

  test("the built module never mentions banned school vocabulary, including 'mark scheme'", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/mark scheme/i);
    expect(text).not.toMatch(/\b(test|quiz|exam|grade|homework)\b/i);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    const d1Answers = {
      dev1: "Input device", dev2: "Input device", dev3: "Input device", dev4: "Input device",
      dev5: "Output device", dev6: "Output device", dev7: "Output device", dev8: "Output device"
    };
    Object.keys(d1Answers).forEach(id => {
      chip(id).click();
      binHead(d1Answers[id]).click();
    });

    // D2
    const d2Answers = { g1: "How wet is the soil?", g2: "How warm is the air?", g3: "How bright is it in here?", g4: "How much water vapour is in the air?" };
    Object.keys(d2Answers).forEach(id => {
      chip(id).click();
      binHead(d2Answers[id]).click();
    });

    // D3
    chip("c1").click();
    binHead("Knows a car has arrived, without touching it").click();
    chip("c2").click();
    binHead("Knows a car has left, without touching it").click();
    chip("c3").click();
    binHead("Knows exactly how heavy an oversized vehicle is").click();

    // D4
    const d4Answers = { w1: "pH sensor", w2: "Magnetic field sensor", w3: "Accelerometer" };
    Object.keys(d4Answers).forEach(id => {
      chip(id).click();
      binHead(d4Answers[id]).click();
    });

    // D5
    document.getElementById("own-place").value = "A bus";
    document.getElementById("own-place").dispatchEvent(new Event("input"));
    document.getElementById("own-sensor").value = "A proximity sensor on the doors.";
    document.getElementById("own-sensor").dispatchEvent(new Event("input"));
    document.getElementById("own-output").value = "A speaker announcing the next stop.";
    document.getElementById("own-output").dispatchEvent(new Event("input"));

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
