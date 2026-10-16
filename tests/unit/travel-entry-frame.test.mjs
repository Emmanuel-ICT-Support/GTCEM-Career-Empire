import {test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
const app=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const decision=app.slice(app.indexOf('  const entryFrameRequired='),app.indexOf('  // Preserve the completed initial view'));
function harness(){const c=vm.createContext({mode:'town',entryPreparing:true,entryGeometryReady:true,entryDrawSubmitted:false,marketOpening:false,explorationTools:{preparing:()=>false},discovery:{preparingTravel:()=>true}});vm.runInContext('function canDraw(){'+decision+'return true;}',c);return c;}
test('assist waiting on entry allows its required complete frame, then waits for that submission',()=>{const c=harness();expect(c.canDraw()).toBe(true);c.entryDrawSubmitted=true;expect(c.canDraw()).toBeUndefined();});
test('incomplete entry geometry stays hidden even when assist is waiting',()=>{const c=harness();c.entryGeometryReady=false;expect(c.canDraw()).toBeUndefined();});
test('ordinary travel, Stats preparation and Market preparation still defer world work',()=>{const c=harness();c.entryPreparing=false;expect(c.canDraw()).toBeUndefined();c.discovery.preparingTravel=()=>false;expect(c.canDraw()).toBe(true);c.explorationTools.preparing=()=>true;expect(c.canDraw()).toBeUndefined();c.explorationTools.preparing=()=>false;c.marketOpening=true;expect(c.canDraw()).toBeUndefined();});
