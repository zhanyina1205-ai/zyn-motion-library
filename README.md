# ZYN 镜头库 · ZYN Motion Library

三个可复用的 Remotion 镜头动效：**整体上滑**、**拍立得错落浮起**与**立体相册轮转**。

采用奶油白、淡粉、薄荷绿和柔和灰紫的默认示例风格。照片、标题、卡片内容与动画参数可以替换；示例素材为仓库内的通用 SVG，不包含个人照片。

## 启动

```bash
npm ci
npm run dev
```

在 Remotion Studio 中打开 `WholePageSlideDemo`、`FloatingPolaroidsDemo` 或 `PerspectiveCarouselDemo`。示例均为 1920 × 1080 / 30fps。

```bash
npm run check
npm run render:slide
npm run render:float
npm run render:carousel
```

渲染输出位于 `previews/`。首次渲染时 Remotion 可自动下载浏览器，也可传入 `--browser-executable` 指定现有 Chromium。

## 01 · 整体上滑

`src/motions/WholePageSlide.tsx` 导出 `WholePageSlide`、`upwardSlide` 与 `slideTimelineFrames`。

章节内容整体从下方进入，前一个章节向上退出；默认交接时间为 0.5 秒，使用柔和的缓入缓出曲线。标题、图片和装饰保持原有相对位置。

```tsx
import {WholePageSlide,slideTimelineFrames} from './motions';

const Film=()=> <WholePageSlide transitionSeconds={0.5} scenes={[
 {id:'intro',durationInFrames:180,content:<IntroScene/>},
 {id:'album',durationInFrames:210,content:<AlbumScene/>},
]}/>;
// 30fps 时 durationInFrames = slideTimelineFrames([180,210],30,0.5)
// 即 180 + 210 - 15 = 375 帧。
```

每个场景需长于单次转场。两段画面有重叠，主 Composition 时长应扣除每次重叠帧数。

已有 `TransitionSeries` 的项目可以直接在两个 Sequence 之间使用：

```tsx
<TransitionSeries.Transition {...upwardSlide(30,0.5)}/>
```

## 02 · 拍立得错落浮起

`src/motions/FloatingPhotoCard.tsx` 导出 `FloatingPhotoCard` 和通用运动容器 `FloatingCard`。

照片从下方错落浮起，配合轻微透视倾斜、前后距离变化和短暂虚化，随后落回指定相册排版。

```tsx
import {staticFile} from 'remotion';
import {FloatingPhotoCard} from './motions';

const Album=()=> <div style={{position:'absolute',inset:0,
 perspective:1800,perspectiveOrigin:'50% 68%'}}>
 <FloatingPhotoCard
  src={staticFile('images/my-photo.jpg')}
  x={107} y={468} width={365} height={398}
  angle={-9} delaySeconds={8/30} settleSeconds={52/30}
  depth={110} lateral={-55} caption="a moment in time"/>
</div>;
```

将照片放入 `public/images/` 并修改 `src`。建议每张卡片相隔 0.3 秒开始浮起。

| 参数 | 作用 |
|---|---|
| x / y / width / height | 最终位置、相框宽度、照片区域高度 |
| delaySeconds / settleSeconds | 开始时间、浮起到落稳的时长 |
| rise / lateral | 初始竖向和横向偏移 |
| depth / angle / initialTilt | 前后距离、最终旋转与初始透视倾斜 |
| blur / bob | 起始景深虚化、落稳后的轻微漂浮 |
| paper / ink / tape / showTape | 相框、文字、胶带的外观 |
| fit / caption | 照片裁切方式和说明文字 |

四张相册卡片的布局预设见 `presets/cream-polaroids.json`。默认坐标基于 1920 × 1080，其他画幅需调整位置和尺寸；相框两侧各有 17px 内边距，下方说明区高 82px。请为顶部胶带与标题留出空间。

`FloatingCard` 接受任意 children，可复用同一运动来展示产品卡片、作品或其他内容。所有动画由帧号计算，秒数参数会跟随 fps，支持拖动预览与离线渲染。

## 接入已有项目

复制 `src/motions/`，使用与本项目相同版本的 `remotion`、`@remotion/transitions`、React。无需复制完整个人影片。

依赖版本固定在 `package-lock.json` 中。已完成 TypeScript 编译、原模板独立渲染与全片解码验证。

## 公开展示页

