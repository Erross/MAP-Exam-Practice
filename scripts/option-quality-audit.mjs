import { BANKS } from '../js/banks.js';

const STOP = new Set(['which','what','when','where','why','how','the','a','an','and','or','of','to','in','on','for','with','from','by','as','is','are','was','were','be','been','being','that','this','these','those','it','its','their','they','them','best','most','least','according','based','select','answer','choice','model']);

const REVIEWED_CUES = new Map([
  ['g3-ela/g3e-res-002', {
    assessmentId:'g3-ela', id:'g3e-res-002', lexicalCue:true, lengthCue:false,
    prompt:'Which search phrase would best help a student learn why leaves change color in autumn?',
    answer:'why leaves change color autumn',
    rationale:'Keyword-search relevance is the construct: the best query should deliberately reuse the research topic and causal focus. The distractors are related autumn/leaf searches with different purposes, so overlap is not a standalone answer-position cue.'
  }],
  ['g3-ela/g3e-wl-008', {
    assessmentId:'g3-ela', id:'g3e-wl-008', lexicalCue:true, lengthCue:false,
    prompt:'Which sentence would best introduce a paragraph about why bees visit flowers?',
    answer:'Bees visit flowers to collect food such as nectar and pollen.',
    rationale:'A topic-sentence item appropriately names the paragraph topic and directly states its explanatory focus. The alternatives are related bee/flower facts that do not explain the reason for the behavior.'
  }],
  ['g3-ela/g3e-top-014', {
    assessmentId:'g3-ela', id:'g3e-top-014', lexicalCue:true, lengthCue:false,
    prompt:'How can a tail help a squirrel while moving?',
    answer:'It can help the squirrel balance while climbing and jumping.',
    rationale:'This is a passage-detail retrieval item. Reuse of squirrel/movement language in the keyed response reflects the explicitly stated passage fact rather than an independent testwise cue.'
  }],
  ['g4-ela/g4e-030', {
    assessmentId:'g4-ela', id:'g4e-030', lexicalCue:true, lengthCue:false,
    prompt:"Why is water important during the beginning of a frog's life?",
    answer:'Many frog eggs are laid in water and tadpoles begin life swimming there',
    rationale:'This is a passage-evidence question about the early life cycle. The correct response necessarily restates the water-based egg/tadpole evidence; lexical overlap is part of accurately retrieving the cited detail.'
  }],
  ['g5-ela/g5e-res-007', {
    assessmentId:'g5-ela', id:'g5e-res-007', lexicalCue:true, lengthCue:false,
    prompt:'Which note best combines information from two sources that both report native plants support pollinators?',
    answer:'Both sources report that native flowering plants can provide food resources for local pollinators.',
    rationale:'Synthesis requires preserving the proposition shared by both sources. The distractors intentionally reuse native-plant/pollinator language while adding unsupported universal claims, so the key is distinguished by evidentiary restraint rather than topic-word presence alone.'
  }],
  ['g5-ela/g5e-wl-008', {
    assessmentId:'g5-ela', id:'g5e-wl-008', lexicalCue:true, lengthCue:false,
    prompt:'A report explains how a rain garden works. Which sentence does not belong in that explanation?',
    answer:'The rain garden beside the library was installed during spring break last year.',
    rationale:'The negative stem reverses the normal lexical-cue interpretation: the keyed sentence shares rain-garden words but is excluded because it gives installation history rather than mechanism. The overlap therefore works against, not toward, superficial selection.'
  }],
  ['g6-ela/g6e-top-013', {
    assessmentId:'g6-ela', id:'g6e-top-013', lexicalCue:true, lengthCue:false,
    prompt:'Why does the author mention the reference period used to calculate a normal?',
    answer:'To show that comparisons can change if the set of years used for the reference changes.',
    rationale:'The item asks for the author-purpose implication of a specific stated concept. Reusing reference/comparison language is necessary to express that implication; distractors represent alternative interpretations of the same passage.'
  }],
  ['g7-ela/g7e-012', {
    assessmentId:'g7-ela', id:'g7e-012', lexicalCue:false, lengthCue:true,
    prompt:'Which sentence best supports the idea that restoration should be tailored to a location?',
    answer:'Because every stream has different conditions, successful restoration usually begins with measurements and observations rather than a single solution applied everywhere.',
    rationale:'This hot-text evidence item selects an intact sentence from the passage. Its length is source-determined, and the keyed sentence directly states the location-specific principle; shortening it would stop being faithful passage evidence.'
  }]
]);

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

function reviewMatches(finding, review) {
  return review
    && review.assessmentId === finding.assessmentId
    && review.id === finding.id
    && review.prompt === finding.prompt
    && review.answer === finding.answer
    && review.lexicalCue === finding.lexicalCue
    && review.lengthCue === finding.lengthCue;
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

const reviewed=[];
const unreviewed=[];
for(const finding of findings){
  const key=`${finding.assessmentId}/${finding.id}`;
  const review=REVIEWED_CUES.get(key);
  if(reviewMatches(finding,review)) reviewed.push({finding,review});
  else unreviewed.push(finding);
}
const liveKeys=new Set(reviewed.map(({finding})=>`${finding.assessmentId}/${finding.id}`));
const stale=[...REVIEWED_CUES.entries()].filter(([key])=>!liveKeys.has(key));

console.log(`OPTION-QUALITY REVIEW QUEUE: ${findings.length} high-signal candidate(s); ${reviewed.length} exact reviewed disposition(s); ${unreviewed.length} unreviewed.`);
for(const {finding,review} of reviewed){
  const reasons=[finding.lexicalCue?`lexical ${finding.correctOverlap} vs ${finding.maxOtherOverlap}`:null,finding.lengthCue?`length ${finding.correctLength} vs ${finding.maxOther}`:null].filter(Boolean).join(', ');
  console.log(`REVIEWED ${finding.assessmentId}/${finding.id}: ${reasons}`);
  console.log(`  ${review.rationale}`);
}
for(const finding of unreviewed.slice(0,80)){
  const reasons=[finding.lexicalCue?`lexical ${finding.correctOverlap} vs ${finding.maxOtherOverlap}`:null,finding.lengthCue?`length ${finding.correctLength} vs ${finding.maxOther}`:null].filter(Boolean).join(', ');
  console.error(`UNREVIEWED ${finding.assessmentId}/${finding.id}: ${reasons}`);
  console.error(`  stem: ${finding.prompt}`);
  console.error(`  key:  ${finding.answer}`);
}
if(unreviewed.length>80)console.error(`... ${unreviewed.length-80} additional unreviewed candidate(s) omitted from log.`);
for(const [key,review] of stale){
  console.error(`STALE OPTION-QUALITY DISPOSITION ${key}: expected exact cue no longer matches current item.`);
  console.error(`  ${review.rationale}`);
}

if(unreviewed.length||stale.length){
  throw new Error(`Option-quality reconciliation failed: ${unreviewed.length} unreviewed finding(s), ${stale.length} stale disposition(s). Repair the item or update the exact reviewed disposition after human-quality review.`);
}
console.log(`PASS: all ${findings.length} high-signal option-quality cue(s) are exactly reconciled; any new or changed cue will fail this gate.`);
