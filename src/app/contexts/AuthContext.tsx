import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, ModulePermissions } from '../types';
import { getPermissions, getModulePermissions } from '../utils/permissions';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  permissions: ReturnType<typeof getPermissions>;
  modulePermissions: ModulePermissions;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customPermissions, setCustomPermissions] = useState<ModulePermissions | undefined>(undefined);

  const login = (email: string, password: string): boolean => {
    // 首先从mockUsers查找
    let foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    // 如果mockUsers中没有找到，从localStorage的已批准用户中查找
    if (!foundUser) {
      const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
      const approvedUser = pendingUsers.find(
        (u: any) => u.email === email && u.password === password && u.approvalStatus === 'approved'
      );
      
      if (approvedUser) {
        foundUser = {
          id: approvedUser.id,
          name: approvedUser.name,
          email: approvedUser.email,
          password: approvedUser.password,
          role: 'employee', // 新注册用户默认为普通员工
          employeeId: approvedUser.id,
          approvalStatus: 'approved'
        };
      }
    }

    if (foundUser) {
      // 检查用户是否已通过审批
      if (foundUser.approvalStatus === 'pending') {
        return false; // 账号待审批
      }
      if (foundUser.approvalStatus === 'rejected') {
        return false; // 账号已被拒绝
      }
      
      const { password: _, customPermissions: userCustomPermissions, approvalStatus: __, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      setCustomPermissions(userCustomPermissions);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCustomPermissions(undefined);
  };

  const permissions = user ? getPermissions(user.role) : getPermissions('employee');
  const modulePermissions = user 
    ? getModulePermissions(user, customPermissions)
    : { dashboard: false, employees: false, departments: false, projects: false, finance: false };

  return (
    <AuthContext.Provider value={{ user, login, logout, permissions, modulePermissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}