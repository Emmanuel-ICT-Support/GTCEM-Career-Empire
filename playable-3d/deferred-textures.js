import * as THREE from 'three';

// Keep texture identity/UV settings stable for cloned materials. Only the image
// arrives later; the accepted full-detail artwork is still the final result.
export function createDeferredTextures(){
  const jobs=[];let running;
  function load(loader,url,{normal=false,transparent=false,hdr=false,colour='#ffffff'}={}){
    let texture;
    if(hdr)texture=new THREE.DataTexture(new Uint16Array([15360,15360,15360,15360]),1,1,THREE.RGBAFormat,THREE.HalfFloatType);
    else{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
      const ctx=canvas.getContext('2d');ctx.fillStyle=normal?'#8080ff':colour;
      if(!transparent)ctx.fillRect(0,0,1,1);
      texture=new THREE.Texture(canvas);
    }
    if(hdr){texture.minFilter=texture.magFilter=THREE.LinearFilter;texture.colorSpace=THREE.LinearSRGBColorSpace;}
    texture.needsUpdate=true;
    jobs.push({loader,url,texture,done:false});
    return Promise.resolve(texture);
  }
  function start(){
    if(running)return running;
    const pending=jobs.filter(job=>!job.done),errors=[];
    running=(async()=>{
      async function worker(){
        for(let job;job=pending.shift();){
          try{
            const loaded=await job.loader.loadAsync(job.url),target=job.texture;
            // Invalidate cached PMREM and GPU uploads before replacing the image.
            target.dispose();target.source=loaded.source;target.format=loaded.format;target.type=loaded.type;
            target.internalFormat=loaded.internalFormat;target.flipY=loaded.flipY;
            target.generateMipmaps=loaded.generateMipmaps;
            target.needsUpdate=true;target.needsPMREMUpdate=true;job.done=true;
            // Give input and the current view a chance to paint between uploads.
            await new Promise(resolve=>setTimeout(resolve,0));
          }catch(error){errors.push(error);}
        }
      }
      await Promise.all(Array.from({length:4},worker));
      if(errors.length)throw new Error('Some campus detail could not download. Please retry.');
    })().finally(()=>{running=null;});
    return running;
  }
  return {load,start,get pending(){return jobs.filter(job=>!job.done).length;}};
}

// Two animation ticks allow the first playable frame to be presented before
// beginning optional scenery work. A background tab need not load more scenery.
export const afterFirstPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
