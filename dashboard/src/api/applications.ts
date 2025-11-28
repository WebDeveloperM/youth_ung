import { apiClient } from './client';

export interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  organization?: string;
  position?: string;
  experience?: string;
  motivation: string;
  cv_file?: string;
  portfolio_file?: string;
  content_type: number;
  content_type_name: string;
  content_title: string;
  object_id: number;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  admin_comment?: string;
  reviewed_by?: number;
  reviewed_by_info?: {
    id: number;
    username: string;
    full_name: string;
  };
  reviewed_at?: string;
  user?: number;
  user_info?: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const applicationsAPI = {
  async getAll(): Promise<Application[]> {
    const response = await apiClient.get('/admin/applications/');
    // API возвращает {count, results}, возвращаем только массив
    return response.data.results || response.data;
  },

  async getOne(id: number): Promise<Application> {
    const response = await apiClient.get(`/admin/applications/${id}/`);
    return response.data;
  },

  async update(id: number, data: Partial<Application>): Promise<Application> {
    const response = await apiClient.patch(`/admin/applications/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/admin/applications/${id}/`);
  },

  async getStats(): Promise<ApplicationStats> {
    const response = await apiClient.get('/admin/applications/stats/');
    return response.data;
  },

  async bulkUpdateStatus(ids: number[], status: string): Promise<{ updated: number; status: string }> {
    const response = await apiClient.post('/admin/applications/bulk_update_status/', {
      ids,
      status,
    });
    return response.data;
  },
};

