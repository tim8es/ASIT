/** Offline reference: split one composite ChatGPT Submit into trusted, per-subtask
 * evidence. The running skills-only plugin must follow this policy via provider
 * tools; this source is NOT executed automatically by ChatGPT.
 */
const nonempty=s=>typeof s==='string'&&s.trim().length>0;
const assessments=new Set(['correct','partial','needs_support','not_assessed']);
const hintLevels=new Set(['none','minimal','frame','model','unknown']);
const modalities=new Set(['typed_text','spoken_audio','audio_comprehension','reading_text','unknown']);
const operations=new Set(['production','interaction','recognition','comprehension','unknown']);
function parseAnswers(raw){
 if(typeof raw!=='string'||raw.length>20000)throw new Error('Invalid composite payload');
 let object;try{object=JSON.parse(raw);}catch{throw new Error('Malformed composite answer');}
 if(!object||typeof object!=='object'||Array.isArray(object))throw new Error('Composite answer must be an object');
 for(const val of Object.values(object))if(typeof val!=='string')throw new Error('Subtask response must be text');
 return object;
}
export function splitCompositeAssessment({submission,trustedItems,evaluations}){
 if(!submission||!nonempty(submission.attempt_id)||!nonempty(submission.session_id)||
    !nonempty(submission.lesson_id)||!Number.isInteger(submission.attempt_number)||
    submission.attempt_number<1)throw new Error('Invalid parent attempt identity');
 if(!Array.isArray(trustedItems)||!trustedItems.length||!evaluations||typeof evaluations!=='object')
   throw new Error('Missing trusted per-task activities or teacher grading');
 const answers=parseAnswers(submission.answer);
 const ids=trustedItems.map(i=>i.task_id);
 if(ids.some(x=>!nonempty(x))||new Set(ids).size!==ids.length)
   throw new Error('Duplicate or empty trusted task ID');
 for(const key of Object.keys(answers))
   if(!ids.includes(key))throw new Error('Unknown subtask: '+key);
 const attempts=[],not_assessed=[];
 for(const item of trustedItems){
   if(!nonempty(item.activity_id)||!nonempty(item.competency_id)||
      !modalities.has(item.observed_modality)||!operations.has(item.observed_operation))
      throw new Error('Untrusted task scope');
   const response=answers[item.task_id];
   if(!nonempty(response)){if(item.required!==false)not_assessed.push(item.task_id);continue;}
   const grade=evaluations[item.task_id];
   if(!grade||!assessments.has(grade.assessment))
     throw new Error('Missing trusted evaluation for '+item.task_id);
   // Typed guesses cannot be counted as listening or spoken production.
   if(item.observed_modality==='audio_comprehension'&&
      (!grade.verified_hearing||!grade.media_source_verified)){
     not_assessed.push(item.task_id);continue;
   }
   if(item.observed_modality==='spoken_audio'&&!grade.verified_speech){
     not_assessed.push(item.task_id);continue;
   }
   if(grade.assessment==='not_assessed'){not_assessed.push(item.task_id);continue;}
   const hint=hintLevels.has(grade.verified_hint_level)?grade.verified_hint_level:'unknown';
   attempts.push({
     attempt_id:submission.attempt_id+'::'+encodeURIComponent(item.task_id),
     session_id:submission.session_id,lesson_id:submission.lesson_id,
     activity_id:item.activity_id,competency_id:item.competency_id,
     activity_type:item.activity_type||'free_production',answer:response,
     attempt_number:submission.attempt_number,hint_level:hint,
     assessment:grade.assessment,rubric_rationale:String(grade.rubric_rationale||''),
     observed_modality:item.observed_modality,observed_operation:item.observed_operation,
     context_id:String(item.context_id||submission.lesson_id)
   });
 }
 return {attempts,not_assessed,complete:not_assessed.length===0};
}
/** Store only bounded non-verbatim provenance in Events.metadata_json.
 * All UI-derived metadata remains explicitly unverified; no playback telemetry.
 */
export function buildAttemptProvenanceEvent({eventId,attemptId,revision,timestampUtc,privacyMode,observed={}}){
 if(!nonempty(eventId)||!nonempty(attemptId)||!Number.isSafeInteger(revision)||revision<0||
    !nonempty(timestampUtc)||!Number.isFinite(Date.parse(timestampUtc)))
   throw new Error('Invalid provenance event identity');
 if(!['summary_only','raw'].includes(privacyMode))throw new Error('Consent required');
 const data={
   ui_provenance:'self_report_unverified',
   first_attempt_assessment:assessments.has(observed.first_attempt_assessment)
     ?observed.first_attempt_assessment:'not_assessed',
   revision_count:Number.isSafeInteger(observed.revisions)&&observed.revisions>=0
     ?Math.min(observed.revisions,99):null,
   hint_exposure:hintLevels.has(observed.hint_exposure)?observed.hint_exposure:'unknown',
   playback_report:['heard_without_text','heard_with_text','could_not_hear','unknown'].includes(observed.playback_report)
     ?observed.playback_report:'unknown'
 };
 return [eventId,'attempt_provenance',attemptId,revision,timestampUtc,JSON.stringify(data)];
}
