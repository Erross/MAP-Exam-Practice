import { SUPPORTED_ITEM_TYPES } from "../config.js";

const sameSet = (a,b) => a.length===b.length && [...a].sort().every((v,i)=>v===[...b].sort()[i]);
const hasUniqueValues = values => Array.isArray(values) && new Set(values.map(v=>typeof v==="object"?JSON.stringify(v):String(v))).size===values.length;

export function validateItem(item){
  const errors=[];
  const required=["id","grade","subject","standard","strand","dok","itemType","points","sessionEligibility","prompt","scoring","rationale","provenance"];
  for (const key of required) if (item[key]===undefined || item[key]===null || item[key]==="") errors.push(`${item.id||"<no-id>"}: missing ${key}`);
  if (!SUPPORTED_ITEM_TYPES.includes(item.itemType)) errors.push(`${item.id}: unsupported itemType ${item.itemType}`);
  if (!Number.isInteger(item.grade) || item.grade<3 || item.grade>8) errors.push(`${item.id}: invalid grade`);
  if (!Number.isFinite(item.dok) || item.dok<1 || item.dok>4) errors.push(`${item.id}: invalid DOK`);
  if (!Number.isFinite(item.points) || item.points<=0) errors.push(`${item.id}: points must be positive`);
  if (!Array.isArray(item.sessionEligibility) || !item.sessionEligibility.length || !item.sessionEligibility.every(Number.isInteger)) errors.push(`${item.id}: sessionEligibility required`);
  if (item.itemType==="multiple_choice") {
    if (!Array.isArray(item.options) || item.options.length<3) errors.push(`${item.id}: multiple_choice requires >=3 options`);
    else if (!hasUniqueValues(item.options)) errors.push(`${item.id}: choices must be distinct`);
    if (item.scoring?.answer===undefined) errors.push(`${item.id}: multiple_choice requires scoring.answer`);
  }
  if (item.itemType==="multi_select") {
    if (!Array.isArray(item.options) || !Array.isArray(item.scoring?.answers)) errors.push(`${item.id}: multi_select requires options and scoring.answers`);
    else if (!hasUniqueValues(item.options)) errors.push(`${item.id}: choices must be distinct`);
  }
  if ((item.itemType==="matching"||item.itemType==="matching_table") && !item.scoring?.matches) errors.push(`${item.id}: matching requires scoring.matches`);
  if (item.itemType==="drag_drop" && !Array.isArray(item.scoring?.order)) errors.push(`${item.id}: drag_drop requires scoring.order`);
  if ((item.itemType==="hotspot"||item.itemType==="hot_text"||item.itemType==="dropdown") && item.scoring?.answer===undefined) errors.push(`${item.id}: ${item.itemType} requires scoring.answer`);
  return errors;
}

export function scoreResponse(item,response){
  if (response===undefined || response===null || response==="") return {earned:0,possible:item.points,correct:false};
  const s=item.scoring||{};
  let correct=false;
  switch(item.itemType){
    case "multiple_choice": case "dropdown": case "hot_text": case "hotspot": correct=response===s.answer; break;
    case "multi_select": correct=Array.isArray(response)&&sameSet(response,s.answers||[]); break;
    case "ebsr": correct=Array.isArray(response)&&response.length===(s.answers||[]).length&&response.every((v,i)=>Array.isArray(s.answers[i])?sameSet(v,s.answers[i]):v===s.answers[i]); break;
    case "matching": case "matching_table": correct=Object.keys(s.matches||{}).every(k=>response?.[k]===s.matches[k]); break;
    case "drag_drop": correct=Array.isArray(response)&&response.length===(s.order||[]).length&&response.every((v,i)=>v===s.order[i]); break;
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
