// Reuse existing acceptance assertions at the real GitHub project prefix.
// Only navigation URLs/import locations change; game responses are never rewritten.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.join(root,'coverage/pages-browser-tests');mkdirSync(target,{recursive:true});
for(const file of process.argv.slice(2)){
 const source=path.join(root,'tests/e2e',file);
 let text=readFileSync(source,'utf8').replace(/from (['"])(\.\/?[^'"]+)\1/g,(all,quote,url)=>`from ${quote}${path.resolve(path.dirname(source),url)}${quote}`);
 text=text.replaceAll("page.goto('/playable-3d/","page.goto('/test-career-empire/playable-3d/");
 // Record any failed local response for the staged browser's actual requests.
 text=text.replace("import {test,expect} from '@playwright/test';",`import {test,expect} from '@playwright/test';\nconst pagesHttpFailures=new WeakMap();
test.beforeEach(async({page})=>{const failures=[];pagesHttpFailures.set(page,failures);page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:4290/')){failures.push({status:r.status(),url:r.url()});console.log('PAGES_HTTP_FAILURE',r.status(),r.url());}});});
test.afterEach(async({page})=>{expect(pagesHttpFailures.get(page)).toEqual([]);if(!page.isClosed())expect(new URL(page.url()).pathname).toContain('/test-career-empire/');});`);
 writeFileSync(path.join(target,file),text);
}
