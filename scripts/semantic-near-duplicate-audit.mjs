import { BANKS } from "../js/banks.js";

function normalizePrompt(text=""){
  return String(text)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\b\d+(?:\.\d+)?\b/g,"#")
    .replace(/[^a-z#]+/g," ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function tokenJaccard(a,b){
  const left=new Set(a),right=new Set(b);
  const union=new Set([...left,...right]);
  if(!union.size)return 0;
  let overlap=0;
  for(const token of left)if(right.has(token))overlap++;
  return overlap/union.size;
}

function tokenLcsRatio(a,b){
  if(!a.length||!b.length)return 0;
  const previous=new Uint16Array(b.length+1);
  const current=new Uint16Array(b.length+1);
  for(let i=1;i<=a.length;i++){
    current.fill(0);
    for(let j=1;j<=b.length;j++){
      current[j]=a[i-1]===b[j-1]
        ? previous[j-1]+1
        : Math.max(previous[j],current[j-1]);
    }
    previous.set(current);
  }
  return (2*previous[b.length])/(a.length+b.length);
}

function sharesSession(a,b){
  const right=new Set(b.sessionEligibility||[]);
  return (a.sessionEligibility||[]).some(session=>right.has(session));
}

function sameStimulus(a,b){
  const left=a.stimulus?.id;
  const right=b.stimulus?.id;
  return Boolean(left&&right&&left===right);
}

function sameVariantFamily(a,b){
  return Boolean(a.variantFamily&&b.variantFamily&&a.variantFamily===b.variantFamily);
}

const findings=[];
for(const [assessmentId,bank] of Object.entries(BANKS)){
  for(let i=0;i<bank.length;i++){
    const a=bank[i];
    const aTokens=normalizePrompt(a.prompt);
    if(aTokens.length<8)continue;
    for(let j=i+1;j<bank.length;j++){
      const b=bank[j];
      if(a.itemType!==b.itemType||a.standard!==b.standard||a.dok!==b.dok)continue;
      if(!sharesSession(a,b)||sameStimulus(a,b)||sameVariantFamily(a,b))continue;
      const bTokens=normalizePrompt(b.prompt);
      if(bTokens.length<8)continue;
      const lengthRatio=Math.min(aTokens.length,bTokens.length)/Math.max(aTokens.length,bTokens.length);
      if(lengthRatio<0.70)continue;
      const lcs=tokenLcsRatio(aTokens,bTokens);
      const jaccard=tokenJaccard(aTokens,bTokens);
      if(lcs>=0.86&&jaccard>=0.72){
        findings.push({assessmentId,a:a.id,b:b.id,lcs:Number(lcs.toFixed(3)),jaccard:Number(jaccard.toFixed(3)),promptA:a.prompt,promptB:b.prompt});
      }
    }
  }
}

if(findings.length){
  console.error(`FAIL: ${findings.length} co-eligible near-duplicate prompt pair(s) lack a shared variantFamily.`);
  for(const finding of findings){
    console.error(`${finding.assessmentId}: ${finding.a} <> ${finding.b} (LCS ${finding.lcs}, Jaccard ${finding.jaccard})`);
    console.error(`  A: ${finding.promptA}`);
    console.error(`  B: ${finding.promptB}`);
  }
  process.exitCode=1;
}else{
  console.log("PASS: no high-confidence co-eligible near-duplicate prompt pairs lack a shared variantFamily.");
}
