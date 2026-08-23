import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { REVIEW_VERDICTS } from "./clean-room-review-template.mjs";

const verdictSet=new Set(REVIEW_VERDICTS);

export function applyManualReview(sealed,decisions){
  if(!sealed||sealed.includesAutoAnswerKeys!==false||!Array.isArray(sealed.manualRubrics))throw new Error("Input must be a sealed clean-room review");
  if(!decisions||decisions.assessmentId!==sealed.assessmentId)throw new Error("Manual rubric decisions assessment does not match sealed review");
  if(decisions.browserEffectiveFingerprint!==sealed.browserEffectiveFingerprint)throw new Error(`${sealed.assessmentId}: manual rubric decisions fingerprint is stale`);
  if(!Array.isArray(decisions.items)||decisions.items.length!==sealed.manualRubrics.length)throw new Error(`${sealed.assessmentId}: manual rubric decision count is wrong`);
  const byId=new Map(decisions.items.map(entry=>[entry.id,entry]));
  if(byId.size!==decisions.items.length)throw new Error(`${sealed.assessmentId}: duplicate manual rubric decision id`);
  for(const entry of sealed.manualRubrics){
    const decision=byId.get(entry.id);
    if(!decision)throw new Error(`${sealed.assessmentId}: missing manual rubric decision for ${entry.id}`);
    if(!verdictSet.has(decision.manualRubricVerdict))throw new Error(`${entry.id}: manualRubricVerdict must be pass or finding`);
    if(decision.manualRubricVerdict==="finding"&&!(decision.notes||"").trim())throw new Error(`${entry.id}: notes required for manual rubric finding`);
    entry.review={manualRubricVerdict:decision.manualRubricVerdict,notes:decision.notes||""};
  }
  return sealed;
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  if(process.argv.length!==4){
    console.log("Usage: node scripts/apply-clean-room-manual-review.mjs sealed-review.json manual-rubric-decisions.json");
    process.exit(2);
  }
  const sealed=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
  const decisions=JSON.parse(fs.readFileSync(process.argv[3],"utf8"));
  process.stdout.write(`${JSON.stringify(applyManualReview(sealed,decisions),null,2)}\n`);
}
