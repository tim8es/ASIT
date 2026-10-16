import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isEllloLessonUrl,planEllloSearch,rankEllloResults,
 conversationText,buildEllloActivity,evaluateEllloActivity} from '../src/elllo-activity-pipeline.mjs';

const base='https://elllo.org/video/A2BEG/A2-015-LESYA-USE-TRAIN-OR-BUS.htm';
const grammarUrl='https://elllo.org/book/A2/A2-03-Present-Continuous.html';
const toyPage=['One Minute English','Example Transport Lesson',
 'Teacher: Which transport do you take into town?',
 'Student: I ride the bus to town on Mondays. I take the train for longer journeys.',
 'Teacher: Thanks for sharing.'].join('\n');
const excerpt='Student: I ride the bus to town on Mondays. I take the train for longer journeys.';
const questions=[
 {id:'gist',type:'single_choice',prompt:'Which transport is used in town?',
  expected:'bus',answer_anchor:'bus',
  evidence_quote:'I ride the bus to town on Mondays.',
  options:[{value:'bus',label:'The bus'},{value:'train',label:'The train'},{value:'car',label:'A car'}]},
 {id:'detail',type:'short_answer',prompt:'What does the learner use for longer journeys?',
  expected:'train',accepted:['the train'],answer_anchor:'train',
  evidence_quote:'I take the train for longer journeys.'}
];
const common={sourceUrl:base,pageText:toyPage,transcriptExcerpt:excerpt,
 title:'Example Transport Lesson',level:'A2',format:'video',
 durationSeconds:29,durationVerified:true,questions,reviewedByTeacher:true,sourcePageFetched:true};

