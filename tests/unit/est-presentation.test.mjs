import {test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../playable-3d/est-station-cards.mjs',import.meta.url),'utf8').replace(/^import .*\n/,'').replaceAll('export ','');
const stations=[{id:'content',x:-3.5,z:1.5},{id:'glossary',x:3.5,z:1.5},{id:'decoder',x:-3.5,z:-3.5},{id:'boss',x:3.5,z:-3.5}];
function fixture({fail=false}={}){
 const draws=[],loads=[];const context2d={clearRect(){},fillRect(){},beginPath(){},roundRect(){},stroke(){},fillText(){},measureText:t=>({width:t.length*22}),createLinearGradient:()=>({addColorStop(){}}),drawImage:(...args)=>draws.push(args)};
 class Mesh{constructor(geometry,material){Object.assign(this,{geometry,material,position:{set:(...p)=>this.xyz=p}});}}
 const T={Mesh,PlaneGeometry:class{constructor(width,height){Object.assign(this,{width,height});}},MeshBasicMaterial:class{constructor(p){Object.assign(this,p);}},CanvasTexture:class{constructor(canvas){this.image=canvas;}},SRGBColorSpace:'srgb',TextureLoader:class{loadAsync(url){loads.push(url);if(fail){fail=false;return Promise.reject(Error('offline'));}return Promise.resolve({image:{width:559,height:500},dispose(){}});}}};
 const c={THREE:T,document:{createElement:()=>({getContext:()=>context2d})}};vm.createContext(c);vm.runInContext(source+'\nglobalThis.api={createESTStationCards,EST_CARDS};',c);const scene={add(){}};return {cards:c.api.createESTStationCards(scene,stations),definitions:c.api.EST_CARDS,draws,loads};
}
test('four corresponding teaching cards share one recoverable guide load and redraw after readiness',async()=>{
 const {cards,definitions,draws,loads}=fixture();expect(definitions.map(x=>x.name)).toEqual(['CORE','TERM','VTCS','BOSS']);expect(cards.ready).toBe(false);const version=cards.version;const first=cards.ensure();expect(cards.ensure()).toBe(first);await first;expect(loads).toHaveLength(1);expect(draws).toHaveLength(4);expect(cards.ready).toBe(true);expect(cards.version).toBeGreaterThan(version);for(const args of draws){expect(args.slice(1,5)).toEqual([0,0,512,500]);}
});
test('guide failure leaves card text available and the next request retries successfully',async()=>{
 const {cards,loads}=fixture({fail:true});await expect(cards.ensure()).rejects.toThrow('offline');expect(cards.screens).toHaveLength(4);expect(cards.ready).toBe(false);await cards.ensure();expect(loads).toHaveLength(2);expect(cards.ready).toBe(true);
});
test('card faces align with the four authored monitor glass surfaces without changing the hardware',()=>{
 const {cards}=fixture();cards.screens.forEach((item,i)=>{expect(item.screen.geometry.width).toBeCloseTo(1.04);expect(item.screen.geometry.height).toBeCloseTo(.61);expect(item.screen.xyz).toEqual([stations[i].x,1.47,stations[i].z-.049]);expect(item.screen.material.toneMapped).toBe(false);});
});
test('both entry actions are available at the entry position and blocked outside the hall or behind another mode',()=>{
 const app=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');const code=app.slice(app.indexOf('function canUseESTEntryActions(){'),app.indexOf('function positionESTPlayButton(){'));let returned=0;const nodes={'module-overlay':{hidden:true},'reflection-dialog':{open:false}};const c={mode:'interior',watchingEST:false,$:id=>nodes[id],destination:x=>{expect(x).toBe('est');returned++;}};vm.createContext(c);vm.runInContext(code,c);expect(c.canUseESTEntryActions()).toBe(true);c.returnFromEST();expect(returned).toBe(1);for(const mode of ['town','chapel','market','studio']){c.mode=mode;expect(c.canUseESTEntryActions()).toBe(false);c.returnFromEST();}c.mode='interior';c.watchingEST=true;expect(c.canUseESTEntryActions()).toBe(false);c.watchingEST=false;nodes['module-overlay'].hidden=false;expect(c.canUseESTEntryActions()).toBe(false);nodes['module-overlay'].hidden=true;nodes['reflection-dialog'].open=true;expect(c.canUseESTEntryActions()).toBe(false);expect(returned).toBe(1);
});

test('EST return preserves the exterior entrance before wider campus preparation',async()=>{
 const app=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');const fn=app.slice(app.indexOf('function destination(which)'),app.indexOf('function destination(which)')+app.slice(app.indexOf('function destination(which)')).indexOf('\n'));const positions=[];const c={mode:'interior',campusReady:false,EST:{x:16,z:12.5,yaw:Math.PI},CAREERS:{},ECC_HOME:{},actor:{model:{position:{copy(){}},rotation:{}}},worlds:{teleport:(...p)=>positions.push(p),position:()=>({})},setMode:async()=>{},setLocation(){},updateCamera(){}};vm.createContext(c);vm.runInContext(fn,c);c.destination('est');await new Promise(resolve=>setImmediate(resolve));expect(positions).toEqual([[false,16,12.5]]);
});
