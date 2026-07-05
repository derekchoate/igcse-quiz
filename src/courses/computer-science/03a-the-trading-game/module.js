/* ================= Module 3a — The Trading Game =================
   A side room off Module 3. Uses the shared `trader` kit for its signature
   trading machine (makeTrader) plus a lesson-local chip factory. Runs inside the
   shared engine IIFE, so $, $$, reduceMotion, toast, sparks and awardStar are all
   already in scope. */

/* ═══ D1: a pile you can't read ═══ */
const PILE_N=37;
// hand-placed scatter (percent coords) — deterministic so the pile is calm, not jittery
const SCATTER=[
  [7,14],[19,6],[31,18],[44,9],[57,15],[70,7],[83,13],[90,24],[12,29],[25,25],
  [38,31],[52,24],[64,29],[78,27],[5,44],[17,41],[30,46],[43,40],[56,44],[69,41],
  [82,45],[91,52],[10,58],[23,56],[36,61],[49,55],[62,60],[75,57],[87,66],[15,72],
  [28,74],[41,70],[54,75],[67,72],[80,78],[46,85],[33,88]
];
const pileEl=$("#pile1");
const pileDots=SCATTER.map(([x,y])=>{
  const d=document.createElement("span");d.className="pile-dot";
  d.style.left=x+"%";d.style.top=y+"%";
  pileEl.appendChild(d);return d;
});
let grouped=false;
$("#groupBtn").addEventListener("click",()=>{
  grouped=!grouped;
  $("#groupBtn").setAttribute("aria-pressed",grouped?"true":"false");
  $("#groupBtn").textContent=grouped?"back to the pile":"line them up in tens";
  pileDots.forEach((d,i)=>{
    if(grouped){
      const row=Math.floor(i/10),col=i%10;
      d.style.left=(col*8.6+6)+"%";d.style.top=(row*22+8)+"%";
    }else{
      d.style.left=SCATTER[i][0]+"%";d.style.top=SCATTER[i][1]+"%";
    }
  });
  $("#pileCap1").innerHTML=grouped
    ?"three full rows and seven spare: <b>37</b>, at a glance"
    :"a pile of… some?";
  if(grouped)awardStar("d1","First star: numbers exist because eyes can't read piles. Groups fix that.");
});

/* ═══ D2: the ten-trade ═══ */
const check2=makeChips($("#chips2"),[10,23,42],
  ()=>awardStar("d2","The ten-trade is yours. You've run this machine since you were small — now you've seen its gears."),
  t=>String(t),
  (label,remaining)=>"Lovely — that one's lit. "+remaining+" more if you fancy it.");
let seeding2=true;
const trader2=makeTrader({
  root:"machine2",rule:10,cups:3,readsEl:"reads2",sumEl:"sums2",
  onChange(total){if(!seeding2)check2(total);}
});
seeding2=false;
$("#drop2").addEventListener("click",()=>trader2.drop());
$("#hand2").addEventListener("click",()=>{for(let i=0;i<5;i++)trader2.drop();});
$("#take2").addEventListener("click",()=>trader2.take());

/* ═══ D3: open a bag ═══ */
const CHIP3_LABELS={ten:"open a bag of ten",hundred:"unpack a hundred, all the way",ninety:"spill the nine bags"};
const check3=makeChips($("#chips3"),["ten","hundred","ninety"],
  ()=>awardStar("d3","Bags opened. A digit was never a mystery — it's a count of bags, nothing more."),
  k=>CHIP3_LABELS[k],
  (label,remaining)=>"Lovely — that one's lit. "+remaining+" more if you fancy it.");

function beanGrid(n,small){
  const g=document.createElement("div");g.className="bean-grid";
  for(let i=0;i<n;i++){
    const t=document.createElement("span");t.className="tok";
    if(small)t.style.width=t.style.height="6px";
    g.appendChild(t);
  }
  return g;
}

// bench 1: the bag of ten
$("#bagTenBtn").addEventListener("click",()=>{
  const out=$("#benchTenOut");out.innerHTML="";
  out.appendChild(beanGrid(10));
  $("#benchTenCap").hidden=false;
  $("#benchTenReset").hidden=false;
  check3("ten");
});
$("#benchTenReset").addEventListener("click",()=>{
  $("#benchTenOut").innerHTML='<button class="bag" id="bagTenBtn2" type="button" aria-label="open the bag of ten">10</button>';
  $("#benchTenCap").hidden=true;$("#benchTenReset").hidden=true;
  $("#bagTenBtn2").addEventListener("click",()=>{
    const out=$("#benchTenOut");out.innerHTML="";
    out.appendChild(beanGrid(10));
    $("#benchTenCap").hidden=false;$("#benchTenReset").hidden=false;
  });
});

// bench 2: the bag of a hundred, two-stage
function hundredStageOne(){
  const out=$("#benchHunOut");out.innerHTML="";
  for(let i=0;i<10;i++){
    const b=document.createElement("span");b.className="bag small";b.textContent="10";
    out.appendChild(b);
  }
  $("#benchHunCap").hidden=false;
  $("#benchHunCap").innerHTML="Inside: <b>ten bags of ten</b>. Keep going —";
  $("#bagHundredMore").hidden=false;
}
$("#bagHundredBtn").addEventListener("click",hundredStageOne);
$("#bagHundredMore").addEventListener("click",()=>{
  const out=$("#benchHunOut");out.innerHTML="";
  out.appendChild(beanGrid(100,true));
  $("#benchHunCap").innerHTML="Ten bags of ten: <b>100 beans</b>. The third cup's value wasn't chosen — it's just ten tens. The trading rule built it.";
  $("#bagHundredMore").hidden=true;
  $("#benchHunReset").hidden=false;
  check3("hundred");
});
$("#benchHunReset").addEventListener("click",()=>{
  const out=$("#benchHunOut");
  out.innerHTML='<button class="bag" type="button" aria-label="open the bag of one hundred">100</button>';
  $("button",out).addEventListener("click",hundredStageOne);
  $("#benchHunCap").hidden=true;$("#benchHunReset").hidden=true;
});

