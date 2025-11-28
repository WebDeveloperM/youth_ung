import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.20.10.2:8000/api/v1';

console.log('🔧 API Base URL:', API_BASE_URL);

/**
 * Получить список стажировок
 */
export const getInternshipsList = async (params = {}) => {
  try {
    console.log('🎓 Загрузка стажировок с параметрами:', params);
    
    const response = await axios.get(`${API_BASE_URL}/internships/`, { params });
    
    console.log('✅ Стажировки загружены:', response.data);
    
    // API возвращает paginated результат с {count, results} или просто массив
    return response.data.results || response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки стажировок:', error);
    throw error;
  }
};

/**
 * Получить детальную информацию о стажировке
 */
export const getInternshipDetail = async (id) => {
  try {
    console.log(`🎓 Загрузка стажировки #${id}`);
    
    const response = await axios.get(`${API_BASE_URL}/internships/${id}/`);
    
    console.log('✅ Стажировка загружена:', response.data);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Ошибка загрузки стажировки #${id}:`, error);
    throw error;
  }
};
