import { pathToFileURL } from "node:url";
import { buildCleanRoomManifest } from "./clean-room-manifest.mjs";

export const REVIEW_VERDICTS=Object.freeze(["pass","finding"]);

export function buildCleanRoomReviewTemplate(assessmentId){
  if(!assessmentId)throw new Error("--assessment is required; review one assessment at a time");
  const manifest=buildCleanRoomManifest({assessmentId});
  const assessment=manifest.assessments[0];
  return {
    schemaVersion:2,
    purpose:"independent blind clean-room review worksheet",
    includesAnswerKeys:false,
    assessmentId,
    grade:assessment.grade,
    subject:assessment.subject,
    label:assessment.label,
    officialPointTarget:assessment.officialPointTarget,
    itemCount:assessment.itemCount,
    browserEffectiveFingerprint:assessment.browserEffectiveFingerprint,
    instructions:{
      blindPhase:"Without opening any repository scoring/rationale fields or keyed manifest, complete reviewerAnswer and all four verdict fields for every item. For auto-scored items, reviewerAnswer is the response you independently believe is correct. For constructed responses, reviewerAnswer should state the response elements or scoring criteria you independently expect a correct response to contain.",
      verdicts:"Use pass when independently satisfied. Use finding when there is any correctness, ambiguity, grade-fit, or standard-alignment concern; explain every finding in notes.",
      manualResponses:"Constructed-response rubrics are intentionally withheld during this blind phase. After every blind response and verdict is complete, seal this worksheet with scripts/seal-clean-room-review.mjs; only the sealed post-blind worksheet exposes the current manual rubrics for rubric-quality review.",
      sealPhase:"Run node scripts/seal-clean-room-review.mjs path/to/completed-blind-review.json > path/to/sealed-review.json before viewing any scoring/rationale. The seal validates completeness and the exact browser-effective fingerprint, freezes the blind review, and exposes only manual constructed-response rubrics for the second phase.",
      restartRule:"Any substantive browser-effective repair, including prompt/options/scoring/rationale changes that keep the same item IDs, changes the assessment fingerprint. Regenerate from the repaired bank and restart the assessment from item 1."
    },
    items:assessment.items.map(item=>({
      ...item,
      review:{
        reviewerAnswer:null,
        correctnessVerdict:null,
        ambiguityVerdict:null,
        gradeFitVerdict:null,
        standardAlignmentVerdict:null,
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
      console.log("Usage: node scripts/clean-room-review-template.mjs --assessment=g5-science\n\nEmits a blind, editable JSON worksheet with no scoring/rationales. Complete every independent response and verdict, then seal it with scripts/seal-clean-room-review.mjs before any rubric/key reconciliation.");
      process.exit(0);
    }else throw new Error(`Unknown argument: ${arg}`);
  }
  return assessmentId;
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
  const template=buildCleanRoomReviewTemplate(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(template,null,2)}\n`);
}
