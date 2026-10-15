/**
 * ASIT learner-state hydration from provider-returned v2 Sheets values.
 * Pure reference implementation: ChatGPT follows the same checks through its
 * connected Google Drive tools, not by silently executing this source file.
 * Never put a real workbook ID or learner content in this repository.
 */
import template from '../templates/tracker-v2.json' with {type:'json'};
import {decodeAttemptRow} from './storage-contract.mjs';
import {createLearnerState,validateCompetencyMap,validateAttempt} from './learning-state.mjs';

const requiredKeys=['schema_version','state_revision','learner_id','target_language','recording_consent'];
const nonempty=x=>typeof x==='string' && x.trim().length>0;
const inSet=(v,allowed)=>allowed.includes(v);
const byId=(items,key,kind)=>{
  const ids=items.map(x=>x[key]);
  if(ids.some(x=>!nonempty(x))||new Set(ids).size!==ids.length)throw new Error('Duplicate or empty '+kind+' ID');
  return items;
};
function parseJson(s,where){
  if(!nonempty(s))throw new Error('Missing JSON in '+where);
  try{return JSON.parse(s);}catch{throw new Error('Malformed JSON in '+where);}
}
function tableRows(tables,tab){
  const spec=template.tabs.find(s=>s.name===tab);
  if(!spec)throw new Error('Unrecognized tab '+tab);
  const raw=tables?.[tab];
  if(!Array.isArray(raw)||!Array.isArray(raw[0]))throw new Error('Missing tab '+tab);
  const head=raw[0];
  if(head.length!==spec.columns.length||!spec.columns.every((s,i)=>head[i]===s))
    throw new Error('Schema mismatch in '+tab);
  return raw.slice(1).filter(r=>Array.isArray(r)&&r.some(x=>String(x??'').trim().length>0)).map((r,i)=>{
    if(r.length>head.length)throw new Error('Oversized row '+tab+'#'+(i+2));
    const pad=[...r,...Array(head.length-r.length).fill('')];
    return Object.fromEntries(head.map((k,j)=>[k,pad[j]]));
  });
}
function toArray(json,where){
  const arr=parseJson(json,where);
  if(!Array.isArray(arr)||arr.some(x=>!nonempty(x)))throw new Error('Invalid ID list '+where);
  return arr;
}
function parseConfig(rows){
  const keys=new Map();
  for(const r of rows){
    if(!nonempty(r.key)||keys.has(r.key))throw new Error('Duplicate/empty config key');
    keys.set(r.key,parseJson(String(r.json_value),'Config.'+r.key));
  }
  for(const key of requiredKeys)if(!keys.has(key))throw new Error('Missing Config.'+key);
  if(keys.get('schema_version')!==2)throw new Error('Incompatible schema version');
  if(!Number.isSafeInteger(keys.get('state_revision'))||keys.get('state_revision')<0)throw new Error('Invalid revision');
  if(!nonempty(keys.get('learner_id'))||!nonempty(keys.get('target_language')))throw new Error('Incomplete learner setup');
  if(!inSet(keys.get('recording_consent'),['off','summary_only','raw']))throw new Error('Invalid consent setting');
  return keys;
}
export function hydrateWorkbook(tables){
  // Verify all tab headers BEFORE interpreting any untrusted cell content.
  const rows=Object.fromEntries(template.tabs.map(t=>[t.name,tableRows(tables,t.name)]));
  const cfg=parseConfig(rows.Config);
  const goals=byId(rows.Goals.map(r=>({
    id:String(r.goal_id),description:String(r.description),
    priority:r.priority===''?null:Number(r.priority),status:String(r.status)
  })),'id','goal');
  for(const g of goals)if(!nonempty(g.description)|| (g.priority!==null&&(!Number.isInteger(g.priority)||g.priority<0||g.priority>5)))
    throw new Error('Malformed goal');
  const comps=byId(rows.Competencies.map(r=>({
    id:String(r.competency_id),can_do:String(r.can_do),
    dependencies:toArray(r.dependency_ids_json,'Competencies.dependencies.'+r.competency_id),
    priority:r.priority===''?undefined:Number(r.priority),
    cefr_reference:r.cefr_reference||null,
    required_modality:String(r.required_modality),
    required_operation:String(r.required_operation)
  })),'id','competency');
  validateCompetencyMap(comps);
  const acts=byId(rows.Activities.map(r=>({
    id:String(r.activity_id),lesson_id:String(r.lesson_id),session_id:String(r.session_id),
    competency_id:String(r.competency_id),type:String(r.activity_type),
    prompt:String(r.prompt),rubric:parseJson(r.rubric_json,'Activities.rubric.'+r.activity_id),
    status:String(r.status),
    modality:String(r.observed_modality),
    operation:String(r.observed_operation)
  })),'id','activity');
  for(const a of acts){
    if(!comps.some(c=>c.id===a.competency_id)||!nonempty(a.prompt)||!nonempty(a.lesson_id)||
      !['typed_text','spoken_audio','audio_comprehension','reading_text','unknown'].includes(a.modality)||
      !['production','interaction','recognition','comprehension','unknown'].includes(a.operation))
      throw new Error('Invalid activity reference '+a.id);
    if(!a.rubric||typeof a.rubric!=='object'||Array.isArray(a.rubric))
      throw new Error('Invalid activity rubric '+a.id);
  }
  const attempts=byId(rows.Attempts.map(r=>{
    const spec=template.tabs.find(t=>t.name==='Attempts').columns;
    return decodeAttemptRow(spec.map(h=>r[h]),spec);
  }),'attempt_id','attempt');
  const byActivity=new Map(acts.map(x=>[x.id,x]));
  for(const a of attempts){
    validateAttempt(a,comps);
    const act=byActivity.get(a.activity_id);
    if(!act||a.lesson_id!==act.lesson_id||a.session_id!==act.session_id||
      a.competency_id!==act.competency_id||
      a.observed_modality!==act.modality||a.observed_operation!==act.operation)
      throw new Error('Attempt refers to missing/different trusted activity '+a.attempt_id);
    // JSON fields from the learner are never a trusted rubric or a permission to write.
  }
  const reviews=byId(rows.Reviews.map(r=>({
    id:String(r.review_id),competency_id:String(r.competency_id),content_or_pattern:String(r.content_or_pattern),
    due_at:String(r.due_at_utc),success_count:r.success_count===''?0:Number(r.success_count),
    last_outcome:String(r.last_outcome),status:String(r.status)
  })),'id','review');
  for(const r of reviews)if(!comps.some(c=>c.id===r.competency_id)||!Number.isSafeInteger(r.success_count)||r.success_count<0)
    throw new Error('Malformed review '+r.id);
  const plans=byId(rows.Plans.map(r=>({
    id:String(r.plan_id),revision:Number(r.revision),
    goal_ids:toArray(r.goal_ids_json,'Plans.goals.'+r.plan_id),
    competency_ids:toArray(r.competency_ids_json,'Plans.competencies.'+r.plan_id),
    rationale:String(r.rationale),status:String(r.status)
  })),'id','plan');
  for(const p of plans){
    if(!Number.isSafeInteger(p.revision)||p.revision<0)throw new Error('Invalid plan revision');
    if(p.goal_ids.some(x=>!goals.some(y=>y.id===x))||p.competency_ids.some(x=>!comps.some(y=>y.id===x)))
      throw new Error('Plan contains unknown goal or competency');
  }
  const sessions=byId(rows.Sessions.map(r=>({
    id:String(r.session_id),started_at:r.started_at_utc||null,
    ended_at:r.ended_at_utc||null,summary:String(r.summary),next_step:String(r.next_step),
    attempt_ids:toArray(r.attempt_ids_json,'Sessions.attempts.'+r.session_id)
  })),'id','session');
  for(const s of sessions)if(s.attempt_ids.some(x=>!attempts.some(a=>a.attempt_id===x)))
    throw new Error('Session references unavailable attempt');
  const profile=createLearnerState({
    learnerId:cfg.get('learner_id'),targetLanguage:cfg.get('target_language'),
    nativeLanguage:cfg.get('native_language')??null,
    goals:goals.filter(g=>!['archived','cancelled'].includes(g.status)).map(g=>g.description),
    availableMinutes:cfg.get('preferred_minutes')??null,
    preferences:cfg.get('feedback_preferences')??{},
    adaptiveProfile:cfg.get('adaptive_profile')??{}
  });
  profile.profile.working_level=cfg.get('working_cefr')??null;
  profile.profile.level_evidence=cfg.get('cefr_confidence_label')??'unassessed';
  return {
    ...profile,competencies:comps,attempts,review_queue:reviews,
    sessions,learning_plan:plans,revision:cfg.get('state_revision'),
    source:{schema_version:2,recording_consent:cfg.get('recording_consent'),restored:true},
    // The active prompt/rubric registry is separate from the learner state.
    activities:acts
  };
}
