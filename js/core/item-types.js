import { SUPPORTED_ITEM_TYPES } from "../config.js";

const sameSet = (a,b) => a.length===b.length && [...a].sort().every((v,i)=>v===[...b].sort()[i]);

export function validateItem(item){
  const errors=[];
  const required=["id","grade","subject","standard","strand","dok","itemType","points","sessionEligibility","prompt","scoring","rationale","provenance"];
  for (const key of required) if (item[key]===undefined || item[key]===null || item[key]==="") errors.push(`${item.id||"<no-id>"}: missing ${key}`);
  if (!SUPPORTED_ITEM_TYPES.includes(item.itemType)) errors.push(`${item.id}: unsupported itemType ${item.itemType}`);
  if (!Number.isFinite(item.points) || item.points<=0) errors.push(`${item.id}: points must be positive`);
  if (!Array.isArray(item.sessionEligibility) || !item.sessionEligibility.length) errors.push(`${item.id}: sessionEligibility required`);
  if (item.itemType==="multiple_choice" && (!Array.isArray(item.options) || item.options.length<3)) errors.push(`${item.id}: multiple_choice requires >=3 options`);
  if (item.itemType==="multi_select" && (!Array.isArray(item.options) || !Array.isArray(item.scoring?.answers))) errors.push(`${item.id}: multi_select requires options and scoring.answers`);
  return errors;
}

export function scoreResponse(item,response){
  if (response===undefined || response===null || response==="") return {earned:0,possible:item.points,correct:false};
  const s=item.scoring||{};
  let correct=false;
  switch(item.itemType){
    case "multiple_choice": case "dropdown": case "hot_text": correct=response===s.answer; break;
    case "multi_select": correct=Array.isArray(response)&&sameSet(response,s.answers||[]); break;
    case "ebsr": correct=Array.isArray(response)&&response.length===(s.answers||[]).length&&response.every((v,i)=>Array.isArray(s.answers[i])?sameSet(v,s.answers[i]):v===s.answers[i]); break;
    case "matching": correct=Object.keys(s.matches||{}).every(k=>response?.[k]===s.matches[k]); break;
    case "drag_drop": correct=Array.isArray(response)&&sameSet(response.map((v,i)=>`${i}:${v}`),(s.order||[]).map((v,i)=>`${i}:${v}`)); break;
    case "numeric_input": case "number_line": case "angle_input": {
      const n=Number(response), target=Number(s.answer), tol=Number(s.tolerance||0); correct=Number.isFinite(n)&&Math.abs(n-target)<=tol; break;
    }
    case "coordinate_point": correct=Number(response?.x)===Number(s.answer?.x)&&Number(response?.y)===Number(s.answer?.y); break;
    case "coordinate_line": correct=Number(response?.x1)===Number(s.answer?.x1)&&Number(response?.y1)===Number(s.answer?.y1)&&Number(response?.x2)===Number(s.answer?.x2)&&Number(response?.y2)===Number(s.answer?.y2); break;
    case "line_plot": case "bar_graph": correct=JSON.stringify(response)===JSON.stringify(s.answer); break;
    case "clock_input": correct=Number(response?.hour)===Number(s.answer?.hour)&&Number(response?.minute)===Number(s.answer?.minute); break;
    default: correct=false;
  }
  return {earned:correct?item.points:0,possible:item.points,correct};
}
