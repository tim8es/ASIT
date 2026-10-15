import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLearnerState,applyAttempt,summarizeCompetency,validateAttempt} from '../src/learning-state.mjs';
import {decodeSubmission,validateSubmissionAgainstActivity,PREFIX} from '../src/protocol.mjs';
import {rankLearningPriorities} from '../src/planner.mjs';
import {decodeAttemptRow,encodeAttemptRow,ATTEMPT_COLUMNS} from '../src/storage-contract.mjs';
const competency={id:'SPK-COMM',can_do:'Explain a situation orally',required_modality:'spoken_audio',
  required_operation:'production',dependencies:[],priority:4};
const seed=(id,session,context,extra={})=>({
 attempt_id:id,session_id:session,lesson_id:'L',activity_id:context,competency_id:'SPK-COMM',
 answer:'This is a fictional utterance.',assessment:'correct',attempt_number:1,
 hint_level:'none',context_id:context,observed_modality:'spoken_audio',
 observed_operation:'production',...extra
});
const trusted={session_id:'S',lesson_id:'L',activity_id:'A',
 competency_id:'C',next_attempt_number:1,expected_attempt_id:'A-1'};

test('a text answer never proves oral competence',()=>{
 const x=seed('a','s1','office',{observed_modality:'typed_text'});
 const v=summarizeCompetency([x],competency.id,competency);
 assert.equal(v.status,'unassessed');assert.equal(v.excluded_count,1);
});
test('choice responses never prove an independent production competence',()=>{
 const x=seed('a','s1','office',{observed_operation:'recognition'});
 assert.equal(summarizeCompetency([x],competency.id,competency).status,'unassessed');
});
test('transfer requires distinct sessions and contexts, and correct modalities',()=>{
 const a=seed('a','s1','office'),b=seed('b','s2','travel');
 assert.equal(summarizeCompetency([a,b],competency.id,competency).status,'transferable');
 assert.equal(summarizeCompetency([a,{...b,context_id:'office'}],competency.id,competency).status,'independent');
 assert.equal(summarizeCompetency([a,{...b,session_id:'s1'}],competency.id,competency).status,'independent');
});
test('fresh independent failure lowers current transfer label without erasing history',()=>{
 const records=[seed('a','s1','office'),seed('b','s2','travel'),
   seed('c','s3','family',{assessment:'needs_support'})];
 const v=summarizeCompetency(records,competency.id,competency);
 assert.equal(v.status,'supported');assert.equal(v.evidence_count,3);assert.equal(v.contexts,2);
});
test('selection does not unlock oral prerequisites using only typed text',()=>{
 const graph=[competency,{id:'ORAL-NEXT',can_do:'Participate in oral dialogue',
 dependencies:['SPK-COMM'],priority:5}];
 const rows=rankLearningPriorities({competencies:graph,attempts:[seed('a','s1','office',
   {observed_modality:'typed_text'})],nowIso:'2026-01-01T00:00:00Z'});
 assert.equal(rows.find(x=>x.competency_id==='ORAL-NEXT').blocked,true);
});
test('review of summary-only row cannot quietly alter saved answer',()=>{
 const state=createLearnerState({learnerId:'fake',targetLanguage:'English'});
 state.competencies=[competency];
 const a=seed('id','s1','office');
 const row=encodeAttemptRow(a,{privacyMode:'summary_only',summary:'Produced a communicative explanation'});
 const restored=decodeAttemptRow(row);
 assert.equal('answer' in restored,false);
 assert.equal(restored.answer_summary,'Produced a communicative explanation');
 assert.equal(restored.observed_modality,'spoken_audio');
 const loaded={...state,attempts:[restored]};
 const next=applyAttempt(loaded,a);
 assert.equal(next.status,'duplicate_unverified');
 assert.equal(next.state.attempts.length,1);
});
test('privacy-safe row never reconstructs verbatim learner answer',()=>{
 const a=seed('id','s1','office');
 const serialized=JSON.stringify(encodeAttemptRow(a,{privacyMode:'summary_only',summary:'Talked about responsibilities'}));
 assert.equal(serialized.includes(a.answer),false);
});
test('codec rejects unexpected columns',()=>{
 const row=encodeAttemptRow(seed('a','s1','office'),{privacyMode:'raw'});
 assert.throws(()=>decodeAttemptRow(row,[...ATTEMPT_COLUMNS].reverse()),/schema mismatch/i);
});
test('full replay identity rejects changed rubric result',()=>{
 const state=createLearnerState({learnerId:'fake',targetLanguage:'English'});
 state.competencies=[competency];
 const a=seed('id','s1','office');
 const prior=applyAttempt(state,a).state;
 assert.throws(()=>applyAttempt(prior,{...a,assessment:'partial'}),/collision/);
});
test('JSON unknown storage path is rejected',()=>{
 const p={session_id:'S',lesson_id:'L',activity_id:'A',competency_id:'C',
 attempt_id:'A-1',attempt_number:1,hint_level:'none',answer:'I need help',storage_url:'external'};
 assert.throws(()=>decodeSubmission(PREFIX+JSON.stringify(p)),/Unexpected field/);
 assert.throws(()=>validateSubmissionAgainstActivity(p,trusted),/Unexpected field/);
});
test('model-provided activity identity cannot be switched',()=>{
 const p={session_id:'S',lesson_id:'L',activity_id:'A',competency_id:'C',
 attempt_id:'A-1',attempt_number:1,hint_level:'none',answer:'I need help'};
 assert.equal(validateSubmissionAgainstActivity(p,trusted),true);
 assert.throws(()=>validateSubmissionAgainstActivity({...p,attempt_id:'A-2'},trusted),/Attempt ID mismatch/);
});
test('a summary-only restored attempt is valid evidence',()=>{
 const restored=decodeAttemptRow(encodeAttemptRow(seed('id','s1','office'),{
 privacyMode:'summary_only',summary:'Communicated clearly'}));
 assert.equal(validateAttempt(restored,[competency]),true);
});
