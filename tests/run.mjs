import assert from "node:assert/strict";
import { PROGRAM, ASSESSMENTS, SUPPORTED_ITEM_TYPES } from "../js/config.js";
import { BANKS } from "../js/banks.js";
import { validateItem, scoreResponse } from "../js/core/item-types.js";
import { drawPracticeSession, seededRandom } from "../js/core/form-builder.js";

assert.equal(PROGRAM.family,"map"); assert.equal(PROGRAM.timingPolicy,"guideline");
assert.equal(Object.keys(ASSESSMENTS).length,14,"Expected 14 Grade-Level assessment configs");
for(const a of Object.values(ASSESSMENTS)){
  assert.equal(a.sessions.every(s=>s.timingPolicy==="guideline"),true);
  assert.equal(a.sessions.every(s=>Array.isArray(s.guidelineMinutes)&&s.guidelineMinutes.length===2&&s.guidelineMinutes.every(Number.isFinite)),true,`${a.id}: every session needs a numeric guideline range`);
  assert.equal(a.fullSimulationAvailable,false);
}
for(const g of [3,4,5]) assert.equal(ASSESSMENTS[`g${g}-math`].sessions.every(s=>s.calculatorAllowed===false),true);
for(const g of [6,7,8]) assert.equal(ASSESSMENTS[`g${g}-math`].sessions.every(s=>s.calculatorAllowed===true),true);
assert.deepEqual(ASSESSMENTS["g8-math"].sessions.map(s=>s.guidelineMinutes),[[30,50],[30,50],[30,40]]);
assert.deepEqual(ASSESSMENTS["g8-science"].sessions.map(s=>s.guidelineMinutes),[[55,75],[55,75]]);
assert.equal(ASSESSMENTS["g8-ela"].sessions[3].deferred.includes("listening-audio"),true);

const ids=new Set(); let count=0;
for(const [assessmentId,bank] of Object.entries(BANKS)){
  assert(bank.length>0,`${assessmentId} bank empty`);
  for(const item of bank){ count++; assert(!ids.has(item.id),`duplicate ${item.id}`); ids.add(item.id); const errs=validateItem(item); assert.deepEqual(errs,[],errs.join("\n")); assert(SUPPORTED_ITEM_TYPES.includes(item.itemType)); assert.equal(item.grade,8); assert.equal(item.provenance,"original-synthetic"); }
  for(let sessionId=1;sessionId<=ASSESSMENTS[assessmentId].sessions.length;sessionId++){
    const eligible=bank.filter(i=>i.sessionEligibility.includes(sessionId)); if(!eligible.length) continue;
    for(let seed=1;seed<=100;seed++){ const draw=drawPracticeSession(bank,sessionId,{maxItems:12,rng:seededRandom(seed)}); const variants=draw.map(i=>i.variantFamily||i.id); assert.equal(new Set(variants).size,variants.length); }
  }
}
assert(count>=40,"Expected at least 40 development items");
const sanity=BANKS["g8-math"].find(i=>i.id==="g8m-005"); assert.equal(scoreResponse(sanity,7).earned,1); assert.equal(scoreResponse(sanity,6).earned,0);
console.log(`PASS: ${count} development items; 14 assessment configs; core invariants green.`);
