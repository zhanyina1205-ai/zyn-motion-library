import type {ReactNode} from 'react';
import {Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
export type MediaWindowCardProps={media:ReactNode;headline?:ReactNode;caption?:ReactNode;centerX?:number;centerY?:number;
 cardWidth?:number;cardHeight?:number;inset?:number;windowTop?:number;windowHeight?:number;captionTop?:number;captionHeight?:number;headlineTop?:number;
 enterSeconds?:number;fullHoldSeconds?:number;shrinkSeconds?:number;settleSeconds?:number;captionDelaySeconds?:number;captionRevealSeconds?:number;holdSeconds?:number;exitSeconds?:number;
 bounce?:number;paper?:string;captionColor?:string};
export const mediaWindowCardDurationSeconds=({enterSeconds=.35,fullHoldSeconds=.5,shrinkSeconds=.55,settleSeconds=.45,captionDelaySeconds=.15,captionRevealSeconds=.35,holdSeconds=1.45,exitSeconds=.4}:Omit<MediaWindowCardProps,'media'>={})=>enterSeconds+fullHoldSeconds+shrinkSeconds+Math.max(settleSeconds,captionDelaySeconds+captionRevealSeconds)+holdSeconds+exitSeconds;
/** Shrinks the media box, not a frozen screenshot. Media should fill its box
 * (e.g. CanvasImage objectFit: cover), allowing a portrait to reframe continuously. */
export const MediaWindowCard=({media,headline,caption,centerX,centerY,cardWidth=580,cardHeight=780,inset=24,
 windowTop=250,windowHeight=290,captionTop=570,captionHeight=160,headlineTop=45,
 enterSeconds=.35,fullHoldSeconds=.5,shrinkSeconds=.55,settleSeconds=.45,captionDelaySeconds=.15,captionRevealSeconds=.35,holdSeconds=1.45,exitSeconds=.4,
 bounce=65,paper='#eee6f2',captionColor='#f9e2ec'}:MediaWindowCardProps)=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=frame/fps;
 const positive=[cardWidth,cardHeight,windowHeight,captionHeight,enterSeconds,shrinkSeconds,settleSeconds,captionRevealSeconds,exitSeconds];
 const nonnegative=[inset,windowTop,captionTop,headlineTop,fullHoldSeconds,captionDelaySeconds,holdSeconds,bounce];
 if(positive.some(n=>!Number.isFinite(n)||n<=0)||nonnegative.some(n=>!Number.isFinite(n)||n<0)||2*inset>=cardWidth||windowTop+windowHeight>captionTop||captionTop+captionHeight>cardHeight-inset)throw new Error('Invalid MediaWindowCard timing or geometry.');
 const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const},ease=Easing.bezier(.3,0,.15,1);
 const shrinkAt=enterSeconds+fullHoldSeconds,shrinkEnd=shrinkAt+shrinkSeconds;
 const p=interpolate(t,[shrinkAt,shrinkEnd],[0,1],{...clamp,easing:ease});
 const settle=interpolate(t,[shrinkEnd,shrinkEnd+settleSeconds],[0,1],clamp);
 const bump=t<shrinkEnd?bounce*p:bounce*(1-settle)*Math.cos(settle*Math.PI*2);
 const captionAt=shrinkEnd+captionDelaySeconds;
 const cap=interpolate(t,[captionAt,captionAt+captionRevealSeconds],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
 const end=mediaWindowCardDurationSeconds({enterSeconds,fullHoldSeconds,shrinkSeconds,settleSeconds,captionDelaySeconds,captionRevealSeconds,holdSeconds,exitSeconds})-exitSeconds;
 const entrance=interpolate(t,[0,enterSeconds],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
 const exit=interpolate(t,[end,end+Math.max(1/fps,exitSeconds-1/fps)],[0,1],clamp);
 const top=(centerY??height/2)-cardHeight/2,left=(centerX??width/2)-cardWidth/2;
 return <div style={{position:'absolute',left,top,width:cardWidth,height:cardHeight,background:paper,borderRadius:30,overflow:'hidden',boxShadow:'0 20px 48px #74677b24',
  opacity:entrance*(1-exit),translate:`0px ${(1-entrance)*35+exit*35}px`,scale:.96+.04*entrance}}>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 0%, #ccded7, transparent 65%)'}}/>
  <div style={{position:'absolute',left:inset,right:inset,top:headlineTop,opacity:interpolate(p,[.5,.95],[0,1],clamp),
   translate:`0px ${interpolate(p,[.5,1],[40,0],clamp)}`,textAlign:'center'}}>{headline}</div>
  <div style={{position:'absolute',left:inset*p,top:windowTop*p+bump,width:cardWidth-inset*2*p,
   height:cardHeight+(windowHeight-cardHeight)*p,borderRadius:30-(30-22)*p,overflow:'hidden',zIndex:2}}>{media}</div>
  <div style={{position:'absolute',left:inset,right:inset,top:captionTop+(1-cap)*15,height:captionHeight,
   borderRadius:22,background:captionColor,overflow:'hidden',opacity:cap,scale:`${.68+.32*cap} ${.25+.75*cap}`,transformOrigin:'50% 0%',display:'grid',placeItems:'center',padding:24,boxSizing:'border-box'}}>
   <div style={{opacity:interpolate(t,[captionAt+captionRevealSeconds*.55,captionAt+captionRevealSeconds+.12],[0,1],clamp)}}>{caption}</div>
  </div>
 </div>;
};
