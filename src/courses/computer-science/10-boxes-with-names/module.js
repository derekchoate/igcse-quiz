/* ================= Module 10 — Boxes with Names =================
   The signature interaction: live labelled boxes. DECLARE creates a box,
   assignment (←) drops a value in, OUTPUT prints to a soft terminal. Boxes
   have a shape (type) and a value only goes in if it fits — a mismatch gets
   a warm, specific redirect and a gentle "decline" wobble, never an error.
   Runs inside the shared engine IIFE, so $, $$, awardStar, toast, sparks,
   makeChips and reduceMotion are all in scope. */

  function pulse(el){
    if(reduceMotion||!el)return;
    el.classList.add("pulse");
    setTimeout(()=>el.classList.remove("pulse"),450);
  }
  // A polite "that doesn't fit" cue — a brief wobble plus a held teal border.
  // Kept visible under reduced motion (only the shake keyframe is disabled in
  // CSS); the colour change still carries the information on its own.
  function decline(el){
    if(!el)return;
    el.classList.add("decline");
    setTimeout(()=>el.classList.remove("decline"),600);
  }
  function escapeHtml(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  /* ═══ D1: make a box, put something in it ═══ */
  const mkName=$("#mkName1"), mkAge=$("#mkAge1");
  const mkCode=$("#mkCode1"), mkBoxes=$("#mkBoxes1"), mkCap=$("#mkCap1"), mkOut=$("#mkOut1"), mkStep=$("#mkStep1");
  const mk1BoxEls={};
  let mk1Lines=[], mk1i=-1, mk1Done={};

  function mkReadName(){
    const v=mkName.value.trim();
    return v ? v : "Explorer";
  }
  function mkReadAge(){
    let n=parseInt(mkAge.value,10);
    if(isNaN(n)||n<1||n>99) n=19;
    return String(n);
  }
  function mkBuildLines(){
    const name=escapeHtml(mkReadName()), age=mkReadAge();
    return [
      {html:'<span class="kw">DECLARE</span> Player : <span class="typ">STRING</span>',
       act:()=>mkEnsure("Player","STRING"),
       cap:"DECLARE reserves an empty box called Player, shaped for text (STRING). It holds nothing yet.",
       cat:"declare"},
      {html:'<span class="kw">DECLARE</span> Age : <span class="typ">INTEGER</span>',
       act:()=>mkEnsure("Age","INTEGER"),
       cap:"Another empty box — Age — shaped for whole numbers (INTEGER). Two boxes exist now, both still empty.",
       cat:"declare"},
      {html:'Player <span class="arrow">←</span> <span class="str">"'+name+'"</span>',
       act:()=>mkFill("Player",'"'+name+'"'),
       cap:'Player gets "'+name+'". You can only fill a box that already exists.',
       cat:"assign"},
      {html:'Age <span class="arrow">←</span> '+age,
       act:()=>mkFill("Age",age),
       cap:"Age gets "+age+". Declared first, filled second — never the other way round.",
       cat:"assign"},
      {html:'<span class="kw">OUTPUT</span> Player, Age',
       act:()=>{ mkOut.innerHTML='<span class="prompt">output ›</span> Player is '+name+", Age is "+age; },
       cap:"OUTPUT reads both boxes and prints them — the only line of the five that shows anything at all.",
       cat:"output"}
    ];
  }
  function mkEnsure(name,type){
    if(mk1BoxEls[name])return;
    const b=document.createElement("div");
    b.className="vbox empty";
    b.innerHTML='<div class="vbox-type">'+type+'</div><div class="vbox-name">'+name+'</div><div class="vbox-val">·</div>';
    mkBoxes.appendChild(b);
    mk1BoxEls[name]=b;
    pulse(b);
  }
  function mkFill(name,val){
    const b=mk1BoxEls[name]; if(!b)return;
    b.classList.remove("empty"); b.classList.add("filled");
    $(".vbox-val",b).textContent=val;
    pulse(b);
  }
  function mk1render(){
    mkCode.innerHTML="";
    mk1Lines.forEach((ln,i)=>{
      const div=document.createElement("div");
      div.className="pcline"+(i===mk1i?" cur":"");
      div.innerHTML=ln.html;
      mkCode.appendChild(div);
    });
  }
  const mk1Chips=makeChips($("#chips1"),["declare","assign","output"],
    ()=>awardStar("d1","All three moves collected — DECLARE makes the box, ← fills it, OUTPUT shows it."),
    k=>({declare:"DECLARE makes an empty box",assign:"← drops a value in",output:"OUTPUT prints what's inside"}[k]),
    (label,remaining)=>"Noticed ✦ — "+remaining+" move to go.");
  function mk1step(){
    // Capture whatever's currently typed the moment the run actually starts —
    // not at page-load time, so editing the name/age first always takes.
    if(mk1i===-1) mk1Lines=mkBuildLines();
    if(mk1i>=mk1Lines.length-1)return;
    mk1i++;
    const ln=mk1Lines[mk1i];
    ln.act();
    mkCap.textContent=ln.cap;
    mk1render();
    if(!mk1Done[ln.cat]){ mk1Done[ln.cat]=true; mk1Chips(ln.cat); }
    if(mk1i===mk1Lines.length-1){
      mkStep.textContent="✦ that's the lot";
    }
  }
  function mk1reset(){
    mk1Lines=mkBuildLines();
    mk1i=-1; mk1Done={};
    mkBoxes.innerHTML="";
    Object.keys(mk1BoxEls).forEach(k=>delete mk1BoxEls[k]);
    mkCap.textContent="Nothing exists yet — no boxes. Press Step to run the first line.";
    mkOut.innerHTML='<span class="prompt">output ›</span> <span style="opacity:.5">nothing printed yet</span>';
    mkStep.textContent="Step ▸";
    mk1render();
  }
  mkStep.addEventListener("click",mk1step);
  $("#mkReset1").addEventListener("click",mk1reset);
  mk1reset();

  /* ═══ D2: types are box shapes ═══ */
  const TY_BOXES=[
    {id:"score",name:"Score",type:"INTEGER"},
    {id:"price",name:"Price",type:"REAL"},
    {id:"team",name:"Team",type:"STRING"},
    {id:"seat",name:"Seat",type:"CHAR"}
  ];
  const TY_CHIPS=[
    {label:"7",kind:"WHOLE"},
    {label:"19",kind:"WHOLE"},
    {label:"3.75",kind:"DECIMAL"},
    {label:"0.5",kind:"DECIMAL"},
    {label:'"Warriors"',kind:"STRING"},
    {label:'"Champions"',kind:"STRING"},
    {label:"'C'",kind:"CHAR"},
    {label:"'D'",kind:"CHAR"}
  ];
  function tyCompatible(kind,type){
    if(type==="INTEGER")return kind==="WHOLE";
    if(type==="REAL")return kind==="WHOLE"||kind==="DECIMAL";
    if(type==="STRING")return kind==="STRING";
    if(type==="CHAR")return kind==="CHAR";
    return false;
  }
  function tyMismatchMsg(chip,box){
    if(box.type==="INTEGER"){
      if(chip.kind==="DECIMAL")return box.name+" is INTEGER-shaped — no decimal point allowed. "+chip.label+" has one; try a whole number instead.";
      if(chip.kind==="STRING")return box.name+" is INTEGER-shaped — whole numbers only. "+chip.label+" is text; try a whole number instead.";
      if(chip.kind==="CHAR")return box.name+" is INTEGER-shaped — a single letter doesn't fit. Try a whole number instead.";
    }
    if(box.type==="REAL"){
      if(chip.kind==="STRING")return box.name+" is REAL-shaped — it holds numbers, decimals welcome. Text doesn't fit; try a number instead.";
      if(chip.kind==="CHAR")return box.name+" is REAL-shaped — it holds numbers. A single letter doesn't fit; try a number instead.";
    }
    if(box.type==="STRING"){
      if(chip.kind==="WHOLE"||chip.kind==="DECIMAL")return box.name+" is STRING-shaped — a whole word in quotes. A number doesn't fit; try one of the quoted words instead.";
      if(chip.kind==="CHAR")return box.name+" is STRING-shaped for a whole word — "+chip.label+" is only one letter. Try one of the quoted words instead.";
    }
    if(box.type==="CHAR"){
      if(chip.kind==="STRING")return box.name+" holds exactly one character — "+chip.label+" is a whole word. Try a single letter in single quotes instead.";
      if(chip.kind==="WHOLE"||chip.kind==="DECIMAL")return box.name+" is CHAR-shaped — a single letter, not a number. Try one of the letters instead.";
    }
    return "That shape doesn't quite fit "+box.name+" — check the badge above the box and try a value shaped like that.";
  }
  const tyBoxesEl=$("#tyBoxes2"), tyTrayEl=$("#tyTray2");
  const tyBoxEls={}, tyChipData=new Map();
  let tySelChip=null;
  const tyFilledFirst={};
  TY_BOXES.forEach(box=>{
    const b=document.createElement("button");
    b.type="button"; b.className="vbox empty target";
    b.innerHTML='<div class="vbox-type">'+box.type+'</div><div class="vbox-name">'+box.name+'</div><div class="vbox-val">·</div>';
    b.addEventListener("click",()=>tyBoxClick(b,box));
    tyBoxesEl.appendChild(b);
    tyBoxEls[box.id]=b;
  });
  TY_CHIPS.forEach(chip=>{
    const c=document.createElement("button");
    c.type="button"; c.className="ty-chip";
    c.setAttribute("aria-pressed","false");
    c.textContent=chip.label;
    c.addEventListener("click",()=>tySelectChip(c,chip));
    tyTrayEl.appendChild(c);
    tyChipData.set(c,chip);
  });
  function tySelectChip(el,chip){
    if(el.classList.contains("used"))return;
    if(tySelChip===el){ el.classList.remove("sel"); el.setAttribute("aria-pressed","false"); tySelChip=null; return; }
    if(tySelChip){ tySelChip.classList.remove("sel"); tySelChip.setAttribute("aria-pressed","false"); }
    tySelChip=el; el.classList.add("sel"); el.setAttribute("aria-pressed","true");
  }
  const check2=makeChips($("#chips2"),["score","price","team","seat"],
    ()=>awardStar("d2","Every box holds a value shaped for it — INTEGER, REAL, STRING and CHAR each felt different in your hands."),
    k=>({score:"Score took a whole number",price:"Price took a number, decimal or whole",team:"Team took a whole word",seat:"Seat took a single letter"}[k]),
    (label,remaining)=>"Noticed ✦ — "+remaining+" box to go.");
  function tyBoxClick(boxEl,box){
    if(!tySelChip){
      toast("Tap a value in the tray first, then tap a box.");
      return;
    }
    const chipEl=tySelChip, chip=tyChipData.get(chipEl);
    if(tyCompatible(chip.kind,box.type)){
      boxEl.classList.remove("empty"); boxEl.classList.add("filled");
      $(".vbox-val",boxEl).textContent=chip.label;
      pulse(boxEl);
      chipEl.classList.add("used"); chipEl.disabled=true; chipEl.classList.remove("sel");
      chipEl.setAttribute("aria-pressed","false");
      tySelChip=null;
      $("#tyStatus2").textContent=chip.label+" fits "+box.name+" — that shape matches.";
      if(!tyFilledFirst[box.id]){ tyFilledFirst[box.id]=true; check2(box.id); }
    }else{
      decline(boxEl);
      $("#tyStatus2").textContent=tyMismatchMsg(chip,box);
      toast(tyMismatchMsg(chip,box));
      chipEl.classList.remove("sel"); chipEl.setAttribute("aria-pressed","false"); tySelChip=null;
    }
  }

  /* ═══ D3: constants are glued shut ═══ */
  $("#cnCode3").innerHTML=
    '<div class="pcline"><span class="kw">CONSTANT</span> Pi <span class="arrow">=</span> 3.14</div>'+
    '<div class="pcline"><span class="kw">DECLARE</span> Price : <span class="typ">REAL</span></div>'+
    '<div class="pcline">Price <span class="arrow">←</span> 10</div>';
  $("#cnBoxes3").innerHTML=
    '<div class="vbox filled const" id="cnPiBox3"><div class="vbox-type">CONSTANT</div><div class="vbox-name">Pi</div><div class="vbox-val">3.14</div></div>'+
    '<div class="vbox filled" id="cnPriceBox3"><div class="vbox-type">REAL</div><div class="vbox-name">Price</div><div class="vbox-val">10</div></div>';
  const check3=makeChips($("#chips3"),["held","changed"],
    ()=>awardStar("d3","Two boxes, two behaviours: a constant is glued shut, a variable stays open for business — and now you can tell them apart on sight."),
    k=>({held:"Pi held its value, unmoved",changed:"Price took a new value"}[k]),
    (label,remaining)=>"Noticed ✦ — "+remaining+" idea to go.");
  $("#cnTryConst3").addEventListener("click",()=>{
    decline($("#cnPiBox3"));
    $("#cnCap3").textContent="Pi is a constant — glued shut the moment it was declared. Its value can never change after that line. Need a box that changes? That's what DECLARE is for.";
    toast("Pi didn't budge — constants are fixed for good, the instant they're declared.");
    check3("held");
  });
  $("#cnTryVar3").addEventListener("click",()=>{
    const b=$("#cnPriceBox3");
    $(".vbox-val",b).textContent="12";
    pulse(b);
    $("#cnCap3").textContent="Price just changed from 10 to 12. An ordinary box made with DECLARE stays open for business all program long.";
    check3("changed");
  });

  /* ═══ D4: MOD and DIV — sharing sweets ═══ */
  let swDealt=0, swBasketEls=[];
  function swRenderBaskets(){
    const c=$("#swBaskets4");
    c.innerHTML="";
    swBasketEls=[];
    for(let i=0;i<5;i++){
      const b=document.createElement("div");
      b.className="sw-basket";
      b.innerHTML='<div class="sw-basket-label">Friend '+(i+1)+'</div><div class="sw-basket-dots"></div>';
      c.appendChild(b);
      swBasketEls.push(b);
    }
  }
  function swReadouts(){
    $("#swDealt4").textContent=swDealt;
    $("#swDiv4").textContent=Math.floor(swDealt/5);
    $("#swMod4").textContent=swDealt%5;
  }
  function swDeal(){
    const idx=swDealt%5;
    swDealt++;
    const basket=swBasketEls[idx];
    const dot=document.createElement("span");
    dot.className="sw-dot";
    $(".sw-basket-dots",basket).appendChild(dot);
    pulse(basket);
    swReadouts();
    if(swDealt===17){
      awardStar("d4","3 full rounds, 2 left in your hand — that's 17 DIV 5 and 17 MOD 5, both read straight off the same deal.");
    }
  }
  function swReset(){
    swDealt=0;
    swRenderBaskets();
    swReadouts();
  }
  $("#swDeal4").addEventListener("click",swDeal);
  $("#swReset4").addEventListener("click",swReset);
  swRenderBaskets();
  swReadouts();

  /* ═══ D5: predict, then run ═══ */
  $("#prCode5a").innerHTML=
    '<div class="pcline"><span class="kw">DECLARE</span> Total : <span class="typ">INTEGER</span></div>'+
    '<div class="pcline">Total <span class="arrow">←</span> 14 <span class="kw">MOD</span> 4</div>'+
    '<div class="pcline"><span class="kw">OUTPUT</span> Total</div>';
  $("#prCode5b").innerHTML=
    '<div class="pcline"><span class="kw">DECLARE</span> Total : <span class="typ">INTEGER</span></div>'+
    '<div class="pcline">Total <span class="arrow">←</span> 14 <span class="kw">DIV</span> 4</div>'+
    '<div class="pcline"><span class="kw">OUTPUT</span> Total</div>';
  $("#prCode5c").innerHTML=
    '<div class="pcline"><span class="kw">DECLARE</span> Average : <span class="typ">REAL</span></div>'+
    '<div class="pcline">Average <span class="arrow">←</span> 7 / 2</div>'+
    '<div class="pcline"><span class="kw">OUTPUT</span> Average</div>';
  const prRunDone={};
  function prRun(key,resultLabel,explain){
    const outEl=$("#prOut5"+key);
    const guessEl=$("#prGuess5"+key);
    const guess=guessEl.value.trim();
    const guessNum=parseFloat(guess), resNum=parseFloat(resultLabel);
    const matched = guess!=="" && !isNaN(guessNum) && !isNaN(resNum) && guessNum===resNum;
    const lead = matched ? "Bang on — that's exactly your guess. " : (guess ? "You guessed "+guess+". " : "");
    outEl.innerHTML='<span class="prompt">output ›</span> '+resultLabel+'<div class="pr-explain">'+lead+explain+"</div>";
    prRunDone[key]=true;
    if(prRunDone.a&&prRunDone.b&&prRunDone.c){
      awardStar("d5","All three predicted and run. Same DECLARE, ← and OUTPUT moves as Discovery 1 — this time doing real arithmetic, MOD, DIV and REAL division included.");
    }
  }
  $("#prRun5a").addEventListener("click",()=>prRun("a","2","14 MOD 4 is the leftover after grouping 14 into fours: three fours make 12, with 2 left over."));
  $("#prRun5b").addEventListener("click",()=>prRun("b","3","14 DIV 4 counts the whole groups of four that fit in 14 — three of them, with 2 spare that DIV quietly drops."));
  $("#prRun5c").addEventListener("click",()=>prRun("c","3.5","7 / 2 is ordinary division, and Average was declared REAL, so the decimal point survives."));
