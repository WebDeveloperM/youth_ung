import { apiClient } from './client';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  avatar_url?: string;
  organization?: {
    id: number;
    name: string;
  };
  organization_name?: string;
  position?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  gender?: string | null;
  avatar?: string | null;
  // Образование
  education_level?: string | null;
  is_foreign_graduate?: boolean;
  is_top300_graduate?: boolean;
  is_top500_graduate?: boolean;
  // Тип сотрудника
  staff_type?: string | null;
  is_promoted?: boolean;
  // Языковые сертификаты
  has_ielts?: boolean;
  has_cefr?: boolean;
  has_topik?: boolean;
  // Научные степени
  scientific_degree?: string | null;
  // Лидерские позиции
  leadership_position?: string | null;
  // Государственные награды
  state_award_type?: string | null;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  position?: string;
  date_of_birth?: string;
  address?: string;
  gender?: string;
  avatar?: File | null;
  // Образование
  education_level?: string;
  is_foreign_graduate?: boolean;
  is_top300_graduate?: boolean;
  is_top500_graduate?: boolean;
  // Тип сотрудника
  staff_type?: string;
  is_promoted?: boolean;
  // Языковые сертификаты
  has_ielts?: boolean;
  has_cefr?: boolean;
  has_topik?: boolean;
  // Научные степени
  scientific_degree?: string;
  // Лидерские позиции
  leadership_position?: string;
  // Государственные награды
  state_award_type?: string;
}

export interface DetailedStatistics {
  total_youth: number;
  male_count: number;
  female_count: number;
  higher_education: number;
  secondary_education: number;
  foreign_graduates: number;
  top300_graduates: number;
  top500_graduates: number;
  technical_staff: number;
  service_staff: number;
  promoted_youth: number;
  language_cert_total: number;
  ielts_count: number;
  cefr_count: number;
  topik_count: number;
  scientific_degree_total: number;
  phd_count: number;
  dsc_count: number;
  candidate_count: number;
  young_leaders_total: number;
  directors_count: number;
  heads_count: number;
  managers_count: number;
  state_awards_total: number;
  orders_count: number;
  medals_count: number;
  honorary_count: number;
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  moderators: number;
  users: number;
}

/**
 * Получить список всех пользователей
 */
export const getAllUsers = async (params?: {
  role?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}): Promise<{ results: User[]; count: number }> => {
  const response = await apiClient.get('/admin/all-users/', { params });
  return response.data;
};

/**
 * Получить детальную информацию о пользователе
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get(`/admin/all-users/${id}/`);
  return response.data;
};

/**
 * Получить статистику по пользователям
 */
export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response = await apiClient.get('/admin/all-users/statistics/');
  return response.data;
};

/**
 * Обновить пользователя
 */
export const updateUser = async (id: number, data: UpdateUserData): Promise<User> => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'avatar' && value instanceof File) {
        formData.append(key, value);
      } else if (!(value instanceof File)) {
        formData.append(key, value.toString());
      }
    }
  });
  
  const response = await apiClient.patch(`/admin/all-users/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Получить детальную статистику из реальных данных
 */
export const getDetailedStatistics = async (): Promise<DetailedStatistics> => {
  const response = await apiClient.get('/admin/all-users/detailed_statistics/');
  return response.data;
};
