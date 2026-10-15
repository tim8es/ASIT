/**
 * Pure Google Sheets codec. The connector (not this library) owns user consent,
 * spreadsheet lookup, append and verified readback.
 */
export const ATTEMPT_COLUMNS = Object.freeze([
  'attempt_id','occurred_at_utc','session_id','lesson_id','activity_id',
  'competency_id','activity_type','answer_or_summary','attempt_number',
  'hint_level','assessment','rubric_rationale','review_action','context_id',
  'privacy_mode','observed_modality','observed_operation'
]);
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
export function verifyHeaders(found,expected=ATTEMPT_COLUMNS){
  return Array.isArray(found)&&found.length===expected.length
    &&expected.every((h,i)=>found[i]===h);
}
export function encodeAttemptRow(a,{privacyMode='summary_only',summary=null}={}){
  if(privacyMode==='off')throw new Error('Persistent evidence consent not provided');
  if(!['raw','summary_only'].includes(privacyMode))throw new Error('Unsupported privacy mode');
  if(privacyMode==='summary_only'&&!nonempty(summary))throw new Error('A consented non-verbatim summary is required');
  if(privacyMode==='raw'&&!nonempty(a.answer))throw new Error('Raw answer missing');
  const row={
    attempt_id:a.attempt_id,occurred_at_utc:a.occurred_at??'',
    session_id:a.session_id,lesson_id:a.lesson_id,activity_id:a.activity_id,
    competency_id:a.competency_id,activity_type:a.activity_type??'free_production',
    answer_or_summary:privacyMode==='raw'?a.answer:summary,
    attempt_number:a.attempt_number,hint_level:a.hint_level,assessment:a.assessment,
    rubric_rationale:a.rubric_rationale??'',review_action:a.review_action??'',
    context_id:a.context_id??'',privacy_mode:privacyMode,
    observed_modality:a.observed_modality??'unknown',
    observed_operation:a.observed_operation??'unknown'
  };
  for(const col of ATTEMPT_COLUMNS)if(row[col]===undefined)throw new Error('Missing '+col);
  return ATTEMPT_COLUMNS.map(x=>row[x]);
}
/** Restores privacy-safe usable evidence; NEVER substitutes summaries as learner quotes. */
export function decodeAttemptRow(row,headers=ATTEMPT_COLUMNS){
  if(!verifyHeaders(headers)||!Array.isArray(row)||row.length!==headers.length)throw new Error('Sheet schema mismatch');
  const o=Object.fromEntries(headers.map((h,i)=>[h,row[i]]));
  if(!['raw','summary_only'].includes(o.privacy_mode))throw new Error('Invalid privacy mode in stored attempt');
  const result={
    attempt_id:o.attempt_id,occurred_at:o.occurred_at_utc||null,session_id:o.session_id,
    lesson_id:o.lesson_id,activity_id:o.activity_id,competency_id:o.competency_id,
    activity_type:o.activity_type,attempt_number:Number(o.attempt_number),
    hint_level:o.hint_level,assessment:o.assessment,rubric_rationale:o.rubric_rationale,
    review_action:o.review_action,context_id:o.context_id,
    privacy_mode:o.privacy_mode,observed_modality:o.observed_modality||'unknown',
    observed_operation:o.observed_operation||'unknown'
  };
  if(o.privacy_mode==='raw')result.answer=o.answer_or_summary;
  else result.answer_summary=o.answer_or_summary;
  return result;
}
export function decodeLegacyAttemptRow(row){
  if(!Array.isArray(row)||row.length<9)throw new Error('Legacy attempt row incomplete');
  const [id,at,lesson,activity,skill,type,prompt,answer,count,hint,outcome,feedback,review,session]=row;
  return {
    attempt_id:id,occurred_at:at||null,lesson_id:lesson,activity_id:activity,
    competency_id:skill,activity_type:type||'free_production',legacy_prompt:prompt,
    answer,attempt_number:Number(count),hint_level:hint||'unknown',
    assessment:outcome||'not_assessed',rubric_rationale:feedback||'',
    review_action:review||'',session_id:session,source_version:1,
    observed_modality:'unknown',observed_operation:'unknown'
  };
}
