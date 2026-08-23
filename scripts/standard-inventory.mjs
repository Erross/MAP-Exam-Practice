import { BANKS } from "../js/banks.js";

const assessments={};
const subjects={};
for(const [assessmentId,bank] of Object.entries(BANKS)){
  const rows=new Map();
  for(const item of bank){
    const code=item.standard;
    const current=rows.get(code)||{standard:code,count:0,strands:new Set(),itemIds:[]};
    current.count+=1;
    if(item.strand)current.strands.add(item.strand);
    current.itemIds.push(item.id);
    rows.set(code,current);
  }
  const standards=[...rows.values()]
    .sort((a,b)=>a.standard.localeCompare(b.standard))
    .map(row=>({...row,strands:[...row.strands].sort()}));
  assessments[assessmentId]={itemCount:bank.length,standardCount:standards.length,standards};
  const subject=bank[0]?.subject||assessmentId.split("-")[1];
  subjects[subject]??=new Map();
  for(const row of standards){
    const current=subjects[subject].get(row.standard)||{standard:row.standard,count:0,assessments:new Set(),strands:new Set()};
    current.count+=row.count;
    current.assessments.add(assessmentId);
    row.strands.forEach(value=>current.strands.add(value));
    subjects[subject].set(row.standard,current);
  }
}
const subjectSummary={};
for(const [subject,rows] of Object.entries(subjects)){
  subjectSummary[subject]=[...rows.values()]
    .sort((a,b)=>a.standard.localeCompare(b.standard))
    .map(row=>({...row,assessments:[...row.assessments].sort(),strands:[...row.strands].sort()}));
}
process.stdout.write(`${JSON.stringify({generatedFrom:"browser-effective BANKS",assessments,subjects:subjectSummary},null,2)}\n`);
