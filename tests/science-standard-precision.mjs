import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";

const exactMiddleSchoolScience=/^6-8\.(?:PS|LS|ESS)\d+\.[A-Z]\.\d+$/;
const bank=BANKS["g8-science"]||[];
assert(bank.length>0,"g8-science bank must remain wired");
for(const item of bank){
  assert(
    exactMiddleSchoolScience.test(String(item.standard||"")),
    `g8-science ${item.id}: standard ${item.standard||"(missing)"} must be an exact Missouri expectation such as 6-8.PS2.A.2, not a broad domain code`
  );
}
console.log(`PASS: all ${bank.length} Grade 8 Science items use exact Missouri expectation codes.`);
