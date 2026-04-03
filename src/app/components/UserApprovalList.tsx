import { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  password: string;
  confirmPassword?: string;
  approvalStatus: string;
  createdAt: string;
}

export default function UserApprovalList() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    setIsLoading(true);
    const users = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    setPendingUsers(users.filter((u: PendingUser) => u.approvalStatus === 'pending'));
    setIsLoading(false);
  };

  const handleApprove = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const userIndex = users.findIndex((u: PendingUser) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].approvalStatus = 'approved';
      localStorage.setItem('pendingUsers', JSON.stringify(users));
      
      toast.success(`已批准 ${users[userIndex].name} 的注册申请！该用户现在可以登录系统。`);
      loadPendingUsers();
    }
  };

  const handleReject = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const userIndex = users.findIndex((u: PendingUser) => u.id === userId);
    
    if (userIndex !== -1) {
      const userName = users[userIndex].name;
      users[userIndex].approvalStatus = 'rejected';
      localStorage.setItem('pendingUsers', JSON.stringify(users));
      
      toast.error(`已拒绝 ${userName} 的注册申请。`);
      loadPendingUsers();
    }
  };

  if (isLoading) {
    return (
      <div className="cyber-card rounded-lg p-8 text-center">
        <RefreshCw className="w-12 h-12 text-cyan-400/50 mx-auto mb-4 animate-spin" />
        <p className="text-cyan-300/70">加载中...</p>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div className="cyber-card rounded-lg p-8 text-center">
        <Clock className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
        <p className="text-cyan-300/70 text-lg mb-2">暂无待审批的用户</p>
        <p className="text-cyan-500/50 text-sm">当有新用户注册时，将在这里显示</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cyan-300">
          待审批用户 ({pendingUsers.length})
        </h3>
        <button
          onClick={loadPendingUsers}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>刷新</span>
        </button>
      </div>

      <div className="cyber-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-cyan-500/10">
            <thead className="bg-gradient-to-r from-slate-800/50 to-purple-900/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  姓名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  邮箱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  电话
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  部门
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  职位
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  申请时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/5">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-cyan-100">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-cyan-300/70">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-cyan-300/70">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-cyan-300/70">{user.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-cyan-300/70">{user.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-cyan-300/70">
                      {new Date(user.createdAt).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-green-500/30 rounded-md text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:border-green-400/50 transition-all shadow-sm hover:shadow-green-500/20"
                        title="批准"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        批准
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-500/30 rounded-md text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400/50 transition-all shadow-sm hover:shadow-red-500/20"
                        title="拒绝"
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        拒绝
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}