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
