import type {ReactNode} from 'react';
import {Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
export type FoldPageAlbumProps={leftPage:ReactNode;rightPages:ReactNode[];popup?:ReactNode;centerX?:number;centerY?:number;
 pageWidth?:number;pageHeight?:number;perspective?:number;strips?:number;curlAngle?:number;paper?:string;
 enterSeconds?:number;initialHoldSeconds?:number;turnSeconds?:number;betweenHoldSeconds?:number;popupDelaySeconds?:number;popupSeconds?:number;endHoldSeconds?:number;exitSeconds?:number;
 popupWidth?:number;popupHeight?:number;popupX?:number;popupY?:number;popupDepth?:number};
export const foldPageAlbumDurationSeconds=(pageCount:number,{enterSeconds=.4,initialHoldSeconds=.8,turnSeconds=.8,betweenHoldSeconds=.25,popupDelaySeconds=.3,popupSeconds=.7,endHoldSeconds=1.1,exitSeconds=.4}:Omit<FoldPageAlbumProps,'leftPage'|'rightPages'|'popup'>={})=>enterSeconds+initialHoldSeconds+Math.max(0,pageCount-1)*turnSeconds+Math.max(0,pageCount-2)*betweenHoldSeconds+popupDelaySeconds+popupSeconds+endHoldSeconds+exitSeconds;
/** Each right leaf folds to 90 degrees at the fixed spine, then reveals the next.
 * Its curved surface is approximated by deterministic narrow 3D strips. Page content
 * is cloned across strips: use visual JSX without audio, effects or duplicate DOM IDs. */
export const FoldPageAlbum=({leftPage,rightPages,popup,centerX,centerY,pageWidth=550,pageHeight=640,perspective=3200,strips=12,curlAngle=20,paper='#fffdf8',
 enterSeconds=.4,initialHoldSeconds=.8,turnSeconds=.8,betweenHoldSeconds=.25,popupDelaySeconds=.3,popupSeconds=.7,endHoldSeconds=1.1,exitSeconds=.4,
 popupWidth=220,popupHeight=370,popupX,popupY,popupDepth=65}:FoldPageAlbumProps)=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=frame/fps;
 if(rightPages.length<2||!Number.isInteger(strips)||strips<4||strips>48||[pageWidth,pageHeight,perspective,enterSeconds,turnSeconds,popupSeconds,exitSeconds,popupWidth,popupHeight].some(n=>!Number.isFinite(n)||n<=0)||[curlAngle,initialHoldSeconds,betweenHoldSeconds,popupDelaySeconds,endHoldSeconds,popupDepth].some(n=>!Number.isFinite(n)||n<0)||curlAngle>25)throw new Error('Invalid FoldPageAlbum content, geometry or timing.');
 const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
 const firstTurn=enterSeconds+initialHoldSeconds;
 let page=0,progress=0,turning=false;
 for(let i=0;i<rightPages.length-1;i++){
  const at=firstTurn+i*(turnSeconds+betweenHoldSeconds);
  if(t>=at+turnSeconds){page=i+1;continue;}
  if(t>=at){page=i;progress=interpolate(t,[at,at+turnSeconds],[0,1],{...clamp,easing:Easing.bezier(.35,0,.2,1)});turning=true;}break;
 }
 const lastTurnEnd=firstTurn+(rightPages.length-1)*turnSeconds+(rightPages.length-2)*betweenHoldSeconds;
 const popupAt=lastTurnEnd+popupDelaySeconds;
 const pop=interpolate(t,[popupAt,popupAt+popupSeconds],[0,1],{...clamp,easing:Easing.bezier(.2,1,.3,1)});
 const end=popupAt+popupSeconds+endHoldSeconds;
 const enter=interpolate(t,[0,enterSeconds],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
 const exit=interpolate(t,[end,end+Math.max(1/fps,exitSeconds-1/fps)],[0,1],clamp);
 const cx=centerX??width/2,cy=centerY??height/2,sliceW=pageWidth/strips;
 let x=0,z=0;
 const segments=Array.from({length:strips},(_,i)=>{
  const angle=-(90*progress+curlAngle*Math.sin(progress*Math.PI)*Math.sin((i+.5)/strips*Math.PI));
  const item={i,x,z,angle};x+=sliceW*Math.cos(angle*Math.PI/180);z-=sliceW*Math.sin(angle*Math.PI/180);return item;
 });
 const face=(content:ReactNode)=><div style={{width:pageWidth,height:pageHeight,background:paper,overflow:'hidden'}}>{content}</div>;
 return <div style={{position:'absolute',left:cx-pageWidth,top:cy-pageHeight/2,width:pageWidth*2,height:pageHeight,
  opacity:enter*(1-exit),translate:`0px ${(1-enter)*45+exit*35}px`,scale:.97+.03*enter}}>
  <div style={{position:'absolute',inset:'8px -9px -9px',background:'#d9d4df',borderRadius:8,boxShadow:'0 20px 55px #74677b30'}}/>
  <div style={{position:'absolute',inset:0,perspective,perspectiveOrigin:'50% 50%',transformStyle:'preserve-3d'}}>
   <div style={{position:'absolute',left:0,top:0,width:pageWidth,height:pageHeight}}>{face(leftPage)}</div>
   <div style={{position:'absolute',left:pageWidth,top:0,width:pageWidth,height:pageHeight}}>{face(rightPages[turning?page+1:page])}</div>
   <div style={{position:'absolute',left:pageWidth-18,top:0,width:36,height:pageHeight,background:'linear-gradient(90deg,transparent,#74677b30,transparent)',pointerEvents:'none',zIndex:2}}/>
   {turning&&<div style={{position:'absolute',left:pageWidth,top:0,width:pageWidth,height:pageHeight,transformStyle:'preserve-3d'}}>
    {segments.map(({i,x,z,angle})=><div key={i} style={{position:'absolute',left:0,top:0,width:sliceW+.35,height:pageHeight,transformOrigin:'0% 50%',
     transform:`translate3d(${x}px,0,${z+.5}px) rotateY(${angle}deg)`,transformStyle:'preserve-3d'}}>
     <div style={{position:'absolute',inset:0,overflow:'hidden',backfaceVisibility:'hidden',background:paper}}>
      <div style={{position:'absolute',left:-i*sliceW,top:0}}>{face(rightPages[page])}</div>
      <div style={{position:'absolute',inset:0,background:'#74677b',opacity:Math.sin(progress*Math.PI)*(.05+.12*i/strips)}}/>
     </div>
    </div>)}
   </div>}
   {popup&&pop>0&&<div style={{position:'absolute',left:pageWidth+(popupX??pageWidth*.42)-popupWidth/2,top:(popupY??pageHeight*.52)-popupHeight/2,
    width:popupWidth,height:popupHeight,transformOrigin:'0% 50%',opacity:Math.min(1,pop*6),
    transform:`translate3d(${(1-pop)*-pageWidth*.25}px,0,${pop*popupDepth+1}px) rotateY(${-85*(1-pop)}deg)`,
    filter:`drop-shadow(${pop*9}px ${pop*12}px ${4+pop*8}px #74677b45)`}}>{popup}</div>}
  </div>
 </div>;
};
