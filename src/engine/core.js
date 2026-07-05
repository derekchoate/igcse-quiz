/* ================= engine core =================
   Shared runtime for every lesson: session state, DOM helpers, the toast/spark
   feedback, the star/award system, and auto-wiring of the collapsible discovery
   cards + nudge ladders. Concatenated ahead of the interaction kits and the
   lesson's module.js inside a single IIFE (see tools/build.mjs), so everything
   below is in scope for the kits and the lesson code. */

/* ---------- state (session only) ---------- */
const state = { stars:0, doneDiscoveries:{} };

/* ---------- helpers ---------- */
const $ = (s,el)=> (el||document).querySelector(s);
const $$ = (s,el)=> Array.from((el||document).querySelectorAll(s));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let toastTimer=null;
function toast(msg){
  const t=$("#toast");
  t.innerHTML=msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove("show"), 3400);
}

function sparks(x,y){
  if(reduceMotion) return;
  for(let i=0;i<7;i++){
    const s=document.createElement("span");
    s.className="spark"; s.textContent="✦";
    s.style.left=(x+(Math.random()*80-40))+"px";
    s.style.top=(y+(Math.random()*20-10))+"px";
    s.style.animationDelay=(Math.random()*0.25)+"s";
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),1800);
  }
}

function awardStar(discId, message){
  if(state.doneDiscoveries[discId]) return;
  state.doneDiscoveries[discId]=true;
  state.stars++;
  $("#starCount").textContent="✦ "+state.stars;
  const disc=$("#"+discId);
  disc.classList.add("done");
  const rect=disc.getBoundingClientRect();
  sparks(rect.left+rect.width/2, rect.top+60);
  toast('<span class="star">✦</span> '+message);
  // Reveal the reflection card once every discovery on the page is done.
  // (Derived from the real discovery count, not a hardcoded 5.)
  if(state.stars>=$$(".disc").length){
    $("#reflect").hidden=false;
  }
}

/* ---------- collapsible sections ---------- */
$$(".disc-head").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const disc=$("#"+btn.dataset.toggle);
    const open=disc.classList.toggle("open");
    btn.setAttribute("aria-expanded", open?"true":"false");
  });
});

/* ---------- nudges ---------- */
$$(".nudge-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    $("#"+btn.dataset.nudge).classList.add("shown");
    btn.style.display="none";
  });
});
