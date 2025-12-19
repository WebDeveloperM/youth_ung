import apiClient from './client';

// Базовая структура для мультиязычного контента
export interface MultiLangText {
  uz: string;
  ru: string;
  en: string;
}

// Базовая структура для публикаций
export interface BaseContent {
  id: number;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

// НОВОСТИ
export interface News extends BaseContent {
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image: string;
  date: string;
  likes: number;
  views: number;
  is_published: boolean;
  is_featured: boolean;
}

export interface NewsFormData {
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image?: File | string;
  date: string;
  is_published?: boolean;
  is_featured?: boolean;
}

// ГРАНТЫ
export interface Grant extends BaseContent {
  title_uz: string;
  title_ru: string;
  title_en: string;
  short_description_uz: string;
  short_description_ru: string;
  short_description_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image: string;
  amount: string;
  duration: string;
  deadline: string;
  status: 'active' | 'closed' | 'upcoming';
  category: 'innovation' | 'ecology' | 'digital' | 'social';
  applicants: number;
}

// СТИПЕНДИИ
export interface Scholarship extends BaseContent {
  title_uz: string;
  title_ru: string;
  title_en: string;
  short_description_uz: string;
  short_description_ru: string;
  short_description_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image: string;
  amount: string;
  duration: string;
  deadline: string;
  status: 'active' | 'closed' | 'upcoming';
  category: 'master' | 'certification' | 'language' | 'professional';
  recipients: number;
}

// КОНКУРСЫ
export interface Competition extends BaseContent {
  title_uz: string;
  title_ru: string;
  title_en: string;
  short_description_uz: string;
  short_description_ru: string;
  short_description_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  status: 'active' | 'upcoming' | 'closed';
  category: 'professional' | 'innovation' | 'sports' | 'social';
  participants: number;
  prize: string;
}

// ИННОВАЦИИ
export interface Innovation extends BaseContent {
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image: string;
  date: string;
  likes: number;
  views: number;
  category: 'technology' | 'ecology' | 'digital';
  is_featured: boolean;
}

// СТАЖИРОВКИ
export interface Internship extends BaseContent {
  title_uz: string;
  title_ru: string;
  title_en: string;
  short_description_uz: string;
  short_description_ru: string;
  short_description_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image: string;
  stipend: string;
  duration: string;
  deadline: string;
  start_date: string;
  status: 'active' | 'closed' | 'upcoming';
  category: 'summer' | 'international' | 'technical';
  applicants: number;
  positions: number;
}

// ВАКАНСИИ
export interface Job extends BaseContent {
  title_uz: string;
  title_ru: string;
  title_en: string;
  short_description_uz: string;
  short_description_ru: string;
  short_description_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  image: string;
  salary: string;
  location: string;
  type: string;
  experience: string;
  deadline: string;
  status: 'active' | 'closed' | 'paused';
  category: 'it' | 'engineering' | 'hr' | 'marketing' | 'finance';
  employment_type: 'full-time' | 'part-time' | 'contract' | 'intern';
  applicants: number;
  positions: number;
}

// КОМАНДА
export interface TeamMember extends BaseContent {
  name_uz: string;
  name_ru: string;
  name_en: string;
  position_uz: string;
  position_ru: string;
  position_en: string;
  bio_uz: string;
  bio_ru: string;
  bio_en: string;
  category: 'leadership' | 'innovation' | 'education' | 'media' | 'sports';
  photo: string;
  email: string;
  phone: string;
  linkedin: string;
  telegram: string;
  order: number;
  is_active: boolean;
}

// MAQOLALAR (ARTICLES)
export interface Article extends BaseContent {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  abstract_uz: string;
  abstract_ru: string;
  abstract_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  keywords_uz: string;
  keywords_ru: string;
  keywords_en: string;
  category: 'international' | 'local' | 'scientific' | 'analytical' | 'practical';
  cover_image?: string;
  pdf_file?: string;
  doi?: string;
  publication_date?: string;
  author: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  is_published: boolean;
  is_featured: boolean;
  views: number;
  downloads: number;
  likes: number;
  admin_comment?: string;
  approved_by?: number;
  approved_at?: string;
}

export interface ArticleFormData {
  title_uz: string;
  title_ru?: string;
  title_en?: string;
  abstract_uz: string;
  abstract_ru?: string;
  abstract_en?: string;
  content_uz: string;
  content_ru?: string;
  content_en?: string;
  keywords_uz?: string;
  keywords_ru?: string;
  keywords_en?: string;
  category: string;
  cover_image?: File | string;
  pdf_file?: File | string;
  doi?: string;
  publication_date?: string;
  status?: string;
  is_published?: boolean;
  is_featured?: boolean;
  admin_comment?: string;
}

// Общий интерфейс для ответа со списком
export interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Параметры для запросов списков
export interface ListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: any;
}

