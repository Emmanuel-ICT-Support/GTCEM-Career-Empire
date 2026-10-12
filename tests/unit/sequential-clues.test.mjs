import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {normalise,advance,visitChapel,collectShot,reward,needsMuralClue} from '../../playable-3d/discovery-state.mjs';
const source=readFileSync(new URL('../../playable-3d/discovery-opening.js',import.meta.url),'utf8');
const shot={label:'Orange detail',image:'data:image/jpeg;base64,eA=='};
test('doorway then exit presents mural without another progress mutation; later stages do not regress',()=>{
 const s=visitChapel(advance(normalise(null),'parcel'));
 const context={state:s,visitChapel,needsMuralClue,scoutPlace:'mural',save(){},show(){context.presented=(context.presented||0)+1;}};
 vm.createContext(context);vm.runInContext(source.match(/ function chapelCheckpoint\(present=true\)\{[^\n]+/)[0],context);
 assert.equal(context.chapelCheckpoint(false),false);assert.equal(context.presented,undefined);
 assert.equal(context.chapelCheckpoint(true),false);assert.equal(context.presented,1);assert.equal(context.state,s);
 for(const next of [{...s,skipped:true},collectShot(s,'mural',shot),advance(collectShot(s,'mural',shot),'oval')]){context.state=next;context.chapelCheckpoint(true);assert.equal(context.presented,1);}
});
test('real slider handler reveals one picture, survives dialog reopening, and follows only after development',()=>{
 const elements=new Map();const $=id=>{if(!elements.has(id))elements.set(id,{style:{},hidden:false});return elements.get(id);};
 const img={style:{}};const toy={innerHTML:'',querySelector:()=>img};let saved=0,closed=0;
 const context={$,toy,development:0,state:advance(normalise(null),'parcel'),save(){saved++;},dialog:{close(){closed++;}},explore(){}};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf(' function renderDevelop()'),source.indexOf(' function renderDestinationClue()')),context);
 context.renderDevelop();assert.equal((toy.innerHTML.match(/<img /g)||[]).length,1);assert.ok(!toy.innerHTML.includes('mural'));assert.equal($('develop-next').hidden,true);
 $('develop').value=55;$('develop').oninput();context.renderDevelop();assert.equal($('develop').value,55);assert.equal($('develop-next').hidden,true);
 $('develop').value=100;$('develop').oninput();assert.equal($('develop-next').hidden,false);assert.equal(img.style.filter,'blur(0px) brightness(1)');
 $('develop-next').onclick();assert.equal(context.state.developed,true);assert.equal(saved,1);assert.equal(closed,1);
});
test('sequential progress survives same-run serialisation and repeated shots/reward remain idempotent',()=>{
 let s=normalise(JSON.parse(JSON.stringify(visitChapel(advance(normalise(null),'parcel')))));
 assert.equal(needsMuralClue(s),true);s=collectShot(s,'mural',shot);assert.equal(collectShot(s,'mural',shot),s);
 s=normalise(JSON.parse(JSON.stringify(s)));assert.equal(s.step,3);assert.equal(needsMuralClue(s),false);
 s=reward(advance(s,'oval'),'data:image/png;base64,eA==');assert.equal(reward(s,'data:image/png;base64,eA=='),s);
});
test('source wires exit presentation and immediate mural-to-oval dialog without extra invitation',()=>{
 const app=readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
 assert.match(app,/function leaveChapel\(\)\{const nextClue=discoveryReview;/);
 const shutter=source.slice(source.indexOf('  shutter.onclick='),source.indexOf(' function cinematicUI'));
 assert.match(shutter,/scoutPlace=null;renderDialog\(\)/);assert.ok(!shutter.includes('See the next picture'));
 assert.match(source,/scoutPlace=null;development=0;photoReviewPending=false;state=restart\(state\)/);
});
