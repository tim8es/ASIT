import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarizeLessonProgress} from '../src/lesson-progress.mjs';

const completed={assessment:'partial',attempt_id:'a1',activity_id:'full1',session_id:'s2'};
const activity=(id,session,type,status='active')=>({
  activity_id:id,session_id:session,activity_type:type,status,
  rubric_json:JSON.stringify({items:[{id:'q1'},{id:'q2'},{id:'q3'},{id:'q4'},{id:'q5'}]})
});
test('display counter counts completed full lessons, not technical IDs or attempts',()=>{
 const p=summarizeLessonProgress({
  sessions:[
   {session_id:'s1',ended_at_utc:'2026-01-01',attempt_ids_json:'["micro1"]'},
   {session_id:'s2',ended_at_utc:'2026-01-02',attempt_ids_json:'["a1","a2"]'},
   {session_id:'s3',ended_at_utc:'2026-01-03',attempt_ids_json:'[]'},
   {session_id:'s4',ended_at_utc:'',attempt_ids_json:'[]'}],
  activities:[
   activity('micro','s1','independent_retry'),
   activity('full1','s2','five_part_integrated_lesson'),
   activity('cancelled','s3','five_part_lesson','superseded'),
   activity('full_next','s4','five_part_integrated_lesson')],
  attempts:[completed,{...completed,attempt_id:'a2'}]
 });
 assert.equal(p.completed_full_lessons,1);
 assert.equal(p.next_full_lesson_number,2);
 assert.equal(p.pending_full_lessons,1);
});
test('an unassessed or unfinished packet never increments the completed count',()=>{
 const p=summarizeLessonProgress({
 sessions:[{session_id:'s',ended_at_utc:'2026-01-01'}],
 activities:[activity('full','s','five_part_lesson')],
 attempts:[{...completed,session_id:'s',activity_id:'full',assessment:'not_assessed'}]});
 assert.equal(p.completed_full_lessons,0);
});
test('completion evidence remains tied to session and matching activity',()=>{
 const p=summarizeLessonProgress({
 sessions:[{session_id:'s',ended_at_utc:'2026-01-01'}],
 activities:[activity('full','s','five_part_lesson')],
 attempts:[{...completed,session_id:'other',activity_id:'full'}]});
 assert.equal(p.completed_full_lessons,0);
});
