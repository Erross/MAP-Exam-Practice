import { pathToFileURL } from "node:url";
import { BANKS } from "../js/banks.js";
import { ASSESSMENTS } from "../js/config.js";

const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const stimulusKey=item=>item.stimulusId||item.stimulus?.id||null;

function blindItem(assessmentId,item,index){
  const out={
    ordinal:index+1,
    assessmentId,
    id:item.id,
    grade:item.grade,
    subject:item.subject,
    standard:item.standard,
    strand:item.strand,
    reportingCategory:item.reportingCategory??null,
    dok:item.dok,
    itemType:item.itemType,
    points:item.points,
    sessionEligibility:clone(item.sessionEligibility),
    variantFamily:item.variantFamily??null,
    deliveryGroup:item.deliveryGroup??null,
    stimulusKey:stimulusKey(item),
    stimulus:clone(item.stimulus)??null,
    prompt:item.prompt
  };
  for(const field of ["options","parts","pairs","choices","rows","columns","tokens","fields","regions","responseRows","maxLength"]){
    if(item[field]!==undefined)out[field]=clone(item[field]);
  }
  return out;
}

function keyedItem(assessmentId,item,index){
  return {
    ...blindItem(assessmentId,item,index),
    scoring:clone(item.scoring),
    rationale:item.rationale??null,
    provenance:item.provenance??null,
    alignmentStatus:item.alignmentStatus??null
  };
}

export function buildCleanRoomManifest({includeAnswers=false,assessmentId=null}={}){
  const assessmentIds=assessmentId?[assessmentId]:Object.keys(BANKS).sort();
  if(assessmentId&&!BANKS[assessmentId])throw new Error(`Unknown assessment: ${assessmentId}`);
  const assessments=[];
  let totalItems=0;
  for(const id of assessmentIds){
    const assessment=ASSESSMENTS[id];
    if(!assessment)throw new Error(`${id}: missing assessment config`);
    const bank=BANKS[id]||[];
    const items=bank.map((item,index)=>includeAnswers?keyedItem(id,item,index):blindItem(id,item,index));
    totalItems+=items.length;
    assessments.push({
      assessmentId:id,
      grade:assessment.grade,
      subject:assessment.subject,
      label:assessment.label,
      officialPointTarget:assessment.points,
      sessionCount:assessment.sessions.length,
      itemCount:items.length,
      items
    });
  }
  return {
    schemaVersion:1,
    purpose:includeAnswers?"post-review answer-key reconciliation":"independent blind clean-room review",
    includesAnswerKeys:includeAnswers,
    totalItems,
    assessments
  };
}

function parseArgs(argv){
  let includeAnswers=false,assessmentId=null;
  for(const arg of argv){
    if(arg==="--answers")includeAnswers=true;
    else if(arg.startsWith("--assessment="))assessmentId=arg.slice("--assessment=".length);
    else if(arg==="--help"){
      console.log("Usage: node scripts/clean-room-manifest.mjs [--assessment=g5-science] [--answers]\n\nDefault output is blind JSON with scoring/rationales removed. Use --answers only after independent review for reconciliation. Redirect stdout to a file if desired.");
      process.exit(0);
    }else throw new Error(`Unknown argument: ${arg}`);
  }
  return {includeAnswers,assessmentId};
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  const manifest=buildCleanRoomManifest(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(manifest,null,2)}\n`);
}
