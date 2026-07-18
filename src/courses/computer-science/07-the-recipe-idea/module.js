/* ================= Module 7 — The Recipe Idea =================
   Decomposition + abstraction + the four development stages, across six
   discoveries: a stage walk (PDLC), two input/process/output/storage sort
   boards, a keep/drop abstraction sort with a free-text "name it" moment, a
   fill-the-gap decomposition, and a free-text own decomposition. Runs inside
   the shared engine IIFE, so $, $$, awardStar, toast and sparks are in scope.

   This lesson uses the shared chips kit in label mode:
   makeChips(containerEl, targets, onAllHit, formatFn). */

/* ═══ D1: the four PDLC stages ═══ */
const STAGES=[
  {key:"analysis",label:"Analysis",text:"First, someone has to ask the annoying questions: what does ‘fairly’ even mean? Split evenly, or does everyone pay for exactly what they ordered? Understanding the real problem — properly — happens here, before anything else."},
  {key:"design",label:"Design",text:"Now sketch the plan on paper: what the screen looks like, what order things happen in, what maths runs underneath. Nothing runs yet. This is the blueprint."},
  {key:"coding",label:"Coding",text:"Only now does anyone write actual code — turning the blueprint into something a machine can run. It's often the fastest stage, because the hard thinking already happened."},
  {key:"testing",label:"Testing",text:"Try it on a real bill. A friend who only had water breaks it in an interesting way — good, that's testing doing its job. Problems found here often send you back to Design, or even Analysis — and that's normal, not failure."}
];
const check1=makeChips($("#chips1"),["analysis","design","coding","testing"],
  ()=>awardStar("d1","One wish, all four stages, start to finish. That's the whole shape of building anything."),
  k=>STAGES.find(s=>s.key===k).label);
const stageList=$("#stageList1");
STAGES.forEach((stage,idx)=>{
  const item=document.createElement("div");
  item.className="stage-item";
  const btn=document.createElement("button");
  btn.type="button";btn.className="stage-btn";
  btn.innerHTML='<span class="num">'+(idx+1)+'</span><span>'+stage.label+'</span>';
  const p=document.createElement("p");
  p.className="stage-text";
  p.textContent=stage.text;
  btn.addEventListener("click",()=>{
    item.classList.add("done");
    check1(stage.key);
  });
  item.appendChild(btn);
  item.appendChild(p);
  stageList.appendChild(item);
});

/* ═══ D2/D3: sort boards ═══ */
const CATS=[
  {key:"input",label:"Input"},
  {key:"process",label:"Process"},
  {key:"output",label:"Output"},
  {key:"storage",label:"Storage"}
];
const CONFIRM={
  input:"— an Input, something the system takes in from outside.",
  process:"— a Process, work the system does on what it's got.",
  output:"— an Output, something handed back to a person.",
  storage:"— Storage, something the system keeps for later."
};
function buildSortBoard(containerEl,items,onAllSolved){
  const solved=items.map(()=>false);
  items.forEach((item,idx)=>{
    const el=document.createElement("div");
    el.className="sort-item";
    const text=document.createElement("span");
    text.className="sort-text";
    text.textContent=item.text;
    const btns=document.createElement("div");
    btns.className="sort-btns";
    CATS.forEach(cat=>{
      const b=document.createElement("button");
      b.type="button";b.className="sort-btn";
      b.textContent=cat.label;
      b.addEventListener("click",()=>{
        if(item.correct.includes(cat.key)){
          solved[idx]=true;
          el.classList.add("solved");
          b.classList.add("chosen");
          const tag=document.createElement("span");
          tag.className="sort-tag";
          tag.textContent="→ "+cat.label;
          el.appendChild(tag);
          let msg="‘"+item.text+"’ "+CONFIRM[cat.key];
          if(item.correct.length>1&&cat.key!==item.primary){
            msg+=" ("+CATS.find(c=>c.key===item.primary).label+" would work just as well.)";
          }
          toast(msg);
          if(solved.every(Boolean))onAllSolved();
        }else{
          toast("Ask about ‘"+item.text+"’: does it come from outside, get worked on, go to a person, or get kept for later?");
        }
      });
      btns.appendChild(b);
    });
    el.appendChild(text);
    el.appendChild(btns);
    containerEl.appendChild(el);
  });
}

