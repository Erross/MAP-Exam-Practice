import { BANKS } from "../js/banks.js";

const words=value=>String(value??"").trim().split(/\s+/).filter(Boolean).length;

for(const [assessmentId,bank] of Object.entries(BANKS)){
  const offenders=[];
  for(const item of bank){
    if(item.itemType!=="multiple_choice"||!Array.isArray(item.options)||item.options.length!==4) continue;
    const key=item.options.indexOf(item.scoring?.answer);
    if(key<0) continue;
    const lengths=item.options.map(words),max=Math.max(...lengths);
    if(lengths[key]===max&&lengths.filter(n=>n===max).length===1){
      offenders.push({id:item.id,correctWords:lengths[key],longestDistractorWords:Math.max(...lengths.filter((_,i)=>i!==key))});
    }
  }
  if(offenders.length) console.log(`${assessmentId} uniquely-longest-correct IDs: ${JSON.stringify(offenders)}`);
}
