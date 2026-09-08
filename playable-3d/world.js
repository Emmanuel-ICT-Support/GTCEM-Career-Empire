/**
 * Modular tile-kit plaza ground (Career Empire daytime campus).
 * ~2wu tiles stamped from a 2D grid: grass / path / asphalt / plaza (+ curb overlays).
 * phase() recolours type-kit materials only — layout is never rebuilt.
 * Tripo plaza-day-ground.glb whole-map plate is unused (rejected as unusable).
 */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import RAPIER from '@dimforge/rapier3d-compat';
import {treeKit,homeModel} from './scenery.js?v=scenery-1';
import {PHASES} from './profiles.js';

const TILE=2;
const TILE_HALF=TILE/2;
/** District tile indices cover roughly ±26 world units around town centre. */
const GRID_MIN=-13;
const GRID_MAX=13;

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

/** Classify a tile centre (wx,wz) into grass | path | asphalt | plaza. Asphalt wins roads. */
function classifyTile(wx,wz){
  const plazaCx=0,plazaCz=4,plazaR=9.4;
  // Asphalt road strips (charcoal campus roads framing the plaza).
  if(Math.abs(wx-18.5)<TILE_HALF+1.2&&wz>=-16&&wz<=26)return 'asphalt';
  if(Math.abs(wx+22)<TILE_HALF+1.2&&wz>=-10&&wz<=22)return 'asphalt';
  if(Math.abs(wz-24)<TILE_HALF+1.1&&wx>=-24&&wx<=22)return 'asphalt';
  if(Math.abs(wz+18)<TILE_HALF+1.0&&wx>=-18&&wx<=18)return 'asphalt';
  // Central circular stone plaza pad (fountain sits at 0,4).
  if(Math.hypot(wx-plazaCx,wz-plazaCz)<=plazaR)return 'plaza';
  // N-S flagstone avenue toward EST (z≈-14) and spawn (z≈17).
  if(Math.abs(wx)<3.6&&wz>=-12&&wz<=22)return 'path';
  // E-W cross path through plaza.
  if(Math.abs(wz-6.5)<2.6&&Math.abs(wx)<21)return 'path';
  // EST approach apron.
  if(Math.abs(wx)<8&&wz>=-12&&wz<=-6)return 'path';
  // Home Base sidewalk spur (west).
  if(wx>=-22&&wx<=-7&&wz>=3.2&&wz<=6.8)return 'path';
  // East gardens spur.
  if(wx>=7&&wx<=20&&wz>=6&&wz<=9.6)return 'path';
  // Spawn approach spur (south).
  if(Math.abs(wx)<2.5&&wz>=14&&wz<=23)return 'path';
  return 'grass';
}

/** Phase tints multiply albedo maps (flourishing = bright white). */
const TILE_TINTS={
  disrepair:{grass:0x9aa090,path:0xa8a698,asphalt:0x707278,plaza:0xa3a292,curb:0x6a9094},
  growth:{grass:0xd0e0c0,path:0xeae6da,asphalt:0xc4c6cc,plaza:0xe4e0d4,curb:0xb0d8dc},
  flourishing:{grass:0xffffff,path:0xffffff,asphalt:0xffffff,plaza:0xffffff,curb:0xffffff},
};

/**
 * Build InstancedMesh kits for each tile type from the stamped grid.
 * Planes are Y-up on y≈0 and receive shadows.
 */
function buildTileKits(town,materials){
  const buckets={grass:[],path:[],asphalt:[],plaza:[]};
  for(let iz=GRID_MIN;iz<=GRID_MAX;iz++){
    for(let ix=GRID_MIN;ix<=GRID_MAX;ix++){
      const wx=ix*TILE+TILE_HALF;
      const wz=iz*TILE+TILE_HALF;
      buckets[classifyTile(wx,wz)].push({x:wx,z:wz});
    }
  }
  const elev={grass:0,path:.02,asphalt:.03,plaza:.04};
  const kits={};
  const plane=new THREE.PlaneGeometry(TILE,TILE);
  plane.rotateX(-Math.PI/2);
  const matrix=new THREE.Object3D();
  for(const type of Object.keys(buckets)){
    const cells=buckets[type];
    const mat=materials[type];
    const inst=new THREE.InstancedMesh(plane,mat,cells.length);
    inst.name=`tile-kit-${type}`;
    inst.castShadow=false;
    inst.receiveShadow=true;
    inst.frustumCulled=false;
    for(let i=0;i<cells.length;i++){
      matrix.position.set(cells[i].x,elev[type],cells[i].z);
      matrix.rotation.set(0,0,0);
      matrix.scale.set(1,1,1);
      matrix.updateMatrix();
      inst.setMatrixAt(i,matrix.matrix);
    }
    inst.instanceMatrix.needsUpdate=true;
    town.add(inst);
    kits[type]={mesh:inst,material:mat,count:cells.length};
  }
  return {kits,buckets};
}

