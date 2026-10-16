import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLearnerState} from '../src/learning-state.mjs';
import {selectUiPattern,composeLessonUi,validateLessonPresentation,checkObjectiveInput,summarizeLessonCompletion,UI_CANDIDATES,summarizePracticeProvenance,summarizeDialogueTurns} from '../src/ui-orchestrator.mjs';

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

test('empty mandatory final report makes 4-of-5 lesson incomplete, not four-of-four completed',()=>{
 const exercises=Array.from({length:5},(_,i)=>({item_id:'q'+(i+1)}));
 const answers={q1:'under',q2:'2350',q3:{selected_ids:['maya','opened','locker','midnight']},q4:'key',q5:''};
 const s=summarizeLessonCompletion({exercises,answers});
 assert.equal(s.answered_count,4);
 assert.equal(s.total_count,5);
 assert.deepEqual(s.required_unanswered_ids,['q5']);
 assert.equal(s.status,'incomplete');
 assert.equal(s.final_scene_unlocked,false);
 assert.deepEqual(s.unanswered_item_ids,['q5']);
 const full=summarizeLessonCompletion({exercises,answers:{...answers,q5:'I found a suitcase.'}});
 assert.equal(full.status,'completed');
 assert.equal(full.final_scene_unlocked,true);
});
test('optional questions can remain blank without blocking required completion',()=>{
 const s=summarizeLessonCompletion({exercises:[{item_id:'a'},{item_id:'b',required:false}],
 answers:{a:'complete',b:'  '}});
 assert.equal(s.status,'completed');
 assert.deepEqual(s.unanswered_item_ids,['b']);
});
test('blank card order does not count as an answered question',()=>{
 const s=summarizeLessonCompletion({exercises:[{item_id:'a'}],answers:{a:{selected_ids:[]}}});
 assert.equal(s.answered_count,0);
 assert.equal(s.status,'incomplete');
});
test('coverage summary rejects fabricated duplicate task IDs',()=>{
 assert.throws(()=>summarizeLessonCompletion({exercises:[{item_id:'a'},{item_id:'a'}],answers:{a:'x'}}),/Invalid trusted/);
});


test('catalog has 18 unique registered patterns and separates read-only progress from practice',async()=>{
 const {default:manifest}=await import('../ui/patterns.json',{with:{type:'json'}});
 const types=manifest.patterns.map(x=>x.type);
 assert.equal(types.length,18);assert.equal(new Set(types).size,18);
 assert.ok(types.includes('reading_comprehension'));
 assert.ok(types.includes('timeline_ordering'));
 assert.ok(types.includes('image_hotspot'));
 assert.equal(types.filter(x=>x==='progress_explorer').length,1);
 for(const candidate of UI_CANDIDATES)assert.ok(types.includes(candidate.type));
});
test('reading comprehension is text evidence, not listening',()=>{
 const p=selectUiPattern({requestedType:'reading_comprehension'});
 assert.equal(p.type,'reading_comprehension');
 assert.equal(p.operation,'text_comprehension');
 assert.equal(p.evidence_modality,'reading_comprehension');
 assert.match(p.input,/actual_reading_passage/);
});
test('event timeline uses clickable accessible ordered events',()=>{
 const p=selectUiPattern({requestedType:'timeline_ordering'});
 assert.equal(p.operation,'event_sequence_reconstruction');
 assert.match(p.input,/undo_and_keyboard_fallback/);
 assert.equal(checkObjectiveInput({type:'timeline_ordering',answer:['b','a'],expected:['a','b']}).status,'try_again');
 assert.equal(checkObjectiveInput({type:'timeline_ordering',answer:['a','b'],expected:['a','b']}).status,'correct');
 assert.equal(checkObjectiveInput({type:'timeline_ordering',answer:['a'],expected:['a','b']}).status,'unanswered');
});
test('image hotspot never fakes a click or visual capability',()=>{
 const unavailable=selectUiPattern({requestedType:'image_hotspot'});
 assert.equal(unavailable.kind,'unavailable');
 assert.equal(unavailable.evidence_modality,'unassessed');
 assert.equal(unavailable.fallback,'text_based_recognition');
 const noHotspot=selectUiPattern({requestedType:'image_hotspot',capabilities:{hasRelevantImage:true}});
 assert.equal(noHotspot.kind,'unavailable');
 assert.equal(noHotspot.fallback,'image_choice');
 const enabled=selectUiPattern({requestedType:'image_hotspot',
 capabilities:{hasRelevantImage:true,hasInteractiveImageRegions:true}});
 assert.equal(enabled.evidence_modality,'visual_region_recognition');
 assert.match(enabled.input,/accessible_clickable_regions/);
 assert.equal(checkObjectiveInput({type:'image_hotspot',answer:'window',expected:'window'}).status,'correct');
 assert.equal(checkObjectiveInput({type:'image_hotspot',answer:'roof',expected:'window'}).status,'try_again');
 assert.equal(checkObjectiveInput({type:'image_hotspot',answer:'x',expected:undefined}).status,'deferred');
});
test('specifically requested sentence builder differs from ordinary word card ordering',()=>{
 const a=selectUiPattern({requestedType:'sentence_builder'});
 const b=selectUiPattern({requestedType:'card_ordering'});
 assert.match(a.input,/semantic_chunk/);
 assert.match(b.input,/numbered_or_select_ordering/);
 assert.throws(()=>selectUiPattern({action:'read',requestedType:'timeline_ordering'}),/does not match/);
 assert.throws(()=>selectUiPattern({requestedType:'unknown_pattern'}),/Unknown exercise/);
});
test('a single dialogue reply is not assessed as sustained multi-turn interaction',()=>{
 const p=selectUiPattern({requestedType:'dialogue'});
 assert.equal(p.interaction_mode,'chat_turns');
 const one=summarizeDialogueTurns({turns:[{teacher_prompt:'What happened?',learner_response:'The lights went out.'}]});
 assert.equal(one.status,'insufficient_interaction');
 assert.equal(one.fluency_or_pronunciation_assessed,false);
 const two=summarizeDialogueTurns({turns:[
 {teacher_prompt:'What happened?',learner_response:'The lights went out.'},
 {teacher_prompt:'When?',learner_response:'At eight.'}
 ]});
 assert.equal(two.status,'ready_for_teacher_review');
 assert.equal(two.teacher_assessment_required,true);
});
test('first-attempt UI reports never become automatic mastery claims',()=>{
 const a=summarizePracticeProvenance({firstResponse:'wrong',finalResponse:'correct',revisionCount:1,hintLevel:1});
 assert.equal(a.provisional_support_status,'assisted_or_revised');
 assert.equal(a.mastery_claim,false);
 const b=summarizePracticeProvenance({firstResponse:'correct',finalResponse:'correct'});
 assert.equal(b.provisional_support_status,'first_try_reported');
 assert.equal(b.trusted_rubric_verification_required,true);
 assert.equal(summarizePracticeProvenance().provisional_support_status,'unknown');
 assert.throws(()=>summarizePracticeProvenance({revisionCount:-1}),/Invalid provisional/);
});

