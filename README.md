# 星奕筑管理系统 🌟

一个功能完整的企业管理系统，采用赛博朋克风格设计，支持员工管理、部门管理、项目管理和财务应收功能。

![](https://img.shields.io/badge/React-18.3.1-blue)
![](https://img.shields.io/badge/TypeScript-5.x-blue)
![](https://img.shields.io/badge/Electron-Ready-green)
![](https://img.shields.io/badge/Platform-macOS-lightgrey)

## ✨ 主要功能

### 🎨 赛博朋克风格界面
- 多层渐变背景
- 动态双层网格系统
- CRT 扫描线特效
- 青紫浮动粒子效果
- 霓虹灯发光文字

### 👥 用户管理
- ✅ 用户注册系统
- ✅ 管理员审批新用户
- ✅ 多角色权限控制
- ✅ 登录状态管理

### 👔 员工管理
- 员工信息增删改查
- 部门分配
- 职位管理
- 薪资记录

### 🏢 部门管理
- 部门概览
- 人员统计
- 部门经理分配

### 📊 项目管理
- 项目状态追踪（洽谈中、进行中、已完成）
- 客户信息管理
- 项目类型：室内/建筑/景观设计/三维动画
- 三阶段制作进度（模型、渲染、后期）
- 收款进度追踪

### 💰 财务应收
- 财务概览统计
- 待收款项目列表
- 收款记录管理
- 自动更新项目收款进度

### 🔐 权限系统
- **管理员**：全部权限 + 用户审批
- **项目经理**：项目管理 + 财务查看
- **部门经理**：部门管理 + 财务查看
- **财务**：财务管理 + 查看权限
- **普通员工**：基础查看权限（不含财务）

## 🚀 快速开始

### 本地运行

```bash
# 1. 克隆或下载项目
cd 星奕筑管理系统

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器打开 http://localhost:5173
```

### 部署到网页（推荐）⭐

#### 最简单的方式：Vercel（3分钟完成）

```bash
# 1. 上传到 GitHub
git init
git add .
git commit -m "初始提交"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main

# 2. 访问 vercel.com 用 GitHub 登录
# 3. 点击 New Project → 选择仓库 → Deploy
# 4. 完成！得到网址，任何人都可以访问
```

#### 使用快捷工具
```bash
chmod +x quick-start.sh
./quick-start.sh
# 选择 "3) 部署到 Vercel"
```

**查看详细说明**：[网页部署-快速开始.md](./网页部署-快速开始.md)

### 打包成 Mac 应用

```bash
# 1. 安装 Electron 依赖
npm install --save-dev electron electron-builder concurrently wait-on cross-env

# 2. 打包应用
npm run dist:mac

# 3. 在 release/ 文件夹找到 .dmg 安装包
```

详细说明请查看 [INSTALL.md](./INSTALL.md)

## 🔑 测试账号

| 角色 | 邮箱 | 密码 | 权限说明 |
|------|------|------|----------|
| 管理员 | 1527982017@qq.com | 123456 | 全部权限 + 用户审批 |
| 管理员 | qianqian@company.com | 123456 | 全部权限 + 用户审批 |

新注册用户需要管理员审批后才能登录。

## 📦 技术栈

- **前端框架**: React 18.3.1
- **路由**: React Router 7
- **样式**: Tailwind CSS 4
- **图标**: Lucide React
- **表单**: React Hook Form
- **提示**: Sonner
- **动画**: Motion (Framer Motion)
- **图表**: Recharts
- **拖拽**: React DnD
- **桌面应用**: Electron

## 📁 项目结构

```
├── src/
│   ├── app/
│   │   ├── components/        # React 组件
│   │   ├── contexts/          # Context 提供者
│   │   ├── data/              # 模拟数据
│   │   ├── types/             # TypeScript 类型
│   │   ├── utils/             # 工具函数
│   │   └── App.tsx            # 主应用组件
│   ├── styles/
│   │   ├── cyberpunk.css      # 赛博朋克样式
│   │   ├── fonts.css          # 字体样式
│   │   └── theme.css          # 主题样式
│   └── index.tsx              # 入口文件
├── electron/                  # Electron 配置
├── build/                     # 打包资源
├── scripts/                   # 构建脚本
├── INSTALL.md                 # 安装指南
└── README.md                  # 项目说明
```

## 🎯 功能亮点

### 用户注册与审批流程
1. 新用户通过注册页面提交申请
2. 管理员在"员工管理 → 用户审批"中查看待审批用户
3. 管理员可以批准或拒绝申请
4. 批准后用户立即可以登录系统

### 权限细粒度控制
- 普通员工看不到"财务应收"选项卡
- 部门经理、项目经理可以查看财务数据
- 管理员可以自定义每个用户的模块访问权限

### 数据持久化
- 使用 LocalStorage 存储用户数据和注册申请
- 支持页面刷新后数据保留
- 可导出到真实数据库

## 🔧 开发

### 开发模式（带热重载）
```bash
npm run dev
```

### Electron 开发模式
```bash
npm run electron:dev
```

### 构建生产版本
```bash
npm run build
```

### 打包为 Mac 应用
```bash
npm run dist:mac
```

## 📝 注意事项

1. **首次打开应用**：macOS 可能提示"来自身份不明的开发者"，需要右键点击"打开"
2. **数据存储**：应用数据存储在 `~/Library/Application Support/星奕筑管理系统/`
3. **图标**：可以在 `build/icon.png` 放置自定义应用图标（1024x1024px）

## 📄 许可证

本项目仅供学习和内部使用。

## 🙏 致谢

感谢所有开源项目和工具的贡献者！

---

**Made with ❤️ for 星奕筑**