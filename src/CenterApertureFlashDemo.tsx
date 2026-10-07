import {AbsoluteFill, CanvasImage, staticFile} from 'remotion';
import {CenterApertureFlash} from './motions';
export type CenterApertureFlashDemoProps={shotSeconds?:number;initialOpening?:number};
const paths=['carousel/sample-one.svg','motion-samples/garden.svg','carousel/sample-three.svg',
  'motion-samples/landscape.svg','carousel/sample-four.svg','motion-samples/clouds.svg',
  'carousel/sample-two.svg','motion-samples/cozy-desk.svg','carousel/sample-one.svg',
  'motion-samples/garden.svg','carousel/sample-three.svg','motion-samples/landscape.svg'];
const Photo=({src,gray=false}:{src:string;gray?:boolean})=><CanvasImage src={staticFile(src)}
  style={{width:'100%',height:'100%',objectFit:'cover',filter:gray?'grayscale(1)':undefined}}/>;
export const CenterApertureFlashDemo=({shotSeconds=.12,initialOpening=0}:CenterApertureFlashDemoProps)=><AbsoluteFill
  style={{background:'#f9e2ec',color:'#74677b',fontFamily:'"PingFang SC",sans-serif'}}>
  <div style={{position:'absolute',left:120,top:65,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 10</div>
  <div style={{position:'absolute',left:120,top:130,fontFamily:'"Songti SC",Georgia,serif',fontSize:86}}>从一道缝，打开小世界。</div>
  <CenterApertureFlash centerX={960} centerY={650} frameWidth={1200} frameHeight={600}
    shotSeconds={shotSeconds} initialOpening={initialOpening}
    base={<Photo src="motion-samples/cozy-desk.svg" gray/>} shots={paths.map(src=><Photo src={src}/>)}/>
  <div style={{position:'absolute',left:120,bottom:40,fontSize:22,letterSpacing:3}}>CENTER APERTURE FLASH / 中心开屏 · 连续快切 · 全幅落定</div>
</AbsoluteFill>;
