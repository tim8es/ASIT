import {test} from 'node:test';
import assert from 'node:assert/strict';
import {openLesson,lessonEvent,summarizeLessonRun,suggestedPattern} from '../src/lesson-journey.mjs';
const activity=(id,kind='independent_task')=>({
 activity_id:id,kind,competency_id:'SYN-C',ui_pattern:'free_response',
 prompt:'Synthetic instruction with a real communicative outcome.',
 rubric:{meaning:'communicates intention',language:'clear sentence'},
 modality:'typed_text',operation:'production'
});
const lesson=()=>openLesson({session_id:'S',lesson_id:'L',competency_id:'SYN-C',state_revision:2,
 steps:[activity('A1'),activity('A2','transfer')]});
test('new sessions begin with no mastery, attempts or saved evidence',()=>{
 const s=lesson(),v=summarizeLessonRun(s);
 assert.equal(v.verified_writes,0);assert.equal(v.can_claim_full_completion,false);
 assert.equal(v.learning_mastery_claim,false);
});
test('attempt must follow presentation',()=>{
 assert.throws(()=>lessonEvent(lesson(),{type:'submit',activity_id:'A1',attempt_id:'X'}),/Illegal transition/);
});
test('assessment must follow an actual submission',()=>{
 const a=lessonEvent(lesson(),{type:'present',activity_id:'A1'});
 assert.throws(()=>lessonEvent(a,{type:'assess',activity_id:'A1',assessment:'correct'}),/Illegal transition/);
});
test('save cannot be claimed without verified readback',()=>{
 let s=lessonEvent(lesson(),{type:'present',activity_id:'A1'});
 s=lessonEvent(s,{type:'submit',activity_id:'A1',attempt_id:'T1'});
 s=lessonEvent(s,{type:'assess',activity_id:'A1',attempt_id:'T1',assessment:'partial',feedback:'Needs a complete sentence'});
 assert.throws(()=>lessonEvent(s,{type:'persistence',activity_id:'A1',attempt_id:'T1',verified:true,result:'failed'}),/verified write/);
 const fail=lessonEvent(s,{type:'persistence',activity_id:'A1',attempt_id:'T1',verified:false});
 assert.equal(summarizeLessonRun(fail).verified_writes,0);
 assert.equal(summarizeLessonRun(fail).unverified_writes,1);
});
test('full lesson includes two completed tasks and verified evidence only after storage confirmation',()=>{
 let s=lesson();
 for(const [act,id] of [['A1','T1'],['A2','T2']]){
  s=lessonEvent(s,{type:'present',activity_id:act});
  s=lessonEvent(s,{type:'submit',activity_id:act,attempt_id:id});
  s=lessonEvent(s,{type:'assess',activity_id:act,attempt_id:id,assessment:'correct'});
  s=lessonEvent(s,{type:'persistence',activity_id:act,attempt_id:id,verified:true,result:'saved'});
  s=lessonEvent(s,{type:'feedback',activity_id:act,text:'Now transfer this skill to another context.'});
  s=lessonEvent(s,{type:'advance',activity_id:act});
 }
 const v=summarizeLessonRun(s);
 assert.equal(v.verified_writes,2);
 assert.equal(v.completed_steps,2);
 assert.equal(v.can_claim_full_completion,true);
 assert.equal(v.learning_mastery_claim,false);
});
test('offline continuation is usable but never reports persisted',()=>{
 let s=lessonEvent(lesson(),{type:'present',activity_id:'A1'});
 s=lessonEvent(s,{type:'submit',activity_id:'A1',attempt_id:'T1'});
 s=lessonEvent(s,{type:'assess',activity_id:'A1',attempt_id:'T1',assessment:'partial'});
 s=lessonEvent(s,{type:'no_storage',activity_id:'A1'});
 s=lessonEvent(s,{type:'feedback',activity_id:'A1',text:'Try that sentence again.'});
 assert.equal(summarizeLessonRun(s).verified_writes,0);
});
test('early end is partial even after some completed work',()=>{
 let s=lessonEvent(lesson(),{type:'stop_early'});
 assert.equal(s.completion,'partial');
 assert.equal(summarizeLessonRun(s).can_claim_full_completion,false);
});
test('short sessions and conversational sessions are different, never random',()=>{
 assert.deepEqual(suggestedPattern({minutes:5}),['retrieval','independent_task','feedback_retry']);
 assert.deepEqual(suggestedPattern({requestedMode:'conversation'}),['dialogue_turn','dialogue_turn','feedback_retry']);
});
test('duplicate activity ID rejected',()=>{
 assert.throws(()=>openLesson({session_id:'S',lesson_id:'L',competency_id:'SYN-C',state_revision:2,
 steps:[activity('A1'),activity('A1')]}),/Duplicate/);
});
test('a recognition-only exercise cannot be labelled independent communication',()=>{
 const a=activity('A1');a.operation='recognition';
 assert.throws(()=>openLesson({session_id:'S',lesson_id:'L',competency_id:'SYN-C',state_revision:2,
 steps:[a,activity('A2')]}),/Recognition-only/);
});
