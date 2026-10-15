import fs from 'node:fs';
import path from 'node:path';

// Never reuse a test output directory: both test frameworks may clean outputs.
// Existing evidence is a parent or sibling, never the selected output itself.
export function createEvidenceDirectory(kind,{root=process.env.CE_TEST_EVIDENCE_ROOT||path.resolve('coverage/runs')}={}){
 if(!/^[a-z][a-z0-9-]*$/.test(kind))throw new Error('Invalid evidence run kind');
 root=path.resolve(root);fs.mkdirSync(root,{recursive:true});
 const stamp=new Date().toISOString().replace(/[:.]/g,'-');
 const directory=fs.mkdtempSync(path.join(root,kind+'-'+stamp+'-'));
 fs.writeFileSync(path.join(directory,'run.json'),JSON.stringify({kind,createdAt:new Date().toISOString(),directory,cleanupAllowed:false},null,2)+'\n',{flag:'wx'});
 return directory;
}

export function coverageArguments(args){
 for(const arg of args)if(arg.startsWith('-'))throw new Error('Coverage options are managed by the evidence runner; pass test file filters only: '+arg);
 return args;
}

export function coverageDirectory(){
 const requested=process.env.CE_UNIT_COVERAGE_DIRECTORY;
 if(!requested)return path.join(createEvidenceDirectory('unit-coverage'),'coverage');
 const directory=path.resolve(requested),parent=path.dirname(directory);
 let record;try{record=JSON.parse(fs.readFileSync(path.join(parent,'run.json')));}catch{}
 if(fs.existsSync(directory)||path.basename(directory)!=='coverage'||record?.kind!=='unit-coverage'||record.directory!==parent||record.cleanupAllowed!==false)throw new Error('Coverage requires a fresh directory owned by the evidence runner');
 return directory;
}

export function assertSafeCoverageOverrides(args){
 for(const arg of args)if(['--coverage.clean','--coverage.cleanOnRerun','--coverage.reportsDirectory'].some(flag=>arg===flag||arg.startsWith(flag+'=')))throw new Error('Coverage cleanup and output overrides are disabled; use the evidence runner');
}
