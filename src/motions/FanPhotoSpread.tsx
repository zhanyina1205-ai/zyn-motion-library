import type {ReactNode} from 'react';
import {Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
export type FanPhotoSpreadProps={photos:ReactNode[];width?:number;height?:number;pivotX?:number;pivotY?:number;
 radius?:number;startAngle?:number;endAngle?:number;closedAngle?:number;delaySeconds?:number;openSeconds?:number;
 staggerSeconds?:number;holdSeconds?:number;exitSeconds?:number;borderColor?:string;borderWidth?:number;
 openingEasing?:[number,number,number,number];};
type Options=Omit<FanPhotoSpreadProps,'photos'>;
export const fanPhotoSpreadDurationSeconds=(photoCount:number,{delaySeconds=2.3,openSeconds=.45,
 staggerSeconds=.1,holdSeconds=1.35,exitSeconds=.4}:Options={})=>
 delaySeconds+Math.max(0,photoCount-1)*staggerSeconds+openSeconds+holdSeconds+exitSeconds;
/** Radial photo sectors share one pivot and unfold one by one.
 * Coordinates are local to this fixed-size, clipped fan container. */
export const FanPhotoSpread=({photos,width=1240,height=650,pivotX=280,pivotY=350,radius=1100,
 startAngle=-36,endAngle=10,closedAngle=-85,delaySeconds=2.3,openSeconds=.45,staggerSeconds=.1,
 holdSeconds=1.35,exitSeconds=.4,borderColor='#fffdf8',borderWidth=5,openingEasing=[.16,1,.3,1]}:FanPhotoSpreadProps)=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const span=endAngle-startAngle;
 if(photos.length<2 || [width,height,radius,openSeconds].some(n=>!Number.isFinite(n)||n<=0) ||
  [delaySeconds,staggerSeconds,holdSeconds,exitSeconds,borderWidth].some(n=>!Number.isFinite(n)||n<0) ||
  [pivotX,pivotY,startAngle,endAngle,closedAngle].some(n=>!Number.isFinite(n)) || span<=0 || span>=180 ||
  openingEasing.length!==4 || openingEasing.some(n=>!Number.isFinite(n)) ||
  [openingEasing[0],openingEasing[2]].some(n=>n<0||n>1))throw new Error('Invalid FanPhotoSpread content, angles or timing.');
 const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
 const segment=span/photos.length,rad=segment*Math.PI/180;
 const points=`${pivotX},${pivotY} ${pivotX+radius},${pivotY} ${pivotX+radius*Math.cos(rad)},${pivotY+radius*Math.sin(rad)}`;
 const polygon=`polygon(${pivotX}px ${pivotY}px,${pivotX+radius}px ${pivotY}px,${pivotX+radius*Math.cos(rad)}px ${pivotY+radius*Math.sin(rad)}px)`;
 const exitStart=fanPhotoSpreadDurationSeconds(photos.length,{delaySeconds,openSeconds,staggerSeconds,holdSeconds,exitSeconds})-exitSeconds;
 const exit=exitSeconds===0?Number(t>=exitStart):interpolate(t,[exitStart,exitStart+Math.max(1/fps,exitSeconds-1/fps)],[0,1],clamp);
 return <div style={{position:'absolute',left:0,top:0,width,height,overflow:'hidden',opacity:1-exit}}>
  {photos.map((photo,i)=>{
   const at=delaySeconds+i*staggerSeconds;
   const p=interpolate(t,[at,at+openSeconds],[0,1],{...clamp,easing:Easing.bezier(...openingEasing)});
   const angle=closedAngle+(startAngle+i*segment-closedAngle)*Math.max(0,Math.min(1,p));
   return <div key={i} style={{position:'absolute',inset:0,clipPath:polygon,
    rotate:`${angle}deg`,transformOrigin:`${pivotX}px ${pivotY}px`,opacity:interpolate(t,[at,at+Math.min(.08,openSeconds)],[0,1],clamp)}}>
    <div style={{position:'absolute',left:0,top:0,width:Math.max(width,pivotX+radius+20),height:Math.max(height,pivotY+radius*Math.sin(rad)+20)}}>{photo}</div>
    <svg width={width} height={height} style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'visible'}}>
     <polygon points={points} fill="none" stroke={borderColor} strokeWidth={borderWidth*2} strokeLinejoin="round"/>
    </svg>
   </div>;
  })}
 </div>;
};
