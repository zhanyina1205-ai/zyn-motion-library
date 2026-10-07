import {AbsoluteFill,CanvasImage,staticFile} from 'remotion';
import {TornPaperCloudWipe} from './motions';
import {Balloon} from './CollagePosterArt';
export type TornPaperCloudWipeDemoProps={wipeSeconds?:number;roughness?:number;direction?:'left'|'right'};
const Scene=({after=false}:{after?:boolean})=><AbsoluteFill style={{background:after?'#f9e2ec':'#e4efe8',color:'#74677b',fontFamily:'"PingFang SC",sans-serif'}}>
 <div style={{position:'absolute',left:120,top:65,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 12</div>
 <div style={{position:'absolute',left:120,top:130,fontFamily:'"Songti SC",Georgia,serif',fontSize:86}}>{after?'下一幕，也有小惊喜。':'让云朵，带我们换一页。'}</div>
 <div style={{position:'absolute',left:360,top:330,width:1200,height:620,padding:18,background:'#fffdf8',boxShadow:'0 15px 45px #74677b22'}}><CanvasImage src={staticFile(after?'motion-samples/cozy-desk.svg':'motion-samples/landscape.svg')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
 <div style={{position:'absolute',left:120,bottom:40,fontSize:22,letterSpacing:3}}>TORN PAPER CLOUD WIPE / 撕纸遮挡 · 中点换景 · 云朵移开</div>
</AbsoluteFill>;
export const TornPaperCloudWipeDemo=({wipeSeconds=1.8,roughness=28,direction='left'}:TornPaperCloudWipeDemoProps)=><TornPaperCloudWipe
 before={<Scene/>} after={<Scene after/>} accent={<Balloon/>} wipeSeconds={wipeSeconds} roughness={roughness} direction={direction}/>;
