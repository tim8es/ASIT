import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ATTEMPT_COLUMNS,encodeAttemptRow,verifyHeaders,decodeLegacyAttemptRow} from '../src/storage-contract.mjs';
import template from '../templates/tracker-v2.json' with {type:'json'};
const make=()=>({
 attempt_id:'fictional-01',session_id:'session-01',lesson_id:'lesson-01',
 activity_id:'exercise-01',competency_id:'INTERACT-GREET',answer:'Good morning',
 attempt_number:1,hint_level:'none',assessment:'partial'
});
test('attempt headers in source and template match',()=>{
 const t=template.tabs.find(t=>t.name==='Attempts');
 assert.deepEqual(t.columns,ATTEMPT_COLUMNS);
 assert.equal(verifyHeaders(t.columns),true);
});
test('header reordering detected',()=>{
 const swapped=[...ATTEMPT_COLUMNS];[swapped[0],swapped[1]]=[swapped[1],swapped[0]];
 assert.equal(verifyHeaders(swapped),false);
});
test('raw answer stored only with raw consent',()=>{
 const r=encodeAttemptRow(make(),{privacyMode:'raw'});
 assert.equal(r[7],'Good morning');assert.equal(r[14],'raw');
});
test('summary mode never saves raw answer by accident',()=>{
 const r=encodeAttemptRow(make(),{privacyMode:'summary_only',summary:'Produced a short greeting'});
 assert.equal(r[7],'Produced a short greeting');
 assert.equal(r.includes('Good morning'),false);
});
test('summary mode needs a summary',()=>assert.throws(()=>encodeAttemptRow(make()),/summary/));
test('off mode cannot write',()=>assert.throws(()=>encodeAttemptRow(make(),{privacyMode:'off'}),/consent/));
test('legacy mapping keeps missing date missing',()=>{
 const r=decodeLegacyAttemptRow(['legacy-01','','lesson','activity','skill','free_production',
 'Fictional prompt','Hello',1,'none','partial','reason','review','session']);
 assert.equal(r.occurred_at,null);assert.equal(r.source_version,1);
 assert.equal(r.answer,'Hello');
});
