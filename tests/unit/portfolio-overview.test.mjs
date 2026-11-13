import {it,expect} from 'vitest';
import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../dashboards/dashboard.js',import.meta.url),'utf8');
const start=source.indexOf('function portfolioCapabilityOrder('),end=source.indexOf('\nfunction ',start+10);const scope={};vm.createContext(scope);vm.runInContext(source.slice(start,end),scope);
it('puts Initiative first without changing the remaining order or shared category source',()=>{const categories=[{id:'communication'},{id:'teamwork'},{id:'initiative'},{id:'digital-literacy'}];const before=JSON.stringify(categories);expect(scope.portfolioCapabilityOrder(categories).map(c=>c.id)).toEqual(['initiative','communication','teamwork','digital-literacy']);expect(JSON.stringify(categories)).toBe(before)});
it('does not invent a capability for a separate set without Initiative',()=>{expect(scope.portfolioCapabilityOrder([{id:'collaboration'}]).map(c=>c.id)).toEqual(['collaboration'])});
