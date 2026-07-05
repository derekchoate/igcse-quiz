/* ================= Module 1 — The Secret Language =================
   Composes the board + chips kits across five discoveries, plus the bespoke
   decode signature. Runs inside the shared engine IIFE, so $, makeBoard,
   makeChips, awardStar and toast are all in scope. */

/* ══════════ Discovery 1: one switch ══════════ */
let flips=0;
makeBoard($("#row1"), [1], ()=>{
  flips++;
  if(flips===3){
    $("#d1msg").innerHTML="That's the entire alphabet learned already. <b>On, off. 1, 0.</b> What could <i>two</i> switches say…?";
    awardStar("d1","First discovery made. The rest is just this, doubled.");
  }
});

/* ══════════ Discovery 2: two switches ══════════ */
const check2 = makeChips($("#chips2"), [1,2,3,0].sort((a,b)=>a-b), $("#total2"),
  ()=> awardStar("d2","Two switches, four numbers — you found them all."));
makeBoard($("#row2"), [2,1], t=>check2(t));
/* 0 is found naturally: switch something on, then off again */

/* ══════════ Discovery 3: four switches ══════════ */
const check3 = makeChips($("#chips3"), [5,10,13,15], $("#total3"),
  ()=> awardStar("d3","The doubling trick is yours now. It never gets harder than this."));
makeBoard($("#row3"), [8,4,2,1], t=>check3(t));

/* ══════════ Discovery 4: a full byte ══════════ */
const check4 = makeChips($("#chips4"), [19,42,100,255], $("#total4"),
  ()=> awardStar("d4","A whole byte, mastered. 255 lit up means every switch is on — the biggest a byte can say."));
makeBoard($("#row4"), [128,64,32,16,8,4,2,1], t=>check4(t));

/* ══════════ Discovery 5: decode YOU ══════════ */
const alpha=$("#alpha");
alpha.innerHTML = Array.from({length:26},(_,i)=>
  "<b>"+String.fromCharCode(65+i)+"</b>="+(i+1)).join(" &nbsp; ");

const word=[
  {letter:"Y", value:25},
  {letter:"O", value:15},
  {letter:"U", value:21}
];
const values8=[128,64,32,16,8,4,2,1];
const solved=[false,false,false];
const board=$("#decodeBoard");

word.forEach((w,idx)=>{
  const row=document.createElement("div");
  row.className="decode-row";
  const bulbs=values8.map(v=>{
    const lit = (w.value & v) ? " on" : "";
    return '<span class="mini'+lit+'" title="'+v+'"></span>';
  }).join("");
  row.innerHTML =
    '<span class="mini-bulbs">'+bulbs+'</span>'+
    '<span class="decode-val">= ?</span>';
  const sel=document.createElement("select");
  sel.className="letter-pick";
  sel.setAttribute("aria-label","letter for row "+(idx+1));
  sel.innerHTML='<option value="">letter…</option>'+
    Array.from({length:26},(_,i)=>{
      const L=String.fromCharCode(65+i);
      return '<option value="'+L+'">'+L+" ("+(i+1)+")</option>";
    }).join("");
  sel.addEventListener("change", ()=>{
    if(!sel.value) return;
    if(sel.value===w.letter){
      solved[idx]=true;
      sel.classList.add("locked");
      $(".decode-val",row).textContent="= "+w.value;
      renderWord();
      if(solved.every(Boolean)){
        $("#decodeNote").classList.add("shown");
        awardStar("d5","You decoded a real binary message. Welcome to the club.");
      }
    }else{
      const picked=sel.value.charCodeAt(0)-64;
      toast(sel.value+" is number "+picked+" — this row's lit bulbs add to something else. The chart's right there, no hurry.");
      sel.value="";
    }
  });
  row.appendChild(sel);
  board.appendChild(row);
});

function renderWord(){
  $("#decodedWord").textContent =
    word.map((w,i)=> solved[i]?w.letter:"·").join(" ");
}
