/* ================= kit: cpu =================
   The shared CPU-and-memory schematic used by Modules 16-18. One diagram,
   three uses:
     - Module 16 builds it up part by part ("reveal" mode) as each discovery
       teaches 2-3 new parts.
     - Module 17 lights the shared bus strip as parcels are sorted onto
       address/data/control ("bus" mode — parts are already fully revealed).
     - Module 18 drives it one micro-step at a time with a crank ("crank"
       mode), identical in spirit to the fetch-decode-execute stepper the
       diagram was originally built for.

   makeCpuBoard(mountId, opts)
     opts.mode        — "reveal" | "bus" | "crank"
     opts.revealed     — array of part keys already visible at build time
                          (reveal mode default: none; bus/crank default: all)
     opts.steps         — [{ set:{...regs}, cu, alu, bus:{type,label}, busNote,
                             log }] (crank mode only)
     opts.initial        — starting register values (crank mode only)
     opts.crankLabel / opts.doneLabel / opts.onFinish(state) (crank mode only)

   Returns:
     reveal(keys)           — un-dim and label the given parts (reveal mode)
     flashBus(type, label)   — light the shared bus strip a colour, no stepping
                                (bus mode)
     step()                  — advance one micro-step (crank mode)
     get state()

   All seven parts and the external memory node are always in the DOM (so
   the diagram never re-flows as parts appear) — "reveal" mode just toggles
   a dimmed class rather than building/rebuilding boxes. */

const CPU_PARTS = [
  { key: "cu", label: "CU", kind: "tag" },
  { key: "alu", label: "ALU", kind: "tag" },
  { key: "pc", label: "PC" },
  { key: "mar", label: "MAR" },
  { key: "mdr", label: "MDR" },
  { key: "cir", label: "CIR" },
  { key: "acc", label: "ACC" }
];

