import { useAuth } from '../contexts/AuthContext';
import { Shield, Check, X } from 'lucide-react';
import { getRoleLabel, getModuleLabel } from '../utils/permissions';
import { ModulePermissions } from '../types';

export default function PermissionsPanel() {
  const { user, permissions, modulePermissions } = useAuth();

  if (!user) return null;

  const rolePermissions = [
    { key: 'canViewEmployees', label: '查看员工信息', value: permissions.canViewEmployees },
    { key: 'canEditEmployees', label: '编辑员工信息', value: permissions.canEditEmployees },
    { key: 'canDeleteEmployees', label: '删除员工', value: permissions.canDeleteEmployees },
    { key: 'canViewDepartments', label: '查看部门信息', value: permissions.canViewDepartments },
    { key: 'canViewProjects', label: '查看项目', value: permissions.canViewProjects },
    { key: 'canEditProjects', label: '编辑项目', value: permissions.canEditProjects },
    { key: 'canDeleteProjects', label: '删除项目', value: permissions.canDeleteProjects },
    { key: 'canViewFinance', label: '查看财务', value: permissions.canViewFinance },
    { key: 'canEditFinance', label: '编辑财务', value: permissions.canEditFinance },
    { key: 'canViewStats', label: '查看统计', value: permissions.canViewStats },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">我的权限</h2>
        <p className="text-gray-600">查看您在系统中的角色和权限设置</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-indigo-100 rounded-full p-3">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className="inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-700">
              {getRoleLabel(user.role)}
            </span>
          </div>
        </div>
      </div>

      {/* Module Access Permissions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">板块访问权限</h3>
          <p className="text-sm text-gray-600 mt-1">您可以访问以下系统板块</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(modulePermissions) as Array<keyof ModulePermissions>).map((module) => (
              <div
                key={module}
                className={`border rounded-lg p-4 flex items-center justify-between ${
                  modulePermissions[module]
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">
                  {getModuleLabel(module)}
                </span>
                {modulePermissions[module] ? (
                  <div className="bg-green-100 rounded-full p-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-full p-1">
                    <X className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operation Permissions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">操作权限</h3>
          <p className="text-sm text-gray-600 mt-1">您在系统中可以执行的操作</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rolePermissions.map((perm) => (
              <div
                key={perm.key}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <span className="text-sm text-gray-700">{perm.label}</span>
                {perm.value ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">允许</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <X className="w-4 h-4" />
                    <span className="text-xs font-medium">禁止</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {user.role !== 'admin' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">权限说明</p>
              <p className="text-sm text-blue-700 mt-1">
                如果您需要更多权限，请联系系统管理员进行申请。管理员可以为您分配更高的角色或自定义板块访问权限。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}