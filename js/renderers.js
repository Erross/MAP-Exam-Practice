const esc=s=>String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));

function choices(item,current,onChange,multi=false){
  const wrap=document.createElement("div"); wrap.className="choices";
  for(const option of item.options||[]){
    const value=typeof option==="object"?option.value:option;
    const text=typeof option==="object"?(option.label??option.value):option;
    const label=document.createElement("label"); label.className="choice";
    const input=document.createElement("input"); input.type=multi?"checkbox":"radio"; input.name=`q-${item.id}`; input.value=value;
    input.checked=multi?Array.isArray(current)&&current.includes(value):current===value;
    input.addEventListener("change",()=>{ if(multi){ const vals=[...wrap.querySelectorAll("input:checked")].map(x=>x.value); onChange(vals); } else onChange(value); });
    const span=document.createElement("span"); span.textContent=text; label.append(input,span); wrap.append(label);
  }
  return wrap;
}

function numeric(current,onChange,label="Numeric answer"){
  const input=document.createElement("input"); input.type="number"; input.step="any"; input.inputMode="decimal"; input.value=current??""; input.setAttribute("aria-label",label); input.oninput=()=>onChange(input.value===""?"":Number(input.value)); return input;
}

function coordinateFields(keys,current,onChange){
  const d=document.createElement("div"); d.className="coordinate"; let vals={...(current||{})};
  for(const k of keys){
    const l=document.createElement("label"); l.textContent=`${k} = `; const i=document.createElement("input"); i.type="number"; i.step="any"; i.value=vals[k]??"";
    i.oninput=()=>{vals={...vals,[k]:i.value===""?"":Number(i.value)};onChange(vals);}; l.append(i); d.append(l);
  }
  return d;
}

function matching(item,current,onChange){
  const d=document.createElement("div"); d.className="matching"; let vals={...(current||{})};
  for(const p of item.pairs||item.rows||[]){
    const key=p.key??p.id; const labelText=p.label??p.prompt??key; const l=document.createElement("label"); l.textContent=labelText;
    const s=document.createElement("select"); s.innerHTML=`<option value="">Choose…</option>${(item.choices||item.columns||[]).map(o=>{const v=typeof o==="object"?(o.value??o.key):o;const t=typeof o==="object"?(o.label??v):o;return `<option value="${esc(v)}">${esc(t)}</option>`;}).join("")}`;
    s.value=vals[key]||""; s.onchange=()=>{vals={...vals,[key]:s.value};onChange(vals);}; l.append(s); d.append(l);
  }
  return d;
}

function ordering(item,current,onChange){
  const d=document.createElement("div"); d.className="order-grid"; const tokens=[...(item.tokens||item.options||[])];
  const validCurrent=Array.isArray(current)&&current.length===tokens.length&&current.every(v=>tokens.includes(v))&&new Set(current).size===tokens.length;
  let vals=validCurrent?[...current]:[...tokens];
  const list=document.createElement("div"); list.className="order-list";
  const send=()=>onChange([...vals]);
  const redraw=()=>{
    list.replaceChildren();
    vals.forEach((value,index)=>{
      const row=document.createElement("div"); row.className="order-row"; row.setAttribute("data-position",String(index+1));
      const position=document.createElement("span"); position.className="order-position"; position.textContent=`${index+1}`;
      const token=document.createElement("strong"); token.className="order-token"; token.textContent=String(value);
      const controls=document.createElement("span"); controls.className="order-controls";
      const up=document.createElement("button"); up.type="button"; up.className="secondary order-move"; up.textContent="↑"; up.title=`Move ${value} earlier`; up.setAttribute("aria-label",`Move ${value} earlier`); up.disabled=index===0;
      const down=document.createElement("button"); down.type="button"; down.className="secondary order-move"; down.textContent="↓"; down.title=`Move ${value} later`; down.setAttribute("aria-label",`Move ${value} later`); down.disabled=index===vals.length-1;
      up.onclick=()=>{if(index===0)return; [vals[index-1],vals[index]]=[vals[index],vals[index-1]]; send(); redraw();};
      down.onclick=()=>{if(index===vals.length-1)return; [vals[index+1],vals[index]]=[vals[index],vals[index+1]]; send(); redraw();};
      controls.append(up,down); row.append(position,token,controls); list.append(row);
    });
  };
  redraw();
  const confirm=document.createElement("button"); confirm.type="button"; confirm.className="secondary order-confirm"; confirm.textContent="Use this order"; confirm.onclick=send;
  const help=document.createElement("small"); help.textContent="Reorder the tokens with the arrow controls, then use this order. Each token can appear exactly once.";
  d.append(list,confirm,help); return d;
}

