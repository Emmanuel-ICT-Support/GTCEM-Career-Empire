// Style the actual saved portrait pixels; no additional images or model loads.
export function drawStyledPortrait(ctx,image,style){
 ctx.save();ctx.beginPath();ctx.rect(0,72,900,960);ctx.clip();
 if(style==='comedy'){
  ctx.fillStyle='#f9d883';ctx.fillRect(0,72,900,960);
  ctx.translate(450,552);ctx.rotate(-Math.PI/90);
  ctx.fillStyle='#fff4d8';ctx.fillRect(-443,-469,886,938);
  ctx.filter='saturate(1.35) brightness(1.10) contrast(1.04)';
  ctx.drawImage(image,-430,-456,860,912);ctx.filter='none';
 }else{
  ctx.filter='saturate(0.55) contrast(1.16) brightness(0.88)';
  ctx.drawImage(image,0,72,900,960);ctx.filter='none';
  const shade=ctx.createRadialGradient(450,520,140,450,520,650);
  shade.addColorStop(0,'rgba(9,32,55,0)');shade.addColorStop(1,'rgba(9,32,55,0.58)');
  ctx.fillStyle=shade;ctx.fillRect(0,72,900,960);
 }
 ctx.restore();
}
