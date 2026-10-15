import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import schema from '../templates/tracker-v2.json' with {type:'json'};
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const router=read('../install/PROJECT-ROUTER.md');
const alias=read('../install/CHATGPT-PROJECT-INSTRUCTIONS.md');
const engine=read('../install/ASIT-ENGINE.md');
const start=read('../install/START_HERE.md');
test('Project router fits a short instruction field',()=>assert.ok(router.length<2500));
test('compatibility instructions are the short router',()=>assert.equal(alias,router));
test('router requires source loading every new chat',()=>{
 assert.match(router,/ASIT-ENGINE\.md/);
 assert.match(router,/EACH new chat/);
 assert.match(router,/file is unavailable/);
});
test('portable engine owns the complete storage schema',()=>{
 assert.ok(engine.length>5000);
 for(const tab of schema.tabs){
  assert.ok(engine.includes(tab.name+': '+tab.columns.join(' | ')),'Missing engine schema: '+tab.name);
 }
});
test('consent and readback safeguards remain in the teaching engine',()=>{
 assert.match(engine,/consent/i);
 assert.match(engine,/read back/i);
 assert.doesNotMatch(engine,/native language: Russian|profession: Project Manager|living in St Petersburg/i);
});
test('installation describes router and source placement',()=>{
 assert.match(start,/ASIT-ENGINE\.md/);
 assert.match(start,/PROJECT-ROUTER\.md/);
});
