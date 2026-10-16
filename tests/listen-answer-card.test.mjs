import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planListenAnswerCard,assessListenAnswerCard,resolveListeningEvidence,auditListeningAudioAsset,auditListeningDuration,STANDARD_LISTENING_MAX_SECONDS} from '../src/listen-answer-card.mjs';

const questions=[
 {id:'gist',type:'single_choice',prompt:'Where is the train going?',expected:'Brighton'},
 {id:'platform',type:'single_choice',prompt:'Which platform?',expected:'4'},
 {id:'time',type:'short_answer',prompt:'Departure time?',expected:'9:15',accepted:['09:15','nine fifteen']}
];
const answers={gist:'Brighton',platform:'4',time:'09:15'};
const playback={assetPlayable:true,playedToEnd:true,learnerConfirmedHeard:true};

test('cannot render a player with no verified actual audio asset',()=>{
 const r=planListenAnswerCard({questions,clientAudioSupported:true});
 assert.equal(r.render,'unavailable');
 assert.equal(r.evidence_modality,'unassessed');
});
test('a verified asset alone does not prove the mobile client can play it',()=>{
 const r=planListenAnswerCard({questions,audioAsset:{
  uri:'data:audio/mpeg;base64,FAKE',mime_type:'audio/mpeg',verified:true,duration_seconds:26,duration_verified:true
 }});
 assert.equal(r.render,'unavailable');assert.equal(r.reason,'client_audio_playback_not_confirmed');
});
test('real verified source plus playback capability produces one-Submit audio card',()=>{
 const r=planListenAnswerCard({questions,clientAudioSupported:true,audioAsset:{
  uri:'attached-verified-audio-asset',mime_type:'audio/mpeg',verified:true,duration_seconds:26,duration_verified:true
 }});
 assert.equal(r.render,'audio_card');
 assert.equal(r.questions_count,3);
 assert.equal(r.allows_one_final_submit,true);
 assert.equal(r.transcript_hidden_until_after_first_attempt,true);
});
test('playback without sound confirmation is not rated as independent listening',()=>{
 const r=resolveListeningEvidence({...playback,learnerConfirmedHeard:false,answersProvided:true});
 assert.equal(r.label,'not_assessed');
 assert.equal(r.reason,'listening_not_confirmed');
});
test('no file or failed decoding means answers cannot inflate an audio score',()=>{
 const r=assessListenAnswerCard({questions,answers,playback:{
  assetPlayable:false,playedToEnd:false,learnerConfirmedHeard:true}});
 assert.equal(r.correct_count,null);
 assert.equal(r.listening_evidence.label,'not_assessed');
 assert.ok(r.results.every(x=>x.status==='not_assessed'));
});
test('unplayed audio never gives listening credit even if all typed answers are right',()=>{
 const r=assessListenAnswerCard({questions,answers,playback:{
  assetPlayable:true,playedToEnd:false,learnerConfirmedHeard:true}});
 assert.equal(r.listening_evidence.reason,'playback_not_completed');
 assert.equal(r.correct_count,null);
});
test('real playback and unassisted learner confirmation yields provisional comprehension not mastery',()=>{
 const r=assessListenAnswerCard({questions,answers,playback});
 assert.equal(r.correct_count,3);
 assert.equal(r.listening_evidence.label,'provisional_heard_comprehension');
 assert.equal(r.independent_mastery_claim,false);
 assert.equal(r.stored,false);
});
test('revealing transcript before answering changes evidence category',()=>{
 const r=assessListenAnswerCard({questions,answers,playback:{
  ...playback,transcriptShownBeforeAnswers:true}});
 assert.equal(r.listening_evidence.label,'audio_plus_text_supported');
 assert.equal(r.listening_evidence.modality,'assisted_audio_reading');
});
test('blank mandatory answer remains incomplete and not assessed, even with prior listening',()=>{
 const r=assessListenAnswerCard({questions,answers:{...answers,time:''},playback,earlyExit:true});
 assert.equal(r.completion,'incomplete');
 assert.deepEqual(r.required_unanswered_ids,['time']);
 assert.equal(r.early_exit,true);
 assert.equal(r.results.find(x=>x.id==='time').status,'not_assessed');
});
test('synonyms and trivial formatting are accepted for controlled answers',()=>{
 const r=assessListenAnswerCard({questions,answers:{...answers,time:' nine fifteen! '},playback});
 assert.equal(r.results.find(x=>x.id==='time').status,'correct');
});
test('free answers remain deferred, not rigidly marked wrong',()=>{
 const open=[{id:'summary',type:'free_response',prompt:'What happened?'}];
 const r=assessListenAnswerCard({questions:open,answers:{summary:'I heard about a train.'},playback});
 assert.equal(r.results[0].status,'deferred');
});
test('duplicate question IDs and missing trusted rubric are rejected',()=>{
 assert.throws(()=>assessListenAnswerCard({questions:[questions[0],questions[0]],answers}),/Invalid trusted/);
 assert.throws(()=>planListenAnswerCard({questions:[]}),/Invalid trusted/);
});

