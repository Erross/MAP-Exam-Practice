import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { buildCleanRoomReviewTemplate, REVIEW_VERDICTS } from "./clean-room-review-template.mjs";

const verdictSet=new Set(REVIEW_VERDICTS);
const hasResponse=value=>{
  if(value===null||value===undefined)return false;
  if(typeof value==="string")return value.trim().length>0;
  if(Array.isArray(value))return value.length>0;
  if(typeof value==="object")return Object.keys(value).length>0;
  return true;
};

export function materializeCleanRoomReview(compact){
  if(!compact||compact.includesAnswerKeys!==false)throw new Error("Compact review must declare includesAnswerKeys:false");
  const assessmentId=compact.assessmentId;
  const template=buildCleanRoomReviewTemplate(assessmentId);
  if(compact.browserEffectiveFingerprint!==template.browserEffectiveFingerprint){
    throw new Error(`${assessmentId}: compact review fingerprint is stale; regenerate and restart from item 1`);
  }
  if(!Array.isArray(compact.items)||compact.items.length!==template.items.length){
    throw new Error(`${assessmentId}: compact review must contain exactly ${template.items.length} item decisions`);
  }
  for(let index=0;index<template.items.length;index++){
    const expected=template.items[index];
    const decision=compact.items[index];
    if(!decision||decision.id!==expected.id){
      throw new Error(`${assessmentId}: compact review order/id mismatch at ordinal ${index+1}`);
    }
    if(!hasResponse(decision.reviewerAnswer))throw new Error(`${decision.id}: reviewerAnswer is required`);
    for(const field of ["correctnessVerdict","ambiguityVerdict","gradeFitVerdict","standardAlignmentVerdict"]){
      if(!verdictSet.has(decision[field]))throw new Error(`${decision.id}: ${field} must be pass or finding`);
    }
    const hasFinding=[decision.correctnessVerdict,decision.ambiguityVerdict,decision.gradeFitVerdict,decision.standardAlignmentVerdict].includes("finding");
    if(hasFinding&&!(decision.notes||"").trim())throw new Error(`${decision.id}: notes are required for a finding`);
    expected.review={
      reviewerAnswer:decision.reviewerAnswer,
      correctnessVerdict:decision.correctnessVerdict,
      ambiguityVerdict:decision.ambiguityVerdict,
      gradeFitVerdict:decision.gradeFitVerdict,
      standardAlignmentVerdict:decision.standardAlignmentVerdict,
      notes:decision.notes||""
    };
  }
  return template;
}

function parseArgs(argv){
  if(argv.includes("--help")||argv.length!==1){
    console.log("Usage: node scripts/materialize-clean-room-review.mjs path/to/compact-blind-review.json\n\nReconstructs the exact full answerless clean-room worksheet from compact item decisions tied to a browser-effective fingerprint. Pipe the output into seal-clean-room-review.mjs.");
    process.exit(argv.includes("--help")?0:2);
  }
  return argv[0];
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  const compact=JSON.parse(fs.readFileSync(parseArgs(process.argv.slice(2)),"utf8"));
  process.stdout.write(`${JSON.stringify(materializeCleanRoomReview(compact),null,2)}\n`);
}
