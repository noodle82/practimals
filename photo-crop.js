export function clampCrop(c={x:0,y:0,w:1,h:1}){const w=Math.max(.06,Math.min(1,Number(c.w)||.06)),h=Math.max(.06,Math.min(1,Number(c.h)||.06));return{x:Math.max(0,Math.min(1-w,Number(c.x)||0)),y:Math.max(0,Math.min(1-h,Number(c.y)||0)),w,h};}
// Find a connected, pale sheet rather than interpreting patterned surroundings as letters.
export function suggestPhotoCrop(canvas){const small=document.createElement('canvas');small.width=256;small.height=Math.round(256*canvas.height/canvas.width);const ctx=small.getContext('2d');ctx.drawImage(canvas,0,0,small.width,small.height);const{data}=ctx.getImageData(0,0,small.width,small.height),w=small.width,h=small.height,mask=new Uint8Array(w*h);for(let i=0;i<mask.length;i++){const r=data[i*4],g=data[i*4+1],b=data[i*4+2];mask[i]=(r+g+b)/3>164&&Math.max(r,g,b)-Math.min(r,g,b)<68?1:0;}let best=null;for(let i=0;i<mask.length;i++){if(mask[i]!==1)continue;const queue=[i];mask[i]=2;let count=0,minX=w,maxX=0,minY=h,maxY=0;for(let n=0;n<queue.length;n++){const p=queue[n],x=p%w,y=Math.floor(p/w);count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);for(const next of[p-w,p+w,...(x?[p-1]:[]),...(x<w-1?[p+1]:[])])if(next>=0&&next<mask.length&&mask[next]===1){mask[next]=2;queue.push(next);}}const bw=maxX-minX+1,bh=maxY-minY+1,area=bw*bh/(w*h),ratio=bw/bh;if(count<100||area<.025||area>.85||ratio<.12||ratio>1.4||count/(bw*bh)<.45)continue;const centre=1-Math.abs((minX+maxX)/2/w-.5),score=count*centre*(ratio<.85?1.3:1);if(!best||score>best.score)best={score,x:Math.max(0,(minX-2)/w),y:Math.max(0,(minY-2)/h),w:Math.min(w-minX,bw+4)/w,h:Math.min(h-minY,bh+4)/h};}return best?clampCrop(best):{x:.1,y:.08,w:.8,h:.84};}
// Compare ink with the nearby paper, rather than a fixed brightness cut-off.
// A shaded but readable part of a page must not become a solid black area.
export function normalisePhotoLighting(image,width,height){
 const pixels=width*height,grey=new Uint8Array(pixels),stride=width+1,integral=new Uint32Array(stride*(height+1));
 for(let y=0;y<height;y++){let row=0;for(let x=0;x<width;x++){const i=y*width+x,j=i*4;grey[i]=Math.round(image[j]*.299+image[j+1]*.587+image[j+2]*.114);row+=grey[i];integral[(y+1)*stride+x+1]=integral[y*stride+x+1]+row;}}
 const radius=Math.max(12,Math.round(width*.035));
 for(let y=0;y<height;y++){const top=Math.max(0,y-radius),bottom=Math.min(height,y+radius+1);for(let x=0;x<width;x++){const left=Math.max(0,x-radius),right=Math.min(width,x+radius+1),mean=(integral[bottom*stride+right]-integral[top*stride+right]-integral[bottom*stride+left]+integral[top*stride+left])/((right-left)*(bottom-top)),i=y*width+x,j=i*4,v=Math.max(0,Math.min(255,(grey[i]/Math.max(1,mean)-.4)*425));image[j]=image[j+1]=image[j+2]=v;image[j+3]=255;}}
 return image;
}
// Estimate the paper behind the letters with a separable maximum filter.
// Unlike a fixed brightness threshold, this keeps shaded paper light without losing ink.
export function normalisePhotoPaper(image,width,height){
 const grey=new Uint8Array(width*height),horizontal=new Uint8Array(grey.length),paper=new Uint8Array(grey.length),radius=Math.max(5,Math.round(width*.025)),queue=new Int32Array(Math.max(width,height));
 for(let i=0;i<grey.length;i++)grey[i]=Math.round(image[i*4]*.299+image[i*4+1]*.587+image[i*4+2]*.114);
 for(let y=0;y<height;y++){let head=0,tail=0,right=-1;for(let x=0;x<width;x++){const limit=Math.min(width-1,x+radius);while(right<limit){right++;while(tail>head&&grey[y*width+queue[tail-1]]<=grey[y*width+right])tail--;queue[tail++]=right;}while(queue[head]<x-radius)head++;horizontal[y*width+x]=grey[y*width+queue[head]];}}
 for(let x=0;x<width;x++){let head=0,tail=0,bottom=-1;for(let y=0;y<height;y++){const limit=Math.min(height-1,y+radius);while(bottom<limit){bottom++;while(tail>head&&horizontal[queue[tail-1]*width+x]<=horizontal[bottom*width+x])tail--;queue[tail++]=bottom;}while(queue[head]<y-radius)head++;paper[y*width+x]=horizontal[queue[head]*width+x];}}
 for(let i=0;i<grey.length;i++){const v=Math.max(0,Math.min(255,(grey[i]/Math.max(1,paper[i])-.25)*365));image[i*4]=image[i*4+1]=image[i*4+2]=v;image[i*4+3]=255;}
 return image;
}
export function removePhotoRules(image,width,height){
 const rows=[],columns=[];
 for(let y=0;y<height;y++){let count=0;for(let x=0;x<width;x++)if(image[(y*width+x)*4]<130)count++;if(count>width*.7)rows.push(y);}
 for(let x=0;x<width;x++){let count=0;for(let y=0;y<height;y++)if(image[(y*width+x)*4]<130)count++;if(count>height*.75)columns.push(x);}
 const white=(x,y)=>{const j=(y*width+x)*4;image[j]=image[j+1]=image[j+2]=255;};
 for(const y of rows)for(let x=0;x<width;x++)for(let dy=-1;dy<=1;dy++)if(y+dy>=0&&y+dy<height)white(x,y+dy);
 for(const x of columns)for(let y=0;y<height;y++)for(let dx=-1;dx<=1;dx++)if(x+dx>=0&&x+dx<width)white(x+dx,y);
 // Table borders can be slightly slanted. Remove only connected marks spanning
 // nearly the entire crop with the proportions of a thin rule, not word shapes.
 const visited=new Uint8Array(width*height),queue=new Int32Array(width*height);
 for(let i=0;i<visited.length;i++){
  if(visited[i]||image[i*4]>=160)continue;let head=0,tail=1,minX=i%width,maxX=minX,minY=Math.floor(i/width),maxY=minY;queue[0]=i;visited[i]=1;
  while(head<tail){const p=queue[head++],x=p%width,y=Math.floor(p/width);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);for(const q of[p-width,p+width,...(x?[p-1]:[]),...(x<width-1?[p+1]:[])])if(q>=0&&q<visited.length&&!visited[q]&&image[q*4]<160){visited[q]=1;queue[tail++]=q;}}
  const w=maxX-minX+1,h=maxY-minY+1;
  if(w>width*.75&&h<height*.03&&w/h>12||h>height*.8&&w<width*.03&&h/w>12)for(let n=0;n<tail;n++){const p=queue[n],x=p%width,y=Math.floor(p/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>=0&&x+dx<width&&y+dy>=0&&y+dy<height)white(x+dx,y+dy);}
 }
 return image;
}
export function cropPhoto(source,crop,{legacy=false,variant='paper'}={}){
 if(legacy)return legacyPhotoCrop(source,crop);
 const c=clampCrop(crop),sw=Math.max(1,source.width*c.w),sh=Math.max(1,source.height*c.h),scale=Math.min(3,2800/sh,1800/sw),width=Math.max(1,Math.round(sw*scale)),height=Math.max(1,Math.round(sh*scale)),padding=Math.max(16,Math.round(Math.min(width,height)*.025)),out=document.createElement('canvas');
 out.width=width+padding*2;out.height=height+padding*2;const ctx=out.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,out.width,out.height);ctx.drawImage(source,c.x*source.width,c.y*source.height,sw,sh,padding,padding,width,height);
 const image=ctx.getImageData(padding,padding,width,height);
 if(variant==='paper'){normalisePhotoPaper(image.data,width,height);removePhotoRules(image.data,width,height);}
 else if(variant==='adaptive')normalisePhotoLighting(image.data,width,height);
 // The original pixels are useful when filtering removes thin strokes or punctuation.
 ctx.putImageData(image,padding,padding);return out;
}

