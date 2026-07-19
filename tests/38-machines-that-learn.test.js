const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

function clickButton(id, times) {
  for (let i = 0; i < times; i++) {
    const btn = document.getElementById(id);
    if (!btn) throw new Error("No button #" + id + " found (already removed after " + i + " clicks?)");
    btn.click();
  }
}

function openAllBoxes() {
  ["interface", "engine", "rulebase", "knowledge"].forEach(key => {
    document.getElementById("boxBtn-" + key).click();
  });
}

function tapSeqChip(id) {
  const chip = document.querySelector('#seqPool5 .seq-chip[data-id="' + id + '"]');
  if (!chip) throw new Error("No sequence chip with data-id " + id);
  chip.click();
}

function completeD5InOrder() {
  ["ow", "wf", "cw", "or", "rf", "cr"].forEach(tapSeqChip);
}

describe("Module 38: Machines that Learn", () => {
  beforeEach(() => {
    loadModule("38-machines-that-learn.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: tour the four boxes", () => {
    test("tapping a box reveals its panel and marks it expanded", () => {
      const btn = document.getElementById("boxBtn-interface");
      const panel = document.getElementById("boxPanel-interface");
      expect(panel.hidden).toBe(true);
      btn.click();
      expect(panel.hidden).toBe(false);
      expect(btn.getAttribute("aria-expanded")).toBe("true");
    });

    test("opening only some boxes does not award the star", () => {
      document.getElementById("boxBtn-interface").click();
      document.getElementById("boxBtn-engine").click();
      expect(isDiscoveryDone("d1")).toBe(false);
    });

    test("opening all four boxes awards the star", () => {
      openAllBoxes();
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: ask it something", () => {
    test("stepping through the full trace reveals the answer and awards the star", () => {
      clickButton("traceBtn2", 6);
      const rows = document.querySelectorAll("#timeline2 .xs-trace-row");
      expect(rows.length).toBe(6);
      expect(document.getElementById("answer2").hidden).toBe(false);
      expect(document.getElementById("answer2").textContent).toMatch(/Zebra Dove/);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("the star is not awarded before the trace finishes", () => {
      clickButton("traceBtn2", 5);
      expect(isDiscoveryDone("d2")).toBe(false);
    });
  });

  describe("discovery 3: teach it", () => {
    test("the first trace ends in a genuine 'no rule matched' diagnosis, not a failure", () => {
      clickButton("traceBtn3", 3);
      const note = document.getElementById("noMatchNote3");
      expect(note.hidden).toBe(false);
      expect(note.textContent).toMatch(/No rule matched/);
      // "not a failure" is the sanctioned reassuring negation (same pattern
      // as the house "no marks were ever given" line) — it's the framing,
      // not a punitive one, so check for the reassurance rather than ban
      // the word outright.
      expect(note.textContent).toMatch(/not a failure|not a fault/i);
      expect(note.textContent).not.toMatch(/\berror\b/i);
      expect(isDiscoveryDone("d3")).toBe(false);
      expect(document.getElementById("teachBtn3").hidden).toBe(false);
    });

    test("teaching it a new rule and fact, then re-asking, lands on the answer and awards the star", () => {
      clickButton("traceBtn3", 3);
      document.getElementById("teachBtn3").click();
      expect(document.getElementById("teachCard3").hidden).toBe(false);
      expect(document.getElementById("askAgainBtn3").hidden).toBe(false);
      clickButton("askAgainBtn3", 4);
      expect(document.getElementById("answer3").hidden).toBe(false);
      expect(document.getElementById("answer3").textContent).toMatch(/Olive-backed Sunbird/);
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the other way", () => {
    test("an early, unconfident guess is framed as still learning, never as a wrong answer", () => {
      clickButton("feedBtn4", 1);
      const row = document.querySelector("#timeline4 .xs-trace-row");
      expect(row.textContent).toMatch(/Not enough to go on yet/);
      expect(row.textContent).not.toMatch(/wrong answer|incorrect/i);
      expect(isDiscoveryDone("d4")).toBe(false);
    });

    test("feeding all five examples sharpens the guess to the mystery bird and awards the star", () => {
      clickButton("feedBtn4", 5);
      const rows = document.querySelectorAll("#timeline4 .xs-trace-row");
      expect(rows.length).toBe(5);
      expect(rows[4].textContent).toMatch(/Olive-backed Sunbird/);
      expect(document.getElementById("note4").hidden).toBe(false);
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: files, the last piece", () => {
    test("tapping a line out of order gives a warm redirect, never wrong/incorrect", () => {
      tapSeqChip("wf"); // WRITEFILE before the file is even opened
      const status = document.getElementById("status5");
      expect(status.textContent).toMatch(/has to come first/);
      expect(document.querySelectorAll("#seqBuild5 .seq-line").length).toBe(0);
      expect(isDiscoveryDone("d5")).toBe(false);
    });

    test("tapping all six lines in the correct order builds the sequence and awards the star", () => {
      completeD5InOrder();
      const lines = document.querySelectorAll("#seqBuild5 .seq-line");
      expect(lines.length).toBe(6);
      expect(lines[0].textContent).toMatch(/OPENFILE "Birds\.txt" FOR WRITE/);
      expect(lines[1].textContent).toMatch(/WRITEFILE "Birds\.txt", NewFact/);
      expect(lines[2].textContent).toMatch(/CLOSEFILE "Birds\.txt"/);
      expect(lines[3].textContent).toMatch(/OPENFILE "Birds\.txt" FOR READ/);
      expect(lines[4].textContent).toMatch(/READFILE "Birds\.txt", LoadedFact/);
      expect(lines[5].textContent).toMatch(/CLOSEFILE "Birds\.txt"/);
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 6: the ceremony", () => {
    test("the constellation grid holds six real dots and thirty-five symbolic ones", () => {
      expect(document.querySelectorAll("#constMine .const-dot").length).toBe(6);
      expect(document.querySelectorAll("#constRest .const-dot").length).toBe(35);
      expect(document.querySelectorAll("#constMine .const-dot.lit").length).toBe(0);
      expect(document.querySelectorAll("#constRest .const-dot.lit").length).toBe(0);
    });

    test("pressing 'Assemble the constellation' before any other discovery still lights only its own dot and awards the star", () => {
      document.getElementById("assembleBtn6").click();
      expect(document.querySelectorAll("#constMine .const-dot.lit").length).toBe(1);
      expect(document.querySelectorAll("#constRest .const-dot.lit").length).toBe(35);
      expect(document.getElementById("ceremonyNote6").hidden).toBe(false);
      expect(isDiscoveryDone("d6")).toBe(true);
    });

    test("pressing 'Assemble the constellation' after every other discovery lights all six real dots", () => {
      openAllBoxes();
      clickButton("traceBtn2", 6);
      clickButton("traceBtn3", 3);
      document.getElementById("teachBtn3").click();
      clickButton("askAgainBtn3", 4);
      clickButton("feedBtn4", 5);
      completeD5InOrder();
      document.getElementById("assembleBtn6").click();
      expect(document.querySelectorAll("#constMine .const-dot.lit").length).toBe(6);
      expect(document.querySelectorAll("#constRest .const-dot.lit").length).toBe(35);
    });
  });

  test("every discovery carries a 'Show me one first' button visible immediately (true rung 0)", () => {
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      const disc = document.getElementById(id);
      const showMe = Array.from(disc.querySelectorAll(".nudge-btn")).find(b => b.textContent === "Show me one first");
      expect(showMe).toBeTruthy();
      expect(showMe.style.display).not.toBe("none");
    });
  });

  test("completing all six discoveries unlocks the reflection card with all six stars", () => {
    openAllBoxes();
    clickButton("traceBtn2", 6);
    clickButton("traceBtn3", 3);
    document.getElementById("teachBtn3").click();
    clickButton("askAgainBtn3", 4);
    clickButton("feedBtn4", 5);
    completeD5InOrder();
    document.getElementById("assembleBtn6").click();

    expect(starCount()).toBe("✦ 6");
    expect(reflectVisible()).toBe(true);
  });

  test("the reflection card carries the sanctioned ceremony line, verbatim", () => {
    document.getElementById("assembleBtn6").click();
    const h2 = document.querySelector("#reflect h2");
    expect(h2.textContent).toBe("38 discoveries. No marks were ever given. You taught yourself a subject.");
  });

  test("'exam' appears nowhere in the module except inside the one optional door", () => {
    const examDoor = document.querySelector(".exam-door");
    expect(examDoor).toBeTruthy();
    const doorText = examDoor.textContent;
    expect(doorText).toMatch(/\bexam\b/i);

    // Remove the door's own text from the full body text and confirm nothing
    // outside it ever says "exam" — not the hero, not any discovery, not any
    // nudge, not the reflection's other paragraphs, not even code comments
    // (comments ship inside the inline <script>, which is part of <body>).
    const bodyWithoutDoor = document.body.textContent.replace(doorText, "");
    expect(bodyWithoutDoor).not.toMatch(/\bexam\b/i);
  });

  test("the optional exam door is genuinely optional: reaching the reflection never requires opening it", () => {
    openAllBoxes();
    clickButton("traceBtn2", 6);
    clickButton("traceBtn3", 3);
    document.getElementById("teachBtn3").click();
    clickButton("askAgainBtn3", 4);
    clickButton("feedBtn4", 5);
    completeD5InOrder();
    document.getElementById("assembleBtn6").click();

    // The door's panel was never opened, yet the reflection is fully visible.
    const panel = document.getElementById("examDoorPanel");
    expect(panel.classList.contains("shown")).toBe(false);
    expect(reflectVisible()).toBe(true);
    expect(starCount()).toBe("✦ 6");
  });

  test("the built module never mentions banned school vocabulary (house-style 'no marks' framing aside)", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|grade|homework|mark scheme|6-mark|answer structure)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
    expect(text).not.toMatch(/\brevision\b/i);
  });

  test("the four expert-system components are named verbatim (Cambridge 0478 syllabus 6.3.3)", () => {
    const text = document.body.textContent;
    expect(text).toMatch(/knowledge base/i);
    expect(text).toMatch(/rule base/i);
    expect(text).toMatch(/inference engine/i);
    expect(text).toMatch(/interface/i);
  });

  test("the rule base is never described as reasoning — only the inference engine is", () => {
    const rulebasePanel = document.getElementById("boxPanel-rulebase").textContent;
    const enginePanel = document.getElementById("boxPanel-engine").textContent;
    expect(rulebasePanel).not.toMatch(/reasons|checks|confirms/i);
    expect(enginePanel).toMatch(/reasons/i);

    // D2/D3's trace rows keep the same split: the rule base only ever
    // "holds" or "offers" a rule; only the inference engine "confirms".
    clickButton("traceBtn2", 6);
    const trace2 = Array.from(document.querySelectorAll("#timeline2 .xs-trace-row")).map(r => r.textContent);
    const ruleBaseLines2 = trace2.filter(t => t.startsWith("Rule base"));
    expect(ruleBaseLines2.every(t => /offers/i.test(t))).toBe(true);
    expect(ruleBaseLines2.some(t => /reasons|confirms|decides/i.test(t))).toBe(false);
  });

  test("machine learning is defined as adapting its own processes/data, not as being 'programmed to be smart'", () => {
    clickButton("feedBtn4", 5);
    const text = document.body.textContent;
    expect(text).toMatch(/adapt(s|ing)? its own processes and data/i);
    expect(text).not.toMatch(/programmed to be smart/i);
  });

  test("file handling uses the exact OPENFILE/READFILE/WRITEFILE/CLOSEFILE syntax, including CLOSEFILE both times", () => {
    completeD5InOrder();
    const lines = Array.from(document.querySelectorAll("#seqBuild5 .seq-line")).map(l => l.textContent);
    expect(lines.filter(l => l.startsWith("CLOSEFILE")).length).toBe(2);
    expect(lines.some(l => l === 'OPENFILE "Birds.txt" FOR WRITE')).toBe(true);
    expect(lines.some(l => l === 'OPENFILE "Birds.txt" FOR READ')).toBe(true);
  });
});
