export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive';
  role?: UserRole;
  canLogin?: boolean;
  password?: string;
  customPermissions?: ModulePermissions;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  client: string; // 现在表示"单位"
  clientContact: string;
  clientPhone: string;
  type: '室内设计' | '建筑设计' | '景观设计' | '三维动画' | '其他';
  status: '洽谈中' | '进行中' | '已完成' | '已取消';
  startDate: string;
  endDate?: string;
  totalAmount: number;
  paidAmount: number;
  description: string;
  assignedTo: string;
  modelProgress?: number;
  renderProgress?: number;
  postProductionProgress?: number;
  // 制作阶段日期
  modelStartDate?: string;
  modelEndDate?: string;
  renderStartDate?: string;
  renderEndDate?: string;
  postProductionStartDate?: string;
  postProductionEndDate?: string;
}

export interface Payment {
  id: string;
  projectId: string;
  projectName: string;
  client: string;
  amount: number;
  paymentDate: string;
  paymentMethod: '现金' | '银行转账' | '支票' | '支付宝' | '微信支付';
  note?: string;
  invoiceNumber?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  receivedAmount: number;
  pendingAmount: number;
  projectCount: number;
}

export type UserRole = 'admin' | 'finance' | 'project_manager' | 'department_manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface ModulePermissions {
  dashboard: boolean;
  employees: boolean;
  departments: boolean;
  projects: boolean;
  finance: boolean;
}

export interface Permission {
  canViewEmployees: boolean;
  canEditEmployees: boolean;
  canDeleteEmployees: boolean;
  canViewDepartments: boolean;
  canViewProjects: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canViewFinance: boolean;
  canEditFinance: boolean;
  canViewStats: boolean;
}