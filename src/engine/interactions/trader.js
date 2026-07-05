/* ================= kit: trader =================
   A place-value trading machine. Cups hold tokens; a cup reaching `rule`
   immediately trades one bundle upward, so an "illegal" state — and therefore a
   wrong answer — can't exist. Runs inside the shared engine IIFE, so $, $$,
   reduceMotion, toast and sparks are already in scope.

   makeTrader(cfg) — cfg keys:
     root       id of the container element the cups are drawn into
     rule       trade base (10 = decimal, 2 = binary, 16 = hex, …)
     cups       number of cups
     hideValues start each cup's plaque hidden, revealing it on first use
     maxPile    optional cap on the running total
     readsEl    id of an element to write the digit read-out into
     sumEl      id of an element to write the sum line into
     onChange   callback(total, readDigits) fired after every change

   api: drop(), take(), total(), setRule(rule, cups), setTotal(n), readDigits(). */

const DIGITS="0123456789ABCDEF";

// counts[i] = tokens in the cup worth rule^i (index 0 = rightmost cup on screen).
// The machine enforces its own rule: a cup reaching `rule` immediately trades
// upward — so an "illegal" state can't exist, and neither can a wrong answer.
function makeTrader(cfg){
  const root=$("#"+cfg.root);
  let rule=cfg.rule,nCups=cfg.cups;
  let counts=new Array(nCups).fill(0);
  let revealed=null;
  let cupEls=[];
  const cupValue=i=>Math.pow(rule,i);
  const maxTotal=()=>Math.pow(rule,nCups)-1;

  function plaqueText(i){return i===0?"beans · worth 1":"bags of "+cupValue(i);}

  function build(){
    root.innerHTML="";cupEls=[];
    revealed=cfg.hideValues?counts.map(c=>c>0):null;
    for(let i=nCups-1;i>=0;i--){
      const c=document.createElement("div");c.className="cup";
      c.innerHTML='<div class="cup-plaque"></div><div class="cup-tokens"></div><div class="cup-digit">0</div><div class="cup-sub"></div>';
      root.appendChild(c);cupEls[i]=c;
    }
    render([]);
  }

  function flyTrade(fromIdx,toIdx,delay){
    if(reduceMotion)return;
    const a=$(".cup-tokens",cupEls[fromIdx]).getBoundingClientRect();
    const b=$(".cup-tokens",cupEls[toIdx]).getBoundingClientRect();
    const fly=document.createElement("span");
    fly.className="trade-fly";
    fly.style.left=(a.left+a.width/2-6)+"px";
    fly.style.top=(a.top+a.height/2-6)+"px";
    document.body.appendChild(fly);
    setTimeout(()=>{
      fly.style.opacity="1";
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        fly.style.transform="translate("+(b.left-a.left)+"px,"+(b.top-a.top)+"px)";
      }));
      setTimeout(()=>{
        fly.style.opacity="0";
        cupEls[toIdx].classList.add("got");
        setTimeout(()=>cupEls[toIdx].classList.remove("got"),450);
      },420);
    },delay);
    setTimeout(()=>fly.remove(),delay+900);
  }

  function render(trades){
    counts.forEach((n,i)=>{
      const cup=cupEls[i];
      const plaque=$(".cup-plaque",cup);
      if(cfg.hideValues&&!revealed[i]&&n>0)  {
        revealed[i]=true;
        plaque.classList.add("reveal");
      }
      const hidden=cfg.hideValues&&!revealed[i];
      plaque.textContent=hidden?"?":plaqueText(i);
      const tokens=$(".cup-tokens",cup);
      tokens.innerHTML="";
      for(let k=0;k<n;k++){
        const t=document.createElement("span");t.className="tok";tokens.appendChild(t);
      }
      $(".cup-digit",cup).textContent=DIGITS[n];
      $(".cup-sub",cup).textContent=hidden?"—":(n>0?n+" × "+cupValue(i)+" = "+(n*cupValue(i)):"—");
    });
    (trades||[]).forEach((fromIdx,k)=>flyTrade(fromIdx,fromIdx+1,k*160));
    if(cfg.readsEl)$("#"+cfg.readsEl).textContent=readDigits();
    if(cfg.sumEl)$("#"+cfg.sumEl).textContent=sumLine();
    if(cfg.onChange)cfg.onChange(total(),readDigits());
  }

  function total(){return counts.reduce((s,n,i)=>s+n*cupValue(i),0);}
  function readDigits(){
    let top=nCups-1;
    while(top>0&&counts[top]===0)top--;
    let out="";
    for(let i=top;i>=0;i--)out+=DIGITS[counts[i]];
    return out;
  }
  function sumLine(){
    const parts=[];
    for(let i=nCups-1;i>=0;i--)if(counts[i]>0)parts.push(counts[i]*cupValue(i));
    if(!parts.length)return "no beans yet";
    if(parts.length===1)return "that's "+parts[0];
    return parts.join(" + ")+" = "+total();
  }

  function drop(){
    const cap=cfg.maxPile?Math.min(cfg.maxPile,maxTotal()):maxTotal();
    if(total()>=cap){
      toast("The pile stops at "+cap+" in this room — plenty for the game.");
      return;
    }
    counts[0]++;
    let i=0;const trades=[];
    while(i<nCups-1&&counts[i]>=rule){
      counts[i]-=rule;counts[i+1]++;trades.push(i);i++;
    }
    render(trades);
  }
  function take(){
    if(total()===0)return;
    // borrowing in reverse: un-bag downward until there's a loose bean to remove
    let i=0;
    while(counts[i]===0)i++;
    while(i>0){counts[i]--;counts[i-1]+=rule;i--;}
    counts[0]--;
    render([]);
  }
  function setRule(newRule,newCups){
    const t=total();
    rule=newRule;nCups=newCups;
    counts=new Array(nCups).fill(0);
    let rem=t;
    for(let i=nCups-1;i>=0;i--){
      counts[i]=Math.floor(rem/Math.pow(rule,i));
      rem-=counts[i]*Math.pow(rule,i);
    }
    build();
  }
  function setTotal(n){
    let rem=n;
    for(let i=nCups-1;i>=0;i--){
      counts[i]=Math.floor(rem/Math.pow(rule,i));
      rem-=counts[i]*Math.pow(rule,i);
    }
    build();
  }
  build();
  return {drop,take,total,setRule,setTotal,readDigits};
}
