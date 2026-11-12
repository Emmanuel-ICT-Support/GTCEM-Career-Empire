// The authored courtyard is translated -11 on Z. Match its Chapel doorway
// (centre -6,-12, radius 3.05, outward angle 1.19), not the old clue point.
export const CHAPEL_DOOR={x:-6+Math.sin(1.19)*3.05,z:-12+Math.cos(1.19)*3.05,yaw:1.19};
export function chapelReturnPoint(){return [CHAPEL_DOOR.x+Math.sin(CHAPEL_DOOR.yaw)*1.65,CHAPEL_DOOR.z+Math.cos(CHAPEL_DOOR.yaw)*1.65];}
export function chapelLookTilt(start,dragY){return Math.max(-.35,Math.min(1.35,start+dragY*.004));}
export function chapelLookHeight(base,tilt,distance=8.5){return base+Math.tan(tilt)*distance;}
// Activate a completed touch gesture even when the browser omits its synthetic
// click. Keep the native button for keyboard/mouse and consume a later touch
// click once, so returning to town cannot also activate a new world action.
export function bindChapelInteraction(button,{touchAction,clickAction,beforeTouch=()=>{}}){
 let gesture=null,suppressTouchClick=false;
 button.addEventListener('pointerdown',event=>{
  suppressTouchClick=false;
  if(event.pointerType!=='touch'||event.isPrimary===false)return;
  const action=touchAction();
  gesture=action&&!button.hidden&&!button.disabled?{id:event.pointerId,x:event.clientX,y:event.clientY,action}:null;
 });
 button.addEventListener('pointerup',event=>{
  const start=gesture;gesture=null;
  if(!start||event.pointerType!=='touch'||event.pointerId!==start.id||button.hidden||button.disabled)return;
  if(Math.hypot(event.clientX-start.x,event.clientY-start.y)>12||touchAction()!==start.action)return;
  suppressTouchClick=true;beforeTouch();start.action();
 });
 button.addEventListener('pointercancel',()=>{gesture=null;});
 button.addEventListener('click',event=>{
  if(suppressTouchClick&&event.detail!==0&&event.pointerType!=='mouse'){suppressTouchClick=false;event.preventDefault();return;}
  clickAction();
 });
}
export function createChapelDoorway(){
 let armed=true;
 const normal={x:Math.sin(CHAPEL_DOOR.yaw),z:Math.cos(CHAPEL_DOOR.yaw)};
 const coordinates=p=>{const x=p.x-CHAPEL_DOOR.x,z=p.z-CHAPEL_DOOR.z;return {forward:x*normal.x+z*normal.z,side:x*normal.z-z*normal.x};};
 return {
  reset(){armed=false;},
  step(previous,next,{walking=false,available=true}={}){
   const a=coordinates(previous),b=coordinates(next);
   if(b.forward>1)armed=true;
   if(!available||!walking||!armed)return false;
   const moved=Math.hypot(next.x-previous.x,next.z-previous.z);
   if(moved<.001||a.forward<=.35||b.forward>.35||b.forward>=a.forward)return false;
   const t=(a.forward-.35)/(a.forward-b.forward),side=a.side+(b.side-a.side)*t;
   if(Math.abs(side)>.48)return false;
   armed=false;return true;
  }
 };
}
