import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rankLearningPriorities,selectNextLearningGoal} from '../src/planner.mjs';
import {makeLessonBlueprint} from '../src/lesson-blueprint.mjs';
import {createLearnerState} from '../src/learning-state.mjs';

const competencies=[
{id:'QUESTIONS',can_do:'Ask questions',dependencies:[],priority:5},
{id:'READING',can_do:'Understand instructions',dependencies:[],priority:4}
];
test('two consecutive full lessons on one skill favor another eligible focus',()=>{
 const results=rankLearningPriorities({competencies,nowIso:'2026-10-16T00:00:00Z',
 recentLessonCompetencyIds:['QUESTIONS','QUESTIONS']});
 assert.equal(results[0].competency_id,'READING');
 assert.match(results.find(x=>x.competency_id==='QUESTIONS').reasons.join(' '),/rotate|recent/i);
});
test('learner explicit request is not overridden by rotation',()=>{
 const choice=selectNextLearningGoal({competencies,nowIso:'2026-10-16T00:00:00Z',
 recentLessonCompetencyIds:['QUESTIONS','QUESTIONS'],objectiveIds:['QUESTIONS']});
 assert.equal(choice.competency_id,'QUESTIONS');
});
test('rolling blueprint explains why another skill was selected',()=>{
 const s=createLearnerState({learnerId:'fictional',targetLanguage:'English'});
 s.competencies=competencies;
 s.recent_lesson_competency_ids=['QUESTIONS','QUESTIONS'];
 const b=makeLessonBlueprint({learnerState:s,nowIso:'2026-10-16T00:00:00Z'});
 assert.equal(b.goal,'READING');
 assert.ok(b.rationale.length>0);
});


test('blueprint automatically derives recent completed full lessons from hydrated state',()=>{
 const state=createLearnerState({learnerId:'fictional',targetLanguage:'English'});
 state.competencies=competencies;
 state.activities=[
  {id:'f1',session_id:'s1',type:'five_part_lesson',status:'active',competency_id:'QUESTIONS',rubric:{items:[{},{}]}},
  {id:'f2',session_id:'s2',type:'five_part_lesson',status:'active',competency_id:'QUESTIONS',rubric:{items:[{},{}]}}
 ];
 state.sessions=[{id:'s1',ended_at:'2026-01-01T00:00:00Z'},{id:'s2',ended_at:'2026-01-02T00:00:00Z'}];
 state.attempts=[{activity_id:'f1',session_id:'s1',assessment:'partial'},
                 {activity_id:'f2',session_id:'s2',assessment:'partial'}];
 assert.equal(makeLessonBlueprint({learnerState:state,nowIso:'2026-10-16T00:00:00Z'}).goal,'READING');
});
test('an eligible explicitly requested low-priority competency overrides routine high priority',()=>{
 const c=[{id:'A',can_do:'Basic reading',dependencies:[],priority:1},
          {id:'B',can_do:'Frequent conversation',dependencies:[],priority:5}];
 assert.equal(selectNextLearningGoal({competencies:c,objectiveIds:['A'],nowIso:'2026-10-16T00:00:00Z'}).competency_id,'A');
});