// bench 3: nine bags spilled
function spillBags(){
  const out=$("#benchSpillOut");out.innerHTML="";
  for(let i=0;i<9;i++){
    const b=document.createElement("span");b.className="bag small";b.textContent="10";
    out.appendChild(b);
  }
}
spillBags();
$("#spillBtn").addEventListener("click",()=>{
  const out=$("#benchSpillOut");out.innerHTML="";
  out.appendChild(beanGrid(90,true));
  $("#benchSpillCap").hidden=false;
  $("#spillBtn").hidden=true;
  $("#benchSpillReset").hidden=false;
  check3("ninety");
});
$("#benchSpillReset").addEventListener("click",()=>{
  spillBags();
  $("#benchSpillCap").hidden=true;
  $("#benchSpillReset").hidden=true;
  $("#spillBtn").hidden=false;
});

/* ═══ D4: trade at two ═══ */
const CHIP4_LABELS={5:"get to 5 beans",19:"get to 19 (yes, that 19)",four:"open the 4-bag"};
const check4=makeChips($("#chips4"),[5,19,"four"],
  ()=>awardStar("d4","There it is: 1, 2, 4, 8, 16 — made in front of you, not memorised."),
  k=>CHIP4_LABELS[k],
  (label,remaining)=>"Lovely — that one's lit. "+remaining+" more if you fancy it.");
let seeding4=true;
const trader4=makeTrader({
  root:"machine4",rule:2,cups:5,hideValues:true,readsEl:"reads4",sumEl:"sums4",
  onChange(total){
    $("#total4").textContent=total;
    if(!seeding4)check4(total);
  }
});
seeding4=false;
$("#drop4").addEventListener("click",()=>trader4.drop());
$("#hand4").addEventListener("click",()=>{for(let i=0;i<5;i++)trader4.drop();});
$("#take4").addEventListener("click",()=>trader4.take());

// the 4-bag bench, two-stage
function fourStageOne(){
  const out=$("#benchFourOut");out.innerHTML="";
  for(let i=0;i<2;i++){
    const b=document.createElement("span");b.className="bag small";b.textContent="2";
    out.appendChild(b);
  }
  $("#benchFourCap").hidden=false;
  $("#benchFourCap").innerHTML="Inside: <b>two bags of two</b>. One more layer —";
  $("#fourBagMore").hidden=false;
}
$("#fourBagBtn").addEventListener("click",fourStageOne);
$("#fourBagMore").addEventListener("click",()=>{
  const out=$("#benchFourOut");out.innerHTML="";
  out.appendChild(beanGrid(4));
  $("#benchFourCap").innerHTML="Two twos: <b>2 × 2 = 4</b>. That is the whole answer. The third cup is worth 4 because its bag holds two bags of two — the doubling isn't a rule anyone made, it's the two-trade caught in the act. (A bag from the next cup? Two fours. And on it goes.)";
  $("#fourBagMore").hidden=true;
  $("#benchFourReset").hidden=false;
  check4("four");
});
$("#benchFourReset").addEventListener("click",()=>{
  const out=$("#benchFourOut");
  out.innerHTML='<button class="bag" type="button" aria-label="open the bag of four">4</button>';
  $("button",out).addEventListener("click",fourStageOne);
  $("#benchFourCap").hidden=true;$("#benchFourReset").hidden=true;
});

/* ═══ D5: same game, every costume ═══ */
const CHIP5_LABELS={r2:"19 under the two-rule: 10011",r10:"19 under the ten-rule: 19",r16:"19 under the sixteen-rule: 13"};
const check5=makeChips($("#chips5"),["r2","r10","r16"],
  ()=>awardStar("d5","Three costumes, one game. That's the entire secret of number systems — all of them."),
  k=>CHIP5_LABELS[k],
  (label,remaining)=>"Lovely — that one's lit. "+remaining+" more if you fancy it.");
const CUPS_FOR_RULE={2:5,10:2,16:2};
let rule5=10,seeding5=true;
const trader5=makeTrader({
  root:"machine5",rule:10,cups:2,maxPile:31,readsEl:"reads5",sumEl:"sums5",
  onChange(total){
    $("#total5").textContent=total;
    if(!seeding5&&total===19)check5("r"+rule5);
  }
});
trader5.setTotal(19);
seeding5=false;
function setRule5(r){
  rule5=r;
  [["#ruleBtn2",2],["#ruleBtn10",10],["#ruleBtn16",16]].forEach(([sel,v])=>{
    $(sel).setAttribute("aria-pressed",v===r?"true":"false");
  });
  $("#hexNote5").hidden=r!==16;
  trader5.setRule(r,CUPS_FOR_RULE[r]);
}
$("#ruleBtn2").addEventListener("click",()=>setRule5(2));
$("#ruleBtn10").addEventListener("click",()=>setRule5(10));
$("#ruleBtn16").addEventListener("click",()=>setRule5(16));
$("#drop5").addEventListener("click",()=>trader5.drop());
$("#take5").addEventListener("click",()=>trader5.take());
