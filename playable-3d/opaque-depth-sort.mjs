// Opaque depth testing is order-independent. Draw nearer objects first so a
// constrained rasterizer rejects hidden fragments before expensive shading.
// Explicit scene order is authoritative; transparent sorting is untouched.
export function opaqueDepthSort(a,b){
 return a.groupOrder-b.groupOrder||a.renderOrder-b.renderOrder||a.z-b.z||a.material.id-b.material.id||a.id-b.id;
}
