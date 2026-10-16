import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planVoiceHandoff,reviewVoiceEvidence} from '../src/voice-session.mjs';

test('native voice cannot be programmatically started by a ChatGPT lesson widget',()=>{
 const p=planVoiceHandoff({intent:'listening',voiceUiAvailable:true});
 assert.equal(p.status,'requires_manual_voice_activation');
 assert.equal(p.opened_voice_programmatically,false);
 assert.equal(p.audio_widget_installed,false);
 assert.equal(p.listening_evidence,'not_assessed');
});
test('voice unavailable safely falls back to reading/typed dialogue without fake audio score',()=>{
 const p=planVoiceHandoff({intent:'speaking'});
 assert.equal(p.status,'unavailable');
 assert.match(p.next_action,/changed_modality/);
 assert.equal(p.pronunciation_evidence,'not_assessed');
});
test('voice running is insufficient to prove teacher speech was heard',()=>{
 const p=planVoiceHandoff({intent:'listening',voiceUiAvailable:true,voiceActivated:true});
 assert.equal(p.status,'awaiting_actual_audio');
 assert.equal(p.listening_evidence,'not_assessed');
});
test('actual audible voice yields a real conversational exercise, not automatic passing score',()=>{
 const p=planVoiceHandoff({intent:'listening',voiceUiAvailable:true,voiceActivated:true,assistantAudioAudible:true});
 assert.equal(p.status,'ready_for_voice_exchange');
 assert.equal(p.listening_evidence,'pending_actual_response');
 assert.equal(p.progress_saved,false);
});
test('text-supported listening is not labelled independent aural comprehension',()=>{
 const p=reviewVoiceEvidence({intent:'listening',assistantAudioAudible:true,
 learnerReportsHeard:true,transcriptRead:true,learnerResponseProvided:true});
 assert.equal(p.listening,'audio_with_text_support');
 assert.equal(p.pronunciation,'not_assessed');
});
test('only actual heard speech plus learner response provides provisional listening evidence',()=>{
 const ready=reviewVoiceEvidence({intent:'listening',assistantAudioAudible:true,
 learnerReportsHeard:true,learnerResponseProvided:true});
 assert.equal(ready.listening,'provisional_heard_comprehension');
 const notHeard=reviewVoiceEvidence({intent:'listening',assistantAudioAudible:true,
 learnerResponseProvided:true});
 assert.equal(notHeard.listening,'not_assessed');
});
test('transcription alone does not prove audible speech production or pronunciation',()=>{
 const p=reviewVoiceEvidence({intent:'speaking',learnerResponseProvided:true});
 assert.equal(p.interaction,'transcript_or_text_content_only');
 assert.equal(p.pronunciation,'not_assessed');
 const q=reviewVoiceEvidence({intent:'shadowing',learnerResponseProvided:true,
 learnerOriginalAudioAccessible:true,teacherReviewedAudio:false});
 assert.equal(q.pronunciation,'not_assessed');
});
test('pronunciation evaluation is possible only after the original audio was actually reviewed',()=>{
 const p=reviewVoiceEvidence({intent:'shadowing',assistantAudioAudible:true,
 learnerReportsHeard:true,learnerResponseProvided:true,
 learnerOriginalAudioAccessible:true,teacherReviewedAudio:true});
 assert.equal(p.pronunciation,'eligible_for_qualitative_review');
 assert.equal(p.no_numeric_pronunciation_score,true);
 assert.equal(p.progress_saved,false);
});
test('invalid voice lesson intent fails rather than silently selecting another mode',()=>{
 assert.throws(()=>planVoiceHandoff({intent:'nonexistent'}),/Unknown voice lesson/);
 assert.throws(()=>reviewVoiceEvidence({intent:'nonexistent'}),/Unknown voice lesson/);
});
