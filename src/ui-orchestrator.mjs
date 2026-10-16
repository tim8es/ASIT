/** Optional deterministic UI selection oracle. ChatGPT itself renders native controls. */
import {resolveLessonSettings} from './lesson-blueprint.mjs';
import {planVoiceHandoff} from './voice-session.mjs';
import {planListenAnswerCard} from './listen-answer-card.mjs';

const pattern=(type,action,operation,spec,extras={})=>
  Object.freeze({type,action,operation,spec_ref:spec,...extras});
const recognition='ui/patterns/recognition.md';
const construction='ui/patterns/construction.md';
const media='ui/patterns/media-interaction.md';
export const UI_CANDIDATES=Object.freeze([
  pattern('cloze','remember','retrieval',recognition),
  pattern('vocabulary_retrieval','remember','retrieval',recognition),
  pattern('image_label','remember','image_prompted_written_recall',recognition,{needsImage:true}),
  pattern('grammar_contrast','recognize','recognition',recognition),
  pattern('matching','recognize','recognition',recognition),
  pattern('image_choice','recognize','recognition',recognition,{needsImage:true}),
  pattern('image_hotspot','recognize','visual_region_recognition',recognition,
    {needsImage:true,needsImageRegions:true}),
  pattern('reading_comprehension','read','text_comprehension',recognition),
  pattern('sentence_builder','build','guided_construction',construction),
  pattern('error_detective','build','guided_construction',construction),
  pattern('card_ordering','build','guided_construction',construction),
  pattern('timeline_ordering','build','event_sequence_reconstruction',construction),
  pattern('free_production','explain','production',construction),
  pattern('scenario','explain','production',construction),
  pattern('free_production','apply','production',construction),
  pattern('scenario','apply','production',construction),
  pattern('dialogue','interact','interaction',media),
  pattern('spoken_response','speak','production',media,{needsSpokenAudio:true}),
  pattern('listening','listen','comprehension',media,{needsPlayback:true})
]);
const validAction=new Set(['remember','recognize','read','build','explain','apply','interact','speak','listen']);
const nonemptyString=x=>typeof x==='string'&&x.trim().length>0;
const defaults=Object.freeze({audioCapture:false,audioAccessible:false,audioPlayback:false,hasRelevantImage:false,hasInteractiveImageRegions:false,drag:false});

