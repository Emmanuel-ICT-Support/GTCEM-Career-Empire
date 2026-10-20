import {test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
function harness(){
 const source=fs.readFileSync('playable-3d/app.js','utf8'),start=source.indexOf('function refreshPreviewSave()'),end=source.indexOf('async function updatePreview()',start);
 const save={disabled:false},status={hidden:true},copies=[];
 const context={previewAssetsReady:true,softwarePresentation:{present:n=>copies.push(n)},previewRequest:2,presentedPreviewRequest:-1,mode:'studio',renderedFrames:7,submittedView:{mode:'town',previewRequest:null,body:null},canvas:{dataset:{}},$:id=>id==='save-avatar'?save:status};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);return {context,save,status,copies};
}
test('software assets alone cannot unlock an unseen Studio preview',()=>{const h=harness();h.context.refreshPreviewSave();expect(h.save.disabled).toBe(true);expect(h.status.hidden).toBe(false);});
test('only the completed matching selection unlocks saving without creating frames',()=>{const h=harness(),c=h.context;c.submittedView={mode:'studio',previewRequest:1,body:'antonio'};c.completeWorldPresentation();expect(h.save.disabled).toBe(true);c.submittedView={mode:'studio',previewRequest:2,body:'cerys'};c.completeWorldPresentation();expect(h.save.disabled).toBe(false);expect(h.status.hidden).toBe(true);expect(c.canvas.dataset.presentedPreviewBody).toBe('cerys');expect(c.renderedFrames).toBe(7);expect(h.copies).toEqual([7,7]);});
test('incomplete or failed outfit loading remains blocked despite a prior frame',()=>{const h=harness();h.context.previewAssetsReady=false;h.context.presentedPreviewRequest=2;h.context.refreshPreviewSave();expect(h.save.disabled).toBe(true);expect(h.status.hidden).toBe(true);});
test('native assets retain the existing immediate save contract',()=>{const h=harness();h.context.softwarePresentation=null;h.context.refreshPreviewSave();expect(h.save.disabled).toBe(false);expect(h.status.hidden).toBe(true);});
