const {
  loadModule,
  starCount,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 26: Talking to the Network", () => {
  beforeEach(() => {
    loadModule("26-talking-to-the-network.html");
  });

  test("starts at zero stars, with no discovery pre-completed", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    ["d1", "d2", "d3", "d4", "d5"].forEach(id => {
      expect(isDiscoveryDone(id)).toBe(false);
    });
  });

  describe("discovery 1: the engraving", () => {
    test("MAC page starts unengraved and the sorter is hidden", () => {
      expect(document.getElementById("macDisplay1").textContent).toMatch(/not engraved/i);
      expect(document.getElementById("macMatch1").hidden).toBe(true);
    });

    test("engraving reveals the MAC in hex and the sorter", () => {
      document.getElementById("engraveBtn1").click();
      expect(document.getElementById("macDisplay1").textContent).toBe("3C:4D:BE:07:F2:A7");
      expect(document.getElementById("macMatch1").hidden).toBe(false);
      expect(document.getElementById("macPage1").classList.contains("tn-stamped")).toBe(true);
    });

    test("sorting a fragment onto the wrong label bounces back with a warm redirect, not a failure state", () => {
      document.getElementById("engraveBtn1").click();
      const mfrFrag = document.querySelector('.tn-frag-chip[data-id="mfr"]');
      mfrFrag.click();
      const serialBinHead = Array.from(document.querySelectorAll(".tn-label-bin-head")).find(h => h.textContent.match(/Serial code/));
      serialBinHead.click();
      expect(mfrFrag.classList.contains("placed")).toBe(false);
      expect(document.getElementById("toast").textContent).toMatch(/Not that label/i);
      expect(isDiscoveryDone("d1")).toBe(false);
    });

    test("sorting both halves onto their correct labels awards the star", () => {
      document.getElementById("engraveBtn1").click();
      const mfrFrag = document.querySelector('.tn-frag-chip[data-id="mfr"]');
      const serialFrag = document.querySelector('.tn-frag-chip[data-id="serial"]');
      const mfrBinHead = Array.from(document.querySelectorAll(".tn-label-bin-head")).find(h => h.textContent.match(/Manufacturer code/));
      const serialBinHead = Array.from(document.querySelectorAll(".tn-label-bin-head")).find(h => h.textContent.match(/Serial code/));
      mfrFrag.click();
      mfrBinHead.click();
      serialFrag.click();
      serialBinHead.click();
      expect(isDiscoveryDone("d1")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 2: the visa", () => {
    test("IP page starts unissued", () => {
      expect(document.getElementById("ipDisplay2").textContent).toMatch(/not issued/i);
    });

    test("requesting a dynamic IP twice returns two different addresses", () => {
      document.getElementById("reqDynamicBtn2").click();
      const first = document.getElementById("ipDisplay2").textContent;
      document.getElementById("reqDynamicBtn2").click();
      const second = document.getElementById("ipDisplay2").textContent;
      expect(first).not.toBe(second);
      expect(document.getElementById("ipPage2").classList.contains("tn-stamped")).toBe(true);
    });

    test("requesting a static IP repeatedly always returns the same address", () => {
      document.getElementById("reqStaticBtn2").click();
      const first = document.getElementById("ipDisplay2").textContent;
      document.getElementById("reqStaticBtn2").click();
      const second = document.getElementById("ipDisplay2").textContent;
      expect(first).toBe(second);
    });

    test("trying both kinds awards the star", () => {
      document.getElementById("reqDynamicBtn2").click();
      document.getElementById("reqStaticBtn2").click();
      expect(isDiscoveryDone("d2")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 3: move house", () => {
    test("connecting stamps both pages with the same MAC every time", () => {
      document.getElementById("connectBtn3").click();
      expect(document.getElementById("macVal3").textContent).toBe("3C:4D:BE:07:F2:A7");
      expect(document.getElementById("ipVal3").textContent).toBe("192.168.1.42");
      expect(document.getElementById("whichChanged3").hidden).toBe(true);
    });

    test("moving networks changes the IP page and leaves the MAC page untouched", () => {
      document.getElementById("connectBtn3").click();
      document.getElementById("moveBtn3").click();
      expect(document.getElementById("macVal3").textContent).toBe("3C:4D:BE:07:F2:A7");
      expect(document.getElementById("ipVal3").textContent).toBe("10.20.55.13");
      expect(document.getElementById("whichChanged3").hidden).toBe(false);
    });

    test("picking the MAC page as the answer is a calm redirect, never an error", () => {
      document.getElementById("connectBtn3").click();
      document.getElementById("moveBtn3").click();
      document.getElementById("pickMac3").click();
      expect(document.getElementById("toast").textContent).not.toMatch(/error|wrong|incorrect/i);
      expect(isDiscoveryDone("d3")).toBe(false);
    });

    test("connecting, moving, and picking the IP page awards the star", () => {
      document.getElementById("connectBtn3").click();
      document.getElementById("moveBtn3").click();
      document.getElementById("pickIp3").click();
      expect(isDiscoveryDone("d3")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 4: running out of numbers", () => {
    test("reveals are hidden until pressed", () => {
      expect(document.getElementById("ipv4Reveal4").hidden).toBe(true);
      expect(document.getElementById("ipv6Reveal4").hidden).toBe(true);
    });

    test("revealing IPv4's address space shows the exact 2^32 figure", () => {
      document.getElementById("showIpv4Btn4").click();
      expect(document.getElementById("ipv4Reveal4").hidden).toBe(false);
      expect(document.getElementById("ipv4Reveal4").textContent).toMatch(/4,294,967,296/);
    });

    test("revealing IPv6's address space shows a vastly larger figure", () => {
      document.getElementById("showIpv6Btn4").click();
      expect(document.getElementById("ipv6Reveal4").hidden).toBe(false);
      expect(document.getElementById("ipv6Reveal4").textContent).toMatch(/340,282,366,920,938,463,463,374,607,431,768,211,456/);
    });

    test("revealing both awards the star", () => {
      document.getElementById("showIpv4Btn4").click();
      document.getElementById("showIpv6Btn4").click();
      expect(isDiscoveryDone("d4")).toBe(true);
      expect(starCount()).toBe("✦ 1");
    });
  });

  describe("discovery 5: the postmaster", () => {
    test("three packets start queued on the home network", () => {
      expect(document.querySelectorAll("#queue5 .tn-packet-card").length).toBe(3);
      expect(document.querySelectorAll("#delivered5 .tn-packet-card").length).toBe(0);
    });

    test("forwarding moves one packet at a time from the queue to the wider network", () => {
      document.getElementById("forwardBtn5").click();
      expect(document.querySelectorAll("#queue5 .tn-packet-card").length).toBe(2);
      expect(document.querySelectorAll("#delivered5 .tn-packet-card").length).toBe(1);
      expect(document.getElementById("routerNote5").textContent).toMatch(/router read packet 1/i);
    });

    test("forwarding all three packets awards the star", () => {
      document.getElementById("forwardBtn5").click();
      document.getElementById("forwardBtn5").click();
      document.getElementById("forwardBtn5").click();
      expect(document.querySelectorAll("#delivered5 .tn-packet-card").length).toBe(3);
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

  test("all five discoveries unlock the reflection card", () => {
    // D1
    document.getElementById("engraveBtn1").click();
    document.querySelector('.tn-frag-chip[data-id="mfr"]').click();
    Array.from(document.querySelectorAll(".tn-label-bin-head")).find(h => h.textContent.match(/Manufacturer code/)).click();
    document.querySelector('.tn-frag-chip[data-id="serial"]').click();
    Array.from(document.querySelectorAll(".tn-label-bin-head")).find(h => h.textContent.match(/Serial code/)).click();
    // D2
    document.getElementById("reqDynamicBtn2").click();
    document.getElementById("reqStaticBtn2").click();
    // D3
    document.getElementById("connectBtn3").click();
    document.getElementById("moveBtn3").click();
    document.getElementById("pickIp3").click();
    // D4
    document.getElementById("showIpv4Btn4").click();
    document.getElementById("showIpv6Btn4").click();
    // D5
    document.getElementById("forwardBtn5").click();
    document.getElementById("forwardBtn5").click();
    document.getElementById("forwardBtn5").click();

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
