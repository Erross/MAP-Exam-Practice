import { assessmentList, getAssessment, assessmentDeferredComponents } from "./config.js";
import { getBank } from "./banks.js";
import { drawPracticeSession,deliveryGroupKey } from "./core/form-builder.js";
import { newAttempt,materializeItems,isRestorableAttempt,setResponse,toggleFlag,submitAttempt,saveAttempt,loadAttempt,clearAttempt } from "./core/session.js";
import { scoreAttempt } from "./core/scoring.js";
import { renderControl } from "./renderers.js";
import { createCalculator } from "./calculator.js";

const root=document.querySelector("#app"); const DEV=new URLSearchParams(location.search).get("dev")==="1"; let state={view:"home",assessment:null,session:null,items:[],attempt:null};
const subjectName=s=>({ela:"English Language Arts",math:"Mathematics",science:"Science"}[s]||s);
const deferLabel=x=>({"listening-audio":"Listening/audio","human-scored-writing":"Writing prompt","human-scored-constructed-response":"Constructed response","human-scored-written-pe-parts":"Written PE parts"}[x]||x);
const fmt=v=>v===undefined?"Not answered":typeof v==="string"?v:JSON.stringify(v);

function setState(p){state={...state,...p};render();}
function bankFor(a){return getBank(a.id);}
function pct(n,d){return d?Math.round(n/d*100):0;}
function currentSession(){return state.assessment?.sessions.find(s=>s.id===state.session)||null;}
function launchable(a){return a.status==="released"||(DEV&&bankFor(a).length>0);}
function calculatorSummary(session){
  if(session.calculatorPolicy==="item-designated") return "Calculator availability varies by item";
  if(session.calculatorPolicy==="available") return session.calculatorLabel||`${session.calculatorLevel==="scientific"?"Scientific":"Four-function"} calculator available`;
  return "Calculator not allowed / not applicable";
}
function calculatorLevelForItem(session,item){
  if(!session||session.calculatorPolicy==="none") return null;
  if(session.calculatorPolicy==="available") return session.calculatorLevel||"four-function";
  if(session.calculatorPolicy==="item-designated"){
    if(item?.calculatorLevel==="four-function"||item?.calculatorLevel==="scientific") return item.calculatorLevel;
    return null;
  }
  return null;
}
function groupContext(item,index){
  const key=deliveryGroupKey(item); if(!key)return null;
  const positions=state.items.map((q,i)=>deliveryGroupKey(q)===key?i:null).filter(i=>i!==null);
  if(positions.length<2)return null;
  const first=Math.min(...positions),last=Math.max(...positions);
  return {first,last,count:positions.length,label:state.assessment?.subject==="science"?"stimulus set":"passage set",position:positions.indexOf(index)+1};
}

function home(){
  const resume=loadAttempt(); const grades=[3,4,5,6,7,8];
  root.innerHTML=`<section class="hero"><p class="eyebrow">Missouri • unofficial practice</p><h1>MAP Grade-Level Practice</h1><p>Practice the structure and machine-scorable skills used on Missouri MAP Grade-Level assessments. Current development deliberately defers audio and human-scored writing.</p><div class="notice"><strong>MAP is not a timed test.</strong> Session times shown here are DESE planning guidelines, not countdown limits.</div>${DEV?`<div class="notice warning"><strong>Development mode:</strong> draft banks are launchable for testing. They are not release-ready.</div>`:""}${isRestorableAttempt(resume)?`<button id="resume" class="secondary">Resume saved session</button>`:""}</section><section><h2>Choose a grade</h2><div class="grade-grid">${grades.map(g=>`<article class="grade-card"><h3>Grade ${g}</h3>${assessmentList().filter(a=>a.grade===g).map(a=>{const n=bankFor(a).length, ready=launchable(a);return `<button class="assessment-card" data-id="${a.id}" ${ready?"":"disabled"}><span>${subjectName(a.subject)}</span><small>${a.status==="released"?"Ready":n?`${n} development items • not released`:`Bank not built yet`}</small></button>`}).join("")}</article>`).join("")}</div></section>`;
  root.querySelectorAll("[data-id]:not(:disabled)").forEach(b=>b.onclick=()=>preflight(b.dataset.id));
  const rb=root.querySelector("#resume"); if(rb) rb.onclick=resumeAttempt;
}

