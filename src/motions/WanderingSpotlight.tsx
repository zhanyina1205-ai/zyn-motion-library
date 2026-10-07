import {useId} from 'react';
import type {ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type SpotlightKeyframe = {
  timeSeconds: number; x: number; y: number; width: number; height: number;
  roundness: number; caption?: string; captionAngle?: number; captionSide?: 'top'|'bottom';
};
export type WanderingSpotlightProps = {
  content: ReactNode; keyframes: SpotlightKeyframe[];
  centerX?: number; centerY?: number; frameWidth?: number; frameHeight?: number;
  enterSeconds?: number; endHoldSeconds?: number; exitSeconds?: number;
  dimOpacity?: number; dimColor?: string; feather?: number;
  borderColor?: string; borderWidth?: number; borderDash?: [number,number];
  captionColor?: string; captionSize?: number; captionGap?: number; captionSide?: 'top'|'bottom';
  motionEasing?: [number,number,number,number];
};
type Options = Omit<WanderingSpotlightProps,'content'|'keyframes'>;
export const wanderingSpotlightDurationSeconds = (keyframes: SpotlightKeyframe[],
  {enterSeconds=.35,endHoldSeconds=.8,exitSeconds=.35}:Options={}) =>
  enterSeconds+(keyframes[keyframes.length-1]?.timeSeconds??0)+endHoldSeconds+exitSeconds;

/** A single fixed media layer, covered by a dim veil with a moving/morphing hole.
 * Geometry keyframes use fractions of the component's own frame dimensions. */
export const WanderingSpotlight = ({content,keyframes,centerX,centerY,frameWidth=1240,frameHeight=630,
  enterSeconds=.35,endHoldSeconds=.8,exitSeconds=.35,dimOpacity=.8,dimColor='#40384b',feather=0,
  borderColor='#fffdf8',borderWidth=5,borderDash=[14,12],captionColor='#fffdf8',captionSize=48,
  captionGap=20,captionSide='bottom',motionEasing=[.4,0,.2,1]}:WanderingSpotlightProps) => {
  const frame=useCurrentFrame(), {fps,width,height}=useVideoConfig();
  const id=useId().replace(/[^a-zA-Z0-9_-]/g,'');
  if(keyframes.length<2 || keyframes[0].timeSeconds!==0 || keyframes.some((k,i)=>
    [k.timeSeconds,k.x,k.y,k.width,k.height,k.roundness,k.captionAngle??0].some(n=>!Number.isFinite(n)) ||
    k.timeSeconds<0 || (i>0&&k.timeSeconds<=keyframes[i-1].timeSeconds) || k.width<=0 || k.height<=0 ||
    k.roundness<0 || k.roundness>1) || [frameWidth,frameHeight,captionSize].some(n=>!Number.isFinite(n)||n<=0) ||
    [enterSeconds,endHoldSeconds,exitSeconds,feather,borderWidth,captionGap].some(n=>!Number.isFinite(n)||n<0) ||
    !Number.isFinite(dimOpacity)||dimOpacity<0||dimOpacity>1 || borderDash.some(n=>!Number.isFinite(n)||n<=0) ||
    motionEasing.length!==4 || motionEasing.some(n=>!Number.isFinite(n)) ||
    [motionEasing[0],motionEasing[2]].some(n=>n<0||n>1) || !['top','bottom'].includes(captionSide))
    throw new Error('Invalid WanderingSpotlight keyframes, geometry or timing.');
  const t=frame/fps, local=Math.max(0,t-enterSeconds), last=keyframes[keyframes.length-1];
  let index=0;
  for(let i=1;i<keyframes.length;i++)if(keyframes[i].timeSeconds<=local)index=i;
  const a=keyframes[index], b=keyframes[Math.min(index+1,keyframes.length-1)];
  const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
  const p=a===b?1:interpolate(local,[a.timeSeconds,b.timeSeconds],[0,1],{...clamp,easing:Easing.bezier(...motionEasing)});
  const mix=(u:number,v:number)=>u+(v-u)*Math.max(0,Math.min(1,p));
  const cx=mix(a.x,b.x)*frameWidth, cy=mix(a.y,b.y)*frameHeight;
  const w=mix(a.width,b.width)*frameWidth, h=mix(a.height,b.height)*frameHeight;
  const r=mix(a.roundness,b.roundness), angle=mix(a.captionAngle??0,b.captionAngle??0);
  const enter=enterSeconds===0?1:interpolate(t,[0,enterSeconds],[0,1],clamp);
  const exitStart=enterSeconds+last.timeSeconds+endHoldSeconds;
  const exit=exitSeconds===0?Number(t>=exitStart):interpolate(t,
    [exitStart,exitStart+Math.max(1/fps,exitSeconds-1/fps)],[0,1],clamp);
  const shape={x:cx-w/2,y:cy-h/2,width:w,height:h,rx:w*r/2,ry:h*r/2};
  const side=a.captionSide??captionSide;
  const captionY=Math.max(captionSize+8,Math.min(frameHeight-captionSize-8,cy+(side==='bottom'?1:-1)*(h/2+captionGap)));
  return <div style={{position:'absolute',left:(centerX??width/2)-frameWidth/2,
    top:(centerY??height/2)-frameHeight/2,width:frameWidth,height:frameHeight,
    opacity:enter*(1-exit),translate:`0px ${(1-enter)*24+exit*24}px`}}>
    <div style={{position:'absolute',inset:-18,background:'#fffdf8',borderRadius:18,boxShadow:'0 14px 40px #74677b22'}}/>
    <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:8}}>
      <div style={{position:'absolute',inset:0}}>{content}</div>
      <svg width={frameWidth} height={frameHeight} viewBox={`0 0 ${frameWidth} ${frameHeight}`}
        style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <defs>
          <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={feather}/></filter>
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={frameWidth} height={frameHeight} style={{maskType:'luminance'}}>
            <rect width={frameWidth} height={frameHeight} fill="white"/>
            <rect {...shape} fill="black" filter={feather>0?`url(#${id}-soft)`:undefined}/>
          </mask>
        </defs>
        <rect width={frameWidth} height={frameHeight} fill={dimColor} opacity={dimOpacity*enter} mask={`url(#${id}-mask)`}/>
        <rect {...shape} fill="none" stroke={borderColor} strokeWidth={borderWidth} strokeDasharray={borderDash.join(' ')} opacity={enter}/>
        {a.caption && <text x={cx} y={captionY} textAnchor="middle" dominantBaseline={side==='top'?'auto':'hanging'}
          fill={captionColor} fontSize={captionSize} fontFamily="PingFang SC, sans-serif" fontWeight={600}
          transform={`rotate(${angle} ${cx} ${captionY})`} opacity={enter}>{a.caption}</text>}
      </svg>
    </div>
  </div>;
};
