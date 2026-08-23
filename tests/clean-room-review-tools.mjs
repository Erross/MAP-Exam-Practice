import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import { buildCleanRoomReviewTemplate } from "../scripts/clean-room-review-template.mjs";
import { sealCleanRoomReview } from "../scripts/seal-clean-room-review.mjs";
import { reconcileCleanRoomReview } from "../scripts/reconcile-clean-room-review.mjs";

const template=buildCleanRoomReviewTemplate("g5-science");
assert.equal(template.schemaVersion,2);
assert.equal(template.includesAnswerKeys,false);
assert.equal(template.itemCount,88);
assert.equal(template.items.length,88);
assert.match(template.browserEffectiveFingerprint,/^[a-f0-9]{64}$/);
for(const item of template.items){
  assert.equal("scoring" in item,false,`${item.id}: blind worksheet leaked scoring`);
  assert.equal("rationale" in item,false,`${item.id}: blind worksheet leaked rationale`);
  assert(item.review&&Object.hasOwn(item.review,"reviewerAnswer"),`${item.id}: review fields missing`);
  assert.equal(Object.hasOwn(item.review,"manualRubricVerdict"),false,`${item.id}: blind worksheet must not solicit a rubric verdict before the rubric is exposed post-seal`);
}

const canonicalResponse=item=>{
  if(Object.hasOwn(item.scoring||{},"answer"))return structuredClone(item.scoring.answer);
  if(Object.hasOwn(item.scoring||{},"answers"))return structuredClone(item.scoring.answers);
  if(Object.hasOwn(item.scoring||{},"matches"))return structuredClone(item.scoring.matches);
  if(Object.hasOwn(item.scoring||{},"order"))return structuredClone(item.scoring.order);
  throw new Error(`${item.id}: test helper does not know how to derive a canonical response`);
};

function mechanicallyCompleteBlind(){
  // Mechanical fixture only, NOT a clean-room audit: tests may inspect known keys to prove
  // the workflow machinery handles every browser-effective Grade 5 Science response type.
  const completed=structuredClone(template);
  const keyedById=new Map(BANKS["g5-science"].map(item=>[item.id,item]));
  for(const worksheetItem of completed.items){
    const keyed=keyedById.get(worksheetItem.id);
    const review=worksheetItem.review;
    review.correctnessVerdict="pass";
    review.ambiguityVerdict="pass";
    review.gradeFitVerdict="pass";
    review.standardAlignmentVerdict="pass";
    if(keyed.scoring?.mode==="manual"){
      review.reviewerAnswer=`Independent expected response should address: ${keyed.scoring.rubric.criteria.join("; ")}`;
    }else review.reviewerAnswer=canonicalResponse(keyed);
  }
  return completed;
}

function finishManualRubrics(sealed,verdict="pass"){
  for(const entry of sealed.manualRubrics){
    entry.review.manualRubricVerdict=verdict;
    if(verdict==="finding")entry.review.notes="Rubric needs independent reviewer attention.";
  }
  return sealed;
}

const completed=mechanicallyCompleteBlind();
const sealed=sealCleanRoomReview(completed);
assert.equal(sealed.includesAutoAnswerKeys,false);
assert.equal(sealed.containsManualRubrics,true);
assert.equal(sealed.manualRubrics.length,6,"Grade 5 Science should expose only its six manual CR rubrics after blind sealing");
assert.match(sealed.blindReviewFingerprint,/^[a-f0-9]{64}$/);
for(const entry of sealed.manualRubrics){
  assert(entry.rubric&&Array.isArray(entry.rubric.criteria),`${entry.id}: post-blind manual rubric missing`);
  assert.equal(Object.hasOwn(entry,"rationale"),false,`${entry.id}: post-blind rubric phase should not expose rationale`);
}
finishManualRubrics(sealed);
const clean=reconcileCleanRoomReview(sealed);
assert.equal(clean.passed,true);
assert.equal(clean.findingCount,0);

const wrongBlind=mechanicallyCompleteBlind();
const firstMc=wrongBlind.items.find(item=>item.itemType==="multiple_choice");
const keyedMc=BANKS["g5-science"].find(item=>item.id===firstMc.id);
firstMc.review.reviewerAnswer=keyedMc.options.find(option=>option!==keyedMc.scoring.answer);
const wrongSealed=finishManualRubrics(sealCleanRoomReview(wrongBlind));
const mismatchResult=reconcileCleanRoomReview(wrongSealed);
assert.equal(mismatchResult.passed,false);
assert(mismatchResult.findings.some(f=>f.id===firstMc.id&&f.type==="independent-answer-mismatch"));

const recordedFinding=mechanicallyCompleteBlind();
recordedFinding.items[0].review.ambiguityVerdict="finding";
recordedFinding.items[0].review.notes="Ambiguity needs author review.";
const findingSealed=finishManualRubrics(sealCleanRoomReview(recordedFinding));
const findingResult=reconcileCleanRoomReview(findingSealed);
assert.equal(findingResult.passed,false);
assert(findingResult.findings.some(f=>f.type==="reviewer-finding"&&f.detail==="ambiguityVerdict"));

const rubricFinding=finishManualRubrics(sealCleanRoomReview(mechanicallyCompleteBlind()));
rubricFinding.manualRubrics[0].review.manualRubricVerdict="finding";
rubricFinding.manualRubrics[0].review.notes="Rubric omits an independently expected scoring element.";
const rubricFindingResult=reconcileCleanRoomReview(rubricFinding);
assert.equal(rubricFindingResult.passed,false);
assert(rubricFindingResult.findings.some(f=>f.type==="manual-rubric-finding"));

const stale=mechanicallyCompleteBlind();
stale.browserEffectiveFingerprint="0".repeat(64);
assert.throws(()=>sealCleanRoomReview(stale),/browser-effective fingerprint changed/);

const reordered=mechanicallyCompleteBlind();
[reordered.items[0],reordered.items[1]]=[reordered.items[1],reordered.items[0]];
assert.throws(()=>sealCleanRoomReview(reordered),/blind item content changed/);

const tampered=finishManualRubrics(sealCleanRoomReview(mechanicallyCompleteBlind()));
tampered.blindReview.items[0].review.notes="Changed after sealing";
assert.throws(()=>reconcileCleanRoomReview(tampered),/frozen blind review changed after sealing/);

const missingCrAnswer=mechanicallyCompleteBlind();
const firstCr=missingCrAnswer.items.find(item=>item.itemType==="constructed_response");
firstCr.review.reviewerAnswer=null;
assert.throws(()=>sealCleanRoomReview(missingCrAnswer),/reviewerAnswer is required before sealing/);

console.log("PASS: clean-room tooling keeps keys/rubrics hidden during blind review, fingerprints exact bank state, requires independent responses for CR as well as auto-scored items, seals blind judgments before exposing manual rubrics, detects answer/rubric findings, and rejects stale or tampered reviews.");
