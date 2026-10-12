import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../../playable-3d/discovery-opening.js',import.meta.url),'utf8');

test('manual mural interaction waits for artwork and rechecks a previously offered action',()=>{
 let ready=false,opened=0;const context={dialog:{open:false},sequence:null,state:{step:1,chapelVisited:true,shots:{}},scoutPlace:null,muralReady:()=>ready,show:()=>opened++};
 const start=source.indexOf('interaction(m,p){'),end=source.indexOf('},update(m,p,dt)',start);
 const interaction=vm.runInNewContext('function '+source.slice(start,end+1)+';interaction;',context),p={x:10.6,z:-38.4};
 expect(interaction('town',p)).toBeNull();ready=true;const offered=interaction('town',p);expect(offered.label).toBe('Frame an orange detail');ready=false;offered.action();expect(opened).toBe(0);expect(context.scoutPlace).toBeNull();ready=true;offered.action();expect(opened).toBe(1);expect(context.scoutPlace).toBe('mural');
});

test('a fully loaded photo cannot be captured while the world mural is unready',()=>{
 let ready=false,framed=0;const shutter={},feedback={},context={shutter,feedback,closed:false,shotBusy:false,place:'mural',muralReady:()=>ready,img:{complete:true,naturalWidth:1254},frame:{x:.32,y:.34},frameAt:()=>{framed++;return null;},view:{classList:{remove(){},add(){}},offsetWidth:0}};
 const start=source.indexOf('  shutter.onclick=()=>{'),end=source.indexOf('\n  };',start);
 vm.runInNewContext(source.slice(start,end+5),context);shutter.onclick();expect(feedback.textContent).toContain('mural is still loading');expect(framed).toBe(0);expect(context.shotBusy).toBe(false);ready=true;shutter.onclick();expect(framed).toBe(1);
});
