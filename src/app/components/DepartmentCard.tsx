import { Department } from '../types';
import { Users } from 'lucide-react';

interface DepartmentCardProps {
  departments: Department[];
}

export default function DepartmentCard({ departments }: DepartmentCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {departments.map((dept) => (
        <div
          key={dept.id}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
            <div className="bg-indigo-100 rounded-full p-2">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">部门经理：</span>
              <span className="text-sm font-medium text-gray-900 ml-1">{dept.manager}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">员工数量：</span>
              <span className="text-sm font-medium text-gray-900 ml-1">
                {dept.employeeCount} 人
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-3">{dept.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
