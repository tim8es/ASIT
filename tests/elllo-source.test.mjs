import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ELLLO_SOURCE,ELLLO_STARTER_CANDIDATES,
  searchEllloSource,ellloCandidateReadiness} from '../src/elllo-source.mjs';

test('ELLLO is a single selected educational discovery source',()=>{
 assert.equal(ELLLO_SOURCE.id,'elllo');
 assert.equal(ELLLO_SOURCE.selected,true);
 assert.equal(ELLLO_SOURCE.media_use,'link_to_original_lesson_only');
 assert.equal(ELLLO_SOURCE.video_redistribution_authorized,false);
 assert.equal(ELLLO_SOURCE.transcript_republication_authorized,false);
 assert.equal(ELLLO_SOURCE.native_inline_video_verified,false);
 assert.equal(ELLLO_STARTER_CANDIDATES.length,6);
 assert.equal(new Set(ELLLO_STARTER_CANDIDATES.map(x=>x.id)).size,6);
});
test('starter index contains only grounded HTTPS ELLLO lesson links and no copied media',()=>{
 for(const x of ELLLO_STARTER_CANDIDATES){
  const url=new URL(x.lesson_url);
  assert.equal(url.protocol,'https:');
  assert.equal(url.hostname,'elllo.org');
  assert.ok(['video_with_audio','sound_grammar_conversations'].includes(x.media));
  assert.equal(x.audio_asset_url,null);
  assert.equal(x.video_asset_url,null);
  assert.equal(x.verified_duration_seconds,null);
  assert.equal(x.ready_for_scored_listening,false);
 }
});
test('topics and levels retrieve topical candidates, without assuming learner level',()=>{
 assert.equal(searchEllloSource({level:'A2',topic:'train'})[0].id,
  'elllo-a2-public-transport-lesya');
 assert.equal(searchEllloSource({topic:'past simple'})[0].id,
  'elllo-a2-weekend-jill');
 assert.equal(searchEllloSource({level:'B1',topic:'job'})[0].id,
  'elllo-b1-dream-job-lucia');
 assert.equal(searchEllloSource({level:'A1'}).length,0);
 assert.equal(searchEllloSource({topic:'nonexistent-topic'}).length,0);
});
test('unknown lesson duration is explicitly blocked even if source page is valid',()=>{
 const c=ELLLO_STARTER_CANDIDATES[0];
 const result=ellloCandidateReadiness(c);
 assert.equal(result.can_display_discovery_link,true);
 assert.equal(result.eligible_standard_audio_card,false);
 assert.equal(result.ready_for_scored_listening,false);
 assert.equal(result.listened_evidence,'not_assessed');
 assert.equal(result.reason,'short_clip_duration_not_confirmed');
});
test('a user saying they heard an unknown-length video does not bypass duration gate',()=>{
 const r=ellloCandidateReadiness(ELLLO_STARTER_CANDIDATES[0],{
  originalPlayerHeard:true});
 assert.equal(r.ready_for_scored_listening,false);
 assert.equal(r.media_duration_verified,false);
});
test('a verified 30-second original clip heard by a learner is provisional only',()=>{
 const r=ellloCandidateReadiness(ELLLO_STARTER_CANDIDATES[1],{
  durationSeconds:30,durationVerified:true,originalPlayerHeard:true});
 assert.equal(r.eligible_standard_audio_card,true);
 assert.equal(r.ready_for_scored_listening,true);
 assert.equal(r.listened_evidence,'self_reported_original_site_playback');
 assert.equal(r.content_redistributed,false);
 assert.equal(r.progress_saved,false);
});
test('a minute-long ELLLO video needs explicit extended video request',()=>{
 const c=ELLLO_STARTER_CANDIDATES[2];
 const denied=ellloCandidateReadiness(c,{durationSeconds:60,
  durationVerified:true,originalPlayerHeard:true});
 assert.equal(denied.ready_for_scored_listening,false);
 const allowed=ellloCandidateReadiness(c,{durationSeconds:60,
  durationVerified:true,originalPlayerHeard:true,
  extendedVideoRequested:true,transcriptReadBeforeAnswer:true});
 assert.equal(allowed.eligible_requested_extended_video,true);
 assert.equal(allowed.listened_evidence,'self_reported_audio_with_text_support');
 assert.equal(allowed.eligible_standard_audio_card,false);
});
test('an oversized clip cannot be silently selected even in extended mode',()=>{
 const r=ellloCandidateReadiness(ELLLO_STARTER_CANDIDATES[2],{
  durationSeconds:130,durationVerified:true,extendedVideoRequested:true});
 assert.equal(r.ready_for_scored_listening,false);
});
test('invalid search input and unknown source are rejected',()=>{
 assert.throws(()=>searchEllloSource({level:'native'}),/Invalid level/);
 assert.throws(()=>searchEllloSource({limit:0}),/Invalid limit/);
 assert.throws(()=>ellloCandidateReadiness({id:'invented'}),/Unknown ELLLO/);
});
