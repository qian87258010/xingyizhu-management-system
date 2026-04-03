#!/bin/bash

echo "🚀 开始部署到 Vercel..."
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "⚠️  未找到 Vercel CLI"
    read -p "是否现在安装？(y/n): " install_choice
    
    if [ "$install_choice" = "y" ]; then
        echo "📦 安装 Vercel CLI..."
        npm install -g vercel
        
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

echo "🔑 登录 Vercel..."
vercel login

if [ $? -ne 0 ]; then
    echo "❌ 登录失败"
    exit 1
fi

echo ""
echo "📦 开始部署..."
echo ""

# 部署到生产环境
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════"
    echo "  ✅ 部署成功！"
    echo "════════════════════════════════════════"
    echo ""
    echo "🎉 你的网站已经上线了！"
    echo ""
    echo "💡 提示："
    echo "   - 访问 vercel.com/dashboard 查看详情"
    echo "   - 可以配置自定义域名"
    echo "   - 每次 git push 都会自动部署"
    echo ""
else
    echo ""
    echo "❌ 部署失败"
    exit 1
fi
