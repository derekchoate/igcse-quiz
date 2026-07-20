
  /* ================= Module 18 — The Loop That Never Stops =================
   D2, D3 and D4 all reuse the shared cpu kit's crank mode (identical shape
   to old Module 16's bespoke makeCrank, now promoted into
   src/engine/interactions/cpu.js since the same diagram is reused across
   Modules 16-18 — see that file's header for the full rationale).

   D1 is a small three-question multiple-choice warm-up (same shape as
   Module 17's D3 quiz, not shared across files since each lesson's
   module.js is concatenated independently by tools/build.mjs).

   Runs inside the shared engine IIFE, so $, $$, reduceMotion, sparks, toast,
   awardStar, makeChips and makeCpuBoard are all in scope. */

  /* ═══ D1: remember the crew? — three-question warm-up ═══ */
  const PART_LABELS = {
    CU: "CU — Control Unit", ALU: "ALU — Arithmetic Logic Unit", PC: "PC — Program Counter",
    MAR: "MAR — Memory Address Register", MDR: "MDR — Memory Data Register",
    CIR: "CIR — Current Instruction Register", ACC: "ACC — Accumulator"
  };
  const QUIZ1 = [
    { id: "q1", text: "Decides what each instruction means and sends out the signals to match.", choices: ["CU", "ALU", "CIR"], ans: "CU" },
    { id: "q2", text: "Holds the address of the NEXT instruction to fetch.", choices: ["PC", "MAR", "MDR"], ans: "PC" },
    { id: "q3", text: "Keeps the running number after the ALU finishes adding.", choices: ["ACC", "ALU", "MDR"], ans: "ACC" }
  ];
  const quiz1 = $("#quiz1");
  let doneCount1 = 0;
  QUIZ1.forEach(q => {
    const row = document.createElement("div"); row.className = "quiz-row";
    const p = document.createElement("p"); p.className = "quiz-text"; p.textContent = q.text;
    const btns = document.createElement("div"); btns.className = "quiz-btns";
    q.choices.forEach(choice => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "loop-btn quiz-choice"; b.textContent = PART_LABELS[choice];
      b.addEventListener("click", () => {
        if (row.classList.contains("solved")) return;
        if (choice === q.ans) {
          row.classList.add("solved");
          btns.querySelectorAll("button").forEach(x => x.disabled = true);
          b.classList.add("chosen-right");
          const r = b.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top);
          doneCount1++;
          if (doneCount1 === QUIZ1.length) {
            awardStar("d1", "The crew, recalled — three for three, ready for the crank.");
          }
        } else {
          toast("Not that part — think back to the groups from Module 16.");
        }
      });
      btns.appendChild(b);
    });
    row.appendChild(p); row.appendChild(btns);
    quiz1.appendChild(row);
  });

  /* ═══ D2: one full fetch — watch PC increment mid-cycle ═══ */
  const FETCH_STEPS_2 = [
    { set: { mar: 100 }, bus: { type: "address", label: "Address bus: 100 (from PC) → MAR" },
      log: "PC's address, 100, travels the address bus into MAR." },
    { set: { pc: 101 }, busNote: "No bus needed here — PC just increments inside the CPU.",
      log: "PC increments to 101 — already pointing at the NEXT instruction, before this one has even reached the CIR." },
    { cu: true, bus: { type: "control", label: "Control bus: READ signal → memory" },
      log: "The control unit sends a READ signal along the control bus, telling memory to hand over what's stored at address 100." },
    { set: { mem: { addr: 100, val: "LOAD 200" }, mdr: "LOAD 200" }, bus: { type: "data", label: "Data bus: “LOAD 200” ← memory" },
      log: "Memory sends back what's stored at address 100 — the instruction “LOAD 200” — along the data bus into MDR." },
    { set: { cir: "LOAD 200" }, cu: true, busNote: "No bus needed here — MDR copies straight into CIR inside the CPU.",
      log: "MDR's contents copy into CIR — the instruction has arrived, ready to be decoded next." }
  ];
  makeCpuBoard("cpuMount2", { mode: "crank", steps: FETCH_STEPS_2, initial: { pc: 100 },
    onFinish: () => awardStar("d2", "A whole fetch, one micro-step at a time — and you caught PC updating two steps before the instruction even reached the CIR.")
  });

  /* ═══ D3: decode and execute an ADD — pick an amount, watch ACC change ═══ */
  function buildAddSteps3(amt) {
    return [
      { cu: true, log: "The control unit decodes CIR: “ADD 201” means — add whatever's stored at address 201 to the accumulator." },
      { set: { mar: 201 }, bus: { type: "address", label: "Address bus: 201 → MAR" }, log: "201 travels the address bus into MAR." },
      { set: { mem: { addr: 201, val: amt }, mdr: amt }, bus: { type: "data", label: "Data bus: " + amt + " ← memory" },
        log: "Memory sends back the value stored there — " + amt + " — along the data bus into MDR." },
      { set: { acc: 19 + amt }, alu: true, busNote: "No bus needed here — the ALU works entirely inside the CPU.",
        log: "The ALU adds MDR's " + amt + " to ACC's 19. ACC updates to " + (19 + amt) + " — right before your eyes." }
    ];
  }
  const addSlider3 = $("#addSlider3"), addVal3 = $("#addVal3");
  addSlider3.addEventListener("input", () => { addVal3.textContent = "Add: " + addSlider3.value; });

  const check3 = makeChips($("#chips3"), ["small", "large"],
    () => awardStar("d3", "A small amount and a large amount, both added to ACC in front of you — same trick, same ALU, whatever number you pick."),
    k => (k === "small" ? "a small amount" : "a large amount"),
    (label, remaining) => "ADDed " + label + ". " + remaining + " more to try.");

  let lastAmt3 = null;
  $("#startAdd3").addEventListener("click", () => {
    lastAmt3 = Number(addSlider3.value);
    makeCpuBoard("cpuMount3", { mode: "crank", steps: buildAddSteps3(lastAmt3), initial: { cir: "ADD 201", acc: 19, pc: 102 },
      onFinish: () => check3(lastAmt3 <= 9 ? "small" : (lastAmt3 >= 15 ? "large" : null))
    });
  });

  /* ═══ D4: run a whole three-line program — predict ACC, then crank ═══ */
  const FULL_STEPS_4 = [
    // LOAD 200
    { set: { pc: 101, mar: 100, mdr: "LOAD 200", cir: "LOAD 200" }, bus: { type: "data", label: "Address then data bus: 100 → MAR, instruction ← memory" },
      log: "Fetch: address 100 → MAR; PC increments to 101; the instruction “LOAD 200” arrives in MDR, then CIR." },
    { cu: true, busNote: "No bus needed here — the control unit decodes CIR inside the CPU.",
      log: "Decode: “LOAD 200” means — copy whatever's at address 200 into the accumulator." },
    { set: { mar: 200, mem: { addr: 200, val: 19 }, mdr: 19, acc: 19 }, bus: { type: "data", label: "Address then data bus: 200 → MAR, 19 ← memory" },
      log: "Execute: 19 (your age) copies from memory straight into ACC — no ALU needed, LOAD is just a delivery." },
    // ADD 201
    { set: { pc: 102, mar: 101, mdr: "ADD 201", cir: "ADD 201" }, bus: { type: "data", label: "Address then data bus: 101 → MAR, instruction ← memory" },
      log: "Fetch: address 101 → MAR; PC increments to 102; the instruction “ADD 201” arrives in MDR, then CIR." },
    { cu: true, busNote: "No bus needed here — the control unit decodes CIR inside the CPU.",
      log: "Decode: “ADD 201” means — add whatever's at address 201 to the accumulator." },
    { set: { mar: 201, mem: { addr: 201, val: 6 }, mdr: 6, acc: 25 }, alu: true, bus: { type: "data", label: "Address then data bus: 201 → MAR, 6 ← memory" },
      log: "Execute: the ALU adds 6 to ACC's 19. ACC becomes 25." },
    // STORE 202
    { set: { pc: 103, mar: 102, mdr: "STORE 202", cir: "STORE 202" }, bus: { type: "data", label: "Address then data bus: 102 → MAR, instruction ← memory" },
      log: "Fetch: address 102 → MAR; PC increments to 103; the instruction “STORE 202” arrives in MDR, then CIR." },
    { cu: true, busNote: "No bus needed here — the control unit decodes CIR inside the CPU.",
      log: "Decode: “STORE 202” means — copy the accumulator's value out to address 202." },
    { set: { mar: 202, mem: { addr: 202, val: 25 } }, bus: { type: "data", label: "Address then data bus: 202 → MAR, 25 → memory" },
      log: "Execute: ACC's 25 travels out to address 202 in memory. The program has finished." }
  ];
  const guessDial4 = $("#guessDial4"), guessVal4 = $("#guessVal4"), guessResult4 = $("#guessResult4");
  guessDial4.addEventListener("input", () => { guessVal4.textContent = "Guess: " + guessDial4.value; });

  let locked4 = false;
  $("#lockGuess4").addEventListener("click", () => {
    if (locked4) return;
    locked4 = true;
    const guess = Number(guessDial4.value);
    guessDial4.disabled = true;
    document.getElementById("lockGuess4").disabled = true;
    guessResult4.textContent = "Guess locked in at " + guess + ". Crank through the program to see.";
    makeCpuBoard("cpuMount4", { mode: "crank", steps: FULL_STEPS_4, initial: { pc: 100 },
      onFinish: state => {
        const actual = state.acc;
        if (actual === guess) {
          guessResult4.textContent = "Your guess of " + guess + " — bang on! ACC really did land on " + actual + ".";
        } else {
          guessResult4.textContent = "You guessed " + guess + " — the machine landed on " + actual + ". No bother at all: 19 (LOAD) + 6 (ADD) = 25, then STORE just tucked that 25 away without changing it.";
        }
        awardStar("d4", "A whole three-line program, predicted and then run for real — LOAD, ADD and STORE, start to finish.");
      }
    });
  });
