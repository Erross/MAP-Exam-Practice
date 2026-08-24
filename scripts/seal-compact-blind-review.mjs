import fs from "node:fs";
import { createHash } from "node:crypto";
import { buildCleanRoomReviewTemplate } from "./clean-room-review-template.mjs";
import { sealCleanRoomReview } from "./seal-clean-room-review.mjs";

const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

function optionAt(options,position,id){
  if(!Array.isArray(options))throw new Error(`${id}: blind item has no option list`);
  const index=Number(position)-1;
  if(!Number.isInteger(index)||index<0||index>=options.length)throw new Error(`${id}: invalid 1-based option position ${position}`);
  return clone(options[index]);
}

function reviewerAnswer(item,decision){
  if(!decision||typeof decision!=="object")throw new Error(`${item.id}: missing compact reviewer answer`);
  if(Object.hasOwn(decision,"option"))return optionAt(item.options,decision.option,item.id);
  if(Array.isArray(decision.options))return decision.options.map(position=>optionAt(item.options,position,item.id));
  if(Array.isArray(decision.ebsrParts)){
    if(!Array.isArray(item.parts)||decision.ebsrParts.length!==item.parts.length)throw new Error(`${item.id}: ebsr part count mismatch`);
    return decision.ebsrParts.map((position,index)=>optionAt(item.parts[index].options,position,`${item.id}/part-${index+1}`));
  }
  if(decision.matches&&typeof decision.matches==="object"){
    const result={};
    for(const [key,position] of Object.entries(decision.matches))result[key]=optionAt(item.choices,position,`${item.id}/${key}`);
    return result;
  }
  if(Object.hasOwn(decision,"value"))return clone(decision.value);
  throw new Error(`${item.id}: unsupported compact reviewer answer encoding`);
}

export function completeBlindReview(compact){
  const template=buildCleanRoomReviewTemplate(compact.assessmentId);
  if(compact.includesAnswerKeys!==false)throw new Error("Compact decisions must remain answer-blind");
  if(compact.browserEffectiveFingerprint!==template.browserEffectiveFingerprint)throw new Error(`${compact.assessmentId}: compact review fingerprint is stale`);
  if(compact.itemCount!==template.itemCount||compact.reviewedThroughOrdinal!==template.itemCount)throw new Error(`${compact.assessmentId}: compact review is incomplete`);
  const answerIds=Object.keys(compact.answersById||{}).sort();
  const templateIds=template.items.map(item=>item.id).sort();
  if(JSON.stringify(answerIds)!==JSON.stringify(templateIds))throw new Error(`${compact.assessmentId}: compact answer id set does not exactly match the blind worksheet`);

  const completed=clone(template);
  for(const item of completed.items){
    const finding=compact.findingsById?.[item.id]||{};
    const verdict=field=>finding[field]||"pass";
    item.review={
      reviewerAnswer:reviewerAnswer(item,compact.answersById[item.id]),
      correctnessVerdict:verdict("correctnessVerdict"),
      ambiguityVerdict:verdict("ambiguityVerdict"),
      gradeFitVerdict:verdict("gradeFitVerdict"),
      standardAlignmentVerdict:verdict("standardAlignmentVerdict"),
      notes:finding.notes||""
    };
  }
  return completed;
}

const input=process.argv[2];
if(!input)throw new Error("Usage: node scripts/seal-compact-blind-review.mjs path/to/compact-decisions.json");
const compact=JSON.parse(fs.readFileSync(input,"utf8"));
const completed=completeBlindReview(compact);
const serialized=`${JSON.stringify(completed,null,2)}\n`;
const completedBlindReviewSha256=createHash("sha256").update(serialized).digest("hex");
const completedBlindReviewBytes=Buffer.byteLength(serialized);
const sealed=sealCleanRoomReview(completed);
if(!sealed.manualRubrics.length)throw new Error(`${compact.assessmentId}: no manual rubrics were exposed; use auto-scored reconciliation instead`);
console.log(`COMPACT_MANUAL_REVIEW_PACKET:${JSON.stringify({assessmentId:compact.assessmentId,browserEffectiveFingerprint:sealed.browserEffectiveFingerprint,itemCount:completed.items.length,completedBlindReviewSha256,completedBlindReviewBytes,blindReviewFingerprint:sealed.blindReviewFingerprint,manualRubrics:sealed.manualRubrics})}`);
