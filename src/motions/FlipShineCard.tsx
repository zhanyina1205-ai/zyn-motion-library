import type {CSSProperties, ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type FlipShineCardProps = {
  front: ReactNode; back: ReactNode;
  centerX?: number; centerY?: number; cardWidth?: number; cardHeight?: number;
  perspective?: number; radius?: number; direction?: 'left' | 'right';
  enterSeconds?: number; frontHoldSeconds?: number; flipSeconds?: number;
  shineEnabled?: boolean; shineDelaySeconds?: number; shineSeconds?: number;
  endHoldSeconds?: number; exitSeconds?: number;
  shineIntensity?: number; shineWidth?: number; shineAngle?: number;
  flipEasing?: [number, number, number, number];
};
type Options = Omit<FlipShineCardProps, 'front' | 'back'>;
export const flipShineCardDurationSeconds = ({enterSeconds=.35, frontHoldSeconds=.85,
  flipSeconds=.4, shineEnabled=true, shineDelaySeconds=1.25, shineSeconds=.6,
  endHoldSeconds=.8, exitSeconds=.35}: Options={}) =>
  enterSeconds + frontHoldSeconds + flipSeconds +
  (shineEnabled ? shineDelaySeconds + shineSeconds : 0) + endHoldSeconds + exitSeconds;

/** Centered, two-sided 180-degree Y flip, followed by an optional diagonal shine.
 * All motion is evaluated from the current frame, including arbitrary seeks. */
export const FlipShineCard = ({front, back, centerX, centerY, cardWidth=460, cardHeight=660,
  perspective=2000, radius=24, direction='left', enterSeconds=.35, frontHoldSeconds=.85,
  flipSeconds=.4, shineEnabled=true, shineDelaySeconds=1.25, shineSeconds=.6,
  endHoldSeconds=.8, exitSeconds=.35, shineIntensity=.5, shineWidth=.45, shineAngle=-25,
  flipEasing=[.4,0,.2,1]}: FlipShineCardProps) => {
  const frame=useCurrentFrame(), {fps,width,height}=useVideoConfig(), t=frame/fps;
  if ([cardWidth,cardHeight,perspective,flipSeconds,shineSeconds,shineWidth].some(n=>!Number.isFinite(n)||n<=0) ||
    [enterSeconds,frontHoldSeconds,shineDelaySeconds,endHoldSeconds,exitSeconds,radius].some(n=>!Number.isFinite(n)||n<0) ||
    !Number.isFinite(shineIntensity)||shineIntensity<0||shineIntensity>1 || !Number.isFinite(shineAngle) ||
    (centerX!==undefined&&!Number.isFinite(centerX)) || (centerY!==undefined&&!Number.isFinite(centerY)) ||
    !['left','right'].includes(direction) || flipEasing.length!==4 || flipEasing.some(n=>!Number.isFinite(n)) ||
    [flipEasing[0],flipEasing[2]].some(n=>n<0||n>1)) throw new Error('Invalid FlipShineCard geometry, timing or easing.');
  const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
  const flipStart=enterSeconds+frontHoldSeconds, shineStart=flipStart+flipSeconds+shineDelaySeconds;
  const exitStart=flipStart+flipSeconds+(shineEnabled?shineDelaySeconds+shineSeconds:0)+endHoldSeconds;
  const enter=enterSeconds===0?1:interpolate(t,[0,enterSeconds],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
  const exit=exitSeconds===0?Number(t>=exitStart):interpolate(t,
    [exitStart,exitStart+Math.max(1/fps,exitSeconds-1/fps)],[0,1],clamp);
  const turn=interpolate(t,[flipStart,flipStart+flipSeconds],[0,1],{...clamp,easing:Easing.bezier(...flipEasing)});
  const angle=Math.max(0,Math.min(1,turn))*180*(direction==='left'?-1:1);
  const shade=Math.abs(Math.sin(angle*Math.PI/180))*.22;
  const shine=interpolate(t,[shineStart,shineStart+shineSeconds],[0,1],clamp);
  const bandWidth=cardWidth*shineWidth, bandHeight=2*Math.hypot(cardWidth,cardHeight);
  const reach=cardWidth/2+Math.abs(Math.sin(shineAngle*Math.PI/180))*bandHeight/2+bandWidth;
  const face:CSSProperties={position:'absolute',inset:0,overflow:'hidden',borderRadius:radius,
    backfaceVisibility:'hidden',background:'#fffdf8',boxShadow:'0 20px 48px #74677b33'};
  return <div style={{position:'absolute',left:(centerX??width/2)-cardWidth/2,
    top:(centerY??height/2)-cardHeight/2,width:cardWidth,height:cardHeight,
    perspective,opacity:enter*(1-exit),translate:`0px ${(1-enter)*24+exit*24}px`}}>
    <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d',transform:`rotateY(${angle}deg)`}}>
      <div style={{...face,transform:'translateZ(0.5px)'}}>{front}
        <div style={{position:'absolute',inset:0,background:'#584f68',opacity:shade,pointerEvents:'none'}}/>
      </div>
      <div style={{...face,transform:'rotateY(180deg) translateZ(0.5px)'}}>{back}
        <div style={{position:'absolute',inset:0,background:'#584f68',opacity:shade,pointerEvents:'none'}}/>
        {shineEnabled && t>=shineStart && t<shineStart+shineSeconds && <div style={{position:'absolute',
          left:cardWidth/2-bandWidth/2+(shine*2-1)*reach,top:cardHeight/2-bandHeight/2,
          width:bandWidth,height:bandHeight,transform:`rotate(${shineAngle}deg)`,
          background:'linear-gradient(90deg,transparent,rgba(255,255,255,.5) 30%,white 50%,rgba(255,255,255,.5) 70%,transparent)',
          opacity:shineIntensity,pointerEvents:'none'}}/>}
      </div>
    </div>
  </div>;
};
