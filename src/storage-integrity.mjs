/** Read-only, privacy-minimal referential integrity checks for the v2 learner store.
 * Supply ONLY IDs, row numbers, modality/operation and privacy metadata.
 * Never send raw answers or personal names into diagnostics or GitHub.
 */
export function auditStorageIndex({competencyIds=[],sessionIds=[],activities=[],attempts=[]}={}){
 if(!Array.isArray(competencyIds)||!Array.isArray(sessionIds)||!Array.isArray(activities)||!Array.isArray(attempts))
  throw new Error('Invalid storage index inputs');
 const competencies=new Set(competencyIds),sessions=new Set(sessionIds);
 const activityIds=new Set(activities.map(x=>x.activity_id));
 const issues=[];
 const issue=(tab,row,code)=>issues.push({tab,row,code});
 for(const [tab,ids] of [['Competencies',competencyIds],['Sessions',sessionIds],['Activities',activities.map(x=>x.activity_id)],['Attempts',attempts.map(x=>x.attempt_id)]]){
   if(new Set(ids).size!==ids.length)issue(tab,0,'duplicate_id');
 }
 for(const activity of activities){
   const row=activity.row;
   if(!Number.isSafeInteger(row)||row<2)throw new Error('Invalid activity row number');
   if(!competencies.has(activity.competency_id))issue('Activities',row,'missing_competency');
   if(!sessions.has(activity.session_id))issue('Activities',row,'missing_session');
 }
 for(const attempt of attempts){
   const row=attempt.row;
   if(!Number.isSafeInteger(row)||row<2)throw new Error('Invalid attempt row number');
   if(!activityIds.has(attempt.activity_id))issue('Attempts',row,'missing_activity');
   if(!competencies.has(attempt.competency_id))issue('Attempts',row,'missing_competency');
   if(!sessions.has(attempt.session_id))issue('Attempts',row,'missing_session');
   if(!['raw','summary_only'].includes(attempt.privacy_mode))issue('Attempts',row,'missing_or_invalid_privacy_mode');
 }
 return {valid_for_full_restore:issues.length===0,issues,
   scanned:{competencies:competencyIds.length,sessions:sessionIds.length,activities:activities.length,attempts:attempts.length},
   remediation:'Review source evidence and obtain explicit consent before backup/repair; never guess an ID or privacy mode.'};
}
