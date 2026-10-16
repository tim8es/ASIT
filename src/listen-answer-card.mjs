/**
 * ASIT Listen → Answer audio-card reference evaluator.
 * No network, player, microphone or learner persistence is installed here.
 * Trusted Activity metadata and genuinely playable audio are prerequisites.
 */

const normalize=s=>String(s).trim().toLocaleLowerCase('en')
  .replace(/\s+/g,' ').replace(/[.!?]+$/g,'').trim();

function validQuestions(questions){
 return Array.isArray(questions)&&questions.length>0&&questions.length<=8&&
  questions.every(q=>q&&typeof q.id==='string'&&q.id.trim()&&
   typeof q.prompt==='string'&&q.prompt.trim()&&
   ['single_choice','short_answer','free_response'].includes(q.type)&&
   (q.type==='free_response'||typeof q.expected==='string'&&q.expected.trim()))&&
  new Set(questions.map(x=>x.id)).size===questions.length;
}

function hasResponse(value){return typeof value==='string'&&value.trim().length>0;}

/** A player event is evidence of attempted playback, not proof that it was heard. */
export function resolveListeningEvidence({assetPlayable=false,playedToEnd=false,
  learnerConfirmedHeard=false,transcriptShownBeforeAnswers=false,
  audioError=false,answersProvided=false}={}){
 if(audioError||!assetPlayable)return {
  label:'not_assessed',reason:'audio_unavailable',modality:'unassessed'};
 if(!playedToEnd)return {
  label:'not_assessed',reason:'playback_not_completed',modality:'unassessed'};
 if(!answersProvided)return {
  label:'not_assessed',reason:'no_answer_evidence',modality:'unassessed'};
 if(transcriptShownBeforeAnswers)return {
  label:'audio_plus_text_supported',reason:'transcript_exposed_before_answers',
  modality:'assisted_audio_reading'};
 if(!learnerConfirmedHeard)return {
  label:'not_assessed',reason:'listening_not_confirmed',modality:'unassessed'};
 return {label:'provisional_heard_comprehension',
  reason:'audible_playback_self_reported_not_independently_verified',
  modality:'listening'};
}

/** Grade answer content only against trusted per-item rubrics. */
export function assessListenAnswerCard({questions,answers={},playback={},earlyExit=false}={}){
 if(!validQuestions(questions))throw new Error('Invalid trusted audio question rubric');
 if(!answers||typeof answers!=='object'||Array.isArray(answers))
  throw new Error('Invalid listening answers');
 const responses=questions.map(q=>{
   const value=answers[q.id];
   if(!hasResponse(value))return {id:q.id,status:'not_assessed',reason:'blank'};
   if(q.type==='free_response')return {id:q.id,status:'deferred',reason:'needs_teacher_review'};
   const valid=[q.expected,...(Array.isArray(q.accepted)?q.accepted:[])]
    .filter(x=>typeof x==='string'&&x.trim());
   return {id:q.id,status:valid.some(x=>normalize(x)===normalize(value))?
    'correct':'needs_support',reason:'objective_answer_checked'};
 });
 const answeredCount=responses.filter(r=>r.status!=='not_assessed').length;
 const requiredQuestions=questions.filter(q=>q.required!==false);
 const unfilledRequired=requiredQuestions.filter(q=>!hasResponse(answers[q.id])).map(q=>q.id);
 const complete=unfilledRequired.length===0;
 const evidence=resolveListeningEvidence({...playback,answersProvided:answeredCount>0});
 return {
  total_count:questions.length,answered_count:answeredCount,
  required_unanswered_ids:unfilledRequired,
  form_completion:complete?'completed':'incomplete',
  completion:complete&&evidence.label!=='not_assessed'?'completed':'incomplete',
  early_exit:earlyExit===true,
  // A form may be filled but listening is NOT assessed unless the source was actually played.
  listening_evidence:evidence,
  results:evidence.label==='not_assessed'?
    responses.map(r=>({...r,status:'not_assessed',
     reason:evidence.reason==='audio_unavailable'?'no_playable_audio':evidence.reason})):
    responses,
  correct_count:evidence.label==='not_assessed'?null:
    responses.filter(r=>r.status==='correct').length,
  stored:false,independent_mastery_claim:false
 };
}

/** Author a native audio card only for a confirmed, genuine playable source. */
export function planListenAnswerCard({audioAsset=null,questions=[],clientAudioSupported=false}={}){
 if(!validQuestions(questions))throw new Error('Invalid trusted audio question rubric');
 const sourceVerified=audioAsset?.verified===true&&
  ['audio/mpeg','audio/wav','audio/ogg','audio/mp4'].includes(audioAsset?.mime_type)&&
  typeof audioAsset?.uri==='string'&&audioAsset.uri.trim().length>0;
 if(!sourceVerified||!clientAudioSupported)
  return {render:'unavailable',type:'listening',evidence_modality:'unassessed',
   reason:!sourceVerified?'no_verified_audio_asset':'client_audio_playback_not_confirmed',
   fallback:'explicit_reading_or_user_playable_audio_link_no_listening_score'};
 return {render:'audio_card',type:'listening',ui:[
   'audio_play_and_replay','speed_if_available','gist_and_detail_questions',
   'submit_after_real_playback','teacher_feedback','post_attempt_transcript'],
   source_kind:'verified_audio_asset',evidence_modality:'pending_listening',
   allows_one_final_submit:true,requires_real_playback:true,
   transcript_hidden_until_after_first_attempt:true,
   questions_count:questions.length,stored:false};
}
