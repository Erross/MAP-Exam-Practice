import { BANKS } from '../js/banks.js';

const SUSPICIOUS_PATTERNS = [
  /color of (?:the )?(?:paper|notebook|folder|sign|walls?)/i,
  /notebook (?:cover )?colors?/i,
  /names? of nearby roads?/i,
  /count (?:the )?street signs?/i,
  /phone directory/i,
  /basketball team/i,
  /school lunch menu/i,
  /advertisement for alarm clocks?/i,
  /travel blog about morning traffic/i,
  /writer'?s favorite/i,
  /order in which students entered/i,
  /painted last year/i,
  /number of pages/i,
  /color of a nearby sign/i,
  /rename each/i
];

const findings=[];
for(const [assessmentId,bank] of Object.entries(BANKS)){
  for(const item of bank){
    const surfaces=[...(item.options||[]),...(item.choices||[])];
    const flagged=surfaces.filter(value=>typeof value==='string'&&SUSPICIOUS_PATTERNS.some(pattern=>pattern.test(value)));
    if(flagged.length) findings.push({assessmentId,id:item.id,itemType:item.itemType,prompt:item.prompt,flagged});
  }
}

if(findings.length){
  console.error(`FAIL: ${findings.length} item(s) still contain known canned/off-topic distractor language.`);
  for(const finding of findings){
    console.error(`${finding.assessmentId}/${finding.id} [${finding.itemType}]`);
    console.error(`  stem: ${finding.prompt}`);
    for(const option of finding.flagged) console.error(`  flagged: ${option}`);
  }
  process.exitCode=1;
}else{
  console.log('PASS: no browser-effective MAP item contains a known canned/off-topic distractor pattern.');
}
