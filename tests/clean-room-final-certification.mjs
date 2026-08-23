import assert from "node:assert/strict";
import fs from "node:fs";
import { BANKS } from "../js/banks.js";
import { browserEffectiveFingerprint } from "../scripts/clean-room-manifest.mjs";

const evidence=JSON.parse(fs.readFileSync(new URL("../evidence/clean-room/final-certification.json",import.meta.url),"utf8"));
assert.equal(evidence.schemaVersion,1);
assert.equal(evidence.findingCount,0,"final clean-room certification must have zero findings");
assert.equal(evidence.assessments.length,14,"all 14 MAP Grade-Level assessments must have final clean-room evidence");
const expectedIds=Object.keys(BANKS).sort();
const certifiedIds=evidence.assessments.map(entry=>entry.assessmentId).sort();
assert.deepEqual(certifiedIds,expectedIds,"clean-room certification assessment set must exactly match browser-effective BANKS");
let total=0;
for(const entry of evidence.assessments){
  const bank=BANKS[entry.assessmentId];
  assert.ok(bank,`${entry.assessmentId}: certified assessment missing from BANKS`);
  assert.equal(entry.passed,true,`${entry.assessmentId}: certification is not marked passed`);
  assert.equal(entry.findingCount,0,`${entry.assessmentId}: certification retains findings`);
  assert.equal(entry.itemCount,bank.length,`${entry.assessmentId}: certified item count is stale`);
  assert.equal(entry.browserEffectiveFingerprint,browserEffectiveFingerprint(entry.assessmentId),`${entry.assessmentId}: browser-effective bank changed after clean-room certification; restart that assessment from item 1`);
  assert.match(entry.completedBlindReviewSha256,/^[a-f0-9]{64}$/,`${entry.assessmentId}: missing completed blind-review SHA-256 receipt`);
  assert.ok(Number.isInteger(entry.completedBlindReviewBytes)&&entry.completedBlindReviewBytes>0,`${entry.assessmentId}: missing completed blind-review byte count`);
  const manualCount=bank.filter(item=>item.scoring?.mode==="manual").length;
  assert.equal(entry.manualResponseCount,manualCount,`${entry.assessmentId}: manual-response count changed after certification`);
  total+=bank.length;
}
assert.equal(total,1780,"browser-effective item total changed after clean-room certification");
assert.equal(evidence.totalItems,total,"certification aggregate item count is stale");
assert.match(evidence.scienceCrEvidenceBoundary,/does not assert an authoritative fixed summative Science CR point quota/i,"Science CR evidence boundary must remain explicit");
console.log(`Final clean-room certification fingerprints match all ${evidence.assessments.length} assessments / ${total} browser-effective items.`);
