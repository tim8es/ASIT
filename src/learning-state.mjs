/**
 * ASIT learner-state domain model. Pure, deterministic and profile-independent.
 * Progress labels describe OBSERVED evidence only; never use them as CEFR scores.
 */
export const STATE_VERSION = 2;
export const SKILL_STATUSES = Object.freeze(['unassessed','emerging','supported','independent','transferable']);
export const ASSESSMENTS = Object.freeze(['correct','partial','needs_support','not_assessed']);
export const HINT_LEVELS = Object.freeze(['none','minimal','frame','model','unknown']);
export const MODALITIES = Object.freeze(['typed_text','spoken_audio','audio_comprehension','reading_text','unknown']);
export const OPERATIONS = Object.freeze(['production','interaction','recognition','comprehension','unknown']);
const nonempty = x => typeof x === 'string' && x.trim().length > 0;

export function createLearnerState({learnerId,targetLanguage,nativeLanguage=null,goals=[],availableMinutes=null,preferences={},adaptiveProfile={}}) {
  if (!nonempty(learnerId) || !nonempty(targetLanguage)) throw new Error('Learner ID and target language are required');
  if (!Array.isArray(goals) || goals.some(g=>!nonempty(g))) throw new Error('Invalid goals');
  if (!adaptiveProfile || typeof adaptiveProfile!=='object' || Array.isArray(adaptiveProfile)) throw new Error('Invalid adaptive profile');
  if (availableMinutes!==null && (!Number.isInteger(availableMinutes)||availableMinutes<1)) throw new Error('Invalid duration');
  return {version:STATE_VERSION,profile:{learner_id:learnerId,target_language:targetLanguage,native_language:nativeLanguage,
    goals,available_minutes:availableMinutes,preferences,working_level:null,level_evidence:'unassessed'},
    competencies:[],attempts:[],review_queue:[],sessions:[],learning_plan:[],adaptive_profile:structuredClone(adaptiveProfile),revision:0};
}

export function validateCompetencyMap(competencies) {
  if (!Array.isArray(competencies)) throw new Error('Competencies must be an array');
  const ids=competencies.map(c=>c?.id);
  if (new Set(ids).size!==ids.length) throw new Error('Duplicate competencies');
  const byId=new Map(competencies.map(c=>[c.id,c]));
  for(const c of competencies) {
    if (!nonempty(c.id)||!nonempty(c.can_do)||!Array.isArray(c.dependencies??[])||!Array.isArray(c.contexts??[])) throw new Error('Malformed competency');
    if(c.required_modality!==undefined&&!MODALITIES.includes(c.required_modality)) throw new Error('Invalid required_modality');
    if(c.required_operation!==undefined&&!OPERATIONS.includes(c.required_operation)) throw new Error('Invalid required_operation');
    if(c.priority!==undefined&&(!Number.isInteger(c.priority)||c.priority<0||c.priority>5)) throw new Error('Invalid priority');
    for(const d of c.dependencies??[]) if(!byId.has(d)) throw new Error('Unknown dependency: '+d);
  }
  const active=new Set(),done=new Set();
  function visit(id){
    if(active.has(id))throw new Error('Competency dependency cycle at '+id);
    if(done.has(id))return;
    active.add(id);
    for(const d of byId.get(id).dependencies??[])visit(d);
    active.delete(id);done.add(id);
  }
  for(const c of competencies)visit(c.id);
  return true;
}

export function validateAttempt(a,competencies=[]) {
  const required=['attempt_id','session_id','lesson_id','activity_id','competency_id','assessment'];
  if(!a||typeof a!=='object'||required.some(k=>!nonempty(a[k]))||(!nonempty(a.answer)&&!nonempty(a.answer_summary))) throw new Error('Incomplete attempt');
  if(!ASSESSMENTS.includes(a.assessment))throw new Error('Unsupported assessment');
  if(!Number.isInteger(a.attempt_number)||a.attempt_number<1)throw new Error('Invalid attempt number');
  if(!HINT_LEVELS.includes(a.hint_level))throw new Error('Invalid hint level');
  if(a.observed_modality!==undefined&&!MODALITIES.includes(a.observed_modality))throw new Error('Invalid modality');
  if(a.observed_operation!==undefined&&!OPERATIONS.includes(a.observed_operation))throw new Error('Invalid operation');
  if(competencies.length&&!competencies.some(c=>c.id===a.competency_id))throw new Error('Unrecognized competency');
  if(a.occurred_at && (!Number.isFinite(Date.parse(a.occurred_at))||!/\d{4}-\d\d-\d\dT/.test(a.occurred_at)))throw new Error('Invalid timestamp');
  return true;
}

