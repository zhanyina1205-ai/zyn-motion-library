# ZYN 镜头库 · ZYN Motion Library

十四个可复用的 Remotion 镜头动效：**整体上滑**、**拍立得错落浮起**、**立体相册轮转**、**弧面叠卡快翻**、**剪贴物快切**、**缩略条展开卡片**、**色差故障切镜**、**画面收窗信息卡**、**折页相册揭物**、**中心开屏快闪**、**拼贴海报分层入场**、**撕纸云朵擦镜**、**双面翻卡扫光**与**游走聚光蒙版**。

采用奶油白、淡粉、薄荷绿和柔和灰紫的默认示例风格。照片、标题、卡片内容与动画参数可以替换；示例素材为仓库内的通用 SVG，不包含个人照片。

## 启动

```bash
npm ci
npm run dev
```

在 Remotion Studio 中打开 `WholePageSlideDemo`、`FloatingPolaroidsDemo`、`PerspectiveCarouselDemo`、`FlipCardStackDemo` 、`StickerSwapDemo`、`ThumbnailPanelDemo` 、`ChromaticGlitchDemo` 、`MediaWindowCardDemo` 、`FoldPageAlbumDemo` 、`CenterApertureFlashDemo`、`LayeredCollagePosterDemo`、`TornPaperCloudWipeDemo`、`FlipShineCardDemo` 或 `WanderingSpotlightDemo`。示例均为 1920 × 1080 / 30fps。

```bash
npm run check
npm run render:slide
npm run render:float
npm run render:carousel
npm run render:stack
npm run render:stickers
npm run render:panel
npm run render:glitch
npm run render:window
npm run render:book
npm run render:aperture
npm run render:collage
npm run render:cloudwipe
npm run render:flipshine
npm run render:spotlight
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

## 04 · 弧面叠卡快翻

`FlipCardStack` 按帧计算一叠卡片的前后层级：每次当前卡片向左斜翻，下一张展开到同一前景位置。卡片上下边采用轻微弧形剪裁。最后一张停留后推近到铺满画布，旧卡片退隐。独立 Demo `FlipCardStackDemo` 为 4 秒 / 1920×1080 / 30fps；包含 10 张卡片，从第 3 张开始，连续快翻 7 次。

```tsx
import {staticFile} from 'remotion';
import {FlipCardStack, StackPhotoCard, flipStackDurationSeconds} from './motions';

const cards = [
  <StackPhotoCard src={staticFile('images/photo-1.jpg')} caption="第一段回忆"/>,
  <StackPhotoCard src={staticFile('images/photo-2.jpg')} caption="第二段回忆"/>,
  <StackPhotoCard src={staticFile('images/photo-3.jpg')} caption="第三段回忆"/>,
];
const options = {stepSeconds: 0.1, startIndex: 0};
const Album = () => <FlipCardStack cards={cards} {...options}/>;
// 主 Composition 帧数 = Math.ceil(flipStackDurationSeconds(cards.length, options) * fps - 1e-8)
```

| 参数 | 组件默认值 | 单位与作用 |
|---|---|---|
| cards | 必填 | ReactNode 数组，至少两张；支持任意卡片内容 |
| cardWidth / cardHeight | 720 / 520 | px，卡片完整外框尺寸 |
| centerX / centerY | 画布中心 | px；Demo 为 960 / 665 |
| startIndex | 0 | 从零开始的索引；Demo 为 2，起始时两侧已有叠层 |
| stepSeconds | 0.1 | 秒，每次翻卡；30fps 默认约 3 帧 |
| enterSeconds / frontHoldSeconds | 0.4 / 0.85 | 秒，入场与最后一张推近前的停留 |
| zoomSeconds / zoomHoldSeconds / exitSeconds | 0.5 / 1.1 / 0.45 | 秒，推近、铺满停留、退出 |
| spread / depthStep | 52 / 35 | px，叠卡横向错位与后退距离 |
| perspective / flipAngle | 1800 / 65 | px / 度，透视与翻转峰值 |
| bend | 20 | px，上下弧边深度；0 为直边，低于卡片高度的四分之一 |
| direction | left | left / right，快翻方向 |
| zoomScale | 自动铺满 | 缩放倍数，默认 max(画宽/卡宽,画高/卡高) × 1.08；1 可关闭推近放大 |
| StackPhotoCard src / caption | 图片必填 / a little memory | 替换图片地址和相框文字 |

总时长 = 入场 + `(张数 - 1 - startIndex)` × 每次翻卡 + 前景停留 + 推近 + 铺满停留 + 退出，无转场重叠。秒数自动跟随 fps；3 帧的快速动作建议在 Studio 慢放查看，调慢 `stepSeconds` 后 Demo 会自动增加合成时长。像素坐标基于 Composition 画布，其他画幅需调整布局。

照片放入 `public/images/` 并用 `staticFile()` 引用，预设为 `presets/curved-card-stack.json`。弧边剪裁近似原片的曲面轮廓，未对图片内容做真实网格弯曲。推近时刻与参考录屏的播放器操作重合，作为可调机制保留，不声称还原了原作者的完整三维模型。

## 05 · 剪贴物快切

`StickerSwap` 在固定舞台上逐个硬切替换物件，每件可以有独立尺寸、位置、角度、停留和背景。默认没有单物件弹跳或交叉淡化。外轮廓以 SVG 膨胀滤镜形成 5px 奶油白纸边。Demo `StickerSwapDemo` 为 5.8 秒 / 1920×1080 / 30fps，12 次物件展示分为三组背景。

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {StickerSwap, stickerSwapDurationSeconds} from './motions';

const items = [
  {id:'flower',content:<CanvasImage src={staticFile('stickers/flower.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/>,angle:-8},
  {id:'cup',content:<CanvasImage src={staticFile('stickers/cup.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/>,angle:6,durationSeconds:0.4},
];
const Film = () => <StickerSwap items={items} itemSeconds={0.35}/>;
// 主 Composition 帧数 = Math.ceil(stickerSwapDurationSeconds(items.map(i => i.durationSeconds ?? 0.35)) * fps - 1e-8)
```

