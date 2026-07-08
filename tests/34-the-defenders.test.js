const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

/** Tap-then-tap a bin-sorter item (by data-id) onto a bin (by its head's
 * visible label), within a given pool/bins container id pair. */
function sortItem(poolId, binsId, itemId, binLabel) {
  const pool = document.getElementById(poolId);
  const chip = pool.querySelector('.sl-chip[data-id="' + itemId + '"]');
  if (!chip) throw new Error("No chip with data-id " + itemId + " in #" + poolId);
  chip.click();
  const bins = document.getElementById(binsId);
  const head = Array.from(bins.querySelectorAll(".sl-bin-head")).find(b => b.textContent === binLabel);
  if (!head) throw new Error("No bin head labeled " + binLabel + " in #" + binsId);
  head.click();
}

const WIRE_LABEL = "Attacks on the wire — target the system";
const PERSON_LABEL = "Attacks on the person — target human judgement";

function sortAllThreats() {
  sortItem("pool2", "bins2", "brute", WIRE_LABEL);
  sortItem("pool2", "bins2", "interception", WIRE_LABEL);
  sortItem("pool2", "bins2", "ddos", WIRE_LABEL);
  sortItem("pool2", "bins2", "hacking", WIRE_LABEL);
  sortItem("pool2", "bins2", "malware", WIRE_LABEL);
  sortItem("pool2", "bins2", "pharming", WIRE_LABEL);
  sortItem("pool2", "bins2", "phishing", PERSON_LABEL);
  sortItem("pool2", "bins2", "social", PERSON_LABEL);
}

function revealAllMalwareCards() {
  Array.from(document.querySelectorAll("#cards1 .loop-btn")).forEach(b => b.click());
}

/** Which of {sender, urgent, link} are real tells on each of the five
 * phishing messages, in DOM order — mirrors PHISH_MESSAGES in module.js. */
const TELLS_BY_MESSAGE = [
  { sender: true, urgent: true, link: true },
  { sender: false, urgent: true, link: true },
  { sender: true, urgent: true, link: true },
  { sender: true, urgent: false, link: true },
  { sender: true, urgent: true, link: true }
];

function findAllPhishingTells() {
  const msgs = document.querySelectorAll("#lineup3 .ph-msg");
  msgs.forEach((msg, i) => {
    const tells = TELLS_BY_MESSAGE[i];
    if (tells.sender) msg.querySelector(".ph-sender").click();
    if (tells.urgent) msg.querySelector(".ph-urgent").click();
    if (tells.link) msg.querySelector(".ph-link").click();
  });
}

function revealRoute(containerId, steps) {
  for (let i = 0; i < steps; i++) {
    const btn = document.querySelector("#" + containerId + " .loop-btn");
    btn.click();
  }
}

function pairThreatShield(threatLabel, shieldLabel) {
  const threatBtn = Array.from(document.querySelectorAll("#threats5 .ds-threat"))
    .find(b => b.querySelector(".ds-name").textContent === threatLabel);
  if (!threatBtn) throw new Error("No threat card labeled " + threatLabel);
  threatBtn.click();
  const shieldBtn = Array.from(document.querySelectorAll("#shields5 .ds-shield"))
    .find(b => b.textContent === shieldLabel);
  if (!shieldBtn) throw new Error("No shield chip labeled " + shieldLabel);
  shieldBtn.click();
}

function defendAllThreats() {
  pairThreatShield("Brute-force attack", "Authentication");
  pairThreatShield("Data interception", "SSL");
  pairThreatShield("DDoS attack", "Firewalls");
  pairThreatShield("Hacking", "Firewalls");
  pairThreatShield("Malware", "Anti-malware");
  pairThreatShield("Pharming", "Checking the link");
  pairThreatShield("Phishing", "Checking spelling & tone");
  pairThreatShield("Social engineering", "Checking spelling & tone");
}

