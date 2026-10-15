/**
 * Small, profile-neutral UI selector. This is a reference decision oracle, not
 * a ChatGPT UI renderer. Rich rendering recipes live in ui/patterns/*.md.
 */
import {resolveLessonSettings,exerciseCapacityForMinutes} from './lesson-settings.mjs';
export const LEARNING_ACTIONS=Object.freeze([
  'recall','recognize','construct','explain','apply'
]);
const INDEX=Object.freeze([
  {id:'cloze',actions:['recall','construct'],operations:['recognition','production'],modalities:['typed_text'],cost:1,recipe:'ui/patterns/cloze.md'},
  {id:'meaning_choice',actions:['recognize'],operations:['recognition','comprehension'],modalities:['typed_text','reading_text'],cost:1,recipe:'ui/patterns/meaning-choice.md'},
  {id:'sentence_builder',actions:['construct'],operations:['production'],modalities:['typed_text'],cost:2,recipe:'ui/patterns/sentence-builder.md'},
  {id:'card_ordering',actions:['construct','recognize'],operations:['recognition','production'],modalities:['typed_text'],cost:2,recipe:'ui/patterns/card-ordering.md',needs:'ordering'},
  {id:'free_response',actions:['explain','apply','recall'],operations:['production','interaction','comprehension'],modalities:['typed_text','reading_text'],cost:2,recipe:'ui/patterns/free-response.md'},
  {id:'image_choice',actions:['recognize','explain'],operations:['recognition','comprehension'],modalities:['typed_text','reading_text'],cost:2,recipe:'ui/patterns/image-choice.md',needs:'image'},
  {id:'spoken_turn',actions:['explain','apply'],operations:['production','interaction'],modalities:['spoken_audio'],cost:3,recipe:'ui/patterns/spoken-turn.md',needs:'audio'},
  {id:'audio_check',actions:['recognize','explain'],operations:['comprehension'],modalities:['audio_comprehension'],cost:3,recipe:'ui/patterns/audio-check.md',needs:'audio'},
  {id:'dialogue',actions:['apply','explain'],operations:['interaction'],modalities:['typed_text'],cost:3,recipe:'ui/patterns/dialogue.md'}
]);
export const compactPatternIndex=Object.freeze(INDEX.map(({id,actions,operations,modalities,recipe})=>({id,actions,operations,modalities,recipe})));
const fail=message=>{throw new Error(message)};
const uniq=x=>[...new Set(x)];
const noAudio=modality=>modality==='spoken_audio'||modality==='audio_comprehension';
function score(pattern,{action,operation,recentPatterns}) {
  const repeats=recentPatterns.slice(-4).filter(x=>x===pattern.id).length;
  return (pattern.actions[0]===action?10:5)+(pattern.operations[0]===operation?3:1)-repeats*8-pattern.cost;
}
/** No learner data, prompts or answer keys are needed to select UI. */
export function chooseUI({action,operation,modality='typed_text',mode='lesson',
 capabilities={},recentPatterns=[],allowImages=false}={}) {
  if(mode==='free_conversation')return {surface:'chat',pattern:null,reason:'Natural dialogue is the learning activity'};
  if(mode==='direct_answer')return {surface:'text',pattern:null,reason:'An input control would add no evidence'};
  if(!['lesson','diagnostic'].includes(mode))fail('Unknown teaching mode');
  if(!LEARNING_ACTIONS.includes(action))fail('Unknown learning action');
  if(!['production','interaction','recognition','comprehension'].includes(operation))fail('Invalid operation');
  if(!['typed_text','reading_text','spoken_audio','audio_comprehension'].includes(modality))fail('Invalid modality');
  if(noAudio(modality)&&!capabilities.audio) return {
    surface:'fallback',pattern:'free_response',recipe:'ui/patterns/free-response.md',
    observed_modality:'typed_text',can_assess_requested_modality:false,
    reason:'Real audio unavailable; offer clearly labelled text practice or mark skill unassessed'
  };
  const choices=INDEX.filter(p=>p.actions.includes(action)&&p.operations.includes(operation)&&
    p.modalities.includes(modality)&&
    (p.needs!=='audio'||capabilities.audio===true)&&
    (p.needs!=='image'||(allowImages===true&&capabilities.image===true))&&
    (p.needs!=='ordering'||capabilities.ordering===true));
  if(!choices.length) return {
    surface:'fallback',pattern:'free_response',recipe:'ui/patterns/free-response.md',
    observed_modality:modality,can_assess_requested_modality:false,
    reason:'No verified pattern for this action/modality; use accessible text and assess only what it demonstrates'
  };
  const selected=[...choices].sort((a,b)=>score(b,{action,operation,recentPatterns})-score(a,{action,operation,recentPatterns})||a.id.localeCompare(b.id))[0];
  return {surface:'form',pattern:selected.id,recipe:selected.recipe,
    observed_modality:modality,can_assess_requested_modality:true,
    reason:'Operation-aligned pattern selected with recent-pattern repetition penalty',
    display:{task:'specific task prompt + labelled input',hint:'minimal cue -> frame -> model only when required',
      feedback:'what worked + one or two impactful corrections after combined Submit',
      retry:'fresh contextual application; no unbounded diagnostic loops'}};
}
/** Chooses only the presentation types for a coherent lesson; teacher supplies content and trusted rubrics. */
export function planLessonUI({tasks,learnerState=null,minutes=null,maxItems=null,
 capabilities={},recentPatterns=[]}={}){
 const settings=resolveLessonSettings({learnerState,minutes,exerciseCount:maxItems});
 if(!Array.isArray(tasks)||tasks.length===0)fail('Tasks required');
 const duration=settings.duration_minutes;
 const capacity=Math.min(settings.exercises_per_lesson,exerciseCapacityForMinutes(duration));
 // Half-minute estimates; not a calibrated wall-clock prediction.
 let history=[...recentPatterns],leftUnits=Math.floor(Math.max(0,duration-1.5)*2);
 const items=[];
 for(const task of tasks.slice(0,capacity)){
   const selected=chooseUI({...task,capabilities,recentPatterns:history});
   const units=INDEX.find(x=>x.id===selected.pattern)?.cost??2;
   if(leftUnits<units)break;
   items.push({...selected,action:task.action,operation:task.operation});
   history.push(selected.pattern);
   leftUnits-=units;
 }
 if(!items.length)fail('No task fits the time budget; reduce complexity');
 return {planned_minutes:duration,items,one_submit:true,
   requested_exercises:settings.exercises_per_lesson,lesson_setting_source:settings.setting_source,
   section_order:['topic_and_objective','grammar_or_language_rule','practice_form','vocabulary_recap','single_submit'],
   recipe_paths:uniq(items.map(x=>x.recipe))};
}
