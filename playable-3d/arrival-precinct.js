import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
// One bounded, walkable precinct. Existing Studio interaction remains at (-12.4, 5).
export function arrivalPrecinct(town,stoneTexture,sign){
 const root=new THREE.Group();root.name='Arrival to Studio campus';town.add(root);
 const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
 const stone=mat(0xe9d6b4),navy=mat(0x293f49),wood=mat(0x96704b),soil=mat(0x645743),grass=mat(0x6e8050);
 stone.map=stoneTexture;stone.bumpMap=stoneTexture;stone.bumpScale=.035;
 const glass=new THREE.MeshStandardMaterial({color:0x678e97,metalness:.3,roughness:.16,transparent:true,opacity:.65});
 const warm=new THREE.MeshStandardMaterial({color:0xf6e1af,emissive:0xffc976,emissiveIntensity:.25,roughness:.7});
 function box(g,x,y,z,w,h,d,m){const geo=new THREE.BoxGeometry(w,h,d);if(m===stone){const uv=geo.attributes.uv,n=geo.attributes.normal;for(let i=0;i<uv.count;i++){const side=Math.abs(n.getX(i))>.5;uv.setXY(i,uv.getX(i)*(side?d:w)/2,uv.getY(i)*(Math.abs(n.getY(i))>.5?d:h)/2);}}const a=new THREE.Mesh(geo,m);a.position.set(x,y,z);a.castShadow=a.receiveShadow=true;g.add(a);return a;}
 const building=new THREE.Group();building.position.set(-17,0,5);building.rotation.y=Math.PI/2;root.add(building);
 // Architecture stage: two-storey stone tower, recessed glazed wing and deep veranda.
 box(building,0,0,0,6.3,.12,8.1,stone);
 box(building,0,3.4,-3.8,6.3,6.8,.35,stone);
 box(building,-3,3.4,0,.35,6.8,8,stone);
 box(building,3,2.1,0,.35,4.2,8,stone);
 box(building,0,3.3,0,6.4,.24,8.2,stone);
 box(building,-.65,6.5,-.5,5.35,.25,7.4,navy);
 box(building,-.65,6.68,-.5,5.5,.15,7.6,stone);
 box(building,2.45,4.1,0,1.4,.2,8.1,navy);
 // Tall asymmetric entry pier and visible timber soffit.
 box(building,-2.55,3.7,3.7,.8,7.4,.8,stone);
 box(building,.5,2.9,4.15,7,.18,2.1,navy);
 box(building,.5,2.79,4.15,6.7,.06,1.95,wood);
 for(const x of [-2.7,3.4])box(building,x,1.4,4.9,.12,2.8,.12,navy);
 for(const level of [0,3.35])for(let x=-1.8;x<2.1;x+=.9){
  box(building,x,level+1.48,3.54,.81,2.7,.035,glass);
  box(building,x-.45,level+1.48,3.6,.06,2.85,.09,navy);
 }
 for(const y of [.1,2.8,3.45,6.2])box(building,0,y,3.6,4.55,.07,.08,navy);
 for(let z=-3.3;z<2.8;z+=.65){box(building,2.82,1.55,z,.08,2.8,.09,navy);box(building,2.8,1.55,z+.28,.035,2.6,.48,glass);}
 for(let x=-2;x<1.6;x+=.28)box(building,x,4.9,3.82,.075,2.7,.24,wood);
 // Interior silhouettes through glazing, avoiding blank mirrored boxes.
 for(const x of [-1.1,1.1]){box(building,x,.75,2,1.3,.12,.7,wood);box(building,x,.35,2,.12,.7,.12,navy);box(building,x,4.25,1.6,1.4,.8,.7,warm);}
 const plaque=sign('AVATAR STUDIO',2.4,'#f6e9ce','#29434a');plaque.position.set(.25,3.12,5.23);building.add(plaque);
 // Landscape stage: continuous walk from arrival, generous clear central lane.
 box(root,-7,.035,11.5,4.5,.07,17,stone);box(root,-10,.04,5,7,.08,4.2,stone);
 function pergola(x,z,w,d){box(root,x,3.45,z-d/2,w,.16,.13,navy);box(root,x,3.45,z+d/2,w,.16,.13,navy);for(const dx of [-w/2+.15,w/2-.15])for(const dz of [-d/2+.15,d/2-.15])box(root,x+dx,1.72,z+dz,.13,3.44,.13,navy);for(let q=-w/2;q<w/2;q+=.28)box(root,x+q,3.58,z,.12,.16,d+.25,wood);}
 pergola(-7,18,5.4,3.6);pergola(-7,11.5,4.4,4.5);
 const welcome=sign('ARRIVAL GARDENS',2.8,'#f4e5c6','#29434a');welcome.position.set(-7,3.15,19.9);root.add(welcome);
 let seed=719;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const plants=[];
 for(const [x,z,w,d] of [[-10.6,11.2,2.1,7],[-3.3,12,2.7,8],[-10.7,1,3,3],[-3.7,2,3.1,3.8],[-10.7,20.6,3.5,2.2]]){
  box(root,x,.22,z,w,.44,d,stone);box(root,x,.46,z,w-.2,.08,d-.2,soil);
  for(let i=0;i<w*d*13;i++)plants.push([x+(random()-.5)*(w-.35),z+(random()-.5)*(d-.3),.3+random()*.6]);
 }
 const leafGeo=new THREE.SphereGeometry(1,5,3);leafGeo.scale(.045,.42,.055);
 const foliage=new THREE.InstancedMesh(leafGeo,mat(0x647c45),plants.length*7);foliage.castShadow=foliage.receiveShadow=true;const transform=new THREE.Object3D();let n=0;
 for(const [x,z,s] of plants)for(let j=0;j<7;j++){transform.position.set(x,.55+s*.28,z);transform.rotation.set((random()-.5)*1.5,j*.9,(random()-.5)*1.6);transform.scale.setScalar(s);transform.updateMatrix();foliage.setMatrixAt(n++,transform.matrix);}root.add(foliage);
 // Stone outcrops and seating frame the walkway, never obstruct its centre.
 for(const [x,z] of [[-10.6,9],[-3.3,10],[-3.5,15],[-10.5,2]]){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.65,1),mat(0xabaa91));rock.position.set(x,.6,z);rock.scale.set(1.3,.65,1);rock.castShadow=true;root.add(rock);}
 for(const z of [8,15]){box(root,-4.5,.55,z,.48,.13,2,wood);for(const dz of [-.7,.7])box(root,-4.5,.27,z+dz,.38,.5,.1,navy);}
 for(const z of [6.5,9,13.8,16.2]){box(root,-5,.36,z,.11,.72,.11,navy);box(root,-5,.67,z,.13,.1,.13,warm);}
 const routeMat=new THREE.MeshStandardMaterial({color:0x3b9996,emissive:0x1c6c69,emissiveIntensity:.25});
 for(const z of [16,14.5,8.5,7]){const arrow=new THREE.Mesh(new THREE.ConeGeometry(.18,.42,3),routeMat);arrow.rotation.x=-Math.PI/2;arrow.position.set(-7,.1,z);root.add(arrow);}
