function normalizedNumericPrompt(prompt=""){
  const raw=String(prompt).normalize("NFKD").toLowerCase();
  const hasNumeric=/\d/.test(raw);
  if(!hasNumeric)return null;
  const normalized=raw
    .replace(/\b\d+(?:\.\d+)?\b/g,"#")
    .replace(/[^a-z#]+/g," ")
    .trim()
    .replace(/\s+/g," ");
  return normalized.split(" ").length>=6?normalized:null;
}

export function implicitVariantFamily(item){
  if(!item||item.variantFamily)return null;
  if(item.subject!=="math"&&item.subject!=="science")return null;
  const template=normalizedNumericPrompt(item.prompt);
  return template?`numeric-template:${template}`:null;
}

export function effectiveVariantFamily(item){
  return item?.variantFamily||implicitVariantFamily(item)||item?.id;
}
