#!/bin/bash

clear
echo "╔═══════════════════════════════════════════════════╗"
echo "║        星奕筑管理系统 - 快速启动工具            ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    echo "请先安装 Node.js：https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"
echo ""

# 菜单选择
echo "请选择操作："
echo ""
echo "【本地开发】"
echo "  1) 🌐 本地运行（浏览器模式）"
echo "  2) 🔧 Electron 开发模式"
echo ""
echo "【网页部署】"
echo "  3) 🚀 部署到 Vercel（推荐，最简单）"
echo "  4) 🌟 部署到 Netlify"
echo "  5) 📄 部署到 GitHub Pages"
echo "  6) 🐳 Docker 容器运行"
echo ""
echo "【桌面应用】"
echo "  7) 💻 安装 Electron 依赖"
echo "  8) 📦 打包成 Mac 应用（DMG）"
echo ""
echo "【工具】"
echo "  9) 🧹 清理构建文件"
echo "  0) 退出"
echo ""
read -p "请输入选项 (0-9): " choice

case $choice in
    1)
        echo ""
        echo "🌐 启动本地开发服务器..."
        npm run dev
        ;;
    2)
        echo ""
        if [ ! -d "node_modules/electron" ]; then
            echo "⚠️  未找到 Electron 依赖"
            read -p "是否现在安装？(y/n): " install_choice
            if [ "$install_choice" = "y" ]; then
                npm install --save-dev electron electron-builder concurrently wait-on cross-env
            else
                echo "❌ 取消运行"
                exit 1
            fi
        fi
        
        echo "🔧 启动 Electron 开发模式..."
        echo "提示：窗口会自动打开，按 Ctrl+C 停止"
        npm run electron:dev
        ;;
    3)
        echo ""
        chmod +x scripts/deploy-vercel.sh
        ./scripts/deploy-vercel.sh
        ;;
    4)
        echo ""
        chmod +x scripts/deploy-netlify.sh
        ./scripts/deploy-netlify.sh
        ;;
    5)
        echo ""
        chmod +x scripts/deploy-github-pages.sh
        ./scripts/deploy-github-pages.sh
        ;;
    6)
        echo ""
        echo "🐳 使用 Docker 运行..."
        
        if ! command -v docker &> /dev/null; then
            echo "❌ 错误：未找到 Docker"
            echo "请先安装 Docker：https://www.docker.com/"
            exit 1
        fi
        
        echo "📦 构建 Docker 镜像..."
        docker-compose up --build -d
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Docker 容器已启动！"
            echo "📍 访问: http://localhost"
            echo ""
            echo "💡 管理命令："
            echo "   查看日志: docker-compose logs -f"
            echo "   停止容器: docker-compose down"
            echo ""
        else
            echo "❌ Docker 启动失败"
        fi
        ;;
    7)
        echo ""
        echo "💻 安装 Electron 依赖..."
        npm install --save-dev electron electron-builder concurrently wait-on cross-env
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Electron 依赖安装成功！"
            echo "现在可以运行 Electron 开发模式或打包应用了。"
        else
            echo "❌ 安装失败"
        fi
        ;;
    8)
        echo ""
        if [ ! -d "node_modules/electron" ]; then
            echo "⚠️  未找到 Electron 依赖"
            read -p "是否现在安装？(y/n): " install_choice
            if [ "$install_choice" = "y" ]; then
                npm install --save-dev electron electron-builder concurrently wait-on cross-env
            else
                echo "❌ 取消打包"
                exit 1
            fi
        fi
        
        echo "📦 开始打包 Mac 应用..."
        echo "这可能需要几分钟时间，请耐心等待..."
        echo ""
        
        # 清理
        rm -rf dist release
        
        # 构建
        echo "🔨 步骤 1/2: 构建 React 应用..."
        npm run build
        
        if [ $? -ne 0 ]; then
            echo "❌ 构建失败"
            exit 1
        fi
        
        # 打包
        echo ""
        echo "📦 步骤 2/2: 打包 Electron 应用..."
        npx electron-builder --mac
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "════════════════════════════════════════"
            echo "  ✅ 打包成功！"
            echo "════════════════════════════════════════"
            echo ""
            echo "📁 安装包位置："
            echo "   $(pwd)/release/"
            echo ""
            echo "📋 生成的文件："
            ls -lh release/*.dmg 2>/dev/null || echo "   (未找到 DMG 文件)"
            echo ""
            echo "🎉 安装方法："
            echo "   1. 双击 .dmg 文件"
            echo "   2. 将应用拖到 Applications 文件夹"
            echo "   3. 首次运行需要右键点击 → 打开"
            echo ""
        else
            echo ""
            echo "❌ 打包失败"
            exit 1
        fi
        ;;
    9)
        echo ""
        echo "🧹 清理构建文件..."
        rm -rf dist release node_modules/.vite
        echo "✅ 清理完成"
        ;;
    0)
        echo ""
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ 无效的选项"
        exit 1
        ;;
esac

echo ""
echo "按 Enter 键继续..."
read