import {AbsoluteFill,staticFile,useCurrentFrame,interpolate} from 'remotion';
import {WholePageSlide,FloatingPhotoCard} from './motions';
const font='"Songti SC", "STSong", Georgia, serif';
const CardScene=({title,subtitle,bg}:{title:string;subtitle:string;bg:string})=><AbsoluteFill style={{background:bg,color:'#74677b',fontFamily:font,alignItems:'center',justifyContent:'center'}}><div style={{fontSize:120,fontWeight:700}}>{title}</div><div style={{fontSize:36,marginTop:40}}>{subtitle}</div></AbsoluteFill>;
export const WholePageSlideDemo=()=> <WholePageSlide scenes={[
 {id:'scene-a',durationInFrames:75,content:<CardScene title="把日子，过成喜欢的样子。" subtitle="整页一起移动 · 0.5 秒柔和上滑" bg="#fff8ed"/>},
 {id:'scene-b',durationInFrames:75,content:<CardScene title="去不同的地方，收集美好。" subtitle="照片、标题、贴纸保持相对位置" bg="#ccded7"/>},
 {id:'scene-c',durationInFrames:75,content:<CardScene title="保持柔软，保持好奇。" subtitle="奶油白 · 淡粉 · 柔和灰紫" bg="#f5bdd3"/>},
 ]}/>;
export const FloatingPolaroidsDemo=()=>{
 const f=useCurrentFrame();return <AbsoluteFill style={{background:'#ccded7',color:'#74677b',fontFamily:font,overflow:'hidden'}}>
  <div style={{position:'absolute',left:110,top:70,fontSize:22,letterSpacing:4,fontFamily:'"PingFang SC",sans-serif'}}>FLOATING POLAROIDS / 镜头模板 02</div>
  <div style={{position:'absolute',left:125,top:157,fontSize:112,fontWeight:700}}>去不同的地方，收集美好。</div>
  <div style={{position:'absolute',left:131,top:310,fontSize:36,fontFamily:'"PingFang SC",sans-serif',letterSpacing:3}}>把晴天、风和好奇心，装进行囊。</div>
  <div style={{position:'absolute',inset:0,perspective:1800,perspectiveOrigin:'50% 68%',translate:`${interpolate(f,[55,184],[70,-160],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}px 0`}}>
   <FloatingPhotoCard src={staticFile('images/sample-one.svg')} x={107} y={468} width={365} height={398} angle={-9} delaySeconds={8/30} depth={110} lateral={-55} caption="a moment in time"/>
   <FloatingPhotoCard src={staticFile('images/sample-two.svg')} x={525} y={403} width={380} height={440} angle={5} delaySeconds={17/30} depth={175} lateral={20} caption="sunny little adventures"/>
   <FloatingPhotoCard src={staticFile('images/sample-three.svg')} x={967} y={466} width={368} height={397} angle={-6} delaySeconds={26/30} depth={-110} lateral={-25} caption="hello, snowy mountains"/>
   <FloatingPhotoCard src={staticFile('images/sample-four.svg')} x={1386} y={403} width={390} height={440} angle={8} delaySeconds={35/30} depth={-70} lateral={55} caption="collecting beautiful days"/>
  </div>
 </AbsoluteFill>;
};
