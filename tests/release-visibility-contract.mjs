import assert from "node:assert/strict";
import fs from "node:fs";
import { ASSESSMENTS } from "../js/config.js";
import { BLUEPRINTS } from "../js/blueprints.js";

const assessments=Object.values(ASSESSMENTS);
assert.equal(assessments.length,14,"Release catalog must contain all 14 Grade-Level assessments");
for(const assessment of assessments){
  assert.equal(assessment.status,"released",`${assessment.id}: certified short practice must be production-visible`);
  assert.equal(assessment.practiceMode,"certified-short-practice",`${assessment.id}: release mode must distinguish short practice from an operational form`);
  assert.equal(assessment.fullSimulationAvailable,false,`${assessment.id}: release must not claim full operational simulation`);
  const blueprint=BLUEPRINTS[assessment.id];
  assert.ok(blueprint,`${assessment.id}: missing blueprint`);
  assert.equal(blueprint.executable,false,`${assessment.id}: short-practice release must not silently enable full-form execution`);
  assert.equal(blueprint.verified,false,`${assessment.id}: current blueprint model intentionally couples verified with executable full-form support`);
}

const app=fs.readFileSync(new URL("../js/app.js",import.meta.url),"utf8");
assert.match(app,/Practice ready/,"Home catalog must label released short practice clearly");
assert.match(app,/Practice scope:/,"Preflight must use permanent release-scope wording");
assert.doesNotMatch(app,/Development scope:/,"Released UI must not describe normal practice as development scope");
assert.match(app,/draws up to 12 supported items/,"Preflight must disclose short practice-set size");
assert.match(app,/not a full operational MAP session/,"Preflight must distinguish practice from a full operational session");
assert.match(app,/not a MAP scale score or official proficiency classification/,"Results must remain explicitly unofficial");

const about=fs.readFileSync(new URL("../about.html",import.meta.url),"utf8");
assert.match(about,/not the same as taking a complete operational MAP form/,"About page must preserve the full-form limitation");
assert.match(about,/Current release limitations/,"About page must describe omissions as release scope, not unfinished development status");

console.log("PASS: all 14 certified short-practice assessments are production-visible without claiming full MAP-form executability.");
