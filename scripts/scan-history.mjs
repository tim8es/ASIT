#!/usr/bin/env node
/** Scan blobs reachable from fetched Git refs, not detached server-side objects. */
import {execFileSync} from 'node:child_process';
import {scanTextForSensitiveMaterial} from '../src/source-audit.mjs';
const git=(...args)=>execFileSync('git',args,{maxBuffer:30*1024*1024});
const commits=git('rev-list','--all').toString('utf8').trim().split('\n').filter(Boolean);
const seen=new Set(),alerts=[];
for(const commit of commits){
 const tree=git('ls-tree','-r','-z',commit).toString('utf8');
 for(const entry of tree.split('\0').filter(Boolean)){
  const i=entry.indexOf('\t'),meta=entry.slice(0,i),path=entry.slice(i+1);
  const [mode,type,blobId]=meta.split(' ');
  if(type!=='blob'||seen.has(blobId))continue;
  seen.add(blobId);
  const blob=git('cat-file','blob',blobId);
  if(blob.includes(0)){alerts.push('binary historical object: '+path);continue;}
  const findings=scanTextForSensitiveMaterial(blob.toString('utf8'));
  if(findings.length)alerts.push(blobId.slice(0,12)+' '+path+': '+findings.join(','));
 }
}
if(alerts.length){console.error('Reachable history scan FAILED:\n'+alerts.join('\n'));process.exitCode=1;}
else console.log('Reachable-history scan passed: '+commits.length+' commits, '+seen.size+' unique blobs.');
console.log('Detached or cached GitHub commits may still exist. See docs/publication.md.');
