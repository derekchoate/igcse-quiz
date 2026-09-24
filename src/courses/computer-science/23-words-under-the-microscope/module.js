
  /* ================= Module 21 — Words Under the Microscope =================
   Signature interaction: a string operating table. Whatever's typed becomes
   physical letter tiles, each carrying its own 1-based position number (a
   space gets its own tile too — that's D1's whole point). D2 and D5 add a
   tap-tap "bracket": tap a tile to plant the start, tap a second tile to
   stretch it, and the bracket always spans between the two taps regardless
   of order — there is no way to "miss" and get a wrong bracket, only one
   that hasn't yet landed on the target the chips are inviting. Runs inside
   the shared engine IIFE, so $, $$, awardStar, toast, sparks, makeChips and
   reduceMotion are all in scope. meta.uses is ["chips"] only — no existing
   kit covers letter tiles with an adjustable bracket, and this is the first
   module (so far) that needs one, mirroring the "hand-roll it, note why"
   choice Module 20 made for its trace grid. */

  function escapeHtml(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  /* ═══ render a word as a row of tiles, one per character, each labelled
     with its 1-based position. Pass a click handler to make tiles real,
     keyboard-operable <button>s; omit it for a static (non-interactive)
     row. A space renders as a visibly distinct "⎵" tile — still a tile,
     still counted — which is exactly D1's discovery. ═══ */
  function renderTiles(mountEl, word, onClick){
    mountEl.innerHTML = "";
    Array.from(word).forEach((ch, i) => {
      const pos = i + 1;
      const el = document.createElement(onClick ? "button" : "div");
      if (onClick) el.type = "button";
      el.className = "wtile" + (ch === " " ? " wtile-space" : "");
      el.dataset.pos = String(pos);
      el.setAttribute("aria-label", (ch === " " ? "space" : "letter " + ch) + ", position " + pos);
      el.innerHTML =
        '<span class="wtile-ch" aria-hidden="true">' + (ch === " " ? "space" : escapeHtml(ch)) + "</span>" +
        '<span class="wtile-pos" aria-hidden="true">' + pos + "</span>";
      if (onClick) el.addEventListener("click", () => onClick(pos, el));
      mountEl.appendChild(el);
    });
  }

  /* ═══ D1: measure it — LENGTH, space included ═══ */
  const msWord = $("#msWord1"), msTiles = $("#msTiles1"), msReadout = $("#msReadout1"), msStatus = $("#msStatus1");
  const msChips = makeChips($("#chips1"), ["measure", "space"],
    () => awardStar("d1", "LENGTH counts every character sitting in the box — spaces included — and that's exactly what a computer means by a string's length."),
    k => ({ measure: "Measured a word with LENGTH", space: "Noticed a space still counts" }[k]),
    (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");
  function msRender(){
    const raw = msWord.value;
    const word = raw.length ? raw : "Explorer";
    renderTiles(msTiles, word, null);
    msReadout.innerHTML = '<span class="kw">LENGTH</span>(<span class="str">"' + escapeHtml(word) + '"</span>) = <b>' + word.length + "</b>";
    if (raw.length){
      msChips("measure");
      if (word.indexOf(" ") !== -1){
        msStatus.textContent = "Every one of those " + word.length + " tiles counts toward LENGTH — including the space sitting right in there.";
        msChips("space");
      } else {
        msStatus.textContent = "LENGTH just counted every tile you can see — " + word.length + " of them.";
      }
    } else {
      msStatus.textContent = "That's the placeholder word settling in — type your own above and watch the count follow it live.";
    }
  }
  msWord.addEventListener("input", msRender);
  msRender();

  /* ═══ D2: the sliding bracket — SUBSTRING(word, start, length) ═══ */
  const sbWordInput = $("#sbWord2"), sbTilesEl = $("#sbTiles2"), sbCodeEl = $("#sbCode2"), sbStatusEl = $("#sbStatus2");
  let sbStart = null, sbEnd = null;
  const sbChips = makeChips($("#chips2"), ["first", "middle", "whole"],
    () => awardStar("d2", "SUBSTRING(word, start, length) — position first, length second. You just proved it three different ways."),
    k => ({ first: "Grabbed just the first letter", middle: "Grabbed a 4-letter chunk from the middle", whole: "Grabbed the whole word in one bracket" }[k]),
    (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");
  function sbCurrentWord(){
    const raw = sbWordInput.value.trim();
    return raw.length ? raw : "COMPUTER";
  }
  function sbTileClick(pos){
    if (sbStart === null || (sbStart !== null && sbEnd !== null)){
      sbStart = pos; sbEnd = null;
    } else {
      sbEnd = pos;
    }
    sbRender();
  }
  function sbRender(){
    const word = sbCurrentWord();
    if (sbStart !== null && sbStart > word.length) sbStart = null;
    if (sbEnd !== null && sbEnd > word.length) sbEnd = null;
    renderTiles(sbTilesEl, word, sbTileClick);
    const lo = sbStart !== null && sbEnd !== null ? Math.min(sbStart, sbEnd) : sbStart;
    const hi = sbStart !== null && sbEnd !== null ? Math.max(sbStart, sbEnd) : sbStart;
    if (lo !== null){
      $$(".wtile", sbTilesEl).forEach(el => {
        const p = Number(el.dataset.pos);
        if (p >= lo && p <= (hi !== null ? hi : lo)) el.classList.add("wtile-picked");
      });
    }
    if (sbStart === null){
      sbCodeEl.innerHTML = '<span class="kw">SUBSTRING</span>(<span class="str">"' + escapeHtml(word) + '"</span>, ?, ?) = <span class="muted">nothing picked yet</span>';
      sbStatusEl.textContent = "Tap any tile to begin.";
      return;
    }
    if (sbEnd === null){
      sbCodeEl.innerHTML = '<span class="kw">SUBSTRING</span>(<span class="str">"' + escapeHtml(word) + '"</span>, ' + sbStart + ', ?) = <span class="muted">stretch it to a second tile</span>';
      sbStatusEl.textContent = "Now tap a second tile to stretch the bracket over it.";
      return;
    }
    const length = hi - lo + 1;
    const result = word.slice(lo - 1, hi);
    sbCodeEl.innerHTML = '<span class="kw">SUBSTRING</span>(<span class="str">"' + escapeHtml(word) + '"</span>, ' + lo + ", " + length + ') = <span class="str">"' + escapeHtml(result) + '"</span>';
    sbStatusEl.textContent = "Position " + lo + ", length " + length + " — that bracket currently reads back \"" + result + "\".";
    if (lo === 1 && length === 1) sbChips("first");
    if (lo === 3 && length === 4) sbChips("middle");
    if (lo === 1 && hi === word.length) sbChips("whole");
  }
  $("#sbClear2").addEventListener("click", () => { sbStart = null; sbEnd = null; sbRender(); });
  sbWordInput.addEventListener("input", () => { sbStart = null; sbEnd = null; sbRender(); });
  sbRender();

  /* ═══ D3: SHOUTING and whispering — UCASE / LCASE, plus the comparison caveat ═══ */
  const ccWord = $("#ccWord3"), ccDisplay = $("#ccDisplay3"), ccStatus = $("#ccStatus3");
  const ccChips = makeChips($("#chips3"), ["shout", "whisper", "match"],
    () => awardStar("d3", "UCASE and LCASE flip every character together, and you saw exactly why a program UCASEs both sides before comparing two words — case is just another character difference to a machine."),
    k => ({ shout: "UCASEd a word", whisper: "LCASEd a word", match: "Fixed a case mismatch by UCASEing both sides" }[k]),
    (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");
  function ccCurrentWord(){
    const raw = ccWord.value.trim();
    return raw.length ? raw : "Whisper";
  }
  function ccRenderPlain(){
    ccDisplay.innerHTML = '<span class="str">"' + escapeHtml(ccCurrentWord()) + '"</span>';
  }
  ccWord.addEventListener("input", ccRenderPlain);
  ccRenderPlain();
  $("#ccUcase3").addEventListener("click", () => {
    const word = ccCurrentWord(), up = word.toUpperCase();
    ccDisplay.innerHTML = '<span class="kw">UCASE</span>(<span class="str">"' + escapeHtml(word) + '"</span>) = <span class="str">"' + escapeHtml(up) + '"</span>';
    ccStatus.textContent = "Every character flipped to its upper-case form at once — UCASE never touches just one letter.";
    ccChips("shout");
  });
  $("#ccLcase3").addEventListener("click", () => {
    const word = ccCurrentWord(), low = word.toLowerCase();
    ccDisplay.innerHTML = '<span class="kw">LCASE</span>(<span class="str">"' + escapeHtml(word) + '"</span>) = <span class="str">"' + escapeHtml(low) + '"</span>';
    ccStatus.textContent = "Same idea, the other direction — every character dropped to lower case together.";
    ccChips("whisper");
  });
  $("#ccCompareRow3").innerHTML =
    '<div class="cc-compare-item"><span class="cc-compare-label">Word A</span><span class="str">"Cat"</span></div>' +
    '<div class="cc-compare-item"><span class="cc-compare-label">Word B</span><span class="str">"cat"</span></div>';
  $("#ccCompareRaw3").addEventListener("click", () => {
    $("#ccCompareStatus3").textContent = '"Cat" = "cat" is FALSE — to a computer, capital C and lowercase c are simply different characters, so the two strings don’t match at all.';
  });
  $("#ccCompareUcase3").addEventListener("click", () => {
    $("#ccCompareStatus3").textContent = 'UCASE("Cat") = "CAT", UCASE("cat") = "CAT" — now both sides read exactly the same, so "CAT" = "CAT" is TRUE. UCASEing both sides first is exactly why comparisons usually do it.';
    ccChips("match");
  });

  /* ═══ D4: dice inside the machine — RANDOM, tamed by ROUND ═══ */
  let rdCount = 0;
  const rdChips = makeChips($("#chips4"), ["raw", "tamed", "range"],
    () => awardStar("d4", "RANDOM() always hands back a decimal between 0 and 1 — never more, never less — and ROUND is what tames that decimal into a whole number you can actually use."),
    k => ({ raw: "Saw RANDOM()'s raw decimal", tamed: "Tamed it with ROUND", range: "Rolled enough to trust the 1–6 range" }[k]),
    (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");
  function rdRoll(){
    rdCount++;
    const raw = Math.random(); // stands in for RANDOM() — a decimal between 0 and 1 inclusive
    const tamed = Math.round(raw * 5) + 1; // stands in for ROUND(RANDOM() * 5, 0) + 1
    $("#rdRaw4").textContent = raw.toFixed(3);
    $("#rdTamed4").textContent = String(tamed);
    $("#rdStatus4").textContent = "Roll " + rdCount + ": RANDOM() handed back " + raw.toFixed(3) + " — always somewhere between 0 and 1. ROUND(RANDOM() * 5, 0) + 1 turned that into a clean whole number: " + tamed + ".";
    rdChips("raw");
    rdChips("tamed");
    if (rdCount >= 8) rdChips("range");
  }
  $("#rdRoll4").addEventListener("click", rdRoll);

  /* ═══ D5: build a monogram — SUBSTRING + UCASE, working together ═══ */
  const mgName = $("#mgName5"), mgTiles = $("#mgTiles5"), mgCodeEl = $("#mgCode5"), mgMonogramEl = $("#mgMonogram5"), mgStatusEl = $("#mgStatus5");
  let mgPosA = null, mgPosB = null;
  const mgChips = makeChips($("#chips5"), ["picked", "monogram"],
    () => awardStar("d5", "You built a real monogram from nothing but tile positions — the same SUBSTRING and UCASE from the discoveries above, now doing real work on an actual name."),
    k => ({ picked: "Grabbed a first initial", monogram: "Built the real monogram from SUBSTRING + UCASE" }[k]),
    (label, remaining) => "Noticed ✦ — " + remaining + " more to go.");
  function mgCurrentName(){
    const raw = mgName.value.trim();
    return raw.length ? raw : "Ada Lovelace";
  }
  // Finds the 1-based position of the first non-space character after the
  // first run of whitespace — i.e. where a second name's initial sits.
  // Returns null when there is no second word yet (no gate, just an invite).
  function mgSecondWordStart(name){
    const m = name.match(/^(\S+)(\s+)(\S)/);
    if (!m) return null;
    return m[1].length + m[2].length + 1;
  }
  function mgTileClick(pos){
    if (mgPosA === null){
      mgPosA = pos;
    } else if (mgPosB === null){
      mgPosB = pos;
    } else {
      mgPosA = pos; mgPosB = null;
    }
    mgRender();
  }
  function mgRender(){
    const name = mgCurrentName();
    renderTiles(mgTiles, name, mgTileClick);
    $$(".wtile", mgTiles).forEach(el => {
      const p = Number(el.dataset.pos);
      if (p === mgPosA){ el.classList.add("wtile-picked-a"); el.insertAdjacentHTML("beforeend", '<span class="wtile-tag" aria-hidden="true">A</span>'); }
      if (p === mgPosB){ el.classList.add("wtile-picked-b"); el.insertAdjacentHTML("beforeend", '<span class="wtile-tag" aria-hidden="true">B</span>'); }
    });
    const letterA = mgPosA !== null ? name[mgPosA - 1] : null;
    const letterB = mgPosB !== null ? name[mgPosB - 1] : null;
    const initA = letterA != null ? letterA.toUpperCase() : "?";
    const initB = letterB != null ? letterB.toUpperCase() : "?";
    mgCodeEl.innerHTML =
      '<span class="kw">UCASE</span>(<span class="kw">SUBSTRING</span>(Name, ' + (mgPosA === null ? "?" : mgPosA) + ', 1)) = <span class="str">"' + initA + '"</span><br>' +
      '<span class="kw">UCASE</span>(<span class="kw">SUBSTRING</span>(Name, ' + (mgPosB === null ? "?" : mgPosB) + ', 1)) = <span class="str">"' + initB + '"</span>';
    mgMonogramEl.textContent = initA + initB;
    if (mgPosA !== null) mgChips("picked");
    const secondStart = mgSecondWordStart(name);
    if (secondStart === null){
      mgStatusEl.textContent = "Add a second name (even a made-up one) after a space to build a two-letter monogram.";
    } else if (mgPosA === null){
      mgStatusEl.textContent = "Tap any tile to grab your first initial.";
    } else if (mgPosB === null){
      mgStatusEl.textContent = "Now tap a second tile to grab your second initial.";
    } else {
      mgStatusEl.textContent = "Your monogram currently reads " + initA + initB + " — keep tapping tiles until it's the one you actually want.";
      if (mgPosA === 1 && mgPosB === secondStart) mgChips("monogram");
    }
  }
  function mgReset(){ mgPosA = null; mgPosB = null; mgRender(); }
  mgName.addEventListener("input", mgReset);
  $("#mgReset5").addEventListener("click", mgReset);
  mgRender();
