const nativeHue={sprout:155,bunny:280,dragon:25},targetHue={mint:155,lilac:280,peach:25,blue:205};
const uniformColour={forest:[.43,.5,.31],royal:[.61,.64,.38],burgundy:[.95,.45,.39],purple:[.76,.35,.43]};
function hsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;h=(h/6+1)%1;}return[h,s,l];}
function rgb(h,s,l){const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h*6)%2-1)),m=l-c/2;const[a,b,d]=h<1/6?[c,x,0]:h<2/6?[x,c,0]:h<3/6?[0,c,x]:h<4/6?[0,x,c]:h<5/6?[x,0,c]:[c,0,x];return[(a+m)*255,(b+m)*255,(d+m)*255];}
export function recolourSprite(data,width,height,{species,colour,uniform,outfit}){
 const target=uniformColour[uniform]||uniformColour.forest,shift=((targetHue[colour]??155)-(nativeHue[species]??155))/360;
 for(let i=0;i<data.length;i+=4){if(data[i+3]<5)continue;const x=(i/4%width)/width,y=Math.floor(i/4/width)/height;const[h,s,l]=hsl(data[i],data[i+1],data[i+2]);let result=null;
  // Select the actual blue textile pixels. This follows sleeves, fabric edges
  // and knitted folds instead of painting an approximate clothing polygon.
  const cloth=outfit==='school'&&y>.44&&h>.54&&h<.71&&s>.32;
  if(cloth)result=rgb(target[0],target[1],Math.max(.03,Math.min(.94,target[2]+(l-.36)*.9)));
  else{const distance=Math.abs(((h*360-(nativeHue[species]??155)+540)%360)-180);const furRegion=outfit==='school'||y>.86||y<.51&&y>.22||y>.5&&y<.75&&(x<.19||x>.82);if(distance<32&&s>.14&&furRegion)result=rgb((h+shift+1)%1,s,l);}
  if(result){data[i]=result[0];data[i+1]=result[1];data[i+2]=result[2];}
 }return data;
}
