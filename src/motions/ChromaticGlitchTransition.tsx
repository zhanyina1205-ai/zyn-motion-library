import type {ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
export type ChromaticGlitchProps={before:ReactNode;after:ReactNode;badge?:ReactNode;
 beforeHoldSeconds?:number;transitionSeconds?:number;afterHoldSeconds?:number;split?:number;sliceShift?:number;
 slices?:number;badgeSize?:number;badgeX?:number;badgeY?:number;colorA?:string;colorB?:string;tintOpacity?:number};
export const chromaticGlitchDurationSeconds=({beforeHoldSeconds=1,transitionSeconds=.9,afterHoldSeconds=1.3}:Pick<ChromaticGlitchProps,'beforeHoldSeconds'|'transitionSeconds'|'afterHoldSeconds'>={})=>beforeHoldSeconds+transitionSeconds+afterHoldSeconds;
/** Deterministic color offsets and horizontal slices; source changes at the midpoint.
 * Content must be visual React markup, free of audio and side effects (it is cloned). */
export const ChromaticGlitchTransition=({before,after,badge,beforeHoldSeconds=1,transitionSeconds=.9,afterHoldSeconds=1.3,
 split=22,sliceShift=30,slices=7,badgeSize=280,badgeX,badgeY,colorA='#f5bdd3',colorB='#ccded7',tintOpacity=.48}:ChromaticGlitchProps)=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=f/fps;
 if(transitionSeconds<=0||beforeHoldSeconds<0||afterHoldSeconds<0||split<0||sliceShift<0||!Number.isInteger(slices)||slices<1||badgeSize<=0||tintOpacity<0||tintOpacity>1)throw new Error('Invalid chromatic glitch parameters.');
 const q=(t-beforeHoldSeconds)/transitionSeconds,active=q>=0&&q<1;
 const strength=active?Math.sin(Math.PI*q):0,content=q<.5?before:after;
 const offset=split*strength*(Math.sin(f*1.73)>.2?1:-1),cx=badgeX??width/2,cy=badgeY??height/2;
 const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
 const badgeExit=beforeHoldSeconds+transitionSeconds+.35;
 const arrive=interpolate(t,[beforeHoldSeconds-.1,beforeHoldSeconds+.35],[0,1],{...clamp,easing:Easing.bezier(.2,1,.3,1)});
 const depart=interpolate(t,[badgeExit,badgeExit+.65],[0,1],{...clamp,easing:Easing.bezier(.55,0,.9,.5)});
 return <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
  <div style={{position:'absolute',inset:0}}>{content}</div>
  {active&&<>
   {[{x:offset,color:colorA},{x:-offset,color:colorB}].map(({x,color},i)=><div key={i} style={{position:'absolute',inset:0,translate:`${x}px 0px`,opacity:tintOpacity*strength,mixBlendMode:'multiply',pointerEvents:'none'}}>
    {content}<div style={{position:'absolute',inset:0,background:color,mixBlendMode:'color'}}/>
   </div>)}
   {Array.from({length:slices},(_,i)=>{
    const shift=Math.sin(f*2.1+i*7.31)*sliceShift*strength;
    const y=(i+.28)*height/slices,h=height/slices*.18;
    return <div key={i} style={{position:'absolute',inset:0,clipPath:`inset(${y}px 0px ${height-y-h}px 0px)`,translate:`${shift}px 0px`,opacity:.85}}>{content}</div>;
   })}
  </>}
  {badge&&t>=beforeHoldSeconds-.1&&depart<1&&<div style={{position:'absolute',left:cx-badgeSize/2,top:cy-badgeSize/2,width:badgeSize,height:badgeSize,
   translate:`${Math.sin(q*4)*18}px ${(1-arrive)*height*.75+depart*height*.75}px`,
   rotate:`${-36+arrive*43-depart*35}deg`,scale:.65+arrive*.35,opacity:Math.min(1,arrive*4)*(1-depart*.2),zIndex:10}}>{badge}</div>}
 </div>;
};
