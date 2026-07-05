/* ================= Module 2 — Sixteen Symbols =================
   Hexadecimal as a shorthand for binary. A bespoke byte-board factory
   (makeByte — fixed 8-bit weights, optional nibble gap/labels, hex/nibble
   readouts) and a formatFn-aware makeChips drive five discoveries plus the
   RGB colour-mixer signature. Runs inside the shared engine IIFE, so $, $$,
   awardStar, toast and sparks are all in scope. */

const HEX="0123456789ABCDEF";

/* ═══ D1: shuffle & squint ═══ */
let shuffles=0;
const byte1=makeByte($("#row1"),{gap:false,labels:false},api=>{
  $("#bin1").textContent=api.bin();
});
$("#shuffleBtn").addEventListener("click",()=>{
  byte1.set(Math.floor(Math.random()*256));
  shuffles++;
  if(shuffles===3){
    $("#d1msg").innerHTML="Hard, isn't it? <b>That struggle is the reason this module exists.</b> The fix is two moves away.";
    awardStar("d1","Problem properly felt. That's where every good invention starts.");
  }
});

/* ═══ D2: nibbles ═══ */
const targets2=["L12","R5","L3R14"];
const labels2={L12:"high says 12",R5:"low says 5",L3R14:"high 3 AND low 14"};
const check2=makeChips($("#chips2"),targets2,
  ()=>awardStar("d2","Nibbles conquered. Each half is just Module 1 wearing a smaller coat."),
  t=>labels2[t]);
const byte2=makeByte($("#row2"),{gap:true,labels:true},api=>{
  const[hi,lo]=api.nibbles();
  $("#left2 b").textContent=hi;$("#right2 b").textContent=lo;
  $("#left2").classList.toggle("matched",hi===12||hi===3);
  $("#right2").classList.toggle("matched",lo===5||lo===14);
  if(hi===12)check2("L12");
  if(lo===5)check2("R5");
  if(hi===3&&lo===14)check2("L3R14");
});

/* ═══ D3: symbols ═══ */
$("#symTable").innerHTML=Array.from({length:16},(_,i)=>
  '<div class="sym"><div class="s-hex">'+HEX[i]+'</div><div class="s-den">'+i+'</div></div>').join("");
const check3=makeChips($("#chips3"),["2A","FF","C3"],
  ()=>awardStar("d3","Three hex bytes read and written. The letters hold no fear now."));
const byte3=makeByte($("#row3"),{gap:true,labels:true},api=>{
  const h=api.hex();
  $("#hex3 b").textContent=h;
  $("#hex3").classList.toggle("matched",["2A","FF","C3"].includes(h));
  check3(h);
});

/* ═══ D4: colour mixer ═══ */
const colourTargets=["FF0000","00FF00","FFFF00","FFFFFF"];
const colourNames={FF0000:"pure red #FF0000","00FF00":"pure green #00FF00",FFFF00:"yellow #FFFF00",FFFFFF:"white #FFFFFF"};
const check4=makeChips($("#chips4"),colourTargets,
  ()=>awardStar("d4","A palette of your own. Light mixes differently to paint — and now you know."),
  t=>colourNames[t]);
function paint(){
  const hexStr=byteR.hex()+byteG.hex()+byteB.hex();
  $("#swatchHex").textContent="#"+hexStr;
  $("#swatch").style.background="#"+hexStr;
  $("#swatch").style.boxShadow="0 0 34px #"+hexStr+"55";
  check4(hexStr);
}
const byteR=makeByte($("#rowR"),{gap:true,labels:false},paint);
const byteG=makeByte($("#rowG"),{gap:true,labels:false},paint);
const byteB=makeByte($("#rowB"),{gap:true,labels:false},paint);

/* ═══ D5: read the wild ═══ */
const check5=makeChips($("#chips5"),["4D","A7"],
  ()=>awardStar("d5","You just read a real device address. Hex is officially yours."),
  t=>"match "+t);
const byte5=makeByte($("#row5"),{gap:true,labels:true},api=>{
  const h=api.hex();
  $("#hex5 b").textContent=h;
  $("#hex5").classList.toggle("matched",["4D","A7"].includes(h));
  check5(h);
});
