import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { sealCompactReview } from "./seal-compact-blind-review.mjs";
import { reconcileCleanRoomReview } from "./reconcile-clean-room-review.mjs";

export function reconcileCompactManualReview(compact,manual){
  const {completed,sealed,completedBlindReviewSha256,completedBlindReviewBytes}=sealCompactReview(compact);
  if(manual.assessmentId!==sealed.assessmentId)throw new Error("Manual-rubric decisions assessment does not match sealed blind review");
  if(manual.browserEffectiveFingerprint!==sealed.browserEffectiveFingerprint)throw new Error(`${sealed.assessmentId}: manual-rubric decisions fingerprint is stale`);
  if(manual.blindReviewFingerprint!==sealed.blindReviewFingerprint)throw new Error(`${sealed.assessmentId}: manual-rubric decisions are not bound to this frozen blind review`);
  const decisions=manual.manualRubricDecisions||{};
  const expectedIds=sealed.manualRubrics.map(entry=>entry.id).sort();const suppliedIds=Object.keys(decisions).sort();
  if(JSON.stringify(expectedIds)!==JSON.stringify(suppliedIds))throw new Error(`${sealed.assessmentId}: manual-rubric decision id set does not exactly match exposed manual rubrics`);
  for(const entry of sealed.manualRubrics){const decision=decisions[entry.id];if(!["pass","finding"].includes(decision?.manualRubricVerdict))throw new Error(`${entry.id}: manualRubricVerdict must be pass or finding`);if(decision.manualRubricVerdict==="finding"&&!String(decision.notes||"").trim())throw new Error(`${entry.id}: notes required for manual-rubric finding`);entry.review={manualRubricVerdict:decision.manualRubricVerdict,notes:decision.notes||""};}
  const reconciliation=reconcileCleanRoomReview(sealed);
  return {assessmentId:sealed.assessmentId,browserEffectiveFingerprint:sealed.browserEffectiveFingerprint,itemCount:completed.items.length,completedBlindReviewSha256,completedBlindReviewBytes,blindReviewFingerprint:sealed.blindReviewFingerprint,manualResponseCount:sealed.manualRubrics.length,reconciliation};
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  const [compactPath,manualPath]=process.argv.slice(2);if(!compactPath||!manualPath)throw new Error("Usage: node scripts/reconcile-compact-manual-review.mjs compact-decisions.json manual-rubric-decisions.json");
  const compact=JSON.parse(fs.readFileSync(compactPath,"utf8"));const manual=JSON.parse(fs.readFileSync(manualPath,"utf8"));const receipt=reconcileCompactManualReview(compact,manual);
  console.log(`COMPACT_MANUAL_REVIEW_RECEIPT:${JSON.stringify(receipt)}`);if(!receipt.reconciliation.passed)process.exitCode=1;
}
