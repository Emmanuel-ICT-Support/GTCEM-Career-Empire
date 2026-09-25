// Auto adapts pixel cost, never model detail, layout, collision or saved progress.
export function createRenderBudget(maxRatio=1){
 const ceiling=Math.min(maxRatio,1.5),floor=Math.min(ceiling,.65);
 let ratio=Math.min(ceiling,1),seconds=0,frames=0,cooldown=0;
 return {get ratio(){return ratio;},reset(){ratio=Math.min(ceiling,1);seconds=frames=cooldown=0;return ratio;},sample(delta){
  if(!Number.isFinite(delta)||delta<=0)return null;
  seconds+=delta;frames++;cooldown+=delta;
  if(seconds<2)return null;
  const fps=frames/seconds;seconds=frames=0;
  let next=ratio;
  if(fps<28)next=Math.max(floor,Math.round((ratio-.15)*100)/100);
  else if(fps>52&&cooldown>=12)next=Math.min(ceiling,Math.round((ratio+.1)*100)/100);
  if(next===ratio)return null;
  ratio=next;cooldown=0;return ratio;
 }};
}
