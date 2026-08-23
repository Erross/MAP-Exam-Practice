import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import {
  ELEMENTARY_SCIENCE_EXPECTATIONS,
  G5_STANDARD_CORRECTIONS,
  G5_SEMANTIC_REVIEW_PENDING
} from "../js/science-semantic-review.js";
import { G5_ITEM_REPAIRS } from "../js/science-semantic-item-repairs.js";
import { G5_TELL_REPAIRS } from "../js/science-tell-repairs.js";

const bank=BANKS["g5-science"]||[];
assert.equal(bank.length,88,"Grade 5 Science browser-effective bank size changed unexpectedly");
const byId=new Map(bank.map(item=>[item.id,item]));
assert.equal(byId.size,bank.length,"Grade 5 Science IDs must remain unique");

for(const [id,expectedStandard] of Object.entries(G5_STANDARD_CORRECTIONS)){
  const item=byId.get(id);
  assert(item,`${id}: semantic correction points to a missing source item`);
  assert.equal(item.standard,expectedStandard,`${id}: consolidated standard correction is missing from source`);
  assert.equal(item.semanticStandardReview,undefined,`${id}: standard correction should live directly in source without runtime provenance markers`);
  assert(ELEMENTARY_SCIENCE_EXPECTATIONS[expectedStandard],`${id}: corrected standard lacks a source-controlled expectation definition`);
}

for(const item of bank){
  assert(
    ELEMENTARY_SCIENCE_EXPECTATIONS[item.standard],
    `${item.id}: standard ${item.standard} is syntactically valid but absent from the source-controlled elementary expectation dictionary`
  );
}

assert.deepEqual(G5_SEMANTIC_REVIEW_PENDING,{},"Grade 5 semantic-review ledger must stay reconciled after source consolidation");

const formerOverlayIds=[...new Set([...Object.keys(G5_ITEM_REPAIRS),...Object.keys(G5_TELL_REPAIRS)])];
for(const id of formerOverlayIds){
  const item=byId.get(id);
  assert(item,`${id}: former overlay repair points to a missing source item`);
  const expected={...(G5_ITEM_REPAIRS[id]||{}),...(G5_TELL_REPAIRS[id]||{})};
  for(const [key,value] of Object.entries(expected)){
    assert.deepEqual(item[key],value,`${id}: consolidated source property ${key} no longer matches the final browser-effective overlay value`);
  }
  assert.equal(item.semanticPromptReview,undefined,`${id}: prompt repair should now live directly in source, not a runtime overlay`);
  assert.equal(item.answerTellReview,undefined,`${id}: tell repair should now live directly in source, not a runtime overlay`);
}

const forceMagnitudeIds=["g5s-010","g5s-div-a006","g5s-div-b005","g5s-cr-002"];
for(const id of forceMagnitudeIds)assert.equal(byId.get(id)?.standard,"4.PS.2.B.2",`${id}: force/mass effect item regressed to the motion-pattern expectation`);
const magnetDistanceIds=["g5s-cap-004","g5s-cap-005","g5s-cap-006"];
for(const id of magnetDistanceIds)assert.equal(byId.get(id)?.standard,"3.PS.2.B.1",`${id}: magnetic-distance investigation regressed to an unrelated expectation`);
const erosionIds=["g5s-005","g5s-017","g5s-018","g5s-025","g5s-026","g5s-div-a013","g5s-div-a014","g5s-div-a018","g5s-div-b013","g5s-div-b014","g5s-div-b015","g5s-cr-005"];
for(const id of erosionIds)assert.equal(byId.get(id)?.standard,"4.ESS.2.A.1",`${id}: erosion item regressed to the Grade 5 Earth-systems interaction expectation`);
const lightHeatingIds=["g5s-009","g5s-cap-001","g5s-cap-002","g5s-cap-003","g5s-div-a001","g5s-div-a002","g5s-div-a003","g5s-div-b006"];
for(const id of lightHeatingIds)assert.equal(byId.get(id)?.standard,"4.PS.3.B.1",`${id}: energy/temperature item regressed to the Grade 5 vision expectation`);

console.log(`PASS: Grade 5 Science is source-only; ${Object.keys(G5_STANDARD_CORRECTIONS).length} standard corrections and ${formerOverlayIds.length} former prompt/tell overlay repairs exactly match the consolidated source state.`);
