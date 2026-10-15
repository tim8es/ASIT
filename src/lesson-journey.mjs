/**
 * ASIT MLP session controller. It does not generate learner-specific language.
 * It protects ordering, completion and persistence claims for the native chat UI.
 */
import {ASSESSMENTS} from './learning-state.mjs';

const nonempty=x=>typeof x==='string'&&x.trim().length>0;
export const STEP_KINDS=Object.freeze([
  'retrieval','meaning_check','guided_build','independent_task',
  'feedback_retry','transfer','recap','dialogue_turn'
]);
export const UI_PATTERNS=Object.freeze([
  'short_answer','choice_with_reason','sentence_builder',
  'free_response','conversation','read_only'
]);
export function validateJourneyDefinition(journey){
  if(!journey||!nonempty(journey.session_id)||!nonempty(journey.lesson_id)||
    !nonempty(journey.competency_id)||!Number.isInteger(journey.state_revision)||
    journey.state_revision<0)throw new Error('Invalid lesson identity/revision');
  if(!Array.isArray(journey.steps)||journey.steps.length<2||journey.steps.length>12)
    throw new Error('A lesson requires 2–12 focused steps');
  const ids=new Set();
  for(const s of journey.steps){
    if(!nonempty(s.activity_id)||ids.has(s.activity_id))throw new Error('Duplicate or empty activity ID');
    ids.add(s.activity_id);
    if(!STEP_KINDS.includes(s.kind)||!UI_PATTERNS.includes(s.ui_pattern))
      throw new Error('Unsupported activity kind or UI');
    if(!nonempty(s.competency_id)||s.competency_id!==journey.competency_id)
      throw new Error('Activity competency mismatch');
    if(!nonempty(s.prompt)||!s.rubric||typeof s.rubric!=='object'||Array.isArray(s.rubric)||
      Object.keys(s.rubric).length===0)throw new Error('Missing prompt or rubric');
    if(!['typed_text','spoken_audio','audio_comprehension','reading_text','unknown'].includes(s.modality))
      throw new Error('Missing valid modality');
    if(!['production','recognition','interaction','comprehension','unknown'].includes(s.operation))
      throw new Error('Missing valid operation');
    if(s.kind==='independent_task'&&s.operation==='recognition')
      throw new Error('Recognition-only choices cannot certify independent communication');
  }
  if(!journey.steps.some(s=>['independent_task','dialogue_turn'].includes(s.kind)))
    throw new Error('Missing communicative step');
  return true;
}

/** Only the agent-supplied, trusted activity blueprint is used; learner JSON is untrusted. */
export function openLesson(journey){
  validateJourneyDefinition(journey);
  return {
    ...structuredClone(journey),status:'active',cursor:0,
    steps:journey.steps.map(s=>({...structuredClone(s),state:'ready',attempts:[],feedback:null})),
    verified_attempt_ids:[],completion:'not_complete'
  };
}
function current(s){return s.steps[s.cursor];}
function checkActive(s){if(s.status!=='active'||!current(s))throw new Error('No active step');}
function expect(s,activityId,states){
  checkActive(s);
  if(current(s).activity_id!==activityId)throw new Error('Unexpected active activity');
  if(!states.includes(current(s).state))throw new Error('Illegal transition from '+current(s).state);
}
function clone(s){return structuredClone(s);}
export function lessonEvent(state,event){
  if(!state||!event||typeof event!=='object')throw new Error('Malformed session event');
  const s=clone(state),step=s.steps[s.cursor];
  switch(event.type){
    case 'present': {
      expect(s,event.activity_id,['ready']);
      step.state='presented';return s;
    }
    case 'submit': {
      expect(s,event.activity_id,['presented']);
      if(!nonempty(event.attempt_id)||step.attempts.some(a=>a.id===event.attempt_id)||
        s.steps.some(x=>x.attempts.some(a=>a.id===event.attempt_id)))
        throw new Error('Missing/duplicate attempt ID');
      step.attempts.push({id:event.attempt_id,assessment:null,persistence:'unverified'});
      step.state='submitted';return s;
    }
    case 'assess': {
      expect(s,event.activity_id,['submitted']);
      if(!ASSESSMENTS.includes(event.assessment))throw new Error('Invalid assessment');
      const a=step.attempts.at(-1);
      if(a.id!==event.attempt_id)throw new Error('Assessment/attempt mismatch');
      a.assessment=event.assessment;
      a.feedback=nonempty(event.feedback)?event.feedback:null;
      step.state='assessed';return s;
    }
    case 'persistence': {
      expect(s,event.activity_id,['assessed']);
      const a=step.attempts.at(-1);
      if(event.attempt_id!==a.id)throw new Error('Persistence/attempt mismatch');
      if(event.verified!==true){
        a.persistence='not_verified';step.state='awaiting_feedback';return s;
      }
      if(!['saved','already_saved'].includes(event.result))
        throw new Error('A save receipt must be a verified write/readback result');
      a.persistence='verified';
      s.verified_attempt_ids.push(a.id);
      step.state='awaiting_feedback';return s;
    }
    case 'no_storage': {
      expect(s,event.activity_id,['assessed']);
      const a=step.attempts.at(-1);
      a.persistence='ephemeral';
      step.state='awaiting_feedback';return s;
    }
    case 'feedback': {
      expect(s,event.activity_id,['awaiting_feedback']);
      if(!nonempty(event.text))throw new Error('Useful feedback required');
      step.feedback=event.text;
      step.state='feedback_shown';return s;
    }
    case 'advance': {
      expect(s,event.activity_id,['feedback_shown']);
      step.state='done';
      s.cursor++;
      if(s.cursor>=s.steps.length){
        s.status='completed';
        s.completion='all_planned_steps_finished';
        return s;
      }
      return s;
    }
    case 'stop_early': {
      if(s.status!=='active')throw new Error('Cannot stop inactive lesson');
      s.status='ended_early';
      s.completion='partial';
      return s;
    }
    default: throw new Error('Unknown session event');
  }
}
export function summarizeLessonRun(s){
  const attempts=s.steps.flatMap(x=>x.attempts);
  return {
    status:s.status,completed_steps:s.steps.filter(x=>x.state==='done').length,
    planned_steps:s.steps.length,attempts:attempts.length,
    verified_writes:attempts.filter(a=>a.persistence==='verified').length,
    unverified_writes:attempts.filter(a=>a.persistence==='unverified'||a.persistence==='not_verified').length,
    can_claim_full_completion:s.status==='completed',
    // Completion != learning mastery.
    learning_mastery_claim:false
  };
}

/** An explainable activity skeleton. The agent chooses actual content/context. */
export function suggestedPattern({minutes=10,requestedMode='practice'}={}){
  if(!Number.isInteger(minutes)||minutes<3||minutes>120)throw new Error('Invalid available minutes');
  if(requestedMode==='conversation')return ['dialogue_turn','dialogue_turn','feedback_retry'];
  if(minutes<=6)return ['retrieval','independent_task','feedback_retry'];
  return ['retrieval','meaning_check','guided_build','independent_task','feedback_retry','transfer'];
}
