/* ================= Module 4 — Letters in the Wire =================
   Runs inside the shared engine IIFE, so $, $$, sparks, toast and awardStar
   are all in scope. The byte board comes from the shared byte kit (makeByte);
   this lesson keeps its own richer makeChips variant with formatFn labels, plus
   W below for the mini-bulb rows in the encode/decode signature interaction. */

const W=[128,64,32,16,8,4,2,1];

function charOf(v){return (v>=32&&v<=126)?String.fromCharCode(v):"·";}

/* ═══ D1: two rival codebooks ═══ */
function cardA(v){return (v>=65&&v<=90)?String.fromCharCode(v):"·";}
function cardB(v){return (v>=65&&v<=90)?String.fromCharCode(155-v):"·";}
const seen1=new Set();
const check1=makeChips($("#chips1"),[1,2,3],
  ()=>awardStar("d1","Three bytes, six readings between two tables that never agreed. That's the whole reason ASCII exists."),
  n=>["one letter, two readings","two — and they still disagree","three: you've got the idea"][n-1]);
let seeding1=true;
const byte1=makeByte($("#row1"),true,api=>{
  const v=api.total();
  $("#cardA1").textContent=cardA(v);
  $("#cardB1").textContent=cardB(v);
  if(!seeding1&&v>=65&&v<=90&&!seen1.has(v)){
    seen1.add(v);
    check1(seen1.size);
  }
});
byte1.set(72);
seeding1=false;

/* ═══ D2: the ASCII neighbourhood ═══ */
function neighbourhoodOf(v){
  if(v>=48&&v<=57)return "digits";
  if(v>=65&&v<=90)return "capitals";
  if(v>=97&&v<=122)return "lowercase";
  if(v===32)return "space";
  return "punctuation / other";
}
const check2=makeChips($("#chips2"),["digit","capital","lower"],
  ()=>awardStar("d2","Three neighbourhoods mapped. You can now guess a byte's kind before you decode it."),
  k=>({digit:"digits' street (48–57)",capital:"capitals' street (65–90)",lower:"lowercase's street (97–122)"})[k]);
const byte2=makeByte($("#row2"),true,api=>{
  const v=api.total();
  $("#char2").textContent=charOf(v);
  $("#hood2 b").textContent=neighbourhoodOf(v);
  $("#asciiMarker").style.left=(v/255*100)+"%";
  if(v>=48&&v<=57)check2("digit");
  if(v>=65&&v<=90)check2("capital");
  if(v>=97&&v<=122)check2("lower");
});
byte2.set(0);

/* ═══ D3: the case bit ═══ */
const flipped3=new Set();
let prev3=65;
const check3=makeChips($("#chips3"),["down","up","again"],
  ()=>awardStar("d3","One bulb, both cases, on more than one letter. That's the case bit, permanently yours."),
  k=>({down:"capital → lowercase, one bulb",up:"lowercase → capital, one bulb",again:"do it again on a different letter"})[k]);
const byte3=makeByte($("#row3"),true,api=>{
  const v=api.total();
  $("#char3").textContent=charOf(v);
  if(prev3>=65&&prev3<=90&&v===prev3+32){
    check3("down");
    flipped3.add(String.fromCharCode(prev3));
  }
  if(prev3>=97&&prev3<=122&&v===prev3-32){
    check3("up");
    flipped3.add(String.fromCharCode(v));
  }
  if(flipped3.size>=2)check3("again");
  prev3=v;
});
byte3.set(65);
byte3.bits[2].classList.add("case-bulb");

/* ═══ D4: 128 isn't enough ═══ */
const check4=makeChips($("#chips4"),["fits","overflows"],
  ()=>awardStar("d4","Both sides of the wall found. Unicode isn't magic — it's just more bytes per character."),
  k=>({fits:"a character ASCII handles just fine",overflows:"a character that breaks ASCII"})[k]);
