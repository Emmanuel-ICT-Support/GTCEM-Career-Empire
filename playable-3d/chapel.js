import * as THREE from 'three';
function roundedBox(w,h,d,segments,r){const sh=new THREE.Shape(),x=-w/2,y=-h/2;sh.moveTo(x+r,y);sh.lineTo(x+w-r,y);sh.quadraticCurveTo(x+w,y,x+w,y+r);sh.lineTo(x+w,y+h-r);sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h);sh.lineTo(x+r,y+h);sh.quadraticCurveTo(x,y+h,x,y+h-r);sh.lineTo(x,y+r);sh.quadraticCurveTo(x,y,x+r,y);const g=new THREE.ExtrudeGeometry(sh,{depth:d-.04,steps:1,bevelEnabled:true,bevelSegments:segments,bevelSize:.02,bevelThickness:.02,curveSegments:6});g.translate(0,0,-(d-.04)/2);return g;}
/** ECC Chapel: compact photo-backed interpretation. Original reference JPEGs remain unchanged. */
export const CHAPEL={x:-3.15,z:-8.8,entry:[0,5.3],reflection:[-6.2,2.4]};
export async function buildChapel(scene,physics){
 const root=new THREE.Group();root.name='ECC Chapel reflection interior';
 const loader=new THREE.TextureLoader();
 const [altarPhoto,treePhoto]=await Promise.all(['altar-reference.jpg','tree-glass-reference.jpg'].map(n=>loader.loadAsync(new URL('./assets/chapel/'+n,import.meta.url).href)));
 for(const t of [altarPhoto,treePhoto]){t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;}
 const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
 const ivory=mat(0xf4f0e7),oak=mat(0xb88c57),stone=mat(0xd5c5a7),cloth=mat(0xfffaf0),chair=mat(0xded7c8),dark=mat(0x26434a),gold=mat(0xb89c62,.4),glass=mat(0xaebfba,.5);
 const woodCanvas=document.createElement('canvas');woodCanvas.width=128;woodCanvas.height=512;const wc=woodCanvas.getContext('2d');wc.fillStyle='#b88b58';wc.fillRect(0,0,128,512);for(let i=0;i<160;i++){wc.strokeStyle=i%3?'rgba(70,38,14,.12)':'rgba(255,230,177,.2)';wc.lineWidth=.3+(i%4)*.2;wc.beginPath();for(let y=0;y<=512;y+=8){const x=(i*37)%128+Math.sin(y*.023+i)*1.5;if(y===0)wc.moveTo(x,y);else wc.lineTo(x,y);}wc.stroke();}const woodTexture=new THREE.CanvasTexture(woodCanvas);woodTexture.colorSpace=THREE.SRGBColorSpace;woodTexture.wrapS=woodTexture.wrapT=THREE.RepeatWrapping;woodTexture.repeat.set(2,2);oak.color.set(0xffffff);oak.map=woodTexture;
 const carpet=mat(0xffffff);const cv=document.createElement('canvas');cv.width=cv.height=128;const ctx=cv.getContext('2d');ctx.fillStyle='#c7bfaf';ctx.fillRect(0,0,128,128);for(let i=0;i<5000;i++){const n=(i*73)%128,m=(i*37+Math.floor(i/128)*11)%128;ctx.fillStyle=i%2?'#bfb5a4':'#d0c7b7';ctx.fillRect(n,m,1,2);}const texture=new THREE.CanvasTexture(cv);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(18,18);carpet.map=texture;
 function box(w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);return o;}
 function cylinder(r,h,m,x,y,z){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,24),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);return o;}
 function solid(x,y,z,w,h,d){physics.block(x,y,z,w,h,d);}
 box(17,.16,18,carpet,0,-.08,0);box(17,6,.25,ivory,0,3,-8.7);box(.25,6,18,stone,-8.5,3,0);box(.25,6,18,stone,8.5,3,0);
 for(const x of [-4.9,4.9])box(7.2,5.2,.25,stone,x,2.6,8.7);
 solid(-8.5,3,0,.25,6,18);solid(8.5,3,0,.25,6,18);solid(0,3,-8.7,17,6,.25);solid(0,3,8.7,17,6,.25);
 // Sanctuary: shallow curved edge, clear access around altar; only a gentle 16cm rise.
 const stage=new THREE.Mesh(new THREE.CylinderGeometry(4.9,4.9,.16,64,1,false,-Math.PI/2,Math.PI),oak);stage.position.set(0,.08,-7.45);root.add(stage);
 box(9.8,.17,1.2,oak,0,.085,-7.9);solid(0,.04,-6.9,9.8,.08,3.2);
 box(2,.14,.95,oak,0,1.02,-6.15);for(const x of [-.82,.82])box(.13,.88,.65,oak,x,.53,-6.15);box(2.05,.035,1,cloth,0,1.11,-6.15);box(2.05,.36,.025,cloth,0,.94,-5.65);
 solid(0,.65,-6.15,2.1,1.3,1);
 for(const x of [-.72,.72]){cylinder(.12,.045,gold,x,1.15,-6.15);cylinder(.045,.38,cloth,x,1.35,-6.15);cylinder(.014,.04,new THREE.MeshBasicMaterial({color:0xffde9d}),x,1.56,-6.15);}
 box(.045,.38,.045,oak,0,1.33,-6.38);box(.23,.045,.045,oak,0,1.40,-6.38);
 // Folding frosted screen and timber frame, as seen behind the actual altar.
 for(let i=0;i<9;i++){const x=(i-4)*.8,z=-8.1+Math.abs(i-4)*.035;box(.78,2.9,.10,glass,x,1.7,z);box(.055,3.1,.14,oak,x-.4,1.7,z+.015);box(.8,.08,.15,oak,x,3.25,z);}
 // Original coloured cross, sampled directly from the supplied altar photograph.
 const crossShape=new THREE.Shape();crossShape.moveTo(-.10,-.7);crossShape.lineTo(.10,-.7);crossShape.lineTo(.10,.14);crossShape.lineTo(.46,.14);crossShape.lineTo(.46,.39);crossShape.lineTo(.10,.39);crossShape.lineTo(.10,.7);crossShape.lineTo(-.10,.7);crossShape.lineTo(-.10,.39);crossShape.lineTo(-.46,.39);crossShape.lineTo(-.46,.14);crossShape.lineTo(-.10,.14);crossShape.closePath();
 const cg=new THREE.ShapeGeometry(crossShape),pos=cg.attributes.position,uv=cg.attributes.uv;for(let i=0;i<pos.count;i++){const u=(pos.getX(i)+.46)/.92,v=(pos.getY(i)+.7)/1.4;uv.setXY(i,(415+u*104)/940,1-(635-v*157)/1253);}uv.needsUpdate=true;const cross=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({map:altarPhoto,side:THREE.DoubleSide}));cross.name='Original ECC coloured cross';cross.position.set(0,4.32,-8.52);root.add(cross);
 // Four round oak columns and limestone bases; broad aisles remain clear.
 for(const x of [-5,5])for(const z of [-3.8,4.2]){box(.9,.95,.9,stone,x,.475,z);cylinder(.29,4.6,oak,x,3.2,z);solid(x,2.7,z,.9,5.4,.9);}
 // Ceiling leaves a raised clerestory spine. Shallow slopes and slender pendant lights.
 for(const side of [-1,1]){const ceiling=box(5.1,.14,17.5,oak,side*5.9,5.45,0);ceiling.rotation.z=side*.025;ceiling.castShadow=false;box(.16,.62,17.5,ivory,side*3.25,5.6,0);box(.04,.045,16.8,new THREE.MeshBasicMaterial({color:0xffeed4}),side*5.6,5.33,0);}
 box(6.4,.13,17.5,oak,0,6.3,0).castShadow=false;
 const sky=new THREE.MeshBasicMaterial({color:0xe7f1ed});for(const x of [-3.22,3.22]){box(.06,.8,16.8,sky,x,6,0);for(const z of [-7,-3,1,5,8])box(.09,.87,.06,ivory,x,6,z);}
 for(let i=0;i<9;i++){const x=((i%3)-1)*.48,z=-2+Math.floor(i/3)*.55,h=.48+(i%3)*.16;cylinder(.009,.65,oak,x,5.9,z);cylinder(.028,h,new THREE.MeshBasicMaterial({color:0xffdf9a}),x,5.2-h/2,z);}
 // Faceted white clerestory frieze; a restrained recognisable motif from Chapel 6.
 for(let i=0;i<20;i++){const o=new THREE.Mesh(new THREE.ConeGeometry(.19,.12,3),ivory);o.rotation.x=Math.PI/2;o.rotation.z=i%2?Math.PI:0;o.position.set(-3+i*.315,5.45,-8.48);root.add(o);}
 // Individual upholstered chairs, not pews. Repeated meshes share geometry/material.
 const chairParts=[{g:roundedBox(.56,.15,.56,3,.065),m:chair,p:[0,.47,0]},{g:roundedBox(.57,.55,.13,3,.06),m:chair,p:[0,.79,.23]},...[-.20,.20].flatMap(x=>[-.19,.19].map(z=>({g:new THREE.CylinderGeometry(.026,.035,.43,8),m:oak,p:[x,.235,z]})))];
 const seats=[];for(const side of [-1,1])for(let row=0;row<5;row++)for(let col=0;col<3;col++)seats.push({x:side*(1.2+col*.75),z:-3.1+row*1.22,a:0});
 for(const side of [-1,1])for(let row=0;row<3;row++)for(let col=0;col<2;col++)seats.push({x:side*(5.9+col*.75),z:-2.6+row*1.3,a:side*.28});
 seats.push({x:-6.15,z:2.25,a:-Math.PI/2},{x:-6.15,z:3.35,a:-Math.PI/2});
 const transform=new THREE.Object3D(),part=new THREE.Matrix4();for(const item of chairParts){const inst=new THREE.InstancedMesh(item.g,item.m,seats.length);seats.forEach((s,i)=>{transform.position.set(s.x,0,s.z);transform.rotation.set(0,s.a,0);transform.updateMatrix();part.makeTranslation(...item.p);inst.setMatrixAt(i,transform.matrix.clone().multiply(part));});inst.castShadow=inst.receiveShadow=true;root.add(inst);}
 for(const s of seats)solid(s.x,.5,s.z,.55,1,.6);
 // Soft contact shadows ground repeated seating without expensive per-chair lights.
 const shadeCanvas=document.createElement('canvas');shadeCanvas.width=shadeCanvas.height=64;const sc=shadeCanvas.getContext('2d'),gradient=sc.createRadialGradient(32,32,4,32,32,32);gradient.addColorStop(0,'rgba(37,30,20,.22)');gradient.addColorStop(1,'rgba(37,30,20,0)');sc.fillStyle=gradient;sc.fillRect(0,0,64,64);const shadeMaterial=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadeCanvas),transparent:true,depthWrite:false});for(const s of seats){const o=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),shadeMaterial);o.rotation.x=-Math.PI/2;o.position.set(s.x,.005,s.z);root.add(o);}
 // Altar-side presider chairs and lectern, as photographed.
 box(.65,.8,.55,dark,-3.3,.56,-6.5);box(.84,.075,.62,oak,-3.3,1,-6.5);solid(-3.3,.55,-6.5,.85,1.1,.7);
 for(const x of [2.4,3.25]){box(.64,.15,.65,chair,x,.55,-7.1);box(.68,.62,.13,chair,x,.85,-7.39);for(const dx of [-.25,.25])box(.07,.5,.07,oak,x+dx,.3,-7.1);}
 // The photo's distinctive branching window is a visual focus of a quiet side alcove.
 const tree=treePhoto.clone();tree.needsUpdate=true;tree.repeat.set(410/1024,342/667);tree.offset.set(280/1024,1-399/667);const window=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2.7),new THREE.MeshBasicMaterial({map:tree}));window.name='ECC tree-glass photographic reference';window.rotation.y=0;window.position.set(-6.7,2.3,-8.51);root.add(window);
 for(const x of [-8.34,-5.06])box(.12,3.1,.16,oak,x,2.3,-8.42);for(const y of [.87,3.73])box(3.4,.10,.16,oak,-6.7,y,-8.42);
 // Quiet-alcove timber baffles and a teal upholstered bench echo the concept.
 for(let i=0;i<10;i++)box(.075,3.9,.18,oak,-7.8+i*.16,1.95,4.9);
 box(1.7,.36,.65,dark,-7, .47,4.4);box(1.7,.55,.15,dark,-7,.8,4.65);for(const x of [-7.7,-6.3])box(.09,.3,.5,oak,x,.15,4.4);solid(-7,.5,4.4,1.8,1,.75);
 const leafMat=mat(0x617d4c);for(const [x,z] of [[-4.1,-6.5],[4.1,-6.5],[-7.2,1],[7.3,5.4]]){cylinder(.28,.55,stone,x,.275,z);for(let i=0;i<12;i++){const angle=i*2.4,y=.65+(i%4)*.23;const o=new THREE.Mesh(new THREE.SphereGeometry(.13,8,6),leafMat);o.scale.set(1,2.5,.35);o.rotation.z=Math.sin(angle)*.9;o.position.set(x+Math.cos(angle)*.24,y,z+Math.sin(angle)*.24);root.add(o);}}
 // Small coloured glass insets echo the actual side-wall windows.
 for(const side of [-1,1])for(let i=0;i<3;i++){const color=[0x3d99a1,0xb9983d,0x786697][i];box(.03,.4,.48,new THREE.MeshBasicMaterial({color}),side*8.34,2.3,-5.2+i*1.5);}
 box(2.1,2.8,.13,dark,0,1.4,8.59);box(.04,2.55,.04,gold,0,1.4,8.50);for(const x of [-1.12,1.12])box(.11,2.95,.17,oak,x,1.47,8.48);
 const fill=new THREE.HemisphereLight(0xf9f2df,0x8b8171,1.3);root.add(fill);const sun=new THREE.DirectionalLight(0xffedce,2.0);sun.position.set(-4,5.2,3);sun.target.position.set(0,0,-3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:.1,far:25});sun.shadow.normalBias=.035;sun.shadow.radius=4;root.add(sun,sun.target);
 // Timber ceiling battens and side friezes articulate the concept's longitudinal rhythm.
 for(let i=0;i<75;i++){const x=-8.3+i*.224;box(.014,.025,17.3,oak,x,Math.abs(x)<3.2?6.22:5.36,0).castShadow=false;}
 for(const side of [-1,1])for(let i=0;i<36;i++){const o=new THREE.Mesh(new THREE.ConeGeometry(.23,.12,3),ivory);o.rotation.z=side*Math.PI/2;o.rotation.y=i%2?Math.PI:0;o.position.set(side*3.15,5.58,-8+i*.46);root.add(o);}
 scene.add(root);return {root,seats:seats.length,reflection:CHAPEL.reflection};
}
