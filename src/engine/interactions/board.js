/* ================= kit: board =================
   The bulb-switch board. `values` are the weights (most significant first);
   `onChange(total)` fires on every flip with the current lit total. Returns
   { total } so callers can read the board on demand. */

function makeBoard(rowEl, values, onChange){
  const bits = values.map((v,i)=>{
    if(i===4 && values.length>4){
      const brk=document.createElement("span");
      brk.className="row-break";brk.setAttribute("aria-hidden","true");
      rowEl.appendChild(brk);
    }
    const b=document.createElement("button");
    b.className="bit";
    b.type="button";
    b.setAttribute("aria-pressed","false");
    b.setAttribute("aria-label","switch worth "+v);
    b.innerHTML='<span class="bulb"></span><span class="bit-val">'+v+
                '</span><span class="bit-digit">0</span>';
    b.addEventListener("click", ()=>{
      const on = b.getAttribute("aria-pressed")!=="true";
      b.setAttribute("aria-pressed", on?"true":"false");
      $(".bit-digit",b).textContent = on?"1":"0";
      onChange(total());
    });
    rowEl.appendChild(b);
    return b;
  });
  function total(){
    return bits.reduce((sum,b,i)=>
      sum + (b.getAttribute("aria-pressed")==="true" ? values[i] : 0), 0);
  }
  return { total };
}
