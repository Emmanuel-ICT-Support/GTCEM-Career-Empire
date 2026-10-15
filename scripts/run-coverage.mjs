import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createEvidenceDirectory,coverageArguments} from './evidence-directory.mjs';

const args=coverageArguments(process.argv.slice(2));
const directory=createEvidenceDirectory('unit-coverage');
const reports=path.join(directory,'coverage');
const log=fs.createWriteStream(path.join(directory,'runner.log'),{flags:'wx'});
const command=[path.resolve('node_modules/vitest/vitest.mjs'),'run','--coverage','--reporter=default','--reporter=json','--outputFile='+path.join(directory,'unit-results.json'),...args];
console.log('Isolated coverage evidence: '+directory);
const child=spawn(process.execPath,command,{env:{...process.env,CE_UNIT_COVERAGE_DIRECTORY:reports},stdio:['inherit','pipe','pipe']});
for(const [stream,target]of [[child.stdout,process.stdout],[child.stderr,process.stderr]])stream.on('data',chunk=>{target.write(chunk);log.write(chunk);});
child.on('error',error=>{log.write(String(error)+'\n');process.exitCode=1;});
child.on('close',(code,signal)=>{
 log.end();
 const file=path.join(directory,'run.json'),record=JSON.parse(fs.readFileSync(file));
 fs.writeFileSync(file,JSON.stringify({...record,finishedAt:new Date().toISOString(),command:[process.execPath,...command],reports,exitCode:code,signal},null,2)+'\n');
 process.exitCode=code??1;
});
