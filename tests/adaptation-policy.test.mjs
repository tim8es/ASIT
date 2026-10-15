import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recommendAdjustment,applyAdjustmentToPrivateProfile} from '../src/adaptation-policy.mjs';
const skill={id:'TEST',can_do:'Use polite clarification requests',required_modality:'typed_text',
 required_operation:'production'};
const a=(id,grade='correct',extras={})=>({
 attempt_id:id,competency_id:'TEST',assessment:grade,hint_level:'none',
 observed_modality:'typed_text',observed_operation:'production',
 session_id:id,context_id:id,...extras
});
test('new learner defaults to diagnosis without inventing challenge level',()=>{
 const d=recommendAdjustment({competency:skill,attempts:[],stateRevision:0});
 assert.equal(d.action,'diagnose');
 assert.deepEqual(d.evidence_attempt_ids,[]);
});
test('two recurring difficulties recommend additional support',()=>{
 const d=recommendAdjustment({competency:skill,attempts:[a('a','needs_support'),a('b','needs_support')]});
 assert.equal(d.action,'increase_support');
 assert.deepEqual(d.evidence_attempt_ids,['a','b']);
});
test('two independent contexts and sessions recommend stretch, not mastery',()=>{
 const d=recommendAdjustment({competency:skill,attempts:[a('a'),a('b')]});
 assert.equal(d.action,'offer_stretch');
 assert.equal('mastery' in d,false);
});
test('two correct answers in one session do not upgrade challenge',()=>{
 const d=recommendAdjustment({competency:skill,attempts:[
 a('a','correct',{session_id:'x'}),a('b','correct',{session_id:'x'})]});
 assert.equal(d.action,'maintain');
});
test('spoken recognition does not change typed productive skill challenge',()=>{
 const x=a('a','correct',{observed_modality:'spoken_audio',observed_operation:'recognition'});
 assert.equal(recommendAdjustment({competency:skill,attempts:[x,x]}).action,'diagnose');
});
test('adaptive preferences are private and separate from teacher observations',()=>{
 const old={user_preferences:{feedback:'short',challenge:'hard'}};
 const d=recommendAdjustment({competency:skill,attempts:[a('a','partial')]});
 const next=applyAdjustmentToPrivateProfile(old,d);
 assert.deepEqual(next.user_preferences,old.user_preferences);
 assert.equal(next.recent_decisions.length,1);
 assert.deepEqual(old,{user_preferences:{feedback:'short',challenge:'hard'}});
});
test('private adaptation log stays bounded as learning proceeds',()=>{
 let profile={user_preferences:{}};
 for(let i=0;i<100;i++)profile=applyAdjustmentToPrivateProfile(profile,{
  competency_id:'TEST',action:'maintain',rationale:'Synthetic stable performance',
  state_revision:i,evidence_attempt_ids:['fake-'+i]});
 assert.equal(profile.recent_decisions.length,4);
 assert.equal(profile.recent_decisions.at(-1).basis_revision,99);
});
