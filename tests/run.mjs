import assert from "node:assert/strict";
import { PROGRAM, ASSESSMENTS, SUPPORTED_ITEM_TYPES } from "../js/config.js";
import { BANKS } from "../js/banks.js";
import { validateItem, scoreResponse } from "../js/core/item-types.js";
import { drawPracticeSession, deliveryGroupKey, seededRandom } from "../js/core/form-builder.js";
import { drawBlueprintForm,validateBlueprintForm,validateBlueprintSpec,BLUEPRINTS } from "../js/blueprints.js";
import { newAttempt,materializeItems,isRestorableAttempt,setResponse } from "../js/core/session.js";

assert.equal(PROGRAM.family,"map"); assert.equal(PROGRAM.timingPolicy,"guideline");
assert.equal(Object.keys(ASSESSMENTS).length,14,"Expected 14 Grade-Level assessment configs");
assert.equal(Object.keys(BLUEPRINTS).length,14,"Expected blueprint records for all 14 Grade-Level assessments");
for(const a of Object.values(ASSESSMENTS)){
  assert.equal(a.sessions.every(s=>s.timingPolicy==="guideline"),true);
  assert.equal(a.sessions.every(s=>Array.isArray(s.guidelineMinutes)&&s.guidelineMinutes.length===2&&s.guidelineMinutes.every(Number.isFinite)),true,`${a.id}: every session needs a numeric guideline range`);
  assert.equal(a.fullSimulationAvailable,false);
  const blueprint=BLUEPRINTS[a.blueprintId];
  assert.equal(blueprint.assessmentId,a.id);
  assert.equal(blueprint.officialPointTarget,a.points);
  assert.equal(blueprint.officialPointTargetVerified,true,`${a.id}: official total should be current-DESE verified`);
  assert(Array.isArray(blueprint.officialConstraints)&&blueprint.officialConstraints.length>0,`${a.id}: official constraint transcription missing`);
  assert.equal(blueprint.officialRangesVerified,false,`${a.id}: category ranges must remain pending primary-current confirmation`);
  assert.equal(blueprint.verified,false,`${a.id}: no current assessment should be release-verified yet`);
  assert.equal(blueprint.executable,false,`${a.id}: full operational blueprint must remain non-executable while blockers remain`);
  assert(Array.isArray(blueprint.executionBlockers)&&blueprint.executionBlockers.length>0,`${a.id}: execution blockers must be explicit`);
  assert.deepEqual(validateBlueprintSpec(blueprint),[],`${a.id}: non-executable official blueprint record should still be structurally valid`);
}
for(const g of [3,4,5]){
  assert.equal(ASSESSMENTS[`g${g}-math`].sessions.every(s=>s.calculatorPolicy==="none"&&!s.calculatorAllowed),true);
}
for(const g of [6,7,8]){
  assert.equal(ASSESSMENTS[`g${g}-math`].sessions.every(s=>s.calculatorPolicy==="available"&&s.calculatorAllowed),true);
  assert.equal(ASSESSMENTS[`g${g}-math`].sessions.every(s=>s.calculatorLabel==="Calculator available"),true);
}
assert.deepEqual(ASSESSMENTS["g8-math"].sessions.map(s=>s.guidelineMinutes),[[30,50],[30,50],[30,40]]);
assert.deepEqual(ASSESSMENTS["g8-science"].sessions.map(s=>s.guidelineMinutes),[[55,75],[55,75]]);
assert.equal(ASSESSMENTS["g5-science"].sessions.every(s=>s.calculatorPolicy==="available"&&s.calculatorLevel==="four-function"),true);
assert.equal(ASSESSMENTS["g8-science"].sessions.every(s=>s.calculatorPolicy==="available"&&s.calculatorLevel==="scientific"),true);
assert.equal(ASSESSMENTS["g8-ela"].sessions[3].deferred.includes("listening-audio"),true);

