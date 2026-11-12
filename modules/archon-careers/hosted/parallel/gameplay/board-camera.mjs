// Both seats look from the open promenade: negative Z is behind the shops.
export const boardView=Object.freeze({x:2.3,y:8.4,z:10.8});
export const orbitLimits=Object.freeze({theta:[-.42,.42],phi:[.48,1.04],radius:[11.5,22]});
export function clampBoardOrbit(orbit){for(const key of ['theta','phi','radius']){const [min,max]=orbitLimits[key];orbit[key]=Math.max(min,Math.min(max,orbit[key]));}return orbit;}
export function boardZoom(aspect){return Math.max(.25,Math.min(1.15,aspect/1.12));}
export function overviewPose(progress){const t=Math.max(0,Math.min(1,progress)),e=1-(1-t)**3;return {x:-2.8+(boardView.x+2.8)*e,y:14+(boardView.y-14)*e,z:16+(boardView.z-16)*e};}
export function shouldOverview(previous,next,reduced){return !reduced&&next.phase==='board'&&((next.overview===true&&previous?.round!==next.round)||(previous?.phase==='lobby')||(Boolean(previous?.round)&&previous.round!==next.round));}
