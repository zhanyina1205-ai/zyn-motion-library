import {AbsoluteFill} from 'remotion';
import {LayeredCollagePoster} from './motions';
import {collagePosterLayers} from './CollagePosterArt';
export type LayeredCollagePosterDemoProps={pace?:number;spinSpeed?:number};
export const LayeredCollagePosterDemo=({pace=1,spinSpeed=65}:LayeredCollagePosterDemoProps)=><AbsoluteFill style={{background:'#fff8ed',color:'#74677b',fontFamily:'"PingFang SC",sans-serif'}}>
 <div style={{position:'absolute',left:120,top:65,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 11</div>
 <div style={{position:'absolute',left:120,top:130,fontFamily:'"Songti SC",Georgia,serif',fontSize:86}}>一层层，贴出夏天。</div>
 <LayeredCollagePoster centerX={960} centerY={650} posterWidth={1200} posterHeight={650}
 background={<AbsoluteFill style={{background:'linear-gradient(#e7dde9,#f7e9ee)'}}/>}
 layers={collagePosterLayers.map(l=>({...l,delaySeconds:(l.delaySeconds??0)*pace,enterSeconds:(l.enterSeconds??.8)*pace,spinDegreesPerSecond:l.id==='label'?spinSpeed:l.spinDegreesPerSecond}))}/>
 <div style={{position:'absolute',left:120,bottom:40,fontSize:22,letterSpacing:3}}>LAYERED COLLAGE POSTER / 错落入场 · 前后遮挡 · 持续旋转</div>
</AbsoluteFill>;
