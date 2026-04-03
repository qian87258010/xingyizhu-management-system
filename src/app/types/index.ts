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
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  description: string;
}
