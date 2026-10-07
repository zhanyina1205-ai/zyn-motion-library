import {AbsoluteFill,CanvasImage,staticFile} from 'remotion';
import {WanderingSpotlight} from './motions';
import type {SpotlightKeyframe} from './motions';
export const spotlightDemoKeyframes:SpotlightKeyframe[]=[
  {timeSeconds:0,x:.5,y:.5,width:.26,height:.84,roundness:.04,caption:'先看这里'},
  {timeSeconds:.5,x:.5,y:.5,width:.18,height:.56,roundness:.04,caption:'聚焦细节'},
  {timeSeconds:.95,x:.5,y:.5,width:.66,height:.25,roundness:.08,caption:'换一种形状'},
  {timeSeconds:1.35,x:.5,y:.5,width:.32,height:.78,roundness:.06,caption:'找到视觉焦点'},
  {timeSeconds:1.75,x:.5,y:.5,width:.30,height:.59,roundness:1,caption:'让视线，游走'},
  {timeSeconds:2.25,x:.27,y:.43,width:.30,height:.59,roundness:1,caption:'一朵小花',captionAngle:-12},
  {timeSeconds:2.9,x:.74,y:.7,width:.30,height:.59,roundness:1,caption:'一杯好心情',captionAngle:12},
  {timeSeconds:3.55,x:.68,y:.3,width:.30,height:.59,roundness:1,caption:'一点小惊喜',captionAngle:0,captionSide:'bottom'},
  {timeSeconds:4.15,x:.5,y:.5,width:2,height:3,roundness:1,caption:''},
];
export type WanderingSpotlightDemoProps={pace?:number;dimOpacity?:number;feather?:number;captionSide?:'top'|'bottom'};
export const WanderingSpotlightDemo=({pace=1,dimOpacity=.8,feather=0,captionSide='top'}:WanderingSpotlightDemoProps)=>{
  if(!Number.isFinite(pace)||pace<=0)throw new Error('pace must be positive');
  return <AbsoluteFill style={{background:'#f9e2ec',color:'#74677b',fontFamily:'"PingFang SC",sans-serif'}}>
    <div style={{position:'absolute',left:120,top:65,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 14</div>
    <div style={{position:'absolute',left:120,top:130,fontFamily:'"Songti SC",Georgia,serif',fontSize:84}}>让视线，跟着小惊喜走。</div>
    <WanderingSpotlight centerX={960} centerY={630} dimOpacity={dimOpacity} feather={feather} captionSide={captionSide}
      keyframes={spotlightDemoKeyframes.map(k=>({...k,timeSeconds:k.timeSeconds*pace}))}
      content={<div style={{position:'absolute',inset:0,background:'#d9e9e0'}}>
        <div style={{position:'absolute',left:120,top:120,width:330,height:360,background:'#fffdf8',padding:16,rotate:'-5deg',boxShadow:'0 8px 15px #74677b22'}}>
          <CanvasImage src={staticFile('motion-samples/garden.svg')} style={{width:'100%',height:280,objectFit:'cover'}}/>
          <div style={{textAlign:'center',fontSize:22,marginTop:17}}>FLOWER DIARY</div>
        </div>
        <div style={{position:'absolute',left:510,top:95,fontFamily:'"Songti SC",serif',fontSize:68,lineHeight:1.4}}>日常里的<br/>小小收藏</div>
        <div style={{position:'absolute',right:60,bottom:70,width:420,height:290,background:'#fffdf8',padding:16,rotate:'6deg',boxShadow:'0 8px 15px #74677b22'}}>
          <CanvasImage src={staticFile('motion-samples/cozy-desk.svg')} style={{width:'100%',height:220,objectFit:'cover'}}/>
          <div style={{textAlign:'center',fontSize:22,marginTop:10}}>A COZY AFTERNOON</div>
        </div>
        <div style={{position:'absolute',right:200,top:72,fontSize:86,color:'#b39dc6'}}>✦</div>
        <div style={{position:'absolute',left:570,bottom:130,fontSize:21,letterSpacing:4}}>KEEP LITTLE MOMENTS</div>
      </div>}/>
    <div style={{position:'absolute',left:120,bottom:40,fontSize:22,letterSpacing:3}}>WANDERING SPOTLIGHT / 形状变换 · 视线游走 · 放大揭示</div>
  </AbsoluteFill>;
};