function updateD4(){
  const raw=$("#d4input").value;
  const ch=Array.from(raw)[0]||"";
  if(!ch){
    $("#d4char").textContent="·";$("#d4code").textContent="—";
    $("#d4verdict").textContent="";$("#d4cell").classList.remove("matched");
    return;
  }
  const code=ch.codePointAt(0);
  $("#d4char").textContent=ch;
  $("#d4code").textContent=code;
  const fits=code<=127;
  $("#d4verdict").textContent=fits?"Fits in one ASCII byte, no trouble at all.":"Too big — ASCII has nothing this high. This is what Unicode is for.";
  $("#d4cell").classList.toggle("matched",fits);
  check4(fits?"fits":"overflows");
}
$("#d4input").addEventListener("input",updateD4);
$("#fillAccent").addEventListener("click",()=>{$("#d4input").value="é";updateD4();});
$("#fillHan").addEventListener("click",()=>{$("#d4input").value="中";updateD4();});

/* ═══ D5: encode + decode ═══ */
function renderEncode(word){
  const row=$("#encodeRow");row.innerHTML="";
  Array.from(word).slice(0,12).forEach(ch=>{
    const code=ch.codePointAt(0);
    const col=document.createElement("div");
    col.className="encode-col";
    const shown=ch===" "?"·":ch;
    if(code<=255){
      const bulbs=W.map(v=>'<span class="mini small'+((code&v)?" on":"")+'"></span>').join("");
      col.innerHTML='<span class="encode-char">'+shown+'</span><span class="mini-bulbs">'+bulbs+'</span><span class="encode-code">'+code+'</span>';
    }else{
      col.innerHTML='<span class="encode-char">'+shown+'</span><span class="encode-toobig">too big for one byte — needs more</span><span class="encode-code">'+code+'</span>';
    }
    row.appendChild(col);
  });
}
$("#encodeInput").addEventListener("input",e=>renderEncode(e.target.value));

const alpha=$("#alpha");
alpha.innerHTML=Array.from({length:26},(_,i)=>"<b>"+String.fromCharCode(65+i)+"</b>="+(65+i)).join(" &nbsp; ");

const word5=[
  {letter:"S",value:83},
  {letter:"H",value:72},
  {letter:"A",value:65},
  {letter:"R",value:82},
  {letter:"P",value:80}
];
const solved5=word5.map(()=>false);
const board5=$("#decodeBoard");
word5.forEach((w,idx)=>{
  const row=document.createElement("div");
  row.className="decode-row";
  const bulbs=W.map(v=>'<span class="mini'+((w.value&v)?" on":"")+'" title="'+v+'"></span>').join("");
  row.innerHTML='<span class="mini-bulbs">'+bulbs+'</span><span class="decode-val">= ?</span>';
  const sel=document.createElement("select");
  sel.className="letter-pick";
  sel.setAttribute("aria-label","letter for row "+(idx+1));
  sel.innerHTML='<option value="">letter…</option>'+
    Array.from({length:26},(_,i)=>{
      const L=String.fromCharCode(65+i);
      return '<option value="'+L+'">'+L+" ("+(65+i)+")</option>";
    }).join("");
  sel.addEventListener("change",()=>{
    if(!sel.value)return;
    if(sel.value===w.letter){
      solved5[idx]=true;
      sel.classList.add("locked");
      $(".decode-val",row).textContent="= "+w.value;
      renderWord5();
      if(solved5.every(Boolean)){
        $("#decodeNote").classList.add("shown");
        awardStar("d5","You wrote a word out and read one back. The wire runs both ways now.");
      }
    }else{
      const picked=sel.value.charCodeAt(0);
      toast(sel.value+" is number "+picked+" — this row's lit bulbs add to something else. The chart's right there, no hurry.");
      sel.value="";
    }
  });
  row.appendChild(sel);
  board5.appendChild(row);
});
function renderWord5(){
  $("#decodedWord").textContent=word5.map((w,i)=>solved5[i]?w.letter:"·").join(" ");
}
