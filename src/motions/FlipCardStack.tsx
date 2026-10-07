import type {ReactNode} from 'react';
import {CanvasImage, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type FlipCardStackProps = {
  cards: ReactNode[];
  cardWidth?: number; cardHeight?: number; centerX?: number; centerY?: number;
  startIndex?: number; stepSeconds?: number; enterSeconds?: number; frontHoldSeconds?: number;
  zoomSeconds?: number; zoomHoldSeconds?: number; exitSeconds?: number;
  spread?: number; depthStep?: number; perspective?: number; flipAngle?: number;
  bend?: number; direction?: 'left' | 'right'; zoomScale?: number;
};
export const flipStackDurationSeconds = (count: number, {enterSeconds = 0.4,
  stepSeconds = 0.1, startIndex = 0, frontHoldSeconds = 0.85, zoomSeconds = 0.5,
  zoomHoldSeconds = 1.1, exitSeconds = 0.45}: Omit<FlipCardStackProps, 'cards'> = {}) =>
  enterSeconds + Math.max(0, count - 1 - startIndex) * stepSeconds + frontHoldSeconds + zoomSeconds + zoomHoldSeconds + exitSeconds;

/** Pixels use the Composition canvas. Every card crosses the same foreground slot.
 * bend clips a gently bowed outline; it approximates curved paper, not a cloth mesh.
 * The last card zooms to cover the canvas; preceding cards fade behind it.
 */
export const FlipCardStack = ({cards, cardWidth = 720, cardHeight = 520,
  centerX, centerY, startIndex = 0, stepSeconds = 0.1, enterSeconds = 0.4,
  frontHoldSeconds = 0.85, zoomSeconds = 0.5, zoomHoldSeconds = 1.1,
  exitSeconds = 0.45, spread = 52, depthStep = 35, perspective = 1800,
  flipAngle = 65, bend = 20, direction = 'left', zoomScale}: FlipCardStackProps) => {
  const frame = useCurrentFrame(); const {fps, width, height} = useVideoConfig();
  if (cards.length < 2 || !Number.isInteger(startIndex) || startIndex < 0 || startIndex >= cards.length || stepSeconds <= 0 || enterSeconds <= 0 || zoomSeconds <= 0 ||
    exitSeconds <= 0 || frontHoldSeconds < 0 || zoomHoldSeconds < 0 ||
    cardWidth <= 0 || cardHeight <= 0 || spread < 0 || depthStep < 0 || perspective <= 0 ||
    bend < 0 || bend >= cardHeight / 4 || (zoomScale !== undefined && zoomScale < 1))
    throw new Error('Invalid FlipCardStack content, timing or geometry.');
  const seconds = frame / fps; const cx = centerX ?? width / 2, cy = centerY ?? height / 2;
  const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const flipEnd = enterSeconds + (cards.length - 1 - startIndex) * stepSeconds;
  const zoomAt = flipEnd + frontHoldSeconds;
  const zoom = interpolate(seconds, [zoomAt, zoomAt + zoomSeconds], [0, 1],
    {...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1)});
  const zoomTo = zoomScale ?? Math.max(width / cardWidth, height / cardHeight) * 1.08;
  const exitAt = zoomAt + zoomSeconds + zoomHoldSeconds;
  const entrance = interpolate(seconds, [0, enterSeconds], [0, 1],
    {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const exit = interpolate(seconds, [exitAt, exitAt + Math.max(1 / fps, exitSeconds - 1 / fps)], [0, 1], clamp);
  let progress = startIndex;
  for (let i = 0; i < cards.length - 1 - startIndex; i++) {
    const start = enterSeconds + i * stepSeconds;
    progress += interpolate(seconds, [start, start + stepSeconds], [0, 1],
      {...clamp, easing: Easing.bezier(0.35, 0, 0.25, 1)});
  }
  const sign = direction === 'left' ? 1 : -1;
  const finalIndex = cards.length - 1;
  const ordered = cards.map((content, index) => ({content, index, relative: index - progress}))
    .sort((a, b) => Math.abs(b.relative) - Math.abs(a.relative) || a.index - b.index);
  return <div style={{position: 'absolute', inset: 0, opacity: entrance * (1 - exit),
    transformOrigin: `${cx}px ${cy}px`,
    transform: `translateY(${(1 - entrance) * 45 + (height / 2 - cy) * zoom}px) scale(${0.96 + entrance * 0.04 + zoom * (zoomTo - 1)})`}}>
    <div style={{position: 'absolute', inset: 0, perspective,
      perspectiveOrigin: `${cx}px ${cy}px`}}>
      {ordered.map(({content, index, relative}) => {
        const near = Math.min(1, Math.abs(relative));
        const turn = Math.abs(relative) < 1 ? Math.sin(near * Math.PI) : 0;
        const yaw = Math.sign(relative) * sign * (turn * flipAngle + near * 5);
        const bow = bend * (1 - (index === finalIndex ? zoom : 0));
        const r = 18, w = cardWidth, h = cardHeight;
        const outline = `M${r},0 Q${w / 2},${bow * 2} ${w-r},0 Q${w},0 ${w},${r} L${w},${h-r} Q${w},${h} ${w-r},${h} Q${w / 2},${h-bow*2} ${r},${h} Q0,${h} 0,${h-r} L0,${r} Q0,0 ${r},0 Z`;
        return <div key={index} style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2,
          width: w, height: h, zIndex: cards.length - Math.round(Math.abs(relative) * 10),
          opacity: index === finalIndex ? 1 : 1 - zoom,
          transform: `translateX(${relative * spread * sign}px) translateZ(${-Math.abs(relative) * depthStep}px) rotateY(${yaw}deg)`,
          backfaceVisibility: 'hidden', filter: `brightness(${1 - Math.min(Math.abs(relative), 8) * 0.025})`}}>
          <div style={{width: w, height: h, clipPath: `path('${outline}')`, background: '#fffdf8'}}>{content}</div>
          <svg width={w} height={h} style={{position:'absolute', inset:0, pointerEvents:'none'}}>
            <path d={outline} fill="none" stroke="#d7c9de" strokeWidth={2}/>
          </svg>
        </div>;
      })}
    </div>
  </div>;
};

export const StackPhotoCard = ({src, caption = 'a little memory'}: {src: string; caption?: string}) =>
  <div style={{width:'100%', height:'100%', boxSizing:'border-box', background:'#fffdf8',
    padding:'18px 18px 0', display:'flex', flexDirection:'column'}}>
    <CanvasImage src={src} style={{width:'100%', flex:1, minHeight:0, objectFit:'cover'}}/>
    <div style={{height:68, display:'grid', placeItems:'center', color:'#74677b',
      fontFamily:'"Songti SC", Georgia, serif', fontSize:30}}>{caption}</div>
  </div>;
