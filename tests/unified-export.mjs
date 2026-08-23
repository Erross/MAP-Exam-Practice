import assert from "node:assert/strict";
import crypto from "node:crypto";

import { buildUnifiedMapPackage, stableStringify } from "../scripts/export-unified.mjs";

const SOURCE_COMMIT="362534ad4da889859fbfd17fc94a63adce805456";
const GENERATED_AT="2026-08-23T21:55:00Z";
const build=()=>buildUnifiedMapPackage({generatedAt:GENERATED_AT,sourceCommit:SOURCE_COMMIT,manifest:[]});

testExportCompleteness();
testSessionAndManualScoringSemantics();
testFingerprint();
console.log("PASS: unified MAP export preserves all 14 released practice assessments and browser-effective item semantics.");

function testExportCompleteness(){
  const artifact=build();
  assert.equal(artifact.schemaVersion,"0.1");
  assert.equal(artifact.package.family,"map");
  assert.equal(artifact.package.sourceRepository,"Erross/MAP-Exam-Practice");
  assert.equal(artifact.package.sourceCommit,SOURCE_COMMIT);
  assert.equal(artifact.assessments.length,14);
  assert.equal(artifact.content.items.length,1780,"export must include the complete browser-effective V1 bank");

  const assessmentIds=new Set(artifact.assessments.map(a=>a.id));
  assert.equal(assessmentIds.size,14);
  for(const expected of ["g3-ela","g3-math","g4-ela","g4-math","g5-ela","g5-math","g5-science","g6-ela","g6-math","g7-ela","g7-math","g8-ela","g8-math","g8-science"]){
    assert(assessmentIds.has(expected),`missing assessment ${expected}`);
  }

  const itemIds=artifact.content.items.map(item=>item.id);
  assert.equal(new Set(itemIds).size,itemIds.length,"exported item IDs must be unique");
  const stimulusIds=artifact.content.stimuli.map(stimulus=>stimulus.id);
  assert.equal(new Set(stimulusIds).size,stimulusIds.length,"exported stimulus IDs must be unique");

  const allowed=new Set(artifact.assessments.flatMap(a=>a.sections.map(s=>`${a.id}:${s.id}`)));
  const stimuli=new Set(stimulusIds);
  for(const item of artifact.content.items){
    assert(item.sectionIds.length>0,`${item.id}: section eligibility required`);
    for(const sectionId of item.sectionIds) assert(allowed.has(`${item.assessmentId}:${sectionId}`),`${item.id}: invalid exported session ${sectionId}`);
    for(const stimulusId of item.stimulusRefs||[]) assert(stimuli.has(stimulusId),`${item.id}: missing stimulus ${stimulusId}`);
    assert(item.response?.kind,`${item.id}: response normalization missing`);
    assert(item.scoring?.mode,`${item.id}: scoring normalization missing`);
  }
}

function testSessionAndManualScoringSemantics(){
  const artifact=build();
  for(const assessment of artifact.assessments){
    assert.equal(assessment.status,"practice-released");
    assert.equal(assessment.fullSimulationAvailable,false,`${assessment.id}: V1 must not become a full-simulation claim through export`);
    assert.equal(assessment.scoringPolicy.kind,"raw-practice-points");
    assert.equal(assessment.scoringPolicy.excludeHumanJudgmentUntilScored,true);
    for(const section of assessment.sections){
      assert.equal(section.timing.mode,"guideline",`${assessment.id}/${section.id}: MAP timing must stay guideline-only`);
      assert.equal(section.timing.rangeMinutes.length,2);
    }
  }

  const g5=artifact.assessments.find(a=>a.id==="g5-science");
  const g8=artifact.assessments.find(a=>a.id==="g8-science");
  assert(g5&&g8);
  assert(g5.sections.every(s=>s.calculator.policy==="available"&&s.calculator.level==="four-function"));
  assert(g8.sections.every(s=>s.calculator.policy==="available"&&s.calculator.level==="scientific"));

  const manual=artifact.content.items.filter(item=>item.scoring.mode==="manual-rubric");
  assert.equal(manual.length,12,"Grade 5/8 Science should export twelve manual CR practice items");
  assert.equal(artifact.content.rubrics.length,12,"each manual CR should export one source rubric");
  const rubrics=new Map(artifact.content.rubrics.map(r=>[r.id,r]));
  for(const item of manual){
    assert.equal(item.itemType,"constructed_response");
    assert.equal(item.response.kind,"text");
    assert.equal(item.scoring.answer,undefined);
    assert.equal(item.scoring.answers,undefined);
    const rubric=rubrics.get(item.scoring.rubricRef);
    assert(rubric,`${item.id}: rubric missing`);
    assert.equal(rubric.maxPoints,item.points,`${item.id}: rubric max must match item points`);
    assert(rubric.criteria.length>0,`${item.id}: rubric criteria missing`);
  }

  const g5First=artifact.content.items.find(item=>item.id==="g5s-001");
  assert.deepEqual(g5First.sectionIds,["session-1","session-2"],"multi-session eligibility must survive normalization");
}

function testFingerprint(){
  const first=build();
  const second=buildUnifiedMapPackage({generatedAt:"2030-01-01T00:00:00Z",sourceCommit:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",manifest:[{path:"x",blobSha:"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",role:"test"}]});
  assert.equal(first.package.effectiveContentFingerprint,second.package.effectiveContentFingerprint,"content fingerprint must exclude generation/source metadata");
  const expected=crypto.createHash("sha256").update(stableStringify({assessments:first.assessments,content:first.content})).digest("hex");
  assert.equal(first.package.effectiveContentFingerprint,expected);
  assert.match(expected,/^[0-9a-f]{64}$/);
}
