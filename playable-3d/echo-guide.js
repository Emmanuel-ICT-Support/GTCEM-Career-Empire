import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createEchoStore,ECHO_STEPS,arrivalGuidance,TASK_STEPS,taskDone,resumeStep} from './echo-state.js?v=echo-staged-20260925';

// Replaceable visual root: no player rig, collider, texture or external service.
export function createEchoModel(){
 const root=new THREE.Group();root.name='Echo / nature-tech guide';
 const body=new THREE.Group();root.add(body);const pieces=new Map();
 const materials={shell:new THREE.MeshStandardMaterial({color:'#56c8ed',transparent:true,opacity:.48,depthWrite:false,roughness:.22,metalness:.15}),face:new THREE.MeshStandardMaterial({color:'#123f58',roughness:.3,metalness:.18}),light:new THREE.MeshBasicMaterial({color:'#c6ffff'}),veins:new THREE.MeshBasicMaterial({color:'#76f4d0'}),leaf:new THREE.MeshStandardMaterial({color:'#8bcf63',roughness:.5,emissive:'#426d24',emissiveIntensity:.3}),gold:new THREE.MeshStandardMaterial({color:'#edce82',metalness:.45,roughness:.35})};
 function part(geo,mat,pos,scale=[1,1,1],rotation=[0,0,0]){const m=new THREE.Matrix4().compose(new THREE.Vector3(...pos),new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),new THREE.Vector3(...scale));geo.applyMatrix4(m);if(!pieces.has(mat))pieces.set(mat,[]);pieces.get(mat).push(geo);}
 const orb=(r,mat,pos,scale)=>part(new THREE.SphereGeometry(r,20,12),mat,pos,scale);
 orb(.235,'shell',[0,.43,0],[1,1.22,.82]);orb(.14,'shell',[0,.19,0],[1,.9,.9]);
 for(const side of [-1,1])orb(.075,'shell',[side*.24,.31,0],[.8,1.35,.8]);
 orb(.177,'face',[0,.46,.122],[1,.66,.42]);
 for(const x of [-.065,.065])orb(.024,'light',[x,.478,.189],[.68,1.25,.42]);
 const smile=new THREE.CatmullRomCurve3([new THREE.Vector3(-.036,.433,.193),new THREE.Vector3(0,.42,.199),new THREE.Vector3(.036,.433,.193)]);
 part(new THREE.TubeGeometry(smile,10,.007,5,false),'light',[0,0,0]);
 // Root-like internal branches, visible through the translucent shell.
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.21,0),new THREE.Vector3(Math.cos(a)*.06,.32,Math.sin(a)*.055),new THREE.Vector3(Math.cos(a)*.145,.40+(i%3)*.04,Math.sin(a)*.105)]);part(new THREE.TubeGeometry(curve,8,.005,4,false),'veins',[0,0,0]);}
 part(new THREE.CylinderGeometry(.008,.012,.14,7),'leaf',[0,.735,0],[1,1,1],[0,0,-.17]);
 orb(.072,'leaf',[-.057,.78,0],[1.05,.36,.5]);orb(.078,'leaf',[.051,.807,0],[.9,.34,.48]);
 // Small crown emblem: three tips on the chest, not a large costume crown.
 part(new THREE.BoxGeometry(.11,.025,.017),'gold',[0,.286,.145]);
 for(const x of [-.042,0,.042])part(new THREE.ConeGeometry(.027,x===0?.064:.046,3),'gold',[x,.318,.145],[1,1,.35]);
 for(const [name,geos]of pieces){const geometry=mergeGeometries(geos);geos.forEach(g=>g.dispose());const mesh=new THREE.Mesh(geometry,materials[name]);mesh.name='Echo '+name;body.add(mesh);}
 const orbit=new THREE.Group();body.add(orbit);
 for(let i=0;i<3;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.025,8,5),materials.leaf);leaf.scale.set(1.7,.45,.7);leaf.position.set(Math.cos(i*2.094)*.32,.35+i*.08,Math.sin(i*2.094)*.3);orbit.add(leaf);}
 const ring=new THREE.Mesh(new THREE.RingGeometry(.16,.22,32),new THREE.MeshBasicMaterial({color:'#6acbd0',transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.012;root.add(ring);
 return {root,body,orbit,dispose(){root.removeFromParent();const gs=new Set(),ms=new Set();root.traverse(o=>{if(o.isMesh){gs.add(o.geometry);ms.add(o.material);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());}};
}

export function createEchoGuide({scene,physics,canvas,profile,onPause,onAction,review=false}){
 let storage;try{storage=localStorage;}catch{}
 const store=createEchoStore(storage,{review}),model=createEchoModel();scene.add(model.root);model.root.position.set(-5.85,0,22.7);
 const panel=document.createElement('section');panel.id='echo-dialogue';panel.className='echo-dialogue';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','Echo guide');
 panel.innerHTML='<header><span>ECHO · YOUR WORLD GUIDE</span><button type="button" data-close aria-label="Close Echo dialogue">×</button></header><div aria-live="polite" aria-atomic="true"><small data-count></small><h2 tabindex="-1"></h2><p data-message></p></div><button type="button" data-action hidden></button><div data-revisit></div><p class="echo-note" data-note></p><footer><button type="button" data-back>Back</button><button type="button" data-skip>Skip for now</button><button type="button" data-next>Next →</button></footer>';
 document.getElementById('experience').append(panel);
 const cue=document.createElement('button');cue.id='echo-cue';cue.className='echo-cue';cue.textContent='Echo · say hello';cue.hidden=true;document.getElementById('experience').append(cue);
 // A small physical resource pedestal: documents stay pending, never fabricated.
 const resources=new THREE.Group();resources.name='Careers and Employability Course Documents';resources.position.set(-5.35,0,21.3);scene.add(resources);
 const resourceCollider=physics.createCollider(RAPIER.ColliderDesc.cuboid(.325,.425,.24).setTranslation(-5.35,.425,21.3));
 const stone=new THREE.MeshStandardMaterial({color:'#d6ccb7',roughness:.8}),green=new THREE.MeshStandardMaterial({color:'#315c50',roughness:.6});
 const stand=new THREE.Mesh(new THREE.BoxGeometry(.65,.85,.48),stone);stand.position.y=.425;resources.add(stand);
 const book=new THREE.Mesh(new THREE.BoxGeometry(.56,.065,.38),green);book.position.set(0,.9,0);book.rotation.x=.15;resources.add(book);
 const pages=new THREE.Mesh(new THREE.BoxGeometry(.50,.022,.33),new THREE.MeshStandardMaterial({color:'#fff4d9'}));pages.position.set(0,.942,0);pages.rotation.x=.15;resources.add(pages);
 const art=document.createElement('canvas');art.width=512;art.height=256;const ctx=art.getContext('2d');ctx.fillStyle='#264b43';ctx.fillRect(0,0,512,256);ctx.fillStyle='#fff7df';ctx.font='600 39px sans-serif';ctx.textAlign='center';['CAREERS AND','EMPLOYABILITY','COURSE DOCUMENTS'].forEach((line,i)=>ctx.fillText(line,256,65+i*66));const texture=new THREE.CanvasTexture(art);texture.colorSpace=THREE.SRGBColorSpace;
 const plaque=new THREE.Mesh(new THREE.PlaneGeometry(1.25,.625),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));plaque.position.set(0,1.45,.06);resources.add(plaque);
 let resourceOpen=false;
 function showResources(){const saved=store.read(profile());store.write(profile(),{...saved,status:saved.status==='new'?'reading':saved.status,resourcesVisited:true});onPause();resourceOpen=true;panel.hidden=false;render();q('h2').focus({preventScroll:true});}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let id=profile(),step=0,available=false,resourceAvailable=false,time=0;
 const q=s=>panel.querySelector(s);const open=()=>!panel.hidden;
 function close(){panel.hidden=true;document.getElementById('experience').classList.remove('echo-speaking');resourceOpen=false;onPause();canvas.focus({preventScroll:true});}
 function render(){
 document.getElementById('experience').classList.add('echo-speaking');
 q('[data-revisit]').replaceChildren();
 const saved=store.read(profile());
 for(const n of saved.skippedTasks.filter(n=>!taskDone(saved,n))){const button=document.createElement('button');button.textContent='Revisit: '+ECHO_STEPS[n][3];button.onclick=()=>{close();onAction(ECHO_STEPS[n][2]);};q('[data-revisit]').append(button);}

 q('[data-next]').hidden=false;q('[data-back]').hidden=resourceOpen;q('[data-skip]').hidden=resourceOpen||step===10;
 if(resourceOpen){q('[data-count]').textContent='COURSE DOCUMENTS';q('h2').textContent='Careers and Employability Course Documents';q('[data-message]').textContent='This is where you’ll inspect your course requirements and assessment outline. The current course documents are not available here yet. Your teacher will confirm them.';q('[data-note]').textContent='Finding this point does not mean you have read the documents or completed the course requirements.';q('[data-action]').hidden=true;q('[data-next]').textContent='Continue with Echo';return;}
 const item=ECHO_STEPS[step];q('[data-count]').textContent=step<=2?'GETTING STARTED':step<=5?'YOUR AVATAR':step<=9?'EXPLORE AND EXPERIENCE':'YOUR JOURNEY';q('h2').textContent=item[0];q('[data-message]').textContent=item[1];q('[data-back]').disabled=[0,3,6,10].includes(step);q('[data-next]').hidden=TASK_STEPS.includes(step);q('[data-next]').textContent=step===ECHO_STEPS.length-1?'Let’s begin':'Next →';q('[data-action]').hidden=!item[2];q('[data-action]').textContent=item[3]||'';q('[data-note]').textContent=store.persistent?'You can return to Echo any time.':'This guide remembers your place only while this tab is open.';}
 function show(){if(!available)return;resourceOpen=false;onPause();id=profile();const saved=store.read(id);step=resumeStep(saved);store.write(id,{step,status:'reading'});panel.hidden=false;render();q('h2').focus({preventScroll:true});}
 function advance(){if(resourceOpen){resourceOpen=false;id=profile();step=resumeStep(store.read(id));store.write(id,{step,status:'reading'});render();return;}if(step===ECHO_STEPS.length-1){store.write(id,{step,status:'seen'});close();return;}step++;store.write(id,{step,status:'reading'});render();}
 q('[data-close]').onclick=close;q('[data-next]').onclick=advance;q('[data-back]').onclick=()=>{if(![0,3,6,10].includes(step)){step--;store.write(id,{step,status:'reading'});render();}};q('[data-skip]').onclick=()=>{const saved=store.read(id);const gate=TASK_STEPS.find(n=>n>=step);step=gate===undefined?10:gate+1;store.write(id,{step,status:'reading',skippedTasks:gate===undefined?saved.skippedTasks:[...new Set([...saved.skippedTasks,gate])]});render();};q('[data-action]').onclick=()=>{const action=ECHO_STEPS[step][2];close();onAction(action);};cue.onclick=show;
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}e.stopPropagation();});
 const point=new THREE.Vector3(),ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
 return {root:model.root,resources,showResources,resourcesNear:p=>Math.hypot(p.x-resources.position.x,p.z-resources.position.z)<2.8,open,show,close,near:p=>Math.hypot(p.x-model.root.position.x,p.z-model.root.position.z)<3.5,
  status:()=>store.read(profile()).status,
  guidance:options=>{const saved=store.read(profile());if(options.avatarSaved&&!saved.avatarSaved)store.write(profile(),{...saved,avatarSaved:true});return arrivalGuidance({...options,state:store.read(profile())});},
  markMarketVisited(){const saved=store.read(profile());store.write(profile(),{...saved,status:saved.status==='new'?'reading':saved.status,marketVisited:true});},
  tap(event,camera){if(!model.root.visible)return false;const r=canvas.getBoundingClientRect();mouse.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const resourceHit=resourceAvailable?ray.intersectObject(resources,true)[0]:null;const echoHit=available?ray.intersectObject(model.body,true)[0]:null;const isResource=resourceHit&&(!echoHit||resourceHit.distance<echoHit.distance);const hit=isResource?resourceHit:echoHit;if(!hit)return false;const target=isResource?resources:model.root;const blocked=ray.intersectObjects(scene.children.filter(o=>o!==target),true).some(h=>{if(h.distance>=hit.distance-.03||!h.object.isMesh)return false;for(let n=h.object;n;n=n.parent)if(!n.visible)return false;return true;});if(blocked)return false;if(isResource)showResources();else show();return true;},
  update(dt,p,camera,enabled){available=enabled&&this.near(p);resourceAvailable=enabled&&this.resourcesNear(p);model.root.visible=enabled;resources.visible=enabled;if(id!==profile()){id=profile();if(open())close();}if(open()&&(!enabled||(!resourceOpen&&!available)||(resourceOpen&&!this.resourcesNear(p))))close();
   if(enabled&&!document.hidden&&model.root.position.distanceTo(p)<24){if(!reduced.matches)time+=dt;model.body.position.y=reduced.matches?0:Math.sin(time*1.8)*.045;model.orbit.rotation.y=reduced.matches?0:time*.35;model.body.rotation.y=Math.atan2(camera.position.x-model.root.position.x,camera.position.z-model.root.position.z);}
   cue.hidden=!available||open();if(!cue.hidden){point.copy(model.root.position);point.y-=.25;point.project(camera);cue.hidden=point.z>1||Math.abs(point.x)>.9||Math.abs(point.y)>.85;cue.style.left=`${(point.x*.5+.5)*canvas.clientWidth}px`;cue.style.top=`${(-point.y*.5+.5)*canvas.clientHeight}px`;cue.textContent=store.read(profile()).status==='new'?'Echo · say hello':'Talk to Echo';}
  },snapshot(){return {position:model.root.position.toArray(),status:this.status(),step,open:open(),height:.84,bob:model.body.position.y};},dispose(){model.dispose();physics.removeCollider(resourceCollider,true);resources.removeFromParent();texture.dispose();resources.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});panel.remove();cue.remove();}};
}
