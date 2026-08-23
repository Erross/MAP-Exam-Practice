import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import {
  ELEMENTARY_SCIENCE_EXPECTATIONS,
  G5_STANDARD_CORRECTIONS,
  G5_SEMANTIC_REVIEW_PENDING
} from "../js/science-semantic-review.js";

const bank=BANKS["g5-science"]||[];
assert.equal(bank.length,88,"Grade 5 Science browser-effective bank size changed unexpectedly");
const byId=new Map(bank.map(item=>[item.id,item]));
assert.equal(byId.size,bank.length,"Grade 5 Science IDs must remain unique");

for(const [id,expectedStandard] of Object.entries(G5_STANDARD_CORRECTIONS)){
  const item=byId.get(id);
  assert(item,`${id}: semantic correction points to a missing browser-effective item`);
  assert.equal(item.standard,expectedStandard,`${id}: semantic correction was not applied`);
  assert.equal(item.semanticStandardReview,"corrected-from-source-audit",`${id}: correction provenance marker missing`);
  assert(ELEMENTARY_SCIENCE_EXPECTATIONS[expectedStandard],`${id}: corrected standard lacks a source-controlled expectation definition`);
}

for(const item of bank){
  assert(
    ELEMENTARY_SCIENCE_EXPECTATIONS[item.standard],
    `${item.id}: standard ${item.standard} is syntactically valid but absent from the source-controlled elementary expectation dictionary`
  );
}

for(const [id,note] of Object.entries(G5_SEMANTIC_REVIEW_PENDING)){
  assert(byId.has(id),`${id}: pending semantic-review item disappeared without the review ledger being reconciled`);
  assert.equal(typeof note,"string");
  assert(note.length>20,`${id}: pending semantic-review reason must remain explicit`);
}

const forceMagnitudeIds=["g5s-010","g5s-div-a006","g5s-div-b005","g5s-cr-002"];
for(const id of forceMagnitudeIds)assert.equal(byId.get(id)?.standard,"4.PS.2.B.2",`${id}: force/mass effect item regressed to the motion-pattern expectation`);
const magnetDistanceIds=["g5s-cap-004","g5s-cap-005","g5s-cap-006"];
for(const id of magnetDistanceIds)assert.equal(byId.get(id)?.standard,"3.PS.2.B.1",`${id}: magnetic-distance investigation regressed to an unrelated expectation`);
const erosionIds=["g5s-005","g5s-017","g5s-018","g5s-025","g5s-026","g5s-div-a013","g5s-div-a014","g5s-div-a018","g5s-div-b013","g5s-div-b014","g5s-div-b015","g5s-cr-005"];
for(const id of erosionIds)assert.equal(byId.get(id)?.standard,"4.ESS.2.A.1",`${id}: erosion item regressed to the Grade 5 Earth-systems interaction expectation`);
const lightHeatingIds=["g5s-009","g5s-cap-001","g5s-cap-002","g5s-cap-003","g5s-div-a001","g5s-div-a002","g5s-div-a003","g5s-div-b006"];
for(const id of lightHeatingIds)assert.equal(byId.get(id)?.standard,"4.PS.3.B.1",`${id}: energy/temperature item regressed to the Grade 5 vision expectation`);

console.log(`PASS: ${Object.keys(G5_STANDARD_CORRECTIONS).length} high-confidence Grade 5 Science semantic corrections are browser-effective and source-defined; ${Object.keys(G5_SEMANTIC_REVIEW_PENDING).length} prompt-level review items remain explicitly open.`);
