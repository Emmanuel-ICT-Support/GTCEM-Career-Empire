import {readFile,writeFile} from 'node:fs/promises';

const original='const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();';
export async function setupEnvironmentExperiment(page){
 const cached=process.env.CE_ENV_CACHE_PATH,capture=process.env.CE_ENV_CAPTURE_PATH;
 let metadata;
 if(cached){metadata=JSON.parse(await readFile(cached+'.json','utf8'));const bytes=await readFile(cached+'.bin');await page.route('**/__qa_room_environment.bin',route=>route.fulfill({contentType:'application/octet-stream',body:bytes}));}
 return source=>{
  if(!cached&&!capture)return source;
  if(!source.includes(original))throw Error('Missing original RoomEnvironment hook');
  let replacement=original;
  if(cached){const m=metadata;replacement=`const environment={texture:new THREE.DataTexture(new Uint16Array(await(await fetch('/__qa_room_environment.bin')).arrayBuffer()),${m.width},${m.height},${m.format},${m.type})};Object.assign(environment.texture,${JSON.stringify(m.properties)});environment.texture.needsUpdate=true;`;}
  if(capture)replacement+=`window.__exportRoomEnvironment=()=>{const t=environment.texture,pixels=new Uint16Array(environment.width*environment.height*4);renderer.readRenderTargetPixels(environment,0,0,environment.width,environment.height,pixels);const bytes=new Uint8Array(pixels.buffer);let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return {base64:btoa(binary),metadata:{width:environment.width,height:environment.height,type:t.type,format:t.format,properties:Object.fromEntries(['mapping','colorSpace','minFilter','magFilter','wrapS','wrapT','generateMipmaps','flipY','premultiplyAlpha','unpackAlignment'].map(k=>[k,t[k]]))}};};`;
  source=source.replace(original,replacement);
  if(cached)source+=`\nwindow.__compareCachedEnvironment=()=>{const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),reference=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();const old=worlds.town.environment,oldTarget=renderer.getRenderTarget(),gl=renderer.getContext(),size=renderer.getDrawingBufferSize(new THREE.Vector2()),pixels=[];try{for(const environment of [reference.texture,old]){worlds.town.environment=environment;renderer.setRenderTarget(null);renderer.clear();renderer.render(worlds.town,camera);const data=new Uint8Array(size.x*size.y*4);gl.readPixels(0,0,size.x,size.y,gl.RGBA,gl.UNSIGNED_BYTE,data);pixels.push(data);}let changed=0,sum=0,max=0;for(let i=0;i<pixels[0].length;i++){const d=Math.abs(pixels[0][i]-pixels[1][i]);if(d)changed++;sum+=d;max=Math.max(max,d);}return {diagnosticOnly:true,width:size.x,height:size.y,changedChannels:changed,totalChannels:pixels[0].length,meanChannelDifference:sum/pixels[0].length,maxChannelDifference:max,renderer:renderBackend,trees:worlds.scenery.trees,buildings:worlds.scenery.buildings,entryReady};}finally{worlds.town.environment=old;renderer.setRenderTarget(oldTarget);reference.dispose();}};`;
  return source;
 };
}
export async function finishEnvironmentExperiment(page,info){
 if(process.env.CE_ENV_CAPTURE_PATH){const result=await page.evaluate(()=>window.__exportRoomEnvironment());await writeFile(process.env.CE_ENV_CAPTURE_PATH+'.bin',Buffer.from(result.base64,'base64'));await writeFile(process.env.CE_ENV_CAPTURE_PATH+'.json',JSON.stringify(result.metadata,null,2));await info.attach('environment-cache-metadata',{body:JSON.stringify(result.metadata),contentType:'application/json'});}
 if(process.env.CE_ENV_CACHE_PATH)await info.attach('environment-cache-fidelity',{body:JSON.stringify(await page.evaluate(()=>window.__compareCachedEnvironment())),contentType:'application/json'});
}
