/* ================= kit: walk =================
   The reusable flowchart family: a shared shape builder plus an SVG
   click-to-step walk engine. Runs inside the shared engine IIFE, so
   $, $$, reduceMotion, sparks, toast and awardStar are all in scope.

   makeWalk(mountId, chart, opts)
     chart — {nodes, svg, start, badge, anchors, flow, init}
     opts  — {onFinish(state)}

   buildShape(node)  → a single flowchart shape element (start/stop, process,
                       input/output, decision, flow line).
   KIND_LABEL        → shape-kind → accessible label map.
   ARROW_DEFS        → shared <defs> markup (arrowheads) for the SVG charts. */

  /* ═══ shared shape builder ═══ */
  const KIND_LABEL={term:"start / stop",proc:"process",io:"input / output",dec:"decision",flow:"flow line"};
  function buildShape(node){
    const el=document.createElement("div");
    el.className="fc-node fc-"+node.kind;
    if(node.kind==="flow"){
      el.textContent="▼";
    }else{
      const t=document.createElement("span");
      t.className="fc-txt";t.textContent=node.text;
      el.appendChild(t);
    }
    el.setAttribute("role","img");
    el.setAttribute("aria-label",KIND_LABEL[node.kind]+(node.text?": "+node.text:""));
    return el;
  }

  /* ═══ shared flowchart walk engine (SVG, click-to-step) ═══ */
  function makeWalk(mountId,chart,opts){
    opts=opts||{};
    const mount=$("#"+mountId);mount.innerHTML="";

    // top bar: hint + start-over
    const bar=document.createElement("div");bar.className="fc-bar";
    const hint=document.createElement("span");hint.className="fc-hint";
    const resetBtn=document.createElement("button");
    resetBtn.type="button";resetBtn.className="fc-btn ghost fc-reset";resetBtn.textContent="↺ Start over";
    bar.appendChild(hint);bar.appendChild(resetBtn);
    mount.appendChild(bar);

    // input row (appears at the top when the chart asks for a number)
    const inputs=document.createElement("div");inputs.className="fc-inputs";inputs.style.display="none";
    mount.appendChild(inputs);

    // the diagram itself is the step control
    const svgBtn=document.createElement("button");
    svgBtn.type="button";svgBtn.className="fc-svg-wrap";
    svgBtn.setAttribute("aria-label","Flowchart — activate to move the token one step");
    svgBtn.innerHTML=chart.svg;
    const svg=svgBtn.querySelector("svg");
    mount.appendChild(svgBtn);

    // live-value badge that rides next to the token, inside the chart
    const NS="http://www.w3.org/2000/svg";
    const badge=document.createElementNS(NS,"g");badge.setAttribute("class","fc-badge");
    const badgeBg=document.createElementNS(NS,"rect");
    badgeBg.setAttribute("rx","10.5");badgeBg.setAttribute("height","21");badgeBg.setAttribute("y","-10.5");
    const badgeTx=document.createElementNS(NS,"text");badgeTx.setAttribute("x","0");badgeTx.setAttribute("y","0");
    badge.appendChild(badgeBg);badge.appendChild(badgeTx);
    badge.style.display="none";
    svg.appendChild(badge);

    // a dot that flows along the connector as the token moves (calm; off under reduced-motion)
    const flowPath=document.createElementNS(NS,"path");
    flowPath.setAttribute("fill","none");flowPath.setAttribute("stroke","none");
    svg.appendChild(flowPath);
    const dot=document.createElementNS(NS,"circle");
    dot.setAttribute("r","5");dot.setAttribute("class","fc-dot");
    dot.style.display="none";
    svg.appendChild(dot);
    let flowRAF=null;
    function stopDot(){
      if(flowRAF){cancelAnimationFrame(flowRAF);flowRAF=null;}
      dot.style.display="none";
    }
    function flowDot(from,to){
      if(reduceMotion)return;
      const route=chart.flow&&chart.flow[from+">"+to];
      if(!route)return;
      let len;
      try{flowPath.setAttribute("d",route);len=flowPath.getTotalLength();}
      catch(e){return;} // SVG geometry unsupported (e.g. jsdom under test)
      if(!len||typeof flowPath.getPointAtLength!=="function")return;
      if(flowRAF)cancelAnimationFrame(flowRAF);
      const dur=Math.min(850,Math.max(380,len*2.4));
      const t0=performance.now();
      dot.style.display="";
      (function frame(now){
        let t=(now-t0)/dur;if(t>1)t=1;
        const e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; // easeInOutCubic
        const p=flowPath.getPointAtLength(e*len);
        dot.setAttribute("cx",p.x);dot.setAttribute("cy",p.y);
        if(t<1){flowRAF=requestAnimationFrame(frame);}
        else{flowRAF=null;dot.style.display="none";}
      })(t0);
    }

    // trace panel (running commentary)
    const panel=document.createElement("div");panel.className="fc-panel";
    const log=document.createElement("ul");log.className="fc-log";
    panel.appendChild(log);
    mount.appendChild(panel);

    let st,cur,logLines,finished,awaiting;
    function nodeEl(id){return svg.querySelector('[data-id="'+id+'"]');}
    function highlight(){
      $$(".fcn",svg).forEach(n=>n.classList.remove("cur"));
      const el=nodeEl(cur);if(el)el.classList.add("cur");
    }
    function edgeReset(){$$("[data-edge]",svg).forEach(e=>e.classList.remove("taken"));}
    function updateBadge(){
      const b=chart.badge;
      const anchor=b&&chart.anchors?chart.anchors[cur]:null;
      const val=b?st[b.key]:undefined;
      if(!b||!anchor||val===null||val===undefined){badge.style.display="none";return;}
      const label=b.label+" = "+val;
      badgeTx.textContent=label;
      const w=Math.max(46,label.length*7+18);
      badgeBg.setAttribute("width",w);badgeBg.setAttribute("x",-w/2);
      badge.setAttribute("transform","translate("+anchor.x+","+anchor.y+")");
      badge.style.display="";
    }
    function renderLog(){
      log.innerHTML="";
      logLines.slice(-4).forEach(line=>{
        const li=document.createElement("li");li.textContent=line;log.appendChild(li);
      });
    }
    function say(line){logLines.push(line);}
    function enter(id){
      cur=id;const node=chart.nodes[id];
      if(node.set)node.set(st);
      if(node.say)say(node.say(st));
      highlight();updateBadge();renderLog();
      if(node.kind==="io"&&node.read==="ask"){askInput(node);return;}
      if(node.kind==="term"&&!node.next){finish();return;}
      hint.textContent=HINT_STEP;
    }
    function step(){
      if(finished||awaiting)return;
      const from=cur;const node=chart.nodes[from];
      let next;
      if(node.kind==="dec"){
        const yes=node.cond(st);
        edgeReset();
        const e=svg.querySelector('[data-edge="'+(yes?"yes":"no")+'"]');
        if(e)e.classList.add("taken");
        next=yes?node.yes:node.no;
      }else if(node.next){
        next=node.next;
      }else{return;}
      enter(next);
      flowDot(from,next);
    }
    function askInput(node){
      awaiting=true;hint.textContent=HINT_ASK;
      inputs.style.display="flex";inputs.innerHTML="";
      const ask=document.createElement("span");ask.className="fc-ask";ask.textContent=node.ask||"Pick a number:";
      inputs.appendChild(ask);
      (node.options||[]).forEach(val=>{
        const b=document.createElement("button");
        b.type="button";b.className="fc-in-btn";b.textContent=val;
        b.addEventListener("click",()=>{
          const from=cur;
          st[node.var]=val;
          say(node.readSay?node.readSay(val):"read "+val);
          inputs.style.display="none";inputs.innerHTML="";awaiting=false;
          updateBadge();renderLog();
          enter(node.next);
          flowDot(from,node.next);
        });
        inputs.appendChild(b);
      });
    }
    function finish(){
      finished=true;awaiting=false;
      hint.textContent=HINT_DONE;svgBtn.classList.add("done");
      if(opts.onFinish)opts.onFinish(st);
    }
    function reset(){
      st=chart.init();logLines=[];finished=false;awaiting=false;
      inputs.style.display="none";inputs.innerHTML="";
      svgBtn.classList.remove("done");edgeReset();stopDot();
      enter(chart.start);
    }
    svgBtn.addEventListener("click",step);
    resetBtn.addEventListener("click",reset);
    reset();
    return{step,reset,get state(){return st;}};
  }

  /* ── shared arrowhead defs for the SVG charts ── */
  const ARROW_DEFS=
    '<defs>'+
    '<marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#28345A"/></marker>'+
    '<marker id="aha" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#FFB84D"/></marker>'+
    '</defs>';
