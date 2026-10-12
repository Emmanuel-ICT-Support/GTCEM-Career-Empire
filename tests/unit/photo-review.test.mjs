import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {normalise,reward} from '../../playable-3d/discovery-state.mjs';
import {drawStyledPortrait} from '../../playable-3d/photo-style.mjs';
const source=readFileSync(new URL('../../playable-3d/discovery-opening.js',import.meta.url),'utf8');
function harness(){
 const el={focus(){},disabled:false};let callbacks=0,renders=0,saves=0;
 class Image{set src(value){this.value=value;queueMicrotask(()=>this.onload());}}
 const x={fillRect(){},drawImage(){},fillText(){}};
 const context={Image,Promise,Symbol,Object,captureBusy:false,photoReviewPending:false,state:normalise({step:4,shots:{mural:{label:'Orange detail',image:'data:image/jpeg;base64,eA=='}}}),reward,$:()=>el,document:{createElement:()=>({getContext:()=>x,toDataURL:()=> 'data:image/png;base64,cGhvdG8='})},beforeCapture:()=>{},capture:()=> 'data:image/png;base64,Y2FzdA==',drawStyledPortrait(){},save(){saves++;},dialog:{open:true,close(){this.open=false;}},renderDialog(){renders++;},explore(){},onPhotoFinish(){callbacks++;},scoutPlace:null};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf(' function makePoster('),source.indexOf(' function chapelCheckpoint(')),context);
 vm.runInContext(source.match(/ function continuePhotoReview\(\)\{[^\n]+/)[0],context);
 return {context,counts:()=>({callbacks,renders,saves})};
}
const finish=()=>new Promise(resolve=>setImmediate(resolve));
test('actual capture retains review, never offers companion until explicit Continue, and offers once',async()=>{
 const {context:c,counts}=harness();c.makePoster();c.continuePhotoReview();assert.equal(counts().callbacks,0);
 await finish();assert.equal(c.state.souvenir,'data:image/png;base64,cGhvdG8=');assert.equal(c.dialog.open,true);assert.deepEqual(counts(),{callbacks:0,renders:1,saves:1});
 c.continuePhotoReview();c.continuePhotoReview();assert.equal(counts().callbacks,1);assert.equal(c.dialog.open,false);
});
test('dismissed review is not forcibly reopened by capture; retake/review does not create another offer',async()=>{
 const {context:c,counts}=harness();c.makePoster();c.dialog.close();await finish();assert.equal(counts().renders,0);assert.equal(counts().callbacks,0);
 c.continuePhotoReview();c.makePoster(true);await finish();c.continuePhotoReview();assert.equal(counts().callbacks,1);
});
test('actual image drawing applies distinct full-portrait filters and framing, restores context',()=>{
 function record(style){const calls=[];const ctx=new Proxy({createRadialGradient(){calls.push(['gradient']);return {addColorStop:(...args)=>calls.push(['stop',...args])};}},{set(obj,k,v){calls.push([k,v]);obj[k]=v;return true;},get(obj,k){return obj[k]||((...args)=>calls.push([k,...args]));}});drawStyledPortrait(ctx,{id:'cast'},style);return calls;}
 const mystery=record('mystery'),comedy=record('comedy');
 assert.ok(mystery.some(c=>c[0]==='filter'&&c[1].includes('saturate(0.55)')));assert.ok(mystery.some(c=>c[0]==='gradient'));
 assert.ok(comedy.some(c=>c[0]==='filter'&&c[1].includes('saturate(1.35)')));assert.ok(comedy.some(c=>c[0]==='rotate'));assert.notDeepEqual(mystery,comedy);
 assert.equal(mystery.at(-1)[0],'restore');assert.equal(comedy.at(-1)[0],'restore');
});
test('collection uses actual souvenir and review opens without capture; existing companion rendering untouched',()=>{
 const tools=readFileSync(new URL('../../playable-3d/exploration-tools.mjs',import.meta.url),'utf8');
 const app=readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
 assert.match(tools,/photo\(\)\|\|'\.\/discovery-assets\/oval-clue.jpg'/);assert.match(tools,/view.onclick=\(\)=>\{close\(\);reviewPhoto\(\);\}/);
 assert.match(app,/photo:\(\)=>discovery.photo\(\),reviewPhoto:\(\)=>discovery.showPhotoFinish\(\)/);
 assert.match(source,/photo:\(\)=>state.souvenir,showPhotoFinish:\(\)=>show\(\)/);
 assert.match(source,/inspect.onclick=/);assert.match(source,/style.height=expanded\?'':'auto'/);
});
