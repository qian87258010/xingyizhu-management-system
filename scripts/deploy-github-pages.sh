#!/bin/bash

echo "🚀 开始部署到 GitHub Pages..."
echo ""

# 检查是否在 git 仓库中
if [ ! -d .git ]; then
    echo "❌ 错误：不是 git 仓库"
    echo "请先运行: git init"
    exit 1
fi

# 获取当前分支
current_branch=$(git symbolic-ref --short HEAD)
echo "📍 当前分支: $current_branch"
echo ""

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"
echo ""

# 进入构建目录
cd dist

# 初始化 git
echo "📦 准备部署文件..."
git init
git add -A
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# 获取远程仓库地址
cd ..
remote_url=$(git config --get remote.origin.url)

if [ -z "$remote_url" ]; then
    echo "❌ 错误：未找到远程仓库"
    echo "请先添加远程仓库: git remote add origin <URL>"
    exit 1
fi

echo "🌍 远程仓库: $remote_url"
echo ""

# 推送到 gh-pages 分支
echo "📤 推送到 gh-pages 分支..."
cd dist
git push -f "$remote_url" main:gh-pages

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════"
    echo "  ✅ 部署成功！"
    echo "════════════════════════════════════════"
    echo ""
    echo "📝 下一步："
    echo "   1. 访问 GitHub 仓库"
    echo "   2. 进入 Settings → Pages"
    echo "   3. Source 选择 'gh-pages' 分支"
    echo "   4. 点击 Save"
    echo ""
    echo "⏱️  等待 1-2 分钟后访问你的网站"
    echo ""
else
    echo ""
    echo "❌ 部署失败"
    exit 1
fi

# 返回项目根目录
cd ..
