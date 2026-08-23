import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { buildCleanRoomReviewTemplate, REVIEW_VERDICTS } from "./clean-room-review-template.mjs";

const verdictSet=new Set(REVIEW_VERDICTS);
const verdictFields=["correctnessVerdict","ambiguityVerdict","gradeFitVerdict","standardAlignmentVerdict"];
const hasResponse=value=>{
  if(value===null||value===undefined)return false;
  if(typeof value==="string")return value.trim().length>0;
  if(Array.isArray(value))return value.length>0;
  if(typeof value==="object")return Object.keys(value).length>0;
  return true;
};

function indexed(list,index,label){
  if(!Array.isArray(list))throw new Error(`${label}: item has no indexed choices`);
  if(!Number.isInteger(index)||index<1||index>list.length)throw new Error(`${label}: choice index ${index} is out of range`);
  return list[index-1];
}

function resolveAnswer(item,decision){
  if(Object.prototype.hasOwnProperty.call(decision,"reviewerAnswer"))return decision.reviewerAnswer;
  const spec=decision.answerSpec;
  if(!spec||typeof spec!=="object")return undefined;
  if(Object.prototype.hasOwnProperty.call(spec,"value"))return spec.value;
  if(Object.prototype.hasOwnProperty.call(spec,"option"))return indexed(item.options,spec.option,item.id);
  if(Array.isArray(spec.options))return spec.options.map(index=>indexed(item.options,index,item.id));
  if(spec.matches&&typeof spec.matches==="object"){
    const resolved={};
    for(const [key,value] of Object.entries(spec.matches)){
      resolved[key]=Number.isInteger(value)?indexed(item.choices,value,item.id):value;
    }
    return resolved;
  }
  throw new Error(`${item.id}: unsupported answerSpec`);
}

function decisionsFor(compact,template){
  if(Array.isArray(compact.items))return compact.items;
  if(compact.answersById&&typeof compact.answersById==="object"){
    const expectedIds=template.items.map(item=>item.id);
    const suppliedIds=Object.keys(compact.answersById);
    if(expectedIds.length!==suppliedIds.length||expectedIds.some(id=>!Object.prototype.hasOwnProperty.call(compact.answersById,id))){
      throw new Error(`${compact.assessmentId}: answersById must cover every browser-effective item exactly once`);
    }
    const findings=compact.findingsById||{};
    for(const id of Object.keys(findings))if(!expectedIds.includes(id))throw new Error(`${compact.assessmentId}: finding references unknown item ${id}`);
    return expectedIds.map(id=>{
      const raw=compact.answersById[id];
      const decision={id};
      if(raw&&typeof raw==="object"&&(Object.prototype.hasOwnProperty.call(raw,"option")||Object.prototype.hasOwnProperty.call(raw,"options")||Object.prototype.hasOwnProperty.call(raw,"value")||Object.prototype.hasOwnProperty.call(raw,"matches"))){
        decision.answerSpec=raw;
      }else{
        decision.reviewerAnswer=raw;
      }
      Object.assign(decision,findings[id]||{});
      return decision;
    });
  }
  throw new Error(`${compact.assessmentId}: provide items[] or answersById{}`);
}

export function materializeCleanRoomReview(compact){
  if(!compact||compact.includesAnswerKeys!==false)throw new Error("Compact review must declare includesAnswerKeys:false");
  const assessmentId=compact.assessmentId;
  const template=buildCleanRoomReviewTemplate(assessmentId);
  if(compact.browserEffectiveFingerprint!==template.browserEffectiveFingerprint){
    throw new Error(`${assessmentId}: compact review fingerprint is stale; regenerate and restart from item 1`);
  }
  const decisions=decisionsFor(compact,template);
  if(decisions.length!==template.items.length)throw new Error(`${assessmentId}: compact review decision count is wrong`);
  const defaultVerdicts=compact.defaultVerdicts==="pass"?"pass":null;
  for(let index=0;index<template.items.length;index++){
    const expected=template.items[index];
    const decision=decisions[index];
    if(!decision||decision.id!==expected.id)throw new Error(`${assessmentId}: compact review order/id mismatch at ordinal ${index+1}`);
    const reviewerAnswer=resolveAnswer(expected,decision);
    if(!hasResponse(reviewerAnswer))throw new Error(`${decision.id}: reviewerAnswer/answerSpec is required`);
    const review={reviewerAnswer,notes:decision.notes||""};
    for(const field of verdictFields){
      review[field]=decision[field]??defaultVerdicts;
      if(!verdictSet.has(review[field]))throw new Error(`${decision.id}: ${field} must be pass or finding`);
    }
    const hasFinding=verdictFields.some(field=>review[field]==="finding");
    if(hasFinding&&!review.notes.trim())throw new Error(`${decision.id}: notes are required for a finding`);
    expected.review=review;
  }
  return template;
}

function parseArgs(argv){
  if(argv.includes("--help")||argv.length!==1){
    console.log("Usage: node scripts/materialize-clean-room-review.mjs path/to/compact-blind-review.json\n\nReconstructs the exact full answerless clean-room worksheet from compact item decisions tied to a browser-effective fingerprint. Compact reviews may set defaultVerdicts:'pass' and either items[] or answersById{}. Answer specs support {option:1}, {options:[1,2]}, {value:...}, or {matches:{A:1,B:2}}. findingsById can override verdicts/notes when answersById is used.");
    process.exit(argv.includes("--help")?0:2);
  }
  return argv[0];
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  const compact=JSON.parse(fs.readFileSync(parseArgs(process.argv.slice(2)),"utf8"));
  process.stdout.write(`${JSON.stringify(materializeCleanRoomReview(compact),null,2)}\n`);
}
