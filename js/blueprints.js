import { deliveryBundles } from "./core/form-builder.js";

const freeze=o=>Object.freeze(o);
const frozenRules=rules=>freeze(rules.map(rule=>freeze({...rule})));

const pointTargets={
  "g3-ela":56,"g4-ela":56,"g5-ela":56,"g6-ela":56,"g7-ela":52,"g8-ela":56,
  "g3-math":48,"g4-math":48,"g5-math":48,"g6-math":54,"g7-math":54,"g8-math":54,
  "g5-science":60,"g8-science":60
};

// These ranges are the current transcription target recorded in BLUEPRINT_TRANSCRIPTION.md.
// They remain non-release evidence until independently confirmed against the current DESE primary PDF.
const officialConstraints={
  "g3-math":[
    {code:"NBT",label:"Number Sense and Operations in Base Ten",minPoints:8,maxPoints:10},
    {code:"NF",label:"Number Sense and Operations in Fractions",minPoints:8,maxPoints:10},
    {code:"RA",label:"Relationships and Algebraic Thinking",minPoints:8,maxPoints:18},
    {code:"GM+DS",label:"Geometry/Measurement + Data/Statistics",minPoints:7,maxPoints:16},
    {code:"PE",label:"Performance Event",minPoints:6,maxPoints:6,component:"performance-event"}
  ],
  "g4-math":[
    {code:"NBT",label:"Number Sense and Operations in Base Ten",minPoints:9,maxPoints:11},
    {code:"NF",label:"Number Sense and Operations in Fractions",minPoints:8,maxPoints:14},
    {code:"RA",label:"Relationships and Algebraic Thinking",minPoints:5,maxPoints:11},
    {code:"GM",label:"Geometry and Measurement",minPoints:7,maxPoints:13},
    {code:"DS",label:"Data and Statistics",minPoints:3,maxPoints:5},
    {code:"PE",label:"Performance Event",minPoints:6,maxPoints:6,component:"performance-event"}
  ],
  "g5-math":[
    {code:"NBT",label:"Number Sense and Operations in Base Ten",minPoints:7,maxPoints:9},
    {code:"NF",label:"Number Sense and Operations in Fractions",minPoints:11,maxPoints:15},
    {code:"RA",label:"Relationships and Algebraic Thinking",minPoints:5,maxPoints:11},
    {code:"GM",label:"Geometry and Measurement",minPoints:6,maxPoints:14},
    {code:"DS",label:"Data and Statistics",minPoints:2,maxPoints:4},
    {code:"PE",label:"Performance Event",minPoints:6,maxPoints:6,component:"performance-event"}
  ],
  "g6-math":[
    {code:"RP",label:"Ratios and Proportional Relationships",minPoints:7,maxPoints:9},
    {code:"NS",label:"Number Sense",minPoints:9,maxPoints:14},
    {code:"EEI",label:"Expressions, Equations and Inequalities",minPoints:12,maxPoints:18},
    {code:"GM+DSP",label:"Geometry/Measurement + Data/Statistics/Probability",minPoints:10,maxPoints:15},
    {code:"PE",label:"Performance Event",minPoints:8,maxPoints:8,component:"performance-event"}
  ],
  "g7-math":[
    {code:"RP",label:"Ratios and Proportional Relationships",minPoints:10,maxPoints:12},
    {code:"NS",label:"Number Sense",minPoints:8,maxPoints:10},
    {code:"EEI",label:"Expressions, Equations and Inequalities",minPoints:11,maxPoints:15},
    {code:"GM",label:"Geometry and Measurement",minPoints:4,maxPoints:8},
    {code:"DSP",label:"Data/Statistics/Probability",minPoints:5,maxPoints:10},
    {code:"PE",label:"Performance Event",minPoints:8,maxPoints:8,component:"performance-event"}
  ],
  "g8-math":[
    {code:"NS",label:"Number Sense",minPoints:2,maxPoints:4},
    {code:"EEI",label:"Expressions, Equations and Inequalities",minPoints:15,maxPoints:21},
    {code:"GM",label:"Geometry and Measurement",minPoints:9,maxPoints:15},
    {code:"DSP",label:"Data/Statistics/Probability",minPoints:3,maxPoints:5},
    {code:"F",label:"Functions",minPoints:7,maxPoints:11},
    {code:"PE",label:"Performance Event",minPoints:8,maxPoints:8,component:"performance-event"}
  ],
  "g3-ela":[
    {code:"RL",label:"Reading Literary",minPoints:12,maxPoints:14},
    {code:"RI",label:"Reading Informational",minPoints:12,maxPoints:14},
    {code:"RES",label:"Research",minPoints:7,maxPoints:9},
    {code:"W",label:"Writing / Writing Process",minPoints:7,maxPoints:9},
    {code:"L",label:"Language",minPoints:5,maxPoints:7},
    {code:"SL",label:"Speaking and Listening",minPoints:7,maxPoints:9,component:"listening"}
  ],
  "g4-ela":[
    {code:"RL",label:"Reading Literary",minPoints:12,maxPoints:14},
    {code:"RI",label:"Reading Informational",minPoints:12,maxPoints:14},
    {code:"RES",label:"Research",minPoints:7,maxPoints:9},
    {code:"WP",label:"Writing Process",minPoints:2,maxPoints:2},
    {code:"WT",label:"Compose well-developed writing text",minPoints:8,maxPoints:8,component:"writing-task"},
    {code:"L",label:"Language",minPoints:4,maxPoints:4},
    {code:"SL",label:"Speaking and Listening",minPoints:7,maxPoints:9,component:"listening"}
  ],
  "g5-ela":[
    {code:"RL",label:"Reading Literary",minPoints:12,maxPoints:14},
    {code:"RI",label:"Reading Informational",minPoints:12,maxPoints:14},
    {code:"RES",label:"Research",minPoints:7,maxPoints:9},
    {code:"W",label:"Writing / Writing Process",minPoints:7,maxPoints:9},
    {code:"L",label:"Language",minPoints:5,maxPoints:7},
    {code:"SL",label:"Speaking and Listening",minPoints:7,maxPoints:9,component:"listening"}
  ],
  "g6-ela":[
    {code:"RL",label:"Reading Literary",minPoints:13,maxPoints:15},
    {code:"RI",label:"Reading Informational",minPoints:13,maxPoints:15},
    {code:"RES",label:"Research",minPoints:7,maxPoints:9},
    {code:"W",label:"Writing",minPoints:8,maxPoints:8,component:"writing-task"},
    {code:"SL",label:"Speaking and Listening",minPoints:7,maxPoints:9,component:"listening"}
  ],
  "g7-ela":[
    {code:"RL",label:"Reading Literary",minPoints:13,maxPoints:15},
    {code:"RI",label:"Reading Informational",minPoints:13,maxPoints:15},
    {code:"RES",label:"Research",minPoints:7,maxPoints:9},
    {code:"W",label:"Writing",minPoints:7,maxPoints:9,component:"writing-task"},
    {code:"SL",label:"Speaking and Listening",minPoints:7,maxPoints:9,component:"listening"}
  ],
  "g8-ela":[
    {code:"RL",label:"Reading Literary",minPoints:13,maxPoints:15},
    {code:"RI",label:"Reading Informational",minPoints:13,maxPoints:15},
    {code:"RES",label:"Research",minPoints:7,maxPoints:9},
    {code:"WW",label:"Writing — Approaching the Task as a Writer",minPoints:8,maxPoints:8,component:"writing-task"},
    {code:"WR",label:"Writing — Approaching the Task as a Reader",minPoints:4,maxPoints:4,component:"writing-task"},
    {code:"SL",label:"Speaking and Listening",minPoints:7,maxPoints:9,component:"listening"}
  ],
  "g5-science":[
    {code:"PS",label:"Physical Science",minPoints:17,maxPoints:26},
    {code:"LS",label:"Life Science",minPoints:15,maxPoints:22},
    {code:"ESS",label:"Earth and Space Science",minPoints:15,maxPoints:22}
  ],
  "g8-science":[
    {code:"PS",label:"Physical Science",minPoints:15,maxPoints:23},
    {code:"LS",label:"Life Science",minPoints:15,maxPoints:23},
    {code:"ESS",label:"Earth and Space Science",minPoints:15,maxPoints:23}
  ]
};

