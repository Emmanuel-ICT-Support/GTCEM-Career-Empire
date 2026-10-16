// Reuse only byte-identical static vertices. Triangle order and every attribute
// bit remain unchanged; this is storage/cache reuse, never mesh simplification.
export function indexExactVertices(geometry){
 if(geometry.index||Object.values(geometry.morphAttributes||{}).some(a=>a.length))return geometry;
 const names=Object.keys(geometry.attributes).sort(),attributes=names.map(n=>geometry.attributes[n]);
 if(!attributes.length||attributes.some(a=>a.isInterleavedBufferAttribute||!a.array||a.count!==attributes[0].count))return geometry;
 const bytes=attributes.map(a=>new Uint8Array(a.array.buffer,a.array.byteOffset,a.array.byteLength)),strides=attributes.map(a=>a.itemSize*a.array.BYTES_PER_ELEMENT);
 const unique=new Map(),representatives=[],indices=[];
 for(let i=0;i<attributes[0].count;i++){
  let key='';for(let j=0;j<attributes.length;j++)key+=String.fromCharCode(...bytes[j].subarray(i*strides[j],(i+1)*strides[j]));
  let index=unique.get(key);if(index===undefined){index=representatives.length;unique.set(key,index);representatives.push(i);}indices.push(index);
 }
 if(representatives.length===attributes[0].count)return geometry;
 for(let j=0;j<attributes.length;j++){
  const old=attributes[j],array=new old.array.constructor(representatives.length*old.itemSize),output=new Uint8Array(array.buffer);
  representatives.forEach((source,i)=>output.set(bytes[j].subarray(source*strides[j],(source+1)*strides[j]),i*strides[j]));
  const attribute=old.clone();attribute.array=array;attribute.count=representatives.length;geometry.setAttribute(names[j],attribute);
 }
 geometry.setIndex(indices);return geometry;
}

export function indexStaticWorld(root){
 const seen=new Set(),stats={geometries:0,verticesBefore:0,verticesAfter:0};
 root.traverse(mesh=>{const geometry=mesh.geometry;if(!mesh.isMesh||mesh.isSkinnedMesh||!geometry||seen.has(geometry))return;seen.add(geometry);if(geometry.index)return;const before=geometry.attributes.position?.count||0;indexExactVertices(geometry);stats.geometries++;stats.verticesBefore+=before;stats.verticesAfter+=geometry.attributes.position?.count||0;});
 return stats;
}