export function applyAttempt(state,attempt) {
  if(state.version!==STATE_VERSION)throw new Error('Migrate state first');
  validateAttempt(attempt,state.competencies);
  const prior=state.attempts.find(a=>a.attempt_id===attempt.attempt_id);
  if(prior){
    // A summary-only persisted row cannot prove which raw text was originally typed.
    // Fail closed on replay: never append another row, never pretend the answer matches.
    if(!nonempty(prior.answer)&&nonempty(prior.answer_summary)&&nonempty(attempt.answer)){
      const invariants=['session_id','lesson_id','activity_id','competency_id','assessment','attempt_number'];
      if(invariants.some(k=>prior[k]!==attempt[k]))throw new Error('Attempt ID collision with conflicting metadata');
      return {state,status:'duplicate_unverified'};
    }
    // Check all supplied stored evidence, not a subset that could hide grade changes.
    if(JSON.stringify(sortObject(prior))!==JSON.stringify(sortObject(attempt)))throw new Error('Attempt ID collision with conflicting data');
    return {state,status:'duplicate'};
  }
  return {state:{...state,attempts:[...state.attempts,structuredClone(attempt)],revision:state.revision+1},status:'added'};
}
function sortObject(x) {
  if(Array.isArray(x))return x.map(sortObject);
  if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,sortObject(x[k])]));
  return x;
}

function matchesEvidence(a,c) {
  const modality=c.required_modality;
  const operation=c.required_operation;
  // Never silently upgrade spoken/listening competencies based on text or MCQ.
  if(modality && a.observed_modality!==modality)return false;
  if(operation && a.observed_operation!==operation)return false;
  // If competency does not specify a domain, a submitted recognition/MCQ exercise
  // can be scored for that exercise but cannot imply broad productive transfer.
  return true;
}

/**
 * Ordinal evidence, scoped by modality and operation when specified.
 * Later independent failure revokes the current "transferable" label, but
 * preserves the entire historical record for human review.
 */
export function summarizeCompetency(attempts,competencyId,competency={}) {
  const all=attempts.filter(a=>a.competency_id===competencyId && a.assessment!=='not_assessed');
  const relevant=all.filter(a=>matchesEvidence(a,competency));
  if(!relevant.length)return {status:'unassessed',evidence_count:0,excluded_count:all.length,contexts:0,sessions:0,confidence:'insufficient'};
  const independent=relevant.filter(a=>a.assessment==='correct'&&a.hint_level==='none');
  const contexts=new Set(independent.map(a=>a.context_id||a.activity_id));
  const sessions=new Set(independent.map(a=>a.session_id));
  // Unknown or recognition-only responses do not prove communicative transfer.
  const transferable=independent.length>=2 && contexts.size>=2 && sessions.size>=2 &&
    independent.every(a=>a.observed_operation!=='recognition'&&a.observed_operation!=='unknown');
  const latest=relevant[relevant.length-1];
  const latestIndependent=[...relevant].reverse().find(a=>a.hint_level==='none');
  const hasRecentFailure=Boolean(latestIndependent&&latestIndependent.assessment!=='correct');
  let status='emerging';
  if(transferable&&!hasRecentFailure)status='transferable';
  else if(independent.length&&!hasRecentFailure)status='independent';
  else if(relevant.some(a=>a.assessment==='partial'||a.assessment==='correct'))status='supported';
  return {status,evidence_count:relevant.length,excluded_count:all.length-relevant.length,
    contexts:contexts.size,sessions:sessions.size,confidence:status==='transferable'?'developing':'limited',
    latest_assessment:latest.assessment};
}

export function scheduleReview({outcome,hintLevel='none',previousSuccessfulReviews=0,nowIso}) {
  if(!nowIso||!Number.isFinite(Date.parse(nowIso)))throw new Error('Reliable current time required');
  if(!ASSESSMENTS.includes(outcome))throw new Error('Invalid outcome');
  if(!HINT_LEVELS.includes(hintLevel))throw new Error('Invalid hint level');
  if(!Number.isInteger(previousSuccessfulReviews)||previousSuccessfulReviews<0)throw new Error('Invalid review count');
  if(outcome==='not_assessed')return null;
  const days=outcome!=='correct'||hintLevel!=='none' ? 1 : [2,4,7,14,21][Math.min(4,previousSuccessfulReviews)];
  return new Date(Date.parse(nowIso)+days*86400000).toISOString();
}