export function selectUiPattern({action,requestedType=null,mode='lesson',capabilities={},recentTypes=[],delivery='native_form',audioCard=null}={}){
  if(mode==='conversation'||mode==='direct_answer')
    return {kind:'ordinary_chat',operation:'interaction',evidence_modality:'typed_text'};
  if(!['lesson','diagnostic'].includes(mode))throw new Error('Invalid UI mode');
  // Progress is a read-only verified evidence view, never an assessable exercise.
  if(requestedType==='progress_explorer')
    return capabilities.hasVerifiedLearnerProgress?
      {kind:'read_only',type:'progress_explorer',submit_count:0,
       input:'verified_private_progress_with_filters',
       evidence_modality:'not_assessed'}:
      {kind:'unavailable',type:'progress_explorer',submit_count:0,
       reason:'No verified private learner progress',evidence_modality:'not_assessed'};
  if(requestedType!==null&&!UI_CANDIDATES.some(p=>p.type===requestedType))
    throw new Error('Unknown exercise type');
  const resolvedAction=action??UI_CANDIDATES.find(p=>p.type===requestedType)?.action;
  if(!validAction.has(resolvedAction))throw new Error('Invalid learner action');
  if(requestedType!==null&&!UI_CANDIDATES.some(p=>p.type===requestedType&&p.action===resolvedAction))
    throw new Error('Requested exercise does not match learner action');
  if(delivery==='audio_card'){
    if(resolvedAction!=='listen'||requestedType&&requestedType!=='listening')
      throw new Error('Audio card delivery only supports real listening activities');
    const plan=planListenAnswerCard({
      audioAsset:audioCard?.trustedAudioAsset,
      questions:audioCard?.trustedQuestions??[],
      clientAudioSupported:capabilities.audioPlayback===true,
      audioFormatConfirmed:capabilities.audioFormatConfirmed===true,
      externalAudioLinkAvailable:capabilities.externalAudioLinkAvailable===true
    });
    return {kind:plan.render==='audio_card'?'audio_card':
      plan.render==='native_questions_with_external_audio'?'external_audio_handoff':'unavailable',
      type:'listening',action:'listen',interaction_mode:'audio_card_questions',
      evidence_modality:plan.render==='audio_card'?'pending_listening':
        plan.render==='native_questions_with_external_audio'?'pending_self_reported_external_listening':'unassessed',
      card:plan,spec_ref:media};
  }
  if(delivery==='native_voice'){
    if(!['listen','speak','interact'].includes(resolvedAction))
      throw new Error('Native Voice delivery requires listening, speaking or interaction');
    const voiceIntent=resolvedAction==='listen'?'listening':resolvedAction==='speak'?'speaking':'dialogue';
    const plan=planVoiceHandoff({intent:voiceIntent,
      voiceUiAvailable:capabilities.voiceUiAvailable===true,
      voiceActivated:capabilities.voiceActivated===true,
      assistantAudioAudible:capabilities.assistantAudioAudible===true,
      learnerAudioAccessible:capabilities.learnerAudioAccessible===true});
    return {kind:plan.status==='unavailable'?'unavailable':
      plan.status==='requires_manual_voice_activation'?'voice_handoff':'voice_session',
      type:requestedType??(voiceIntent==='listening'?'listening':voiceIntent==='speaking'?'spoken_response':'dialogue'),
      action:resolvedAction,interaction_mode:'chat_turns',voice:plan,
      evidence_modality:plan.status==='unavailable'?'unassessed':
        (voiceIntent==='listening'?'pending_audio_comprehension': 'pending_voice_exchange'),
      spec_ref:media};
  }

  if(!Array.isArray(recentTypes))throw new Error('Invalid pattern history');
  const cap={...defaults,...capabilities};
  if(resolvedAction==='speak'&&!(cap.audioCapture&&cap.audioAccessible))
    return {kind:'unavailable',action:resolvedAction,reason:'No accessible learner audio',evidence_modality:'unassessed'};
  if(resolvedAction==='listen'&&!cap.audioPlayback)
    return {kind:'unavailable',action:resolvedAction,reason:'No actual audio playback',evidence_modality:'unassessed'};
  if(requestedType==='image_hotspot'&&!(cap.hasRelevantImage&&cap.hasInteractiveImageRegions))
    return {kind:'unavailable',action:resolvedAction,type:requestedType,
      reason:'No real image with accessible interactive regions',
      fallback:cap.hasRelevantImage?'image_choice':'text_based_recognition',
      evidence_modality:'unassessed'};
  const choices=UI_CANDIDATES.filter(p=>p.action===resolvedAction &&
    (requestedType===null||p.type===requestedType) &&
    (!p.needsImage||cap.hasRelevantImage) &&
    (!p.needsImageRegions||cap.hasInteractiveImageRegions) &&
    (!p.needsSpokenAudio||(cap.audioCapture&&cap.audioAccessible)) &&
    (!p.needsPlayback||cap.audioPlayback));
  if(!choices.length)return {kind:'unavailable',action:resolvedAction,type:requestedType,evidence_modality:'unassessed'};
  const ranked=[...choices].sort((a,b)=>{
    const ai=recentTypes.lastIndexOf(a.type),bi=recentTypes.lastIndexOf(b.type);
    const aPenalty=ai<0?0:100+ai, bPenalty=bi<0?0:100+bi;
    return aPenalty-bPenalty || choices.indexOf(a)-choices.indexOf(b);
  });
  const chosen=ranked[0];
  let input='native_control_or_text_fallback';
  if(chosen.type==='card_ordering')input=cap.drag?'accessible_drag_with_keyboard_fallback':'numbered_or_select_ordering';
  if(chosen.type==='image_choice')input='real_image_with_accessible_choices';
  if(chosen.type==='image_label')input='real_image_above_text_input_with_text_fallback';
  if(chosen.type==='image_hotspot')input='real_image_with_accessible_clickable_regions_and_keyboard_fallback';
  if(chosen.type==='reading_comprehension')input='actual_reading_passage_with_gist_and_detail_questions';
  if(chosen.type==='timeline_ordering')input='click_to_order_event_cards_with_undo_and_keyboard_fallback';
  if(chosen.type==='sentence_builder')input='semantic_chunk_builder_or_structured_text_input';
  if(chosen.type==='dialogue')input='genuine_multi_turn_chat_exchange';
  if(chosen.type==='spoken_response')input='real_audio_capture';
  if(chosen.type==='listening')input='real_audio_playback_and_questions';
  return {kind:'ui',type:chosen.type,action:resolvedAction,operation:chosen.operation,input,
    interaction_mode:chosen.type==='dialogue'?'chat_turns':'single_task',
    evidence_modality:resolvedAction==='speak'?'spoken_audio':resolvedAction==='listen'?'audio_comprehension':
      chosen.type==='image_hotspot'?'visual_region_recognition':
      chosen.type==='reading_comprehension'?'reading_comprehension':
      chosen.type==='timeline_ordering'?'event_sequence_reconstruction':
      chosen.type==='image_choice'?'visual_recognition':
      chosen.type==='image_label'?'image_prompted_written_recall':'typed_text',
    spec_ref:chosen.spec_ref};
}
export function composeLessonUi({learnerState,minutes=null,exerciseCount=null,
  mode='lesson',actions=null,capabilities={},recentTypes=[]}={}){
  if(mode==='conversation'||mode==='direct_answer')
    return {render:'ordinary_chat',tasks:[],submit_count:0};
  const settings=resolveLessonSettings({learnerState,minutes,exerciseCount});
  const candidateActions=actions??['remember','recognize','build','apply','explain','interact'];
  if(!Array.isArray(candidateActions)||candidateActions.length===0||
    candidateActions.some(x=>!validAction.has(x)))
    throw new Error('Invalid planned actions');
  const chosen=Array.from({length:settings.exercise_count},(_,i)=>
    candidateActions[i%candidateActions.length]);
  if(mode==='lesson'&&chosen.length>=2&&!chosen.some(a=>['apply','explain','interact','speak'].includes(a)))
    chosen[chosen.length-1]='apply';
  const history=[...recentTypes],tasks=chosen.map((action,i)=>{
    const ui=selectUiPattern({action,mode,capabilities,recentTypes:history});
    if(ui.kind==='ui')history.push(ui.type);
    return {item_id:'task_'+(i+1),...ui};
  });
  return {render:'combined_form',duration_minutes:settings.duration_minutes,
    exercise_count:settings.exercise_count,
    sections:['topic_and_outcome','grammar_or_language_strategy','practice_form','end_vocabulary'],
    tasks,submit_count:1,storage_protocol:'ASIT_ATTEMPT_V2'};
}
export function validateLessonPresentation(lesson,{durationMinutes=7,exerciseCount=4}={}){
  if(!lesson||!nonemptyString(lesson.topic)||!nonemptyString(lesson.outcome)||
    !Array.isArray(lesson.grammar)||lesson.grammar.length===0||
    lesson.grammar.some(x=>!nonemptyString(x))||
    !Array.isArray(lesson.vocabulary)||lesson.vocabulary.length===0||
    !Array.isArray(lesson.exercises)||lesson.exercises.length!==exerciseCount||
    !Number.isFinite(lesson.estimated_minutes)||lesson.estimated_minutes>durationMinutes||
    lesson.estimated_minutes<=0||lesson.submit_count!==1)
    throw new Error('Incomplete or oversized lesson packet');
  if(lesson.exercises.some(x=>!nonemptyString(x.prompt)||!nonemptyString(x.item_id)))
    throw new Error('Missing trusted exercise metadata');
  return true;
}

