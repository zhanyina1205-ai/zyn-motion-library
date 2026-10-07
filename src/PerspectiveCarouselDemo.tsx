import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {PerspectiveCarousel, CarouselPhotoCard} from './motions';

export type PerspectiveCarouselDemoProps = {
  direction?: 'left' | 'right';
  turnSeconds?: number;
  holdSeconds?: number;
  radius?: number;
  perspective?: number;
};
export const PerspectiveCarouselDemo = ({direction = 'left', turnSeconds = 0.6,
  holdSeconds = 0.5, radius = 635, perspective = 2200}: PerspectiveCarouselDemoProps) => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const exitAt = 0.45 + 2 * (holdSeconds + turnSeconds) + 1.5;
  const opacity = interpolate(frame / fps, [0, 0.3, exitAt, exitAt + 0.45], [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#fff8ed', color: '#74677b', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background:
      'radial-gradient(ellipse at 50% 62%, #eee4f2 0%, #f2eaf2 27%, #fff8ed 68%)'}}/>
    <div style={{position: 'absolute', left: 120, top: 85, opacity,
      fontFamily: '"PingFang SC", sans-serif', fontSize: 24, letterSpacing: 4}}>ZYN / 镜头模板 03</div>
    <div style={{position: 'absolute', left: 120, top: 155, opacity,
      fontFamily: '"Songti SC", Georgia, serif', fontSize: 92, fontWeight: 600}}>让回忆，转到眼前。</div>
    <div style={{position: 'absolute', left: 124, top: 287, opacity,
      fontFamily: '"PingFang SC", sans-serif', fontSize: 32, letterSpacing: 2}}>一格停留 · 一格轮转 · 收藏每个小瞬间</div>
    <PerspectiveCarousel cardWidth={490} cardHeight={555} centerX={960} centerY={656}
      radius={radius} perspective={perspective} initialAngle={8} direction={direction}
      turnSeconds={turnSeconds} holdSeconds={holdSeconds} cards={[
        <CarouselPhotoCard src={staticFile('carousel/sample-one.svg')} caption="把晴天收藏起来"/>,
        <CarouselPhotoCard src={staticFile('carousel/sample-two.svg')} caption="和风一起散步"/>,
        <CarouselPhotoCard src={staticFile('carousel/sample-three.svg')} caption="遇见柔软的日常"/>,
        <CarouselPhotoCard src={staticFile('carousel/sample-four.svg')} caption="下一站，小小冒险"/>,
        <CarouselPhotoCard src={staticFile('carousel/sample-one.svg')} caption="慢慢收集美好" paper="#fcebf1"/>,
        <CarouselPhotoCard src={staticFile('carousel/sample-two.svg')} caption="把好奇装进行囊" paper="#e6efea"/>,
        <CarouselPhotoCard src={staticFile('carousel/sample-three.svg')} caption="今天也有小惊喜" paper="#f2eaf5"/>,
        <CarouselPhotoCard src={staticFile('carousel/sample-four.svg')} caption="每一页都喜欢"/>,
      ]}/>
    <div style={{position: 'absolute', left: 120, right: 120, bottom: 70, opacity,
      display: 'flex', justifyContent: 'space-between', fontSize: 22,
      fontFamily: '"PingFang SC", sans-serif', letterSpacing: 3}}>
      <span>PERSPECTIVE CAROUSEL</span><span>little moments, lovely memories</span>
    </div>
  </AbsoluteFill>;
};
