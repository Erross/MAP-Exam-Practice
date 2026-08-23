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

const points=items=>items.reduce((sum,item)=>sum+Number(item.points||0),0);
const shuffle=(values,rng)=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
const setOverlap=(a,b)=>{const right=new Set(b);return a.length?a.filter(x=>right.has(x)).length/a.length:0;};
const groupKey=item=>item.deliveryGroup||item.stimulusId||item.stimulus?.id||null;

function categoryFor(item,grade){
  if(item.strand==="Reading Literary")return "RL";
  if(item.strand==="Reading Informational")return "RI";
  if(item.strand==="Research")return "RES";
  if(item.strand==="Language")return "L";
  if(grade===4&&item.strand==="Writing Process")return "WP";
  if([3,5].includes(grade)&&["Writing Process","Writing Conventions"].includes(item.strand))return "W";
  const standard=String(item.standard||"");
  if(standard.includes(".W.3."))return "RES";
  if(standard.includes(".L."))return "L";
  if(grade===4&&standard.includes(".W."))return "WP";
  if([3,5].includes(grade)&&standard.includes(".W."))return "W";
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
    console.log(`${assessmentId}: GAP capacity ${JSON.stringify(capacity)}; supported-scope full-form simulation deferred.`);
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
    console.log(`${assessmentId}: GAP exact supported-shape construction failed; capacity ${JSON.stringify(capacity)}.`);
    continue;
  }
  const mean=xs=>xs.reduce((a,b)=>a+b,0)/xs.length;
  const categoryText=Object.entries(categoryOverlaps).map(([k,v])=>`${k} ${(mean(v)*100).toFixed(1)}%`).join(" | ");
  console.log(`${assessmentId}: 5,000 development supported-scope form retake pairs; target ${points(Object.entries(shape).flatMap(([category,target])=>Array(target).fill({points:1}))) }p; mean exact-item overlap ${(mean(overlaps)*100).toFixed(1)}%; stimulus overlap ${(mean(stimulusOverlaps)*100).toFixed(1)}%; ${categoryText}. NOT release verification.`);
}
