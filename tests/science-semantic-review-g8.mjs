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

for(const [id,note] of Object.entries(G8_SEMANTIC_REVIEW_PENDING)){
  const item=byId.get(id);
  assert(item,`${id}: pending Grade 8 semantic-review item disappeared without ledger reconciliation`);
  assert.equal(item.standard,"6-8.ESS2.A.2",`${id}: pending ESS2.A.2 item changed standard without review-ledger reconciliation`);
  assert.equal(typeof note,"string");
  assert(note.length>20,`${id}: pending semantic-review reason must remain explicit`);
}

const solarScaleIds=["g8s-019","g8s-020","g8s-021","g8s-div-a017","g8s-div-b017","g8s-div-b019"];
for(const id of solarScaleIds)assert.equal(byId.get(id)?.standard,"6-8.ESS1.B.1",`${id}: solar-system scale item regressed to another expectation`);
const magneticForceIds=["g8s-033","g8s-034","g8s-035","g8s-036"];
for(const id of magneticForceIds)assert.equal(byId.get(id)?.standard,"6-8.PS2.B.1",`${id}: magnetic-force factor item regressed to another expectation`);
const resourceImpactIds=["g8s-022","g8s-023","g8s-024","g8s-cap-008","g8s-cap-009","g8s-cap-010","g8s-div-a018","g8s-div-b018"];
for(const id of resourceImpactIds)assert.equal(byId.get(id)?.standard,"6-8.ESS3.C.1",`${id}: population/per-capita resource-impact item regressed to another expectation`);

console.log(`PASS: all ${bank.length} Grade 8 Science items use source-defined middle-school expectations; ${Object.keys(G8_SEMANTIC_REVIEW_PENDING).length} ESS2.A.2 depth-review items remain explicitly open.`);
