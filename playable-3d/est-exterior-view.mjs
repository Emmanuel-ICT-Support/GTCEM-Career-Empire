// Preserve the authored cabinet as one assembly before static batching.
export function relocateESTStorage(root){
 if(root.userData.estStorageRelocation)return root.userData.estStorageRelocation;
 const parts=[];root.traverse(node=>{if(node.isMesh&&/^(Toolstorage|Storagefront(?:00[12])?)$/.test(node.name.replace(/[ _.]/g,'')))parts.push(node);});
 const result={partCount:parts.length,shiftX:0,status:'not-moved'};
 if(parts.length===4){for(const part of parts)part.position.x+=4.2;Object.assign(result,{shiftX:4.2,status:'moved'});}
 root.userData.estStorageRelocation=result;return result;
}
export function isESTExteriorView(p){return p.x>=9&&p.x<=23&&p.z>=6&&p.z<=14.1;}
export function estExteriorPitch(start,dragY){return Math.max(-.55,Math.min(.75,start+dragY*.004));}
export function estExteriorLookHeight(base,tilt,distance){return base+Math.tan(tilt)*distance;}
