/**
 * ASIT ELLLO external-media discovery → source-grounded Intelligent UI card.
 * Pure reference logic: no network, player, crawler, site mirroring or persistence.
 * A teaching ChatGPT turn executes the search/page-read steps using available web tools.
 */
import {searchEllloSource} from './elllo-source.mjs';
import {assessListenAnswerCard,auditListeningDuration} from './listen-answer-card.mjs';

const allowedHosts=new Set(['elllo.org','www.elllo.org']);
const levels=new Set(['A1','A2','B1','B2','C1']);
const modes=new Set(['audio','video','sound_grammar']);
const compact=s=>String(s??'').replace(/\s+/g,' ').trim();
const lower=s=>compact(s).toLocaleLowerCase('en');
const tokens=s=>lower(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);

/** URLs must point at ORIGINAL ELLLO lesson pages, not downloads/search/iframes. */
export function isEllloLessonUrl(value){
 try{
  const u=new URL(value);
  return u.protocol==='https:'&&allowedHosts.has(u.hostname)&&
   u.username===''&&u.password===''&&u.search===''&&u.hash===''&&
   (/^\/video\/[\w/-]+\.(?:html?|HTML?)$/.test(u.pathname)||
    /^\/book\/[\w/-]+\.html$/.test(u.pathname));
 }catch{return false;}
}

