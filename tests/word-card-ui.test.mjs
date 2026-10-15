import {test} from 'node:test';
import assert from 'node:assert/strict';
import {selectUiPattern,composeLessonUi} from '../src/ui-orchestrator.mjs';
import {createLearnerState} from '../src/learning-state.mjs';

test('word-order construction uses tap cards, not a typed answer',()=>{
 const p=selectUiPattern({action:'build',intent:'word_order'});
 assert.equal(p.type,'card_ordering');
 assert.equal(p.input,'tap_to_order_cards');
 assert.equal(p.operation,'guided_construction');
});
test('accessible no-button environment falls back to numbered/select ordering',()=>{
 const p=selectUiPattern({action:'build',intent:'word_order',capabilities:{tapCards:false}});
 assert.equal(p.input,'numbered_or_select_ordering');
});
test('a single Submit remains for a packet containing an ordering task',()=>{
 const learnerState=createLearnerState({learnerId:'fictional',targetLanguage:'English'});
 const p=composeLessonUi({learnerState,actions:['recognize','build','apply','interact'],
 taskIntents:[null,'word_order',null,null]});
 assert.equal(p.tasks[1].input,'tap_to_order_cards');
 assert.equal(p.submit_count,1);
});