for(const g of [3,4,5,6,7,8]){
  const assessmentId=`g${g}-math`, assessment=ASSESSMENTS[assessmentId], bank=BANKS[assessmentId];
  const peSession=assessment.sessions.find(s=>s.performanceEvent===true);
  assert(peSession,`${assessmentId}: missing declared Performance Event session`);
  const eligible=bank.filter(i=>i.sessionEligibility.includes(peSession.id));
  assert(eligible.length>0,`${assessmentId}: Performance Event session has no auto-scorable development items`);
  const contaminants=eligible.filter(i=>i.strand!=="Performance Event").map(i=>i.id);
  assert.deepEqual(contaminants,[],`${assessmentId}: non-PE items leaked into Performance Event session: ${contaminants.join(", ")}`);
  const ungrouped=eligible.filter(i=>!deliveryGroupKey(i)).map(i=>i.id);
  assert.deepEqual(ungrouped,[],`${assessmentId}: Performance Event items need stable delivery groups: ${ungrouped.join(", ")}`);
  for(let seed=1;seed<=50;seed++){
    const draw=drawPracticeSession(bank,peSession.id,{maxItems:12,rng:seededRandom(seed)});
    assert(draw.length>0,`${assessmentId}: PE draw unexpectedly empty`);
    assert.equal(new Set(draw.map(deliveryGroupKey)).size,1,`${assessmentId}: PE practice draw mixed multiple events`);
  }
}

const ids=new Set(); let count=0;
for(const [assessmentId,bank] of Object.entries(BANKS)){
  const assessment=ASSESSMENTS[assessmentId]; assert(assessment,`${assessmentId}: missing config`);
  assert(bank.length>0,`${assessmentId} bank empty`);
  for(const item of bank){
    count++; assert(!ids.has(item.id),`duplicate ${item.id}`); ids.add(item.id);
    const errs=validateItem(item); assert.deepEqual(errs,[],errs.join("\n")); assert(SUPPORTED_ITEM_TYPES.includes(item.itemType));
    assert.equal(item.grade,assessment.grade,`${item.id}: grade mismatch`); assert.equal(item.subject,assessment.subject,`${item.id}: subject mismatch`); assert.equal(item.provenance,"original-synthetic");
  }
  for(let sessionId=1;sessionId<=assessment.sessions.length;sessionId++){
    const eligible=bank.filter(i=>i.sessionEligibility.includes(sessionId)); if(!eligible.length) continue;
    for(let seed=1;seed<=100;seed++){ const draw=drawPracticeSession(bank,sessionId,{maxItems:12,rng:seededRandom(seed)}); const variants=draw.map(i=>i.variantFamily||i.id); assert.equal(new Set(variants).size,variants.length); }
  }
}
assert(count>=791,"Expected at least 791 development items across all 14 Grade-Level banks");

const fixture=(itemType,scoring,extra={})=>({id:`fixture-${itemType}`,grade:8,subject:"math",standard:"fixture",strand:"fixture",dok:1,itemType,points:1,sessionEligibility:[1],prompt:"fixture",scoring,rationale:"fixture",provenance:"original-synthetic",...extra});
const scoringCases=[
  [fixture("multiple_choice",{answer:"B"},{options:["A","B","C","D"]}),"B","A"],
  [fixture("multi_select",{answers:["A","C"]},{options:["A","B","C","D"]}),["C","A"],["A","B"]],
  [fixture("dropdown",{answer:"red"},{options:["red","blue"]}),"red","blue"],
  [fixture("hot_text",{answer:"word"},{options:["word","other"]}),"word","other"],
  [fixture("hotspot",{answer:"region-b"},{regions:["region-a","region-b"]}),"region-b","region-a"],
  [fixture("matching",{matches:{A:"x",B:"y"}},{pairs:[{key:"A"},{key:"B"}],choices:["x","y"]}),{A:"x",B:"y"},{A:"y",B:"x"}],
  [fixture("matching_table",{matches:{A:"yes",B:"no"}},{rows:[{key:"A"},{key:"B"}],columns:["yes","no"]}),{A:"yes",B:"no"},{A:"no",B:"yes"}],
  [fixture("drag_drop",{order:["a","b","c"]},{tokens:["a","b","c"]}),["a","b","c"],["b","a","c"]],
  [fixture("numeric_input",{answer:3.5,tolerance:0.01}),3.5,3.6],
  [fixture("number_line",{answer:2.25,tolerance:0.05}),2.27,2.4],
  [fixture("angle_input",{answer:65,tolerance:0}),65,64],
  [fixture("coordinate_point",{answer:{x:2,y:-1}}),{x:2,y:-1},{x:2,y:1}],
  [fixture("coordinate_line",{answer:{x1:0,y1:1,x2:2,y2:3}}),{x1:0,y1:1,x2:2,y2:3},{x1:0,y1:1,x2:3,y2:2}],
  [fixture("bar_graph",{answer:[2,4,6]},{fields:["a","b","c"]}),[2,4,6],[2,4,5]],
  [fixture("line_plot",{answer:[1,2,1]},{fields:["a","b","c"]}),[1,2,1],[1,1,2]],
  [fixture("clock_input",{answer:{hour:4,minute:35}}),{hour:4,minute:35},{hour:4,minute:30}],
  [fixture("ebsr",{answers:["A","D"]},{parts:[{options:["A","B"]},{options:["C","D"]}]}),["A","D"],["A","C"]]
];
for(const [item,good,bad] of scoringCases){assert.equal(scoreResponse(item,good).earned,1,`${item.itemType} should score correct`);assert.equal(scoreResponse(item,bad).earned,0,`${item.itemType} should score incorrect`);}

