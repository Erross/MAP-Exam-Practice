import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";
import { ASSESSMENTS } from "../js/config.js";
import { BLUEPRINTS } from "../js/blueprints.js";
import { deliveryBundles,deliveryGroupKey,seededRandom } from "../js/core/form-builder.js";

const points=items=>items.reduce((sum,item)=>sum+Number(item.points||0),0);
const shuffled=(values,rng)=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const standardDomain=item=>String(item.standard||"").split(".")[1]||null;
const itemCode=(item,grade)=>{
  if(item.strand==="Performance Event"||item.blueprintComponent==="PE")return "PE";
  const domain=standardDomain(item);
  if(grade===3&&["GM","DS"].includes(domain))return "GM+DS";
  if(grade===6&&["GM","DSP"].includes(domain))return "GM+DSP";
  return domain;
};
const exactOverlap=(a,b)=>{if(!a.length)return 0;const ids=new Set(b.map(i=>i.id));return a.filter(i=>ids.has(i.id)).length/a.length;};
const pointOverlap=(a,b)=>{const denominator=points(a);if(!denominator)return 0;const ids=new Set(b.map(i=>i.id));return points(a.filter(i=>ids.has(i.id)))/denominator;};
const stimulusOverlap=(a,b)=>{
  const keys=a.map(deliveryGroupKey).filter(Boolean),unique=[...new Set(keys)];
  if(!unique.length)return null;
  const other=new Set(b.map(deliveryGroupKey).filter(Boolean));
  return unique.filter(k=>other.has(k)).length/unique.length;
};
const round=n=>Math.round(n*10)/10;

function bundleVariants(bundle){return bundle.map(item=>item.variantFamily||item.id);}
function categoryItems(items,grade,code){return items.filter(item=>itemCode(item,grade)===code);}
function categoryPoints(items,grade,code){return points(categoryItems(items,grade,code));}
function canAdd(selected,bundle,grade,target,rules,usedIds,usedVariants){
  if(points(selected)+points(bundle)>target)return false;
  const ids=bundle.map(i=>i.id),variants=bundleVariants(bundle);
  if(new Set(ids).size!==ids.length||new Set(variants).size!==variants.length)return false;
  if(ids.some(id=>usedIds.has(id))||variants.some(v=>usedVariants.has(v)))return false;
  const next=[...selected,...bundle];
  return rules.every(rule=>categoryPoints(next,grade,rule.code)<=rule.maxPoints);
}
function addBundle(selected,bundle,usedIds,usedVariants){
  selected.push(...bundle);
  bundle.forEach(item=>usedIds.add(item.id));
  bundleVariants(bundle).forEach(v=>usedVariants.add(v));
}

function drawDevelopmentMathForm(assessmentId,{rng,maxAttempts=3000}={}){
  const assessment=ASSESSMENTS[assessmentId],blueprint=BLUEPRINTS[assessmentId],bank=BANKS[assessmentId];
  assert(assessment?.subject==="math",`${assessmentId}: Math assessment required`);
  assert.equal(blueprint.verified,false,`${assessmentId}: this development harness must not be used on a release-verified blueprint`);
  assert.equal(blueprint.executable,false,`${assessmentId}: this development harness must not mutate production executability`);
  const peRule=blueprint.officialConstraints.find(rule=>rule.component==="performance-event");
  assert(peRule,`${assessmentId}: missing PE rule`);
  const ordinaryRules=blueprint.officialConstraints.filter(rule=>rule.component!=="performance-event");
  const target=blueprint.officialPointTarget-peRule.minPoints;
  const ordinary=bank.filter(item=>itemCode(item,assessment.grade)!=="PE");
  const bundles=deliveryBundles(ordinary);
  const operationalPeBundles=deliveryBundles(bank.filter(item=>item.operationalEvent===true&&item.blueprintComponent==="PE"))
    .filter(bundle=>points(bundle)===peRule.minPoints&&bundle.every(item=>item.sessionEligibility.length===1&&item.sessionEligibility[0]===3));
  assert(operationalPeBundles.length>=3,`${assessmentId}: insufficient operational PE bundles`);

  for(let attempt=0;attempt<maxAttempts;attempt++){
    const selected=[],usedIds=new Set(),usedVariants=new Set();
    let failed=false;
    for(const rule of shuffled(ordinaryRules,rng)){
      const candidates=shuffled(bundles.filter(bundle=>bundle.some(item=>itemCode(item,assessment.grade)===rule.code)),rng);
      for(const raw of candidates){
        if(categoryPoints(selected,assessment.grade,rule.code)>=rule.minPoints)break;
        const bundle=shuffled(raw,rng);
        if(canAdd(selected,bundle,assessment.grade,target,ordinaryRules,usedIds,usedVariants))addBundle(selected,bundle,usedIds,usedVariants);
      }
      if(categoryPoints(selected,assessment.grade,rule.code)<rule.minPoints){failed=true;break;}
    }
    if(failed)continue;

    for(const raw of shuffled(bundles,rng)){
      if(points(selected)===target)break;
      const bundle=shuffled(raw,rng);
      if(canAdd(selected,bundle,assessment.grade,target,ordinaryRules,usedIds,usedVariants))addBundle(selected,bundle,usedIds,usedVariants);
    }
    if(points(selected)!==target)continue;
    if(ordinaryRules.some(rule=>categoryPoints(selected,assessment.grade,rule.code)<rule.minPoints))continue;

    const pe=shuffled(operationalPeBundles,rng)[0];
    const form=[...selected,...shuffled(pe,rng)];
    if(points(form)!==blueprint.officialPointTarget)continue;
    return form;
  }
  throw new Error(`${assessmentId}: unable to construct a development full Math form from transcribed ranges after ${maxAttempts} attempts`);
}

