import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.20.10.2:8000/api/v1';

console.log('🔧 API Base URL:', API_BASE_URL);

/**
 * Получить список инноваций
 */
export const getInnovationsList = async (params = {}) => {
  try {
    console.log('💡 Загрузка инноваций с параметрами:', params);
    
    const response = await axios.get(`${API_BASE_URL}/innovations/`, { params });
    
    console.log('✅ Инновации загружены:', response.data);
    
    // API возвращает paginated результат с {count, results} или просто массив
    return response.data.results || response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки инноваций:', error);
    throw error;
  }
};

/**
 * Получить детальную информацию об инновации
 */
export const getInnovationDetail = async (id) => {
  try {
    console.log(`💡 Загрузка инновации #${id}`);
    
    const response = await axios.get(`${API_BASE_URL}/innovations/${id}/`);
    
    console.log('✅ Инновация загружена:', response.data);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Ошибка загрузки инновации #${id}:`, error);
    throw error;
  }
};

