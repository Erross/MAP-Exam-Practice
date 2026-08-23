import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import {
  MIDDLE_SCHOOL_SCIENCE_EXPECTATIONS,
  G8_SEMANTIC_REVIEW_PENDING
} from "../js/science-semantic-review.js";
import { G8_ITEM_REPAIR_IDS } from "../js/science-semantic-item-repairs-g8.js";

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

assert.deepEqual(G8_SEMANTIC_REVIEW_PENDING,{},"Grade 8 semantic-review ledger must stay reconciled after the ESS2.A.2 repair batch");
for(const id of G8_ITEM_REPAIR_IDS){
  const item=byId.get(id);
  assert(item,`${id}: Grade 8 semantic repair points to a missing browser-effective item`);
  assert.equal(item.standard,"6-8.ESS2.A.2",`${id}: ESS2.A.2 repair unexpectedly changed the expectation family`);
  assert.equal(item.semanticPromptReview,"repaired-scale-depth-from-source-audit",`${id}: scale-depth repair provenance marker missing`);
  const evidence=`${item.stimulus?.text||""} ${item.prompt||""}`;
  assert.match(evidence,/(years|decades|centuries|season|time|kilometer|kilometre|larger|spatial|scale)/i,`${id}: repaired ESS2.A.2 item no longer exposes time/spatial-scale evidence`);
}
assert.equal(byId.get("g8s-008")?.scoring?.answer,920,"g8s-008 repeated-event accumulation regression");
assert.equal(byId.get("g8s-div-a014")?.scoring?.answer,1060,"g8s-div-a014 repeated-wave accumulation regression");
assert.equal(byId.get("g8s-div-b014")?.scoring?.answer,1320,"g8s-div-b014 repeated-season accumulation regression");
assert.equal(byId.get("g8s-cr-005")?.scoring?.rubric?.maxPoints,2,"g8s-cr-005 manual rubric point contract regressed");

const solarScaleIds=["g8s-019","g8s-020","g8s-021","g8s-div-a017","g8s-div-b017","g8s-div-b019"];
for(const id of solarScaleIds)assert.equal(byId.get(id)?.standard,"6-8.ESS1.B.1",`${id}: solar-system scale item regressed to another expectation`);
const magneticForceIds=["g8s-033","g8s-034","g8s-035","g8s-036"];
for(const id of magneticForceIds)assert.equal(byId.get(id)?.standard,"6-8.PS2.B.1",`${id}: magnetic-force factor item regressed to another expectation`);
const resourceImpactIds=["g8s-022","g8s-023","g8s-024","g8s-cap-008","g8s-cap-009","g8s-cap-010","g8s-div-a018","g8s-div-b018"];
for(const id of resourceImpactIds)assert.equal(byId.get(id)?.standard,"6-8.ESS3.C.1",`${id}: population/per-capita resource-impact item regressed to another expectation`);

console.log(`PASS: all ${bank.length} Grade 8 Science items use source-defined middle-school expectations; ${G8_ITEM_REPAIR_IDS.length} ESS2.A.2 time/spatial-scale repairs are browser-effective and the semantic ledger is clear.`);
