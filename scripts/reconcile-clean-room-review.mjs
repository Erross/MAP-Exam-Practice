import fs from "node:fs";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { BANKS } from "../js/banks.js";
import { scoreResponse } from "../js/core/item-types.js";
import { browserEffectiveFingerprint } from "./clean-room-manifest.mjs";
import { REVIEW_VERDICTS } from "./clean-room-review-template.mjs";

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

function requireVerdict(value,label,id,findings){
  if(!verdictSet.has(value))findings.push({id,type:"incomplete-review",detail:`${label} must be pass or finding`});
}

export function reconcileCleanRoomReview(sealedDoc){
  if(!sealedDoc||sealedDoc.includesAutoAnswerKeys!==false||!sealedDoc.blindReview){
    throw new Error("Review input must be a sealed post-blind worksheet produced by seal-clean-room-review.mjs");
  }
  const reviewDoc=sealedDoc.blindReview;
  if(reviewDoc.includesAnswerKeys!==false)throw new Error("Sealed blind review must retain includesAnswerKeys:false");
  const assessmentId=sealedDoc.assessmentId;
  if(reviewDoc.assessmentId!==assessmentId)throw new Error("Sealed review assessment does not match its frozen blind review");
  const bank=BANKS[assessmentId];
  if(!bank)throw new Error(`Unknown assessment: ${assessmentId}`);
  const currentFingerprint=browserEffectiveFingerprint(assessmentId);
  if(sealedDoc.browserEffectiveFingerprint!==currentFingerprint||reviewDoc.browserEffectiveFingerprint!==currentFingerprint){
    throw new Error(`${assessmentId}: browser-effective fingerprint changed; regenerate and restart the audit from item 1`);
  }
  if(hash(reviewDoc)!==sealedDoc.blindReviewFingerprint){
    throw new Error(`${assessmentId}: frozen blind review changed after sealing; discard it and restart from the sealed blind-phase output`);
  }
  if(!Array.isArray(reviewDoc.items))throw new Error("Frozen blind review items must be an array");
  if(reviewDoc.items.length!==bank.length)throw new Error(`${assessmentId}: review item count ${reviewDoc.items.length} does not match browser-effective bank ${bank.length}`);

  const manualRubrics=Array.isArray(sealedDoc.manualRubrics)?sealedDoc.manualRubrics:[];
  const manualById=new Map(manualRubrics.map(entry=>[entry.id,entry]));
  if(manualById.size!==manualRubrics.length)throw new Error(`${assessmentId}: duplicate manual rubric review entries`);

  const findings=[];
  const bankById=new Map(bank.map(item=>[item.id,item]));
  const seen=new Set();
  for(let index=0;index<reviewDoc.items.length;index++){
    const worksheetItem=reviewDoc.items[index];
    const id=worksheetItem.id;
    if(seen.has(id))throw new Error(`${assessmentId}: duplicate worksheet item ${id}`);
    seen.add(id);
    const item=bankById.get(id);
    if(!item)throw new Error(`${assessmentId}: worksheet item ${id} is not in the browser-effective bank`);
    if(bank[index].id!==id)throw new Error(`${assessmentId}: browser-effective order changed at ordinal ${index+1}; regenerate and restart the audit`);
    const review=worksheetItem.review||{};
    requireVerdict(review.correctnessVerdict,"correctnessVerdict",id,findings);
    requireVerdict(review.ambiguityVerdict,"ambiguityVerdict",id,findings);
    requireVerdict(review.gradeFitVerdict,"gradeFitVerdict",id,findings);
    requireVerdict(review.standardAlignmentVerdict,"standardAlignmentVerdict",id,findings);
    for(const [field,value] of [["correctnessVerdict",review.correctnessVerdict],["ambiguityVerdict",review.ambiguityVerdict],["gradeFitVerdict",review.gradeFitVerdict],["standardAlignmentVerdict",review.standardAlignmentVerdict]]){
      if(value==="finding")findings.push({id,type:"reviewer-finding",detail:field,notes:review.notes||""});
    }
    if(!hasResponse(review.reviewerAnswer)){
      findings.push({id,type:"incomplete-review",detail:"reviewerAnswer is required for every item, including constructed responses"});
    }

    if(item.scoring?.mode==="manual"){
      const rubricEntry=manualById.get(id);
      if(!rubricEntry){
        findings.push({id,type:"incomplete-review",detail:"sealed manual rubric review is missing"});
        continue;
      }
      if(JSON.stringify(rubricEntry.rubric)!==JSON.stringify(item.scoring?.rubric)||rubricEntry.points!==item.points){
        throw new Error(`${id}: sealed manual rubric content does not match the current browser-effective bank`);
      }
      requireVerdict(rubricEntry.review?.manualRubricVerdict,"manualRubricVerdict",id,findings);
      if(rubricEntry.review?.manualRubricVerdict==="finding"){
        findings.push({id,type:"manual-rubric-finding",notes:rubricEntry.review?.notes||"",rubric:clone(item.scoring?.rubric)});
      }
      continue;
    }

    if(!hasResponse(review.reviewerAnswer))continue;
    const scored=scoreResponse(item,review.reviewerAnswer);
    if(scored.correct!==true){
      findings.push({
        id,
        type:"independent-answer-mismatch",
        reviewerAnswer:clone(review.reviewerAnswer),
        expectedScoring:clone(item.scoring),
        rationale:item.rationale??null
      });
    }
  }

  const expectedManualIds=bank.filter(item=>item.scoring?.mode==="manual").map(item=>item.id).sort();
  const suppliedManualIds=[...manualById.keys()].sort();
  if(JSON.stringify(expectedManualIds)!==JSON.stringify(suppliedManualIds)){
    throw new Error(`${assessmentId}: sealed manual rubric set does not match the browser-effective manual-response items`);
  }

  return {
    schemaVersion:2,
    purpose:"post-blind clean-room reconciliation",
    assessmentId,
    browserEffectiveFingerprint:currentFingerprint,
    itemCount:bank.length,
    passed:findings.length===0,
    findingCount:findings.length,
    findings
  };
}

function parseArgs(argv){
  const args=argv.filter(Boolean);
  if(args.includes("--help")||args.length!==1){
    console.log("Usage: node scripts/reconcile-clean-room-review.mjs path/to/sealed-review.json\n\nRun only after the blind worksheet has been sealed and any exposed manual rubrics have been reviewed. Exits nonzero for stale/tampered review state, incomplete review, answer mismatch, or any recorded finding.");
    process.exit(args.includes("--help")?0:2);
  }
  return args[0];
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  const input=parseArgs(process.argv.slice(2));
  const doc=JSON.parse(fs.readFileSync(input,"utf8"));
  const result=reconcileCleanRoomReview(doc);
  process.stdout.write(`${JSON.stringify(result,null,2)}\n`);
  if(!result.passed)process.exitCode=1;
}
