import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import schema from '../templates/tracker-v2.json' with {type:'json'};
const instructions=readFileSync(new URL('../install/CHATGPT-PROJECT-INSTRUCTIONS.md',import.meta.url),'utf8');
test('one-paste setup contains all required private tab headers',()=>{
 for(const tab of schema.tabs){
  const line=tab.name+': '+tab.columns.join(' | ');
  assert.ok(instructions.includes(line),'Missing exact header contract for '+tab.name);
 }
});
test('setup requires consent and disclaims missing persistence',()=>{
 assert.match(instructions,/consent/i);
 assert.match(instructions,/not saved|unsaved|temporary/i);
});
test('setup does not preset an author biography',()=>{
 assert.doesNotMatch(instructions,/native language: Russian|profession: Project Manager|living in St Petersburg/i);
});
test('setup requires durable readback',()=>assert.match(instructions,/read back|readback/i));
