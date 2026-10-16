/**
 * ASIT's first read-only third-party listening/video source.
 * Real public ELLLO lesson pages are discovery references, NOT local media assets.
 * No scraping, downloading, rehosting, embedding or private learner data.
 */

export const ELLLO_SOURCE=Object.freeze({
 id:'elllo',name:'English Listening Lesson Library Online',
 homepage:'https://www.elllo.org/',
 videos:'https://www.elllo.org/video/',
 faq:'https://www.elllo.org/about/faq.htm',
 levels:['A1','A2','B1','B2','C1'],
 default_collection:'One Minute English',
 media_use:'link_to_original_lesson_only',
 video_redistribution_authorized:false,
 audio_redistribution_authorized:false,
 transcript_republication_authorized:false,
 native_inline_video_verified:false,
 source_count_claim:'over 3000 lessons overall and over 1000 One Minute English videos (self-reported)',
 // Different pages sometimes say "under 60s", while indexed lessons can exceed 60s.
 duration_must_be_verified_per_asset:true,
 default_audio_max_seconds:35,
 selected:true
});

const CANDIDATES=[
 {id:'elllo-a2-weekend-jill',level:'A2',title:'What did you do over the weekend?',
  topic_tags:['weekend','travel','holidays','past simple','family'],
  speaker:'Jill',speaker_country:'Australia',
  lesson_url:'https://elllo.org/video/A2BEG/A2-049-JILL-AUSTRALIA-WEEKEND.htm',
  media:'video_with_audio'},
 {id:'elllo-a2-public-transport-lesya',level:'A2',title:'Do you use the train or bus?',
  topic_tags:['transport','travel','commuting','preferences'],
  speaker:'Lesya',speaker_country:'Ukraine',
  lesson_url:'https://elllo.org/video/A2BEG/A2-015-LESYA-USE-TRAIN-OR-BUS.htm',
  media:'video_with_audio'},
 {id:'elllo-a2-daily-routine-nerissa',level:'A2',title:'When do you start and finish your day?',
  topic_tags:['daily routine','work','time','present simple','work from home'],
  speaker:'Nerissa',speaker_country:'Philippines',
  lesson_url:'https://elllo.org/video/A2BEG/A2-036-NERISSA-WHEN-START-AND-FINISH-DAY.htm',
  media:'video_with_audio'},
 {id:'elllo-a2-park-todd',level:'A2',title:'What can you do in the park?',
  topic_tags:['park','nature','city','can','abilities'],
  speaker:'Todd',speaker_country:'USA',
  lesson_url:'https://elllo.org/video/A2BEG/A2-039-TODD-CAN-KOREA.htm',
  media:'video_with_audio'},
 {id:'elllo-a2-present-continuous-sound-grammar',level:'A2',
  title:'Present Continuous',
  topic_tags:['present continuous','actions now','-ing','grammar','progressive'],
  speaker:null,speaker_country:null,
  lesson_url:'https://elllo.org/book/A2/A2-03-Present-Continuous.html',
  media:'sound_grammar_conversations',conversation_count:4},
 {id:'elllo-b1-dream-job-lucia',level:'B1',title:'What is your dream job?',
  topic_tags:['career','work','remote work','family','goals'],
  speaker:'Lucia',speaker_country:'Namibia',
  lesson_url:'https://elllo.org/video/1501/1534-Lucia-Dream-Job.html',
  media:'video_with_audio'}
];
export const ELLLO_STARTER_CANDIDATES=Object.freeze(CANDIDATES.map(x=>Object.freeze({
 ...x,topic_tags:Object.freeze(x.topic_tags),
 reported_duration_seconds:null,verified_duration_seconds:null,
 audio_asset_url:null,video_asset_url:null,
 playback_tested_on_chatgpt_mobile:false,
 ready_for_scored_listening:false,
 status:'source_lesson_verified_media_unassessed'
})));

const words=s=>String(s??'').toLowerCase().trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
export function searchEllloSource({level=null,topic='',limit=5}={}){
 if(level!==null&&!ELLLO_SOURCE.levels.includes(level))throw Error('Invalid level');
 if(!Number.isInteger(limit)||limit<1||limit>25)throw Error('Invalid limit');
 const q=words(topic);
 return ELLLO_STARTER_CANDIDATES
  .filter(c=>level===null||c.level===level)
  .map(c=>{
   const searchable=words([c.title,...c.topic_tags].join(' '));
   const score=q.reduce((sum,w)=>sum+searchable.filter(x=>x===w).length,0);
   return {c,score};
  })
  .filter(x=>q.length===0||x.score>0)
  .sort((a,b)=>b.score-a.score||a.c.id.localeCompare(b.c.id))
  .slice(0,limit)
  .map(x=>x.c);
}

/** A source lesson page is NOT a verified short media asset or learner assessment. */
export function ellloCandidateReadiness(candidate,{durationSeconds=null,
 durationVerified=false,originalPlayerHeard=false,transcriptReadBeforeAnswer=false,
 extendedVideoRequested=false}={}){
 if(!candidate||!ELLLO_STARTER_CANDIDATES.some(c=>c.id===candidate.id))
  throw Error('Unknown ELLLO candidate');
 const limit=extendedVideoRequested?90:35;
 const durationReady=durationVerified===true&&Number.isFinite(durationSeconds)&&
  durationSeconds>=5&&durationSeconds<=limit;
 return {
  id:candidate.id,source_url:candidate.lesson_url,
  can_display_discovery_link:true,
  content_redistributed:false,
  eligible_standard_audio_card:durationReady&&!extendedVideoRequested,
  eligible_requested_extended_video:durationReady&&extendedVideoRequested,
  media_duration_verified:durationReady,
  source_video_available:'original_site_only',
  listened_evidence:originalPlayerHeard===true?
    transcriptReadBeforeAnswer?'self_reported_audio_with_text_support':'self_reported_original_site_playback':
    'not_assessed',
  ready_for_scored_listening:durationReady&&originalPlayerHeard===true,
  reason:!durationReady?'short_clip_duration_not_confirmed':
    originalPlayerHeard!==true?'actual_playback_not_confirmed':'self_reported_only',
  progress_saved:false
 };
}
