import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { BANKS } from "../js/banks.js";
import { scoreResponse } from "../js/core/item-types.js";
import { REVIEW_VERDICTS } from "./clean-room-review-template.mjs";

const verdictSet=new Set(REVIEW_VERDICTS);
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

function requireVerdict(value,label,id,findings){
  if(!verdictSet.has(value))findings.push({id,type:"incomplete-review",detail:`${label} must be pass or finding`});
}

export function reconcileCleanRoomReview(reviewDoc){
  if(!reviewDoc||reviewDoc.includesAnswerKeys!==false)throw new Error("Review input must be a blind worksheet with includesAnswerKeys:false");
  const assessmentId=reviewDoc.assessmentId;
  const bank=BANKS[assessmentId];
  if(!bank)throw new Error(`Unknown assessment: ${assessmentId}`);
  if(!Array.isArray(reviewDoc.items))throw new Error("Review input items must be an array");
  if(reviewDoc.items.length!==bank.length)throw new Error(`${assessmentId}: review item count ${reviewDoc.items.length} does not match browser-effective bank ${bank.length}`);

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

    if(item.scoring?.mode==="manual"){
      requireVerdict(review.manualRubricVerdict,"manualRubricVerdict",id,findings);
      if(review.manualRubricVerdict==="finding")findings.push({id,type:"manual-rubric-finding",notes:review.notes||"",rubric:clone(item.scoring?.rubric)});
      continue;
    }

    if(review.reviewerAnswer===null||review.reviewerAnswer===undefined||review.reviewerAnswer===""){
      findings.push({id,type:"incomplete-review",detail:"reviewerAnswer is required for auto-scored items"});
      continue;
    }
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

  return {
    schemaVersion:1,
    purpose:"post-blind clean-room reconciliation",
    assessmentId,
    itemCount:bank.length,
    passed:findings.length===0,
    findingCount:findings.length,
    findings
  };
}

function parseArgs(argv){
  const args=argv.filter(Boolean);
  if(args.includes("--help")||args.length!==1){
    console.log("Usage: node scripts/reconcile-clean-room-review.mjs path/to/completed-review.json\n\nRun only after the reviewer has completed the blind worksheet. Exits nonzero for incomplete review, answer mismatch, or any recorded finding.");
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