function makeCpuBoard(mountId, opts) {
  opts = opts || {};
  const mode = opts.mode || "crank";
  const mount = $("#" + mountId);
  mount.innerHTML = "";

  const board = document.createElement("div");
  board.className = "cpu-board";

  const frame = document.createElement("div");
  frame.className = "cpu-frame";
  const frameTag = document.createElement("span");
  frameTag.className = "cpu-frame-tag";
  frameTag.textContent = "CPU";
  frame.appendChild(frameTag);

  const row1 = document.createElement("div"); row1.className = "cpu-row cpu-row-fetch";
  const row2 = document.createElement("div"); row2.className = "cpu-row cpu-row-exec";

  const boxes = {};
  function makeBox(parent, key, label, kind) {
    const el = document.createElement("div");
    el.className = "cpu-" + (kind || "box");
    el.dataset.key = key;
    const l = document.createElement("span"); l.className = "cpu-label"; l.textContent = label;
    const v = document.createElement("span"); v.className = "cpu-val"; v.textContent = "—";
    el.appendChild(l); el.appendChild(v);
    parent.appendChild(el);
    boxes[key] = { el: el, label: l, val: v, name: label };
  }
  makeBox(row1, "pc", "PC");
  makeBox(row1, "mar", "MAR");
  makeBox(row1, "mdr", "MDR");
  makeBox(row1, "cir", "CIR");
  makeBox(row2, "cu", "CU", "tag");
  makeBox(row2, "alu", "ALU", "tag");
  makeBox(row2, "acc", "ACC");
  frame.appendChild(row1);
  frame.appendChild(row2);
  board.appendChild(frame);

  const link = document.createElement("div");
  link.className = "cpu-link" + (reduceMotion ? " no-motion" : "");
  link.setAttribute("aria-hidden", "true");
  board.appendChild(link);

  const memRow = document.createElement("div"); memRow.className = "cpu-row cpu-row-mem";
  makeBox(memRow, "mem", "Memory (RAM) — outside the CPU", "node");
  board.appendChild(memRow);

  const bus = document.createElement("div");
  bus.className = "cpu-bus"; bus.setAttribute("aria-live", "polite");
  bus.textContent = mode === "crank" ? "Ready to crank." : "—";
  board.appendChild(bus);

  let log = null;
  if (mode === "crank") {
    log = document.createElement("ul");
    log.className = "cpu-log"; log.setAttribute("aria-live", "polite");
    board.appendChild(log);
  }

  let crankBtn = null;
  if (mode === "crank") {
    crankBtn = document.createElement("button");
    crankBtn.type = "button"; crankBtn.className = "loop-btn primary cpu-crank";
    crankBtn.textContent = opts.crankLabel || "Turn the crank ▶";
    board.appendChild(crankBtn);
  }

  mount.appendChild(board);

  /* ---------- reveal mode ---------- */
  const revealedSet = new Set(opts.revealed || (mode === "reveal" ? [] : CPU_PARTS.map(p => p.key)));
  CPU_PARTS.concat([{ key: "mem" }]).forEach(p => {
    const isMem = p.key === "mem";
    const shown = isMem || revealedSet.has(p.key);
    boxes[p.key].el.classList.toggle("dim", !shown);
    if (!shown) boxes[p.key].val.textContent = "?";
  });

  function reveal(keys) {
    (keys || []).forEach(key => {
      const b = boxes[key];
      if (!b || !b.el.classList.contains("dim")) return;
      b.el.classList.remove("dim");
      b.val.textContent = "—";
      b.el.classList.add("just-revealed");
      const r = b.el.getBoundingClientRect();
      sparks(r.left + r.width / 2, r.top);
      setTimeout(() => b.el.classList.remove("just-revealed"), reduceMotion ? 0 : 900);
    });
  }

  /* ---------- bus mode (static flash, no stepping) ---------- */
  function flashBus(type, label) {
    bus.textContent = label;
    bus.className = "cpu-bus bus-" + type;
  }

  /* ---------- crank mode ---------- */
  const state = Object.assign(
    { pc: "—", mar: "—", mdr: "—", cir: "—", acc: "—", mem: null, cu: false, alu: false },
    opts.initial || {}
  );

  function paint(changedKeys) {
    boxes.pc.val.textContent = state.pc;
    boxes.mar.val.textContent = state.mar;
    boxes.mdr.val.textContent = state.mdr;
    boxes.cir.val.textContent = state.cir;
    boxes.acc.val.textContent = state.acc;
    boxes.mem.val.textContent = state.mem ? (state.mem.addr + ": " + state.mem.val) : "—";
    boxes.cu.el.classList.toggle("active", !!state.cu);
    boxes.alu.el.classList.toggle("active", !!state.alu);
    Object.keys(boxes).forEach(k => boxes[k].el.classList.toggle("changed", changedKeys.indexOf(k) !== -1));
  }

  const steps = opts.steps || [];
  let i = -1, finished = false;
  function step() {
    if (finished || mode !== "crank") return;
    i++;
    const s = steps[i];
    if (!s) return;
    const set = s.set || {};
    Object.keys(set).forEach(k => { state[k] = set[k]; });
    state.cu = !!s.cu;
    state.alu = !!s.alu;
    paint(Object.keys(set));
    if (s.bus) {
      bus.textContent = s.bus.label;
      bus.className = "cpu-bus bus-" + s.bus.type;
    } else {
      bus.textContent = s.busNote || "No bus needed for this step — it happens inside the CPU.";
      bus.className = "cpu-bus";
    }
    const li = document.createElement("li");
    li.textContent = s.log;
    log.appendChild(li);
    while (log.children.length > 4) log.removeChild(log.firstChild);
    if (i === steps.length - 1) {
      finished = true;
      crankBtn.disabled = true;
      crankBtn.textContent = opts.doneLabel || "Cycle complete";
      if (opts.onFinish) opts.onFinish(state);
    }
  }
  if (mode === "crank") {
    paint([]);
    crankBtn.addEventListener("click", step);
  }

  return { reveal, flashBus, step, get state() { return state; } };
}
