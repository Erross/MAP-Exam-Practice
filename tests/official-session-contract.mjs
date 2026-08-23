import assert from "node:assert/strict";
import { ASSESSMENTS } from "../js/config.js";

// 2025-2026 current-primary DESE administration contract.
// This test intentionally covers session structure and calculator/omission behavior,
// not the still-pending primary-file verification of reporting-category ranges.

const elaSessionCounts={3:3,4:4,5:3,6:3,7:3,8:4};
for(const [grade,count] of Object.entries(elaSessionCounts)){
  const sessions=ASSESSMENTS[`g${grade}-ela`].sessions;
  assert.equal(sessions.length,count,`g${grade}-ela: current DESE session count changed`);
  assert(sessions.at(-1).deferred.includes("listening-audio"),`g${grade}-ela: final listening session must remain explicitly deferred`);
}
for(const grade of [4,8]){
  assert(ASSESSMENTS[`g${grade}-ela`].sessions[0].deferred.includes("human-scored-writing"),`g${grade}-ela: passage-based writing prompt must remain explicit in Session 1`);
}

for(const grade of [3,4,5,6,7,8]){
  const sessions=ASSESSMENTS[`g${grade}-math`].sessions;
  assert.equal(sessions.length,3,`g${grade}-math: current DESE assessment has three sessions`);
  assert.equal(sessions.filter(s=>s.performanceEvent===true).length,1,`g${grade}-math: expected exactly one Performance Event session`);
  assert.equal(sessions[2].performanceEvent,true,`g${grade}-math: Performance Event must remain Session 3`);
  assert(sessions[2].deferred.includes("human-scored-written-pe-parts"),`g${grade}-math: written PE omission must remain explicit`);
}
for(const grade of [3,4,5]){
  assert.equal(ASSESSMENTS[`g${grade}-math`].sessions.every(s=>s.calculatorPolicy==="none"&&!s.calculatorAllowed),true,`g${grade}-math: calculators are not allowed under the current administration policy`);
}
for(const grade of [6,7,8]){
  assert.equal(ASSESSMENTS[`g${grade}-math`].sessions.every(s=>s.calculatorPolicy==="available"&&s.calculatorAllowed),true,`g${grade}-math: calculators are allowed throughout all three current Math sessions`);
  assert.equal(ASSESSMENTS[`g${grade}-math`].sessions.every(s=>s.calculatorLabel==="Calculator available"),true);
}

for(const grade of [5,8]){
  const sessions=ASSESSMENTS[`g${grade}-science`].sessions;
  assert.equal(sessions.length,2,`g${grade}-science: current DESE assessment has two sessions`);
  assert.equal(sessions.every(s=>s.deferred.includes("human-scored-constructed-response")),true,`g${grade}-science: both sessions contain constructed-response work and must disclose the unsupported human-scored component`);
}
assert.equal(ASSESSMENTS["g5-science"].sessions.every(s=>s.calculatorPolicy==="available"&&s.calculatorLevel==="four-function"),true,"g5-science: current policy permits a four-function calculator");
assert.equal(ASSESSMENTS["g8-science"].sessions.every(s=>s.calculatorPolicy==="available"&&s.calculatorLevel==="scientific"),true,"g8-science: current policy permits a scientific calculator");

console.log("PASS: current DESE session counts, Math Performance Event placement, calculator policy, and explicit ELA/Science/manual-response omissions remain locked.");
