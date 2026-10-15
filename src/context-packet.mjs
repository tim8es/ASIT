/**
 * Compact, purpose-built lesson context. The real ChatGPT runtime uses bounded
 * connector reads and this reference policy; this JS isn't automatically loaded.
 * Never include raw learner answers, full workbook dumps or unrelated activities.
 */
const plain=x=>typeof x==='string'?x:String(x??'');
const compact=(x,n=200)=>plain(x).slice(0,n);
const safeTime=x=>Number.isFinite(Date.parse(x??''))?Date.parse(x):0;

export function planContextReads({intent='lesson',focusCompetencyIds=[]}={}){
 if(!['lesson','submission','quick_answer','history_audit','setup'].includes(intent))
   throw new Error('Unknown context intent');
 const base={intent,focus_competency_ids:[...new Set(focusCompetencyIds)].slice(0,5),
   require_source:'ASIT-ENGINE.md',requires_full_history:false};
 if(intent==='quick_answer')return {...base,reads:[],note:'Skip learner store unless actual question requires personalization'};
 if(intent==='setup')return {...base,reads:['Config schema/consent keys','Active Goals and Plans',
   'Competency headers and selected diagnostics'],note:'Read storage adapter only for consented creation or writes'};
 if(intent==='submission')return {...base,reads:['Config consent/revision',
   'Activities exact submitted ID and original rubric','Attempts exact submitted ID',
   'Append and verify consented row'],note:'Never fetch the entire Attempts table'};
 if(intent==='history_audit')return {...base,requires_full_history:true,
   reads:['Config revision','Relevant Skills and paginated history by competency/date'],
   note:'Explicit analytical request: page; disclose incomplete coverage'};
 return {...base,reads:['Config version, consent, revision and adaptive_profile',
   'Active Goals and latest Plan','Latest Session summary','Due Reviews (top 3)',
   'Relevant Competencies (up to 5)','Latest scoped Attempts (up to 6)'],
   note:'Two-phase narrow read; exact Activity lookup only on submission'};
}
function list(x){return Array.isArray(x)?x:[]}
function selectSkills(state,focusIds,maxSkills){
 const all=list(state.competencies);
 const chosen=focusIds?.length?focusIds:(
   list(state.learning_plan).filter(p=>p.status==='active'||p.status===undefined)
      .sort((a,b)=>(b.revision??0)-(a.revision??0))[0]?.competency_ids??[]);
 const ids=[...new Set(chosen)].filter(id=>all.some(c=>c.id===id));
 const prioritized=ids.length?ids:all.slice().sort((a,b)=>(b.priority??0)-(a.priority??0)).map(x=>x.id);
 return prioritized.slice(0,maxSkills).map(id=>all.find(c=>c.id===id));
}
const normalizePrefs=p=>{
 const x=(p&&typeof p==='object'&&!Array.isArray(p))?p:{};
 // These are individual learner choices/observations, NEVER engine presets.
 const keys=['feedback_style','desired_challenge','current_support','active_focus',
   'adaptation_reason','last_decision_evidence_ids'];
 return Object.fromEntries(keys.filter(k=>x[k]!==undefined).map(k=>{
  const v=x[k];
  return [k,Array.isArray(v)?v.slice(-3).map(e=>compact(e,80)):compact(v,180)];
 }));
};
function assemble(state,selected,attemptLimit,reviewLimit,sessionLimit){
 const focus=new Set(selected.map(x=>x.id));
 const relevant=list(state.attempts).filter(a=>focus.has(a.competency_id));
 const attempts=(attemptLimit===0?[]:relevant.slice(-attemptLimit)).map(a=>({
   attempt_id:compact(a.attempt_id,90),competency_id:compact(a.competency_id,90),
   assessment:compact(a.assessment,25),hint_level:compact(a.hint_level,20),
   observed_modality:compact(a.observed_modality??'unknown',35),
   observed_operation:compact(a.observed_operation??'unknown',35),
   // A summary is learner data; include only a short stored summary.
   // Do not accidentally pass a raw verbatim answer.
   answer_summary:compact(a.answer_summary??'',190),
   rubric_rationale:compact(a.rubric_rationale??'',140),
   session_id:compact(a.session_id,75)
 }));
 const review=list(state.review_queue).filter(r=>focus.has(r.competency_id)&&r.status!=='done')
   .sort((a,b)=>safeTime(a.due_at??a.due_at_utc)-safeTime(b.due_at??b.due_at_utc))
   .slice(0,reviewLimit).map(r=>({
     competency_id:compact(r.competency_id,75),due_at:compact(r.due_at??r.due_at_utc,35),
     content_or_pattern:compact(r.content_or_pattern,120),last_outcome:compact(r.last_outcome,32)
   }));
 const sessions=(sessionLimit===0?[]:list(state.sessions).slice(-sessionLimit)).map(s=>({
   session_id:compact(s.id??s.session_id,75),summary:compact(s.summary,220),
   next_step:compact(s.next_step,160)
 }));
 const profile=state.profile??{};
 const plans=list(state.learning_plan);
 const active=plans.filter(p=>p.status==='active').sort((a,b)=>(b.revision??0)-(a.revision??0))[0];
 return {
   state_revision:state.revision,language:compact(profile.target_language,35),
   goals:list(profile.goals).slice(0,3).map(x=>compact(x,160)),
   learner_preferences:normalizePrefs(profile.preferences),
   adaptive_profile:{
     ...normalizePrefs(state.adaptive_profile),
     recent_decisions:list(state.adaptive_profile?.recent_decisions).slice(-2).map(d=>({
       competency_id:compact(d.competency_id,70),action:compact(d.action,40),
       reason:compact(d.reason,170),
       basis_revision:Number.isSafeInteger(d.basis_revision)?d.basis_revision:null,
       evidence_attempt_ids:list(d.evidence_attempt_ids).slice(-3).map(x=>compact(x,70))
     }))
   },
   plan:active?{revision:active.revision,reason:compact(active.rationale,180),
      competency_ids:list(active.competency_ids).slice(0,5).map(x=>compact(x,80))}:null,
   competencies:selected.map(c=>({
     id:compact(c.id,80),can_do:compact(c.can_do,190),
     required_modality:compact(c.required_modality??'unknown',32),
     required_operation:compact(c.required_operation??'unknown',32),
     // This is a STORED qualified label, not recomputed from a truncated sample.
     stored_status:compact(c.status??'unassessed',30),
     evidence_count:Number.isSafeInteger(c.evidence_count)?c.evidence_count:null,
     priority:c.priority??null
   })),
   reviews:review,latest_sessions:sessions,recent_attempt_evidence:attempts,
   coverage:{attempts_shown:attempts.length,
     attempts_omitted:Math.max(0,relevant.length-attempts.length),
     // Do not let a sample be treated as a complete history.
     is_full_learning_history:false,
     omitted_count_scope:'Only attempts present in the provided slice; complete workbook count not implied'}
 };
}
export function buildLessonContextPacket(state,{focusCompetencyIds=[],
  maxChars=6000,maxSkills=5,maxAttempts=6,maxReviews=3,maxSessions=1}={}){
 if(!state||!Number.isSafeInteger(state.revision)||state.revision<0||!state.profile?.target_language)
   throw new Error('State revision and target language are required');
 if(maxChars<1200||maxChars>30000||!Number.isInteger(maxChars))
   throw new Error('Unreasonable context budget');
 for(const n of [maxSkills,maxAttempts,maxReviews,maxSessions])
   if(!Number.isInteger(n)||n<0||n>10)throw new Error('Invalid slice limit');
 const selected=selectSkills(state,focusCompetencyIds,maxSkills);
 let a=maxAttempts,r=maxReviews,s=maxSessions;
 let packet=assemble(state,selected,a,r,s);
 while(JSON.stringify(packet).length>maxChars&&(a>0||r>0||s>0)){
  if(a>0)a--;else if(s>0)s--;else r--;
  packet=assemble(state,selected,a,r,s);
 }
 const chars=JSON.stringify(packet).length;
 if(chars>maxChars)throw new Error('Critical learner context exceeds budget; make a narrower query');
 return {packet,metrics:{serialized_chars:chars,conservative_token_proxy:Math.ceil(chars/3),
   token_proxy_kind:'characters/3, not a model tokenizer',budget_chars:maxChars,
   included_skills:packet.competencies.length,shown_attempts:packet.recent_attempt_evidence.length,
   omitted_attempts:packet.coverage.attempts_omitted}};
}
