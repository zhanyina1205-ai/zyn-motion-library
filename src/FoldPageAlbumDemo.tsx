import {AbsoluteFill,CanvasImage,staticFile} from 'remotion';
import {FoldPageAlbum} from './motions';
export type FoldPageAlbumDemoProps={turnSeconds?:number;curlAngle?:number;popupDepth?:number};
const Product=({tube=false}:{tube?:boolean})=><CanvasImage src={staticFile(tube?'motion-samples/care-tube.svg':'motion-samples/care-bottle.svg')} style={{width:'100%',height:'100%',objectFit:'contain'}}/>;
const Page=({kind}:{kind:'tube'|'bottle'|'blank'|'flowers'|'garden'})=><div style={{width:'100%',height:'100%',position:'relative',background:'#fffdf8',color:'#74677b'}}>
 {kind==='tube'&&<><div style={{position:'absolute',left:185,top:100,width:180,height:395}}><Product tube/></div><div style={{position:'absolute',left:0,right:0,bottom:52,textAlign:'center',fontSize:27,fontFamily:'Georgia'}}>a soft little day</div></>}
 {kind==='bottle'&&<div style={{position:'absolute',left:165,top:120,width:220,height:370}}><Product/></div>}
 {(kind==='flowers'||kind==='garden')&&<svg width="100%" height="100%" viewBox="0 0 550 640">
  <g fill="#f5bdd3" stroke="#74677b" strokeWidth={2}>{[[-5,105],[32,320],[160,95],[320,375],[345,170]].map(([x,y],i)=><g key={i} transform={`translate(${x+100} ${y+80}) rotate(${i*21})`}><ellipse rx={15} ry={33}/><ellipse rx={15} ry={33} transform="rotate(60)"/><ellipse rx={15} ry={33} transform="rotate(120)"/><circle r={10} fill="#fff8ed"/></g>)}</g>
  {kind==='garden'&&<g fill="#ccded7" stroke="#74677b" strokeWidth={3}><path d="M180 550Q275 460 405 515M135 245Q215 180 180 95" fill="none"/>{Array.from({length:6},(_,i)=><ellipse key={i} cx={195+i*35} cy={520-i*8} rx={13} ry={35} transform={`rotate(${30+i*9} ${195+i*35} ${520-i*8})`}/>)}</g>}
 </svg>}
</div>;
export const FoldPageAlbumDemo=({turnSeconds=.8,curlAngle=20,popupDepth=65}:FoldPageAlbumDemoProps)=><AbsoluteFill style={{background:'#e4efe8',color:'#74677b',overflow:'hidden',fontFamily:'"PingFang SC",sans-serif'}}>
 <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 70%,#fff8ed,transparent 80%)'}}/>
 <div style={{position:'absolute',left:120,top:65,fontSize:24,letterSpacing:4}}>ZYN / 镜头模板 09</div>
 <div style={{position:'absolute',left:120,top:130,fontFamily:'"Songti SC",Georgia,serif',fontSize:86}}>翻一页，发现小惊喜。</div>
 <FoldPageAlbum centerX={960} centerY={625} turnSeconds={turnSeconds} curlAngle={curlAngle} popupDepth={popupDepth}
  leftPage={<Page kind="tube"/>} rightPages={[<Page kind="bottle"/>,<Page kind="blank"/>,<Page kind="flowers"/>,<Page kind="garden"/>]}
  popup={<Product/>}/>
 <div style={{position:'absolute',left:120,bottom:40,fontSize:22,letterSpacing:3}}>FOLD PAGE ALBUM / 书脊折页 · 连续揭示 · 物件展开</div>
</AbsoluteFill>;
