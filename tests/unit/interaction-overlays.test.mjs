import {test} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const start=s.indexOf('function updateInteraction(){'),end=s.indexOf('\nfunction openModule(',start);
assert(start>=0&&end>start);const code=s.slice(start,end);
for(const state of [{name:'Feedback form',mode:'town',feedback:true},{name:'Avatar Studio',mode:'studio'},{name:'EST video',mode:'interior',watchingEST:true},{name:'learning module',mode:'town',moduleOpen:true},{name:'Chapel reflection',mode:'chapel',reflectionOpen:true}]){
 test(state.name+' suppresses the world prompt without interrupting the render update',()=>{
  const nodes={interact:{hidden:false},'module-overlay':{hidden:!state.moduleOpen},'reflection-dialog':{open:!!state.reflectionOpen},aerial:{setAttribute(){}}};
  const context={feedbackOpen:()=>!!state.feedback,mode:state.mode,watchingEST:!!state.watchingEST,interaction:{label:'stale'},$:id=>nodes[id]};vm.createContext(context);
  vm.runInContext(code+'\nupdateInteraction();',context);assert.equal(nodes.interact.hidden,true);assert.equal(context.interaction,null);
 });
}