export function bindPhotoCrop(stage,initial,onChange){let crop=clampCrop(initial),drag=null;const box=stage.querySelector('.photo-crop-box'),ranges=[...stage.parentElement.querySelectorAll('[data-crop-range]')];const paint=()=>{box.style.left=crop.x*100+'%';box.style.top=crop.y*100+'%';box.style.width=crop.w*100+'%';box.style.height=crop.h*100+'%';for(const input of ranges)input.value=Math.round(crop[input.dataset.cropRange]*100);};for(const input of ranges)input.oninput=()=>{const key=input.dataset.cropRange,v=Number(input.value)/100;crop=clampCrop({...crop,[key]:v});onChange({...crop});paint();};box.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();box.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,rect:stage.getBoundingClientRect(),crop:{...crop},resize:!!e.target.closest('[data-crop-handle]')};};box.onpointermove=e=>{if(!drag)return;e.preventDefault();const dx=(e.clientX-drag.x)/drag.rect.width,dy=(e.clientY-drag.y)/drag.rect.height;crop=drag.resize?clampCrop({...drag.crop,w:Math.min(1-drag.crop.x,drag.crop.w+dx),h:Math.min(1-drag.crop.y,drag.crop.h+dy)}):clampCrop({...drag.crop,x:drag.crop.x+dx,y:drag.crop.y+dy});paint();};box.onpointerup=()=>{if(drag)onChange({...crop});drag=null;};box.onpointercancel=()=>drag=null;paint();}

// Retained only as a second pass for small/faint photos that the new filter cannot read.
function legacyPhotoCrop(source,crop){const c=clampCrop(crop),sw=Math.max(1,source.width*c.w),sh=Math.max(1,source.height*c.h),scale=Math.min(4,3600/sh,2200/sw),out=document.createElement('canvas');out.width=Math.round(sw*scale);out.height=Math.round(sh*scale);const ctx=out.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,out.width,out.height);ctx.drawImage(source,c.x*source.width,c.y*source.height,sw,sh,0,0,out.width,out.height);const img=ctx.getImageData(0,0,out.width,out.height);for(let i=0;i<img.data.length;i+=4){const grey=img.data[i]*.299+img.data[i+1]*.587+img.data[i+2]*.114,v=Math.max(0,Math.min(255,(grey-160)*255/75));img.data[i]=img.data[i+1]=img.data[i+2]=v;}ctx.putImageData(img,0,0);return out;}

