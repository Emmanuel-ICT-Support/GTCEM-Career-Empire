import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';

// Verify the actual Git release, not an accidental mixture of tracked source and
// local-only assets. CI runs this before launching any long browser scenarios.
const staged=process.argv.includes('--staged');
const git=args=>execFileSync('git',args,{encoding:'utf8',maxBuffer:64*1024*1024});
const tracked=new Set(git(staged?['ls-files']:['ls-tree','-r','--name-only','HEAD']).trim().split('\n'));
const read=file=>execFileSync('git',['show',`${staged?'': 'HEAD'}:${file}`],{maxBuffer:64*1024*1024});
const manifest=JSON.parse(read('playable-3d/release-manifest.json'));
const failures=[];
for(const {path:file,sha256}of manifest.files){
 const name=path.posix.normalize(`playable-3d/${file}`);
 if(!tracked.has(name)){failures.push(`Untracked manifest asset: ${name}`);continue;}
 const actual=createHash('sha256').update(read(name)).digest('hex');
 if(actual!==sha256)failures.push(`Manifest hash mismatch: ${name}`);
}
const queue=['playable-3d/app.js'],seen=new Set();
while(queue.length){
 const file=queue.pop();if(seen.has(file))continue;seen.add(file);
 if(!tracked.has(file)){failures.push(`Missing runtime module: ${file}`);continue;}
 const source=read(file).toString();
 const imports=[...source.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.[^'"]+)\1/g)].map(m=>m[2]);
 for(const specifier of imports){const name=path.posix.normalize(path.posix.join(path.posix.dirname(file),specifier.split(/[?#]/)[0]));if(!tracked.has(name))failures.push(`${file} imports missing ${name}`);else if(/\.m?js$/.test(name))queue.push(name);}
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log(`Release verified: ${manifest.files.length} exact asset hashes and ${seen.size} reachable local modules (${staged?'index':'HEAD'}).`);
