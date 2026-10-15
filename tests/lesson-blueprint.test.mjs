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
test('prepared lesson uses learner duration and system exercise defaults',()=>{
 const s=fixture();const lesson=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(lesson.goal,'CLARIFY');
 assert.equal(lesson.planned_minutes,8);
 assert.equal(lesson.exercise_count,5);
 assert.equal(lesson.lesson_setting_source.duration,'learner_state');
 assert.equal(lesson.lesson_setting_source.exercises,'default');
 assert.deepEqual(lesson.required_visible_sections,['topic_and_objective','grammar_or_language_rule','practice_form','vocabulary_recap','single_submit']);
 assert.equal(checkBlueprintFresh(lesson,s),true);
});
test('short learner preference reduces item count and respects duration',()=>{
 const s=fixture();s.profile.available_minutes=4;s.profile.preferences.exercises_per_lesson=5;
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(b.planned_minutes,4);
 assert.equal(b.exercise_count,2);
});
test('explicit one-off duration can exceed the seven-minute default',()=>{
 const b=makeLessonBlueprint({learnerState:fixture(),nowIso:'2026-06-01T00:00:00Z',minutes:18});
 assert.equal(b.planned_minutes,18);
 assert.equal(b.lesson_setting_source.duration,'session_override');
});
test('learner-selected exercise count is honored up to five',()=>{
 const s=fixture();s.profile.preferences.exercises_per_lesson=5;
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(b.exercise_count,5);
});
test('learner may select more than five exercises for a longer lesson',()=>{
 const s=fixture();s.profile.available_minutes=15;s.profile.preferences.exercises_per_lesson=8;
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(b.planned_minutes,15);
 assert.equal(b.exercise_count,8);
});
test('invalid exercise preference is rejected',()=>{
 const s=fixture();s.profile.preferences.exercises_per_lesson=21;
 assert.throws(()=>makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'}),/1 and 20|between 1 and 20/);
});
test('duration too short for a structured mini-lesson is rejected',()=>{
 assert.throws(()=>makeLessonBlueprint({learnerState:fixture(),nowIso:'2026-06-01T00:00:00Z',minutes:2}),/at least 3/);
});
test('unconfigured learner receives seven-minute, five-task defaults',()=>{
 const s=fixture();s.profile.available_minutes=null;
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(b.planned_minutes,7);
 assert.equal(b.exercise_count,5);
 assert.deepEqual(b.lesson_setting_source,{duration:'default',exercises:'default'});
});
test('adaptive_profile settings persist across planning and remain private input',()=>{
 const s=fixture();s.profile.available_minutes=null;
 s.adaptive_profile.lesson_delivery_preference={duration_minutes:12,exercises_per_lesson:7};
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(b.planned_minutes,12);
 assert.equal(b.exercise_count,7);
 assert.equal(b.lesson_setting_source.duration,'learner_state');
 assert.equal(b.lesson_setting_source.exercises,'learner_state');
});
test('per-session duration overrides do not mutate saved user preferences',()=>{
 const s=fixture();
 s.profile.available_minutes=15;s.profile.preferences.exercises_per_lesson=7;
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z',minutes:5});
 assert.equal(b.planned_minutes,5);assert.equal(b.exercise_count,3);
 assert.equal(s.profile.available_minutes,15);
 assert.equal(s.profile.preferences.exercises_per_lesson,7);
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
