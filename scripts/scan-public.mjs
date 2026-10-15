#!/usr/bin/env node
/** Current tracked-source check; not a GitHub cache purge. */
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {scanTextForSensitiveMaterial} from '../src/source-audit.mjs';
const paths=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const warnings=[];
for(const path of paths){
 const buf=readFileSync(path);
 if(buf.includes(0)){warnings.push(path+': binary file requires manual review');continue;}
 const findings=scanTextForSensitiveMaterial(buf.toString('utf8'));
 if(findings.length)warnings.push(path+': '+findings.join(','));
}
if(warnings.length){console.error('Public source scan FAILED (no excerpts printed):\n'+warnings.join('\n'));process.exitCode=1;}
else {console.log('Public content scan passed for '+paths.length+' tracked files.');
 console.log('Does not prove absence of PII or purge unreachable Git objects.');}
