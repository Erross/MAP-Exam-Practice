const esc=s=>String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));

function choices(item,current,onChange,multi=false){
  const wrap=document.createElement("div"); wrap.className="choices";
  for(const option of item.options||[]){
    const label=document.createElement("label"); label.className="choice";
    const input=document.createElement("input"); input.type=multi?"checkbox":"radio"; input.name=`q-${item.id}`; input.value=option;
    input.checked=multi?Array.isArray(current)&&current.includes(option):current===option;
    input.addEventListener("change",()=>{ if(multi){ const vals=[...wrap.querySelectorAll("input:checked")].map(x=>x.value); onChange(vals); } else onChange(option); });
    const span=document.createElement("span"); span.textContent=option; label.append(input,span); wrap.append(label);
  }
  return wrap;
}

export function renderControl(item,current,onChange){
  if(item.itemType==="multiple_choice"||item.itemType==="hot_text") return choices(item,current,onChange,false);
  if(item.itemType==="multi_select") return choices(item,current,onChange,true);
  if(item.itemType==="dropdown"){
    const s=document.createElement("select"); s.innerHTML=`<option value="">Choose…</option>${(item.options||[]).map(o=>`<option>${esc(o)}</option>`).join("")}`; s.value=current||""; s.onchange=()=>onChange(s.value); return s;
  }
  if(item.itemType==="numeric_input"||item.itemType==="number_line"||item.itemType==="angle_input"){
    const input=document.createElement("input"); input.type="number"; input.step="any"; input.inputMode="decimal"; input.value=current??""; input.setAttribute("aria-label","Numeric answer"); input.oninput=()=>onChange(input.value===""?"":Number(input.value)); return input;
  }
  if(item.itemType==="coordinate_point"){
    const d=document.createElement("div"); d.className="coordinate"; for(const k of ["x","y"]){ const l=document.createElement("label"); l.textContent=`${k} = `; const i=document.createElement("input"); i.type="number"; i.step="any"; i.value=current?.[k]??""; i.oninput=()=>onChange({...current,[k]:i.value===""?"":Number(i.value)}); l.append(i); d.append(l); } return d;
  }
  if(item.itemType==="matching"){
    const d=document.createElement("div"); d.className="matching"; for(const p of item.pairs||[]){ const l=document.createElement("label"); l.textContent=p.label; const s=document.createElement("select"); s.innerHTML=`<option value="">Choose…</option>${(item.choices||[]).map(o=>`<option>${esc(o)}</option>`).join("")}`; s.value=current?.[p.key]||""; s.onchange=()=>onChange({...current,[p.key]:s.value}); l.append(s); d.append(l); } return d;
  }
  if(item.itemType==="drag_drop"){
    const d=document.createElement("div"); d.className="order-grid"; const vals=Array.isArray(current)?current:[...(item.tokens||[])];
    vals.forEach((v,idx)=>{ const row=document.createElement("div"); row.className="order-row"; const select=document.createElement("select"); select.innerHTML=(item.tokens||[]).map(o=>`<option>${esc(o)}</option>`).join(""); select.value=v; select.onchange=()=>{const n=[...vals];n[idx]=select.value;onChange(n);}; row.append(document.createTextNode(`${idx+1}. `),select); d.append(row); }); return d;
  }
  if(item.itemType==="bar_graph"||item.itemType==="line_plot"){
    const d=document.createElement("div"); d.className="bar-inputs"; const vals=Array.isArray(current)?current:[];
    (item.fields||[]).forEach((f,idx)=>{ const l=document.createElement("label"); l.textContent=f; const i=document.createElement("input"); i.type="number"; i.step="any"; i.value=vals[idx]??""; i.oninput=()=>{const n=[...vals]; n[idx]=i.value===""?null:Number(i.value); onChange(n);}; l.append(i); d.append(l); }); return d;
  }
  if(item.itemType==="ebsr"){
    const d=document.createElement("div"); d.className="ebsr"; const vals=Array.isArray(current)?current:[]; (item.parts||[]).forEach((part,idx)=>{ const fs=document.createElement("fieldset"); const lg=document.createElement("legend"); lg.textContent=`Part ${idx+1}: ${part.prompt}`; fs.append(lg); const pseudo={...item,id:`${item.id}-p${idx}`,options:part.options}; fs.append(choices(pseudo,vals[idx],v=>{const n=[...vals]; n[idx]=v; onChange(n);},false)); d.append(fs);}); return d;
  }
  const p=document.createElement("p"); p.textContent=`Renderer for ${item.itemType} is defined in the schema but not yet enabled in this development bank.`; return p;
}
