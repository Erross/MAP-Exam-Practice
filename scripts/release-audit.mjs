import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import { ASSESSMENTS } from "../js/config.js";
import { BLUEPRINTS,drawBlueprintForm,validateBlueprintForm,validateBlueprintSpec } from "../js/blueprints.js";
import { drawPracticeSession, seededRandom } from "../js/core/form-builder.js";

const wordCount=value=>String(value??"").trim().split(/\s+/).filter(Boolean).length;
const pct=(n,d)=>d?100*n/d:0;
const round=n=>Math.round(n*10)/10;

function selectedResponseMetrics(bank){
  const mc=bank.filter(i=>i.itemType==="multiple_choice"&&Array.isArray(i.options)&&i.options.length===4);
  const positions=[0,0,0,0]; let uniqueLongestCorrect=0, correctWords=0, distractorWords=0, distractorCount=0;
  for(const item of mc){
    const keyIndex=item.options.indexOf(item.scoring.answer); assert(keyIndex>=0,`${item.id}: keyed answer not among choices`); positions[keyIndex]++;
    const lengths=item.options.map(wordCount), max=Math.max(...lengths); if(lengths[keyIndex]===max&&lengths.filter(n=>n===max).length===1) uniqueLongestCorrect++;
    correctWords+=lengths[keyIndex]; item.options.forEach((o,i)=>{if(i!==keyIndex){distractorWords+=lengths[i];distractorCount++;}});
  }
  return {count:mc.length,keyPositionPct:positions.map(n=>round(pct(n,mc.length))),uniqueLongestCorrectPct:round(pct(uniqueLongestCorrect,mc.length)),meanCorrectWords:mc.length?round(correctWords/mc.length):0,meanDistractorWords:distractorCount?round(distractorWords/distractorCount):0};
}

function meanRetakeOverlap(bank,sessionId,trials=5000){
  const eligible=bank.filter(i=>i.sessionEligibility.includes(sessionId)); const size=Math.min(12,eligible.length); if(!size)return null;
  let total=0;
  for(let t=1;t<=trials;t++){
    const a=drawPracticeSession(bank,sessionId,{maxItems:size,rng:seededRandom(t*2-1)}), b=drawPracticeSession(bank,sessionId,{maxItems:size,rng:seededRandom(t*2)}), bIds=new Set(b.map(i=>i.id));
    total+=a.filter(i=>bIds.has(i.id)).length/size;
  }
  return round(100*total/trials);
}

function meanBlueprintRetakeOverlap(bank,blueprint,trials=5000){
  let total=0;
  for(let t=1;t<=trials;t++){
    const a=drawBlueprintForm(bank,blueprint,{rng:seededRandom(t*2-1)}),b=drawBlueprintForm(bank,blueprint,{rng:seededRandom(t*2)}),bIds=new Set(b.map(i=>i.id));
    total+=a.filter(i=>bIds.has(i.id)).length/a.length;
  }
  return round(100*total/trials);
}

let draws=0;
for(const [id,bank] of Object.entries(BANKS)){
  const assessment=ASSESSMENTS[id]; assert(assessment,`${id}: bank has no assessment config`);
  const blueprint=BLUEPRINTS[assessment.blueprintId]; assert(blueprint,`${id}: blueprint record missing`);
  assert.equal(blueprint.officialPointTarget,assessment.points,`${id}: config/blueprint official point target mismatch`);
  const validSessions=new Set(assessment.sessions.map(s=>s.id));
  for(const item of bank){
    assert(item.sessionEligibility.every(s=>validSessions.has(s)),`${item.id}: invalid session eligibility`);
    if(item.itemType==="multiple_choice") assert(item.options.includes(item.scoring.answer),`${item.id}: MC key not in choices`);
    if(item.itemType==="multi_select") assert(item.scoring.answers.every(a=>item.options.includes(a)),`${item.id}: multi-select key not in choices`);
    if(assessment.status==="released"&&assessment.subject==="math"&&assessment.grade>=6){
      assert(["none","four-function","scientific"].includes(item.calculatorLevel),`${item.id}: released Grade ${assessment.grade} Math item needs verified calculatorLevel`);
    }
  }
  for(const session of assessment.sessions){
    const eligible=bank.filter(i=>i.sessionEligibility.includes(session.id)); if(!eligible.length) continue;
    for(let seed=1;seed<=5000;seed++){
      const form=drawPracticeSession(bank,session.id,{maxItems:Math.min(12,eligible.length),rng:seededRandom(seed)});
      assert(form.length>0); assert(form.every(i=>i.sessionEligibility.includes(session.id)));
      const ids=form.map(i=>i.id); assert.equal(new Set(ids).size,ids.length);
      const variants=form.map(i=>i.variantFamily||i.id); assert.equal(new Set(variants).size,variants.length);
      draws++;
    }
    const overlap=meanRetakeOverlap(bank,session.id);
    console.log(`${id} session ${session.id}: ${eligible.length} eligible items; mean development-session retake overlap ${overlap}%`);
  }
  const metrics=selectedResponseMetrics(bank); console.log(`${id} selected-response metrics: ${JSON.stringify(metrics)}`);

  if(assessment.status==="released"){
    assert.equal(blueprint.verified,true,`${id}: release requires independently verified current DESE blueprint`);
    assert.deepEqual(validateBlueprintSpec(blueprint),[],`${id}: invalid release blueprint`);
    for(let seed=1;seed<=5000;seed++){
      const form=drawBlueprintForm(bank,blueprint,{rng:seededRandom(seed)});
      assert.deepEqual(validateBlueprintForm(form,blueprint),[],`${id}: blueprint form invalid`);
    }
    const overlap=meanBlueprintRetakeOverlap(bank,blueprint);
    console.log(`${id} blueprint-form mean retake overlap ${overlap}%`);
    assert(overlap<=40,`${id}: release blueprint-form overlap ${overlap}% > 40%`);
    if(metrics.count>=20){
      assert(metrics.uniqueLongestCorrectPct<=25,`${id}: unique-longest-correct tell exceeds 25%`);
      metrics.keyPositionPct.forEach((v,i)=>assert(v>=15&&v<=35,`${id}: answer position ${i+1} at ${v}% outside 15-35%`));
    }
  }
}
console.log(`PASS: ${draws.toLocaleString()} development practice-session draws plus retake/tell analysis. Any released bank additionally requires 5,000 verified-blueprint full-form draws and blueprint-form retake diversity.`);
