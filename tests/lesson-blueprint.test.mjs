import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLearnerState} from '../src/learning-state.mjs';
import {allocateSessionMinutes,makeLessonBlueprint,checkBlueprintFresh} from '../src/lesson-blueprint.mjs';
import {describeChange,dueReviews,summarizeLearningProgress} from '../src/analytics.mjs';

function fixture(){
 const state=createLearnerState({learnerId:'fake',targetLanguage:'English',goals:['Everyday interaction'],availableMinutes:8});
 state.competencies=[
  {id:'CLARIFY',can_do:'Ask for clarification',dependencies:[],priority:3},
  {id:'DISCUSS',can_do:'Explain an opinion',dependencies:['CLARIFY'],priority:4}
 ];
 return state;
}
for (const n of [3,5,8,15,20,37,120]) {
 test('allocation exactly fills '+n+' minutes',()=>{
  const steps=allocateSessionMinutes(n);
  assert.equal(steps.reduce((s,x)=>s+x.minutes,0),n);
  assert.ok(steps.every(x=>x.minutes>=1));
 });
}
test('prepared lesson uses goals with unmet prerequisites handled',()=>{
 const s=fixture();const lesson=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(lesson.goal,'CLARIFY');
 assert.equal(lesson.planned_minutes,8);
 assert.equal(checkBlueprintFresh(lesson,s),true);
});
test('changing learner state invalidates prepared lesson',()=>{
 const s=fixture();const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 s.revision++;
 assert.equal(checkBlueprintFresh(b,s),false);
});
test('requested unknown skill fails rather than inventing it',()=>assert.throws(()=>makeLessonBlueprint({
 learnerState:fixture(),nowIso:'2026-06-01T00:00:00Z',requestedCompetencyId:'NOPE'
}),/not in/));
test('progress summary distinguishes unassessed from weak',()=>{
 const s=fixture();const v=summarizeLearningProgress(s);
 assert.equal(v.unassessed_skills,2);assert.equal(v.assessed_skills,0);
});
test('one observation cannot establish growth',()=>{
 const attempts=[{competency_id:'CLARIFY',attempt_id:'a1',session_id:'s1',assessment:'correct',hint_level:'none'}];
 assert.equal(describeChange(attempts,'CLARIFY').signal,'insufficient_data');
});
test('improvement is described as possibility, not fact of mastery',()=>{
 const attempts=[{competency_id:'CLARIFY',attempt_id:'a1',session_id:'s1',assessment:'partial',hint_level:'none'},
 {competency_id:'CLARIFY',attempt_id:'a2',session_id:'s2',assessment:'correct',hint_level:'none'}];
 assert.equal(describeChange(attempts,'CLARIFY').signal,'possible_improvement');
});
test('due reviews use actual current time',()=>{
 const reviews=[{id:'d',due_at:'2026-01-01T00:00:00Z'},{id:'f',due_at:'2027-01-01T00:00:00Z'}];
 assert.deepEqual(dueReviews(reviews,'2026-07-01T00:00:00Z').map(x=>x.id),['d']);
});
