import apiClient from './client';

export interface DashboardStats {
  total_users: number;
  total_news: number;
  total_innovations: number;
  total_grants: number;
  total_scholarships: number;
  total_competitions: number;
  total_internships: number;
  total_jobs: number;
  total_views: number;
  total_comments: number;
  pending_comments: number;
  user_growth: number;
  content_growth: number;
  views_growth: number;
}

export interface DailyVisitor {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
}

export interface PageAnalytics {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgDuration: string;
  bounceRate: number;
}

export interface TopContent {
  id: number;
  title: string;
  type: string;
  views: number;
  likes: number;
  comments: number;
  avgDuration: string;
}

export interface DeviceStats {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface UserActivityStats {
  date: string;
  registrations: number;
  activeUsers: number;
  comments: number;
  likes: number;
}

export interface AnalyticsParams {
  date_from?: string;
  date_to?: string;
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
}

export const analyticsAPI = {
  // Получить общую статистику для dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/admin/analytics/dashboard/');
    return response.data;
  },

  // Получить статистику посетителей
  getVisitorsStats: async (params?: AnalyticsParams): Promise<{
    daily: DailyVisitor[];
    total_visitors: number;
    unique_visitors: number;
    new_visitors: number;
    returning_visitors: number;
    avg_pages_per_visitor: number;
    avg_time_on_site: number;
    bounce_rate: number;
  }> => {
    const response = await apiClient.get('/admin/analytics/visitors/', { params });
    return response.data;
  },

  // Получить аналитику страниц
  getPageAnalytics: async (params?: AnalyticsParams): Promise<PageAnalytics[]> => {
    const response = await apiClient.get('/admin/analytics/pages/', { params });
    return response.data;
  },

  // Получить топ контента
  getTopContent: async (params?: AnalyticsParams & {
    content_type?: string;
    limit?: number;
  }): Promise<TopContent[]> => {
    const response = await apiClient.get('/admin/analytics/top-content/', { params });
    return response.data;
  },

  // Получить статистику по устройствам
  getDeviceStats: async (params?: AnalyticsParams): Promise<DeviceStats> => {
    const response = await apiClient.get('/admin/analytics/devices/', { params });
    return response.data;
  },

  // Получить источники трафика
  getTrafficSources: async (params?: AnalyticsParams): Promise<TrafficSource[]> => {
    const response = await apiClient.get('/admin/analytics/traffic-sources/', { params });
    return response.data;
  },

  // Получить активность пользователей
  getUserActivity: async (params?: AnalyticsParams): Promise<{
    daily: UserActivityStats[];
    dau: number;
    wau: number;
    mau: number;
    retention_rate: number;
    churn_rate: number;
  }> => {
    const response = await apiClient.get('/admin/analytics/user-activity/', { params });
    return response.data;
  },

  // Экспорт данных
  exportData: async (params: {
    type: 'csv' | 'excel' | 'pdf' | 'json';
    date_from?: string;
    date_to?: string;
    include?: string[];
  }): Promise<Blob> => {
    const response = await apiClient.get('/admin/analytics/export/', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default analyticsAPI;


