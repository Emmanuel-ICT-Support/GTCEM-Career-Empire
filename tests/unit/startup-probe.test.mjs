import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {sampleStartupDiagnostics} from '../e2e/startup-diagnostics.js';
test('startup observer samples fresh production state and frame milestones on every call',()=>{
 const node={dataset:{state:JSON.stringify({entryReady:false,surfaceDetailFailed:false})}},canvas={dataset:{firstFrameMs:'100',entryVisibleMs:'350'}};let now=400;
 const sample=vm.runInNewContext('('+sampleStartupDiagnostics.toString()+')',{document:{querySelectorAll:()=>[node],querySelector:()=>canvas},performance:{now:()=>now,timeOrigin:1000},location:{href:'http://localhost/playable-3d/'}});
 expect(sample().state.entryReady).toBe(false);node.dataset.state=JSON.stringify({entryReady:true,surfaceDetailFailed:true,avatarBody:'antonio',renderedFrames:7});now=500;const result=sample();expect(result.state).toMatchObject({entryReady:true,surfaceDetailFailed:true,avatarBody:'antonio',renderedFrames:7});expect(result).toMatchObject({pageMs:500,timeOrigin:1000,firstFrameMs:100,entryVisibleMs:350,diagnosticsCount:1});
});
test('startup observer permits polling before the first production diagnostic exists',()=>{
 const sample=vm.runInNewContext('('+sampleStartupDiagnostics.toString()+')',{document:{querySelectorAll:()=>[],querySelector:()=>null},performance:{now:()=>0,timeOrigin:1000},location:{href:'http://localhost/playable-3d/'}});const result=sample();expect(result.state).toEqual({});expect(result.firstFrameMs).toBeNull();expect(result.entryVisibleMs).toBeNull();expect(result.diagnosticsCount).toBe(0);
});
test('remaining observer milestones match unique production publication points',()=>{
 const app=readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');for(const marker of ["$('diagnostics').dataset.state=JSON.stringify(data);","canvas.dataset.entryVisibleMs=String(performance.now());","canvas.dataset.firstFrameMs=String(Math.round(performance.now()));"])expect(app.split(marker),marker).toHaveLength(2);
});
test('surface recovery keeps its real failure, recovery assertions and original budgets without app interception',()=>{
 const source=readFileSync(new URL('../e2e/deferred-surface-recovery.spec.js',import.meta.url),'utf8');expect(source).not.toContain('replaceOnce');expect(source).not.toContain("page.route('**/app.js");expect(source).toContain('page.evaluate(sampleStartupDiagnostics)');expect(source).toContain('test.setTimeout(60000)');expect(source).toContain('timeout:45000');expect(source).toContain('timeout:30000');expect(source).toContain('{entryReady:true,avatarBody:\'antonio\',surfaceDetailFailed:true}');expect(source).toContain('{surfaceDetailPending:0,surfaceDetailFailed:false,campusReady:false}');expect(source).toContain('expect(grassRequests).toBe(2)');
});
