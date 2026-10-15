import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LEARNING_ACTIONS,compactPatternIndex,chooseUI,planLessonUI} from '../src/ui-orchestrator.mjs';

test('UI action vocabulary is the pedagogical operation set',()=>{
 assert.deepEqual([...LEARNING_ACTIONS],['recall','recognize','construct','explain','apply']);
 assert.ok(compactPatternIndex.every(p=>p.recipe.startsWith('ui/patterns/')&&p.recipe.endsWith('.md')));
});
test('ordinary conversation and short direct answer need no form',()=>{
 assert.equal(chooseUI({mode:'free_conversation'}).surface,'chat');
 assert.equal(chooseUI({mode:'direct_answer'}).surface,'text');
});
test('recall grammar produces meaningful cloze selection',()=>{
 const ui=chooseUI({action:'recall',operation:'production',modality:'typed_text'});
 assert.equal(ui.pattern,'cloze');
 assert.equal(ui.observed_modality,'typed_text');
 assert.equal(ui.can_assess_requested_modality,true);
});
test('pattern repetition penalty rotates a compatible exercise',()=>{
 const q={action:'recall',operation:'production',modality:'typed_text'};
 assert.equal(chooseUI(q).pattern,'cloze');
 assert.equal(chooseUI({...q,recentPatterns:['cloze','cloze','cloze']}).pattern,'free_response');
});
test('drag or card sorting is never a dependency without capability',()=>{
 const q={action:'construct',operation:'production',modality:'typed_text'};
 const ui=chooseUI(q);
 assert.equal(ui.pattern,'sentence_builder');
 assert.notEqual(ui.pattern,'card_ordering');
});
test('image tasks require both image capability and grounded image',()=>{
 const q={action:'recognize',operation:'comprehension',modality:'reading_text'};
 const without=chooseUI({...q,capabilities:{image:true},allowImages:false});
 assert.notEqual(without.pattern,'image_choice');
 const withImage=chooseUI({...q,capabilities:{image:true},allowImages:true,
   recentPatterns:['meaning_choice','meaning_choice']});
 assert.equal(withImage.pattern,'image_choice');
});
test('missing real audio must never generate speaking or listening assessment',()=>{
 for(const modality of ['spoken_audio','audio_comprehension']){
  const ui=chooseUI({action:modality==='spoken_audio'?'apply':'recognize',
    operation:modality==='spoken_audio'?'production':'comprehension',
    modality,capabilities:{}});
  assert.equal(ui.surface,'fallback');
  assert.equal(ui.observed_modality,'typed_text');
  assert.equal(ui.can_assess_requested_modality,false);
 }
});
test('supported audio preserves requested modality',()=>{
 const ui=chooseUI({action:'apply',operation:'production',modality:'spoken_audio',capabilities:{audio:true}});
 assert.equal(ui.pattern,'spoken_turn');
 assert.equal(ui.observed_modality,'spoken_audio');
});
test('bad or unsupported operations do not fabricate evidence',()=>{
 assert.throws(()=>chooseUI({action:'paint',operation:'recognition'}),/Unknown learning action/);
 assert.throws(()=>chooseUI({action:'apply',operation:'magic'}),/Invalid operation/);
});
test('default-sized lesson plan is one-submit and ordered',()=>{
 const tasks=[
  {action:'recognize',operation:'recognition',modality:'typed_text'},
  {action:'recall',operation:'production',modality:'typed_text'},
  {action:'construct',operation:'production',modality:'typed_text'},
  {action:'apply',operation:'interaction',modality:'typed_text'}
 ];
 const p=planLessonUI({tasks,minutes:7,maxItems:5});
 assert.equal(p.planned_minutes,7);
 assert.equal(p.one_submit,true);
 assert.ok(p.items.length>=2&&p.items.length<=5);
 assert.equal(p.section_order.at(-2),'vocabulary_recap');
 assert.ok(p.recipe_paths.every(x=>x.startsWith('ui/patterns/')));
});
test('tiny budget reduces activity count instead of claiming more time',()=>{
 const tasks=Array.from({length:5},()=>({action:'recall',operation:'production',modality:'typed_text'}));
 const p=planLessonUI({tasks,minutes:4,maxItems:5});
 assert.ok(p.items.length<=2);
 const longer=planLessonUI({tasks,minutes:8,maxItems:6});
 assert.equal(longer.planned_minutes,8);
 assert.throws(()=>planLessonUI({tasks,minutes:121}),/between 3 and 120/);
 assert.throws(()=>planLessonUI({tasks,minutes:5,maxItems:21}),/between 1 and 20/);
});
test('UI Orchestrator uses the saved learner duration and exercise preferences',()=>{
 const learnerState={profile:{preferences:{lesson_duration_minutes:15,exercises_per_lesson:8}}};
 const tasks=Array.from({length:10},()=>({action:'recognize',operation:'recognition',modality:'typed_text'}));
 const result=planLessonUI({tasks,learnerState});
 assert.equal(result.planned_minutes,15);
 assert.equal(result.requested_exercises,8);
 assert.equal(result.items.length,8);
 assert.equal(result.one_submit,true);
});
test('a one-time duration override supersedes a saved duration without modifying it',()=>{
 const learnerState={profile:{preferences:{lesson_duration_minutes:14,exercises_per_lesson:4}}};
 const tasks=Array.from({length:6},()=>({action:'recall',operation:'production',modality:'typed_text'}));
 const result=planLessonUI({tasks,learnerState,minutes:5});
 assert.equal(result.planned_minutes,5);
 assert.ok(result.items.length<=3);
 assert.equal(learnerState.profile.preferences.lesson_duration_minutes,14);
});
test('lesson with unsupported long task stops rather than overpromising',()=>{
 assert.throws(()=>planLessonUI({tasks:[{action:'apply',operation:'interaction',modality:'typed_text'}],minutes:3}),/No task fits/);
});
