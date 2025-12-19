import apiClient from './client';
import { ListResponse, ListParams } from './content';

export interface Comment {
  id: number;
  author: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  content_type: string;
  object_id: number;
  likes: number;
  dislikes: number;
  is_moderated: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentModerationData {
  is_moderated?: boolean;
  is_deleted?: boolean;
  content?: string;
}

export interface CommentsParams extends ListParams {
  content_type?: string;
  is_moderated?: boolean;
  is_deleted?: boolean;
  author?: number;
  date_from?: string;
  date_to?: string;
}

export const commentsAPI = {
  // Получить список всех комментариев
  getList: async (params?: CommentsParams): Promise<ListResponse<Comment>> => {
    const response = await apiClient.get('/admin/comments/', { params });
    return response.data;
  },

  // Получить один комментарий
  getOne: async (id: number): Promise<Comment> => {
    const response = await apiClient.get(`/admin/comments/${id}/`);
    return response.data;
  },

  // Модерировать комментарий (одобрить/удалить/редактировать)
  moderate: async (id: number, data: CommentModerationData): Promise<Comment> => {
    const response = await apiClient.patch(`/admin/comments/${id}/`, data);
    return response.data;
  },

  // Удалить комментарий (soft delete)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/comments/${id}/`);
  },

  // Массовая модерация
  bulkModerate: async (ids: number[], action: 'approve' | 'delete' | 'spam'): Promise<{ success: number }> => {
    const response = await apiClient.post('/admin/comments/bulk-moderate/', {
      ids,
      action,
    });
    return response.data;
  },

  // Получить статистику комментариев
  getStats: async (): Promise<{
    total: number;
    pending_moderation: number;
    approved: number;
    deleted: number;
    today: number;
  }> => {
    const response = await apiClient.get('/admin/comments/stats/');
    return response.data;
  },
};

export default commentsAPI;


