import {AbsoluteFill, staticFile, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FlipCardStack, StackPhotoCard} from './motions';
export type FlipCardStackDemoProps = {stepSeconds?: number; spread?: number; flipAngle?: number; bend?: number};
export const FlipCardStackDemo = ({stepSeconds=0.1, spread=52, flipAngle=65, bend=20}: FlipCardStackDemoProps) => {
  const f=useCurrentFrame(), {fps}=useVideoConfig();
  const zoomAt=0.4+7*stepSeconds+0.85;
  const alpha=interpolate(f/fps,[0,0.3,zoomAt,zoomAt+0.5],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:'#eee6f2', color:'#74677b', overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, #fff8ed 0%, #eee6f2 75%)'}}/>
    <div style={{position:'absolute',left:120,top:85,fontFamily:'"PingFang SC",sans-serif',fontSize:24,letterSpacing:4,opacity:alpha}}>ZYN / 镜头模板 04</div>
    <div style={{position:'absolute',left:120,top:155,fontFamily:'"Songti SC",Georgia,serif',fontSize:92,opacity:alpha}}>把一叠回忆，翻到眼前。</div>
    <FlipCardStack centerX={960} centerY={665} cardWidth={720} cardHeight={520}
      startIndex={2} stepSeconds={stepSeconds} spread={spread} flipAngle={flipAngle} bend={bend} cards={[
      <StackPhotoCard src={staticFile('carousel/sample-three.svg')} caption="之前的小回忆"/>,
      <StackPhotoCard src={staticFile('carousel/sample-four.svg')} caption="悄悄收藏起来"/>,
      <StackPhotoCard src={staticFile('carousel/sample-one.svg')} caption="晴天从这一页开始"/>,
      <StackPhotoCard src={staticFile('carousel/sample-two.svg')} caption="慢慢遇见小惊喜"/>,
      <StackPhotoCard src={staticFile('carousel/sample-three.svg')} caption="和风一起散步"/>,
      <StackPhotoCard src={staticFile('carousel/sample-four.svg')} caption="下一站，小小冒险"/>,
      <StackPhotoCard src={staticFile('carousel/sample-one.svg')} caption="收集温柔的瞬间"/>,
      <StackPhotoCard src={staticFile('carousel/sample-two.svg')} caption="把喜欢留下来"/>,
      <StackPhotoCard src={staticFile('carousel/sample-four.svg')} caption="今天也很可爱"/>,
      <StackPhotoCard src={staticFile('motion-samples/landscape.svg')} caption="放大这一刻的美好"/>,
    ]}/>
    <div style={{position:'absolute',left:120,right:120,bottom:65,fontSize:22,letterSpacing:3,opacity:alpha,fontFamily:'"PingFang SC",sans-serif'}}>CURVED CARD STACK / 快翻 · 停留 · 推近</div>
  </AbsoluteFill>;
};
