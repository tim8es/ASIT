/**
 * Explainable competency selection.
 * The learner profile and agent-generated curriculum are INPUTS, not built-in facts.
 */
import {validateCompetencyMap,summarizeCompetency} from './learning-state.mjs';

export function rankLearningPriorities({competencies, attempts=[], reviewQueue=[], nowIso,
  objectiveIds=[]}) {
  validateCompetencyMap(competencies);
  if (!Number.isFinite(Date.parse(nowIso))) throw new Error('Reliable time required');
  const byId = new Map(competencies.map(c=>[c.id,c]));
  const statusById = new Map(competencies.map(c=>[c.id,summarizeCompetency(attempts,c.id).status]));
  const prior=competencies.map(c=>{
    const unmet=(c.dependencies??[]).filter(id=>!['independent','transferable'].includes(statusById.get(id)));
    const overdue = reviewQueue.some(r=>r.competency_id===c.id && r.due_at
      && Number.isFinite(Date.parse(r.due_at)) && Date.parse(r.due_at)<=Date.parse(nowIso));
    const evidence=summarizeCompetency(attempts,c.id);
    const reasons=[];
    let score=(c.priority??2)*10;
    if (objectiveIds.includes(c.id)) {score+=30;reasons.push('Current learner goal');}
    if (overdue) {score+=25;reasons.push('Due for review');}
    if (evidence.status==='unassessed') {score+=12;reasons.push('Not yet assessed');}
    if (['emerging','supported'].includes(evidence.status)) {score+=10;reasons.push('Needs independent application');}
    if (evidence.status==='transferable') {score-=30;reasons.push('Transfer evidenced; lower priority');}
    if (unmet.length) {score-=100;reasons.push('Requires prerequisites: '+unmet.join(', '));}
    const recent=attempts.filter(a=>a.competency_id===c.id).slice(-2);
    if (recent.length===2 && recent.every(a=>a.assessment==='needs_support')) {
      score+=8;reasons.push('Repeated difficulty; reduce scaffolding slowly');
    }
    return {competency_id:c.id,can_do:c.can_do,score,blocked:unmet.length>0,
      prerequisite_ids:unmet, reasons, suggested_operation:overdue?'retrieval':
      evidence.status==='unassessed'?'diagnostic':
      evidence.status==='transferable'?'transfer':'guided_production'};
  });
  return prior.sort((a,b)=>Number(a.blocked)-Number(b.blocked)||b.score-a.score||a.competency_id.localeCompare(b.competency_id));
}
export function selectNextLearningGoal(input) {
  const ranked=rankLearningPriorities(input);
  return ranked.find(p=>!p.blocked)??null;
}
