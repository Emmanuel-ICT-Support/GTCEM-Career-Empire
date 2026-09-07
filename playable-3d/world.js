import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import RAPIER from '@dimforge/rapier3d-compat';
import {PHASES} from './profiles.js';

/** Tripo daytime plaza plate — native units are tiny (~0.78 x 0.16 x 0.98, Y-up). */
export const PLAZA_GROUND = {
  url: './assets/plaza/plaza-day-ground.glb',
  // Fit circular plaza near town center (x=0,z=4); EST stays at z=-14.
  scale: 52,
  position: [0, 0, 4],
  // Source bbox (pre-scale): min[-0.389,0,-0.490] max[0.389,0.162,0.490]
  nativeBBox: {min:[-0.389,0,-0.490], max:[0.389,0.162,0.490]},
};

const rand=(()=>{let n=1429;return()=>{n=(1664525*n+1013904223)>>>0;return n/4294967296;};})();
const basic=(colour,roughness=.8)=>new THREE.MeshStandardMaterial({color:colour,roughness});
function mesh(group,geometry,material,x=0,y=0,z=0){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
function box(group,w,h,d,material,x,y,z){return mesh(group,new THREE.BoxGeometry(w,h,d),material,x,y,z);}
export function sign(text,width=3,colour='#e5dbc1',back='#253c3b'){
  const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');
  ctx.fillStyle=back;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=colour;ctx.lineWidth=3;ctx.strokeRect(16,16,992,224);
  ctx.fillStyle=colour;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 68px Georgia';ctx.fillText(text,512,133,925);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(width,width/4),new THREE.MeshStandardMaterial({map:texture,roughness:.65,side:THREE.DoubleSide}));
}
function texture(kind){
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');
  ctx.fillStyle=kind==='stone'?'#9c9c92':kind==='asphalt'?'#32343a':'#b6c0a7';ctx.fillRect(0,0,512,512);
  if(kind==='stone'){
    for(let y=0;y<8;y++)for(let x=-1;x<5;x++){
      const v=151+rand()*32;ctx.fillStyle=`rgb(${v+3},${v+2},${v-4})`;
      ctx.fillRect(x*128+(y%2)*64+2,y*64+2,124,60);
    }
  }
  if(kind==='asphalt'){
    for(let i=0;i<22000;i++){const v=28+rand()*40;ctx.fillStyle=`rgb(${v},${v},${v+2})`;ctx.fillRect(rand()*512,rand()*512,rand()*2+1,rand()*2+1);}
  }else{
    for(let i=0;i<17000;i++){const v=rand();ctx.fillStyle=v>.5?'rgba(255,255,240,.04)':'rgba(0,20,0,.035)';ctx.fillRect(rand()*512,rand()*512,rand()*3+1,rand()*3+1);}
  }
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;
}
/** Try plaza PNG maps; resolve null on miss so caller can keep procedural fallback. */
function tryLoadPlazaMap(url,repeatX=1,repeatY=1){
  return new Promise(resolve=>{
    const loader=new THREE.TextureLoader();
    loader.load(url,t=>{
      t.colorSpace=THREE.SRGBColorSpace;
      t.wrapS=t.wrapT=THREE.RepeatWrapping;
      t.anisotropy=8;
      t.repeat.set(repeatX,repeatY);
      resolve(t);
    },undefined,()=>resolve(null));
  });
}
async function tryLoadPlazaGround(loader){
  try{
    const gltf=await loader.loadAsync(PLAZA_GROUND.url);
    const root=gltf.scene||gltf.scenes?.[0];
    if(!root)return null;
    root.name='plaza-day-ground';
    root.scale.setScalar(PLAZA_GROUND.scale);
    root.position.set(...PLAZA_GROUND.position);
    root.traverse(o=>{
      if(o.isMesh){
        o.castShadow=true;
        o.receiveShadow=true;
        if(o.material){
          const mats=Array.isArray(o.material)?o.material:[o.material];
          for(const m of mats){
            if(m.map)m.map.colorSpace=THREE.SRGBColorSpace;
            m.needsUpdate=true;
          }
        }
      }
    });
    return root;
  }catch(err){
    console.warn('[world] plaza GLB unavailable, procedural paths fallback', err);
    return null;
  }
}
function planeOverlay(group,w,d,material,x,y,z,rotY=0){
  const o=mesh(group,new THREE.PlaneGeometry(w,d),material,x,y,z);
  o.rotation.x=-Math.PI/2;o.rotation.z=rotY;o.castShadow=false;o.renderOrder=2;return o;
}
function consolidate(root){
  root.updateMatrixWorld(true);const groups=new Map();
  root.traverse(o=>{if(o.isMesh&&!Array.isArray(o.material)){const g=o.geometry.clone().applyMatrix4(o.matrixWorld);if(!groups.has(o.material))groups.set(o.material,[]);groups.get(o.material).push(g);}});
  const merged=new THREE.Group();
  for(const [material,geometries] of groups){
    // Blender primitives and custom lofts do not all carry UVs. These assets use solid materials.
    const normalised=geometries.map(g=>{const n=g.index?g.toNonIndexed():g;for(const key of Object.keys(n.attributes))if(!['position','normal'].includes(key))n.deleteAttribute(key);return n;});
    const geo=mergeGeometries(normalised);if(!geo)throw new Error(`Cannot merge ${material.name}`);
    mesh(merged,geo,material.clone());for(const g of new Set([...geometries,...normalised]))g.dispose();
  }
  return merged;
}
export async function createWorlds(){
  await RAPIER.init();
  const loader=new GLTFLoader();
  const draco=new DRACOLoader();
  // Decoder matches three r180 / gltf-transform Draco meshes; CDN keeps vendor tree light.
  draco.setDecoderPath('./vendor/draco/');
  loader.setDRACOLoader(draco);
  const [outerAsset,innerAsset,plazaGround]=await Promise.all([
    loader.loadAsync('./assets/est-exterior.glb'),
    loader.loadAsync('./assets/est-interior.glb'),
    tryLoadPlazaGround(loader),
  ]);
  // Optional daytime plaza kit (falls back to procedural canvas textures).
  const [grassMap,stoneMap,asphaltMap,dashMap,crosswalkMap,curbMap]=await Promise.all([
    tryLoadPlazaMap('./assets/plaza/grass_day.png',85,85),
    tryLoadPlazaMap('./assets/plaza/stone_flag_day.png',6,14),
    tryLoadPlazaMap('./assets/plaza/asphalt_day.png',10,3),
    tryLoadPlazaMap('./assets/plaza/asphalt_dash_overlay.png',1,8),
    tryLoadPlazaMap('./assets/plaza/crosswalk_overlay.png',1,1),
    tryLoadPlazaMap('./assets/plaza/curb_cyan_trim.png',12,1),
  ]);
  const town=new THREE.Scene(),interior=new THREE.Scene();
  // Brighter daytime sky / fog (less greybox-night feel).
  town.background=new THREE.Color(0xc8e6f2);town.fog=new THREE.Fog(0xc8e6f2,64,175);
  interior.background=new THREE.Color(0xc4c2b4);
  const materials={
    ground:basic(0x7fad5e),
    path:basic(0xd4d2c6,.78),
    asphalt:basic(0x3a3c42,.94),
    leaf:basic(0x487e47),
    trunk:basic(0x605344),
    edge:basic(0xb4b7a8),
    water:new THREE.MeshStandardMaterial({color:0x4b9baf,metalness:.5,roughness:.2}),
  };
  const grass=grassMap||texture('grass');if(!grassMap)grass.repeat.set(85,85);materials.ground.map=grass;materials.ground.color.set(0xffffff);
  const paving=stoneMap||texture('stone');if(!stoneMap)paving.repeat.set(4,12);materials.path.map=paving;materials.path.bumpMap=paving;materials.path.bumpScale=.028;materials.path.color.set(0xffffff);
  const roadTex=asphaltMap||texture('asphalt');if(!asphaltMap)roadTex.repeat.set(10,3);materials.asphalt.map=roadTex;materials.asphalt.color.set(0xffffff);
  const dashMat=new THREE.MeshStandardMaterial({map:dashMap||null,color:dashMap?0xffffff:0xf0c828,transparent:true,opacity:dashMap?1:.9,depthWrite:false,roughness:.85,side:THREE.DoubleSide});
  const crossMat=new THREE.MeshStandardMaterial({map:crosswalkMap||null,color:crosswalkMap?0xffffff:0xf2f2f6,transparent:true,opacity:crosswalkMap?1:.92,depthWrite:false,roughness:.8,side:THREE.DoubleSide});
  const curbMat=new THREE.MeshStandardMaterial({map:curbMap||null,color:curbMap?0xffffff:0x5ec8d4,transparent:true,opacity:curbMap?1:.45,depthWrite:false,roughness:.55,metalness:.15,side:THREE.DoubleSide,emissive:0x1a6a72,emissiveIntensity:.15});

  const groundGeo=new THREE.PlaneGeometry(180,180,100,100);groundGeo.rotateX(-Math.PI/2);
  const pos=groundGeo.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),r=Math.hypot(x,z);pos.setY(i,Math.max(0,(r-43)/35)*(1.5+Math.sin(x*.11)*1.4+Math.cos(z*.1)*1.1));}
  groundGeo.computeVertexNormals();const groundMesh=mesh(town,groundGeo,materials.ground);

  // --- Expanded plaza path network (campus feel) ---
  const pathGroup=new THREE.Group();town.add(pathGroup);
  // Main N-S flagstone avenue (toward EST)
  box(pathGroup,7.2,.08,46,materials.path,0,.04,4);
  // Cross street E-W through plaza
  box(pathGroup,42,.08,5.2,materials.path,0,.042,6.5);
  // Circular plaza ring / pad
  const circle=mesh(pathGroup,new THREE.CircleGeometry(9.4,80),materials.path,0,.09,4);circle.rotation.x=-Math.PI/2;
  // Approach apron in front of EST
  box(pathGroup,16,.09,7.2,materials.path,0,.048,-8.2);
  // Sidewalk spur toward Home Base (west)
  box(pathGroup,14,.07,3.4,materials.path,-14.5,.045,5.2);
  // Sidewalk spur east toward gardens / pond
  box(pathGroup,12,.07,3.2,materials.path,14,.045,7.8);
  // Short spur south (player spawn approach)
  box(pathGroup,4.5,.07,10,materials.path,0,.043,18);
  // Diagonal campus spur (NE)
  const diag=box(pathGroup,3.2,.07,16,materials.path,11,.046,-2);diag.rotation.y=-Math.PI/5;

  // --- Asphalt road strips (thin, framing plaza) ---
  const roadGroup=new THREE.Group();town.add(roadGroup);
  box(roadGroup,5.5,.055,52,materials.asphalt,18.5,.028,2);
  box(roadGroup,5.5,.055,40,materials.asphalt,-22,.028,4);
  box(roadGroup,48,.055,5.2,materials.asphalt,-1.5,.029,24);
  box(roadGroup,36,.055,4.6,materials.asphalt,0,.029,-18);

  // Yellow dashed centre lines
  planeOverlay(roadGroup,1.1,48,dashMat,18.5,.062,2);
  planeOverlay(roadGroup,1.1,36,dashMat,-22,.062,4);
  planeOverlay(roadGroup,1.0,44,dashMat,-1.5,.063,24,Math.PI/2);
  planeOverlay(roadGroup,1.0,32,dashMat,0,.063,-18,Math.PI/2);

  // White zebra crosswalks where roads meet plaza paths
  planeOverlay(roadGroup,7.5,4.2,crossMat,18.5,.068,6.5,Math.PI/2);
  planeOverlay(roadGroup,7.5,4.2,crossMat,18.5,.068,24,Math.PI/2);
  planeOverlay(roadGroup,7.5,4.2,crossMat,-22,.068,5.2,Math.PI/2);
  planeOverlay(roadGroup,6.5,4.0,crossMat,0,.068,24);
  planeOverlay(roadGroup,6.5,4.0,crossMat,0,.068,-15.5);

  // Restrained cyan curb accents along avenue edges
  planeOverlay(pathGroup,0.35,44,curbMat,-3.75,.095,4);
  planeOverlay(pathGroup,0.35,44,curbMat,3.75,.095,4);
  planeOverlay(pathGroup,40,0.35,curbMat,0,.096,4.0);
  planeOverlay(pathGroup,40,0.35,curbMat,0,.096,9.0);

  // Tripo daytime plaza GLB replaces procedural path/road network when present.
  const usingPlazaGlb=!!plazaGround;
  if(usingPlazaGlb){
    // Road/path tops sit above native y=0; snap the spawn road surface to the physics floor.
    plazaGround.updateMatrixWorld(true);
    const alignRay=new THREE.Raycaster(new THREE.Vector3(2.55,80,17),new THREE.Vector3(0,-1,0));
    const alignHits=alignRay.intersectObject(plazaGround,true);
    if(alignHits.length){
      plazaGround.position.y-=alignHits[0].point.y;
      plazaGround.updateMatrixWorld(true);
    }
    town.add(plazaGround);
    pathGroup.visible=false;
    roadGroup.visible=false;
    groundMesh.visible=false;
  }

  const est=consolidate(outerAsset.scene);est.position.z=-14;town.add(est);
  const estSign=sign('EST PREP',3.3);estSign.position.set(0,5.73,-10.1);town.add(estSign);
  const home=est.clone(true);home.scale.setScalar(.45);home.position.set(-17,0,5.0);home.rotation.y=Math.PI/2;town.add(home);
  const homeSign=sign('HOME BASE',1.8);homeSign.position.set(-14.9,2.58,5.0);homeSign.rotation.y=Math.PI/2;town.add(homeSign);
  const inner=consolidate(innerAsset.scene);interior.add(inner);
  const hallSign=sign('EST PREP',4.0);hallSign.position.set(0,4.65,-6.68);interior.add(hallSign);
  const stations=[{id:'content',name:'CORE',x:-3.5,z:1.5,colour:0x2e8481},{id:'glossary',name:'TERM',x:3.5,z:1.5,colour:0x927331},{id:'decoder',name:'VTCS',x:-3.5,z:-3.5,colour:0x466faa},{id:'boss',name:'BOSS',x:3.5,z:-3.5,colour:0x9d5368}];
  for(const s of stations){const plaque=sign(s.name,1.04);plaque.position.set(s.x,1.47,s.z+.10);interior.add(plaque);const light=new THREE.PointLight(s.colour,2,3);light.position.set(s.x,1.7,s.z);interior.add(light);}
  // Stronger daytime sun + hemisphere
  const sun=new THREE.DirectionalLight(0xfff2d8,4.2);sun.position.set(-18,36,24);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-36;sun.shadow.camera.right=36;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-32;sun.shadow.camera.far=110;sun.shadow.normalBias=.035;town.add(sun);
  town.add(new THREE.HemisphereLight(0xe8f6ff,0x7d9168,2.15));
  town.add(new THREE.AmbientLight(0xddeeff,.35));
  interior.add(new THREE.HemisphereLight(0xe2eeee,0x6c6a55,2.2));
  const innerSun=new THREE.DirectionalLight(0xffe8c7,2);innerSun.position.set(-5,9,6);interior.add(innerSun);
  const trunkGeo=new THREE.CylinderGeometry(.13,.25,3.3,7),crownGeo=new THREE.IcosahedronGeometry(1,1);
  const count=68,trunks=new THREE.InstancedMesh(trunkGeo,materials.trunk,count),crowns=new THREE.InstancedMesh(crownGeo,materials.leaf,count*3);
  trunks.castShadow=crowns.castShadow=true;trunks.receiveShadow=crowns.receiveShadow=true;town.add(trunks,crowns);
  if(usingPlazaGlb){trunks.visible=false;crowns.visible=false;}
  const matrix=new THREE.Object3D(),treePositions=[];
  for(let i=0;i<count;i++){
    let x,z;
    if(i<10){x=(i%2?1:-1)*(10.5+rand()*2);z=-5+Math.floor(i/2)*6.3;}
    else{const a=rand()*Math.PI*2,r=30+rand()*32;x=Math.cos(a)*r;z=Math.sin(a)*r;}
    const height=3.8+rand()*2.8;treePositions.push({x,z});matrix.position.set(x,1.6,z);matrix.scale.set(1,height/4,1);matrix.rotation.set(0,rand()*3,0);matrix.updateMatrix();trunks.setMatrixAt(i,matrix.matrix);
    for(let j=0;j<3;j++){matrix.position.set(x+(j-1)*.7,height-.6+(j%2)*.8,z+(j%2)*.5);matrix.scale.set(1.15+rand()*.35,1.6+rand()*.65,1.2);matrix.updateMatrix();crowns.setMatrixAt(i*3+j,matrix.matrix);}
  }
  const garden=new THREE.Group();town.add(garden);
  for(const x of [-4.4,4.4])for(const z of [-7,-3,13]){
    box(garden,1.15,.42,2.2,materials.edge,x,.21,z);
    box(garden,1.0,.05,2.0,basic(0x3e4235),x,.44,z);
  }
  const flowers=new THREE.Group();town.add(flowers);const flowerMats=[basic(0xe7bd57),basic(0xce6889),basic(0xe3e5d9)];
  for(let i=0;i<90;i++){const x=(i%2?1:-1)*(4.15+rand()*.5),z=[-7,-3,13][i%3]+(rand()-.5)*1.8;
    mesh(flowers,new THREE.IcosahedronGeometry(.07,0),flowerMats[i%3],x,.58+rand()*.15,z);
  }
  const planting=new THREE.Group();town.add(planting);
  for(const x of [-4.4,4.4])for(const z of [-7,-3,13])for(let i=0;i<5;i++)mesh(planting,new THREE.ConeGeometry(.14,.28,5),materials.leaf,x+(i%2-.5)*.48,.59,z-.75+i*.35);
  const fountain=new THREE.Group();town.add(fountain);fountain.position.set(0,0,4);
  mesh(fountain,new THREE.CylinderGeometry(1.75,1.85,.4,48),materials.edge,0,.2,0);
  const water=mesh(fountain,new THREE.CylinderGeometry(1.61,1.61,.025,48),materials.water,0,.418,0);
  mesh(fountain,new THREE.CylinderGeometry(.22,.34,1.25,20),materials.edge,0,.9,0);
  mesh(fountain,new THREE.CylinderGeometry(.8,.7,.16,32),materials.edge,0,1.54,0);
  const spray=mesh(fountain,new THREE.CylinderGeometry(.018,.035,1.0,8),new THREE.MeshStandardMaterial({color:0xc2e6e2,transparent:true,opacity:.55}),0,2.1,0);
  const pond=mesh(town,new THREE.CircleGeometry(7.5,64),materials.water,23,.025,-10);pond.rotation.x=-Math.PI/2;pond.scale.set(1,.75,1);
  const bank=mesh(town,new THREE.RingGeometry(7.45,8.1,64),materials.edge,23,.015,-10);bank.rotation.x=-Math.PI/2;bank.scale.set(1,.75,1);
  const lights=[];
  for(const z of [-6,2,12,22])for(const x of [-5.7,5.7]){
    mesh(town,new THREE.CylinderGeometry(.035,.065,2.7,8),basic(0x314442),x,1.35,z);
    box(town,.28,.44,.28,basic(0xbec6b7),x,2.75,z);
    const m=new THREE.MeshStandardMaterial({color:0xb9e3db,emissive:0x76c8c7,emissiveIntensity:1});lights.push(m);
    box(town,.22,.33,.22,m,x,2.76,z);
  }
  for(const x of [-6.7,6.7])for(const z of [1,10]){
    for(let j=0;j<4;j++)box(town,1.7,.055,.095,basic(0x796549),x,.53,z+j*.11);
    for(const dx of [-.67,.67])box(town,.055,.48,.43,materials.edge,x+dx,.25,z+.16);
    box(town,1.7,.25,.065,basic(0x796549),x,.82,z+.4);
  }
  const wear=new THREE.Group();town.add(wear);
  const crackMat=basic(0x5d6257);
  for(let i=0;i<45;i++){
    const z=-6+rand()*29,x=(rand()-.5)*5.2;
    const crack=box(wear,.025,.007,.3+rand()*.6,crackMat,x,.089,z);crack.rotation.y=rand()*Math.PI;
  }
  const closedWings=new THREE.Group();town.add(closedWings);const boarding=basic(0x626659);
  for(const x of [-6.45,6.45])for(const y of [1.2,1.83,2.42]){const plank=box(closedWings,2.15,.22,.08,boarding,x,y,-10.48);plank.rotation.z=(y===1.83?-.13:.08);}
  for(let i=0;i<18;i++){const x=(i%2?1:-1)*(7.4+rand()*.6),z=-9.7+rand()*.7;const chip=mesh(closedWings,new THREE.DodecahedronGeometry(.07+rand()*.09,0),materials.edge,x,.09,z);chip.scale.set(1.4,.6,1);}
  const restorations=new THREE.Group();town.add(restorations);
  for(const x of [-8.25,8.25]){
    for(const z of [-11,-16])box(restorations,.075,5.7,.075,basic(0x797e73),x,2.85,z);
    for(const y of [1.8,3.6,5.4])box(restorations,.9,.08,5.5,basic(0x9a8b67),x,y,-13.5);
  }
  // The same fixed colliders are used in every appearance state.
  function physics(inside){
    const world=new RAPIER.World({x:0,y:-9.81,z:0});
    const block=(x,y,z,w,h,d)=>world.createCollider(RAPIER.ColliderDesc.cuboid(w/2,h/2,d/2).setTranslation(x,y,z));
    block(0,-.1,0,120,.2,120);
    if(inside){block(-7.3,3,0,.35,6,14);block(7.3,3,0,.35,6,14);block(0,3,-7,15,6,.35);block(0,3,7.3,15,6,.35);
      for(const s of stations)block(s.x,.65,s.z,2.35,1.3,1.1);
    }else{
      // Large flat walkable plate (GLB mesh collision skipped — keep gameplay simple).
      // block(0,-.1,0,120,.2,120) already covers the district floor.
      if(!usingPlazaGlb){
        // Match expanded plaza path colliders (walkable) when procedural paths are shown.
        block(0,.04,4,7.2,.08,46);block(0,.04,6.5,42,.08,5.2);block(0,.045,-8.2,16,.09,7.2);
        block(-14.5,.04,5.2,14,.07,3.4);block(14,.04,7.8,12,.07,3.2);block(0,.04,18,4.5,.07,10);
        world.createCollider(RAPIER.ColliderDesc.cylinder(.045,9.4).setTranslation(0,.045,4));
      }
      block(0,.12,-9.85,7,.24,2.6);
      block(0,3,-14,16,6,6.7);block(0,2,-11.3,5.8,4,2.8);block(-17,2,5,4.0,4,7.2);
      if(!usingPlazaGlb)world.createCollider(RAPIER.ColliderDesc.cylinder(.45,1.8).setTranslation(0,.45,4));
      world.createCollider(RAPIER.ColliderDesc.cylinder(2,7.4).setTranslation(23,1,-10));
      for(const t of treePositions.slice(0,10))world.createCollider(RAPIER.ColliderDesc.cylinder(2,.27).setTranslation(t.x,2,t.z));
      for(const x of [-4.4,4.4])for(const z of [-7,-3,13])block(x,.3,z,1.15,.6,2.2);
    }
    const body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,inside?.8:.9,inside?5:17));
    const collider=world.createCollider(RAPIER.ColliderDesc.capsule(.56,.20),body);
    const controller=world.createCharacterController(.025);controller.enableAutostep(.27,.15,true);controller.enableSnapToGround(.3);controller.setSlideEnabled(true);
    return {world,body,collider,controller,block,verticalVelocity:0};
  }
  const townPhysics=physics(false),interiorPhysics=physics(true);
  function phase(name){
    const p=PHASES[name];if(!p)throw new Error('Unknown world phase');
    // Keep albedo maps; tint lightly via material color for phase mood.
    materials.ground.color.set(grassMap?0xffffff:p.grass);materials.leaf.color.set(p.leaf);materials.path.color.set(stoneMap?0xffffff:(name==='disrepair'?0xa3a292:0xd0d0bf));
    for(const root of [est,home,inner])root.traverse(o=>{if(!o.isMesh)return;const m=o.material;const key=m.name.replace(/\.\d+$/,'');
      if(key==='Stone'){m.color.set(p.stone);m.roughness=name==='disrepair'?.99:.83;}if(key==='Trim')m.color.set(p.trim);if(key==='Roof')m.color.set(p.roof);if(key==='Glass'){m.color.set(p.glass);m.roughness=name==='disrepair'?.7:name==='growth'?.35:.2;}
      if(key==='Light')m.emissiveIntensity=p.light;if(key==='Warm')m.emissiveIntensity=p.light*.6;
    });
    lights.forEach((m,i)=>m.emissiveIntensity=name==='disrepair'?(i<2?.15:0):p.light);
    flowers.visible=name!=='disrepair';flowers.children.forEach((o,i)=>o.visible=name==='flourishing'||i%3===0);planting.visible=name!=='disrepair';closedWings.visible=name==='disrepair';
    water.visible=name!=='disrepair';spray.visible=name==='flourishing';wear.visible=name==='disrepair'&&!usingPlazaGlb;restorations.visible=name==='growth';
  }
  phase('disrepair');
  if(usingPlazaGlb){
    // Plaza mesh already has landscaping; hide leftover greybox props that float through it.
    for(const g of [garden,flowers,planting,fountain,pond,bank,wear,closedWings,restorations])if(g)g.visible=false;
  }
  return {town,interior,townPhysics,interiorPhysics,est,stations,phase,
    plazaGlb:usingPlazaGlb,
    plazaGround:usingPlazaGlb?{scale:PLAZA_GROUND.scale,position:PLAZA_GROUND.position.slice(),url:PLAZA_GROUND.url}:null,
    plazaTextures:{grass:!!grassMap,stone:!!stoneMap,asphalt:!!asphaltMap,dash:!!dashMap,crosswalk:!!crosswalkMap,curb:!!curbMap},
    update(time){if(spray.visible)spray.scale.y=1+Math.sin(time*3)*.075;materials.water.roughness=.2+Math.sin(time*.8)*.025;},
    move(inside,delta){const physics=inside?interiorPhysics:townPhysics;physics.verticalVelocity=physics.controller.computedGrounded()?-.1:Math.max(-12,physics.verticalVelocity-9.81/60);physics.controller.computeColliderMovement(physics.collider,{x:delta.x,y:physics.verticalVelocity/60,z:delta.z});const movement=physics.controller.computedMovement(),p=physics.body.translation();const next={x:p.x+movement.x,y:p.y+movement.y,z:p.z+movement.z};
      next.x=Math.max(inside?-6.9:-27,Math.min(inside?6.9:27,next.x));next.z=Math.max(inside?-6.8:-25,Math.min(inside?6.9:29,next.z));physics.body.setNextKinematicTranslation(next);physics.world.step();return {x:next.x,y:next.y-.785,z:next.z};},
    position(inside){const p=(inside?interiorPhysics:townPhysics).body.translation();return new THREE.Vector3(p.x,p.y-.785,p.z);},
    teleport(inside,x,z){const p=inside?interiorPhysics:townPhysics;p.verticalVelocity=0;p.body.setTranslation({x,y:inside?.8:.9,z},true);p.body.setNextKinematicTranslation({x,y:inside?.8:.9,z});p.world.step();}
  };
}
