/**
 * Honest learner-visible lesson counters and recent-focus derivation.
 * Compatible with both raw tracker rows and normalized hydrated state.
 * A technical ID never establishes which full lesson is next.
 */
const FULL_TYPES=new Set(['five_part_lesson','five_part_integrated_lesson','composite_lesson']);
const ASSESSED=new Set(['correct','partial','needs_support']);
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
const sessionId=x=>x.session_id??x.id;
const ended=x=>x.ended_at_utc??x.ended_at;
const activityId=x=>x.activity_id??x.id;
function rubricItems(activity) {
  try {
    const input=activity.rubric_json??activity.rubric;
    const rubric=typeof input==='string'?JSON.parse(input):input;
    return Array.isArray(rubric?.items)?rubric.items.length:0;
  }catch{return 0;}
}
function isFull(activity) {
  return FULL_TYPES.has(activity.activity_type??activity.type) &&
    !['superseded','cancelled'].includes(activity.status) && rubricItems(activity)>=2;
}
function gather({sessions=[],activities=[],attempts=[]}={}) {
  if(![sessions,activities,attempts].every(Array.isArray))
    throw new Error('Expected bounded tracker rows');
  const full=activities.filter(isFull);
  return sessions.flatMap(session=>{
    const id=sessionId(session);
    if(!nonempty(id))return [];
    const candidates=full.filter(x=>x.session_id===id);
    if(candidates.length===0)return [];
    const scored=candidates.find(activity=>attempts.some(a=>
      a.session_id===id && a.activity_id===activityId(activity) &&
      ASSESSED.has(a.assessment)));
    const at=ended(session);
    const complete=Boolean(scored&&nonempty(at));
    const pending=!nonempty(at);
    return [{id,ended_at:at,complete,pending,focus:scored?.competency_id??null}];
  });
}
export function summarizeLessonProgress(input={}) {
  const records=gather(input);
  const completed=new Set(records.filter(x=>x.complete).map(x=>x.id));
  const pending=new Set(records.filter(x=>x.pending).map(x=>x.id));
  return {completed_full_lessons:completed.size,
    next_full_lesson_number:completed.size+1,
    pending_full_lessons:pending.size};
}
/** Oldest to newest, only from verifiably complete multi-item lessons. */
export function deriveRecentCompletedLessonFocuses(input={},limit=2) {
  if(!Number.isInteger(limit)||limit<1||limit>20)throw new Error('Invalid focus limit');
  return gather(input)
    .filter(x=>x.complete&&nonempty(x.focus)&&Number.isFinite(Date.parse(x.ended_at)))
    .sort((a,b)=>Date.parse(a.ended_at)-Date.parse(b.ended_at))
    .slice(-limit).map(x=>x.focus);
}
