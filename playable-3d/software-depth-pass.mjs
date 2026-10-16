// Draw the same opaque vertices into depth before their original colour pass.
// Original vertex hooks/cutouts remain; transparent/custom-depth surfaces stay
// in the unchanged colour pass. A one-unit away bias avoids precision holes.
const prefix=`uniform float opacity;
#include <common>
#include <clipping_planes_pars_fragment>
#include <logdepthbuf_pars_fragment>
`;
const cutout=`
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <color_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
`;
export function createSoftwareDepthPass(renderer,T,enabled=false){
 if(!enabled)return null;
 const cache=new WeakMap(),hidden=new T.MeshBasicMaterial({visible:false});
 function depthMaterial(source){
  if(!source.visible||source.wireframe||source.transparent||!source.depthWrite||!source.depthTest||source.depthFunc!==T.LessEqualDepth||source.stencilWrite||source.isShaderMaterial||source.isRawShaderMaterial||![T.NormalBlending,T.NoBlending].includes(source.blending)||/discard|gl_FragDepth/.test(source.onBeforeCompile.toString()))return hidden;
  let entry=cache.get(source);if(entry&&entry.version===source.version)return entry.material;
  entry?.material.dispose();const material=source.clone();material.colorWrite=false;material.polygonOffset=true;material.polygonOffsetUnits=(source.polygonOffsetUnits||0)+1;
  const alpha=source.alphaTest>0||source.alphaHash||source.alphaToCoverage;
  material.onBeforeCompile=(shader,context)=>{source.onBeforeCompile.call(source,shader,context);shader.fragmentShader=prefix+(alpha?cutout:'')+`void main(){
#include <clipping_planes_fragment>
#include <logdepthbuf_fragment>
vec4 diffuseColor=vec4(1.0,1.0,1.0,opacity);
`+(alpha?`
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
`:'')+`gl_FragColor=vec4(0.0,0.0,0.0,diffuseColor.a);}`;};
  material.customProgramCacheKey=()=>source.customProgramCacheKey()+':software-depth-only-1';cache.set(source,{version:source.version,material});return material;
 }
 return {render(scene,camera){
  if(scene.overrideMaterial||scene.background?.isColor||renderer.autoClear)return;const saved=[],background=scene.background;scene.traverse(object=>{if(object.isMesh){saved.push([object,object.material]);object.material=Array.isArray(object.material)?hidden:depthMaterial(object.material);}});
  scene.background=null;try{renderer.render(scene,camera);}finally{for(const [object,material]of saved)object.material=material;scene.background=background;}
 }};
}
