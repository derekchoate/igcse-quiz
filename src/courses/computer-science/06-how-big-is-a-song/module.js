/* ================= Module 6 — How Big Is a Song? =================
   Lesson-specific code only: the commas helper, the value cycler, and the
   five discoveries (unit ladder, picture/sound steppers, squeeze lever,
   lossless/lossy sort). Runs inside the shared engine IIFE, so $, awardStar,
   toast and sparks are already in scope. This lesson's chips carry formatFn
   labels, so makeChips is defined here rather than taken from the shared kit. */

/* ---------- chips: auto-detect targets, with formatFn labels ---------- */
function makeChips(containerEl,targets,onAllHit,formatFn){
  const hit={};
  targets.forEach(t=>{
    const c=document.createElement("span");
    c.className="chip";c.dataset.target=t;
    c.textContent=formatFn?formatFn(t):t;
    containerEl.appendChild(c);
  });
  return function check(current){
    if(targets.includes(current)&&!hit[current]){
      hit[current]=true;
      const chip=$('.chip[data-target="'+current+'"]',containerEl);
      chip.classList.add("hit");
      const r=chip.getBoundingClientRect();
      sparks(r.left+r.width/2,r.top);
      const remaining=targets.filter(t=>!hit[t]).length;
      if(remaining>0)toast("Found "+(formatFn?formatFn(current):current)+" — lovely. "+remaining+" more if you fancy it.");
      else onAllHit();
    }
  };
}

function commas(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}

/* ---------- cycler: click steps through a preset list of values ---------- */
function makeCycler(btnEl,values,formatFn,onChange){
  let i=0;
  function render(){btnEl.textContent=formatFn(values[i]);}
  btnEl.addEventListener("click",()=>{
    i=(i+1)%values.length;
    render();
    onChange(values[i]);
  });
  render();
  return {value:()=>values[i]};
}

/* ═══ D1: the ladder of units ═══ */
const LADDER=[
  {name:"bit"},
  {name:"byte",bytes:1,factor:8,from:"bit"},
  {name:"KiB",bytes:1024,factor:1024,from:"byte"},
  {name:"MiB",bytes:1024*1024,factor:1024,from:"KiB"},
  {name:"GiB",bytes:1024*1024*1024,factor:1024,from:"MiB"},
  {name:"TiB",bytes:1024*1024*1024*1024,factor:1024,from:"GiB"},
  {name:"PiB",bytes:1024*1024*1024*1024*1024,factor:1024,from:"TiB"}
];
const check1=makeChips($("#chips1"),["byte","KiB","GiB","PiB"],
  ()=>awardStar("d1","The whole ladder, climbed — bit to pebibyte. Every gigabyte you own is just this, repeated."),
  k=>({byte:"byte — the odd one, only ×8",KiB:"KiB — 1,024 bytes",GiB:"GiB — over a billion bytes",PiB:"PiB — the top of the ladder"})[k]);
const ladderRow=$("#ladderRow1");
const ladderBtns={};
LADDER.forEach(rung=>{
  const b=document.createElement("button");
  b.type="button";b.className="ladder-btn";
  b.textContent=rung.name;
  b.setAttribute("aria-pressed","false");
  b.addEventListener("click",()=>setRung(rung.name));
  ladderRow.appendChild(b);
  ladderBtns[rung.name]=b;
});
function setRung(name){
  const rung=LADDER.find(r=>r.name===name);
  LADDER.forEach(r=>ladderBtns[r.name].setAttribute("aria-pressed",r.name===name?"true":"false"));
  $("#rungName1").textContent=rung.name;
  if(rung.name==="bit"){
    $("#rungBytes1").textContent="1 bit";
    $("#rungCaption1").textContent="the base unit — one lit bulb, just like Module 1";
  }else{
    $("#rungBytes1").textContent=commas(rung.bytes)+" byte"+(rung.bytes===1?"":"s");
    $("#rungCaption1").textContent="×"+rung.factor+" from a "+rung.from+(rung.factor===8?" — the one odd step":"");
  }
  check1(name);
}
setRung("bit");

/* ═══ D2: work out a real picture ═══ */
const check2=makeChips($("#chips2"),[64,1024,3072],
  ()=>awardStar("d2","Three real file sizes, worked out in stages. That's every image format's arithmetic underneath."),
  b=>commas(b)+" bytes");
let w2=8,h2=8,d2=1;
function updateD2(){
  const pixels=w2*h2;
  const bits=pixels*d2;
  const bytes=bits/8;
  $("#pixelCount2").textContent=commas(pixels);
  $("#bitsPerPixel2").textContent=d2;
  $("#fileBytes2").textContent=commas(bytes)+" byte"+(bytes===1?"":"s");
  $("#cellBytes2").classList.toggle("matched",[64,1024,3072].includes(bytes));
  check2(bytes);
}
makeCycler($("#widthBtn2"),[8,16,32],v=>v+" px",v=>{w2=v;updateD2();});
makeCycler($("#heightBtn2"),[8,16,32],v=>v+" px",v=>{h2=v;updateD2();});
makeCycler($("#depthBtn2"),[1,8,24],v=>v+"-bit",v=>{d2=v;updateD2();});
updateD2();

/* ═══ D3: work out a real sound ═══ */
const check3=makeChips($("#chips3"),[8000,32000,176000],
  ()=>awardStar("d3","Rate, resolution, duration — multiplied out three times over. Every audio file starts as this sum."),
  b=>commas(b)+" bytes");
