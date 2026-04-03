import { useState, useEffect } from 'react';
import { Payment, Project } from '../types';
import { X } from 'lucide-react';

interface PaymentFormProps {
  project?: Project;
  payment?: Payment;
  onSubmit: (payment: Payment) => void;
  onClose: () => void;
}

export default function PaymentForm({ project, payment, onSubmit, onClose }: PaymentFormProps) {
  const [formData, setFormData] = useState<Payment>({
    id: '',
    projectId: '',
    projectName: '',
    client: '',
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '银行转账',
    note: '',
    invoiceNumber: ''
  });

  useEffect(() => {
    if (payment) {
      setFormData(payment);
    } else if (project) {
      setFormData((prev) => ({
        ...prev,
        projectId: project.id,
        projectName: project.name,
        client: project.client,
        amount: project.totalAmount - project.paidAmount
      }));
    }
  }, [payment, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      id: formData.id || Date.now().toString()
    };
    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const remainingAmount = project ? project.totalAmount - project.paidAmount : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {payment ? '编辑收款记录' : '添加收款记录'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {project && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">项目名称：</span>
                  <span className="font-medium text-gray-900">{project.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">客户名称：</span>
                  <span className="font-medium text-gray-900">{project.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">合同总额：</span>
                  <span className="font-medium text-gray-900">
                    ¥{project.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">已收款：</span>
                  <span className="font-medium text-green-600">
                    ¥{project.paidAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">待收款：</span>
                  <span className="font-semibold text-red-600">
                    ¥{remainingAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收款金额（元） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                max={remainingAmount > 0 ? remainingAmount : undefined}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {remainingAmount > 0 && formData.amount > remainingAmount && (
                <p className="text-xs text-red-500 mt-1">
                  收款金额不能超过待收款金额
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收款日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收款方式 <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="银行转账">银行转账</option>
                <option value="现金">现金</option>
                <option value="支票">支票</option>
                <option value="支付宝">支付宝</option>
                <option value="微信支付">微信支付</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                发票编号
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="INV-2026-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                备注说明
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                placeholder="如：首付款、第二期款项、尾款等"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              {payment ? '更新' : '确认收款'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
