/**
 * Reference persistence orchestrator for an injected Google Sheets-like adapter.
 * Production ChatGPT does not execute this JavaScript: the teacher follows the
 * same ordered steps via connected tools. No credentials, endpoints or API here.
 */
import {ATTEMPT_COLUMNS,encodeAttemptRow,verifyHeaders} from './storage-contract.mjs';
const same=(a,b)=>String(a??'')===String(b??'');
function checkMatch(row,expected){
  if(!Array.isArray(row)||row.length!==ATTEMPT_COLUMNS.length)return false;
  // Compare all consented stored fields, rather than only the ID.
  return row.every((v,i)=>same(v,expected[i]));
}
/**
 * Required adapter functions:
 *   readAttemptHeaders(), findAttemptsById(id), appendAttemptRow(row), findAttemptsById(id)
 * Preconditions:
 *  - scope is uniquely resolved and user has explicitly agreed to this privacy mode;
 *  - task identifiers and grade were verified by the teacher using trusted lesson state.
 * This routine does NOT provide transactional uniqueness under concurrent writers.
 */
export async function persistAttempt({adapter,attempt,privacyMode,summary=null,consentGranted=false}){
  if(!consentGranted)throw new Error('User consent required for durable writes');
  if(!adapter||['readAttemptHeaders','findAttemptsById','appendAttemptRow'].some(
    name=>typeof adapter[name]!=='function'))throw new Error('Incomplete storage adapter');
  const headers=await adapter.readAttemptHeaders();
  if(!verifyHeaders(headers))throw new Error('Sheet schema mismatch: refusing write');
  const expected=encodeAttemptRow(attempt,{privacyMode,summary});
  const prior=await adapter.findAttemptsById(attempt.attempt_id);
  if(!Array.isArray(prior))throw new Error('Invalid search response');
  if(prior.length>1)throw new Error('Multiple existing records with same attempt ID');
  if(prior.length===1){
    if(checkMatch(prior[0],expected))return {status:'already_saved',verified:true};
    if(privacyMode==='summary_only'){
      // Previous summary may differ from new LLM summary of the same raw answer.
      // Do not claim exact equivalence, and NEVER append a new same-ID row.
      return {status:'duplicate_unverified',verified:false};
    }
    throw new Error('Conflicting existing attempt ID');
  }
  await adapter.appendAttemptRow(expected);
  const readback=await adapter.findAttemptsById(attempt.attempt_id);
  if(!Array.isArray(readback)||readback.length!==1||!checkMatch(readback[0],expected)){
    throw new Error('Write could not be verified. Do not claim saved.');
  }
  return {status:'saved',verified:true};
}
