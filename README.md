# ZYN 镜头库 · ZYN Motion Library

七个可复用的 Remotion 镜头动效：**整体上滑**、**拍立得错落浮起**、**立体相册轮转**、**弧面叠卡快翻**、**剪贴物快切**、**缩略条展开卡片**与**色差故障切镜**。

采用奶油白、淡粉、薄荷绿和柔和灰紫的默认示例风格。照片、标题、卡片内容与动画参数可以替换；示例素材为仓库内的通用 SVG，不包含个人照片。

## 启动

```bash
npm ci
npm run dev
```

在 Remotion Studio 中打开 `WholePageSlideDemo`、`FloatingPolaroidsDemo`、`PerspectiveCarouselDemo`、`FlipCardStackDemo` 、`StickerSwapDemo`、`ThumbnailPanelDemo` 或 `ChromaticGlitchDemo`。示例均为 1920 × 1080 / 30fps。

```bash
npm run check
npm run render:slide
npm run render:float
npm run render:carousel
npm run render:stack
npm run render:stickers
npm run render:panel
npm run render:glitch
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
