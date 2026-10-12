// Boundary hysteresis prevents small movements at the entrance flipping the task.
export function inAdministration(x,wasInside=false){return wasInside?x<-11.9:x<-12.8;}
export function nearestInteraction(spots,position){
 return spots.map(spot=>({...spot,distance:Math.hypot(spot.x-position.x,spot.z-position.z)}))
  .filter(spot=>spot.distance<(spot.radius??2.25))
  .sort((a,b)=>a.distance-b.distance)[0]??null;
}
