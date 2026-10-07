import {AbsoluteFill,CanvasImage,staticFile} from 'remotion';
import {ThumbnailPanel} from './motions';
export type ThumbnailPanelDemoProps={expandSeconds?:number;staggerSeconds?:number;drop?:number};
const Tile=({src,label}:{src:string;label:string})=><div style={{width:'100%',height:'100%',background:'#fffdf8',padding:7,boxSizing:'border-box',display:'flex',flexDirection:'column'}}><CanvasImage src={staticFile(src)} style={{width:'100%',flex:1,minHeight:0,objectFit:'cover'}}/><div style={{fontSize:16,textAlign:'center',height:24,color:'#74677b',fontFamily:'Georgia'}}>{label}</div></div>;
export const ThumbnailPanelDemo=({expandSeconds=.55,staggerSeconds=.12,drop=30}:ThumbnailPanelDemoProps)=><AbsoluteFill style={{background:'#fff8ed',color:'#74677b',fontFamily:'"PingFang SC",sans-serif',overflow:'hidden'}}>
 <div style={{position:'absolute',left:720,top:125,width:930,height:850,borderRadius:40,background:'#e8eff0',border:'2px solid #fffdf8'}}/>
 <CanvasImage src={staticFile('motion-samples/garden.svg')} style={{position:'absolute',left:770,top:175,width:830,height:750,objectFit:'cover',borderRadius:28,opacity:.65}}/>
 <div style={{position:'absolute',left:120,top:85,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 06</div>
 <div style={{position:'absolute',left:120,top:235,fontFamily:'"Songti SC",Georgia,serif',fontSize:92,lineHeight:1.35}}>小小预览，<br/>展开成收藏。</div>
 <div style={{position:'absolute',left:128,top:570,fontSize:26,lineHeight:1.7}}>缩略横条 · 同物件展开<br/>从一排，变成一张相册卡。</div>
 <ThumbnailPanel centerX={1190} stripTop={710} panelTop={245} expandSeconds={expandSeconds} staggerSeconds={staggerSeconds} drop={drop}
  heading={<span style={{fontFamily:'Georgia',letterSpacing:-3}}>COLLECTION.</span>}
  body={<div style={{fontSize:27,lineHeight:1.6}}>收集四个小瞬间，<br/>把今天慢慢留下来。</div>}
  signature={<span style={{fontSize:37,fontStyle:'italic',fontFamily:'Georgia',color:'#c783a6'}}>little moments</span>}
  items={[<Tile src="carousel/sample-one.svg" label="sunny"/>,<Tile src="carousel/sample-two.svg" label="bloom"/>,<Tile src="carousel/sample-three.svg" label="slow"/>,<Tile src="carousel/sample-four.svg" label="dream"/>]}/>
 <div style={{position:'absolute',left:120,bottom:65,fontSize:22,letterSpacing:3}}>THUMBNAIL PANEL / 错落出现 · 展开 · 双列排版</div>
</AbsoluteFill>;
