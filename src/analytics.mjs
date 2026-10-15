/** Evidence summaries never claim exact CEFR levels, calibrated probabilities or speech latency. */
import {summarizeCompetency} from './learning-state.mjs';

export function summarizeLearningProgress(state) {
  const bySkill=(state.competencies??[]).map(c=>({
    competency_id:c.id,can_do:c.can_do,
    ...summarizeCompetency(state.attempts??[],c.id)
  }));
  return {
    observed_attempts:(state.attempts??[]).length,
    assessed_skills:bySkill.filter(s=>s.status!=='unassessed').length,
    unassessed_skills:bySkill.filter(s=>s.status==='unassessed').length,
    independent_in_one_context:bySkill.filter(s=>s.status==='independent').length,
    transfer_evidence:bySkill.filter(s=>s.status==='transferable').length,
    skills:bySkill,
    notes:['These are ordinal evidence labels, not CEFR test scores.',
           'Typed performance cannot establish pronunciation or oral speed.']
  };
}

/** Returns a conservative descriptive signal requiring a delayed, independent observation. */
export function describeChange(attempts,competencyId) {
 const sample=attempts.filter(a=>a.competency_id===competencyId && a.assessment!=='not_assessed');
 if (new Set(sample.map(a=>a.session_id)).size<2)
   return {signal:'insufficient_data',reason:'Fewer than two sessions observed'};
 const first=sample.find(a=>a.hint_level==='none');
 const last=[...sample].reverse().find(a=>a.hint_level==='none');
 if (!first || !last || first.attempt_id===last.attempt_id)
   return {signal:'insufficient_data',reason:'Independent repeated attempts absent'};
 const quality={needs_support:0,partial:1,correct:2};
 if (quality[last.assessment]>quality[first.assessment])
   return {signal:'possible_improvement',reason:'Later independent attempt had a stronger ordinal assessment'};
 if (quality[last.assessment]<quality[first.assessment])
   return {signal:'possible_regression',reason:'Later independent attempt had a weaker ordinal assessment'};
 return {signal:'stable_observations',reason:'Observed ratings are unchanged; no precise proficiency inference'};
}
export function dueReviews(reviewQueue, nowIso) {
 if (!Number.isFinite(Date.parse(nowIso))) throw new Error('Real current date required');
 return (reviewQueue??[]).filter(r=>r.due_at && Number.isFinite(Date.parse(r.due_at))
   && Date.parse(r.due_at)<=Date.parse(nowIso));
}
