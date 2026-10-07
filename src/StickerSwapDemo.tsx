import {AbsoluteFill, CanvasImage, staticFile, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {StickerSwap} from './motions';

const Sticker = ({kind}:{kind:'flower'|'cup'|'heart'|'ticket'}) => <svg width="100%" height="100%" viewBox="0 0 440 450">
  {kind==='flower' && <g stroke="#74677b" strokeWidth={5}>
    <path d="M220 280 Q175 350 220 422 M217 358 Q140 310 125 360 Q174 388 217 375" fill="#ccded7"/>
    <g fill="#f5bdd3">{Array.from({length:6},(_,i)=><ellipse key={i} cx={220} cy={135} rx={55} ry={87} transform={`rotate(${i*60} 220 210)`}/>)}</g>
    <circle cx={220} cy={210} r={57} fill="#fff8ed"/><circle cx={202} cy={202} r={4} fill="#74677b"/><circle cx={238} cy={202} r={4} fill="#74677b"/>
    <path d="M201 226 Q220 244 239 226" fill="none" strokeLinecap="round"/>
  </g>}
  {kind==='cup' && <g stroke="#74677b" strokeWidth={5} strokeLinejoin="round">
    <path d="M112 137 H327 L300 408 H141 Z" fill="#ccded7"/><path d="M103 115 Q220 73 337 115 L337 151 H103 Z" fill="#fff8ed"/>
    <rect x={130} y={228} width={180} height={98} rx={15} fill="#eee6f2"/><text x={220} y={287} textAnchor="middle" fontSize={32} fontFamily="Georgia" fill="#74677b" stroke="none">little joy</text>
    <path d="M170 75 Q145 55 172 25 M224 70 Q200 50 223 22 M272 74 Q250 51 275 26" fill="none" strokeLinecap="round"/>
  </g>}
  {kind==='heart' && <g stroke="#74677b" strokeWidth={5}><path d="M220 392 C166 345 37 257 68 156 C91 77 189 88 220 161 C251 88 349 77 372 156 C403 257 274 345 220 392Z" fill="#f5bdd3"/><path d="M105 173 Q114 136 145 138" fill="none" stroke="#fffdf8" strokeWidth={12} strokeLinecap="round"/></g>}
  {kind==='ticket' && <g stroke="#74677b" strokeWidth={4}>
    <path d="M75 65 H365 V145 Q329 165 365 185 V350 H75 V185 Q111 165 75 145 Z" fill="#fff8ed"/>
    <path d="M99 220 H341" strokeDasharray="8 8"/><rect x={109} y={88} width={222} height={115} rx={8} fill="#eee6f2"/>
    <text x={220} y={160} textAnchor="middle" fontFamily="Georgia" fontSize={32} fill="#74677b" stroke="none">GOOD DAY</text>
    <text x={220} y={264} textAnchor="middle" fontFamily="Georgia" fontSize={20} fill="#74677b" stroke="none">COLLECT LITTLE MOMENTS</text>
    {Array.from({length:18},(_,i)=><rect key={i} x={113+i*12} y={287} width={i%3===0?7:3} height={38} fill="#74677b" stroke="none"/>)}
  </g>}
</svg>;
const AlbumBackground = ({image, paper}:{image:string;paper:string}) => <AbsoluteFill style={{background:paper}}>
  <div style={{position:'absolute',left:325,top:350,width:1270,height:565,background:'#fffdf8',padding:20,boxSizing:'border-box',borderRadius:12,boxShadow:'0 15px 45px #74677b16'}}>
    <CanvasImage src={staticFile(image)} style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.68}}/>
  </div>
  <div style={{position:'absolute',left:140,top:810,fontSize:90,color:'#f5bdd3'}}>✳</div>
</AbsoluteFill>;
export type StickerSwapDemoProps = {itemSeconds?:number;outline?:number;drift?:number};
export const StickerSwapDemo = ({itemSeconds=0.35,outline=5,drift=0}:StickerSwapDemoProps) => {
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const endAt=0.35+12*itemSeconds+0.9;
  const opacity=interpolate(frame/fps,[0,0.35,endAt,endAt+0.35-1/fps],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const first=<AlbumBackground image="motion-samples/landscape.svg" paper="#fff8ed"/>;
  const second=<AlbumBackground image="motion-samples/garden.svg" paper="#f9e4ed"/>;
  const third=<AlbumBackground image="motion-samples/clouds.svg" paper="#e4efe8"/>;
  return <AbsoluteFill style={{background:'#fff8ed',overflow:'hidden',color:'#74677b'}}>
    <StickerSwap itemSeconds={itemSeconds} centerX={960} centerY={640} outline={outline} drift={drift} stickerWidth={600} stickerHeight={540} items={[
      {id:'flower-a',content:<Sticker kind="flower"/>,background:first,angle:-7},
      {id:'cup-a',content:<Sticker kind="cup"/>,background:first,angle:4,width:600,x:980},
      {id:'ticket-a',content:<Sticker kind="ticket"/>,background:first,angle:-12,width:620},
      {id:'heart-a',content:<Sticker kind="heart"/>,background:first,angle:7,scale:0.9},
      {id:'ticket-b',content:<Sticker kind="ticket"/>,background:second,angle:8,width:560},
      {id:'flower-b',content:<Sticker kind="flower"/>,background:second,angle:12,x:930},
      {id:'heart-b',content:<Sticker kind="heart"/>,background:second,angle:-9,scale:1.05},
      {id:'cup-b',content:<Sticker kind="cup"/>,background:second,angle:-6,width:600},
      {id:'heart-c',content:<Sticker kind="heart"/>,background:third,angle:3},
      {id:'ticket-c',content:<Sticker kind="ticket"/>,background:third,angle:-6,width:600},
      {id:'cup-c',content:<Sticker kind="cup"/>,background:third,angle:8,width:550},
      {id:'flower-c',content:<Sticker kind="flower"/>,background:third,angle:-4},
    ]}/>
    <div style={{position:'absolute',left:120,top:85,fontFamily:'"PingFang SC",sans-serif',fontSize:24,letterSpacing:4,opacity}}>ZYN / 镜头模板 05</div>
    <div style={{position:'absolute',left:120,top:155,fontFamily:'"Songti SC",Georgia,serif',fontSize:92,opacity}}>把小喜欢，贴进日常。</div>
    <div style={{position:'absolute',left:120,right:120,bottom:65,fontSize:22,letterSpacing:3,opacity,fontFamily:'"PingFang SC",sans-serif'}}>STICKER SWAP / 白边剪贴 · 快速替换 · 三组背景</div>
  </AbsoluteFill>;
};
