import axios from 'axios';

// API Base URL - измени на свой backend URL
const API_BASE_URL = 'http://172.20.10.2:8000/api/v1';

// Создаем инстанс axios с настройками
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // НЕ устанавливаем Content-Type по умолчанию!
  // Axios сам определит нужный тип (application/json или multipart/form-data)
});

// Интерсептор для добавления токена авторизации и правильного Content-Type
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Если НЕ FormData, устанавливаем Content-Type: application/json
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    // Если FormData - браузер сам установит правильный Content-Type с boundary
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или невалиден - редирект на логин
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

