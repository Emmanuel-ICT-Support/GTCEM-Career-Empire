import {boardView,clampBoardOrbit,boardZoom,overviewPose,shouldOverview} from './parallel/gameplay/board-camera.mjs?v=readable-board-20261112';
import {addShowcaseBase,attachShowcaseDetails} from './parallel/pieces/showcase-pieces.mjs';
import { buildPlazaDoors, plazaDoorLayout, posePlazaDoors } from './parallel/gameplay/plaza-doors.mjs';
import * as T from './vendor/three.module.js';
import { labels, startingPieces, legalMoves, squareName, territoryEffects } from './board-rules.mjs';

const el = id => document.getElementById(id);
const status = el('status');
const sceneHost = el('scene');
const controls = el('controls');
let reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer, scene, camera, gates, pieces, squares, active, motion, opening, open;
let frame;
let traffic=[];
let finale=null;
let finaleStart=0;
const cameraGoal=new T.Vector3();
const cameraFocus=new T.Vector3();
let boardOrbit=null;
let overviewStart=null,overviewElapsed=0,pendingOverview=false;
const overviewButton=document.createElement('button');
overviewButton.id='skip-overview';overviewButton.textContent='Skip overview · Play now';overviewButton.hidden=true;
sceneHost.append(overviewButton);
function finishOverview(){overviewStart=null;pendingOverview=false;overviewButton.hidden=true;}
overviewButton.onclick=finishOverview;
function startOverview(){if(reduce){finishOverview();return;}pendingOverview=false;overviewElapsed=0;overviewStart=performance.now();boardOrbit=null;overviewButton.hidden=false;}
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{reduce=event.matches;if(reduce)finishOverview();});
const orbitTarget=new T.Vector3();