| 参数 | 组件默认值 | 单位与作用 |
|---|---|---|
| items | 必填 | 每项包含唯一 id 和 content，至少一项 |
| itemSeconds | 0.35 | 秒，默认每件物件的展示时长 |
| enterSeconds / endHoldSeconds / exitSeconds | 0.35 / 0.9 / 0.35 | 秒，整场入场、最后一件额外停留、整场退出 |
| centerX / centerY | 画布中心 | px；Demo 为 960 / 640 |
| stickerWidth / stickerHeight | 440 / 450 | px，默认物件盒子；Demo 为 600 / 540 |
| outline | 5 | px，白边半径；0 不加边 |
| drift | 0 | px，轻漂浮幅度；参考硬切预设保持 0 |
| item.durationSeconds | itemSeconds | 秒，覆盖单项停留；需大于零 |
| item.x / y / width / height | 场景默认值 | px，覆盖单项位置和尺寸 |
| item.angle / scale | 0 / 1 | 度 / 倍数，覆盖单项倾斜和大小 |
| item.background | 无 | ReactNode，铺在物件后面；切换背景时与物件同时硬切 |

物件应使用透明 PNG、透明 SVG 或 React 图形，矩形照片也可保留相框。将素材放入 `public/stickers/`，替换 `content`；不用带白色不透明背景的截图冒充抠图。总时长 = 入场 + 各项停留之和 + 末项额外停留 + 退出，无交叉淡化重叠。30fps 的 0.35 秒不是整数帧，边界按实际帧时间依次落在 10 / 11 帧附近，Demo 按总时长取帧数。预设为 `presets/sticker-swap.json`。

运行 `npm run render:stack` 或 `npm run render:stickers` 可分别导出。用于网页时，应再用 `ffmpeg -i input.mp4 -c copy -movflags +faststart output.mp4` 将索引移至文件开头；服务器支持 HTTP Range 时可拖动进度。素材均为可公开的通用 SVG，参考视频及其原始音轨不包含在公开项目中。

## 06 · 缩略条展开卡片

