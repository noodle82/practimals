// Gesture rules are separate from the DOM so timing, cancellation and touch
// movement can be tested without depending on a particular browser.
export function createPalGesture({react, stop, schedule=setTimeout, cancel=clearTimeout, holdMs=550, doubleMs=310}) {
 let holdTimer=null,tapTimer=null,pressed=false,holding=false,startX=0,startY=0,moved=false,secondTap=false;
 const clearHold=()=>{if(holdTimer!==null)cancel(holdTimer);holdTimer=null;};
 const clearTap=()=>{if(tapTimer!==null)cancel(tapTimer);tapTimer=null;};
 return {
  down(x=0,y=0){if(pressed)return;secondTap=tapTimer!==null;if(secondTap)clearTap();pressed=true;holding=false;moved=false;startX=x;startY=y;clearHold();holdTimer=schedule(()=>{holdTimer=null;if(!pressed||moved)return;clearTap();secondTap=false;holding=true;react('purr');},holdMs);},
  move(x,y){if(!pressed)return;if(Math.hypot(x-startX,y-startY)>24){moved=true;clearHold();if(holding){holding=false;stop();}}},
  up(){if(!pressed)return;pressed=false;clearHold();if(holding){holding=false;stop();return;}if(moved){secondTap=false;return;}if(secondTap){secondTap=false;react('giggle');}else tapTimer=schedule(()=>{tapTimer=null;react('oof');},doubleMs);},
  cancel(){pressed=false;holding=false;secondTap=false;clearHold();clearTap();stop();},
  dispose(){this.cancel();}
 };
}
