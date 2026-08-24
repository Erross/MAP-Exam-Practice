import assert from "node:assert/strict";
import { ASSESSMENTS } from "../js/config.js";
import { BANKS } from "../js/banks.js";
import { drawPracticeSession, seededRandom } from "../js/core/form-builder.js";
import { effectiveVariantFamily } from "../js/core/semantic-variants.js";

let draws=0;
for(const [assessmentId,assessment] of Object.entries(ASSESSMENTS)){
  const bank=BANKS[assessmentId];
  assert(Array.isArray(bank)&&bank.length>0,`${assessmentId}: bank missing`);
  for(const session of assessment.sessions){
    const eligible=bank.filter(item=>item.sessionEligibility.includes(session.id));
    if(!eligible.length)continue;
    for(let seed=1;seed<=500;seed++){
      const draw=drawPracticeSession(bank,session.id,{maxItems:12,rng:seededRandom(seed)});
      const families=draw.map(effectiveVariantFamily);
      assert.equal(new Set(families).size,families.length,`${assessmentId}/session-${session.id}/seed-${seed}: semantic variant siblings co-occurred`);
      draws++;
    }
  }
}

for(let seed=1;seed<=5000;seed++){
  const draw=drawPracticeSession(BANKS["g8-science"],1,{maxItems:12,rng:seededRandom(seed)});
  const ids=new Set(draw.map(item=>item.id));
  assert(!(ids.has("g8s-010")&&ids.has("g8s-div-a004")),`g8-science/session-1/seed-${seed}: mass-conservation template siblings co-occurred`);
}

console.log(`PASS: ${draws.toLocaleString()} assessment/session draws plus 5,000 Grade 8 Science stress draws contain no semantic variant siblings.`);
