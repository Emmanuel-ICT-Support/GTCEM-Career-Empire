// Both seats look from the open promenade: negative Z is behind the shops.
export const artBoardView=Object.freeze({x:2.3,y:8.4,z:10.8});
export const boardView=Object.freeze({x:.9,y:9.2,z:8.7});
export const orbitLimits=Object.freeze({theta:[-1.25,1.25],phi:[.30,1.23],radius:[7.8,22]});
export function clampBoardOrbit(orbit){for(const key of ['theta','phi','radius']){const [min,max]=orbitLimits[key];orbit[key]=Math.max(min,Math.min(max,orbit[key]));}return orbit;}
export function boardZoom(aspect){return Math.min(1.06,aspect*.78);}
// Aim changes direction only; orbit continues to control camera position.
export function moveBoardLook(look,dx,dy){return {yaw:((look.yaw-dx*.005+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI,pitch:Math.max(-1.40,Math.min(1.40,look.pitch-dy*.005))};}
export function boardAim(position,look){const horizontal=Math.cos(look.pitch);return {x:position.x+Math.sin(look.yaw)*horizontal*10,y:position.y+Math.sin(look.pitch)*10,z:position.z-Math.cos(look.yaw)*horizontal*10};}
export function boardWheelInput(event){const scale=event.deltaMode===1?16:event.deltaMode===2?800:1,step=v=>Math.max(-120,Math.min(120,(Number.isFinite(v)?v:0)*scale)),x=step(event.deltaX),y=step(event.deltaY);return event.ctrlKey||event.metaKey?{type:'zoom',factor:Math.exp(y*.003)}:{type:'look',dx:event.shiftKey&&!x?y:x,dy:event.shiftKey&&!x?0:y};}
