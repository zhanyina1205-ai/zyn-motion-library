import type {ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
export type ThumbnailPanelProps={items:ReactNode[];body?:ReactNode;signature?:ReactNode;heading?:ReactNode;
 centerX?:number;stripTop?:number;panelTop?:number;stripWidth?:number;stripHeight?:number;panelWidth?:number;panelHeight?:number;
 columns?:number;padding?:number;gap?:number;thumbnailSize?:number;gridHeight?:number;
 enterSeconds?:number;staggerSeconds?:number;stripHoldSeconds?:number;expandSeconds?:number;panelHoldSeconds?:number;exitSeconds?:number;drop?:number;paper?:string};
export const thumbnailPanelDurationSeconds=(count:number,{enterSeconds=.3,staggerSeconds=.12,stripHoldSeconds=.59,expandSeconds=.55,panelHoldSeconds=1.45,exitSeconds=.4}:Omit<ThumbnailPanelProps,'items'>={})=>enterSeconds+Math.max(0,count-1)*staggerSeconds+stripHoldSeconds+expandSeconds+panelHoldSeconds+exitSeconds;
/** Items remain the same objects while their boxes move from a row to a grid.
 * panelTop is the final top edge, stripTop is the initial top edge, in canvas pixels. */
export const ThumbnailPanel=({items,body,signature,heading,centerX,stripTop=680,panelTop=230,
 stripWidth=620,stripHeight=155,panelWidth=550,panelHeight=650,columns=2,padding=32,gap=18,thumbnailSize=105,gridHeight=385,
 enterSeconds=.3,staggerSeconds=.12,stripHoldSeconds=.59,expandSeconds=.55,panelHoldSeconds=1.45,exitSeconds=.4,drop=30,paper='#fffdf8'}:ThumbnailPanelProps)=>{
 const frame=useCurrentFrame(),{fps,width}=useVideoConfig(),t=frame/fps;
 if(!items.length||columns<1||!Number.isInteger(columns)||[stripWidth,stripHeight,panelWidth,panelHeight,thumbnailSize,gridHeight,enterSeconds,expandSeconds,exitSeconds].some(n=>!Number.isFinite(n)||n<=0)||[padding,gap,staggerSeconds,stripHoldSeconds,panelHoldSeconds].some(n=>!Number.isFinite(n)||n<0))throw new Error('Invalid ThumbnailPanel geometry or timing.');
 const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const},ease=Easing.bezier(.22,1,.36,1);
 const expandAt=enterSeconds+(items.length-1)*staggerSeconds+stripHoldSeconds;
 const p=interpolate(t,[expandAt,expandAt+expandSeconds],[0,1],{...clamp,easing:Easing.bezier(.5,0,.15,1)});
 const sink=interpolate(t,[Math.max(0,expandAt-.35),expandAt],[0,drop],{...clamp,easing:ease})*(1-p);
 const end=expandAt+expandSeconds+panelHoldSeconds;
 const out=interpolate(t,[end,end+Math.max(1/fps,exitSeconds-1/fps)],[0,1],clamp);
 const cx=centerX??width/2,w=stripWidth+(panelWidth-stripWidth)*p,h=stripHeight+(panelHeight-stripHeight)*p;
 const top=stripTop+(panelTop-stripTop)*p+sink;
 const rows=Math.ceil(items.length/columns),cellW=(panelWidth-padding*2-gap*(columns-1))/columns;
 const cellH=(gridHeight-gap*(rows-1))/rows;
 const stripGap=items.length>1?(stripWidth-padding*2-thumbnailSize*items.length)/(items.length-1):0;
 if(cellW<=0||cellH<=0||stripGap<0||gridHeight+padding*2>panelHeight)throw new Error('ThumbnailPanel content does not fit; resize panel, grid or thumbnails.');
 return <div style={{position:'absolute',inset:0,opacity:1-out,translate:`0px ${out*40}px`}}>
  <div style={{position:'absolute',left:cx-stripWidth/2,top:stripTop-120,fontSize:66,fontWeight:800,color:'#74677b',opacity:interpolate(t,[expandAt-.4,expandAt-.05],[1,0],clamp)}}>{heading}</div>
  <div style={{position:'absolute',left:cx-w/2,top,width:w,height:h,background:paper,borderRadius:18,boxShadow:'0 18px 45px #74677b22',overflow:'hidden'}}>
   {items.map((item,i)=>{
    const a=interpolate(t,[i*staggerSeconds,i*staggerSeconds+enterSeconds],[0,1],{...clamp,easing:ease});
    const local=interpolate(t,[expandAt+i*.025,expandAt+expandSeconds+i*.025],[0,1],{...clamp,easing:ease});
    const initialX=items.length===1?(stripWidth-thumbnailSize)/2:padding+i*(thumbnailSize+stripGap);
    return <div key={i} style={{position:'absolute',left:initialX+(padding+(i%columns)*(cellW+gap)-initialX)*local,
     top:(stripHeight-thumbnailSize)/2+(padding+Math.floor(i/columns)*(cellH+gap)-(stripHeight-thumbnailSize)/2)*local,
     width:thumbnailSize+(cellW-thumbnailSize)*local,height:thumbnailSize+(cellH-thumbnailSize)*local,
     opacity:a,translate:`0px ${(1-a)*22}px`,scale:.7+.3*a,borderRadius:10,overflow:'hidden',boxShadow:'0 4px 12px #74677b22'}}>{item}</div>;
   })}
   <div style={{position:'absolute',left:padding,right:padding,top:padding+gridHeight+28,
    opacity:interpolate(t,[expandAt+expandSeconds*.8,expandAt+expandSeconds+.3],[0,1],clamp),
    translate:`0px ${interpolate(t,[expandAt+expandSeconds*.8,expandAt+expandSeconds+.3],[12,0],clamp)}`}}>{body}</div>
   <div style={{position:'absolute',right:padding,bottom:30,rotate:'-7deg',opacity:interpolate(t,[expandAt+expandSeconds+.55,expandAt+expandSeconds+.85],[0,1],clamp)}}>{signature}</div>
  </div>
 </div>;
};
