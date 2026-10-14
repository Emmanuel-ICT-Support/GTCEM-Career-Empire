import * as THREE from 'three';
/** Reuse the exact existing four-system EST Lab briefing; no duplicate video asset. */
export function createESTWallVideo(scene){
 const video=document.createElement('video');video.id='est-wall-media';video.src='../Assets/EST%20Preparation/est-lab-systems.mp4?v=8d78d63b4a0d';video.preload='none';video.playsInline=true;video.setAttribute('playsinline','');video.hidden=true;document.body.append(video);
 const material=new THREE.MeshBasicMaterial({color:0xffffff});const screen=new THREE.Mesh(new THREE.PlaneGeometry(6.4,3.6),material);screen.name='EST Lab briefing wall screen';screen.position.set(0,3.3,-6.48);scene.add(screen);
 const frame=new THREE.Mesh(new THREE.BoxGeometry(6.58,3.78,.14),new THREE.MeshStandardMaterial({color:0x203d43,roughness:.7}));frame.position.set(0,3.3,-6.59);scene.add(frame);
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
 return {video,screen,ensurePoster,prepare,pause:()=>video.pause(),play,restart:()=>{prepare();video.currentTime=0;return video.play();}};
}
