import fs from "node:fs"; import path from "node:path";
const out="_site"; fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});
const roots=["index.html","about.html","official-sources.html","styles.css","js","data"];
for(const src of roots){ const dest=path.join(out,src); fs.cpSync(src,dest,{recursive:true}); }
console.log(`Built ${out}`);
