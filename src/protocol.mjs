/**
 * Pure envelope helpers. An envelope is NOT authorization to modify external data.
 * The assistant must validate against its own trusted displayed activity first.
 */
export const PREFIX = 'ASIT_ATTEMPT_V2\n';
const trimString=x=>typeof x==='string'?x.trim():'';
export function decodeSubmission(message) {
  if (typeof message!=='string' || !message.startsWith(PREFIX)) throw new Error('Missing ASIT V2 prefix');
  const payload=JSON.parse(message.slice(PREFIX.length));
  if (!payload || typeof payload!=='object' || Array.isArray(payload)) throw new Error('Invalid payload');
  return payload;
}
export function validateSubmissionAgainstActivity(p,activity) {
  for (const key of ['attempt_id','session_id','lesson_id','activity_id','competency_id','answer']) {
    if (!trimString(p[key])) throw new Error('Missing '+key);
  }
  for (const key of ['session_id','lesson_id','activity_id','competency_id']) {
    if (p[key] !== activity[key]) throw new Error('Submission mismatch: '+key);
  }
  if (p.attempt_number !== activity.next_attempt_number) throw new Error('Attempt number mismatch');
  if (!['none','minimal','frame','model','unknown'].includes(p.hint_level)) throw new Error('Invalid hint level');
  if (typeof p.answer!=='string' || p.answer.length>20000) throw new Error('Answer is too long');
  return true;
}
export function toSubmission({sessionId,lessonId,activityId,competencyId,attemptId,
  attemptNumber=1,hintLevel='none',answer}) {
  return PREFIX + JSON.stringify({session_id:sessionId,lesson_id:lessonId,activity_id:activityId,
    competency_id:competencyId,attempt_id:attemptId,attempt_number:attemptNumber,
    hint_level:hintLevel,answer});
}