function validateDevelopmentMathForm(assessmentId,form){
  const assessment=ASSESSMENTS[assessmentId],blueprint=BLUEPRINTS[assessmentId];
  const errors=[];
  if(points(form)!==blueprint.officialPointTarget)errors.push(`total ${points(form)} != ${blueprint.officialPointTarget}`);
  const ids=form.map(i=>i.id),variants=form.map(i=>i.variantFamily||i.id);
  if(new Set(ids).size!==ids.length)errors.push("duplicate id");
  if(new Set(variants).size!==variants.length)errors.push("variant collision");
  const peItems=form.filter(item=>itemCode(item,assessment.grade)==="PE");
  const peRule=blueprint.officialConstraints.find(rule=>rule.component==="performance-event");
  if(points(peItems)!==peRule.minPoints)errors.push(`PE ${points(peItems)} != ${peRule.minPoints}`);
  if(new Set(peItems.map(deliveryGroupKey)).size!==1)errors.push("form must contain exactly one PE delivery group");
  if(peItems.some(item=>item.operationalEvent!==true))errors.push("form PE must be operational-size");
  for(const rule of blueprint.officialConstraints.filter(r=>r.component!=="performance-event")){
    const p=categoryPoints(form.filter(item=>itemCode(item,assessment.grade)!=="PE"),assessment.grade,rule.code);
    if(p<rule.minPoints||p>rule.maxPoints)errors.push(`${rule.code} ${p} outside ${rule.minPoints}-${rule.maxPoints}`);
  }
  return errors;
}

for(const grade of [3,4,5,6,7,8]){
  const assessmentId=`g${grade}-math`,blueprint=BLUEPRINTS[assessmentId],bank=BANKS[assessmentId];
  const ordinaryRules=blueprint.officialConstraints.filter(rule=>rule.component!=="performance-event");
  const ordinary=bank.filter(item=>itemCode(item,grade)!=="PE");
  const forms=[];
  for(let seed=1;seed<=5000;seed++){
    const form=drawDevelopmentMathForm(assessmentId,{rng:seededRandom(seed)});
    assert.deepEqual(validateDevelopmentMathForm(assessmentId,form),[],`${assessmentId}: invalid development form at seed ${seed}`);
    forms.push(form);
  }
  let itemTotal=0,pointTotal=0,stimulusTotal=0,stimulusTrials=0;
  const categoryReuse=Object.fromEntries(ordinaryRules.map(rule=>[rule.code,{pointOverlapTotal:0,itemOverlapTotal:0}]));
  for(let pair=1;pair<=5000;pair++){
    const a=drawDevelopmentMathForm(assessmentId,{rng:seededRandom(pair*2+100000)});
    const b=drawDevelopmentMathForm(assessmentId,{rng:seededRandom(pair*2+100001)});
    itemTotal+=exactOverlap(a,b);
    pointTotal+=pointOverlap(a,b);
    const so=stimulusOverlap(a,b);if(so!==null){stimulusTotal+=so;stimulusTrials++;}
    for(const rule of ordinaryRules){
      const aCat=categoryItems(a,grade,rule.code),bCat=categoryItems(b,grade,rule.code);
      categoryReuse[rule.code].pointOverlapTotal+=pointOverlap(aCat,bCat);
      categoryReuse[rule.code].itemOverlapTotal+=exactOverlap(aCat,bCat);
    }
  }
  const meanItems=forms.reduce((sum,form)=>sum+form.length,0)/forms.length;
  const meanItemOverlap=itemTotal/5000,meanPointOverlap=pointTotal/5000;
  const itemPct=round(100*meanItemOverlap),pointPct=round(100*meanPointOverlap),stimulusPct=stimulusTrials?round(100*stimulusTotal/stimulusTrials):null;
  console.log(`${assessmentId}: 5,000 transcribed-range development full forms constructed; mean ${round(meanItems)} items; full-form retake overlap ${itemPct}% by item / ${pointPct}% by points${stimulusPct===null?"":`; stimulus/set overlap ${stimulusPct}%`}. NOT release verification.`);
  const categorySummary=ordinaryRules.map(rule=>{
    const pool=categoryPoints(ordinary,grade,rule.code);
    const meanDraw=forms.reduce((sum,form)=>sum+categoryPoints(form,grade,rule.code),0)/forms.length;
    const pointReuse=round(100*categoryReuse[rule.code].pointOverlapTotal/5000);
    const itemReuse=round(100*categoryReuse[rule.code].itemOverlapTotal/5000);
    return `${rule.code}: pool ${pool}p, mean draw ${round(meanDraw)}p, retake ${itemReuse}% items/${pointReuse}% points`;
  });
  console.log(`${assessmentId} category reuse: ${categorySummary.join(" | ")}`);
  assert(meanItemOverlap<=0.40,`${assessmentId}: full-form item retake overlap ${itemPct}% exceeds 40% development gate`);
  assert(meanPointOverlap<=0.40,`${assessmentId}: full-form point retake overlap ${pointPct}% exceeds 40% development gate`);
}
console.log("PASS: all six Math banks can repeatedly construct full-point development forms under the transcribed blueprint ranges, preserve exactly one complete operational PE, and hold <=40% full-form retake overlap by both item and points. These results are diagnostic only until current-primary DESE ranges are independently confirmed.");
