import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildCefrProfile,evidenceDimension} from '../src/cefr-analytics.mjs';
const competency=(id,level='B1')=>({id,can_do:'Write about '+id,cefr_reference:level,
 required_modality:'typed_text',required_operation:'production'});
const attempt=(id,competency_id,session_id,context_id,extra={})=>({
 attempt_id:id,activity_id:'act-'+id,competency_id,session_id,context_id,
 assessment:'correct',hint_level:'none',observed_modality:'typed_text',observed_operation:'production',...extra});
const activity=x=>({activity_id:x.activity_id,competency_id:x.competency_id,
 rubric_json:JSON.stringify({cefr:{level:'B1',dimension:'writing',
 descriptor_ref:'fictional-test-descriptor',source:'Council of Europe CEFR Companion Volume 2020',
 observable_criteria:['Communicates the intended written meaning']}})});
const profile=(skills,attempts)=>buildCefrProfile({competencies:skills,attempts,activities:attempts.map(activity)});
const writing=p=>p.dimensions.find(x=>x.dimension==='writing');
test('No evidence does not invent level',()=>{
 const p=profile([competency('w1')],[]);
 assert.equal(writing(p).indicative_level,null);
 assert.equal(p.overall_indicator,null);
});
test('Modality and operation are distinct',()=>{
 assert.equal(evidenceDimension('typed_text','production'),'writing');
 assert.equal(evidenceDimension('spoken_audio','interaction'),'spoken_interaction');
 assert.equal(evidenceDimension('typed_text','recognition'),null);
});
test('CEFR indication requires at least 3 can-dos, independent use and cross-session transfer',()=>{
 const skills=[competency('w1'),competency('w2'),competency('w3')];
 const xs=[attempt('a','w1','s1','home'),attempt('b','w1','s2','work'),
  attempt('c','w2','s2','work'),attempt('d','w3','s1','home')];
 const p=profile(skills,xs);
 const b1=writing(p).level_indicators.find(x=>x.level==='B1');
 assert.equal(b1.indicator,'evidence_supported');
 assert.equal(writing(p).indicative_level,'B1');
 assert.equal(p.overall_indicator,null);
});
test('Two isolated successes are insufficient for dimension level',()=>{
 const xs=[attempt('a','w1','s1','home'),attempt('b','w2','s1','work')];
 assert.equal(writing(profile([competency('w1'),competency('w2')],xs)).indicative_level,null);
});
test('Typed recognition cannot establish independent writing or listening',()=>{
 const x=attempt('a','w1','s1','home',{observed_operation:'recognition'});
 const p=profile([competency('w1')],[x]);
 assert.equal(p.quality.unverified_or_mismatched_attempts,1);
 assert.equal(p.competencies[0].status,'unassessed');
 assert.equal(p.dimensions.find(x=>x.dimension==='listening').indicative_level,null);
});
test('Ambiguous CEFR ranges and missing trusted rubrics are excluded',()=>{
 const bad=profile([competency('w1','A2-B1')],[]);
 assert.equal(bad.quality.excluded_unmapped_competencies,1);
 const x=attempt('a','w1','s1','home');
 const p=buildCefrProfile({competencies:[competency('w1')],attempts:[x],activities:[]});
 assert.equal(p.quality.unverified_or_mismatched_attempts,1);
});
test('Later independent failure revokes transfer status and preserves observations',()=>{
 const xs=[attempt('a','w1','s1','home'),attempt('b','w1','s2','work'),
  attempt('c','w1','s3','travel',{assessment:'needs_support'})];
 const p=profile([competency('w1')],xs);
 assert.equal(p.competencies[0].status,'supported');
 assert.equal(p.competencies[0].evidence_count,3);
});
test('Duplicate identifiers do not inflate evidence',()=>{
 const x=attempt('a','w1','s1','home');
 const p=profile([competency('w1')],[x,{...x,assessment:'partial'}]);
 assert.equal(p.quality.duplicate_or_invalid_attempt_ids,1);
 assert.equal(p.competencies[0].evidence_count,1);
});
