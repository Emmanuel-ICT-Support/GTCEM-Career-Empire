import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// V8 parses only: no source is evaluated and no imports are loaded.
function parseBatch(vm, paths, records, root) {
 const byPath=new Map(records.map(r=>[r.file,r]));
 const required=new Set(records.filter(r=>r.module).map(r=>r.file));
 let results;
 for(let pass=0;pass<=records.length;pass++) {
  let changed=false;
  results=records.map(record=>{
   try {
    let parsed,kind;
    if(required.has(record.file)) {parsed=new vm.SourceTextModule(record.source);kind='module';}
    else {
     try {new vm.Script(record.source,{filename:record.file});kind='classic';}
     catch(classicError) {
      if(record.classic)throw classicError;
      parsed=new vm.SourceTextModule(record.source);kind='module';
     }
    }
    // A file referenced as a classic script must ALSO parse as a Script.
    if(kind==='module'&&record.classic)new vm.Script(record.source,{filename:record.file});
    if(parsed)for(const specifier of parsed.dependencySpecifiers) {
     if(!specifier.startsWith('.')&&!specifier.startsWith('/'))continue;
     const clean=specifier.split(/[?#]/)[0];
     const target=clean.startsWith('/')?paths.resolve(root,'.'+clean):paths.resolve(paths.dirname(record.file),clean);
     if(byPath.has(target)&&!target.endsWith('.cjs')&&!required.has(target)){required.add(target);changed=true;}
    }
    return {file:record.file,kind,ok:true};
   }catch(error){return {file:record.file,ok:false,error:error.message};}
  });
  if(!changed)return results;
 }
 throw Error('Module syntax propagation did not settle');
}

export function checkJavaScriptSources(records, {root=process.cwd()}={}) {
 const worker=`const fs=require('node:fs');const {records,root}=JSON.parse(fs.readFileSync(0,'utf8'));process.stdout.write(JSON.stringify((${parseBatch.toString()})(require('node:vm'),require('node:path'),records,root)));`;
 const run=spawnSync(process.execPath,['--experimental-vm-modules','-e',worker],{input:JSON.stringify({records,root}),encoding:'utf8',maxBuffer:64*1024*1024});
 if(run.error)throw run.error;
 if(run.status!==0)throw Error('JavaScript parser failed: '+run.stderr.trim());
 return JSON.parse(run.stdout);
}

export function scriptModesFromHtml(htmlFiles, root=process.cwd()) {
 const modes=new Map();
 for(const file of htmlFiles)for(const match of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>/gi)) {
  const attrs=new Map([...match[1].matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(a=>[a[1].toLowerCase(),a[2]??a[3]??a[4]]));
  const src=attrs.get('src');if(!src||/^(?:[a-z]+:|\/\/)/i.test(src))continue;
  const type=(attrs.get('type')||'').toLowerCase();if(type&&!['module','text/javascript','application/javascript'].includes(type))continue;
  const clean=decodeURIComponent(src.split(/[?#]/)[0]);
  const target=clean.startsWith('/')?path.resolve(root,'.'+clean):path.resolve(path.dirname(file),clean);
  const mode=modes.get(target)||{};mode[type==='module'?'module':'classic']=true;modes.set(target,mode);
 }
 return modes;
}
