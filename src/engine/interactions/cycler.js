/* ================= kit: cycler =================
   A tiny value-stepper: click a button to advance through a preset list of
   values, wrapping at the end. Each step re-renders the button's label via
   formatFn and reports the new value to onChange.

   makeCycler(btnEl, values, formatFn, onChange)
   api: value() → the currently shown value. */

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
