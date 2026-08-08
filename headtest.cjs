const sharp=require("sharp"),fs=require("fs");
const OUT='C:/Users/KANYAR~1/AppData/Local/Temp/claude/c--Users-Kanyarakr-wecci/4118f630-334e-4ef1-b01a-23ef38be06d4/scratchpad/';
const W=1280,H=1600, HEAD_TARGET=0.26, HEAD_TOP=0.10;

async function measure(src){
  const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:w,height:h,channels:ch}=info;
  const rows=new Array(h).fill(null);
  for(let y=0;y<h;y++){
    let min=-1,max=-1;
    for(let x=0;x<w;x++){ if(data[(y*w+x)*ch+3]>40){ if(min<0)min=x; max=x; } }
    if(min>=0) rows[y]={min,max,width:max-min+1};
  }
  const headTop=rows.findIndex(r=>r&&r.width>w*0.008);
  if(headTop<0) return null;
  let peak=0,peakY=headTop;
  for(let y=headTop;y<h;y++){
    const r=rows[y]; if(!r) continue;
    if(r.width>=peak){ peak=r.width; peakY=y; }
    else if(r.width<peak*0.92 && y-headTop>20)
      return {headTop,headWidth:peak,cx:(rows[peakY].min+rows[peakY].max)/2,w,h,neck:y};
  }
  return {headTop,headWidth:peak,cx:(rows[peakY].min+rows[peakY].max)/2,w,h,neck:null};
}

/** วางรูปที่ย่อ/ขยายแล้วลงผืน โดยตัดส่วนที่ล้นออกก่อน sharp จะได้ไม่ปฏิเสธ */
async function place(resizedBuf,nw,nh,left,top){
  const sx=Math.max(0,-left), sy=Math.max(0,-top);
  const ex=Math.min(nw,W-left), ey=Math.min(nh,H-top);
  if(ex<=sx||ey<=sy) return null;
  const cropped=await sharp(resizedBuf).extract({left:sx,top:sy,width:ex-sx,height:ey-sy}).toBuffer();
  return sharp({create:{width:W,height:H,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
    .composite([{input:cropped,left:left+sx,top:top+sy}]).png().toBuffer();
}

(async()=>{
const files=fs.readdirSync("public/uploads").filter(f=>f.endsWith("-portrait.webp"));
const tiles=[];
for(const f of files){
  const src="public/uploads/"+f;
  const m=await measure(src);
  const scale=(W*HEAD_TARGET)/m.headWidth;
  const nw=Math.round(m.w*scale), nh=Math.round(m.h*scale);
  const resized=await sharp(src).resize(nw,nh,{fit:"fill"}).toBuffer();
  const buf=await place(resized,nw,nh,Math.round(W/2-m.cx*scale),Math.round(H*HEAD_TOP-m.headTop*scale));
  console.log(f.slice(0,24).padEnd(26),`headW=${m.headWidth} neck=${m.neck} scale=${scale.toFixed(2)}`);
  tiles.push(await sharp(buf).resize(200,250).flatten({background:'#bfe9ec'}).png().toBuffer());
}
await sharp({create:{width:200*tiles.length,height:250,channels:3,background:'#ffffff'}})
 .composite(tiles.map((b,i)=>({input:b,left:i*200,top:0}))).png().toFile(OUT+'heads2.png');
console.log('ok');
})();
