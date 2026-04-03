#!/bin/bash

echo "🚀 开始安装 Electron 打包依赖..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js"
    echo "访问：https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"
echo ""

# 安装依赖
echo "📦 安装 Electron 相关依赖..."
npm install --save-dev electron electron-builder concurrently wait-on cross-env

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 依赖安装成功！"
    echo ""
    echo "📝 接下来你可以："
    echo "   1. 运行开发服务器：npm run dev"
    echo "   2. 运行 Electron 开发模式：npm run electron:dev"
    echo "   3. 打包 Mac 应用：npm run dist:mac"
    echo ""
else
    echo ""
    echo "❌ 安装失败，请检查网络连接或权限"
    exit 1
fi
