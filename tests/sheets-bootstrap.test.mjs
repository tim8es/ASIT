import {test} from 'node:test';
import assert from 'node:assert/strict';
import template from '../templates/tracker-v2.json' with {type:'json'};
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
 assert.throws(()=>planConfigSeed(deployed,'off',{consentGranted:true}),/No authorized/);
});
test('private configuration only seeds schema, revision and granted recording mode',()=>{
 const requests=planConfigSeed(deployed,'summary_only',{consentGranted:true});
 assert.equal(requests.length,1);
 const rows=requests[0].updateCells.rows.map(r=>r.values.map(x=>x.userEnteredValue.stringValue));
 assert.deepEqual(rows.map(x=>x[0]),['schema_version','state_revision','recording_consent']);
 assert.equal(rows[2][1],'"summary_only"');
});

test('bootstrap refuses unknown existing workbook even with one default tab',()=>{
 assert.throws(()=>planEmptyWorkbookStructure(template,fresh),/must be verified/);
 assert.throws(()=>planEmptyWorkbookStructure(template,fresh,{creationVerified:true}),/must be verified/);
});
