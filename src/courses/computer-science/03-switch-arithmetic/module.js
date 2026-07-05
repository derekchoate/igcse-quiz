  const W=[128,64,32,16,8,4,2,1];

  /* ---------- read-only bulb row (sum readouts) ---------- */
  function makeReadout(rowEl){
    const spans=W.map((v,i)=>{
      if(i===4){
        const brk=document.createElement("span");
        brk.className="row-break";brk.setAttribute("aria-hidden","true");
        rowEl.appendChild(brk);
      }
      const s=document.createElement("span");
      s.className="bit readonly";
      s.innerHTML='<span class="bulb"></span>';
      rowEl.appendChild(s);
      return s;
    });
    return {setBitsArr(arr){spans.forEach((s,i)=>s.classList.toggle("lit",!!arr[i]));}};
  }

  /* ---------- carry lane ---------- */
  function makeCarryLane(rowEl){
    const dots=W.map((v,i)=>{
      if(i===4){
        const brk=document.createElement("span");
        brk.className="row-break";brk.setAttribute("aria-hidden","true");
        rowEl.appendChild(brk);
      }
      const s=document.createElement("span");
      s.className="carry-slot";
      s.innerHTML='<span class="dot"></span>';
      rowEl.appendChild(s);
      return s;
    });
    let last=[0,0,0,0,0,0,0,0];
    return {
      set(carryOut,spill){
        dots.forEach((d,i)=>{
          const lit=!!carryOut[i];
          d.classList.toggle("lit",lit);
          if(lit&&!last[i]){
            const r=d.getBoundingClientRect();
            sparks(r.left+r.width/2,r.top);
          }
        });
        dots[0].classList.toggle("spill",!!spill);
        last=carryOut.slice();
      }
    };
  }

  /* ═══ D1: the four addition facts ═══ */
  const carryDot1=$("#carryDot1"),sumDot1=$("#sumDot1"),factExpr1=$("#factExpr1");
  const check1=makeChips($("#chips1"),[0,1,2,3],
    ()=>awardStar("d1","Four facts, fully lit. That spark is the seed of everything else today."),
    k=>["0 + 0","0 + 1","1 + 0","1 + 1"][k]);
  let a1=0,b1=0;
  let seeding1=true;
  function updateFact1(){
    const sum=a1+b1;
    const carry=sum>=2?1:0, s=sum%2;
    carryDot1.classList.toggle("on",!!carry);
    sumDot1.classList.toggle("on",!!s);
    factExpr1.textContent=a1+" + "+b1+" = "+(carry?"1":"")+s;
    if(!seeding1)check1(a1*2+b1);
  }
  $("#bitA1").innerHTML='<span class="bulb"></span><span class="bit-val">A</span>';
  $("#bitB1").innerHTML='<span class="bulb"></span><span class="bit-val">B</span>';
  $("#bitA1").setAttribute("aria-pressed","false");
  $("#bitB1").setAttribute("aria-pressed","false");
  $("#bitA1").addEventListener("click",()=>{
    a1=a1?0:1;$("#bitA1").setAttribute("aria-pressed",a1?"true":"false");updateFact1();
  });
  $("#bitB1").addEventListener("click",()=>{
    b1=b1?0:1;$("#bitB1").setAttribute("aria-pressed",b1?"true":"false");updateFact1();
  });
  updateFact1();
  seeding1=false;

  /* ═══ shared adder builder for D2 / D3 ═══ */
  function buildAdder(ids,onUpdate){
    const byteA=makeByte($("#"+ids.rowA),true,recalc);
    const byteB=makeByte($("#"+ids.rowB),true,recalc);
    const sumRow=makeReadout($("#"+ids.rowSum));
    const carryLane=makeCarryLane($("#"+ids.carry));
    function recalc(){
      const a=byteA.total(),b=byteB.total();
      const trueSum=a+b;
      const byteSum=trueSum&255;
      sumRow.setBitsArr(W.map(v=>(byteSum&v)?1:0));
      const bitsA=byteA.bitsArr(),bitsB=byteB.bitsArr();
      let carry=0;const carryOut=[0,0,0,0,0,0,0,0];
      for(let i=7;i>=0;i--){
        const s=bitsA[i]+bitsB[i]+carry;
        carry=s>=2?1:0;
        carryOut[i]=carry;
      }
      const spill=carryOut[0]===1;
      carryLane.set(carryOut,spill);
      onUpdate(a,b,trueSum,byteSum,spill);
    }
    recalc();
    return {byteA,byteB};
  }

  /* ═══ D2: carry chains (no overflow) ═══ */
  const check2=makeChips($("#chips2"),[50,128,199],
    ()=>awardStar("d2","Carry chains tamed. That ripple is literally how a processor adds."));
  buildAdder({rowA:"rowA2",rowB:"rowB2",rowSum:"rowSum2",carry:"carry2"},(a,b,trueSum,byteSum)=>{
    $("#totalA2").textContent=a;
    $("#totalB2").textContent=b;
    $("#totalSum2").textContent=byteSum;
    $("#cellSum2").classList.toggle("matched",[50,128,199].includes(trueSum));
    check2(trueSum);
  });

  /* ═══ D3: overflow ═══ */
  const check3=makeChips($("#chips3"),[256,300,510],
    ()=>awardStar("d3","Overflow, met and understood. Real chips hit this exact wall."),
    t=>"true total "+t);
  buildAdder({rowA:"rowA3",rowB:"rowB3",rowSum:"rowSum3",carry:"carry3"},(a,b,trueSum,byteSum,spill)=>{
    $("#totalA3").textContent=a;
    $("#totalB3").textContent=b;
    $("#totalSum3").textContent=byteSum;
    $("#cellSum3").classList.toggle("matched",spill);
    $("#overflowNote3").hidden=!spill;
    if(spill)$("#trueSum3").textContent=trueSum;
    check3(trueSum);
  });

  /* ═══ D4: shifting ═══ */
  const shiftLabels={doubleClean:"double a number cleanly",halveClean:"halve a number cleanly",loseLeft:"watch a bit vanish off the left",loseRight:"watch a bit vanish off the right"};
  const check4=makeChips($("#chips4"),["doubleClean","halveClean","loseLeft","loseRight"],
    ()=>awardStar("d4","The sliding trick is yours — doubling, halving, and the edge where bits vanish."),
    k=>shiftLabels[k]);
  const byte4=makeByte($("#row4"),true,api=>{$("#total4").textContent=api.total();});
  byte4.set(3);
  $("#shiftLeftBtn").addEventListener("click",()=>{
    const before=byte4.total();
    const lost=byte4.shiftLeft();
    if(lost)check4("loseLeft");
    else if(before>0)check4("doubleClean");
  });
  $("#shiftRightBtn").addEventListener("click",()=>{
    const before=byte4.total();
    const lost=byte4.shiftRight();
    if(lost)check4("loseRight");
    else if(before>0)check4("halveClean");
  });

  /* ═══ D5: two's complement ═══ */
  const negLabels={"-1":"−1","-19":"−19 (nineteen, flipped)","-128":"−128 (the odd one out)"};
  const check5=makeChips($("#chips5"),["-1","-19","-128"],
    ()=>awardStar("d5","Below zero, unlocked. You just did two's complement — for real."),
    k=>negLabels[k]);
  let lensOn=false;
  const byte5=makeByte($("#row5"),true,updateD5);
  function updateD5(){
    const unsigned=byte5.total();
    const signed=unsigned>=128?unsigned-256:unsigned;
    byte5.bits[0].querySelector(".bit-val").textContent=lensOn?"−128":"128";
    $("#total5").textContent=lensOn?signed:unsigned;
    $("#cellTotal5").classList.toggle("matched",lensOn&&["-1","-19","-128"].includes(String(signed)));
    if(lensOn)check5(String(signed));
  }
  $("#flipBtn").addEventListener("click",()=>byte5.flip());
  $("#addOneBtn").addEventListener("click",()=>byte5.addOne());
  $("#lensBtn").addEventListener("click",()=>{
    lensOn=!lensOn;
    $("#lensBtn").setAttribute("aria-pressed",lensOn?"true":"false");
    $("#lensNote5").hidden=!lensOn;
    updateD5();
  });
  byte5.set(19);
