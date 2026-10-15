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
export function makeLessonBlueprint({learnerState,nowIso,requestedCompetencyId=null,minutes=null}) {
  if (!learnerState?.profile?.target_language) throw new Error('Learner not initialized');
  // A structured micro-lesson must fit within seven minutes, including reading and Submit.
  const requestedMinutes=minutes??learnerState.profile.available_minutes??7;
  if(!Number.isInteger(requestedMinutes)||requestedMinutes<3)
    throw new Error('Mini-lesson duration must be at least 3 minutes');
  const duration=Math.min(7,requestedMinutes);
  const preferred=learnerState.profile.preferences?.exercises_per_lesson??4;
  if(!Number.isInteger(preferred)||preferred<1||preferred>5)
    throw new Error('Exercise preference must be from 1 to 5');
  // Reduced exercise counts protect short lessons; the teacher can reduce further for
  // demanding listening/speaking tasks without claiming a fixed user preference.
  const exerciseCount=Math.min(preferred,duration<=4?2:duration===5?3:5);
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
    planned_minutes:duration,stages:allocateSessionMinutes(duration),
    exercise_count:exerciseCount,
    required_visible_sections:['topic_and_objective','grammar_or_language_rule','practice_form','vocabulary_recap','single_submit'],
    practice_policy:'purposeful mixed patterns; one combined submission; independent communicative response where feasible',
    evidence_requirements:['observable production','hint level','rubric rationale','retry if appropriate'],
    status:'prepared'
  };
}
export function checkBlueprintFresh(blueprint,state) {
  return Boolean(blueprint && state && blueprint.learner_state_revision === state.revision
    && state.competencies.some(c=>c.id===blueprint.goal));
}
