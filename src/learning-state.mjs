/**
 * ASIT portable learning-state domain model.
 * No personal defaults, networking, clock or persistence dependencies.
 * The ChatGPT agent maps connector rows to and from this structure.
 */
export const STATE_VERSION = 2;
export const SKILL_STATUSES = Object.freeze([
  'unassessed','emerging','supported','independent','transferable'
]);
export const ASSESSMENTS = Object.freeze([
  'correct','partial','needs_support','not_assessed'
]);

const unique = values => new Set(values).size === values.length;
const nonempty = x => typeof x === 'string' && x.trim().length > 0;

export function createLearnerState({learnerId, targetLanguage, nativeLanguage = null,
  goals = [], availableMinutes = null, preferences = {}}) {
  if (!nonempty(learnerId) || !nonempty(targetLanguage)) throw new Error('Learner ID and target language are required');
  if (!Array.isArray(goals) || goals.some(g => !nonempty(g))) throw new Error('Invalid goals');
  if (availableMinutes !== null && (!Number.isInteger(availableMinutes) || availableMinutes < 1)) {
    throw new Error('Invalid session duration');
  }
  return {
    version: STATE_VERSION,
    profile: { learner_id: learnerId, target_language: targetLanguage,
      native_language: nativeLanguage, goals, available_minutes: availableMinutes,
      preferences, working_level: null, level_evidence: 'unassessed' },
    competencies: [], attempts: [], review_queue: [], sessions: [], learning_plan: [],
    revision: 0
  };
}

export function validateCompetencyMap(competencies) {
  if (!Array.isArray(competencies) || !unique(competencies.map(c => c.id))) throw new Error('Duplicate or invalid competencies');
  const ids = new Set(competencies.map(c => c.id));
  for (const c of competencies) {
    if (!nonempty(c.id) || !nonempty(c.can_do)
      || !Array.isArray(c.dependencies ?? []) || !Array.isArray(c.contexts ?? [])) {
      throw new Error('Malformed competency');
    }
    if ((c.dependencies ?? []).includes(c.id)) throw new Error('Self dependency: ' + c.id);
    for (const dep of c.dependencies ?? []) if (!ids.has(dep)) throw new Error('Unknown dependency: ' + dep);
    if (c.priority !== undefined && (!Number.isInteger(c.priority) || c.priority < 0 || c.priority > 5)) throw new Error('Invalid priority');
  }
  const visited = new Set(), active = new Set();
  const byId = new Map(competencies.map(c => [c.id,c]));
  const check = id => {
    if (active.has(id)) throw new Error('Competency dependency cycle at ' + id);
    if (visited.has(id)) return;
    active.add(id);
    for (const d of byId.get(id).dependencies ?? []) check(d);
    active.delete(id); visited.add(id);
  };
  for (const c of competencies) check(c.id);
  return true;
}

export function validateAttempt(attempt, competencies = []) {
  const required = ['attempt_id','session_id','lesson_id','activity_id','competency_id','answer','assessment'];
  if (!attempt || required.some(k => !nonempty(attempt[k]))) throw new Error('Incomplete attempt');
  if (!ASSESSMENTS.includes(attempt.assessment)) throw new Error('Unsupported assessment');
  if (!Number.isInteger(attempt.attempt_number) || attempt.attempt_number < 1) throw new Error('Invalid attempt number');
  if (!['none','minimal','frame','model','unknown'].includes(attempt.hint_level)) throw new Error('Invalid hint level');
  if (competencies.length && !competencies.some(c => c.id === attempt.competency_id)) throw new Error('Unrecognized competency');
  if (attempt.occurred_at && !Number.isFinite(Date.parse(attempt.occurred_at))) throw new Error('Invalid timestamp');
  return true;
}

/** Reducer: deterministic, no storage calls, safe replay. Conflicts do not overwrite evidence. */
export function applyAttempt(state, attempt) {
  if (state.version !== STATE_VERSION) throw new Error('Migrate state first');
  validateAttempt(attempt,state.competencies);
  const prior = state.attempts.find(a => a.attempt_id === attempt.attempt_id);
  if (prior) {
    const fields = ['competency_id','answer','assessment','session_id','activity_id'];
    if (fields.some(k => prior[k] !== attempt[k])) throw new Error('Attempt ID collision with conflicting data');
    return {state, status:'duplicate'};
  }
  return {state: {...state, attempts:[...state.attempts,structuredClone(attempt)],revision:state.revision+1},status:'added'};
}

/** Only observed evidence contributes. Confidence is ordinal, not psychometric probability. */
export function summarizeCompetency(attempts, competencyId) {
  const relevant = attempts.filter(a=>a.competency_id === competencyId && a.assessment !== 'not_assessed');
  if (!relevant.length) return {status:'unassessed', evidence_count:0, contexts:0, sessions:0, confidence:'insufficient'};
  const independent = relevant.filter(a=>a.assessment === 'correct' && a.hint_level === 'none');
  const contexts = new Set(independent.map(a=>a.context_id || a.activity_id));
  const sessions = new Set(independent.map(a=>a.session_id));
  const hasTransfer = independent.length>=2 && contexts.size>=2 && sessions.size>=2;
  let status='emerging';
  if (hasTransfer) status='transferable';
  else if (independent.length) status='independent';
  else if (relevant.some(a=>a.assessment === 'correct' || a.assessment === 'partial')) status='supported';
  return {status, evidence_count:relevant.length, contexts:contexts.size, sessions:sessions.size,
    confidence:hasTransfer ? 'developing' : 'limited'};
}

export function scheduleReview({outcome,hintLevel='none',previousSuccessfulReviews=0,nowIso}) {
  if (!Number.isFinite(Date.parse(nowIso))) throw new Error('Reliable current time required');
  if (!['correct','partial','needs_support','not_assessed'].includes(outcome)) throw new Error('Invalid outcome');
  if (outcome==='not_assessed') return null;
  const days = outcome !== 'correct' || ['model','frame'].includes(hintLevel)
    ? 1 : [2,4,7,14,21][Math.min(4,Math.max(0,Math.floor(previousSuccessfulReviews)))];
  return new Date(Date.parse(nowIso)+days*86400000).toISOString();
}
