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