let rate3=8000,res3=8,sec3=1;
let seeding3=true;
function updateD3(){
  const bits=rate3*res3*sec3;
  const bytes=bits/8;
  $("#fileBytes3").textContent=commas(bytes)+" byte"+(bytes===1?"":"s");
  $("#cellBytes3").classList.toggle("matched",[8000,32000,176000].includes(bytes));
  if(!seeding3)check3(bytes);
}
makeCycler($("#rateBtn3"),[8000,16000,44000],v=>commas(v)+" Hz",v=>{rate3=v;updateD3();});
makeCycler($("#resBtn3"),[8,16],v=>v+"-bit",v=>{res3=v;updateD3();});
makeCycler($("#secBtn3"),[1,2,4],v=>v+" s",v=>{sec3=v;updateD3();});
updateD3();
seeding3=false;

/* ═══ D4: the squeeze lever ═══ */
const N4=16;
const bits4=new Array(N4).fill(0);
const cells4=[];
const row4=$("#pixelRow4");
for(let i=0;i<N4;i++){
  const b=document.createElement("button");
  b.type="button";b.className="pixel-cell";
  b.setAttribute("aria-pressed","false");
  b.setAttribute("aria-label","pixel "+(i+1));
  const idx=i;
  b.addEventListener("click",()=>{
    bits4[idx]=bits4[idx]?0:1;
    b.setAttribute("aria-pressed",bits4[idx]?"true":"false");
    updateD4();
  });
  row4.appendChild(b);
  cells4.push(b);
}
let squeezeOn=false;
const check4=makeChips($("#chips4"),["stripes","noise"],
  ()=>awardStar("d4","Stripes shrank, noise grew. That's the whole honest truth about compression, in one lever."),
  k=>({stripes:"stripy — watch it shrink",noise:"noisy — watch it grow instead"})[k]);
function runsOf(arr){
  const runs=[];
  arr.forEach(v=>{
    if(runs.length&&runs[runs.length-1].value===v)runs[runs.length-1].count++;
    else runs.push({value:v,count:1});
  });
  return runs;
}
function updateD4(){
  const runs=runsOf(bits4);
  const squeezedValues=runs.length*2;
  if(!squeezeOn){
    $("#squeezedRow4").hidden=true;
    $("#tally4").className="tally-line";
    $("#tally4").textContent="raw: "+N4+" values";
    return;
  }
  $("#squeezedRow4").hidden=false;
  const sq=$("#squeezedRow4");sq.innerHTML="";
  runs.forEach(r=>{
    const blk=document.createElement("div");
    blk.className="run-block"+(r.value?" on":"");
    blk.style.flex=r.count;
    blk.textContent=r.count;
    sq.appendChild(blk);
  });
  const line=$("#tally4");
  if(squeezedValues<N4){
    line.className="tally-line shrank";
    line.innerHTML="raw: "+N4+" values · squeezed: <b>"+runs.length+" runs = "+squeezedValues+" values</b> · shrank";
  }else if(squeezedValues>N4){
    line.className="tally-line grew";
    line.innerHTML="raw: "+N4+" values · squeezed: <b>"+runs.length+" runs = "+squeezedValues+" values</b> · grew instead";
  }else{
    line.className="tally-line";
    line.innerHTML="raw: "+N4+" values · squeezed: <b>"+runs.length+" runs = "+squeezedValues+" values</b> · no change";
  }
  if(runs.length<=6)check4("stripes");
  if(runs.length>=14)check4("noise");
}
function setPattern4(arr){
  arr.forEach((v,i)=>{bits4[i]=v;cells4[i].setAttribute("aria-pressed",v?"true":"false");});
  updateD4();
}
$("#squeezeToggle4").addEventListener("click",()=>{
  squeezeOn=!squeezeOn;
  $("#squeezeToggle4").setAttribute("aria-pressed",squeezeOn?"true":"false");
  updateD4();
});
$("#loadStripes4").addEventListener("click",()=>{
  setPattern4([0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1]);
});
$("#loadNoise4").addEventListener("click",()=>{
  setPattern4([0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]);
});
updateD4();

/* ═══ D5: lossless or lossy ═══ */
const scenarios5=[
  {text:"A program file — the app itself",answer:"lossless",redirect:"Picture one byte of the program changing by accident. Software has zero tolerance for ‘close enough’ — it either runs or it doesn't."},
  {text:"A photo you're archiving forever",answer:"lossless",redirect:"An archive is the one copy you'll never make again. Worth the extra size to keep every original pixel."},
  {text:"A song on a streaming app",answer:"lossy",redirect:"Streaming a lossless copy of every song to everyone, all day, costs a fortune in bandwidth — most services bet your ears won't miss what gets trimmed."},
  {text:"A video call",answer:"lossy",redirect:"A live call has to arrive right now — there's no time to send every original bit. Speed wins over perfection here."},
  {text:"A text document",answer:"lossless",redirect:"Lose the wrong bit from a text file and a word — or the whole file — can turn to nonsense. Text needs to survive exactly."}
];
const solved5=scenarios5.map(()=>false);
const list5=$("#sortList5");
scenarios5.forEach((sc,idx)=>{
  const item=document.createElement("div");
  item.className="sort-item";
  const text=document.createElement("span");
  text.className="sort-text";
  text.textContent=sc.text;
  const btns=document.createElement("div");
  btns.className="sort-btns";
  ["lossless","lossy"].forEach(choice=>{
    const b=document.createElement("button");
    b.type="button";b.className="sort-btn";
    b.textContent=choice==="lossless"?"Lossless":"Lossy";
    b.addEventListener("click",()=>{
      if(choice===sc.answer){
        solved5[idx]=true;
        item.classList.add("solved");
        b.classList.add("chosen");
        if(solved5.every(Boolean))awardStar("d5","All five sorted honestly. You now know exactly what you're trading away, and when it's worth it.");
      }else{
        toast(sc.redirect);
      }
    });
    btns.appendChild(b);
  });
  item.appendChild(text);
  item.appendChild(btns);
  list5.appendChild(item);
});
