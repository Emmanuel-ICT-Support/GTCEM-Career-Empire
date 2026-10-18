import {test,expect} from '@playwright/test';
for(const width of [1280,390])test(`legacy teacher dashboard renders unavailable synthetic class data ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:844});const errors=[],remote=[];page.on('pageerror',e=>errors.push(e.message));
 // This audit must never request school/student data.
 await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1')return route.continue();remote.push(url.hostname);return route.abort();});
 await page.route('**/src/services/supabase-browser.js',r=>r.fulfill({contentType:'text/javascript',body:'window.CareerEmpireSupabase={getClient:async()=>null};'}));
 await page.addInitScript(()=>localStorage.setItem('career-empire-auth-demo',JSON.stringify({teacher:{schoolId:'synthetic-school',schoolName:'Synthetic school'}})));
 await page.goto('/dashboards/teacher.html');
 await page.evaluate(()=>renderTeacherLiveData([], {categories:[]}, null));
 await expect(page.locator('#teacher-class-summary')).toHaveValue(/All classes/);await expect(page.locator('#teacher-class-scope-note')).toContainText('No live class records found');await page.screenshot({path:info.outputPath(`legacy-teacher-empty-${width}.png`)});expect(errors).toEqual([]);
});
