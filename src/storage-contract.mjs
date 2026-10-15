/**
 * Pure v2 Google Sheets row codec. No account, URL, network or user profile data.
 * Does not make Sheets operations atomic; connector agent handles lookup/readback.
 */
export const ATTEMPT_COLUMNS = Object.freeze([
  'attempt_id','occurred_at_utc','session_id','lesson_id','activity_id',
  'competency_id','activity_type','answer_or_summary','attempt_number',
  'hint_level','assessment','rubric_rationale','review_action','context_id','privacy_mode'
]);

export function encodeAttemptRow(attempt, {privacyMode='summary_only',summary=null}={}) {
  if (privacyMode === 'off') throw new Error('Persistent evidence consent not provided');
  if (!['raw','summary_only'].includes(privacyMode)) throw new Error('Unsupported privacy mode');
  if (privacyMode==='summary_only' && (typeof summary !== 'string' || summary.length<1)) {
    throw new Error('A consented non-verbatim summary is required');
  }
  if (privacyMode==='raw' && typeof attempt.answer !== 'string') throw new Error('Raw answer missing');
  const row={
    attempt_id:attempt.attempt_id,occurred_at_utc:attempt.occurred_at??'',
    session_id:attempt.session_id,lesson_id:attempt.lesson_id,activity_id:attempt.activity_id,
    competency_id:attempt.competency_id,activity_type:attempt.activity_type??'free_production',
    answer_or_summary:privacyMode==='raw'?attempt.answer:summary,
    attempt_number:attempt.attempt_number,hint_level:attempt.hint_level,
    assessment:attempt.assessment,rubric_rationale:attempt.rubric_rationale??'',
    review_action:attempt.review_action??'',context_id:attempt.context_id??'',
    privacy_mode:privacyMode
  };
  for (const col of ATTEMPT_COLUMNS) if (row[col] === undefined) throw new Error('Missing '+col);
  return ATTEMPT_COLUMNS.map(c=>row[c]);
}

/** Header mismatches are structural; fail closed instead of shifting data into wrong columns. */
export function verifyHeaders(found,expected=ATTEMPT_COLUMNS) {
  return Array.isArray(found) && found.length === expected.length
    && expected.every((h,i)=>found[i]===h);
}

/** Reads a v0.1 attempt but never silently upgrades its level/status. */
export function decodeLegacyAttemptRow(row) {
  if (!Array.isArray(row) || row.length<9) throw new Error('Legacy attempt row incomplete');
  const [id,at,lesson,activity,skill,type,prompt,answer,count,hint,outcome,feedback,review,session]=row;
  return {
    attempt_id:id,occurred_at:at||null,lesson_id:lesson,activity_id:activity,
    competency_id:skill,activity_type:type||'free_production',legacy_prompt:prompt,
    answer,attempt_number:Number(count),hint_level:hint||'unknown',
    assessment:outcome||'not_assessed',rubric_rationale:feedback||'',
    review_action:review||'',session_id:session,source_version:1
  };
}
