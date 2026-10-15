import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import schema from '../templates/tracker-v2.json' with {type:'json'};
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const router=read('../install/PROJECT-ROUTER.md');
const alias=read('../install/CHATGPT-PROJECT-INSTRUCTIONS.md');
const engine=read('../install/ASIT-ENGINE.md');
const storage=read('../install/ASIT-STORAGE.md');
const start=read('../install/START_HERE.md');
test('Project router remains short and identical to compatibility alias',()=>{
 assert.ok(router.length<2500);assert.equal(alias,router);
});
test('router requires loading Project source each new chat and has explicit missing-source handling',()=>{
 assert.match(router,/ASIT-ENGINE\.md/);
 assert.match(router,/EACH new chat/);
 assert.match(router,/file is unavailable/);
});
test('fast-path universal engine omits detailed storage schema',()=>{
 assert.ok(engine.length<7500);
 assert.match(engine,/ASIT-STORAGE\.md/);
 assert.match(engine,/bounded relevant slice/);
 assert.doesNotMatch(engine,/Config: key \| json_value/);
});
test('on-demand storage contract owns exact private schema',()=>{
 for(const tab of schema.tabs){
  const line=tab.name+': '+tab.columns.join(' | ');
  assert.ok(storage.includes(line),'Missing storage adapter header: '+tab.name);
 }
});
test('consent and verified readback are preserved across engine and adapter',()=>{
 assert.match(engine,/consent/i);assert.match(storage,/consent/i);
 assert.match(storage,/Read back|read back/i);
 assert.doesNotMatch(engine,/native language: Russian|profession: Project Manager|living in St Petersburg/i);
});
test('installed initial context is smaller than previously measured version',()=>{
 assert.ok(router.length+engine.length<9500);
});
test('installation describes all three file placements',()=>{
 assert.match(start,/ASIT-ENGINE\.md/);
 assert.match(start,/ASIT-STORAGE\.md/);
 assert.match(start,/PROJECT-ROUTER\.md/);
});
