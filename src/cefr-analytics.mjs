/**
 * ASIT CEFR analytics v1. Offline deterministic reference used for tests.
 * Skills-only ChatGPT packages do not execute this module automatically.
 * Indicators are provisional can-do evidence, never certified CEFR scores.
 */
import {summarizeCompetency} from './learning-state.mjs';
export const CEFR_LEVELS=Object.freeze(['A1','A2','B1','B2','C1','C2']);
export const CEFR_DIMENSIONS=Object.freeze(['reading','listening','writing','written_interaction','spoken_production','spoken_interaction']);
export const CEFR_CORE_DIMENSIONS=Object.freeze(['reading','listening','writing','spoken_production','spoken_interaction']);
const evidenceMap=Object.freeze({
 'reading_text:comprehension':'reading',
 'audio_comprehension:comprehension':'listening',
 'typed_text:production':'writing',
 'typed_text:interaction':'written_interaction',
 'spoken_audio:production':'spoken_production',
 'spoken_audio:interaction':'spoken_interaction'
});
const filled=x=>typeof x==='string'&&x.trim().length>0;
export const evidenceDimension=(modality,operation)=>evidenceMap[modality+':'+operation]??null;
function cefrRubric(activity){
 let rubric=activity?.rubric_json??activity?.rubric;
 if(typeof rubric==='string')try{rubric=JSON.parse(rubric);}catch{return null;}
 return rubric&&typeof rubric==='object'&&!Array.isArray(rubric)?rubric.cefr??null:null;
}
function isAligned(activity,competency,level,dimension){
 const cefr=cefrRubric(activity);
 return Boolean(cefr&&activity.competency_id===competency.id&&
  cefr.level===level&&cefr.dimension===dimension&&
  filled(cefr.descriptor_ref)&&filled(cefr.source)&&
  /Council of Europe/i.test(cefr.source)&&
  (filled(cefr.observable_criteria)||
  (Array.isArray(cefr.observable_criteria)&&cefr.observable_criteria.some(filled))));
}
/**
 * Only verified trusted Activities + modality-correct Attempts count.
 * Required exact level (not A2-B1), official descriptor reference and observable
 * criteria. The threshold is an ASIT heuristic, not an official CEFR rule.
 */
export function buildCefrProfile({competencies=[],attempts=[],activities=[]}={}){
 const activityMap=new Map(activities.filter(x=>filled(x?.activity_id)).map(x=>[x.activity_id,x]));
 const seen=new Set(),unique=[];let duplicate_or_invalid_attempt_ids=0;
 for(const a of attempts){
  if(!filled(a?.attempt_id)||seen.has(a.attempt_id)){duplicate_or_invalid_attempt_ids++;continue;}
  seen.add(a.attempt_id);unique.push(a);
 }
 const rows=[];let excluded_unmapped_competencies=0,unverified_or_mismatched_attempts=0;
 for(const c of competencies){
  const level=filled(c?.cefr_reference)?c.cefr_reference.trim().toUpperCase():null;
  const dimension=evidenceDimension(c?.required_modality,c?.required_operation);
  if(!filled(c?.id)||!filled(c?.can_do)||!CEFR_LEVELS.includes(level)||!dimension){
   excluded_unmapped_competencies++;continue;
  }
  const scoped=[];
  for(const a of unique.filter(x=>x.competency_id===c.id&&x.assessment!=='not_assessed')){
   const activity=activityMap.get(a.activity_id);
   if(a.observed_modality!==c.required_modality||
      a.observed_operation!==c.required_operation||
      !['correct','partial','needs_support'].includes(a.assessment)||
      !['none','minimal','frame','model','unknown'].includes(a.hint_level)||
      !filled(a.session_id)||!isAligned(activity,c,level,dimension)){
    unverified_or_mismatched_attempts++;continue;
   }
   scoped.push(a);
  }
  const evidence=summarizeCompetency(scoped,c.id,c);
  rows.push({competency_id:c.id,can_do:c.can_do,level,dimension,
   status:evidence.status,evidence_count:evidence.evidence_count,
   sessions:evidence.sessions,contexts:evidence.contexts,
   evidence_attempt_ids:scoped.map(x=>x.attempt_id)});
 }
 const dimensions=CEFR_DIMENSIONS.map(d=>{
  const level_indicators=CEFR_LEVELS.map(level=>{
   const skills=rows.filter(r=>r.level===level&&r.dimension===d);
   const independent=skills.filter(r=>r.status==='independent'||r.status==='transferable');
   const transferable=skills.filter(r=>r.status==='transferable');
   const eligibleIds=new Set(independent.flatMap(r=>r.evidence_attempt_ids));
   const sessions=new Set(unique.filter(a=>eligibleIds.has(a.attempt_id)&&
      a.assessment==='correct'&&a.hint_level==='none').map(a=>a.session_id));
   const adequate=skills.length>=3&&independent.length>=2&&transferable.length>=1&&sessions.size>=2;
   return {level,indicator:adequate?'evidence_supported':skills.length?'insufficient_evidence':'not_mapped',
    mapped_competencies:skills.length,observed_competencies:skills.filter(r=>r.evidence_count>0).length,
    independent_competencies:independent.length,transferable_competencies:transferable.length,
    independent_sessions:sessions.size};
  });
  const supported=level_indicators.filter(x=>x.indicator==='evidence_supported');
  return {dimension:d,indicative_level:supported.length?supported.at(-1).level:null,level_indicators};
 });
 const core=CEFR_CORE_DIMENSIONS.map(d=>dimensions.find(x=>x.dimension===d));
 const complete=core.every(x=>x.indicative_level!==null);
 return {version:1,framework:'CEFR Companion Volume 2020',official_certification:false,
  overall_indicator:complete?CEFR_LEVELS[Math.min(...core.map(x=>CEFR_LEVELS.indexOf(x.indicative_level)))]:null,
  overall_reason:complete?'Conservative minimum across five observed dimensions':'Insufficient evidence in one or more core dimensions',
  dimensions,competencies:rows,
  quality:{excluded_unmapped_competencies,unverified_or_mismatched_attempts,duplicate_or_invalid_attempt_ids},
  limitations:['Provisional ASIT indicator, not official CEFR certification','No numerical proficiency percentages',
    'Text does not prove listening, speaking or pronunciation',
    'Descriptor references require human/source verification']};
}
