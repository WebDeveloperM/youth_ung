import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Appeal {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  user_phone?: string;
  language: string;
  language_display: string;
  subject: string;
  message: string;
  is_anonymous: boolean;
  status: 'new' | 'in_progress' | 'resolved' | 'rejected';
  status_display: string;
  admin_response?: string;
  resolved_by?: number;
  resolved_by_name?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AppealStatistics {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Получить список всех обращений
 */
export const getAppeals = async (params?: {
  status?: string;
  is_anonymous?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}): Promise<{ results: Appeal[]; count: number }> => {
  const response = await axios.get(`${API_URL}/api/v1/appeals/`, {
    headers: getAuthHeaders(),
    params
  });
  return response.data;
};

/**
 * Получить детальную информацию об обращении
 */
export const getAppealById = async (id: number): Promise<Appeal> => {
  const response = await axios.get(`${API_URL}/api/v1/appeals/${id}/`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Изменить статус обращения
 */
export const updateAppealStatus = async (
  id: number,
  status: string,
  admin_response?: string
): Promise<Appeal> => {
  const response = await axios.post(
    `${API_URL}/api/v1/appeals/${id}/change_status/`,
    { status, admin_response },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Получить статистику по обращениям
 */
export const getAppealStatistics = async (): Promise<AppealStatistics> => {
  const response = await axios.get(`${API_URL}/api/v1/appeals/statistics/`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

