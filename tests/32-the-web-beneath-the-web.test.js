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

describe("Module 32: The Web Beneath the Web", () => {
  beforeEach(() => {
    loadModule("32-the-web-beneath-the-web.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: roads vs deliveries", () => {
    test("sorting onto the wrong pile gives a warm redirect, never a wrong/incorrect label, and no star", () => {
      sortItem("pool1", "bins1", "cables", "The World Wide Web — the deliveries");
      expect(document.getElementById("status1").textContent).toMatch(/try again/i);
      expect(document.getElementById("status1").textContent).not.toMatch(/wrong|incorrect|fail/i);
      expect(isDiscoveryDone("d1")).toBe(false);
    });

    test("sorting all six statements onto their correct pile awards the star", () => {
      sortItem("pool1", "bins1", "cables", "The Internet — the roads");
      sortItem("pool1", "bins1", "existed", "The Internet — the roads");
      sortItem("pool1", "bins1", "network", "The Internet — the roads");
      sortItem("pool1", "bins1", "pages", "The World Wide Web — the deliveries");
      sortItem("pool1", "bins1", "builtOn", "The World Wide Web — the deliveries");
      sortItem("pool1", "bins1", "htmlHttp", "The World Wide Web — the deliveries");

      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: explode an address, then run the relay", () => {
    test("the default address is exploded into protocol, domain and page name immediately, nothing hidden", () => {
      const values = Array.from(document.querySelectorAll("#urlParts2 .ww-part-value")).map(el => el.textContent);
      expect(values).toEqual(["HTTPS", "campus-portal.edu.my", "/timetable"]);
    });

    test("typing an address that can't be parsed gets a gentle steer, never an error state", () => {
      const input = document.getElementById("urlInput2");
      input.value = "not a url at all";
      input.dispatchEvent(new Event("input"));
      expect(document.getElementById("urlParts2").textContent).toMatch(/https:\/\/ or http:\/\//);
    });

    test("typing a valid address re-explodes it live", () => {
      const input = document.getElementById("urlInput2");
      input.value = "http://cloudgames.net/scores/leaderboard";
      input.dispatchEvent(new Event("input"));
      const values = Array.from(document.querySelectorAll("#urlParts2 .ww-part-value")).map(el => el.textContent);
      expect(values).toEqual(["HTTP", "cloudgames.net", "/scores/leaderboard"]);
    });

    test("advancing the relay one tap at a time reveals each stop's caption, in order, with no timer", () => {
      const nextBtn = document.getElementById("relayNextBtn2");
      const caption = document.getElementById("relayCaption2");

      nextBtn.click();
      expect(caption.textContent).toMatch(/Your browser holds the address/);
      nextBtn.click();
      expect(caption.textContent).toMatch(/domain name server \(DNS\)/);
      nextBtn.click();
      expect(caption.textContent).toMatch(/IP address/);
      nextBtn.click();
      expect(caption.textContent).toMatch(/HTTP or HTTPS/);
      nextBtn.click();
      expect(caption.textContent).toMatch(/torn into packets/);
      expect(isDiscoveryDone("d2")).toBe(false);

      nextBtn.click(); // 6th and final stop
      expect(caption.textContent).toMatch(/browser turns it into the page/);
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
      expect(nextBtn.hidden).toBe(true);
      expect(document.getElementById("relayResetBtn2").hidden).toBe(false);
    });

    test("an already-revealed stop stays inspectable — tapping it re-shows its own caption, not the latest one", () => {
      const nextBtn = document.getElementById("relayNextBtn2");
      nextBtn.click(); // stop 1: Browser
      nextBtn.click(); // stop 2: DNS lookup
      const firstNode = document.querySelector("#relay2 .ww-relay-node");
      firstNode.click();
      expect(document.getElementById("relayCaption2").textContent).toMatch(/Your browser holds the address/);
    });
  });

  describe("discovery 3: the phonebook nobody sees", () => {
    test("looking up all three domains fills the phonebook and awards the star", () => {
      const buttons = Array.from(document.querySelectorAll("#lookupBtns3 .loop-btn"));
      expect(buttons.length).toBe(3);

      const campusBtn = buttons.find(b => b.textContent.includes("campus-portal.edu.my"));
      campusBtn.click();
      expect(document.getElementById("phoneNote3").textContent).toMatch(/Module 26/);

      buttons.filter(b => b !== campusBtn).forEach(b => b.click());

      const rows = document.querySelectorAll("#phoneBody3 tr");
      expect(rows.length).toBe(3);
      expect(document.getElementById("phoneBody3").textContent).toMatch(/campus-portal\.edu\.my/);
      expect(document.getElementById("phoneBody3").textContent).toMatch(/203\.0\.113\.5/);

      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: the padlock", () => {
    test("HTTP lets the snoop read the message in full", () => {
      document.getElementById("sendHttpBtn").click();
      document.getElementById("snoopHttpBtn").click();
      expect(document.getElementById("httpStatus").textContent).toMatch(/mei_19/);
      expect(isDiscoveryDone("d4")).toBe(false); // HTTPS side not run yet
    });

    test("HTTPS keeps the content unreadable to the snoop, and running both sides awards the star with the domain-visibility note", () => {
      document.getElementById("sendHttpBtn").click();
      document.getElementById("snoopHttpBtn").click();

      document.getElementById("sendHttpsBtn").click();
      expect(document.getElementById("lockboxBadgeHttps").classList.contains("locked")).toBe(true);
      document.getElementById("snoopHttpsBtn").click();
      expect(document.getElementById("httpsStatus").textContent).not.toMatch(/mei_19/);

      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
      const note = document.getElementById("padlockNote");
      expect(note.hidden).toBe(false);
      expect(note.textContent).toMatch(/which website you were talking to/);
      expect(note.textContent).not.toMatch(/hides the website/i);
    });
  });

  describe("discovery 5: the memory of websites", () => {
    function sortAllCookies() {
      sortItem("pool5", "bins5", "basket", "Everyday, honest uses");
      sortItem("pool5", "bins5", "login", "Everyday, honest uses");
      sortItem("pool5", "bins5", "settings", "Everyday, honest uses");
      sortItem("pool5", "bins5", "form", "Everyday, honest uses");
      sortItem("pool5", "bins5", "adTrack", "Worth keeping an eye on");
      sortItem("pool5", "bins5", "crossSite", "Worth keeping an eye on");
    }

    test("closing the tab evaporates the session wristband but leaves the persistent one", () => {
      document.getElementById("closeTabBtn5").click();
      expect(document.getElementById("wristbandSession").classList.contains("gone")).toBe(true);
      expect(document.getElementById("wristbandPersistentState").textContent).toMatch(/Still here/);
    });

    test("the star only arrives once BOTH the tab has been closed AND the sort is complete, in either order", () => {
      sortAllCookies();
      expect(isDiscoveryDone("d5")).toBe(false); // tab not closed yet

      document.getElementById("closeTabBtn5").click();
      expect(isDiscoveryDone("d5")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });

    test("a cookie is never described as a program or a virus", () => {
      const text = document.getElementById("d5").textContent;
      expect(text).toMatch(/isn't a program/);
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

  test("completing every discovery unlocks the reflection card with all five stars", () => {
    sortItem("pool1", "bins1", "cables", "The Internet — the roads");
    sortItem("pool1", "bins1", "existed", "The Internet — the roads");
    sortItem("pool1", "bins1", "network", "The Internet — the roads");
    sortItem("pool1", "bins1", "pages", "The World Wide Web — the deliveries");
    sortItem("pool1", "bins1", "builtOn", "The World Wide Web — the deliveries");
    sortItem("pool1", "bins1", "htmlHttp", "The World Wide Web — the deliveries");

    const nextBtn = document.getElementById("relayNextBtn2");
    for (let i = 0; i < 6; i++) nextBtn.click();

    Array.from(document.querySelectorAll("#lookupBtns3 .loop-btn")).forEach(b => b.click());

    document.getElementById("sendHttpBtn").click();
    document.getElementById("snoopHttpBtn").click();
    document.getElementById("sendHttpsBtn").click();
    document.getElementById("snoopHttpsBtn").click();

    sortItem("pool5", "bins5", "basket", "Everyday, honest uses");
    sortItem("pool5", "bins5", "login", "Everyday, honest uses");
    sortItem("pool5", "bins5", "settings", "Everyday, honest uses");
    sortItem("pool5", "bins5", "form", "Everyday, honest uses");
    sortItem("pool5", "bins5", "adTrack", "Worth keeping an eye on");
    sortItem("pool5", "bins5", "crossSite", "Worth keeping an eye on");
    document.getElementById("closeTabBtn5").click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });

  test("the built module never mentions banned school vocabulary, and 'exam' appears nowhere", () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/\b(quiz|exam|grade|homework|mark scheme)\b/i);
    expect(text).not.toMatch(/\bpass\/fail\b/i);
    expect(text).not.toMatch(/\bincorrect\b/i);
    expect(text).not.toMatch(/\btest\b/i);
  });
});