function dataEntry(item,current,onChange){
  const d=document.createElement("div"); d.className="bar-inputs"; let vals=Array.isArray(current)?[...current]:[];
  (item.fields||[]).forEach((f,idx)=>{ const l=document.createElement("label"); l.textContent=typeof f==="object"?(f.label??f.key):f; const i=document.createElement("input"); i.type="number"; i.step="any"; i.value=vals[idx]??""; i.oninput=()=>{const n=[...vals]; n[idx]=i.value===""?null:Number(i.value); vals=n; onChange(vals);}; l.append(i); d.append(l); }); return d;
}

function hotspot(item,current,onChange){
  const d=document.createElement("div"); d.className="hotspots"; let selected=current;
  const buttons=[];
  const refresh=()=>buttons.forEach(({button,value})=>{const active=selected===value;button.classList.toggle("selected",active);button.setAttribute("aria-pressed",String(active));});
  for(const region of item.regions||item.options||[]){ const value=typeof region==="object"?(region.value??region.id):region; const label=typeof region==="object"?(region.label??region.value??region.id):region; const b=document.createElement("button"); b.type="button"; b.className="hotspot"; b.textContent=label; b.onclick=()=>{selected=value;refresh();onChange(value);}; buttons.push({button:b,value}); d.append(b); }
  refresh(); return d;
}

function clockInput(current,onChange){
  const d=document.createElement("div"); d.className="clock-input";
  const hour=document.createElement("select"); hour.setAttribute("aria-label","Hour"); hour.innerHTML=`<option value="">Hour</option>${Array.from({length:12},(_,i)=>`<option>${i+1}</option>`).join("")}`; hour.value=current?.hour??"";
  const minute=document.createElement("select"); minute.setAttribute("aria-label","Minute"); minute.innerHTML=`<option value="">Minute</option>${Array.from({length:60},(_,i)=>`<option>${String(i).padStart(2,"0")}</option>`).join("")}`; minute.value=current?.minute===undefined?"":String(current.minute).padStart(2,"0");
  const send=()=>onChange({hour:hour.value===""?"":Number(hour.value),minute:minute.value===""?"":Number(minute.value)}); hour.onchange=send; minute.onchange=send; d.append(hour,document.createTextNode(" : "),minute); return d;
}

function constructedResponse(item,current,onChange){
  const d=document.createElement("div"); d.className="constructed-response";
  const textarea=document.createElement("textarea"); textarea.rows=Number(item.responseRows||6); textarea.value=typeof current==="string"?current:""; textarea.setAttribute("aria-label","Constructed response");
  if(Number.isFinite(item.maxLength)&&item.maxLength>0) textarea.maxLength=item.maxLength;
  textarea.oninput=()=>onChange(textarea.value);
  const help=document.createElement("small"); help.textContent="Your response is saved in this browser for review. This practice site does not automatically score written responses.";
  d.append(textarea,help); return d;
}

export function renderControl(item,current,onChange){
  if(item.itemType==="multiple_choice"||item.itemType==="hot_text") return choices(item,current,onChange,false);
  if(item.itemType==="multi_select") return choices(item,current,onChange,true);
  if(item.itemType==="hotspot") return hotspot(item,current,onChange);
  if(item.itemType==="dropdown"){
    const s=document.createElement("select"); s.setAttribute("aria-label","Choose an answer"); s.innerHTML=`<option value="">Choose…</option>${(item.options||[]).map(o=>`<option>${esc(o)}</option>`).join("")}`; s.value=current||""; s.onchange=()=>onChange(s.value); return s;
  }
  if(item.itemType==="numeric_input"||item.itemType==="number_line"||item.itemType==="angle_input") return numeric(current,onChange,item.itemType==="angle_input"?"Angle in degrees":"Numeric answer");
  if(item.itemType==="coordinate_point") return coordinateFields(["x","y"],current,onChange);
  if(item.itemType==="coordinate_line") return coordinateFields(["x1","y1","x2","y2"],current,onChange);
  if(item.itemType==="matching"||item.itemType==="matching_table") return matching(item,current,onChange);
  if(item.itemType==="drag_drop") return ordering(item,current,onChange);
  if(item.itemType==="bar_graph"||item.itemType==="line_plot") return dataEntry(item,current,onChange);
  if(item.itemType==="clock_input") return clockInput(current,onChange);
  if(item.itemType==="constructed_response") return constructedResponse(item,current,onChange);
  if(item.itemType==="ebsr"){
    const d=document.createElement("div"); d.className="ebsr"; let vals=Array.isArray(current)?[...current]:[];
    (item.parts||[]).forEach((part,idx)=>{ const fs=document.createElement("fieldset"); const lg=document.createElement("legend"); lg.textContent=`Part ${idx+1}: ${part.prompt}`; fs.append(lg); const pseudo={...item,id:`${item.id}-p${idx}`,options:part.options}; fs.append(choices(pseudo,vals[idx],v=>{const n=[...vals]; n[idx]=v; vals=n; onChange(vals);},Boolean(part.multi))); d.append(fs);}); return d;
  }
  const p=document.createElement("p"); p.className="warning-text"; p.textContent=`This development item uses an unsupported renderer (${item.itemType}). It cannot be released.`; return p;
}
