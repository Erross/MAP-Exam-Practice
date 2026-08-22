function shuffled(values,rng=Math.random){ const a=[...values]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

export function eligibleForSession(bank,sessionId){ return bank.filter(item=>item.sessionEligibility.includes(Number(sessionId))); }

export function deliveryGroupKey(item){
  return item.deliveryGroup || item.stimulusId || item.stimulus?.id || item.stimulus?.title || null;
}

export function deliveryBundles(items){
  const grouped=new Map(),bundles=[];
  for(const item of items){
    const key=deliveryGroupKey(item);
    if(!key){bundles.push([item]);continue;}
    if(!grouped.has(key)){const bundle=[];grouped.set(key,bundle);bundles.push(bundle);}
    grouped.get(key).push(item);
  }
  return bundles;
}

function bundleVariants(bundle){return bundle.map(item=>item.variantFamily||item.id);}
function bundleFitsVariants(bundle,usedVariants){
  const families=bundleVariants(bundle);
  return new Set(families).size===families.length && families.every(family=>!usedVariants.has(family));
}
function isPerformanceEventSession(eligible){
  return eligible.length>0&&eligible.every(item=>item.strand==="Performance Event");
}

export function drawPracticeSession(bank,sessionId,{maxItems=12,maxBundles=null,rng=Math.random}={}){
  const eligible=eligibleForSession(bank,sessionId), bundles=shuffled(deliveryBundles(eligible),rng), usedVariants=new Set(), out=[];
  const bundleLimit=Number.isInteger(maxBundles)&&maxBundles>0?maxBundles:(isPerformanceEventSession(eligible)?1:Infinity);
  let bundlesUsed=0;
  for(const rawBundle of bundles){
    if(bundlesUsed>=bundleLimit) break;
    const bundle=shuffled(rawBundle,rng);
    if(out.length+bundle.length>maxItems) continue;
    if(!bundleFitsVariants(bundle,usedVariants)) continue;
    out.push(...bundle);bundlesUsed++;
    for(const family of bundleVariants(bundle)) usedVariants.add(family);
    if(out.length===maxItems) break;
  }
  return out;
}

export function seededRandom(seed){ let s=seed>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
