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

const REVIEWED_CONTEXTUAL = new Map([
  // Some research/source-selection items intentionally include an obviously
  // off-topic source because identifying relevance is part of the construct.
  ['g7e-013', 'Research-source relevance item intentionally includes off-topic source categories among distractors.']
]);

const findings=[];
for(const [assessmentId,bank] of Object.entries(BANKS)){
  for(const item of bank){
    const surfaces=[...(item.options||[]),...(item.choices||[])];
    const flagged=surfaces.filter(value=>typeof value==='string'&&SUSPICIOUS_PATTERNS.some(pattern=>pattern.test(value)));
    if(flagged.length&&!REVIEWED_CONTEXTUAL.has(item.id)) findings.push({assessmentId,id:item.id,itemType:item.itemType,prompt:item.prompt,flagged});
  }
}

console.log(`DISTRACTOR-PLAUSIBILITY REVIEW QUEUE: ${findings.length} item(s) contain canned/off-topic distractor language.`);
for(const finding of findings){
  console.log(`${finding.assessmentId}/${finding.id} [${finding.itemType}]`);
  console.log(`  stem: ${finding.prompt}`);
  for(const option of finding.flagged) console.log(`  flagged: ${option}`);
}
