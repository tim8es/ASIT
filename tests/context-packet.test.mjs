import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planContextReads,buildLessonContextPacket} from '../src/context-packet.mjs';
const state=(count=500)=>({
 revision:12,profile:{target_language:'English',goals:['Handle practical interactions'],
  preferences:{feedback_style:'brief',current_support:'minimal'}},
 learning_plan:[{status:'active',revision:12,competency_ids:['C'],rationale:'Learner-chosen goal'}],
 competencies:[{id:'C',can_do:'Politely ask for details',required_modality:'typed_text',
  required_operation:'production',status:'supported',evidence_count:count,priority:4}],
 attempts:Array.from({length:count},(_,i)=>({attempt_id:'fake-'+i,competency_id:'C',
   assessment:i%3?'partial':'correct',hint_level:'none',
   answer:'VERBATIM_PRIVATE_ANSWER_SHOULD_NOT_LEAK',
   answer_summary:'Asked politely but missed a detail',rubric_rationale:'Meaning was clear',
   session_id:'session-'+i,observed_modality:'typed_text',observed_operation:'production'})),
 review_queue:[{competency_id:'C',due_at:'2026-10-15T00:00:00Z',content_or_pattern:'Please repeat that'}],
 sessions:[{id:'latest',summary:'One practical exchange',next_step:'Try another context'}]
});
test('everyday plan never requests the entire workbook',()=>{
 const p=planContextReads({intent:'lesson'});
 assert.equal(p.requires_full_history,false);
 assert.ok(p.reads.every(x=>!/entire|all attempts/i.test(x)));
});
test('quick isolated word explanation can skip all private connector calls',()=>{
 const p=planContextReads({intent:'quick_answer'});
 assert.deepEqual(p.reads,[]);
});
test('submission reads only trusted activity and exact attempt',()=>{
 const p=planContextReads({intent:'submission'});
 assert.ok(p.reads.some(x=>/exact submitted ID/.test(x)));
});
test('explicit longitudinal audit is paginated, unlike ordinary lesson',()=>{
 const p=planContextReads({intent:'history_audit'});
 assert.equal(p.requires_full_history,true);
 assert.match(p.note,/page/);
});
test('500 historical attempts produce compact context without raw answers',()=>{
 const data=state();
 const {packet,metrics}=buildLessonContextPacket(data);
 assert.ok(metrics.serialized_chars<6001);
 assert.ok(metrics.shown_attempts<=6);
 assert.equal(metrics.omitted_attempts,494);
 assert.equal(packet.competencies[0].stored_status,'supported');
 assert.ok(!JSON.stringify(packet).includes('VERBATIM_PRIVATE_ANSWER'));
 assert.equal(packet.coverage.is_full_learning_history,false);
});
test('context size stays bounded from 50 to 5000 attempts',()=>{
 const short=buildLessonContextPacket(state(50)).metrics.serialized_chars;
 const long=buildLessonContextPacket(state(5000)).metrics.serialized_chars;
 assert.ok(long<6000);
 assert.ok(long-short<1000,'context must be independent of full attempt history');
});
test('budget shortage sheds optional history, never invents missing data',()=>{
 const x=buildLessonContextPacket(state(100),{maxChars:1200});
 assert.ok(x.metrics.serialized_chars<=1200);
 assert.equal(x.packet.coverage.is_full_learning_history,false);
});
test('no claimed mastery from cropped evidence',()=>{
 const x=buildLessonContextPacket(state(1));
 assert.equal(x.packet.competencies[0].stored_status,'supported');
 assert.ok(!('mastered' in x.packet.competencies[0]));
});
test('invalid state and maliciously large limits fail closed',()=>{
 assert.throws(()=>buildLessonContextPacket({...state(),revision:-2}),/revision/);
 assert.throws(()=>buildLessonContextPacket(state(),{maxAttempts:100}),/slice limit/);
});
