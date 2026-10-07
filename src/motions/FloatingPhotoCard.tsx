import type {ReactNode} from 'react';
import {CanvasImage,Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';

type MotionProps={
 children:ReactNode;x:number;y:number;width:number;delaySeconds?:number;
 settleSeconds?:number;rise?:number;lateral?:number;depth?:number;angle?:number;
 initialTilt?:number;blur?:number;bob?:number;
};
const eased={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const,easing:Easing.bezier(.16,1,.3,1)};

// Put this inside a parent with perspective:1800 and perspectiveOrigin:'50% 68%'.
// The wrapper can animate any card, independently of the polaroid appearance.
export const FloatingCard=({children,x,y,width,delaySeconds=8/30,settleSeconds=52/30,rise=460,lateral=-55,depth=110,angle=-9,initialTilt=18,blur=depth<0?3:1.5,bob=4}:MotionProps)=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 if(settleSeconds<=0) throw new Error('settleSeconds must be positive');
 const start=delaySeconds*fps;const peak=start+settleSeconds*fps*34/52;const end=start+settleSeconds*fps;
 const delayAt30=delaySeconds*30;
 return <div style={{position:'absolute',left:x,top:y,width,
  rotate:`${angle+interpolate(f,[start,peak,end],[-12,1,0],eased)}deg`,
  translate:`${interpolate(f,[start,end],[lateral,0],eased)}px ${interpolate(f,[start,peak,end],[rise,-6,0],eased)+Math.sin(f/fps*30*.018+delayAt30)*bob}px ${interpolate(f,[start,peak,end],[depth,depth*.12,0],eased)}px`,
  transform:`rotateX(${interpolate(f,[start,end],[initialTilt,0],eased)}deg) rotateY(${interpolate(f,[start,end],[lateral*.15,0],eased)}deg)`,
  filter:`blur(${interpolate(f,[start,start+settleSeconds*fps*30/52],[blur,0],eased)}px)`,
  opacity:interpolate(f,[start,start+16/30*fps],[0,1],eased),
  scale:interpolate(f,[start,peak,end],[.78,1.015,1],eased),
 }}>{children}</div>;
};

export type FloatingPhotoProps=Omit<MotionProps,'children'> & {
 src:string;height:number;caption?:string;fit?:'cover'|'contain';
 ink?:string;paper?:string;tape?:string;showTape?:boolean;
};
export const FloatingPhotoCard=({src,height,caption='',fit='cover',ink='#74677b',paper='#fffdf8',tape='#fff0bdbd',showTape=true,...motion}:FloatingPhotoProps)=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <FloatingCard {...motion}>
  <div style={{position:'relative',padding:'17px 17px 0',background:paper,boxShadow:'4px 15px 28px #74677b22',color:ink}}>
   {showTape&&<div style={{position:'absolute',zIndex:3,top:-21,left:'calc(50% - 73px)',width:146,height:46,rotate:'-7deg',backgroundColor:tape,backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 15px,#b9a77922 15px,#b9a77922 17px)',clipPath:'polygon(3% 0,100% 2%,97% 100%,0 95%)'}}/>}
   <div style={{height,overflow:'hidden',background:'#f0e9dd'}}><CanvasImage src={src} style={{width:'100%',height:'100%',objectFit:fit,scale:1+f/fps*30*.00012}}/></div>
   <div style={{height:82,display:'flex',justifyContent:'center',alignItems:'center',fontSize:24,fontFamily:'Georgia',fontStyle:'italic',whiteSpace:'nowrap'}}>{caption}</div>
  </div>
 </FloatingCard>;
};
