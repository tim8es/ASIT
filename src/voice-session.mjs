/** ASIT Voice-first reference planner. This NEVER opens the device microphone. */
const intents=new Set(['listening','speaking','dialogue','shadowing']);
export function planVoiceHandoff({intent='listening',voiceUiAvailable=false,
  voiceActivated=false,assistantAudioAudible=false,learnerAudioAccessible=false}={}){
 if(!intents.has(intent))throw new Error('Unknown voice lesson intent');
 const common={intent,delivery:'native_chatgpt_voice',audio_widget_installed:false,
  opened_voice_programmatically:false,progress_saved:false};
 if(!voiceUiAvailable)return {...common,status:'unavailable',
   next_action:'offer_reading_or_typed_dialogue_with_changed_modality',
   listening_evidence:'not_assessed',pronunciation_evidence:'not_assessed'};
 if(!voiceActivated)return {...common,status:'requires_manual_voice_activation',
   next_action:'tap_platform_voice_icon_then_grant_microphone_access',
   listening_evidence:'not_assessed',pronunciation_evidence:'not_assessed'};
 if((intent==='listening'||intent==='shadowing')&&!assistantAudioAudible)
   return {...common,status:'awaiting_actual_audio',
     next_action:'confirm_audible_teacher_speech_before_testing',
     listening_evidence:'not_assessed',pronunciation_evidence:'not_assessed'};
 return {...common,status:'ready_for_voice_exchange',
   next_action:intent==='listening'?'speak_prompt_then_ask_gist_and_detail':
     intent==='shadowing'?'speak_model_then_request_spoken_repetition':
       'elicit_real_spoken_reply_and_follow_up',
   listening_evidence:'pending_actual_response',
   pronunciation_evidence:learnerAudioAccessible?'pending_teacher_review':'not_assessed'};
}

/** Content evidence != audio evidence, and local voice assertions are not persisted proof. */
export function reviewVoiceEvidence({intent='listening',assistantAudioAudible=false,
  learnerReportsHeard=false,transcriptRead=false,learnerResponseProvided=false,
  learnerOriginalAudioAccessible=false,teacherReviewedAudio=false}={}){
 if(!intents.has(intent))throw new Error('Unknown voice lesson intent');
 const listening=assistantAudioAudible&&learnerReportsHeard&&learnerResponseProvided?
   transcriptRead?'audio_with_text_support':'provisional_heard_comprehension':'not_assessed';
 const pronunciation=learnerOriginalAudioAccessible&&teacherReviewedAudio&&
   learnerResponseProvided?'eligible_for_qualitative_review':'not_assessed';
 const interaction=learnerResponseProvided?
   learnerOriginalAudioAccessible&&teacherReviewedAudio?'audio_content_observed':'transcript_or_text_content_only':
   'not_assessed';
 return {intent,listening,pronunciation,interaction,
   source_verification:'requires_real_chat_audio_observation',
   no_numeric_pronunciation_score:true,progress_saved:false};
}
