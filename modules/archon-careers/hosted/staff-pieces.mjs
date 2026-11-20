import * as T from './vendor/three.module.js';
import {addShowcaseBase} from './parallel/pieces/showcase-pieces.mjs';
export {addShowcaseBase};
const geometry=new T.BoxGeometry(1,1,1),sphere=new T.SphereGeometry(1,16,10),cylinder=new T.CylinderGeometry(1,1,1,24);
const palette=new Map();
function shape(parent,g,c,size,pos){if(!palette.has(c))palette.set(c,new T.MeshStandardMaterial({color:c,roughness:.65}));const m=new T.Mesh(g,palette.get(c));m.scale.set(...size);m.position.set(...pos);m.castShadow=true;parent.add(m);return m;}
const box=(p,c,s,v)=>shape(p,geometry,c,s,v),ball=(p,c,s,v)=>shape(p,sphere,c,s,v);
function grip(body,bone,name){const g=new T.Group();g.name=name;g.position.copy(body.worldToLocal(bone.getWorldPosition(new T.Vector3())));body.add(g);bone.attach(g);return g;}
function handle(p,w=.10,h=.05){for(const side of [-1,1])box(p,0x3b3934,[.016,h,.024],[side*w/2,-h/2,0]);box(p,0x3b3934,[w+.015,.018,.027],[0,0,0]);}
function cloth(p,colour,width,y0,y1,z0,z1){
 const vertices=[],indices=[],cols=20,rows=16;
 for(let j=0;j<=rows;j++){const v=j/rows,y=y0+(y1-y0)*v,w=width*(.88+.12*Math.sin(v*Math.PI));for(let i=0;i<=cols;i++){const u=i/cols,x=(u-.5)*w,z=z0+(z1-z0)*v-.012*Math.pow(2*u-1,2)+.003*Math.sin(u*Math.PI*8)*Math.sin(v*Math.PI);vertices.push(x,y,z);}}
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i;indices.push(a,a+1,a+cols+1,a+1,a+cols+2,a+cols+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();const m=new T.Mesh(g,new T.MeshStandardMaterial({color:colour,roughness:.97,side:T.DoubleSide}));p.add(m);return m;
}
function strap(p,colour,points,r=.009){const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));const mesh=new T.Mesh(new T.TubeGeometry(curve,24,r,8,false),new T.MeshStandardMaterial({color:colour,roughness:.9}));p.add(mesh);return mesh;}
// The bib follows the torso; the skirt follows the pelvis rather than the chest.
// Its front envelope is recalculated from the animated trousers, avoiding stride poke-through.
function apron(body,model,upper,colour,long=true){
 const y0=long?.47:.59,y1=.705,width=long?.27:.235;
 if(long){cloth(upper,colour,.205,.665,.875,.135,.123);for(const x of [-.072,.072]){
  const shoulder=strap(upper,colour,[[x,.871,.125],[x,.936,.075],[x,.955,.0],[x,.932,-.052],[x,.84,-.071],[x,.70,-.085]],.011);
  shoulder.name='Over-shoulder apron strap';
 }}
 const lower=new T.Group();lower.name='Pelvis-following apron';body.add(lower);
 const panel=cloth(lower,colour,width,y0,y1,.132,.123);panel.name='Stride-clear apron skirt';
 strap(upper,colour,[[-.128,.70,-.03],[-.105,.70,.09],[0,.70,.13],[.105,.70,.09],[.128,.70,-.03]],.011);
 const pocket=cloth(lower,0xc9b98d,.085,long?.575:.612,long?.64:.668,.143,.137);pocket.name='Apron pocket';
 body.updateMatrixWorld(true);(model.getObjectByName('Pelvis')??model.getObjectByName('Hip')).attach(lower);
 const pants=[];model.traverse(m=>{if(m.isSkinnedMesh&&m.userData.staffLowerGarment)pants.push(m);});
 body.userData.staffClothing={lower,panel,pocket,pants,model,y0,y1,width,rest:panel.geometry.attributes.position.array.slice(),pocketRest:pocket.geometry.attributes.position.array.slice()};
 updateStaffClothing(body);
}
export function updateStaffClothing(body){
 const kit=body.userData.staffClothing;if(!kit)return;
 body.updateMatrixWorld(true);
 const pose=[];for(const name of ['Pelvis','L_Thigh','R_Thigh','L_Calf','R_Calf']){const bone=kit.model.getObjectByName(name);if(bone)pose.push(...bone.matrixWorld.elements);}
 if(kit.pose&&pose.every((value,i)=>Math.abs(value-kit.pose[i])<1e-10))return;
 kit.pose=pose;
 const inverse=kit.lower.matrixWorld.clone().invert(),point=new T.Vector3();
 const fronts=new Float32Array(17*21);fronts.fill(-Infinity);
 // Each row covers a band wider than a cloth segment, conservatively enclosing folds.
 for(const mesh of kit.pants){mesh.skeleton.update();const transform=inverse.clone().multiply(mesh.matrixWorld);
  for(let i=0;i<mesh.geometry.attributes.position.count;i++){
   mesh.getVertexPosition(i,point).applyMatrix4(transform);
   if(Math.abs(point.x)>kit.width*.55||point.y<kit.y0-.03||point.y>kit.y1+.03)continue;
   for(let row=0;row<=16;row++)if(Math.abs(point.y-(kit.y0+(kit.y1-kit.y0)*row/16))<.025)
    for(let col=0;col<=20;col++)if(Math.abs(point.x-kit.rest[(row*21+col)*3])<.028){const i=row*21+col;fronts[i]=Math.max(fronts[i],point.z+.018);}
  }
 }
 // Bone capsules also protect the skirt when the base-only inspection rig has no garments.
 if(!kit.pants.length)for(const name of ['L_Thigh','R_Thigh','L_Calf','R_Calf']){
  const bone=kit.model.getObjectByName(name);if(!bone)continue;
  bone.getWorldPosition(point).applyMatrix4(inverse);
  for(let row=0;row<=16;row++)if(Math.abs(point.y-(kit.y0+(kit.y1-kit.y0)*row/16))<.13)for(let col=0;col<=20;col++){const i=row*21+col;fronts[i]=Math.max(fronts[i],point.z+.075);}
 }
 const positions=kit.panel.geometry.attributes.position;
 for(let i=0;i<positions.count;i++){positions.setZ(i,Math.max(kit.rest[i*3+2],fronts[i]));}
 positions.needsUpdate=true;kit.panel.geometry.computeVertexNormals();
 const pocket=kit.pocket.geometry.attributes.position;
 for(let i=0;i<pocket.count;i++){const row=Math.max(0,Math.min(16,Math.round((pocket.getY(i)-kit.y0)/(kit.y1-kit.y0)*16))),col=Math.max(0,Math.min(20,Math.round(pocket.getX(i)/kit.width*20+10)));pocket.setZ(i,Math.max(kit.pocketRest[i*3+2],positions.getZ(row*21+col)+.008));}
 pocket.needsUpdate=true;kit.pocket.geometry.computeVertexNormals();
}
function chefJacket(body,model,upper){
 // Coat silhouette, sleeves and collar are the existing skinned shirt itself.
 // Fit the two button rows to that shirt's surface; no floating rigid bib/collar.
 const coat=new T.Group();coat.name='Double-breasted chef coat';upper.add(coat);
 const tops=[];model.traverse(m=>{if(m.isSkinnedMesh&&m.userData.staffUpperGarment){
  tops.push(m);
  // Replace the work-shirt's contrasting back collar on the actual skinned garment.
  const multiple=Array.isArray(m.material),materials=(multiple?m.material:[m.material]).map(source=>{const material=source.clone();material.color.set(0xf6eddc);material.map=null;material.roughness=.92;return material;});m.material=multiple?materials:materials[0];
 }});
 body.updateMatrixWorld(true);const inverse=body.matrixWorld.clone().invert(),point=new T.Vector3();
 for(const x of [-.052,.052])for(const y of [.738,.787,.836]){
  let front=-Infinity;
  for(const mesh of tops){mesh.skeleton.update();const transform=inverse.clone().multiply(mesh.matrixWorld);
   for(let i=0;i<mesh.geometry.attributes.position.count;i++){mesh.getVertexPosition(i,point).applyMatrix4(transform);if(Math.abs(point.x-x)<.025&&Math.abs(point.y-y)<.025)front=Math.max(front,point.z);}
  }
  const button=ball(coat,0x343c3c,[.008,.008,.004],[x,y,(Number.isFinite(front)?front:.105)+.006]);button.name='Chef coat button';
 }
}
function bowl(p,pos=[0,-.12,.025]){const g=new T.Group();g.position.set(...pos);p.add(g);shape(g,new T.CylinderGeometry(1,.57,1,24),0xf4dfbd,[.09,.09,.09],[0,0,0]);shape(g,cylinder,0xb98543,[.079,.009,.079],[0,.046,0]);for(let i=0;i<4;i++){const noodle=new T.Mesh(new T.TorusGeometry(.045+i*.007,.004,5,18),new T.MeshStandardMaterial({color:0xf4cc71}));noodle.rotation.x=Math.PI/2;noodle.position.y=.052;g.add(noodle);}ball(g,0x518341,[.024,.012,.032],[.035,.063,0]);return g;}
export function attachShowcaseDetails(body,model,code){const right=model.getObjectByName('R_Hand'),left=model.getObjectByName('L_Hand'),spine=model.getObjectByName('Spine02'),head=model.getObjectByName('Head');if(!right||!left||!spine||!head)return false;
 let hand=grip(body,right,'Staff equipment '+code);const outfit=new T.Group();outfit.name='Restaurant staff outfit '+code;body.add(outfit);
 const colours={EL:0x304d48,CP:0xf6ecd2,NS:0x743e32,SD:0x49774c,RE:0x34445c,EC:0x477c8c};
 if(['NS','SD','RE'].includes(code))apron(body,model,outfit,colours[code],code==='SD');
 if(code==='CP')chefJacket(body,model,outfit);
 box(outfit,0xf6d38b,[.054,.038,.014],[-.057,.86,.109]);
 if(code==='CP'){
  box(hand,0x785033,[.034,.15,.035],[0,-.035,0]);
  const wok=shape(hand,new T.SphereGeometry(1,20,10,0,Math.PI*2,0,Math.PI/2),0x343a3c,[.12,.045,.12],[0,-.12,.07]);wok.rotation.z=Math.PI;
  bowl(hand,[0,-.135,.07]).scale.setScalar(.75);
  const hat=new T.Group();hat.name='Cook toque';body.add(hat);hat.position.set(0,(body.userData.staffHeadTop??1.19)-.025,0);
  shape(hat,cylinder,0xfff3d8,[.095,.055,.09],[0,0,0]);
  for(const x of [-.048,0,.048])ball(hat,0xfff3d8,[.062,.065,.065],[x,.055,0]);
  body.updateMatrixWorld(true);head.attach(hat);
 }else if(code==='NS'){
  const tablet=new T.Group();tablet.name='Waiter order tablet';hand.add(tablet);tablet.position.set(0,.005,.025);tablet.rotation.set(-1.03,.30,0);
  box(tablet,0x263b40,[.12,.17,.022],[0,-.068,.014]);box(tablet,0x83d6cc,[.099,.139,.006],[0,-.066,.028]).name='Order tablet screen';
  for(let i=0;i<3;i++)box(tablet,0xf7edcf,[.062,.009,.004],[0,-.027-i*.03,.033]);
  box(tablet,0x263b40,[.016,.085,.016],[.068,-.07,.015]).name='Order stylus';
 }else if(code==='SD'){
  handle(hand,.11,.05);box(hand,0xc4a86f,[.19,.13,.14],[0,-.115,0]);
  for(const x of [-.058,0,.058])ball(hand,0x5c9142,[.028,.067,.027],[x,-.025,0]);
 }else if(code==='RE'){
  handle(hand,.08,.035);box(hand,0x293f49,[.12,.19,.045],[0,-.12,.016]);box(hand,0x8ee2ce,[.088,.067,.009],[0,-.075,.043]);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)box(hand,0xf5dfb5,[.016,.014,.009],[(i-1)*.027,-.13-j*.022,.044]);
 }else if(code==='EC'){
  const kit=new T.Group();kit.name='Outboard cleaning kit';hand.add(kit);kit.position.set(-.035,0,.075);
  const carry=hand;hand=kit;
  box(carry,0x3b3934,[.016,.018,.10],[-.018,0,.035]);handle(hand,.15,.06);
  const bucket=shape(hand,new T.CylinderGeometry(1,.78,1,24,1,true),0x38899a,[.115,.13,.078],[0,-.14,0]);bucket.name='Open cleaning bucket';
  shape(hand,cylinder,0x285365,[.09,.009,.058],[0,-.20,0]);
  box(hand,0xe7ce56,[.047,.13,.042],[.055,-.018,.025]).name='Cleaning spray bottle';
  box(hand,0x34494b,[.025,.018,.026],[.055,.056,.025]);box(hand,0x34494b,[.05,.018,.022],[.067,.070,.037]);
  box(hand,0x34494b,[.012,.031,.014],[.086,.050,.043]).rotation.z=-.3;
  box(hand,0xf7f3d8,[.031,.043,.006],[.055,-.012,.049]);
  const rag=cloth(hand,0xeee2cb,.072,-.18,-.065,.085,.077);rag.position.x=.055;rag.name='Draped cleaning cloth';
 }else{
  handle(hand,.085,.035);box(hand,0x634330,[.15,.22,.034],[0,-.145,0]);box(hand,0xf0d694,[.12,.17,.008],[0,-.14,.021]);
  for(let i=0;i<4;i++)box(hand,0x6f7866,[.075,.007,.009],[0,-.095-i*.025,.028]);
 }
 spine.attach(outfit);return true;
}
