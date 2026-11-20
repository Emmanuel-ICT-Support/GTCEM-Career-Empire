// Both seats look from the open promenade: negative Z is behind the shops.
export const artBoardView=Object.freeze({x:2.3,y:8.4,z:10.8});
export const boardView=Object.freeze({x:.9,y:9.2,z:8.7});
export const orbitLimits=Object.freeze({theta:[-.42,.42],phi:[.48,1.04],radius:[7.8,22]});
export function clampBoardOrbit(orbit){for(const key of ['theta','phi','radius']){const [min,max]=orbitLimits[key];orbit[key]=Math.max(min,Math.min(max,orbit[key]));}return orbit;}
export function boardZoom(aspect){return Math.min(1.06,aspect*.78);}
