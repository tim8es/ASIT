import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLearnerState} from '../src/learning-state.mjs';
import {allocateSessionMinutes,makeLessonBlueprint,checkBlueprintFresh,resolveLessonSettings} from '../src/lesson-blueprint.mjs';
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

test('seven minutes and four tasks are defaults, not immutable caps',()=>{
 const s=createLearnerState({learnerId:'fictional',targetLanguage:'English'});
 s.competencies=[{id:'C',can_do:'Clarify plans',dependencies:[],priority:3}];
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(b.planned_minutes,7);
 assert.equal(b.exercise_count,4);
 assert.equal(b.submission_mode,'single_form');
 assert.deepEqual(b.lesson_sections,['topic_and_outcome','grammar_or_language_strategy','combined_practice','end_vocabulary']);
});
test('private settings override defaults and a single-lesson choice does not mutate state',()=>{
 const s=fixture();
 s.adaptive_profile.lesson_delivery_preference={duration_minutes:15,exercise_count:8};
 let b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z'});
 assert.equal(b.planned_minutes,15);assert.equal(b.exercise_count,8);
 b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z',minutes:5,exerciseCount:2});
 assert.equal(b.planned_minutes,5);assert.equal(b.exercise_count,2);
 assert.equal(s.adaptive_profile.lesson_delivery_preference.duration_minutes,15);
});
test('existing private duration_limit_minutes remains supported',()=>{
 const s=fixture();s.adaptive_profile.lesson_delivery_preference={duration_limit_minutes:7,exercise_count:5};
 assert.equal(resolveLessonSettings({learnerState:s}).duration_minutes,7);
 assert.equal(resolveLessonSettings({learnerState:s}).exercise_count,5);
});
test('invalid stored settings are rejected instead of silently replaced',()=>{
 const s=fixture();
 assert.throws(()=>resolveLessonSettings({learnerState:s,minutes:0}),/duration/i);
 assert.throws(()=>resolveLessonSettings({learnerState:s,exerciseCount:0}),/Exercise count/);
 assert.throws(()=>resolveLessonSettings({learnerState:s,exerciseCount:13}),/Exercise count/);
});

test('previously saved exercises_per_lesson preference remains active without migration',()=>{
 const s=fixture();
 s.adaptive_profile.lesson_delivery_preference={duration_minutes:7,exercises_per_lesson:5};
 assert.deepEqual(resolveLessonSettings({learnerState:s}),{duration_minutes:7,exercise_count:5});
});

test('remediation and review keep the full configured lesson UX',()=>{
 const s=fixture();
 s.adaptive_profile.lesson_delivery_preference={duration_minutes:7,exercises_per_lesson:5};
 const original=JSON.stringify(s);
 for(const lessonKind of ['new','diagnostic','review','remediation']){
  const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z',lessonKind});
  assert.equal(b.lesson_kind,lessonKind);
  assert.equal(b.exercise_count,5);
  assert.equal(b.planned_minutes,7);
  assert.deepEqual(b.presentation_contract,{all_exercises_visible:true,submit_count:1,feedback:'consolidated'});
  assert.equal(b.submission_mode,'single_form');
 }
 assert.equal(JSON.stringify(s),original,'Universal UI may not mutate learner state');
});
test('a partial result is not an implicit request for a one-question remediation',()=>{
 const s=fixture();
 s.attempts=[{attempt_id:'T',competency_id:'CLARIFY',assessment:'partial',occurred_at:'2026-05-31T00:00:00Z'}];
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z',lessonKind:'remediation'});
 assert.equal(b.exercise_count,4);
 assert.equal(b.presentation_contract.all_exercises_visible,true);
 assert.equal(b.presentation_contract.submit_count,1);
});
test('explicit lesson-level exercise count override is respected in remediation',()=>{
 const s=fixture();
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z',lessonKind:'remediation',exerciseCount:1});
 assert.equal(b.exercise_count,1);
 assert.throws(()=>makeLessonBlueprint({learnerState:s,nowIso:'2026-06-01T00:00:00Z',lessonKind:'unknown'}),/Unsupported lesson kind/);
});
