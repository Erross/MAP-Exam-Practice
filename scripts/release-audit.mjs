import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import { ASSESSMENTS } from "../js/config.js";
import { drawPracticeSession, seededRandom } from "../js/core/form-builder.js";

let draws=0;
for(const [id,bank] of Object.entries(BANKS)){
  const assessment=ASSESSMENTS[id];
  for(const session of assessment.sessions){
    const eligible=bank.filter(i=>i.sessionEligibility.includes(session.id)); if(!eligible.length) continue;
    for(let seed=1;seed<=5000;seed++){
      const form=drawPracticeSession(bank,session.id,{maxItems:Math.min(12,eligible.length),rng:seededRandom(seed)});
      assert(form.length>0); assert(form.every(i=>i.sessionEligibility.includes(session.id)));
      const ids=form.map(i=>i.id); assert.equal(new Set(ids).size,ids.length);
      const variants=form.map(i=>i.variantFamily||i.id); assert.equal(new Set(variants).size,variants.length);
      draws++;
    }
  }
}
console.log(`PASS: ${draws.toLocaleString()} development practice-session draws. NOTE: banks are not release-scale; this is an infrastructure audit, not release evidence.`);
