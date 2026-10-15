/**
 * Native Google Sheets setup request builder (no network / no credentials).
 * The ChatGPT agent translates these requests to its connected Google Drive tools.
 * Two-phase design: add tabs, re-read metadata, then write exact headers.
 * Never edits a workbook with unknown pre-existing user content.
 */
const validTitle=s=>typeof s==='string'&&s.length>0;
export function assertTemplate(template){
 if(template?.schema_version!==2||!Array.isArray(template.tabs)||template.tabs.length===0)
   throw new Error('Unrecognized ASIT template version');
 const names=template.tabs.map(x=>x.name);
 if(new Set(names).size!==names.length)throw new Error('Duplicate tab name');
 for(const tab of template.tabs){
  if(!validTitle(tab.name)||!Array.isArray(tab.columns)||tab.columns.length<2
   ||new Set(tab.columns).size!==tab.columns.length)throw new Error('Invalid tab definition');
 }
 return true;
}
export function planEmptyWorkbookStructure(template,metadata,{creationVerified=false,emptyVerified=false}={}){
 if(!creationVerified||!emptyVerified)throw new Error('New workbook and empty grid must be verified before setup');
 assertTemplate(template);
 const sheets=metadata?.sheets?.map(x=>x.properties??x);
 if(!Array.isArray(sheets)||sheets.length!==1)throw new Error('Expected a new one-tab workbook; do not mutate existing user files');
 const sheet=sheets[0];
 if(!Number.isInteger(sheet.sheetId)||!validTitle(sheet.title))
   throw new Error('Unexpected first tab; inspect and resolve manually');
 const first=template.tabs[0];
 const requests=[{updateSheetProperties:{properties:{sheetId:sheet.sheetId,title:first.name,
   gridProperties:{frozenRowCount:1}},fields:'title,gridProperties.frozenRowCount'}}];
 for(const t of template.tabs.slice(1))
   requests.push({addSheet:{properties:{title:t.name,gridProperties:{rowCount:1000,
     columnCount:Math.max(t.columns.length,26),frozenRowCount:1}}}});
 return requests;
}
export function planHeaderWrites(template,metadata){
 assertTemplate(template);
 const sheets=metadata?.sheets?.map(s=>s.properties??s)??[];
 const names=new Set(sheets.map(s=>s.title));
 if(sheets.length!==template.tabs.length||template.tabs.some(t=>!names.has(t.name)))
   throw new Error('Workbook tabs do not match ASIT template');
 const requests=[];
 for(const tab of template.tabs){
  const sid=sheets.find(s=>s.title===tab.name);
  if(!Number.isInteger(sid.sheetId) || (sid.gridProperties?.columnCount??0)<tab.columns.length)
    throw new Error('Invalid column count or sheet ID for '+tab.name);
  requests.push({updateCells:{
    range:{sheetId:sid.sheetId,startRowIndex:0,endRowIndex:1,startColumnIndex:0,endColumnIndex:tab.columns.length},
    rows:[{values:tab.columns.map(x=>({userEnteredValue:{stringValue:x}}))}],
    fields:'userEnteredValue'
  }});
  requests.push({repeatCell:{
    range:{sheetId:sid.sheetId,startRowIndex:0,endRowIndex:1,startColumnIndex:0,endColumnIndex:tab.columns.length},
    cell:{userEnteredFormat:{textFormat:{bold:true}}},fields:'userEnteredFormat.textFormat.bold'
  }});
 }
 return requests;
}
/** Call only after the learner explicitly accepted durable state and a verified privacy mode. */
export function planConfigSeed(metadata,mode,{consentGranted=false}={}){
 if(!consentGranted)throw new Error('Consent is required');
 if(!['raw','summary_only'].includes(mode))throw new Error('No authorized storage mode');
 const sheet=metadata?.sheets?.map(x=>x.properties??x).find(x=>x.title==='Config');
 if(!sheet||!Number.isInteger(sheet.sheetId))throw new Error('Config tab unavailable');
 const pairs=[['schema_version','2'],['state_revision','0'],['recording_consent',JSON.stringify(mode)]];
 const val=x=>({userEnteredValue:{stringValue:x}});
 return [{updateCells:{range:{sheetId:sheet.sheetId,startRowIndex:1,endRowIndex:4,
   startColumnIndex:0,endColumnIndex:2},rows:pairs.map(x=>({values:x.map(val)})),
   fields:'userEnteredValue'}}];
}
