import assert from "node:assert/strict";
import { ASSESSMENTS } from "../js/config.js";
import { BANKS } from "../js/banks.js";
import { drawPracticeSession,seededRandom } from "../js/core/form-builder.js";

const stableGroupKey=item=>item.deliveryGroup||item.stimulusId||item.stimulus?.id||null;
const points=items=>items.reduce((sum,item)=>sum+Number(item.points||0),0);

for(const grade of [3,4,5,6,7,8]){
  const assessmentId=`g${grade}-math`, assessment=ASSESSMENTS[assessmentId], bank=BANKS[assessmentId];
  const session=assessment.sessions.find(s=>s.performanceEvent===true);
  assert(session,`${assessmentId}: missing declared Performance Event session`);
  const eligible=bank.filter(item=>item.sessionEligibility.includes(session.id));
  assert(eligible.length>0,`${assessmentId}: Performance Event session has no development items`);
  assert.deepEqual(eligible.filter(item=>item.strand!=="Performance Event").map(item=>item.id),[],`${assessmentId}: non-PE items leaked into PE session`);
  assert.deepEqual(eligible.filter(item=>!stableGroupKey(item)).map(item=>item.id),[],`${assessmentId}: every PE item needs an explicit stable delivery-group identity`);

  const operational=eligible.filter(item=>item.operationalEvent===true);
  assert(operational.length>0,`${assessmentId}: no complete operational-size PE items are available`);
  assert.deepEqual(operational.filter(item=>item.blueprintComponent!=="PE").map(item=>item.id),[],`${assessmentId}: operational PE items must be tagged blueprintComponent=PE`);
  const operationalGroups=new Map();
  for(const item of operational){
    const key=stableGroupKey(item);
    if(!operationalGroups.has(key))operationalGroups.set(key,[]);
    operationalGroups.get(key).push(item);
  }
  assert(operationalGroups.size>=3,`${assessmentId}: need at least three independent complete operational PE bundles`);
  const requiredPoints=grade<=5?6:8;
  for(const [key,items] of operationalGroups){
    assert.equal(points(items),requiredPoints,`${assessmentId}: operational PE ${key} must total exactly ${requiredPoints} points`);
    assert(items.every(item=>item.sessionEligibility.length===1&&item.sessionEligibility[0]===session.id),`${assessmentId}: operational PE ${key} must be Session ${session.id}-only`);
  }

  for(let seed=1;seed<=100;seed++){
    const draw=drawPracticeSession(bank,session.id,{maxItems:12,rng:seededRandom(seed)});
    assert(draw.length>0,`${assessmentId}: PE draw unexpectedly empty`);
    const keys=new Set(draw.map(stableGroupKey));
    assert.equal(keys.size,1,`${assessmentId}: a PE draw mixed multiple events`);
    const [key]=keys;
    const completeEventIds=eligible.filter(item=>stableGroupKey(item)===key).map(item=>item.id).sort();
    assert.deepEqual(draw.map(item=>item.id).sort(),completeEventIds,`${assessmentId}: PE draw split an event instead of delivering it whole`);
  }
}

console.log("PASS: all Math PE sessions preserve complete delivery groups and include at least three operational-size 6/8-point events per grade.");