`ThumbnailPanel` 把同一组内容从缩略横条连续移动到多列卡片：缩略图错落出现，标题退隐，横条下移，再向上展开；正文与签名随后出现。Demo 四项，为 110 帧 / 约 3.67 秒。

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {ThumbnailPanel, thumbnailPanelDurationSeconds} from './motions';
const items = ['one.jpg','two.jpg','three.jpg','four.jpg'].map(src =>
  <CanvasImage src={staticFile('images/'+src)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>);
const options = {expandSeconds:0.55, staggerSeconds:0.12};
const Card = () => <ThumbnailPanel items={items} {...options}
  heading="COLLECTION" body={<p>这里替换正文</p>} signature="little moments"/>;
// 主 Composition 帧数 = Math.ceil(thumbnailPanelDurationSeconds(items.length, options) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| items | 必填 | ReactNode 数组，至少一项；按同一索引从横条移到网格 |
| heading / body / signature | 无 | ReactNode，可替换标题、正文、签名；标题先退隐 |
| centerX | 画布宽度的一半 | px，水平中心；Demo 1190 |
| stripTop / panelTop | 680 / 230 | px，初始横条与最终卡片的上边；Demo 710 / 245 |
| stripWidth / stripHeight | 620 / 155 | px，初始横条尺寸 |
| panelWidth / panelHeight | 550 / 650 | px，展开后卡片尺寸 |
| columns | 2 | 整数，最终网格列数 |
| padding / gap | 32 / 18 | px，卡片边距、网格间距 |
| thumbnailSize / gridHeight | 105 / 385 | px，初始缩略图正方形边长、最终图片网格总高 |
| enterSeconds / staggerSeconds | 0.3 / 0.12 | 秒，每张入场时长、相邻入场错落间隔 |
| stripHoldSeconds / expandSeconds | 0.59 / 0.55 | 秒，全部缩略图入场后横条停留、展开时间 |
| panelHoldSeconds / exitSeconds | 1.45 / 0.4 | 秒，展开后停留、整卡淡出下移 |
| drop | 30 | px，展开前短暂下移幅度 |
| paper | #fffdf8 | CSS 颜色，纸面底色 |

总时长 = `enterSeconds + (项目数 - 1) × staggerSeconds + stripHoldSeconds + expandSeconds + panelHoldSeconds + exitSeconds`；总秒数向上取整到帧。入场错落会重叠，展开期间图片自身移动带约 0.025 秒错落，已包含在默认卡片停留内。正文在展开末段开始出现，签名在展开后 0.55—0.85 秒出现，若要完整看见签名，`panelHoldSeconds` 应至少 0.85 秒。

像素参数以 Composition 画布为基准；其他画幅需调坐标和尺寸。更多图片要同步调整横条宽度、缩略图大小、列数与网格高度；组件会检查图片格子的基础空间，正文仍需自行控制高度。图片放在 `public/images/`，预设为 `presets/thumbnail-panel.json`。Demo `calculateMetadata` 随展开时长和错落间隔更新总帧数。运行 `npm run render:panel`。

## 07 · 色差故障切镜

`ChromaticGlitchTransition` 先停留前一幕，在短暂叠色错位和水平切片中切到后一幕，可选图标从下方斜转上浮，再下沉退出。切镜发生在 `transitionSeconds` 的中点，背景不交叉淡化。Demo 为 3.2 秒 / 96 帧。

```tsx
import {AbsoluteFill} from 'remotion';
import {ChromaticGlitchTransition, chromaticGlitchDurationSeconds} from './motions';
const options = {beforeHoldSeconds:1,transitionSeconds:0.9,afterHoldSeconds:1.3};
const Cut = () => <ChromaticGlitchTransition {...options}
  before={<AbsoluteFill style={{background:'#e4efe8'}}>前一幕</AbsoluteFill>}
  after={<AbsoluteFill style={{background:'#eee6f2'}}>后一幕</AbsoluteFill>}
  badge={<div style={{width:'100%',height:'100%',background:'#74677b',color:'#fffdf8'}}>Z</div>}/>;
// 主 Composition 帧数 = Math.ceil(chromaticGlitchDurationSeconds(options) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| before / after | 必填 | ReactNode，前后两幕视觉内容；背景可用 AbsoluteFill |
| badge | 无 | ReactNode，可替换图标；省略只保留色差和切片 |
| beforeHoldSeconds / transitionSeconds / afterHoldSeconds | 1 / 0.9 / 1.3 | 秒，前景停留、错位转场、后景停留 |
| split / sliceShift | 22 / 30 | px，彩色叠层分离与横切片位移峰值 |
| slices | 7 | 正整数，横向切片数量 |
| badgeSize | 280 | px，图标容器正方形尺寸 |
| badgeX / badgeY | 画布中心 | px，图标落位中心；Demo 1010 / 550 |
| colorA / colorB | #f5bdd3 / #ccded7 | CSS 颜色，两个分离叠层色彩 |
| tintOpacity | 0.48 | 0—1，叠色最大不透明度 |

总时长 = 前景停留 + 转场 + 后景停留，没有场景淡化重叠；秒数跟随 fps。图标在转场前 0.1 秒开始入场，转场后 0.35 秒开始下沉，0.65 秒后完全退出；需要完整图标退出时，`afterHoldSeconds` 至少为 1 秒。空间尺寸基于当前画布，图标进出距离自动跟随画布高度。

实现使用按帧确定的正弦扰动和 CSS 叠色近似参考的 RGB 分离，不是原片滤镜算法；默认淡粉/薄荷配色遵循镜头库风格。两幕会克隆用于叠层和切片，应使用无音频、无副作用、无全局重复 DOM ID 的视觉 JSX；音频另外编排。图标素材放在 `public/icons/`，可用 CanvasImage 与 staticFile 引用。预设为 `presets/chromatic-glitch.json`。Demo `calculateMetadata` 随转场时长自动增加总帧数。运行 `npm run render:glitch`。

## 08 · 画面收窗信息卡

`MediaWindowCard` 把填满卡片的画面收成横向窗口，下移过冲后回稳，逐步揭示上方标题和下方说明卡。媒体内容保持同一个 JSX 实例，窗口持续改变尺寸，图片可用 `objectFit: 'cover'` 连续重构裁切。独立 Demo 逻辑时长 3.75 秒，取整为 113 帧 / 约 3.77 秒，1920×1080 / 30fps。

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {MediaWindowCard, mediaWindowCardDurationSeconds} from './motions';
const options = {shrinkSeconds:0.55,settleSeconds:0.45,bounce:65};
const Card = () => <MediaWindowCard {...options}
  media={<CanvasImage src={staticFile('images/portrait.jpg')}
    style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 60%'}}/>}
  headline={<div>04<br/>MOMENTS</div>}
  caption={<p>这里替换说明文字</p>}/>;
// 主 Composition 帧数 = Math.ceil(mediaWindowCardDurationSeconds(options) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| media | 必填 | ReactNode，填满窗口的媒体内容；图片、视频或自己的图形 |
| headline / caption | 无 | ReactNode，上方标题和下方说明，可自行控制字号与内容 |
| centerX / centerY | 画布中心 | px，整个卡片的中心；Demo 为 1325 / 555 |
| cardWidth / cardHeight | 580 / 780 | px，整个卡片尺寸 |
| inset | 24 | px，收窗后的左右边距及说明卡边距 |
| windowTop / windowHeight | 250 / 290 | px，最终媒体窗口的上边位置和高度 |
| headlineTop | 45 | px，标题容器上边位置 |
| captionTop / captionHeight | 570 / 160 | px，说明卡上边位置和高度 |
| enterSeconds / fullHoldSeconds | 0.35 / 0.5 | 秒，整卡入场和完整画面停留 |
| shrinkSeconds / settleSeconds | 0.55 / 0.45 | 秒，收窗和过冲后的回稳时间 |
| captionDelaySeconds / captionRevealSeconds | 0.15 / 0.35 | 秒，收窗结束到说明卡开始的延迟、说明卡展开时间 |
| holdSeconds / exitSeconds | 1.45 / 0.4 | 秒，回稳和说明展开完成后停留、整卡退出 |
| bounce | 65 | px，下移过冲幅度；0 可关闭过冲 |
| paper / captionColor | #eee6f2 / #f9e2ec | CSS 颜色，卡片背景和说明底色 |

卡片内部的窗口、标题和说明位置均以卡片左上角为原点，`centerX / centerY` 使用 Composition 全局坐标。窗口底部不能超过说明卡上边，说明卡需位于底边距内；标题和说明内容仍需按所选字号自行适配。

总时长 = `enterSeconds + fullHoldSeconds + shrinkSeconds + max(settleSeconds, captionDelaySeconds + captionRevealSeconds) + holdSeconds + exitSeconds`。回稳与说明展开同时进行，不能把两段全部相加。说明文字在说明展开后段出现，并多用约 0.12 秒淡入，默认停留已覆盖；标题在收窗后半段显现。秒数跟随 fps，Demo `calculateMetadata` 随收窗和回稳参数自动更新帧数。

素材放入 `public/images/`；窗口内使用 `width/height:100%` 填充，并用 `objectPosition` 调整裁切焦点。其他画幅需同步调整卡片尺寸、窗口坐标与文字大小。组件使用一次衰减余弦近似参考回弹，真实缓动、裁切焦点和原片滤镜参数无法从单一录屏确定。预设见 `presets/media-window-card.json`，运行 `npm run render:window` 导出。

本次参考后段与已有 **07 · 色差故障切镜** 相同，不增加重复镜头。衔接预设 `presets/media-window-glitch.json` 直接用于 `ChromaticGlitchTransition`，不是新增 Composition：前景停留 2.6 秒、转场 0.65 秒、后景停留 1.3 秒，总计 4.55 秒。自行提供 `before`、`after`、`badge` JSX；若前景使用 `MediaWindowCard`，转场会在前景卡片停留期间开始，以中点切镜覆盖其后续退出。对运动媒体和音轨，应避免把有副作用或音频的内容克隆进色差层，参见 07 的说明。公开Demo为自绘通用桌面 SVG，不包含参考中的人物、商标或音轨。


## 09 · 折页相册揭物

`FoldPageAlbum` 固定左页，将右页沿书脊弯折收至侧面，依次揭出下一页，最后可展开一个透明物件。Demo `FoldPageAlbumDemo` 使用四个右页，连续三次折页，6.6 秒 / 198 帧，1920×1080 / 30fps。公开内容为自绘通用护理瓶、软管和花叶 SVG。

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {FoldPageAlbum, foldPageAlbumDurationSeconds} from './motions';
const options = {turnSeconds: 0.8, curlAngle: 20, popupDepth: 65};
const Photo = ({src}: {src: string}) => <CanvasImage
  src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>;
const rightPages = [<Photo src="images/page-1.png"/>, <div/>,
  <Photo src="images/page-3.png"/>, <Photo src="images/page-4.png"/>];
const Book = () => <FoldPageAlbum {...options}
  leftPage={<Photo src="images/left.png"/>} rightPages={rightPages}
  popup={<Photo src="images/cutout.png"/>}/>;
// 主 Composition 帧数 = Math.ceil(foldPageAlbumDurationSeconds(rightPages.length, options) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| leftPage / rightPages / popup | 必填 / 至少两页 / 可省略 | React 视觉内容；popup 使用透明素材 |
| centerX / centerY | 画布中心 | px，整个展开相册中心；Demo 为 960 / 625 |
| pageWidth / pageHeight | 550 / 640 | px，单页大小 |
| perspective / strips / curlAngle | 3200 / 12 / 20 | px / 段数 / 度，透视、分段弯折精度和曲率；strips 4—48，curlAngle 0—25 |
| paper | #fffdf8 | CSS 颜色，纸面底色 |
| enterSeconds / initialHoldSeconds | 0.4 / 0.8 | 秒，入场和首次翻页前停留 |
| turnSeconds / betweenHoldSeconds | 0.8 / 0.25 | 秒，单次折页及翻页之间的停留 |
| popupDelaySeconds / popupSeconds | 0.3 / 0.7 | 秒，最后一页出现后延迟和物件展开时长 |
| endHoldSeconds / exitSeconds | 1.1 / 0.4 | 秒，结束停留和退出 |
| popupWidth / popupHeight | 220 / 370 | px，物件尺寸 |
| popupX / popupY | 单页宽 × 0.42 / 高 × 0.52 | px，物件中心，相对右页左上角 |
| popupDepth | 65 | px，展开时向前突出的距离 |

总时长 = 入场 + 初始停留 + `(右页数 - 1) × 折页时长` + `(右页数 - 2) × 页间停留` + 物件延迟 + 物件展开 + 结束停留 + 退出。省略 popup 时仍保留其延迟与展开时间作为末页停留；所有秒数跟随 fps。Demo 用 calculateMetadata 自动更新帧数。位置与尺寸以 Composition 像素为基准，改变画幅需调整布局。

纸面用窄条 3D 平面近似弯曲，沿书脊收至约 90° 后揭出下一页；未模拟真实纸张翻至左侧的 180° 运动或手部操作。最后物件是透明平面向前展开，未重建原片瓶身的立体网格。右页内容会被克隆至各分段，请使用无音频、无副作用、无重复全局 DOM ID 的视觉 JSX，声音另行编排。

素材放入 `public/images/`，预设见 `presets/fold-page-album.json`；运行 `npm run render:book` 导出。参考视频及原始音轨仅用于本地分析，不包含在公开仓库中。


## 10 · 中心开屏快闪

`CenterApertureFlash` 在固定底图中心打开一条横缝，开口持续向上下扩展，缝内内容按固定间隔直接硬切，最后铺满相册框并停留。Demo 使用十二项通用 SVG，逻辑时长 3.59 秒，取整为 108 帧 / 3.6 秒，1920×1080 / 30fps。底图在 Demo 中设为灰度；组件本身保留自定义底图颜色。

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {CenterApertureFlash, centerApertureFlashDurationSeconds} from './motions';
const options = {shotSeconds: 0.12, frameWidth: 1200, frameHeight: 600};
const Photo = ({src}: {src: string}) => <CanvasImage src={staticFile(src)}
  style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 50%'}}/>;
const shots = ['images/one.jpg','images/two.jpg','images/three.jpg'].map(src => <Photo src={src}/>);
const Scene = () => <CenterApertureFlash {...options}
  base={<Photo src="images/base.jpg"/>} shots={shots}/>;
// 主 Composition 帧数 = Math.ceil(centerApertureFlashDurationSeconds(shots.length, options) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| base / shots | 必填 / 至少两项 | React 视觉内容，底图与快切序列 |
| centerX / centerY | 画布中心 | px，画框中心；Demo 为 960 / 650 |
| frameWidth / frameHeight | 1200 / 650 | px，画框内部尺寸；Demo 高 600，外围额外 18px 奶油白纸框 |
| enterSeconds / baseHoldSeconds | 0.35 / 0.3 | 秒，入场与开屏前底图停留 |
| shotSeconds | 0.12 | 秒，每项快切停留；开屏总时长为项目数 × 此值 |
| endHoldSeconds / exitSeconds | 1.1 / 0.4 | 秒，开屏结束后末项额外停留与退出 |
| initialOpening | 0 | 0—1，首次快切时开口占画框高度的比例 |
| openingEasing | [0,0,1,1] | 贝塞尔四控制值，默认线性开屏；横坐标需为 0—1，输出限制为 0—1 |

总时长 = 入场 + 底图停留 + `项目数 × 每项停留` + 末项额外停留 + 退出。遮罩开屏和快切同时发生，没有额外开屏段或转场重叠。最后一项在其快切时段内出现，随后继续停留；默认 0.12 秒在 30fps 下按帧落到约 3 / 4 帧边界，所有时长跟随 fps。Demo 的 calculateMetadata 会随快切间隔更新总帧数。

将素材放入 `public/images/`，视觉内容应填满画框。窗口通过 clip-path 裁切，而不是压缩图片高度；可用 objectPosition 调整裁切焦点。像素坐标以 Composition 为基准，改变画幅需重新设置位置和尺寸。快切视觉内容会按索引挂载，建议传入静态图片或无音频、无副作用的视觉 JSX；声音另行编排。

参考约 0.3—1.7 秒为开屏快闪；真实缓动和原媒体焦点无法从单一录屏精确确定，采用可调线性近似。后段博主信息及播放器暂停界面未纳入，也未复制参考素材和音轨。预设见 `presets/center-aperture-flash.json`，运行 `npm run render:aperture` 导出。


## 11 · 拼贴海报分层入场

`LayeredCollagePoster` 将独立剪贴层按延迟、位移、缩放与旋转组装成平面海报，保留前后遮挡；唱片可持续旋转，装饰可周期摆动。Demo 八层，组装完成 4.4 秒，停留 1.7 秒、退出 0.5 秒，共 6.6 秒 / 198 帧。通用图形见 `src/CollagePosterArt.tsx`，不包含参考人物、地景、品牌或配乐。

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {LayeredCollagePoster, layeredCollagePosterDurationSeconds} from './motions';
const Photo = ({src}: {src:string}) => <CanvasImage src={staticFile(src)}
  style={{width:'100%',height:'100%',objectFit:'contain'}}/>;
const layers = [
 {id:'disc',content:<Photo src="collage/disc.png"/>,x:290,y:75,width:610,height:610,
  delaySeconds:0.6,enterSeconds:1,fromY:300,fromScale:0.35,zIndex:1,spinDegreesPerSecond:8},
 {id:'cloud',content:<Photo src="collage/cloud.png"/>,x:0,y:330,width:1000,height:215,
  delaySeconds:0.35,fromX:-400,fromY:0,zIndex:3},
];
const options = {holdSeconds:1.7,exitSeconds:0.5};
const Poster = () => <LayeredCollagePoster {...options} layers={layers}/>;
// 主 Composition 帧数 = Math.ceil(layeredCollagePosterDurationSeconds(layers, options) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| layers / background | 必填 / 可省略 | 分层视觉 JSX / 背景 JSX；每层 id 唯一 |
| centerX / centerY | 画布中心 | px，海报整体中心；Demo 为 960 / 650 |
| posterWidth / posterHeight | 1200 / 650 | px，内部画框大小，外围额外 18px 奶油纸框 |
| holdSeconds / exitSeconds | 1.7 / 0.5 | 秒，最晚一层完成入场后的停留与整体退出 |
| paper | #fffdf8 | CSS 颜色，外纸框 |
| layer.x / y / width / height | 必填 | px，最终位置与尺寸，位置相对海报左上角 |
| layer.delaySeconds / enterSeconds | 0 / 0.8 | 秒，独立入场延迟与时长 |
| layer.fromX / fromY | 0 / 80 | px，相对最终位置的起始偏移 |
| layer.fromScale / fromRotation | 1 / 0 | 倍数 / 度，起始缩放与相对旋转偏移 |
| layer.rotation / spinDegreesPerSecond | 0 / 0 | 度 / 度每秒，最终基础角度与持续自转 |
| layer.swayDegrees / swayPeriodSeconds | 0 / 3 | 度 / 秒，入场后正弦摆动幅度与周期 |
| layer.zIndex | 数组索引 | 层级，数字越大越靠前 |

总时长 = `max(每层延迟 + 入场时长)` + 停留 + 退出，独立入场互相重叠，不把所有时长相加。旋转从该层开始入场时计时，并在停留期间继续；摆动在入场过程中渐渐显现。全部按帧计算，任意 seek 顺序可复现。

使用透明 PNG、SVG 或无音频、无副作用的视觉 JSX，可按图层更换照片与文字；素材放入 `public/collage/`。几何参数基于 Composition 像素，海报框会裁掉越界内容。换画幅需重设整体尺寸与层位置。预设 `presets/layered-collage-poster.json` 的 layerSettings 是可序列化布局，每项需按 id 接上实际 React content。

Demo 可调 `pace`（所有入场延迟和时长的倍数，需大于 0）、`spinSpeed`（中心标签角速度）；calculateMetadata 自动更新总帧数。运行 `npm run render:collage` 导出。线缆使用固定形状整体移入，不模拟参考线缆的曲线变形；图层及持续旋转是可调平面近似。

## 12 · 撕纸云朵擦镜

`TornPaperCloudWipe` 将两块宽大的不规则纸云汇合盖住前景，在遮挡中点换景，再将纸云横向移开。可选透明装饰随云朵浮入和离开。Demo 前景停留 1 秒、擦镜 1.8 秒、后景停留 1.4 秒，共 4.2 秒 / 126 帧。

```tsx
import {AbsoluteFill, CanvasImage, staticFile} from 'remotion';
import {TornPaperCloudWipe, tornPaperCloudWipeDurationSeconds} from './motions';
const options = {wipeSeconds:1.8,direction:'left' as const,roughness:28};
const Transition = () => <TornPaperCloudWipe {...options}
 before={<AbsoluteFill style={{background:'#ccded7'}}>前一幕</AbsoluteFill>}
 after={<AbsoluteFill style={{background:'#f9e2ec'}}>下一幕</AbsoluteFill>}
 accent={<CanvasImage src={staticFile('collage/balloon.png')}
  style={{width:'100%',height:'100%',objectFit:'contain'}}/>}/>;
// 主 Composition 帧数 = Math.ceil(tornPaperCloudWipeDurationSeconds(options) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| before / after / accent | 必填 / 必填 / 可省略 | 两幕视觉 JSX / 透明装饰 JSX |
| beforeHoldSeconds / wipeSeconds / afterHoldSeconds | 1 / 1.8 / 1.4 | 秒，前景停留、整个擦镜、后景停留 |
| paper | #fffdf8 | CSS 颜色，纸云 |
| roughness | 28 | 0—80，SVG 1000单位坐标中的细小撕纸幅度；大起伏保持固定 |
| direction | left | left / right，纸云和装饰移出方向 |
| accentSize | 220 | px，装饰正方形容器 |
| accentX / accentY | 画宽 × 0.54 / 画高 × 0.67 | px，装饰在覆盖阶段的中心，基于整个 Composition |

总时长 = 前景停留 + 擦镜 + 后景停留，无额外转场重叠。在擦镜 48% 时完成覆盖、50% 切换前后幕、55% 开始移出，两个轮廓在中点重叠，roughness 范围内保持覆盖。两幕占同一个满幅容器，在中点切换；需持续播放的媒体时间和音频应在外层独立编排，避免依赖切换挂载保持其状态。

纸云是确定性的波形边缘多边形，近似参考撕纸轮廓与云朵遮挡，没有复用原片材质。accent 使用透明 PNG、SVG 或 React 图形；公开 Demo 为自绘热气球。像素参数基于 Composition，其他画幅可调装饰尺寸和中心。预设见 `presets/torn-paper-cloud-wipe.json`，Demo 可调擦镜时长、粗糙度、方向并自动计算时长，运行 `npm run render:cloudwipe` 导出。


## 13 · 双面翻卡扫光

`FlipShineCard` 让一张正反双面的卡片围绕居中竖轴翻转 180°，在侧面处交接可见面；背面落稳停留后，一条宽而柔的斜向光带从左向右扫过。与多张叠卡轮流向前翻、沿书脊展开的折页不同，此镜头固定同一张卡片的位置和尺寸。公开 Demo 使用通用花园 SVG，4.6 秒 / 138 帧，1920×1080 / 30fps，包含入场和退出。

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {FlipShineCard, flipShineCardDurationSeconds} from './motions';
const options = {flipSeconds: .4, direction: 'left' as const, shineEnabled: true};
const Scene = () => <FlipShineCard {...options}
  front={<div style={{width:'100%',height:'100%',background:'#e9e0ef'}}>?</div>}
  back={<CanvasImage src={staticFile('images/photo.jpg')}
    style={{width:'100%',height:'100%',objectFit:'cover'}}/>}/>;
// 总帧数 = Math.ceil(flipShineCardDurationSeconds(options) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| front / back | 必填 | React 视觉内容，正面 / 背面；在卡片内裁切 |
| centerX / centerY | 画布中心 | px，卡片中心；Demo 为 1290 / 560 |
| cardWidth / cardHeight | 460 / 660 | px，卡片整体尺寸 |
| perspective / radius | 2000 / 24 | px，透视距离 / 圆角半径 |
| direction | left | left 为负 Y 轴旋转，right 为正 Y 轴旋转，均转 180° |
| enterSeconds / frontHoldSeconds | 0.35 / 0.85 | 秒，入场与翻转前停留；入场为 24px 浮入和淡入 |
| flipSeconds / flipEasing | 0.4 / [0.4,0,0.2,1] | 秒 / 贝塞尔控制值，横坐标为 0—1；角度输出限制为 0—180° |
| shineEnabled | true | 是否在背面扫光；false 同时去掉扫光延迟与扫光时段 |
| shineDelaySeconds / shineSeconds | 1.25 / 0.6 | 秒，翻转结束到扫光的停留 / 光带通过时长 |
| shineIntensity / shineWidth | 0.5 / 0.45 | 0—1 强度 / 卡宽倍数；宽度需大于 0 |
| shineAngle | -25 | 度，光带绕自身中心旋转；扫光路径固定从左到右 |
| endHoldSeconds / exitSeconds | 0.8 / 0.35 | 秒，扫光结束后停留 / 24px 下移淡出；关闭扫光时从翻转结束计停留 |

总时长 = 入场 + 正面停留 + 翻转 +（开启扫光时：扫光延迟 + 扫光）+ 末尾停留 + 退出，无重叠。关闭扫光后默认 2.75 秒，30fps 下取整为 83 帧。入场、退出及停留可以设为 0，翻转与扫光时长需大于 0。Demo 可调 flipSeconds、direction、shineEnabled、shineSeconds、shineIntensity，calculateMetadata 自动跟随总帧数；需要调布局或其他参数可在 Demo 中传给组件。所有运动按 frame / fps 求值，支持任意顺序 seek。

像素坐标基于 Composition；改变画幅需重设位置与尺寸。两面为独立 JSX，使用图片时填满容器并指定 objectFit / objectPosition；正文、标签和品牌均可自行替换。建议只放无音频、无副作用的视觉内容，声音另行编排。CSS backfaceVisibility 隐藏背向镜头的一面，背面先 rotateY(180deg)，翻转后文字保持正向。扫光裁切在背面内，采用透明渐变和按转角变化的柔和明暗，属于可调视觉近似，并非物理材质反射。

参考约 1.63—1.97 秒翻转、3.25—3.65 秒扫光；录屏前段播放按钮、鼠标点击和边角讲解头像没有入库。真实缓动、材质与灯光方向无法精确反推，保留中心旋转、面交接和延迟扫光结构，公开风格延续奶油、淡粉、薄荷与灰紫。预设见 `presets/flip-shine-card.json`，运行 `npm run render:flipshine` 导出。


## 14 · 游走聚光蒙版

`WanderingSpotlight` 将一个固定视觉内容放在画框里，蒙版外压暗、窗口内保留原亮度。窗口的中心、宽高和圆角由关键帧控制，矩形可以连续变为圆形或椭圆，并沿路径移动；虚线边框和可选文字跟随窗口，末段放大窗口即可揭示全图。公开示例使用通用 SVG，相册构图保持原位。逻辑时长 5.65 秒，30fps 取整为 170 帧 / 5.67 秒。

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {WanderingSpotlight, wanderingSpotlightDurationSeconds} from './motions';
const keyframes = [
  {timeSeconds:0, x:.5,y:.5,width:.25,height:.8,roundness:0,caption:'先看这里'},
  {timeSeconds:1, x:.3,y:.4,width:.3,height:.6,roundness:1,caption:'一个细节'},
  {timeSeconds:2, x:.5,y:.5,width:2,height:3,roundness:1,caption:''},
];
const Scene = () => <WanderingSpotlight keyframes={keyframes}
  content={<CanvasImage src={staticFile('images/photo.jpg')}
    style={{width:'100%',height:'100%',objectFit:'cover'}}/>}/>;
// 总帧数 = Math.ceil(wanderingSpotlightDurationSeconds(keyframes) * fps - 1e-8)
```

| 参数 | 默认值 | 单位与作用 |
|---|---|---|
| content / keyframes | 必填 / 至少两项 | 底图视觉 JSX / 蒙版的形状与路径 |
| centerX / centerY | 画布中心 | px，整个画框在 Composition 内的中心；Demo 为 960 / 630 |
| frameWidth / frameHeight | 1240 / 630 | px，底图及蒙版画框尺寸，外加 18px 奶油相册边框 |
| enterSeconds / endHoldSeconds / exitSeconds | 0.35 / 0.8 / 0.35 | 秒，浮入、末关键帧停留、下移淡出；可以为 0 |
| dimOpacity / dimColor | 0.8 / #40384b | 0—1 暗幕不透明度 / 暗幕颜色，不影响亮区内部 |
| feather | 0 | px，亮区软边的高斯标准差，0 为清晰边缘 |
| borderColor / borderWidth / borderDash | #fffdf8 / 5 / [14,12] | 边框颜色 / px 描边宽 / px 实线与间隙长度；宽度 0 隐藏边框 |
| captionColor / captionSize / captionGap | #fffdf8 / 48 / 20 | 文字颜色 / px 字号 / px 窗口边缘间距 |
| captionSide | bottom | top / bottom，全局文字侧；Demo 为 top，关键帧可覆盖 |
| motionEasing | [0.4,0,0.2,1] | 每段运动的贝塞尔控制值，横坐标为 0—1，输出限制为 0—1 |

每项 keyframe 包含 `timeSeconds`（秒，从入场完成开始）、`x / y`（中心的画框比例）、`width / height`（宽高的画框比例）和 `roundness`（0—1）。时间从 0 开始且严格递增，至少两项，宽高需大于 0；中心可越界，宽高可大于 1，用于移出或放大揭示。圆角比例 0 为矩形，1 为椭圆；只有 `width × frameWidth = height × frameHeight` 时是圆。默认 Demo 的 0.30 × 1240 与 0.59 × 630 相差不足 1px，近似圆形。

可选 `caption` 为文字，留空隐藏；按当前关键帧时间硬切文字，`captionAngle`（默认 0，度）随相邻关键帧插值；`captionSide` 覆盖全局文字侧。文字跟随中心及窗口边缘，靠近上下边界时限制在画框内部，保持单行，长文字应缩短或调小字号。参考的沿弧排字与四周汉字采用单行位置/角度跟随的近似，没有复用原字幕。

总时长 = 入场 + 末关键帧 timeSeconds + 最后停留 + 退出，没有阶段重叠。各段均由 frame / fps 驱动，支持任意顺序 seek。Demo 的 `pace`（默认 1，正数，所有关键帧时间的倍数）越大越慢，calculateMetadata 自动更新帧数；入场和末尾时段不受 pace 影响。Demo 还暴露 dimOpacity、feather、captionSide。完整关键帧见 `src/WanderingSpotlightDemo.tsx` 和 `presets/wandering-spotlight.json`。

content 仅挂载一次，没有随窗口缩放或重复挂载。图片、文字卡、无副作用的视觉内容均可替换；要配视频时自行在外层编排音频与时长，组件只负责视觉蒙版。像素坐标以 Composition 为基准，关键帧比例以此组件画框为基准；不同尺寸需调圆形宽高比例。SVG 蒙版 ID 按组件实例生成，多实例不会互相覆盖。

参考约 0.95—2.4 秒由矩形变圆形、2.7—5.1 秒沿路径游走、5.2—6.3 秒放大揭示。采用分段缓动近似原路径与真实缓动；前后章节封面、鼠标操作和参考人物音轨没有入库。运行 `npm run render:spotlight` 导出。
