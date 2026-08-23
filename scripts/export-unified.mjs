import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { PROGRAM, assessmentList, SUPPORTED_ITEM_TYPES } from "../js/config.js";
import { BANKS } from "../js/banks.js";

const REPOSITORY="Erross/MAP-Exam-Practice";
const EXPORTER_VERSION="map-unified-0.1";

function stableValue(value){
  if(Array.isArray(value)) return value.map(stableValue);
  if(value&&typeof value==="object") return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stableValue(value[key])]));
  return value;
}
export const stableStringify=value=>JSON.stringify(stableValue(value));
const sha256=value=>crypto.createHash("sha256").update(value).digest("hex");
const git=(...args)=>execFileSync("git",args,{encoding:"utf8"}).trim();

function currentCommit(){
  const sha=git("rev-parse","HEAD");
  if(!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`Expected full HEAD SHA, got ${sha}`);
  return sha;
}

function sourceManifest(){
  const output=git("ls-tree","-r","HEAD","--","js/config.js","js/banks.js","data","scripts/export-unified.mjs");
  if(!output)return [];
  return output.split("\n").map(line=>{
    const match=line.match(/^\d+\s+blob\s+([0-9a-f]{40})\t(.+)$/);
    if(!match) throw new Error(`Cannot parse git ls-tree line: ${line}`);
    const [,blobSha,filePath]=match;
    return {path:filePath,blobSha,role:filePath==="js/config.js"?"registry":filePath==="js/banks.js"?"effective-bank-registry":filePath==="scripts/export-unified.mjs"?"exporter":"effective-content-source"};
  }).sort((a,b)=>a.path.localeCompare(b.path));
}

function without(object,keys){return Object.fromEntries(Object.entries(object).filter(([key])=>!keys.has(key)));}
function sectionKey(id){return `session-${id}`;}

function calculatorFor(session){
  const policy=session.calculatorPolicy||"none";
  if(policy==="none")return {policy:"none"};
  if(policy==="available")return {policy:"available",level:session.calculatorLevel??null,label:session.calculatorLabel??null};
  if(policy==="item-designated")return {policy:"part-specific",level:session.calculatorLevel??null,label:session.calculatorLabel??"Calculator availability varies by item"};
  throw new Error(`Unsupported MAP calculator policy ${policy}`);
}

function normalizeSection(session,assessmentStatus,index){
  const omitted=new Set(["id","label","guidelineMinutes","timingPolicy","calculatorPolicy","calculatorAllowed","calculatorLevel","calculatorLabel","deferred"]);
  return {
    id:sectionKey(session.id),
    label:session.label,
    order:index+1,
    status:assessmentStatus,
    optional:false,
    timing:{mode:"guideline",rangeMinutes:[...session.guidelineMinutes]},
    calculator:calculatorFor(session),
    pointTarget:null,
    supportedItemTypes:[...SUPPORTED_ITEM_TYPES],
    deferredCapabilities:[...(session.deferred||[])],
    extensions:{sourceSessionId:session.id,...without(session,omitted)}
  };
}

function normalizeAssessment(assessment){
  const known=new Set(["id","blueprintId","grade","subject","label","points","status","practiceMode","fullSimulationAvailable","sessions"]);
  return {
    id:assessment.id,
    family:"map",
    name:assessment.label,
    category:assessment.subject==="ela"?"English Language Arts":assessment.subject==="math"?"Mathematics":"Science",
    jurisdiction:PROGRAM.jurisdiction,
    grade:assessment.grade,
    subject:assessment.subject,
    status:assessment.status,
    unofficial:true,
    fullSimulationAvailable:Boolean(assessment.fullSimulationAvailable),
    officialSourcesVerified:PROGRAM.officialSourcesVerified,
    scoringPolicy:{kind:"raw-practice-points",officialTotalPoints:assessment.points,excludeHumanJudgmentUntilScored:true,scaleScorePrediction:false},
    sections:assessment.sessions.map((session,index)=>normalizeSection(session,assessment.status,index)),
    extensions:{blueprintId:assessment.blueprintId,practiceMode:assessment.practiceMode,administrationBasis:PROGRAM.administrationBasis,...without(assessment,known)}
  };
}

