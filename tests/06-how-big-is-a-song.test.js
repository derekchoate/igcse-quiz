const {
  loadModule,
  starCount,
  hitChips,
  isDiscoveryDone,
  reflectVisible
} = require("./helpers/loadModule");

describe("Module 6: How Big Is a Song?", () => {
  beforeEach(() => {
    loadModule("06-how-big-is-a-song.html");
  });

  test("starts at zero stars, with no chip pre-completed by any seeded control", () => {
    expect(starCount()).toBe("✦ 0");
    expect(reflectVisible()).toBe(false);
    // discovery 3 defaults to 8000 Hz / 8-bit / 1s = exactly its first chip target (8000 bytes) —
    // must not auto-fire before the learner touches a control.
    ["chips1", "chips2", "chips3", "chips4"].forEach(id => {
      expect(hitChips(id)).toBe(0);
    });
  });

  test("discovery 1: climbing to byte, KiB, GiB and PiB awards the star", () => {
    const byName = name => Array.from(document.querySelectorAll("#ladderRow1 .ladder-btn")).find(b => b.textContent === name);

    byName("byte").click();
    expect(document.getElementById("rungBytes1").textContent).toBe("1 byte");
    expect(document.getElementById("rungCaption1").textContent).toMatch(/×8 from a bit/);

    byName("KiB").click();
    expect(document.getElementById("rungBytes1").textContent).toBe("1,024 bytes");
    expect(document.getElementById("rungCaption1").textContent).toMatch(/×1024 from a byte/);

    byName("GiB").click();
    expect(document.getElementById("rungBytes1").textContent).toBe("1,073,741,824 bytes");

    byName("PiB").click();
    expect(document.getElementById("rungBytes1").textContent).toBe("1,125,899,906,842,624 bytes");

    expect(hitChips("chips1")).toBe(4);
    expect(isDiscoveryDone("d1")).toBe(true);
  });

  test("discovery 2: staged image-size calculation reaches 64, 1024 and 3072 bytes", () => {
    const widthBtn = document.getElementById("widthBtn2"); // cycles 8 -> 16 -> 32
    const heightBtn = document.getElementById("heightBtn2");
    const depthBtn = document.getElementById("depthBtn2"); // cycles 1 -> 8 -> 24

    expect(document.getElementById("pixelCount2").textContent).toBe("64"); // 8x8 seeded
    expect(document.getElementById("fileBytes2").textContent).toBe("8 bytes"); // @1-bit

    depthBtn.click(); // 1 -> 8
    expect(document.getElementById("fileBytes2").textContent).toBe("64 bytes"); // 8x8 @8-bit

    widthBtn.click(); // 8 -> 16
    heightBtn.click(); // 8 -> 16
    widthBtn.click(); // 16 -> 32
    heightBtn.click(); // 16 -> 32
    expect(document.getElementById("pixelCount2").textContent).toBe("1,024");
    expect(document.getElementById("fileBytes2").textContent).toBe("1,024 bytes"); // 32x32 @8-bit

    depthBtn.click(); // 8 -> 24
    expect(document.getElementById("fileBytes2").textContent).toBe("3,072 bytes"); // 32x32 @24-bit

    expect(hitChips("chips2")).toBe(3);
    expect(isDiscoveryDone("d2")).toBe(true);
  });

  test("discovery 3: staged sound-size calculation reaches 8000, 32000 and 176000 bytes", () => {
    const rateBtn = document.getElementById("rateBtn3"); // 8000 -> 16000 -> 44000
    const resBtn = document.getElementById("resBtn3"); // 8 -> 16
    const secBtn = document.getElementById("secBtn3"); // 1 -> 2 -> 4

    expect(document.getElementById("fileBytes3").textContent).toBe("8,000 bytes"); // seeded, not yet a "found" chip
    expect(hitChips("chips3")).toBe(0);

    rateBtn.click(); // -> revisit 8000Hz/8bit/1s genuinely via interaction
    rateBtn.click(); // 16000 -> 44000
    rateBtn.click(); // 44000 -> 8000 (back to seed value, but now user-driven)
    expect(document.getElementById("fileBytes3").textContent).toBe("8,000 bytes");
    expect(hitChips("chips3")).toBe(1);

    resBtn.click(); // 8 -> 16, rate stays 8000 -> 16000 bytes... need rate=16000 too
    rateBtn.click(); // 8000 -> 16000
    expect(document.getElementById("fileBytes3").textContent).toBe("32,000 bytes");
    expect(hitChips("chips3")).toBe(2);

    rateBtn.click(); // 16000 -> 44000
    secBtn.click(); // 1 -> 2
    expect(document.getElementById("fileBytes3").textContent).toBe("176,000 bytes");

    expect(hitChips("chips3")).toBe(3);
    expect(isDiscoveryDone("d3")).toBe(true);
  });

  test("discovery 4: squeezing stripes shrinks the tally, squeezing noise grows it", () => {
    const squeeze = document.getElementById("squeezeToggle4");
    squeeze.click(); // on

    document.getElementById("loadStripes4").click();
    expect(document.getElementById("tally4").textContent).toMatch(/4 runs = 8 values/);
    expect(document.getElementById("tally4").className).toMatch(/shrank/);
    expect(hitChips("chips4")).toBe(1);

    document.getElementById("loadNoise4").click();
    expect(document.getElementById("tally4").textContent).toMatch(/16 runs = 32 values/);
    expect(document.getElementById("tally4").className).toMatch(/grew/);

    expect(hitChips("chips4")).toBe(2);
    expect(isDiscoveryDone("d4")).toBe(true);
  });

  test("discovery 4: the lever is off by default, and painting a pixel updates the raw tally only", () => {
    expect(document.getElementById("squeezedRow4").hidden).toBe(true);
    expect(document.getElementById("tally4").textContent).toBe("raw: 16 values");
    document.querySelectorAll("#pixelRow4 .pixel-cell")[0].click();
    expect(document.getElementById("tally4").textContent).toBe("raw: 16 values");
    expect(document.getElementById("squeezedRow4").hidden).toBe(true);
  });

  test("discovery 5: picking the wrong bucket redirects warmly without locking", () => {
    const items = document.querySelectorAll("#sortList5 .sort-item");
    const wrongBtn = Array.from(items[2].querySelectorAll(".sort-btn")).find(b => b.textContent === "Lossless"); // song is lossy
    wrongBtn.click();
    expect(items[2].classList.contains("solved")).toBe(false);
    expect(document.getElementById("toast").innerHTML).toMatch(/Streaming a lossless copy/);
  });

  test("discovery 5: sorting all five files correctly awards the final star", () => {
    const items = document.querySelectorAll("#sortList5 .sort-item");
    const answers = ["Lossless", "Lossless", "Lossy", "Lossy", "Lossless"];
    items.forEach((item, i) => {
      const btn = Array.from(item.querySelectorAll(".sort-btn")).find(b => b.textContent === answers[i]);
      btn.click();
      expect(item.classList.contains("solved")).toBe(true);
    });
    expect(isDiscoveryDone("d5")).toBe(true);
  });

  test("all five discoveries unlock the reflection card", () => {
    const byName = name => Array.from(document.querySelectorAll("#ladderRow1 .ladder-btn")).find(b => b.textContent === name);
    ["byte", "KiB", "GiB", "PiB"].forEach(n => byName(n).click());

    const depthBtn = document.getElementById("depthBtn2");
    const widthBtn = document.getElementById("widthBtn2");
    const heightBtn = document.getElementById("heightBtn2");
    depthBtn.click(); // 8x8 @8-bit = 64
    widthBtn.click();
    heightBtn.click();
    widthBtn.click();
    heightBtn.click(); // 32x32 @8-bit = 1024
    depthBtn.click(); // 32x32 @24-bit = 3072

    const rateBtn = document.getElementById("rateBtn3");
    const resBtn = document.getElementById("resBtn3");
    const secBtn = document.getElementById("secBtn3");
    rateBtn.click();
    rateBtn.click();
    rateBtn.click(); // back to 8000, user-driven -> 8000 bytes
    resBtn.click();
    rateBtn.click(); // 16000 Hz, 16-bit -> 32000 bytes
    rateBtn.click();
    secBtn.click(); // 44000 Hz, 16-bit, 2s -> 176000 bytes

    document.getElementById("squeezeToggle4").click();
    document.getElementById("loadStripes4").click();
    document.getElementById("loadNoise4").click();

    const items = document.querySelectorAll("#sortList5 .sort-item");
    const answers = ["Lossless", "Lossless", "Lossy", "Lossy", "Lossless"];
    items.forEach((item, i) => {
      Array.from(item.querySelectorAll(".sort-btn")).find(b => b.textContent === answers[i]).click();
    });

    expect(starCount()).toBe("✦ 5");
    expect(reflectVisible()).toBe(true);
  });
});
