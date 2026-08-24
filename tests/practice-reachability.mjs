import assert from 'node:assert/strict';
import { ASSESSMENTS, SUPPORTED_ITEM_TYPES } from '../js/config.js';
import { BANKS } from '../js/banks.js';
import { drawPracticeSession, seededRandom } from '../js/core/form-builder.js';

const typeCounts = new Map(SUPPORTED_ITEM_TYPES.map(type => [type, 0]));
for (const bank of Object.values(BANKS)) {
  for (const item of bank) typeCounts.set(item.itemType, (typeCounts.get(item.itemType) ?? 0) + 1);
}
for (const type of SUPPORTED_ITEM_TYPES) {
  assert((typeCounts.get(type) ?? 0) > 0, `${type}: supported response type has no browser-effective MAP item`);
}

let sessions = 0;
let eligiblePlacements = 0;
const missing = [];
for (const [assessmentId, assessment] of Object.entries(ASSESSMENTS)) {
  const bank = BANKS[assessmentId];
  for (const session of assessment.sessions) {
    const eligible = bank.filter(item => item.sessionEligibility.includes(session.id));
    if (!eligible.length) continue;
    sessions++;
    eligiblePlacements += eligible.length;
    const seen = new Set();
    for (let seed = 1; seed <= 1200; seed++) {
      for (const item of drawPracticeSession(bank, session.id, { maxItems: 12, rng: seededRandom(seed) })) seen.add(item.id);
      if (seen.size === eligible.length) break;
    }
    for (const item of eligible) {
      if (!seen.has(item.id)) missing.push(`${assessmentId}/session-${session.id}/${item.id}`);
    }
  }
}

assert.deepEqual(missing, [], `browser-effective items unreachable in their declared session(s): ${missing.join(', ')}`);
const typeSummary = [...typeCounts.entries()].map(([type, count]) => `${type}:${count}`).join(', ');
console.log(`PASS: all ${SUPPORTED_ITEM_TYPES.length} supported response types occur in the MAP corpus and all ${eligiblePlacements.toLocaleString()} declared item/session placements across ${sessions} populated sessions are reachable within the deterministic 1,200-seed audit. ${typeSummary}`);
