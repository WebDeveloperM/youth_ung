import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

console.log('🔧 API Base URL:', API_BASE_URL);

/**
 * Создать новое обращение
 */
export const createAppeal = async (appealData) => {
  try {
    console.log('📤 Отправка обращения:', appealData);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Требуется авторизация');
    }
    
    const response = await axios.post(
      `${API_BASE_URL}/appeals/`,
      appealData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      }
    );
    
    console.log('✅ Обращение отправлено:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка отправки обращения:', error);
    console.error('❌ Response:', error.response?.data);
    throw error;
  }
};

