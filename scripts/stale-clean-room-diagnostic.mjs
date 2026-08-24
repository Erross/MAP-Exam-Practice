import fs from "node:fs";
import { BANKS } from "../js/banks.js";
import { browserEffectiveFingerprint } from "./clean-room-manifest.mjs";

const evidence=JSON.parse(fs.readFileSync(new URL("../evidence/clean-room/final-certification.json",import.meta.url),"utf8"));
const prior=new Map(evidence.assessments.map(entry=>[entry.assessmentId,entry.browserEffectiveFingerprint]));
const stale=[];
for(const assessmentId of Object.keys(BANKS).sort()){
  const current=browserEffectiveFingerprint(assessmentId);
  const expected=prior.get(assessmentId)||null;
  if(current!==expected)stale.push({assessmentId,expected,current,itemCount:BANKS[assessmentId].length});
}
console.log(`STALE_CLEAN_ROOM:${JSON.stringify(stale)}`);
