import {useId, type ReactNode} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type StickerSwapItem = {
  id: string; content: ReactNode; background?: ReactNode;
  durationSeconds?: number; x?: number; y?: number; width?: number; height?: number;
  angle?: number; scale?: number;
};
export type StickerSwapProps = {
  items: StickerSwapItem[]; itemSeconds?: number; enterSeconds?: number;
  endHoldSeconds?: number; exitSeconds?: number; centerX?: number; centerY?: number;
  stickerWidth?: number; stickerHeight?: number; drift?: number; outline?: number;
};
export const stickerSwapDurationSeconds = (durations: number[], {enterSeconds = 0.35,
  endHoldSeconds = 0.9, exitSeconds = 0.35}: Pick<StickerSwapProps, 'enterSeconds' | 'endHoldSeconds' | 'exitSeconds'> = {}) =>
  enterSeconds + durations.reduce((sum, seconds) => sum + seconds, 0) + endHoldSeconds + exitSeconds;

/** A hard replacement at every boundary. No crossfade or per-sticker bounce.
 * Use transparent images or SVG/React shapes; outline draws a white cut-paper edge.
 * Backgrounds switch only when the authored item changes them.
 */
export const StickerSwap = ({items, itemSeconds = 0.35, enterSeconds = 0.35,
  endHoldSeconds = 0.9, exitSeconds = 0.35, centerX, centerY,
  stickerWidth = 440, stickerHeight = 450, drift = 0, outline = 5}: StickerSwapProps) => {
  const outlineId = useId().replace(/:/g, '') + '-sticker-outline';
  const frame = useCurrentFrame(); const {fps, width, height} = useVideoConfig();
  if (!items.length || itemSeconds <= 0 || enterSeconds <= 0 || exitSeconds <= 0 ||
    endHoldSeconds < 0 || stickerWidth <= 0 || stickerHeight <= 0 || outline < 0 ||
    items.some(item => (item.durationSeconds ?? itemSeconds) <= 0 || (item.width ?? stickerWidth) <= 0 || (item.height ?? stickerHeight) <= 0))
    throw new Error('Invalid StickerSwap items, duration or size.');
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('Sticker IDs must be unique.');
  const t = frame / fps, durations = items.map(item => item.durationSeconds ?? itemSeconds);
  const endAt = enterSeconds + durations.reduce((a,b) => a+b, 0) + endHoldSeconds;
  const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
  let index = 0, start = enterSeconds;
  for (let i = 0; i < items.length - 1; i++) {
    const end = start + durations[i];
    // Epsilon keeps exact frame boundaries stable despite decimal addition.
    if (t + 1e-8 < end) break;
    index = i + 1; start = end;
  }
  const item = items[index], w = item.width ?? stickerWidth, h = item.height ?? stickerHeight;
  const fadeIn = interpolate(t, [0, enterSeconds], [0,1], clamp);
  const fadeOut = interpolate(t, [endAt, endAt + Math.max(1/fps, exitSeconds-1/fps)], [1,0], clamp);
  const age = Math.max(0, t - start);
  return <div style={{position:'absolute', inset:0, opacity:fadeIn*fadeOut}}>
    <svg width={0} height={0} style={{position:'absolute'}} aria-hidden="true"><defs>
      <filter id={outlineId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius={outline} result="edge"/>
        <feFlood floodColor="#fffdf8" result="paper"/><feComposite in="paper" in2="edge" operator="in" result="border"/>
        <feMerge><feMergeNode in="border"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs></svg>
    {item.background}
    <div key={item.id} style={{position:'absolute', left:(item.x ?? centerX ?? width/2)-w/2,
      top:(item.y ?? centerY ?? height/2)-h/2, width:w, height:h,
      rotate:`${item.angle ?? 0}deg`, scale:item.scale ?? 1,
      translate:`0px ${Math.sin(age*2.5)*drift}px`,
      filter:`url(#${outlineId}) drop-shadow(0px 8px 12px #74677b22)`}}>{item.content}</div>
  </div>;
};
