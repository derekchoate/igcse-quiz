const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 28: From Human to Machine", () => {
  beforeEach(() => {
    loadModule("28-from-human-to-machine.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: the ladder of languages", () => {
    test("the ladder button cycles through all three levels", () => {
      const btn = document.getElementById("ladderBtn1");
      expect(btn.textContent).toMatch(/High-level/);
      expect(document.getElementById("ladderPanel1").textContent).toMatch(/DECLARE Total/);
      btn.click();
      expect(btn.textContent).toMatch(/Assembly/);
      expect(document.getElementById("ladderPanel1").textContent).toMatch(/LOAD 200/);
      btn.click();
      expect(btn.textContent).toMatch(/Machine code/);
      expect(document.getElementById("ladderPanel1").textContent).toMatch(/0001 11001000/);
      btn.click();
      expect(btn.textContent).toMatch(/High-level/);
    });

    test("sorting a trade-off onto the wrong level bounces back with a warm redirect, not a failure state", () => {
      const chip = document.querySelector('#tradePool1 .fh-chip[data-id="read"]');
      chip.click();
      const lowHead = Array.from(document.querySelectorAll("#tradeBins1 .fh-bin-head")).find(h => h.textContent.match(/Low-level/));
      lowHead.click();
      expect(chip.classList.contains("placed")).toBe(false);
      expect(document.getElementById("toast").textContent).not.toMatch(/error|wrong|incorrect/i);
      expect(isDiscoveryDone("d1")).toBe(false);
    });

    test("sorting all four trade-offs awards the star", () => {
      const answers = { read: "High-level language", indep: "High-level language", hardread: "Low-level language", control: "Low-level language" };
      Object.keys(answers).forEach(id => {
        const chip = document.querySelector('#tradePool1 .fh-chip[data-id="' + id + '"]');
        chip.click();
        const head = Array.from(document.querySelectorAll("#tradeBins1 .fh-bin-head")).find(h => h.textContent === answers[id]);
        head.click();
      });
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: the two personalities", () => {
    test("displays the five-line program with the bug flagged on line 4, framed as belonging to the demo, not the learner", () => {
      const text = document.getElementById("prog2").textContent;
      expect(text).toMatch(/Scoer/);
      expect(text).toMatch(/the bug lives here/i);
      expect(text).not.toMatch(/you (made|typed|wrote) a mistake/i);
    });

    test("reveals are hidden until pressed", () => {
      expect(document.getElementById("compileReveal2").hidden).toBe(true);
      expect(document.getElementById("interpretReveal2").hidden).toBe(true);
    });

    test("the compiler reports before running anything; the interpreter runs three lines first", () => {
      document.getElementById("compileBtn2").click();
      const compileText = document.getElementById("compileLog2").textContent;
      expect(compileText).toMatch(/before running anything/i);
      expect(compileText).toMatch(/line 4/i);

      document.getElementById("interpretBtn2").click();
      const interpretText = document.getElementById("interpretLog2").textContent;
      expect(interpretText).toMatch(/Line 1/);
      expect(interpretText).toMatch(/Line 2/);
      expect(interpretText).toMatch(/Line 3/);
      expect(interpretText).toMatch(/stops right here/i);
    });

    test("never frames either translator stopping as a fault, failure or the learner's error", () => {
      document.getElementById("compileBtn2").click();
      document.getElementById("interpretBtn2").click();
      const text = document.getElementById("d2").textContent;
      expect(text).not.toMatch(/fault|failure|you got it wrong|your mistake/i);
    });

    test("trying both translators awards the star", () => {
      document.getElementById("compileBtn2").click();
      document.getElementById("interpretBtn2").click();
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: who's faster, who's friendlier", () => {
    test("matching a trade-off to the wrong translator is a calm redirect, never an error", () => {
      const chip = document.querySelector('#tradePool3 .fh-chip[data-id="livecatch"]');
      chip.click();
      const wrongHead = Array.from(document.querySelectorAll("#tradeBins3 .fh-bin-head")).find(h => h.textContent === "Compiler");
      wrongHead.click();
      expect(document.getElementById("toast").textContent).not.toMatch(/error|wrong|incorrect/i);
      expect(isDiscoveryDone("d3")).toBe(false);
    });

    test("sorting all six trade-offs awards the star", () => {
      const answers = {
        livecatch: "Interpreter", standalone: "Compiler", runfast: "Compiler",
        lineatatime: "Interpreter", wholereport: "Compiler", everyrun: "Interpreter"
      };
      Object.keys(answers).forEach(id => {
        const chip = document.querySelector('#tradePool3 .fh-chip[data-id="' + id + '"]');
        chip.click();
        const head = Array.from(document.querySelectorAll("#tradeBins3 .fh-bin-head")).find(h => h.textContent === answers[id]);
        head.click();
      });
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the assembler's small job", () => {
    test("states the mnemonic table explicitly before the task depends on it", () => {
      const text = document.getElementById("d4").textContent;
      expect(text).toMatch(/LOAD.*0001/);
      expect(text).toMatch(/ADD.*0010/);
      expect(text).toMatch(/STORE.*0011/);
    });

    test("the reveal caption is hidden until all three are matched", () => {
      expect(document.getElementById("revealNote4").hidden).toBe(true);
    });

    test("matching all three assembly lines to their machine code awards the star and shows the reveal", () => {
      const answers = { load: "0001 11001000", add: "0010 11001001", store: "0011 11001010" };
      Object.keys(answers).forEach(id => {
        const chip = document.querySelector('#asmPool4 .fh-chip[data-id="' + id + '"]');
        chip.click();
        const head = Array.from(document.querySelectorAll("#asmBins4 .fh-bin-head")).find(h => h.textContent === answers[id]);
        head.click();
      });
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(document.getElementById("revealNote4").hidden).toBe(false);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: tour the workshop", () => {
    test("lists all seven syllabus-verbatim IDE features as bins", () => {
      const heads = Array.from(document.querySelectorAll("#ideBins5 .fh-bin-head")).map(h => h.textContent);
      expect(heads).toEqual([
        "Code editor",
        "Run-time environment",
        "Translator",
        "Error diagnostics",
        "Auto-completion",
        "Auto-correction",
        "Prettyprint"
      ]);
    });

    test("matching a scenario to the wrong feature is a calm redirect, never an error", () => {
      const chip = document.querySelector('#idePool5 .fh-chip[data-id="editor"]');
      chip.click();
      const wrongHead = Array.from(document.querySelectorAll("#ideBins5 .fh-bin-head")).find(h => h.textContent === "Prettyprint");
      wrongHead.click();
      expect(document.getElementById("toast").textContent).not.toMatch(/error|wrong|incorrect/i);
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("matching all seven scenarios awards the star", () => {
      const answers = {
        editor: "Code editor", runtime: "Run-time environment", translator: "Translator",
        diagnostics: "Error diagnostics", completion: "Auto-completion",
        correction: "Auto-correction", prettyprint: "Prettyprint"
      };
      Object.keys(answers).forEach(id => {
        const chip = document.querySelector('#idePool5 .fh-chip[data-id="' + id + '"]');
        chip.click();
        const head = Array.from(document.querySelectorAll("#ideBins5 .fh-bin-head")).find(h => h.textContent === answers[id]);
        head.click();
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
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });

  test("all five discoveries unlock the reflection card", () => {
    // D1
    const d1answers = { read: "High-level language", indep: "High-level language", hardread: "Low-level language", control: "Low-level language" };
    Object.keys(d1answers).forEach(id => {
      document.querySelector('#tradePool1 .fh-chip[data-id="' + id + '"]').click();
      Array.from(document.querySelectorAll("#tradeBins1 .fh-bin-head")).find(h => h.textContent === d1answers[id]).click();
    });
    // D2
    document.getElementById("compileBtn2").click();
    document.getElementById("interpretBtn2").click();
    // D3
    const d3answers = {
      livecatch: "Interpreter", standalone: "Compiler", runfast: "Compiler",
      lineatatime: "Interpreter", wholereport: "Compiler", everyrun: "Interpreter"
    };
    Object.keys(d3answers).forEach(id => {
      document.querySelector('#tradePool3 .fh-chip[data-id="' + id + '"]').click();
      Array.from(document.querySelectorAll("#tradeBins3 .fh-bin-head")).find(h => h.textContent === d3answers[id]).click();
    });
    // D4
    const d4answers = { load: "0001 11001000", add: "0010 11001001", store: "0011 11001010" };
    Object.keys(d4answers).forEach(id => {
      document.querySelector('#asmPool4 .fh-chip[data-id="' + id + '"]').click();
      Array.from(document.querySelectorAll("#asmBins4 .fh-bin-head")).find(h => h.textContent === d4answers[id]).click();
    });
    // D5
    const d5answers = {
      editor: "Code editor", runtime: "Run-time environment", translator: "Translator",
      diagnostics: "Error diagnostics", completion: "Auto-completion",
      correction: "Auto-correction", prettyprint: "Prettyprint"
    };
    Object.keys(d5answers).forEach(id => {
      document.querySelector('#idePool5 .fh-chip[data-id="' + id + '"]').click();
      Array.from(document.querySelectorAll("#ideBins5 .fh-bin-head")).find(h => h.textContent === d5answers[id]).click();
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
