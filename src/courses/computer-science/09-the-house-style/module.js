/* ================= Module 9 — The House Style =================
   Reading the Cambridge pseudocode dialect: the ← arrow, DECLARE, a whole
   snippet paired to its meaning, meaningful renaming, and comments. Runs inside
   the shared engine IIFE, so $, $$, awardStar, toast, sparks and reduceMotion
   are all in scope. Keeps its own label/idea-chip helper and pulse effect. */

  function pulse(el){
    if(reduceMotion||!el)return;
    el.classList.add("pulse");
    setTimeout(()=>el.classList.remove("pulse"),450);
  }

  /* ═══ D1: the arrow means "gets" ═══ */
  const getsVal=$("#getsVal1");
  const getsBox=$("#getsBox1");
  const getsCap=$("#getsCap1");
  let score=0;
  function getsShow(){getsVal.textContent=score;}
  const check1=makeChips($("#chips1"),["cmd","both","calc"],
    ()=>awardStar("d1","All three read. ← is a command: work out the right side, then drop the answer in the box."),
    k=>({cmd:"← is a command, not a fact",both:"a box can sit on both sides",calc:"work the right side out first, then store"}[k]),
    (label,remaining)=>"Noticed ✦ — "+remaining+" idea to go.");
  function getsRun(line){
    const el=$('.gets-line[data-line="'+line+'"]',$("#getsLines1"));
    if(el)el.classList.add("ran");
    if(line==="set"){
      score=10;
      getsCap.textContent="“Score gets 10.” The box now holds 10 — whatever was there before is gone.";
      check1("cmd");
    }else if(line==="add"){
      const old=score;score=old+5;
      getsCap.textContent="“Score gets its old self plus 5.” Score is on the left and the right — that's fine here. "+old+" + 5 → "+score+".";
      check1("both");
    }else if(line==="mul"){
      const old=score;score=old*2;
      getsCap.textContent="“Score gets its old self times 2.” First work out "+old+" × 2 = "+score+", then drop that back in the box.";
      check1("calc");
    }
    getsShow();pulse(getsBox);
  }
  $$("#getsLines1 .gets-line").forEach(b=>{
    b.addEventListener("click",()=>getsRun(b.dataset.line));
  });
  $("#getsReset1").addEventListener("click",()=>{
    score=0;getsShow();
    getsCap.textContent="Score is back to 0. Tap the lines in any order — watch the box, not an equals sign.";
  });
  getsShow();

  /* ═══ D2: DECLARE makes the box before you fill it ═══ */
  const D2_LINES=[
    {html:'<span class="kw">DECLARE</span> Name : <span class="typ">STRING</span>',
     act:()=>d2ensure("Name","STRING"),
     cap:"DECLARE reserves an empty box called Name, shaped for text (STRING). It holds no value yet."},
    {html:'<span class="kw">DECLARE</span> Age : <span class="typ">INTEGER</span>',
     act:()=>d2ensure("Age","INTEGER"),
     cap:"Another empty box — Age — shaped for whole numbers (INTEGER). Two boxes now exist, both still empty."},
    {html:'Name <span class="arrow">←</span> <span class="str">"Sara"</span>',
     act:()=>d2fill("Name",'"Sara"'),
     cap:"Now we fill one: Name gets “Sara”. You can only fill a box that already exists."},
    {html:'Age <span class="arrow">←</span> 19',
     act:()=>d2fill("Age","19"),
     cap:"Age gets 19. Both boxes were declared first, then filled — never the other way round."}
  ];
  const declCode=$("#declCode2");
  const declBoxes=$("#declBoxes2");
  const declCap=$("#declCap2");
  const declStep=$("#declStep2");
  const d2boxEls={};
  let d2i=-1;
  function d2renderCode(){
    declCode.innerHTML="";
    D2_LINES.forEach((ln,i)=>{
      const div=document.createElement("div");
      div.className="pcline"+(i===d2i?" cur":"");
      div.innerHTML=ln.html;
      declCode.appendChild(div);
    });
  }
  function d2ensure(name,type){
    if(d2boxEls[name])return;
    const b=document.createElement("div");
    b.className="vbox empty";
    b.innerHTML='<div class="vbox-type">'+type+'</div><div class="vbox-name">'+name+'</div><div class="vbox-val">·</div>';
    declBoxes.appendChild(b);
    d2boxEls[name]=b;
    pulse(b);
  }
  function d2fill(name,val){
    const b=d2boxEls[name];if(!b)return;
    b.classList.remove("empty");b.classList.add("filled");
    $(".vbox-val",b).textContent=val;
    pulse(b);
  }
  function d2step(){
    if(d2i>=D2_LINES.length-1)return;
    d2i++;
    const ln=D2_LINES[d2i];
    ln.act();
    declCap.textContent=ln.cap;
    d2renderCode();
    if(d2i===D2_LINES.length-1){
      declStep.textContent="✦ that's the lot";
      awardStar("d2","Boxes made, then filled. DECLARE always comes before the value goes in.");
    }
  }
  function d2reset(){
    d2i=-1;
    declBoxes.innerHTML="";
    Object.keys(d2boxEls).forEach(k=>delete d2boxEls[k]);
    declCap.textContent="Nothing exists yet — no boxes. Press Step to run the first line.";
    declStep.textContent="Step ▸";
    d2renderCode();
  }
  declStep.addEventListener("click",d2step);
  $("#declReset2").addEventListener("click",d2reset);
  d2renderCode();

  /* ═══ D3: read a snippet aloud, then pair it ═══ */
  const SNIP=[
    {code:'<span class="kw">DECLARE</span> Price : <span class="typ">INTEGER</span>', en:"Make an integer box called Price."},
    {code:'<span class="kw">DECLARE</span> Total : <span class="typ">INTEGER</span>', en:"Make an integer box called Total."},
    {code:'Total <span class="arrow">←</span> 0',                                     en:"Total gets 0 — start it empty."},
    {code:'<span class="kw">INPUT</span> Price',                                       en:"Ask the person for a Price."},
    {code:'Total <span class="arrow">←</span> Total + Price',                          en:"Total gets its old self plus Price."},
    {code:'<span class="kw">OUTPUT</span> Total',                                      en:"Show Total on the screen."}
  ];

  /* -- part A: the translation slider -- */
  const tsList=$("#tsList3");
  SNIP.forEach(s=>{
    const row=document.createElement("div");
    row.className="ts-row";
    row.innerHTML='<div class="pcline">'+s.code+'</div><div class="ts-en">'+s.en+'</div>';
    tsList.appendChild(row);
  });
  const tsRows=$$(".ts-row",tsList);
  const tsNext=$("#tsNext3");
  const tsHint=$("#tsHint3");
  let tsi=-1;
  tsNext.addEventListener("click",()=>{
    if(tsi>=tsRows.length-1){
      tsi=-1;
      tsRows.forEach(r=>r.classList.remove("read","active"));
      tsNext.textContent="Read the first line ▸";
      tsHint.textContent="Reveal each line's meaning, one at a time.";
      return;
    }
    tsi++;
    tsRows.forEach((r,i)=>{
      r.classList.toggle("active",i===tsi);
      if(i<=tsi)r.classList.add("read");
    });
    if(tsi===tsRows.length-1){
      tsNext.textContent="↺ Read it again";
      tsHint.textContent="That's the whole snippet in plain English. Now try the pairing below.";
    }else{
      tsNext.textContent="Read next line ▸";
    }
  });

  /* -- part B: the pairing game — drag-and-drop (pointer, so mouse+touch+pen)
        with a tap/keyboard fallback for accessibility -- */
  const pairCode=$("#pairCode3");
  const pairBank=$("#pairBank3");

  SNIP.forEach((s,i)=>{
    const slot=document.createElement("button");
    slot.type="button";slot.className="pair-slot";slot.dataset.line=i;
    slot.innerHTML='<div class="pcline">'+s.code+'</div><div class="pair-hint">drop or tap its meaning</div>';
    slot.addEventListener("click",()=>selectLine(slot));
    pairCode.appendChild(slot);
  });
  // shuffled bank (display order only; data-eng carries the true index)
  const order=SNIP.map((_,i)=>i);
  for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=order[i];order[i]=order[j];order[j]=t;}
  order.forEach(idx=>{
    const c=document.createElement("button");
    c.type="button";c.className="pair-chip";c.dataset.eng=idx;
    c.textContent=SNIP[idx].en;
    c.addEventListener("click",e=>{if(e.detail===0)selectChip(c);}); // keyboard (Enter/Space) only
    c.addEventListener("pointerdown",e=>dragStart(e,c));
    pairBank.appendChild(c);
  });

  /* ═══ D4: names that help vs names that hide ═══ */
  $("#rnCryptic4").innerHTML=
    '<div class="pcline"><span class="kw">DECLARE</span> a : <span class="typ">REAL</span></div>'+
    '<div class="pcline"><span class="kw">DECLARE</span> b : <span class="typ">INTEGER</span></div>'+
    '<div class="pcline"><span class="kw">DECLARE</span> c : <span class="typ">REAL</span></div>'+
    '<div class="pcline">c <span class="arrow">←</span> a * b</div>'+
    '<div class="pcline"><span class="kw">OUTPUT</span> c</div>';

  const RN=[
    {v:"a",type:"REAL",target:"Price"},
    {v:"b",type:"INTEGER",target:"Quantity"},
    {v:"c",type:"REAL",target:"Total"}
  ];
  const RN_OPTS=["","Price","Quantity","Total","Thing","Data","n"];
  const RN_POOR=["Thing","Data","n"];
  const rnRows=$("#rnRows4");
  const rnStatus=$("#rnStatus4");
  const rnSelects={};
  let rnDone=false;
  RN.forEach(r=>{
    const row=document.createElement("div");
    row.className="rn-row";
    const tag=document.createElement("span");
    tag.className="rn-tag";
    tag.innerHTML='rename <b>'+r.v+'</b> ('+r.type+')';
    const sel=document.createElement("select");
    sel.setAttribute("aria-label","rename box "+r.v);
    RN_OPTS.forEach(o=>{
      const opt=document.createElement("option");
      opt.value=o;opt.textContent=o===""?"— choose a name —":o;
      sel.appendChild(opt);
    });
    sel.addEventListener("change",checkRename);
    rnSelects[r.v]=sel;
    row.appendChild(tag);row.appendChild(sel);
    rnRows.appendChild(row);
  });
  function checkRename(){
    if(rnDone)return;
    const a=rnSelects.a.value,b=rnSelects.b.value,c=rnSelects.c.value;
    const chosen=[a,b,c];
    const poor=chosen.find(v=>RN_POOR.includes(v));
    if(poor){
      rnStatus.textContent="“"+poor+"” is a name that hides — it could mean anything. Give the box a name that says what it holds.";
      return;
    }
    if(a==="Quantity"||a==="Total"){
      rnStatus.textContent="Box a is a REAL box — it allows decimals, like money. A count would be a whole number (INTEGER). What has decimals here?";
      return;
    }
    if(b==="Price"||b==="Total"){
      rnStatus.textContent="Box b is an INTEGER box — whole numbers only. Which of the three is always a whole count?";
      return;
    }
    if(c==="Price"||c==="Quantity"){
      rnStatus.textContent="Box c holds a × b — the result, the whole bill. What single word names that?";
      return;
    }
    if(a==="Price"&&b==="Quantity"&&c==="Total"){
      rnDone=true;
      rnStatus.textContent="That reads itself now. Same algorithm, same machine — but a person understands it instantly.";
      $("#rnReadable4").classList.add("show");
      const r=$("#rnReadable4").getBoundingClientRect();sparks(r.left+r.width/2,r.top);
      awardStar("d4","Three good names and the fog clears. Meaningful names are the cheapest way to make code readable.");
      return;
    }
    if(a&&b&&c){
      rnStatus.textContent="Close — read the three roles again: a is the price, b is how many, c is the total.";
    }else{
      rnStatus.textContent="Rename all three so the line below reads like a sentence.";
    }
  }

  /* ═══ D5: comments — notes to future-you ═══ */
  $("#cmSnip5").innerHTML=
    '<div class="pcline">p <span class="arrow">←</span> 5</div>'+
    '<div class="pcline">q <span class="arrow">←</span> 3</div>'+
    '<div class="pcline">t <span class="arrow">←</span> p * q   <span class="cmt" id="cmComment5" style="display:none">// total = price × quantity</span></div>'+
    '<div class="pcline"><span class="kw">OUTPUT</span> t</div>';
  const cmComment=$("#cmComment5");
  const cmOut=$("#cmOut5");
  const check5=makeChips($("#chips5"),["why","skip"],
    ()=>awardStar("d5","Both halves of readable code: names say what, comments say why — and the machine quietly ignores the why."),
    k=>({why:"a comment says WHY, for a human",skip:"the machine skips // lines"}[k]),
    (label,remaining)=>"Noticed ✦ — "+remaining+" idea to go.");
  $("#cmReveal5").addEventListener("click",()=>{
    cmComment.style.display="";
    check5("why");
  });
  $("#cmRun5").addEventListener("click",()=>{
    // whatever the comment says, the machine computes the same thing
    cmComment.classList.add("off");
    if(cmComment.style.display==="none")cmComment.style.display="";
    cmOut.innerHTML='<span class="prompt">output ›</span> 15';
    check5("skip");
  });