// Универсальная функция для создания CRUD операций
function createCRUDAPI<T, CreateData = Partial<T>>(endpoint: string) {
  return {
    getList: async (params?: ListParams): Promise<ListResponse<T>> => {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    },

    getOne: async (id: number): Promise<T> => {
      const response = await apiClient.get(`${endpoint}${id}/`);
      return response.data;
    },

    create: async (data: CreateData): Promise<T> => {
      // Если есть файлы, отправляем как FormData
      const hasFiles = Object.values(data as any).some(v => v instanceof File);
      
      console.log('🔍 API CLIENT - CREATE:', { endpoint, hasFiles, data });
      
      if (hasFiles) {
        const formData = new FormData();
        Object.entries(data as any).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Для boolean значений отправляем как строку 'true'/'false'
            if (typeof value === 'boolean') {
              formData.append(key, value ? 'true' : 'false');
            } else {
              formData.append(key, value);
            }
            console.log(`  📤 FormData.append("${key}", ${typeof value === 'object' && value instanceof File ? '[File]' : value})`);
          }
        });
        
        console.log('📤 ОТПРАВКА FormData с файлом...');
        console.log('📍 Endpoint:', endpoint);
        console.log('📍 Full URL:', apiClient.defaults.baseURL + endpoint);
        console.log('🔑 Has Token:', !!localStorage.getItem('admin_token'));
        
        try {
          // НЕ устанавливаем Content-Type - браузер сам добавит multipart/form-data с boundary!
          const response = await apiClient.post(endpoint, formData);
          console.log('✅ ОТВЕТ:', response.data);
          return response.data;
        } catch (error: any) {
          console.error('❌ ОШИБКА ПРИ ОТПРАВКЕ:', error);
          console.error('❌ Config:', error.config);
          console.error('❌ Response:', error.response);
          throw error;
        }
      }
      
      console.log('📤 ОТПРАВКА JSON без файла...');
      const response = await apiClient.post(endpoint, data);
      console.log('✅ ОТВЕТ:', response.data);
      return response.data;
    },

    update: async (id: number, data: Partial<CreateData>): Promise<T> => {
      const hasFiles = Object.values(data as any).some(v => v instanceof File);
      
      if (hasFiles) {
        const formData = new FormData();
        Object.entries(data as any).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        // НЕ устанавливаем Content-Type - браузер сам добавит multipart/form-data с boundary!
        const response = await apiClient.patch(`${endpoint}${id}/`, formData);
        return response.data;
      }
      
      const response = await apiClient.patch(`${endpoint}${id}/`, data);
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`${endpoint}${id}/`);
    },
  };
}

// Экспортируем API для каждого типа контента
export const newsAPI = createCRUDAPI<News, NewsFormData>('/admin/news/');
export const grantsAPI = createCRUDAPI<Grant>('/admin/grants/');
export const scholarshipsAPI = createCRUDAPI<Scholarship>('/admin/scholarships/');
export const competitionsAPI = createCRUDAPI<Competition>('/admin/competitions/');
export const innovationsAPI = createCRUDAPI<Innovation>('/admin/innovations/');
export const internshipsAPI = createCRUDAPI<Internship>('/admin/internships/');
export const jobsAPI = createCRUDAPI<Job>('/admin/jobs/');
export const teamAPI = createCRUDAPI<TeamMember>('/admin/team/');

// Articles API with additional approval methods
const baseArticlesAPI = createCRUDAPI<Article, ArticleFormData>('/admin/articles/');

export const articlesAPI = {
  ...baseArticlesAPI,
  // Approve article
  approve: async (id: number, data: { admin_comment?: string }): Promise<Article> => {
    const response = await apiClient.post(`/admin/articles/${id}/approve/`, data);
    return response.data;
  },
  // Reject article
  reject: async (id: number, data: { admin_comment: string }): Promise<Article> => {
    const response = await apiClient.post(`/admin/articles/${id}/reject/`, data);
    return response.data;
  },
  // Request revision
  requestRevision: async (id: number, data: { admin_comment: string }): Promise<Article> => {
    const response = await apiClient.post(`/admin/articles/${id}/request_revision/`, data);
    return response.data;
  },
  // Get statistics
  getStats: async (): Promise<any> => {
    const response = await apiClient.get('/admin/articles/stats/');
    return response.data;
  },
};

// ТЕХНОЛОГИИ API
const technologiesAPI = {
  getList: () => apiClient.get('/admin/technologies/'),
  getOne: (id: number) => apiClient.get(`/admin/technologies/${id}/`),
  create: (data: any) => apiClient.post('/admin/technologies/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: any) => apiClient.patch(`/admin/technologies/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => apiClient.delete(`/admin/technologies/${id}/`),
};

// ПРОЕКТЫ API
const projectsAPI = {
  getList: () => apiClient.get('/admin/projects/'),
  getOne: (id: number) => apiClient.get(`/admin/projects/${id}/`),
  create: (data: any) => apiClient.post('/admin/projects/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: any) => apiClient.patch(`/admin/projects/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => apiClient.delete(`/admin/projects/${id}/`),
};

// ИССЛЕДОВАНИЯ API
const researchAPI = {
  getList: () => apiClient.get('/admin/research/'),
  getOne: (id: number) => apiClient.get(`/admin/research/${id}/`),
  create: (data: any) => apiClient.post('/admin/research/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: any) => apiClient.patch(`/admin/research/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => apiClient.delete(`/admin/research/${id}/`),
};

// РЕЗУЛЬТАТЫ API
const resultsAPI = {
  getList: () => apiClient.get('/admin/results/'),
  getOne: (id: number) => apiClient.get(`/admin/results/${id}/`),
  create: (data: any) => apiClient.post('/admin/results/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: any) => apiClient.patch(`/admin/results/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => apiClient.delete(`/admin/results/${id}/`),
};

// Экспортируем все вместе
export const contentAPI = {
  news: newsAPI,
  grants: grantsAPI,
  scholarships: scholarshipsAPI,
  competitions: competitionsAPI,
  innovations: innovationsAPI,
  internships: internshipsAPI,
  jobs: jobsAPI,
  team: teamAPI,
  technologies: technologiesAPI,
  projects: projectsAPI,
  research: researchAPI,
  results: resultsAPI,
};

export default contentAPI;

