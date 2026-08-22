const KEY="map-practice-attempt-v1";

export function newAttempt(assessmentId,sessionId,items){
  return {version:1,assessmentId,sessionId,itemIds:items.map(i=>i.id),responses:{},flags:{},index:0,submitted:false,startedAt:Date.now(),submittedAt:null};
}
export function setResponse(attempt,itemId,response){ if(attempt.submitted) throw new Error("Submitted sessions are locked"); attempt.responses[itemId]=response; return attempt; }
export function toggleFlag(attempt,itemId){ if(attempt.submitted) throw new Error("Submitted sessions are locked"); attempt.flags[itemId]=!attempt.flags[itemId]; return attempt; }
export function submitAttempt(attempt){ attempt.submitted=true; attempt.submittedAt=Date.now(); saveAttempt(attempt); return attempt; }
export function saveAttempt(attempt){ localStorage.setItem(KEY,JSON.stringify(attempt)); }
export function loadAttempt(){ try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch{return null;} }
export function clearAttempt(){ localStorage.removeItem(KEY); }
export function isLocked(attempt){ return Boolean(attempt?.submitted); }
