import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import { ASSESSMENTS } from "../js/config.js";
import { BLUEPRINTS } from "../js/blueprints.js";

const points=items=>items.reduce((sum,item)=>sum+Number(item.points||0),0);
const standardDomain=item=>String(item.standard||"").split(".")[1]||null;
function codeFor(item,assessment){
  if(assessment.subject==="math"){
    if(item.strand==="Performance Event"||item.blueprintComponent==="PE")return "PE";
    const domain=standardDomain(item);
    if([3,4,5].includes(assessment.grade)&&["GM","DS"].includes(domain))return "GM+DS";
    if([6,7].includes(assessment.grade)&&["GM","DSP"].includes(domain))return "GM+DSP";
    if(assessment.grade===8&&["NS","EEI"].includes(domain))return "NS+EEI";
    if(assessment.grade===8&&["GM","DSP"].includes(domain))return "GM+DSP";
    return domain;
  }
  if(assessment.subject==="science"){
    if(item.strand==="Physical Science")return "PS";
    if(item.strand==="Life Science")return "LS";
    if(item.strand==="Earth & Space Science")return "ESS";
  }
  return null;
}

for(const [assessmentId,assessment] of Object.entries(ASSESSMENTS)){
  if(!["math","science"].includes(assessment.subject))continue;
  const bank=BANKS[assessmentId],blueprint=BLUEPRINTS[assessmentId];
  assert(bank&&blueprint,`${assessmentId}: missing bank or blueprint`);
  const capacity=new Map();
  for(const item of bank){
    const code=codeFor(item,assessment);
    if(code)capacity.set(code,(capacity.get(code)||0)+Number(item.points||0));
  }
  for(const rule of blueprint.officialConstraints){
    if(rule.component==="performance-event")continue;
    const have=capacity.get(rule.code)||0;
    assert(have>=rule.minPoints,`${assessmentId}: ${rule.code} bank capacity ${have} < primary-verified blueprint minimum ${rule.minPoints}`);
  }
  if(assessment.subject==="math"){
    const peRule=blueprint.officialConstraints.find(rule=>rule.component==="performance-event");
    assert(peRule,`${assessmentId}: missing official PE constraint`);
    const ordinary=bank.filter(item=>codeFor(item,assessment)!=="PE");
    const ordinaryTarget=blueprint.officialPointTarget-peRule.minPoints;
    assert(points(ordinary)>=ordinaryTarget,`${assessmentId}: ordinary/non-PE capacity ${points(ordinary)} < ${ordinaryTarget}`);
  }
  if(assessment.subject==="science"){
    assert(points(bank)>=90,`${assessmentId}: development Science bank diversity floor ${points(bank)} < 90 points`);
    for(const code of ["PS","LS","ESS"]){
      const have=capacity.get(code)||0;
      assert(have>=30,`${assessmentId}: development ${code} diversity floor ${have} < 30 points`);
    }
  }
}

console.log("PASS: Math ordinary-category/point capacity meets every current DESE primary-verified minimum; Science meets primary-verified strand minimums plus >=90 development bank points and >=30 points per strand. These are capacity/diversity gates, not evidence that current non-executable official blueprints are release-ready.");