describe("Module 34: The Defenders", () => {
  beforeEach(() => {
    loadModule("34-the-defenders.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5", "d6"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: the malware family album", () => {
    test("reveals all six traits and awards the star, naming Trojan horse verbatim", () => {
      expect(document.querySelectorAll("#cards1 .mw-card").length).toBe(6);
      expect(document.getElementById("cards1").textContent).toMatch(/Trojan horse/);
      revealAllMalwareCards();
      expect(document.getElementById("cards1").textContent).toMatch(/Attaches itself to a legitimate file/);
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: on the wire, or on the person", () => {
    test("sorting a threat onto the wrong pile gives a warm redirect, never wrong/incorrect, and no star", () => {
      sortItem("pool2", "bins2", "brute", PERSON_LABEL);
      expect(document.getElementById("status2").textContent).toMatch(/try again/i);
      expect(document.getElementById("status2").textContent).not.toMatch(/wrong|incorrect|fail/i);
      expect(isDiscoveryDone("d2")).toBe(false);
    });

    test("sorting all eight threats onto their correct pile awards the star", () => {
      sortAllThreats();
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: the phishing line-up", () => {
    test("starts at 0 of 13 tells found", () => {
      expect(document.getElementById("lineupNote3").textContent).toMatch(/0 of 13 tells found/);
    });

    test("tapping a real tell glows it and reveals its explanation", () => {
      const firstMsg = document.querySelector("#lineup3 .ph-msg");
      const senderBtn = firstMsg.querySelector(".ph-sender");
      senderBtn.click();
      expect(senderBtn.classList.contains("found")).toBe(true);
      expect(firstMsg.querySelector(".ph-note").hidden).toBe(false);
      expect(firstMsg.querySelector(".ph-note").textContent).toMatch(/nusabank-support-team\.com/);
      expect(document.getElementById("lineupNote3").textContent).toMatch(/1 of 13/);
    });

    test("tapping a part that's actually fine marks it checked, not found, with no penalty", () => {
      const secondMsg = document.querySelectorAll("#lineup3 .ph-msg")[1];
      const senderBtn = secondMsg.querySelector(".ph-sender");
      senderBtn.click();
      expect(senderBtn.classList.contains("checked")).toBe(true);
      expect(senderBtn.classList.contains("found")).toBe(false);
      expect(document.getElementById("lineupNote3").textContent).toMatch(/0 of 13/);
    });

    test("finding all thirteen tells across all five messages awards the star", () => {
      findAllPhishingTells();
      expect(document.getElementById("lineupNote3").textContent).toMatch(/All 13 tells found/);
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: pharming vs phishing", () => {
    test("revealing both three-step routes shows the convergence note and awards the star", () => {
      revealRoute("routeA4", 3);
      expect(document.getElementById("convergeNote4").hidden).toBe(true);
      revealRoute("routeB4", 3);
      expect(document.getElementById("convergeNote4").hidden).toBe(false);
      expect(document.getElementById("convergeNote4").textContent).toMatch(/Same fake page/);
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: build the defence stack", () => {
    test("an invalid pairing gets a warm redirect, never wrong/incorrect, and no state change", () => {
      pairThreatShield("Data interception", "Anti-malware");
      const threatBtn = Array.from(document.querySelectorAll("#threats5 .ds-threat"))
        .find(b => b.querySelector(".ds-name").textContent === "Data interception");
      expect(threatBtn.classList.contains("matched")).toBe(false);
      const toastText = document.getElementById("toast").textContent;
      expect(toastText).not.toMatch(/\bwrong\b|\bincorrect\b/i);
    });

    test("a second valid shield on an already-defended threat reads 'also works' (the threat stays selected, so no re-tap is needed)", () => {
      pairThreatShield("Hacking", "Firewalls");
      const secondShieldBtn = Array.from(document.querySelectorAll("#shields5 .ds-shield"))
        .find(b => b.textContent === "Access levels");
      secondShieldBtn.click();
      expect(document.getElementById("toast").textContent).toMatch(/Also works/);
    });

    test("defending all eight threats awards the star", () => {
      defendAllThreats();
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 6: the honest truth", () => {
    test("shows a tally of all ten shields, and reveals the reflection without a single 'winning' gotcha framing", () => {
      expect(document.querySelectorAll("#tally6 .ht-row").length).toBe(10);
      const truthNote = document.getElementById("truthNote6");
      expect(truthNote.hidden).toBe(true);
      document.getElementById("revealTruth6").click();
      expect(truthNote.hidden).toBe(false);
      expect(truthNote.textContent).toMatch(/two habits/);
      expect(isDiscoveryDone("d6")).toBe(true);
      expect(starCount()).toBe("✦ 1");
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

  test("completing every discovery unlocks the reflection card with all six stars", () => {
    revealAllMalwareCards();
    sortAllThreats();
    findAllPhishingTells();
    revealRoute("routeA4", 3);
    revealRoute("routeB4", 3);
    defendAllThreats();
    document.getElementById("revealTruth6").click();

    expect(starCount()).toBe("✦ 6");
    expect(reflectVisible()).toBe(true);
  });

  test("the built module never mentions banned school vocabulary, and 'exam' appears nowhere", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });

  test("the syllabus threat and protection lists appear verbatim", () => {
    const text = document.body.textContent;
    ["Brute-force attack", "Data interception", "DDoS attack", "Hacking", "Malware", "Pharming", "Phishing", "Social engineering"].forEach(threat => {
      expect(text).toMatch(threat);
    });
    ["Access levels", "Anti-malware", "Authentication", "Automating software updates", "Firewalls", "Privacy settings", "Proxy servers", "SSL"].forEach(shield => {
      expect(text).toMatch(shield);
    });
    ["Virus", "Worm", "Trojan horse", "Spyware", "Adware", "Ransomware"].forEach(kind => {
      expect(text).toMatch(kind);
    });
  });
});
