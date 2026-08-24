const EXPLICIT_FAMILY_GROUPS=Object.freeze({
  "g3-rectangle-area":["g3m-014","g3m-div-g007"],
  "g3-shaded-fraction":["g3m-018","g3m-div-f002"],
  "g5-place-value-tenths-hundredths":["g5m-013","g5m-div-b002"],
  "g5-pattern-coordinate":["g5m-027","g5m-div-r004"],
  "g5-rectangular-prism-volume":["g5m-033","g5m-div-g004"],
  "g5-coordinate-from-origin":["g5m-feas-006","g5m-div-g008"],
  "g5-shadow-pattern-graph":["g5s-002","g5s-030"],
  "g5-energy-transformation-explanation":["g5s-cap-001","g5s-div-a001"],
  "g6-coordinate-from-axes":["g6m-007","g6m-024"],
  "g7-constant-of-proportionality-match":["g7m-012","g7m-035"],
  "g7-scale-drawing-length":["g7m-cap-010","g7m-div-g001"],
  "g7-circle-circumference":["g7m-cap-013","g7m-div-g004"],
  "g7-angle-sum-equation":["g7m-cap-014","g7m-div-g006"],
  "g8-pythagorean-hypotenuse":["g8m-009","g8m-div-g007"],
  "g8-ticket-system":["g8m-024","g8m-div-e017"],
  "g8-coordinate-reflection":["g8m-026","g8m-div-g001","g8m-div-g002"],
  "g8-coordinate-rotation":["g8m-div-g005","g8m-div-g006"],
  "g8-insulation-design-evaluation":["g8s-001","g8s-div-b001"],
  "g8-closed-system-mass-conservation":["g8s-010","g8s-div-a004"],
  "g8-resource-population-graph":["g8s-017","g8s-cap-002","g8s-div-a008"]
});

const EXPLICIT_VARIANT_FAMILY=new Map();
for(const [family,ids] of Object.entries(EXPLICIT_FAMILY_GROUPS)){
  for(const id of ids){
    if(EXPLICIT_VARIANT_FAMILY.has(id))throw new Error(`${id}: duplicate explicit semantic family assignment`);
    EXPLICIT_VARIANT_FAMILY.set(id,`semantic:${family}`);
  }
}

const REVIEWED_DISTINCT_PAIRS=new Map([
  ["g6m-div-d004|g6m-div-d005","Different statistical measures: median versus range."],
  ["g7m-div-g004|g7m-div-g005","Different circle measures: circumference versus area."]
]);

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

function pairKey(a,b){return [a?.id,b?.id].sort().join("|");}

export function explicitVariantFamily(item){return item?.id?EXPLICIT_VARIANT_FAMILY.get(item.id)||null:null;}

export function implicitVariantFamily(item){
  if(!item||item.variantFamily||explicitVariantFamily(item))return null;
  if(item.subject!=="math"&&item.subject!=="science")return null;
  const template=normalizedNumericPrompt(item.prompt);
  return template?`numeric-template:${template}`:null;
}

export function effectiveVariantFamily(item){
  return item?.variantFamily||explicitVariantFamily(item)||implicitVariantFamily(item)||item?.id;
}

export function reviewedDistinctPair(a,b){return REVIEWED_DISTINCT_PAIRS.get(pairKey(a,b))||null;}

export { EXPLICIT_FAMILY_GROUPS };