function optionValues(values){
  return (values||[]).map(value=>typeof value==="object"?(value.value??value.id??value.label):value);
}

function normalizeResponse(item){
  switch(item.itemType){
    case "multiple_choice": case "dropdown": case "hot_text":
      return {kind:"single-choice",options:[...(item.options||[])]};
    case "hotspot":
      return {kind:"single-choice",options:[...(item.regions||item.options||[])]};
    case "multi_select":
      return {kind:"multiple-select",options:[...(item.options||[])]};
    case "matching": case "matching_table":
      return {kind:"matching",pairs:[...(item.pairs||item.rows||[])],choices:[...(item.choices||item.columns||[])]};
    case "drag_drop":
      return {kind:"interactive",choices:[...(item.tokens||item.options||[])],constraints:{interaction:"ordering"}};
    case "numeric_input": case "number_line": case "angle_input":
      return {kind:"structured",fields:[item.itemType==="angle_input"?"angle":"value"],constraints:{numeric:true}};
    case "coordinate_point":
      return {kind:"structured",fields:["x","y"],constraints:{interaction:"coordinate-point"}};
    case "coordinate_line":
      return {kind:"structured",fields:["x1","y1","x2","y2"],constraints:{interaction:"coordinate-line"}};
    case "line_plot": case "bar_graph":
      return {kind:"structured",fields:[...(item.fields||[])],constraints:{interaction:item.itemType}};
    case "clock_input":
      return {kind:"structured",fields:["hour","minute"],constraints:{interaction:"clock"}};
    case "ebsr":
      return {kind:"structured",fields:(item.parts||[]).map((part,index)=>({id:`part-${index+1}`,prompt:part.prompt,options:part.options||[],multi:Boolean(part.multi)})),constraints:{interaction:"ebsr"}};
    case "constructed_response":
      return {kind:"text",constraints:{rows:item.responseRows??6,maxLength:item.maxLength??null}};
    default: throw new Error(`${item.id}: unsupported itemType ${item.itemType}`);
  }
}

function rubricFor(item){
  if(item.itemType!=="constructed_response")return null;
  const source=item.scoring?.rubric;
  if(item.scoring?.mode!=="manual"||!source)throw new Error(`${item.id}: constructed response lacks manual rubric`);
  const criteria=(source.criteria||[]).map((criterion,index)=>{
    if(typeof criterion==="string")return {id:`criterion-${index+1}`,label:`Criterion ${index+1}`,maxPoints:1,description:criterion};
    return {id:String(criterion.id??`criterion-${index+1}`),label:String(criterion.label??`Criterion ${index+1}`),maxPoints:Number(criterion.maxPoints??1),description:criterion.description??criterion.text??null};
  });
  return {id:`${item.id}-rubric`,label:`${item.id} manual scoring rubric`,version:"map-source-2026-08-23",maxPoints:Number(source.maxPoints),criteria,metadata:{sourceMode:"manual"}};
}

function normalizeScoring(item,rubric){
  const source=item.scoring||{};
  if(item.itemType==="constructed_response")return {mode:"manual-rubric",rubricRef:rubric.id,rationale:item.rationale??null,extensions:{sourceMode:"manual"}};
  const result={mode:"automatic",rationale:item.rationale??null,extensions:{}};
  if(source.answer!==undefined)result.answer=source.answer;
  if(source.answers!==undefined)result.answers=[...source.answers];
  if(source.matches!==undefined)result.matches={...source.matches};
  if(source.order!==undefined)result.answer=[...source.order];
  const extra=without(source,new Set(["answer","answers","matches","order"]));
  if(Object.keys(extra).length)result.extensions.sourceScoring=extra;
  return result;
}

