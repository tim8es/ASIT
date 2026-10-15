/**
 * The blueprint is a pedagogical plan, not prewritten learner content.
 * GPT fills instructional text and UI later, using the learner's actual state.
 */
import {selectNextLearningGoal} from './planner.mjs';

const stages = [
  ['retrieval',0.12],['diagnostic',0.10],['model_if_needed',0.10],
  ['controlled_practice',0.13],['guided_production',0.17],
  ['independent_communication',0.19],['feedback',0.09],['transfer_retry',0.10]
];
export function allocateSessionMinutes(totalMinutes) {
  if (!Number.isInteger(totalMinutes) || totalMinutes < 3 || totalMinutes > 120) {
    throw new Error('Session length must be between 3 and 120 minutes');
  }
  const active = totalMinutes<=6
    ? [['retrieval',0.18],['independent_communication',0.50],['feedback',0.16],['transfer_retry',0.16]]
    : stages;
  const raw=active.map(([name,fraction])=>({name,weight:fraction,minutes:Math.floor(totalMinutes*fraction)}));
  let rest=totalMinutes-raw.reduce((s,x)=>s+x.minutes,0);
  const sorted=[...raw].sort((a,b)=>(totalMinutes*b.weight-Math.floor(totalMinutes*b.weight))-
    (totalMinutes*a.weight-Math.floor(totalMinutes*a.weight)));
  let i=0;
  while(rest-->0)sorted[i++%sorted.length].minutes++;
  return raw.filter(x=>x.minutes>0).map(({name,minutes})=>({stage:name,minutes}));
}
/**
 * Learner-owned duration and exercise count. Current-turn overrides are temporary.
 * Support older private adaptive_profile.duration_limit_minutes without migration.
 */
export const DEFAULT_LESSON_DURATION=7;
export const DEFAULT_EXERCISE_COUNT=4;
export function resolveLessonSettings({learnerState,minutes=null,exerciseCount=null}={}) {
  if (!learnerState?.profile) throw new Error('Learner not initialized');
  const p=learnerState.profile.preferences?.lesson??{};
  const a=learnerState.adaptive_profile?.lesson_delivery_preference??{};
  const duration=minutes??p.duration_minutes??a.duration_minutes??
    a.duration_limit_minutes??learnerState.profile.available_minutes??DEFAULT_LESSON_DURATION;
  const count=exerciseCount??p.exercise_count??a.exercise_count??DEFAULT_EXERCISE_COUNT;
  if(!Number.isInteger(duration)||duration<3||duration>120)
    throw new Error('Lesson duration must be between 3 and 120 minutes');
  if(!Number.isInteger(count)||count<1||count>12)
    throw new Error('Exercise count must be between 1 and 12');
  return {duration_minutes:duration,exercise_count:count};
}
export function makeLessonBlueprint({learnerState,nowIso,requestedCompetencyId=null,minutes=null,exerciseCount=null}) {
  if (!learnerState?.profile?.target_language) throw new Error('Learner not initialized');
  const settings=resolveLessonSettings({learnerState,minutes,exerciseCount});
  const duration=settings.duration_minutes;
  const ids=requestedCompetencyId?[requestedCompetencyId]:[];
  if (requestedCompetencyId && !learnerState.competencies.some(c=>c.id===requestedCompetencyId)) {
    throw new Error('Requested competency is not in learner curriculum');
  }
  const selection=selectNextLearningGoal({competencies:learnerState.competencies,
    attempts:learnerState.attempts,reviewQueue:learnerState.review_queue,
    objectiveIds:ids,nowIso});
  if (!selection) throw new Error('No unblocked competencies; revise the graph');
  return {
    schema_version:2, learner_state_revision:learnerState.revision,
    goal:selection.competency_id, goal_description:selection.can_do,
    rationale:selection.reasons, target_language:learnerState.profile.target_language,
    planned_minutes:duration,exercise_count:settings.exercise_count,
    lesson_sections:['topic_and_outcome','grammar_or_language_strategy','combined_practice','end_vocabulary'],
    submission_mode:'single_form',stages:allocateSessionMinutes(duration),
    evidence_requirements:['observable production','hint level','rubric rationale','retry if appropriate'],
    status:'prepared'
  };
}
export function checkBlueprintFresh(blueprint,state) {
  return Boolean(blueprint && state && blueprint.learner_state_revision === state.revision
    && state.competencies.some(c=>c.id===blueprint.goal));
}
