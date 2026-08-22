import { scoreResponse } from "./item-types.js";

export function scoreAttempt(items,responses={}){
  const details=items.map(item=>({item,...scoreResponse(item,responses[item.id])}));
  const earned=details.reduce((n,d)=>n+d.earned,0), possible=details.reduce((n,d)=>n+d.possible,0);
  const byStrand={};
  for(const d of details){ const k=d.item.strand; byStrand[k]??={earned:0,possible:0}; byStrand[k].earned+=d.earned; byStrand[k].possible+=d.possible; }
  return {earned,possible,percent:possible?Math.round(earned/possible*100):0,byStrand,details};
}
