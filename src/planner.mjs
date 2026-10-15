/** Explainable competency selection over learner-supplied skills; never global defaults. */
import {validateCompetencyMap,summarizeCompetency} from './learning-state.mjs';
export function rankLearningPriorities({competencies,attempts=[],reviewQueue=[],nowIso,objectiveIds=[],recentLessonCompetencyIds=[]}){
  validateCompetencyMap(competencies);
  if(!Array.isArray(recentLessonCompetencyIds) ||
    recentLessonCompetencyIds.some(id=>typeof id!=='string'))
    throw new Error('Invalid recent lesson focuses');
  if(!nowIso||!Number.isFinite(Date.parse(nowIso)))throw new Error('Reliable time required');
  const statusById=new Map(competencies.map(c=>[c.id,summarizeCompetency(attempts,c.id,c).status]));
  const rows=competencies.map(c=>{
    const unmet=(c.dependencies??[]).filter(d=>!['independent','transferable'].includes(statusById.get(d)));
    const due=reviewQueue.some(r=>r.competency_id===c.id&&r.due_at
      &&Number.isFinite(Date.parse(r.due_at))&&Date.parse(r.due_at)<=Date.parse(nowIso));
    const evidence=summarizeCompetency(attempts,c.id,c);
    const reasons=[];let score=(c.priority??2)*10;
    if(objectiveIds.includes(c.id)){score+=500;reasons.push('Learner-selected objective');}
    if(due){score+=25;reasons.push('Due for retrieval');}
    if(evidence.status==='unassessed'){score+=12;reasons.push('Unassessed');}
    if(['emerging','supported'].includes(evidence.status)){score+=10;reasons.push('Needs more independent practice');}
    if(evidence.status==='transferable'){score-=30;reasons.push('Transfer observed, review later');}
    if(unmet.length){score-=100;reasons.push('Prerequisite not evidenced: '+unmet.join(', '));}
    // Two consecutive completed full lessons on one competency is a strong
    // reason to vary the next focus. Explicit learner objectives always win.
    if(!objectiveIds.includes(c.id) && recentLessonCompetencyIds.length>=2 &&
      recentLessonCompetencyIds.slice(-2).every(id=>id===c.id)) {
      score-=60;reasons.push('Practiced in two recent full lessons; rotate focus before later review');
    }
    const recent=attempts.filter(a=>a.competency_id===c.id).slice(-2);
    if(recent.length===2&&recent.every(a=>a.assessment==='needs_support')){score+=8;reasons.push('Repeated difficulty');}
    return {competency_id:c.id,can_do:c.can_do,score,blocked:unmet.length>0,
      prerequisite_ids:unmet,reasons,suggested_operation:due?'retrieval':
      evidence.status==='unassessed'?'diagnostic':evidence.status==='transferable'?'transfer':'guided_production'};
  });
  return rows.sort((a,b)=>Number(a.blocked)-Number(b.blocked)||b.score-a.score||a.competency_id.localeCompare(b.competency_id));
}
export function selectNextLearningGoal(input){return rankLearningPriorities(input).find(x=>!x.blocked)??null;}
