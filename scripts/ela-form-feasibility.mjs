import { BANKS } from "../js/banks.js";
import { deliveryBundles, seededRandom } from "../js/core/form-builder.js";

const SHAPES={
  "g3-ela":{RL:13,RI:13,RES:8,W:8,L:6},
  "g4-ela":{RL:13,RI:13,RES:8,WP:2,L:4},
  "g5-ela":{RL:13,RI:13,RES:8,W:8,L:6},
  "g6-ela":{RL:14,RI:14,RES:8},
  "g7-ela":{RL:14,RI:14,RES:8},
  "g8-ela":{RL:14,RI:14,RES:8}
};

const MAX_ITEM_OVERLAP=0.40;
const MAX_STIMULUS_OVERLAP=0.50;
const failures=[];

const points=items=>items.reduce((sum,item)=>sum+Number(item.points||0),0);
const shuffle=(values,rng)=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
const setOverlap=(a,b)=>{const right=new Set(b);return a.length?a.filter(x=>right.has(x)).length/a.length:0;};
const groupKey=item=>item.deliveryGroup||item.stimulusId||item.stimulus?.id||null;

function categoryFor(item,grade){
  const standard=String(item.standard||"");
  // Missouri's Writing codes change role by grade band. In Grades 3-5,
  // W.3 is research and W.1 is writing process. In Grades 6-8, W.1 is
  // research and W.3 is writing process. W.2 writing prompts are deferred.
  if(grade<=5&&standard.includes(".W.3."))return "RES";
  if(grade>=6&&standard.includes(".W.1."))return "RES";
  if(standard.includes(".L."))return grade<=5?"L":null;
  if(grade===4&&standard.includes(".W.1."))return "WP";
  if([3,5].includes(grade)&&standard.includes(".W.1."))return "W";
  if(standard.includes(".W.2."))return null;
  if(grade>=6&&standard.includes(".W.3."))return null;

  if(item.strand==="Reading Literary")return "RL";
  if(item.strand==="Reading Informational")return "RI";
  if(item.strand==="Research")return "RES";
  if(grade<=5&&item.strand==="Language")return "L";
  if(grade===4&&item.strand==="Writing Process")return "WP";
  if([3,5].includes(grade)&&["Writing Process","Writing Conventions"].includes(item.strand))return "W";
  return null;
}

function bundlesByCategory(bank,grade){
  const out=new Map();
  for(const bundle of deliveryBundles(bank)){
    const categories=new Set(bundle.map(item=>categoryFor(item,grade)).filter(Boolean));
    if(categories.size!==1)continue;
    const category=[...categories][0];
    if(!out.has(category))out.set(category,[]);
    out.get(category).push(bundle);
  }
  return out;
}

function drawCategory(bundles,target,rng,maxAttempts=500){
  for(let attempt=0;attempt<maxAttempts;attempt++){
    const selected=[];let total=0;
    for(const bundle of shuffle(bundles,rng)){
      const p=points(bundle);
      if(total+p>target)continue;
      selected.push(...bundle);total+=p;
      if(total===target)return selected;
    }
  }
  return null;
}

function drawForm(bank,assessmentId,seed){
  const grade=Number(assessmentId[1]), shape=SHAPES[assessmentId], grouped=bundlesByCategory(bank,grade), rng=seededRandom(seed);
  const selected=[];
  for(const [category,target] of Object.entries(shape)){
    const part=drawCategory(grouped.get(category)||[],target,rng);
    if(!part)return null;
    selected.push(...part);
  }
  return selected;
}

for(const [assessmentId,shape] of Object.entries(SHAPES)){
  const bank=BANKS[assessmentId]||[],grade=Number(assessmentId[1]), grouped=bundlesByCategory(bank,grade);
  const capacity=Object.fromEntries(Object.entries(shape).map(([category,target])=>{
    const bundles=grouped.get(category)||[];
    return [category,{target,poolPoints:bundles.reduce((sum,bundle)=>sum+points(bundle),0),bundleCount:bundles.length}];
  }));
  const missing=Object.entries(capacity).filter(([,v])=>v.poolPoints<v.target);
  if(missing.length){
    const message=`${assessmentId}: GAP capacity ${JSON.stringify(capacity)}; supported-scope full-form simulation deferred.`;
    console.log(message);
    failures.push(message);
    continue;
  }
  let failed=false;const overlaps=[],stimulusOverlaps=[];const categoryOverlaps=Object.fromEntries(Object.keys(shape).map(k=>[k,[]]));
  for(let i=0;i<5000;i++){
    const first=drawForm(bank,assessmentId,100000+i*2),second=drawForm(bank,assessmentId,100001+i*2);
    if(!first||!second){failed=true;break;}
    overlaps.push(setOverlap(first.map(x=>x.id),second.map(x=>x.id)));
    const firstGroups=[...new Set(first.map(groupKey).filter(Boolean))],secondGroups=[...new Set(second.map(groupKey).filter(Boolean))];
    stimulusOverlaps.push(setOverlap(firstGroups,secondGroups));
    for(const category of Object.keys(shape)){
      const a=first.filter(item=>categoryFor(item,grade)===category).map(item=>item.id),b=second.filter(item=>categoryFor(item,grade)===category).map(item=>item.id);
      categoryOverlaps[category].push(setOverlap(a,b));
    }
  }
  if(failed){
    const message=`${assessmentId}: GAP exact supported-shape construction failed; capacity ${JSON.stringify(capacity)}.`;
    console.log(message);
    failures.push(message);
    continue;
  }
  const mean=xs=>xs.reduce((a,b)=>a+b,0)/xs.length;
  const itemOverlap=mean(overlaps),stimulusOverlap=mean(stimulusOverlaps);
  const categoryText=Object.entries(categoryOverlaps).map(([k,v])=>`${k} ${(mean(v)*100).toFixed(1)}%`).join(" | ");
  const targetPoints=Object.values(shape).reduce((sum,value)=>sum+value,0);
  console.log(`${assessmentId}: 5,000 development supported-scope form retake pairs; target ${targetPoints}p; mean exact-item overlap ${(itemOverlap*100).toFixed(1)}%; stimulus overlap ${(stimulusOverlap*100).toFixed(1)}%; ${categoryText}. NOT release verification.`);
  if(itemOverlap>MAX_ITEM_OVERLAP)failures.push(`${assessmentId}: mean exact-item overlap ${(itemOverlap*100).toFixed(1)}% exceeds ${(MAX_ITEM_OVERLAP*100).toFixed(0)}% gate.`);
  if(stimulusOverlap>MAX_STIMULUS_OVERLAP)failures.push(`${assessmentId}: mean stimulus overlap ${(stimulusOverlap*100).toFixed(1)}% exceeds ${(MAX_STIMULUS_OVERLAP*100).toFixed(0)}% gate.`);
}

if(failures.length){
  console.error(`FAIL: ELA supported-form diversity gate found ${failures.length} issue(s):`);
  for(const failure of failures)console.error(`- ${failure}`);
  process.exitCode=1;
}else{
  console.log(`PASS: all six ELA supported-scope development forms hold <=${MAX_ITEM_OVERLAP*100}% mean exact-item overlap and <=${MAX_STIMULUS_OVERLAP*100}% mean stimulus overlap across 5,000 retake pairs. These are development diversity gates, not verified-blueprint release evidence.`);
}
