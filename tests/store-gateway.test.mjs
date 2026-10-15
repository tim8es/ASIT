import {test} from 'node:test';
import assert from 'node:assert/strict';
import {persistAttempt} from '../src/store-gateway.mjs';
import {ATTEMPT_COLUMNS} from '../src/storage-contract.mjs';

const a=()=>({
  attempt_id:'fake-a1',session_id:'fictional-s',lesson_id:'fictional-l',activity_id:'fictional-act',
  competency_id:'fictional-c',answer:'Fictional answer for a test.',attempt_number:1,
  hint_level:'none',assessment:'partial',observed_modality:'typed_text',observed_operation:'production'
});
function adapter({headers=[...ATTEMPT_COLUMNS],dropWrites=false,tamper=false,dups=[]}={}){
 const rows=[...dups];let writes=0;
 return {
  readAttemptHeaders:async()=>headers,
  findAttemptsById:async id=>rows.filter(r=>r[0]===id),
  appendAttemptRow:async row=>{writes++;if(!dropWrites)rows.push(tamper?[...row.slice(0,10),'correct',...row.slice(11)]:[...row]);},
  get writes(){return writes;},
  rows
 };
}
const run=(store,extra={})=>persistAttempt({adapter:store,attempt:a(),privacyMode:'summary_only',
 summary:'A short synthetic response with incomplete structure.',consentGranted:true,...extra});

test('new authorized synthetic attempt is saved and verified',async()=>{
 const s=adapter();const out=await run(s);
 assert.equal(out.status,'saved');assert.equal(out.verified,true);
 assert.equal(s.rows.length,1);assert.equal(s.rows[0][7],'A short synthetic response with incomplete structure.');
});
test('repeat has no write when row matches',async()=>{
 const s=adapter();await run(s);const t=await run(s);
 assert.equal(t.status,'already_saved');assert.equal(s.writes,1);
});
test('repeat with different LLM summary is marked unverifiable, not written',async()=>{
 const s=adapter();await run(s);
 const t=await run(s,{summary:'A different description of the same event.'});
 assert.equal(t.status,'duplicate_unverified');assert.equal(t.verified,false);assert.equal(s.writes,1);
});
test('no persistence without explicit consent',async()=>{
 const s=adapter();
 await assert.rejects(()=>run(s,{consentGranted:false}),/consent/);
 assert.equal(s.writes,0);
});
test('schema mismatch stops before write',async()=>{
 const s=adapter({headers:['wrong']});
 await assert.rejects(()=>run(s),/schema mismatch/);
 assert.equal(s.writes,0);
});
test('lost write cannot claim saved',async()=>{
 const s=adapter({dropWrites:true});
 await assert.rejects(()=>run(s),/could not be verified/);
 assert.equal(s.rows.length,0);
});
test('tampered readback cannot claim saved',async()=>{
 const s=adapter({tamper:true});
 await assert.rejects(()=>run(s),/could not be verified/);
});
test('duplicate corrupted prior record stops',async()=>{
 const s=adapter();await run(s);
 s.rows.push([...s.rows[0]]);
 await assert.rejects(()=>run(s),/Multiple existing/);
});
test('raw duplicate with changed answer stops',async()=>{
 const s=adapter();
 await run(s,{privacyMode:'raw'});
 await assert.rejects(()=>run(s,{privacyMode:'raw',attempt:{...a(),answer:'A different reply'}}),/Conflicting/);
 assert.equal(s.writes,1);
});
