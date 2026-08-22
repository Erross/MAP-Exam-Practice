import assert from "node:assert/strict";
import { drawPracticeSession,deliveryBundles,seededRandom } from "../js/core/form-builder.js";
import { drawBlueprintForm,validateBlueprintForm } from "../js/blueprints.js";

const item=(id,group,category)=>({
  id,grade:6,subject:"ela",standard:"fixture",strand:category,reportingCategory:category,dok:2,
  itemType:"multiple_choice",points:1,sessionEligibility:[1],prompt:id,options:["A","B","C","D"],
  scoring:{answer:"A"},rationale:"fixture",provenance:"original-synthetic",
  stimulus:group?{id:group,title:group,text:`Stimulus ${group}`} : undefined
});
const bank=[
  item("a1","passage-a","A"),item("a2","passage-a","A"),item("a3","passage-a","A"),
  item("b1","passage-b","B"),item("b2","passage-b","B"),item("b3","passage-b","B"),
  item("c1",null,"C"),item("c2",null,"C")
];

const bundles=deliveryBundles(bank);
assert.equal(bundles.length,4,"Two passage bundles plus two standalone items expected");
assert.equal(bundles.find(b=>b.some(i=>i.id==="a1")).length,3,"passage-a items must share a bundle");

for(let seed=1;seed<=100;seed++){
  const form=drawPracticeSession(bank,1,{maxItems:6,rng:seededRandom(seed)});
  const ids=new Set(form.map(i=>i.id));
  for(const group of [["a1","a2","a3"],["b1","b2","b3"]]){
    const present=group.filter(id=>ids.has(id)).length;
    assert([0,3].includes(present),`practice draw split delivery group ${group.join(",")}`);
  }
}

const pe=(id,group)=>({id,grade:5,subject:"math",standard:"fixture",strand:"Performance Event",dok:2,itemType:"numeric_input",points:1,sessionEligibility:[3],prompt:id,scoring:{answer:1},rationale:"fixture",provenance:"original-synthetic",stimulus:{id:group,title:group,text:group}});
const peBank=[pe("pe-a1","pe-a"),pe("pe-a2","pe-a"),pe("pe-b1","pe-b"),pe("pe-b2","pe-b"),pe("pe-c1","pe-c"),pe("pe-c2","pe-c")];
for(let seed=1;seed<=100;seed++){
  const form=drawPracticeSession(peBank,3,{maxItems:12,rng:seededRandom(seed)});
  assert.equal(new Set(form.map(i=>i.stimulus.id)).size,1,"MAP math practice Session 3 must deliver one performance event");
  assert.equal(form.length,2,"all machine-scorable parts of the chosen PE must stay together");
}

const executableRules=[
  {field:"reportingCategory",value:"A",minPoints:3,maxPoints:3},
  {field:"reportingCategory",value:"B",minPoints:3,maxPoints:3}
];
const blueprint={
  assessmentId:"fixture",officialPointTarget:6,officialPointTargetVerified:true,
  officialConstraints:[{code:"A",label:"A",minPoints:3,maxPoints:3},{code:"B",label:"B",minPoints:3,maxPoints:3}],
  officialRangesVerified:true,verified:true,executable:true,supportedPointTarget:6,constraints:executableRules
};
for(let seed=1;seed<=100;seed++){
  const form=drawBlueprintForm(bank,blueprint,{rng:seededRandom(seed)});
  assert.deepEqual(validateBlueprintForm(form,blueprint),[]);
  assert.deepEqual(new Set(form.map(i=>i.id)),new Set(["a1","a2","a3","b1","b2","b3"]));
}
console.log("PASS: practice and executable-blueprint drawers preserve stimulus groups; MAP math Session 3 delivers one complete performance event.");
