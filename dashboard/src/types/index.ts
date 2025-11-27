export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Foydalanuvchi' | 'Moderator';
  createdAt: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
}

export interface Research {
  id: string;
  title: string;
  author: string;
  category: string;
  createdAt: string;
}

export interface DailyVisitor {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface PageAnalytics {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgDuration: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalResearch: number;
  todayVisitors: number;
  userGrowth: number;
  projectGrowth: number;
  researchGrowth: number;
  visitorGrowth: number;
}