function zoomBoard(factor) {
  if(!open||motion)return;
  finishOverview();
  const target=shared?new T.Vector3(0,.2,0):active ? active.root.position.clone().add(new T.Vector3(0,.48,0)) : new T.Vector3();
  if(!boardOrbit||!orbitTarget.equals(target)) {
    orbitTarget.copy(target);
    boardOrbit=new T.Spherical().setFromVector3(camera.position.clone().sub(orbitTarget));
  }
  boardOrbit.phi=T.MathUtils.clamp(boardOrbit.phi,.035,1.49);
  boardOrbit.radius=T.MathUtils.clamp(boardOrbit.radius*factor,active?1.65:3.3,24);
  if(shared)clampBoardOrbit(boardOrbit);
}
const focusGoal=new T.Vector3();
const ray = new T.Raycaster();
const pointer = new T.Vector2();
const artReview = new URLSearchParams(location.search).has('art');
el('roster').textContent='Teal · Student A    Amber · Student B';
if(artReview)sceneHost.style.maxHeight='52vw';
const rigAssets=new Map();
let artTile=null;
let artView='board';
let lastFrame=0;
const shared = new URLSearchParams(location.search).has('match') && parent!==window;
const perthScene=artReview||shared;
const gateLayout=plazaDoorLayout(perthScene);
let sharedState;
const materials = new Map();
const territoryBadges = new Map();
const territoryTextures = new Map();
function material(color) {
  if (!materials.has(color)) materials.set(color,new T.MeshStandardMaterial({color,roughness:.8}));
  return materials.get(color);
}
const cube = new T.BoxGeometry(1,1,1);
const sphere = new T.SphereGeometry(1,14,8);
const cylinder = new T.CylinderGeometry(1,1,1,20);
function shape(parent, geometry, color, size, position) {
  const mesh = new T.Mesh(geometry, material(color));
  mesh.scale.set(...size);
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}
const box = (parent,color,size,pos) => shape(parent,cube,color,size,pos);
const ball = (parent,color,size,pos) => shape(parent,sphere,color,size,pos);
const jobPlaqueMaterials=new Map();
const jobPlaqueGeometry=new T.PlaneGeometry(.68,.17);
function addJobPlaques(root,code,team) {
  const key=team+code;
  if(!jobPlaqueMaterials.has(key)){
    const canvas=document.createElement('canvas');
    canvas.width=512;canvas.height=128;
    const context=canvas.getContext('2d');
    const title=labels[code];
    const lines={
      SD:['Software','Developer'],
      RE:['Renewable Energy','Technician'],
      EC:['Early Childhood','Educator'],
    }[code]??[title];
    context.fillStyle=team==='A'?'#14413e':'#674020';
    context.fillRect(0,0,512,128);
    context.strokeStyle='#f4ce83';
    context.lineWidth=6;
    context.strokeRect(8,8,496,112);
    context.font=lines.length===1?'bold 66px system-ui':'bold 49px system-ui';
    context.textAlign='center';
    context.textBaseline='middle';
    context.fillStyle='#fff5da';
    lines.forEach((line,index)=>context.fillText(line,256,
      lines.length===1?64:38+52*index,460));
    const map=new T.CanvasTexture(canvas);
    map.colorSpace=T.SRGBColorSpace;
    map.anisotropy=4;
    jobPlaqueMaterials.set(key,new T.MeshBasicMaterial({map}));
  }
  for(const side of [-1,1]){
    const plaque=new T.Mesh(jobPlaqueGeometry,jobPlaqueMaterials.get(key));
    plaque.position.set(0,.153,side*.285);
    plaque.rotation.set(-Math.PI/3,side<0?Math.PI:0,0,'YXZ');
    root.add(plaque);
  }
}
async function loadArt() {
  const [{GLTFLoader},{clone}]=await Promise.all([
    import('./vendor/loaders/GLTFLoader.js'),import('./vendor/utils/SkeletonUtils.js')
  ]);
  const loader=new GLTFLoader();
  const load=name=>loader.loadAsync('./art/'+name+'.glb');
  const textureLoader=new T.TextureLoader();
  const [base,atlas,panorama]=await Promise.all([
    load('studio-walking-base'),textureLoader.loadAsync('./art/waterfront-facades.png'),
    textureLoader.loadAsync('./art/perth-dusk-panorama.jpg')
  ]);
  skylineMap=panorama;
  skylineMap.colorSpace=T.SRGBColorSpace;
  shopAtlas=atlas;
  shopAtlas.colorSpace=T.SRGBColorSpace;
  shopAtlas.anisotropy=8;
  await Promise.all([
    ['CP','occupational-top-work','occupational-pants-tradie',0x897254,0x3e5058,'shoes-boots','hair-sweep'],
    ['NS','hospital-scrub-top','occupational-pants-scrubs',0x61aab9,0x477f8d,'shoes-clogs','hair-bob'],
    ['EL','occupational-top-work','occupational-pants-tradie',0x247886,0x283f48,'shoes-boots','hair-bob'],
    ['SD','occupational-top-work','occupational-pants-tradie',0x7774a9,0x303d52,'shoes-clogs','hair-sweep'],
    ['RE','occupational-top-work','occupational-pants-tradie',0xb3bb45,0x334352,'shoes-boots','hair-sweep'],
    ['EC','occupational-top-work','occupational-pants-tradie',0xb85578,0x434465,'shoes-clogs','hair-bob'],
  ].map(async ([code,top,bottom,topColour,bottomColour,shoes,hair])=>{
    const model=clone(base.scene);
    const bones=new Map();
    model.traverse(node=>{if(node.isBone)bones.set(node.name,node);});
    model.updateMatrixWorld(true);
    const garments=await Promise.all([load(top),load(bottom),load('neckline-skin'),load(shoes),load(hair)]);
    for(const [i,garment] of garments.entries()) {
      garment.scene.updateMatrixWorld(true);
      const meshes=[];
      garment.scene.traverse(mesh=>{if(mesh.isSkinnedMesh)meshes.push(mesh);});
      for(const mesh of meshes) {
        const mapped=mesh.skeleton.bones.map(bone=>bones.get(bone.name));
        if(mapped.some(bone=>!bone))throw Error('Garment rig mismatch: '+mesh.name);
        const skeleton=new T.Skeleton(mapped,mesh.skeleton.boneInverses.map(matrix=>matrix.clone()));
        const bind=mesh.bindMatrix.clone();
        model.attach(mesh);mesh.bind(skeleton,bind);
        const tint=source=>{
          const m=source.clone();
          if(/^(Top_|Pants_|Scrub_)/.test(m.name)) {
            m.color.set(i===0?topColour:bottomColour);
            if(/Trim|Contrast|Seam|Stitch/.test(m.name))m.color.multiplyScalar(.72);
          }
          return m;
        };
        mesh.material=Array.isArray(mesh.material)?mesh.material.map(tint):tint(mesh.material);
      }
    }
    const source=base.animations[0];
    const walk=source.clone();walk.name='walk';
    const tracks=source.tracks.map(track=>{
      const size=track.getValueSize();
      const values=Array.from(track.values.slice(0,size));
      return new track.constructor(track.name,[0,1],[...values,...values]);
    });
    const idle=new T.AnimationClip('standing_relax',1,tracks);
    rigAssets.set(code,{gltf:{scene:model,animations:[idle,walk]},clone});
  }));
}
function installRig(body,code,equipment) {
  const asset=rigAssets.get(code);
  if(!asset)return null;
  const model=asset.clone(asset.gltf.scene);
  model.updateMatrixWorld(true);
  const bounds=new T.Box3().setFromObject(model);
  const scale=1.12/(bounds.max.y-bounds.min.y);
  const center=bounds.getCenter(new T.Vector3());
  model.scale.setScalar(scale);
  model.position.set(-center.x*scale,.07-bounds.min.y*scale,-center.z*scale);
  model.traverse(object=>{if(object.isMesh){object.castShadow=true;object.receiveShadow=true;}});
  body.clear();
  body.add(model);
  if(!attachShowcaseDetails(body,model,code)) {
    const rightHand=model.getObjectByName('R_Hand');
    const leftHand=model.getObjectByName('L_Hand');
    const head=model.getObjectByName('Head');
    const torso=model.getObjectByName('Spine02');
    const carry=new T.Group();
    const wearable=new T.Group();
    body.add(carry,wearable);
    for(const prop of [...equipment.children]) {
      if(prop.position.y>1) wearable.add(prop);
      else if(prop.position.x>.17) carry.add(prop);
    }
    body.updateMatrixWorld(true);
    const grip=rightHand.getWorldPosition(new T.Vector3());
    body.worldToLocal(grip);
    const gripOffsets={CP:[.27,.59,.12],NS:[.25,.708,.11],EL:[.25,.782,.10],RE:[.28,.72,.14],SD:[.22,.57,.16],EC:[.22,.65,.15]};
    carry.position.copy(grip).sub(new T.Vector3(...gripOffsets[code]));
    rightHand.attach(carry);
    head.attach(wearable);
    const outfit=new T.Group();
    body.add(outfit);
    if(code==='CP') {
      box(outfit,0x583f2d,[.29,.064,.18],[0,.62,0]);
      box(outfit,0xb5834d,[.105,.14,.085],[-.12,.56,.075]);
      const timber=new T.Group();
      body.add(timber);
      const leftGrip=body.worldToLocal(leftHand.getWorldPosition(new T.Vector3()));
      timber.position.copy(leftGrip);
      const plank=box(timber,0xd1a371,[.105,.56,.073],[-.041,.025,0]);
      plank.rotation.x=-.78;
      plank.rotation.z=-.12;
      leftHand.attach(timber);
    } else if(code==='EL'||code==='RE') {
      for(const x of [-.079,.079]) {
        box(outfit,0xe8efbc,[.028,.23,.015],[x,.78,.091]);
        box(outfit,0xe8efbc,[.028,.23,.015],[x,.78,-.091]);
      }
      box(outfit,0xc3c4a6,[.24,.025,.19],[0,.68,0]);
    } else if(code==='SD') {
      ball(outfit,0x534e80,[.122,.084,.07],[0,.86,-.069]);
    } else if(code==='EC') {
      box(outfit,0xa34765,[.21,.30,.018],[0,.69,.093]);
      box(outfit,0xe492a4,[.14,.069,.023],[0,.61,.105]);
    } else {
      box(outfit,0xe4f4f0,[.061,.045,.014],[-.063,.82,.098]);
    }
    torso.attach(outfit);
  }
  const mixer=new T.AnimationMixer(model);
  const idle=mixer.clipAction(asset.gltf.animations.find(clip=>clip.name==='standing_relax'));
  const walk=mixer.clipAction(asset.gltf.animations.find(clip=>clip.name==='walk'));
  idle.play();
  return {mixer,idle,walk,playing:idle};
}
function animateRig(piece,moving,dt) {
  const rig=piece.rig;
  if(!rig)return;
  const next=moving?rig.walk:rig.idle;
  if(next!==rig.playing) {
    rig.playing.fadeOut(.14);
    next.reset().fadeIn(.14).play();
    rig.playing=next;
  }
  rig.mixer.update(dt);
}
function figure({id,code,team,col,row}) {
  const root=new T.Group();
  const body=new T.Group();
  root.add(body);
  const uniform={EL:0x287187,CP:0x98663d,NS:0x80c8e2,SD:0x6d729d,RE:0xc0c94e,EC:0xb86d83}[code];
  body.position.y=addShowcaseBase(root,team);
  addJobPlaques(root,code,team);
  box(body,uniform,[.29,.33,.17],[0,.64,0]);
  box(body,0x243d48,[.30,.055,.18],[0,.79,0]);
  box(body,0xe4e8d8,[.072,.045,.014],[-.066,.71,.092]);
  box(body,0x334751,[.082,.073,.021],[.074,.60,.094]);
  box(body,0x263942,[.28,.055,.19],[0,.48,0]);
  const limbs=[];
  for(const side of [-1,1]) {
    const leg=new T.Group();leg.position.set(side*.075,.47,0);body.add(leg);
    box(leg,code==='NS'?uniform:0x344956,[.12,.29,.12],[0,-.15,0]);
    box(leg,0x293138,[.14,.10,.20],[0,-.31,.035]);
    const arm=new T.Group();arm.position.set(side*.19,.75,0);body.add(arm);
    box(arm,uniform,[.095,.19,.105],[0,-.09,0]);
    ball(arm,0xc58d70,[.055,.065,.05],[0,-.21,0]);
    limbs.push({leg,arm,side});
  }
  ball(body,0xd8a184,[.113,.135,.105],[0,.91,0]);
  for(const x of [-.041,.041])ball(body,0x30373a,[.013,.016,.009],[x,.928,.096]);
  if (['EL','CP','RE'].includes(code)) {
    ball(body,code==='CP'?0xf4a638:0xf1d15d,[.144,.084,.128],[0,1,0]);
    shape(body,cylinder,0xf0ce58,[.153,.027,.145],[0,.97,.017]);
  } else ball(body,0x393434,[.118,.065,.108],[0,.999,0]);
  // Keep occupation props when swapping in the walking rig.
  const equipment=new T.Group();
  body.add(equipment);
  if (['EL','RE'].includes(code)) {
    if(rigAssets.has(code)) {
      ball(equipment,0xf1d15d,[.117,.062,.112],[0,1.145,0]);
      shape(equipment,cylinder,0xf0ce58,[.124,.017,.122],[0,1.118,.012]);
    } else {
      for (const x of [-.085,.085]) box(equipment,0xe9f4cc,[.035,.26,.19],[x,.66,0]);
    }
  }
  if(code==='CP') {
    if(!rigAssets.has(code)) {
      box(equipment,0x643c27,[.37,.085,.23],[0,.49,0]);
      for (const x of [-.14,.14]) box(equipment,0xbf884e,[.10,.13,.09],[x,.44,.11]);
      const timber=box(equipment,0xe5b579,[.12,.64,.095],[-.23,.57,-.12]);
      timber.rotation.z=-.20;
    }
    box(equipment,0xc9965d,[.055,.30,.065],[.27,.60,.12]);
    box(equipment,0xc7d7dc,[.22,.075,.095],[.27,.76,.12]);
  } else if(code==='NS') {
    box(equipment,0xf4f4e9,[.24,.20,.13],[.25,.56,.11]);
    for(const x of [.20,.30]) box(equipment,0x425e63,[.021,.051,.029],[x,.68,.11]);
    box(equipment,0x425e63,[.12,.021,.029],[.25,.708,.11]);
    box(equipment,0xd83f48,[.15,.035,.012],[.25,.56,.18]);
    box(equipment,0xd83f48,[.035,.15,.012],[.25,.56,.18]);
    box(equipment,0xe2eff0,[.14,.034,.024],[0,.69,.10]);
  } else if(code==='RE') {
    const panel=new T.Group();
    equipment.add(panel);panel.position.set(.28,.61,.14);panel.rotation.z=-.18;
    box(panel,0xdce6e5,[.31,.33,.046],[0,0,0]);
    for(let row=0;row<3;row++) for(let col=0;col<3;col++)
      box(panel,0x1b467e,[.081,.086,.016],[(col-1)*.089,(row-1)*.094,.029]);
  } else if(code==='SD') {
    box(equipment,0x222936,[.38,.045,.23],[.22,.51,.18]);
    box(equipment,0x252e43,[.38,.24,.038],[.22,.64,.08]);
    box(equipment,0x68d6e4,[.31,.17,.012],[.22,.64,.103]);
    for (const y of [.59,.63,.67]) box(equipment,0x1a4d64,[.22,.012,.016],[.22,y,.113]);
  } else if(code==='EL') {
    box(equipment,0xf3b22d,[.22,.28,.12],[.25,.59,.10]);
    for(const x of [.20,.30]) box(equipment,0x344452,[.021,.051,.029],[x,.752,.10]);
    box(equipment,0x344452,[.12,.021,.029],[.25,.782,.10]);
    box(equipment,0x244550,[.14,.078,.012],[.25,.66,.17]);
    ball(equipment,0x374044,[.043,.043,.01],[.25,.56,.17]);
    const lead=new T.TorusGeometry(.09,.016,8,18,Math.PI*1.7);
    shape(equipment,lead,0xd54b3e,[1,1,1],[.25,.45,.18]);
  } else {
    const book=new T.Group();equipment.add(book);book.position.set(.22,.58,.15);
    for(const side of [-1,1]) {
      const cover=box(book,0xc84170,[.17,.23,.034],[side*.08,0,0]);
      cover.rotation.y=side*.23;
      const page=box(book,0xffeab3,[.145,.20,.023],[side*.077,0,.022]);
      page.rotation.y=side*.23;
    }
    for(const [x,color] of [[-.20,0xeaaf38],[-.08,0x62c9a2]])
      box(equipment,color,[.095,.095,.095],[x,.49,.12]);
  }
  body.traverse(mesh=>{if(mesh.isMesh)mesh.castShadow=true;});
  const rig=installRig(body,code,equipment);
  body.scale.setScalar(rig?1:1.13);
  root.position.set(col-3.5,.025,row-3.5);
  body.rotation.y=team==='A'?Math.PI:0;
  scene.add(root);
  return {id,root,body,limbs,code,team,col,row,rig};
}
function sign(value,width,height,arcade=false,style={}) {
  const canvas=document.createElement('canvas');
  canvas.width=512;canvas.height=96;
  const context=canvas.getContext('2d');
  context.fillStyle=style.background??(arcade?'#18332e':'#183a45');
  context.fillRect(0,0,512,96);
  if(arcade) {
    context.strokeStyle='#dbab55';
    context.lineWidth=3;
    context.strokeRect(8,8,496,80);
  }
  context.fillStyle=arcade?'#ffd78e':'#fff4dc';
  context.font=style.font??'bold 47px system-ui';
  context.textAlign='center';context.textBaseline='middle';
  context.fillText(value,256,48,480);
  const map=new T.CanvasTexture(canvas);
  if(style.background)map.colorSpace=T.SRGBColorSpace;
  return new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map}));
}
function masonryMap(kind) {
  const canvas=document.createElement('canvas');
  canvas.width=256;canvas.height=256;
  const ctx=canvas.getContext('2d');
  const random=(x,y)=>((Math.sin(x*71.3+y*151.7)*43758.5453)%1+1)%1;
  ctx.fillStyle=kind==='brick'?'#8e8070':'#a8a494';
  ctx.fillRect(0,0,256,256);
  const rows=kind==='brick'?12:4;
  const cols=kind==='brick'?5:4;
  const w=256/cols,h=256/rows;
  for(let row=0;row<rows;row++)for(let col=-1;col<cols;col++) {
    const x=col*w+(row%2)*w/2,y=row*h;
    const light=kind==='brick'?57+random(col,row)*14:73+random(col,row)*13;
    ctx.fillStyle=`hsl(${kind==='brick'?25:38} 16% ${light}%)`;
    ctx.fillRect(x+1,y+1,w-2,h-2);
    ctx.fillStyle='#fff2';ctx.fillRect(x+2,y+2,w-4,1);
    ctx.fillStyle='#28251d24';ctx.fillRect(x+2,y+h-3,w-4,1);
  }
  for(let i=0;i<1300;i++) {
    ctx.fillStyle=i%2?'#29282214':'#fff2';
    ctx.fillRect(random(i,1)*256,random(i,2)*256,1+random(i,3)*2,1);
  }
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
  map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  return map;
}
let plazaMap, facadeMap, shopAtlas, skylineMap, waterMaterial, entranceSigns;
function tileMaterial(color) {
  const m=material(color);
  if(perthScene&&!m.map){m.map=plazaMap;m.needsUpdate=true;}
  return m;
}
function buildWaterfront() {
  const stone=0xd8bb92, brass=0xbd8b49, glass=0x56858b, dark=0x263f46;
  box(scene,stone,[16.5,.2,12],[-2.75,-.47,-.9]);
  const shoreZ=x=>-3.65+(x-5.5)*.66;
  const quayFootprint=new T.Shape();
  quayFootprint.moveTo(5.5,-shoreZ(5.5));
  quayFootprint.lineTo(11,-shoreZ(11));
  quayFootprint.lineTo(11,-5.5);
  quayFootprint.lineTo(5.5,-5.5);
  quayFootprint.closePath();
  const quayMap=plazaMap.clone();
  quayMap.wrapS=quayMap.wrapT=T.RepeatWrapping;
  quayMap.repeat.set(.85,.85);
  quayMap.needsUpdate=true;
  const quaySurface=new T.Mesh(new T.ShapeGeometry(quayFootprint),
    new T.MeshStandardMaterial({color:0xd1a283,map:quayMap,roughness:.85}));
  quaySurface.rotation.x=-Math.PI/2;
  quaySurface.position.y=-.34;
  quaySurface.receiveShadow=true;
  scene.add(quaySurface);
  box(scene,stone,[27,.20,18.8],[.5,-.47,13.85]);
  for(const [x,z,w,d] of [[-5.8,.1,2.6,9],[5.18,.2,.64,8.4],[0,-4.36,9.6,.65],[.5,13.85,27,18.8],[-8.3,.15,2.4,9.1]]) {
    const paving=box(scene,0xd1a283,[w,.024,d],[x,-.352,z]);
    const map=plazaMap.clone();
    map.wrapS=map.wrapT=T.RepeatWrapping;
    map.repeat.set(w*.85,d*.85);
    map.needsUpdate=true;
    paving.material=paving.material.clone();
    paving.material.map=map;
    paving.receiveShadow=true;
  }
  waterMaterial=new T.ShaderMaterial({
    uniforms:{time:{value:0},panorama:{value:skylineMap}},
    vertexShader:`varying vec3 waterWorld;
      void main(){
        vec4 world=modelMatrix*vec4(position,1.0);
        waterWorld=world.xyz;
        gl_Position=projectionMatrix*viewMatrix*world;
      }`,
    fragmentShader:`varying vec3 waterWorld; uniform float time; uniform sampler2D panorama;
      void main(){
        vec2 world=waterWorld.xz;
        float depth=clamp((-world.y-2.0)/24.0,0.0,1.0);
        float wave=sin(world.y*9.7+world.x*2.34+time*.85);
        float crossWave=sin(world.y*13.8-world.x*3.51-time*.65);
        float wash=sin(world.y*2.34+sin(world.x*1.39)*1.3-time*.28);
        float chop=wave*.42+crossWave*.34+wash*.24;
        float sparkle=smoothstep(.40,.91,chop);
        float grazing=pow(1.0-abs(normalize(cameraPosition-waterWorld).y),2.5);
        vec3 deep=vec3(.015,.09,.17);
        vec3 sky=vec3(.16,.34,.53);
        vec3 colour=mix(deep,sky,.20+depth*.19+grazing*.38+chop*.045);
        float reflectedX=clamp(.5+(world.x-1.5)/63.0+chop*.003,0.0,1.0);
        vec3 reflection=texture2D(panorama,vec2(reflectedX,.20+depth*.095)).rgb;
        colour=mix(colour,reflection,grazing*(.12+depth*.32));
        float lights=0.0;
        for(int i=0;i<6;i++){
          float centre=12.3+float(i)*1.23;
          float dx=(world.x-centre+chop*.45)/(.21+(1.0-depth)*.36);
          lights+=exp(-dx*dx);
        }
        colour+=sparkle*vec3(.026,.047,.064)*(.28+grazing*.72);
        colour+=lights*(.018+sparkle*.34)*vec3(1.0,.50,.20)*smoothstep(.14,.73,depth)*grazing;
        gl_FragColor=vec4(colour,1.0);
        #include <colorspace_fragment>
      }`
  });
  const river=new T.Mesh(new T.PlaneGeometry(200,200),waterMaterial);
  river.rotation.x=-Math.PI/2;river.position.set(0,-.532,-15.0);scene.add(river);
  box(scene,0x9e8164,[16.5,.3,.36],[-2.75,-.43,-6.82]);
  box(scene,0x9e8164,[.26,.30,3.2],[5.56,-.43,-5.21]);
  // A stepped sandstone quay separates the board promenade from the river.
  for(let block=0;block<12;block++) {
    const x=5.62+block*.46;
    const coping=box(scene,0xe1be94,[.56,.073,.41],[x,-.36,shoreZ(x)]);
    const course=box(scene,block%2?0xaf896a:0xbe9774,[.56,.20,.37],[x,-.48,shoreZ(x)]);
    coping.rotation.y=course.rotation.y=-Math.atan(.66);
  }
  for(const x of [6.15,8.44,10.25]) {
    const bench=new T.Group();
    bench.position.set(x,-.33,shoreZ(x)+.72);
    bench.rotation.y=Math.PI-Math.atan(.66);
    scene.add(bench);
    for(const side of [-1,1]) {
      box(bench,0x40362e,[.058,.22,.28],[side*.37,.11,0]);
      box(bench,0x40362e,[.05,.32,.055],[side*.37,.25,-.12]);
    }
    for(let slat=0;slat<4;slat++) {
      box(bench,0x98603b,[.86,.035,.053],[0,.228,-.083+slat*.055]);
      box(bench,0xae7444,[.86,.043,.027],[0,.286+slat*.045,-.127]);
    }
  }
  // South Perth's diagonal quay faces a separate city bank beneath the panorama.
  const cityShoreZ=x=>-21.4-x*.22;
  const cityLand=new T.Shape();
  cityLand.moveTo(-23,-cityShoreZ(-23));
  cityLand.lineTo(33,-cityShoreZ(33));
  cityLand.lineTo(33,36);
  cityLand.lineTo(-23,36);
  cityLand.closePath();
  const cityBank=new T.Mesh(new T.ShapeGeometry(cityLand),
    new T.MeshStandardMaterial({color:0x485044,roughness:.94,fog:false}));
  cityBank.rotation.x=-Math.PI/2;
  cityBank.position.y=-.36;
  scene.add(cityBank);
  const cityQuay=box(scene,0x4a504e,[57.36,.19,.34],[5,-.458,cityShoreZ(5)]);
  cityQuay.rotation.y=Math.atan(.22);
  cityQuay.material=new T.MeshStandardMaterial({color:0x454a4a,roughness:.87,fog:false});
  const walkway=box(scene,0x786d60,[57.36,.032,.72],[5,-.357,cityShoreZ(5)-.48]);
  walkway.rotation.y=cityQuay.rotation.y;
  walkway.material=new T.MeshStandardMaterial({color:0x746b5c,roughness:.90,fog:false});
  const canopyMaterial=new T.MeshStandardMaterial({color:0x435a42,roughness:.95,fog:false});
  for(const x of [-16.3,-12.8,-7.1,-4.2,1.3,4.1,5.6,8.0,11.8,22.6,25.3,28.4]){
    const height=.27+Math.abs(Math.sin(x*1.71))*.39;
    const tree=ball(scene,0x435a42,[.76,height,.60],[x,-.34+height*.61,cityShoreZ(x)-1.25]);
    tree.material=canopyMaterial;
  }
  const southLanding=new T.Vector3(7.35,0,shoreZ(7.35)+.58);
  const cityLanding=new T.Vector3(15.2,0,cityShoreZ(15.2)-.75);
  const crossing=cityLanding.clone().sub(southLanding);
  const bridge=new T.Group();
  bridge.position.copy(southLanding).lerp(cityLanding,.5);
  bridge.position.y=-.09;
  bridge.scale.set(crossing.length()/7.8,1.74,1.65);
  bridge.rotation.y=Math.atan2(-crossing.z,crossing.x);
  scene.add(bridge);
  for(const landing of [southLanding,cityLanding]){
    const approach=box(scene,0xb79c80,[1.88,.20,1.85],[landing.x,-.255,landing.z]);
    approach.rotation.y=bridge.rotation.y;
  }
  const bridgeDeck=box(bridge,0x9f8875,[7.8,.10,.58],[0,-.08,0]);
  bridgeDeck.castShadow=true;
  for(const side of [-1,1]) {
    box(bridge,0xd9cfbd,[7.76,.024,.024],[0,.085,side*.28]);
    for(let post=0;post<28;post++)
      box(bridge,0x81796e,[.014,.124,.018],[-3.78+post*.28,.023,side*.28]);
  }
  // Offset white ribs cross in projection while sweeping to opposite deck edges.
  const bridgeRibs=[
    [[-3.56,-.03,.26],[-2.43,2.05,-.36],[-.98,1.57,-.44],[.76,-.03,-.25]],
    [[-1.24,-.03,-.25],[-.05,1.43,.43],[1.37,1.83,.37],[3.46,-.03,.25]],
  ];
  for(const points of bridgeRibs){
    const rib=new T.CubicBezierCurve3(...points.map(point=>new T.Vector3(...point)));
    shape(bridge,new T.TubeGeometry(rib,48,.052,10,false),0xf1e6d4,[1,1,1],[0,0,0]);
    for(let cable=1;cable<10;cable++){
      const top=rib.getPoint(cable/10);
      const bottom=new T.Vector3(top.x,-.03,Math.sign(top.z)*.24);
      const span=top.clone().sub(bottom);
      const hanger=shape(bridge,cylinder,0xd0c9bc,[.011,span.length(),.011],
        bottom.lerp(top,.5).toArray());
      hanger.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),span.normalize());
    }
  }
  for(const x of [-3.74,-.36,3.74])
    box(bridge,0x937861,[.23,.34,.70],[x,-.37,0]);
  for(let i=0;i<12;i++) {
    const x=5.7+i*.46;
    shape(scene,cylinder,0x4d6264,[.031,.32,.031],[x,-.12,shoreZ(x)+.10]);
    ball(scene,0xc8a568,[.045,.045,.045],[x,.04,shoreZ(x)+.10]);
  }
  // The distant skyline is a painted set behind the live quay, bridge and tower.
  const skyline=new T.Mesh(new T.PlaneGeometry(86,47/3),new T.ShaderMaterial({
    uniforms:{panorama:{value:skylineMap}},
    transparent:true,depthWrite:false,toneMapped:false,
    vertexShader:`varying vec2 panoramaUV;
      void main(){
        panoramaUV=uv;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }`,
    fragmentShader:`varying vec2 panoramaUV; uniform sampler2D panorama;
      void main(){
        vec2 edge=min(panoramaUV,1.0-panoramaUV);
        float opacity=smoothstep(0.0,.19,edge.x)
          *smoothstep(0.0,.12,1.0-panoramaUV.y)*smoothstep(0.0,.10,panoramaUV.y);
        gl_FragColor=vec4(texture2D(panorama,panoramaUV).rgb,opacity);
        #include <colorspace_fragment>
      }`
  }));
  skyline.position.set(.55,4.94,-25);
  skyline.rotation.y=.28;
  // Blend with the sky before drawing transparent glazing in the plaza.
  skyline.renderOrder=-1;
  scene.add(skyline);
  const towerX=18.6;
  const towerZ=cityShoreZ(towerX)-1.7;
  const tower=new T.Group();
  tower.position.set(towerX,-.36,towerZ);
  tower.scale.set(2.45,2.55,2.45);
  scene.add(tower);
  box(scene,0xb59c7f,[4.4,.17,3.35],[towerX,-.38,towerZ]);
  box(tower,0xb19577,[1.18,.17,1.04],[0,.085,0]);
  const profile=[[0,.37],[.18,.37],[.48,.33],[1.25,.24],[1.99,.16],[2.55,.111],[3.14,.064],[3.64,.022],[3.92,.004]];
  const glazingCore=new T.Mesh(
    new T.LatheGeometry(profile.map(([y,radius])=>new T.Vector2(radius,y)),8),
    new T.MeshPhysicalMaterial({color:0x168780,roughness:.25,metalness:.22,
      clearcoat:.85,emissive:0x053832,emissiveIntensity:.52}));
  tower.add(glazingCore);
  for(const [[low,base],[high,tip]] of profile.slice(1).map((point,i)=>[profile[i],point])) {
    if(low===0)continue;
    shape(tower,new T.CylinderGeometry(tip+.009,tip+.009,.021,8),0x23514b,[1,1,1],[0,high,0]);
    for(let facet=0;facet<8;facet++){
      const angle=facet*Math.PI/4;
      const from=new T.Vector3(Math.sin(angle)*base,low,Math.cos(angle)*base);
      const to=new T.Vector3(Math.sin(angle)*tip,high,Math.cos(angle)*tip);
      const span=to.clone().sub(from);
      const rail=shape(tower,cylinder,0x285e53,[.010,span.length(),.010],from.lerp(to,.5).toArray());
      rail.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),span.normalize());
    }
  }
  // Copper shells bow around the lower core in plan as well as tapering in elevation.
  const copper=new T.MeshStandardMaterial({color:0xb07555,metalness:.43,roughness:.46,
    side:T.DoubleSide,vertexColors:true});
  const shellRows=36,shellColumns=20;
  for(const side of [-1,1]){
    const vertices=[],indices=[],colors=[];
    for(let row=0;row<=shellRows;row++){
      const height=row/shellRows;
      const radius=.12+.56*Math.pow(1-height,.67)+.095*Math.sin(Math.PI*height);
      const width=1.30*Math.pow(1-height,.62);
      for(let column=0;column<=shellColumns;column++){
        const angle=(column/shellColumns-.50)*width+.13*Math.sin(height*Math.PI);
        vertices.push(side*Math.cos(angle)*radius,.16+height*1.93,Math.sin(angle)*radius);
        const shade=1-(row%3===0?.13:0)-(column%5===0?.05:0);
        colors.push(shade,shade,shade);
        if(row&&column){
          const index=vertices.length/3-1;
          indices.push(index,index-1,index-shellColumns-2,index,index-shellColumns-2,index-shellColumns-1);
        }
      }
    }
    const shell=new T.BufferGeometry();
    shell.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
    shell.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    shell.setIndex(indices);
    shell.computeVertexNormals();
    tower.add(new T.Mesh(shell,copper));
  }
  // Shallow faceted balcony lips leave the teal glazing legible between levels.
  for(let level=0;level<5;level++){
    const y=.52+level*.27;
    const radius=.42-level*.037;
    const lip=new T.CylinderGeometry(radius,radius-.045,.049,8,1,true,Math.PI*.26,Math.PI*.48);
    shape(tower,lip,0xc1c4ba,[1,1,1],[0,y,0]);
  }
  shape(tower,cylinder,0xd0bc93,[.008,.24,.008],[0,4.01,0]);
  const glazingPanels=new T.MeshStandardMaterial({color:0x317e79,metalness:.33,
    roughness:.31,emissive:0x0c3c34,emissiveIntensity:.6});
  for(let level=0;level<7;level++){
    const y=.34+level*.215;
    const radius=.356-level*.024;
    const panel=new T.Mesh(new T.BoxGeometry(radius*.78,.145,.015),glazingPanels);
    panel.position.set(0,y,radius);
    tower.add(panel);
  }
  const landmarkMaterials=new Map();
  tower.traverse(object=>{
    if(!object.isMesh)return;
    if(!landmarkMaterials.has(object.material)){
      const clear=object.material.clone();
      clear.fog=false;
      landmarkMaterials.set(object.material,clear);
    }
    object.material=landmarkMaterials.get(object.material);
  });

  // Black swans sit above the animated surface, with a broken wake behind them.
  for(const [x,z,heading] of [[7.5,-4.55,.72],[8.27,-4.93,.54],[9.1,-5.55,.97]]) {
    const swan=new T.Group();
    swan.position.set(x,-.49,z);
    swan.rotation.y=heading;
    swan.scale.setScalar(1.20);
    scene.add(swan);
    ball(swan,0x212730,[.112,.055,.21],[0,.043,0]);
    ball(swan,0x323643,[.092,.035,.137],[0,.078,-.037]);
    const neck=new T.CatmullRomCurve3([[0,.067,.10],[0,.132,.145],[0,.232,.127],[0,.247,.167]]
      .map(point=>new T.Vector3(...point)));
    shape(swan,new T.TubeGeometry(neck,12,.023,7,false),0x20262d,[1,1,1],[0,0,0]);
    ball(swan,0x212730,[.035,.032,.049],[0,.242,.179]);
    ball(swan,0xc75943,[.021,.015,.037],[0,.231,.227]);
    for(const side of [-1,1]) {
      const wake=box(swan,0x93aeb3,[.015,.003,.29],[side*.12,-.032,-.27]);
      wake.rotation.y=-side*.35;
    }
  }
  const glowCanvas=document.createElement('canvas');
  glowCanvas.width=glowCanvas.height=64;
  const glowContext=glowCanvas.getContext('2d');
  const glow=glowContext.createRadialGradient(32,32,2,32,32,31);
  glow.addColorStop(0,'rgba(255,161,66,.85)');
  glow.addColorStop(.55,'rgba(255,144,55,.34)');
  glow.addColorStop(1,'rgba(255,129,39,0)');
  glowContext.fillStyle=glow;
  glowContext.fillRect(0,0,64,64);
  const glowMap=new T.CanvasTexture(glowCanvas);
  glowMap.colorSpace=T.SRGBColorSpace;
  const poolMaterial=new T.MeshBasicMaterial({
    map:glowMap,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.8
  });
  for(const [x,z,width,depth] of [[-5.93,-1.77,2.25,1.7],[-3,-4.22,2.8,1.1],
    [.51,-4.24,3.2,1.3],[3.83,-4.18,2.7,1.3],[5.6,-3.23,1.2,.8],[7.45,-3.23,1.2,.8]]) {
    const pool=new T.Mesh(new T.PlaneGeometry(width,depth),poolMaterial);
    pool.rotation.x=-Math.PI/2;
    pool.position.set(x,-.329,z);
    scene.add(pool);
  }
  const glazing=new T.MeshPhysicalMaterial({
    color:0x89adb2,metalness:.04,roughness:.22,clearcoat:.62,
    transparent:true,opacity:.12,depthWrite:false
  });
  const shopRow=new T.Group();
  // Raise the storefronts around their pavement datum and widen the main frontage.
  shopRow.scale.set(1.29,1.29,1);
  shopRow.position.set(-.42,.122,.24);
  scene.add(shopRow);
  const names=[
    {x:-4.7,w:2.55,h:2.12,name:'JUNIPER KITCHEN',wall:0xb88758,trim:0x566342},
    {x:-1.95,w:2.60,h:2.16,name:'TECH STUDIO',wall:0x586e75,trim:0x1c3d4b},
    {x:.93,w:2.90,h:2.53,name:'Cockburn Gateway',wall:0x586461,trim:0x96a34e},
    {x:3.65,w:2.43,h:1.82,name:'SAN CHURRO',wall:0x935c48,trim:0x623934},
  ];
  const leftCornerEdges=[];
  for(const [index,{x,w,h,name,wall,trim}] of names.entries()){
    const storefront=new T.Group();
    shopRow.add(storefront);
    const [angle,offsetX,offsetZ]=[
      [.91,-.25,2.70], [.43,-.58,.75], [0,0,0], [-.18,.12,-.28]
    ][index];
    const pivot=new T.Vector3(x,0,-4.8);
    storefront.rotation.y=angle;
    storefront.position.copy(pivot).sub(pivot.clone().applyEuler(storefront.rotation));
    storefront.position.x+=offsetX;
    storefront.position.z+=offsetZ;
    if(index<2) {
      const innerEdge=new T.Vector3(x+(index===0?1:-1)*w*.49,0,-4.82);
      leftCornerEdges.push(innerEdge.applyEuler(storefront.rotation).add(storefront.position));
    }
    const facade=box(storefront,wall,[w,h,.38],[x,h/2-.42,-6.03]);
    facade.material=facade.material.clone();facade.material.map=facadeMap;
    facade.castShadow=true;
    box(storefront,dark,[w+.11,.12,1.69],[x,h-.36,-5.56]);
    const roofY=h-.275;
    if(index<2) {
      box(storefront,0x91725c,[w+.10,.12,.30],[x,1.80,-4.79]);
      box(storefront,0xc2a183,[w+.13,.055,.32],[x,1.885,-4.79]);
    }
    for(const side of [-1,1]) {
      box(storefront,trim,[.057,.14,1.61],[x+side*w*.49,roofY,-5.55]);
      box(storefront,trim,[w,.13,.057],[x,roofY,-5.55+side*.79]);
    }
    box(storefront,wall,[w*.58,.10,.56],[x-.12,roofY,-5.83]);
    for(const offset of [-.21,.21])
      box(storefront,dark,[.19,.095,.21],[x+offset*w,roofY+.072,-5.84]);
    const opening=[.54,.61,.53,.54][index];
    const upperFacade=index===0?.708:opening;
    for(const [start,fraction,depth] of [[0,opening,-5.826],[upperFacade,1-upperFacade,-5.016]]) {
      const atlas=shopAtlas.clone();
      atlas.repeat.set(.248,fraction);atlas.offset.set(index*.25+.001,start);
      atlas.needsUpdate=true;
      const panel=new T.Mesh(new T.PlaneGeometry(w-.035,h*fraction),new T.MeshStandardMaterial({
        map:atlas,roughness:.83,emissive:0xffd7a4,emissiveMap:atlas,emissiveIntensity:.28
      }));
      panel.position.set(x,h*(start+fraction*.5)-.42,depth);
      storefront.add(panel);
    }
    const header=h*opening-.42;
    const paneWidth=(w-.19)/4;
    for(let bay=0;bay<4;bay++) {
      const px=x+(bay-1.5)*paneWidth;
      const pane=new T.Mesh(new T.PlaneGeometry(paneWidth-.046,header+.30),glazing);
      pane.position.set(px,(header-.34)*.5,-4.834);
      storefront.add(pane);
    }
    const interiorLight=new T.PointLight(0xffb064,1.55,2.4,2);
    interiorLight.position.set(x,header-.14,-5.09);
    storefront.add(interiorLight);
    box(storefront,0xc99960,[w-.09,.05,1.03],[x,-.39,-5.35]);
    box(storefront,wall,[w-.09,.055,.86],[x,header,-5.39]);
    for(const side of [-1,1])
      box(storefront,wall,[.08,h,1.15],[x+side*(w/2-.035),h/2-.42,-5.44]);
    const illuminated=new T.MeshStandardMaterial({color:0xffd6a1,emissive:0xffb85c,emissiveIntensity:1.55});
    for(const offset of [-.24,.24]) {
      const px=x+offset*w;
      shape(storefront,cylinder,dark,[.009,.17,.009],[px,header-.08,-5.33]);
      const lamp=ball(storefront,0xffc477,[.09,.046,.08],[px,header-.19,-5.33]);
      lamp.material=illuminated;
      if(index===1) {
        const deskTop=box(storefront,0xa36a39,[.65,.058,.34],[px,.02,-5.29]);
        deskTop.receiveShadow=true;
        for(const leg of [-1,1])
          box(storefront,0x34454a,[.031,.39,.26],[px+leg*.27,-.19,-5.30]);
        box(storefront,0x283c4a,[.30,.195,.036],[px,.185,-5.34]);
        box(storefront,0x32424b,[.035,.085,.031],[px,.077,-5.34]);
        const screen=box(storefront,0x43aeca,[.263,.157,.008],[px,.187,-5.317]);
        screen.material=new T.MeshStandardMaterial({color:0x43aeca,emissive:0x176698,emissiveIntensity:.8});
        for(let bar=0;bar<4;bar++)
          box(storefront,0xb5eee6,[.022,.030+bar*.019,.004],[px+(bar-1.5)*.041,.131+bar*.0095,-5.312]);
        box(storefront,0x30414b,[.23,.018,.082],[px,.06,-5.19]);
        shape(storefront,cylinder,0x313941,[.019,.23,.019],[px,-.25,-5.05]);
        box(storefront,0x3b5459,[.23,.04,.21],[px,-.135,-5.05]);
        box(storefront,0x3b5459,[.23,.22,.028],[px,-.035,-4.958]);
      } else if(index===2) {
        shape(storefront,cylinder,0xb18b62,[.105,.21,.105],[px,-.25,-5.23]);
        for(let leaf=0;leaf<8;leaf++) {
          const angle=leaf*2.39996;
          const sprig=ball(storefront,leaf%2?0x879743:0x5d803a,[.034,.15,.026],
            [px+Math.sin(angle)*.07,-.055,-5.23+Math.cos(angle)*.05]);
          sprig.rotation.set(Math.sin(angle)*.57,angle,Math.cos(angle)*.63);
        }
      } else {
        box(storefront,0x784a2d,[.57,.35,.27],[px,-.18,-5.27]);
        for(let slat=0;slat<5;slat++)
          box(storefront,0xb47d4a,[.53,.022,.013],[px,-.293+slat*.052,-5.128]);
        box(storefront,0xc28849,[.61,.045,.31],[px,.016,-5.27]);
        box(storefront,0x573b2a,[.46,.017,.19],[px,.049,-5.25]);
        for(let item=0;item<5;item++) {
          const pastry=ball(storefront,index===0?0xe2a94d:0xba6c33,[.038,.038,.034],
            [px+(item-2)*.074,.081,-5.24+(item%2)*.049]);
          pastry.rotation.z=(item-2)*.17;
        }
        const display=new T.Mesh(new T.BoxGeometry(.47,.133,.20),glazing);
        display.position.set(px,.105,-5.25);
        storefront.add(display);
      }
    }
    for(const edge of [-1,1]){
      const pier=box(storefront,trim,[.094,h,.37],[x+edge*w*.481,h/2-.42,-4.81]);
      pier.castShadow=true;
    }
    const cornice=box(storefront,trim,[w+.03,.085,.37],[x,h-.43,-4.81]);
    cornice.castShadow=true;
    box(storefront,0xb39b77,[w-.04,.07,.39],[x,-.36,-4.80]);
    const lampMaterial=new T.MeshStandardMaterial({color:0xffd19a,emissive:0xffad53,emissiveIntensity:1.4});
    const canopyY=.62;
    for(const offset of [-.33,.33]) {
      const lamp=ball(storefront,0xffcb86,[.066,.029,.055],[x+offset*w,canopyY,-4.82]);
      lamp.material=lampMaterial;
    }
    if(name==='Cockburn Gateway') {
      for(const offset of [-.44,-.37,.37,.44]) {
        const fin=box(storefront,0xa8b453,[.15,1.12,.24],[x+offset*w,h-.76,-4.69]);
        fin.rotation.z=offset*.29;
        fin.castShadow=true;
      }
    } else {
      const sill=name==='SAN CHURRO'?.44:.50;
      box(storefront,trim,[w-.14,.044,.13],[x,sill,-4.72]);
      for(const offset of [-.28,.28]) {
        box(storefront,trim,[.035,.70,.071],[x+offset*w,.02,-4.727]);
      }
    }
    if(name==='SAN CHURRO') {
      box(storefront,0x4f2629,[w-.10,.30,.24],[x,h-.20,-4.92]);
      box(storefront,0xc28749,[w-.14,.025,.25],[x,h-.049,-4.90]);
      const signTexture=shopAtlas.clone();
      signTexture.repeat.set(.225,.122);
      signTexture.offset.set(.763,.58);
      signTexture.needsUpdate=true;
      const fascia=new T.Mesh(new T.PlaneGeometry(w-.17,.27),new T.MeshStandardMaterial({
        map:signTexture,emissiveMap:signTexture,emissive:0xffd8aa,emissiveIntensity:.32,roughness:.69
      }));
      fascia.position.set(x,h-.20,-4.794);
      storefront.add(fascia);
      box(storefront,0x633638,[w-.14,.29,.10],[x,.74,-4.949]);
      for(const offset of [-.30,0,.30]){
        const mount=x+w*offset;
        box(storefront,0x55322c,[.026,.12,.14],[mount,.79,-4.87]);
        const sconce=ball(storefront,0xffc477,[.061,.026,.055],[mount,.739,-4.787]);
        sconce.material=illuminated;
      }
      for(const offset of [-.36,.36])
        box(storefront,0x8d4f2f,[.034,.39,.10],[x+w*offset,h-.22,-4.82]);
    }
    if(name==='TECH STUDIO'||name==='Cockburn Gateway') {
      const height=name==='TECH STUDIO'?.64:.59;
      box(storefront,trim,[w-.18,.051,.31],[x,height,-4.82]);
      for(const offset of [-.31,-.14,.14,.31])
        box(storefront,trim,[.028,.84,.16],[x+offset*w,height-.44,-4.86]);
    }
    if(name==='JUNIPER KITCHEN'){
      const lintel=upperFacade*h-.42;
      const valanceTop=.93;
      const projection=.81;
      const drop=lintel-valanceTop;
      const clothWidth=w+.13;
      const canopy=box(storefront,0x747846,[clothWidth,.048,Math.hypot(projection,drop)],
        [x,(lintel+valanceTop)/2,-4.96+projection/2]);
      canopy.rotation.x=Math.atan2(drop,projection);
      canopy.castShadow=true;
      const valanceHeight=valanceTop-header;
      const fascia=sign('Juniper Kitchen',clothWidth-.025,valanceHeight,false,
        {background:'#4c522d',font:'bold 62px Georgia'});
      fascia.position.set(x,(valanceTop+header)/2,-4.96+projection+.027);
      storefront.add(fascia);
      box(storefront,0x9b9054,[clothWidth,.027,.056],[x,header,-4.96+projection]);
      box(storefront,0x625c3b,[w-.02,valanceHeight,.032],[x,(valanceTop+header)/2,-5.01]);
      for(const offset of [-.32,.32]){
        const lamp=ball(storefront,0xffc06e,[.068,.045,.066],[x+w*offset,header-.075,-4.45]);
        lamp.material=illuminated;
      }
    }
  }
  // Tie the angled shopfronts together with a sandstone pier and continuous trim.
  const [juniperEdge,techEdge]=leftCornerEdges;
  const cornerSpan=techEdge.clone().sub(juniperEdge);
  const cornerWidth=cornerSpan.length()+.16;
  const corner=new T.Group();
  corner.position.copy(juniperEdge).lerp(techEdge,.5);
  corner.rotation.y=-Math.atan2(cornerSpan.z,cornerSpan.x);
  shopRow.add(corner);
  const cornerWall=box(corner,0xc19972,[cornerWidth,1.91,.20],[0,.535,-.043]);
  cornerWall.material=cornerWall.material.clone();
  cornerWall.material.map=facadeMap;
  cornerWall.castShadow=true;
  for(let course=0;course<6;course++) {
    const y=-.31+course*.31;
    box(corner,course%2?0xd7ad82:0xc69a72,
      [cornerWidth+.014,.293,.036],[0,y,.074]);
  }
  box(corner,0x86664d,[cornerWidth+.04,.12,.27],[0,1.50,-.026]);
  box(corner,0x91725c,[cornerWidth+.06,.36,.27],[0,1.68,-.018]);
  box(corner,0xc2a183,[cornerWidth+.14,.055,.32],[0,1.885,-.018]);
  box(corner,0xc2a17d,[cornerWidth,.075,.24],[0,-.365,-.033]);
  box(corner,0x453a32,[.13,.26,.105],[0,.93,.083]);
  for(const edge of [-1,1]){
    box(corner,0xad815b,[.085,1.87,.16],[edge*(cornerWidth*.46),.53,.112]);
    box(corner,0xdab38b,[.12,.09,.19],[edge*(cornerWidth*.46),1.46,.12]);
  }
  const cornerLamp=ball(corner,0xffc585,[.047,.065,.031],[0,.93,.146]);
  cornerLamp.material=cornerLamp.material.clone();
  cornerLamp.material.emissive.setHex(0xffa84e);
  cornerLamp.material.emissiveIntensity=.8;
  for(const x of [3.12,4.16]){
    shape(shopRow,cylinder,brass,[.025,.89,.025],[x,.03,-4.14]);
    shape(shopRow,new T.ConeGeometry(.47,.22,10),0xf29330,[1,1,1],[x,.53,-4.14]);
    shape(shopRow,cylinder,0xa97546,[.27,.05,.27],[x,-.07,-4.14]);
  }
  for(const [x,z,w,d] of [[-5.78,-1.51,1.58,2.18],[3.94,-4.00,2.08,.66]]) {
    box(scene,0x8d6447,[w,.065,d],[x,-.34,z]);
    const slats=Math.ceil(w/.18);
    for(let i=0;i<slats;i++)
      box(scene,i%2?0xb48153:0xa7744c,[w/slats-.013,.018,d-.035],
        [x+w*((i+.5)/slats-.5),-.30,z]);
  }
  // Café furniture and planted quay frame the view without intruding on the grid.
  for(const [x,z] of [[-6.03,-2.13],[-5.55,-1.24],[3.19,-4.14],[4.46,-4.14]]) {
    shape(scene,cylinder,0xbd8750,[.22,.052,.22],[x,.08,z]);
    if(x<0){
      shape(scene,cylinder,0xf1dfbf,[.040,.068,.040],[x-.057,.14,z+.018]);
      shape(scene,cylinder,0xe6a569,[.059,.012,.059],[x-.057,.109,z+.018]);
      shape(scene,cylinder,0xb67e55,[.038,.074,.038],[x+.074,.15,z-.048]);
      ball(scene,0x708146,[.054,.040,.047],[x+.074,.196,z-.048]);
    }
    shape(scene,cylinder,dark,[.028,.45,.028],[x,-.17,z]);
    for(const side of [-1,1]) {
      const chair=x+side*.29;
      box(scene,0xa56b38,[.15,.05,.18],[chair,-.13,z]);
      box(scene,0xa56b38,[.035,.22,.18],[chair+side*.065,-.03,z]);
      for(const foot of [-1,1])
        box(scene,dark,[.018,.23,.02],[chair+side*.045,-.25,z+foot*.064]);
    }
  }
  const cafeMenu=new T.Group();
  cafeMenu.position.set(-6.33,-.34,-.43);
  cafeMenu.rotation.y=.58;
  scene.add(cafeMenu);
  const menuCanvas=document.createElement('canvas');
  menuCanvas.width=192;menuCanvas.height=256;
  const menuContext=menuCanvas.getContext('2d');
  menuContext.fillStyle='#33382e';
  menuContext.fillRect(0,0,192,256);
  menuContext.fillStyle='#f3dfb7';
  menuContext.textAlign='center';
  menuContext.font='italic 27px Georgia';
  for(const [index,label] of ['Juniper Kitchen','Seasonal lunch','Coffee','Local produce'].entries())
    menuContext.fillText(label,96,49+index*52,171);
  const menuTexture=new T.CanvasTexture(menuCanvas);
  menuTexture.colorSpace=T.SRGBColorSpace;
  const menuFace=new T.Mesh(new T.PlaneGeometry(.35,.47),
    new T.MeshStandardMaterial({map:menuTexture,roughness:.92}));
  menuFace.position.set(0,.33,.08);
  menuFace.rotation.x=-.13;
  cafeMenu.add(menuFace);
  for(const side of [-1,1]){
    const frontLeg=box(cafeMenu,0xa77448,[.038,.62,.042],[side*.184,.305,.072]);
    frontLeg.rotation.x=-.13;
    const backLeg=box(cafeMenu,0x805739,[.036,.62,.043],[side*.184,.305,-.10]);
    backLeg.rotation.x=.27;
  }
  box(cafeMenu,0xc99962,[.40,.035,.045],[0,.568,.044]);
  box(cafeMenu,0xc99962,[.40,.035,.045],[0,.087,.109]);
  // Mixed strap leaves and red flower spikes echo the planting at the Perth quay.
  for(const [x,z] of [[-6.1,2.25],[6.45,shoreZ(6.45)+.46],[9.45,shoreZ(9.45)+.49]]) {
    box(scene,0xb28760,[1.15,.27,.68],[x,-.235,z]);
    box(scene,0x594b3a,[1.02,.045,.55],[x,-.08,z]);
    for(let clump=0;clump<5;clump++) {
      const rootX=x+(clump-2)*.205;
      const rootZ=z+Math.sin(clump*2.4)*.13;
      for(let leaf=0;leaf<8;leaf++) {
        const angle=leaf*2.39996+clump;
        const reach=.08+(leaf%3)*.03;
        const length=.15+(leaf%5)*.026;
        const blade=ball(scene,[0x637535,0x81963f,0xb1a64d][leaf%3],
          [.024,length,.016],[rootX+Math.cos(angle)*reach,length*.66-.07,rootZ+Math.sin(angle)*reach]);
        blade.rotation.set(Math.sin(angle)*.71,angle,Math.cos(angle)*.71);
      }
      const height=.22+(clump%3)*.055;
      shape(scene,cylinder,0x59633b,[.015,height+.09,.015],[rootX,height*.50-.065,rootZ]);
      for(let tip=0;tip<3;tip++) {
        const flower=ball(scene,[0xaa3e39,0xcd5038,0xe67b45][tip],
          [.053-tip*.008,.052,.044-tip*.006],[rootX,height+tip*.046,rootZ]);
        flower.rotation.z=(clump-2)*.1;
      }
    }
  }
  for(const x of [5.6,7.45,9.4]) {
    shape(scene,cylinder,dark,[.043,1.26,.043],[x,.23,shoreZ(x)+.20]);
    const lantern=box(scene,0xffc170,[.13,.18,.13],[x,.92,shoreZ(x)+.20]);
    lantern.material=new T.MeshStandardMaterial({color:0xffc170,emissive:0xffa23d,emissiveIntensity:1.35});
    box(scene,dark,[.17,.04,.17],[x,1.03,shoreZ(x)+.20]);
  }
  for(const [x,z] of [[-6.12,.64],[6.12,.67],[-5.2,-3.4],[8.3,shoreZ(8.3)+.52]]){
    box(scene,stone,[.75,.26,.63],[x,-.24,z]);
    box(scene,0x70614a,[.65,.035,.54],[x,-.10,z]);
    for(let i=0;i<6;i++)ball(scene,i%2?0x527c54:0x7d955b,[.16,.23,.16],[x+(i%3-1)*.18,.04,z+(i<3?-.10:.10)]);
    shape(scene,cylinder,dark,[.04,1.19,.04],[x+.42,.23,z]);
    box(scene,0xf0c681,[.13,.15,.13],[x+.42,.88,z]);
    box(scene,dark,[.17,.055,.17],[x+.42,.98,z]);
  }
  const leafGeometry=new T.SphereGeometry(1,6,4);
  const leafMaterial=new T.MeshStandardMaterial({roughness:.84});
  const leafTransform=new T.Object3D();
  const leafColors=[0x536832,0x76813b,0x8e903b,0xb2a049].map(color=>new T.Color(color));
  // Keep the open quay and shop corner free of duplicate foreground crowns.
  const quayTrees=[
    {x:7.64,z:2.56,height:2.28,spread:.74,lean:.22},
    {x:9.55,z:shoreZ(9.55)+.68,height:1.88,spread:.63,lean:-.13},
  ];
  const canopyLeaves=new T.InstancedMesh(leafGeometry,leafMaterial,quayTrees.length*5*36);
  const bark=material(0x936c4c);
  let leafIndex=0;
  for(const {x,z,height,spread,lean} of quayTrees) {
    const tree=new T.Group();
    tree.position.set(x,-.34,z);
    scene.add(tree);
    shape(tree,cylinder,0xbca083,[.39,.08,.39],[0,.01,0]);
    shape(tree,cylinder,0x62503b,[.31,.025,.31],[0,.059,0]);
    const branch=(start,end,base,tip)=>{
      const vector=end.clone().sub(start);
      const wood=new T.Mesh(new T.CylinderGeometry(tip,base,vector.length(),8),bark);
      wood.position.copy(start).lerp(end,.5);
      wood.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vector.normalize());
      wood.castShadow=true;
      tree.add(wood);
    };
    const fork=new T.Vector3(lean*.4,height*.62,0);
    const crown=new T.Vector3(lean,height,-.05);
    branch(new T.Vector3(),fork,.115,.066);
    branch(fork,crown,.066,.021);
    for(let cluster=0;cluster<5;cluster++) {
      const bearing=cluster*2.39996;
      const reach=spread*(.38+cluster*.095);
      const tip=crown.clone().add(new T.Vector3(Math.cos(bearing)*reach,
        -.21+(cluster%3)*.12,Math.sin(bearing)*reach*.79));
      branch(fork.clone().lerp(crown,.15+cluster*.12),tip,.033,.009);
      for(let i=0;i<36;i++) {
        const angle=i*2.39996;
        const radius=Math.sqrt((i+.5)/36)*spread;
        leafTransform.position.set(x+tip.x+Math.cos(angle)*radius*.59,
          -.34+tip.y+Math.sin(i*1.73)*.22,z+tip.z+Math.sin(angle)*radius*.48);
        leafTransform.rotation.set(Math.sin(i)*.86,angle,Math.cos(i)*.78);
        leafTransform.scale.set(.05+(i%3)*.01,.11+(i%5)*.012,.018);
        leafTransform.updateMatrix();
        canopyLeaves.setMatrixAt(leafIndex,leafTransform.matrix);
        canopyLeaves.setColorAt(leafIndex++,leafColors[(i+cluster)%4]);
      }
    }
  }
  scene.add(canopyLeaves);
  for(const x of [-5.05,5.25]){
    for(const z of [2.7,3.0])box(scene,dark,[.035,.31,.035],[x,-.24,z]);
    for(let i=0;i<5;i++)box(scene,0x976640,[.09,.035,.67],[x+(i-2)*.085,-.062,2.85]);
    for(let i=0;i<3;i++)box(scene,0xaa794f,[.037,.055,.67],[x-.20,.03+i*.065,2.85]);
  }
  const entrance=new T.Group();
  entrance.position.z=2.12;
  scene.add(entrance);
  for(const [x,z] of [[-5.10,2.12],[4.75,2.12]]){
    const pier=box(entrance,stone,[.48,2.57,.57],[x,.87,z]);
    pier.material=pier.material.clone();pier.material.map=facadeMap;
    const sandstone=[0xbf885f,0xc9956c,0xd3a27b,0xb68158];
    box(entrance,0xb27a52,[.62,.24,.68],[x,-.23,z]);
    box(entrance,0xd7a57b,[.60,.085,.66],[x,-.075,z]);
    for(let course=0;course<10;course++) {
      const height=.035+course*.194;
      const seam=(course%2?.06:-.06);
      for(const side of [-1,1]) {
        const width=.233+side*seam;
        const centre=x+side*(.238-width*.5);
        const block=box(entrance,sandstone[(course+(side+1))%4],[width,.183,.062],[centre,height,z+.29]);
        block.receiveShadow=true;
      }
    }
    box(entrance,0xd6a27b,[.59,.079,.65],[x,1.90,z]);
    box(entrance,brass,[.57,.085,.61],[x,1.98,z]);
    box(entrance,dark,[.54,.12,.62],[x,2.10,z]);
  }
  for(const side of [-1,1]) {
    const x=side*5.05,z=2.62;
    shape(entrance,cylinder,0xac7653,[.24,.25,.24],[x,-.22,z]);
    shape(entrance,cylinder,0xc58c61,[.254,.044,.254],[x,-.09,z]);
    for(let i=0;i<15;i++) {
      const angle=i*2.39996;
      const length=.16+(i%4)*.036;
      const offset=.09+(i%4)*.033;
      const sprig=ball(entrance,[0x5a8138,0x829743,0xa5ac54][i%3],[.036,length,.05],
        [x+Math.cos(angle)*offset,.08+(i%4)*.038,z+Math.sin(angle)*offset]);
      sprig.rotation.set(Math.sin(angle)*.56,angle,Math.cos(angle)*.56);
      if(i%3===0) {
        const bloom=ball(entrance,0xcc533a,[.064,.032,.057],
          [x+Math.cos(angle)*offset,.23+(i%4)*.036,z+Math.sin(angle)*offset]);
        bloom.rotation.y=angle;
      }
    }
  }
  for(const side of [-1,1]) {
    const x=side<0?-5.09:4.74;
    const panel=box(entrance,0x496650,[.38,1.85,.075],[x,.69,2.43]);
    panel.castShadow=true;
    for(const rail of [-1,1])
      box(entrance,0x294938,[.043,1.86,.11],[x+rail*.185,.69,2.48]);
    for(const y of [-.12,1.48]){
      box(entrance,0x304e3c,[.40,.067,.11],[x,y,2.49]);
      box(entrance,0xbb914e,[.075,.11,.025],[x-side*.12,y+.05,2.559]);
    }
    for(let i=0;i<13;i++){
      const slat=box(entrance,i%2?0x68805d:0x526d51,[.32,.085,.082],[x,-.09+i*.12,2.49]);
      slat.rotation.x=-.30;
    }
    for(const y of [.12,1.37])box(entrance,brass,[.39,.045,.035],[x,y,2.54]);
  }
  // Juniper's broad canopy drapes over the shops, leaving the signs below it.
  const juniper=new T.Group();
  juniper.position.set(-6.62,-.36,-3.22);
  shape(juniper,cylinder,0xbc9876,[.44,.09,.44],[0,.025,0]);
  shape(juniper,cylinder,0x62503b,[.36,.025,.36],[0,.081,0]);
  scene.add(juniper);
  const boughs=[
    [.23,.10,[[0,0,0],[-.09,.96,.10],[.10,2.08,.04],[.36,2.88,.02]]],
    [.105,.023,[[.09,2.02,.04],[-.39,2.86,.02],[-1.14,3.58,.25],[-1.55,4.10,.47]]],
    [.10,.025,[[.27,2.65,.06],[.96,3.30,.26],[1.80,3.70,.44],[2.89,4.04,.66]]],
    [.085,.019,[[.37,2.84,.04],[.75,3.62,-.26],[1.79,4.40,-.36],[3.20,4.64,-.62]]],
    [.053,.014,[[1.48,3.56,.36],[2.34,3.86,1.12],[3.35,4.09,1.43]]],
    [.047,.014,[[1.79,4.39,-.36],[2.91,4.76,-.56],[4.15,4.69,-.98]]],
    [.058,.015,[[-.56,3.00,.08],[-.81,3.73,-.60],[-.93,4.30,-.87]]],
    [.046,.012,[[.93,3.30,.26],[1.13,3.73,1.00],[1.80,4.28,1.55]]],
    [.035,.010,[[2.45,3.93,.64],[3.45,4.33,.70],[4.40,4.30,.52]]],
  ];
  for(const [baseRadius,tipRadius,points] of boughs){
    const path=new T.CatmullRomCurve3(points.map(point=>new T.Vector3(...point)));
    const rings=20,sides=8;
    const woodGeometry=new T.TubeGeometry(path,rings,baseRadius,sides,false);
    const vertices=woodGeometry.getAttribute('position');
    const vertex=new T.Vector3();
    for(let ring=0;ring<=rings;ring++){
      const fraction=ring/rings;
      const center=path.getPointAt(fraction);
      const taper=T.MathUtils.lerp(1,tipRadius/baseRadius,fraction);
      for(let side=0;side<=sides;side++){
        const index=ring*(sides+1)+side;
        vertex.fromBufferAttribute(vertices,index).lerp(center,1-taper);
        vertices.setXYZ(index,vertex.x,vertex.y,vertex.z);
      }
    }
    woodGeometry.computeVertexNormals();
    const wood=new T.Mesh(woodGeometry,bark);
    wood.castShadow=true;
    juniper.add(wood);
  }
  const crowns=[
    [-1.55,4.05,.47,.73],[-.93,4.35,-.87,.79],[-.42,4.31,.40,.84],
    [.28,4.64,-.35,.90],[1.1,4.40,.38,.93],[1.8,4.29,1.52,.70],
    [2.40,4.18,.58,.85],[2.47,4.72,-.57,.89],[3.23,4.68,-.66,.85],
    [3.35,4.20,1.42,.71],[4.10,4.71,-.95,.73],[4.30,4.33,.50,.72],
  ];
  const leavesPerCrown=166;
  const foliage=new T.InstancedMesh(leafGeometry,leafMaterial,crowns.length*leavesPerCrown);
  const canopyColors=[0x536227,0x687830,0x899036,0xab9c3d,0xb7a44b]
    .map(color=>new T.Color(color));
  for(const [cluster,[x,y,z,spread]] of crowns.entries()){
    // Overlapping darker interiors keep the sunlit leaf groups from reading as beads.
    const mass=ball(juniper,0x666b2b,[spread*.70,.34,spread*.51],[x,y,z]);
    mass.castShadow=true;
    for(let i=0;i<leavesPerCrown;i++){
      const angle=i*2.39996+cluster*.73;
      const reach=Math.sqrt((i+.5)/leavesPerCrown)*spread;
      const height=Math.sin(i*1.73);
      leafTransform.position.set(x+Math.cos(angle)*reach,y+height*.31,z+Math.sin(angle)*reach*.67);
      leafTransform.rotation.set(Math.sin(i)*1.15,angle,Math.cos(i)*.81);
      leafTransform.scale.set(.062,.101+(i%5)*.016,.024);
      leafTransform.updateMatrix();
      const index=cluster*leavesPerCrown+i;
      const colorIndex=(i*7+cluster*3+(height>.20?2:0))%canopyColors.length;
      foliage.setMatrixAt(index,leafTransform.matrix);
      foliage.setColorAt(index,canopyColors[colorIndex]);
    }
  }
  foliage.castShadow=true;
  juniper.add(foliage);

  // Low strap leaves frame the board, with taller red stems on the planter's outer side.
  const bladeShape=new T.Shape();
  bladeShape.moveTo(-.10,0);
  bladeShape.quadraticCurveTo(-.22,.47,.10,.78);
  bladeShape.quadraticCurveTo(.29,.94,.46,1);
  bladeShape.quadraticCurveTo(.31,.79,.13,.52);
  bladeShape.quadraticCurveTo(.02,.27,.10,0);
  bladeShape.closePath();
  const bladeGeometry=new T.ShapeGeometry(bladeShape,6);
  const bedLeafMaterial=new T.MeshStandardMaterial({side:T.DoubleSide,roughness:.76});
  const bedLeafColors=[0x506c28,0x75812e,0x979736,0xb4a343].map(color=>new T.Color(color));
  const beds=[{x:-5.12,z:1.08,length:1.53},{x:5.17,z:1.28,length:1.89}];
  const bladesPerBed=104;
  const blades=new T.InstancedMesh(bladeGeometry,bedLeafMaterial,beds.length*bladesPerBed);
  for(const [bed,{x,z,length}] of beds.entries()){
    box(scene,0xc69268,[.98,.37,length],[x,-.16,z]);
    box(scene,0x59422d,[.80,.035,length-.18],[x,.032,z]);
    for(const edge of [-1,1]){
      box(scene,0xd9aa80,[.09,.07,length+.02],[x+edge*.45,.05,z]);
      box(scene,0xd9aa80,[.89,.07,.086],[x,.05,z+edge*(length/2-.033)]);
    }
    for(let i=0;i<bladesPerBed;i++){
      const clump=Math.floor(i/13);
      const angle=i*2.39996;
      const px=x+Math.sin(clump*3.08)*.25;
      const pz=z+((clump+.5)/8-.5)*(length-.19);
      const height=.22+(i%7)*.037;
      leafTransform.position.set(px,.055,pz);
      leafTransform.rotation.set(.04*Math.sin(i),angle,0,'YXZ');
      leafTransform.scale.set(.23+(i%4)*.035,height,1);
      leafTransform.updateMatrix();
      const index=bed*bladesPerBed+i;
      blades.setMatrixAt(index,leafTransform.matrix);
      blades.setColorAt(index,bedLeafColors[(i+clump)%4]);
    }
    for(let i=0;i<10;i++){
      const px=x+Math.sign(x)*(.08+Math.sin(i*2.4)*.21);
      const pz=z+((i+.5)/10-.5)*(length-.18);
      const height=.30+(i%5)*.052;
      shape(scene,cylinder,0x6e7837,[.013,height,.013],[px,.055+height*.5,pz]);
      for(let tier=0;tier<4;tier++){
        const width=.049-tier*.006;
        ball(scene,[0xa83b35,0xbd4937,0xd56040,0xe48850][tier],
          [width,.030,width],[px,height-.025+tier*.029,pz]);
      }
    }
  }
  blades.castShadow=true;
  scene.add(blades);
  for(let i=0;i<31;i++) {
    const phase=i*2.39996;
    // Keep the vine on the outer pier and turn the upper growth over the arch.
    const y=1.67+(i%13)*.105;
    const x=-5.31+Math.sin(phase)*.15+Math.max(0,y-2.31)*.42;
    const leaf=ball(entrance,[0x537239,0x7b873e,0x9f9944][i%3],[.09,.12,.044],[x,y,2.48]);
    leaf.rotation.z=Math.sin(phase)*.78;
    if(i%7===0)ball(entrance,0xc34b36,[.079,.062,.042],[x,y+.037,2.53]);
  }
  entranceSigns=new T.Group();
  entrance.add(entranceSigns);
  for(const side of [-1,1]) {
    const x=side<0?-5.10:4.75;
    box(entrance,0xcfa364,[.22,.28,.62],[x,2.18,2.12]);
    const signX=x-side*(side>0?-.23:1.81);
    const signY=side<0?2.76:2.61;
    const brace=new T.QuadraticBezierCurve3(new T.Vector3(x,2.12,2.19),
      new T.Vector3(x,signY+.55,2.21),new T.Vector3(signX,signY+.22,2.26));
    shape(entranceSigns,new T.TubeGeometry(brace,18,.037,8,false),brass,[1,1,1],[0,0,0]);
    box(entranceSigns,0x906339,[.034,.24,.031],[signX,signY+.15,2.26]);
    box(entranceSigns,0xd5a45d,[1.37,.37,.062],[signX,signY,2.29]);
    const plaque=sign(side<0?'CAREER EMPIRE':'CAREERS ARCHON',1.31,.31,true);
    plaque.position.set(signX,signY,2.325);
    entranceSigns.add(plaque);
  }
  traffic=[];
}
function buildCity() {
  const asphalt=0x414b51;
  for(const z of [-5.95,6.15]) {
    box(scene,asphalt,[29,.06,1.72],[0,-.50,z]);
    for(let x=-12;x<=12;x++)
      box(scene,0xf4cf80,[.47,.012,.035],[x,-.46,z]);
  }
  for(const x of [-6.15,6.15]) {
    box(scene,asphalt,[1.72,.06,12.1],[x,-.50,.05]);
    for(let z=-4;z<=4;z++)
      box(scene,0xf4cf80,[.035,.012,.47],[x,-.46,z]);
  }
  for(const x of [-4.75,0,4.75]) for(let stripe=0;stripe<6;stripe++)
    box(scene,0xf8f3de,[.68,.015,.115],[x,-.451,-6.66+stripe*.26]);
  for(const [x,z] of [[-4.8,-4.7],[4.8,-4.7],[-4.8,4.6],[4.8,4.6]]) {
    shape(scene,cylinder,0x8d7155,[.075,.64,.075],[x,-.09,z]);
    ball(scene,0x4c926c,[.37,.48,.36],[x,.40,z]);
    ball(scene,0x78ad69,[.29,.35,.31],[x-.12,.53,z+.08]);
  }
  for(const {x,w,h,color,name} of [
    {x:-4.6,w:2.3,h:1.75,color:0xdcc8a6,name:'CLINIC'},
    {x:-1.8,w:2.65,h:2.35,color:0x678e9d,name:'TECH STUDIO'},
    {x:1.4,w:2.7,h:1.65,color:0xdaab88,name:artReview?'JUNIPER KITCHEN':'EARLY LEARNING'},
  ]) {
    const facade=box(scene,color,[w,h,1.8],[x,h/2-.55,-8]);
    if(artReview) {
      facade.material=facade.material.clone();
      facade.material.map=facadeMap;
    }
    box(scene,0x4f6264,[w+.14,.12,1.94],[x,h-.48,-8]);
    box(scene,0x38545b,[.43,.80,.04],[x,-.13,-7.08]);
    for(const offset of [-.34,.34]) {
      box(scene,0x344e60,[.49,.48,.045],[x+offset*w,.18,-7.08]);
      box(scene,0xa1ced2,[.38,.35,.046],[x+offset*w,.18,-7.05]);
    }
    if(artReview) {
      for(let i=-4;i<=4;i++)box(scene,i%2?0xe2c191:0x89614e,[w/9,.08,.44],[x+i*w/9,.77,-6.92]);
      for(const offset of [-.43,.43])box(scene,0xf2ddbc,[.09,h,.11],[x+offset*w,h/2-.55,-7.03]);
    }
    const marker=sign(name,w*.83,.28);
    marker.position.set(x,h-.82,-7.05);scene.add(marker);
  }
  for(const [x,z,color] of [[4.75,-8.1,0xe7c29a],[7.95,-4.8,0xb6ccaa],[-8.05,-4.6,0xe3b4a0]]) {
    box(scene,color,[1.8,1.24,1.45],[x,.06,z]);
    const roof=shape(scene,new T.CylinderGeometry(0,1,1,4),0x8e5145,[1.42,.65,1.17],[x,.98,z]);
    roof.rotation.y=Math.PI/4;
    box(scene,0x658d9b,[.39,.37,.045],[x-.47,.09,z+.745]);
    box(scene,0x775644,[.34,.68,.045],[x+.31,-.20,z+.745]);
  }
  for(const x of [-7.9,7.9]) {
    box(scene,0x76837f,[2.25,.12,2],[x,-.51,-1.6]);
    for(let i=0;i<4;i++) box(scene,0xc09159,[1.35,.10,.20],[x,-.39+i*.10,-1.6]);
  }
  traffic=[
    {z:-6.33,direction:1,offset:0,color:0xc96355},
    {z:-5.60,direction:-1,offset:7,color:0x70a9bf},
    {z:6.48,direction:-1,offset:12,color:0xe5b34c},
    {z:5.78,direction:1,offset:18,color:0x8ba888},
  ].map(({z,direction,offset,color})=>{
    const car=new T.Group();scene.add(car);
    car.position.set(offset-10,-.43,z);car.rotation.y=direction===1?0:Math.PI;
    box(car,color,[.87,.17,.42],[0,.13,0]);
    box(car,0x294856,[.43,.18,.36],[-.08,.29,0]);
    box(car,color,[.39,.045,.37],[-.08,.39,0]);
    for(const x of [-.29,.29]) for(const side of [-1,1])
      ball(car,0x252b31,[.10,.10,.047],[x,.095,side*.218]);
    for(const z of [-.135,.135]) box(car,0xffedab,[.025,.06,.085],[.447,.16,z]);
    return {car,direction,offset};
  });
}
function buildPerthSky() {
  const sky=new T.Mesh(new T.SphereGeometry(1,32,16),new T.ShaderMaterial({
    side:T.BackSide,depthWrite:false,toneMapped:false,
    uniforms:{
      horizon:{value:new T.Color(0xfac3a7)},
      dusk:{value:new T.Color(0xc3a4df)},
      zenith:{value:new T.Color(0x6784e1)},
      cloudTint:{value:new T.Color(0xffadbb)}
    },
    vertexShader:`varying vec3 skyDirection;
      void main(){
        skyDirection=position;
        vec4 clip=projectionMatrix*vec4(mat3(viewMatrix)*position,1.0);
        gl_Position=clip.xyww;
      }`,
    fragmentShader:`varying vec3 skyDirection;
      uniform vec3 horizon,dusk,zenith,cloudTint;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){
        vec2 cell=floor(p),f=fract(p);
        f=f*f*(3.0-2.0*f);
        return mix(mix(hash(cell),hash(cell+vec2(1,0)),f.x),
          mix(hash(cell+vec2(0,1)),hash(cell+vec2(1,1)),f.x),f.y);
      }
      void main(){
        vec3 direction=normalize(skyDirection);
        float height=direction.y;
        vec3 colour=mix(horizon,dusk,smoothstep(-.025,.18,height));
        colour=mix(colour,zenith,smoothstep(.10,.43,height));
        vec2 p=direction.xz/max(height+.24,.24)*vec2(2.6,3.6);
        float vapour=.62*noise(p)+.26*noise(p*2.13)+.12*noise(p*4.57);
        float cloud=smoothstep(.55,.76,vapour)*smoothstep(.005,.12,height)
          *(1.0-smoothstep(.26,.58,height));
        gl_FragColor=vec4(mix(colour,cloudTint,cloud*.68),1.0);
        #include <colorspace_fragment>
      }`
  }));
  sky.frustumCulled=false;
  sky.renderOrder=-2;
  scene.add(sky);
}
function create() {
  scene=new T.Scene();scene.background=new T.Color(perthScene?0xf0c7a6:0xc6dedf);scene.fog=new T.Fog(scene.background,perthScene?17:20,46);
  if(perthScene)buildPerthSky();
  camera=new T.PerspectiveCamera(44,1,.1,80);
  renderer=new T.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=perthScene?1.18:1.32;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFShadowMap;
  sceneHost.prepend(renderer.domElement);
  const canvas=renderer.domElement;
  let drag=null;
  let dragged=false;
  canvas.style.touchAction='none';
  canvas.style.cursor='grab';
  canvas.addEventListener('wheel',event=>{
    if(!open||motion)return;
    event.preventDefault();
    zoomBoard(Math.exp(T.MathUtils.clamp(event.deltaY,-150,150)*.003));
  },{passive:false});
  canvas.addEventListener('pointerdown',event=>{
    if(!open||motion||!event.isPrimary||event.button!==0)return;
    finishOverview();
    drag={id:event.pointerId,x:event.clientX,y:event.clientY};
    dragged=false;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove',event=>{
    if(drag?.id!==event.pointerId||!open||motion)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!dragged&&Math.hypot(dx,dy)<5)return;
    if(!boardOrbit){
      orbitTarget.set(0,shared ? .2 : 0,0);
      boardOrbit=new T.Spherical().setFromVector3(camera.position.clone().sub(orbitTarget));
    }
    dragged=true;
    canvas.style.cursor='grabbing';
    boardOrbit.theta-=dx*.008;
    boardOrbit.phi=T.MathUtils.clamp(boardOrbit.phi-dy*.008,.035,1.49);
    if(shared)clampBoardOrbit(boardOrbit);
    drag.x=event.clientX;
    drag.y=event.clientY;
  });
  canvas.addEventListener('lostpointercapture',()=>{
    drag=null;
    canvas.style.cursor='grab';
  });
  canvas.addEventListener('click', event => {
    if(dragged){dragged=false;return;}
    if (!open || motion) return;
    const bounds=renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-bounds.left)/bounds.width*2-1,1-(event.clientY-bounds.top)/bounds.height*2);
    ray.setFromCamera(pointer,camera);
    const selectable=selectablePieces();
    const hit=ray.intersectObjects([...squares,...selectable.map(piece=>piece.root)],true)[0];
    if (!hit) return;
    let target=hit.object;
    while(target.parent&&target.parent!==scene)target=target.parent;
    const piece=selectable.find(item=>item.root===target);
    if (piece) {active=piece;updateControls();return;}
    const index=squares.indexOf(target);
    if (index>=0) {
      const col=index%8,row=Math.floor(index/8);
      if(destinations().some(move=>move.col===col&&move.row===row))walk(col,row);
      else inspectTerritory(sharedState?.tiles[col+','+row]);
    }
  });
  scene.add(new T.HemisphereLight(perthScene?0xc2deee:0xfff7db,0x69818a,perthScene?1.42:2.2));
  const sun=new T.DirectionalLight(perthScene?0xffc486:0xffecd0,perthScene?2.65:2.3);
  sun.position.set(-5,perthScene?4.4:9,4);
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9});
  sun.shadow.normalBias=.025;
  if(perthScene)sun.shadow.mapSize.set(2048,2048);
  scene.add(sun);
  if(!perthScene)box(scene,0xb7a78e,[48,.25,48],[0,-.69,0]);
  box(scene,0xc4b7a3,[10.6,.15,11],[0,-.51,0]);
  if(perthScene) {
    plazaMap=masonryMap('stone');
    facadeMap=masonryMap('brick');
  }
  if(perthScene) {
    const firstEnvironmentObject=scene.children.length;
    buildWaterfront();
    // Set the promenade surface just below the selectable square faces.
    for(const object of scene.children.slice(firstEnvironmentObject))object.position.y+=.337;
    box(scene,0x574837,[8,.10,8],[0,-.095,0]);
    for(const side of [-1,1]) {
      box(scene,0xa76548,[.20,.035,8.40],[side*4.10,-.024,0]);
      box(scene,0xa76548,[8,.035,.20],[0,-.024,side*4.10]);
    }
  } else {
    buildCity();
    box(scene,0x544d40,[8.55,.42,8.55],[0,-.27,0]);
  }
  squares=[];
  for(let row=0;row<8;row++) for(let col=0;col<8;col++) {
    const tile=box(scene,(row+col)%2?0x8f9d93:0xd9c49e,[.98,.11,.98],[col-3.5,-.055,row-3.5]);
    tile.material=tileMaterial((row+col)%2?0x8f9d93:0xd9c49e);
    tile.receiveShadow=true;
    squares.push(tile);
    box(scene,0xf0ddbb,[.76,.008,.018],[col-3.5,.006,row-3.86]);
  }
  if(!perthScene)for(const x of [-4.35,4.35])
    box(scene,0x878d87,[.18,.17,8.7],[x,-.20,0]);
  gates=buildPlazaDoors({Group:T.Group,scene,box,sign,wide:perthScene});
  pieces=(sharedState?.pieces??startingPieces()).map(figure);
  new ResizeObserver(()=>{
    const {clientWidth:w,clientHeight:h}=sceneHost;
    if(!w||!h)return;
    renderer.setSize(w,h);camera.aspect=w/h;camera.zoom=shared?boardZoom(camera.aspect):Math.min(1,camera.aspect/1.12);camera.updateProjectionMatrix();
  }).observe(sceneHost);
}
function reset() {
  boardOrbit=null;
  cancelAnimationFrame(frame);
  open=shared;opening=null;motion=null;active=null;artTile=null;artView='board';
  el('art-stage').hidden=true;
  if(shared) {
    camera.position.set(boardView.x,boardView.y,boardView.z);
    cameraFocus.set(0,.2,0);
  } else {
    camera.position.set(0,2.6,9.1);
    cameraFocus.set(0,1.1,3.55);
  }
  const seeds=sharedState?.pieces??startingPieces();
  for(const piece of pieces) {
    const seed=seeds.find(item=>item.id===piece.id);
    piece.root.visible=!!seed;
    if(!seed)continue;
    piece.col=seed.col;piece.row=seed.row;
    piece.root.position.set(piece.col-3.5,.025,piece.row-3.5);
    piece.body.rotation.y=piece.team==='A'?Math.PI:0;
    pose(piece,0);
  }
  posePlazaDoors(gates,shared?1:0);
  controls.replaceChildren();controls.hidden=true;
  el('unlock').hidden=shared;el('roster').hidden=true;
  status.textContent=shared?'Select on the board or use Board tools.':'Unlock the Market Arcade shutters.';
  if(shared) {
    if(pendingOverview)startOverview();
    controls.hidden=false;
    el('board-tools').hidden=false;
    updateControls();
  }
  frame=requestAnimationFrame(draw);
}
function pose(piece,swing) {
  for(const limb of piece.limbs) {
    limb.leg.rotation.x=swing*limb.side;
    limb.arm.rotation.x=-swing*limb.side*.65;
  }
}
function button(parent,label,action) {
  const b=document.createElement('button');b.textContent=label;b.onclick=action;parent.append(b);
  return b;
}
function select(code) {
  if(motion)return;
  active=pieces.find(piece=>piece.team==='A'&&piece.code===code);
  updateControls();
}
function selectablePieces() {
  if(shared) {
    if(sharedState?.phase!=='board'||sharedState.role!==sharedState.turn)return [];
    return pieces.filter(piece=>piece.team===sharedState.role&&piece.root.visible);
  }
  return pieces.filter(piece=>piece.team==='A'&&['CP','NS'].includes(piece.code));
}
function destinations() {
  return active&&selectablePieces().includes(active)?
    legalMoves(active,sharedState?.pieces??pieces,sharedState?.tiles).filter(move=>shared||!move.target):[];
}
function territoryTexture(holder,effect) {
  const key=holder+effect;
  if(territoryTextures.has(key))return territoryTextures.get(key);
  const canvas=document.createElement('canvas');
  canvas.width=128;canvas.height=128;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=holder==='A'?'#2acdb4':'#efaa42';
  ctx.strokeStyle='#18323b';ctx.lineWidth=8;
  ctx.beginPath();ctx.arc(64,64,54,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.lineWidth=10;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.stroke(new Path2D(territoryEffects[effect].icon));
  const texture=new T.CanvasTexture(canvas);
  territoryTextures.set(key,texture);
  return texture;
}
function syncTerritoryBadges() {
  const tiles=sharedState?.tiles??(artTile?{[artTile.col+','+artTile.row]:artTile}:{});
  for(const [key,badge] of territoryBadges) {
    if(tiles[key]?.effect)continue;
    scene.remove(badge);
    badge.material.dispose();
    territoryBadges.delete(key);
  }
  for(const [key,tile] of Object.entries(tiles)) {
    if(!tile.effect)continue;
    let badge=territoryBadges.get(key);
    if(!badge) {
      badge=new T.Sprite(new T.SpriteMaterial());
      badge.scale.set(.46,.46,1);
      badge.position.set(tile.col-3.21,.34,tile.row-3.19);
      scene.add(badge);
      territoryBadges.set(key,badge);
    }
    badge.material.map=territoryTexture(tile.holder,tile.effect);
    badge.material.needsUpdate=true;
  }
}
function inspectTerritory(tile) {
  if(!tile?.effect)return;
  const effect=territoryEffects[tile.effect];
  status.textContent=squareName(tile.col,tile.row)+' · Player '+tile.holder+' · '+effect.name+'. '+effect.description.replaceAll('your','the owner’s');
}
function updateControls() {
  const focused=document.activeElement;
  const focusLabel=controls.contains(focused)
    ? focused.getAttribute('aria-label')||focused.textContent : null;
  controls.replaceChildren();
  syncTerritoryBadges();
  button(controls,'Zoom in',()=>zoomBoard(.78)).disabled=!!motion;
  button(controls,'Zoom out',()=>zoomBoard(1/.78)).disabled=!!motion;
  button(controls,'Reset board view',()=>{finishOverview();boardOrbit=null;active=null;artView='board';updateControls();}).disabled=!!motion;
  const moves=destinations();
  if(shared) {
    const options=selectablePieces();
    if(options.length) {
      const picker=document.createElement('select');
      picker.setAttribute('aria-label','Select a playing piece');
      picker.add(new Option('Select a playing piece',''));
      for(const piece of options)picker.add(new Option(labels[piece.code]+' · '+squareName(piece.col,piece.row),piece.id));
      picker.value=active?.id??'';
      picker.disabled=!!motion;
      picker.onchange=()=>{finishOverview();active=options.find(item=>item.id===picker.value);updateControls();};
      controls.append(picker);
    }
  } else {
    button(controls,'Select Carpenter',()=>select('CP')).disabled=!!motion;
    button(controls,'Select Nurse',()=>select('NS')).disabled=!!motion;
    button(controls,'Replay gate',reset);
    if(artReview) {
      button(controls,artView==='entrance'?'Overhead shot':'Arcade entrance view',()=>{
        boardOrbit=null;artView=artView==='entrance'?'board':'entrance';updateControls();
      });
      button(controls,artView==='bridge'?'Back to board':'Bridge from above',()=>{
        boardOrbit=null;artView=artView==='bridge'?'board':'bridge';updateControls();
      }).disabled=!!motion;
      button(controls,'Preview duel transition',()=>showArtStage('duel'));
    }
  }
  const territories=Object.values(sharedState?.tiles??{}).filter(tile=>tile.effect);
  if(territories.length) {
    const picker=document.createElement('select');
    picker.setAttribute('aria-label','Inspect territory');
    picker.add(new Option('Inspect territory',''));
    for(const tile of territories) {
      const name=squareName(tile.col,tile.row);
      picker.add(new Option(name+' · '+territoryEffects[tile.effect].name,name));
    }
    picker.onchange=()=>inspectTerritory(territories.find(tile=>squareName(tile.col,tile.row)===picker.value));
    controls.append(picker);
  }
  for(const {col,row,target} of moves)
    button(controls,(target?'Challenge ':'Walk to ')+squareName(col,row),()=>walk(col,row)).disabled=!!motion;
  if(focusLabel) {
    const replacement=[...controls.querySelectorAll('button:not(:disabled), select:not(:disabled)')]
      .find(control=>(control.getAttribute('aria-label')||control.textContent)===focusLabel);
    (replacement ?? (shared ? el('board-tools').querySelector('summary') : null))?.focus({preventScroll:true});
  }
  for(const [i,tile] of squares.entries()) {
    const col=i%8,row=Math.floor(i/8);
    const move=moves.find(item=>item.col===col&&item.row===row);
    const owner=sharedState?.tiles[col+','+row]?.holder??(artTile?.col===col&&artTile.row===row?artTile.holder:null);
    const contested=['writing','review'].includes(sharedState?.phase)&&sharedState?.clash?.col===col&&sharedState.clash.row===row;
    const color=move?(move.target?0xef9c48:0x52dfba):contested?0xdd9a58:owner?(owner==='A'?0x35ae98:0xd8a34d):(row+col)%2?0x8f9d93:0xd9c49e;
    tile.material=tileMaterial(color);
  }
}
function walk(col,row) {
  if(motion||!destinations().some(move=>move.col===col&&move.row===row))return;
  if(shared) {
    parent.postMessage({type:'city-move',piece:active.id,col,row,round:sharedState.round},location.origin);
    return;
  }
  active.body.rotation.y=Math.atan2(col-active.col,row-active.row);
  artView='board';
  motion={start:performance.now(),piece:active,col,row};
  status.textContent=labels[active.code]+' is moving.';
  updateControls();
}
function showArtStage(step) {
  const panel=el('art-stage');
  panel.hidden=false;
  panel.replaceChildren();
  const headings={duel:'Initiative duel',reveal:'Both answers revealed',verdict:'Student adjudicator · Teal wins',territory:'Choose the territory effect',result:'Access Route installed'};
  const heading=document.createElement('h2');heading.textContent=headings[step];panel.append(heading);
  const line=document.createElement('p');
  line.textContent={
    duel:'Preview with fictional answers. The Market stall is nearly out of packaging. What would you do before the rush, and why?',
    reveal:'Marking note: look for action before the shortage, an appropriate check and an explanation of how service improves.',
    verdict:'The first response explains how checking supplies before the rush prevents delays.',
    territory:'The winner chooses a permanent rule for the contested square.',
    result:'Teal now owns B3. A piece starting here may also slide like the Crown.',
  }[step];
  panel.append(line);
  if(step==='reveal') {
    const responses=document.createElement('div');responses.className='art-answers';
    for(const answer of ['Teal · Check spare stock with Mara and flag the shortage before orders arrive.','Amber · Help a colleague pack orders when the queue gets busy.']) {
      const item=document.createElement('p');item.textContent=answer;responses.append(item);
    }
    panel.append(responses);
  }
  const next={duel:['Reveal fictional answers','reveal'],reveal:['Show adjudicator verdict','verdict'],verdict:['Show territory card','territory']}[step];
  if(next)button(panel,next[0],()=>showArtStage(next[1]));
  if(step==='territory')button(panel,'Confirm Access Route',()=>{
    artTile={col:1,row:5,holder:'A',effect:'route'};
    updateControls();showArtStage('result');
  });
}
function draw(now) {
  const dt=Math.min(.05,Math.max(0,(now-lastFrame)/1000));
  lastFrame=now;
  if(!reduce)for(const piece of pieces)animateRig(piece,motion?.piece===piece,dt);
  let reveal=open?1:0;
  if(opening!==null) {
    reveal=reduce?1:Math.min(1,(now-opening)/1550);
    if(reveal===1) {
      open=true;opening=null;controls.hidden=false;el('roster').hidden=false;
      status.textContent=shared?'Shared city board ready.':'Choose a piece to see its legal moves.';
      updateControls();
    }
  }
  const eased=reveal*reveal*(3-2*reveal);
  posePlazaDoors(gates,eased);
  if(motion) {
    const {start,piece,col,row}=motion;
    const t=reduce?1:Math.min(1,(now-start)/(artReview?1600:760));
    piece.root.position.set(T.MathUtils.lerp(piece.col,col,t)-3.5,.025+Math.sin(t*Math.PI*4)**2*.025,T.MathUtils.lerp(piece.row,row,t)-3.5);
    pose(piece,Math.sin(t*Math.PI*4)*.62);
    if(t===1) {
      piece.col=col;piece.row=row;pose(piece,0);motion=null;
      status.textContent=labels[piece.code]+' reached '+String.fromCharCode(65+col)+(8-row)+'.';
      const tile=sharedState?.tiles[col+','+row];
      if(tile?.effect)inspectTerritory(tile);
      updateControls();
    }
  }
  if(artReview&&open&&artView==='bridge'&&!boardOrbit&&!motion){
    cameraGoal.set(26.0,29.0,-8.0);
    focusGoal.set(9.2,0,-12.8);
  } else if(artReview&&open&&artView==='entrance'&&!boardOrbit&&!motion) {
    const narrow=Math.max(0,2.25-camera.aspect);
    cameraGoal.set(-.28,2.85,9.9+Math.max(1,narrow*4.65));
    focusGoal.set(.47,.85,-2.85);
  } else if(shared&&overviewStart!==null) {
    overviewElapsed+=Math.max(0,Math.min(50,now-overviewStart));overviewStart=now;
    const progress=overviewElapsed/3600,pose=overviewPose(progress);
    cameraGoal.set(pose.x,pose.y,pose.z);focusGoal.set(0,.2,0);
    if(progress>=1)finishOverview();
  } else if(open&&boardOrbit&&!motion) {
    cameraGoal.setFromSpherical(boardOrbit).add(orbitTarget);
    focusGoal.copy(orbitTarget);
  } else if(open&&perthScene) {
    cameraGoal.set(boardView.x,boardView.y,boardView.z);
    focusGoal.set(0,.20,0);
  } else if(!reduce&&motion) {
    const {x,z}=motion.piece.root.position;
    cameraGoal.set(x+1.6,1.68,z+2.6);
    focusGoal.set(x-.12,.72,z-.28);
  } else {
    const {centre,depth,width,height,thickness}=gateLayout;
    // Crop into the closed leaves so the city is revealed only as they open.
    const halfFrustum=Math.tan(T.MathUtils.degToRad(camera.fov/2))/camera.zoom;
    const distance=.94*Math.min(height/2,width/camera.aspect)/halfFrustum;
    const lerp=T.MathUtils.lerp;
    cameraGoal.set(lerp(centre,perthScene?4.4:2.65,eased),
      lerp(height/2,perthScene?15.3:11.4,eased),
      lerp(depth+thickness/2+distance,perthScene?4.8:9.65,eased));
    focusGoal.set(lerp(centre,0,eased),lerp(height/2,.20,eased),lerp(depth,0,eased));
  }
  const blend=reduce||!open||motion||boardOrbit?1:.18;
  camera.position.lerp(cameraGoal,blend);
  cameraFocus.lerp(focusGoal,blend);
  camera.lookAt(cameraFocus);
  if(artReview)scene.fog.near=artView==='bridge'?46:17;
  if(artReview)scene.fog.far=artView==='bridge'?78:46;
  if(entranceSigns)entranceSigns.visible=camera.position.y<4;
  if(finale&&!reduce) {
    const elapsed=(now-finaleStart)/1000;
    finale.visible=elapsed<3.2;
    for(const [i,chip] of finale.children.entries()) {
      const angle=i*2.39996;
      const spread=elapsed*(.8+i%5*.24);
      chip.position.set(Math.cos(angle)*spread,Math.max(-.5,.35+elapsed*(2.3+i%4*.34)-elapsed*elapsed*1.05),Math.sin(angle)*spread);
      chip.rotation.set(elapsed*3+i,elapsed*2,elapsed*4);
    }
  }
  if(waterMaterial&&!reduce)waterMaterial.uniforms.time.value=now*.001;
  if(!reduce) for(const {car,direction,offset} of traffic)
    car.position.x=direction*((now*.0009+offset)%24-12);
  renderer.render(scene,camera);
  frame=requestAnimationFrame(draw);
}
function menu(arcade=false) {
  cancelAnimationFrame(frame);
  sceneHost.hidden=true;controls.hidden=true;el('roster').hidden=true;
  el('back').hidden=!arcade;
  el('heading').textContent=arcade?'Arcade Games':'The Market';
  el('menu').replaceChildren();
  status.textContent='';
  if(arcade)button(el('menu'),'Archon Engine',launch);
  else {
    button(el('menu'),'Explore the Market',()=>{status.textContent='For this preview, choose Arcade Games to reach the Archon site.';});
    el('menu').append(' ');
    button(el('menu'),'Arcade Games',()=>menu(true));
  }
}
async function launch() {
  el('menu').replaceChildren();sceneHost.hidden=false;
  el('heading').textContent='Archon Engine · City Plaza';
  el('back').hidden=false;
  try {
    if(perthScene&&!rigAssets.size) {
      status.textContent='Loading rigged occupation pieces…';
      await loadArt();
    }
    if(!renderer)create();reset();
  }
  catch {status.textContent='This preview requires WebGL. Try opening it in a desktop browser.';}
}
function syncBoard(state) {
  const previous=sharedState;
  sharedState=state;
  if(shouldOverview(previous,state,reduce))pendingOverview=true;
  if(!renderer)return;
  if(state.phase!=='ended'&&finale) {
    scene.remove(finale);
    finale=null;
  }
  if(state.phase==='ended'&&previous?.phase!=='ended'&&!reduce) {
    const colour=state.result?.winner==='A'?0x2acdb4:state.result?.winner==='B'?0xefaa42:0xefe6c4;
    finale=new T.Group();
    for(let i=0;i<36;i++)box(finale,i%4?colour:0xf9edca,[.10,.025,.16],[0,.35,0]);
    scene.add(finale);
    finaleStart=performance.now();
  }
  if(previous?.round!==state.round) {
    boardOrbit=null;
    for(const piece of pieces)scene.remove(piece.root);
    pieces=state.pieces.map(figure);active=null;motion=null;
  } else {
    for(const piece of pieces) {
      const next=state.pieces.find(item=>item.id===piece.id);
      piece.root.visible=!!next;
      if(!next||piece===motion?.piece||next.col===piece.col&&next.row===piece.row)continue;
      if(open&&!motion) {
        piece.body.rotation.y=Math.atan2(next.col-piece.col,next.row-piece.row);
        motion={start:performance.now(),piece,col:next.col,row:next.row};
      } else {
        piece.col=next.col;piece.row=next.row;
        piece.root.position.set(next.col-3.5,.025,next.row-3.5);
      }
    }
  }
  if(!selectablePieces().includes(active))active=null;
  updateControls();
  if(pendingOverview)startOverview();
}
el('back').onclick=()=>menu();
el('unlock').onclick=()=>{
  if(open||opening!==null||!renderer)return;
  el('unlock').hidden=true;opening=performance.now();
};
if(shared) {
  document.body.classList.add('embedded-board');
  el('embedded-styles').media='all';
  el('motion-help').hidden=true;
  const footer=document.createElement('div');
  footer.className='board-footer';
  const tools=document.createElement('details');
  tools.id='board-tools';
  tools.hidden=true;
  const summary=document.createElement('summary');
  summary.textContent='Board tools';
  tools.append(summary,controls);
  footer.append(status,tools);
  sceneHost.after(footer);
  window.addEventListener('message',event=>{
    if(event.origin===location.origin&&event.source===parent&&event.data?.type==='city-state')syncBoard(event.data.state);
  });
  launch();
  el('back').closest('header').hidden=true;
  parent.postMessage({type:'city-ready'},location.origin);
} else if(artReview) launch();
else menu();
