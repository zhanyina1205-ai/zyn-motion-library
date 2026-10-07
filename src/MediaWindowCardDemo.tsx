import {AbsoluteFill,CanvasImage,staticFile} from 'remotion';
import {MediaWindowCard} from './motions';
export type MediaWindowCardDemoProps={shrinkSeconds?:number;settleSeconds?:number;bounce?:number};
export const MediaWindowCardDemo=({shrinkSeconds=.55,settleSeconds=.45,bounce=65}:MediaWindowCardDemoProps)=><AbsoluteFill style={{background:'#fff8ed',color:'#74677b',fontFamily:'"PingFang SC",sans-serif',overflow:'hidden'}}>
 <div style={{position:'absolute',left:120,top:85,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 08</div>
 <div style={{position:'absolute',left:120,top:245,fontFamily:'"Songti SC",Georgia,serif',fontSize:94,lineHeight:1.35}}>把画面收起来，<br/>让信息展开。</div>
 <div style={{position:'absolute',left:128,top:610,fontSize:28,lineHeight:1.7}}>完整画面 → 横向窗口<br/>轻轻回弹，再露出标题和说明。</div>
 <div style={{position:'absolute',left:120,bottom:65,fontSize:22,letterSpacing:3}}>MEDIA WINDOW / 收窗 · 回弹 · 信息卡</div>
 <MediaWindowCard centerX={1325} centerY={555} shrinkSeconds={shrinkSeconds} settleSeconds={settleSeconds} bounce={bounce}
  media={<CanvasImage src={staticFile('motion-samples/cozy-desk.svg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 60%'}}/>}
  headline={<div style={{fontFamily:'Georgia',fontWeight:700,lineHeight:.95}}><div style={{fontSize:118}}>04</div><div style={{fontSize:64,letterSpacing:-3}}>MOMENTS</div><div style={{fontFamily:'"PingFang SC",sans-serif',fontSize:17,letterSpacing:4,marginTop:15}}>给今天留一个位置</div></div>}
  caption={<div style={{fontSize:27,textAlign:'center',lineHeight:1.6}}>把喜欢的事情做好，<br/>把温柔的瞬间留下。</div>}/>
</AbsoluteFill>;