test('composite task coverage requires all specified fields, not a half completed decision',()=>{
 const x=summarizeLessonCompletion({
 exercises:[{item_id:'decision',required_fields:['choice','reason']},
 {item_id:'match',expected_count:3},{item_id:'order',expected_count:4}],
 answers:{decision:{choice:'safe',reason:' '},match:['one','','three'],order:{selected_ids:['a','b']}}
 });
 assert.equal(x.answered_count,0);
 assert.equal(x.status,'incomplete');
 assert.deepEqual(x.required_unanswered_ids,['decision','match','order']);
 const y=summarizeLessonCompletion({
 exercises:[{item_id:'decision',required_fields:['choice','reason']},{item_id:'vote'}],
 answers:{decision:{choice:'safe',reason:'Explain why'},vote:false}
 });
 assert.equal(y.answered_count,2);assert.equal(y.status,'completed');
});

test('progress explorer is read-only and requires verified private evidence',()=>{
 const missing=selectUiPattern({requestedType:'progress_explorer'});
 assert.equal(missing.kind,'unavailable');
 assert.equal(missing.submit_count,0);
 const known=selectUiPattern({requestedType:'progress_explorer',
   capabilities:{hasVerifiedLearnerProgress:true}});
 assert.equal(known.kind,'read_only');
 assert.equal(known.submit_count,0);
 assert.equal(known.evidence_modality,'not_assessed');
});
test('every registered catalog type is either renderable or truthfully capability-gated',async()=>{
 const {default:manifest}=await import('../ui/patterns.json',{with:{type:'json'}});
 const gated=new Set(['image_label','image_choice','image_hotspot','listening','spoken_response','progress_explorer']);
 for(const p of manifest.patterns){
   const ui=selectUiPattern({requestedType:p.type});
   if(gated.has(p.type))assert.equal(ui.kind,'unavailable',p.type);
   else assert.equal(ui.type,p.type,p.type);
 }
});

test('timeline permits alternative trusted chronologies and defers ambiguous rubric',()=>{
 const caseData={type:'timeline_ordering',answer:['b','a','c'],
 expected:['a','b','c'],accepted:[['b','a','c']]};
 assert.equal(checkObjectiveInput(caseData).status,'correct');
 assert.equal(checkObjectiveInput({type:'timeline_ordering',
  answer:['b','a'],expected:null}).status,'deferred');
});

