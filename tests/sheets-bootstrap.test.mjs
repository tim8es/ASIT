import {test} from 'node:test';
import assert from 'node:assert/strict';
import template from '../templates/tracker-v2.json' with {type:'json'};
import {hydrateWorkbook} from '../src/hydrate-state.mjs';
import {assertTemplate,planEmptyWorkbookStructure,planHeaderWrites,planConfigSeed}
  from '../src/sheets-bootstrap.mjs';
const fresh={sheets:[{properties:{sheetId:42,title:'Sheet1',gridProperties:{columnCount:26}}}]};
const verified={creationVerified:true,emptyVerified:true};
const deployed={sheets:template.tabs.map((tab,i)=>({properties:{sheetId:i+42,title:tab.name,
  gridProperties:{columnCount:26}}}))};
test('v2 template is structurally valid',()=>assert.equal(assertTemplate(template),true));
test('bootstrap requests create 9 required tabs without synthetic learner data',()=>{
 const req=planEmptyWorkbookStructure(template,fresh,verified);
 assert.equal(req.length,9);
 assert.equal(req[0].updateSheetProperties.properties.title,'Config');
 assert.equal(req.filter(x=>x.addSheet).length,8);
});
test('unknown populated workbook is never overwritten by installer',()=>{
 assert.throws(()=>planEmptyWorkbookStructure(template,{sheets:[...fresh.sheets,...fresh.sheets]},verified),/do not mutate/);
});
test('localized newly created tab can be renamed after verification',()=>{
 const occupied={sheets:[{properties:{sheetId:42,title:'Learner data',gridProperties:{columnCount:26}}}]};
 assert.equal(planEmptyWorkbookStructure(template,occupied,verified)[0].updateSheetProperties.properties.title,'Config');
});
test('headers use actual metadata IDs and exact template columns',()=>{
 const requests=planHeaderWrites(template,deployed);
 assert.equal(requests.length,18);
 const attemptWrite=requests.find(x=>x.updateCells?.range.sheetId===47);
 assert.deepEqual(attemptWrite.updateCells.rows[0].values.map(v=>v.userEnteredValue.stringValue),
 template.tabs.find(t=>t.name==='Attempts').columns);
});
test('missing tab is a structural failure',()=>{
 assert.throws(()=>planHeaderWrites(template,{sheets:deployed.sheets.slice(1)}),/do not match/);
});
test('creation cannot persist without consent',()=>{
 assert.throws(()=>planConfigSeed(deployed,'summary_only'),/Consent/);
 assert.throws(()=>planConfigSeed(deployed,'off',{consentGranted:true,learnerId:'fixture'}),/No authorized/);
});
test('bootstrap seeds every mandatory Config key with JSON values and verified identity',()=>{
 const requests=planConfigSeed(deployed,'summary_only',{consentGranted:true,learnerId:'synthetic-private-id',targetLanguage:'English',nowIso:'2026-10-16T15:00:00.000Z'});
 assert.equal(requests.length,1);
 const rows=requests[0].updateCells.rows.map(r=>r.values.map(x=>x.userEnteredValue.stringValue));
 const values=Object.fromEntries(rows.map(x=>[x[0],JSON.parse(x[1])]));
 assert.deepEqual(values,{schema_version:2,state_revision:0,learner_id:'synthetic-private-id',target_language:'English',recording_consent:'summary_only',audio_consent:false,cefr_confidence_label:'unassessed'});
 assert.equal(rows.every(x=>x[2]==='2026-10-16T15:00:00.000Z'),true);
});
test('initialization refuses blank synthetic learner identity and unsupported language',()=>{
 assert.throws(()=>planConfigSeed(deployed,'summary_only',{consentGranted:true}),/learner ID/);
 assert.throws(()=>planConfigSeed(deployed,'summary_only',{consentGranted:true,learnerId:'id',targetLanguage:'French'}),/English/);
});

test('bootstrap refuses unknown existing workbook even with one default tab',()=>{
 assert.throws(()=>planEmptyWorkbookStructure(template,fresh),/must be verified/);
 assert.throws(()=>planEmptyWorkbookStructure(template,fresh,{creationVerified:true}),/must be verified/);
});

test('a newly seeded nine-tab workbook can hydrate without any fabricated lesson history',()=>{
 const empty=Object.fromEntries(template.tabs.map(tab=>[tab.name,[tab.columns]]));
 const req=planConfigSeed(deployed,'summary_only',{consentGranted:true,learnerId:'synthetic-test-id',nowIso:'2026-10-16T15:00:00.000Z'});
 const rows=req[0].updateCells.rows.map(row=>row.values.map(cell=>cell.userEnteredValue.stringValue));
 empty.Config.push(...rows);
 const state=hydrateWorkbook(empty);
 assert.equal(state.profile.learner_id,'synthetic-test-id');
 assert.equal(state.revision,0);
 assert.equal(state.source.recording_consent,'summary_only');
 assert.equal(state.competencies.length,0);
 assert.equal(state.attempts.length,0);
 assert.equal(state.profile.working_level,null);
});
