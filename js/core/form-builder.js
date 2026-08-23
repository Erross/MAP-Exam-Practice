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
  const eligible=eligibleForSession(bank,sessionId), bundles=shuffled(deliveryBundles(eligible),rng), usedVariants=new Set(), out=[], usedBundles=new Set();
  const bundleLimit=Number.isInteger(maxBundles)&&maxBundles>0?maxBundles:(isPerformanceEventSession(eligible)?1:Infinity);
  let bundlesUsed=0;

  const addBundle=rawBundle=>{
    if(usedBundles.has(rawBundle)||bundlesUsed>=bundleLimit)return false;
    const bundle=shuffled(rawBundle,rng);
    if(out.length+bundle.length>maxItems)return false;
    if(!bundleFitsVariants(bundle,usedVariants))return false;
    out.push(...bundle);bundlesUsed++;usedBundles.add(rawBundle);
    for(const family of bundleVariants(bundle))usedVariants.add(family);
    return true;
  };

  // When a session has an eligible manual-scored response, surface at least one
  // in the generic practice draw. This preserves the known Science contract
  // that both sessions contain CR without inventing an operational CR count.
  if(eligible.some(item=>item.itemType==="constructed_response")){
    const manualBundles=shuffled(bundles.filter(bundle=>bundle.some(item=>item.itemType==="constructed_response")),rng);
    const added=manualBundles.some(addBundle);
    if(!added)throw new Error(`Session ${sessionId}: unable to include an eligible constructed-response bundle within the practice draw limits`);
  }

  for(const rawBundle of bundles){
    if(bundlesUsed>=bundleLimit||out.length===maxItems)break;
    addBundle(rawBundle);
  }
  return out;
}

export function seededRandom(seed){ let s=seed>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
