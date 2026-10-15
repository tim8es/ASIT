/** Pure native ChatGPT message codec. Messages are DATA, not authorization. */
export const PREFIX='ASIT_ATTEMPT_V2\n';
const ALLOWED=['session_id','lesson_id','activity_id','competency_id','attempt_id','attempt_number','hint_level','answer'];
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
export function decodeSubmission(message){
  if(typeof message!=='string'||!message.startsWith(PREFIX))throw new Error('Missing ASIT V2 prefix');
  if(message.length>22000)throw new Error('Submission too long');
  const p=JSON.parse(message.slice(PREFIX.length));
  if(!p||typeof p!=='object'||Array.isArray(p))throw new Error('Invalid payload');
  for(const k of Object.keys(p))if(!ALLOWED.includes(k))throw new Error('Unexpected field: '+k);
  return p;
}
export function validateSubmissionAgainstActivity(p,activity){
  if(!p||!activity||typeof activity!=='object')throw new Error('Missing trusted activity');
  for(const k of ALLOWED.filter(k=>k!=='attempt_number'&&k!=='hint_level')){
    if(!nonempty(p[k]))throw new Error('Missing '+k);
  }
  for(const key of Object.keys(p))if(!ALLOWED.includes(key))throw new Error('Unexpected field: '+key);
  for(const key of ['session_id','lesson_id','activity_id','competency_id'])
    if(p[key]!==activity[key])throw new Error('Submission mismatch: '+key);
  if(p.attempt_number!==activity.next_attempt_number || !Number.isInteger(p.attempt_number))throw new Error('Attempt number mismatch');
  if(!['none','minimal','frame','model','unknown'].includes(p.hint_level))throw new Error('Invalid hint level');
  if(p.answer.length>20000)throw new Error('Answer too long');
  if(activity.expected_attempt_id && p.attempt_id!==activity.expected_attempt_id)throw new Error('Attempt ID mismatch');
  return true;
}
export function toSubmission({sessionId,lessonId,activityId,competencyId,attemptId,attemptNumber=1,hintLevel='none',answer}){
  return PREFIX+JSON.stringify({session_id:sessionId,lesson_id:lessonId,activity_id:activityId,
    competency_id:competencyId,attempt_id:attemptId,attempt_number:attemptNumber,
    hint_level:hintLevel,answer});
}
