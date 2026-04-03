import { useState, useEffect } from 'react';
import { Employee, UserRole, ModulePermissions } from '../types';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRoleLabel, getModuleLabel, getDefaultModulePermissions } from '../utils/permissions';

interface EmployeeFormProps {
  employee?: Employee;
  departments: string[];
  onSubmit: (employee: Employee) => void;
  onClose: () => void;
}

export default function EmployeeForm({ employee, departments, onSubmit, onClose }: EmployeeFormProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [formData, setFormData] = useState<Employee>({
    id: '',
    name: '',
    email: '',
    department: '',
    position: '',
    phone: '',
    hireDate: '',
    salary: 0,
    status: 'active',
    role: 'employee',
    canLogin: false,
    password: '',
    customPermissions: undefined
  });

  const [modulePermissions, setModulePermissions] = useState<ModulePermissions>(
    getDefaultModulePermissions('employee')
  );

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      if (employee.customPermissions) {
        setModulePermissions(employee.customPermissions);
      } else if (employee.role) {
        setModulePermissions(getDefaultModulePermissions(employee.role));
      }
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      id: formData.id || Date.now().toString(),
      customPermissions: formData.canLogin ? modulePermissions : undefined
    };
    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'salary' ? Number(value) : value
      }));
      
      // 当角色改变时，更新默认板块权限
      if (name === 'role') {
        setModulePermissions(getDefaultModulePermissions(value as UserRole));
      }
    }
  };

  const handleModulePermissionChange = (module: keyof ModulePermissions, checked: boolean) => {
    setModulePermissions(prev => ({
      ...prev,
      [module]: checked
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {employee ? '编辑员工' : '添加员工'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                部门 <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">选择部门</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                职位 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                入职日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                薪资 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态 <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">在职</option>
                <option value="inactive">离职</option>
              </select>
            </div>
          </div>

          {isAdmin && (
            <div className="pt-4 border-t space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">系统权限设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      系统角色
                    </label>
                    <select
                      name="role"
                      value={formData.role || 'employee'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="employee">{getRoleLabel('employee')}</option>
                      <option value="project_manager">{getRoleLabel('project_manager')}</option>
                      <option value="finance">{getRoleLabel('finance')}</option>
                      <option value="admin">{getRoleLabel('admin')}</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="canLogin"
                      name="canLogin"
                      checked={formData.canLogin || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="canLogin" className="ml-2 block text-sm text-gray-700">
                      允许登录系统
                    </label>
                  </div>

                  {formData.canLogin && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        登录密码 {!employee && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        required={formData.canLogin && !employee}
                        placeholder={employee ? '留空表示不修改密码' : '请设置登录密码'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {employee && (
                        <p className="text-xs text-gray-500 mt-1">留空表示不修改密码</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {formData.canLogin && formData.role !== 'admin' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">板块访问权限</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    管理员拥有所有权限，非管理员可以自定义板块访问权限
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {(Object.keys(modulePermissions) as Array<keyof ModulePermissions>).map((module) => (
                      <div key={module} className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={modulePermissions[module]}
                            onChange={(e) => handleModulePermissionChange(module, e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            {getModuleLabel(module)}
                          </span>
                        </label>
                        <span className={`text-xs px-2 py-1 rounded ${
                          modulePermissions[module] 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {modulePermissions[module] ? '已开启' : '已关闭'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium cyber-button-secondary rounded-md"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium cyber-button-primary rounded-md"
            >
              {employee ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}