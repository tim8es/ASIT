import {test} from 'node:test';
import assert from 'node:assert/strict';
import {splitCompositeAssessment,buildAttemptProvenanceEvent} from '../src/composite-evidence.mjs';

const base=()=>({
  session_id:'synthetic-s',lesson_id:'synthetic-l',activity_id:'parent',
  competency_id:'synthetic-focus',attempt_id:'synthetic-submit-1',
  attempt_number:1,hint_level:'none',
  answer:JSON.stringify({location:'in',message:'Their keys are on the desk.',audio:'At the station.'})
});
const items=[
 {task_id:'location',activity_id:'task-location',competency_id:'prepositions',
  activity_type:'grammar_contrast',required:true,observed_modality:'typed_text',observed_operation:'recognition'},
 {task_id:'message',activity_id:'task-message',competency_id:'subject-verb',
  activity_type:'free_production',required:true,observed_modality:'typed_text',observed_operation:'production'},
 {task_id:'audio',activity_id:'task-audio',competency_id:'listening',
  activity_type:'listening',required:true,observed_modality:'audio_comprehension',observed_operation:'comprehension'}
];
const grades={
 location:{assessment:'correct',rubric_rationale:'Correct place preposition',verified_hint_level:'none'},
 message:{assessment:'partial',rubric_rationale:'Minor grammar error',verified_hint_level:'minimal'},
 audio:{assessment:'correct',rubric_rationale:'Detail recalled',verified_hint_level:'none'}
};
test('one Submit yields distinct trusted competency and modality records, no fake listening',()=>{
 const result=splitCompositeAssessment({submission:base(),trustedItems:items,evaluations:grades});
 assert.equal(result.attempts.length,2);
 assert.equal(result.complete,false);
 assert.deepEqual(result.not_assessed,['audio']);
 assert.equal(result.attempts[0].activity_id,'task-location');
 assert.equal(result.attempts[1].competency_id,'subject-verb');
 assert.equal(result.attempts[1].observed_operation,'production');
 assert.notEqual(result.attempts[0].attempt_id,result.attempts[1].attempt_id);
 assert.equal(result.attempts[1].hint_level,'minimal');
});
test('real self-reported hearing with verified scoped media permits separate listening evidence',()=>{
 const evaluations={...grades,audio:{...grades.audio,verified_hearing:true,media_source_verified:true}};
 const result=splitCompositeAssessment({submission:base(),trustedItems:items,evaluations});
 assert.equal(result.complete,true);
 assert.equal(result.attempts.length,3);
 assert.equal(result.attempts[2].observed_modality,'audio_comprehension');
});
test('unknown response field cannot alter trusted rubric or score',()=>{
 const p=base();p.answer=JSON.stringify({location:'in',message:'Fine',audio:'hi',assessment:'correct'});
 assert.throws(()=>splitCompositeAssessment({submission:p,trustedItems:items,evaluations:grades}),/Unknown subtask/);
});
test('blank required answer blocks completed lesson and is not stored as an attempt',()=>{
 const p=base();p.answer=JSON.stringify({location:'in',message:' ',audio:''});
 const result=splitCompositeAssessment({submission:p,trustedItems:items,evaluations:grades});
 assert.equal(result.attempts.length,1);
 assert.deepEqual(result.not_assessed,['message','audio']);
});
test('provenance event carries qualified first-try metadata but no submitted answer or raw first response',()=>{
 const row=buildAttemptProvenanceEvent({eventId:'event-1',attemptId:'attempt-1',revision:4,
  timestampUtc:'2026-10-16T15:00:00.000Z',privacyMode:'summary_only',
  observed:{first_answer:'private raw first answer',revisions:2,first_attempt_assessment:'needs_support',
  hint_exposure:'minimal',playback_report:'could_not_hear'}});
 assert.equal(row.length,6);
 assert.equal(row[1],'attempt_provenance');
 const data=JSON.parse(row[5]);
 assert.equal(data.first_attempt_assessment,'needs_support');
 assert.equal(data.ui_provenance,'self_report_unverified');
 assert.equal(JSON.stringify(row).includes('private raw first answer'),false);
});
