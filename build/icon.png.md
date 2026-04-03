# 应用图标说明

请将您的应用图标放在这个目录中：

- **icon.png** - 1024x1024 像素的 PNG 图片（推荐）
- **icon.icns** - macOS 图标文件（可选，打包时会自动生成）

如果您没有图标，打包工具会使用默认的 Electron 图标。

## 推荐的图标尺寸：
- PNG: 1024x1024px
- 背景透明
- 简洁醒目的设计

打包时，electron-builder 会自动将 PNG 转换为 macOS 需要的 .icns 格式。
