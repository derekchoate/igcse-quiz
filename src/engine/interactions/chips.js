/* ================= kit: chips =================
   Target chips with auto-detection, unified across every module. Two call
   styles are accepted:

     makeChips(containerEl, targets, totalEl, onAllHit)
         readout mode — updates a numeric total readout (<b> inside totalEl)
         and toggles its "matched" class. (Module 1-style bulb boards.)

     makeChips(containerEl, targets, onAllHit, formatFn[, toastFn])
         label mode — chips carry formatFn(target) labels instead of raw
         values; targets may be non-numeric keys. Optional toastFn(label,
         remaining) supplies the module's own progress wording.

   The returned check(current) lights a chip once when its target is reached,
   sparks + toasts progress, and calls onAllHit() when every target is found. */

function makeChips(containerEl, targets, a, b, toastFn){
  let totalEl = null, onAllHit, formatFn = null;
  if (typeof a === "function"){        // label mode
    onAllHit = a;
    formatFn = b || null;
  } else {                             // readout mode
    totalEl = a || null;
    onAllHit = b;
  }

  const hit = {};
  targets.forEach(t=>{
    const c=document.createElement("span");
    c.className="chip";
    c.dataset.target=t;
    c.textContent = formatFn ? formatFn(t) : t;
    containerEl.appendChild(c);
  });

  return function check(current){
    if(totalEl){
      $("b",totalEl).textContent=current;
      totalEl.classList.toggle("matched", targets.includes(current));
    }
    if(targets.includes(current) && !hit[current]){
      hit[current]=true;
      const chip=$('.chip[data-target="'+current+'"]', containerEl);
      chip.classList.add("hit");
      const r=chip.getBoundingClientRect();
      sparks(r.left+r.width/2, r.top);
      const remaining=targets.filter(t=>!hit[t]).length;
      const label = formatFn ? formatFn(current) : current;
      if(remaining>0){
        toast(toastFn ? toastFn(label, remaining)
                      : "Found "+label+" — lovely. "+remaining+" more if you fancy it.");
      } else {
        onAllHit();
      }
    }
  };
}
