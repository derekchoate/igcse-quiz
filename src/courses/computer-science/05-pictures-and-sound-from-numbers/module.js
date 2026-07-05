/* ================= Module 5 — Pictures & Sound from Numbers =================
   Bespoke signature interactions: a 1-bit pixel-paint grid with a live bit
   mirror, a colour-depth slider, a resolution stepper with a file-size counter,
   a tap-to-sample waveform, and a fill-the-blank trade-off sentence. Runs inside
   the shared engine IIFE, so $, $$, sparks, toast, awardStar and makeChips (the
   shared chips kit, label mode) are already in scope. */

/* ═══ D1: paint with one bit ═══ */
function makePixelGrid(el,rows,cols,onChange){
  el.style.gridTemplateColumns="repeat("+cols+", 28px)";
  const cells=[];
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const b=document.createElement("button");
      b.type="button";b.className="pixel-cell";
      b.setAttribute("aria-pressed","false");
      b.setAttribute("aria-label","pixel row "+(r+1)+" column "+(c+1));
      b.addEventListener("click",()=>{
        const on=b.getAttribute("aria-pressed")!=="true";
        b.setAttribute("aria-pressed",on?"true":"false");
        onChange(api);
      });
      el.appendChild(b);
      cells.push(b);
    }
  }
  const api={
    grid(){
      const g=[];
      for(let r=0;r<rows;r++){
        const row=[];
        for(let c=0;c<cols;c++)row.push(cells[r*cols+c].getAttribute("aria-pressed")==="true"?1:0);
        g.push(row);
      }
      return g;
    }
  };
  return api;
}
function renderMirror(el,grid){
  el.innerHTML="";
  const cols=grid[0].length;
  el.style.gridTemplateColumns="repeat("+cols+", 28px)";
  grid.forEach(row=>row.forEach(v=>{
    const s=document.createElement("span");
    s.className="bit-char"+(v?" on":"");
    s.textContent=v;
    el.appendChild(s);
  }));
}
let painted1=false;
const check1=makeChips($("#chips1"),["one","fullRow","cleared"],
  ()=>awardStar("d1","Five squares or fifty, it's all just bits under the paint. That mirror panel is genuinely what a computer keeps."),
  k=>({one:"light a single pixel",fullRow:"fill an entire row",cleared:"clear it back to black"})[k]);
makePixelGrid($("#pixelGrid1"),5,5,api=>{
  const g=api.grid();
  renderMirror($("#mirror1"),g);
  const flat=g.flat();
  const lit=flat.filter(v=>v===1).length;
  if(lit>0)painted1=true;
  if(lit===1)check1("one");
  if(g.some(row=>row.every(v=>v===1)))check1("fullRow");
  if(painted1&&lit===0)check1("cleared");
});
renderMirror($("#mirror1"),Array.from({length:5},()=>Array(5).fill(0)));

/* ═══ D2: colour depth ═══ */
const check2=makeChips($("#chips2"),[1,2,3],
  ()=>awardStar("d2","1-bit, 2-bit, 3-bit — all explored. Every shade you saw was still just a binary number."),
  d=>({1:"two shades (1-bit)",2:"four shades (2-bit)",3:"eight shades (3-bit)"})[d]);
function updateDepth(depth){
  const shades=Math.pow(2,depth);
  $("#depthVal2").textContent=depth;
  $("#shadeCount2").textContent=shades;
  const sw=$("#shadeSwatches2");sw.innerHTML="";
  for(let i=0;i<shades;i++){
    const grey=Math.round(i/(shades-1)*255);
    const bin=i.toString(2).padStart(depth,"0");
    const btn=document.createElement("button");
    btn.type="button";btn.className="shade-swatch";
    btn.style.background="rgb("+grey+","+grey+","+grey+")";
    btn.setAttribute("aria-label","shade "+bin);
    btn.addEventListener("click",()=>{
      $("#previewPixel2").style.background="rgb("+grey+","+grey+","+grey+")";
      $("#previewCode2").textContent=bin;
      check2(depth);
    });
    sw.appendChild(btn);
  }
}
$("#depthSlider2").addEventListener("input",e=>{
  const depth=Number(e.target.value);
  updateDepth(depth);
  check2(depth);
});
updateDepth(1);

