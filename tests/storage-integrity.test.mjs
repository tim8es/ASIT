import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditStorageIndex} from '../src/storage-integrity.mjs';
const base=()=>({competencyIds:['c1'],sessionIds:['s1'],
 activities:[{row:2,activity_id:'a1',competency_id:'c1',session_id:'s1'}],
 attempts:[{row:2,attempt_id:'t1',activity_id:'a1',competency_id:'c1',session_id:'s1',privacy_mode:'summary_only'}]});
test('valid index preserves reliable historical references',()=>{
 const r=auditStorageIndex(base());assert.equal(r.valid_for_full_restore,true);assert.deepEqual(r.issues,[]);
});
test('orphan references and missing privacy are quarantined as review issues without raw content',()=>{
 const x=base();x.activities.push({row:15,activity_id:'a14',competency_id:'unknown',session_id:'unknown'});
 x.attempts.push({row:15,attempt_id:'t14',activity_id:'a14',competency_id:'unknown',session_id:'unknown',privacy_mode:''});
 const out=auditStorageIndex(x);assert.equal(out.valid_for_full_restore,false);
 assert.equal(out.issues.filter(q=>q.row===15).length,5);
 assert.equal(JSON.stringify(out).includes('unknown'),false);
});
test('unknown privacy mode is never inferred from adjacent summary-only attempts',()=>{
 const x=base();x.attempts[0].privacy_mode='';
 const out=auditStorageIndex(x);assert.equal(out.issues[0].code,'missing_or_invalid_privacy_mode');
});