test('search plan uses ELLLO only, returns known pages then website queries',()=>{
 const p=planEllloSearch({topic:'travel train',level:'A2',format:'video'});
 assert.equal(p.provider,'elllo');
 assert.equal(p.known_candidates[0].ready,false);
 assert.equal(p.must_fetch_and_verify_selected_page,true);
 assert.equal(p.search_queries.length,2);
 assert.ok(p.search_queries.every(q=>q.includes('elllo.org')));
 assert.equal(p.download_media,false);
 const g=planEllloSearch({grammar:'present continuous',level:'A2',format:'sound_grammar'});
 assert.match(g.search_queries[0],/site:elllo.org\/book\//);
 assert.equal(g.known_candidates[0].url,grammarUrl);
 assert.equal(g.must_fetch_and_verify_selected_page,true);
 assert.throws(()=>planEllloSearch({topic:'hello',format:'podcast'}),/Invalid/);
 assert.throws(()=>planEllloSearch({topic:'x'}),/concise/);
});
test('search results must be exact official ELLLO lessons, never external or fake downloads',()=>{
 assert.equal(isEllloLessonUrl(base),true);
 assert.equal(isEllloLessonUrl(grammarUrl),true);
 for(const url of [
  'https://evil.example/lesson.html',
  'https://elllo.org.evil.example/video/A2BEG/x.html',
  'http://elllo.org/video/A2BEG/x.htm',
  'https://elllo.org/about/faq.htm',
  'https://elllo.org/video/A2BEG/download.mp3',
  'https://elllo.org/video/A2BEG/x.html?q=private',
  'javascript:alert(1)'
 ])assert.equal(isEllloLessonUrl(url),false,url);
});
test('rank online results by topic/level, deduplicate and reject unrelated sites',()=>{
 const raw=[
  {url:'https://evil.example/travel.html',title:'A2 travel train'},
  {url:base,title:'Travel by train or bus A2',snippet:'travel transport train'},
  {url:base,title:'Duplicate travel'},
  {url:'https://elllo.org/video/A2BEG/A2-049-JILL-AUSTRALIA-WEEKEND.htm',title:'Weekend A2'}
 ];
 const r=rankEllloResults(raw,{topic:'train',level:'A2'});
 assert.equal(r.length,1);
 assert.equal(r[0].url,base);
 assert.equal(r[0].status,'search_candidate_unverified');
 assert.equal(r[0].media_duration_verified,false);
 const g=rankEllloResults([{url:grammarUrl,title:'Present Continuous A2'}],
  {grammar:'present continuous',format:'sound_grammar',level:'A2'});
 assert.equal(g.length,1);
});
test('valid media page, verified transcript, short duration and grounded questions yields a native card',()=>{
 const card=buildEllloActivity(common);
 assert.equal(card.status,'ready_for_user_playback_test');
 assert.equal(card.presentation,'native_intelligent_ui_question_controls');
 assert.equal(card.media.source_url,base);
 assert.equal(card.media.inline_playback_claim,false);
 assert.equal(card.media.duration_seconds,29);
 assert.equal(card.render.one_submit,true);
 assert.equal(card.render.transcript_before_submit,'hidden');
 assert.equal(card.no_source_media_redistribution,true);
 assert.equal(card.learner_data_saved,false);
 assert.ok(!JSON.stringify(card).includes(toyPage));
});
test('source page, title, selected transcript and human question review must be verified',()=>{
 assert.equal(buildEllloActivity({...common,sourcePageFetched:false}).reason,'source_page_not_verified');
 assert.equal(buildEllloActivity({...common,title:'Other Title'}).reason,'title_not_on_source_page');
 assert.equal(buildEllloActivity({...common,transcriptExcerpt:'I found a whale on Mars!'}).reason,'transcript_not_grounded');
 assert.equal(buildEllloActivity({...common,reviewedByTeacher:false}).reason,'semantic_question_review_required');
 assert.equal(buildEllloActivity({...common,questions:[]}).reason,'need_two_or_three_questions');
});
test('long ELLLO video is blocked until explicit extended video request',()=>{
 assert.equal(buildEllloActivity({...common,durationSeconds:65}).reason,'clip_too_long');
 assert.equal(buildEllloActivity({...common,durationSeconds:65,extendedVideoRequested:true}).status,'ready_for_user_playback_test');
 assert.equal(buildEllloActivity({...common,durationSeconds:97,extendedVideoRequested:true}).reason,'clip_too_long');
 assert.equal(buildEllloActivity({...common,durationVerified:false}).reason,'clip_duration_not_verified');
});
test('missing source evidence or fabricated answers block construction',()=>{
 const fake=[{...questions[0],evidence_quote:'I paid 100 dollars for the bus'},questions[1]];
 assert.throws(()=>buildEllloActivity({...common,questions:fake}),/exact source evidence/);
 const fake2=[{...questions[0],answer_anchor:'airplane'},questions[1]];
 assert.throws(()=>buildEllloActivity({...common,questions:fake2}),/Answer not anchored/);
 const duplicate=[questions[0],{...questions[1],id:'gist'}];
 assert.throws(()=>buildEllloActivity({...common,questions:duplicate}),/Duplicate question IDs/);
});
test('Sound Grammar must identify the exact conversation, not another section',()=>{
 const transcript=['Sound Grammar Lesson','Present Continuous',
  '#### Conversation 1','Man: What are you doing?','Woman: I am writing a report about gardens.',
  '#### Conversation 2','Man: Where is Dad?','Woman: He is cooking a meal.',
  '#### Conversation 3','Man: Are you shopping?','Woman: No, I am walking.',
  '#### Conversation 4','Man: Is he hurt?','Woman: He is standing up.'].join('\n');
 assert.match(conversationText(transcript,2),/cooking a meal/);
 assert.doesNotMatch(conversationText(transcript,2),/writing a report/);
 const qs=[
  {id:'x',type:'single_choice',prompt:'What is Dad doing?',expected:'cooking',
   answer_anchor:'cooking',evidence_quote:'He is cooking a meal.',
   options:[{value:'cooking',label:'Cooking'},{value:'sleeping',label:'Sleeping'}]},
  {id:'y',type:'short_answer',prompt:'What food is mentioned?',expected:'meal',
   answer_anchor:'meal',evidence_quote:'He is cooking a meal.'}
 ];
 const expected={...common,sourceUrl:grammarUrl,title:'Present Continuous',
  format:'sound_grammar',pageText:transcript,conversationIndex:2,
  transcriptExcerpt:'Man: Where is Dad? Woman: He is cooking a meal.',questions:qs};
 assert.equal(buildEllloActivity(expected).status,'ready_for_user_playback_test');
 assert.equal(buildEllloActivity({...expected,conversationIndex:1}).reason,'wrong_or_unverified_conversation');
 assert.throws(()=>conversationText(transcript,0),/Conversation index/);
});
test('learner failure is not assessed; external heard is only self-report, not telemetry',()=>{
 const card=buildEllloActivity(common);
 const fail=evaluateEllloActivity(card,{playback:'failed',answers:{gist:'bus',detail:'train'}});
 assert.equal(fail.correct_count,null);
 assert.equal(fail.listening_evidence.label,'not_assessed');
 assert.equal(fail.completion,'incomplete');
 const heard=evaluateEllloActivity(card,{playback:'heard',answers:{gist:'bus',detail:'train'}});
 assert.equal(heard.correct_count,2);
 assert.equal(heard.playback_provenance,'learner_self_report_not_telemetry');
 assert.equal(heard.stored,false);
 const read=evaluateEllloActivity(card,{playback:'assisted',answers:{gist:'bus',detail:'train'}});
 assert.equal(read.listening_evidence.label,'audio_plus_text_supported');
 assert.throws(()=>evaluateEllloActivity({status:'candidate_only'}),/Cannot assess/);
});
