const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 27: The Software Layers", () => {
  beforeEach(() => {
    loadModule("29-the-software-layers.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: sort the software pile", () => {
    test("sorting a chip onto the wrong floor bounces back with a warm redirect, not a failure state", () => {
      const browserChip = document.querySelector('.sl-chip[data-id="browser"]');
      browserChip.click();
      const sysHead = Array.from(document.querySelectorAll(".sl-bin-head")).find(h => h.textContent.match(/System software/));
      sysHead.click();
      expect(browserChip.classList.contains("placed")).toBe(false);
      expect(document.getElementById("toast").textContent).toMatch(/Not that floor/i);
      expect(isDiscoveryDone("d1")).toBe(false);
    });

    test("sorting all six items onto their correct floors awards the star", () => {
      const answers = { browser: "Application software", os: "System software", compiler: "System software", game: "Application software", driver: "System software", utility: "System software" };
      Object.keys(answers).forEach(id => {
        const chip = document.querySelector('.sl-chip[data-id="' + id + '"]');
        chip.click();
        const head = Array.from(document.querySelectorAll(".sl-bin-head")).find(h => h.textContent.indexOf(answers[id]) === 0);
        head.click();
      });
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: the busy floor", () => {
    test("lists all nine syllabus-verbatim OS functions as bins", () => {
      const heads = Array.from(document.querySelectorAll("#officeBins2 .sl-bin-head")).map(h => h.textContent);
      expect(heads).toEqual([
        "Managing files",
        "Handling interrupts",
        "Providing an interface",
        "Managing peripherals and drivers",
        "Managing memory",
        "Managing multitasking",
        "Providing a platform for running applications",
        "Providing system security",
        "Managing user accounts"
      ]);
    });

    test("matching a scenario to the wrong job is a calm redirect, never an error", () => {
      const filesChip = document.querySelector('.sl-chip[data-id="files"]');
      filesChip.click();
      const wrongHead = Array.from(document.querySelectorAll("#officeBins2 .sl-bin-head")).find(h => h.textContent === "Managing memory");
      wrongHead.click();
      expect(document.getElementById("toast").textContent).not.toMatch(/error|wrong|incorrect/i);
      expect(isDiscoveryDone("d2")).toBe(false);
    });

    test("matching all nine scenarios awards the star", () => {
      const ids = ["files", "interrupts", "interface", "peripherals", "memory", "multitasking", "platform", "security", "accounts"];
      const labels = {
        files: "Managing files",
        interrupts: "Handling interrupts",
        interface: "Providing an interface",
        peripherals: "Managing peripherals and drivers",
        memory: "Managing memory",
        multitasking: "Managing multitasking",
        platform: "Providing a platform for running applications",
        security: "Providing system security",
        accounts: "Managing user accounts"
      };
      ids.forEach(id => {
        const chip = document.querySelector('.sl-chip[data-id="' + id + '"]');
        chip.click();
        const head = Array.from(document.querySelectorAll("#officeBins2 .sl-bin-head")).find(h => h.textContent === labels[id]);
        head.click();
      });
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: ring the bell", () => {
    test("the task starts on step 1 and continuing advances it", () => {
      const steps = document.querySelectorAll("#taskTrack3 .sl-task-step");
      expect(steps[0].classList.contains("current")).toBe(true);
      document.getElementById("continueBtn3").click();
      expect(steps[0].classList.contains("done")).toBe(true);
      expect(steps[1].classList.contains("current")).toBe(true);
    });

    test("firing an interrupt logs a bookmark, service and resume, and never frames it as an error", () => {
      document.getElementById("continueBtn3").click();
      document.getElementById("keyBtn3").click();
      const text = document.getElementById("log3").textContent;
      expect(text).toMatch(/bookmarks its place/i);
      expect(text).toMatch(/Interrupt service routine/i);
      expect(text).toMatch(/Resuming exactly at step/i);
      expect(text).not.toMatch(/error|fault|problem|urgent|emergency/i);
    });

    test("firing all three kinds of interrupt awards the star", () => {
      document.getElementById("continueBtn3").click();
      document.getElementById("keyBtn3").click();
      document.getElementById("printBtn3").click();
      document.getElementById("batteryBtn3").click();
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: why not just wait?", () => {
    test("reveals are hidden until pressed", () => {
      expect(document.getElementById("pollReveal4").hidden).toBe(true);
      expect(document.getElementById("interruptReveal4").hidden).toBe(true);
    });

    test("trying both approaches awards the star", () => {
      document.getElementById("pollBtn4").click();
      document.getElementById("interruptBtn4").click();
      expect(document.getElementById("pollReveal4").hidden).toBe(false);
      expect(document.getElementById("interruptReveal4").hidden).toBe(false);
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: the morning routine", () => {
    test("tapping a step out of order is a calm redirect, never an error", () => {
      const readyChip = document.querySelector('.sl-chip[data-id="ready"]');
      readyChip.click();
      expect(readyChip.classList.contains("placed")).toBe(false);
      expect(document.getElementById("toast").textContent).not.toMatch(/error|wrong|incorrect/i);
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("tapping the four steps in the correct order awards the star", () => {
      ["power", "firmware", "load", "ready"].forEach(id => {
        document.querySelector('.sl-chip[data-id="' + id + '"]').click();
      });
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("the built module never mentions banned school vocabulary", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bcorrect\b|\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });

  test("the interrupt discovery never frames interrupts as an error or alarm", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/interrupt.{0,40}(error|fault|alarm)/i);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    ["browser", "os", "compiler", "game", "driver", "utility"].forEach(id => {
      const answers = { browser: "Application software", os: "System software", compiler: "System software", game: "Application software", driver: "System software", utility: "System software" };
      document.querySelector('.sl-chip[data-id="' + id + '"]').click();
      Array.from(document.querySelectorAll(".sl-bin-head")).find(h => h.textContent.indexOf(answers[id]) === 0).click();
    });
    // D2
    const labels = {
      files: "Managing files", interrupts: "Handling interrupts", interface: "Providing an interface",
      peripherals: "Managing peripherals and drivers", memory: "Managing memory", multitasking: "Managing multitasking",
      platform: "Providing a platform for running applications", security: "Providing system security", accounts: "Managing user accounts"
    };
    Object.keys(labels).forEach(id => {
      document.querySelector('.sl-chip[data-id="' + id + '"]').click();
      Array.from(document.querySelectorAll("#officeBins2 .sl-bin-head")).find(h => h.textContent === labels[id]).click();
    });
    // D3
    document.getElementById("continueBtn3").click();
    document.getElementById("keyBtn3").click();
    document.getElementById("printBtn3").click();
    document.getElementById("batteryBtn3").click();
    // D4
    document.getElementById("pollBtn4").click();
    document.getElementById("interruptBtn4").click();
    // D5
    ["power", "firmware", "load", "ready"].forEach(id => {
      document.querySelector('.sl-chip[data-id="' + id + '"]').click();
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
