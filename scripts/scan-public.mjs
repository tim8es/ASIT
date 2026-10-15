#!/usr/bin/env node
/**
 * Public-source guard. Scans HEAD tracked files; it CANNOT scan unreachable or
 * earlier Git history. Before public release rewrite/audit Git history separately.
 */
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

const paths=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const signatures=[
 {label:'private Google Docs/Sheets URL',regex:/https?:\/\/docs\.google\.com\/(?:document|spreadsheets)\/d\/[A-Za-z0-9_-]{16,}/g},
 {label:'credential-like token',regex:/\b(?:gh[pousr]_[A-Za-z0-9]{24,}|sk-proj-[A-Za-z0-9_-]{25,}|sk-[A-Za-z0-9]{30,})\b/g},
 {label:'personal email address',regex:/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g},
 {label:'legacy named learner data',regex:new RegExp(['Tim','ur','\\b'].join(''),'gi')},
 {label:'legacy private attempt text',regex:new RegExp(['Management,',' couching'].join(''),'gi')}
];
const suspicious=[];
for(const p of paths){
 // Keep the checker itself out of exact marker checks; run remaining generic rules.
 if(p.includes('\0') || p.startsWith('node_modules/')) continue;
 const data=readFileSync(p);
 if(data.includes(0)) { suspicious.push(p+': binary tracked file requires manual review');continue; }
 const content=data.toString('utf8');
 for(const sig of signatures){
  if(p=== 'scripts/scan-public.mjs' && sig.label.startsWith('legacy')) continue;
  sig.regex.lastIndex=0;
  if(sig.regex.test(content)) suspicious.push(p+': '+sig.label);
 }
}
if(suspicious.length){
 console.error('Public content scan FAILED:\n'+suspicious.join('\n'));
 process.exitCode=1;
}else{
 console.log('Public content scan passed for '+paths.length+' tracked files.');
 console.log('WARNING: prior Git history and external resources still require separate review.');
}
