/**
 * Synthetic acceptance: private v2 state -> native submit event -> assessed
 * consent-aware storage -> readback -> lesson completion -> new chat restore.
 * Tests contracts; does NOT impersonate actual ChatGPT rendering/connectors.
 */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import template from '../templates/tracker-v2.json' with {type:'json'};
import {hydrateWorkbook} from '../src/hydrate-state.mjs';
import {persistAttempt} from '../src/store-gateway.mjs';
import {openLesson,lessonEvent,summarizeLessonRun} from '../src/lesson-journey.mjs';
import {summarizeCompetency} from '../src/learning-state.mjs';
import {makeLessonBlueprint} from '../src/lesson-blueprint.mjs';
import {decodeSubmission,toSubmission,validateSubmissionAgainstActivity} from '../src/protocol.mjs';

function syntheticWorkbook(){
 const book=Object.fromEntries(template.tabs.map(x=>[x.name,[x.columns]]));
 const row=(tab,obj)=>book[tab].push(template.tabs.find(t=>t.name===tab).columns.map(x=>obj[x]??''));
 const config={schema_version:2,state_revision:1,learner_id:'synthetic-qa',target_language:'English',
  recording_consent:'summary_only',preferred_minutes:5};
 for(const [key,v] of Object.entries(config))row('Config',{key,json_value:JSON.stringify(v)});
 row('Goals',{goal_id:'goal-test',description:'Handle a short clarification request',
   priority:3,status:'active'});
 row('Competencies',{competency_id:'comm-test',can_do:'Ask for repetition in a text exchange',
   dependency_ids_json:'[]',priority:3,status:'unassessed',
   required_modality:'typed_text',required_operation:'production'});
 row('Plans',{plan_id:'plan-v1',revision:1,goal_ids_json:'["goal-test"]',
   competency_ids_json:'["comm-test"]',rationale:'Fictional communicative goal',status:'active'});
 for(const [id,prompt] of [['a1','Ask someone to repeat a word politely.'],
   ['a2','Ask for clarification about a changed meeting time.']]){
  row('Activities',{activity_id:id,lesson_id:'lesson',session_id:'session',
   competency_id:'comm-test',activity_type:'free_production',prompt,
   rubric_json:JSON.stringify({meaning:'polite clarification',form:'complete request'}),
   status:'ready',observed_modality:'typed_text',observed_operation:'production'});
 }
 return {book,row};
}
function storage(book){
 let writes=0;
 return {
  readAttemptHeaders:async()=>book.Attempts[0],
  findAttemptsById:async id=>book.Attempts.slice(1).filter(row=>row[0]===id),
  appendAttemptRow:async row=>{writes++;book.Attempts.push([...row]);},
  get writes(){return writes;}
 };
}
const spec=(activity_id,kind='independent_task')=>({
 activity_id,competency_id:'comm-test',kind,ui_pattern:'free_response',
 prompt:activity_id==='a1'?'Ask someone to repeat a word politely.':'Ask for clarification about a changed meeting time.',
 rubric:{meaning:'polite clarification',form:'complete request'},
 modality:'typed_text',operation:'production'
});
function attempt(activity_id,id,answer){
 return {attempt_id:id,session_id:'session',lesson_id:'lesson',activity_id,
  competency_id:'comm-test',answer,attempt_number:1,hint_level:'none',
  assessment:'correct',rubric_rationale:'Complete polite request.',
  observed_modality:'typed_text',observed_operation:'production'};
}
test('MLP: first session, consented evidence and cross-chat restoration',async()=>{
 const {book,row}=syntheticWorkbook(),adapter=storage(book);
 const before=hydrateWorkbook(book);
 assert.equal(before.attempts.length,0);
 assert.equal(before.profile.goals.length,1);
 assert.equal(makeLessonBlueprint({learnerState:before,nowIso:'2026-10-15T11:00:00Z'}).goal,'comm-test');
 let run=openLesson({session_id:'session',lesson_id:'lesson',competency_id:'comm-test',
  state_revision:1,steps:[spec('a1'),spec('a2','transfer')]});
 const ids=[];
 for(const [aid,id,text] of [['a1','attempt-1','Could you say that again?'],
  ['a2','attempt-2','Could you clarify the meeting time?']]){
  const envelope=toSubmission({sessionId:'session',lessonId:'lesson',activityId:aid,
   competencyId:'comm-test',attemptId:id,answer:text});
  const trusted={session_id:'session',lesson_id:'lesson',activity_id:aid,
   competency_id:'comm-test',next_attempt_number:1,expected_attempt_id:id};
  const submitted=decodeSubmission(envelope);
  assert.equal(validateSubmissionAgainstActivity(submitted,trusted),true);
  run=lessonEvent(run,{type:'present',activity_id:aid});
  run=lessonEvent(run,{type:'submit',activity_id:aid,attempt_id:id});
  run=lessonEvent(run,{type:'assess',activity_id:aid,attempt_id:id,
   assessment:'correct',feedback:'Communicates politely.'});
  const record=attempt(aid,id,text);
  const written=await persistAttempt({adapter,attempt:record,privacyMode:'summary_only',
   summary:'Produced a fictional polite clarification request',consentGranted:true});
  assert.equal(written.status,'saved');
  run=lessonEvent(run,{type:'persistence',activity_id:aid,attempt_id:id,
   result:'saved',verified:written.verified});
  run=lessonEvent(run,{type:'feedback',activity_id:aid,text:'Try a new situation.'});
  run=lessonEvent(run,{type:'advance',activity_id:aid});
  ids.push(id);
 }
 row('Sessions',{session_id:'session',attempt_ids_json:JSON.stringify(ids),
  summary:'Fictional two-step practice',next_step:'Revisit on another day'});
 assert.equal(summarizeLessonRun(run).can_claim_full_completion,true);
 assert.equal(adapter.writes,2);
 const resumed=hydrateWorkbook(JSON.parse(JSON.stringify(book)));
 assert.equal(resumed.source.restored,true);
 assert.equal(resumed.attempts.length,2);
 assert.equal(resumed.attempts[0].answer_summary,'Produced a fictional polite clarification request');
 assert.equal('answer' in resumed.attempts[0],false);
 assert.equal(resumed.activities.length,2);
 assert.equal(resumed.sessions[0].attempt_ids.length,2);
 assert.equal(resumed.competencies[0].required_operation,'production');
 // Same-session success does not establish cross-session transfer.
 assert.notEqual(summarizeCompetency(resumed.attempts,'comm-test',resumed.competencies[0]).status,'transferable');
});
test('MLP: without storage consent no evidence is written',async()=>{
 const {book}=syntheticWorkbook(),adapter=storage(book);
 await assert.rejects(persistAttempt({adapter,attempt:attempt('a1','not-saved','Can you repeat?'),
  privacyMode:'summary_only',summary:'Fictional summary',consentGranted:false}),/consent/);
 assert.equal(book.Attempts.length,1);
});
