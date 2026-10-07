import {AbsoluteFill, CanvasImage, staticFile} from 'remotion';
import {FlipShineCard} from './motions';
export type FlipShineCardDemoProps={flipSeconds?:number;direction?:'left'|'right';shineEnabled?:boolean;shineSeconds?:number;shineIntensity?:number};
export const FlipShineCardDemo=({flipSeconds=.4,direction='left',shineEnabled=true,shineSeconds=.6,shineIntensity=.5}:FlipShineCardDemoProps)=><AbsoluteFill
  style={{background:'#fff9f0',color:'#74677b',fontFamily:'"PingFang SC",sans-serif'}}>
  <div style={{position:'absolute',left:120,top:65,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 13</div>
  <div style={{position:'absolute',left:160,top:300,fontFamily:'"Songti SC",Georgia,serif',fontSize:88,lineHeight:1.35}}>翻过来，<br/>遇见小惊喜。</div>
  <div style={{position:'absolute',left:165,top:610,fontSize:25,lineHeight:1.9}}>一个问号，一次翻转。<br/>再让一道柔光，轻轻经过。</div>
  <FlipShineCard centerX={1290} centerY={560} flipSeconds={flipSeconds} direction={direction}
    shineEnabled={shineEnabled} shineSeconds={shineSeconds} shineIntensity={shineIntensity}
    front={<div style={{position:'absolute',inset:0,background:'#e9e0ef',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',inset:17,border:'2px dashed #a89bb4',borderRadius:14}}/>
      <div style={{fontFamily:'Georgia,serif',fontSize:300,color:'#9384a3',marginTop:-30}}>?</div>
      <div style={{position:'absolute',bottom:52,fontSize:20,letterSpacing:5}}>A LITTLE SURPRISE</div>
    </div>}
    back={<div style={{position:'absolute',inset:0,background:'#fffdf8',padding:24}}>
      <CanvasImage src={staticFile('motion-samples/garden.svg')} style={{width:'100%',height:500,objectFit:'cover',borderRadius:10}}/>
      <div style={{fontFamily:'"Songti SC",serif',fontSize:34,marginTop:25,textAlign:'center'}}>收藏今天的小美好</div>
      <div style={{fontSize:15,letterSpacing:4,marginTop:13,textAlign:'center'}}>LITTLE MOMENTS / 01</div>
    </div>}/>
  <div style={{position:'absolute',left:120,bottom:40,fontSize:22,letterSpacing:3}}>FLIP & SHINE / 双面翻转 · 正背切换 · 斜向扫光</div>
</AbsoluteFill>;
