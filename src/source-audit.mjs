/** Heuristic source safety scanner. Cannot prove absence of all private data. */
export function scanTextForSensitiveMaterial(source){
 if(typeof source!=='string')throw new TypeError('Expected source text');
 const checks=[
  ['private-document-link',/https?:\/\/docs\.google\.com\/(?:document|spreadsheets)\/d\/[A-Za-z0-9_-]{20,}/g],
  ['github-access-token',/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{24,}\b/g],
  ['openai-api-key',/\bsk-(?:proj-)?[A-Za-z0-9_-]{30,}\b/g],
  ['google-api-key',/\bAIza[A-Za-z0-9_-]{30,}\b/g],
  ['aws-access-key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['email-address',/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g],
  ['private-key-block',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g]
 ];
 return checks.filter(([,re])=>re.test(source)).map(([type])=>type);
}
