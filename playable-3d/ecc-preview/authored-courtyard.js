import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {timberMap} from './hero-materials.js?v=authored1';
import * as T from 'three';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {addAuthoredGarden} from './authored-garden.js?v=windows1';
export const ECC_WELCOME={x:4.9,z:6.4};
const beds=[[-8,5,2.8,4.6],[-6.3,-6.5,5,1.7],[7.2,10.9,4.7,2],[2.3,-.8,1.1,1.3],[-4.9,6.4,2.65,2.6],[5.8,5.2,3,2.6]];
export const courtyardObstacles=[{type:'circle',x:-5.53,z:2.53,r:.26},{type:'circle',x:-10,z:-4,r:.3},{type:'circle',x:10.8,z:-3,r:.3},{type:'box',x:0,z:-4.55,w:8,d:4.2},{type:'box',x:6.45,z:-1.45,w:4.4,d:6.4},{type:'chapel',x:-6,z:-1,r:3.05,doorAngle:.75,doorHalf:.23},...beds.map(([x,z,w,d])=>({type:'box',x,z,w,d})),{type:'box',x:4.9,z:6.4,w:2.35,d:.7},...[[-6,4,2.3,.75],[5.7,7.7,2.5,.75],[-6,8.3,2.3,.75],[9.3,3.7,.75,1.9]].map(([x,z,w,d])=>({type:'box',x,z,w,d}))];
for(const [x,z,w,d] of [[-2.9,-.32,2,3.5],[3.25,.1,1.6,4.25]])for(const dx of [-w/2+.12,w/2-.12])for(const dz of [-d/2+.12,d/2-.12])courtyardObstacles.push({type:'box',x:x+dx,z:z+dz,w:.12,d:.12});
function label(words,w,h,x,y,z,dark=false){const c=document.createElement('canvas');c.width=1024;c.height=Math.ceil(1024*h/w);const ctx=c.getContext('2d');ctx.fillStyle=dark?'#263e42':'#eee4c9';ctx.font=`500 ${c.height*.57}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(words,512,c.height/2,970);const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,transparent:true,depthWrite:false,roughness:.6}));o.position.set(x,y,z);return o;}
async function maps(){const loader=new T.TextureLoader();const names=['sandstone-diffuse.jpg','sandstone-normal.jpg','sandstone-arm.jpg'];const [map,normalMap,packed]=await Promise.all(names.map(n=>loader.loadAsync(new URL('./assets/courtyard/'+n,import.meta.url).href)));map.colorSpace=T.SRGBColorSpace;for(const t of [map,normalMap,packed]){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;}return {map,normalMap,packed};}
export async function buildAuthoredCourtyard(doors){
 const [asset,stone,logo,hdr,paving]=await Promise.all([new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(new URL('./assets/authored-courtyard/ecc-courtyard-compressed.glb?v=4',import.meta.url).href),maps(),new T.TextureLoader().loadAsync(new URL('./assets/ECC_Logo.png',import.meta.url).href),new HDRLoader().loadAsync(new URL('./assets/authored-courtyard/garden-reflections.hdr',import.meta.url).href),Promise.all(['diffuse','normal','arm'].map(n=>new T.TextureLoader().loadAsync(new URL('./assets/authored-courtyard/stone-surface-'+n+'.webp',import.meta.url).href)))]);
 hdr.mapping=T.EquirectangularReflectionMapping;for(const t of paving){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(2,2);t.anisotropy=8;}paving[0].colorSpace=T.SRGBColorSpace;
 const woodMap=timberMap();const root=asset.scene;root.name='ECC authored arrival courtyard';
 root.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;const m=o.material;m.name=m.name.replaceAll('_',' ');m.envMap=hdr;m.envMapIntensity=.16;
  if(/limestone|sandstone/.test(m.name)){m.map=stone.map;m.normalMap=stone.normalMap;m.normalScale.set(.18,.18);m.aoMap=stone.packed;m.aoMapIntensity=.35;m.roughnessMap=stone.packed;m.color.setHex(/cut/.test(m.name)?0xede1c3:0xffffff);m.roughness=1;}
  if(m.name==='ECC courtyard glass'){m.name='ECC authored glass';m.depthWrite=false;m.transparent=true;m.opacity=.14;m.side=T.DoubleSide;m.color.setHex(0xd4ded0);m.metalness=.06;m.roughness=.07;m.envMapIntensity=.38;m.forceSinglePass=true;o.castShadow=false;}
  if(m.name==='ECC travertine paving'){m.map=paving[0];m.normalMap=paving[1];m.normalScale.set(.065,.065);m.roughnessMap=paving[2];m.aoMap=paving[2];m.aoMapIntensity=.2;m.color.setRGB(.72,.84,.95);m.roughness=.94;
   // Sawn paving keeps photographic grain, with restrained colour contrast at walking distance.
   m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n diffuseColor.rgb = mix(vec3(.56,.52,.43), diffuseColor.rgb, .24);');};m.customProgramCacheKey=()=> 'ecc-sawn-paving-v1';}
  if(m.name==='ECC powdercoat blue'){m.color.setHex(0x28526a);m.roughness=.48;m.metalness=.25;m.envMapIntensity=.38;}
  if(m.name==='ECC plaster'){m.color.setHex(0x938363);m.envMapIntensity=.28;}
  if(m.name==='ECC clay roof'){m.side=T.DoubleSide;m.color.setHex(0xa85a35);m.roughness=.89;}
  if(/warm interior/.test(m.name)){m.emissiveIntensity=.8;}
  if(/travertine paving|brick paving|mortar|soil/.test(m.name))o.castShadow=false;
  if(m.name==='Chapel tree silver'){m.color.setHex(0xc8d5cc);m.emissive.setHex(0x6d8980);m.emissiveIntensity=.14;}
  if(m.name==='ECC warm timber'||m.name==='ECC warm soffit'){m.map=woodMap;m.color.setHex(0xc4a175);m.roughness=.78;}
  m.needsUpdate=true;
 });
 // Retain the user's photo byte-for-byte; texture UVs isolate the iconic glass and figure.
 const recognition=await new T.TextureLoader().loadAsync(new URL('./assets/authored-courtyard/chapel-recognition-source.png',import.meta.url).href);recognition.colorSpace=T.SRGBColorSpace;recognition.anisotropy=8;
 recognition.repeat.set(106/304,190/356);recognition.offset.set(130/304,1-286/356);
 const recognitionPanel=new T.Mesh(new T.PlaneGeometry(1.55,2.94),new T.MeshStandardMaterial({map:recognition,roughness:.65,emissiveMap:recognition,emissive:0xffffff,emissiveIntensity:.14}));recognitionPanel.name='Iconic chapel tree glass and figure — supplied photograph';recognitionPanel.position.set(-5.68,1.83,2.151);root.add(recognitionPanel);
 const interior=await new T.TextureLoader().loadAsync(new URL('./assets/authored-courtyard/reception-backwall.jpg',import.meta.url).href);interior.colorSpace=T.SRGBColorSpace;interior.anisotropy=8;
 const roomArt=new T.MeshStandardMaterial({map:interior,emissiveMap:interior,emissive:0xffddb2,emissiveIntensity:.45,color:0xffffff,roughness:.95});
 for(const [x,z,w]of [[0,-5.72,3.03],[-2.78,-5.19,1.98],[2.78,-5.19,1.98],[6.45,-1.69,3.2]]){const panel=new T.Mesh(new T.PlaneGeometry(w,2.75),roomArt);panel.name='Recessed reception background texture';panel.position.set(x,1.48,z);root.add(panel);}
 logo.colorSpace=T.SRGBColorSpace;logo.anisotropy=8;const logoMat=new T.MeshStandardMaterial({map:logo,transparent:true,roughness:.55,depthWrite:false});
 for(const [x,y,z,w,h]of [[0,4.08,-1.69,.71,1.01],[ECC_WELCOME.x,1.73,ECC_WELCOME.z+.05,1.12,1.59]]){const o=new T.Mesh(new T.PlaneGeometry(w,h),logoMat);o.position.set(x,y,z);root.add(o);}
 root.add(label('ADMINISTRATION',3.45,.26,0,3.17,-1.059),label('STUDENT SERVICES',3.55,.26,6.45,3.77,2.602),label('CHAPEL',.84,.21,-3.89,3.59,1.30,true),label('WELCOME TO ECC',2.15,.24,ECC_WELCOME.x,.41,ECC_WELCOME.z+.331,true),label('Career Empire',1.05,.12,ECC_WELCOME.x,.18,ECC_WELCOME.z+.331,true));
 addAuthoredGarden(root,beds);
 for(const [x,y,z]of [[0,2.45,-3.1],[6.45,2.45,.4],[-4.0,2.45,.35]]){const l=new T.PointLight(0xffc17b,9,4.5,2);l.position.set(x,y,z);l.name='ECC warm recessed room light';root.add(l);}
 // Detailed rocks reused from the accepted kit; instance them within the planted areas.
 const rock=await new GLTFLoader().loadAsync(new URL('../assets/campus-landscape/boulder-a.glb',import.meta.url).href);rock.scene.updateMatrixWorld(true);
 rock.scene.traverse(o=>{if(!o.isMesh)return;const sites=[[-7.7,3.5,.7],[-8.5,5.7,.55],[-6.5,-6.5,.5],[6.6,11,.55],[7.9,10.8,.35],[-5.25,5.95,.40],[-4.45,6.90,.28],[5.35,4.50,.34],[6.6,5.3,.40]];const geo=o.geometry.clone().applyMatrix4(o.matrixWorld);const inst=new T.InstancedMesh(geo,o.material,sites.length);inst.name='ECC garden stone outcrops';const d=new T.Object3D();sites.forEach(([x,z,s],i)=>{d.position.set(x,.36,z);d.rotation.y=i*1.71;d.scale.setScalar(s);d.updateMatrix();inst.setMatrixAt(i,d.matrix);});inst.castShadow=inst.receiveShadow=true;root.add(inst);});
 return {root,architecture:root,obstacles:courtyardObstacles,doors,materials:{},plantInstances:root.userData.plantInstances||0};
}
