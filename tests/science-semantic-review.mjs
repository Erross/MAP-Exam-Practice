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

const consolidatedPromptRepairIds=[
  "g5s-003","g5s-004","g5s-008","g5s-011","g5s-015","g5s-016","g5s-027","g5s-028","g5s-033","g5s-034","g5s-035","g5s-036",
  "g5s-div-a005","g5s-div-a007","g5s-div-a008","g5s-div-a009",
  "g5s-div-b004","g5s-div-b007","g5s-div-b008","g5s-div-b009","g5s-div-b010","g5s-div-b011","g5s-div-b012",
  "g5s-cap-007","g5s-cap-008","g5s-cap-009","g5s-cap-010","g5s-cr-003","g5s-cr-004"
];
const consolidatedTellRepairIds=[
  "g5s-003","g5s-004","g5s-011","g5s-015","g5s-016","g5s-033","g5s-034","g5s-cap-010",
  "g5s-div-a007","g5s-div-a009","g5s-div-b004","g5s-div-b007","g5s-div-b009","g5s-div-b011","g5s-div-b012"
];
for(const id of consolidatedPromptRepairIds){
  const item=byId.get(id);
  assert(item,`${id}: consolidated prompt repair item is missing`);
  assert.equal(item.semanticPromptReview,undefined,`${id}: prompt repair must live directly in source, not a runtime overlay`);
}
for(const id of consolidatedTellRepairIds){
  const item=byId.get(id);
  assert(item,`${id}: consolidated tell repair item is missing`);
  assert.equal(item.answerTellReview,undefined,`${id}: tell repair must live directly in source, not a runtime overlay`);
}

const evidence=id=>{
  const item=byId.get(id)||{};
  return [item.stimulus?.text,item.prompt,...(item.options||[]),item.rationale].filter(Boolean).join(" ");
};
const plantMaterialIds=["g5s-003","g5s-004","g5s-033","g5s-034","g5s-035","g5s-036","g5s-div-a007","g5s-div-a008","g5s-div-a009","g5s-div-b009","g5s-div-b011","g5s-cap-010","g5s-cr-004"];
for(const id of plantMaterialIds){
  assert.match(evidence(id),/(plant|seedling)/i,`${id}: plant-material repair lost its organism context`);
  assert.match(evidence(id),/(soil|air|water)/i,`${id}: plant-material repair lost source-of-matter evidence`);
  assert.match(evidence(id),/(mass|gram|\bg\b)/i,`${id}: plant-material repair lost quantitative mass evidence`);
}
const matterCycleIds=["g5s-011","g5s-015","g5s-016","g5s-023","g5s-024","g5s-div-a010","g5s-div-a011","g5s-div-a012","g5s-div-b007","g5s-div-b008","g5s-div-b010","g5s-div-b012","g5s-cap-007","g5s-cap-008","g5s-cap-009","g5s-cr-003"];
for(const id of matterCycleIds){
  assert.match(evidence(id),/(matter|tracer|decomposer|producer|consumer|algae|grass)/i,`${id}: ecosystem-matter repair lost matter-flow evidence`);
}
const postConsolidationMatterRepairIds=["g5s-023","g5s-024","g5s-div-a010","g5s-div-a011","g5s-div-a012"];
for(const id of postConsolidationMatterRepairIds){
  assert.equal(byId.get(id)?.standard,"5.LS.2.B.1",`${id}: repaired ecosystem item left the Grade 5 matter-movement expectation`);
  assert.match(evidence(id),/matter/i,`${id}: repaired ecosystem item regressed to food/population wording without explicit matter`);
  assert.match(evidence(id),/(environment|decomposer)/i,`${id}: repaired ecosystem item must connect organisms to environmental/decomposer matter pathways`);
}
const newSubstanceIds=["g5s-008","g5s-div-a005","g5s-div-b004"];
for(const id of newSubstanceIds){
  assert.match(evidence(id),/(mix|substance|solid|gas|bubble)/i,`${id}: new-substance repair lost before/after interaction evidence`);
}
for(const id of ["g5s-027","g5s-028"]){
  assert.match(evidence(id),/(pattern|position|second)/i,`${id}: motion-pattern repair lost repeated-measurement evidence`);
}

const forceMagnitudeIds=["g5s-010","g5s-div-a006","g5s-div-b005","g5s-cr-002"];
for(const id of forceMagnitudeIds)assert.equal(byId.get(id)?.standard,"4.PS.2.B.2",`${id}: force/mass effect item regressed to the motion-pattern expectation`);
assert.match(evidence("g5s-div-b005"),/(force|push)/i,"g5s-div-b005 must retain applied-force evidence");
assert.match(evidence("g5s-div-b005"),/(mass|lighter|heavier)/i,"g5s-div-b005 must explicitly assess the mass dimension of 4.PS.2.B.2");
const magnetDistanceIds=["g5s-cap-004","g5s-cap-005","g5s-cap-006"];
for(const id of magnetDistanceIds)assert.equal(byId.get(id)?.standard,"3.PS.2.B.1",`${id}: magnetic-distance investigation regressed to an unrelated expectation`);
const erosionIds=["g5s-005","g5s-017","g5s-018","g5s-025","g5s-026","g5s-div-a013","g5s-div-a014","g5s-div-a018","g5s-div-b013","g5s-div-b014","g5s-div-b015","g5s-cr-005"];
for(const id of erosionIds)assert.equal(byId.get(id)?.standard,"4.ESS.2.A.1",`${id}: erosion item regressed to the Grade 5 Earth-systems interaction expectation`);
const lightHeatingIds=["g5s-009","g5s-cap-001","g5s-cap-002","g5s-cap-003","g5s-div-a001","g5s-div-a002","g5s-div-a003","g5s-div-b006"];
for(const id of lightHeatingIds)assert.equal(byId.get(id)?.standard,"4.PS.3.B.1",`${id}: energy/temperature item regressed to the Grade 5 vision expectation`);

console.log(`PASS: Grade 5 Science source bank retains ${Object.keys(G5_STANDARD_CORRECTIONS).length} consolidated standard corrections, ${consolidatedPromptRepairIds.length} consolidated semantic prompt repairs, ${consolidatedTellRepairIds.length} answer-tell balances, and ${postConsolidationMatterRepairIds.length} post-consolidation matter-alignment repairs with source-defined expectation coverage.`);
