import {test} from 'node:test';
import assert from 'node:assert/strict';
import template from '../templates/tracker-v2.json' with {type:'json'};
import {hydrateWorkbook} from '../src/hydrate-state.mjs';
import {encodeAttemptRow} from '../src/storage-contract.mjs';
import {buildAttemptProvenanceEvent} from '../src/composite-evidence.mjs';
function fixture(){
  const tables=Object.fromEntries(template.tabs.map(x=>[x.name,[x.columns]]));
  const push=(tab,obj)=>tables[tab].push(template.tabs.find(x=>x.name===tab).columns.map(k=>obj[k]??''));
  for(const [key,json_value] of Object.entries({
    schema_version:'2',state_revision:'5',learner_id:'"synthetic-id"',
    target_language:'"English"',recording_consent:'"summary_only"',
    preferred_minutes:'8',feedback_preferences:'{"amount":"selective"}',
    adaptive_profile:'{"user_preferences":{"feedback":"brief"},"recent_decisions":[{"competency_id":"C1","action":"maintain","reason":"Needs delayed retrieval","evidence_attempt_ids":["T1"],"basis_revision":4}]}'
  }))push('Config',{key,json_value});
  push('Goals',{goal_id:'G1',description:'Understand everyday conversations',priority:4,status:'active'});
  push('Competencies',{competency_id:'C1',can_do:'Politely ask for repetition',dependency_ids_json:'[]',priority:4,status:'unassessed',required_modality:'typed_text',required_operation:'production'});
  push('Activities',{activity_id:'A1',lesson_id:'L1',session_id:'S1',competency_id:'C1',
    activity_type:'free_production',prompt:'Please ask someone to repeat a word.',rubric_json:'{"clarity":true}',status:'complete',observed_modality:'typed_text',observed_operation:'production'});
  const a={attempt_id:'T1',lesson_id:'L1',session_id:'S1',activity_id:'A1',competency_id:'C1',
    activity_type:'free_production',answer:'Could you repeat that?',attempt_number:1,
    hint_level:'none',assessment:'correct',observed_modality:'typed_text',observed_operation:'production'};
  tables.Attempts.push(encodeAttemptRow(a,{privacyMode:'summary_only',summary:'Produced a polite clarification question'}));
  push('Reviews',{review_id:'R1',competency_id:'C1',content_or_pattern:'Politely ask to repeat',
    due_at_utc:'',success_count:0,last_outcome:'correct',status:'scheduled'});
  push('Plans',{plan_id:'P1',revision:1,goal_ids_json:'["G1"]',competency_ids_json:'["C1"]',
    rationale:'Meaningful communication',status:'active'});
  push('Sessions',{session_id:'S1',attempt_ids_json:'["T1"]',summary:'Synthetic short lesson'});
  return tables;
}
test('v2 workbook restores progress without re-onboarding',()=>{
 const state=hydrateWorkbook(fixture());
 assert.equal(state.source.restored,true);assert.equal(state.revision,5);
 assert.equal(state.profile.target_language,'English');
 assert.equal(state.profile.available_minutes,8);
 assert.deepEqual(state.profile.goals,['Understand everyday conversations']);
 assert.equal(state.attempts.length,1);
 assert.equal(state.attempts[0].answer_summary,'Produced a polite clarification question');
 assert.equal('answer' in state.attempts[0],false);
 assert.equal(state.activities[0].rubric.clarity,true);
});
test('refuses missing spreadsheet tab',()=>{
 const t=fixture();delete t.Activities;
 assert.throws(()=>hydrateWorkbook(t),/Missing tab Activities/);
});
test('fails closed on header-order drift',()=>{
 const t=fixture();t.Attempts[0]=[...t.Attempts[0]].reverse();
 assert.throws(()=>hydrateWorkbook(t),/Schema mismatch in Attempts/);
});
test('refuses cross-competency attempt forgery',()=>{
 const t=fixture();const columns=t.Attempts[0];
 t.Attempts[1][columns.indexOf('competency_id')]='UNKNOWN';
 assert.throws(()=>hydrateWorkbook(t),/Unrecognized competency/);
});
test('refuses missing activity even when stored attempt claims success',()=>{
 const t=fixture();t.Activities=t.Activities.slice(0,1);
 assert.throws(()=>hydrateWorkbook(t),/trusted activity/);
});
test('requires recording consent and valid revision',()=>{
 const t=fixture();const c=t.Config;
 c[c.findIndex(x=>x[0]==='recording_consent')][1]='"silent_always"';
 assert.throws(()=>hydrateWorkbook(t),/Invalid consent setting/);
});
test('rejects workbook schema version change',()=>{
 const t=fixture();t.Config.find(x=>x[0]==='schema_version')[1]='999';
 assert.throws(()=>hydrateWorkbook(t),/Incompatible schema version/);
});
test('rejects mismatching session attempt reference',()=>{
 const t=fixture();t.Sessions[1][4]='["not-in-attempts"]';
 assert.throws(()=>hydrateWorkbook(t),/unavailable attempt/);
});
test('does not require fictional abilities or target CEFR',()=>{
 const s=hydrateWorkbook(fixture());
 assert.equal(s.profile.working_level,null);
 assert.equal(s.profile.level_evidence,'unassessed');
});

