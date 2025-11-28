import { apiClient } from './client';

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'Admin' | 'Moderator';
  allowed_menus: string[];
  is_active: boolean;
  phone?: string;
  organization?: number;
  position?: string;
  avatar?: string;
  date_joined?: string;
  last_login?: string;
}

export interface MenuItem {
  key: string;
  label: string;
}

export interface CreateAdminData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  role: 'Admin' | 'Moderator';
  allowed_menus: string[];
  phone: string;
  organization: number;
  position: string;
}

export interface UpdateAdminData {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  role?: 'Admin' | 'Moderator';
  allowed_menus?: string[];
  is_active?: boolean;
  phone?: string;
  organization?: number;
  position?: string;
}

export const adminsAPI = {
  /**
   * Получить список всех администраторов
   */
  async getAll(): Promise<AdminUser[]> {
    const response = await apiClient.get('/admin/admins/');
    return response.data;
  },

  /**
   * Получить информацию об одном администраторе
   */
  async getOne(id: number): Promise<AdminUser> {
    const response = await apiClient.get(`/admin/admins/${id}/`);
    return response.data;
  },

  /**
   * Создать нового администратора
   */
  async create(data: CreateAdminData): Promise<AdminUser> {
    console.log('📝 Создание администратора:', data);
    const response = await apiClient.post('/admin/admins/', data);
    console.log('✅ Администратор создан:', response.data);
    return response.data;
  },

  /**
   * Обновить администратора
   */
  async update(id: number, data: UpdateAdminData): Promise<AdminUser> {
    console.log('📝 Обновление администратора:', id, data);
    const response = await apiClient.patch(`/admin/admins/${id}/`, data);
    console.log('✅ Администратор обновлен:', response.data);
    return response.data;
  },

  /**
   * Удалить (деактивировать) администратора
   */
  async delete(id: number): Promise<void> {
    console.log('🗑️ Удаление администратора:', id);
    await apiClient.delete(`/admin/admins/${id}/`);
    console.log('✅ Администратор удален');
  },

  /**
   * Получить список доступных меню для настройки прав
   */
  async getMenuOptions(): Promise<MenuItem[]> {
    const response = await apiClient.get('/admin/admins/menu_options/');
    return response.data;
  },
};

