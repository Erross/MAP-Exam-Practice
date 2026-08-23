import assert from "node:assert/strict";
import { buildCleanRoomManifest } from "../scripts/clean-room-manifest.mjs";

const blind=buildCleanRoomManifest();
assert.equal(blind.includesAnswerKeys,false);
assert.equal(blind.totalItems,1780,"blind clean-room manifest must represent the complete browser-effective catalog");
assert.equal(blind.assessments.length,14);

const ids=[];
for(const assessment of blind.assessments){
  assert(assessment.itemCount>0,`${assessment.assessmentId}: blind manifest bank empty`);
  for(const item of assessment.items){
    ids.push(item.id);
    assert.equal(Object.hasOwn(item,"scoring"),false,`${item.id}: blind manifest leaked scoring`);
    assert.equal(Object.hasOwn(item,"rationale"),false,`${item.id}: blind manifest leaked rationale`);
    assert.equal(typeof item.prompt,"string",`${item.id}: blind manifest prompt missing`);
    assert.equal(typeof item.standard,"string",`${item.id}: blind manifest standard missing`);
  }
}
assert.equal(new Set(ids).size,ids.length,"blind clean-room manifest must retain globally unique IDs");

const keyed=buildCleanRoomManifest({includeAnswers:true,assessmentId:"g5-science"});
assert.equal(keyed.includesAnswerKeys,true);
assert.equal(keyed.assessments.length,1);
assert.equal(keyed.assessments[0].itemCount,88,"Grade 5 Science keyed manifest should include current 82 auto-scored + 6 manual CR items");
for(const item of keyed.assessments[0].items){
  assert(Object.hasOwn(item,"scoring"),`${item.id}: keyed manifest missing scoring`);
  assert(Object.hasOwn(item,"rationale"),`${item.id}: keyed manifest missing rationale`);
}
assert.throws(()=>buildCleanRoomManifest({assessmentId:"not-real"}),/Unknown assessment/);

console.log("PASS: clean-room manifest covers all 1,780 browser-effective items, stays blind by default, and exposes keys only in explicit reconciliation mode.");
