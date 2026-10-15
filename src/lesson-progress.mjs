/**
 * Learner-facing lesson counters. Technical lesson IDs are opaque, and retries,
 * diagnostics and superseded drafts do not increment the lesson ordinal.
 * Works with already consented private tracker rows; never exports them.
 */
const FULL_ACTIVITY_TYPES=new Set(['five_part_lesson','five_part_integrated_lesson','composite_lesson']);
const ASSESSED=new Set(['correct','partial','needs_support']);
function rubricsItems(activity) {
  try {
    const rubric=typeof activity.rubric_json==='string'
      ? JSON.parse(activity.rubric_json) : activity.rubric_json;
    return Array.isArray(rubric?.items)?rubric.items.length:0;
  } catch {return 0;}
}
function isFull(activity) {
  return FULL_ACTIVITY_TYPES.has(activity.activity_type) &&
    activity.status!=='superseded' && activity.status!=='cancelled' &&
    rubricsItems(activity)>=2;
}
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
/** Count one finished session per completed full packet, not individual attempts. */
export function summarizeLessonProgress({sessions=[],activities=[],attempts=[]}={}) {
  if (![sessions,activities,attempts].every(Array.isArray))
    throw new Error('Expected bounded tracker rows');
  const full=activities.filter(isFull);
  const completed=new Set();
  const pending=new Set();
  for (const session of sessions) {
    if (!nonempty(session.session_id)) continue;
    const candidates=full.filter(a=>a.session_id===session.session_id);
    if (!candidates.length) continue;
    const hasAssessed=candidates.some(activity=>attempts.some(attempt=>
      attempt.activity_id===activity.activity_id &&
      attempt.session_id===session.session_id &&
      ASSESSED.has(attempt.assessment)));
    if (hasAssessed && nonempty(session.ended_at_utc)) completed.add(session.session_id);
    else if (!nonempty(session.ended_at_utc)) pending.add(session.session_id);
  }
  return {completed_full_lessons:completed.size,
    next_full_lesson_number:completed.size+1,
    pending_full_lessons:pending.size};
}
