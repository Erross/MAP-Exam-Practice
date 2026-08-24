import { BANKS } from '../js/banks.js';

const STOP = new Set(['which','what','when','where','why','how','the','a','an','and','or','of','to','in','on','for','with','from','by','as','is','are','was','were','be','been','being','that','this','these','those','it','its','their','they','them','best','most','least','according','based','select','answer','choice','model']);

function words(text='') {
  return String(text).toLowerCase().match(/[a-z][a-z-]+/g)?.filter(word => word.length >= 4 && !STOP.has(word)) ?? [];
}

function overlap(prompt, option) {
  const p = new Set(words(prompt));
  return new Set(words(option)).size === 0 ? 0 : [...new Set(words(option))].filter(word => p.has(word)).length;
}

function singleChoiceOptions(item) {
  if (!Array.isArray(item.options) || typeof item.scoring?.answer !== 'string') return null;
  const correctIndex = item.options.indexOf(item.scoring.answer);
  if (correctIndex < 0 || item.options.some(option => typeof option !== 'string')) return null;
  return { correctIndex, options: item.options };
}

const findings=[];
const summaries=[];
for (const [assessmentId, bank] of Object.entries(BANKS)) {
  let scorable=0, uniqueLongest=0, cueFlags=0, lengthFlags=0;
  for (const item of bank) {
    const parsed=singleChoiceOptions(item);
    if (!parsed || parsed.options.length < 2) continue;
    scorable++;
    const {correctIndex,options}=parsed;
    const lengths=options.map(option=>words(option).length);
    const correctLength=lengths[correctIndex];
    const maxOther=Math.max(...lengths.filter((_length,index)=>index!==correctIndex));
    if (correctLength>maxOther) uniqueLongest++;

    const overlaps=options.map(option=>overlap(item.prompt,option));
    const correctOverlap=overlaps[correctIndex];
    const maxOtherOverlap=Math.max(...overlaps.filter((_value,index)=>index!==correctIndex));
    const lexicalCue=correctOverlap>=2&&correctOverlap>=maxOtherOverlap+2;
    const lengthCue=correctLength>=7&&correctLength>=Math.max(4,maxOther*1.75);
    if(lexicalCue)cueFlags++;
    if(lengthCue)lengthFlags++;
    if(lexicalCue||lengthCue){
      findings.push({assessmentId,id:item.id,lexicalCue,lengthCue,correctOverlap,maxOtherOverlap,correctLength,maxOther,prompt:item.prompt,answer:item.scoring.answer});
    }
  }
  summaries.push({assessmentId,scorable,uniqueLongest,rate:scorable?uniqueLongest/scorable:0,cueFlags,lengthFlags});
}

console.log('OPTION-QUALITY SUMMARY');
for(const summary of summaries){
  console.log(`${summary.assessmentId}: ${summary.scorable} single-choice items; uniquely-longest keyed option ${(summary.rate*100).toFixed(1)}%; lexical flags ${summary.cueFlags}; extreme-length flags ${summary.lengthFlags}`);
}
console.log(`OPTION-QUALITY REVIEW QUEUE: ${findings.length} high-signal candidate(s)`);
for(const finding of findings.slice(0,80)){
  const reasons=[finding.lexicalCue?`lexical ${finding.correctOverlap} vs ${finding.maxOtherOverlap}`:null,finding.lengthCue?`length ${finding.correctLength} vs ${finding.maxOther}`:null].filter(Boolean).join(', ');
  console.log(`${finding.assessmentId}/${finding.id}: ${reasons}`);
  console.log(`  stem: ${finding.prompt}`);
  console.log(`  key:  ${finding.answer}`);
}
if(findings.length>80)console.log(`... ${findings.length-80} additional candidate(s) omitted from log; run npm run diagnose:option-quality locally for full review.`);