/* ═══ D3: resolution ═══ */
const BASE3=[
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,0,0]
];
function downsample(base,targetSize){
  const block=base.length/targetSize;
  const out=[];
  for(let r=0;r<targetSize;r++){
    const row=[];
    for(let c=0;c<targetSize;c++){
      let sum=0;
      for(let br=0;br<block;br++)for(let bc=0;bc<block;bc++)sum+=base[r*block+br][c*block+bc];
      row.push(sum>=(block*block)/2?1:0);
    }
    out.push(row);
  }
  return out;
}
function renderRes(grid){
  const el=$("#resCanvas3");el.innerHTML="";
  const cols=grid.length;
  const cellPx=Math.round(160/cols);
  el.style.gridTemplateColumns="repeat("+cols+", "+cellPx+"px)";
  grid.forEach(row=>row.forEach(v=>{
    const d=document.createElement("div");
    d.className="res-cell"+(v?" on":"");
    d.style.width=cellPx+"px";d.style.height=cellPx+"px";
    el.appendChild(d);
  }));
}
const check3=makeChips($("#chips3"),[8,4,2,1],
  ()=>awardStar("d3","Same picture, four sizes, one honest counter. That climb is the whole cost of clarity."),
  r=>r+"×"+r+" — "+(r*r)+" bits");
const resolutions3=[8,4,2,1];
const resBtnEls={};
resolutions3.forEach(r=>{
  const b=document.createElement("button");
  b.type="button";b.className="action-btn";
  b.textContent=r+"×"+r;
  b.setAttribute("aria-pressed","false");
  b.addEventListener("click",()=>setResolution3(r,true));
  $("#resButtons3").appendChild(b);
  resBtnEls[r]=b;
});
function setResolution3(r,fromUser){
  resolutions3.forEach(k=>resBtnEls[k].setAttribute("aria-pressed",k===r?"true":"false"));
  renderRes(downsample(BASE3,r));
  $("#resLabel3").textContent=r+"×"+r;
  $("#resSize3").textContent=(r*r)+" bit"+(r*r===1?"":"s");
  if(fromUser)check3(r);
}
setResolution3(1,false);

/* ═══ D4: sample the wave ═══ */
function waveY(t){
  return 0.5+0.28*Math.sin(t*4*Math.PI)+0.08*Math.sin(t*11*Math.PI+1);
}
const smoothPts=[];
for(let i=0;i<=80;i++){
  const t=i/80;
  smoothPts.push((t*300).toFixed(1)+","+((1-waveY(t))*100).toFixed(1));
}
$("#smoothPoly").setAttribute("points",smoothPts.join(" "));

const N4=12;
const slotX=[],slotY=[],slotOn=[];
const wrap4=$("#waveWrap4");
for(let i=0;i<N4;i++){
  const t=i/(N4-1);
  const x=t*300, y=(1-waveY(t))*100;
  slotX.push(x);slotY.push(y);slotOn.push(false);
  const btn=document.createElement("button");
  btn.type="button";btn.className="sample-pt";
  btn.style.left=(x/300*100)+"%";
  btn.style.top=(y/110*100)+"%";
  btn.setAttribute("aria-pressed","false");
  btn.setAttribute("aria-label","sample point "+(i+1));
  const idx=i;
  btn.addEventListener("click",()=>{
    slotOn[idx]=!slotOn[idx];
    btn.setAttribute("aria-pressed",slotOn[idx]?"true":"false");
    updateSampled4();
  });
  wrap4.appendChild(btn);
}
const check4=makeChips($("#chips4"),["few","many"],
  ()=>awardStar("d4","You felt both ends: too few samples flattens the wiggle, plenty of samples keeps it faithful."),
  k=>({few:"a handful of samples — hear it get chunky",many:"nearly every sample — hear it smooth out"})[k]);
function updateSampled4(){
  const pts=[];
  for(let i=0;i<N4;i++)if(slotOn[i])pts.push(slotX[i].toFixed(1)+","+slotY[i].toFixed(1));
  $("#sampledPoly").setAttribute("points",pts.join(" "));
  const count=slotOn.filter(Boolean).length;
  $("#sampleCount4").textContent=count;
  if(count>=1&&count<=3)check4("few");
  if(count>=9)check4("many");
}

/* ═══ D5: the trade-off sentence ═══ */
function makeWordGroup(el,words,blankEl,onPick){
  words.forEach(w=>{
    const b=document.createElement("button");
    b.type="button";b.className="word-chip";
    b.textContent=w;
    b.setAttribute("aria-pressed","false");
    b.addEventListener("click",()=>{
      $$(".word-chip",el).forEach(o=>o.setAttribute("aria-pressed","false"));
      b.setAttribute("aria-pressed","true");
      blankEl.textContent=w;
      blankEl.classList.add("filled");
      onPick();
    });
    el.appendChild(b);
  });
}
let picked1=false,picked2=false;
makeWordGroup($("#group1"),["higher","better","clearer"],$("#blank1"),()=>{picked1=true;maybeFinish5();});
makeWordGroup($("#group2"),["bigger","larger","heavier"],$("#blank2"),()=>{picked2=true;maybeFinish5();});
function maybeFinish5(){
  if(picked1&&picked2){
    awardStar("d5","You said the whole trade-off in one sentence — every image or audio format ever invented is just clever tricks to soften exactly that sentence.");
  }
}
