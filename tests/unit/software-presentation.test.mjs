import {test,expect} from 'vitest';
import {createGpuFrameGate} from '../../playable-3d/frame-budget.mjs';
import {needsSoftwarePresentation,createSoftwarePresentation} from '../../playable-3d/software-presentation.mjs';

function display(){
 const copies=[],frame={width:300,height:150,style:{},dataset:{},setAttribute(){},getContext:()=>({drawImage:(...args)=>copies.push(args)})};
 const canvas={width:640,height:422,style:{},dataset:{},before:e=>{expect(e).toBe(frame);}};
 return {copies,canvas,frame,document:{createElement:()=>frame}};
}
test('native rendering keeps the original visible canvas and creates no display copy',()=>{
 const canvas={style:{},dataset:{}};expect(createSoftwarePresentation(canvas,false,{createElement(){throw Error('native display changed');}})).toBeNull();expect(canvas.style).toEqual({});
});
test('only a completed software fence presents the original full-size pixels once',()=>{
 const d=display(),presentation=createSoftwarePresentation(d.canvas,true,d.document);let complete=false;
 const gl={TIMEOUT_EXPIRED:1,SYNC_GPU_COMMANDS_COMPLETE:3,fenceSync:()=>({}),flush(){},clientWaitSync:()=>complete?2:1,deleteSync(){}};
 const gate=createGpuFrameGate({getContext:()=>gl},true,()=>presentation.present());
 gate.submitted();expect(gate.ready()).toBe(false);expect(d.copies).toHaveLength(0);complete=true;expect(gate.ready()).toBe(true);expect(d.copies).toEqual([[d.canvas,0,0]]);expect([d.frame.width,d.frame.height]).toEqual([640,422]);
 gate.ready();expect(d.copies).toHaveLength(1);expect(d.canvas.style.opacity).toBe('0');expect(d.frame.style.pointerEvents).toBe('none');expect(d.frame.dataset.presented).toBe('true');
});
test('portrait submissions do not replace the displayed world and resize waits for a complete world frame',()=>{
 const d=display(),presentation=createSoftwarePresentation(d.canvas,true,d.document);
 const gl={TIMEOUT_EXPIRED:1,SYNC_GPU_COMMANDS_COMPLETE:3,fenceSync:()=>({}),flush(){},clientWaitSync:()=>2,deleteSync(){}};
 const gate=createGpuFrameGate({getContext:()=>gl},true,()=>presentation.present());gate.submitted(false);gate.ready();expect(d.copies).toHaveLength(0);
 d.canvas.width=195;d.canvas.height=390;gate.submitted();gate.ready();expect([d.frame.width,d.frame.height]).toEqual([195,390]);expect(d.copies).toHaveLength(1);
});
test('unavailable 2D presentation leaves the working WebGL canvas visible',()=>{
 const canvas={style:{},dataset:{}};expect(createSoftwarePresentation(canvas,true,{createElement:()=>({getContext:()=>null})})).toBeNull();expect(canvas.style).toEqual({});
});
test('backend probe never renders and releases its temporary context',()=>{
 for(const [name,wanted] of [['ANGLE Apple M3 Metal',false],['ANGLE SwiftShader',true]]){
  let released=0;const gl={RENDERER:1,getParameter:()=>name,getExtension:key=>key==='WEBGL_lose_context'?{loseContext:()=>released++}:null};
  const document={createElement:()=>({getContext:(type,options)=>{expect(type).toBe('webgl2');expect(options.antialias).toBe(true);return gl;}})};
  expect(needsSoftwarePresentation(document)).toBe(wanted);expect(released).toBe(1);
 }
 expect(needsSoftwarePresentation({createElement:()=>({getContext:()=>null})})).toBe(false);
});