/** Local provisional checking of UNAMBIGUOUS forms; no storage or mastery claims. */
const normalizeLabel=s=>String(s).trim().toLocaleLowerCase('en')
  .replace(/\s+/g,' ').replace(/[.!?]+$/g,'').trim();
export function checkObjectiveInput({type,answer,expected,accepted=[]}={}){
 const scope='local_only';
 if(!['single_choice','word_order','timeline_ordering','image_label','image_hotspot'].includes(type))
   return {status:'deferred',scope};
 if(type==='word_order'||type==='timeline_ordering'){
   if(!Array.isArray(expected)||!Array.isArray(answer))return {status:'deferred',scope};
   if(answer.length<expected.length)return {status:'unanswered',scope};
   // A trusted rubric may list equivalent timelines for simultaneous/uncertain events.
   const valid=[expected,...(type==='timeline_ordering'&&Array.isArray(accepted)?
     accepted.filter(Array.isArray):[])];
   const matches=valid.some(sequence=>answer.length===sequence.length&&
     answer.every((x,i)=>x===sequence[i]));
   return {status:matches?'correct':'try_again',scope};
 }
 if(typeof answer!=='string'||!answer.trim())return {status:'unanswered',scope};
 if(type==='single_choice'||type==='image_hotspot'){
   // A trusted region identifier is required; raw pixel coordinates are not a rubric.
   if(typeof expected!=='string'||!expected.trim())return {status:'deferred',scope};
   return {status:answer===expected?'correct':'try_again',scope};
 }
 const options=[expected,...(Array.isArray(accepted)?accepted:[])]
   .filter(x=>typeof x==='string'&&x.trim());
 if(!options.length)return {status:'deferred',scope};
 return {status:options.some(x=>normalizeLabel(x)===normalizeLabel(answer))
   ?'correct':'deferred',scope};
}


