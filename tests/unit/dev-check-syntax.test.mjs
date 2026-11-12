import {test} from 'vitest';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {checkJavaScriptSources,scriptModesFromHtml} from '../../scripts/js-syntax-check.mjs';
const record=(name,source,mode={})=>({file:path.resolve('/fixture',name),source,...mode});
test('V8 distinguishes actual module syntax from strings/comments and never executes source',()=>{
 const result=checkJavaScriptSources([record('classic.js',"const example='export const x=1'; // import './fake.js'\nglobalThis.syntaxCheckExecuted=true;"),record('module.js',"import './dependency.js'; export const answer=42;"),record('modern.mjs','await Promise.resolve(); export default import.meta.url;',{module:true})]);
 assert.deepEqual(result.map(r=>[r.kind,r.ok]),[['classic',true],['module',true],['module',true]]);assert.equal(globalThis.syntaxCheckExecuted,undefined);
});
test('malformed classic and module source cannot fall through to a passing mode',()=>{
 const result=checkJavaScriptSources([record('classic.js','function broken( {',{classic:true}),record('broken.mjs','export const = 1;',{module:true}),record('orphan.js','import { from "x";'),record('return.js','return 1;',{classic:true}),record('classic-import.js','export const x=1;',{classic:true})]);assert.ok(result.every(r=>!r.ok));
});
test('strict module semantics apply to imported files even without import/export declarations',()=>{
 const r=checkJavaScriptSources([record('parent.mjs',"import './child.js';",{module:true}),record('child.js','with({}) {}')],{root:'/fixture'});assert.equal(r[0].ok,true);assert.equal(r[1].ok,false);
 const absolute=checkJavaScriptSources([record('parent.mjs',"import '/child.js';",{module:true}),record('child.js','with({}) {}')],{root:'/fixture'});assert.equal(absolute[1].ok,false);
});
test('HTML types and query strings preserve classic-versus-module treatment',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ce-syntax-'));try{
 const html=path.join(root,'index.html');fs.writeFileSync(html,`<script src='./classic.js?v=1'></script><script type="module" src="/module.js#v"></script><script type="application/json" src="data.js"></script>`);
 const modes=scriptModesFromHtml([html],root);assert.deepEqual(modes.get(path.join(root,'classic.js')),{classic:true});assert.deepEqual(modes.get(path.join(root,'module.js')),{module:true});assert.equal(modes.size,2);
 const checked=checkJavaScriptSources([{file:path.join(root,'module.js'),source:'with({}) {}',...modes.get(path.join(root,'module.js'))}]);assert.equal(checked[0].ok,false);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('a dual classic/module use must pass both grammars',()=>{assert.equal(checkJavaScriptSources([record('dual.js','export const x=1;',{classic:true,module:true})])[0].ok,false);});
test('repository scan retains every prior JS file and checks all current modules/classic sources',()=>{
 const dirs=['auth','dashboards','modules','shop','src'],files=[];function walk(dir){if(!fs.existsSync(dir))return;for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isDirectory()){if(!['.git','node_modules','out'].includes(e.name))walk(path.join(dir,e.name));}else if(/\.(?:js|mjs|cjs)$/.test(e.name))files.push(path.resolve(dir,e.name));}}
 dirs.forEach(walk);const modes=scriptModesFromHtml(files.length?dirs.flatMap(dir=>{const html=[];function visit(d){if(!fs.existsSync(d))return;for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory()){if(!['.git','node_modules','out'].includes(e.name))visit(f);}else if(f.endsWith('.html'))html.push(f);}}visit(dir);return html;}):[]);
 const results=checkJavaScriptSources(files.map(file=>({file,source:fs.readFileSync(file,'utf8'),...modes.get(file),...(file.endsWith('.mjs')?{module:true}:{}),...(file.endsWith('.cjs')?{classic:true}:{})})));
 assert.equal(results.length,files.length);assert.ok(results.every(r=>r.ok),JSON.stringify(results.filter(r=>!r.ok)));assert.ok(files.some(f=>f.endsWith('/dashboards/dashboard.js')));assert.ok(files.some(f=>f.endsWith('/modules/archon-careers/hosted/preview.js')));
 const output=execFileSync(process.execPath,['scripts/dev-check.mjs'],{encoding:'utf8'});assert.ok(output.includes(`Checked ${files.length} JavaScript files`));
});