test('same-chat native Voice explicitly hands off to platform activation, not fake audio',()=>{
 const p=selectUiPattern({requestedType:'listening',delivery:'native_voice',
 capabilities:{voiceUiAvailable:true}});
 assert.equal(p.kind,'voice_handoff');
 assert.equal(p.voice.status,'requires_manual_voice_activation');
 assert.equal(p.voice.opened_voice_programmatically,false);
 const unavailable=selectUiPattern({requestedType:'listening',delivery:'native_voice'});
 assert.equal(unavailable.kind,'unavailable');
});
test('native Voice route tracks actual audible prompt, not button presence',()=>{
 const pending=selectUiPattern({requestedType:'listening',delivery:'native_voice',
 capabilities:{voiceUiAvailable:true,voiceActivated:true}});
 assert.equal(pending.kind,'voice_session');
 assert.equal(pending.voice.status,'awaiting_actual_audio');
 assert.equal(pending.voice.listening_evidence,'not_assessed');
 const live=selectUiPattern({requestedType:'listening',delivery:'native_voice',
 capabilities:{voiceUiAvailable:true,voiceActivated:true,assistantAudioAudible:true}});
 assert.equal(live.voice.status,'ready_for_voice_exchange');
 assert.equal(live.voice.listening_evidence,'pending_actual_response');
});
test('native Voice dialog is multi-turn and microphone cannot be opened by lesson card',()=>{
 const p=selectUiPattern({requestedType:'dialogue',delivery:'native_voice',
 capabilities:{voiceUiAvailable:true,voiceActivated:true}});
 assert.equal(p.kind,'voice_session');
 assert.equal(p.interaction_mode,'chat_turns');
 assert.equal(p.voice.opened_voice_programmatically,false);
 assert.equal(p.voice.pronunciation_evidence,'not_assessed');
 assert.throws(()=>selectUiPattern({requestedType:'cloze',delivery:'native_voice'}),/requires listening/);
});

test('real audio card delivery is separate from platform Voice and cannot fake a player',()=>{
 const questions=[{id:'q',type:'single_choice',prompt:'What did you hear?',expected:'train'}];
 const unavailable=selectUiPattern({requestedType:'listening',delivery:'audio_card',
 capabilities:{audioPlayback:false},audioCard:{
 trustedAudioAsset:{uri:'asset',mime_type:'audio/mpeg',verified:true},
 trustedQuestions:questions}});
 assert.equal(unavailable.kind,'unavailable');
 assert.equal(unavailable.evidence_modality,'unassessed');
 const available=selectUiPattern({requestedType:'listening',delivery:'audio_card',
 capabilities:{audioPlayback:true},audioCard:{
 trustedAudioAsset:{uri:'asset',mime_type:'audio/mpeg',verified:true},
 trustedQuestions:questions}});
 assert.equal(available.kind,'audio_card');
 assert.equal(available.card.requires_real_playback,true);
 assert.equal(available.card.allows_one_final_submit,true);
 assert.equal(available.interaction_mode,'audio_card_questions');
 assert.throws(()=>selectUiPattern({requestedType:'cloze',delivery:'audio_card'}),/only supports real listening/);
});

test('failed mobile inline audio falls back to native in-chat questions and verified MP3 link',()=>{
 const p=selectUiPattern({requestedType:'listening',delivery:'audio_card',
 capabilities:{audioPlayback:false,externalAudioLinkAvailable:true},
 audioCard:{trustedAudioAsset:{uri:'https://example.org/recording.mp3',
 mime_type:'audio/mpeg',verified:true},
 trustedQuestions:[{id:'gist',type:'single_choice',prompt:'What happened?',expected:'arrival'}]}});
 assert.equal(p.kind,'external_audio_handoff');
 assert.equal(p.card.question_ui,'native_intelligent_ui');
 assert.equal(p.evidence_modality,'pending_self_reported_external_listening');
 assert.equal(p.card.embedded_audio_claim,false);
});
test('mobile OGG is not automatically playable despite presence of an audio widget',()=>{
 const p=selectUiPattern({requestedType:'listening',delivery:'audio_card',
 capabilities:{audioPlayback:true,externalAudioLinkAvailable:true},
 audioCard:{trustedAudioAsset:{uri:'https://example.org/recording.ogg',
 mime_type:'audio/ogg',verified:true},
 trustedQuestions:[{id:'gist',type:'single_choice',prompt:'What happened?',expected:'arrival'}]}});
 assert.equal(p.kind,'unavailable');
 assert.equal(p.evidence_modality,'unassessed');
});
