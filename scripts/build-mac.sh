#!/bin/bash

echo "🎯 开始打包 Mac 应用..."
echo ""

# 检查是否安装了依赖
if [ ! -d "node_modules/electron" ]; then
    echo "❌ 错误：未找到 Electron 依赖"
    echo "请先运行：npm install"
    exit 1
fi

# 清理之前的构建
echo "🧹 清理旧的构建文件..."
rm -rf dist
rm -rf release

# 构建应用
echo ""
echo "🔨 构建 React 应用..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 打包 Mac 应用
echo ""
echo "📦 打包 Mac 应用..."
npx electron-builder --mac

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 打包成功！"
    echo ""
    echo "📁 打包文件位置："
    echo "   $(pwd)/release/"
    echo ""
    echo "📋 生成的文件："
    ls -lh release/ | grep -E "\.(dmg|zip)$"
    echo ""
    echo "🎉 现在你可以安装和使用应用了！"
    echo "   双击 .dmg 文件安装到 Applications 文件夹"
else
    echo ""
    echo "❌ 打包失败"
    exit 1
fi