const blockersFor=assessmentId=>{
  if(assessmentId.endsWith("-ela")) return ["current-DESE-range-primary-confirmation","writing/listening-auto-score-gap","supported-subset-constraints-not-finalized"];
  if(assessmentId.endsWith("-science")) return ["current-DESE-range-primary-confirmation","constructed-response-scoring-gap","supported-subset-constraints-not-finalized"];
  return ["current-DESE-range-primary-confirmation","complete-operational-performance-events-needed","ordinary-category-alignment-not-finalized"];
};

export const BLUEPRINTS=freeze(Object.fromEntries(Object.entries(pointTargets).map(([assessmentId,officialPointTarget])=>[
  assessmentId,
  freeze({
    id:assessmentId,
    assessmentId,
    officialPointTarget,
    officialConstraints:frozenRules(officialConstraints[assessmentId]||[]),
    officialPointTargetVerified:true,
    officialRangesVerified:false,
    officialRangeEvidence:"corroborating-copy-transcribed-primary-current-file-confirmation-pending",
    verified:false,
    executable:false,
    verificationStatus:"official-total-verified-ranges-pending-primary-confirmation-execution-blocked",
    sourceRecord:"BLUEPRINT_TRANSCRIPTION.md",
    executionBlockers:freeze(blockersFor(assessmentId)),
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
  if(!Array.isArray(blueprint.officialConstraints)||!blueprint.officialConstraints.length)errors.push("officialConstraints required");
  for(const [index,rule] of (blueprint.officialConstraints||[]).entries()){
    if(rule.minPoints!==undefined&&(!Number.isFinite(rule.minPoints)||rule.minPoints<0))errors.push(`official constraint ${index}: invalid minPoints`);
    if(rule.maxPoints!==undefined&&(!Number.isFinite(rule.maxPoints)||rule.maxPoints<0))errors.push(`official constraint ${index}: invalid maxPoints`);
  }
  if(blueprint.verified){
    if(blueprint.officialRangesVerified!==true)errors.push("verified blueprint requires primary-current official range verification");
    if(blueprint.executable!==true)errors.push("verified blueprint must be executable");
    if(!Number.isFinite(blueprint.supportedPointTarget)||blueprint.supportedPointTarget<=0)errors.push("verified blueprint requires supportedPointTarget");
    if(!Array.isArray(blueprint.constraints)||!blueprint.constraints.length)errors.push("verified blueprint requires executable constraints");
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

function bundleVariants(bundle){return bundle.map(item=>item.variantFamily||item.id);}
function bundleViolatesMaximums(selected,bundle,blueprint){
  const next=[...selected,...bundle];
  if(points(next)>blueprint.supportedPointTarget)return true;
  return (blueprint.constraints||[]).some(rule=>{
    const matching=next.filter(item=>matchesRule(item,rule));
    return (rule.maxPoints!==undefined&&points(matching)>rule.maxPoints)||(rule.maxItems!==undefined&&matching.length>rule.maxItems);
  });
}

function addBundle(selected,bundle,usedVariants,usedIds,blueprint){
  const families=bundleVariants(bundle),ids=bundle.map(item=>item.id);
  if(new Set(families).size!==families.length)return false;
  if(families.some(family=>usedVariants.has(family))||ids.some(id=>usedIds.has(id)))return false;
  if(bundleViolatesMaximums(selected,bundle,blueprint))return false;
  selected.push(...bundle);
  families.forEach(family=>usedVariants.add(family));
  ids.forEach(id=>usedIds.add(id));
  return true;
}

export function drawBlueprintForm(bank,blueprint,{rng=Math.random,maxAttempts=500}={}){
  const specErrors=validateBlueprintSpec(blueprint);
  if(specErrors.length)throw new Error(`Invalid blueprint: ${specErrors.join("; ")}`);
  if(!blueprint.verified||!blueprint.executable)throw new Error(`${blueprint.assessmentId}: blueprint is not independently verified and executable`);

  const allBundles=deliveryBundles(bank);
  for(let attempt=0;attempt<maxAttempts;attempt++){
    const selected=[],usedVariants=new Set(),usedIds=new Set();
    let failed=false;
    for(const rule of blueprint.constraints||[]){
      const candidates=shuffled(allBundles.filter(bundle=>bundle.some(item=>matchesRule(item,rule))),rng);
      const minPoints=rule.minPoints||0,minItems=rule.minItems||0;
      for(const bundle of candidates){
        const matching=selected.filter(x=>matchesRule(x,rule));
        if(points(matching)>=minPoints&&matching.length>=minItems)break;
        addBundle(selected,shuffled(bundle,rng),usedVariants,usedIds,blueprint);
      }
      const matching=selected.filter(x=>matchesRule(x,rule));
      if(points(matching)<minPoints||matching.length<minItems){failed=true;break;}
    }
    if(failed)continue;

    for(const bundle of shuffled(allBundles,rng)){
      if(points(selected)===blueprint.supportedPointTarget)break;
      addBundle(selected,shuffled(bundle,rng),usedVariants,usedIds,blueprint);
    }
    if(validateBlueprintForm(selected,blueprint).length===0)return selected;
  }
  throw new Error(`${blueprint.assessmentId}: bank cannot satisfy verified blueprint after ${maxAttempts} attempts while preserving delivery groups`);
}