export async function createWorlds(onProgress=()=>{}){
  const physicsReady=RAPIER.init();
  const loader=new GLTFLoader();
  const draco=new DRACOLoader();
  // Decoder matches three r180 / gltf-transform Draco meshes; CDN keeps vendor tree light.
  draco.setDecoderPath('./vendor/draco/');
  loader.setDRACOLoader(draco);
  const exteriorReady=loader.loadAsync('./assets/est-exterior.glb');
  onProgress('Loading plaza textures and town buildings...');
  // Daytime plaza PNG kit (procedural canvas fallback if a map is missing).
  // Per-tile UVs are 0–1, so repeat stays at 1 (seamless maps tile across instances).
  const texturesReady=Promise.all([
    tryLoadPlazaMap('./assets/plaza/grass_day.png',1,1),
    tryLoadPlazaMap('./assets/plaza/stone_flag_day.png',1,1),
    tryLoadPlazaMap('./assets/plaza/asphalt_day.png',1,1),
    tryLoadPlazaMap('./assets/plaza/asphalt_dash_overlay.png',1,8),
    tryLoadPlazaMap('./assets/plaza/crosswalk_overlay.png',1,1),
    tryLoadPlazaMap('./assets/plaza/curb_cyan_trim.png',12,1),
  ]);
  const [outerAsset,,maps]=await Promise.all([exteriorReady,physicsReady,texturesReady]);
  const [grassMap,stoneMap,asphaltMap,dashMap,crosswalkMap,curbMap]=maps;
  onProgress('Building the learning district...');
  const town=new THREE.Scene(),interior=new THREE.Scene();
  // Brighter daytime sky / fog (clean campus, not portal neon).
  town.background=new THREE.Color(0xc8e6f2);town.fog=new THREE.Fog(0xc8e6f2,64,175);
  interior.background=new THREE.Color(0xc4c2b4);

  const materials={
    grass:basic(0x7fad5e,.92),
    path:basic(0xd4d2c6,.78),
    asphalt:basic(0x3a3c42,.94),
    plaza:basic(0xc8c4b6,.72),
    leaf:basic(0x487e47),
    trunk:basic(0x605344),
    edge:basic(0xb4b7a8),
    water:new THREE.MeshStandardMaterial({color:0x4b9baf,metalness:.5,roughness:.2}),
  };
  const grassTex=grassMap||texture('grass');if(!grassMap)grassTex.repeat.set(1,1);
  materials.grass.map=grassTex;materials.grass.color.set(0xffffff);
  const stoneTex=stoneMap||texture('stone');if(!stoneMap)stoneTex.repeat.set(1,1);
  materials.path.map=stoneTex;materials.path.bumpMap=stoneTex;materials.path.bumpScale=.028;materials.path.color.set(0xffffff);
  materials.plaza.map=stoneTex;materials.plaza.bumpMap=stoneTex;materials.plaza.bumpScale=.032;materials.plaza.color.set(0xffffff);
  const roadTex=asphaltMap||texture('asphalt');if(!asphaltMap)roadTex.repeat.set(1,1);
  materials.asphalt.map=roadTex;materials.asphalt.color.set(0xffffff);

  const dashMat=new THREE.MeshStandardMaterial({map:dashMap||null,color:dashMap?0xffffff:0xf0c828,transparent:true,opacity:dashMap?1:.9,depthWrite:false,roughness:.85,side:THREE.DoubleSide});
  const crossMat=new THREE.MeshStandardMaterial({map:crosswalkMap||null,color:crosswalkMap?0xffffff:0xf2f2f6,transparent:true,opacity:crosswalkMap?1:.92,depthWrite:false,roughness:.8,side:THREE.DoubleSide});
  const curbMat=new THREE.MeshStandardMaterial({map:curbMap||null,color:curbMap?0xffffff:0x5ec8d4,transparent:true,opacity:curbMap?1:.45,depthWrite:false,roughness:.55,metalness:.15,side:THREE.DoubleSide,emissive:0x1a6a72,emissiveIntensity:.12});

  // --- Modular tile kits (replaces Tripo plate + pathGroup/roadGroup boxes) ---
  const {kits:tileKits}=buildTileKits(town,materials);

  // Road / path marking overlays (thin planes above asphalt & path).
  const marks=new THREE.Group();marks.name='tile-overlays';town.add(marks);
  // Yellow dashed centre lines on asphalt strips.
  planeOverlay(marks,1.1,42,dashMat,18.5,.055,5);
  planeOverlay(marks,1.1,30,dashMat,-22,.055,6);
  planeOverlay(marks,1.0,44,dashMat,-1,.056,24,Math.PI/2);
  planeOverlay(marks,1.0,34,dashMat,0,.056,-18,Math.PI/2);
  // Zebra crosswalks where roads meet plaza paths.
  planeOverlay(marks,7.5,4.2,crossMat,18.5,.062,6.5,Math.PI/2);
  planeOverlay(marks,7.5,4.2,crossMat,18.5,.062,24,Math.PI/2);
  planeOverlay(marks,7.5,4.2,crossMat,-22,.062,5.2,Math.PI/2);
  planeOverlay(marks,6.5,4.0,crossMat,0,.062,24);
  planeOverlay(marks,6.5,4.0,crossMat,0,.062,-15.5);
  // Restrained cyan curb accents along N-S avenue + cross path edges.
  planeOverlay(marks,0.35,40,curbMat,-3.7,.07,4);
  planeOverlay(marks,0.35,40,curbMat,3.7,.07,4);
  planeOverlay(marks,38,0.35,curbMat,0,.071,4.0);
  planeOverlay(marks,38,0.35,curbMat,0,.071,9.0);

  const est=consolidate(outerAsset.scene);est.position.z=-14;town.add(est);
  const estSign=sign('EST PREP',3.3);estSign.position.set(0,5.73,-10.1);town.add(estSign);
  const home=est.clone(true);home.scale.setScalar(.45);home.position.set(-17,0,5.0);home.rotation.y=Math.PI/2;town.add(home);
  const homeSign=sign('HOME BASE',1.8);homeSign.position.set(-14.9,2.58,5.0);homeSign.rotation.y=Math.PI/2;town.add(homeSign);
  const inner=new THREE.Group();interior.add(inner);
  let interiorLoad,currentPhase='flourishing';
  function ensureInterior(){
    if(!interiorLoad)interiorLoad=loader.loadAsync('./assets/est-interior.glb').then(asset=>{
      inner.add(consolidate(asset.scene));phase(currentPhase);
    }).catch(error=>{interiorLoad=null;throw error;});
    return interiorLoad;
  }
  const hallSign=sign('EST PREP',4.0);hallSign.position.set(0,4.65,-6.68);interior.add(hallSign);
  const stations=[{id:'content',name:'CORE',x:-3.5,z:1.5,colour:0x2e8481},{id:'glossary',name:'TERM',x:3.5,z:1.5,colour:0x927331},{id:'decoder',name:'VTCS',x:-3.5,z:-3.5,colour:0x466faa},{id:'boss',name:'BOSS',x:3.5,z:-3.5,colour:0x9d5368}];
  for(const s of stations){const plaque=sign(s.name,1.04);plaque.position.set(s.x,1.47,s.z+.10);interior.add(plaque);const light=new THREE.PointLight(s.colour,2,3);light.position.set(s.x,1.7,s.z);interior.add(light);}
  // Stronger daytime sun + hemisphere
  const sun=new THREE.DirectionalLight(0xfff2d8,4.2);sun.position.set(-18,36,24);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-36;sun.shadow.camera.right=36;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-32;sun.shadow.camera.far=110;sun.shadow.normalBias=.035;town.add(sun);
  town.add(new THREE.HemisphereLight(0xe8f6ff,0x7d9168,2.15));
  town.add(new THREE.AmbientLight(0xddeeff,.35));
  interior.add(new THREE.HemisphereLight(0xe2eeee,0x6c6a55,2.2));
  const innerSun=new THREE.DirectionalLight(0xffe8c7,2);innerSun.position.set(-5,9,6);interior.add(innerSun);
  // Clean upright trees: vertical cylinder trunk + cone crown (no random X/Z tilt).
  const trunkGeo=new THREE.CylinderGeometry(.12,.22,1,8);
  const crownGeo=new THREE.ConeGeometry(1,1.6,8);
  const count=36;
  const trunks=new THREE.InstancedMesh(trunkGeo,materials.trunk,count);
  const crowns=new THREE.InstancedMesh(crownGeo,materials.leaf,count);
  trunks.castShadow=crowns.castShadow=true;trunks.receiveShadow=crowns.receiveShadow=true;town.add(trunks,crowns);
  const matrix=new THREE.Object3D(),treePositions=[];
  const treeBlocked=(x,z)=>{
    // Keep clear of Home Base / Avatar Studio, EST facade, and central plaza pad.
    if(Math.hypot(x+17,z-5)<7.5)return true;
    if(Math.hypot(x,z+14)<10)return true;
    if(Math.hypot(x,z-4)<11)return true;
    // Keep clear of asphalt road corridors.
    if(Math.abs(x-18.5)<4&&z>-16&&z<26)return true;
    if(Math.abs(x+22)<4&&z>-10&&z<22)return true;
    return false;
  };
  for(let i=0;i<count;i++){
    let x,z,tries=0;
    do{
      if(i<8){x=(i%2?1:-1)*(13+rand()*3.5);z=-1+Math.floor(i/2)*7.2;}
      else{const a=rand()*Math.PI*2,r=22+rand()*18;x=Math.cos(a)*r;z=Math.sin(a)*r;}
      tries++;
    }while(treeBlocked(x,z)&&tries<40);
    if(treeBlocked(x,z)){x=(i%2?1:-1)*(22+rand()*4);z=16+rand()*6;}
    const trunkH=2.2+rand()*1.4;
    const crownH=2.4+rand()*1.6;
    const crownR=1.05+rand()*.55;
    const yaw=rand()*Math.PI*2;
    treePositions.push({x,z,height:trunkH+crownH*.92,yaw});
    // Trunk: unit-height cylinder scaled to trunkH; base sits on y≈0.
    matrix.position.set(x,trunkH/2,z);
    matrix.scale.set(1,trunkH,1);
    matrix.rotation.set(0,yaw,0);
    matrix.updateMatrix();
    trunks.setMatrixAt(i,matrix.matrix);
    // Cone crown centered above trunk top; upright only (Y rot).
    matrix.position.set(x,trunkH+crownH*0.42,z);
    matrix.scale.set(crownR,crownH/1.6,crownR);
    matrix.rotation.set(0,yaw+rand()*0.6,0);
    matrix.updateMatrix();
    crowns.setMatrixAt(i,matrix.matrix);
  }
  trunks.instanceMatrix.needsUpdate=true;
  crowns.instanceMatrix.needsUpdate=true;
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
  // Flat walkable ground + building / prop colliders (same bounds as before).
  function physics(inside){
    const world=new RAPIER.World({x:0,y:-9.81,z:0});
    const block=(x,y,z,w,h,d)=>world.createCollider(RAPIER.ColliderDesc.cuboid(w/2,h/2,d/2).setTranslation(x,y,z));
    block(0,-.1,0,120,.2,120);
    if(inside){block(-7.3,3,0,.35,6,14);block(7.3,3,0,.35,6,14);block(0,3,-7,15,6,.35);block(0,3,7.3,15,6,.35);
      for(const s of stations)block(s.x,.65,s.z,2.35,1.3,1.1);
    }else{
      block(0,.12,-9.85,7,.24,2.6);
      block(0,3,-14,16,6,6.7);block(0,2,-11.3,5.8,4,2.8);block(-17,2,5,4.0,4,7.2);
      world.createCollider(RAPIER.ColliderDesc.cylinder(.45,1.8).setTranslation(0,.45,4));
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
    const p=PHASES[name];if(!p)throw new Error('Unknown world phase');currentPhase=name;
    const tint=TILE_TINTS[name]||TILE_TINTS.flourishing;
    // Swap tile-kit material tints (maps stay; colour multiply drives phase mood).
    materials.grass.color.set(tint.grass);
    materials.path.color.set(tint.path);
    materials.asphalt.color.set(tint.asphalt);
    materials.plaza.color.set(tint.plaza);
    curbMat.color.set(tint.curb);
    curbMat.emissiveIntensity=name==='flourishing'?.12:name==='growth'?.06:0;
    materials.leaf.color.set(p.leaf);
    for(const root of [est,home,inner])root.traverse(o=>{if(!o.isMesh)return;const m=o.material;const key=m.name.replace(/\.\d+$/,'');
      if(key==='Stone'){m.color.set(p.stone);m.roughness=name==='disrepair'?.99:.83;}if(key==='Trim')m.color.set(p.trim);if(key==='Roof')m.color.set(p.roof);if(key==='Glass'){m.color.set(p.glass);m.roughness=name==='disrepair'?.7:name==='growth'?.35:.2;}
      if(key==='Light')m.emissiveIntensity=p.light;if(key==='Warm')m.emissiveIntensity=p.light*.6;
    });
    importedTrees?.phase(name);
    importedHome?.traverse(o=>{if(o.isMesh)o.material.color.set(name==='disrepair'?0xa4a394:name==='growth'?0xd7d5c8:0xffffff);});
    lights.forEach((m,i)=>m.emissiveIntensity=name==='disrepair'?(i<2?.15:0):p.light);
    flowers.visible=name!=='disrepair';flowers.children.forEach((o,i)=>o.visible=name==='flourishing'||i%3===0);planting.visible=name!=='disrepair';closedWings.visible=name==='disrepair';
    water.visible=name!=='disrepair';spray.visible=name==='flourishing';wear.visible=name==='disrepair';restorations.visible=name==='growth';
  }
  const scenery={status:'pending',trees:0,home:false,errors:[]};
  let importedTrees,importedHome,sceneryLoad;
  function loadScenery(){
    if(sceneryLoad)return sceneryLoad;
    scenery.status='loading';
    const trees=Promise.all([loader.loadAsync('./assets/scenery/tree.glb'),loader.loadAsync('./assets/scenery/tree-low.glb')]).then(([high,low])=>{
      importedTrees=treeKit(town,high,low,treePositions);importedTrees.phase(currentPhase);
      // Keep the existing trees until the new instances have their first matrices.
      scenery.trees=treePositions.length;
    }).catch(error=>{scenery.errors.push('Trees: '+error.message);console.warn('Keeping fallback trees',error);});
    const building=loader.loadAsync('./assets/scenery/city.glb').then(asset=>{
      importedHome=homeModel(asset);town.add(importedHome);home.visible=false;
      homeSign.position.y=1.5;scenery.home=true;phase(currentPhase);
    }).catch(error=>{scenery.errors.push('Home Base: '+error.message);console.warn('Keeping fallback Home Base',error);});
    sceneryLoad=Promise.all([trees,building]).then(()=>{scenery.status=scenery.errors.length?'fallback':'ready';});
    return sceneryLoad;
  }
  phase('flourishing');
  return {loadScenery,scenery,ensureInterior,town,interior,townPhysics,interiorPhysics,est,stations,phase,
    tileKits:{grass:tileKits.grass.count,path:tileKits.path.count,asphalt:tileKits.asphalt.count,plaza:tileKits.plaza.count},
    plazaTextures:{grass:!!grassMap,stone:!!stoneMap,asphalt:!!asphaltMap,dash:!!dashMap,crosswalk:!!crosswalkMap,curb:!!curbMap},
    update(time,camera){if(importedTrees&&camera){importedTrees.update(time,camera);trunks.visible=crowns.visible=false;scenery.lod=importedTrees.stats();}if(spray.visible)spray.scale.y=1+Math.sin(time*3)*.075;materials.water.roughness=.2+Math.sin(time*.8)*.025;},
    move(inside,delta){const physics=inside?interiorPhysics:townPhysics;physics.verticalVelocity=physics.controller.computedGrounded()?-.1:Math.max(-12,physics.verticalVelocity-9.81/60);physics.controller.computeColliderMovement(physics.collider,{x:delta.x,y:physics.verticalVelocity/60,z:delta.z});const movement=physics.controller.computedMovement(),p=physics.body.translation();const next={x:p.x+movement.x,y:p.y+movement.y,z:p.z+movement.z};
      next.x=Math.max(inside?-6.9:-27,Math.min(inside?6.9:27,next.x));next.z=Math.max(inside?-6.8:-25,Math.min(inside?6.9:29,next.z));physics.body.setNextKinematicTranslation(next);physics.world.step();return {x:next.x,y:next.y-.785,z:next.z};},
    position(inside){const p=(inside?interiorPhysics:townPhysics).body.translation();return new THREE.Vector3(p.x,p.y-.785,p.z);},
    teleport(inside,x,z){const p=inside?interiorPhysics:townPhysics;p.verticalVelocity=0;p.body.setTranslation({x,y:inside?.8:.9,z},true);p.body.setNextKinematicTranslation({x,y:inside?.8:.9,z});p.world.step();}
  };
}
