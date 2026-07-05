/* ================= kit: matcher =================
   Two-column meaning↔code pairing engine: pick a line and its meaning (tap or
   keyboard), or drag a meaning chip onto its line. One pointer path serves
   mouse, touch and pen, with a tap/keyboard fallback for accessibility.

   Runs inside the shared engine IIFE, so $, $$, sparks, toast and awardStar are
   in scope. The module supplies the data + containers this engine reads:
     SNIP      — [{code, en}] rows, indexed; a chip's data-eng / slot's data-line
                 carry the true index, and line===eng is the match test
     pairCode  — #pairCode3 container holding the .pair-slot lines
     pairBank  — #pairBank3 container holding the .pair-chip meanings
   The module also builds the slots/chips and wires their listeners to
   selectLine / selectChip / dragStart; this kit owns the pairing behaviour and
   its private selection + drag state. */

  let selChip=null,selLine=null,pairsDone=0;

  /* tap / keyboard fallback: pick one side, then its partner */
  function selectChip(c){
    if(c.classList.contains("used"))return;
    if(selChip===c){c.classList.remove("sel");selChip=null;return;}
    if(selChip)selChip.classList.remove("sel");
    selChip=c;c.classList.add("sel");
    if(selLine)commit(selLine,selChip);
  }
  function selectLine(slot){
    if(slot.classList.contains("filled"))return;
    if(selLine===slot){slot.classList.remove("sel");selLine=null;return;}
    if(selLine)selLine.classList.remove("sel");
    selLine=slot;slot.classList.add("sel");
    if(selChip)commit(selLine,selChip);
  }
  function clearSel(){
    if(selChip){selChip.classList.remove("sel");selChip=null;}
    if(selLine){selLine.classList.remove("sel");selLine=null;}
  }
  function commit(slot,chip){
    if(slot.classList.contains("filled")||chip.classList.contains("used")){clearSel();return;}
    const line=+slot.dataset.line,eng=+chip.dataset.eng;
    if(line===eng){
      const hint=$(".pair-hint",slot);
      hint.className="pair-hint filled-en";
      hint.textContent="✓ "+SNIP[eng].en;
      slot.classList.add("filled");
      chip.classList.add("used");
      const r=slot.getBoundingClientRect();sparks(r.left+r.width/2,r.top);
      clearSel();
      pairsDone++;
      if(pairsDone===SNIP.length){
        awardStar("d3","Every line paired to its meaning. You just read a whole algorithm the way its author intended.");
      }
    }else{
      toast("Not that line — read the code again. That one is about something else.");
      clearSel();
    }
  }

  /* drag-and-drop via pointer events (one path for mouse, touch and pen) */
  let dragChip=null,ghost=null,dragging=false,ptrId=null,offX=0,offY=0,startX=0,startY=0;
  function dragStart(e,chip){
    if(chip.classList.contains("used"))return;
    if(e.pointerType==="mouse"&&e.button!==0)return;
    dragChip=chip;ptrId=e.pointerId;dragging=false;
    startX=e.clientX;startY=e.clientY;
    // listen on the document so moves are caught wherever the pointer goes
    // (pointer capture is unreliable across engines for this)
    document.addEventListener("pointermove",dragMove);
    document.addEventListener("pointerup",dragEnd);
    document.addEventListener("pointercancel",dragEnd);
  }
  function dragMove(e){
    if(dragChip===null||e.pointerId!==ptrId)return;
    if(!dragging){
      if(Math.hypot(e.clientX-startX,e.clientY-startY)<6)return;
      dragging=true;
      const rect=dragChip.getBoundingClientRect();
      offX=startX-rect.left;offY=startY-rect.top;
      ghost=dragChip.cloneNode(true);
      ghost.classList.add("pair-ghost");ghost.classList.remove("sel");
      ghost.style.width=rect.width+"px";
      document.body.appendChild(ghost);
      dragChip.classList.add("dragging");
      clearSel(); // starting a drag cancels any half-made tap selection
    }
    e.preventDefault();
    ghost.style.left=(e.clientX-offX)+"px";
    ghost.style.top=(e.clientY-offY)+"px";
    markDrop(slotUnder(e));
  }
  function dragEnd(e){
    if(dragChip===null||e.pointerId!==ptrId)return;
    const chip=dragChip;
    document.removeEventListener("pointermove",dragMove);
    document.removeEventListener("pointerup",dragEnd);
    document.removeEventListener("pointercancel",dragEnd);
    if(dragging){
      const slot=slotUnder(e);
      markDrop(null);
      if(ghost){ghost.remove();ghost=null;}
      chip.classList.remove("dragging");
      if(slot)commit(slot,chip);
    }else if(e.type!=="pointercancel"){
      selectChip(chip); // no movement → treat as a tap (mouse/touch)
    }
    dragChip=null;dragging=false;ptrId=null;
  }
  function slotUnder(e){
    if(ghost)ghost.style.visibility="hidden";
    const el=document.elementFromPoint(e.clientX,e.clientY);
    if(ghost)ghost.style.visibility="";
    const slot=el&&el.closest?el.closest(".pair-slot"):null;
    return slot&&!slot.classList.contains("filled")?slot:null;
  }
  function markDrop(slot){
    $$(".pair-slot.drop-ok",pairCode).forEach(s=>{if(s!==slot)s.classList.remove("drop-ok");});
    if(slot)slot.classList.add("drop-ok");
  }
