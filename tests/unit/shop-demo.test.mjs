import {test} from 'vitest';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../shop/shop.js',import.meta.url),'utf8').replace('initShop().catch(console.error);','');
function fixture(search='?demo=1') {
 const storageCalls=[],backendCalls=[],alerts=[],nodes={};
 const c=vm.createContext({URLSearchParams,console,Date,crypto:{randomUUID:()=> 'test-id'},window:{location:{search}},
 localStorage:{getItem(key){storageCalls.push(['get',key]);return null;},setItem(key){storageCalls.push(['set',key]);}},
 document:{body:{dataset:{}},getElementById(id){return nodes[id]??={};},querySelector(selector){if(selector==='.shop-request-panel')return {querySelector(){return {addEventListener(type,fn){c.reset=fn;}}}};return {remove(){}};},querySelectorAll(){return [];}},alert:msg=>alerts.push(msg)});
 vm.runInContext(source,c);
 vm.runInContext('renderShopPage=context=>{currentShopContext=context;};getSupabaseClientOrNull=()=>{throw Error("Demo touched backend");};',c);
 return {c,storageCalls,backendCalls,alerts,run:code=>vm.runInContext(code,c)};
}
test('demo opens with $100,000 without consulting student storage or backend',async()=>{
 const f=fixture();await f.c.initShop();assert.equal(f.run('currentShopContext.profile.cumulative_net_worth'),100000);assert.equal(f.run('currentShopContext.assets.length'),0);assert.deepEqual(f.storageCalls,[]);
});
test('all demo items and repeated purchases deduct correctly without any persistent economy writes',async()=>{
 const f=fixture();await f.c.initShop();let spent=0;
 for(let i=0;i<16;i++){spent+=f.run(`GLOBAL_ASSET_CATALOG[${i}].cost`);await f.run(`buyGlobalAsset(GLOBAL_ASSET_CATALOG[${i}],currentShopContext)`);}
 for(let i=0;i<2;i++){spent+=900;await f.run('buyGlobalAsset(GLOBAL_ASSET_CATALOG[0],currentShopContext)');}
 assert.equal(f.run('currentShopContext.profile.cumulative_net_worth'),100000-spent);assert.equal(f.run('currentShopContext.assets.length'),18);assert.deepEqual(f.storageCalls,[]);
});
test('manual reset and reopening both clear demo purchases and restore exactly $100,000',async()=>{
 const f=fixture();await f.c.initShop();await f.run('buyGlobalAsset(GLOBAL_ASSET_CATALOG[0],currentShopContext)');f.c.reset();assert.equal(f.run('currentShopContext.profile.cumulative_net_worth'),100000);assert.equal(f.run('currentShopContext.assets.length'),0);
 await f.run('buyGlobalAsset(GLOBAL_ASSET_CATALOG[0],currentShopContext)');await f.c.initShop();assert.equal(f.run('currentShopContext.assets.length'),0);assert.equal(f.run('currentShopContext.profile.savings'),100000);assert.deepEqual(f.storageCalls,[]);
});
test('demo rejects an unaffordable purchase and leaves budget and inventory unchanged',async()=>{
 const f=fixture();await f.c.initShop();for(let i=0;i<11;i++)await f.run('buyGlobalAsset(GLOBAL_ASSET_CATALOG[10],currentShopContext)');
 await f.run('buyGlobalAsset(GLOBAL_ASSET_CATALOG[10],currentShopContext)');assert.equal(f.run('currentShopContext.profile.cumulative_net_worth'),6500);assert.equal(f.run('currentShopContext.assets.length'),11);assert.equal(f.alerts.length,1);assert.deepEqual(f.storageCalls,[]);
});
test('ordinary shop is not granted the presentation balance',async()=>{
 const f=fixture('');f.c.getLocalShopContext=()=>({profile:{cumulative_net_worth:123},assets:[]});f.c.createStoreRequestModal=()=>{};f.c.bindStoreRequestActions=()=>{};f.c.loadApprovedStoreItems=async()=>{};f.c.renderCategoryBar=()=>{};f.c.renderShopGrid=()=>{};f.c.loadStudentShopContext=async()=>null;
 await f.c.initShop();assert.equal(f.run('currentShopContext.profile.cumulative_net_worth'),123);assert.equal(f.run('currentShopContext.presentationDemo'),undefined);
});
