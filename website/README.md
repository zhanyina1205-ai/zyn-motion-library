# ZYN 镜头库公开展示页

线上地址：https://zhanyina1205-ai.github.io/zyn-motion-library/

静态 HTML、CSS、JavaScript 和两段通用示例视频。支持播放、重播、进度拖动、速度选择和参数复制。展示页公开，源码在 GitHub 中同步维护。

本地预览：在此目录运行 `python3 -m http.server 3013`。

发布配置位于 `.github/workflows/pages.yml`；推送 `website/` 到 `main` 即可自动更新 GitHub Pages。

新增第三个镜头：立体相册轮转（PerspectiveCarouselDemo），assets/perspective-carousel.mp4 与 .jpg 为通用素材预览。播放控制沿用 app.js 的 .shot 初始化与互斥播放。

新增第四、第五个镜头：弧面叠卡快翻、剪贴物快切；各有独立 MP4 与 JPG，控制结构沿用 .shot，所有地址适配项目子路径。

- 缩略条展开卡片：四个缩略图错落出现，横条展开为双列信息卡。
- 色差故障切镜：叠色错位、水平切片与可替换图标组成一次切镜。

- 画面收窗信息卡：完整画面收成横窗，下移回弹，揭示标题和说明。参考后半段复用色差故障切镜，未新增重复条目。
