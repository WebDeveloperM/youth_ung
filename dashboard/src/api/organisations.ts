import { apiClient } from './client';

export interface Organisation {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string | null;
  avatar: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  employees_count?: number;
}

export interface OrganisationStatistics {
  total_organisations: number;
  organisations_with_employees: number;
  organisations_without_employees: number;
  total_employees: number;
}

export interface OrganisationsListResponse {
  results: Organisation[];
  count: number;
  next: string | null;
  previous: string | null;
}

/**
 * Получить список всех организаций
 */
export const getAllOrganisations = async (params?: {
  search?: string;
  ordering?: string;
  page?: number;
}): Promise<OrganisationsListResponse> => {
  const response = await apiClient.get('/organisations/admin/organisations/', { params });
  return response.data;
};

/**
 * Получить детальную информацию об организации
 */
export const getOrganisationById = async (id: number): Promise<Organisation> => {
  const response = await apiClient.get(`/organisations/admin/organisations/${id}/`);
  return response.data;
};

/**
 * Создать новую организацию
 */
export const createOrganisation = async (data: FormData): Promise<Organisation> => {
  const response = await apiClient.post('/organisations/admin/organisations/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Обновить организацию
 */
export const updateOrganisation = async (id: number, data: FormData): Promise<Organisation> => {
  const response = await apiClient.put(`/organisations/admin/organisations/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Удалить организацию
 */
export const deleteOrganisation = async (id: number): Promise<void> => {
  await apiClient.delete(`/organisations/admin/organisations/${id}/`);
};

/**
 * Получить статистику по организациям
 */
export const getOrganisationStatistics = async (): Promise<OrganisationStatistics> => {
  const response = await apiClient.get('/organisations/admin/organisations/statistics/');
  return response.data;
};

/**
 * Получить список организаций (публичный API для форм регистрации)
 */
export const getOrganisationsList = async (): Promise<OrganisationsListResponse> => {
  const response = await apiClient.get('/organisations/public/organisations/');
  return response.data;
};