const shuffleItem=fixture("multiple_choice",{answer:"B"},{id:"shuffle-fixture",options:["A","B","C","D"]});
const attempt=newAttempt("g8-math",1,[shuffleItem],()=>0);
assert.equal(isRestorableAttempt(attempt),true);
const displayed=materializeItems([shuffleItem],attempt)[0];
assert.deepEqual(displayed.options,["B","C","D","A"],"display order should follow persisted shuffle");
assert.equal(scoreResponse(displayed,"B").earned,1,"semantic key survives option shuffle");
assert.deepEqual(materializeItems([shuffleItem],attempt)[0].options,displayed.options,"resume materializes same option order");
const locked={...attempt,submitted:true}; assert.throws(()=>setResponse(locked,"shuffle-fixture","B"),/locked/);

const executableRules=[
  {field:"reportingCategory",value:"A",minPoints:2,maxPoints:2},
  {field:"reportingCategory",value:"B",minPoints:2,maxPoints:2}
];
const blueprintFixture={
  assessmentId:"fixture",officialPointTarget:4,officialPointTargetVerified:true,
  officialConstraints:[{code:"A",label:"A",minPoints:2,maxPoints:2},{code:"B",label:"B",minPoints:2,maxPoints:2}],
  officialRangesVerified:true,verified:true,executable:true,supportedPointTarget:4,constraints:executableRules
};
assert.deepEqual(validateBlueprintSpec(blueprintFixture),[]);
assert(validateBlueprintSpec({...blueprintFixture,officialRangesVerified:false}).some(e=>e.includes("primary-current")));
assert(validateBlueprintSpec({...blueprintFixture,executable:false}).some(e=>e.includes("executable")));
const blueprintBank=[
  fixture("multiple_choice",{answer:"a"},{id:"bp-a1",options:["a","b","c"],reportingCategory:"A"}),
  fixture("multiple_choice",{answer:"a"},{id:"bp-a2",options:["a","b","c"],reportingCategory:"A"}),
  fixture("multiple_choice",{answer:"a"},{id:"bp-a3",options:["a","b","c"],reportingCategory:"A"}),
  fixture("multiple_choice",{answer:"a"},{id:"bp-b1",options:["a","b","c"],reportingCategory:"B"}),
  fixture("multiple_choice",{answer:"a"},{id:"bp-b2",options:["a","b","c"],reportingCategory:"B"}),
  fixture("multiple_choice",{answer:"a"},{id:"bp-b3",options:["a","b","c"],reportingCategory:"B"})
];
for(let seed=1;seed<=100;seed++){
  const form=drawBlueprintForm(blueprintBank,blueprintFixture,{rng:seededRandom(seed)});
  assert.equal(form.length,4);assert.deepEqual(validateBlueprintForm(form,blueprintFixture),[]);
}
assert.throws(()=>drawBlueprintForm(blueprintBank,{...blueprintFixture,verified:false}),/not independently verified and executable|Invalid blueprint/);
assert.throws(()=>drawBlueprintForm(BANKS["g8-math"],BLUEPRINTS["g8-math"]),/not independently verified and executable/);

const sanity=BANKS["g8-math"].find(i=>i.id==="g8m-005"); assert.equal(scoreResponse(sanity,7).earned,1); assert.equal(scoreResponse(sanity,6).earned,0);
console.log(`PASS: ${count} development items across ${Object.keys(BANKS).length} banks; 14 assessment configs/official blueprint records; ${scoringCases.length} response-type scoring fixtures; persisted option randomization; executable-blueprint guards; core invariants green.`);