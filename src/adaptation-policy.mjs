/**
 * Universal adaptation strategy. Its output is learner-specific private state.
 * Never mutate a generic Project source for one learner's difficulty or feedback.
 */
import {validateCompetencyMap} from './learning-state.mjs';
const asArray=x=>Array.isArray(x)?x:[];
const validId=s=>typeof s==='string'&&s.trim().length>0;
export function recommendAdjustment({competency,attempts=[],stateRevision=0}){
 validateCompetencyMap([...(competency.dependencies??[]).map(id=>({id,can_do:'Pre-existing dependency'})),competency]);
 if(!Number.isSafeInteger(stateRevision)||stateRevision<0)throw new Error('Invalid learner revision');
 const relevant=asArray(attempts).filter(a=>a.competency_id===competency.id&&
  (!competency.required_modality||a.observed_modality===competency.required_modality)&&
  (!competency.required_operation||a.observed_operation===competency.required_operation)&&
  a.assessment!=='not_assessed');
 const recent=relevant.slice(-3);
 const two=recent.slice(-2);
 let action='diagnose',rationale='No verified scoped performance';
 if(relevant.length){
  action='maintain';
  rationale='Insufficient repeated independent evidence to change challenge';
 }
 if(two.length===2&&two.every(a=>a.assessment==='needs_support')){
  action='increase_support';rationale='Two recent scoped attempts still need support';
 }else if(two.length===2&&two.every(a=>a.assessment==='correct'&&a.hint_level==='none')&&
  new Set(two.map(a=>a.session_id)).size===2&&
  new Set(two.map(a=>a.context_id??a.activity_id)).size===2&&
  two.every(a=>a.observed_operation!=='recognition'&&a.observed_operation!=='unknown')){
  action='offer_stretch';rationale='Two independent successes in different sessions and contexts';
 }else if(relevant.at(-1)?.hint_level==='model'||relevant.at(-1)?.assessment==='needs_support'){
  action='increase_support';rationale='Latest relevant attempt used a full model or needs support';
 }
 return {competency_id:competency.id,action,rationale,state_revision:stateRevision,
  evidence_attempt_ids:recent.map(x=>x.attempt_id).filter(validId),
  // Action is guidance, NOT a CEFR level, mastery claim or forced user preference.
  learner_confirmed:false};
}
/**
 * Persist a compact rationale in private Config.adaptive_profile only after
 * consent. Keep explicit user preferences separate from observed adjustments.
 */
export function applyAdjustmentToPrivateProfile(profile,decision){
 if(!profile||typeof profile!=='object'||Array.isArray(profile))
   throw new Error('Invalid private adaptive profile');
 if(!decision||!validId(decision.competency_id)||!validId(decision.action)||
    !Number.isInteger(decision.state_revision)||!Array.isArray(decision.evidence_attempt_ids))
   throw new Error('Invalid adaptation decision');
 const previous=asArray(profile.recent_decisions);
 const entry={competency_id:decision.competency_id,action:decision.action,
  reason:decision.rationale,evidence_attempt_ids:decision.evidence_attempt_ids.slice(-3),
  basis_revision:decision.state_revision};
 return {...profile,recent_decisions:[...previous,entry].slice(-4)};
}