test('blank audio cannot be a completed listening mission even with guessed answers',()=>{
 const r=assessListenAnswerCard({questions,answers,playback:{assetPlayable:false}});
 assert.equal(r.form_completion,'completed');
 assert.equal(r.completion,'incomplete');
 assert.equal(r.listening_evidence.label,'not_assessed');
});
test('audio questions and transcript review stay evidence-grounded with free response',()=>{
 const qs=[{id:'main',type:'free_response',prompt:'Summarize the clip'}];
 const r=assessListenAnswerCard({questions:qs,answers:{main:'The train is delayed.'},playback});
 assert.equal(r.results[0].status,'deferred');
 assert.equal(r.independent_mastery_claim,false);
});

test('a playable listening card keeps all learning controls inside native Intelligent UI',()=>{
 const p=planListenAnswerCard({questions,clientAudioSupported:true,
  audioAsset:{uri:'verified-natural-recording',verified:true,duration_seconds:26,duration_verified:true,mime_type:'audio/mpeg'}});
 assert.equal(p.render,'audio_card');
 assert.equal(p.presentation.surface,'in_chat_intelligent_ui');
 assert.equal(p.presentation.standalone_html,false);
 assert.equal(p.presentation.media_adapter,'minimal_inline_audio_only');
 assert.equal(p.presentation.response_controls,'native_radio_input_textarea');
 assert.equal(p.presentation.completion_control,'one_native_submit');
});
test('old low-fidelity file is not recommended as production ready even when MP3 decodes',()=>{
 const q=auditListeningAudioAsset({sampleRateHz:22050,bitRateKbps:32,
  sourceKind:'synthetic_tts',naturalnessReviewed:false});
 assert.deepEqual(q.technical_warnings,['sample_rate_below_32k','bit_rate_below_64kbps']);
 assert.equal(q.production_ready,false);
 assert.equal(q.no_automatic_naturalness_claim,true);
});
test('higher bitrate alone does not establish that speech sounds natural',()=>{
 const q=auditListeningAudioAsset({sampleRateHz:48000,bitRateKbps:128,
  sourceKind:'human_recording'});
 assert.equal(q.technical_warnings.length,0);
 assert.equal(q.production_ready,false);
 assert.equal(q.editorial_status,'needs_human_listening_review');
});

