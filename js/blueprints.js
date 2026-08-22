const freeze=o=>Object.freeze(o);

const pointTargets={
  "g3-ela":56,"g4-ela":56,"g5-ela":56,"g6-ela":56,"g7-ela":52,"g8-ela":56,
  "g3-math":48,"g4-math":48,"g5-math":48,"g6-math":54,"g7-math":54,"g8-math":54,
  "g5-science":60,"g8-science":60
};

export const BLUEPRINTS=freeze(Object.fromEntries(Object.entries(pointTargets).map(([assessmentId,officialPointTarget])=>[
  assessmentId,
  freeze({
    id:assessmentId,
    assessmentId,
    officialPointTarget,
    verified:false,
    verificationStatus:"current-DESE-range-transcription-pending",
    sourceRecord:"OFFICIAL_MAP_SOURCES.md",
    supportedPointTarget:null,
    constraints:freeze([])
  })
])));

const points=items=>items.reduce((sum,item)=>sum+Number(item.points||0),0);
const shuffled=(values,rng=Math.random)=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

function matchesRule(item,rule){
  if(rule.sessionId!==undefined&&!item.sessionEligibility?.includes(rule.sessionId))return false;
  if(rule.field){
    const value=item[rule.field];
    if(rule.value!==undefined&&value!==rule.value)return false;
    if(Array.isArray(rule.values)&&!rule.values.includes(value))return false;
  }
  if(Array.isArray(rule.itemTypes)&&!rule.itemTypes.includes(item.itemType))return false;
  return true;
}

export function validateBlueprintSpec(blueprint){
  const errors=[];
  if(!blueprint||typeof blueprint!=="object")return ["blueprint missing"];
  if(typeof blueprint.assessmentId!=="string")errors.push("assessmentId required");
  if(!Number.isFinite(blueprint.officialPointTarget)||blueprint.officialPointTarget<=0)errors.push("officialPointTarget must be positive");
  if(blueprint.verified){
    if(!Number.isFinite(blueprint.supportedPointTarget)||blueprint.supportedPointTarget<=0)errors.push("verified blueprint requires supportedPointTarget");
    if(!Array.isArray(blueprint.constraints)||!blueprint.constraints.length)errors.push("verified blueprint requires constraints");
  }
  for(const [index,rule] of (blueprint.constraints||[]).entries()){
    if(rule.minPoints!==undefined&&(!Number.isFinite(rule.minPoints)||rule.minPoints<0))errors.push(`constraint ${index}: invalid minPoints`);
    if(rule.maxPoints!==undefined&&(!Number.isFinite(rule.maxPoints)||rule.maxPoints<0))errors.push(`constraint ${index}: invalid maxPoints`);
    if(rule.minItems!==undefined&&(!Number.isInteger(rule.minItems)||rule.minItems<0))errors.push(`constraint ${index}: invalid minItems`);
    if(rule.maxItems!==undefined&&(!Number.isInteger(rule.maxItems)||rule.maxItems<0))errors.push(`constraint ${index}: invalid maxItems`);
  }
  return errors;
}

export function validateBlueprintForm(form,blueprint){
  const errors=[];
  if(!Array.isArray(form))return ["form must be an array"];
  const ids=form.map(i=>i.id),variants=form.map(i=>i.variantFamily||i.id);
  if(new Set(ids).size!==ids.length)errors.push("duplicate item id");
  if(new Set(variants).size!==variants.length)errors.push("variant-family collision");
  if(Number.isFinite(blueprint.supportedPointTarget)&&points(form)!==blueprint.supportedPointTarget)errors.push(`point total ${points(form)} != ${blueprint.supportedPointTarget}`);
  for(const [index,rule] of (blueprint.constraints||[]).entries()){
    const matching=form.filter(item=>matchesRule(item,rule)),p=points(matching),n=matching.length;
    if(rule.minPoints!==undefined&&p<rule.minPoints)errors.push(`constraint ${index}: ${p} points < ${rule.minPoints}`);
    if(rule.maxPoints!==undefined&&p>rule.maxPoints)errors.push(`constraint ${index}: ${p} points > ${rule.maxPoints}`);
    if(rule.minItems!==undefined&&n<rule.minItems)errors.push(`constraint ${index}: ${n} items < ${rule.minItems}`);
    if(rule.maxItems!==undefined&&n>rule.maxItems)errors.push(`constraint ${index}: ${n} items > ${rule.maxItems}`);
  }
  return errors;
}

function violatesMaximums(selected,candidate,blueprint){
  const next=[...selected,candidate];
  if(points(next)>blueprint.supportedPointTarget)return true;
  return (blueprint.constraints||[]).some(rule=>{
    if(!matchesRule(candidate,rule))return false;
    const matching=next.filter(item=>matchesRule(item,rule));
    return (rule.maxPoints!==undefined&&points(matching)>rule.maxPoints)||(rule.maxItems!==undefined&&matching.length>rule.maxItems);
  });
}

function addCandidate(selected,item,usedVariants,blueprint){
  const family=item.variantFamily||item.id;
  if(usedVariants.has(family)||violatesMaximums(selected,item,blueprint))return false;
  selected.push(item);usedVariants.add(family);return true;
}

export function drawBlueprintForm(bank,blueprint,{rng=Math.random,maxAttempts=500}={}){
  const specErrors=validateBlueprintSpec(blueprint);
  if(specErrors.length)throw new Error(`Invalid blueprint: ${specErrors.join("; ")}`);
  if(!blueprint.verified)throw new Error(`${blueprint.assessmentId}: blueprint is not independently verified`);

  for(let attempt=0;attempt<maxAttempts;attempt++){
    const selected=[],usedVariants=new Set();
    let failed=false;
    for(const rule of blueprint.constraints||[]){
      const candidates=shuffled(bank.filter(item=>matchesRule(item,rule)),rng);
      const minPoints=rule.minPoints||0,minItems=rule.minItems||0;
      for(const item of candidates){
        const matching=selected.filter(x=>matchesRule(x,rule));
        if(points(matching)>=minPoints&&matching.length>=minItems)break;
        addCandidate(selected,item,usedVariants,blueprint);
      }
      const matching=selected.filter(x=>matchesRule(x,rule));
      if(points(matching)<minPoints||matching.length<minItems){failed=true;break;}
    }
    if(failed)continue;

    for(const item of shuffled(bank,rng)){
      if(points(selected)===blueprint.supportedPointTarget)break;
      addCandidate(selected,item,usedVariants,blueprint);
    }
    if(validateBlueprintForm(selected,blueprint).length===0)return shuffled(selected,rng);
  }
  throw new Error(`${blueprint.assessmentId}: bank cannot satisfy verified blueprint after ${maxAttempts} attempts`);
}
