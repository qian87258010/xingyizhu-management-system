import { Employee } from '../types';
import { Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  const { permissions } = useAuth();
  
  return (
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
                部门
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                职位
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                电话
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                入职日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                状态
              </th>
              {(permissions.canEditEmployees || permissions.canDeleteEmployees) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/5">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-cyan-500/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-100">{employee.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-200">{employee.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-200">{employee.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{employee.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{employee.hireDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      employee.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}
                  >
                    {employee.status === 'active' ? '在职' : '离职'}
                  </span>
                </td>
                {(permissions.canEditEmployees || permissions.canDeleteEmployees) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {permissions.canEditEmployees && (
                        <button
                          onClick={() => onEdit(employee)}
                          className="cyber-button-icon p-2 rounded text-cyan-400 hover:text-cyan-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {permissions.canDeleteEmployees && (
                        <button
                          onClick={() => onDelete(employee.id)}
                          className="cyber-button-danger p-2 rounded hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}