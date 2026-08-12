# Yunzhi Site Studio

This folder contains a local-only content editor for the Jekyll site.

## Start

Double-click `start-admin.cmd` at the repository root, or run:

```powershell
node admin/server.js
```

The editor opens at `http://127.0.0.1:4173`. It only listens on localhost and is excluded from the deployed Jekyll site.

## What it manages

- Profile, avatar, About text, personal bests, and running summary in `_data/site_content.json`
- Blog Markdown files under `_posts/` and images under `images/blog/`
- Running entries in `_data/running_entries.json` and images under `images/races/`
- Memory Map content in `_data/memory_map.json` and uploaded images under `images/memories/`
- An exact list of uploaded assets in `_data/editor_assets.json`
- Avatar frames, content-box shapes, borders, shadows, buttons, and divider lines in `_data/component_design.json`
- Git commit and push of editor-managed paths to `origin/main`

The publish action intentionally stages only editor-managed paths. Unrelated working-tree changes are left untouched.

## Memory Map / 回忆地图

Open **回忆地图** in the Studio to:

- Add or remove any number of dates and change each date at any time
- Reorder stops with the up/down controls
- Add a title, location, summary, full story, tags, and up to 12 images per stop
- Choose among 12 structurally different layouts
- Customize the map accent and background colors
- See every change in the live preview before saving

在 Studio 中打开“回忆地图”，即可自由增减和修改日期、调整节点顺序、上传多图、编写完整故事，并实时预览 12 种不同的整体布局。保存只写入本地文件，确认后再使用“发布网站”推送到 `main`。

## Component Lab / 外观与组件

Open **外观与组件** to personalize the visual language without editing CSS:

- Choose circle, rounded square, arch, square, diamond, or organic avatar frames
- Adjust avatar border style, width, and color
- Choose sharp, subtle, rounded, capsule, or cut-corner content boxes
- Adjust card border style, width, color, and five shadow treatments
- Choose square, rounded, or pill buttons
- Adjust divider style, width, and color
- See every choice immediately in the live Component Lab preview

Select **保存组件外观到本地** to write the settings to `_data/component_design.json`. They are then applied to the real Jekyll site after publishing, rather than existing only inside the editor preview.

在 Studio 中打开“外观与组件”，无需编写 CSS 即可选择头像框轮廓、边框线型与颜色、文本框形状、卡片阴影、按钮形状以及分隔线样式。所有调整都会立即显示在右侧实时预览中。点击“保存组件外观到本地”后，配置会写入 `_data/component_design.json`，发布后同样应用到真正的网站，而不是只保留在编辑器中。
