import { useState, useMemo } from 'react';
import { Project } from '../types';
import { Edit2, Trash2, DollarSign, Calendar, User, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAddPayment: (project: Project) => void;
}

export default function ProjectList({ projects, onEdit, onDelete, onAddPayment }: ProjectListProps) {
  const { permissions } = useAuth();
  const currentYear = new Date().getFullYear();
  
  // 第一层：年度选择
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  
  // 第二层：月份选择
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  
  // 第三层：状态筛选
  const [selectedStatus, setSelectedStatus] = useState<'all' | '进行中' | '已完成' | '未结账'>('all');

  // 获取可选年份列表（从项目数据中提取）
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    projects.forEach(project => {
      const year = new Date(project.startDate).getFullYear();
      years.add(year);
    });
    // 添加当前年度
    years.add(currentYear);
    years.add(currentYear - 1);
    years.add(currentYear + 1);
    return Array.from(years).sort((a, b) => b - a);
  }, [projects, currentYear]);

  // 根据年份筛选项目
  const projectsByYear = useMemo(() => {
    return projects.filter(project => {
      const projectYear = new Date(project.startDate).getFullYear();
      return projectYear === selectedYear;
    });
  }, [projects, selectedYear]);

  // 计算年度统计
  const yearStats = useMemo(() => {
    const totalProjects = projectsByYear.length;
    const totalUnpaid = projectsByYear.reduce((sum, p) => 
      sum + (p.totalAmount - p.paidAmount), 0
    );
    return { totalProjects, totalUnpaid };
  }, [projectsByYear]);

  // 计算每月统计
  const monthlyStats = useMemo(() => {
    const stats: Record<number, { 
      count: number; 
      unpaid: number; 
      hasUnpaid: boolean;
      statusCounts: { ongoing: number; completed: number; unpaid: number };
    }> = {};
    
    for (let i = 1; i <= 12; i++) {
      stats[i] = { 
        count: 0, 
        unpaid: 0, 
        hasUnpaid: false,
        statusCounts: { ongoing: 0, completed: 0, unpaid: 0 }
      };
    }

    projectsByYear.forEach(project => {
      const month = new Date(project.startDate).getMonth() + 1;
      const unpaidAmount = project.totalAmount - project.paidAmount;
      
      stats[month].count++;
      stats[month].unpaid += unpaidAmount;
      
      if (unpaidAmount > 0) {
        stats[month].hasUnpaid = true;
        stats[month].statusCounts.unpaid++;
      }
      
      if (project.status === '进行中') {
        stats[month].statusCounts.ongoing++;
      } else if (project.status === '已完成') {
        stats[month].statusCounts.completed++;
      }
    });

    return stats;
  }, [projectsByYear]);

  // 根据月份和状态筛选项目
  const filteredProjects = useMemo(() => {
    let filtered = projectsByYear;

    // 月份筛选
    if (selectedMonth !== null) {
      filtered = filtered.filter(project => {
        const projectMonth = new Date(project.startDate).getMonth() + 1;
        return projectMonth === selectedMonth;
      });
    }

    // 状态筛选
    if (selectedStatus !== 'all') {
      if (selectedStatus === '未结账') {
        filtered = filtered.filter(project => 
          project.totalAmount - project.paidAmount > 0
        );
      } else {
        filtered = filtered.filter(project => 
          project.status === selectedStatus
        );
      }
    }

    return filtered;
  }, [projectsByYear, selectedMonth, selectedStatus]);

  // 计算状态统计
  const statusCounts = useMemo(() => {
    const filtered = selectedMonth !== null 
      ? projectsByYear.filter(p => new Date(p.startDate).getMonth() + 1 === selectedMonth)
      : projectsByYear;

    return {
      ongoing: filtered.filter(p => p.status === '进行中').length,
      completed: filtered.filter(p => p.status === '已完成').length,
      unpaid: filtered.filter(p => p.totalAmount - p.paidAmount > 0).length,
    };
  }, [projectsByYear, selectedMonth]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '洽谈中':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case '进行中':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case '已完成':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case '已取消':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPaymentProgress = (project: Project) => {
    return Math.round((project.paidAmount / project.totalAmount) * 100);
  };

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <div className="space-y-6">
      {/* 第一层：年度选择 */}
      <div className="cyber-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-cyan-300">年度选择</h2>
            <div className="flex gap-2">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedMonth(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                    selectedYear === year
                      ? 'bg-gradient-to-r from-cyan-600/40 to-purple-600/40 text-cyan-300 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                      : 'bg-transparent text-cyan-400/60 border-cyan-500/20 hover:border-cyan-400/40 hover:text-cyan-300'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          
          {/* 年度统计 */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-xs text-cyan-400/60">总项目数</p>
                <p className="text-lg font-bold text-cyan-300">{yearStats.totalProjects}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-xs text-cyan-400/60">应收未收</p>
                <p className="text-lg font-bold text-orange-300">¥{yearStats.totalUnpaid.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 第二层：月份热力图导航 */}
      <div className="cyber-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-cyan-300 mb-4">月份导航</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {monthNames.map((monthName, index) => {
            const monthNumber = index + 1;
            const stats = monthlyStats[monthNumber];
            const isSelected = selectedMonth === monthNumber;

            return (
              <button
                key={monthNumber}
                onClick={() => setSelectedMonth(isSelected ? null : monthNumber)}
                className={`relative p-4 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-600/30 to-purple-600/30 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                    : 'bg-[#0a0e27]/60 border-cyan-500/20 hover:border-cyan-400/40 hover:bg-cyan-500/10'
                }`}
              >
                {/* 未结账提示红点 */}
                {stats.hasUnpaid && (
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
                
                <div className="text-center">
                  <p className="text-sm font-medium text-cyan-300 mb-2">{monthName}</p>
                  
                  {stats.count > 0 ? (
                    <>
                      <p className="text-2xl font-bold text-cyan-400 mb-1">{stats.count}</p>
                      <p className="text-xs text-cyan-400/60">个项目</p>
                      {stats.unpaid > 0 && (
                        <p className="text-xs text-orange-300 mt-1">
                          待收 ¥{(stats.unpaid / 10000).toFixed(1)}万
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-cyan-400/40">无项目</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {selectedMonth && (
          <button
            onClick={() => setSelectedMonth(null)}
            className="mt-4 px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← 查看全年
          </button>
        )}
      </div>

      {/* 第三层：状态筛选 */}
      <div className="cyber-card rounded-xl p-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-cyan-400">状态筛选：</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedStatus === 'all'
                  ? 'bg-cyan-600/30 text-cyan-300 border-cyan-400/50'
                  : 'bg-transparent text-cyan-400/60 border-cyan-500/20 hover:border-cyan-400/40'
              }`}
            >
              全部 ({filteredProjects.length})
            </button>
            <button
              onClick={() => setSelectedStatus('进行中')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedStatus === '进行中'
                  ? 'bg-blue-600/30 text-blue-300 border-blue-400/50'
                  : 'bg-transparent text-blue-400/60 border-blue-500/20 hover:border-blue-400/40'
              }`}
            >
              进行中 ({statusCounts.ongoing})
            </button>
            <button
              onClick={() => setSelectedStatus('已完成')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedStatus === '已完成'
                  ? 'bg-green-600/30 text-green-300 border-green-400/50'
                  : 'bg-transparent text-green-400/60 border-green-500/20 hover:border-green-400/40'
              }`}
            >
              已完成 ({statusCounts.completed})
            </button>
            <button
              onClick={() => setSelectedStatus('未结账')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedStatus === '未结账'
                  ? 'bg-orange-600/30 text-orange-300 border-orange-400/50'
                  : 'bg-transparent text-orange-400/60 border-orange-500/20 hover:border-orange-400/40'
              }`}
            >
              未结账 ({statusCounts.unpaid})
            </button>
          </div>
        </div>
      </div>

      {/* 项目列表 */}
      {filteredProjects.length === 0 ? (
        <div className="cyber-card rounded-xl p-12 text-center">
          <AlertCircle className="w-16 h-16 text-cyan-400/40 mx-auto mb-4" />
          <p className="text-cyan-400/60">没有找到符合条件的项目</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const paymentProgress = getPaymentProgress(project);
            const remainingAmount = project.totalAmount - project.paidAmount;

            return (
              <div key={project.id} className="cyber-card rounded-xl overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-cyan-300 mb-2">{project.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-cyan-400/60">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {project.client}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.startDate}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyan-400/60">项目类型</span>
                        <span className="font-medium text-cyan-300">{project.type}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyan-400/60">负责人</span>
                        <span className="font-medium text-cyan-300">{project.assignedTo}</span>
                      </div>
                    </div>

                    {/* Production Schedule - 替换进度条为日期 */}
                    {(project.modelStartDate || project.renderStartDate || project.postProductionStartDate) && (
                      <div className="pt-2 border-t border-cyan-500/20">
                        <p className="text-sm font-medium text-cyan-300 mb-2">制作时间</p>
                        <div className="space-y-2">
                          {project.modelStartDate && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-cyan-400/60">模型</span>
                              <span className="text-cyan-300">
                                {project.modelStartDate}
                                {project.modelEndDate && ` ~ ${project.modelEndDate}`}
                              </span>
                            </div>
                          )}
                          {project.renderStartDate && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-cyan-400/60">渲染</span>
                              <span className="text-cyan-300">
                                {project.renderStartDate}
                                {project.renderEndDate && ` ~ ${project.renderEndDate}`}
                              </span>
                            </div>
                          )}
                          {project.postProductionStartDate && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-cyan-400/60">后期</span>
                              <span className="text-cyan-300">
                                {project.postProductionStartDate}
                                {project.postProductionEndDate && ` ~ ${project.postProductionEndDate}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyan-400/60">合同总额</span>
                        <span className="font-medium text-cyan-300">
                          ¥{project.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-cyan-400/60">收款进度</span>
                        <span className="font-medium text-cyan-300">
                          ¥{project.paidAmount.toLocaleString()} ({paymentProgress}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#0a0e27] rounded-full h-2 border border-cyan-500/20">
                        <div
                          className={`h-full rounded-full transition-all ${
                            paymentProgress === 100 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                              : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                          }`}
                          style={{ width: `${paymentProgress}%` }}
                        ></div>
                      </div>
                      {remainingAmount > 0 && (
                        <p className="text-xs text-orange-300 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          待收款：¥{remainingAmount.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-cyan-400/60">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-cyan-500/20">
                    {permissions.canEditFinance && (
                      <button
                        onClick={() => onAddPayment(project)}
                        className="cyber-button-icon flex items-center space-x-1 px-3 py-1.5 text-sm text-green-400 rounded transition-all"
                        title="添加收款"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>收款</span>
                      </button>
                    )}
                    {permissions.canEditProjects && (
                      <button
                        onClick={() => onEdit(project)}
                        className="cyber-button-icon flex items-center space-x-1 px-3 py-1.5 text-sm text-cyan-400 rounded transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>编辑</span>
                      </button>
                    )}
                    {permissions.canDeleteProjects && (
                      <button
                        onClick={() => onDelete(project.id)}
                        className="cyber-button-icon flex items-center space-x-1 px-3 py-1.5 text-sm text-red-400 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>删除</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}