buildSortBoard($("#sortList2"),[
  {text:"The moisture sensor's reading",correct:["input"],primary:"input"},
  {text:"Deciding whether the soil counts as ‘dry’",correct:["process"],primary:"process"},
  {text:"Switching the pump on",correct:["output"],primary:"output"},
  {text:"Remembering when it last watered",correct:["storage"],primary:"storage"}
],()=>awardStar("d2","Four parts, four jobs, no doubt about any of them. That's decomposition, properly done."));

buildSortBoard($("#sortList3"),[
  {text:"The barcode scanner's reading",correct:["input"],primary:"input"},
  {text:"The price list taped by the counter",correct:["storage","input"],primary:"storage"},
  {text:"Working out the change to give back",correct:["process"],primary:"process"},
  {text:"The receipt printing out",correct:["output"],primary:"output"},
  {text:"Today's running sales total",correct:["storage"],primary:"storage"},
  {text:"Adding this sale onto today's total",correct:["process"],primary:"process"}
],()=>awardStar("d3","Six pieces, some of them genuinely arguable — and you categorised every one. Real systems are exactly this messy."));

/* ═══ D4: the metro map trick (abstraction) ═══ */
const KEEPDROP=[
  {key:"keep",label:"Keep"},
  {key:"drop",label:"Drop"}
];
const MAPDETAILS=[
  {text:"Which stations are on the line, and in what order",correct:"keep",reason:"you can't plan a route without knowing what's on it."},
  {text:"Where the lines cross, so you know where to change trains",correct:"keep",reason:"miss this and you miss your connection."},
  {text:"Which line colour or number each route is",correct:"keep",reason:"it's how you actually follow the map with your eye."},
  {text:"The real distance in kilometres between each station",correct:"drop",reason:"it doesn't change which train you catch or where you get off."},
  {text:"The actual shape the tracks curve through underground",correct:"drop",reason:"the map straightens every curve into a clean line, and you still arrive fine."},
  {text:"The names of the streets and rivers above each station",correct:"drop",reason:"real, and completely beside the point for catching a train."}
];
function buildKeepDropBoard(containerEl,items,onAllSolved){
  const solved=items.map(()=>false);
  items.forEach((item,idx)=>{
    const el=document.createElement("div");
    el.className="sort-item";
    const text=document.createElement("span");
    text.className="sort-text";
    text.textContent=item.text;
    const btns=document.createElement("div");
    btns.className="sort-btns";
    KEEPDROP.forEach(opt=>{
      const b=document.createElement("button");
      b.type="button";b.className="sort-btn";
      b.textContent=opt.label;
      b.addEventListener("click",()=>{
        if(item.correct===opt.key){
          solved[idx]=true;
          el.classList.add("solved");
          b.classList.add("chosen");
          const tag=document.createElement("span");
          tag.className="sort-tag";
          tag.textContent="→ "+opt.label;
          el.appendChild(tag);
          toast("‘"+item.text+"’ — "+opt.label.toLowerCase()+": "+item.reason);
          if(solved.every(Boolean))onAllSolved();
        }else{
          toast("Ask of ‘"+item.text+"’: would someone using the map need this to get from A to B? If not, it can go.");
        }
      });
      btns.appendChild(b);
    });
    el.appendChild(text);
    el.appendChild(btns);
    containerEl.appendChild(el);
  });
}
let awarded4=false;
function revealNameIt4(){
  const box=$("#nameIt4");
  box.hidden=false;
  const label=document.createElement("label");
  label.textContent="Abstraction, in your own words";
  label.setAttribute("for","ownDefinition4");
  const ta=document.createElement("textarea");
  ta.id="ownDefinition4";
  ta.setAttribute("aria-label","Abstraction, in your own words");
  const hint=document.createElement("p");
  hint.className="soft name-it-hint";
  hint.textContent="This is close to the way abstraction gets asked about later — read your sentence back without the metro map in it: does it still explain what abstraction actually is?";
  ta.addEventListener("input",()=>{
    if(!awarded4&&ta.value.trim().length>0){
      awarded4=true;
      awardStar("d4","That's abstraction, said in your own words — keep what the job needs, drop what it doesn't. This is close to how it gets asked about later, and yours holds up.");
    }
  });
  box.appendChild(label);
  box.appendChild(ta);
  box.appendChild(hint);
}
buildKeepDropBoard($("#sortList4"),MAPDETAILS,revealNameIt4);

