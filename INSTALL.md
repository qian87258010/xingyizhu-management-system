# 星奕筑管理系统 - 安装和打包指南

## 📦 快速开始

### 方式一：本地运行（推荐用于开发）

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **在浏览器中打开**
- 打开显示的地址（通常是 http://localhost:5173）
- 使用测试账号登录：zhangsan@company.com / admin123

---

## 🖥️ 打包成 MacBook 应用

### 准备工作

1. **安装 Electron 相关依赖**
```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

2. **（可选）准备应用图标**
- 在 `build/` 文件夹中放置 1024x1024px 的 PNG 图标
- 命名为 `icon.png`
- 如果没有图标，会使用默认的 Electron 图标

### 开始打包

#### 方式1：快速打包（仅打包，不创建安装包）
```bash
npm run package:mac
```
这会在 `release/mac` 文件夹中生成 `.app` 文件，可以直接运行。

#### 方式2：完整打包（创建 DMG 安装包）⭐ 推荐
```bash
npm run dist:mac
```

这会创建：
- `.dmg` 文件：可分发的磁盘镜像（适合 Intel 和 Apple Silicon Mac）
- `.zip` 文件：压缩包版本

生成的文件位置：`release/` 文件夹

### 打包输出说明

打包完成后，你会在 `release/` 文件夹中看到：

```
release/
├── 星奕筑管理系统-0.0.1-arm64.dmg     # Apple Silicon (M1/M2/M3) Mac
├── 星奕筑管理系统-0.0.1-x64.dmg       # Intel Mac
├── 星奕筑管理系统-0.0.1-arm64-mac.zip # Apple Silicon 压缩包
└── 星奕筑管理系统-0.0.1-x64-mac.zip   # Intel 压缩包
```

---

## 📱 安装应用到 MacBook

### 从 DMG 安装（推荐）

1. **双击打开 DMG 文件**
   - 如果你的 Mac 是 Apple Silicon (M1/M2/M3)，使用 `arm64.dmg`
   - 如果你的 Mac 是 Intel 处理器，使用 `x64.dmg`

2. **拖动应用到 Applications 文件夹**
   - 会弹出一个窗口，将应用图标拖到 Applications 文件夹

3. **首次运行**
   - 打开"启动台"或"应用程序"文件夹
   - 找到"星奕筑管理系统"
   - 右键点击 → 选择"打开"（首次需要这样操作）
   - 在弹出的对话框中点击"打开"

### 从 ZIP 安装

1. **解压 ZIP 文件**
2. **将 `.app` 文件移动到 Applications 文件夹**
3. **按照上述"首次运行"步骤打开应用**

---

## 🔧 开发模式

如果想在 Electron 窗口中开发（实时预览）：

```bash
# 1. 安装开发依赖（如果还没安装）
npm install --save-dev electron electron-builder concurrently wait-on cross-env

# 2. 启动 Electron 开发模式
npm run electron:dev
```

这会同时启动：
- Vite 开发服务器
- Electron 窗口（自动加载开发服务器）

---

## 📋 系统要求

### 开发环境
- Node.js 18+
- npm 或 pnpm
- macOS（用于打包 Mac 应用）

### 运行应用
- macOS 10.13 或更高版本
- 至少 200MB 可用空间

---

## 🐛 常见问题

### 问题1：打包时提示缺少依赖
**解决方案：**
```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

### 问题2：首次打开应用提示"无法打开，因为来自身份不明的开发者"
**解决方案：**
1. 右键点击应用
2. 选择"打开"（不是双击）
3. 在对话框中点击"打开"

或者在终端中运行：
```bash
sudo xattr -r -d com.apple.quarantine /Applications/星奕筑管理系统.app
```

### 问题3：应用数据存储在哪里？
应用数据（LocalStorage）存储在：
```
~/Library/Application Support/星奕筑管理系统/
```

### 问题4：如何卸载应用？
1. 打开"应用程序"文件夹
2. 将"星奕筑管理系统"拖到废纸篓
3. 清空废纸篓

---

## 🚀 更新应用版本

修改 `package.json` 中的版本号：
```json
{
  "version": "0.0.2"
}
```

然后重新打包：
```bash
npm run dist:mac
```

---

## 📝 默认测试账号

应用内置以下测试账号：

| 角色 | 邮箱 | 密码 | 权限 |
|------|------|------|------|
| 管理员 | zhangsan@company.com | admin123 | 全部权限 + 用户审批 |
| 项目经理 | lisi@company.com | pm123 | 可查看财务 |
| 财务 | qianqi@company.com | fin123 | 可编辑财务 |
| 普通员工 | wangwu@company.com | emp123 | 不能查看财务 |

---

## 💡 提示

- 打包过程可能需要几分钟，请耐心等待
- 首次打包会下载 Electron 二进制文件（约 100MB）
- 建议使用 `npm run dist:mac` 创建正式的 DMG 安装包
- DMG 文件可以分享给其他 Mac 用户使用

---

## 📧 技术支持

如有问题，请检查：
1. Node.js 版本是否符合要求
2. 所有依赖是否正确安装
3. 是否有足够的磁盘空间

祝使用愉快！🎉
