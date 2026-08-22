import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";

const expected=[
  "g3-ela","g3-math","g4-ela","g4-math","g5-ela","g5-math","g5-science",
  "g6-ela","g6-math","g7-ela","g7-math","g8-ela","g8-math","g8-science"
];
assert.deepEqual(Object.keys(BANKS).sort(),expected,"All 14 Grade-Level development banks must remain wired");
const total=Object.values(BANKS).reduce((sum,bank)=>sum+bank.length,0);
assert(total>=791,`Development bank floor regressed: ${total} < 791`);
console.log(`PASS: catalog floor holds ${total} items across all ${expected.length} Grade-Level banks.`);
