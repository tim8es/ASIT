import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLearnerState} from '../src/learning-state.mjs';
import {selectUiPattern,composeLessonUi,validateLessonPresentation,checkObjectiveInput} from '../src/ui-orchestrator.mjs';

const learner=()=>createLearnerState({learnerId:'fictional',targetLanguage:'English'});
test('normal conversation is not turned into a decorative form',()=>{
 assert.equal(selectUiPattern({mode:'conversation'}).kind,'ordinary_chat');
 assert.equal(composeLessonUi({mode:'conversation'}).submit_count,0);
});
test('default lesson is one seven-minute packet with four related task slots',()=>{
 const p=composeLessonUi({learnerState:learner()});
 assert.equal(p.duration_minutes,7);
 assert.equal(p.exercise_count,4);
 assert.equal(p.tasks.length,4);
 assert.deepEqual(p.sections,['topic_and_outcome','grammar_or_language_strategy','practice_form','end_vocabulary']);
 assert.equal(p.submit_count,1);
 assert.ok(new Set(p.tasks.map(x=>x.type)).size>=2);
});
test('learner-owned duration/count allow a longer, larger packet',()=>{
 const s=learner();s.adaptive_profile.lesson_delivery_preference={duration_minutes:18,exercise_count:8};
 const p=composeLessonUi({learnerState:s});
 assert.equal(p.duration_minutes,18);assert.equal(p.tasks.length,8);
 assert.equal(p.submit_count,1);
});
test('choice of control is based on action, with effective novelty',()=>{
 const a=selectUiPattern({action:'recognize'});
 assert.equal(a.operation,'recognition');
 const b=selectUiPattern({action:'recognize',recentTypes:['grammar_contrast']});
 assert.equal(b.type,'matching');
 const c=selectUiPattern({action:'apply'});
 assert.equal(c.operation,'production');
});
test('images are not used without a relevant image',()=>{
 const a=selectUiPattern({action:'recognize',recentTypes:['grammar_contrast','matching']});
 assert.notEqual(a.type,'image_choice');
 const b=selectUiPattern({action:'recognize',recentTypes:['grammar_contrast','matching'],
 capabilities:{hasRelevantImage:true}});
 assert.equal(b.type,'image_choice');
});
test('card ordering has an honest accessible fallback without drag',()=>{
 const p=selectUiPattern({action:'build',recentTypes:['sentence_builder','error_detective']});
 assert.equal(p.type,'card_ordering');assert.equal(p.input,'numbered_or_select_ordering');
 const d=selectUiPattern({action:'build',recentTypes:['sentence_builder','error_detective'],
 capabilities:{drag:true}});
 assert.equal(d.input,'accessible_drag_with_keyboard_fallback');
});
test('speech and listening remain unassessed without actual media',()=>{
 assert.equal(selectUiPattern({action:'speak'}).evidence_modality,'unassessed');
 assert.equal(selectUiPattern({action:'listen'}).kind,'unavailable');
 assert.equal(selectUiPattern({action:'speak',capabilities:{audioCapture:true,audioAccessible:true}}).evidence_modality,'spoken_audio');
 assert.equal(selectUiPattern({action:'listen',capabilities:{audioPlayback:true}}).evidence_modality,'audio_comprehension');
});
test('renderer quality gate rejects incomplete or over-time lesson',()=>{
 const valid={topic:'Clarifying dates',outcome:'Ask about a deadline',grammar:['When will ...?'],
 vocabulary:['deadline'],exercises:[{item_id:'a',prompt:'Ask when a meeting starts'}],
 estimated_minutes:5,submit_count:1};
 assert.equal(validateLessonPresentation(valid,{durationMinutes:7,exerciseCount:1}),true);
 assert.throws(()=>validateLessonPresentation({...valid,estimated_minutes:8},{durationMinutes:7,exerciseCount:1}),/Incomplete/);
 assert.throws(()=>validateLessonPresentation({...valid,vocabulary:[]},{durationMinutes:7,exerciseCount:1}),/Incomplete/);
});

test('real-image typed-word recall is gated by image capability',()=>{
 const without=selectUiPattern({action:'remember',recentTypes:['cloze','vocabulary_retrieval']});
 assert.notEqual(without.type,'image_label');
 const withImage=selectUiPattern({action:'remember',recentTypes:['cloze','vocabulary_retrieval'],
 capabilities:{hasRelevantImage:true}});
 assert.equal(withImage.type,'image_label');
 assert.equal(withImage.evidence_modality,'image_prompted_written_recall');
 assert.match(withImage.input,/real_image_above_text_input/);
});
test('local feedback is objective only; aliases are allowed and open writing deferred',()=>{
 assert.equal(checkObjectiveInput({type:'single_choice',answer:'b',expected:'b'}).status,'correct');
 assert.equal(checkObjectiveInput({type:'single_choice',answer:'a',expected:'b'}).status,'try_again');
 assert.equal(checkObjectiveInput({type:'single_choice',answer:'',expected:'b'}).status,'unanswered');
 assert.equal(checkObjectiveInput({type:'word_order',answer:['one'],expected:['one','two']}).status,'unanswered');
 assert.equal(checkObjectiveInput({type:'word_order',answer:['two','one'],expected:['one','two']}).status,'try_again');
 assert.equal(checkObjectiveInput({type:'word_order',answer:['one','two'],expected:['one','two']}).status,'correct');
 assert.equal(checkObjectiveInput({type:'image_label',answer:' BICYCLE! ',expected:'bike',accepted:['bicycle']}).status,'correct');
 assert.equal(checkObjectiveInput({type:'image_label',answer:'cycle',expected:'bike',accepted:['bicycle']}).status,'deferred');
 assert.equal(checkObjectiveInput({type:'free_production',answer:'My story',expected:'My story'}).status,'deferred');
});
