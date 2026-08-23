import assert from "node:assert/strict";
import fs from "node:fs";
import { renderControl } from "../js/renderers.js";

const appSource=fs.readFileSync(new URL("../js/app.js",import.meta.url),"utf8");
assert.equal(appSource.includes("if(options.rerender!==false)render()"),false,"response changes must not rebuild the whole question view by default");
assert(appSource.includes("if(options.rerender===true)render()"),"only controls that explicitly request it may trigger a response-change rerender");
assert.match(appSource,/Practice-set size:/,"preflight must explain that practice sets are shorter than full MAP sessions");
assert.match(appSource,/Save & exit/,"in-session exit control must make saved-state behavior clear");
assert.equal(appSource.includes('<main class="question-panel"'),false,"#app is already the page main landmark; question view must not nest a second main element");
assert.match(appSource,/aria-current="step"/,"question navigator must expose the current item accessibly");
assert.match(appSource,/const fmt=v=>v===undefined\?"Not answered":esc\(/,"student-entered responses must be escaped before results HTML interpolation");

class FakeClassList{
  constructor(){this.names=new Set();}
  toggle(name,force){if(force===undefined){if(this.names.has(name)){this.names.delete(name);return false;}this.names.add(name);return true;}if(force)this.names.add(name);else this.names.delete(name);return force;}
  contains(name){return this.names.has(name);}
}
class FakeElement{
  constructor(tag){this.tagName=tag;this.children=[];this.attributes={};this.listeners={};this.classList=new FakeClassList();this.value="";this.checked=false;this.textContent="";this.innerHTML="";}
  append(...nodes){this.children.push(...nodes);}
  setAttribute(name,value){this.attributes[name]=String(value);}
  getAttribute(name){return this.attributes[name];}
  addEventListener(type,handler){this.listeners[type]=handler;}
  querySelectorAll(selector){
    const all=[];
    const visit=node=>{if(!(node instanceof FakeElement))return;if(selector==="input:checked"&&node.tagName==="input"&&node.checked)all.push(node);for(const child of node.children)visit(child);};
    visit(this); return all;
  }
}
globalThis.document={
  createElement:tag=>new FakeElement(tag),
  createTextNode:text=>({nodeType:3,textContent:String(text)})
};
const elements=(root,tag)=>{
  const out=[]; const visit=node=>{if(!(node instanceof FakeElement))return;if(node.tagName===tag)out.push(node);for(const child of node.children)visit(child);};visit(root);return out;
};

const coordinateEvents=[];
const coordinate=renderControl({id:"coord",itemType:"coordinate_point"},{},value=>coordinateEvents.push(structuredClone(value)));
const coordinateInputs=elements(coordinate,"input");
coordinateInputs[0].value="12"; coordinateInputs[0].oninput();
coordinateInputs[1].value="-7"; coordinateInputs[1].oninput();
assert.deepEqual(coordinateEvents.at(-1),{x:12,y:-7},"coordinate editing must preserve earlier fields without relying on a page rerender");

const matchingEvents=[];
const matching=renderControl({id:"match",itemType:"matching",pairs:[{key:"A",label:"A"},{key:"B",label:"B"}],choices:["x","y"]},{},value=>matchingEvents.push(structuredClone(value)));
const matchingSelects=elements(matching,"select");
matchingSelects[0].value="x"; matchingSelects[0].onchange();
matchingSelects[1].value="y"; matchingSelects[1].onchange();
assert.deepEqual(matchingEvents.at(-1),{A:"x",B:"y"},"matching editing must preserve earlier rows without relying on a page rerender");

const graphEvents=[];
const graph=renderControl({id:"graph",itemType:"bar_graph",fields:["A","B"]},[],value=>graphEvents.push(structuredClone(value)));
const graphInputs=elements(graph,"input");
graphInputs[0].value="120"; graphInputs[0].oninput();
graphInputs[1].value="35"; graphInputs[1].oninput();
assert.deepEqual(graphEvents.at(-1),[120,35],"multi-field numeric entry must retain previously typed values without a page rerender");

const hotspotEvents=[];
const hotspot=renderControl({id:"spot",itemType:"hotspot",options:["Region A","Region B"]},null,value=>hotspotEvents.push(value));
const hotspotButtons=elements(hotspot,"button");
hotspotButtons[0].onclick();
assert.equal(hotspotButtons[0].getAttribute("aria-pressed"),"true");
hotspotButtons[1].onclick();
assert.equal(hotspotButtons[0].getAttribute("aria-pressed"),"false");
assert.equal(hotspotButtons[1].getAttribute("aria-pressed"),"true");
assert.equal(hotspotEvents.at(-1),"Region B","hotspot selection must update locally without a page rerender");

console.log("PASS: practice response controls preserve multi-field/multi-digit editing without full-view rerenders, hotspot state updates locally, and key student-facing clarity/accessibility guards are present.");
