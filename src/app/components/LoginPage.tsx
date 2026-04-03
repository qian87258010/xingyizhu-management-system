import { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RegisterPage from './RegisterPage';
import logoImage from 'figma:asset/d2ecfad67a5fed4141bffbac989f681e5bac3fb7.png';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <RegisterPage 
        onBackToLogin={() => setShowRegister(false)}
        onRegisterSuccess={() => setShowRegister(false)}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(email, password);

    if (!success) {
      setError('登录失败：邮箱或密码不正确，或账号未通过审批');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Cyberpunk Background */}
      <div className="cyber-bg">
        <div className="cyber-particles">
          <div className="particle" style={{ left: '15%', top: '25%' }}></div>
          <div className="particle" style={{ left: '35%', top: '65%' }}></div>
          <div className="particle" style={{ left: '55%', top: '45%' }}></div>
          <div className="particle" style={{ left: '75%', top: '75%' }}></div>
          <div className="particle" style={{ left: '85%', top: '35%' }}></div>
          <div className="particle" style={{ left: '25%', top: '85%' }}></div>
        </div>
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="cyber-card rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            {/* Logo Container */}
            <div className="relative inline-block mb-6">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 animate-pulse">
                <div className="w-24 h-16 mx-auto rounded-lg bg-gradient-to-br from-orange-400/30 to-orange-500/30 blur-xl"></div>
              </div>
              
              {/* Logo Image */}
              <div className="relative">
                <img 
                  src={logoImage} 
                  alt="星奕筑" 
                  className="w-32 h-auto mx-auto relative z-10"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 165, 0, 0.4))'
                  }}
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold neon-text text-cyan-400 mb-2">管理系统</h1>
            <p className="text-cyan-300/70">登录以继续</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                required
                className="w-full px-4 py-3 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                className="w-full px-4 py-3 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>

            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="w-full bg-transparent border border-cyan-500/30 text-cyan-300 py-3 rounded-lg font-medium hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              没有账号？立即注册
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}