/* ================= kit: byte =================
   An 8-bit switch board (weights 128…1), richer than the plain `board` kit:
   every flip calls onChange(api) and the api exposes the full union of what the
   arithmetic, hex and ASCII lessons need.

   makeByte(rowEl, opts, onChange)
     opts — either a boolean (labels on/off) or {labels, gap}:
       labels: show the per-switch weight (.bit-val)
       gap:    also show each switch's in-nibble value (.bit-val-nibble) and
               announce it in the aria-label (used by the nibble/hex board)

   api: bits, total(), bitsArr(), setBitsArr(arr), set(n),
        nibbles() → [hi,lo], hex() → "2A", bin() → "10101010",
        shiftLeft()/shiftRight() (return the bit that fell off), flip(), addOne(). */

function makeByte(rowEl, opts, onChange){
  const o = (opts && typeof opts === "object") ? opts : { labels: !!opts, gap: false };
  const values = [128,64,32,16,8,4,2,1];
  const HEXCH = "0123456789ABCDEF";

  const bits = values.map((v,i)=>{
    if(i===4){
      const brk=document.createElement("span");
      brk.className="row-break"; brk.setAttribute("aria-hidden","true");
      rowEl.appendChild(brk);
    }
    const nibbleVal = i<4 ? v/16 : v;
    const b=document.createElement("button");
    b.type="button"; b.className="bit";
    b.setAttribute("aria-pressed","false");
    b.setAttribute("aria-label", o.gap
      ? "switch worth "+v+" in the byte, "+nibbleVal+" in its nibble"
      : "switch worth "+v);
    let labelHtml="";
    if(o.labels){
      labelHtml='<span class="bit-val">'+v+'</span>';
      if(o.gap) labelHtml+='<span class="bit-val-nibble">'+nibbleVal+'</span>';
    }
    b.innerHTML='<span class="bulb"></span>'+labelHtml;
    b.addEventListener("click",()=>{
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed")!=="true"?"true":"false");
      onChange(api);
    });
    rowEl.appendChild(b);
    return b;
  });

  const api={
    bits,
    total(){return bits.reduce((s,b,i)=>s+(b.getAttribute("aria-pressed")==="true"?values[i]:0),0);},
    bitsArr(){return bits.map(b=>b.getAttribute("aria-pressed")==="true"?1:0);},
    setBitsArr(arr){bits.forEach((b,i)=>b.setAttribute("aria-pressed",arr[i]?"true":"false"));onChange(api);},
    set(n){bits.forEach((b,i)=>b.setAttribute("aria-pressed",(n&values[i])?"true":"false"));onChange(api);},
    nibbles(){const t=api.total();return[t>>4,t&15];},
    hex(){const[hi,lo]=api.nibbles();return HEXCH[hi]+HEXCH[lo];},
    bin(){return bits.map(b=>b.getAttribute("aria-pressed")==="true"?"1":"0").join("");},
    shiftLeft(){const old=api.bitsArr();const lost=old[0]===1;const next=old.slice(1);next.push(0);api.setBitsArr(next);return lost;},
    shiftRight(){const old=api.bitsArr();const lost=old[7]===1;const next=old.slice(0,7);next.unshift(0);api.setBitsArr(next);return lost;},
    flip(){api.setBitsArr(api.bitsArr().map(b=>1-b));},
    addOne(){const next=api.bitsArr();let carry=1;for(let i=7;i>=0&&carry;i--){const s=next[i]+carry;next[i]=s%2;carry=s>=2?1:0;}api.setBitsArr(next);}
  };
  return api;
}
