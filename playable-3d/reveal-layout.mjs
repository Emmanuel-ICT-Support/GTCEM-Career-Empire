// One shared frame for any arrival point within the oval encounter zone.
export function revealLayout(p){
 return {
  photoCamera:[p.x,1.6,p.z-4.5],photoLook:[p.x,1.15,p.z+1.5],
  teacherX:id=>p.x+(id==='middleton'?-2.2:2.2),teacherZ:t=>p.z+7.4-5*t,
  props:[p.x+3,0,p.z+3.2]
 };
}

// Complete the walk→idle blend before turning to the dedicated portrait camera.
// Apply orientation after animation updates so capture does not inherit a travel pose.
export function preparePortrait(actor,layout){
 actor.setWalking(false);actor.update(.3);
 const p=actor.model.position;
 actor.model.rotation.y=Math.atan2(layout.photoCamera[0]-p.x,layout.photoCamera[2]-p.z);
 actor.model.updateMatrixWorld(true);
 actor.model.traverse(node=>{if(node.isSkinnedMesh)node.skeleton.update();});
}

export function prepareCastPortrait(teachers,p){
 const ids=new Set(teachers.map(n=>n.id));
 if(teachers.length!==2||!ids.has('middleton')||!ids.has('psandodakis'))throw Error('Both teachers must be arranged before the photo.');
 const layout=revealLayout(p);
 for(const n of teachers){
  n.stagePose(layout.teacherX(n.id),layout.teacherZ(1),false,.3);
  n.root.visible=true;n.root.updateMatrixWorld(true);
  n.root.traverse(node=>{if(node.isSkinnedMesh)node.skeleton.update();});
 }
}
