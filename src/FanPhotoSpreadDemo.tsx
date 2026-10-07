import {AbsoluteFill,CanvasImage,Easing,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {FanPhotoSpread,LayeredCollagePoster} from './motions';
import type {CollagePosterLayer} from './motions';
const Camera=()=> <svg width="100%" height="100%" viewBox="0 0 400 330">
 <path d="M28 88H90L112 43H211L235 88H365Q386 88 386 110V290Q386 312 365 312H28Q8 312 8 290V110Q8 88 28 88Z" fill="#ccded7" stroke="#fffdf8" strokeWidth="14"/>
 <path d="M28 88H90L112 43H211L235 88H365Q386 88 386 110V290Q386 312 365 312H28Q8 312 8 290V110Q8 88 28 88Z" fill="none" stroke="#74677b" strokeWidth="3"/>
 <rect x="25" y="132" width="340" height="125" rx="20" fill="#e9e0ef"/>
 <circle cx="200" cy="194" r="93" fill="#fffdf8" stroke="#74677b" strokeWidth="4"/>
 <circle cx="200" cy="194" r="71" fill="#a69ab5"/><circle cx="200" cy="194" r="52" fill="#f5bdd3"/>
 <ellipse cx="180" cy="175" rx="17" ry="22" fill="#fffdf8" opacity=".8"/>
 <rect x="278" y="101" width="60" height="26" rx="5" fill="#fffdf8"/>
 <text x="51" y="284" fontFamily="sans-serif" fontSize="18" fill="#74677b">LITTLE CAMERA</text>
</svg>;
const Flower=()=> <svg width="100%" height="100%" viewBox="0 0 220 220"><g transform="translate(110 110)">
 {Array.from({length:7},(_,i)=><ellipse key={i} cx="0" cy="-48" rx="27" ry="51" fill="#f5bdd3" stroke="#fffdf8" strokeWidth="7" transform={`rotate(${i*360/7})`}/>)}
 <circle r="32" fill="#fffdf8" stroke="#74677b" strokeWidth="3"/></g></svg>;
const Corners=()=> <svg width="100%" height="100%" viewBox="0 0 1240 650" preserveAspectRatio="none">
 <path d="M890 0L914 18L933 12L948 33L980 29L1005 58L1028 47L1054 82L1080 76L1105 99L1145 91L1170 118L1210 104L1240 134V0Z" fill="#e9e0ef" stroke="#fffdf8" strokeWidth="3"/>
 <path d="M0 520L32 531L53 522L87 552L112 544L136 568L166 557L195 580L224 575L254 603L294 595L319 619L367 610L406 650H0Z" fill="#f9e2ec" stroke="#fffdf8" strokeWidth="3"/>
</svg>;
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const PaperSwap=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();const p=interpolate(f/fps,[.65,1.2],[0,1],{...clamp,easing:Easing.bezier(.3,0,.15,1)});
 return <><CanvasImage src={staticFile('motion-samples/cozy-desk.svg')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
  <div style={{position:'absolute',inset:0,background:'#fffdf8',translate:`0px ${(1-p)*650}px`,backgroundImage:'repeating-linear-gradient(110deg, transparent,transparent 60px,#e9e0ef55 62px,transparent 64px)'}}>
   <div style={{position:'absolute',left:50,top:35,fontSize:24,letterSpacing:5}}>A LITTLE COLLAGE / 相册里的灵感</div>
  </div></>;
};
const CameraForeground=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();const p=interpolate(f/fps,[.65,1.2],[0,1],{...clamp,easing:Easing.bezier(.3,0,.15,1)});
 return <div style={{position:'absolute',left:620+(255-620)*p-190,top:345+(425-345)*p-160,width:380,height:320,scale:1.65+(1-1.65)*p,rotate:`${-4*p}deg`,filter:'drop-shadow(0 10px 10px #74677b33)'}}><Camera/></div>;
};
const Photo=({src}:{src:string})=><CanvasImage src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>;
export type FanPhotoSpreadDemoProps={openSeconds?:number;staggerSeconds?:number;startAngle?:number;endAngle?:number};
export const FanPhotoSpreadDemo=({openSeconds=.45,staggerSeconds=.1,startAngle=-36,endAngle=10}:FanPhotoSpreadDemoProps)=>{
 const end=2.3+3*staggerSeconds+openSeconds;
 const layers:CollagePosterLayer[]=[
  {id:'fan',content:<FanPhotoSpread openSeconds={openSeconds} staggerSeconds={staggerSeconds} startAngle={startAngle} endAngle={endAngle}
   photos={[<Photo src="motion-samples/landscape.svg"/>,<Photo src="motion-samples/garden.svg"/>,<Photo src="carousel/sample-three.svg"/>,<Photo src="motion-samples/clouds.svg"/>]}/>,x:0,y:0,width:1240,height:650,delaySeconds:0,enterSeconds:.01,fromY:0,zIndex:2},
  {id:'camera',content:<CameraForeground/>,x:0,y:0,width:1240,height:650,delaySeconds:0,enterSeconds:.01,fromY:0,zIndex:5},
  {id:'corners',content:<Corners/>,x:0,y:0,width:1240,height:650,delaySeconds:end-.05,enterSeconds:.45,fromY:0,zIndex:6},
  {id:'title',content:<div style={{fontFamily:'"Songti SC",serif',fontSize:48,textAlign:'center',background:'#fffdf8',padding:'15px 22px',borderRadius:8}}>把灵感，展开成风景。</div>,x:545,y:530,width:620,height:88,delaySeconds:end+.05,enterSeconds:.4,fromY:50,zIndex:7},
  {id:'flower',content:<Flower/>,x:40,y:45,width:160,height:160,delaySeconds:end+.1,enterSeconds:.35,fromX:-170,fromY:-80,fromRotation:-35,rotation:12,zIndex:8},
 ];
 return <AbsoluteFill style={{background:'#fff9f0',color:'#74677b',fontFamily:'"PingFang SC",sans-serif'}}>
  <div style={{position:'absolute',left:120,top:65,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 15</div>
  <div style={{position:'absolute',left:120,top:130,fontFamily:'"Songti SC",Georgia,serif',fontSize:84}}>把一叠灵感，慢慢展开。</div>
  <LayeredCollagePoster centerX={960} centerY={640} posterWidth={1240} posterHeight={650} background={<PaperSwap/>} layers={layers} holdSeconds={.9} exitSeconds={.4}/>
  <div style={{position:'absolute',left:120,bottom:40,fontSize:22,letterSpacing:3}}>FAN PHOTO SPREAD / 前景让位 · 支点展开 · 分层拼贴</div>
 </AbsoluteFill>;
};
