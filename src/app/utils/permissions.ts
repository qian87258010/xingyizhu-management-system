import { UserRole, Permission, ModulePermissions, User } from '../types';

export function getDefaultModulePermissions(role: UserRole): ModulePermissions {
  switch (role) {
    case 'admin':
      return {
        dashboard: true,
        employees: true,
        departments: true,
        projects: true,
        finance: true
      };
    case 'finance':
      return {
        dashboard: true,
        employees: true,
        departments: true,
        projects: true,
        finance: true
      };
    case 'project_manager':
      return {
        dashboard: true,
        employees: true,
        departments: true,
        projects: true,
        finance: true
      };
    case 'department_manager':
      return {
        dashboard: true,
        employees: true,
        departments: true,
        projects: true,
        finance: true
      };
    case 'employee':
      return {
        dashboard: true,
        employees: true,
        departments: true,
        projects: true,
        finance: false
      };
    default:
      return {
        dashboard: false,
        employees: false,
        departments: false,
        projects: false,
        finance: false
      };
  }
}

export function getModulePermissions(user: User, customPermissions?: ModulePermissions): ModulePermissions {
  // 管理员始终有所有权限
  if (user.role === 'admin') {
    return {
      dashboard: true,
      employees: true,
      departments: true,
      projects: true,
      finance: true
    };
  }
  
  // 如果有自定义权限，使用自定义权限
  if (customPermissions) {
    return customPermissions;
  }
  
  // 否则使用默认角色权限
  return getDefaultModulePermissions(user.role);
}

export function getPermissions(role: UserRole): Permission {
  switch (role) {
    case 'admin':
      return {
        canViewEmployees: true,
        canEditEmployees: true,
        canDeleteEmployees: true,
        canViewDepartments: true,
        canViewProjects: true,
        canEditProjects: true,
        canDeleteProjects: true,
        canViewFinance: true,
        canEditFinance: true,
        canViewStats: true
      };
    case 'finance':
      return {
        canViewEmployees: true,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewDepartments: true,
        canViewProjects: true,
        canEditProjects: false,
        canDeleteProjects: false,
        canViewFinance: true,
        canEditFinance: true,
        canViewStats: true
      };
    case 'project_manager':
      return {
        canViewEmployees: true,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewDepartments: true,
        canViewProjects: true,
        canEditProjects: true,
        canDeleteProjects: true,
        canViewFinance: true,
        canEditFinance: false,
        canViewStats: true
      };
    case 'department_manager':
      return {
        canViewEmployees: true,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewDepartments: true,
        canViewProjects: true,
        canEditProjects: true,
        canDeleteProjects: true,
        canViewFinance: true,
        canEditFinance: false,
        canViewStats: true
      };
    case 'employee':
      return {
        canViewEmployees: true,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewDepartments: true,
        canViewProjects: true,
        canEditProjects: false,
        canDeleteProjects: false,
        canViewFinance: false,
        canEditFinance: false,
        canViewStats: false
      };
    default:
      return {
        canViewEmployees: false,
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewDepartments: false,
        canViewProjects: false,
        canEditProjects: false,
        canDeleteProjects: false,
        canViewFinance: false,
        canEditFinance: false,
        canViewStats: false
      };
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '管理员';
    case 'finance':
      return '财务';
    case 'project_manager':
      return '项目经理';
    case 'department_manager':
      return '部门经理';
    case 'employee':
      return '员工';
    default:
      return '未知';
  }
}

export function getModuleLabel(module: keyof ModulePermissions): string {
  switch (module) {
    case 'dashboard':
      return '数据概览';
    case 'employees':
      return '员工管理';
    case 'departments':
      return '部门管理';
    case 'projects':
      return '项目管理';
    case 'finance':
      return '财务应收';
    default:
      return '';
  }
}