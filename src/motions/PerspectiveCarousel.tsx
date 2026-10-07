import type {ReactNode} from 'react';
import {CanvasImage, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type PerspectiveCarouselProps = {
  cards: ReactNode[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  perspective?: number;
  centerX?: number;
  centerY?: number;
  initialAngle?: number;
  direction?: 'left' | 'right';
  turns?: number;
  enterSeconds?: number;
  holdSeconds?: number;
  turnSeconds?: number;
  endHoldSeconds?: number;
  exitSeconds?: number;
  easing?: [number, number, number, number];
};
export const carouselDurationSeconds = ({turns = 2, enterSeconds = 0.45,
  holdSeconds = 0.5, turnSeconds = 0.6, endHoldSeconds = 1.5,
  exitSeconds = 0.45}: Omit<PerspectiveCarouselProps, 'cards'> = {}) =>
  enterSeconds + turns * (holdSeconds + turnSeconds) + endHoldSeconds + exitSeconds;

/** A frame-driven ring. Front face sits at z=0; the ring center is z=-radius.
 * centerX/Y use Composition pixels. Each turn advances exactly one card.
 * Card content is arbitrary React markup, with dimensions supplied by this wrapper.
 */
export const PerspectiveCarousel = ({cards, cardWidth = 340, cardHeight = 470,
  radius, perspective = 1900, centerX, centerY, initialAngle = 0,
  direction = 'left', turns = 2, enterSeconds = 0.45, holdSeconds = 0.5,
  turnSeconds = 0.6, endHoldSeconds = 1.5, exitSeconds = 0.45,
  easing = [0.42, 0, 0.22, 1]}: PerspectiveCarouselProps) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  if (cards.length < 3) throw new Error('PerspectiveCarousel needs at least three cards.');
  if (!Number.isInteger(turns) || turns < 0 || turnSeconds <= 0 || enterSeconds <= 0 ||
      exitSeconds <= 0 || holdSeconds < 0 || endHoldSeconds < 0 ||
      cardWidth <= 0 || cardHeight <= 0 || perspective <= 0 || (radius !== undefined && radius <= 0))
    throw new Error('Invalid carousel geometry or timing.');
  const ringRadius = radius ?? (cardWidth + 24) / (2 * Math.tan(Math.PI / cards.length));
  const x = centerX ?? width / 2, y = centerY ?? height / 2;
  const step = 360 / cards.length;
  const seconds = frame / fps;
  const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  let progress = 0;
  for (let turn = 0; turn < turns; turn++) {
    const start = enterSeconds + holdSeconds + turn * (holdSeconds + turnSeconds);
    progress += interpolate(seconds, [start, start + turnSeconds], [0, 1],
      {...clamp, easing: Easing.bezier(...easing)});
  }
  const rotation = initialAngle + (direction === 'left' ? -1 : 1) * progress * step;
  const exitAt = enterSeconds + turns * (holdSeconds + turnSeconds) + endHoldSeconds;
  const entrance = interpolate(seconds, [0, enterSeconds], [0, 1],
    {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const exit = interpolate(seconds, [exitAt, exitAt + exitSeconds], [0, 1],
    {...clamp, easing: Easing.bezier(0.55, 0, 1, 1)});
  return <div style={{position: 'absolute', inset: 0,
    opacity: entrance * (1 - exit),
    translate: `0px ${(1 - entrance) * 70 - exit * 55}px`,
    scale: 0.94 + entrance * 0.06 - exit * 0.04}}>
    <div style={{position: 'absolute', inset: 0, perspective,
      perspectiveOrigin: `${x}px ${y}px`}}>
      <div style={{position: 'absolute', left: x, top: y,
        transformStyle: 'preserve-3d',
        transform: `translateZ(${-ringRadius}px) rotateY(${rotation}deg)`}}>
        {cards.map((card, index) => <div key={index} style={{position: 'absolute',
          left: -cardWidth / 2, top: -cardHeight / 2,
          width: cardWidth, height: cardHeight, backfaceVisibility: 'hidden',
          transform: `rotateY(${index * step}deg) translateZ(${ringRadius}px)`}}>
          {card}
        </div>)}
      </div>
    </div>
  </div>;
};

export type CarouselPhotoCardProps = {
  src: string;
  caption?: string;
  eyebrow?: string;
  paper?: string;
  ink?: string;
  fit?: 'cover' | 'contain';
};
/** Appearance only. All movement belongs to PerspectiveCarousel. */
export const CarouselPhotoCard = ({src, caption = 'a little memory',
  eyebrow = 'COLLECTING MOMENTS', paper = '#fffdf8', ink = '#74677b',
  fit = 'cover'}: CarouselPhotoCardProps) => <div style={{width: '100%', height: '100%',
    boxSizing: 'border-box', padding: '14px 14px 0', background: paper,
    borderRadius: 4, border: '1px solid #e4dce7', boxShadow: '0 12px 28px #74677b14',
    display: 'flex', flexDirection: 'column', color: ink, overflow: 'hidden'}}>
    <CanvasImage src={src} style={{width: '100%', flex: 1, minHeight: 0, objectFit: fit}}/>
    <div style={{height: 84, flexShrink: 0, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', textAlign: 'center'}}>
      <div style={{fontSize: 10, letterSpacing: 2, fontFamily: 'sans-serif', opacity: 0.65}}>{eyebrow}</div>
      <div style={{fontSize: 23, marginTop: 7, fontFamily: '"Songti SC", Georgia, serif'}}>{caption}</div>
    </div>
  </div>;