test('fresh-chat cannot reinterpret a typed task as spoken evidence',()=>{
 const t=fixture(),cols=t.Competencies[0];
 t.Competencies[1][cols.indexOf('required_modality')]='spoken_audio';
 const restored=hydrateWorkbook(t);
 assert.equal(restored.competencies[0].required_modality,'spoken_audio');
 assert.equal(restored.attempts[0].observed_modality,'typed_text');
});
test('tampered modality is rejected against the trusted activity',()=>{
 const t=fixture(),cols=t.Attempts[0];
 t.Attempts[1][cols.indexOf('observed_modality')]='spoken_audio';
 assert.throws(()=>hydrateWorkbook(t),/trusted activity/);
});

test('personal adaptation is restored privately, not copied into Engine',()=>{
 const s=hydrateWorkbook(fixture());
 assert.equal(s.adaptive_profile.user_preferences.feedback,'brief');
 assert.equal(s.adaptive_profile.recent_decisions[0].competency_id,'C1');
 assert.equal(s.adaptive_profile.recent_decisions[0].basis_revision,4);
});

test('qualified stored evidence is preserved for compact learner contexts',()=>{
 const t=fixture(),head=t.Competencies[0],row=t.Competencies[1];
 row[head.indexOf('status')]='supported';
 row[head.indexOf('evidence_count')]=1;
 row[head.indexOf('confidence_label')]='limited';
 const s=hydrateWorkbook(t);
 assert.equal(s.competencies[0].status,'supported');
 assert.equal(s.competencies[0].evidence_count,1);
 assert.equal(s.competencies[0].confidence_label,'limited');
});
test('corrupt stored mastery-like status cannot leak into the lesson',()=>{
 const t=fixture(),head=t.Competencies[0],row=t.Competencies[1];
 row[head.indexOf('status')]='guaranteed C2';
 assert.throws(()=>hydrateWorkbook(t),/Invalid stored competency status/);
});

test('qualifying nonverbatim provenance survives complete workbook hydration',()=>{
 const t=fixture();
 t.Events.push(buildAttemptProvenanceEvent({eventId:'E1',attemptId:'T1',revision:5,
  timestampUtc:'2026-10-16T15:00:00.000Z',privacyMode:'summary_only',
  observed:{first_attempt_assessment:'needs_support',revisions:2}}));
 const x=hydrateWorkbook(t);
 assert.equal(x.events.length,1);
 assert.equal(x.events[0].metadata.first_attempt_assessment,'needs_support');
 assert.equal(x.events[0].entity_id,'T1');
});
test('unknown attempt provenance reference fails closed during complete restore',()=>{
 const t=fixture();
 t.Events.push(buildAttemptProvenanceEvent({eventId:'E1',attemptId:'not-real',revision:5,
  timestampUtc:'2026-10-16T15:00:00.000Z',privacyMode:'summary_only'}));
 assert.throws(()=>hydrateWorkbook(t),/unavailable attempt/);
});
