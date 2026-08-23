import assert from "node:assert/strict";
import { BANKS } from "../js/banks.js";

const bank=BANKS["g5-science"];
assert.equal(bank.length,88,"Grade 5 Science bank must remain 88 items");
const byId=new Map(bank.map(item=>[item.id,item]));
const get=id=>{
  const item=byId.get(id);
  assert.ok(item,`missing ${id}`);
  assert.equal(item.points,1,`${id}: clean-room repair must preserve the 1-point item contract`);
  return item;
};

for(const id of ["g5s-002","g5s-030","g5s-div-b016"]){
  const item=get(id);
  assert.equal(item.standard,"5.ESS.1.B.2",`${id}: wrong expectation`);
  assert.equal(item.itemType,"bar_graph",`${id}: must require representing the shadow data rather than incidental subtraction/vocabulary`);
  assert.match(item.prompt,/graph/i,`${id}: prompt must explicitly require a graphical representation`);
  assert.match(item.prompt,/pattern/i,`${id}: prompt must connect the representation to the daily pattern`);
  assert.equal(item.fields?.length,3,`${id}: expected three time-of-day graph fields`);
  assert.equal(item.scoring?.answer?.length,3,`${id}: graph response must score all three measurements`);
}

for(const id of ["g5s-cap-001","g5s-cap-002","g5s-cap-003","g5s-div-a001","g5s-div-a002"]){
  const item=get(id);
  assert.equal(item.standard,"4.PS.3.B.1",`${id}: wrong expectation`);
  const text=[item.prompt,item.rationale,...(item.options||[])].join(" ");
  assert.match(text,/energy/i,`${id}: task must substantively address energy`);
  assert.match(text,/(transform|transfer)/i,`${id}: task must address energy transformation/transfer rather than data lookup alone`);
  assert.doesNotMatch(item.prompt,/how many (more )?grams|greatest amount of ice melt|greatest temperature increase|how many degrees/i,`${id}: old incidental arithmetic/lookup task returned`);
}

for(const id of ["g5s-cap-008","g5s-div-b008"]){
  const item=get(id);
  assert.equal(item.standard,"5.LS.2.B.1",`${id}: wrong expectation`);
  assert.equal(item.itemType,"matching",`${id}: repaired task must construct/complete a matter-flow model`);
  assert.match(item.prompt,/model/i,`${id}: prompt must explicitly require a model`);
  assert.equal(item.pairs?.length,3,`${id}: expected a three-step model`);
  assert.equal(Object.keys(item.scoring?.matches||{}).length,3,`${id}: all model steps must be scored`);
}

{
  const item=get("g5s-div-a008");
  assert.equal(item.standard,"5.LS.1.C.1");
  assert.equal(item.itemType,"multi_select");
  assert.match(item.prompt,/support the argument/i,"g5s-div-a008 must require evidence for the plant-material argument");
  assert.deepEqual(item.scoring?.answers?.length,2,"g5s-div-a008 must score both evidence components");
  assert.doesNotMatch(item.prompt,/how many grams/i,"g5s-div-a008 must not regress to arithmetic-only plant mass gain");
}

for(const id of ["g5s-div-a014","g5s-div-a018","g5s-div-b013","g5s-div-b014"]){
  const item=get(id);
  assert.equal(item.standard,"4.ESS.2.A.1",`${id}: wrong expectation`);
  const text=[item.prompt,item.rationale,...(item.options||[])].join(" ");
  assert.match(text,/(investigation|evidence)/i,`${id}: task must engage the investigation/evidence demand`);
  assert.match(text,/(erosion|moving water|runoff)/i,`${id}: task must substantively address erosion/surface change`);
  assert.doesNotMatch(item.prompt,/how many (fewer|more) grams|which tray lost the most|example of ____/i,`${id}: old arithmetic/vocabulary-only task returned`);
}

console.log("Grade 5 Science clean-room alignment regression checks passed for 15 repaired items.");
