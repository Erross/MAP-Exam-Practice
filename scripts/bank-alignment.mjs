import { BANKS } from "../js/banks.js";
import { ASSESSMENTS } from "../js/config.js";
import { BLUEPRINTS } from "../js/blueprints.js";
import { deliveryBundles,deliveryGroupKey } from "../js/core/form-builder.js";

const points=items=>items.reduce((sum,item)=>sum+Number(item.points||0),0);
const sortEntries=obj=>Object.entries(obj).sort((a,b)=>a[0].localeCompare(b[0]));
const add=(obj,key,item)=>{
  const k=key||"(none)";
  obj[k]??={items:0,points:0};
  obj[k].items++;
  obj[k].points+=Number(item.points||0);
};
const standardDomain=item=>String(item.standard||"").split(".")[1]||null;
function blueprintCode(item,assessment){
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

for(const [assessmentId,bank] of Object.entries(BANKS)){
  const assessment=ASSESSMENTS[assessmentId];
  const blueprint=BLUEPRINTS[assessmentId];
  const byReporting={},byStrand={},bySession={},byType={};
  for(const item of bank){
    add(byReporting,item.reportingCategory,item);
    add(byStrand,item.strand,item);
    add(byType,item.itemType,item);
    for(const sessionId of item.sessionEligibility||[]) add(bySession,String(sessionId),item);
  }

  console.log(`\n=== ${assessmentId} (${bank.length} items / ${points(bank)} bank points) ===`);
  console.log("reportingCategory:",JSON.stringify(Object.fromEntries(sortEntries(byReporting))));
  console.log("strand:",JSON.stringify(Object.fromEntries(sortEntries(byStrand))));
  console.log("session eligibility:",JSON.stringify(Object.fromEntries(sortEntries(bySession))));
  console.log("item types:",JSON.stringify(Object.fromEntries(sortEntries(byType))));

  if(["math","science"].includes(assessment.subject)){
    const capacity={};
    for(const item of bank){
      const code=blueprintCode(item,assessment);
      if(code)add(capacity,code,item);
    }
    const gaps=[];
    for(const rule of blueprint.officialConstraints||[]){
      if(rule.component==="performance-event")continue;
      const have=capacity[rule.code]?.points||0;
      if(have<rule.minPoints)gaps.push({code:rule.code,have,min:rule.minPoints,gap:rule.minPoints-have});
    }
    const nonPeItems=bank.filter(item=>blueprintCode(item,assessment)!=="PE");
    const peRule=(blueprint.officialConstraints||[]).find(rule=>rule.component==="performance-event");
    const ordinaryTarget=assessment.subject==="math"&&peRule?blueprint.officialPointTarget-peRule.minPoints:blueprint.officialPointTarget;
    console.log("blueprint capacity (standard-derived):",JSON.stringify(Object.fromEntries(sortEntries(capacity))));
    console.log("ordinary/non-PE capacity:",JSON.stringify({points:points(nonPeItems),targetFloor:ordinaryTarget,pointGap:Math.max(0,ordinaryTarget-points(nonPeItems)),categoryMinimumGaps:gaps}));
  }

  if(assessment.subject==="math"){
    const peSession=assessment.sessions.find(s=>s.performanceEvent===true);
    if(peSession){
      const peItems=bank.filter(item=>item.sessionEligibility.includes(peSession.id));
      const bundles=deliveryBundles(peItems).map(bundle=>({
        key:deliveryGroupKey(bundle[0]),
        itemCount:bundle.length,
        points:points(bundle),
        operational:bundle.every(item=>item.operationalEvent===true),
        standards:[...new Set(bundle.map(i=>i.standard))]
      })).sort((a,b)=>String(a.key).localeCompare(String(b.key)));
      console.log("performance-event bundles:",JSON.stringify(bundles));
    }
  }
}