/** Summarize answer coverage, not correctness. A skipped required task cannot unlock a finale. */
export function summarizeLessonCompletion({exercises,answers}={}){
 if(!Array.isArray(exercises)||!exercises.length||
   exercises.some(x=>!x||typeof x.item_id!=='string'||!x.item_id.trim())||
   new Set(exercises.map(x=>x.item_id)).size!==exercises.length)
   throw new Error('Invalid trusted lesson exercises');
 if(!answers||typeof answers!=='object'||Array.isArray(answers))
   throw new Error('Invalid answers');
 const isAnswered=(value,item={})=>{
   if(value===null||value===undefined)return false;
   if(typeof value==='string')return value.trim().length>0;
   if(typeof value==='number')return Number.isFinite(value);
   if(typeof value==='boolean')return true; // false is a legitimate yes/no answer.
   if(Array.isArray(value))return value.length>0&&
     (!Number.isInteger(item.expected_count)||value.length===item.expected_count)&&
     value.every(v=>isAnswered(v));
   if(value&&typeof value==='object'){
     if(Array.isArray(item.required_fields)&&item.required_fields.length){
       return item.required_fields.every(k=>Object.hasOwn(value,k)&&isAnswered(value[k]));
     }
     if(Object.hasOwn(value,'selected_ids'))
       return isAnswered(value.selected_ids,item);
     if(Object.hasOwn(value,'answer'))return isAnswered(value.answer,item);
   }
   return false;
 };
 const unanswered_item_ids=exercises.filter(x=>!isAnswered(answers[x.item_id],x)).map(x=>x.item_id);
 const missingRequired=exercises.filter(x=>x.required!==false&&!isAnswered(answers[x.item_id],x)).map(x=>x.item_id);
 return {
   total_count:exercises.length,answered_count:exercises.length-unanswered_item_ids.length,
   unanswered_item_ids,required_unanswered_ids:missingRequired,
   status:missingRequired.length?'incomplete':'completed',
   final_scene_unlocked:missingRequired.length===0,
   // No correctness or independent-writing claim is made by this coverage-only oracle.
 };
}


/** Local interaction provenance is informative, never authoritative mastery evidence. */
export function summarizePracticeProvenance({firstResponse=null,finalResponse=null,
  revisionCount=0,hintLevel=0,source='native_ui'}={}){
 if(!Number.isInteger(revisionCount)||revisionCount<0||
   !Number.isInteger(hintLevel)||hintLevel<0)
   throw new Error('Invalid provisional interaction metadata');
 const firstKnown=firstResponse!==null&&firstResponse!==undefined;
 const finalKnown=finalResponse!==null&&finalResponse!==undefined;
 return {
   source,first_response_recorded:firstKnown,final_response_recorded:finalKnown,
   revision_count:revisionCount,hint_level:hintLevel,
   provisional_support_status:!firstKnown?'unknown':
     (revisionCount>0||hintLevel>0)?'assisted_or_revised':'first_try_reported',
   mastery_claim:false,trusted_rubric_verification_required:true
 };
}

/** A dialogue with one written reply is not multi-turn communication. */
export function summarizeDialogueTurns({turns=[]}={}){
 if(!Array.isArray(turns))throw new Error('Invalid dialogue history');
 const valid=turns.filter(t=>t&&typeof t.teacher_prompt==='string'&&t.teacher_prompt.trim()&&
   typeof t.learner_response==='string'&&t.learner_response.trim());
 return {
   observed_exchange_count:valid.length,
   status:valid.length>=2?'ready_for_teacher_review':'insufficient_interaction',
   evidence_modality:'typed_interaction',
   fluency_or_pronunciation_assessed:false,
   teacher_assessment_required:true
 };
}
