import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";

for(const assessmentId of ["g5-science","g8-science"]){
  const bank=BANKS[assessmentId]||[];
  const manual=bank.filter(item=>item.itemType==="constructed_response");
  assert(manual.length>=6,`${assessmentId}: keep at least six synthetic constructed-response practice items`);

  for(const sessionId of [1,2]){
    const sessionManual=manual.filter(item=>item.sessionEligibility.includes(sessionId));
    assert(sessionManual.length>=3,`${assessmentId} session ${sessionId}: keep at least three manual-response practice items`);
  }

  const strands=new Map();
  for(const item of manual){
    strands.set(item.strand,(strands.get(item.strand)||0)+1);
    assert.equal(item.scoring?.mode,"manual",`${item.id}: CR scoring must remain manual`);
    assert.equal(Number(item.scoring?.rubric?.maxPoints),Number(item.points),`${item.id}: rubric maximum must match item points`);
    assert(Array.isArray(item.scoring?.rubric?.criteria)&&item.scoring.rubric.criteria.length>0,`${item.id}: CR rubric criteria required`);
    assert.equal(item.scoring?.answer,undefined,`${item.id}: manual CR must not have an automatic answer key`);
    assert.equal(item.scoring?.answers,undefined,`${item.id}: manual CR must not have automatic answer keys`);
  }
  for(const strand of ["Physical Science","Life Science","Earth & Space Science"]){
    assert((strands.get(strand)||0)>=2,`${assessmentId}: keep at least two manual-response items in ${strand}`);
  }
}

console.log("PASS: Grade 5 and Grade 8 Science retain manual-scored constructed-response practice in both sessions and across all three science strands.");