/** Query plan is intended for model-controlled web search, NOT a network call. */
export function planEllloSearch({topic='',grammar='',level=null,format='video',
 recentLessonUrls=[]}={}){
 if(!modes.has(format))throw new Error('Invalid ELLLO media format');
 if(level!==null&&!levels.has(level))throw new Error('Invalid ELLLO level');
 if(!Array.isArray(recentLessonUrls))throw new Error('Invalid lesson history');
 const focus=compact(grammar||topic);
 if(focus.length<2||focus.length>100)throw new Error('A concise lesson topic or grammar point is required');
 // Search only PUBLIC generic learning topics; never include personal learner data.
 const clean=focus.replace(/[^\p{L}\p{N}\s'-]/gu,' ').replace(/\s+/g,' ').trim();
 const collection=format==='sound_grammar'?'book':'video';
 const levelFragment=level?level+' ':'';
 const terms=clean.split(' ').slice(0,8).join(' ');
 const queries=[
  'site:elllo.org/'+collection+'/ '+levelFragment+terms+' '+
   (format==='sound_grammar'?'Sound Grammar':'One Minute English'),
  'site:elllo.org '+levelFragment+terms+' '+
   (format==='sound_grammar'?'grammar conversation':'short video English listening')
 ];
 const indexed=searchEllloSource({topic:terms,level,limit:5})
  .filter(x=>!recentLessonUrls.includes(x.lesson_url));
 return {provider:'elllo',stage:'search',format,level,focus:clean,
  known_candidates:indexed.map(x=>({id:x.id,url:x.lesson_url,title:x.title,
    level:x.level,ready:false})),
  live_search_required:indexed.length===0,
  // Even known pages require fresh retrieval and duration/transcript validation.
  must_fetch_and_verify_selected_page:true,
  search_queries:queries,
  allowed_source_hostnames:[...allowedHosts],
  search_tool:'web_search_current',
  no_user_profile_in_external_query:true,
  download_media:false,automatic_scraping:false};
}

/** Rank tool-returned public results. Do not trust snippets as full transcripts. */
export function rankEllloResults(results,{topic='',grammar='',level=null,
 format='video',limit=5,recentLessonUrls=[]}={}){
 if(!Array.isArray(results))throw new Error('Results must be an array');
 if(!modes.has(format))throw new Error('Invalid format');
 if(level!==null&&!levels.has(level))throw new Error('Invalid level');
 if(!Number.isInteger(limit)||limit<1||limit>10)throw new Error('Invalid limit');
 const focus=tokens(grammar||topic);
 const ranked=results.filter(isObject)
  .filter(x=>isEllloLessonUrl(x.url)&&!recentLessonUrls.includes(x.url))
  .filter(x=>format==='sound_grammar'?new URL(x.url).pathname.startsWith('/book/'):
    new URL(x.url).pathname.startsWith('/video/'))
  .map(x=>{
   const hay=tokens((x.title||'')+' '+(x.snippet||''));
   const match=focus.reduce((v,w)=>v+(hay.includes(w)?2:0),0);
   const levelMatch=level&&new URL(x.url).pathname.toUpperCase().includes(level);
   return {url:x.url,title:compact(x.title),score:match+(levelMatch?3:0),
     status:'search_candidate_unverified',transcript_verified:false,
     media_duration_verified:false};
  })
  .filter(x=>focus.length===0||x.score>0)
  .sort((a,b)=>b.score-a.score||a.url.localeCompare(b.url));
 return [...new Map(ranked.map(x=>[x.url,x])).values()].slice(0,limit);
}

/** Section-specific transcript prevents grading from a DIFFERENT Sound Grammar conversation. */
export function conversationText(pageText,index){
 if(!Number.isInteger(index)||index<1||index>4)throw new Error('Conversation index must be 1–4');
 const t=String(pageText??'');
 const re=new RegExp('(?:^|\\n)\\s*(?:#{1,6}\\s*)?Conversation\\s+'+index+'\\b[^\\n]*\\n','i');
 const match=re.exec(t);
 if(!match)return null;
 const rest=t.slice(match.index+match[0].length);
 const next=rest.search(/(?:^|\n)\s*(?:#{1,6}\s*)?Conversation\s+[1-4]\b/i);
 return next<0?rest.slice(0,3500):rest.slice(0,next);
}
const contains=(hay,needle)=>nonempty(needle)&&lower(hay).includes(lower(needle));

function validateQuestion(q,excerpt){
 if(!isObject(q)||!nonempty(q.id)||!nonempty(q.prompt)||
  !['single_choice','short_answer','free_response'].includes(q.type))
   throw new Error('Invalid question');
 if(!nonempty(q.evidence_quote)||q.evidence_quote.length>240||
  !contains(excerpt,q.evidence_quote))
   throw new Error('Question lacks exact source evidence');
 if(q.type==='free_response')return {id:q.id,type:q.type,prompt:q.prompt,
  required:q.required!==false};
 if(!nonempty(q.expected)||!nonempty(q.answer_anchor)||
  !contains(q.evidence_quote,q.answer_anchor))
   throw new Error('Answer not anchored to source quote');
 if(q.type==='single_choice'){
  if(!Array.isArray(q.options)||q.options.length<2||q.options.length>4||
   !q.options.every(x=>isObject(x)&&nonempty(x.value)&&nonempty(x.label)))
   throw new Error('Invalid choice options');
  if(new Set(q.options.map(x=>x.value)).size!==q.options.length||
    !q.options.some(x=>x.value===q.expected))
   throw new Error('Missing or duplicate correct option');
 }
 return {id:q.id,type:q.type,prompt:q.prompt,expected:q.expected,
   required:q.required!==false,...(q.type==='single_choice'?
    {options:q.options.map(o=>({value:o.value,label:o.label}))}:{}),
   ...(Array.isArray(q.accepted)?{accepted:q.accepted.filter(nonempty)}:{})};
}

/**
 * Accept teacher-authored draft questions ONLY if their evidence is an exact span
 * of a freshly retrieved ELLLO script, scoped to the selected conversation.
 * This cannot prove semantic correctness; teacher must check interpretation.
 */
export function buildEllloActivity({sourceUrl,pageText,transcriptExcerpt,
 title,level=null,format='video',conversationIndex=null,
 durationSeconds=null,durationVerified=false,extendedVideoRequested=false,
 questions=[],reviewedByTeacher=false,sourcePageFetched=false}={}){
 if(!isEllloLessonUrl(sourceUrl))throw new Error('Unverified ELLLO lesson URL');
 if(!modes.has(format))throw new Error('Invalid format');
 if(level!==null&&!levels.has(level))throw new Error('Invalid CEFR level');
 if(!sourcePageFetched||!nonempty(pageText)||!nonempty(title))
  return {status:'candidate_only',reason:'source_page_not_verified'};
 if(!contains(pageText,title))
  return {status:'candidate_only',reason:'title_not_on_source_page'};
 if(!nonempty(transcriptExcerpt)||transcriptExcerpt.length<45||
   !contains(pageText,transcriptExcerpt))
  return {status:'candidate_only',reason:'transcript_not_grounded'};
 if(format==='sound_grammar'){
   const section=conversationText(pageText,conversationIndex);
   if(!section||!contains(section,transcriptExcerpt))
    return {status:'candidate_only',reason:'wrong_or_unverified_conversation'};
 }
 const duration=auditListeningDuration({
  durationSeconds,durationVerified,extendedListening:extendedVideoRequested});
 if(!duration.eligible)return {status:'candidate_only',reason:duration.reason,
  duration_audit:duration};
 if(!reviewedByTeacher)
  return {status:'candidate_only',reason:'semantic_question_review_required'};
 if(!Array.isArray(questions)||questions.length<2||questions.length>3)
  return {status:'candidate_only',reason:'need_two_or_three_questions'};
 const ids=questions.map(x=>x.id);
 if(new Set(ids).size!==ids.length)throw new Error('Duplicate question IDs');
 const checked=questions.map(q=>validateQuestion(q,transcriptExcerpt));
 return {
  status:'ready_for_user_playback_test',type:'listening',
  presentation:'native_intelligent_ui_question_controls',
  media:{source:'elllo',format,source_url:sourceUrl,title,
   level,duration_seconds:duration.actual_seconds,
   conversation_index:format==='sound_grammar'?conversationIndex:null,
   inline_playback_claim:false,external_source:true},
  questions:checked,
  render:{play_link:'original_elllo_lesson',answer_controls:'native',
    transcript_before_submit:'hidden',feedback_after_submit:true,
    one_submit:true,require_user_heard_confirmation:true},
  evidence_modality:'awaiting_self_reported_source_playback',
  question_provenance:'teacher_authored_from_exact_ephemeral_elllo_script',
  transcript_copied_to_card:false,
  no_source_media_redistribution:true,
  learner_data_saved:false
 };
}

/** Validate a learner Submit against the vetted activity (not client-supplied key). */
export function evaluateEllloActivity(activity,{answers={},playback='failed',
 transcriptSeenBeforeAnswer=false}={}){
 if(activity?.status!=='ready_for_user_playback_test')
  throw new Error('Cannot assess an unverified source activity');
 if(!['heard','assisted','failed'].includes(playback))
  throw new Error('Unknown playback status');
 const heard=playback!=='failed';
 const feedback=assessListenAnswerCard({
  questions:activity.questions,answers,
  playback:{delivery:'external',assetPlayable:heard,
    externalAudioOpened:heard,learnerReportsCompletedClip:heard,
    learnerConfirmedHeard:heard,
    transcriptShownBeforeAnswers:transcriptSeenBeforeAnswer||playback==='assisted'}
 });
 return {...feedback,provider:'elllo',
  playback_provenance:heard?'learner_self_report_not_telemetry':'unavailable',
  source_lesson_url:activity.media.source_url,
  completion:heard?feedback.completion:'incomplete',
  stored:false};
}
