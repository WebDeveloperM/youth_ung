import apiClient from './client';

export interface User {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  role: 'Admin' | 'Moderator' | 'User';
  status: 'active' | 'inactive';
  date_of_birth?: string;
  gender?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
}

export interface UsersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: number;
  position: string;
  role: string;
  password: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
}

export const usersAPI = {
  // Получить список пользователей
  getUsers: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<UsersListResponse> => {
    const response = await apiClient.get('/admin/users/', { params });
    return response.data;
  },

  // Получить одного пользователя
  getUser: async (id: string | number): Promise<User> => {
    const response = await apiClient.get(`/admin/users/${id}/`);
    return response.data;
  },

  // Создать пользователя
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await apiClient.post('/admin/users/', data);
    return response.data;
  },

  // Обновить пользователя
  updateUser: async (id: string | number, data: Partial<CreateUserData>): Promise<User> => {
    const response = await apiClient.patch(`/admin/users/${id}/`, data);
    return response.data;
  },

  // Удалить пользователя
  deleteUser: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}/`);
  },

  // Изменить роль
  changeRole: async (id: string | number, role: string): Promise<User> => {
    const response = await apiClient.post(`/admin/users/${id}/change-role/`, { role });
    return response.data;
  },

  // Сбросить пароль
  resetPassword: async (id: string | number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/admin/users/${id}/reset-password/`);
    return response.data;
  },
};

export default usersAPI;

