import { scoreResponse } from "./item-types.js";

export function scoreAttempt(items,responses={}){
  const details=items.map(item=>({item,...scoreResponse(item,responses[item.id])}));
  const earned=details.reduce((n,d)=>n+d.earned,0);
  const possible=details.reduce((n,d)=>n+d.possible,0);
  const manualPossible=details.reduce((n,d)=>n+Number(d.manualPossible||0),0);
  const manualAnswered=details.filter(d=>d.requiresManualScore&&d.answered).length;
  const manualItems=details.filter(d=>d.requiresManualScore).length;
  const byStrand={};
  for(const d of details){
    const k=d.item.strand;
    byStrand[k]??={earned:0,possible:0,manualPossible:0,manualItems:0};
    byStrand[k].earned+=d.earned;
    byStrand[k].possible+=d.possible;
    byStrand[k].manualPossible+=Number(d.manualPossible||0);
    if(d.requiresManualScore) byStrand[k].manualItems++;
  }
  return {
    earned,
    possible,
    manualPossible,
    totalPossible:possible+manualPossible,
    manualAnswered,
    manualItems,
    percent:possible?Math.round(earned/possible*100):null,
    byStrand,
    details
  };
}