function normalizeStimulus(stimulus){
  const metadata=without(stimulus,new Set(["id","title","text"]));
  return {id:stimulus.id,title:stimulus.title??null,text:stimulus.text??null,provenance:stimulus.provenance??"original-synthetic",metadata};
}

function normalizeItem(item,assessmentId,rubric){
  if(!SUPPORTED_ITEM_TYPES.includes(item.itemType))throw new Error(`${item.id}: unsupported released item type ${item.itemType}`);
  const sectionIds=(item.sessionEligibility||[]).map(sectionKey);
  if(!sectionIds.length)throw new Error(`${item.id}: missing session eligibility`);
  const presentationKeys=new Set(["id","itemType","points","prompt","stimulus","options","regions","pairs","rows","choices","columns","tokens","fields","parts","responseRows","maxLength","scoring","rationale","sessionEligibility"]);
  return {
    id:item.id,
    assessmentId,
    sectionIds,
    itemType:item.itemType,
    points:Number(item.points),
    prompt:item.prompt,
    ...(item.stimulus?.id?{stimulusRefs:[item.stimulus.id]}:{}),
    response:normalizeResponse(item),
    scoring:normalizeScoring(item,rubric),
    metadata:without(item,presentationKeys),
    extensions:{sourceSessionEligibility:[...item.sessionEligibility]}
  };
}

function effectiveContent(assessments){
  const stimuliById=new Map();
  const items=[];
  const rubrics=[];
  for(const assessment of assessments){
    const bank=BANKS[assessment.id];
    if(!Array.isArray(bank))throw new Error(`${assessment.id}: missing effective bank`);
    for(const item of bank){
      if(item.stimulus?.id){
        const normalized=normalizeStimulus(item.stimulus);
        const existing=stimuliById.get(normalized.id);
        if(existing&&stableStringify(existing)!==stableStringify(normalized))throw new Error(`${item.id}: stimulus ${normalized.id} collides with different content`);
        stimuliById.set(normalized.id,normalized);
      }
      const rubric=rubricFor(item);
      if(rubric)rubrics.push(rubric);
      items.push(normalizeItem(item,assessment.id,rubric));
    }
  }
  return {stimuli:[...stimuliById.values()],items,rubrics};
}

export function buildUnifiedMapPackage({generatedAt=new Date().toISOString(),sourceCommit=currentCommit(),manifest=sourceManifest()}={}){
  if(!/^[0-9a-f]{40}$/.test(sourceCommit))throw new Error("sourceCommit must be a full git SHA");
  const sourceAssessments=assessmentList().filter(assessment=>assessment.status==="practice-released"||assessment.status==="released");
  const assessments=sourceAssessments.map(normalizeAssessment);
  const content=effectiveContent(sourceAssessments);
  const effectiveContentFingerprint=sha256(stableStringify({assessments,content}));
  return {schemaVersion:"0.1",package:{family:"map",sourceRepository:REPOSITORY,sourceCommit,generatedAt,exporterVersion:EXPORTER_VERSION,effectiveContentFingerprint,officialSourcesVerified:PROGRAM.officialSourcesVerified,sourceManifest:manifest},assessments,content};
}

function parseArgs(argv){
  const result={out:null,generatedAt:null};
  for(let i=0;i<argv.length;i++){
    if(argv[i]==="--out")result.out=argv[++i];
    else if(argv[i]==="--generated-at")result.generatedAt=argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return result;
}

function main(){
  const args=parseArgs(process.argv.slice(2));
  const artifact=buildUnifiedMapPackage(args.generatedAt?{generatedAt:args.generatedAt}:undefined);
  const json=`${JSON.stringify(artifact,null,2)}\n`;
  if(args.out){const out=path.resolve(args.out);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,json,"utf8");console.log(`Wrote ${artifact.assessments.length} assessments / ${artifact.content.items.length} items to ${out}`);}else process.stdout.write(json);
}

const invoked=process.argv[1]?pathToFileURL(path.resolve(process.argv[1])).href:null;
if(invoked===import.meta.url)main();
