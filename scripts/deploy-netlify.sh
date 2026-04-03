#!/bin/bash

echo "🚀 开始部署到 Netlify..."
echo ""

# 检查是否安装了 Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "⚠️  未找到 Netlify CLI"
    read -p "是否现在安装？(y/n): " install_choice
    
    if [ "$install_choice" = "y" ]; then
        echo "📦 安装 Netlify CLI..."
        npm install -g netlify-cli
        
        if [ $? -ne 0 ]; then
            echo "❌ 安装失败"
            exit 1
        fi
        echo "✅ 安装成功"
    else
        echo "❌ 取消部署"
        exit 1
    fi
fi

echo "🔑 登录 Netlify..."
netlify login

if [ $? -ne 0 ]; then
    echo "❌ 登录失败"
    exit 1
fi

echo ""
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"
echo ""

echo "📦 开始部署..."
netlify deploy --prod --dir=dist

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════"
    echo "  ✅ 部署成功！"
    echo "════════════════════════════════════════"
    echo ""
    echo "🎉 你的网站已经上线了！"
    echo ""
    echo "💡 提示："
    echo "   - 访问 app.netlify.com 查看详情"
    echo "   - 可以配置自定义域名"
    echo "   - 连接 Git 仓库可以自动部署"
    echo ""
else
    echo ""
    echo "❌ 部署失败"
    exit 1
fi
