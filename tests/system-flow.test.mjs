import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLearnerState,applyAttempt,summarizeCompetency,scheduleReview} from '../src/learning-state.mjs';
import {makeLessonBlueprint,checkBlueprintFresh} from '../src/lesson-blueprint.mjs';
import {encodeAttemptRow} from '../src/storage-contract.mjs';
import {selectNextLearningGoal} from '../src/planner.mjs';

const now='2026-01-10T00:00:00Z';
function newSyntheticLearner(){
 const s=createLearnerState({learnerId:'synthetic-only',targetLanguage:'English',goals:['Everyday communication'],availableMinutes:5});
 s.competencies=[
  {id:'ASK',can_do:'Ask politely for clarification',dependencies:[],contexts:['informal','travel'],priority:4},
  {id:'NEGOTIATE',can_do:'Discuss preferences and compromises',dependencies:['ASK'],contexts:['travel'],priority:5}
 ];
 return s;
}
const evidence=(id,sess,act,assessment,hint='none')=>({
 attempt_id:id,session_id:sess,lesson_id:'lesson-'+sess,activity_id:act,
 competency_id:'ASK',answer:'Synthetic learner answer for evaluation only',
 assessment,hint_level:hint,attempt_number:1,context_id:act
});
test('synthetic lifecycle never initializes learner achievements',()=>{
 const initial=newSyntheticLearner();
 assert.equal(initial.attempts.length,0);
 assert.equal(summarizeCompetency(initial.attempts,'ASK').status,'unassessed');
 const lesson=makeLessonBlueprint({learnerState:initial,nowIso:now});
 assert.equal(lesson.goal,'ASK');assert.equal(lesson.planned_minutes,5);
 assert.equal(checkBlueprintFresh(lesson,initial),true);
});
test('first weak response schedules review without artificial mastery',()=>{
 let s=newSyntheticLearner();
 s=applyAttempt(s,evidence('a1','s1','first','partial')).state;
 assert.equal(summarizeCompetency(s.attempts,'ASK').status,'supported');
 assert.equal(scheduleReview({outcome:'partial',nowIso:now}),'2026-01-11T00:00:00.000Z');
 const next=makeLessonBlueprint({learnerState:s,nowIso:now});
 assert.equal(next.goal,'ASK');
});
test('supported skill becomes transferable only across unaided sessions',()=>{
 let s=newSyntheticLearner();
 s=applyAttempt(s,evidence('a1','s1','first','partial')).state;
 s=applyAttempt(s,evidence('a2','s1','practice','correct','frame')).state;
 assert.equal(summarizeCompetency(s.attempts,'ASK').status,'supported');
 s=applyAttempt(s,evidence('a3','s2','travel','correct')).state;
 assert.equal(summarizeCompetency(s.attempts,'ASK').status,'independent');
 s=applyAttempt(s,evidence('a4','s3','informal','correct')).state;
 assert.equal(summarizeCompetency(s.attempts,'ASK').status,'transferable');
 const next=selectNextLearningGoal({competencies:s.competencies,attempts:s.attempts,nowIso:now});
 assert.equal(next.competency_id,'NEGOTIATE');
});
test('consented summary-only roundtrip never persists fictional answer',()=>{
 let s=newSyntheticLearner();
 const a=evidence('a1','s1','first','partial');
 s=applyAttempt(s,a).state;
 const row=encodeAttemptRow(s.attempts[0],{privacyMode:'summary_only',summary:'Responded partially to a request task'});
 assert.equal(row[7],'Responded partially to a request task');
 assert.equal(row.includes(a.answer),false);
 const restored=JSON.parse(JSON.stringify(s));
 assert.equal(restored.attempts.length,1);
 assert.equal(applyAttempt(restored,a).status,'duplicate');
});
