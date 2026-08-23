import fs from "node:fs";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { BANKS } from "../js/banks.js";
import { browserEffectiveFingerprint } from "./clean-room-manifest.mjs";
import { buildCleanRoomReviewTemplate, REVIEW_VERDICTS } from "./clean-room-review-template.mjs";

const verdictSet=new Set(REVIEW_VERDICTS);
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const hash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const hasResponse=value=>{
  if(value===null||value===undefined)return false;
  if(typeof value==="string")return value.trim().length>0;
  if(Array.isArray(value))return value.length>0;
  if(typeof value==="object")return Object.keys(value).length>0;
  return true;
};
const blindItemContent=item=>{
  const copy=clone(item);
  delete copy.review;
  return copy;
};

export function sealCleanRoomReview(reviewDoc){
  if(!reviewDoc||reviewDoc.includesAnswerKeys!==false)throw new Error("Input must be a blind worksheet with includesAnswerKeys:false");
  const assessmentId=reviewDoc.assessmentId;
  const bank=BANKS[assessmentId];
  if(!bank)throw new Error(`Unknown assessment: ${assessmentId}`);
  const currentFingerprint=browserEffectiveFingerprint(assessmentId);
  if(reviewDoc.browserEffectiveFingerprint!==currentFingerprint){
    throw new Error(`${assessmentId}: browser-effective fingerprint changed; regenerate the blind worksheet and restart the audit from item 1`);
  }
  const currentTemplate=buildCleanRoomReviewTemplate(assessmentId);
  if(!Array.isArray(reviewDoc.items)||reviewDoc.items.length!==currentTemplate.items.length){
    throw new Error(`${assessmentId}: blind review item count no longer matches the browser-effective bank; regenerate and restart`);
  }

  for(let index=0;index<reviewDoc.items.length;index++){
    const worksheetItem=reviewDoc.items[index];
    const expectedItem=currentTemplate.items[index];
    if(JSON.stringify(blindItemContent(worksheetItem))!==JSON.stringify(blindItemContent(expectedItem))){
      throw new Error(`${assessmentId}: blind item content changed at ordinal ${index+1}; regenerate and restart the audit`);
    }
    const review=worksheetItem.review||{};
    if(!hasResponse(review.reviewerAnswer))throw new Error(`${worksheetItem.id}: reviewerAnswer is required before sealing the blind phase`);
    for(const field of ["correctnessVerdict","ambiguityVerdict","gradeFitVerdict","standardAlignmentVerdict"]){
      if(!verdictSet.has(review[field]))throw new Error(`${worksheetItem.id}: ${field} must be pass or finding before sealing`);
    }
    const hasFinding=[review.correctnessVerdict,review.ambiguityVerdict,review.gradeFitVerdict,review.standardAlignmentVerdict].includes("finding");
    if(hasFinding&&!(review.notes||"").trim())throw new Error(`${worksheetItem.id}: notes are required when a blind verdict is finding`);
  }

  const frozenBlindReview=clone(reviewDoc);
  const manualRubrics=bank.filter(item=>item.scoring?.mode==="manual").map(item=>({
    id:item.id,
    points:item.points,
    rubric:clone(item.scoring?.rubric),
    review:{manualRubricVerdict:null,notes:""}
  }));
  return {
    schemaVersion:2,
    purpose:"sealed post-blind clean-room rubric review",
    assessmentId,
    browserEffectiveFingerprint:currentFingerprint,
    blindReviewFingerprint:hash(frozenBlindReview),
    includesAutoAnswerKeys:false,
    containsManualRubrics:manualRubrics.length>0,
    instructions:{
      manualRubricPhase:"The blind phase is sealed. Review only the exposed constructed-response rubrics against the independently committed reviewerAnswer and prompt. Set each manualRubricVerdict to pass or finding and explain every finding in notes.",
      reconciliation:"After manual rubric review is complete, run node scripts/reconcile-clean-room-review.mjs path/to/sealed-review.json. Auto-scored keys remain hidden until reconciliation reports a mismatch.",
      restartRule:"If the browser-effective fingerprint changes at any point, discard this sealed review and restart the assessment from a newly generated blind worksheet."
    },
    blindReview:frozenBlindReview,
    manualRubrics
  };
}

function parseArgs(argv){
  const args=argv.filter(Boolean);
  if(args.includes("--help")||args.length!==1){
    console.log("Usage: node scripts/seal-clean-room-review.mjs path/to/completed-blind-review.json\n\nValidates and freezes a complete blind review against the exact browser-effective bank fingerprint, then exposes only manual constructed-response rubrics for the post-blind rubric phase.");
    process.exit(args.includes("--help")?0:2);
  }
  return args[0];
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  const input=parseArgs(process.argv.slice(2));
  const doc=JSON.parse(fs.readFileSync(input,"utf8"));
  const sealed=sealCleanRoomReview(doc);
  process.stdout.write(`${JSON.stringify(sealed,null,2)}\n`);
}
