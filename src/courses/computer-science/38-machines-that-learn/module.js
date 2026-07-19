
  /* ================= Module 36 — Machines that Learn (capstone) =================
   Signature interaction: a toy expert system (D1-D3) and, deliberately built
   right alongside it for contrast, a tiny pattern-matcher (D4) that solves
   the exact same mystery sighting a completely different way. D5 closes the
   course's last new pseudocode (file handling). D6 is "the ceremony" —
   see the file's tail for how it doubles as the module's reflection card.

   Domain note: the expert system identifies Malaysian garden/urban birds
   (Oriental Magpie-robin, Yellow-vented Bulbul, Zebra Dove, Javan Myna,
   Olive-backed Sunbird, Common Tailorbird, Asian Glossy Starling) rather than
   UK garden birds (robin, blue tit, blackbird…) — all seven are genuinely
   common sightings in Malaysia, per the design contract's regional-neutrality
   rule. "A nod to a shared interest" from the plan, re-grounded locally.

   No-failure-events guardrail: the "no rule matched" moment in D3 and the
   pattern-matcher's early, unconfident guesses in D4 are both rendered with
   the same neutral .fork-note treatment used for ordinary diagnostic notes
   elsewhere in the course (see e.g. Module 35) — never red, never styled as
   an error, and the copy explicitly says so ("not a fault", "not wrong").

   Component-swap guardrail (the course plan flags this pairing as the one
   most commonly mixed up, as an internal build note — not learner-facing
   copy): every place the rule base and inference engine appear side by
   side, the copy keeps them visibly distinct — the rule base only ever
   "holds" or "offers" rules; only the inference engine "reasons", "checks"
   or "confirms". See D1's tour text and the n1a nudge, which names the
   swap directly.

   Every discovery's nudge-zone carries "Show me one first" as a true rung 0
   — rendered and clickable immediately, never gated behind another nudge
   (design contract rule 10). D6 keeps the same convention even though there
   is nothing to get right, for consistency with every discovery before it.

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast
   and awardStar are all in scope. meta.uses is [] — nothing here needed a
   shared interaction kit; every mechanic below is small enough to hand-roll
   locally, in keeping with the course's "rule of two" convention for kits. */

  /* ═══ shared: one row of a reasoning/example trace ═══ */
  function xsRow(tag, bodyHTML) {
    const row = document.createElement("div");
    row.className = "xs-trace-row";
    const tagEl = document.createElement("span");
    tagEl.className = "xs-trace-tag";
    tagEl.textContent = tag;
    const bodyEl = document.createElement("span");
    bodyEl.className = "xs-trace-text";
    bodyEl.innerHTML = bodyHTML;
    row.appendChild(tagEl);
    row.appendChild(bodyEl);
    return row;
  }

  /* Steps through `steps` ({box,text}) one button-press at a time, appending
     an xsRow each press, then hands off to onDone() once every step has
     shown. Shared by D2's single trace and both halves of D3's ask/teach/
     re-ask sequence. */
  function runTrace(btn, timelineEl, steps, onDone) {
    let i = 0;
    btn.addEventListener("click", () => {
      const row = xsRow(steps[i].box, steps[i].text);
      timelineEl.appendChild(row);
      const r = row.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      i++;
      if (i < steps.length) {
        btn.textContent = "Continue the trace ▶";
      } else {
        btn.remove();
        onDone();
      }
    });
  }

  /* ═══ D1: tour the four boxes — tap-to-reveal, order-free ═══ */
  (function () {
    const BOX_KEYS = ["interface", "engine", "rulebase", "knowledge"];
    const status = $("#status1");
    const visited = new Set();
    BOX_KEYS.forEach(key => {
      const btn = $("#boxBtn-" + key), panel = $("#boxPanel-" + key);
      btn.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        btn.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
        if (!panel.hidden) {
          visited.add(key);
          const r = panel.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
          if (visited.size < BOX_KEYS.length) {
            status.textContent = (BOX_KEYS.length - visited.size) + " more box" + (BOX_KEYS.length - visited.size === 1 ? "" : "es") + " to open.";
          } else {
            status.textContent = "All four opened — interface, inference engine, rule base, knowledge base. Every expert system in this course is built from exactly those four.";
            awardStar("d1", "You opened all four boxes — interface, inference engine, rule base, knowledge base — and read the one job each one does. Everything in Discoveries 2 and 3 is just those four, working.");
          }
        }
      });
    });
  })();

  /* ═══ D2: ask it something — one clean trace, interface to knowledge base and back ═══ */
  (function () {
    const STEPS2 = [
      { box: "Interface", text: "receives the question: what bird was this — a grey-brown body, and a soft cooing call?" },
      { box: "Inference engine", text: "passes the question to the rule base, looking for a rule whose conditions might fit." },
      { box: "Rule base", text: "offers a candidate: IF grey-brown body AND yellow near the tail THEN Yellow-vented Bulbul. The first condition matches — the second doesn't." },
      { box: "Rule base", text: "offers another candidate: IF grey-brown body AND soft cooing call THEN Zebra Dove. Both conditions match this sighting." },
      { box: "Knowledge base", text: "is checked directly: yes, both facts are held here for this sighting — grey-brown body, soft cooing call." },
      { box: "Inference engine", text: "confirms the match and sends the answer back through the interface." }
    ];
    runTrace($("#traceBtn2"), $("#timeline2"), STEPS2, () => {
      const answer = $("#answer2");
      answer.hidden = false;
      answer.textContent = "Interface displays: Zebra Dove.";
      const r = answer.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      awardStar("d2", "You traced one question all the way through the four boxes and back — interface, inference engine, rule base, knowledge base — and watched the rule base offer a near-miss before the right rule was found.");
    });
  })();

  /* ═══ D3: teach it — ask, hit a genuine "no rule matched" diagnosis, teach, re-ask ═══ */
  (function () {
    const STEPS3A = [
      { box: "Interface", text: "receives the question: what bird was this — an olive-green body, and a thin, down-curved bill?" },
      { box: "Inference engine", text: "passes the question to the rule base, looking for a rule whose conditions might fit." },
      { box: "Rule base", text: "is checked end to end — magpie-robin, bulbul, dove, myna — and not one of those rules' conditions fits an olive-green body with a thin down-curved bill." }
    ];
    const STEPS3B = [
      { box: "Interface", text: "receives the very same question again." },
      { box: "Inference engine", text: "passes it to the rule base — which now holds one rule more than it did a moment ago." },
      { box: "Rule base", text: "offers the new candidate: IF olive-green body AND thin down-curved bill THEN Olive-backed Sunbird. Both conditions match." },
      { box: "Inference engine", text: "confirms the match and sends the answer back through the interface." }
    ];
    const timeline = $("#timeline3");

    runTrace($("#traceBtn3"), timeline, STEPS3A, () => {
      const note = $("#noMatchNote3");
      note.hidden = false;
      note.textContent = "No rule matched. That's an accurate diagnosis, not a failure — the inference engine checked every rule it holds, correctly; the rule base simply doesn't hold a rule for this bird yet.";
      $("#teachBtn3").hidden = false;
    });

    $("#teachBtn3").addEventListener("click", () => {
      const card = $("#teachCard3");
      card.hidden = false;
      card.textContent = "A new fact joins the knowledge base: this sighting hovers at a flower, sipping nectar. A new rule joins the rule base: IF olive-green body AND thin down-curved bill THEN Olive-backed Sunbird.";
      const r = card.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      $("#teachBtn3").remove();
      $("#askAgainBtn3").hidden = false;
    });

    runTrace($("#askAgainBtn3"), timeline, STEPS3B, () => {
      const answer = $("#answer3");
      answer.hidden = false;
      answer.textContent = "Interface displays: Olive-backed Sunbird.";
      const r = answer.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      awardStar("d3", "You handed the rule base exactly what it was missing — one new fact, one new rule — and the very same question that came back empty a moment ago now lands on an answer. That's the only way an expert system ever grows: by being given knowledge, never by working it out alone.");
    });
  })();

  /* ═══ D4: the other way — the same mystery, solved from labelled examples, zero rules ═══ */
  (function () {
    const EXAMPLES4 = [
      { label: "Not a sunbird — Common Tailorbird: small, olive-green, but a short straight bill, hopping low in a bush.", guess: "Not enough to go on yet — plenty of small green birds share an olive back." },
      { label: "A sunbird — Olive-backed Sunbird: olive-green back, a thin down-curved bill, hovering at a hibiscus flower.", guess: "Getting warmer — the curved bill and the hovering both echo the mystery sighting." },
      { label: "A sunbird — Olive-backed Sunbird: olive-green, thin down-curved bill, sipping nectar from another flower.", guess: "Olive-backed Sunbird — two labelled examples now share that exact curved bill." },
      { label: "Not a sunbird — Asian Glossy Starling: glossy dark body, a thick straight bill, no hovering at all.", guess: "Still Olive-backed Sunbird — this example's thick straight bill is precisely the feature the mystery sighting doesn't have, which only sharpens the picture." },
      { label: "A sunbird — Olive-backed Sunbird: small olive body, a needle-thin down-curved bill, hovering again.", guess: "Olive-backed Sunbird, held with real confidence now — every example with that thin curved bill has agreed." }
    ];
    const feedBtn = $("#feedBtn4"), timeline = $("#timeline4"), note = $("#note4");
    let j = 0;
    feedBtn.addEventListener("click", () => {
      const ex = EXAMPLES4[j];
      const row = xsRow("Example " + (j + 1), ex.label + "<br><em>Best guess so far: " + ex.guess + "</em>");
      timeline.appendChild(row);
      const r = row.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      j++;
      if (j < EXAMPLES4.length) {
        feedBtn.textContent = "Feed it another example ▶";
      } else {
        feedBtn.remove();
        note.hidden = false;
        note.textContent = "You never gave it a single rule — just five labelled examples — and its own guess sharpened on its own, example by example.";
        awardStar("d4", "You fed a pattern-matcher nothing but labelled examples, and watched its own best guess sharpen entirely on its own. Expert systems grow by being handed knowledge; machine learning is a program adapting its own processes and data as more examples arrive — that's the actual definition, not just a feeling of cleverness.");
      }
    });
  })();

  /* ═══ D5: files, the last piece — order six shuffled pseudocode lines by tap ═══
     A small local tap-to-sequence factory: unlike Module 35's bin-sorter,
     order (not category) is what's being checked, so a single tap either
     extends the built sequence or earns a warm redirect — no select-then-
     place two-step needed. Not promoted to a shared kit (rule of two: no
     other module has needed ordered sequencing yet). */
  (function () {
    function makeSequencer(cfg) {
      let nextIndex = 0;
      const itemEls = {};
      const byId = {};
      cfg.items.forEach(it => { byId[it.id] = it; });

      function tryPlace(item) {
        if (item.id === cfg.items[nextIndex].id) {
          const btn = itemEls[item.id];
          btn.classList.add("placed"); btn.disabled = true;
          const line = document.createElement("div");
          line.className = "seq-line";
          line.textContent = item.label;
          cfg.buildEl.appendChild(line);
          const r = line.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
          nextIndex++;
          if (nextIndex === cfg.items.length) {
            cfg.statusEl.textContent = cfg.doneMessage;
            cfg.onDone();
          } else {
            const left = cfg.items.length - nextIndex;
            cfg.statusEl.textContent = left + " more line" + (left === 1 ? "" : "s") + " to go.";
          }
        } else {
          toast(cfg.wrongMessage());
        }
      }

      cfg.displayOrder.forEach(id => {
        const item = byId[id];
        const b = document.createElement("button");
        b.type = "button"; b.className = "seq-chip"; b.textContent = item.label; b.dataset.id = item.id;
        b.addEventListener("click", () => { if (!b.disabled) tryPlace(item); });
        itemEls[item.id] = b;
        cfg.poolEl.appendChild(b);
      });
    }

    const ITEMS5 = [
      { id: "ow", label: 'OPENFILE "Birds.txt" FOR WRITE' },
      { id: "wf", label: 'WRITEFILE "Birds.txt", NewFact' },
      { id: "cw", label: 'CLOSEFILE "Birds.txt"' },
      { id: "or", label: 'OPENFILE "Birds.txt" FOR READ' },
      { id: "rf", label: 'READFILE "Birds.txt", LoadedFact' },
      { id: "cr", label: 'CLOSEFILE "Birds.txt"' }
    ];

    makeSequencer({
      poolEl: $("#seqPool5"), buildEl: $("#seqBuild5"), statusEl: $("#status5"),
      items: ITEMS5,
      displayOrder: ["wf", "or", "cw", "rf", "ow", "cr"],
      wrongMessage: () => "Not the next line yet — check what still has to happen before this one can run: has the file even been opened, and in which mode?",
      doneMessage: "All six lines placed, in the only order that actually works — opened for one mode, used, closed, then opened again for the other.",
      onDone: () => awardStar("d5", "You wrote the exact commands a program needs to keep what it's learned after the power goes off — OPENFILE, WRITEFILE, READFILE and CLOSEFILE, each file closed before it's reopened in a different mode. That's file handling: memory that survives being switched off.")
    });
  })();

  /* ═══ D6: the ceremony — a symbolic constellation, honestly labelled as symbolic ═══
     Only the six "mine" dots reflect real state (state.doneDiscoveries) —
     the 35 "rest" dots are explicitly, visibly framed in the module's copy
     as a picture rather than a readout, because there is no cross-module
     persistence yet for this page to actually read from (see CLAUDE.md's
     "No localStorage yet" note and the course plan's Part D persistence
     note, which describes this as a later, unbuilt pass). Nothing here
     pretends otherwise. */
  (function () {
    const CONST_MINE_IDS = ["d1", "d2", "d3", "d4", "d5", "d6"];
    const mineEl = $("#constMine"), restEl = $("#constRest");
    CONST_MINE_IDS.forEach(() => {
      const dot = document.createElement("span");
      dot.className = "const-dot";
      mineEl.appendChild(dot);
    });
    for (let i = 0; i < 35; i++) {
      const dot = document.createElement("span");
      dot.className = "const-dot";
      restEl.appendChild(dot);
    }

    $("#assembleBtn6").addEventListener("click", () => {
      const mineDots = $$(".const-dot", mineEl);
      CONST_MINE_IDS.forEach((id, i) => {
        if (id === "d6" || state.doneDiscoveries[id]) mineDots[i].classList.add("lit");
      });
      const restDots = $$(".const-dot", restEl);
      restDots.forEach((dot, i) => {
        dot.style.transitionDelay = reduceMotion ? "0s" : (i * 16) + "ms";
        dot.classList.add("lit");
      });
      $("#assembleBtn6").remove();
      const note = $("#ceremonyNote6");
      note.hidden = false;
      note.textContent = "Six for tonight, thirty-six for the whole course — every one of them genuinely opened, once each, at whatever pace actually worked.";
      const r = note.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      awardStar("d6", "Six stars, tonight, for six discoveries genuinely done. Thirty-six modules, however you paced them — that was always the whole point: not speed, just actually understanding it.");
    });
  })();
