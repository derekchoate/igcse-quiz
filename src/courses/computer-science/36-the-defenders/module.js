
  /* ================= Module 34 — The Defenders =================
   Signature interaction (D5): a many-to-many threat/shield pairing board.
   Tap a threat card to select it, then tap a shield chip to attempt a
   pairing; a valid pairing "clicks in" (recorded on the threat card as an
   attached tag), and several threats validly accept more than one shield —
   attaching a second reads "also works", never "wrong" (design contract
   rule 2). This is hand-rolled rather than the shared `matcher` kit, which
   hardcodes awardStar("d3", ...) for Module 9's one-to-one pairing and
   would both award the wrong discovery here and can't express "several
   valid shields per threat" at all (see feedback_matcher_kit_hardcoded_d3).

   D2's sorter is the same hand-rolled tap-or-drag chip → bin factory used
   by Modules 13/26/27/32/33 (rule of two, not a shared kit — see Module
   33's own note on this). D1's card-reveal and D3's tap-to-find-a-tell
   mechanic both reuse the shared `chips` kit for auto-detected completion;
   D4's two-route reveal and D6's tally + reflection are simple manual
   sequences, matching the plain "Advance ▶" pattern used throughout the
   course (e.g. Module 32's relay, Module 33's D3/D4).

   Every discovery's nudge-zone carries "Show me one first" as a true
   rung 0 — rendered and clickable immediately alongside the nudge ladder,
   never gated behind another nudge (design contract rule 10).

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar and makeChips are all in scope. */

  /* ═══ shared local factory: tap-or-drag chip → bin sorter (D2) ═══
     Copied from Module 33's makeBinSorter() — rule of two, not the shared
     `matcher` kit (see file banner above). */
  function makeBinSorter(opts) {
    const { pool, binsContainer, status, items, bins, doneStatus, wrongMsg, onDone } = opts;
    const itemEls = {}, binEls = {};
    let selected = null, placed = 0;

    function select(id, btn) {
      if (btn.classList.contains("placed")) return;
      if (selected === id) {
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap a threat to begin.";
        return;
      }
      $$(".sl-chip", pool).forEach(c => c.classList.remove("sel"));
      selected = id; btn.classList.add("sel");
      status.textContent = "Now tap the pile you think it belongs on.";
    }
    function tryPlace(key) {
      if (!selected) return;
      const item = items.find(x => x.id === selected);
      const btn = itemEls[item.id];
      if (item.ans === key) {
        btn.classList.remove("sel"); btn.classList.add("placed"); btn.disabled = true;
        const line = document.createElement("div");
        line.className = "sl-bin-line"; line.textContent = item.label;
        binEls[key].body.appendChild(line);
        binEls[key].wrap.classList.add("filled");
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        placed++; selected = null;
        if (placed === items.length) {
          status.textContent = doneStatus;
          onDone();
        } else {
          status.textContent = "That's the one. " + (items.length - placed) + " more to go.";
        }
      } else {
        toast(wrongMsg);
        btn.classList.remove("sel"); selected = null;
        status.textContent = "Tap a threat to try again.";
      }
    }
    function binUnder(e) {
      if (dragGhost) dragGhost.style.visibility = "hidden";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (dragGhost) dragGhost.style.visibility = "";
      const bin = el && el.closest ? el.closest(".sl-bin") : null;
      if (!bin) return null;
      for (const k in binEls) { if (binEls[k].wrap === bin) return k; }
      return null;
    }
    function markHover(key) {
      Object.keys(binEls).forEach(k => binEls[k].wrap.classList.toggle("drop-ok", k === key));
    }
    let dragId = null, dragging = false, dragGhost = null, dragPtrId = null;
    let dragStartX = 0, dragStartY = 0, dragOffX = 0, dragOffY = 0;
    function dragStart(e, id, btn) {
      if (btn.classList.contains("placed")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragId = id; dragPtrId = e.pointerId; dragging = false;
      dragStartX = e.clientX; dragStartY = e.clientY;
      document.addEventListener("pointermove", dragMove);
      document.addEventListener("pointerup", dragEnd);
      document.addEventListener("pointercancel", dragEnd);
    }
    function dragMove(e) {
      if (dragId === null || e.pointerId !== dragPtrId) return;
      const btn = itemEls[dragId];
      if (!dragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) < 6) return;
        dragging = true;
        const rect = btn.getBoundingClientRect();
        dragOffX = dragStartX - rect.left; dragOffY = dragStartY - rect.top;
        dragGhost = btn.cloneNode(true);
        dragGhost.classList.add("sl-chip-ghost"); dragGhost.classList.remove("sel");
        dragGhost.style.width = rect.width + "px";
        document.body.appendChild(dragGhost);
        btn.classList.add("dragging");
        $$(".sl-chip", pool).forEach(c => c.classList.remove("sel"));
        selected = null;
      }
      e.preventDefault();
      dragGhost.style.left = (e.clientX - dragOffX) + "px";
      dragGhost.style.top = (e.clientY - dragOffY) + "px";
      markHover(binUnder(e));
    }
    function dragEnd(e) {
      if (dragId === null || e.pointerId !== dragPtrId) return;
      const id = dragId, btn = itemEls[id];
      document.removeEventListener("pointermove", dragMove);
      document.removeEventListener("pointerup", dragEnd);
      document.removeEventListener("pointercancel", dragEnd);
      if (dragging) {
        const key = binUnder(e);
        markHover(null);
        if (dragGhost) { dragGhost.remove(); dragGhost = null; }
        btn.classList.remove("dragging");
        if (key) { selected = id; tryPlace(key); }
      } else if (e.type !== "pointercancel") {
        select(id, btn);
      }
      dragId = null; dragging = false; dragPtrId = null;
    }
    function buildChip(item) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "sl-chip"; b.dataset.id = item.id;
      b.textContent = item.label;
      b.addEventListener("click", () => { if (!dragging) select(item.id, b); });
      b.addEventListener("pointerdown", e => dragStart(e, item.id, b));
      itemEls[item.id] = b;
      return b;
    }
    function buildBin(bin) {
      const wrap = document.createElement("div"); wrap.className = "sl-bin";
      const head = document.createElement("button");
      head.type = "button"; head.className = "sl-bin-head"; head.textContent = bin.label;
      head.addEventListener("click", () => tryPlace(bin.key));
      const body = document.createElement("div"); body.className = "sl-bin-body"; body.setAttribute("aria-live", "polite");
      wrap.appendChild(head); wrap.appendChild(body);
      binEls[bin.key] = { wrap, body, head };
      return wrap;
    }
    bins.forEach(bin => binsContainer.appendChild(buildBin(bin)));
    items.forEach(item => pool.appendChild(buildChip(item)));
  }

  /* ═══ shared data: the six malware family members (D1) ═══
     Cambridge 0478 syllabus 5.3 verbatim list: virus, worm, Trojan horse,
     spyware, adware, ransomware. */
  const MALWARE_TYPES = [
    { id: "virus", name: "Virus", trait: "Attaches itself to a legitimate file or program, and only spreads when a person shares or runs that file — it needs a host, and it needs you to press play." },
    { id: "worm", name: "Worm", trait: "A standalone program that copies itself across a network entirely on its own — no host file to attach to, no person needing to run anything. It just travels." },
    { id: "trojan", name: "Trojan horse", trait: "Disguises itself as something useful or wanted, and relies on you installing it yourself, believing the disguise. It doesn't copy itself around — it lies about itself." },
    { id: "spyware", name: "Spyware", trait: "Installs itself quietly and watches — keystrokes, browsing, whatever it's built to log — then sends what it collects back out, without ever announcing itself." },
    { id: "adware", name: "Adware", trait: "Floods a device with unwanted adverts, often while quietly tracking what you look at to decide which ones to show you." },
    { id: "ransomware", name: "Ransomware", trait: "Locks up a device's own files — usually by scrambling them — and demands a payment before it will hand back the key." }
  ];

  /* ═══ shared data: the eight non-malware threats (D2, D5) ═══
     Cambridge 0478 syllabus 5.3 verbatim list: brute-force attack, data
     interception, DDoS attack, hacking, malware, pharming, phishing,
     social engineering. */
  const THREATS = [
    { id: "brute", label: "Brute-force attack", blurb: "Trying every possible password, one after another, usually automated, until one of them happens to work.", family: "wire" },
    { id: "interception", label: "Data interception", blurb: "Secretly capturing data as it travels across a network — for example over public Wi-Fi — without the sender or receiver ever knowing.", family: "wire" },
    { id: "ddos", label: "DDoS attack", blurb: "Flooding a server with traffic from huge numbers of devices at once, so it can't keep up and real visitors are locked out.", family: "wire" },
    { id: "hacking", label: "Hacking", blurb: "Gaining unauthorised access to a computer system, usually by exploiting a weakness in it.", family: "wire" },
    { id: "malware", label: "Malware", blurb: "Software written specifically to damage, disrupt or gain unauthorised access to a system — virus, worm, Trojan horse, spyware, adware and ransomware are all species of it.", family: "wire" },
    { id: "pharming", label: "Pharming", blurb: "Malicious code quietly redirects you to a fake website — even typing the correct address yourself can still land you on the fake one.", family: "wire" },
    { id: "phishing", label: "Phishing", blurb: "A fake message pretending to be from someone you'd trust, built to talk you into handing over information or clicking something you shouldn't.", family: "person" },
    { id: "social", label: "Social engineering", blurb: "Manipulating a person directly, through trust, authority or urgency, rather than attacking the system at all.", family: "person" }
  ];

  /* ═══ shared data: the ten protections (D5, D6) ═══
     Cambridge 0478 syllabus 5.3 verbatim list: access levels; anti-malware
     (anti-virus, anti-spyware); authentication (username and password,
     biometrics, two-step verification); automating software updates;
     checking the spelling and tone of communications; checking the URL
     attached to a link; firewalls; privacy settings; proxy-servers; SSL. */
  const SHIELDS = [
    { id: "access", label: "Access levels", blurb: "Giving each user only the permissions they need, so even someone who gets in can't reach everything." },
    { id: "antimalware", label: "Anti-malware", blurb: "Software — anti-virus, anti-spyware and similar — that scans for, blocks and removes malicious programs." },
    { id: "auth", label: "Authentication", blurb: "Proving you're really you before you're let in: a password, a fingerprint, or a one-time code sent to your phone (two-step verification) — often two of these together, not two passwords." },
    { id: "updates", label: "Automating software updates", blurb: "Letting software patch its own known weaknesses automatically, before an attacker finds them first." },
    { id: "spelling", label: "Checking spelling & tone", blurb: "Reading a message's wording and mood, not just its claim — genuine organisations proofread, and manufactured urgency is a tell in itself." },
    { id: "urlcheck", label: "Checking the link", blurb: "Looking at exactly where a link leads, not just what it says — character by character, before you tap it." },
    { id: "firewall", label: "Firewalls", blurb: "A checkpoint between a device and a network that filters traffic, blocking anything that looks unauthorised." },
    { id: "privacy", label: "Privacy settings", blurb: "Limiting who can see your personal details, so there's less real information around for an attacker to build a convincing story from." },
    { id: "proxy", label: "Proxy servers", blurb: "A go-between that handles requests on a device's behalf, hiding its details and able to filter what traffic gets through." },
    { id: "ssl", label: "SSL", blurb: "Secure socket layer — the protocol that locks data in transit between a device and a server, the same padlock trick from Module 15." }
  ];

  /* Valid threat → shield pairings for the D5 defence stack. Several
     threats deliberately accept more than one valid shield (ddos, hacking,
     malware, phishing, social) so the "also works" mechanic has real
     material to work with; every shield is used at least once. */
  const PAIRS = {
    brute: ["auth"],
    interception: ["ssl"],
    ddos: ["firewall", "proxy"],
    hacking: ["firewall", "access", "auth"],
    malware: ["antimalware", "updates", "firewall"],
    pharming: ["urlcheck"],
    phishing: ["spelling", "urlcheck", "auth"],
    social: ["spelling", "auth", "privacy"]
  };

  /* ═══ shared data: five phishing messages, thirteen tells (D3) ═══ */
  const PHISH_MESSAGES = [
    {
      id: "m1",
      tells: { sender: true, urgent: true, link: true },
      sender: "NusaBank Security <security@nusabank-support-team.com>",
      subject: "URGENT: Account verification required within 24 hours",
      greeting: "Dear Customer,",
      bodyPre: "We've detected unusual activity on your account.",
      urgentPhrase: "Verify your details within 24 hours or your account will be permanently suspended.",
      bodyPost: "Tap below to confirm it's really you.",
      linkText: "Verify my account →",
      linkHref: "nusabank-secure-login.com/verify",
      notes: {
        sender: "security@nusabank-support-team.com isn't NusaBank's real address. Read it slowly — nusabank-support-team.com is a lookalike domain, not nusabank.com.my.",
        urgent: "\"within 24 hours or permanently suspended\" is built to make you act before you check anything. A real bank doesn't threaten to suspend your account over a message like this.",
        link: "The button says \"Verify my account,\" but it actually leads to nusabank-secure-login.com — not NusaBank's real site at nusabank.com.my."
      }
    },
    {
      id: "m2",
      tells: { sender: false, urgent: true, link: true },
      sender: "SwiftPos Courier <delivery@swiftpos-courier.com>",
      subject: "Redelivery fee outstanding",
      greeting: "Hi there,",
      bodyPre: "Your parcel is on hold.",
      urgentPhrase: "Pay the RM2.50 redelivery fee within 3 hours or it will be returned to sender.",
      bodyPost: "Settle it below to release your parcel.",
      linkText: "Pay redelivery fee",
      linkHref: "swiftpos-payment-secure.net/pay",
      notes: {
        sender: "delivery@swiftpos-courier.com actually matches SwiftPos's own domain — nothing off about this one. The tell in this message is elsewhere.",
        urgent: "A tiny fee, a tight countdown, and a threat of losing the parcel — all three are pressure, stacked on purpose so you pay before you think to check the link.",
        link: "\"Pay redelivery fee\" leads to swiftpos-payment-secure.net — a different domain entirely from swiftpos-courier.com, the one the message actually came from."
      }
    },
    {
      id: "m3",
      tells: { sender: true, urgent: true, link: true },
      sender: "Grand Draw Committee <winner@luckydraw-claim.org>",
      subject: "Congratulations — you've won RM5,000",
      greeting: "Dear Valued Customer,",
      bodyPre: "Your number was selected in our monthly draw.",
      urgentPhrase: "Claim your prize within 48 hours or it will be given to the next winner.",
      bodyPost: "Provide your details below to receive your winnings.",
      linkText: "Claim my prize",
      linkHref: "luckydraw-claim-verify.org/claim",
      notes: {
        sender: "\"Dear Valued Customer\" from a committee you've never entered a draw with, sent from luckydraw-claim.org — a domain invented for exactly this message, not an organisation with a history.",
        urgent: "You can't win a draw you never entered. The 48-hour countdown exists to stop you pausing on that fact for long enough to notice it.",
        link: "\"Claim my prize\" leads to luckydraw-claim-verify.org — not even the same address the message claims to be from."
      }
    },
    {
      id: "m4",
      tells: { sender: true, urgent: false, link: true },
      sender: "QuickHire Careers <hr@quickhire-careers-online.com>",
      subject: "Job offer confirmed — respond to secure your place",
      greeting: "Hi,",
      bodyPre: "We're pleased to offer you a work-from-home position.",
      urgentPhrase: "Please respond soon to confirm your start date.",
      bodyPost: "Accept your offer below.",
      linkText: "Accept offer",
      linkHref: "quickhire-onboarding.net/accept",
      notes: {
        sender: "hr@quickhire-careers-online.com is a domain built to sound like a careers site without being one — no company this size runs its hiring from a domain that generic.",
        urgent: "\"Respond soon\" carries none of the countdown-and-threat pressure the other messages lean on — this one is trying to look calm on purpose. That's not where its tell is.",
        link: "\"Accept offer\" leads to quickhire-onboarding.net — a completely different domain from the one the message was sent from."
      }
    },
    {
      id: "m5",
      tells: { sender: true, urgent: true, link: true },
      sender: "IT Helpdesk <support@company-it-helpdesk.info>",
      subject: "Your password expires today",
      greeting: "Dear User,",
      bodyPre: "Our records show your password is due to expire.",
      urgentPhrase: "Reset it within 1 hour to avoid being locked out of your account.",
      bodyPost: "Reset your password using the link below.",
      linkText: "Reset password now",
      linkHref: "password-reset-verify.info/reset",
      notes: {
        sender: "\"Dear User\" instead of your actual name, sent from company-it-helpdesk.info — a generic domain standing in for a real IT department's actual address.",
        urgent: "One hour to reset a password \"or be locked out\" is a manufactured deadline — real password expiries give days of warning, not sixty minutes.",
        link: "\"Reset password now\" leads to password-reset-verify.info — not your organisation's actual domain at all."
      }
    }
  ];

  /* ═══ D1: the malware family album — reveal each trait, chips track all six ═══ */
  (function () {
    const host = $("#cards1");
    const ids = MALWARE_TYPES.map(m => m.id);
    const check1 = makeChips($("#chips1"), ids,
      () => awardStar("d1", "Six kinds of malicious software, each one caught by a single distinguishing trait — not by what damage it does, but by how it behaves."),
      id => MALWARE_TYPES.find(m => m.id === id).name,
      (label, remaining) => "Read " + label + "'s trait — " + remaining + " more to go.");

    MALWARE_TYPES.forEach(m => {
      const card = document.createElement("div");
      card.className = "mw-card";
      const name = document.createElement("p");
      name.className = "mw-name"; name.textContent = m.name;
      const trait = document.createElement("p");
      trait.className = "mw-trait"; trait.hidden = true; trait.textContent = m.trait;
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "loop-btn"; btn.textContent = "See how it spreads ▶";
      btn.addEventListener("click", () => {
        trait.hidden = false; btn.remove(); card.classList.add("matched");
        const r = card.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        check1(m.id);
      });
      card.appendChild(name); card.appendChild(trait); card.appendChild(btn);
      host.appendChild(card);
    });
  })();

  /* ═══ D2: on the wire, or on the person — sort all eight threats ═══ */
  makeBinSorter({
    pool: $("#pool2"),
    binsContainer: $("#bins2"),
    status: $("#status2"),
    items: THREATS.map(t => ({ id: t.id, label: t.label + " — " + t.blurb, ans: t.family === "wire" ? "Wire" : "Person" })),
    bins: [
      { key: "Wire", label: "Attacks on the wire — target the system" },
      { key: "Person", label: "Attacks on the person — target human judgement" }
    ],
    doneStatus: "All eight sorted — the system's weaknesses on one pile, the human ones on the other.",
    wrongMsg: "Not that pile — ask yourself: is a machine being attacked directly, or is a person being talked into something?",
    onDone: () => awardStar("d2", "Eight threats sorted by what they actually go after. Two of the eight never touch the system at all — they go straight for whoever's using it.")
  });

  /* ═══ D3: the phishing line-up — tap hotspots, tells glow, rest just wait ═══ */
  (function () {
    const host = $("#lineup3"), note = $("#lineupNote3");
    let found = 0;
    let total = 0;
    PHISH_MESSAGES.forEach(m => { ["sender", "urgent", "link"].forEach(t => { if (m.tells[t]) total++; }); });

    function updateNote() {
      if (found < total) {
        note.textContent = found + " of " + total + " tells found so far, across all five messages.";
      } else {
        note.textContent = "All " + total + " tells found, across all five messages.";
      }
    }

    function tapHotspot(m, type, btn, noteEl) {
      const already = btn.classList.contains("found") || btn.classList.contains("checked");
      noteEl.hidden = false;
      noteEl.textContent = m.notes[type];
      if (already) return;
      if (m.tells[type]) {
        btn.classList.add("found");
        btn.setAttribute("aria-pressed", "true");
        const r = btn.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        found++;
        updateNote();
        if (found === total) {
          awardStar("d3", "Every tell found, across all five messages — sender address, urgent tone, mismatched link. That's the whole toolkit, and you now use it on sight.");
        }
      } else {
        btn.classList.add("checked");
        btn.setAttribute("aria-pressed", "true");
      }
    }

    PHISH_MESSAGES.forEach(m => {
      const card = document.createElement("div");
      card.className = "ph-msg";

      const head = document.createElement("div");
      head.className = "ph-head";
      const senderBtn = document.createElement("button");
      senderBtn.type = "button"; senderBtn.className = "ph-hot ph-sender"; senderBtn.setAttribute("aria-pressed", "false");
      senderBtn.innerHTML = "<b>From:</b> " + m.sender;
      const senderNote = document.createElement("p");
      senderNote.className = "ph-note"; senderNote.hidden = true;
      senderBtn.addEventListener("click", () => tapHotspot(m, "sender", senderBtn, senderNote));
      const subject = document.createElement("p");
      subject.className = "ph-subject"; subject.textContent = m.subject;
      head.appendChild(senderBtn); head.appendChild(senderNote); head.appendChild(subject);

      const body = document.createElement("p");
      body.className = "ph-body";
      body.appendChild(document.createTextNode(m.greeting + " " + m.bodyPre + " "));
      const urgentBtn = document.createElement("button");
      urgentBtn.type = "button"; urgentBtn.className = "ph-hot ph-urgent"; urgentBtn.setAttribute("aria-pressed", "false");
      urgentBtn.textContent = m.urgentPhrase;
      const urgentNote = document.createElement("p");
      urgentNote.className = "ph-note"; urgentNote.hidden = true;
      urgentBtn.addEventListener("click", () => tapHotspot(m, "urgent", urgentBtn, urgentNote));
      body.appendChild(urgentBtn);
      body.appendChild(document.createTextNode(" " + m.bodyPost));

      const linkRow = document.createElement("p");
      linkRow.className = "ph-linkrow";
      const linkBtn = document.createElement("button");
      linkBtn.type = "button"; linkBtn.className = "ph-hot ph-link"; linkBtn.setAttribute("aria-pressed", "false");
      linkBtn.textContent = m.linkText;
      const linkNote = document.createElement("p");
      linkNote.className = "ph-note"; linkNote.hidden = true;
      linkBtn.addEventListener("click", () => tapHotspot(m, "link", linkBtn, linkNote));
      linkRow.appendChild(linkBtn);

      card.appendChild(head);
      card.appendChild(body);
      card.appendChild(urgentNote);
      card.appendChild(linkRow);
      card.appendChild(linkNote);
      host.appendChild(card);
    });

    updateNote();
  })();

  /* ═══ D4: pharming vs phishing — two routes, same fake page ═══ */
  (function () {
    const ROUTE_PHISHING = [
      "A message arrives claiming to be from NusaBank, urging you to verify your account right now.",
      "You tap the link inside it — it opens a page built to look exactly like NusaBank's real site.",
      "You type in your login details there. Whoever built that page now has them."
    ];
    const ROUTE_PHARMING = [
      "Malicious code — on your own device, or in the DNS lookup from Module 32 that turns nusabank.com.my into a number — has been quietly tampered with.",
      "You type nusabank.com.my into your browser yourself, correctly, from memory. No message involved at all.",
      "The tampered lookup sends you to the exact same fake page anyway. You never clicked anything suspicious."
    ];

    let routesDone = 0;
    function checkConverge() {
      if (routesDone === 2) {
        const note = $("#convergeNote4");
        note.hidden = false;
        note.textContent = "Same fake page. Same stolen details. Two completely different roads in.";
        awardStar("d4", "You walked both roads and they arrived at the identical fake page — one needed a message and a click, the other needed nothing from you at all beyond typing an address you already knew.");
      }
    }

    function buildRoute(containerId, title, steps) {
      const host = $("#" + containerId);
      const heading = document.createElement("p");
      heading.className = "pv-route-title"; heading.textContent = title;
      const stepsHost = document.createElement("div");
      stepsHost.className = "pv-steps";
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "loop-btn primary"; btn.textContent = "Reveal step 1 ▶";
      host.appendChild(heading); host.appendChild(stepsHost); host.appendChild(btn);
      let i = 0;
      btn.addEventListener("click", () => {
        const p = document.createElement("p");
        p.className = "pv-step"; p.textContent = (i + 1) + ". " + steps[i];
        stepsHost.appendChild(p);
        const r = p.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        i++;
        if (i < steps.length) {
          btn.textContent = "Reveal step " + (i + 1) + " ▶";
        } else {
          btn.remove();
          routesDone++;
          checkConverge();
        }
      });
    }

    buildRoute("routeA4", "Route A — Phishing (the fake letter)", ROUTE_PHISHING);
    buildRoute("routeB4", "Route B — Pharming (the fake signpost)", ROUTE_PHARMING);
  })();

  /* ═══ D5: build the defence stack — many-to-many pairing board ═══
     Signature interaction. Tap a threat to select it, then tap a shield;
     a valid pairing attaches (recorded as a tag on the threat card), and a
     second valid shield on an already-defended threat reads "also works".
     An invalid pairing gets a warm redirect — nothing is ever marked
     wrong, and neither card changes state. */
  (function () {
    const threatsHost = $("#threats5"), shieldsHost = $("#shields5"), status = $("#status5");
    const threatEls = {}, tagHosts = {}, shieldEls = {};
    const attached = {};
    THREATS.forEach(t => { attached[t.id] = new Set(); });
    let selected = null;
    let defendedCount = 0;

    function selectThreat(id) {
      if (selected === id) {
        threatEls[id].classList.remove("sel");
        threatEls[id].setAttribute("aria-pressed", "false");
        selected = null;
        status.textContent = "Tap a threat to begin, then tap a shield you think defends against it.";
        return;
      }
      if (selected) {
        threatEls[selected].classList.remove("sel");
        threatEls[selected].setAttribute("aria-pressed", "false");
      }
      selected = id;
      threatEls[id].classList.add("sel");
      threatEls[id].setAttribute("aria-pressed", "true");
      status.textContent = "Now tap a shield you think defends against " + THREATS.find(t => t.id === id).label + ".";
    }

    function attemptShield(shieldId) {
      if (!selected) {
        status.textContent = "Tap a threat card first, then a shield.";
        return;
      }
      const threatId = selected;
      const shield = SHIELDS.find(s => s.id === shieldId);
      const threat = THREATS.find(t => t.id === threatId);
      if (attached[threatId].has(shieldId)) {
        toast(shield.label + " is already paired with " + threat.label + " — try another shield, or another threat.");
        return;
      }
      const valid = PAIRS[threatId].includes(shieldId);
      if (valid) {
        attached[threatId].add(shieldId);
        const tag = document.createElement("span");
        tag.className = "ds-tag"; tag.textContent = shield.label;
        tagHosts[threatId].appendChild(tag);
        const r = shieldEls[shieldId].getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
        const first = attached[threatId].size === 1;
        if (first) {
          threatEls[threatId].classList.add("matched");
          defendedCount++;
          status.textContent = shield.label + " defends against " + threat.label + " — " + shield.blurb;
          if (defendedCount === THREATS.length) {
            awardStar("d5", "Every threat carries at least one shield that actually defends against it — several of them carry more than one, because real defence is never just a single thing.");
          }
        } else {
          toast("Also works — " + shield.label + " defends against this too, alongside what's already attached.");
        }
      } else {
        toast(shield.label + " doesn't really touch " + threat.label + " — that one's built for a different kind of attack. Try another shield, or another threat.");
      }
    }

    THREATS.forEach(t => {
      const card = document.createElement("button");
      card.type = "button"; card.className = "ds-threat"; card.setAttribute("aria-pressed", "false");
      const name = document.createElement("span");
      name.className = "ds-name"; name.textContent = t.label;
      const blurb = document.createElement("span");
      blurb.className = "ds-blurb"; blurb.textContent = t.blurb;
      const tags = document.createElement("span");
      tags.className = "ds-attached";
      card.appendChild(name); card.appendChild(blurb); card.appendChild(tags);
      card.addEventListener("click", () => selectThreat(t.id));
      threatsHost.appendChild(card);
      threatEls[t.id] = card;
      tagHosts[t.id] = tags;
    });

    SHIELDS.forEach(s => {
      const chip = document.createElement("button");
      chip.type = "button"; chip.className = "ds-shield"; chip.textContent = s.label;
      chip.addEventListener("click", () => attemptShield(s.id));
      shieldsHost.appendChild(chip);
      shieldEls[s.id] = chip;
    });
  })();

  /* ═══ D6: the honest truth — a tally, then a reflection, not a gotcha ═══ */
  (function () {
    const tallyHost = $("#tally6"), btn = $("#revealTruth6"), note = $("#truthNote6");

    function shieldCount(shieldId) {
      return THREATS.filter(t => PAIRS[t.id].includes(shieldId)).length;
    }

    SHIELDS.slice().sort((a, b) => shieldCount(b.id) - shieldCount(a.id)).forEach(s => {
      const row = document.createElement("p");
      row.className = "ht-row";
      const count = shieldCount(s.id);
      row.innerHTML = "<span class=\"ht-shield\">" + s.label + "</span><span class=\"ht-count\">" + count + " threat" + (count === 1 ? "" : "s") + "</span>";
      tallyHost.appendChild(row);
    });

    btn.addEventListener("click", () => {
      note.hidden = false;
      note.textContent = "By raw count, Authentication touches the most threats on this list — that's real, and worth taking seriously. But a tally like this can flatter one shield while hiding the two habits doing the most quiet work across the whole list: automating software updates closes the technical doors before malware or a hacker finds them, and staying suspicious of a message's spelling, tone and links closes the human ones — phishing, social engineering, and often pharming too, all lean on you not questioning what's in front of you. Neither of those two habits shows up as a single card with the highest number, because they're not really shields at all. They're what you do, every single time, regardless of which shield happens to be running.";
      const r = note.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
      awardStar("d6", "You've now met every threat and every shield on the syllabus list — and the real finding isn't a single winning shield. It's two habits that quietly outperform any one card: keeping things updated, and staying a little bit suspicious.");
    });
  })();
