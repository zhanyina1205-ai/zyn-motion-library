import type {ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
export type CenterApertureFlashProps = {
  base: ReactNode; shots: ReactNode[]; centerX?: number; centerY?: number;
  frameWidth?: number; frameHeight?: number; enterSeconds?: number;
  baseHoldSeconds?: number; shotSeconds?: number; endHoldSeconds?: number; exitSeconds?: number;
  initialOpening?: number; openingEasing?: [number, number, number, number];
};
type Options = Omit<CenterApertureFlashProps, 'base' | 'shots'>;
export const centerApertureFlashDurationSeconds = (shotCount: number,
  {enterSeconds=.35, baseHoldSeconds=.3, shotSeconds=.12, endHoldSeconds=1.1, exitSeconds=.4}: Options={}) =>
  enterSeconds + baseHoldSeconds + shotCount * shotSeconds + endHoldSeconds + exitSeconds;
/** A fixed base remains visible around a center aperture. The aperture opens
 * continuously while its contents hard-cut at fixed time intervals. */
export const CenterApertureFlash = ({base, shots, centerX, centerY, frameWidth=1200, frameHeight=650,
  enterSeconds=.35, baseHoldSeconds=.3, shotSeconds=.12, endHoldSeconds=1.1, exitSeconds=.4,
  initialOpening=0, openingEasing=[0,0,1,1]}: CenterApertureFlashProps) => {
  const frame=useCurrentFrame(), {fps,width,height}=useVideoConfig(), t=frame/fps;
  if(shots.length<2 || [frameWidth,frameHeight,enterSeconds,shotSeconds,exitSeconds].some(n=>!Number.isFinite(n)||n<=0) ||
    [baseHoldSeconds,endHoldSeconds].some(n=>!Number.isFinite(n)||n<0) || !Number.isFinite(initialOpening) || initialOpening<0 || initialOpening>1 ||
    openingEasing.length!==4 || openingEasing.some(n=>!Number.isFinite(n)) || openingEasing[0]<0 || openingEasing[0]>1 || openingEasing[2]<0 || openingEasing[2]>1)
    throw new Error('Invalid CenterApertureFlash content, geometry or timing.');
  const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
  const start=enterSeconds+baseHoldSeconds, flashSeconds=shots.length*shotSeconds, end=start+flashSeconds+endHoldSeconds;
  const enter=interpolate(t,[0,enterSeconds],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
  const exit=interpolate(t,[end,end+Math.max(1/fps,exitSeconds-1/fps)],[0,1],clamp);
  const opening=interpolate(t,[start,start+flashSeconds],[initialOpening,1],{...clamp,easing:Easing.bezier(...openingEasing)});
  const inset=(1-Math.max(0,Math.min(1,opening)))*50;
  const index=Math.min(shots.length-1,Math.max(0,Math.floor((t-start+1e-8)/shotSeconds)));
  return <div style={{position:'absolute',left:(centerX??width/2)-frameWidth/2,top:(centerY??height/2)-frameHeight/2,
    width:frameWidth,height:frameHeight,opacity:enter*(1-exit),translate:`0px ${(1-enter)*24+exit*24}px`}}>
    <div style={{position:'absolute',inset:-18,borderRadius:8,background:'#fffdf8',boxShadow:'0 14px 40px #74677b22'}}/>
    <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#ccded7'}}>
      <div style={{position:'absolute',inset:0}}>{base}</div>
      {t>=start && <div style={{position:'absolute',inset:0,clipPath:`inset(${inset}% 0 ${inset}% 0)`}}>
        <div style={{position:'absolute',inset:0}} key={index}>{shots[index]}</div>
      </div>}
    </div>
  </div>;
};
