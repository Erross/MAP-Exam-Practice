import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";

const exactElementaryScience=/^[3-5]\.(?:PS|LS|ESS)\.\d+\.[A-Z]\.\d+$/;
const exactMiddleSchoolScience=/^6-8\.(?:PS|LS|ESS)\d+\.[A-Z]\.\d+$/;

for(const [assessmentId,pattern] of [["g5-science",exactElementaryScience],["g8-science",exactMiddleSchoolScience]]){
  const bank=BANKS[assessmentId]||[];
  assert(bank.length>0,`${assessmentId} bank must remain wired`);
  for(const item of bank){
    assert(
      pattern.test(String(item.standard||"")),
      `${assessmentId} ${item.id}: standard ${item.standard||"(missing)"} must be an exact Missouri expectation, not a broad domain code`
    );
  }
  console.log(`PASS: all ${bank.length} ${assessmentId} items use exact Missouri expectation codes.`);
}
