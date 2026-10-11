// Coordinates are measured on the unchanged school mural, not invented clue art.
export const muralDetails=[
 {id:'orbit',label:'Orange orbit',x:.32,y:.34},
 {id:'spark',label:'High orange spark',x:.66,y:.25},
 {id:'sun',label:'Sideways sun',x:.75,y:.53}
];
export function frameAt(x,y){return muralDetails.find(d=>Math.hypot(x-d.x,y-d.y)<=.085)||null;}
export function moveFrame(frame,dx,dy){return {x:Math.max(.02,Math.min(.98,frame.x+dx)),y:Math.max(.02,Math.min(.98,frame.y+dy))};}
export function cropSquare(width,height,x,y){const side=Math.min(width,height)*.36;return {sx:Math.max(0,Math.min(width-side,x*width-side/2)),sy:Math.max(0,Math.min(height-side,y*height-side/2)),side};}
