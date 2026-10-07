# ZYN 镜头库 · ZYN Motion Library

两个可复用的 Remotion 镜头动效：**整体上滑**与**拍立得错落浮起**。

采用奶油白、淡粉、薄荷绿和柔和灰紫的默认示例风格。照片、标题、卡片内容与动画参数可以替换；示例素材为仓库内的通用 SVG，不包含个人照片。

## 启动

```bash
npm ci
npm run dev
```

在 Remotion Studio 中打开 `WholePageSlideDemo` 或 `FloatingPolaroidsDemo`。示例均为 1920 × 1080 / 30fps。

```bash
npm run check
npm run render:slide
npm run render:float
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