function preflight(id){ const a=getAssessment(id); if(!a||!launchable(a))return setState({view:"home"}); setState({view:"preflight",assessment:a,items:bankFor(a),attempt:null}); }
function preflightView(){
  const a=state.assessment, deferred=assessmentDeferredComponents(a);
  root.innerHTML=`<button class="link-button" id="back">← Back to grades</button><section class="panel"><p class="eyebrow">Grade ${a.grade}</p><h1>${subjectName(a.subject)}</h1><dl class="facts"><div><dt>Official point target</dt><dd>${a.points}</dd></div><div><dt>Sessions</dt><dd>${a.sessions.length}</dd></div><div><dt>Timing</dt><dd>Untimed</dd></div></dl><div class="notice warning"><strong>Development scope:</strong> this is not yet a complete operational simulation. Deferred: ${deferred.map(deferLabel).join(", ")||"none"}. No deferred component is replaced with extra multiple-choice content.</div><h2>Practice a session</h2><div class="session-list">${a.sessions.map(s=>{const eligible=state.items.filter(i=>i.sessionEligibility.includes(s.id)).length;return `<button class="session-card" data-session="${s.id}" ${eligible?"":"disabled"}><strong>${s.label}</strong><span>Typical guideline: ${s.guidelineMinutes[0]}–${s.guidelineMinutes[1]} min • ${calculatorSummary(s)}</span><small>${eligible?`${eligible} current auto-scorable items`:`No auto-scorable items yet`}${s.deferred?.length?` • deferred: ${s.deferred.map(deferLabel).join(", ")}`:""}</small></button>`}).join("")}</div></section>`;
  root.querySelector("#back").onclick=()=>setState({view:"home",assessment:null}); root.querySelectorAll("[data-session]").forEach(b=>b.onclick=()=>start(Number(b.dataset.session)));
}
function start(sessionId){ const a=state.assessment, baseItems=drawPracticeSession(bankFor(a),sessionId,{maxItems:12}); const attempt=newAttempt(a.id,sessionId,baseItems); const items=materializeItems(baseItems,attempt); saveAttempt(attempt); setState({view:"question",session:sessionId,items,attempt}); }
function resumeAttempt(){ const a=loadAttempt(); if(!isRestorableAttempt(a))return; const assessment=getAssessment(a.assessmentId); if(!assessment||!launchable(assessment)){clearAttempt();return home();} const bank=getBank(a.assessmentId), byId=new Map(bank.map(i=>[i.id,i])), baseItems=a.itemIds.map(id=>byId.get(id)).filter(Boolean); if(baseItems.length!==a.itemIds.length){clearAttempt();return home();} setState({view:"question",assessment,session:a.sessionId,items:materializeItems(baseItems,a),attempt:a}); }
function questionView(){
  const a=state.attempt, item=state.items[a.index], session=currentSession(), calcLevel=calculatorLevelForItem(session,item), group=groupContext(item,a.index);
  const groupNote=group?`<p class="set-context">Questions ${group.first+1}–${group.last+1} use this ${group.label}. You are on item ${group.position} of ${group.count} in the set.</p>`:"";
  const stimulus=item.stimulus?`<article class="stimulus"><p class="eyebrow">${state.assessment.subject==="science"?"Stimulus":"Passage"}</p><h2>${item.stimulus.title}</h2>${item.stimulus.text.split("\n").map(p=>`<p>${p}</p>`).join("")}</article>`:"";
  const questionBody=`<section class="question-body"><p class="question-number">Question ${a.index+1} of ${state.items.length} • ${item.points} point${item.points===1?"":"s"}</p>${groupNote}<h1 class="prompt">${item.prompt}</h1><div id="control"></div><div class="question-actions"><button id="flag" class="secondary">${a.flags[item.id]?"Unflag":"Flag for review"}</button><div><button id="prev" class="secondary" ${a.index===0?"disabled":""}>Previous</button>${a.index===state.items.length-1?`<button id="submit">Review & submit</button>`:`<button id="next">Next</button>`}</div></div></section>`;
  root.innerHTML=`<header class="test-head"><div><strong>${state.assessment.label}</strong><span>Session ${state.session} • Untimed${calcLevel?` • Calculator available`:""}</span></div><div class="test-tools">${calcLevel?`<button id="calculator-toggle" class="secondary" aria-expanded="false">Calculator</button>`:""}<button id="home" class="link-button">Exit</button></div></header><div id="calculator-slot"></div><div class="test-layout"><aside class="navigator" aria-label="Question navigator">${state.items.map((q,i)=>`<button data-jump="${i}" class="${i===a.index?"current":""} ${a.responses[q.id]!==undefined?"answered":""}">${i+1}${a.flags[q.id]?" ⚑":""}</button>`).join("")}</aside><main class="question-panel"><div class="question-workspace ${item.stimulus?"with-stimulus":""}">${stimulus}${questionBody}</div></main></div>`;
  root.querySelector("#control").append(renderControl(item,a.responses[item.id],value=>{setResponse(a,item.id,value);saveAttempt(a);render();}));
  root.querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>{a.index=Number(b.dataset.jump);saveAttempt(a);render();});
  root.querySelector("#flag").onclick=()=>{toggleFlag(a,item.id);saveAttempt(a);render();};
  const prev=root.querySelector("#prev"); if(prev) prev.onclick=()=>{a.index--;saveAttempt(a);render();}; const next=root.querySelector("#next"); if(next) next.onclick=()=>{a.index++;saveAttempt(a);render();}; const sub=root.querySelector("#submit"); if(sub) sub.onclick=reviewSubmit;
  const calc=root.querySelector("#calculator-toggle"); if(calc) calc.onclick=()=>{const slot=root.querySelector("#calculator-slot"); if(slot.childElementCount){slot.replaceChildren();calc.setAttribute("aria-expanded","false");}else{slot.append(createCalculator(calcLevel));calc.setAttribute("aria-expanded","true");}};
  root.querySelector("#home").onclick=()=>setState({view:"home"});
}
function reviewSubmit(){ const unanswered=state.items.filter(i=>state.attempt.responses[i.id]===undefined).length, flagged=state.items.filter(i=>state.attempt.flags[i.id]).length; if(!confirm(`Submit this session? ${unanswered} unanswered, ${flagged} flagged. After submission this practice session is locked.`)) return; submitAttempt(state.attempt); setState({view:"results"}); }
function resultsView(){
  const r=scoreAttempt(state.items,state.attempt.responses);
  root.innerHTML=`<section class="panel results"><p class="eyebrow">Unofficial practice result</p><h1>${r.earned} / ${r.possible} points</h1><p class="big-percent">${r.percent}%</p><p>This is performance on this original practice set, <strong>not a MAP scale score or official proficiency classification.</strong></p><h2>By strand</h2>${Object.entries(r.byStrand).map(([k,v])=>`<div class="strand"><span>${k}</span><strong>${v.earned}/${v.possible} (${pct(v.earned,v.possible)}%)</strong></div>`).join("")}<details class="answer-review"><summary>Review answers and explanations</summary>${r.details.map((d,i)=>`<article class="review-item"><h3>${i+1}. ${d.item.prompt}</h3><p><strong>Your response:</strong> ${fmt(state.attempt.responses[d.item.id])}</p><p><strong>Result:</strong> ${d.correct?"Correct":"Incorrect"} • ${d.earned}/${d.possible}</p><p>${d.item.rationale}</p></article>`).join("")}</details><div class="results-actions"><button id="again">Return to grade selection</button></div></section>`;
  root.querySelector("#again").onclick=()=>{clearAttempt();setState({view:"home",assessment:null,attempt:null});};
}
function render(){ if(state.view==="home")home(); else if(state.view==="preflight")preflightView(); else if(state.view==="question")questionView(); else resultsView(); }
render();