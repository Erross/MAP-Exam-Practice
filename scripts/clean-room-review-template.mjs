import { pathToFileURL } from "node:url";
import { buildCleanRoomManifest } from "./clean-room-manifest.mjs";

export const REVIEW_VERDICTS=Object.freeze(["pass","finding"]);

export function buildCleanRoomReviewTemplate(assessmentId){
  if(!assessmentId)throw new Error("--assessment is required; review one assessment at a time");
  const manifest=buildCleanRoomManifest({assessmentId});
  const assessment=manifest.assessments[0];
  return {
    schemaVersion:1,
    purpose:"independent blind clean-room review worksheet",
    includesAnswerKeys:false,
    assessmentId,
    grade:assessment.grade,
    subject:assessment.subject,
    label:assessment.label,
    officialPointTarget:assessment.officialPointTarget,
    itemCount:assessment.itemCount,
    instructions:{
      blindPhase:"Complete reviewerAnswer and all verdict fields before opening any keyed manifest or repository scoring/rationale fields.",
      verdicts:"Use pass when independently satisfied. Use finding when there is any correctness, ambiguity, grade-fit, or standard-alignment concern; explain every finding in notes.",
      manualResponses:"For constructed_response items, reviewerAnswer may remain null; independently assess the prompt and rubric and complete manualRubricVerdict.",
      restartRule:"Any substantive repair invalidates this worksheet. Regenerate from the repaired browser-effective bank and restart the assessment from item 1."
    },
    items:assessment.items.map(item=>({
      ...item,
      review:{
        reviewerAnswer:null,
        correctnessVerdict:null,
        ambiguityVerdict:null,
        gradeFitVerdict:null,
        standardAlignmentVerdict:null,
        manualRubricVerdict:item.itemType==="constructed_response"?null:"not-applicable",
        notes:""
      }
    }))
  };
}

function parseArgs(argv){
  let assessmentId=null;
  for(const arg of argv){
    if(arg.startsWith("--assessment="))assessmentId=arg.slice("--assessment=".length);
    else if(arg==="--help"){
      console.log("Usage: node scripts/clean-room-review-template.mjs --assessment=g5-science\n\nEmits a blind, editable JSON worksheet. Complete it before using any keyed reconciliation command.");
      process.exit(0);
    }else throw new Error(`Unknown argument: ${arg}`);
  }
  return assessmentId;
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  const template=buildCleanRoomReviewTemplate(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(template,null,2)}\n`);
}
