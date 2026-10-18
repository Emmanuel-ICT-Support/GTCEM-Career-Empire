// Test observation only: never set position, progress, ready flags or culling options.
export async function observeCompanionRendering(page){
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`
const currentCompanionChoice=()=>({selected:helperPicker.selected().id,saved:gameStorage.getItem('ce-guidance-v2:'+encodeURIComponent(state.activeId))});
const companionDrawFrames=new WeakMap(),instrumentedCompanionMeshes=new WeakSet(),originalCompanionRender=renderer.render;
renderer.render=function(...args){
 echo?.root?.traverse(mesh=>{if(!mesh.isMesh||instrumentedCompanionMeshes.has(mesh))return;
  instrumentedCompanionMeshes.add(mesh);const previous=mesh.onAfterRender;
  mesh.onAfterRender=function(...drawArgs){previous.apply(this,drawArgs);companionDrawFrames.set(this,renderer.info.render.frame);};
 });return originalCompanionRender.apply(this,args);
};
window.companionRenderProbe=()=>{
 const state={...JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}'),entryReady,echo:echo?.snapshot()},root=echo?.root;
 const livePosition=actor?.model.position.toArray(),entryVisibleMs=Number(canvas.dataset.entryVisibleMs)||null;
 if(!root)return {...currentCompanionChoice(),state,livePosition,entryVisibleMs,submittedFrames:renderedFrames,presentationEnabled:canvas.dataset.presentation==='completed-frame',presentedFrames:Number(canvas.dataset.presentedFrame)||0,frame:renderer?.info.render.frame};
 // SkinnedMesh.updateMatrixWorld refreshes bindMatrixInverse. The inherited
 // updateWorldMatrix does not; computing a sphere then can poison renderer culling.
 root.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
 let visibleMeshes=0,drawnMeshes=0;const meshes=[];
 root.traverse(o=>{if(!o.isMesh)return;let visible=true;for(let p=o;p;p=p.parent)visible&&=p.visible;
  const intersects=frustum.intersectsObject(o),drawn=companionDrawFrames.get(o)===renderer.info.render.frame;
  if(visible&&intersects)visibleMeshes++;if(visible&&drawn)drawnMeshes++;
  const box=new THREE.Box3().setFromObject(o),center=box.getCenter(new THREE.Vector3());
  meshes.push({name:o.name,visible,intersects,drawn,min:box.min.toArray(),max:box.max.toArray(),projected:center.project(camera).toArray()});
 });return {...currentCompanionChoice(),state,livePosition,entryVisibleMs,submittedFrames:renderedFrames,presentationEnabled:canvas.dataset.presentation==='completed-frame',presentedFrames:Number(canvas.dataset.presentedFrame)||0,frame:renderer.info.render.frame,parentMatches:root.parent===activeScene(),visibleMeshes,drawnMeshes,meshes,camera:camera.position.toArray()};
};`});});
}
