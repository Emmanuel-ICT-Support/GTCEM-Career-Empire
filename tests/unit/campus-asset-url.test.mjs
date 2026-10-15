import {test,expect,vi} from 'vitest';
import {resolveCampusAssetURL} from '../../playable-3d/campus-asset-url.mjs';
test('deferred landscape loader retains the device-selected geometry URL',()=>{
 const deviceURL=vi.fn(url=>url.replace('campus-landscape/mature-eucalypt-b-packed.glb','phone/mature-eucalypt-b-mobile.glb'));
 expect(resolveCampusAssetURL('./assets/campus-landscape/mature-eucalypt-b-packed.glb',deviceURL,'placeholder')).toBe('./assets/phone/mature-eucalypt-b-mobile.glb');
 expect(deviceURL).toHaveBeenCalledOnce();
});
test('external decorative maps remain placeholders until original-image hydration',()=>{
 const deviceURL=vi.fn(url=>url);
 for(const url of ['./maps/stone.png','./maps/stone.jpg?v=1','./maps/stone.webp#map'])expect(resolveCampusAssetURL(url,deviceURL,'placeholder')).toBe('placeholder');
 expect(deviceURL).not.toHaveBeenCalled();
 const embedded='data:image/png;base64,embedded';expect(resolveCampusAssetURL(embedded,deviceURL,'placeholder')).toBe(embedded);
});
test('non-deferred loads still forward device selection and desktop URLs remain exact',()=>{
 const url='./assets/campus-landscape/small-multistem-a-packed.glb';
 expect(resolveCampusAssetURL(url,value=>value)).toBe(url);
 expect(resolveCampusAssetURL(url,()=> './assets/phone/small-multistem-a-mobile.glb')).toBe('./assets/phone/small-multistem-a-mobile.glb');
 expect(resolveCampusAssetURL('./stone.png',()=> './assets/phone/stone.webp')).toBe('./assets/phone/stone.webp');
});

test('actual campus loader composes private texture deferral with global phone routing',async()=>{
 const {readFileSync}=await import('node:fs'),vm=await import('node:vm');
 const source=readFileSync(new URL('../../playable-3d/campus-landscape.js',import.meta.url),'utf8');
 const body=source.slice(source.indexOf('export async function loadCampusAssets'),source.indexOf('// The accepted path network')).replace('export async function','async function');
 const requested=[],resolveURL=vi.fn(url=>url.replace('campus-landscape/mature-eucalypt-b-packed.glb','phone/mature-eucalypt-b-mobile.glb').replace('campus-buildings/careers-shared-textures.glb','phone/careers-mobile.glb'));
 class Manager{setURLModifier(fn){this.resolveURL=fn;}}
 class Loader{constructor(manager){this.manager=manager;}setMeshoptDecoder(){return this;}async loadAsync(url){requested.push(this.manager.resolveURL(url));return {scene:{traverse(){}},parser:{json:{textures:[]}}};}}
 const load=vm.runInNewContext(body+';loadCampusAssets',{THREE:{LoadingManager:Manager,DefaultLoadingManager:{resolveURL}},GLTFLoader:Loader,MeshoptDecoder:{},resolveCampusAssetURL});
 for(const textures of [undefined,{load(){throw Error('No external images in this fixture');}}]){
  requested.length=0;const assets=await load({textures,ids:['mature-eucalypt-b','careers']});
  expect(requested).toEqual(['./assets/phone/mature-eucalypt-b-mobile.glb','./assets/phone/careers-mobile.glb']);
  expect([...assets.keys()]).toEqual(['mature-eucalypt-b','careers']);
 }
});
