import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import {
  MIDDLE_SCHOOL_SCIENCE_EXPECTATIONS,
  G8_SEMANTIC_REVIEW_PENDING
} from "../js/science-semantic-review.js";

const bank=BANKS["g8-science"]||[];
assert.equal(bank.length,89,"Grade 8 Science browser-effective bank size changed unexpectedly");
const byId=new Map(bank.map(item=>[item.id,item]));
assert.equal(byId.size,bank.length,"Grade 8 Science IDs must remain unique");

for(const item of bank){
  assert(
    MIDDLE_SCHOOL_SCIENCE_EXPECTATIONS[item.standard],
    `${item.id}: standard ${item.standard} is syntactically valid but absent from the source-controlled middle-school expectation dictionary`
  );
}

assert.deepEqual(G8_SEMANTIC_REVIEW_PENDING,{},"Grade 8 semantic-review ledger must stay reconciled after source consolidation");
const consolidatedEss2Ids=["g8s-007","g8s-008","g8s-009","g8s-div-a013","g8s-div-a014","g8s-div-a015","g8s-div-b013","g8s-div-b014","g8s-div-b015","g8s-cr-005"];
for(const id of consolidatedEss2Ids){
  const item=byId.get(id);
  assert(item,`${id}: consolidated Grade 8 semantic repair is missing`);
  assert.equal(item.standard,"6-8.ESS2.A.2",`${id}: ESS2.A.2 repair unexpectedly changed the expectation family`);
  assert.equal(item.semanticPromptReview,undefined,`${id}: Grade 8 repair should now live in the source bank, not a browser overlay`);
  const evidence=`${item.stimulus?.text||""} ${item.prompt||""}`;
  assert.match(evidence,/(years|decades|centuries|season|time|kilometer|kilometre|larger|spatial|scale)/i,`${id}: consolidated ESS2.A.2 item no longer exposes time/spatial-scale evidence`);
}
assert.equal(byId.get("g8s-008")?.scoring?.answer,920,"g8s-008 repeated-event accumulation regression");
assert.equal(byId.get("g8s-div-a014")?.scoring?.answer,1060,"g8s-div-a014 repeated-wave accumulation regression");
assert.equal(byId.get("g8s-div-b014")?.scoring?.answer,1320,"g8s-div-b014 repeated-season accumulation regression");
assert.equal(byId.get("g8s-cr-005")?.scoring?.rubric?.maxPoints,2,"g8s-cr-005 manual rubric point contract regressed");
assert.match(byId.get("g8s-cr-005")?.prompt||"",/25-year/i,"g8s-cr-005 must retain long-term evidence");
assert.match(byId.get("g8s-cr-005")?.prompt||"",/kilometer/i,"g8s-cr-005 must retain spatial-scale evidence");

const matterModelItem=byId.get("g8s-013");
assert(matterModelItem,"g8s-013 matter-model item is missing");
assert.equal(matterModelItem.standard,"6-8.PS1.A.1","g8s-013 matter-model alignment regressed");
assert.doesNotMatch(matterModelItem.prompt||"",/extended structure/i,"g8s-013 must not cue the correct option by repeating the target label in the stem");
assert.doesNotMatch(String(matterModelItem.scoring?.answer||""),/extended structure/i,"g8s-013 correct option must require interpreting the particle model rather than matching the stem label");
assert.match(matterModelItem.prompt||"",/not made of separate molecules/i,"g8s-013 must still distinguish a repeating solid arrangement from discrete molecules");

const solarScaleIds=["g8s-019","g8s-020","g8s-021","g8s-div-a017","g8s-div-b017","g8s-div-b019"];
for(const id of solarScaleIds)assert.equal(byId.get(id)?.standard,"6-8.ESS1.B.1",`${id}: solar-system scale item regressed to another expectation`);
const magneticForceIds=["g8s-033","g8s-034","g8s-035","g8s-036"];
for(const id of magneticForceIds)assert.equal(byId.get(id)?.standard,"6-8.PS2.B.1",`${id}: magnetic-force factor item regressed to another expectation`);
const resourceImpactIds=["g8s-022","g8s-023","g8s-024","g8s-cap-008","g8s-cap-009","g8s-cap-010","g8s-div-a018","g8s-div-b018"];
for(const id of resourceImpactIds)assert.equal(byId.get(id)?.standard,"6-8.ESS3.C.1",`${id}: population/per-capita resource-impact item regressed to another expectation`);
const capResourceCalculation=byId.get("g8s-cap-008");
assert.equal(capResourceCalculation?.scoring?.answer,1020000,"g8s-cap-008 must calculate the change in total demand using population and per-capita use");
const capResourceEvidence=`${capResourceCalculation?.stimulus?.text||""} ${capResourceCalculation?.prompt||""} ${capResourceCalculation?.rationale||""}`;
assert.match(capResourceEvidence,/population/i,"g8s-cap-008 lost the population dimension of ESS3.C.1");
assert.match(capResourceEvidence,/(per person|per-person)/i,"g8s-cap-008 lost the per-capita consumption dimension of ESS3.C.1");
assert.match(capResourceEvidence,/(water demand|total water|total demand)/i,"g8s-cap-008 must connect the two variables to resource demand");

console.log(`PASS: all ${bank.length} Grade 8 Science items use source-defined middle-school expectations; ${consolidatedEss2Ids.length} ESS2.A.2 repairs, the g8s-013 matter-model cue repair, and the ESS3.C.1 population/per-capita calculation are pinned in source.`);
