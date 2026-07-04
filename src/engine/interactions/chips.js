/* ================= kit: chips =================
   Target chips with auto-detection. `targets` are the values to reach; the
   returned `check(total)` updates the optional `totalEl` readout, lights a chip
   when its target is hit (once), sparks + toasts progress, and calls
   `onAllHit()` when every target has been found. */

function makeChips(containerEl, targets, totalEl, onAllHit){
  const hit={};
  targets.forEach(t=>{
    const c=document.createElement("span");
    c.className="chip";
    c.dataset.target=t;
    c.textContent=t;
    containerEl.appendChild(c);
  });
  return function check(total){
    if(totalEl){
      $("b",totalEl).textContent=total;
      totalEl.classList.toggle("matched", targets.includes(total));
    }
    if(targets.includes(total) && !hit[total]){
      hit[total]=true;
      const chip=$('.chip[data-target="'+total+'"]', containerEl);
      chip.classList.add("hit");
      const r=chip.getBoundingClientRect();
      sparks(r.left+r.width/2, r.top);
      const remaining=targets.filter(t=>!hit[t]).length;
      if(remaining>0){
        toast("Found "+total+" — lovely. "+remaining+" more if you fancy it.");
      }
      if(remaining===0) onAllHit();
    }
  };
}