test('mobile OGG without verified decoder must not claim embedded playback',()=>{
 const r=planListenAnswerCard({questions,clientAudioSupported:true,audioAsset:{
  uri:'https://example.org/legitimate-voice.ogg',verified:true,duration_seconds:26,duration_verified:true,mime_type:'audio/ogg'
 }});
 assert.equal(r.render,'unavailable');
 assert.equal(r.reason,'audio_codec_not_confirmed');
});
test('external fallback still uses native questions and demands audible confirmation',()=>{
 const r=planListenAnswerCard({questions,clientAudioSupported:false,
  externalAudioLinkAvailable:true,
  audioAsset:{uri:'https://example.org/legitimate-voice.mp3',verified:true,duration_seconds:26,duration_verified:true,mime_type:'audio/mpeg'}});
 assert.equal(r.render,'native_questions_with_external_audio');
 assert.equal(r.question_ui,'native_intelligent_ui');
 assert.equal(r.embedded_audio_claim,false);
 assert.equal(r.listen_confirmation_required,true);
 assert.equal(r.completion_without_hearing,'not_assessed');
});
test('unverified OGG is not offered as a mobile fallback simply because URL exists',()=>{
 const r=planListenAnswerCard({questions,clientAudioSupported:false,
  externalAudioLinkAvailable:true,
  audioAsset:{uri:'https://example.org/legitimate-voice.ogg',verified:true,duration_seconds:26,duration_verified:true,mime_type:'audio/ogg'}});
 assert.equal(r.render,'unavailable');
 assert.equal(r.reason,'audio_codec_not_confirmed');
});
test('self-reported external listening is labelled as reported, never client telemetry',()=>{
 const r=assessListenAnswerCard({questions,answers,playback:{
  delivery:'external',assetPlayable:true,externalAudioOpened:true,
  learnerReportsCompletedClip:true,learnerConfirmedHeard:true}});
 assert.equal(r.listening_evidence.label,'self_reported_external_audio_comprehension');
 assert.equal(r.listening_evidence.modality,'listening_self_report');
 assert.equal(r.independent_mastery_claim,false);
});
test('an opened external file with no listened confirmation receives no listening score',()=>{
 const r=assessListenAnswerCard({questions,answers,playback:{
  delivery:'external',assetPlayable:true,externalAudioOpened:true,
  learnerReportsCompletedClip:false,learnerConfirmedHeard:false}});
 assert.equal(r.listening_evidence.label,'not_assessed');
 assert.equal(r.correct_count,null);
});

test('normal lesson refuses full 10-minute chapter even when asked to play first 30 seconds',()=>{
 const duration=auditListeningDuration({durationSeconds:640,durationVerified:true});
 assert.equal(duration.eligible,false);
 assert.equal(duration.reason,'clip_too_long');
 assert.equal(duration.maximum_seconds,35);
 const planned=planListenAnswerCard({questions,externalAudioLinkAvailable:true,
  audioAsset:{uri:'https://example.org/full-chapter.mp3',mime_type:'audio/mpeg',
    verified:true,duration_seconds:640,duration_verified:true}});
 assert.equal(planned.render,'unavailable');
 assert.equal(planned.reason,'clip_too_long');
 assert.equal(planned.evidence_modality,'unassessed');
});
test('a real 26-second clip is eligible as the normal default',()=>{
 const duration=auditListeningDuration({durationSeconds:26,durationVerified:true});
 assert.equal(duration.eligible,true);
 assert.equal(STANDARD_LISTENING_MAX_SECONDS,35);
 const planned=planListenAnswerCard({questions,externalAudioLinkAvailable:true,
  audioAsset:{uri:'https://example.org/short.mp3',mime_type:'audio/mpeg',
    verified:true,duration_seconds:26,duration_verified:true}});
 assert.equal(planned.render,'native_questions_with_external_audio');
 assert.equal(planned.questions_count,3);
});
test('missing duration or a suggested segment is not evidence of actual short clip length',()=>{
 for(const invalid of [undefined,null,0,NaN,4,36,100]){
  const duration=auditListeningDuration({
   durationSeconds:invalid,durationVerified:true});
  assert.equal(duration.eligible,false);
 }
 const duration=auditListeningDuration({durationSeconds:26,durationVerified:false});
 assert.equal(duration.reason,'clip_duration_not_verified');
});
test('extended listening requires a separate explicit selection and remains bounded',()=>{
 assert.equal(auditListeningDuration({durationSeconds:70,durationVerified:true}).eligible,false);
 assert.equal(auditListeningDuration({durationSeconds:70,durationVerified:true,extendedListening:true}).eligible,true);
 assert.equal(auditListeningDuration({durationSeconds:150,durationVerified:true,extendedListening:true}).eligible,false);
});
