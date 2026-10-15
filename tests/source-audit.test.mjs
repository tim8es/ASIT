import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scanTextForSensitiveMaterial} from '../src/source-audit.mjs';
test('safe documentation does not trigger',()=>assert.deepEqual(scanTextForSensitiveMaterial('CEFR can-do descriptors'),[]));
test('fabricated Sheets link is flagged without storing a full link',()=>{
 const synthetic=['https:/','/docs.google.com/','spreadsheets/d/','X'.repeat(35)].join('');
 assert.ok(scanTextForSensitiveMaterial(synthetic).includes('private-document-link'));
});
test('constructed sample email is flagged',()=>{
 const synthetic=['test','@','example.invalid'].join('');
 assert.ok(scanTextForSensitiveMaterial(synthetic).includes('email-address'));
});
test('constructed GitHub token is flagged',()=>{
 const synthetic=['ghp_','X'.repeat(30)].join('');
 assert.ok(scanTextForSensitiveMaterial(synthetic).includes('github-access-token'));
});
