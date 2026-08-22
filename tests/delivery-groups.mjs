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

const blueprint={assessmentId:"fixture",officialPointTarget:6,verified:true,supportedPointTarget:6,constraints:[
  {field:"reportingCategory",value:"A",minPoints:3,maxPoints:3},
  {field:"reportingCategory",value:"B",minPoints:3,maxPoints:3}
]};
for(let seed=1;seed<=100;seed++){
  const form=drawBlueprintForm(bank,blueprint,{rng:seededRandom(seed)});
  assert.deepEqual(validateBlueprintForm(form,blueprint),[]);
  assert.deepEqual(new Set(form.map(i=>i.id)),new Set(["a1","a2","a3","b1","b2","b3"]));
}
console.log("PASS: practice and blueprint drawers preserve stimulus delivery groups.");
