/** Optional deterministic UI selection oracle. ChatGPT itself renders native controls. */
import {resolveLessonSettings} from './lesson-blueprint.mjs';

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
  pattern('sentence_builder','build','guided_construction',construction),
  pattern('error_detective','build','guided_construction',construction),
  pattern('card_ordering','build','guided_construction',construction),
  pattern('free_production','explain','production',construction),
  pattern('scenario','explain','production',construction),
  pattern('free_production','apply','production',construction),
  pattern('scenario','apply','production',construction),
  pattern('dialogue','interact','interaction',media),
  pattern('spoken_response','speak','production',media,{needsSpokenAudio:true}),
  pattern('listening','listen','comprehension',media,{needsPlayback:true})
]);
const validAction=new Set(['remember','recognize','build','explain','apply','interact','speak','listen']);
const nonemptyString=x=>typeof x==='string'&&x.trim().length>0;
const defaults=Object.freeze({audioCapture:false,audioAccessible:false,audioPlayback:false,hasRelevantImage:false,drag:false});

export function selectUiPattern({action,mode='lesson',capabilities={},recentTypes=[]}={}){
  if(mode==='conversation'||mode==='direct_answer')
    return {kind:'ordinary_chat',operation:'interaction',evidence_modality:'typed_text'};
  if(!['lesson','diagnostic'].includes(mode))throw new Error('Invalid UI mode');
  if(!validAction.has(action))throw new Error('Invalid learner action');
  if(!Array.isArray(recentTypes))throw new Error('Invalid pattern history');
  const cap={...defaults,...capabilities};
  if(action==='speak'&&!(cap.audioCapture&&cap.audioAccessible))
    return {kind:'unavailable',action,reason:'No accessible learner audio',evidence_modality:'unassessed'};
  if(action==='listen'&&!cap.audioPlayback)
    return {kind:'unavailable',action,reason:'No actual audio playback',evidence_modality:'unassessed'};
  const choices=UI_CANDIDATES.filter(p=>p.action===action &&
    (!p.needsImage||cap.hasRelevantImage) &&
    (!p.needsSpokenAudio||(cap.audioCapture&&cap.audioAccessible)) &&
    (!p.needsPlayback||cap.audioPlayback));
  if(!choices.length)return {kind:'unavailable',action,evidence_modality:'unassessed'};
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
  if(chosen.type==='spoken_response')input='real_audio_capture';
  if(chosen.type==='listening')input='real_audio_playback_and_questions';
  return {kind:'ui',type:chosen.type,action,operation:chosen.operation,input,
    evidence_modality:action==='speak'?'spoken_audio':action==='listen'?'audio_comprehension':
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
 if(!['single_choice','word_order','image_label'].includes(type))
   return {status:'deferred',scope};
 if(type==='word_order'){
   if(!Array.isArray(expected)||!Array.isArray(answer))return {status:'deferred',scope};
   if(answer.length<expected.length)return {status:'unanswered',scope};
   return {status:answer.length===expected.length&&answer.every((x,i)=>x===expected[i])
     ?'correct':'try_again',scope};
 }
 if(typeof answer!=='string'||!answer.trim())return {status:'unanswered',scope};
 if(type==='single_choice'){
   if(typeof expected!=='string')return {status:'deferred',scope};
   return {status:answer===expected?'correct':'try_again',scope};
 }
 const options=[expected,...(Array.isArray(accepted)?accepted:[])]
   .filter(x=>typeof x==='string'&&x.trim());
 if(!options.length)return {status:'deferred',scope};
 return {status:options.some(x=>normalizeLabel(x)===normalizeLabel(answer))
   ?'correct':'deferred',scope};
}
