import {test,expect} from 'vitest';import fs from 'node:fs';import vm from 'node:vm';
const app=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8'),pattern=/actor\.update\(discovery\?\.reduced\(\)\?0:[^;]+;/;const timer=app.slice(app.indexOf('function advanceSoftwareNavigation')).match(pattern)[0],frame=app.slice(app.indexOf('function animate(){')).match(pattern)[0];
function sample(source,reduced,elapsed,movementElapsed){let result;vm.runInNewContext(source,{actor:{update:value=>result=value},discovery:{reduced:()=>reduced},elapsed,movementElapsed,dt:.016});return result;}
test('timer plus RAF consume one animation interval, rather than the full interval twice',()=>{expect(sample(timer,false,.015,0)+sample(frame,false,0,.001)).toBe(.016);expect(sample(frame,false,0,.016)).toBe(.016);});
test('both scheduling paths retain the reduced-motion animation freeze',()=>{expect(sample(timer,true,.015,0)).toBe(0);expect(sample(frame,true,0,.001)).toBe(0);});
