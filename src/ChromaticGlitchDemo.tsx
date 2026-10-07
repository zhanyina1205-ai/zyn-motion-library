import {AbsoluteFill,CanvasImage,staticFile} from 'remotion';
import {ChromaticGlitchTransition} from './motions';
export type ChromaticGlitchDemoProps={transitionSeconds?:number;split?:number;sliceShift?:number};
const Scene=({next}:{next:boolean})=><AbsoluteFill style={{background:next?'#eee6f2':'#e4efe8',color:'#74677b',fontFamily:'"PingFang SC",sans-serif'}}>
 <div style={{position:'absolute',left:120,top:85,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 07</div>
 <div style={{position:'absolute',left:120,top:225,fontFamily:'"Songti SC",Georgia,serif',fontSize:94,lineHeight:1.4}}>{next?<>换一页，<br/>继续小冒险。</>:<>给下一幕，<br/>一点小惊喜。</>}</div>
 <div style={{position:'absolute',left:120,top:600,fontSize:27}}>{next?'下一幕已经抵达。':'一瞬错位，轻快交接。'}</div>
 <div style={{position:'absolute',left:930,top:155,width:770,height:760,background:'#fffdf8',padding:24,boxSizing:'border-box',borderRadius:18,rotate:next?'4deg':'-4deg',boxShadow:'0 20px 50px #74677b20'}}>
  <CanvasImage src={staticFile(next?'motion-samples/landscape.svg':'motion-samples/garden.svg')} style={{width:'100%',height:610,objectFit:'cover',borderRadius:6}}/>
  <div style={{fontFamily:'Georgia',fontSize:40,textAlign:'center',marginTop:28}}>{next?'a new little chapter':'before the little jump'}</div>
 </div>
 <div style={{position:'absolute',left:120,bottom:65,fontSize:22,letterSpacing:3}}>CHROMATIC GLITCH / 色差错位 · 横向切片 · 图标旋转</div>
</AbsoluteFill>;
export const ChromaticGlitchDemo=({transitionSeconds=.9,split=22,sliceShift=30}:ChromaticGlitchDemoProps)=><ChromaticGlitchTransition transitionSeconds={transitionSeconds} split={split} sliceShift={sliceShift} badgeX={1010} badgeY={550}
 before={<Scene next={false}/>} after={<Scene next/>}
 badge={<div style={{width:'100%',height:'100%',background:'#74677b',border:'8px solid #fffdf8',borderRadius:62,color:'#fffdf8',fontFamily:'Georgia',fontSize:220,fontWeight:700,display:'grid',placeItems:'center',boxSizing:'border-box',boxShadow:'0 18px 35px #74677b33'}}>Z</div>}/>;
