function applyBinary(a,op,b){
  if(op==="+") return a+b;
  if(op==="−") return a-b;
  if(op==="×") return a*b;
  if(op==="÷") return b===0?NaN:a/b;
  return b;
}

export function createCalculator(level="four-function"){
  const wrap=document.createElement("section"); wrap.className="calculator"; wrap.setAttribute("role","dialog"); wrap.setAttribute("aria-label","Practice calculator");
  let display="0", stored=null, op=null, fresh=true;
  const screen=document.createElement("output"); screen.className="calculator-screen"; screen.textContent=display;
  const grid=document.createElement("div"); grid.className="calculator-grid";
  const update=()=>{screen.textContent=display;};
  const number=n=>{display=fresh?String(n):(display==="0"?String(n):display+String(n)); fresh=false; update();};
  const decimal=()=>{if(fresh){display="0.";fresh=false;}else if(!display.includes("."))display+=".";update();};
  const chooseOp=next=>{const n=Number(display); if(stored!==null&&op&&!fresh){stored=applyBinary(stored,op,n);display=Number.isFinite(stored)?String(stored):"Error";}else stored=n; op=next; fresh=true;update();};
  const equals=()=>{if(stored===null||!op)return; const result=applyBinary(stored,op,Number(display));display=Number.isFinite(result)?String(result):"Error";stored=null;op=null;fresh=true;update();};
  const unary=fn=>{const n=Number(display); const result=fn(n);display=Number.isFinite(result)?String(result):"Error";fresh=true;update();};
  const clear=()=>{display="0";stored=null;op=null;fresh=true;update();};
  const buttons=[];
  if(level==="scientific") buttons.push(["√",()=>unary(Math.sqrt)],["x²",()=>unary(x=>x*x)],["π",()=>{display=String(Math.PI);fresh=true;update();}],["±",()=>unary(x=>-x)]);
  buttons.push(["C",clear],["÷",()=>chooseOp("÷")],["7",()=>number(7)],["8",()=>number(8)],["9",()=>number(9)],["×",()=>chooseOp("×")],["4",()=>number(4)],["5",()=>number(5)],["6",()=>number(6)],["−",()=>chooseOp("−")],["1",()=>number(1)],["2",()=>number(2)],["3",()=>number(3)],["+",()=>chooseOp("+")],["0",()=>number(0)],[".",decimal],["=",equals]);
  for(const [label,handler] of buttons){const b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=handler;grid.append(b);}
  const note=document.createElement("small"); note.textContent=`Local ${level==="scientific"?"scientific":"four-function"} practice calculator. It is not the official DRC calculator interface.`;
  wrap.append(screen,grid,note); return wrap;
}
