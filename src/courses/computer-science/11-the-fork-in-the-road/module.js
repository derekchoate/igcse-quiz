/* ================= Module 11 — The Fork in the Road =================
   The signature interaction: a literal branching path. Code renders as a
   flowchart fork; dials/switches set input values; a lantern (the shared
   `walk` kit's click-to-step engine) travels the road actually taken while
   the untaken road simply never lights up. D1/D2 reuse makeWalk directly,
   with onEnter syncing the separate pseudocode panel's current line(s) to
   whichever node the lantern is on (see FORK1_LINES/FORK2_LINES) — same
   convention M12's flowchart discoveries use; D2's noProc in particular
   highlights ENDIF, since there's no ELSE line to light for that road at
   all, which is exactly its discovery's point. D3 compares stacked IF
   against CASE OF by reading effort; D4/D5 are state-matching gates for
   AND/OR/NOT; D6 is a drag-snap-style (dropdown) assembly of a whole
   IF...THEN...ELSE...ENDIF. Runs inside the shared engine IIFE, so $, $$,
   reduceMotion, sparks, toast, awardStar, makeChips, makeWalk, buildShape,
   ARROW_DEFS, syncCodeHighlight are all in scope. */

  /* ═══ shared walk-engine hints (consumed by makeWalk, shared kit) ═══ */
  const HINT_STEP="Tap the chart to move the lantern ▸";
  const HINT_ASK="↑ pick a value to feed the fork";
  const HINT_DONE="Reached Stop ✦ — tap ↺ to walk it again";

  /* ═══ shared fork-chart builder (used by D1 and D2) ═══
     Both discoveries are the exact same shape — one diamond, two branches
     that merge back into Stop — only the labels differ. */
  function fcLbl(text,x,y){
    if(Array.isArray(text)){
      return '<text class="lbl" x="'+x+'" y="'+(y-7)+'">'+text[0]+'</text>'+
             '<text class="lbl" x="'+x+'" y="'+(y+9)+'">'+text[1]+'</text>';
    }
    return '<text class="lbl" x="'+x+'" y="'+y+'">'+text+'</text>';
  }
  function buildForkSVG(aria,askText,decText,yesProcText,yesOutText,noProcText,noOutText){
    return '<svg viewBox="0 0 360 560" role="img" aria-label="'+aria+'">'+ARROW_DEFS+
      '<line class="arw" x1="180" y1="48" x2="180" y2="76"/>'+
      '<line class="arw" x1="180" y1="116" x2="180" y2="138"/>'+
      '<g data-edge="yes"><path class="arw" d="M124,180 L100,180 L100,237"/><text class="elbl" x="106" y="170">yes</text></g>'+
      '<g data-edge="no"><path class="arw" d="M236,180 L270,180 L270,237"/><text class="elbl" x="256" y="170">no</text></g>'+
      '<line class="arw" x1="100" y1="277" x2="100" y2="291"/>'+
      '<line class="arw" x1="270" y1="277" x2="270" y2="291"/>'+
      '<path class="arw" d="M100,331 L100,488 L128,488"/>'+
      '<path class="arw" d="M270,331 L270,488 L232,488"/>'+
      '<g class="fcn" data-id="start"><rect class="shp" x="130" y="12" width="100" height="36" rx="18"/><text class="lbl" x="180" y="31">Start</text></g>'+
      '<g class="fcn" data-id="ask"><polygon class="shp" points="117,76 255,76 243,116 105,116"/>'+fcLbl(askText,180,100)+'</g>'+
      '<g class="fcn" data-id="dec"><polygon class="shp" points="180,138 236,180 180,222 124,180"/>'+fcLbl(decText,180,184)+'</g>'+
      '<g class="fcn" data-id="yesProc"><rect class="shp" x="40" y="237" width="120" height="40" rx="9"/>'+fcLbl(yesProcText,100,257)+'</g>'+
      '<g class="fcn" data-id="yesOut"><polygon class="shp" points="40,291 160,291 148,331 28,331"/>'+fcLbl(yesOutText,94,311)+'</g>'+
      '<g class="fcn" data-id="noProc"><rect class="shp" x="200" y="237" width="120" height="40" rx="9"/>'+fcLbl(noProcText,260,257)+'</g>'+
      '<g class="fcn" data-id="noOut"><polygon class="shp" points="212,291 332,291 320,331 200,331"/>'+fcLbl(noOutText,266,311)+'</g>'+
      '<g class="fcn" data-id="stop"><rect class="shp" x="130" y="470" width="100" height="36" rx="18"/><text class="lbl" x="180" y="489">Stop</text></g>'+
      '</svg>';
  }
  const FORK_FLOW={
    "start>ask":"M180,48 L180,76",
    "ask>dec":"M180,116 L180,138",
    "dec>yesProc":"M124,180 L100,180 L100,237",
    "dec>noProc":"M236,180 L270,180 L270,237",
    "yesProc>yesOut":"M100,277 L100,291",
    "noProc>noOut":"M270,277 L270,291",
    "yesOut>stop":"M100,331 L100,488 L128,488",
    "noOut>stop":"M270,331 L270,488 L232,488"
  };
  const FORK_ANCHORS={
    start:null, ask:{x:280,y:96}, dec:{x:60,y:180},
    yesProc:{x:280,y:257}, yesOut:{x:280,y:311},
    noProc:{x:60,y:257}, noOut:{x:60,y:311},
    stop:{x:280,y:488}
  };

  /* ═══ D1: one fork — cinema ticket pricing ═══ */
  const D1_NODES={
    start:{kind:"term",next:"ask"},
    ask:{kind:"io",read:"ask",var:"age",ask:"Feed the fork an age:",options:[10,12,17,18,19,25],
      readSay:v=>"Age arrives: "+v,next:"dec"},
    dec:{kind:"dec",cond:s=>s.age>=18,yes:"yesProc",no:"noProc"},
    yesProc:{kind:"proc",set:s=>{s.price=15;},say:()=>"Price ← 15",next:"yesOut"},
    yesOut:{kind:"io",say:()=>'OUTPUT "Adult ticket", Price → prints Adult ticket 15',next:"stop"},
    noProc:{kind:"proc",set:s=>{s.price=8;},say:()=>"Price ← 8",next:"noOut"},
    noOut:{kind:"io",say:()=>'OUTPUT "Child ticket", Price → prints Child ticket 8',next:"stop"},
    stop:{kind:"term"}
  };
  // Before an age is fed in, nothing's been tested yet, so only the IF
  // keyword lights up (same convention M12 uses for its loop keywords);
  // once dec actually evaluates it, the whole condition line does. Stop
  // lights ENDIF — the fork only actually closes once the lantern gets
  // there, after whichever OUTPUT line already ran.
  const FORK1_LINES={
    start:["f1-if-kw"],ask:["f1-if-kw"],dec:["f1-if"],
    yesProc:["f1-then","f1-yesproc"],yesOut:["f1-yesout"],
    noProc:["f1-else","f1-noproc"],noOut:["f1-noout"],
    stop:["f1-endif"]
  };
  makeWalk("walk1",{
    nodes:D1_NODES,
    svg:buildForkSVG("Cinema ticket pricing flowchart","Read Age",["Age >=","18?"],
      "Price ← 15",["Print Adult","ticket, 15"],"Price ← 8",["Print Child","ticket, 8"]),
    start:"start",badge:{key:"price",label:"price"},anchors:FORK_ANCHORS,flow:FORK_FLOW,
    init:()=>({age:null,price:undefined})
  },{
    onEnter:id=>syncCodeHighlight("forkCode1",FORK1_LINES,id),
    onFinish:s=>awardStar("d1","Lantern reached Stop — the "+(s.price===15?"THEN":"ELSE")+
      " road lit up this time, and the other stayed dark. Feed it a different age any time; nothing here ever runs out.")});

  /* ═══ D2: the ELSE path exists even when empty ═══ */
  const D2_NODES={
    start:{kind:"term",next:"ask"},
    ask:{kind:"io",read:"ask",var:"ticket",ask:"Feed the fork a ticket type:",options:["Adult","Child"],
      readSay:v=>"Ticket arrives: "+v,next:"dec"},
    dec:{kind:"dec",cond:s=>s.ticket==="Adult",yes:"yesProc",no:"noProc"},
    yesProc:{kind:"proc",set:s=>{s.stamps=(s.stamps||0)+1;},say:s=>"Stamps ← Stamps + 1 (now "+s.stamps+")",next:"yesOut"},
    yesOut:{kind:"io",say:()=>'OUTPUT "Enjoy the show!"',next:"stop"},
    noProc:{kind:"proc",set:()=>{},say:()=>"(do nothing) — the quiet road",next:"noOut"},
    noOut:{kind:"io",say:()=>'OUTPUT "Enjoy the show!"',next:"stop"},
    stop:{kind:"term"}
  };
  // The "no" road has no ELSE line to light at all — that's the whole
  // point of this discovery — so noProc highlights ENDIF instead: the
  // quiet road still lands somewhere, it just skips straight to the end.
  // Stop also lights ENDIF, on either road, since the fork closes there.
  const FORK2_LINES={
    start:["f2-if-kw"],ask:["f2-if-kw"],dec:["f2-if"],
    yesProc:["f2-then","f2-yesproc"],yesOut:["f2-out"],
    noProc:["f2-endif"],noOut:["f2-out"],
    stop:["f2-endif"]
  };
  makeWalk("walk2",{
    nodes:D2_NODES,
    svg:buildForkSVG("Loyalty stamp flowchart with no ELSE written","Read Ticket",["Ticket =",'"Adult"?'],
      ["Stamps ← Stamps","+ 1"],["Print “Enjoy","the show!”"],"(do nothing)",["Print “Enjoy","the show!”"]),
    start:"start",badge:{key:"stamps",label:"stamps"},anchors:FORK_ANCHORS,flow:FORK_FLOW,
    init:()=>({ticket:null,stamps:0})
  },{
    onEnter:id=>syncCodeHighlight("forkCode2",FORK2_LINES,id),
    onFinish:()=>awardStar("d2","Both roads reach the same print line — one added a stamp on the way, the other just walked quietly past. No ELSE was ever written, and the road was there all along.")});

  /* ═══ D3: stacking forks vs CASE ═══ */
  const ITEMS3=[
    {key:"roti",label:"Roti",price:2},
    {key:"noodles",label:"Noodles",price:3},
    {key:"rice",label:"Rice",price:4},
    {key:"drink",label:"Drink",price:1}
  ];
  function buildStackLines(items){
    const lines=[];
    items.forEach((it,i)=>{
      lines.push({html:'<span class="kw">IF</span> Item = <span class="str">"'+it.label+'"</span>',item:i,depth:i,kind:"cond"});
      lines.push({html:'<span class="kw">THEN</span>',item:null,depth:i+1,kind:"then"});
      lines.push({html:'Price <span class="arrow">←</span> '+it.price,item:i,depth:i+2,kind:"assign"});
      if(i<items.length-1){
        lines.push({html:'<span class="kw">ELSE</span>',item:null,afterItem:i,depth:i+1,kind:"else"});
      }
    });
    for(let i=items.length-1;i>=0;i--){
      lines.push({html:'<span class="kw">ENDIF</span>',item:null,depth:i,kind:"endif"});
    }
    return lines;
  }
  function buildCaseLines(items){
    const lines=[{html:'<span class="kw">CASE OF</span> Item',item:null,depth:0,kind:"caseof"}];
    items.forEach((it,i)=>{
      lines.push({html:'<span class="str">"'+it.label+'"</span> : Price ← '+it.price,item:i,depth:1,kind:"case"});
    });
    lines.push({html:'<span class="kw">ENDCASE</span>',item:null,depth:0,kind:"endcase"});
    return lines;
  }
  const STACK_LINES3=buildStackLines(ITEMS3);
  const CASE_LINES3=buildCaseLines(ITEMS3);
  function stackOnPath(line,selIndex){
    if(selIndex===null)return false;
    if(line.item!==null && line.item<=selIndex)return true;
    if(line.kind==="else" && line.afterItem<selIndex)return true;
    return false;
  }
  function renderCodeList(container,lines,selIndex,mode){
    container.innerHTML="";
    lines.forEach(line=>{
      const div=document.createElement("div");
      const onPath = mode==="case" ? (selIndex!==null && line.item===selIndex) : stackOnPath(line,selIndex);
      div.className="pcline"+(onPath?" cur":"");
      div.style.paddingLeft=(line.depth*14)+"px";
      div.innerHTML=line.html;
      container.appendChild(div);
    });
  }
  let sel3=null;
  const doneItems3={};
  function render3(){
    renderCodeList($("#stackCode3"),STACK_LINES3,sel3,"stack");
    renderCodeList($("#caseCode3"),CASE_LINES3,sel3,"case");
    if(sel3===null){
      $("#stackCount3").textContent="Lines read: —";
      $("#caseCount3").textContent="Lines read: —";
    }else{
      const failed=sel3;
      $("#stackCount3").textContent="Lines read: "+(sel3+1)+(failed>0?" ("+failed+" failed IF"+(failed>1?"s":"")+" first)":" (matched immediately)");
      $("#caseCount3").textContent="Lines read: 1 (found directly)";
    }
  }
  const check3=makeChips($("#chips3"),ITEMS3.map(i=>i.key),
    ()=>awardStar("d3","Every item tried both ways — the further down the stacked list an item sits, the more forks you must fail first; CASE never cares about position at all."),
    k=>ITEMS3.find(i=>i.key===k).label,
    (label,remaining)=>"Tried "+label+" — "+remaining+" item"+(remaining>1?"s":"")+" to go.");
  const menuRow3=$("#menuRow3");
  ITEMS3.forEach((it,i)=>{
    const b=document.createElement("button");
    b.type="button";b.className="menu-btn";b.textContent=it.label;
    b.addEventListener("click",()=>{
      sel3=i;
      $$(".menu-btn",menuRow3).forEach((el,idx)=>el.classList.toggle("sel",idx===i));
      render3();
      if(!doneItems3[it.key]){doneItems3[it.key]=true;check3(it.key);}
    });
    menuRow3.appendChild(b);
  });
  render3();

  /* ═══ D4: AND needs both, OR needs either ═══ */
  let rain4=false, cold4=false, op4="AND";
  const check4=makeChips($("#chips4"),["andBoth","andOneFails","orAny","orNoneFails"],
    ()=>awardStar("d4","Every combination tried — AND only opens the gate with both switches on, OR opens it with just one. Same two switches, two very different gates."),
    k=>({andBoth:"AND with both switches on",andOneFails:"AND with only one switch on",
      orAny:"OR with at least one switch on",orNoneFails:"OR with both switches off"}[k]),
    (label,remaining)=>"Noticed — "+remaining+" combination"+(remaining>1?"s":"")+" to go.");
  function render4(){
    const panel=$("#gatePanel4");
    const fires = op4==="AND" ? (rain4&&cold4) : (rain4||cold4);
    panel.classList.toggle("open",fires);
    panel.innerHTML=(fires?"OPEN":"SHUT")+' <span class="gate-panel-val">('+fires+')</span>';
    $("#gateCode4").innerHTML=
      '<div class="pcline"><span class="kw">IF</span> Raining <span class="kw">'+op4+'</span> Cold</div>'+
      '<div class="pcline">  <span class="kw">THEN</span></div>'+
      '<div class="pcline">    <span class="kw">OUTPUT</span> <span class="str">"Wear a coat"</span></div>'+
      '<div class="pcline">  <span class="kw">ELSE</span></div>'+
      '<div class="pcline">    <span class="kw">OUTPUT</span> <span class="str">"No coat needed"</span></div>'+
      '<div class="pcline"><span class="kw">ENDIF</span></div>';
    $("#gateResult4").textContent=fires?"The gate opens — “Wear a coat.”":"The gate stays shut — “No coat needed.”";
    if(op4==="AND"&&rain4&&cold4)check4("andBoth");
    if(op4==="AND"&&rain4!==cold4)check4("andOneFails");
    if(op4==="OR"&&(rain4||cold4))check4("orAny");
    if(op4==="OR"&&!rain4&&!cold4)check4("orNoneFails");
  }
  $("#swRain4").addEventListener("click",()=>{
    rain4=!rain4;$("#swRain4").setAttribute("aria-pressed",String(rain4));$("#swRain4").classList.toggle("on",rain4);render4();
  });
  $("#swCold4").addEventListener("click",()=>{
    cold4=!cold4;$("#swCold4").setAttribute("aria-pressed",String(cold4));$("#swCold4").classList.toggle("on",cold4);render4();
  });
  $("#opAnd4").addEventListener("click",()=>{
    op4="AND";$("#opAnd4").classList.add("active");$("#opAnd4").setAttribute("aria-pressed","true");
    $("#opOr4").classList.remove("active");$("#opOr4").setAttribute("aria-pressed","false");render4();
  });
  $("#opOr4").addEventListener("click",()=>{
    op4="OR";$("#opOr4").classList.add("active");$("#opOr4").setAttribute("aria-pressed","true");
    $("#opAnd4").classList.remove("active");$("#opAnd4").setAttribute("aria-pressed","false");render4();
  });
  render4();

  /* ═══ D5: NOT flips the sign ═══ */
  let rain5=false, not5=false;
  const check5=makeChips($("#chips5"),["rainNotOff","clearNotOff","rainNotOn","clearNotOn"],
    ()=>awardStar("d5","All four combinations tried — NOT never looks at the weather, only at true and false. Flip it and the very same switch tells a different story."),
    k=>({rainNotOff:"Raining, NOT off",clearNotOff:"Clear, NOT off",
      rainNotOn:"Raining, NOT on",clearNotOn:"Clear, NOT on"}[k]),
    (label,remaining)=>"Noticed — "+remaining+" combination"+(remaining>1?"s":"")+" to go.");
  function render5(){
    const condText=not5?"NOT Raining":"Raining";
    const evaluated=not5?!rain5:rain5;
    $("#swRain5").classList.toggle("on",rain5);$("#swRain5").setAttribute("aria-pressed",String(rain5));
    $("#swNot5").classList.toggle("on",not5);$("#swNot5").setAttribute("aria-pressed",String(not5));
    $("#gateCode5").innerHTML=
      '<div class="pcline"><span class="kw">IF</span> <span class="typ">'+condText+'</span></div>'+
      '<div class="pcline">  <span class="kw">THEN</span></div>'+
      '<div class="pcline">    <span class="kw">OUTPUT</span> <span class="str">"Bring an umbrella"</span></div>'+
      '<div class="pcline">  <span class="kw">ELSE</span></div>'+
      '<div class="pcline">    <span class="kw">OUTPUT</span> <span class="str">"Good t-shirt weather"</span></div>'+
      '<div class="pcline"><span class="kw">ENDIF</span></div>';
    $("#gateResult5").textContent=(evaluated?"Condition fires — “Bring an umbrella.”":"Condition doesn't fire — “Good t-shirt weather.”")+
      " (Raining is "+(rain5?"true":"false")+", "+condText+" evaluates to "+(evaluated?"true":"false")+".)";
    if(rain5&&!not5)check5("rainNotOff");
    if(!rain5&&!not5)check5("clearNotOff");
    if(rain5&&not5)check5("rainNotOn");
    if(!rain5&&not5)check5("clearNotOn");
  }
  $("#swRain5").addEventListener("click",()=>{rain5=!rain5;render5();});
  $("#swNot5").addEventListener("click",()=>{not5=!not5;render5();});
  render5();

  /* ═══ D6: build a fork ═══ */
  const COND6=[
    {v:"blank",label:"— choose a condition —"},
    {v:"c1",label:'Day = "Weekend"'},
    {v:"c2",label:'Day > "Weekend"'},
    {v:"c3",label:'Day = "Monday"'}
  ];
  const THEN6=[
    {v:"blank",label:"— choose a THEN line —"},
    {v:"t1",label:"QueueLimit ← 50"},
    {v:"t2",label:"QueueLimit ← 20"},
    {v:"t3",label:'QueueLimit ← "Weekend"'}
  ];
  const ELSE6=[
    {v:"blank",label:"— choose an ELSE line —"},
    {v:"e1",label:"QueueLimit ← 20"},
    {v:"e2",label:"QueueLimit ← 50"},
    {v:"e3",label:'QueueLimit ← "Weekday"'}
  ];
  const slotState6={cond:"blank",then:"blank",els:"blank"};
  let build6Done=false;
  function makeSlot6(tag,options,onChange){
    const wrap=document.createElement("div");wrap.className="build-slot";
    const t=document.createElement("div");t.className="repair-tag";t.textContent=tag;
    const sel=document.createElement("select");sel.setAttribute("aria-label",tag);
    options.forEach(o=>{
      const opt=document.createElement("option");opt.value=o.v;opt.textContent=o.label;sel.appendChild(opt);
    });
    sel.addEventListener("change",()=>onChange(sel.value));
    wrap.appendChild(t);wrap.appendChild(sel);
    return wrap;
  }
  const slotsEl6=$("#buildSlots6");
  slotsEl6.appendChild(makeSlot6("Condition",COND6,v=>{slotState6.cond=v;checkBuild6();}));
  slotsEl6.appendChild(makeSlot6("THEN line",THEN6,v=>{slotState6.then=v;checkBuild6();}));
  slotsEl6.appendChild(makeSlot6("ELSE line",ELSE6,v=>{slotState6.els=v;checkBuild6();}));
  function checkBuild6(){
    if(build6Done)return;
    const {cond,then,els}=slotState6;
    if(cond==="c1"&&then==="t1"&&els==="e1"){
      build6Done=true;
      $("#buildCode6").innerHTML=
        '<div class="pcline"><span class="kw">IF</span> Day = <span class="str">"Weekend"</span></div>'+
        '<div class="pcline">  <span class="kw">THEN</span></div>'+
        '<div class="pcline">    QueueLimit <span class="arrow">←</span> 50</div>'+
        '<div class="pcline">  <span class="kw">ELSE</span></div>'+
        '<div class="pcline">    QueueLimit <span class="arrow">←</span> 20</div>'+
        '<div class="pcline"><span class="kw">ENDIF</span></div>';
      $("#buildStatus6").textContent="It snapped together — weekends allow 50 in the queue, every other day allows 20.";
      awardStar("d6","You assembled a whole IF…THEN…ELSE…ENDIF from loose parts, and it snapped together the moment all three matched the rule.");
      return;
    }
    if(cond!=="c1"&&cond!=="blank"){
      $("#buildStatus6").textContent="That condition asks something else. Which option actually tests whether today is the weekend?";
    }else if(cond==="c1"&&then!=="t1"&&then!=="blank"){
      $("#buildStatus6").textContent="The condition fits. THEN fires on weekends — which number is the bigger queue?";
    }else if(cond==="c1"&&then==="t1"&&els!=="e1"&&els!=="blank"){
      $("#buildStatus6").textContent="Condition and THEN both fit. ELSE fires on every other day — which number is the smaller queue?";
    }else{
      $("#buildStatus6").textContent="Pick a piece for each gap above.";
    }
  }
