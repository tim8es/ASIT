import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createWordCardState,selectWordCard,undoWordCard,resetWordCards,assembledWordAnswer,isWordCardComplete} from '../src/word-cards.mjs';

test('tap cards assemble a question without typing or revealing a solution',()=>{
  const start=createWordCardState(['did','change','what','in','the','schedule','you','?']);
  const ordered=[2,0,6,1,3,4,5,7].reduce((state,id)=>selectWordCard(state,id),start);
  assert.equal(assembledWordAnswer(ordered),'what did you change in the schedule?');
  assert.equal(isWordCardComplete(ordered),true);
  assert.equal(start.selected_ids.length,0);
  assert.equal('solution' in start,false);
});
test('duplicate word texts remain individually selectable by stable IDs',()=>{
  const s=createWordCardState(['the','the','project']);
  assert.equal(assembledWordAnswer(selectWordCard(selectWordCard(s,0),1)),'the the');
  assert.throws(()=>selectWordCard(selectWordCard(s,0),0),/already selected/i);
  assert.throws(()=>selectWordCard(s,99),/unknown/i);
});
test('undo and reset are immutable and preserve the original tiles',()=>{
  const first=createWordCardState(['When','will','we','start','?']);
  const second=selectWordCard(selectWordCard(first,0),1);
  const undone=undoWordCard(second);
  assert.equal(assembledWordAnswer(undone),'When');
  assert.deepEqual(resetWordCards(second).selected_ids,[]);
  assert.deepEqual(second.selected_ids,[0,1]);
});
test('invalid or incomplete sets cannot be treated as complete sentences',()=>{
  assert.throws(()=>createWordCardState([]),/words/i);
  assert.throws(()=>createWordCardState(['x',' ']),/word/i);
  assert.equal(isWordCardComplete(createWordCardState(['One','?'])),false);
});
