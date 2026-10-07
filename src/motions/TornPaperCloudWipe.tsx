import type {ReactNode} from 'react';
import {AbsoluteFill,Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
export type TornPaperCloudWipeProps={before:ReactNode;after:ReactNode;accent?:ReactNode;beforeHoldSeconds?:number;
 wipeSeconds?:number;afterHoldSeconds?:number;paper?:string;roughness?:number;direction?:'left'|'right';
 accentSize?:number;accentX?:number;accentY?:number};
export const tornPaperCloudWipeDurationSeconds=({beforeHoldSeconds=1,wipeSeconds=1.8,afterHoldSeconds=1.4}:
 Omit<TornPaperCloudWipeProps,'before'|'after'|'accent'>={})=>beforeHoldSeconds+wipeSeconds+afterHoldSeconds;
export const TornPaperCloudWipe=({before,after,accent,beforeHoldSeconds=1,wipeSeconds=1.8,afterHoldSeconds=1.4,
 paper='#fffdf8',roughness=28,direction='left',accentSize=220,accentX,accentY}:TornPaperCloudWipeProps)=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=f/fps;
 if([wipeSeconds,accentSize].some(n=>!Number.isFinite(n)||n<=0)||[beforeHoldSeconds,afterHoldSeconds,roughness].some(n=>!Number.isFinite(n)||n<0)||roughness>80||!['left','right'].includes(direction))
  throw new Error('Invalid TornPaperCloudWipe timing or geometry.');
 const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
 const phase=(t-beforeHoldSeconds)/wipeSeconds;
 const enter=interpolate(phase,[0,.48],[0,1],{...clamp,easing:Easing.bezier(.4,0,.2,1)});
 const leave=interpolate(phase,[.55,1],[0,1],{...clamp,easing:Easing.bezier(.4,0,.2,1)});
 const dir=direction==='left'?-1:1;
 // A deterministic uneven contour. No reference image or random runtime state.
 const edge=Array.from({length:81},(_,i)=>`${900+130*Math.sin(i*.17)+roughness*(Math.sin(i*1.7)+.45*Math.sin(i*4.3))},${i*12.5}`).join(' ');
 const backEdge=Array.from({length:81},(_,i)=>`${80+60*Math.sin(i*.19)+roughness*.3*Math.sin(i*2.1)},${i*12.5}`).reverse().join(' ');
 const shape=<svg width="100%" height="100%" viewBox="0 0 1080 1000" preserveAspectRatio="none">
  <polygon points={`${edge} ${backEdge}`} fill={paper}/>
 </svg>;
 const size=width*1.8,travel=dir*width*2.6*leave;
 const aX=interpolate(enter,[0,1],[-size,-width*.3])+travel;
 const bX=interpolate(enter,[0,1],[width+size*.1,0])+travel;
 const pop=interpolate(phase,[.25,.58],[0,1],clamp),fade=interpolate(phase,[.75,1],[1,0],clamp);
 return <AbsoluteFill style={{overflow:'hidden'}}>
  <AbsoluteFill>{phase>=.5?after:before}</AbsoluteFill>
  {phase>=0&&phase<1&&<AbsoluteFill style={{pointerEvents:'none'}}>
   <div style={{position:'absolute',left:aX,top:-height*.1,width:size,height:height*1.2,filter:'drop-shadow(4px 0 5px #74677b12)'}}>{shape}</div>
   <div style={{position:'absolute',left:bX,top:-height*.1,width:size,height:height*1.2,transform:'scaleX(-1)'}}>{shape}</div>
   {accent&&<div style={{position:'absolute',left:(accentX??width*.54)-accentSize/2+dir*leave*width*.7,
    top:(accentY??height*.67)-accentSize/2+(1-pop)*height*.4,width:accentSize,height:accentSize,
    opacity:pop*fade,transform:`rotate(${dir*leave*12}deg) scale(${.7+.3*pop})`}}>{accent}</div>}
  </AbsoluteFill>}
 </AbsoluteFill>;
};
