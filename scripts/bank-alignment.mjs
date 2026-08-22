import { BANKS } from "../js/banks.js";
import { ASSESSMENTS } from "../js/config.js";
import { deliveryBundles,deliveryGroupKey } from "../js/core/form-builder.js";

const points=items=>items.reduce((sum,item)=>sum+Number(item.points||0),0);
const sortEntries=obj=>Object.entries(obj).sort((a,b)=>a[0].localeCompare(b[0]));
const add=(obj,key,item)=>{
  const k=key||"(none)";
  obj[k]??={items:0,points:0};
  obj[k].items++;
  obj[k].points+=Number(item.points||0);
};

for(const [assessmentId,bank] of Object.entries(BANKS)){
  const assessment=ASSESSMENTS[assessmentId];
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

  if(assessment.subject==="math"){
    const peSession=assessment.sessions.find(s=>s.performanceEvent===true);
    if(peSession){
      const peItems=bank.filter(item=>item.sessionEligibility.includes(peSession.id));
      const bundles=deliveryBundles(peItems).map(bundle=>({
        key:deliveryGroupKey(bundle[0]),
        itemCount:bundle.length,
        points:points(bundle),
        standards:[...new Set(bundle.map(i=>i.standard))]
      })).sort((a,b)=>String(a.key).localeCompare(String(b.key)));
      console.log("performance-event bundles:",JSON.stringify(bundles));
    }
  }
}