[ZYN 镜头库](https://zhanyina1205-ai.github.io/zyn-motion-library/) 可直接分享给任何人查看。网页支持播放、重播、慢放、进度拖动与参数查看；网页源码和通用视频演示位于 `website/`。

展示页通过 GitHub Pages 发布。更新 `website/` 并推送到 `main` 后，GitHub Actions 会自动发布新版本。

## 03 · 立体相册轮转

`src/motions/PerspectiveCarousel.tsx` 导出 `PerspectiveCarousel`、`CarouselPhotoCard` 与 `carouselDurationSeconds`。卡片绕竖直轴围成一圈，停留后逐格向左轮转：右侧卡片展开到正面，前一张退到左侧并收窄。适合封面合集、作品集和相册。演示为 1920×1080 / 30fps / 4.6 秒，公开内容使用通用 SVG。

```tsx
import {staticFile} from 'remotion';
import {PerspectiveCarousel, CarouselPhotoCard, carouselDurationSeconds} from './motions';

const Album = () => <PerspectiveCarousel
  centerX={960} centerY={656} cardWidth={490} cardHeight={555}
  radius={635} perspective={2200} direction="left"
  holdSeconds={0.5} turnSeconds={0.6} turns={2}
  cards={[
    <CarouselPhotoCard src={staticFile('images/cover-1.jpg')} caption="第一段回忆"/>,
    <CarouselPhotoCard src={staticFile('images/cover-2.jpg')} caption="第二段回忆"/>,
    <CarouselPhotoCard src={staticFile('images/cover-3.jpg')} caption="第三段回忆"/>,
    // 可继续添加卡片；演示为八张。
  ]}/>;
// 主 Composition 的帧数 = Math.ceil(carouselDurationSeconds({turns: 2}) * fps)
// 默认 30fps => 138 帧。此镜头内部无场景重叠，不需扣除时长。
```

图片放入 `public/images/`，`src` 使用 `staticFile()`。`cards` 最少三张，可以用任意 React 内容替换拍立得；每张将获得 `cardWidth` × `cardHeight` 的运动容器。八张时每格旋转 45°，换卡片数量后自动改成 `360 / 张数` 度。背面隐藏，环绕几何保留透视，不使用真实时间或 CSS 自动动画。

| 参数 | 组件默认值 | 单位 / 作用 |
|---|---|---|
| cards | 必填 | ReactNode 数组，至少三张 |
| cardWidth / cardHeight | 340 / 470 | px，相框含边缘的完整尺寸；Demo 为 490 / 555 |
| radius | 自动计算 | px，默认 `(cardWidth+24)/(2*tan(π/张数))`；Demo 为 635，避免卡片重叠 |
| perspective | 1900 | px，值越小透视越强；Demo 为 2200 |
| centerX / centerY | 画布中心 | px，基于 Composition；Demo 为 960 / 656 |
| initialAngle | 0 | 度，起始角度；Demo 为 8 |
| direction | left | left / right，逐格方向 |
| turns | 2 | 非负整数，轮转几格 |
| enterSeconds | 0.45 | 秒，淡入、轻升与缩放的入场 |
| holdSeconds | 0.5 | 秒，每一格转动前的停留 |
| turnSeconds | 0.6 | 秒，每格转动时长，需大于零 |
| endHoldSeconds | 1.5 | 秒，最后一格停留 |
| exitSeconds | 0.45 | 秒，淡出并轻移上方 |
| easing | [0.42,0,0.22,1] | 转动的三次贝塞尔缓动 |
| src / caption / eyebrow | 图片必填 / a little memory / COLLECTING MOMENTS | 替换图片和相框文案 |
| paper / ink / fit | #fffdf8 / #74677b / cover | 外观和图片裁切，支持 contain |

总时长 = `enterSeconds + turns × (holdSeconds + turnSeconds) + endHoldSeconds + exitSeconds`，所有秒数跟随 fps。调整 timing 时同步主 Composition 帧数；Demo 已用 `calculateMetadata` 根据速度与停留参数自动更新时长。几何参数基于画布 px，改变画幅需调整坐标和尺寸。

预设见 `presets/perspective-carousel.json`。运行 `npm run render:carousel` 输出 `previews/perspective-carousel.mp4`；在 Studio 选择 `PerspectiveCarouselDemo` 可改方向、转动速度、停留、半径与透视。参考片段约 0—2.23 秒为轮转，末尾另一画面的切镜未纳入；环面数量、实际透视值与缓动无法由单一短片精确反推，采用可调整的近似值。
