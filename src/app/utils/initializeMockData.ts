// 初始化一些模拟的待审批用户数据，用于测试
export function initializeMockPendingUsers() {
  const existingUsers = localStorage.getItem('pendingUsers');
  
  // 如果已经有数据，不要覆盖
  if (existingUsers) {
    return;
  }

  const mockPendingUsers = [
    {
      id: 'pending-001',
      name: '测试用户1',
      email: 'test1@example.com',
      phone: '138-1234-5678',
      department: '技术部',
      position: '初级工程师',
      password: 'test123',
      approvalStatus: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2天前
    },
    {
      id: 'pending-002',
      name: '测试用户2',
      email: 'test2@example.com',
      phone: '138-2345-6789',
      department: '市场部',
      position: '市场专员',
      password: 'test123',
      approvalStatus: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1天前
    },
    {
      id: 'pending-003',
      name: '测试用户3',
      email: 'test3@example.com',
      phone: '138-3456-7890',
      department: '设计部',
      position: '设计师',
      password: 'test123',
      approvalStatus: 'pending',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3小时前
    }
  ];

  localStorage.setItem('pendingUsers', JSON.stringify(mockPendingUsers));
}
