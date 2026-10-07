import type {ReactNode} from 'react';
import {Easing,useVideoConfig} from 'remotion';
import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';

export type SlideScene={id:string;durationInFrames:number;content:ReactNode};
export const upwardSlide=(fps:number,seconds=.5)=>({
 presentation:slide({direction:'from-bottom'}),
 timing:linearTiming({durationInFrames:Math.max(1,Math.round(seconds*fps)),easing:Easing.bezier(.4,0,.2,1)}),
});

// The scene list is intentionally one reusable template. All contents move together.
export const WholePageSlide=({scenes,transitionSeconds=.5}:{scenes:SlideScene[];transitionSeconds?:number})=>{
 const {fps}=useVideoConfig();
 if(!Number.isFinite(transitionSeconds)||transitionSeconds<=0) throw new Error('transitionSeconds must be positive');
 const overlap=Math.max(1,Math.round(transitionSeconds*fps));
 if(scenes.some(s=>s.durationInFrames<=overlap)) throw new Error('Every scene must be longer than the transition');
 return <TransitionSeries>{scenes.flatMap((s,i)=>[
  <TransitionSeries.Sequence key={s.id} name={s.id} durationInFrames={s.durationInFrames}>{s.content}</TransitionSeries.Sequence>,
  ...(i<scenes.length-1?[<TransitionSeries.Transition key={`${s.id}-up`} {...upwardSlide(fps,transitionSeconds)}/>]:[]),
 ])}</TransitionSeries>;
};

export const slideTimelineFrames=(durations:number[],fps:number,seconds=.5)=>durations.reduce((a,b)=>a+b,0)-Math.max(0,durations.length-1)*Math.max(1,Math.round(seconds*fps));
