import type {ReactNode} from 'react';
import {Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
export type CollagePosterLayer={id:string;content:ReactNode;x:number;y:number;width:number;height:number;
 delaySeconds?:number;enterSeconds?:number;fromX?:number;fromY?:number;fromScale?:number;fromRotation?:number;
 rotation?:number;spinDegreesPerSecond?:number;swayDegrees?:number;swayPeriodSeconds?:number;zIndex?:number};
export type LayeredCollagePosterProps={layers:CollagePosterLayer[];background?:ReactNode;centerX?:number;centerY?:number;
 posterWidth?:number;posterHeight?:number;holdSeconds?:number;exitSeconds?:number;paper?:string};
export const layeredCollagePosterDurationSeconds=(layers:Pick<CollagePosterLayer,'delaySeconds'|'enterSeconds'>[],
 {holdSeconds=1.7,exitSeconds=.5}:Pick<LayeredCollagePosterProps,'holdSeconds'|'exitSeconds'>={})=>
 Math.max(0,...layers.map(l=>(l.delaySeconds??0)+(l.enterSeconds??.8)))+holdSeconds+exitSeconds;
export const LayeredCollagePoster=({layers,background,centerX,centerY,posterWidth=1200,posterHeight=650,
 holdSeconds=1.7,exitSeconds=.5,paper='#fffdf8'}:LayeredCollagePosterProps)=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=f/fps;
 if(!layers.length || new Set(layers.map(l=>l.id)).size!==layers.length || [posterWidth,posterHeight,exitSeconds].some(n=>!Number.isFinite(n)||n<=0)||!Number.isFinite(holdSeconds)||holdSeconds<0)
  throw new Error('Invalid collage geometry, timing or layer IDs.');
 const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
 const duration=layeredCollagePosterDurationSeconds(layers,{holdSeconds,exitSeconds});
 const exit=interpolate(t,[duration-exitSeconds,duration-1/fps],[0,1],clamp);
 return <div style={{position:'absolute',left:(centerX??width/2)-posterWidth/2,top:(centerY??height/2)-posterHeight/2,
  width:posterWidth,height:posterHeight,opacity:1-exit,translate:`0px ${exit*25}px`}}>
  <div style={{position:'absolute',inset:-18,background:paper,borderRadius:8,boxShadow:'0 15px 45px #74677b22'}}/>
  <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#ccded7'}}>{background}
  {layers.map(({id,content,x,y,width:w,height:h,delaySeconds=0,enterSeconds=.8,fromX=0,fromY=80,fromScale=1,fromRotation=0,
   rotation=0,spinDegreesPerSecond=0,swayDegrees=0,swayPeriodSeconds=3,zIndex},i)=>{
   if([x,y,fromX,fromY,fromRotation,rotation,spinDegreesPerSecond,swayDegrees].some(n=>!Number.isFinite(n)) ||
    [w,h,enterSeconds,fromScale,swayPeriodSeconds].some(n=>!Number.isFinite(n)||n<=0)||!Number.isFinite(delaySeconds)||delaySeconds<0)
    throw new Error('Invalid collage layer: '+id);
   const p=interpolate(t,[delaySeconds,delaySeconds+enterSeconds],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
   const elapsed=Math.max(0,t-delaySeconds);
   return <div key={id} style={{position:'absolute',left:x,top:y,width:w,height:h,zIndex:zIndex??i,opacity:p,
    transform:`translate(${fromX*(1-p)}px,${fromY*(1-p)}px) scale(${fromScale+(1-fromScale)*p}) rotate(${rotation+fromRotation*(1-p)+elapsed*spinDegreesPerSecond+Math.sin(elapsed/swayPeriodSeconds*Math.PI*2)*swayDegrees*p}deg)`}}>{content}</div>;
  })}</div>
 </div>;
};
