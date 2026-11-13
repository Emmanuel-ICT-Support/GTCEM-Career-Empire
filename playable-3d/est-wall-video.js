import * as THREE from 'three';
/** Reuse the exact existing four-system EST Lab briefing; no duplicate video asset. */
export function createESTWallVideo(scene,{previewScene}={}){
 const video=document.createElement('video');video.id='est-wall-media';video.src='../Assets/EST%20Preparation/est-lab-systems.mp4?v=8d78d63b4a0d';video.preload='none';video.playsInline=true;video.setAttribute('playsinline','');video.hidden=true;document.body.append(video);
 const material=new THREE.MeshBasicMaterial({color:0xffffff});const screen=new THREE.Mesh(new THREE.PlaneGeometry(6.4,3.6),material);screen.name='EST Lab briefing wall screen';screen.position.set(0,3.3,-6.48);scene.add(screen);
 const frame=new THREE.Mesh(new THREE.BoxGeometry(6.58,3.78,.14),new THREE.MeshStandardMaterial({color:0x203d43,roughness:.7}));frame.position.set(0,3.3,-6.59);scene.add(frame);
 const outsideScreen=previewScene?screen.clone():null;
 let outsideWindow=null;
 if(outsideScreen){
  // The three rear panes span x 13.124..18.877, y .36..3.12.
  // The backing sits against the rear glazing; the native 16:9 film
  // uses the full window height without cropping teaching text or stretching.
  outsideWindow=new THREE.Mesh(new THREE.PlaneGeometry(5.753,2.76),new THREE.MeshBasicMaterial({color:0x0b1725,toneMapped:false}));
  outsideWindow.name='EST floor-to-ceiling back-window display';outsideWindow.position.set(16,1.74,21.94);outsideWindow.rotation.y=Math.PI;previewScene.add(outsideWindow);
  outsideScreen.name='EST full-height window briefing';outsideScreen.geometry=new THREE.PlaneGeometry(2.76*16/9,2.76);outsideScreen.position.set(16,1.74,21.935);outsideScreen.rotation.y=Math.PI;previewScene.add(outsideScreen);
 }
 let posterLoad;
 function ensurePoster(){
  if(!posterLoad)posterLoad=new THREE.TextureLoader().loadAsync('../Assets/EST%20Preparation/est-lab-systems-poster.png').then(poster=>{
   poster.colorSpace=THREE.SRGBColorSpace;
   if(!material.map){material.map=poster;material.needsUpdate=true;}
  }).catch(error=>{posterLoad=null;throw error;});
  return posterLoad;
 }
 const texture=new THREE.VideoTexture(video);texture.colorSpace=THREE.SRGBColorSpace;video.addEventListener('playing',()=>{material.map=texture;material.needsUpdate=true;});
 // Keep the native URL: the production host supports byte-range streaming.
 // Never await a download/metadata event before play(): iOS needs the tap's
 // user activation for audible playback, including a cold first start.
 let prepared=false;
 function prepare(){
  if(!prepared||video.error){prepared=true;video.preload='metadata';video.load();}
  return Promise.resolve();
 }
 function play(){prepare();return video.play();}
 let previewing=false,attempted=false,previewError='';
 function retryPreview(){
  if(!previewing)return Promise.resolve(false);
  attempted=true;video.muted=true;video.loop=true;
  ensurePoster().catch(()=>{});
  return play().then(()=>{previewError='';return true;}).catch(()=>{previewError='Tap the scene to start the muted wall preview.';return false;});
 }
 function updatePreview({mode,position,watching=false,blocked=false}){
  if(watching){previewing=false;attempted=false;return;}
  const near=mode==='town'&&position&&Math.hypot(position.x-16,position.z-14)<8;
  const wanted=!blocked&&(near||mode==='interior');
  if(!wanted){if(previewing)video.pause();previewing=false;attempted=false;return;}
  previewing=true;if(!attempted)retryPreview();
 }
 return {video,screen,outsideScreen,outsideWindow,updatePreview,retryPreview,get previewing(){return previewing;},get previewError(){return previewError;},ensurePoster,prepare,pause:()=>video.pause(),play,restart:()=>{prepare();video.currentTime=0;return video.play();}};
}
