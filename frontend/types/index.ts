export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
  dueDate: string;
  estimatedTime?: number;
  tags: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AnalyticsSummary {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  upcoming: Task[];
}

export interface ChartData {
  weeklyCompleted: { day: string; completed: number }[];
  subjectDistribution: { subject: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  priorityDistribution: { priority: string; count: number }[];
  streak: number;
  dailyActivity: { date: string; count: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  estimatedTime?: number;
  tags?: string[];
}
