// Preserve the existing camera-relative shoulder position in every world.
export function companionPosition(player,camera,current,{positioned=false,dt=0}={}){
 let x=camera.x-player.x,z=camera.z-player.z;const length=Math.hypot(x,z);if(length<Math.sqrt(.001)){x=0;z=1;}else{x/=length;z/=length;}
 const target={x:player.x+x*.45+z*1.35,y:player.y,z:player.z+z*.45-x*1.35};
 if(!positioned||Math.hypot(current.x-target.x,current.y-target.y,current.z-target.z)>6)return target;
 const blend=Math.min(1,dt*8);return {x:current.x+(target.x-current.x)*blend,y:current.y+(target.y-current.y)*blend,z:current.z+(target.z-current.z)*blend};
}
