import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import { buildCleanRoomReviewTemplate } from "../scripts/clean-room-review-template.mjs";
import { reconcileCleanRoomReview } from "../scripts/reconcile-clean-room-review.mjs";

const template=buildCleanRoomReviewTemplate("g5-science");
assert.equal(template.includesAnswerKeys,false);
assert.equal(template.itemCount,88);
assert.equal(template.items.length,88);
for(const item of template.items){
  assert.equal("scoring" in item,false,`${item.id}: blind worksheet leaked scoring`);
  assert.equal("rationale" in item,false,`${item.id}: blind worksheet leaked rationale`);
  assert(item.review&&Object.hasOwn(item.review,"reviewerAnswer"),`${item.id}: review fields missing`);
}

const canonicalResponse=item=>{
  if(Object.hasOwn(item.scoring||{},"answer"))return structuredClone(item.scoring.answer);
  if(Object.hasOwn(item.scoring||{},"answers"))return structuredClone(item.scoring.answers);
  if(Object.hasOwn(item.scoring||{},"matches"))return structuredClone(item.scoring.matches);
  if(Object.hasOwn(item.scoring||{},"order"))return structuredClone(item.scoring.order);
  throw new Error(`${item.id}: test helper does not know how to derive a canonical response`);
};

// This is a mechanical tooling fixture, NOT a clean-room audit. It populates known keys only
// to prove the reconciliation machinery handles every browser-effective Grade 5 Science item.
const completed=structuredClone(template);
const keyedById=new Map(BANKS["g5-science"].map(item=>[item.id,item]));
for(const worksheetItem of completed.items){
  const keyed=keyedById.get(worksheetItem.id);
  const review=worksheetItem.review;
  review.correctnessVerdict="pass";
  review.ambiguityVerdict="pass";
  review.gradeFitVerdict="pass";
  review.standardAlignmentVerdict="pass";
  if(keyed.scoring?.mode==="manual")review.manualRubricVerdict="pass";
  else review.reviewerAnswer=canonicalResponse(keyed);
}
const clean=reconcileCleanRoomReview(completed);
assert.equal(clean.passed,true);
assert.equal(clean.findingCount,0);

const mismatch=structuredClone(completed);
const firstMc=mismatch.items.find(item=>item.itemType==="multiple_choice");
const keyedMc=keyedById.get(firstMc.id);
firstMc.review.reviewerAnswer=keyedMc.options.find(option=>option!==keyedMc.scoring.answer);
const mismatchResult=reconcileCleanRoomReview(mismatch);
assert.equal(mismatchResult.passed,false);
assert(mismatchResult.findings.some(f=>f.id===firstMc.id&&f.type==="independent-answer-mismatch"));

const recordedFinding=structuredClone(completed);
recordedFinding.items[0].review.ambiguityVerdict="finding";
recordedFinding.items[0].review.notes="Ambiguity needs author review.";
const findingResult=reconcileCleanRoomReview(recordedFinding);
assert.equal(findingResult.passed,false);
assert(findingResult.findings.some(f=>f.type==="reviewer-finding"&&f.detail==="ambiguityVerdict"));

const reordered=structuredClone(completed);
[reordered.items[0],reordered.items[1]]=[reordered.items[1],reordered.items[0]];
assert.throws(()=>reconcileCleanRoomReview(reordered),/browser-effective order changed/);

console.log("PASS: blind clean-room worksheet contains no keys, requires complete reviewer judgments, detects independent-answer mismatches/findings, and forces restart when browser-effective order changes.");
