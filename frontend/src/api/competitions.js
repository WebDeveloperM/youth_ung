import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

console.log('🔧 API Base URL:', API_BASE_URL);

/**
 * Получить список конкурсов
 */
export const getCompetitionsList = async (params = {}) => {
  try {
    console.log('🏆 Загрузка конкурсов с параметрами:', params);
    
    const response = await axios.get(`${API_BASE_URL}/competitions/`, { params });
    
    console.log('✅ Конкурсы загружены:', response.data);
    
    // API возвращает paginated результат с {count, results} или просто массив
    return response.data.results || response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки конкурсов:', error);
    throw error;
  }
};

/**
 * Получить детальную информацию о конкурсе
 */
export const getCompetitionDetail = async (id) => {
  try {
    console.log(`🏆 Загрузка конкурса #${id}`);
    
    const response = await axios.get(`${API_BASE_URL}/competitions/${id}/`);
    
    console.log('✅ Конкурс загружен:', response.data);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Ошибка загрузки конкурса #${id}:`, error);
    throw error;
  }
};

