import * as T from './vendor/three.module.js';
export async function createScene(host){
 const scene=new T.Scene();scene.background=new T.Color('#cfddd0');scene.fog=new T.Fog('#cfddd0',38,80);
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0xcfddd0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;host.append(renderer.domElement);
 const camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(15,16,19);const target=new T.Vector3(0,0,0);camera.lookAt(target);let view='overview',frame=0;const poses={overview:[[15,16,19],[0,0,0]],home:[[3,8,10],[-4,.5,-.8]],community:[[9,9,11],[1.2,.6,-1]],global:[[11,7,12],[5,.4,2.7]]};
 scene.add(new T.HemisphereLight(0xffffff,0x6c8064,1.8));const sun=new T.DirectionalLight(0xfff1d3,2);sun.position.set(-5,12,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12});scene.add(sun);
 function box(parent,w,h,d,x,y,z,color){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.85}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function sphere(parent,r,x,y,z,color){const m=new T.Mesh(new T.SphereGeometry(r,12,10),new T.MeshStandardMaterial({color,roughness:.9}));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
 function label(text,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#f8f5e9';ctx.fillRect(0,0,512,96);ctx.fillStyle='#254f45';ctx.font='bold 31px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,59);const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),toneMapped:false}));sp.position.set(x,y,z);sp.scale.set(3.2,.6,1);scene.add(sp);}
 box(scene,200,.1,200,0,-.65,0,0xcfddd0);
 box(scene,15,.45,10,0,-.3,0,0xa4b698);box(scene,14,.05,1.2,0,-.04,1.5,0xe9dcc1);
 box(scene,4.8,.12,4.6,-4,.02,-1,0xe7d8bd);box(scene,4.8,2.5,.16,-4,1.25,-3.3,0xf2eadb);box(scene,.16,2.5,4.6,-6.4,1.25,-1,0xe8dfcd);box(scene,1.8,1,.12,-4,1.6,-3.18,0x83b4b5);
 label('YOUR HOME BASE',-4,3.3,-2.5);label('OUR CLASS WORLD',1.5,3,-2.5);
 box(scene,4,.2,3,1.4,.05,-1.5,0x8b9d79);
 const dynamic=new T.Group();scene.add(dynamic);
 function tree(parent,x,z){box(parent,.15,.7,.15,x,.4,z,0x84664a);sphere(parent,.55,x,1.05,z,0x4a7756);}
 tree(scene,6,-3);tree(scene,-6,3.6);
 // Bounded native geometry; decorative details do not change progression or collision.
 for(const x of [-7,7])for(const z of [-4,4]){box(scene,.3,.35,.3,x,-.02,z,0x718779);}
 for(let i=0;i<7;i++)box(scene,.9,.035,1.14,-6+i*2,.005,1.5,i%2?0xddcfb3:0xe4d9c0);
 box(scene,1.5,.14,.6,1,.45,-3.4,0x9d7f58);for(const x of [.4,1.6])box(scene,.12,.4,.4,x,.2,-3.4,0x405e52);
 box(scene,1.5,.5,.12,1,.7,-3.66,0x9d7f58);
 for(const x of [-5.8,-2.2]){box(scene,.12,.12,4.4,x,.18,-1,0xccb78f);}

 const focus=(name,animate=true)=>{
  view=name;cancelAnimationFrame(frame);const pose=poses[view]||poses.overview;
  const end=new T.Vector3(...pose[0]),look=new T.Vector3(...pose[1]);
  if(host.clientWidth<720)end.sub(look).multiplyScalar(1.45).add(look);
  if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){camera.position.copy(end);target.copy(look);camera.lookAt(target);renderer.render(scene,camera);return;}
  const begin=camera.position.clone(),from=target.clone(),start=performance.now();
  const step=now=>{const t=Math.min(1,(now-start)/550),ease=1-Math.pow(1-t,3);camera.position.lerpVectors(begin,end,ease);target.lerpVectors(from,look,ease);camera.lookAt(target);renderer.render(scene,camera);if(t<1)frame=requestAnimationFrame(step);};frame=requestAnimationFrame(step);
 };
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();focus(view,false);};new ResizeObserver(resize).observe(host);
 const draw=s=>{for(const child of [...dynamic.children]){child.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});dynamic.remove(child);}const f=s.effects;
 if(f.desk){box(dynamic,2,.14,1.05,-4,.95,-1.5,0xa8784d);for(const x of [-4.8,-3.2])for(const z of [-1.85,-1.15])box(dynamic,.12,.9,.12,x,.45,z,0x364e49);box(dynamic,.7,.12,.7,-4,.5,-.3,0x446e65);box(dynamic,.7,.7,.12,-4,.83,.02,0x446e65);}
 if(f.laptop){const y=f.desk?1.08:.7;if(!f.desk)box(dynamic,1.15,.62,.8,-4,.34,-1.5,0xbba789);box(dynamic,.8,.07,.55,-4,y,-1.5,0x374955);box(dynamic,.8,.5,.07,-4,y+.25,-1.75,0x374955);box(dynamic,.67,.38,.03,-4,y+.25,-1.705,0x80babe);}
 if(f.wellbeing){box(dynamic,.9,.1,1.5,-5,.14,.5,0x9b9cbb);tree(dynamic,-5.6,-2.7);}
 for(let i=0;i<f.portfolio;i++)box(dynamic,.2,.5,.4,-3.3+i*.3,.5,-2.9,[0x7baac2,0xe7bb62,0xa49dbb][i]);
 if(f.lamp){box(dynamic,.14,2.5,.14,2.8,1.25,-.2,0x35504a);box(dynamic,.6,.14,.6,2.8,2.55,-.2,0xffd67a);sphere(dynamic,.16,2.8,2.35,-.2,0xffe9a3);}
 if(f.garden){for(const x of [.3,1.4,2.5])tree(dynamic,x,-2);}
 if(s.choices.includes('experiment')){box(dynamic,1.1,.3,.8,-.5,.2,3,0x9f7957);if(s.choices.includes('retry')){sphere(dynamic,.25,-.5,.65,3,0x5c9256);box(dynamic,1.5,.1,1.1,-.5,1.45,3,0xc8bb8b);box(dynamic,.08,1.3,.08,-1.1,.7,3,0x725d45);}else box(dynamic,.1,.3,.1,-.5,.5,3,0x8f785c);}
 if(s.insight){box(dynamic,.45,.05,.6,-3.1,.2,.5,0xe4bf72);}
 // Recovery cue is an illustrative seat cushion, not a moral judgement or clinical measurement.
 box(dynamic,1,.15,.7,-1.7,.3,3,s.wellbeing<55?0xb9947a:0x84a996);
 const fraction=Math.min(1,s.savings/30000);box(dynamic,1.5,.15,1,-4,.12,3,0xc6c5ad);if(fraction>0)box(dynamic,1.25,.8*fraction,.7,-4,.2+.4*fraction,3,f.savingGoal?0xe2b85c:0x6d9b9a);
 resize();};
 draw.focus=focus;return draw;
}
