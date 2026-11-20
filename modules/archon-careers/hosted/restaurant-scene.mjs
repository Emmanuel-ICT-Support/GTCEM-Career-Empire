import * as T from './vendor/three.module.js';
import {restaurantProgress,restaurants} from './noodle-story.mjs?v=noodle-refit-20261119';

// World-space patios deliberately sit west of the grid, not in front of the
// inward-turned Lantern façade (whose local front crosses the top board row).
export function restaurantStageLayout(team){
 return team==='A'
  ?{x:-5.0,z:.65,width:1.25,depth:1.20,extraX:-4.92,extraZ:2.05,extraWidth:1.14,extraDepth:1.20}
  :{x:-5.05,z:-1.10,width:1.30,depth:1.20,extraX:-5.05,extraZ:-2.30,extraWidth:1.30,extraDepth:.95};
}
export const restaurantStageNames=['Opening shift','Finding a rhythm','Word is spreading','Lunch-rush favourite','Market standout'];

export function createRestaurantProgress(parent,{team,x,width,header,sign,box,ball,cylinder,world=parent}){
 const colour=team==='A'?0x159c91:0xe5a037,teamColour=new T.Color(colour),layout=restaurantStageLayout(team);
 // Name stays on the building even before the separately earned canvas canopy.
 if(team==='A'){
  const title=sign('JUNIPER KITCHEN',width-.12,.25,false,{background:'#164f49',font:'bold 55px Georgia'});
  title.name='Juniper permanent shop name';title.position.set(x,1.07,-4.78);parent.add(title);
 }
 const saturation={value:0},facadeMaterials=[],baseLights=[],legacyPhases=[];
 parent.traverse(object=>{
  if(object.userData.restaurantMinTier)legacyPhases.push(object);
  if(object.isLight)baseLights.push({light:object,intensity:object.intensity});
  if(!object.isMesh)return;
  const multiple=Array.isArray(object.material),materials=(multiple?object.material:[object.material]).map(source=>{
   const material=source.clone(),normal=material.color.clone();
   if(object.userData.restaurantTeamTrim)normal.copy(teamColour);
   material.color.copy(normal);
   material.onBeforeCompile=shader=>{
    shader.uniforms.restaurantSaturation=saturation;
    shader.fragmentShader='uniform float restaurantSaturation;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat restaurantGrey=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));\ndiffuseColor.rgb=mix(vec3(restaurantGrey),diffuseColor.rgb,restaurantSaturation);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nfloat restaurantGlowGrey=dot(totalEmissiveRadiance,vec3(.2126,.7152,.0722));\ntotalEmissiveRadiance=mix(vec3(restaurantGlowGrey),totalEmissiveRadiance,restaurantSaturation);');
   };
   material.customProgramCacheKey=()=> 'restaurant-earned-saturation-v1';
   facadeMaterials.push(material);return material;
  });object.material=multiple?materials:materials[0];
 });
 const group=new T.Group();group.name=restaurants[team].name+' earned patio';group.userData.restaurantTeam=team;world.add(group);
 const phases=new Map();for(const level of [1,2,3,4]){const phase=new T.Group();phase.name='Restaurant upgrade tier '+level;phase.userData.restaurantTier=level;phase.visible=false;group.add(phase);phases.set(level,phase);}
 const lamps=[],lampLights=[],bulbs=[],customers=[],canvases=[];
 const makeBox=(p,c,size,pos)=>box(p,c,size,pos),makeBall=(p,c,size,pos)=>ball(p,c,size,pos);
 const disc=(p,c,r,h,pos)=>{const mesh=new T.Mesh(new T.CylinderGeometry(r,r,h,20),new T.MeshStandardMaterial({color:c,roughness:.7}));mesh.position.set(...pos);mesh.castShadow=true;p.add(mesh);return mesh;};
 const plaque=sign(restaurants[team].short.toUpperCase(),layout.width,.18,false,{background:team==='A'?'#164f49':'#75451f',font:'bold 53px system-ui'});
 plaque.position.set(layout.x,.89,layout.z-layout.depth*.45);phases.get(1).add(plaque);
 for(const side of [-1,1])makeBox(phases.get(1),colour,[.075,1.16,.075],[layout.x+side*layout.width*.44,.24,layout.z-layout.depth*.45]);
 function deck(parent,cx,cz,w,d){
  makeBox(parent,0xc49d71,[w,.075,d],[cx,-.303,cz]);
  makeBox(parent,0x826047,[w-.07,.025,d-.07],[cx,-.254,cz]);
  for(let i=0;i<9;i++)makeBox(parent,i%2?0xb58b60:0xc7a074,[w/9-.012,.013,d-.09],[cx+w*((i+.5)/9-.5),-.235,cz]);
 }
 function table(parent,cx,cz){
  disc(parent,0xd4a367,.16,.035,[cx,.075,cz]);disc(parent,0x4b5149,.023,.30,[cx,-.09,cz]);
  disc(parent,0x4b5149,.12,.018,[cx,-.237,cz]);
  for(const side of [-1,1]){
   makeBox(parent,colour,[.115,.027,.12],[cx+side*.23,-.065,cz]);
   makeBox(parent,colour,[.022,.17,.12],[cx+side*.28,.008,cz]);
   for(const dz of [-.04,.04])makeBox(parent,0x584c3e,[.016,.17,.016],[cx+side*.23,-.16,cz+dz]);
  }
  disc(parent,0xf7ead0,.023,.045,[cx,.113,cz]);
 }
 const second=phases.get(2);deck(second,layout.x,layout.z,layout.width,layout.depth);
 for(const side of [-1,1])table(second,layout.x,layout.z+side*layout.depth*.28);
 for(const side of [-1,1]){
  const px=layout.x+side*layout.width*.42,pz=layout.z+layout.depth*.43;
  disc(second,0x484b3e,.023,1.15,[px,.34,pz]);
  const lamp=makeBall(second,0xffdc9c,[.065,.095,.065],[px,.96,pz]);lamp.material=new T.MeshStandardMaterial({color:0xffdca0,emissive:0xffbd66,emissiveIntensity:1.1});lamps.push(lamp);
  const pool=new T.PointLight(0xffc77c,.45,1.6,2);pool.position.set(px,.91,pz);second.add(pool);lampLights.push(pool);
  makeBox(second,0x524f3b,[.17,.03,.15],[px,1.065,pz]);
 }
 // Three permanent diners plus a bounded queue driven by reciprocal momentum.
 for(let i=0;i<9;i++){
  const person=new T.Group();person.name='Restaurant customer '+i;
  const px=layout.x+(i<3?(i===1?.23:-.23):(i%2?1:-1)*layout.width*.36),pz=layout.z+(i<3?(i===2?1:-1)*layout.depth*.28:(Math.floor((i-3)/2)-1)*layout.depth*.34);
  person.position.set(px,-.22,pz);person.userData.home=person.position.clone();
  makeBox(person,[0x527e73,0xc78858,0x687caf][i%3],[.12,.22,.085],[0,.30,0]);
  makeBall(person,[0xc98d68,0xe2b18d,0x9f694e][i%3],[.062,.07,.06],[0,.47,0]);
  for(const side of [-1,1])makeBox(person,0x304249,[.035,.18,.045],[side*.036,.10,0]);
  second.add(person);customers.push(person);
 }
 const third=phases.get(3);
 // Third table occupies the rear edge, leaving a central circulation strip.
 table(third,layout.x,layout.z-layout.depth*.02);
 const canopy=new T.Group();canopy.name='Striped canvas canopy';canopy.position.set(layout.x,1.20,layout.z);third.add(canopy);
 const canvasGeometry=new T.PlaneGeometry(layout.width+.06,layout.depth+.06,24,12);canvasGeometry.rotateX(-Math.PI/2);
 const canvasMaterial=new T.MeshStandardMaterial({color:0xfff1d3,roughness:.96,side:T.DoubleSide});
 canvasMaterial.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat stripe=step(.5,fract(vUv.x*8.0));\ndiffuseColor.rgb*=mix(vec3(1.0),vec3('+teamColour.r.toFixed(5)+','+teamColour.g.toFixed(5)+','+teamColour.b.toFixed(5)+'),stripe);');};
 canvasMaterial.defines={USE_UV:''};canvasMaterial.customProgramCacheKey=()=> 'restaurant-stripes-'+team;
 const canvas=new T.Mesh(canvasGeometry,canvasMaterial);canvas.castShadow=true;canopy.add(canvas);canvases.push({mesh:canvas,rest:canvasGeometry.attributes.position.array.slice()});
 for(const side of [-1,1])for(const edge of [-1,1])disc(third,0x786344,.018,1.45,[layout.x+side*layout.width*.47,.48,layout.z+edge*layout.depth*.47]);
 makeBox(third,0x5d5038,[layout.width*.86,.006,.006],[layout.x,1.17,layout.z+layout.depth*.48]);
 for(let i=0;i<7;i++){
  const bulb=makeBall(third,0xffd790,[.027,.035,.027],[layout.x+(i-3)*layout.width*.135,1.13,layout.z+layout.depth*.48]);
  bulb.material=new T.MeshStandardMaterial({color:0xffe7ae,emissive:0xffc478,emissiveIntensity:1});bulbs.push(bulb);
 }
 for(const side of [-1,1]){
  const px=layout.x+side*layout.width*.42,pz=layout.z-layout.depth*.42;
  makeBox(third,0xb68a61,[.17,.18,.17],[px,-.14,pz]);
  for(let leaf=0;leaf<5;leaf++){const sprig=makeBall(third,leaf%2?0x718d48:0x426b43,[.03,.18,.025],[px+Math.sin(leaf*2.4)*.04,.035,pz+Math.cos(leaf*2.4)*.04]);sprig.rotation.z=(leaf-2)*.16;}
 }
 const fourth=phases.get(4);deck(fourth,layout.extraX,layout.extraZ,layout.extraWidth,layout.extraDepth);
 for(const side of [-1,1])table(fourth,layout.extraX,layout.extraZ+side*layout.extraDepth*.27);
 const crown=sign('MARKET STANDOUT',layout.extraWidth,.20,false,{background:team==='A'?'#164f49':'#75451f',font:'bold 48px system-ui'});
 crown.position.set(layout.extraX,1.40,layout.extraZ-layout.extraDepth*.43);fourth.add(crown);
 crown.material=new T.MeshStandardMaterial({map:crown.material.map,emissive:0xffcf79,emissiveMap:crown.material.map,emissiveIntensity:.35,roughness:.65});
 for(const side of [-1,1]){
  makeBox(fourth,0x7c654b,[.026,1.55,.026],[layout.extraX+side*layout.extraWidth*.44,.48,layout.extraZ-layout.extraDepth*.43]);
  makeBox(fourth,colour,[.20,.44,.025],[layout.extraX+side*layout.extraWidth*.35,.95,layout.extraZ-layout.extraDepth*.43]);
 }
 let state=restaurantProgress({})[team],targetSaturation=0,settle=1,previousLevel=0;
 function sync(tiles){
  state=restaurantProgress(tiles)[team];targetSaturation=state.level>0?1:0;
  if(state.level>previousLevel)settle=0;previousLevel=state.level;
  phases.forEach((phase,level)=>phase.visible=state.level>=level);
  legacyPhases.forEach(object=>object.visible=state.level>=object.userData.restaurantMinTier);
  customers.forEach((person,i)=>person.visible=i<Math.min(9,3+state.customers));
  baseLights.forEach(({light,intensity})=>light.intensity=intensity*(state.level===0?.12:state.brightness*.55));
 }
 function update(dt,{time=0,reducedMotion=false}={}){
  saturation.value=reducedMotion?targetSaturation:T.MathUtils.damp(saturation.value,targetSaturation,3.2,Math.min(dt,.1));
  settle=reducedMotion?1:Math.min(1,settle+Math.min(dt,.1)*1.8);
  lamps.forEach((lamp,i)=>lamp.material.emissiveIntensity=state.brightness*(1.05+(reducedMotion?0:.055*Math.sin(time*.8+i))));
  lampLights.forEach((light,i)=>light.intensity=state.brightness*(.45+(reducedMotion?0:.02*Math.sin(time*.8+i))));
  bulbs.forEach((bulb,i)=>bulb.material.emissiveIntensity=state.brightness*(.85+(reducedMotion?0:.045*Math.sin(time*.65+i*.7))));
  customers.forEach((person,i)=>{person.position.copy(person.userData.home);person.rotation.y=0;if(!reducedMotion&&person.visible&&state.level>=2){if(i>=3){person.position.x+=.028*Math.sin(time*.32+i*1.7);person.position.z+=.025*Math.sin(time*.27+i*.9);}person.rotation.y=.12*Math.sin(time*.4+i);}});
  for(const {mesh,rest}of canvases){const position=mesh.geometry.attributes.position;for(let i=0;i<position.count;i++)position.setY(i,rest[i*3+1]+(reducedMotion?0:.009*Math.sin(rest[i*3]*4+time*.7)*Math.sin(rest[i*3+2]*3+time*.5)));position.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();}
  crown.position.y=1.40+(reducedMotion?0:.055*(1-settle));crown.material.emissiveIntensity=.28+.12*settle+(reducedMotion?0:.025*Math.sin(time*.6));
 }
 sync({});update(0,{reducedMotion:true});
 return {sync,update,group,phases,layout,facadeMaterials,saturation,snapshot:()=>({team,level:state.level,customers:customers.filter(p=>p.visible&&state.level>=2).length,modelCustomers:state.customers,brightness:state.brightness,saturation:saturation.value})};
}
