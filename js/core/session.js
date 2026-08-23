const KEY="map-practice-attempt-v2";
export const ATTEMPT_VERSION=2;

function shuffledIndices(length,rng=Math.random){
  const a=Array.from({length},(_,i)=>i);
  for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function reordered(values,order){return Array.isArray(order)&&order.length===values.length?order.map(i=>values[i]):[...values];}

export function newAttempt(assessmentId,sessionId,items,rng=Math.random){
  const optionOrders={},partOptionOrders={};
  for(const item of items){
    if(Array.isArray(item.options)&&item.options.length>1) optionOrders[item.id]=shuffledIndices(item.options.length,rng);
    if(Array.isArray(item.parts)) partOptionOrders[item.id]=item.parts.map(part=>Array.isArray(part.options)&&part.options.length>1?shuffledIndices(part.options.length,rng):null);
  }
  return {version:ATTEMPT_VERSION,assessmentId,sessionId,itemIds:items.map(i=>i.id),optionOrders,partOptionOrders,responses:{},flags:{},index:0,submitted:false,startedAt:Date.now(),submittedAt:null};
}
export function materializeItem(item,attempt){
  const out={...item};
  if(Array.isArray(item.options)) out.options=reordered(item.options,attempt?.optionOrders?.[item.id]);
  if(Array.isArray(item.parts)) out.parts=item.parts.map((part,i)=>({...part,options:Array.isArray(part.options)?reordered(part.options,attempt?.partOptionOrders?.[item.id]?.[i]):part.options}));
  return out;
}
export function materializeItems(items,attempt){return items.map(item=>materializeItem(item,attempt));}
export function isRestorableAttempt(attempt){
  return Boolean(attempt&&attempt.version===ATTEMPT_VERSION&&typeof attempt.assessmentId==="string"&&Number.isInteger(attempt.sessionId)&&Array.isArray(attempt.itemIds)&&attempt.itemIds.length&&attempt.responses&&typeof attempt.responses==="object"&&attempt.flags&&typeof attempt.flags==="object"&&Number.isInteger(attempt.index)&&attempt.index>=0&&attempt.index<attempt.itemIds.length&&!attempt.submitted);
}
export function setResponse(attempt,itemId,response){ if(attempt.submitted) throw new Error("Submitted sessions are locked"); attempt.responses[itemId]=response; return attempt; }
export function toggleFlag(attempt,itemId){ if(attempt.submitted) throw new Error("Submitted sessions are locked"); attempt.flags[itemId]=!attempt.flags[itemId]; return attempt; }
export function submitAttempt(attempt){ attempt.submitted=true; attempt.submittedAt=Date.now(); saveAttempt(attempt); return attempt; }
export function saveAttempt(attempt){ localStorage.setItem(KEY,JSON.stringify(attempt)); }
export function loadAttempt(){ try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch{return null;} }
export function clearAttempt(){ localStorage.removeItem(KEY); }
export function isLocked(attempt){ return Boolean(attempt?.submitted); }