/* ═══ D5: spot the missing piece ═══ */
const PREFILLED5={
  input:["The doorbell button","The camera's image"],
  process:["Checking the image against known faces"],
  output:[],
  storage:["The list of known faces"]
};
const board5=$("#decompBoard5");
const colEls5={};
CATS.forEach(cat=>{
  const col=document.createElement("div");
  col.className="decomp-col";
  const h=document.createElement("h4");
  h.textContent=cat.label;
  col.appendChild(h);
  PREFILLED5[cat.key].forEach(txt=>{
    const p=document.createElement("div");
    p.className="decomp-piece";
    p.textContent=txt;
    col.appendChild(p);
  });
  if(PREFILLED5[cat.key].length===0){
    const ph=document.createElement("div");
    ph.className="decomp-placeholder";
    ph.textContent="?";
    col.appendChild(ph);
  }
  board5.appendChild(col);
  colEls5[cat.key]=col;
});
const CHOICES5=[
  {text:"A notification sent to your phone",correct:true},
  {text:"A backup of the face list, saved weekly",redirect:"That's a nice safety net, but the system would work fine without it. What's missing is something it can't function without at all."},
  {text:"A brighter light by the door",redirect:"That might help the camera see at night, but it doesn't fix the actual hole. Look at what happens after a face is checked — then what?"},
  {text:"The doorbell button",redirect:"That one's already on the board, under Input. The gap is somewhere still empty."}
];
const choices5=$("#decompChoices5");
CHOICES5.forEach(choice=>{
  const b=document.createElement("button");
  b.type="button";b.className="decomp-choice";
  b.textContent=choice.text;
  b.addEventListener("click",()=>{
    if(choice.correct){
      b.classList.add("correct");
      const outputCol=colEls5.output;
      outputCol.querySelector(".decomp-placeholder").remove();
      const p=document.createElement("div");
      p.className="decomp-piece new";
      p.textContent=choice.text;
      outputCol.appendChild(p);
      outputCol.classList.add("filled");
      $$(".decomp-choice",choices5).forEach(o=>o.setAttribute("disabled",""));
      awardStar("d5","Exactly. The system could take a photo, check it, and remember who's been — but with no Output, all of that happens in total silence.");
    }else{
      toast(choice.redirect);
    }
  });
  choices5.appendChild(b);
});

/* ═══ D6: decompose your own ═══ */
const ownGrid=$("#ownGrid6");
const ownState={input:"",process:"",output:"",storage:""};
let awarded6=false;
CATS.forEach(cat=>{
  const box=document.createElement("div");
  box.className="own-box";
  const label=document.createElement("label");
  label.textContent=cat.label;
  label.setAttribute("for","own-"+cat.key);
  const ta=document.createElement("textarea");
  ta.id="own-"+cat.key;
  ta.setAttribute("aria-label",cat.label);
  ta.addEventListener("input",()=>{
    ownState[cat.key]=ta.value.trim();
    if(!awarded6&&Object.values(ownState).every(v=>v.length>0)){
      awarded6=true;
      awardStar("d6","You just decomposed something that's genuinely yours. No one graded it — it was never that kind of exercise.");
    }
  });
  box.appendChild(label);
  box.appendChild(ta);
  ownGrid.appendChild(box);
});
