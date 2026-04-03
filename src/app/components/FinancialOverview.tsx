import { Payment, Project } from '../types';
import { DollarSign, Calendar, CreditCard, AlertCircle, TrendingUp, Clock } from 'lucide-react';

interface FinancialOverviewProps {
  projects: Project[];
  payments: Payment[];
}

export default function FinancialOverview({ projects, payments }: FinancialOverviewProps) {
  const totalRevenue = projects.reduce((sum, p) => sum + p.totalAmount, 0);
  const receivedAmount = projects.reduce((sum, p) => sum + p.paidAmount, 0);
  const pendingAmount = totalRevenue - receivedAmount;

  const receivedPercentage = totalRevenue > 0 ? Math.round((receivedAmount / totalRevenue) * 100) : 0;

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 10);

  const projectsWithPending = projects
    .filter(p => p.paidAmount < p.totalAmount && p.status !== '已取消')
    .sort((a, b) => (b.totalAmount - b.paidAmount) - (a.totalAmount - a.paidAmount));

  // 计算本月应收款和未收款
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // 本月的收款记录
  const currentMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.paymentDate);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  });
  const currentMonthReceived = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);

  // 本月应收款估算：进行中项目的待收款 * (本月天数 / 项目天数)
  // 这里简化处理：进行中项目按平均进度应该收的款
  const ongoingProjects = projects.filter(p => p.status === '进行中');
  const currentMonthExpected = ongoingProjects.reduce((sum, p) => {
    const pending = p.totalAmount - p.paidAmount;
    // 假设按照项目平均进度，本月应该收取部分款项
    const avgProgress = (p.modelProgress + p.renderProgress + p.postProductionProgress) / 3;
    const expectedTotal = (p.totalAmount * avgProgress) / 100;
    const shouldReceive = expectedTotal - p.paidAmount;
    return sum + (shouldReceive > 0 ? shouldReceive / 3 : 0); // 假设分3个月收
  }, 0);

  const currentMonthPending = currentMonthExpected - currentMonthReceived;

  // 年度未结账项目
  const yearProjects = projects.filter(p => {
    if (p.status === '已完成' || p.status === '已取消') return false;
    const startDate = new Date(p.startDate);
    return startDate.getFullYear() === currentYear;
  });
  const yearUnsettledAmount = yearProjects.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);

  return (
    <div className="space-y-6">
      {/* 财务提醒卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 本月应收款 */}
        <div className="cyber-card rounded-lg p-5 border border-cyan-500/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-medium text-cyan-300">本月应收款</h3>
              </div>
              <p className="text-2xl font-bold text-cyan-100 mb-1">
                ¥{Math.round(currentMonthExpected).toLocaleString()}
              </p>
              <p className="text-xs text-cyan-400/70">
                已收 ¥{currentMonthReceived.toLocaleString()}
              </p>
            </div>
            <div className="bg-cyan-500/10 rounded-full p-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* 本月未收款 */}
        <div className={`cyber-card rounded-lg p-5 border ${
          currentMonthPending > 0 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-green-500/30 bg-green-500/5'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-medium text-yellow-300">本月未收款</h3>
              </div>
              <p className={`text-2xl font-bold mb-1 ${
                currentMonthPending > 0 ? 'text-yellow-100' : 'text-green-100'
              }`}>
                ¥{Math.round(Math.max(0, currentMonthPending)).toLocaleString()}
              </p>
              <p className="text-xs text-yellow-400/70">
                {currentMonthPending > 0 ? '需要跟进催收' : '已完成目标'}
              </p>
            </div>
            <div className={`rounded-full p-2 ${
              currentMonthPending > 0 ? 'bg-yellow-500/10' : 'bg-green-500/10'
            }`}>
              <AlertCircle className={`w-5 h-5 ${
                currentMonthPending > 0 ? 'text-yellow-400' : 'text-green-400'
              }`} />
            </div>
          </div>
        </div>

        {/* 年度未结账 */}
        <div className="cyber-card rounded-lg p-5 border border-purple-500/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-medium text-purple-300">{currentYear}年度未结账</h3>
              </div>
              <p className="text-2xl font-bold text-purple-100 mb-1">
                ¥{yearUnsettledAmount.toLocaleString()}
              </p>
              <p className="text-xs text-purple-400/70">
                {yearProjects.length} 个项目待完成
              </p>
            </div>
            <div className="bg-purple-500/10 rounded-full p-2">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 年度未结账项目列表 */}
      {yearProjects.length > 0 && (
        <div className="cyber-card rounded-lg border border-purple-500/30">
          <div className="p-6 border-b border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-300 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{currentYear}年度未结账项目</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {yearProjects.map((project) => {
                const pending = project.totalAmount - project.paidAmount;
                const progress = Math.round((project.paidAmount / project.totalAmount) * 100);
                const avgProgress = Math.round((project.modelProgress + project.renderProgress + project.postProductionProgress) / 3);

                return (
                  <div key={project.id} className="border-b border-purple-500/10 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-cyan-100">{project.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            project.status === '进行中' 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm text-cyan-300/70 mt-1">{project.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-400">
                          待收 ¥{pending.toLocaleString()}
                        </p>
                        <p className="text-xs text-cyan-400/70 mt-1">
                          总额 ¥{project.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-cyan-300/70">收款进度</span>
                          <span className="text-xs text-cyan-400">{progress}%</span>
                        </div>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-cyan-300/70">制作进度</span>
                          <span className="text-xs text-cyan-400">{avgProgress}%</span>
                        </div>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${avgProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">合同总额</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ¥{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已收款</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ¥{receivedAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">收款率 {receivedPercentage}%</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待收款</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ¥{pendingAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {projectsWithPending.length} 个项目
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects with Pending Payment */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">待收款项目</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {projectsWithPending.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">暂无待收款项目</p>
              ) : (
                projectsWithPending.map((project) => {
                  const pending = project.totalAmount - project.paidAmount;
                  const progress = Math.round((project.paidAmount / project.totalAmount) * 100);

                  return (
                    <div key={project.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-500">{project.client}</p>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          ¥{pending.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{progress}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">最近收款记录</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentPayments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">暂无收款记录</p>
              ) : (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-start space-x-4 border-b pb-4 last:border-b-0">
                    <div className="bg-green-100 rounded-full p-2 mt-1">
                      <CreditCard className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {payment.projectName}
                          </h4>
                          <p className="text-sm text-gray-500">{payment.client}</p>
                        </div>
                        <span className="text-sm font-semibold text-green-600 ml-2">
                          +¥{payment.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {payment.paymentDate}
                        </span>
                        <span>{payment.paymentMethod}</span>
                        {payment.invoiceNumber && (
                          <span className="text-gray-400">{payment.invoiceNumber}</span>
                        )}
                      </div>
                      {payment.note && (
                        <p className="text-xs text-gray-500 mt-1">{payment.note}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">收款方式统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['银行转账', '现金', '支票', '支付宝', '微信支付'].map((method) => {
            const methodPayments = payments.filter((p) => p.paymentMethod === method);
            const total = methodPayments.reduce((sum, p) => sum + p.amount, 0);
            const percentage = receivedAmount > 0 ? Math.round((total / receivedAmount) * 100) : 0;

            return (
              <div key={method} className="text-center">
                <p className="text-sm text-gray-600 mb-1">{method}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {methodPayments.length}笔
                </p>
                <p className="text-xs text-gray-500">
                  ¥{total.toLocaleString()} ({percentage}%)
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}