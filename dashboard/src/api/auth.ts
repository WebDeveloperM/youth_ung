import apiClient from './client';

export interface LoginCredentials {
  login: string;  // Email или username
  password: string;
}

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
  is_superuser?: boolean;
  allowed_menus?: string[];
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export const authAPI = {
  // Вход администратора
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post('/users/sign-in/', credentials);
    // Сохраняем токен
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    return response.data;
  },

  // Выход
  logout: () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
  },

  // Получить текущего пользователя
  getCurrentUser: async (): Promise<AdminUser> => {
    const response = await apiClient.get('/users/profile/');
    return response.data;
  },

  // Алиас для совместимости
  getMe: async (): Promise<AdminUser> => {
    return authAPI.getCurrentUser();
  },

  // Проверка авторизации
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_token');
  },
};

export default authAPI;