// Fine leaves and pale branching trunks for the close-up native garden trees.
 const treeSites=[[-11.3,10,6.8],[-2.8,13,7.4],[-11,0,6.6],[-3,1,7.2]];
 const leafShape=new THREE.SphereGeometry(1,5,3);leafShape.scale(.055,.22,.025);
 const canopy=new THREE.InstancedMesh(leafShape,mat(0x627747),treeSites.length*850);canopy.castShadow=true;let li=0;
 for(const [x,z,h] of treeSites){
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.08,.19,h*.75,9),mat(0xb2aaa0));trunk.position.set(x,h*.375,z);trunk.castShadow=true;root.add(trunk);
  for(let b=0;b<5;b++){const angle=b*2.4;const start=new THREE.Vector3(x,h*.4,z),end=new THREE.Vector3(x+Math.cos(angle)*1.25,h*(.7+b*.055),z+Math.sin(angle)*1.25);const delta=end.clone().sub(start);const branch=new THREE.Mesh(new THREE.CylinderGeometry(.025,.065,delta.length(),6),trunk.material);branch.position.copy(start.add(end).multiplyScalar(.5));branch.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());root.add(branch);}
  for(let j=0;j<850;j++){const a=random()*Math.PI*2,r=Math.sqrt(random())*2.2;transform.position.set(x+Math.cos(a)*r,h*.72+random()*1.9-r*.18,z+Math.sin(a)*r);transform.rotation.set(random()*2,random()*6,random()*2);transform.scale.setScalar(.65+random()*.6);transform.updateMatrix();canopy.setMatrixAt(li++,transform.matrix);}
 }root.add(canopy);
 // Merge static surfaces by material to keep the scene affordable to render.
 root.updateMatrixWorld(true);const buckets=new Map();const originals=[];
 root.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;const g=o.geometry.clone().applyMatrix4(o.matrixWorld);if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(g);originals.push(o);});
 for(const o of originals)o.removeFromParent();
 for(const [material,geos] of buckets){const mesh=new THREE.Mesh(mergeGeometries(geos),material);mesh.castShadow=mesh.receiveShadow=true;town.add(mesh);}

 // Existing tree assets supply detailed native canopies around the new courtyard.
 return {trees:[],colliders:[[-10.6,.22,11.2,2.1,.44,7],[-3.3,.22,12,2.7,.44,8],[-10.7,.22,1,3,.44,3],[-3.7,.22,2,3.1,.44,3.8]]};
}
