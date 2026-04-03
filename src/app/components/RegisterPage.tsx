import { useState } from 'react';
import { UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import logoImage from 'figma:asset/d2ecfad67a5fed4141bffbac989f681e5bac3fb7.png';

interface RegisterPageProps {
  onBackToLogin: () => void;
  onRegisterSuccess: () => void;
}

export default function RegisterPage({ onBackToLogin, onRegisterSuccess }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    position: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setIsLoading(true);

    // 模拟注册延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 在实际应用中，这里应该调用后端API
    // 模拟保存注册信息到localStorage
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const newUser = {
      ...formData,
      id: Date.now().toString(),
      approvalStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    pendingUsers.push(newUser);
    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));

    setIsLoading(false);
    toast.success('注册申请已提交！请等待管理员审批。');
    onRegisterSuccess();
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
          {/* Back Button */}
          <button
            onClick={onBackToLogin}
            className="mb-6 flex items-center space-x-2 text-cyan-300 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回登录</span>
          </button>

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

            <h1 className="text-3xl font-bold neon-text text-cyan-400 mb-2">用户注册</h1>
            <p className="text-cyan-300/70">填写信息，等待审批</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-cyan-300 mb-2">
                姓名 *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入姓名"
                required
                className="w-full px-4 py-2 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">
                邮箱 *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入邮箱"
                required
                className="w-full px-4 py-2 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-2">
                密码 *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="至少6位密码"
                required
                className="w-full px-4 py-2 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-cyan-300 mb-2">
                确认密码 *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="再次输入密码"
                required
                className="w-full px-4 py-2 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-cyan-300 mb-2">
                电话 *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="请输入电话"
                required
                className="w-full px-4 py-2 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-cyan-300 mb-2">
                部门 *
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                placeholder="请输入所属部门"
                required
                className="w-full px-4 py-2 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-cyan-300 mb-2">
                职位 *
              </label>
              <input
                id="position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                placeholder="请输入职位"
                required
                className="w-full px-4 py-2 bg-transparent border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-cyan-100 placeholder-cyan-600/40 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? '提交中...' : '提交注册申请'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}