#!/usr/bin/env node
/** Reproducible SOURCE and SYNTHETIC packet cost audit. Not actual GPT tokens or latency. */
import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {buildLessonContextPacket} from '../src/context-packet.mjs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const oldRouterChars=1757,oldEngineChars=9402; // measured source at previous MLP release
const lengths=Object.fromEntries([
 ['router','install/PROJECT-ROUTER.md'],
 ['teaching','install/ASIT-ENGINE.md'],
 ['storage_on_demand','install/ASIT-STORAGE.md']
].map(([key,p])=>[key,read(p).length]));
const baseline=oldRouterChars+oldEngineChars;
const startup=lengths.router+lengths.teaching;
const stateFor=n=>({
 revision:100,profile:{target_language:'English',goals:['Synthetic test goal'],
  preferences:{feedback_style:'short'}},
 learning_plan:[{status:'active',revision:100,competency_ids:['synthetic-1'],
  rationale:'Source of the test is imaginary'}],
 competencies:[{id:'synthetic-1',can_do:'Ask for clarification',
  priority:4,required_modality:'typed_text',required_operation:'production',
  status:'emerging',evidence_count:n}],
 attempts:Array.from({length:n},(_,i)=>({
  attempt_id:'attempt-'+i,competency_id:'synthetic-1',
  answer:'Never send a verbatim learner reply',
  answer_summary:'Fictional short clarification',
  assessment:i%4===0?'needs_support':'partial',hint_level:'none',
  observed_modality:'typed_text',observed_operation:'production',
  rubric_rationale:'A fictional grade',session_id:'session-'+i
 })),
 review_queue:[{competency_id:'synthetic-1',content_or_pattern:'Request repetition',
  due_at:'2026-10-15T12:00:00Z'}],
 sessions:[{id:'session-final',summary:'A fictional interaction',next_step:'Practice a new context'}]
});
const samples=[0,50,500,5000].map(n=>{
 const start=performance.now();
 const {metrics}=buildLessonContextPacket(stateFor(n));
 return {history_attempts:n,packet_chars:metrics.serialized_chars,
  omitted_attempts:metrics.omitted_attempts,token_proxy:metrics.conservative_token_proxy,
  local_compute_ms:Number((performance.now()-start).toFixed(3))};
});
const maxPacket=Math.max(...samples.map(x=>x.packet_chars));
const result={method:'Source character counts; token proxy ceil(chars/3). NO LLM tokenizer and NO connector/network latency.',
 baseline:{router_chars:oldRouterChars,engine_chars:oldEngineChars,total_chars:baseline},
 current:{...lengths,boot_chars:startup,
   estimated_boot_token_proxy:Math.ceil(startup/3),
   storage_turn_chars:startup+lengths.storage_on_demand},
 reduction_pct:Number(((1-startup/baseline)*100).toFixed(1)),samples,
 per_turn_char_proxy:startup+maxPacket,
 per_storage_turn_char_proxy:startup+lengths.storage_on_demand+maxPacket};
console.log(JSON.stringify(result,null,2));
if(startup>=baseline||startup>=9500)throw new Error('Startup source context budget exceeded');
// Storage is loaded lazily, not in the normal lesson boot path. Bound it separately and also cap the combined storage turn.
if(lengths.storage_on_demand>10000 || startup+lengths.storage_on_demand>19000)
 throw new Error('On-demand storage source context budget exceeded');
if(maxPacket>6000)throw new Error('Packet cap exceeded');
if(samples.at(-1).packet_chars-samples[1].packet_chars>1000)
 throw new Error('Context grows with historical attempts');
