/* ================= Module 8 — Reading the Map =================
   Bespoke flowchart signatures: a shape-sorter (D1), an SVG click-to-step
   walk engine driving two charts (D2/D3 guessing loop, D5 doubling loop),
   and a two-gap repair shop (D4). Runs inside the shared engine IIFE, so
   $, $$, reduceMotion, sparks, toast and awardStar are all in scope. */

  /* ═══ D1: five shapes, five jobs ═══
     (buildShape / KIND_LABEL now come from the shared `walk` kit, same scope) */
  const SHAPES=[
    {key:"term",shape:"term",text:"Start",name:"Terminator",job:"Start / stop",jobText:"where the algorithm begins and ends"},
    {key:"io",shape:"io",text:"Read age",name:"Input / output",job:"Data in or out",jobText:"something taken in, or a result handed back"},
    {key:"proc",shape:"proc",text:"Total ← Price × 2",name:"Process",job:"A step",jobText:"a calculation or an action the algorithm does"},
    {key:"dec",shape:"dec",text:"age ≥ 18?",name:"Decision",job:"A yes/no question",jobText:"the only shape with two arrows leaving it"},
    {key:"flow",shape:"flow",text:"",name:"Flow line",job:"The order to follow",jobText:"the arrow that joins the shapes in sequence"}
  ];
  const JOBS=[
    {key:"term",label:"Start / stop"},
    {key:"proc",label:"A step"},
    {key:"dec",label:"A yes/no question"},
    {key:"io",label:"Data in or out"},
    {key:"flow",label:"The order to follow"}
  ];
  const check1=makeChips($("#chips1"),SHAPES.map(s=>s.key),
    ()=>awardStar("d1","All five shapes named. From here, every flowchart is just these five in a row."),
    k=>SHAPES.find(s=>s.key===k).name,
    (label,remaining)=>"That's "+label+" — nice. "+remaining+" more shape"+(remaining>1?"s":"")+" to name.");
  const shapeList=$("#shapeList1");
  SHAPES.forEach(s=>{
    const item=document.createElement("div");
    item.className="shape-item";
    const stage=document.createElement("div");
    stage.className="shape-stage";
    stage.appendChild(buildShape({kind:s.shape,text:s.text}));
    const btns=document.createElement("div");
    btns.className="shape-btns";
    JOBS.forEach(job=>{
      const b=document.createElement("button");
      b.type="button";b.className="shape-btn";b.textContent=job.label;
      b.addEventListener("click",()=>{
        if(job.key===s.key){
          item.classList.add("solved");
          b.classList.add("chosen");
          check1(s.key);
        }else{
          toast("Not quite — look at the shape itself. "+hintForJob(job.key));
        }
      });
      btns.appendChild(b);
    });
    const name=document.createElement("div");
    name.className="shape-name";
    name.innerHTML=s.name+"<span>"+s.jobText+"</span>";
    item.appendChild(stage);
    item.appendChild(btns);
    item.appendChild(name);
    shapeList.appendChild(item);
  });
  function hintForJob(key){
    return {
      term:"the rounded pill is the one that starts and stops a chart.",
      proc:"a plain rectangle is a plain step — a calculation or action.",
      dec:"a diamond is a question, and it's the only shape with two arrows out.",
      io:"the slanted box is data crossing in or out.",
      flow:"the arrow only ever shows the order to follow."
    }[key];
  }

  /* ═══ walk-engine hints (consumed by makeWalk from the shared `walk` kit) ═══ */
  const HINT_STEP="Tap the chart to move the token ▸";
  const HINT_ASK="↑ pick a number to feed the chart";
  const HINT_DONE="Reached Stop ✦ — tap ↺ to walk it again";

  /* makeWalk / buildShape / KIND_LABEL / ARROW_DEFS now live in the shared
     `walk` kit — same IIFE scope, so they're referenced directly below. */

  /* ── SVG chart builders (each node group carries data-id; branch arrows carry data-edge) ── */
  function buildGuessSVG(){
    return '<svg viewBox="0 0 360 462" role="img" aria-label="Guess-the-number flowchart">'+ARROW_DEFS+
      // arrows first (behind nodes)
      '<line class="arw" x1="150" y1="50" x2="150" y2="78"/>'+
      '<line class="arw" x1="150" y1="120" x2="150" y2="146"/>'+
      '<line class="arw" x1="150" y1="188" x2="150" y2="204"/>'+
      '<line class="arw" x1="150" y1="369" x2="150" y2="402"/>'+
      '<g data-edge="yes"><line class="arw" x1="150" y1="294" x2="150" y2="325"/><text class="elbl" x="164" y="313">yes</text></g>'+
      '<g data-edge="no"><line class="arw" x1="208" y1="250" x2="230" y2="250"/><text class="elbl" x="214" y="240">no</text></g>'+
      '<path class="arw" d="M285,226 L285,100 L254,100"/>'+
      // nodes
      '<g class="fcn" data-id="start"><rect class="shp" x="100" y="14" width="100" height="36" rx="18"/><text class="lbl" x="150" y="33">Start</text></g>'+
      '<g class="fcn" data-id="ask"><rect class="shp" x="48" y="80" width="204" height="40" rx="8"/><text class="lbl" x="150" y="101">Say “Guess 1–10”</text></g>'+
      '<g class="fcn" data-id="read"><polygon class="shp" points="87,148 225,148 213,188 75,188"/><text class="lbl" x="150" y="169">Read a guess</text></g>'+
      '<g class="fcn" data-id="dec"><polygon class="shp" points="150,206 208,250 150,294 92,250"/><text class="lbl" x="150" y="251">guess = 7?</text></g>'+
      '<g class="fcn" data-id="nope"><polygon class="shp" points="237,226 345,226 333,274 225,274"/><text class="lbl" x="285" y="244">“Nope —</text><text class="lbl" x="285" y="261">try again”</text></g>'+
      '<g class="fcn" data-id="win"><polygon class="shp" points="87,327 225,327 213,369 75,369"/><text class="lbl" x="150" y="349">“Yes! Got it”</text></g>'+
      '<g class="fcn" data-id="stop"><rect class="shp" x="100" y="404" width="100" height="36" rx="18"/><text class="lbl" x="150" y="423">Stop</text></g>'+
      '</svg>';
  }
  function buildDoubleSVG(){
    return '<svg viewBox="0 0 380 492" role="img" aria-label="Doubling-loop flowchart">'+ARROW_DEFS+
      '<line class="arw" x1="150" y1="51" x2="150" y2="80"/>'+          // start -> init
      '<line class="arw" x1="150" y1="122" x2="150" y2="204"/>'+       // init -> decision (loop rejoins this spine)
      '<line class="arw" x1="150" y1="396" x2="150" y2="431"/>'+       // print -> stop
      '<g data-edge="no"><line class="arw" x1="150" y1="294" x2="150" y2="352"/><text class="elbl" x="166" y="326">no</text></g>'+
      '<g data-edge="yes"><line class="arw" x1="208" y1="250" x2="244" y2="250"/><text class="elbl" x="226" y="238">yes</text></g>'+
      '<path class="arw" d="M305,229 L305,164 L152,164"/>'+           // loop back up to the spine
      '<g class="fcn" data-id="start"><rect class="shp" x="100" y="13" width="100" height="38" rx="19"/><text class="lbl" x="150" y="33">Start</text></g>'+
      '<g class="fcn" data-id="init"><rect class="shp" x="90" y="82" width="120" height="40" rx="9"/><text class="lbl" x="150" y="103">n ← 3</text></g>'+
      '<g class="fcn" data-id="dec"><polygon class="shp" points="150,206 208,250 150,294 92,250"/><text class="lbl" x="150" y="251">n &lt; 20?</text></g>'+
      '<g class="fcn" data-id="dbl"><rect class="shp" x="246" y="229" width="118" height="42" rx="9"/><text class="lbl" x="305" y="251">n ← n × 2</text></g>'+
      '<g class="fcn" data-id="out"><polygon class="shp" points="96,354 216,354 204,396 84,396"/><text class="lbl" x="150" y="376">Print n</text></g>'+
      '<g class="fcn" data-id="stop"><rect class="shp" x="100" y="433" width="100" height="38" rx="19"/><text class="lbl" x="150" y="453">Stop</text></g>'+
      '</svg>';
  }

  /* ═══ D2: walk the guessing chart (baked guesses) ═══ */
  const GUESS_NODES={
    start:{kind:"term",next:"ask"},
    ask:{kind:"io",next:"read"},
    read:{kind:"io",set:s=>{s.guess=s.feed[s.idx];s.idx++;},say:s=>"read "+s.guess,next:"dec"},
    dec:{kind:"dec",cond:s=>s.guess===7,yes:"win",no:"nope"},
    nope:{kind:"io",say:()=>"“Nope — try again”",next:"ask"},
    win:{kind:"io",say:()=>"“Yes! You got it.”",next:"stop"},
    stop:{kind:"term"}
  };
  const GUESS_ANCHORS={
    start:null,
    ask:{x:300,y:100},
    read:{x:293,y:168},
    dec:{x:47,y:250},
    nope:{x:285,y:302},
    win:{x:293,y:348},
    stop:{x:293,y:422}
  };
  const GUESS_FLOW={
    "start>ask":"M150,50 L150,80",
    "ask>read":"M150,120 L150,148",
    "read>dec":"M150,188 L150,206",
    "dec>win":"M150,294 L150,327",
    "dec>nope":"M208,250 L233,250",
    "nope>ask":"M285,226 L285,100 L252,100",
    "win>stop":"M150,369 L150,404"
  };
  makeWalk("walk2",{
    nodes:GUESS_NODES,svg:buildGuessSVG(),start:"start",
    badge:{key:"guess",label:"guess"},anchors:GUESS_ANCHORS,flow:GUESS_FLOW,
    init:()=>({secret:7,guess:null,feed:[5,9,7],idx:0}),
  },{onFinish:()=>awardStar("d2","You walked it end to end — two trips round the loop, then out through Stop. That's exactly how a machine reads it too.")});

  /* ═══ D3: you drive the same chart ═══ */
  const GUESS_NODES3={
    start:{kind:"term",next:"ask"},
    ask:{kind:"io",next:"read"},
    read:{kind:"io",read:"ask",var:"guess",ask:"Feed the chart a guess:",options:[1,2,3,4,5,6,7,8,9,10],
      readSay:v=>"you feed it "+v,next:"dec"},
    dec:{kind:"dec",cond:s=>s.guess===7,yes:"win",no:"nope"},
    nope:{kind:"io",say:()=>"“Nope — try again”",next:"ask"},
    win:{kind:"io",say:()=>"“Yes! You got it.”",next:"stop"},
    stop:{kind:"term"}
  };
  makeWalk("walk3",{
    nodes:GUESS_NODES3,svg:buildGuessSVG(),start:"start",
    badge:{key:"guess",label:"guess"},anchors:GUESS_ANCHORS,flow:GUESS_FLOW,
    init:()=>({secret:7,guess:null}),
  },{onFinish:()=>awardStar("d3","You reached Stop — and every other number you fed it just sent the token round again. Same chart, your input, your path.")});

  /* ═══ D4: the repair shop ═══ */
  const PIECES4=[
    {v:"blank",label:"— choose a piece —"},
    {v:"dec_pos",label:"Decision ◇ — n > 0?"},
    {v:"out_notpos",label:"Output ▱ — Say “Not positive”"},
    {v:"proc_inc",label:"Process ▭ — n ← n + 1"},
    {v:"in_more",label:"Input ▱ — Read another number"},
    {v:"stop_extra",label:"Terminator ⬭ — Stop"}
  ];
  const repair=$("#repair4");
  const statusEl=$("#repairStatus4");
  const slotState={A:"blank",B:"blank"};
  let repairDone=false;

  function buildRepairSVG(){
    return '<svg viewBox="0 0 360 424" role="img" aria-label="Positive-number flowchart with two missing shapes">'+ARROW_DEFS+
      // arrows (behind nodes)
      '<line class="arw" x1="180" y1="48" x2="180" y2="74"/>'+
      '<line class="arw" x1="180" y1="116" x2="180" y2="136"/>'+
      '<g data-edge="yes"><path class="arw" d="M124,180 L100,180 L100,235"/><text class="elbl" x="110" y="170">yes</text></g>'+
      '<g data-edge="no"><path class="arw" d="M236,180 L270,180 L270,235"/><text class="elbl" x="258" y="170">no</text></g>'+
      '<path class="arw" d="M100,279 L100,355 L128,355"/>'+
      '<path class="arw" d="M270,279 L270,355 L232,355"/>'+
      // nodes
      '<g class="fcn" data-id="rstart"><rect class="shp" x="130" y="12" width="100" height="36" rx="18"/><text class="lbl" x="180" y="31">Start</text></g>'+
      '<g class="fcn" data-id="rread"><polygon class="shp" points="117,76 255,76 243,116 105,116"/><text class="lbl" x="180" y="97">Read number n</text></g>'+
      '<g class="fcn gap" data-id="gapA"><polygon class="shp" points="180,138 236,180 180,222 124,180"/><text class="lbl gap-num" x="180" y="181">①</text></g>'+
      '<g class="fcn" data-id="rpos"><polygon class="shp" points="52,237 160,237 148,279 40,279"/><text class="lbl" x="100" y="259">Say “Positive”</text></g>'+
      '<g class="fcn gap" data-id="gapB"><polygon class="shp" points="217,237 335,237 323,279 205,279"/><text class="lbl gap-num" x="270" y="259">②</text></g>'+
      '<g class="fcn" data-id="rstop"><rect class="shp" x="130" y="337" width="100" height="36" rx="18"/><text class="lbl" x="180" y="356">Stop</text></g>'+
      '</svg>';
  }

  const svgWrap=document.createElement("div");svgWrap.className="repair-svg";
  svgWrap.innerHTML=buildRepairSVG();
  const repairSVG=svgWrap.querySelector("svg");
  const tray=document.createElement("div");tray.className="repair-tray";
  const slotA=makeSlot("A","① first gap — right after reading n");
  const slotB=makeSlot("B","② second gap — the “no” answer");
  tray.appendChild(slotA);tray.appendChild(slotB);
  repair.appendChild(tray);
  repair.appendChild(svgWrap);

  function makeSlot(which,tag){
    const wrap=document.createElement("div");wrap.className="repair-slot";wrap.dataset.slot=which;
    const t=document.createElement("div");t.className="repair-tag";t.textContent=tag;
    const sel=document.createElement("select");
    sel.setAttribute("aria-label",tag);
    PIECES4.forEach(p=>{
      const o=document.createElement("option");o.value=p.v;o.textContent=p.label;sel.appendChild(o);
    });
    sel.addEventListener("change",()=>{
      slotState[which]=sel.value;
      checkRepair();
    });
    wrap.appendChild(t);wrap.appendChild(sel);
    return wrap;
  }
  function checkRepair(){
    if(repairDone)return;
    const a=slotState.A,b=slotState.B;
    if(a==="dec_pos"&&b==="out_notpos"){
      repairDone=true;
      // snap: the dashed gaps morph into finished shapes and the branches light
      slotA.classList.add("snapped");slotB.classList.add("snapped");
      snapGap("gapA","n > 0?");
      snapGap("gapB","Say “Not positive”");
      repairSVG.querySelector('[data-edge="yes"]').classList.add("taken");
      repairSVG.querySelector('[data-edge="no"]').classList.add("taken");
      statusEl.textContent="It runs. Read a number, ask if it's above zero, and answer either way.";
      awardStar("d4","Snapped into place. The diamond does the deciding, and the “no” path finally has something to say.");
      return;
    }
    // gentle, specific redirect based on whichever slot is filled
    if(a!=="blank"&&a!=="dec_pos"){
      statusEl.textContent="Trace it from the top: you've just read n, but nothing has tested it yet. The first gap needs a shape that can send the path two ways.";
    }else if(a==="dec_pos"&&b!=="out_notpos"){
      statusEl.textContent="The diamond fits the first gap nicely. Now — if n is not above zero, what should the chart say?";
    }else if(a==="blank"&&b!=="blank"&&b!=="out_notpos"){
      statusEl.textContent="That could go in a gap, but start with the first one: right after reading n, the chart still hasn't tested it.";
    }else{
      statusEl.textContent="";
    }
  }
  function snapGap(id,text){
    const g=repairSVG.querySelector('[data-id="'+id+'"]');
    g.classList.remove("gap");g.classList.add("snapped");
    const t=g.querySelector("text");
    t.classList.remove("gap-num");t.textContent=text;
  }

  /* ═══ D5: predict, then press (doubling loop) ═══ */
  const DOUBLE_NODES={
    start:{kind:"term",next:"init"},
    init:{kind:"proc",set:s=>{s.n=3;},say:()=>"n starts at 3",next:"dec"},
    dec:{kind:"dec",cond:s=>s.n<20,yes:"dbl",no:"out"},
    dbl:{kind:"proc",set:s=>{s.n=s.n*2;},say:s=>"double it → "+s.n,next:"dec"},
    out:{kind:"io",say:s=>"print "+s.n,next:"stop"},
    stop:{kind:"term"}
  };
  const DOUBLE_ANCHORS={
    start:null,
    init:{x:285,y:102},
    dec:{x:47,y:250},
    dbl:{x:305,y:301},
    out:{x:292,y:376},
    stop:{x:288,y:453}
  };
  const DOUBLE_FLOW={
    "start>init":"M150,51 L150,82",
    "init>dec":"M150,122 L150,206",
    "dec>dbl":"M208,250 L246,250",
    "dec>out":"M150,294 L150,354",
    "dbl>dec":"M305,229 L305,164 L150,164 L150,206",
    "out>stop":"M150,396 L150,433"
  };
  makeWalk("walk5",{
    nodes:DOUBLE_NODES,svg:buildDoubleSVG(),start:"start",
    badge:{key:"n",label:"n"},anchors:DOUBLE_ANCHORS,flow:DOUBLE_FLOW,
    init:()=>({n:null}),
  },{onFinish:s=>{
    const guess=$("#predict5").value.trim();
    let msg="It printed 24 — the loop only let go once doubling pushed n past 20.";
    if(guess==="24")msg="You called it: 24. The loop only let go once doubling pushed n past 20.";
    awardStar("d5",msg);
  }});
