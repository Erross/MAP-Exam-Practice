function shuffled(values,rng=Math.random){ const a=[...values]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

export function eligibleForSession(bank,sessionId){ return bank.filter(item=>item.sessionEligibility.includes(Number(sessionId))); }

export function drawPracticeSession(bank,sessionId,{maxItems=12,rng=Math.random}={}){
  const eligible=shuffled(eligibleForSession(bank,sessionId),rng), usedVariants=new Set(), out=[];
  for(const item of eligible){
    const family=item.variantFamily||item.id;
    if(usedVariants.has(family)) continue;
    out.push(item); usedVariants.add(family);
    if(out.length>=maxItems) break;
  }
  return out;
}

export function seededRandom(seed){ let s=seed>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
