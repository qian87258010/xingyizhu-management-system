import { useState } from 'react';
import { Users, Building2, UserPlus, BarChart3, FolderKanban, Wallet, LogOut, Shield } from 'lucide-react';
import { Employee, Project, Payment } from './types';
import { mockEmployees, mockDepartments, mockProjects, mockPayments } from './data/mockData';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import EmployeeList from './components/EmployeeList';
import DepartmentCard from './components/DepartmentCard';
import EmployeeForm from './components/EmployeeForm';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import FinancialOverview from './components/FinancialOverview';
import PaymentForm from './components/PaymentForm';
import PermissionsPanel from './components/PermissionsPanel';
import UserApprovalList from './components/UserApprovalList';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { getRoleLabel } from './utils/permissions';
import { initializeMockPendingUsers } from './utils/initializeMockData';
import logoImage from '../../assets/d2ecfad67a5fed4141bffbac989f681e5bac3fb7.png';

// 初始化模拟数据
initializeMockPendingUsers();

type TabType = 'employees' | 'departments' | 'stats' | 'projects' | 'finance' | 'permissions';

function MainApp() {
  const { user, logout, permissions, modulePermissions } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [employeeSubTab, setEmployeeSubTab] = useState<'list' | 'approval'>('list');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments] = useState(mockDepartments);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  const [searchTerm, setSearchTerm] = useState('');

  // Employee handlers
  const handleAddEmployee = (employee: Employee) => {
    if (!permissions.canEditEmployees) {
      toast.error('您没有权限编辑员工信息');
      return;
    }

    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === employee.id ? employee : emp))
      );
      toast.success('员工信息已更新');
    } else {
      setEmployees((prev) => [...prev, employee]);
      toast.success('员工添加成功');
    }
    setShowEmployeeForm(false);
    setEditingEmployee(undefined);
  };

  const handleEditEmployee = (employee: Employee) => {
    if (!permissions.canEditEmployees) {
      toast.error('您没有权限编辑员工信息');
      return;
    }
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (!permissions.canDeleteEmployees) {
      toast.error('您没有权限删除员工');
      return;
    }
    if (confirm('确定要删除这个员工吗？')) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      toast.success('员工已删除');
    }
  };

  const handleCloseEmployeeForm = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(undefined);
  };

  // Project handlers
  const handleAddProject = (project: Project) => {
    if (!permissions.canEditProjects) {
      toast.error('您没有权限编辑项目');
      return;
    }

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p))
      );
      toast.success('项目已更新');
    } else {
      setProjects((prev) => [...prev, project]);
      toast.success('项目创建成功');
    }
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const handleEditProject = (project: Project) => {
    if (!permissions.canEditProjects) {
      toast.error('您没有权限编辑项目');
      return;
    }
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (id: string) => {
    if (!permissions.canDeleteProjects) {
      toast.error('您没有权限删除项目');
      return;
    }
    if (confirm('确定要删除这个项目吗？相关的收款记录也会被删除。')) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setPayments((prev) => prev.filter((payment) => payment.projectId !== id));
      toast.success('项目已删除');
    }
  };

  const handleCloseProjectForm = () => {
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const handleAddPaymentToProject = (project: Project) => {
    if (!permissions.canEditFinance) {
      toast.error('您没有权限添加收款记录');
      return;
    }
    setSelectedProject(project);
    setShowPaymentForm(true);
  };

  // Payment handlers
  const handleAddPayment = (payment: Payment) => {
    if (!permissions.canEditFinance) {
      toast.error('您没有权限添加收款记录');
      return;
    }

    setPayments((prev) => [...prev, payment]);

    setProjects((prev) =>
      prev.map((p) =>
        p.id === payment.projectId
          ? { ...p, paidAmount: p.paidAmount + payment.amount }
          : p
      )
    );

    toast.success('收款记录已添加');
    setShowPaymentForm(false);
    setSelectedProject(undefined);
  };

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedProject(undefined);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    totalDepartments: departments.length,
    avgSalary: Math.round(
      employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
    )
  };

  return (
    <div className="min-h-screen relative">
      {/* Cyberpunk Background */}
      <div className="cyber-bg">
        <div className="cyber-particles">
          <div className="particle" style={{ left: '10%', top: '20%' }}></div>
          <div className="particle" style={{ left: '30%', top: '60%' }}></div>
          <div className="particle" style={{ left: '50%', top: '40%' }}></div>
          <div className="particle" style={{ left: '70%', top: '70%' }}></div>
          <div className="particle" style={{ left: '90%', top: '30%' }}></div>
          <div className="particle" style={{ left: '20%', top: '80%' }}></div>
          <div className="particle" style={{ left: '60%', top: '15%' }}></div>
          <div className="particle" style={{ left: '80%', top: '85%' }}></div>
        </div>
      </div>
      
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="cyber-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 animate-pulse">
                  <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-orange-400/20 to-orange-500/20 blur-lg"></div>
                </div>
                <img 
                  src={logoImage} 
                  alt="星奕筑" 
                  className="w-24 h-auto relative z-10"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.3))'
                  }}
                />
              </div>
              
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold neon-text">管理系统</h1>
                <p className="text-sm text-cyan-300/50 mt-1">项目管理 · 财务管理 · 人员管理</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-cyan-300">{user.name}</p>
                  <p className="text-xs text-gray-400">{getRoleLabel(user.role)}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-cyan-400 cyber-button rounded-lg transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>退出</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="cyber-nav rounded-lg">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {permissions.canViewProjects && modulePermissions.projects && (
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === 'projects'
                    ? 'border-cyan-400 text-cyan-300 cyber-button-active'
                    : 'border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FolderKanban className="w-5 h-5" />
                  <span>项目管理</span>
                </div>
              </button>
            )}
            {permissions.canViewFinance && modulePermissions.finance && (
              <button
                onClick={() => setActiveTab('finance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === 'finance'
                    ? 'border-cyan-400 text-cyan-300 cyber-button-active'
                    : 'border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>财务应收</span>
                </div>
              </button>
            )}
            {permissions.canViewEmployees && modulePermissions.employees && (
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === 'employees'
                    ? 'border-cyan-400 text-cyan-300 cyber-button-active'
                    : 'border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>员工管理</span>
                </div>
              </button>
            )}
            {permissions.canViewDepartments && modulePermissions.departments && (
              <button
                onClick={() => setActiveTab('departments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === 'departments'
                    ? 'border-cyan-400 text-cyan-300 cyber-button-active'
                    : 'border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>部门管理</span>
                </div>
              </button>
            )}
            {permissions.canViewStats && modulePermissions.dashboard && (
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === 'stats'
                    ? 'border-cyan-400 text-cyan-300 cyber-button-active'
                    : 'border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>统计概览</span>
                </div>
              </button>
            )}
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                activeTab === 'permissions'
                  ? 'border-cyan-400 text-cyan-300 cyber-button-active'
                  : 'border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>我的权限</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && permissions.canViewProjects && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-lg">
                <input
                  type="text"
                  placeholder="搜索项目名称、客户或类型..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-cyan-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-gray-100 placeholder-gray-500"
                />
              </div>
              {permissions.canEditProjects && (
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 cyber-button-primary rounded-lg transition-all"
                >
                  <FolderKanban className="w-5 h-5" />
                  <span>新建项目</span>
                </button>
              )}
            </div>
            <ProjectList
              projects={filteredProjects}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onAddPayment={handleAddPaymentToProject}
            />
          </div>
        )}

        {activeTab === 'finance' && permissions.canViewFinance && (
          <FinancialOverview projects={projects} payments={payments} />
        )}

        {activeTab === 'employees' && permissions.canViewEmployees && (
          <div className="space-y-6">
            {user?.role === 'admin' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setEmployeeSubTab('list')}
                  className={`py-2 px-4 rounded-lg transition-all ${
                    employeeSubTab === 'list'
                      ? 'cyber-button-primary'
                      : 'cyber-button text-cyan-300'
                  }`}
                >
                  员工列表
                </button>
                <button
                  onClick={() => setEmployeeSubTab('approval')}
                  className={`py-2 px-4 rounded-lg transition-all ${
                    employeeSubTab === 'approval'
                      ? 'cyber-button-primary'
                      : 'cyber-button text-cyan-300'
                  }`}
                >
                  用户审批
                </button>
              </div>
            )}
            {employeeSubTab === 'list' && (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex-1 max-w-lg">
                    <input
                      type="text"
                      placeholder="搜索员工姓名、邮箱或部门..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 bg-transparent border border-cyan-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-gray-100 placeholder-gray-500"
                    />
                  </div>
                  {permissions.canEditEmployees && (
                    <button
                      onClick={() => setShowEmployeeForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 cyber-button-primary rounded-lg transition-all"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>添加员工</span>
                    </button>
                  )}
                </div>
                <EmployeeList
                  employees={filteredEmployees}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              </>
            )}
            {employeeSubTab === 'approval' && user?.role === 'admin' && (
              <UserApprovalList />
            )}
          </div>
        )}

        {activeTab === 'departments' && permissions.canViewDepartments && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-6">部门概览</h2>
              <DepartmentCard departments={departments} />
            </div>
          </div>
        )}

        {activeTab === 'stats' && permissions.canViewStats && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-6">统计概览</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="cyber-card rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">总员工数</p>
                    <p className="text-3xl font-bold text-cyan-300 mt-2">
                      {stats.totalEmployees}
                    </p>
                  </div>
                  <div className="bg-cyan-500/20 rounded-full p-3 border border-cyan-500/40">
                    <Users className="w-6 h-6 text-cyan-300" />
                  </div>
                </div>
              </div>

              <div className="cyber-card rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">在职员工</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">
                      {stats.activeEmployees}
                    </p>
                  </div>
                  <div className="bg-green-500/20 rounded-full p-3 border border-green-500/30">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="cyber-card rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">部门数量</p>
                    <p className="text-3xl font-bold text-cyan-300 mt-2">
                      {stats.totalDepartments}
                    </p>
                  </div>
                  <div className="bg-purple-500/20 rounded-full p-3 border border-purple-500/40">
                    <Building2 className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
              </div>

              <div className="cyber-card rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">平均薪资</p>
                    <p className="text-3xl font-bold text-cyan-300 mt-2">
                      ¥{stats.avgSalary.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-cyan-500/20 rounded-full p-3 border border-cyan-500/40">
                    <BarChart3 className="w-6 h-6 text-cyan-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Department Statistics */}
            <div className="cyber-card rounded-lg p-6">
              <h3 className="text-lg font-semibold text-cyan-300 mb-4">各部门人员分布</h3>
              <div className="space-y-4">
                {departments.map((dept) => {
                  const deptEmployees = employees.filter(
                    (emp) => emp.department === dept.name
                  );
                  const percentage = Math.round((deptEmployees.length / employees.length) * 100);

                  return (
                    <div key={dept.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-200">{dept.name}</span>
                        <span className="text-gray-400">
                          {deptEmployees.length} 人 ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-800/50 rounded-full h-2 border border-cyan-500/20">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all shadow-[0_0_10px_rgba(0,255,255,0.6)]"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <PermissionsPanel />
        )}
      </main>

      {/* Forms */}
      {showEmployeeForm && permissions.canEditEmployees && (
        <EmployeeForm
          employee={editingEmployee}
          departments={departments.map((d) => d.name)}
          onSubmit={handleAddEmployee}
          onClose={handleCloseEmployeeForm}
        />
      )}

      {showProjectForm && permissions.canEditProjects && (
        <ProjectForm
          project={editingProject}
          employees={employees.filter((e) => e.status === 'active').map((e) => e.name)}
          onSubmit={handleAddProject}
          onClose={handleCloseProjectForm}
        />
      )}

      {showPaymentForm && permissions.canEditFinance && (
        <PaymentForm
          project={selectedProject}
          onSubmit={handleAddPayment}
          onClose={handleClosePaymentForm}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return <MainApp />;
}