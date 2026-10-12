// Use the actual WebGL backend, never a CI flag or test-only rendering path.
export function renderQuality(rendererName,requested,deviceRatio){
 const software=/swiftshader|llvmpipe|softpipe|software rasterizer/i.test(rendererName||'');
 const light=requested==='low'||(requested==='auto'&&software);
 return {software,pixelRatio:Math.min(deviceRatio,requested==='high'?2:requested==='low'?1:light?.75:1.5),shadowSize:light?512:2048};
}
export function rendererName(renderer){
 const gl=renderer.getContext();
 const extension=gl.getExtension('WEBGL_debug_renderer_info');
 return String(gl.getParameter(extension?extension.UNMASKED_RENDERER_WEBGL:gl.RENDERER)||'');
}
