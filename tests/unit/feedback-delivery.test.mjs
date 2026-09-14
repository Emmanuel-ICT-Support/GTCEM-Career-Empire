import {test} from 'vitest';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../src/services/feedback-widget.js',import.meta.url),'utf8').replace('  function init() {','  windowObj.feedbackTest={submitFeedback,buildTeacherFeedbackMessage};\n  function init() {');
function fixture(client){
 const saved=[],sent=[];const window={location:{pathname:'/playable-3d/'},CareerEmpireSupabase:{getClient:async()=>client?.(sent)}};
 vm.runInNewContext(source,{window,document:{body:{dataset:{}},readyState:'loading',addEventListener(){}},localStorage:{getItem:()=>null,setItem:(...args)=>saved.push(args)},crypto:{randomUUID:()=> 'local-test'}});
 return {...window.feedbackTest,saved,sent};
}
test('feedback uses the existing teacher inbox schema and reports successful delivery only after insert',async()=>{
 const f=fixture(sent=>({from(table){assert.equal(table,'feedback_reports');return {async insert(payload){sent.push(payload);return {error:null};}}}}));
 const review=f.buildTeacherFeedbackMessage('suggestion','Which parts are good?\nThe store\n\nWhich parts are awful or not working well?\nThe slow loading\n\nWhat suggestions do you have to make it better?\nMore careers',{});
 assert.equal(review.kind,'teacher-feedback');assert.equal(review.status,'pending_review');assert.equal(review.page_path,'/playable-3d/');
 assert.equal(await f.submitFeedback({feedback_type:'suggestion',message:JSON.stringify(review)}),true);assert.equal(f.sent.length,1);assert.equal(f.saved.length,0);
});
test('missing connection saves a local fallback and does not report delivered',async()=>{
 const f=fixture();assert.equal(await f.submitFeedback({message:'test fixture'}),false);assert.equal(f.saved[0][0],'career-empire-feedback-fallback');assert.equal(f.sent.length,0);
});
test('backend errors propagate without claiming the teacher received feedback',async()=>{
 const f=fixture(()=>({from:()=>({insert:async()=>({error:new Error('offline')})})}));await assert.rejects(()=>f.submitFeedback({message:'test fixture'}),/offline/);assert.equal(f.saved.length,0);
});
