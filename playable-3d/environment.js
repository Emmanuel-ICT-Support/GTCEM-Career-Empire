import * as T from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {addSurroundings} from './environment/surroundings.js';
export async function integrateEnvironment(world){
const plantInstances=[];const basePhase=world.phase;
const presets={
 disrepair:{sun:0xdce5ef,p:[-16,30,20],power:.65,sky:0xcbd8e5,ground:0x83918a,fill:1.45,exposure:1,map:2048,radius:4,size:.65,grass:0xb5bfaa,top:'#61758b',horizon:'#b9c5cc',cloud:'#748392',caption:'Disrepair · Muted overcast daylight, darker clouds and smaller plants (65%). Paths and entrances stay readable.'},
 growth:{sun:0xfff5e8,p:[-16,28,20],power:2,sky:0xdceeff,ground:0x8eaa8d,fill:1.7,exposure:1,map:2048,radius:3,size:.85,grass:0xd4e8c1,top:'#79b5d8',horizon:'#e6ece5',cloud:'#edf0ee',caption:'Growth · Fresh morning light and clearing skies. The same plants at 85% size; greens are recovering.'},
 flourishing:{sun:0xfffdf4,p:[-16,42,20],power:2.65,sky:0xe1f2ff,ground:0x98b697,fill:1.8,exposure:1,map:2048,radius:3,size:1,grass:0xc5e9ae,top:'#459bce',horizon:'#c9e9f3',cloud:'#ffffff',caption:'Flourishing · Bright spring sunshine, healthy greens, full-size plants and a delicate rainbow. No sunset tint.'}
};
const skies={};
function stageSky(name){
 if(skies[name])return skies[name];
 const p=presets[name],c=document.createElement('canvas');c.width=2048;c.height=1024;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,0,850);g.addColorStop(0,p.top);g.addColorStop(.65,p.horizon);g.addColorStop(1,p.horizon);x.fillStyle=g;x.fillRect(0,0,2048,1024);
 // Deterministic cloud clusters: shaded undersides and soft, rounded white tops.
 const cloudCount=name==='disrepair'?17:name==='growth'?11:6;
 for(let i=0;i<cloudCount;i++){
  const cx=i*2048/cloudCount+70,cy=390+(i%3)*32;
  x.filter='blur(5px)';x.globalAlpha=name==='disrepair'?.8:.82;
  for(let j=0;j<5;j++){
   const px=cx+(j-2)*32,py=cy-Math.sin(j/4*Math.PI)*28,r=38+(j%3)*9;
   const cg=x.createLinearGradient(0,py-r,0,py+r);
   cg.addColorStop(0,name==='disrepair'?'#8996a4':'#ffffff');
   cg.addColorStop(1,name==='disrepair'?'#4d5e72':'#d1e1eb');
   x.fillStyle=cg;x.beginPath();x.ellipse(px,py,r,r*.68,0,0,Math.PI*2);x.fill();
  }
 }
 x.filter='none';if(name==='flourishing'){x.globalAlpha=.16;['#ef7474','#f4af65','#f5df85','#89c998','#83bcdf','#aaa0d5'].forEach((color,i)=>{x.strokeStyle=color;x.lineWidth=6;x.beginPath();x.arc(1100,625,190-i*6,Math.PI,Math.PI*2);x.stroke();});}
 x.globalAlpha=1;const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.mapping=T.EquirectangularReflectionMapping;skies[name]=t;return t;
}
function capturePlants(){
 // ECC hero beds are authored separately from the surrounding landscape.
 world.town.traverse(o=>{if(!o.isInstancedMesh||o.name!=='Oval edge eucalypts'&&!/^Approved (tufted-grass|yellow-flower-clump|olive-shrub|mature-eucalypt-[ab]|small-multistem-a)$/.test(o.name))return;const matrices=[];for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);matrices.push({i,m});}plantInstances.push({o,matrices});});

 // Landscape instances preserve original species, placement and soil-level pivot.
 const rocks=world.campus.placements.filter(p=>p.id==='boulder-a');
 world.campus.group.traverse(o=>{if(!o.isInstancedMesh)return;const matrices=[];for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);const pos=new T.Vector3().setFromMatrixPosition(m);if(rocks.some(r=>Math.abs(r.x-pos.x)<.01&&Math.abs(r.z-pos.z)<.01))continue;matrices.push({i,m});}if(matrices.length)plantInstances.push({o,matrices});});
}
function apply(name){const p=presets[name];basePhase(name);world.town.background=stageSky(name);if(world.town.fog)world.town.fog.color.set(p.horizon);
 plantInstances.forEach(({o,matrices})=>{matrices.forEach(({i,m})=>{const n=m.clone();n.scale(new T.Vector3(p.size,p.size,p.size));o.setMatrixAt(i,n);});o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere();});
 world.town.traverse(o=>{if(o.isMesh){for(const m of (Array.isArray(o.material)?o.material:[o.material])){if(m.map?.image?.src?.includes('grass-ecc-campus'))m.color.set(p.grass);}}});world.town.traverse(o=>{if(o.isDirectionalLight){o.color.set(p.sun);o.intensity=p.power;o.position.fromArray(p.p);o.shadow.radius=p.radius;if(o.shadow.mapSize.x!==p.map){o.shadow.mapSize.set(p.map,p.map);o.shadow.map?.dispose();o.shadow.map=null;o.shadow.needsUpdate=true;}}if(o.isHemisphereLight){o.color.set(p.sky);o.groundColor.set(p.ground);o.intensity=p.fill;}});}

const surroundings=await addSurroundings(world.town);capturePlants();world.phase=apply;
// Closed reference building footprint where the approved Media exterior meets the playable edge.
world.townPhysics.world.createCollider(RAPIER.ColliderDesc.cuboid(10.95,3.6,3.25).setTranslation(-32,3.6,21).setRotation({x:0,y:Math.sin(-.6/2),z:0,w:Math.cos(-.6/2)}));
// Newly accessible exteriors remain solid; the playing surface stays open.
const block=(x,y,z,w,h,d)=>world.townPhysics.world.createCollider(RAPIER.ColliderDesc.cuboid(w/2,h/2,d/2).setTranslation(x,y,z));
block(-49,2.8,-11.68,21.25,5.6,5.95);
block(-40.8,3.5,-11.4,3.83,7,5.78);
block(-40.755,2.4,-16.78,3.74,4.8,2.98);
block(43,1.4,-26,12,2.8,3);
for(const z of [14,72])for(const dx of [-7,-2.4,2.4,7])block(-54+dx,2,z,.12,4,.12);
for(const {x,z} of surroundings.userData.treePlacements)world.townPhysics.world.createCollider(RAPIER.ColliderDesc.cylinder(2,.28).setTranslation(x,2,z));

}
